import React, { useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import { Box, Grid, IconButton, Tooltip, makeStyles } from "@material-ui/core";
import {
  getPersonalApplicationFileData,
  loadAnnexureTableData,
  loadIndexData,
} from "../../camunda_redux/redux/action";
import { connect, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Breadcrumb } from "matx";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
import "./therme-source/material-ui/loading.css";
import {
  PaneDirective,
  PanesDirective,
  SplitterComponent,
} from "@syncfusion/ej2-react-layouts";
import TreeTable from "./TreeTable";
import { Loading } from "./therme-source/material-ui/loading";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { handleError } from "utils";
import CorrContainer from "../inbox/shared/CorrespondenceView/CorrContainer";
import history from "../../../history";
import { useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "@material-ui/icons";
import PaginationComp from "../utilities/PaginationComp";

const useStyles = makeStyles((theme) => ({
  btnWrapper: {
    display: "flex",
    position: "absolute",
    top: "1px",
    right: "20px",
  },
}));

const FileViewTable = (props) => {
  const classes = useStyles();
  const { setimportList, importList } = props;
  const { state } = useLocation();
  const {
    from,
    id,
    rowData: routeRowData,
    fileNo,
    searchText: CabinetSearchText,
    routeQueryParams,
  } = state;

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState([]);
  const [pdfLoads, setPdfLoads] = useState(false);

  let title = Cookies.get("inboxFile");
  let priority = Cookies.get("priority");
  const pFileName = Cookies.get("paFileId");
  const referenceNumber = Cookies.get("paFileName");
  let classification = Cookies.get("classification");
  const isCorr = Cookies.get("isCorr") == "true";
  const upload = Cookies.get("import") == "true";
  let partCase = Cookies.get("partCase") == "true";
  let section = Cookies.get("section");
  const dept = sessionStorage.getItem("department");

  let fromNotification = from === "notification";

  // For Advance Search
  const corrIndex = Cookies.get("corrIndex");

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pafileURL, setPaFileURL] = useState("");
  const [annexurefileURL, setAnnexureFileURL] = useState("");
  const [extension, setExtension] = useState("docx");
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [width, setWidth] = useState(window.innerWidth);
  const [selectedRow, setselectedRow] = useState(null);
  const [Filter, setFilter] = useState({});

  const [deptObj, setDeptObj] = useState(null);
  const [sectionObj, setsectionObj] = useState(null);

  useEffect(() => {
    if (dept) {
      let deptArr = dept.split("-");
      setDeptObj({
        name: deptArr?.length > 1 ? deptArr[deptArr.length - 1] : deptArr[0],
        path: "/eoffice/cabinet/file",
      });
    }
    if (section) {
      setsectionObj({ name: section, path: "/eoffice/cabinet/file" });
    }
  }, [dept, section]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    if (!upload) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (!upload) {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [upload]);

  useEffect(() => {
    loadFileView();
  }, [pFileName, currentPage, pageSize, isCorr, Filter]);
  // pFileName, pageSize, currentPage

  const loadFileView = () => {
    setLoading(true);
    if (isCorr) {
      let filter = {};
      Object.entries(Filter).map(([property, value]) => {
        if (property.includes("range")) {
          Object.entries(value).map(([value1, value2]) => {
            let key = value1.split("|")[0];
            filter[`${key}`] = value2;
          });
        } else {
          let key = property.split("|")[0];
          filter[`${key}`] = value;
        }
      });

      // Object.entries(Filter).map(([property, value]) => {
      //   let key = property.split("|")[0];
      //   filter[`${key}`] = value;
      // });

      // props
      //   .loadIndexData(pFileName, pageSize, currentPage, {
      //     fromDate: "",
      //     toDate: "",
      //     type: "",
      //     subject: "",
      //   })
      //   .then(({ response }) => {
      //     try {
      //       if (response.error) {
      //         callMessageOut(response.error);
      //         setLoading(false);
      //       } else {
      //         let tmpArr = [];
      //         tmpArr = response?.content?.map((item, index) => {
      //           return {
      //             ...item,
      //             id: item.id,
      //             serialNo: pageSize * currentPage + (index + 1),
      //             subject: item.subject,
      //             classification: item.classification,
      //           };
      //         });
      //         setTotalCount(tmpArr.length);
      //         setRowData(tmpArr);

      //         if (tmpArr.length === 0) {
      //           setPaFileURL("");
      //         } else {
      //           setPaFileURL(tmpArr[0].fileURL);
      //           setSelectedRowId(tmpArr[0].id);
      //           setselectedRow(tmpArr[0]);
      //         }
      //         setLoading(false);
      //       }
      //     } catch (error) {
      //       callMessageOut(error.message);
      //       setLoading(false);
      //     }
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //     let errMsg = handleError(e.message);
      //     callMessageOut(errMsg);
      //     setLoading(false);
      //   });
      fetch("/correspondence_service/api/v2/getIndexCorrDoc", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          sessionId: sessionStorage.getItem("sessionId"),
          userName: localStorage.getItem("username"),
          roleName: sessionStorage.getItem("role"),
          pageSize,
          fileId: pFileName,
          file: referenceNumber,
          pageNumber: currentPage,
          department: sessionStorage.getItem("department"),
          address: sessionStorage.getItem("ipAddress"),
        },
        body: JSON.stringify({
          fromDate: _.isEmpty(filter)
            ? ""
            : filter?.createdOn
              ? filter?.createdOn
              : "",
          toDate: _.isEmpty(filter) ? "" : filter?.dateTo ? filter?.dateTo : "",
          type: _.isEmpty(filter) ? "" : filter?.status ? filter?.status : "",
          subject: _.isEmpty(filter)
            ? ""
            : filter?.subject
              ? filter?.subject
              : "",
          corrNum: corrIndex,
        }),
      })
        .then((res) => res.json())
        .then((response) => {
          try {
            if (response.error) {
              callMessageOut(response.error);
              setLoading(false);
            } else {
              let tmpArr = [];
              tmpArr = response?.content?.map((item, index) => {
                return {
                  ...item,
                  id: item.id,
                  serialNo: pageSize * currentPage + (index + 1),
                  subject: item.subject,
                  classification: item.classification,
                };
              });

              setTotalCount(response?.length);
              setRowData(tmpArr);
              // console.log(tmpArr);

              if (tmpArr.length === 0) {
                setPaFileURL("");
              } else {
                let foundIndex = tmpArr?.findIndex(
                  (item) => item.correspondenceNumber == corrIndex
                );
                if (foundIndex != -1) {
                  setPaFileURL(tmpArr[foundIndex]?.fileURL);
                  setSelectedRowId(tmpArr[foundIndex]?.id);
                  setselectedRow(tmpArr[foundIndex]);
                } else {
                  setPaFileURL(tmpArr[0]?.fileURL);
                  setSelectedRowId(tmpArr[0]?.id);
                  setselectedRow(tmpArr[0]);
                }
              }
              setLoading(false);
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e);
          let errMsg = handleError(e.message);
          callMessageOut(errMsg);
          setLoading(false);
        });
    } else {
      props
        .getPersonalApplicationFileData(pFileName, pageSize, currentPage)
        .then(({ response }) => {
          try {
            if (response.error) {
              callMessageOut(response.error);
              setLoading(false);
            } else {
              let tmpArr = [];
              tmpArr = response.data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setTotalCount(tmpArr.length);
              setRowData(tmpArr);

              if (tmpArr.length === 0) {
                setPaFileURL("");
              } else {
                setPaFileURL(tmpArr[0].fileURL);
                setSelectedRowId(tmpArr[0].id);
              }
              setLoading(false);
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((e) => {
          console.log(e);
          let errMsg = handleError(e.message);
          callMessageOut(errMsg);
          setLoading(false);
        });
    }
  };

  // useEffect(() => {
  //   if (!pFileName) {
  //     history.push({
  //       pathname: "/eoffice/personnel/file",
  //     });
  //   }
  // }, [pFileName]);

  useEffect(() => {
    if (importList) setimportList([]);
  }, []);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleUpadtePdf = (url) => {
    setPaFileURL(url);
  };

  const handleAnnexture = (url, exe) => {
    setAnnexureFileURL(url);
    setExtension(exe);
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
          rowData: routeRowData,
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
          rowData: routeRowData,
          fileNo: rowItem.serialNo,
        },
      });
    }
  };

  // indexFile Routing
  const indexRedirect = (row) => {
    // mtd that has been triggered while row clicks
    if (isCorr && row) {
      Cookies.set("paFileId", row.id);
      Cookies.set("paFileName", row.subject);
      Cookies.set("isCorr", true);
      Cookies.set("index", true);
      history.push({
        pathname: "/eoffice/personnel/fileview",
        state: {
          from: "indexFile",
          id: row.id,
          rowData: routeRowData,
          fileNo: row.serialNo,
        },
      });
    } else if (row !== undefined && row !== "") {
      Cookies.set("paFileId", row.id);
      Cookies.set("paFileName", row.displayFileName);
      history.push({
        pathname: "/eoffice/personnel/fileview",
        state: {
          from: "indexFile",
          id: row.id,
          rowData: routeRowData,
          fileNo: row.serialNo,
        },
      });
    } else {
      const errorMessage = t("failed_to_load,_kindly_refresh_the_page!");
      callMessageOut(errorMessage);
    }
  };

  const handleNextApp = () => {
    if (fileNo === 1 && routeRowData.length === 1) {
      return;
    } else {
      let newIndex = (fileNo + 1) % routeRowData?.length;
      let rowItem;
      if (newIndex == 0) {
        rowItem = routeRowData?.find(
          (item) => item?.serialNo === routeRowData?.length
        );
      } else {
        rowItem = routeRowData?.find((item) => item?.serialNo === newIndex);
      }
      if (rowItem && from === "cabinet") {
        cabRedirect(rowItem);
      } else if (rowItem && from === "indexFile") {
        // console.log("callback call");
        indexRedirect(rowItem);
      }
    }
  };

  const handlePrevApp = () => {
    if (fileNo === 1 && routeRowData.length === 1) {
      return;
    } else {
      let newIndex = fileNo - 1;
      let rowItem;
      if (newIndex == 0) {
        rowItem = routeRowData?.find(
          (item) => item?.serialNo === routeRowData?.length
        );
      } else {
        rowItem = routeRowData?.find((item) => item?.serialNo === newIndex);
      }
    }
    if (rowItem && from === "cabinet") {
      cabRedirect(rowItem);
    } else if (rowItem && from === "indexFile") {
      indexRedirect(rowItem);
    }
  };

  return (
    <div
      style={{
        padding: "1px 0",
        margin: "2px 10px 0px 10px",
        position: "relative",
      }}
    >
      {loading && <Loading />}
      <Grid container spacing={1}>
        {!upload && (
          <Grid item xs={12}>
            <Breadcrumb routeSegments={[deptObj, sectionObj]} otherData={[
              { key: t("subject"), value: title?.toUpperCase() },
              { key: t("ref_no"), value: referenceNumber?.toUpperCase() },
              { key: t("priority"), value: priority?.toUpperCase() },
              {
                key: t("classification"),
                value: classification?.toUpperCase() || "NA",
              },
            ]} />
          </Grid>
        )}

        {/**!fromNotification && (
          <Box className={classes.btnWrapper}>
            <Tooltip title="PREVIOUS">
              <IconButton
                onClick={handlePrevApp}
                size="small"
                disabled={routeRowData?.length === 1}
                aria-label="previous-app"
              >
                <ChevronLeft />
              </IconButton>
            </Tooltip>
            <Tooltip title="NEXT">
              <IconButton
                onClick={handleNextApp}
                size="small"
                disabled={routeRowData?.length === 1}
                aria-label="next-app"
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>
          </Box>
        )*/}
        {upload ? (
          <SplitterComponent
            orientation={width <= 750 ? "Vertical" : "Horizontal"}
          >
            <div
              style={{
                width: "70%",
              }}
            >
              <Paper
                elevation={3}
                style={{
                  border: "1px solid #b6b6b66b",
                  borderRadius: "8px",
                  // width: width <= 750 ? "100%" : "0%",
                }}
              >
                {loading && <Loading />}
                <TreeTable
                  data={rowData}
                  handleUpadtePdf={handleUpadtePdf}
                  handleAnnexture={handleAnnexture}
                  setSelectedRowId={setSelectedRowId}
                  selectedRowId={selectedRowId}
                  setselectedRow={setselectedRow}
                  importList={importList}
                  setimportList={setimportList}
                />
              </Paper>
            </div>
            <div
              style={{
                width: "30%",
              }}
            >
              <CorrContainer corrObj={selectedRow} />
            </div>
          </SplitterComponent>
        ) : (
          <>
            {/* <div id="left-pane-content" style={{ display: "none" }}>
              <Paper
                elevation={3}
                style={{
                  border: "1px solid #b6b6b66b",
                  borderRadius: "8px",
                  // width: width <= 750 ? "100%" : "0%",
                }}
              >
                {loading && <Loading />}
                <TreeTable
                  data={rowData}
                  Filter={Filter}
                  setFilter={setFilter}
                  handleUpadtePdf={handleUpadtePdf}
                  handleAnnexture={handleAnnexture}
                  setSelectedRowId={setSelectedRowId}
                  selectedRowId={selectedRowId}
                  setselectedRow={setselectedRow}
                  importList={importList}
                  setimportList={setimportList}
                />
              </Paper>
            </div> */}

            {/* <div
              id="corr-pane-content"
              style={{ display: "none", marginTop: "5px" }}
            >
              <CorrContainer corrObj={selectedRow} readOnly={upload} />
            </div> */}

            {/* <div id="file-one-view-pane" style={{ display: "none" }}>
              <div
                style={{
                  border: "1px solid #8181815c",
                  // width: width <= 750 || isCorr ? "100%" : "50%",
                  height: "calc(100vh - 100px)",
                  overflow: "hidden",
                }}
                className="ss-privacy-hide"
              >
                <SplitViewPdfViewer
                  fileUrl={pafileURL}
                  extension={"docx"}
                  pdfLoads={(val) => {
                    setPdfLoads(val);
                  }}
                  editable={false}
                />
              </div>
            </div>

            <div id="second-one-view-pane" style={{ display: "none" }}>
              <div
                style={{
                  border: "1px solid #b6b6b66b",
                  // width: width <= 750 ? "100%" : "50%",
                  height: "calc(100vh - 100px)",
                  overflow: "hidden",
                }}
                className="ss-privacy-hide"
              >
                <SplitViewPdfViewer
                  fileUrl={annexurefileURL}
                  extension={extension}
                  pdfLoads={(val) => {
                    setPdfLoads(val);
                  }}
                  editable={false}
                />
              </div>
            </div>
            <div id="file-view-pane-content" style={{ display: "none" }}>
              <SplitterComponent
                orientation={width <= 750 ? "Vertical" : "Horizontal"}
              >
                <PanesDirective>
                  <PaneDirective size="50%" content="#file-one-view-pane" />
                  <PaneDirective size="50%" content="#second-one-view-pane" />
                </PanesDirective>
              </SplitterComponent>
            </div> */}

            <SplitterComponent
              orientation={width <= 750 ? "Vertical" : "Horizontal"}
              style={{ marginTop: "-9px" }}
            >
              <div
                style={{
                  width: "30%",
                }}
              >
                <Paper
                  elevation={3}
                  style={{
                    border: "1px solid #b6b6b66b",
                    borderRadius: "8px",
                    // width: width <= 750 ? "100%" : "0%",
                  }}
                >
                  {loading && <Loading />}
                  <TreeTable
                    data={rowData}
                    Filter={Filter}
                    setFilter={setFilter}
                    handleUpadtePdf={handleUpadtePdf}
                    handleAnnexture={handleAnnexture}
                    setSelectedRowId={setSelectedRowId}
                    selectedRowId={selectedRowId}
                    setselectedRow={setselectedRow}
                    importList={importList}
                    setimportList={setimportList}
                  />
                  <PaginationComp
                    pageSize={pageSize}
                    pageSizes={[5, 10, 15]}
                    setCurrentPage={setCurrentPage}
                    currentPage={currentPage}
                    totalCount={totalCount}
                    setPageSize={setPageSize}
                  />
                </Paper>
              </div>

              {isCorr ? (
                <div
                  style={{
                    marginTop: "5px",
                    width: "70%",
                  }}
                >
                  <CorrContainer corrObj={selectedRow} readOnly={upload} />
                </div>
              ) : (
                <div
                  style={{
                    width: "70%",
                  }}
                >
                  <SplitterComponent
                    orientation={width <= 750 ? "Vertical" : "Horizontal"}
                  >
                    <div
                      style={{
                        border: "1px solid #8181815c",
                        width: "50%",
                        height: "calc(100vh - 100px)",
                        overflow: "hidden",
                      }}
                      className="ss-privacy-hide"
                    >
                      <SplitViewPdfViewer
                        fileUrl={pafileURL}
                        extension={"docx"}
                        pdfLoads={(val) => {
                          setPdfLoads(val);
                        }}
                        editable={false}
                      />
                    </div>
                    <div
                      style={{
                        border: "1px solid #b6b6b66b",
                        width: "50%",
                        height: "calc(100vh - 100px)",
                        overflow: "hidden",
                      }}
                      className="ss-privacy-hide"
                    >
                      <SplitViewPdfViewer
                        fileUrl={annexurefileURL}
                        extension={extension}
                        pdfLoads={(val) => {
                          setPdfLoads(val);
                        }}
                        editable={false}
                      />
                    </div>
                  </SplitterComponent>
                </div>
              )}
            </SplitterComponent>
          </>
        )}
      </Grid>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  getPersonalApplicationFileData,
  loadAnnexureTableData,
  loadIndexData,
})(FileViewTable);
