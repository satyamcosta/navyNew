import React, { useEffect } from "react";
import FileCard from "./FileCard";
import { Grid } from "@material-ui/core";
import EventTable from "./Table/EventTable";
import MonitorTable from "./Table/MonitorTable";
import Inward from "./counterCard/Inward";
import Outward from "./counterCard/Outward";
import { getLast5Days } from "app/camunda_redux/redux/action";
import { Loading } from "../therme-source/material-ui/loading";
import { connect, useDispatch } from "react-redux";
import { useState } from "react";
import { handleError } from "utils";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const EDashboardLayout = (props) => {
  const dispatch = useDispatch();
  const [last5DaysArr, setLast5DaysArr] = useState({
    inwards: [0, 0, 0, 0, 0],
    outwards: [0, 0, 0, 0, 0],
  });
  const [loading, setLoading] = useState(false);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("dashboard-table");
    adjustableDiv.style.height = viewportHeight - 325.83 + "px";
  }

  useEffect(() => {
    // adjustDivHeight();
    // window.addEventListener("resize", adjustDivHeight);
    // return () => {
    //   window.removeEventListener("resize", adjustDivHeight);
    // };
  }, []);

  useEffect(() => {
    getLast5Days();
  }, []);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const getLast5Days = () => {
    setLoading(true);
    props
      .getLast5Days()
      .then((resp) => {
        try {
          if (resp.error) {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setLoading(false);
          } else {
            setLast5DaysArr(resp?.response);
            setLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setLoading(false);
      });
  };

  return (
    <>
      {loading && <Loading />}
      <FileCard />
      <Grid container spacing={2} id="dashboard-table">
        <Grid item xs={12} md={7}>
          <MonitorTable />
        </Grid>
        <Grid item xs={12} md={5}>
          <EventTable />
        </Grid>
        <Grid container item xs={12} spacing={2} justifyContent="space-between">
          <Grid item xs={12} md={6}>
            <Inward count={last5DaysArr.inwards} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Outward count={last5DaysArr.outwards} />
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    openDraftPa: state.openDraftPa,
    myInfo: state.myInfo,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  getLast5Days,
})(EDashboardLayout);
