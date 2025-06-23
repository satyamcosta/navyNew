import React, { useEffect, useState } from "react";
import {
  Button,
  List,
  Dialog,
  IconButton,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  Paper,
  Tooltip,
  Fab,
  TableBody,
  TableRow,
  Table,
  TableHead,
  TableContainer,
  Typography,
  Badge,
} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import CancelIcon from "@material-ui/icons/Cancel";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getHrmListData,
  createPANotingData,
  addPANotingData,
  getbyfilename,
  loadPartCaseData,
  loadInboxDataSplitView,
  createPartCaseServiceLetter,
  getServiceLetterList,
  uploadPcAnnexure,
} from "../../../camunda_redux/redux/action";
import { setPassData } from "../../../camunda_redux/redux/ducks/passData";
import Grid from "@material-ui/core/Grid";
import NofFilesTable from "./NofFilesTable";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import "../therme-source/material-ui/loading.css";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { changingTableStateHrmConcern } from "app/camunda_redux/redux/action/apiTriggers";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import { returnPA } from "app/camunda_redux/redux/action";
import Cookies from "js-cookie";
import HrmDialog from "./HrmDialog";
import SendIcon from "@material-ui/icons/Send";
import PcFileUpload from "./PcFileUpload";
import PaginationComp from "app/views/utilities/PaginationComp";
import { fileListTableStyle } from "../therme-source/material-ui/InboxStyle";
import { handleError } from "utils";
import { setGateway } from "app/camunda_redux/redux/ducks/GatewayReducer";
import SendFileForm from "app/views/Personnel/SendFileForm";
import history from "../../../../history";
import { Announcement } from "@material-ui/icons";
import Remarks from "./Remarks";
import Comments from "../Comments";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const FileListTable = (props) => {
  let type = Cookies.get("type");
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const classes = fileListTableStyle();
  const dispatch = useDispatch();
  let referenceNumber = Cookies.get("referenceNumber");

  const [blnDisableNext, setBlnDisableNext] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [hrmConcernURL, setHRMConcernURL] = useState("");
  const [fileTrackID, setFileTrackID] = useState("");
  const [fileNumber, setFileNumber] = useState("");
  const [custodian, setCustodian] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRowIndex, setSelectedRowIndex] = useState(1);
  const [personName, setPersonName] = useState("");
  const [nofFileID, setNofFileID] = useState("");
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [blnOpenDialog, setBlnOpenDialog] = useState(false);
  const [blnOpenRTA, setBlnOpenRTA] = useState(false);
  const [extension, setExtension] = useState("docx");
  const [serviceLetterId, setServiceLetterId] = useState("");
  const [send, setSend] = useState(false);
  const [existingNof, setExistingNof] = useState("");
  const [partcaseButton, setPartcaseButton] = useState(false);
  const [variable, setVariable] = useState(true);
  const [nofRowData, setNofRowData] = useState(null);

  const [sendPa, setsendPa] = useState(false);
  const [isPa, setisPa] = useState(false);
  const [paId, setpaId] = useState("");
  const [paSubject, setPaSubject] = useState("");

  const [comment, setComment] = useState(false);
  const [commentList, setCommentList] = useState([]);

  const { fileID } = props;

  const InboxID = sessionStorage.getItem("InboxID");
  const { blnValueHrm } = props.subscribeApi;

  // Variable to control disable of some feature in case 504
  const [dsblPa, setdsblPa] = useState(false);

  useEffect(() => {
    if (props.disableArr.includes("hrm-pa")) {
      setdsblPa(true);
      setOpenConfirmation(false);
      setBlnOpenDialog(false);
    } else {
      setdsblPa(false);
    }
  }, [props.disableArr]);

  const loadHrmData = () => {
    props
      .getHrmListData(InboxID)
      .then((resp) => {
        const tmpArr = [];
        try {
          if (resp.error) {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            props.blnEnableLoader(false);
            return;
          } else if (resp !== undefined) {
            tmpArr.push({
              index: 0,
              url: resp.annexureData[0].fileUrl,
              name: resp.annexureData[0].applicationList.subject,
              subject: resp.annexureData[0].applicationList.subject,
              contentID: resp.paId,
              annotId: resp.annotationId,
              flag: "PA",
              id: 0,
              serialNo: 1,
            });

            for (let i = 0; i < resp.annexures.length; i++) {
              tmpArr.push({
                index: i + 1,
                url: resp.annexures[i].annexureFileURL,
                name: resp.annexures[i].fileName,
                subject: resp.annexures[i].subject,
                contentID: resp.annexures[i].contentId,
                annotId: resp.annexures[i].annotationId,
                flag: "Annexure",
                id: i + 1,
                serialNo: i + 2,
              });
            }
            props.blnEnableLoader(false);
            if (resp.annexureData !== undefined) {
              resp.annexureData[0].fileUrl;
              props.blnShowPdf(true);
            }
            props.changingTableStateHrmConcern(false, "CHANGE_HRM");
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
          }
          setRowData(tmpArr);
          setTotalCount(tmpArr.length);
          setHRMConcernURL(tmpArr[0].url);
          setCommentList(resp.comment);
          props.flagValue(tmpArr[0].flag);
          props.annotID(resp.annotationId);
          props.contentID(tmpArr[0].contentID);
          setFileTrackID(resp.fileTrackId);
          setisPa(resp.annexureData[0]?.type == "PA");
          setpaId(resp.paId);
          setPaSubject(resp.annexureData[0]?.applicationList?.subject);
          let inboxId = resp.annexureData[0]?.inboxId;
          sessionStorage.setItem("inboxId", inboxId);
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const loadServiceLetter = () => {
    Cookies.set("HrmRole", null);
    const inboxId = sessionStorage.getItem("InboxID");
    const department = sessionStorage.getItem("department");
    const userName = localStorage.getItem("username");
    const role = sessionStorage.getItem("role");

    props
      .getServiceLetterList(inboxId, department, userName, role)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            props.blnEnableLoader(false);
            const tmpArr = [];
            props.blnShowPdf(true);
            setServiceLetterId(resp.id);
            setExistingNof(resp.existingNof);
            setFileNumber(resp.existingNof);
            setPersonName(resp.existingNofName);
            setNofRowData(resp);
            if (resp.existingNof) {
              setPartcaseButton(true);
            }
            if (resp.existingNof) {
              setBlnDisableNext(false);
            }
            resp.coverLetterDocs.map((item, index) => {
              tmpArr.push({
                url: item.fileUrl,
                name: item.fileName,
                subject: item.subject,
                contentID: "",
                annotId: "",
                flag: "PA",
                id: index,
                serialNo: index + 1,
              });
            });
            setRowData(tmpArr);
            setHRMConcernURL(tmpArr[0].url);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  useEffect(() => {
    props.blnEnableLoader(true);
    type === "PA" ? loadHrmData() : loadServiceLetter();
  }, [blnValueHrm, InboxID, type]);

  useEffect(() => {
    if (props.pdfLoadsHRM == true && hrmConcernURL !== undefined) {
      props.blnShowPdf(true);
      let data = { extension, url: hrmConcernURL };
      if (variable) {
        dispatch(setPassData(data));
        setVariable(false);
      } else {
        dispatch(setPassData(data));
      }
    }
  }, [props.pdfLoadsHRM, hrmConcernURL]);

  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;
    let tempArr = rowData.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  const callMessageOut = (message) => {
    props.blnEnableLoader(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClick = (rowData) => {
    setSelectedRowIndex(rowData.serialNo);
    let arr = rowData.name.split(".");
    arr.length !== 1 ? setExtension(arr[arr.length - 1]) : setExtension("docx");
    props.contentID(rowData.contentID);
    props.flagValue(rowData.flag);
    props.annotID(rowData.annotId);
    setHRMConcernURL(rowData.url);
  };

  const nofHandleClick = (val) => {
    setFileNumber(val.fileno);
    setPersonName(val.filename);
    setCustodian(val.custodian);
    setNofRowData(val);
    // setBlnOpenDialog(false);
    setBlnDisableNext(false);
    setOpenConfirmation(true); // select nof and immediatly open dialog to create partcase
  };

  const handleOpenDialog = () => {
    setBlnOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setBlnOpenDialog(false);
  };

  const handleCloseRTA = () => {
    setBlnOpenRTA(false);
  };

  const handleRedirectToSplitView = () => {
    setOpenConfirmation(false);
    setBlnOpenDialog(false);
    props.blnEnableLoader(true);
    const roleName = sessionStorage.getItem("role");
    const groupName = sessionStorage.getItem("department");
    const userName = localStorage.getItem("username");
    {
      partcaseButton
        ? props
            .addPANotingData(userName, groupName, serviceLetterId, InboxID)
            .then((resp) => {
              try {
                if (resp.error) {
                  let errMsg = handleError(resp.error, true);
                  if (errMsg?.flag) {
                    handle504();
                    props.blnEnableLoader(false);
                    return;
                  }
                  callMessageOut(resp.error);
                  props.blnEnableLoader(false);
                } else {
                  props.blnEnableLoader(false);
                  Cookies.set("referenceNumber", resp.referenceNumber);
                  Cookies.set("backPath", "/eoffice/inbox/file");
                  history.push({ pathname: "/eoffice/splitView/file" });
                }
              } catch (e) {
                callMessageOut(e.message);
                props.blnEnableLoader(false);
              }
            })
            .catch((e) => {
              callMessageOut(e.message);
              props.blnEnableLoader(false);
            })
        : props
            .createPANotingData(
              fileTrackID,
              roleName,
              userName,
              groupName,
              personName,
              nofFileID,
              fileNumber,
              custodian,
              type === "PA" ? false : true,
              serviceLetterId,
              nofRowData
            )
            .then((resp) => {
              try {
                if (resp.error) {
                  let errMsg = handleError(resp.error, true);
                  if (errMsg?.flag) {
                    handle504();
                    props.blnEnableLoader(false);
                    return;
                  }
                  callMessageOut(resp.error);
                  props.blnEnableLoader(false);
                } else {
                  props.blnEnableLoader(false);
                  Cookies.set("referenceNumber", resp.referenceNumber);
                  Cookies.set("backPath", "/eoffice/inbox/file");
                  history.push({ pathname: "/eoffice/splitView/file" });
                }
              } catch (e) {
                callMessageOut(e.message);
                props.blnEnableLoader(false);
              }
            })
            .catch((e) => {
              callMessageOut(e.message);
              props.blnEnableLoader(false);
            });
    }
  };

  const handle504 = () => {
    dispatch(
      setGateway(
        true,
        "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!",
        "hrm-pa",
        "/eoffice/inbox/file"
      )
    );
    setTimeout(() => {
      dispatch(setGateway(false, "", "hrm-pa", ""));
    }, 30000);
  };

  const group = sessionStorage.getItem("displayDept");

  const handleReturnPA = () => {
    props.blnEnableLoader(true);
    props
      .returnPA(props.paId, group)
      .then((resp) => {
        try {
          if (typeof resp === "object" && resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
          } else {
            props.blnEnableLoader(false);
            dispatch(setSnackbar(true, "success", t("return_pa_success")));
            history.push({ pathname: "/eoffice/inbox/file" });
          }
        } catch (error) {
          console.log(error);
          callMessageOut(error.message);
          props.blnEnableLoader(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        props.blnEnableLoader(false);
      });
  };

  return (
    <div className={classes.mainDiv}>
      {type !== "PA" && !existingNof && (
        <div className={`${classes.position_btn}`}>
          <PcFileUpload
            loadServiceLetter={loadServiceLetter}
            serviceLetterId={serviceLetterId}
          />
          <Tooltip title={t("send")}>
            <Fab
              color="secondary"
              size="medium"
              className={`${classes.sign_btn}`}
              onClick={() => setSend(true)}
            >
              <SendIcon style={{ marginLeft: "3px" }} />
            </Fab>
          </Tooltip>
        </div>
      )}
      {isPa && (
        <div className={`${classes.position_btn}`}>
          <Tooltip title={t("send")}>
            <Fab
              color="secondary"
              size="medium"
              className={`${classes.sign_btn}`}
              onClick={() => setsendPa(true)}
            >
              <SendIcon style={{ marginLeft: "3px" }} />
            </Fab>
          </Tooltip>
        </div>
      )}
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
              className="hrn_row"
              style={{
                fontWeight: "600",
                borderBottom: `1px solid ${
                  props.theme ? "#727070" : "#c7c7c7"
                }`,
              }}
            >
              <div>
                <span>{t("SN")}</span>
              </div>
              <div>
                <span>{t("list_of_files")}</span>
              </div>
            </div>
          </div>
          <TableBody
            component="div"
            style={{
              height: "35vh",
              overflow: "auto",
            }}
          >
            {/* Mapping data coming from backnd */}

            {rowData.map((item, i) => {
              return (
                <TableRow
                  hover
                  component="div"
                  onClick={() => handleClick(item)}
                  key={i}
                  className={`inbox_row ${
                    selectedRowIndex === i + 1 ? "active" : ""
                  }`}
                >
                  <div
                    className="hrn_row"
                    style={{
                      borderBottom: `1px solid ${
                        props.theme ? "#727070" : "#c7c7c7"
                      }`,
                    }}
                  >
                    <div className="info1">
                      <span>{item.serialNo}</span>
                    </div>
                    <div className="info2 text-overflow">
                      <Tooltip title={item.subject}>
                        <span>{item.subject}</span>
                      </Tooltip>
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
      <>
        <Grid
          className="inbox-tab"
          container
          justifyContent="center"
          spacing={2}
          style={{ marginTop: "10px" }}
        >
          <Grid container>
            <Grid item container xs={12} justifyContent="space-evenly">
              {type == "PA" && (
                <Button
                  id="returnPA_button"
                  variant="contained"
                  color="primary"
                  onClick={handleReturnPA}
                  startIcon={<SkipPreviousIcon />}
                  className={classes.button}
                >
                  {t("return_pa")}
                </Button>
              )}
              {!existingNof && (
                <Button
                  id="selectFile_insert_button"
                  variant="contained"
                  color={"secondary"}
                  onClick={handleOpenDialog}
                  endIcon={<InsertDriveFileIcon />}
                  className={classes.button}
                >
                  {t("create_part_case_file")}
                </Button>
              )}
              {partcaseButton && (
                <Button
                  id="inbox_partcase_skip_button"
                  disabled={blnDisableNext}
                  variant="contained"
                  color="secondary"
                  onClick={() => setOpenConfirmation(true)}
                  endIcon={<SkipNextIcon />}
                  className={classes.button}
                >
                  {t("add_to_partcase")}
                </Button>
              )}
              {isPa && (
                <Badge
                  badgeContent={commentList?.length}
                  color="error"
                  // className="viewone-badge"
                  showZero
                  overlap="rectangular"
                >
                  <Button
                    id="inbox_partcase_comment_button"
                    variant="contained"
                    color="secondary"
                    onClick={() => setComment(true)}
                    endIcon={<Announcement />}
                    className={classes.button}
                  >
                    {t("Comments")}
                  </Button>
                </Badge>
              )}
            </Grid>
          </Grid>
        </Grid>
        {/* <FormControl className={classes.formControl}>
          <List
            style={{ zIndex: "0" }}
            dense={true}
            className={personName ? classes.list : classes.dNone}
          >
            <p>
              <b>File No. :</b> {fileNumber} <br />
              <b>File Name. :</b> {personName}
            </p>
          </List>
        </FormControl> */}
      </>

      <Dialog
        open={openConfirmation}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenConfirmation(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" align="center" gutterBottom>
            {t("are_you_sure_to_create_a_part_case")} ?{" "}
          </Typography>
          <Typography variant="subtitle2">
            File No :{fileNumber} <br /> File Name :{personName}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_fileList_cancel_button"
            variant="contained"
            onClick={() => setOpenConfirmation(false)}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            id="redirectToSplitView_ok_button"
            variant="contained"
            onClick={handleRedirectToSplitView}
            color="secondary"
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={blnOpenDialog}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleCloseDialog();
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          onClose={handleCloseDialog}
          className="dialog_title"
        >
          <span>{t("part_case_file_creation")}</span>
          <>
            <Tooltip title={t("close")}>
              <IconButton
                id="inbox_closeDialog_button"
                aria-label="close"
                onClick={handleCloseDialog}
                color="primary"
                style={{ float: "right" }}
                className="cancel-drag"
              >
                <CancelIcon style={{ color: "#484747" }} />
              </IconButton>
            </Tooltip>
          </>
        </DialogTitle>
        <NofFilesTable
          onSelectFileData={nofHandleClick}
          onSelectFileID={(id) => setNofFileID(id)}
        />
      </Dialog>

      <Dialog
        open={blnOpenRTA}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleCloseRTA();
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("return_application")} ?
        </DialogTitle>
        <DialogContent>
          <FormControl className={classes.txtFieldFormControl}>
            <TextField
              id="txtReason"
              label="Reason"
              multiline
              minRows={4}
              fullWidth
              variant="outlined"
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            id="cancelRTA_button"
            onClick={handleCloseRTA}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            id="closeRTA_ok_button"
            onClick={handleCloseRTA}
            color="primary"
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
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
        maxWidth="sm"
        fullWidth
      >
        <Paper>
          <DialogTitle
            id="draggable-dialog-title"
            style={{ padding: "0px 24px !important", cursor: "move" }}
            className="dialog_title"
          >
            {t("send_to")}

            <IconButton
              id="inbox_send_to_close_button"
              aria-label="close"
              onClick={() => setSend(false)}
              color="primary"
              style={{ float: "right" }}
              className="cancel-drag"
            >
              <CancelIcon style={{ color: "#484747" }} />
            </IconButton>
          </DialogTitle>
          <HrmDialog
            handleClose={() => setSend(false)}
            pfileName={referenceNumber}
            serviceLetterId={serviceLetterId}
          />
        </Paper>
      </Dialog>

      <Dialog
        open={sendPa}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setsendPa(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <Paper className="dialog_sendButton">
          <DialogTitle
            id="draggable-dialog-title"
            style={{ padding: "0px 24px !important", cursor: "move" }}
            className="send_dialog"
          >
            {t("forward_file_for_review_approval")}
            <div>
              <Tooltip title={t("close")}>
                <IconButton
                  id="file_for_review_closeBtn"
                  aria-label="close"
                  onClick={() => setsendPa(false)}
                  color="primary"
                  style={{ float: "right" }}
                  className="cancel-drag"
                >
                  <CancelIcon
                    style={{
                      color: props.theme ? "#fff" : "#484747",
                    }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          </DialogTitle>

          <SendFileForm
            fileId={paId}
            handleCloseEvent={(e) => {
              setsendPa(false);
            }}
            setSend={setSend}
            pfileName={paSubject}
            handleStatus={() => {}}
            isPa={isPa}
          />
        </Paper>
      </Dialog>

      <Comments
        open={comment}
        handleClose={(val) => setComment(val)}
        commentList={commentList}
      />
    </div>
  );
};
function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
    disableArr: state.gateway.disableArr,
  };
}

export default connect(mapStateToProps, {
  getbyfilename,
  getHrmListData,
  createPANotingData,
  addPANotingData,
  changingTableStateHrmConcern,
  returnPA,
  loadPartCaseData,
  loadInboxDataSplitView,
  createPartCaseServiceLetter,
  getServiceLetterList,
  uploadPcAnnexure,
})(FileListTable);
