import React, { useEffect, useState } from "react";
import "../../therme-source/material-ui/loading.css";
import { Loading } from "../../therme-source/material-ui/loading";
import "react-tabs/style/react-tabs.css";
import {
  Box,
  Button,
  Grid,
  IconButton,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { connect, useDispatch } from "react-redux";
import { useContext } from "react";
import { SplitViewContext } from "./Worker";
import BmContainer from "./BmContainer/BmContainer";
import BmProvider from "./BmContainer/Worker";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import { setInboxDatas } from "app/redux/actions/InboxActions";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import history from "../../../../../history";

const useStyles = makeStyles((theme) => ({
  btnWrapper: {
    display: "flex",
    position: "absolute",
    top: "1px",
    right: "20px",
  },
}));

const SplitView = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { state } = useLocation();
  const {
    from,
    data,
    rowData,
    fileNo,
    searchText: CabinetSearchText,
    routeQueryParams,
  } = state;

  let title = Cookies.get("inboxFile");
  let priority = Cookies.get("priority");
  let classification = Cookies.get("classification");
  let partCase = Cookies.get("partCase");
  let isInitiate = Cookies.get("isInitiate");
  let referenceNumber = Cookies.get("referenceNumber");
  let isRti = Cookies.get("isRti");
  let isCabinet = Cookies.get("isCabinet");
  let isOutbox = Cookies.get("isOutbox");
  let section = Cookies.get("section");

  const dept = sessionStorage.getItem("department");

  // console.log("check status", partCase, isRti, isCabinet);

  let fromNotification = from === "notification";

  const [routePath, setRoutePath] = useState([]);

  const [deptObj, setDeptObj] = useState(null);
  const [sectionObj, setsectionObj] = useState(null);
  const [flowRoute, setFlowRoute] = useState([])

  useEffect(() => {
    if (dept) {
      let deptArr = dept.split("-");
      setDeptObj({
        name: deptArr?.length > 1 ? deptArr[deptArr.length - 1] : deptArr[0],
        path: `/eoffice/${isInitiate
          ? "correspondence"
          : partCase == "true"
            ? "cabinet"
            : isOutbox == "true"
              ? "outbox"
              : "inbox"
          }/file`,
      });
    }
    if (section) {
      setsectionObj({
        name: section,
        path: `/eoffice/${isInitiate
          ? "correspondence"
          : partCase == "true"
            ? "cabinet"
            : isOutbox == "true"
              ? "outbox"
              : "inbox"
          }/file`,
      });
    }
  }, [dept, section]);

  const callMessageOut = (message) => {
    // props.handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const { tabIndex, loading, settabIndex, route, pendingRoute,
    completedRoute } =
    useContext(SplitViewContext);

  useEffect(() => {
    if (route.length) {
      let newRoute = route?.join(" -> ")?.split(" ");
      if (newRoute?.length) {
        setRoutePath(newRoute);
      }
    }
  }, [route]);

  // inbox Routing
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
                    data: rowItem.id,
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

  // cabinet routing
  const cabRedirect = (rowItem) => {
    if (rowItem.indexFile) {
      Cookies.set("corrIndex", rowItem.corrIndex);
      Cookies.set("annexNo", rowItem.annexNo);
      Cookies.set("refNo", rowItem.refNo);
      Cookies.set("corrApp", rowItem.application);
      if (CabinetSearchText) {
        Cookies.set("searchText", CabinetSearchText);
      }
      Cookies.set("paFileId", rowItem.id);
      Cookies.set("paFileName", rowItem.subject);
      Cookies.set("isCorr", true);
      Cookies.set("index", true);

      history.push({
        pathname: "/eoffice/personnel/fileview",
        state: {
          from: "cabinet",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
          searchText: CabinetSearchText,
        },
      });
    } else {
      sessionStorage.setItem("InboxID", rowItem.id);
      sessionStorage.setItem("pa_id", rowItem.personalApplicationInventoryId);
      Cookies.set("inboxFile", rowItem.subject);
      Cookies.set("corrIndex", null);
      Cookies.set("priority", rowItem.priority);
      Cookies.set("cabinetStatus", rowItem.status);
      Cookies.set("referenceNumber", rowItem.file);
      Cookies.set("type", rowItem.type);
      Cookies.set("cabinetpartcase", rowItem.partcaseId);
      Cookies.set("cabinetid", rowItem.id);
      Cookies.set("department", rowItem.department);

      // This cookie will make sure that we are redirecting to splitview from cabinet
      Cookies.set("partCase", true);

      //@@@@@@ Here handling 3 cases of file in cabinet @@@@@@

      // 1. When main file is created from cabinet
      if (rowItem.status == "Draft") {
        Cookies.set("isDraft", true);
        Cookies.set("isIndex", false);
        Cookies.set("isCabinet", false);
        sessionStorage.setItem("partcaseID", rowItem?.partCase);

        // 2. When file in cabinet is the index file
      } else if (false) {
        Cookies.set("isDraft", false);
        Cookies.set("isIndex", true);
        Cookies.set("isCabinet", false);

        // 3. When file in cabinet is from original pa flow
      } else {
        Cookies.set("isDraft", false);
        Cookies.set("isIndex", false);
        Cookies.set("isCabinet", true);
      }

      Cookies.set("enc", rowItem.encNo);
      Cookies.set("not", rowItem.notingNo);
      Cookies.set("backPath", "/eoffice/cabinet/file");
      if (rowItem.encNo && CabinetSearchText) {
        Cookies.set("searchEnc", CabinetSearchText);
      }
      if (rowItem.notingNo && CabinetSearchText) {
        Cookies.set("searchNoting", CabinetSearchText);
      }

      history.push({
        pathname: "/eoffice/splitView/file",
        state: {
          from: "cabinet",
          data: rowItem.subject,
          rowData,
          fileNo: rowItem.serialNo,
          searchText: CabinetSearchText,
        },
      });
    }
  };

  const handleNextApp = () => {
    if (fileNo === 1 && rowData.length === 1) {
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
      } else if (rowItem && from === "cabinet") {
        cabRedirect(rowItem);
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
      } else if (rowItem && from === "cabinet") {
        cabRedirect(rowItem);
      } else if (rowItem && from === "inbox") {
        handleOnRowDoubleClick(rowItem);
      }
    }
  };

  useEffect(() => {
    if (pendingRoute?.length || completedRoute?.length) {
      let fileRoute1 = completedRoute?.map((item) => {
        return item?.pklDirectorate?.toUpperCase()
      })
      let fileRoute2 = pendingRoute?.map((item, i) => {
        if (i == 0) {
          return item?.deptName?.toUpperCase()?.replace("DIR-", "") + "-glow"
        }
        return item?.deptName?.toUpperCase()?.replace("DIR-", "")
      })
      setFlowRoute(fileRoute1?.concat(fileRoute2))
    }
  }, [pendingRoute, completedRoute])

  return (
    <div
      style={{
        padding: "1px 0",
        margin: "2px 10px 0px 10px",
        position: "relative",
      }}
    >
      {loading && <Loading />}

      <Grid container justifyContent="center" spacing={2}>
        <Grid item xs={12} style={{ paddingBottom: "3px" }}>
          <Breadcrumb
            routeSegments={[
              // { name: t("inbox"), path: "/eoffice/inbox/file" },
              {
                name:
                  isRti === "true"
                    ? t("RTI FILE")
                    : isOutbox === "true"
                      ? t("outbox")
                      : isInitiate === "true"
                        ? t("initiate")
                        : partCase === "true"
                          ? t("cabinet")
                          : t("inbox"),
                path: `/eoffice/${isRti === "true"
                  ? "rti"
                  : isOutbox === "true"
                    ? "outbox"
                    : isInitiate === "true"
                      ? "correspondence"
                      : partCase === "true"
                        ? "cabinet"
                        : "inbox"
                  }/file${routeQueryParams ? routeQueryParams : ""}`,
              },
              deptObj,
              sectionObj,
              { name: t("file"), path: "/costa/splitView/file" },
            ]}
            otherData={[
              { key: t("subject"), value: title?.toUpperCase() },
              { key: t("ref_no"), value: referenceNumber?.toUpperCase() },
              { key: t("priority"), value: priority?.toUpperCase() },
              {
                key: t("classification"),
                value: classification?.toUpperCase() || "NA",
              },
            ]}
            routeData={routePath}
            flowRoute={flowRoute}
          />
        </Grid>
        <Grid item xs={4} className="inbox_view_btn">
          {/* <ToggleButtonGroup
            value={alignment}
            exclusive
            onChange={handleAlignment}
            aria-label="text alignment"
            className="inbox_view_toggle_btn"
          >
            <ToggleButton value="one" id="inbox_view_one" aria-label="one">
              <CgViewSplit />
            </ToggleButton>
            <ToggleButton value="two" id="inbox_view_two" aria-label="two">
              <CgViewDay />
            </ToggleButton>
          </ToggleButtonGroup> */}
        </Grid>
      </Grid>

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

      {isRti ? (
        <BmProvider>
          <BmContainer />
        </BmProvider>
      ) : (
        <Tabs selectedIndex={tabIndex} onSelect={(index) => settabIndex(index)}>
          <TabList className="inbox-tabsList">
            <Tab style={{ borderRadius: "5px 5px 0 0", padding: "0px 12px" }}>
              BM
            </Tab>
            <Tab style={{ borderRadius: "5px 5px 0 0", padding: "0px 12px" }}>
              Collation Cover
            </Tab>
            <Tab style={{ borderRadius: "5px 5px 0 0", padding: "0px 12px" }}>
              Linked Files
            </Tab>
          </TabList>
          <TabPanel>
            <BmProvider isBM={true}>
              <BmContainer />
            </BmProvider>
          </TabPanel>
          <TabPanel>
            <BmProvider isBM={false}>
              <BmContainer />
            </BmProvider>
          </TabPanel>
          <TabPanel>
            <BmProvider isLF={true}>
              <BmContainer />
            </BmProvider>
          </TabPanel>
        </Tabs>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
  };
};

export default connect(mapStateToProps, {
  setInboxDatas,
})(SplitView);
