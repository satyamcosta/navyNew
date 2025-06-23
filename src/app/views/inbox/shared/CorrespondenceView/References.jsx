import {
  Button,
  Dialog,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
  makeStyles,
} from "@material-ui/core";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import React, { useContext, useEffect, useState } from "react";
import FileUploader from "../FileUpload";
import SplitViewPdfViewer from "../pdfViewer/pdfViewer";
import { connect, useDispatch } from "react-redux";
import { CorrContext } from "./Worker";
import PaginationComp from "app/views/utilities/PaginationComp";
import InputForm from "../quickSignFrom";
import { useTranslation } from "react-i18next";
import { Cancel, Close, Create, Delete, RestorePage } from "@material-ui/icons";
import Draggable from "react-draggable";
import {
  rollbackCorrDocument,
  deleteCorrReferenceData,
} from "../../../../camunda_redux/redux/action";
import { unstable_batchedUpdates } from "react-dom";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import HeadersAndFootersView from "../../../FileApproval/documentEditor/editor";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  mainDiv: {
    textAlign: "center",
  },
  formControl: {
    marginTop: 10,
    width: 300,
    // minWidth: 150,
    // maxWidth: 250,
  },
  button: {
    marginLeft: 4,
    minWidth: "16px",
    padding: "8px 10px",
    boxShadow: "none",
    // backgroundColor: "#808080"
  },
  uploadButton: {
    marginLeft: 4,
    // backgroundColor: "#808080"
  },
  sign_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "6% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  back_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "40px !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  response_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "110px !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  speedDial: {
    position: "fixed",
    bottom: "84px",
    right: theme.spacing(6),
    boxShadow: "none",
  },
  sendIcon: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: theme.spacing(6),
    zIndex: 100,
    boxShadow: "none",
  },
  subject_overflow: {
    display: "block",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    maxWidth: "210px",
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const References = (props) => {
  const outbox = Cookies.get("outboxCorr") == "true";
  const index = Cookies.get("index") == "true";
  const preview = Cookies.get("preview") == "true";
  const dept = sessionStorage.getItem("department");
  const role = sessionStorage.getItem("role");

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    loading,
    setLoading,
    referenceList,
    setreferenceList,
    referObj,
    setreferObj,
    referSigned,
    setreferSigned,
    referUrl,
    setreferUrl,
    referAnnoId,
    setreferAnnoId,
    referExtension,
    setreferExtension,
    rowId,
    setRowId,
    noteSigned,
    mergeDak,
  } = useContext(CorrContext);

  const [width, setWidth] = useState(window.innerWidth);
  const [resize, setResize] = useState(false);
  const [pdfLoads, setpdfLoads] = useState(false);
  const [tableId, setTableId] = useState("");
  const [isPdf, setIsPdf] = useState(false);
  const [totalCount, setTotalCount] = useState(referenceList?.length);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);

  const [fileId, setFileId] = useState("");
  const [open, setOpen] = useState(false);
  const [flagNumber, setFlagNumber] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [reSaveEnco, setreSaveEnco] = useState(false);

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    if (referObj) {
      setIsPdf(referObj?.fileName?.includes(".pdf"));
    }
  }, [referObj]);

  const handleAddRefer = (data) => {
    let tempArr = [];
    referenceList.map((item) => tempArr.push(item));
    data.map((item, i) =>
      tempArr.unshift({
        ...item,
        subject: item.subject ? item.subject : item.fileName,
      })
    );
    unstable_batchedUpdates(() => {
      setreferenceList(tempArr);
      handleChange(tempArr[0]);
    });
  };

  useEffect(() => {
    if (
      !referSigned &&
      referObj?.uploader == dept &&
      referObj?.fileName.includes(".doc") &&
      referObj?.fileName.includes(".docx") &&
      !mergeDak
    ) {
      setShowEditor(true);
    } else {
      setShowEditor(false);
    }
  }, [referSigned, referObj]);

  const handleReference = (data) => {
    const url = data.fileUrl;
    const flagNumber = data.flagNumber;
    let arr = data.fileName.split(".");
    arr.length !== 1
      ? setreferExtension(arr[arr.length - 1])
      : setreferExtension("docx");
    let tempArr = referenceList.map((item) =>
      item.flagNumber === flagNumber
        ? {
            ...item,
            fileUrl: data.fileUrl,
            isSigned: data.isSigned,
            prevVersionId: data.prevVersionId,
            subject: item.subject ? item.subject : item.fileName,
          }
        : item
    );

    unstable_batchedUpdates(() => {
      setreferSigned(data.isSigned);
      // shouldReSave && setreSaveEnco(true);
      setreferUrl(url);
      setreferenceList(tempArr);
      setreferObj({
        ...referObj,
        fileUrl: data.fileUrl,
        isSigned: data.isSigned,
        prevVersionId: data.prevVersionId,
      });
      data.isSigned ? setShowEditor(false) : setShowEditor(true);
    });
  };

  const handleReference1 = (data) => {
    const url = data.fileUrl;
    const flagNumber = data.flagNumber;
    let arr = data.fileName.split(".");
    arr.length !== 1
      ? setreferExtension(arr[arr.length - 1])
      : setreferExtension("docx");
    let tempArr = referenceList.map((item) =>
      item.flagNumber === flagNumber
        ? {
            ...item,
            fileUrl: data.fileUrl,
            isSigned: data.isSigned,
            prevVersionId: data.prevVersionId,
            subject: item.subject ? item.subject : item.fileName,
          }
        : item
    );

    unstable_batchedUpdates(() => {
      setreferSigned(data.isSigned);
      // shouldReSave && setreSaveEnco(true);
      setreferUrl(url);
      setreferenceList(tempArr);
      setreferObj({
        ...referObj,
        fileUrl: data.fileUrl,
        isSigned: data.isSigned,
        prevVersionId: data.prevVersionId,
      });
      data.isSigned ? setShowEditor(false) : setShowEditor(true);
    });
  };

  const handleSignedCompleted = (val) => {
    setOpen(false);
  };

  const handleChange = (item) => {
    if (item) {
      setreferObj(item);
      let arr = item?.fileName.split(".");
      arr.length > 1
        ? setreferExtension(arr[arr.length - 1])
        : setreferExtension("docx");
      setreferSigned(item?.isSigned);
      setreferAnnoId(item?.annotationId);
      setreferUrl(item?.fileUrl);
      setTableId(item.fileId);
      if (outbox || index || preview) {
        setShowEditor(false);
        setreferSigned(true);
      } else if (
        !item?.fileName.includes(".doc") &&
        !item?.fileName.includes(".docx")
      ) {
        setShowEditor(false);
        setIsPdf(true);
      }
    } else {
      unstable_batchedUpdates(() => {
        setreferObj({});
        setreferExtension("docx");
        setreferUrl("def");
        setTableId("");
        setreferSigned(true);
        setreferAnnoId("");
      });
    }
  };

  const handleDocumentRollback = async () => {
    setLoading(true);
    let body = {
      corrDocId: rowId,
      annexure: false,
      reference: true,
      application: false,
      flagNumber: referObj?.flagNumber,
    };
    props.rollbackCorrDocument(body).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          dispatch(setSnackbar(true, "success", t("remove_sign_successful")));
          handleReference(resp.response);
        }
      } catch (e) {
        // callMessageOut(e.message);
        setLoading(false);
      }
    });
  };

  const deleteEnclosureData = () => {
    setLoading(true);
    props
      .deleteCorrReferenceData(rowId, referObj?.flagNumber, referObj?.fileId)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("reference_has_been_deleted_successfully")} !`
            )
          );
          setreferenceList(res.response?.references);
          let newData = res.response?.references[0];
          handleChange(newData);
          setLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  return (
    <>
      <Grid
        container
        justifyContent="space-between"
        spacing={1}
        style={{
          margin: "0px",
          padding: "0.3rem",
          border: "1px solid #80808085",
          background: props.theme ? "initial" : "#ffffffa1",
        }}
      >
        <SplitterComponent
          resizeStop={(e) => {
            setResize(true);
          }}
          style={{ zIndex: "0" }}
          orientation={width <= 750 ? "Vertical" : "Horizontal"}
        >
          <div
            style={{
              width: "60%",
            }}
          >
            <div
              style={{
                display: showEditor ? "none" : "block",
                border: "1px solid #80808073",
                height: "calc(100vh - 110px)",
                overflow: "hidden",
              }}
              className="ss-privacy-hide"
            >
              <SplitViewPdfViewer
                fileUrl={showEditor ? "" : referUrl}
                pdfLoads={(val) => {
                  setpdfLoads(val);
                }}
                fileId={""}
                flag={"SPLIT"}
                editable={false}
                flagNumber={""}
                anottId={referAnnoId}
                signed={referSigned}
                extension={referExtension}
              />
            </div>
            {!preview && (
              <div
                style={{
                  display: showEditor ? "block" : "none",
                  border: "1px solid #80808073",
                  height: "calc(100vh - 110px)",
                  overflow: "hidden",
                }}
                className="ss-privacy-hide"
              >
                <HeadersAndFootersView
                  fileId={showEditor ? rowId : ""}
                  fileUrl1={showEditor ? referUrl : ""}
                  comment={true}
                  reSave={reSaveEnco}
                  setreSave={(val) => {
                    setreSaveEnco(val);
                  }}
                  resize={resize}
                  handleResize={(val) => setResize(val)}
                  style={{ border: "1px solid #b6b6b6" }}
                  containerId={"container12"}
                  timer={1000}
                />
              </div>
            )}
          </div>

          <div
            style={{
              width: "40%",
            }}
          >
            <TableContainer
              component={Paper}
              className="inbox-tab"
              elevation={3}
              style={{
                position: "relative",
                borderRadius: "9px",
                border: `1px solid ${props.theme ? "#727272" : "#c7c7c7"}`,
              }}
            >
              <Table component="div" className="App-main-table">
                <div>
                  <div
                    style={{
                      borderBottom: `1px solid #8080805c`,
                      display: "grid",
                      gridTemplateColumns: "2fr 1fr 1fr",
                      background: "#b1b1b15c",
                      padding: "0.46rem 0.8rem",
                    }}
                  >
                    <div>
                      <span>{t("subject")}</span>
                    </div>
                    <div>
                      <span>{t("status")}</span>
                    </div>
                    <div>
                      <span>{t("uploaded")}</span>
                    </div>
                  </div>
                </div>
                <TableBody
                  component="div"
                  style={{
                    height: "30vh",
                    overflow: "auto",
                  }}
                >
                  {/* Mapping data coming from backnd */}

                  {referenceList.map((item, i) => {
                    return (
                      <TableRow
                        hover
                        component="div"
                        key={i}
                        selected={item.fileId === tableId}
                        onClick={() => handleChange(item)}
                      >
                        <div
                          style={{
                            borderBottom: `1px solid ${
                              props.theme ? "#72707069" : "#c7c7c7"
                            }`,
                            display: "grid",
                            gridTemplateColumns: "2fr 1fr 1fr",
                            alignItems: "center",
                            padding: "0.2rem 0.5rem",
                          }}
                        >
                          <div className="cor-1">
                            <Tooltip
                              title={`${item.flagNumber}${item.flagNumberMarking}-${item.subject}`}
                            >
                              <span
                                className={classes.subject_overflow}
                              >{`${item.flagNumber}${item.flagNumberMarking}-${item.subject}`}</span>
                            </Tooltip>
                          </div>
                          <div className="cor-2">
                            <span>{item.status}</span>
                          </div>
                          <div className="cor-3">
                            <span>{item.uploadTime}</span>
                          </div>
                        </div>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <Grid
                container
                alignItems="flex-end"
                style={{
                  border: "1px solid #80808047",
                  borderWidth: "1px 0px",
                  padding: "4px",
                  paddingTop: "0px",
                }}
              >
                {!outbox && !index && !preview && !mergeDak && (
                  <>
                    <Grid item>
                      {!referSigned ? (
                        <Tooltip
                          title={reSaveEnco ? t("autosave") : t("sign")}
                          aria-label="Sign"
                        >
                          <span>
                            <Button
                              id="FlagNumberEnclouser_sign_button"
                              variant="contained"
                              color="secondary"
                              className={classes.button}
                              onClick={() => {
                                setFileId(referObj?.fileId);
                                setFlagNumber(referObj?.flagNumber);
                                setOpen(true);
                              }}
                              disabled={
                                isPdf ||
                                referenceList?.length == 0 ||
                                noteSigned ||
                                reSaveEnco
                              }
                            >
                              <Create style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={t("remove_sign")}
                          aria-label="Remove sign"
                        >
                          <span>
                            <Button
                              id="FlagNumberEnclouser_removeSign_button"
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={handleDocumentRollback}
                              disabled={
                                isPdf ||
                                referenceList?.length == 0 ||
                                noteSigned
                              }
                            >
                              <RestorePage style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      )}
                    </Grid>
                    <Grid item>
                      <Tooltip
                        title={t("upload_file")}
                        aria-label="Upload File"
                      >
                        <div className={classes.uploadButton}>
                          <FileUploader
                            reference={true}
                            docId={rowId}
                            handleAdd={handleAddRefer}
                            signed={noteSigned}
                          />
                        </div>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip
                        title={t("delete_enclosure")}
                        aria-label="Delete Enclosure"
                      >
                        <span>
                          <Button
                            id="inbox_delete_enclosure"
                            variant="contained"
                            color="secondary"
                            className={classes.button}
                            disabled={
                              referenceList.length == 0 ||
                              referObj?.uploader != dept ||
                              noteSigned
                            }
                            onClick={() => {
                              deleteEnclosureData();
                            }}
                          >
                            <Delete style={{ fontSize: "1rem" }} />
                          </Button>
                        </span>
                      </Tooltip>
                    </Grid>
                  </>
                )}
              </Grid>
              <PaginationComp
                pageSize={pageSize}
                pageSizes={[5, 10, 15]}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalCount={totalCount}
                setPageSize={setPageSize}
              />
            </TableContainer>
          </div>
        </SplitterComponent>
      </Grid>

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpen(false);
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
          <span>{t("remark_&_sign")}</span>
          <Tooltip title="CLOSE">
            <IconButton
              id="Enclosure_remark_&_sign"
              aria-label="close"
              onClick={() => setOpen(false)}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#000",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <InputForm
          correspondence={true}
          flag={"Annexure"}
          handleCorr={handleReference1}
          fileId={rowId}
          SignURL={referUrl}
          flagNum={flagNumber}
          docId={fileId}
          reference={true}
          isSignedCompleted={handleSignedCompleted}
        />
      </Dialog>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
    inboxer: state.inboxer,
    theme: state.theme,
  };
};
export default connect(mapStateToProps, {
  rollbackCorrDocument,
  deleteCorrReferenceData,
})(References);
