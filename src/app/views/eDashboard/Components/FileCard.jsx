import React, { useEffect } from "react";
import { Grid } from "@mui/material";

import CircularGaugeCard from "./counterCard/CircularGaugeCard";
import { connect, useDispatch } from "react-redux";
import { getDashboardCount } from "app/camunda_redux/redux/action";
import { useState } from "react";
import { handleError } from "utils";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import axios from "axios";

const FileCard = (props) => {

  const { t } = useTranslation()

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [dak, setDak] = useState({
    total: 0
  });
  const [file, setFile] = useState({
    total: 0
  });
  const [actionPoint, setActionPoint] = useState({
    total: 0
  });

  const info = {
    Dak: {
      first: 3,
      second: 4,
      third: 2,
      total: 9,
    },
    File: {
      first: 5,
      second: 4,
      third: 1,
      total: 10,
    },
    actionPoint: {
      first: 3,
      second: 2,
      third: 7,
      total: 12,
    },
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const getDashboardData = () => {
    setLoading(true);
    props
      .getDashboardCount()
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
            let dak = {
              total: resp?.response?.noOfDaks,
              pending: resp?.response?.noOfPendingDaks,
              external: resp?.response?.noOfExternalDaks,
              today: resp?.response?.noOfTodayDaks,
              link: "/eoffice/inbox/file",
              chip: "Dak"
            };
            let file = {
              total: resp?.response?.noOfFiles,
              pending: resp?.response?.noOfPendingFiles,
              external: resp?.response?.noOfExternalFiles,
              today: resp?.response?.noOfTodayFiles,
              link: "/eoffice/inbox/file",
              chip: "File"
            };

            axios
              .get("/actionPoint/api/actionCount", {
                headers: {
                  "Content-Type": "application/json; charset=utf8",
                  Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
                  roleName: sessionStorage.getItem("role")
                },
              })

              .then((resp) => {
                try {
                  if (!resp.error) {
                    let actionPoint = {
                      total: resp.data.open + resp.data.closed,
                      pending: resp.data.closed,
                      external: resp.data.open,
                      today: resp.data.assignedToMe,
                      link: "/eoffice/actionpoint",
                    };
                    setActionPoint(actionPoint);
                    setLoading(false);
                  } else {
                    const errorMessage =
                      resp.status + " : " + resp.error + " AT " + resp.path;
                    callMessageOut(errorMessage);
                    setLoading(false);
                  }
                } catch (e) {
                  callMessageOut(e.message);
                  setLoading(false);
                }
              })
              .catch((error) => {
                callMessageOut(error.message);
                setLoading(false);
              });
            setDak(dak);
            setFile(file);
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <CircularGaugeCard info={dak} name={t("daks")} />
        </Grid>
        <Grid item xs={12} md={4}>
          <CircularGaugeCard info={file} name={t("file(s)")} />
          {/* </Box> */}
        </Grid>

        <Grid item xs={12} md={4}>
          <CircularGaugeCard info={actionPoint} name={t("action_points")} />
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
  getDashboardCount,
})(FileCard);
