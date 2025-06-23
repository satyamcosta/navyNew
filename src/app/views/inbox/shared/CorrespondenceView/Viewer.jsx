import React, { useContext, useEffect, useState } from "react";
import { Loading } from "../../therme-source/material-ui/loading";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  Paper,
  DialogContent,
  Grid,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { useLocation } from "react-router-dom";
import ImportDak from "./ImportDak";
import Note from "./Note";
import Annexures from "./Annexures";
import References from "./References";
import { CorrContext } from "./Worker";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import history from "../../../../../history";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { connect, useDispatch } from "react-redux";
import { setInboxDatas } from "app/redux/actions/InboxActions";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const useStyles = makeStyles((theme) => ({
  btnWrapper: {
    display: "flex",
    position: "absolute",
    top: "1px",
    right: "20px",
  },
}));

import { Cancel } from "@material-ui/icons";
import Draggable from "react-draggable";
import ImportRepo from "./ImportRepo";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const Viewer = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { readOnly } = props;
  const { t } = useTranslation();
  const { state, search } = useLocation();

  const { from, id, rowData, fileNo, routeQueryParams } = state;

  let title = Cookies.get("inboxFile");
  let priority = Cookies.get("priority");
  let referenceNumber = Cookies.get("referenceNumber");
  const isCorr = Cookies.get("isCorr") == "true";
  const preview = Cookies.get("preview") == "true";
  let isOutbox = Cookies.get("isOutbox");

  let fromNotification = "notification";

  const [route, setRoute] = useState([]);

  const viewerData = useContext(CorrContext);

  const {
    tabIndex,
    annexureList,
    referenceList,
    loading,
    settabIndex,
    classification,
    handleTabChange,
    indexFile,
    openRepo,
    setOpenRepo,
    dakType,
  } = viewerData;

  const callMessageOut = (message) => {
    // props.handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    let StoredRoute = JSON.parse(sessionStorage.getItem("route"));
    let newRoute = StoredRoute?.join(" -> ")?.split(" ");
    if (newRoute?.length) {
      setRoute(newRoute);
    }
  }, []);

  console.log(route)

  // inbox routing
  const handleOnRowDoubleClick = (rowItem) => {
    sessionStorage.removeItem("InboxIDS");
    props.setInboxDatas(rowItem);
    if (
      rowItem?.personalApplicationInventoryId !== undefined &&
      rowItem?.personalApplicationInventoryId !== ""
    ) {
      sessionStorage.setItem("InboxID", rowItem.id);
      sessionStorage.setItem("pa_id", rowItem.personalApplicationInventoryId);
      sessionStorage.setItem("partcaseID", rowItem?.partCase);
      Cookies.set("cabinetpartcase", rowItem?.partCase);
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
              from: "inbox",
              id: rowItem.id,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.type === "PA"
        ? history.push({
            pathname: "/eoffice/hrmConcernedView/file",
            state: {
              from: "inbox",
              id: rowItem.id,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.type === "File"
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: {
              from: "inbox",
              data: rowItem.subject,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.type === "RTI"
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: {
              from: "inbox",
              data: rowItem.partcase,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : rowItem.pcCoverNote === true
        ? history.push({
            pathname: "/eoffice/splitView/file",
            state: {
              from: "inbox",
              id: rowItem.id,
              rowData,
              fileNo: rowItem.serialNo,
            },
          })
        : history.push({
            pathname: "/eoffice/hrmConcernedView/file",
            state: {
              from: "inbox",
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

  // outbox routing
  const outRedirect = (rowItem) => {
    Cookies.set("paFileId", rowItem.id);
    if (rowItem.type === "PA" || rowItem.type === "Service Letter") {
      history.push({
        pathname: "/eoffice/outbox/file",
        state: {
          from: "outbox",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
        },
      });
    } else if (rowItem.type === "RTI") {
      Cookies.set("isRti", true);
      Cookies.set("isRegister", rowItem.partcaseId);
      Cookies.set("Rtioutbox", true);
      Cookies.set("backPath", "/eoffice/outbox/file");
      history.push({
        pathname: "/eoffice/splitView/file",
        state: {
          from: "outbox",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
        },
      });
    } else {
      reDirectToSplitview(rowItem);
    }

    if (rowItem.type === "PA" || rowItem.type === "Service Letter") {
      history.push({
        pathname: "/eoffice/outbox/file",
        state: {
          from: "outbox",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
        },
      });
    }
  };

  const reDirectToSplitview = (rowItem) => {
    if (rowItem.type != "File") {
      sessionStorage.setItem("InboxID", rowItem.inboxId);
      sessionStorage.setItem("pa_id", rowItem.personalApplicationInventoryId);
      sessionStorage.setItem("partcaseID", rowItem?.partCase);
      Cookies.set("inboxFile", rowItem.subject);
      Cookies.set("priority", rowItem.priority);
      Cookies.set("referenceNumber", rowItem.referenceNumber);
      Cookies.set("type", rowItem.type);
      Cookies.set("partCase", false);
      Cookies.set("status", rowItem.statuss);
      Cookies.set("backPath", "/eoffice/outbox/file");
      Cookies.set("outboxCorr", true);
      history.push({
        pathname: "/eoffice/splitView/correspondence",
        state: {
          from: "outbox",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
        },
      });
    } else {
      Cookies.set("outboxId", rowItem.id);
      Cookies.set("isOutbox", true);
      Cookies.set("inboxFile", rowItem.subject);
      Cookies.set("priority", rowItem.priority);
      Cookies.set("referenceNumber", rowItem.fileName);
      Cookies.set("backPath", "/eoffice/outbox/file");
      history.push({
        pathname: "/eoffice/splitView/file",
        state: {
          from: "outbox",
          data: rowItem.subject,
          rowData,
          fileNo: rowItem.serialNo,
        },
      });
    }
  };

  const handleNextApp = () => {
    if (fileNo === 1 && rowData?.length === 1) {
      return;
    } else {
      let newIndex = (fileNo + 1) % rowData?.length;
      let rowItem;
      if (newIndex == 0) {
        rowItem = rowData?.find((item) => item?.serialNo === rowData?.length);
      } else {
        rowItem = rowData?.find((item) => item?.serialNo === newIndex);
      }
      if (rowItem && from === "outbox") {
        outRedirect(rowItem);
      } else if (rowItem && from === "inbox") {
        handleOnRowDoubleClick(rowItem);
      }
    }
  };

  const handlePrevApp = () => {
    if (fileNo === 1 && rowData.length === 1) {
      return;
    } else {
      let newIndex = fileNo - 1;
      let rowItem;
      if (newIndex == 0) {
        rowItem = rowData?.find((item) => item?.serialNo === rowData?.length);
      } else {
        rowItem = rowData?.find((item) => item?.serialNo === newIndex);
      }
      if (rowItem && from === "outbox") {
        outRedirect(rowItem);
      } else if (rowItem && from === "inbox") {
        handleOnRowDoubleClick(rowItem);
      }
    }
  };

  const handleChange = (index) => {
    handleTabChange();
    settabIndex(index);
  };
  return (
    <>
      <div
        style={{
          padding: "1px 0",
          margin: "2px 10px 0px 10px",
          position: "relative",
        }}
      >
        {loading && <Loading />}

        {!isCorr && (
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ paddingBottom: "3px" }}>
              <Breadcrumb
                routeSegments={
                  preview || readOnly
                    ? []
                    : [
                        // { name: t("inbox"), path: "/eoffice/inbox/file" },
                        {
                          name: isOutbox === "true" ? t("outbox") : t("inbox"),
                          path: `/eoffice/${
                            isOutbox === "true" ? "outbox" : "inbox"
                          }/file${routeQueryParams ? routeQueryParams : ""}`,
                        },
                        { name: t("dak"), path: "/costa/splitView/file" },
                      ]
                }
                otherData={[
                  { key: t("subject"), value: title?.toUpperCase() },
                  { key: t("ref_no"), value: referenceNumber?.toUpperCase() },
                  { key: t("priority"), value: priority?.toUpperCase() },
                  {
                    key: t("classification"),
                    value: classification?.toUpperCase(),
                  },
                  indexFile && {
                    key: t("index"),
                    value: indexFile?.toUpperCase(),
                  },
                ]}
                routeData={route}
              />
            </Grid>
          </Grid>
        )}

        {/**!fromNotification && !isCorr && (
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

        <Tabs
          selectedIndex={tabIndex}
          onSelect={(index) => handleChange(index)}
        >
          <TabList className="inbox-tabsList">
            <Tab style={{ borderRadius: "5px 5px 0 0", padding: "0px 8px" }}>
              {dakType?.toUpperCase() || "DAK"}
            </Tab>
            {!readOnly && (
              <>
                <Tab
                  style={{
                    borderRadius: "5px 5px 0 0",
                    padding:
                      annexureList?.length > 0 ? "0px 18px 0px 8px" : "0px 8px",
                  }}
                >
                  ANNEXURES
                  {annexureList?.length > 0 ? (
                    <span className="annexure-badge">
                      {annexureList?.length}
                    </span>
                  ) : null}
                </Tab>
                <Tab
                  style={{
                    borderRadius: "5px 5px 0 0",
                    padding:
                      referenceList?.length > 0
                        ? "0px 18px 0px 8px"
                        : "0px 8px",
                  }}
                >
                  REFERENCES
                  {referenceList?.length > 0 ? (
                    <span className="annexure-badge">
                      {referenceList?.length}
                    </span>
                  ) : null}
                </Tab>
              </>
            )}
          </TabList>
          <TabPanel>
            <Note />
          </TabPanel>
          {!readOnly && (
            <>
              <TabPanel>
                <Annexures />
              </TabPanel>
              <TabPanel>
                <References />
              </TabPanel>
            </>
          )}
        </Tabs>

        <Dialog
          open={openRepo}
          onClose={(event, reason) => {
            if (reason === "escapeKeyDown") {
              setOpenRepo(false);
            }
          }}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
          maxWidth="md"
          id="viewone-sign"
        >
          <DialogTitle
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
            className="dialog_title"
          >
            <span>{t("import_repo")}</span>
            <IconButton
              id="Enclosure_remark_&_sign"
              aria-label="close"
              onClick={() => setOpenRepo(false)}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#000",
                }}
              />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <ImportRepo />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  setInboxDatas,
})(Viewer);
