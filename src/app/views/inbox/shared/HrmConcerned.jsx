import React, { useContext, useEffect } from "react";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import PdfViewer from "../../../pdfViewer/pdfViewer";
import FileListTable from "./FileListTable";
import { Breadcrumb } from "../../../../matx";
import { connect } from "react-redux";
import { useState } from "react";
import { Loading } from "../therme-source/material-ui/loading";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useLocation } from "react-router-dom";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { setInboxDatas } from "app/redux/actions/InboxActions";
import history from "../../../../history";

const useStyles = makeStyles((theme) => ({
  btnWrapper: {
    display: "flex",
    position: "absolute",
    top: "1px",
    right: "20px",
  },
}));

const HrmConcerned = (props) => {
  const classes = useStyles();
  const { state } = useLocation();
  const { from, id, rowData, fileNo, routeQueryParams } = state;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  let title = Cookies.get("inboxFile");
  let priority = Cookies.get("priority");
  let referenceNumber = Cookies.get("referenceNumber");

  let fromNotification = from === "notification";

  const [annotId, setAnnotId] = useState("");
  const [blnShowPDF, setBlnShowPDF] = useState(false);
  const [loading, setLoading] = useState(false);
  const [contentId, setContentId] = useState("");
  const [flag, setFlag] = useState("");
  const [pdfLoads, setPdfLoads] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  const callMessageOut = (message) => {
    // props.handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleShowPdf = (val) => {
    setBlnShowPDF(val);
  };

  const handleContentID = (val) => {
    setContentId(val);
  };
  const annotation = (val) => {
    setAnnotId(val);
  };

  const handleOnRowDoubleClick = (rowItem) => {
    sessionStorage.removeItem("InboxIDS");
    props.setInboxDatas(rowItem);
    if (
      rowItem.personalApplicationInventoryId !== undefined &&
      rowItem.personalApplicationInventoryId !== ""
    ) {
      sessionStorage.setItem("InboxID", rowItem.id);
      sessionStorage.setItem("pa_id", rowItem.personalApplicationInventoryId);
      sessionStorage.setItem("partcaseID", rowItem?.partCase);
      Cookies.set("inboxFile", rowItem.subject);
      Cookies.set("priority", rowItem.priority);
      Cookies.set("referenceNumber", rowItem.referenceNumber);
      Cookies.set("type", rowItem.type);
      Cookies.set("partCase", false);
      Cookies.set("status", rowItem.statuss);
      Cookies.set("backPath", "/eoffice/inbox/file");

      if (rowItem.type === "RTI") {
        Cookies.set("isRti", true);
        Cookies.set("partcaseId", rowItem.partCase);
      }

      rowItem.deciderType > 4
        ? history.push({
            pathname: "/eoffice/splitView/correspondence",
            state: {
              from: "hrmConcerned",
              id: rowItem.id,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.type === "PA"
        ? history.push({
            pathname: "/eoffice/hrmConcernedView/file",
            state: {
              from: "hrmConcerned",
              id: rowItem.id,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.type === "File"
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: {
              from: "hrmConcerned",
              data: rowItem.subject,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.type === "RTI"
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: {
              from: "hrmConcerned",
              data: rowItem.partcase,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.pcCoverNote === true
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: {
              from: "hrmConcerned",
              id: rowItem.id,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : history.push({
            pathname: "/eoffice/hrmConcernedView/file",
            state: {
              from: "hrmConcerned",
              id: rowItem.id,
              rowData,
              fileNo: rowItem.serialNo,
            },
          });
    } else {
      const errorMessage = `${t("ID_is_undefined_please_refresh_page")} !`;
      callMessageOut(errorMessage);
    }
  };

  const handleNextApp = () => {
    if (fileNo === 1 && rowData.length === 1) {
      return;
    } else {
      let newIndex = (fileNo + 1) % rowData?.length;
      if (newIndex == 0) {
        let rowItem = rowData?.find(
          (item) => item?.serialNo === rowData?.length
        );
        if (rowItem) {
          handleOnRowDoubleClick(rowItem);
        }
      } else {
        let rowItem = rowData?.find((item) => item?.serialNo === newIndex);
        if (rowItem) {
          handleOnRowDoubleClick(rowItem);
        }
      }
    }
  };

  const handlePrevApp = () => {
    if (fileNo === 1 && rowData.length === 1) {
      return;
    } else {
      let newIndex = fileNo - 1;
      if (newIndex == 0) {
        let rowItem = rowData?.find(
          (item) => item?.serialNo === rowData?.length
        );
        handleOnRowDoubleClick(rowItem);
      } else {
        let rowItem = rowData?.find((item) => item?.serialNo === newIndex);
        handleOnRowDoubleClick(rowItem);
      }
    }
  };

  return (
    <>
      {loading && <Loading />}
      <div
        style={{
          padding: "1px 0",
          margin: "2px 10px 0px 10px",
          position: "relative",
        }}
      >
        <div>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={12}>
              <Breadcrumb
                routeSegments={[
                  {
                    name: t("inbox"),
                    path: `/eoffice/inbox/file${
                      routeQueryParams ? routeQueryParams : ""
                    }`,
                  },
                  {
                    name: t("pa"),
                    path: "/eoffice/hrmConcernedView/file",
                  },
                ]}
                otherData={[
                  { key: t("title"), value: title?.toUpperCase() },
                  { key: t("ref_no"), value: referenceNumber?.toUpperCase() },
                  { key: t("priority"), value: priority?.toUpperCase() },
                ]}
              />
            </Grid>
          </Grid>
        </div>

        {/**!fromNotification && (
          <Box className={classes.btnWrapper}>
            <Tooltip title="PREVIOUS">
              <IconButton
                onClick={handlePrevApp}
                size="small"
                disabled={rowData?.length === 1}
                aria-label="previous-app"
              >
                <ChevronLeft />
              </IconButton>
            </Tooltip>
            <Tooltip title="NEXT">
              <IconButton
                onClick={handleNextApp}
                size="small"
                disabled={rowData?.length === 1}
                aria-label="next-app"
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>
          </Box>
        )*/}

        <SplitterComponent
          style={{ height: "100%" }}
          orientation={width <= 750 ? "Vertical" : "Horizontal"}
        >
          <div style={{ width: width <= 750 ? "100%" : "70%" }}>
            {blnShowPDF && (
              <div
                style={{
                  border: "1px solid #b6b6b66b",
                  height: "calc(100vh - 100px)",
                }}
                className="ss-privacy-hide"
              >
                <PdfViewer
                  personalID={contentId}
                  anottId={annotId}
                  flag={flag}
                  pdfLoads={(val) => {
                    setPdfLoads(val);
                  }}
                  editable={false}
                />
              </div>
            )}
          </div>
          <div
            style={{ width: width <= 750 ? "100%" : "30%", overflow: "hidden" }}
          >
            <div style={{ margin: "auto" }}>
              <FileListTable
                pdfLoadsHRM={pdfLoads}
                annotID={annotation}
                flagValue={(val) => setFlag(val)}
                contentID={handleContentID}
                fileID={title}
                blnShowPdf={handleShowPdf}
                blnEnableLoader={(val) => setLoading(val)}
                paId={id}
              />
            </div>
          </div>
        </SplitterComponent>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  setInboxDatas,
})(HrmConcerned);
