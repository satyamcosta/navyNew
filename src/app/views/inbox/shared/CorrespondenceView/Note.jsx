import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import React, { useContext, useEffect, useState } from "react";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import SplitViewPdfViewer from "../pdfViewer/pdfViewer";
import { connect, useDispatch } from "react-redux";
import { CorrContext } from "./Worker";
import PaginationComp from "app/views/utilities/PaginationComp";
import InputForm from "../quickSignFrom";
import { useTranslation } from "react-i18next";
import {
  ArrowBack,
  Close,
  Create,
  RestorePage,
  Send,
  Cancel,
  Done,
  History,
  Schedule,
  CallToAction
} from "@material-ui/icons";
import Draggable from "react-draggable";
import {
  rollbackCorrDocument,
  deleteCorrAnnexureData,
  closeCorrespondence,
  moveToNfa,
  getHistoryOld,
  discardCorrespondence,
  getHistory
} from "../../../../camunda_redux/redux/action";
import { unstable_batchedUpdates } from "react-dom";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import CorrHrmDialog from "app/views/Correspondence/CorrHrmDialog";
import HeadersAndFootersView from "../../../FileApproval/documentEditor/editor";
import Cookies from "js-cookie";
import { SpeedDial, SpeedDialAction, SpeedDialIcon, Timeline, TimelineConnector, TimelineContent, TimelineDot, TimelineItem, TimelineOppositeContent, TimelineSeparator } from "@material-ui/lab";
import SaveIcon from "@material-ui/icons/Save";
import ReplyIcon from "@material-ui/icons/Reply";
import SaveInIndex from "./SaveInIndex";
import CorrespondenceForm from "app/views/Correspondence/CorrespondenceForm";
import { handleError } from "utils";
import { Loading } from "../../therme-source/material-ui/loading";
import history from "../../../../../history";
import DocHistory from "app/views/outbox/shared/DocHistory";
import BackspaceIcon from "@material-ui/icons/Backspace";
import Eric from "app/views/Cabinet/folder/Eric";
import PersonalFileForm from "app/views/Personnel/PersonalFileForm";
import ActionPointForm from "./ActionPointForm"

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
    padding: "10px 12px",
    boxShadow: "none",
    // backgroundColor: "#808080"
  },
  uploadButton: {
    marginLeft: 4,
    // backgroundColor: "#808080"
  },
  sign_btn: {
    position: "fixed",
    right: "12px !important",
    bottom: "15% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  sign_btn1: {
    position: "fixed",
    right: "12px !important",
    bottom: "15% !important",
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
  sendIcon: {
    position: "fixed",
    right: "35px !important",
    bottom: "20px !important",
    zIndex: 10,
    maxHeight: "48px",
    minHeight: "48px",
    minWidth: "48px",
    maxWidth: "48px",
  },
  signIcon: {
    position: "fixed",
    right: "35px !important",
    bottom: "85px !important",
    zIndex: 10,
    maxHeight: "48px",
    minHeight: "48px",
    minWidth: "48px",
    maxWidth: "48px",
  },
  sDialIcon: {
    position: "relative",
  },
  speedDial: {
    position: "fixed",
    bottom: "12%",
    right: "35px",
    boxShadow: "none",
    "& .MuiFab-root": {
      height: "48px",
      width: "48px",
    },
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const Note = (props) => {
  const backPath = Cookies.get("backPath");
  const outbox = Cookies.get("outboxCorr") == "true";
  const index = Cookies.get("index") == "true";
  const preview = Cookies.get("preview") == "true";
  const nfa = Cookies.get("nfa") === "true";
  const readOnly = Cookies.get("readOnly") === "true"
  let referenceNumber = Cookies.get("referenceNumber");

  const dept = sessionStorage.getItem("department");
  const role = sessionStorage.getItem("role");

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    noteObj,
    setNoteObj,
    noteSigned,
    setNoteSigned,
    noteUrl,
    setnoteUrl,
    noteAnnotId,
    setnoteAnnotId,
    noteExtension,
    setNoteExtension,
    rowId,
    setRowId,
    corrNo,
    saved,
    setSaved,
    corrObj,
    commentList,
    extCommList,
    setIndexFile,
    mergeDak,
    seqArr,
    deptCc,
    deptInfo,
    deptTo,
    deptWithin,
    isScanned,    // To check whether dak is scanned or not
    setIsScanned,
    isError, setIsError,
    annexureList,
    referenceList,
    deptCcRecord,
    deptToRecord
  } = useContext(CorrContext);

  const [width, setWidth] = useState(window.innerWidth);
  const [resize, setResize] = useState(false);
  const [pdfLoads, setpdfLoads] = useState(false);
  const [send, setSend] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [reSaveEnco, setreSaveEnco] = useState(false);

  const [fileId, setFileId] = useState("");
  const [open, setOpen] = useState(false);
  const [flagNumber, setFlagNumber] = useState("");

  const [openSpeedDial, setOpenSpeedDial] = useState(true);
  const [openSave, setOpenSave] = useState(false);
  const [openReply, setOpenReply] = useState(false);
  const [openClose, setOpenClose] = useState(false);

  const [loading, setLoading] = useState(false);

  const [totalCount, setTotalCount] = useState(commentList.length);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);

  const [openNfa, setOpenNfa] = useState(false);

  const [historyObj, setHistoryObj] = useState({});
  const [extList, setExtList] = useState([]);
  const [deptName, setDeptName] = useState("");
  const [blnOpenHistory, setblnOpenHistory] = useState(false);

  const [createEric, setCreateEric] = useState(false);

  const [sampleData, setSampleData] = useState([]);

  // Create draft / correspondence from inbox
  const [openCorr, setOpenCorr] = useState(false);
  const [nof, setNof] = useState("");
  const [corrFile, setCorrFile] = useState(false);
  const [fileUrlArr, setFileUrlArr] = useState([]);
  const [APformOpen, setAPFormOpen] = useState(false);

  const handleEric = (val) => setCreateEric(val);

  const handleNof = (file) => {
    setNof(file);
    setCorrFile(false);
  };

  const handleCreateEric = () => {
    dispatch(setSnackbar(true, "success", t("create_eric_suc")));
    setCreateEric(false);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });
  }, []);

  useEffect(() => {
    if (
      !noteSigned &&
      noteObj?.uploader == dept &&
      !noteObj?.fileName?.includes(".pdf") &&
      !mergeDak
    ) {
      setShowEditor(true);
      setNoteSigned(false)
      setIsScanned(false)
    } else {
      setShowEditor(false);
      setNoteSigned(true)
      setIsScanned(true)
    }
    if (noteObj?.isSigned) {
      setIsScanned(false)
    }
  }, [noteSigned, noteObj]);

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  const callMessageSuccess = (message) => {
    dispatch(setSnackbar(true, "success", message));
  };

  const handleSend = () => {
    setSend(true);
  };

  const handleNfa = () => {
    setLoading(true);
    let id = sessionStorage.getItem("InboxID");
    props.moveToNfa(id).then((resp) => {
      try {
        if (resp.error) {
          let errMsg = handleError(resp.error, true);
          callMessageOut(errMsg);
          setLoading(false);
        } else {
          if (resp.response) {
            callMessageSuccess(t("nfa_success"));
          }
          setLoading(false);
          setTimeout(() => {
            history.push({ pathname: "/eoffice/inbox/file" });
          }, 0);
        }
      } catch (error) {
        callMessageOut(error.message);
        setLoading(false);
      }
    });
  };

  const handleUndo = (data) => {
    const url = data.fileUrl;
    const flagNumber = data.flagNumber;
    let arr = data.fileName.split(".");
    arr.length !== 1
      ? setNoteExtension(arr[arr.length - 1])
      : setNoteExtension("docx");
    let newNoteObj = {
      ...data,
      fileUrl: data.fileUrl,
      isSigned: data.isSigned,
      prevVersionId: data.prevVersionId,
      subject: data.subject ? data.subject : data.fileName,
    };

    unstable_batchedUpdates(() => {
      setNoteSigned(data.isSigned);
      setnoteUrl(url);
      setNoteObj(newNoteObj);
      setShowEditor(true);
    });
  };

  const handleDocumentRollback = () => {
    setLoading(true);
    let body = {
      corrDocId: rowId,
      annexure: false,
      reference: false,
      application: true,
      flagNumber: noteObj?.flagNumber,
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
          handleUndo(resp.response);
        }
      } catch (e) {
        // callMessageOut(e.message);
        setLoading(false);
      }
    });
  };

  const handleSignedCompleted = (val) => {
    setOpen(false);
  };

  const handleCorr = (data) => {
    const url = data.fileUrl;
    let arr = data.fileName.split(".");
    arr.length !== 1
      ? setNoteExtension(arr[arr.length - 1])
      : setNoteExtension("docx");
    let newNoteObj = {
      ...data,
      fileUrl: data.fileUrl,
      isSigned: data.isSigned,
      prevVersionId: data.prevVersionId,
      subject: data.subject ? data.subject : data.fileName,
    };

    unstable_batchedUpdates(() => {
      setNoteSigned(data.isSigned);
      setnoteUrl(url);
      setNoteObj(newNoteObj);
      setShowEditor(false);
    });
  };

  const handleSave = (indexFile) => {
    setIndexFile(indexFile);
    setSaved(true);
    setOpenSave(false);
  };

  const handleClose = () => {
    const id = sessionStorage.getItem("InboxID");
    props.closeCorrespondence(id).then((resp) => {
      try {
        if (resp.error) {
          let errMsg = handleError(resp.error, true);
          callMessageOut(errMsg);
        } else {
          if (resp.response) {
            callMessageSuccess(t("corr_close"));
          }
          setLoading(false);
          setTimeout(() => {
            history.push({ pathname: "/eoffice/inbox/file" });
          }, 0);
        }
      } catch (error) {
        callMessageOut(error.message);
        setLoading(false);
      }
    });
  };

  const handleDiscard = () => {
    const id = sessionStorage.getItem("InboxID");
    props.discardCorrespondence(id).then((resp) => {
      try {
        if (resp.error) {
          let errMsg = handleError(resp.error, true);
          callMessageOut(errMsg);
        } else {
          if (resp.response) {
            callMessageSuccess(t("dak_dis"));
          }
          setLoading(false);
          setTimeout(() => {
            history.push({ pathname: "/eoffice/inbox/file" });
          }, 0);
        }
      } catch (error) {
        callMessageOut(error.message);
        setLoading(false);
      }
    });
  };

  const handleHistory = (e) => {
    e.stopPropagation();
    setLoading(true);
    let id = sessionStorage.getItem("InboxID")
    console.log(rowId)
    props.getHistory("File", rowId).then((resp) => {
      try {
        if (resp.error) {
          setSampleData([]);
        } else {
          setSampleData(resp?.data);
          setblnOpenHistory(true);
        }
      } catch (error) {
        callMessageOut(error.message);
        setLoading(false);
      }
    });
    props.getHistoryOld(referenceNumber, id).then((resp) => {
      try {
        if (resp.error) {
          let errMsg = handleError(resp.error, true);
          callMessageOut(errMsg);
          setLoading(false);
        } else {
          setExtList(resp?.data?.deptList);
          setHistoryObj(resp?.data?.roles);
          setDeptName(resp?.data?.dept);
          setblnOpenHistory(true);

          setLoading(false);
        }
      } catch (error) {
        callMessageOut(error.message);
        setLoading(false);
      }
    });
  };

  const resetError = () => {
    setIsError(false)
    history.goBack()
  }


  console.log(
    deptCcRecord,
    deptToRecord
  )

  // console.log("commentList", commentList)


  const handleCreateActionPoint = () => {
    let tempArr = [];
    let tempArr2 = []

    tempArr.push(noteObj?.fileUrl);
    tempArr.push(noteObj);
    annexureList.map((annexure) => {
      tempArr.push(annexure?.fileUrl);
      tempArr2.push(annexure);
    });
    referenceList.map((reference) => {
      tempArr.push(reference?.fileUrl);
      tempArr2.push(reference);
    });

    setFileUrlArr(tempArr);
    setAPFormOpen(true);
  };
  const handleCloseAPForm = () => {
    setAPFormOpen(false);
  }

  return (
    <>
      {loading && <Loading />}

      {noteSigned && !index && !preview && (
        <SpeedDial
          ariaLabel="SpeedDial tooltip example"
          className={classes.speedDial}
          icon={<SpeedDialIcon />}
          onClose={(e, reason) => {
            if (reason == "toggle") setOpenSpeedDial(false)
          }}
          onOpen={(e, reason) => {
            if (reason == "toggle") setOpenSpeedDial(true)
          }}
          open={openSpeedDial}
          direction="left"
        >
          {/* <SpeedDialAction
            className={classes.sDialIcon}
            icon={<ArrowBack />}
            tooltipTitle={t("back")}
            onClick={() =>
              history.push({
                pathname: `${backPath ? backPath : "/eoffice/inbox/file"}`,
              })
            }
          /> */}
          {
            !outbox && !index && !readOnly && (

              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<CallToAction />}
                tooltipTitle={t("create_action_point")}
                onClick={handleCreateActionPoint}
              />
            )
          }
          {noteSigned && !isScanned &&
            noteObj?.uploader == dept &&
            !outbox &&
            !index &&
            !mergeDak && !readOnly && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<RestorePage />}
                tooltipTitle={t("undo")}
                onClick={handleDocumentRollback}
              />
            )}
          {!saved && noteSigned && !outbox && !index && !readOnly && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<SaveIcon />}
              tooltipTitle={t("SAVE IN FILE")}
              onClick={() => {
                setOpenSave(true);
              }}
            />
          )}
          {saved && noteSigned && !outbox && !index && !readOnly && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ReplyIcon />}
              tooltipTitle={t("reply")}
              onClick={() => {
                setOpenReply(true);
              }}
            />
          )}

          {/* {!outbox && !index && !readOnly && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<Schedule />}
              tooltipTitle={t("create_eric")}
              onClick={() => handleEric(true)}
            />
          )} */}

          {/*
            
            {saved && noteSigned && !outbox && !index && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<Close />}
              tooltipTitle={t("close_corr")}
              onClick={() => {
                setOpenClose(true);
              }}
            />
          )}
            
            */}
          {!saved && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<MoveToInboxIcon />}
              tooltipTitle={t("nfa")}
              onClick={() => setOpenNfa(true)}
            />
          )}
          {saved && !outbox && !index && !preview && (
            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<BackspaceIcon />}
              tooltipTitle={t("discard")}
              onClick={() => setOpenClose(true)}
            />
          )}
          <SpeedDialAction
            className={classes.sDialIcon}
            icon={<ArrowBack />}
            tooltipTitle={t("back")}
            onClick={() =>
              history.push({
                pathname: `${backPath ? backPath : "/eoffice/inbox/file"}`,
              })
            }
          />

          <SpeedDialAction
            className={classes.sDialIcon}
            icon={<History />}
            tooltipTitle={t("inbox_history")}
            onClick={handleHistory}
          />

        </SpeedDial>
      )}

      {(noteSigned || !mergeDak) && !outbox && !index && !preview && !readOnly && (
        <Tooltip title={t("send")}>
          <Fab
            color="secondary"
            className={classes.sendIcon}
            onClick={handleSend}
            disabled={reSaveEnco}
          >
            <Send style={{ marginLeft: "3px" }} />
          </Fab>
        </Tooltip>
      )}

      {!noteSigned &&
        noteObj?.uploader == dept &&
        !outbox &&
        !index &&
        !mergeDak && !readOnly && (
          <Tooltip title={reSaveEnco ? t("autosave") : t("sign")}>
            <Fab
              color="secondary"
              className={classes.signIcon}
              disabled={reSaveEnco}
              onClick={() => {
                setFileId(noteObj?.fileId);
                setFlagNumber(noteObj?.flagNumber);
                setOpen(true);
              }}
            >
              <Create />
            </Fab>
            {/* <SpeedDialAction
            className={classes.sDialIcon}
            icon={<Create />}
            tooltipTitle={reSaveEnco ? t("autosave") : t("sign")}
            disabled={reSaveEnco}
            onClick={() => {
              setFileId(noteObj?.fileId);
              setFlagNumber(noteObj?.flagNumber);
              setOpen(true);
            }}
          /> */}
          </Tooltip>
        )}

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
                fileUrl={showEditor ? "" : noteUrl}
                pdfLoads={(val) => {
                  setpdfLoads(val);
                }}
                fileId={""}
                flag={"SPLIT"}
                editable={false}
                flagNumber={""}
                anottId={noteAnnotId}
                signed={noteSigned}
                extension={noteExtension}
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
                  fileUrl1={showEditor ? noteUrl : ""}
                  comment={true}
                  reSave={reSaveEnco}
                  setreSave={(val) => {
                    setreSaveEnco(val);
                  }}
                  resize={resize}
                  handleResize={(val) => setResize(val)}
                  style={{ border: "1px solid #b6b6b6" }}
                  containerId={"container11"}
                  timer={1000}
                />
              </div>
            )}
          </div>
          <div
            style={{
              width: "40%",
              display: "flex",
              flexDirection: "column",
              gap: "0.5rem",
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
                      gridTemplateColumns: "1fr 1fr",
                      background: "#b1b1b15c",
                      padding: "0.5rem",
                    }}
                  >
                    <div>
                      <span>{t("from")}</span>
                    </div>
                    <div>
                      <span>{t("int_comment")}</span>
                    </div>
                  </div>
                </div>
                <TableBody
                  component="div"
                  style={{
                    height: "20vh",
                    overflow: "auto",
                  }}
                >
                  {/* Mapping data coming from backnd */}

                  {commentList.map((item, i) => {
                    return (
                      <TableRow hover component="div" key={i}>
                        <div
                          style={{
                            borderBottom: `1px solid ${props.theme ? "#72707069" : "#c7c7c7"
                              }`,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            alignItems: "center",
                            padding: "0.5rem",
                          }}
                        >
                          <div className="cor-2">
                            <span>{item.from?.displayRoleName || item.from?.roleName}</span>
                          </div>
                          <div className="cor-3">
                            <span>{decodeURIComponent(item.comment)}</span>
                          </div>
                        </div>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <PaginationComp
                pageSize={pageSize}
                pageSizes={[5, 10, 15]}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalCount={totalCount}
                setPageSize={setPageSize}
              />
            </TableContainer>
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
                      gridTemplateColumns: "1fr 1fr",
                      background: "#b1b1b15c",
                      padding: "0.5rem",
                    }}
                  >
                    <div>
                      <span>{t("from")}</span>
                    </div>
                    <div>
                      <span>{t("ext_comment")}</span>
                    </div>
                  </div>
                </div>
                <TableBody
                  component="div"
                  style={{
                    height: "20vh",
                    overflow: "auto",
                  }}
                >
                  {/* Mapping data coming from backnd */}

                  {extCommList.map((item, i) => {
                    return (
                      <TableRow hover component="div" key={i}>
                        <div
                          style={{
                            borderBottom: `1px solid ${props.theme ? "#72707069" : "#c7c7c7"
                              }`,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            alignItems: "center",
                            padding: "0.5rem",
                          }}
                        >
                          <div className="cor-2">
                            <span>{item.from?.deptDisplayName || item.from?.deptName}</span>
                          </div>
                          <div className="cor-3">
                            <span>{decodeURIComponent(item.comment)}</span>
                          </div>
                        </div>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              <PaginationComp
                pageSize={pageSize}
                pageSizes={[5, 10, 15]}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalCount={totalCount}
                setPageSize={setPageSize}
              />
            </TableContainer>
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
                      gridTemplateColumns: "1fr 1fr",
                      background: "#b1b1b15c",
                      padding: "0.5rem",
                    }}
                  >
                    <div>
                      <span>{t("external")}</span>
                    </div>
                    <div>
                      <span>{t("recipent")}</span>
                    </div>
                  </div>
                </div>
                <TableBody
                  component="div"
                  style={{
                    height: "20vh",
                    overflow: "auto",
                  }}
                >
                  {/* Mapping data coming from backnd */}
                  <TableRow hover component="div">
                    <div
                      style={{
                        borderBottom: `1px solid ${props.theme ? "#72707069" : "#c7c7c7"
                          }`,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        alignItems: "center",
                        padding: "0.5rem",
                      }}
                    >
                      <div className="cor-2">
                        <span>TO</span>
                      </div>
                      <div className="cor-3">
                        <span>{deptToRecord}</span>
                      </div>
                    </div>
                  </TableRow>
                  {
                    deptCcRecord && (
                      <TableRow hover component="div">
                        <div
                          style={{
                            borderBottom: `1px solid ${props.theme ? "#72707069" : "#c7c7c7"
                              }`,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            alignItems: "center",
                            padding: "0.5rem",
                          }}
                        >
                          <div className="cor-2">
                            <span>CC</span>
                          </div>
                          <div className="cor-3">
                            <span>{deptCcRecord}</span>
                          </div>
                        </div>
                      </TableRow>
                    )
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </SplitterComponent>
      </Grid>

      {APformOpen && (
        <ActionPointForm
          open={APformOpen}
          handleClose={handleCloseAPForm}
          fileURLs={fileUrlArr}
          noteObj={noteObj}
          annexureList={annexureList}
          referenceList={referenceList}

        />
      )}

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
        disableScrollLock
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("remark_&_sign")}</span>
          <Tooltip title={t("close")}>
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
          handleCorr={handleCorr}
          fileId={rowId}
          SignURL={noteUrl}
          flagNum={flagNumber}
          docId={fileId}
          isSignedCompleted={handleSignedCompleted}
        />
      </Dialog>

      <Dialog
        open={send}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setSend(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth={noteSigned ? "lg" : "md"}
        fullWidth
      >
        <Paper className="dialog_sendButton">
          <DialogTitle
            id="draggable-dialog-title"
            style={{ padding: "0px 24px !important", cursor: "move" }}
            className="send_dialog"
          >
            {t("forward_dak_for_review_approval")}
            <div>
              <Tooltip title={t("close")}>
                <IconButton
                  id="file_for_review_closeBtn"
                  aria-label="close"
                  onClick={() => setSend(false)}
                  color="primary"
                  style={{ float: "right" }}
                  className="cancel-drag"
                >
                  <Cancel
                    style={{
                      color: props.theme ? "#fff" : "inherit",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </DialogTitle>

          <CorrHrmDialog
            inbox={true}
            fileId={rowId}
            handleCloseEvent={(e) => {
              setOpen(false);
              setSend(false);
              setTimeout(() => {
                history.push({ pathname: "/eoffice/inbox/file" });
              }, 0);
            }}
            setSend={setSend}
            pfileName={corrNo}
            handleStatus={() => { }}
            signed={noteSigned}
            isInfo={mergeDak}
            seqArr={seqArr}
            deptCc={deptCc}
            deptInfo={deptInfo}
            deptTo={deptTo}
            deptWithin={deptWithin}
          />
        </Paper>
      </Dialog>

      <Dialog
        open={openSave}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenSave(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {t("save_in_index")}
          <Tooltip title={t("close")}>
            <IconButton
              id="setCoverLetterDialog_close_button"
              aria-label="close"
              onClick={() => setOpenSave(false)}
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
        <SaveInIndex handleClose={handleSave} corrDocId={rowId} create />
      </Dialog>

      <Dialog
        open={openReply}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenReply(false)
            setNof("")
          }
        }}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          {t("reply_correspondence")}
          <Tooltip title={t("close")}>
            <IconButton
              id="Personnel_btnClose"
              aria-label="close"
              onClick={() => {
                setOpenReply(false)
                setNof("")
              }}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "inherit",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <CorrespondenceForm
          handleClose={() => {
            setOpenReply(false)
            setNof("")
          }}
          handleClickFile={() => setCorrFile(true)}
          updateSubject={""}
          draftSubject={""}
          draftId={""}
          nofFile={nof}
          corrObj={corrObj}
          reply={true}
          id={rowId}
          selectNof={(file) => handleNof(file)}
        />
      </Dialog>

      <Dialog
        open={corrFile}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setCorrFile(false);
          }
        }}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          {t("select_corress_file")}
          <Tooltip title={t("close")}>
            <IconButton
              id="create_a_personal_file_closeBtn"
              aria-label="close"
              onClick={() => setCorrFile(false)}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <PersonalFileForm
          correspondence={true}
          handleClose={() => setOpenReply(false)}
          handleClickFile={() => setCorrFile(true)}
          updateSubject={""}
          fileSubject={""}
          fileId={""}
          selectNof={(file) => handleNof(file)}
        />
      </Dialog>

      <Dialog
        open={openClose}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenClose(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle
          style={{ cursor: "move" }}
          className="send_dialog"
          id="draggable-dialog-title"
        >
          <span>{t("confirmation")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              color="primary"
              style={{ float: "right" }}
              onClick={() => setOpenClose(false)}
              className="cancel-drag"
            >
              <Cancel
                style={{
                  cursor: "pointer",
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {t("are_you_sure_to_dis_this_corr")} ?{" "}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_fileList_cancel_button"
            variant="contained"
            endIcon={<Close />}
            onClick={() => setOpenClose(false)}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            id="redirectToSplitView_ok_button"
            variant="contained"
            onClick={handleDiscard}
            color="secondary"
            endIcon={<Done />}
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openNfa}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenNfa(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle
          style={{ cursor: "move" }}
          className="send_dialog"
          id="draggable-dialog-title"
        >
          <span>{t("confirmation")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              color="primary"
              style={{ float: "right" }}
              onClick={() => setOpenNfa(false)}
              className="cancel-drag"
            >
              <Cancel
                style={{
                  cursor: "pointer",
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {t("nfa_confirm_dak")} ?{" "}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_fileList_cancel_button"
            variant="contained"
            endIcon={<Close />}
            onClick={() => setOpenNfa(false)}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            id="redirectToSplitView_ok_button"
            variant="contained"
            onClick={handleNfa}
            color="secondary"
            endIcon={<Done />}
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={blnOpenHistory}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setblnOpenHistory(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        className="outbox-history"
        maxWidth="md"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("user_history")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="outbox_history_btn"
              onClick={(e) => setblnOpenHistory(false)}
              className="cancel-drag"
            >
              <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers style={{ maxHeight: "600px" }}>
          <Timeline align="left">
            {sampleData.map((item, index) => (
              <TimelineItem
                key={item.id}
                className={classes.historyTimeLine}
                style={{ display: "flex" }}
              >
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {item.typo}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={item.color || "grey"}
                    variant={item.variant || "outlined"}
                  />
                  {sampleData.length === index + 1 ? "" : <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    elevation={3}
                    style={{ backgroundColor: "#eaeaea" }}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "bold", color: "#000" }}
                    >
                      <span
                        style={{ fontWeight: "bold", color: "#000" }}
                      >{`${item.title}: `}</span>
                      {item.description}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
          <DocHistory
            deptName={deptName}
            extHistory={extList}
            history={historyObj}
          />
        </DialogContent>
      </Dialog>

      <Eric
        open={createEric}
        handleClose={handleEric}
        handleEric={handleCreateEric}
        ericType="Dak"
      />

      <Dialog
        open={isError}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          NOTIFICATION NOT FOUND
          <Tooltip title={t("close")}>
            <IconButton
              id="close_gateway_alert"
              aria-label="close"
              color="primary"
              size="small"
              onClick={resetError}
              style={{ float: "right", position: "relative", top: "0px" }}
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">{isError}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={resetError}>
            OK
          </Button>
        </DialogActions>
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
  deleteCorrAnnexureData,
  closeCorrespondence,
  moveToNfa,
  getHistoryOld,
  discardCorrespondence,
  getHistory
})(Note);
