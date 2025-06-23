import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useContext, useState } from "react";
import { markCompletedByAssignmentId } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import CloseIcon from "@material-ui/icons/Close";
import { ActionContext } from "app/views/ActionPoints/ContextApi/ActionContext";
import CancelIcon from "@material-ui/icons/Cancel";
import { Rating, Stack } from "@mui/material";

const MarkCompletedComp = (props) => {
  const {
    markCompletedhandleClose,
    getAllTaskData,
    rowData,
    markCompleteId,
    handleMarkComplete,
    pazeSize,
    currentPage,
  } = useContext(ActionContext);
  console.log(pazeSize);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [ratingValue, setRatingValue] = useState(2); //rating value

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const searchValue = sessionStorage.getItem("role");
  let data = [];
  const markCompletedFun = () => {
    let isValuePresent = false;

    for (let i = 0; i < markCompleteId?.markCompleteobj?.length; i++) {
      if (markCompleteId?.markCompleteobj[i].from === searchValue) {
        data.push(markCompleteId?.markCompleteobj[i].assignmentId);
        isValuePresent = true;
      }
    }
    if (!isValuePresent) {
      callMessageOut(
        "Only tasks that you have personally created can be completed"
      );
    } else {
      props
        .markCompletedByAssignmentId(
          data,
          true,
          searchValue,
          pazeSize,
          currentPage,
          ratingValue
        )
        .then((res) => {
          try {
            if (res.error) {
              callMessageOut(res.error);
            } else {
              const filterData = rowData.filter((item) => {
                return item.id !== res.response.id;
              });

              handleMarkComplete(filterData);
              dispatch(
                setSnackbar(
                  true,
                  "success",
                  `${t("task_completed_successfully")} !`
                )
              );
              getAllTaskData();
            }
          } catch (error) {
            callMessageOut(error.error);
          }
        })
        .catch((err) => {
          callMessageOut(err.error);
        });
    }
  };

  return (
    <div>
      <DialogTitle
        id="draggable-dialog-title"
        style={{ cursor: "move" }}
        className="send_dialog"
      >
        {t("MARK COMPLETED")}
        <Tooltip title={t("cancel")}>
          <IconButton
            id="MARK COMPLETED"
            aria-label="close"
            onClick={markCompletedhandleClose}
            color="primary"
            className="cancel-drag"
          >
            <CancelIcon
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        <DialogContentText>
          <Typography variant="h6" gutterBottom>
            {t("are_you_sure_you_want_to_complete_this_task")}
          </Typography>
          <Stack sx={{ pl: "6rem" }}>
            {/* <Typography component="legend">Rating</Typography> */}
            {/* <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
              }}
            /> */}
          </Stack>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          // className="resetButton"
          color="primary"
          style={{ width: "100px" }}
          onClick={markCompletedhandleClose}
        >
          {t("no")}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          // className="submitButton"
          style={{ width: "100px" }}
          onClick={() => {
            markCompletedFun();
            markCompletedhandleClose();
          }}
        >
          {t("yes")}
        </Button>
      </DialogActions>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, { markCompletedByAssignmentId })(
  MarkCompletedComp
);
