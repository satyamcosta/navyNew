import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import useIdle from "./useIdle";
import ScheduleIcon from "@material-ui/icons/Schedule";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Icon,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import LoginPage from "LoginPage";
import Draggable from "react-draggable";
import { Close, Cancel } from "@material-ui/icons";
import { connect } from "react-redux";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const IdleHandler = (props) => {
  const [showModal, setShowModal] = useState(false);
  const [remainingTime, setRemainingTime] = useState("");

  const handleIdle = () => {
    setShowModal(true);
    setRemainingTime(30);
  };

  const { isIdle, setIsIdle } = useIdle({
    onIdle: handleIdle,
    idleTime: window.__ENV__.REACT_IDLE_TIMEOUT || 10,
  });

  useEffect(() => {
    let interval;

    if (isIdle && showModal) {
      interval = setInterval(() => {
        setRemainingTime((prevRemainingTime) =>
          prevRemainingTime > 0 ? prevRemainingTime - 1 : 0
        );
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isIdle, showModal]);

  useEffect(() => {
    if (remainingTime === 0 && showModal) {
      handleLogOut();
    }
  }, [remainingTime, showModal]);

  const handleLogOut = async () => {
    setShowModal(false);
    setIsIdle(false);
    const data = JSON.stringify({
      refresh_token: localStorage.getItem("refresh_token"),
    });

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
    };

    const logout = await fetch("/auth/logout", {
      method: "POST",
      headers,
      body: data,
    });
    localStorage.clear();
    sessionStorage.clear();
    ReactDOM.render(<LoginPage />, document.getElementById("root"));
  };

  const handleStayLoggedIn = () => {
    setShowModal(false);
    setIsIdle(false);
  };

  function millisToMinutesAndSeconds(millis) {
    var minutes = Math.floor(millis / 60000);
    var seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
  }

  return (
    <>
      {/* handle isIdle for the modal */}

      <Dialog
        PaperComponent={PaperComponent}
        open={showModal && isIdle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="idle-dialog"
      >
        <DialogTitle id="draggable-dialog-title" className="send_dialog">
          <span>IDLE TIMEOUT WARNING</span>
          <Tooltip title="CLOSE">
            <IconButton
              aria-label="close"
              onClick={() => handleStayLoggedIn()}
              color="primary"
              className="cancel-drag"
              style={{ float: "right" }}
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers style={{ textAlign: "center" }}>
          <ScheduleIcon
            style={{
              fontSize: "4.5rem",
              color: "#FFAF38",
            }}
          />
          <Typography variant="h6">STILL WITH US ?</Typography>
          <Typography variant="body1">
            Privacy is essential, And you've been gone a while. We will log you
            out in <b>{millisToMinutesAndSeconds(remainingTime * 1000)}s </b>
            unless you confirm you're still with us.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            variant="contained"
            style={{ marginLeft: "1rem" }}
            onClick={handleLogOut}
          >
            LOGOUT
          </Button>
          <Button
            color="secondary"
            variant="contained"
            style={{ marginLeft: "1rem" }}
            onClick={handleStayLoggedIn}
          >
            STAY LOGGED IN
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps, null)(IdleHandler);
