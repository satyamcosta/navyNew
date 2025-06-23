import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  makeStyles,
  useTheme,
  MenuItem,
  Tooltip,
  Paper,
  TextField,
  Fab,
  InputAdornment,
  DialogActions,
  FormControlLabel,
  DialogContentText,
  RadioGroup,
  Radio,
  Typography,
  Menu,
  Box,
  Badge,
  Tabs,
  Tab,
  TableRow,
  TableBody,
  Table,
  TableContainer,
} from "@material-ui/core";
import HeadersAndFootersView from "../../../../FileApproval/documentEditor/editor";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import PdfViewer from "app/pdfViewer/pdfViewer";
import {
  getPANotingData,
  getPAEnclosureData,
  loadPartCaseData,
  loadInboxDataSplitView,
  savePartCaseTag,
  fetchSplitViewTags,
  createPartCaseNotingFile,
  createCoverLetter,
  rollbackSplitViewDocument,
  rollbackSplitViewEnclosureDocument,
  deleteEnclosure,
  editFlagNumber,
  validateFlagNumber,
  loadRtiPartCaseData,
  rollbackRtiSplitViewDocument,
  rollbackRtiSplitViewEnclosureDocument,
  saveRtiFile,
  loadRtiDataSplitView,
  returnRti,
  sendbackRti,
  getdownloadZip,
  deleteEnclosureRti,
  fetchSplitViewTagsRti,
  savePartCaseTagRti,
  editRtiFlagNumber,
  getcabinetpartcase,
  openFile,
  MoveToCC,
  MoveToBM,
  editEncoSubject,
  deleteNoting,
  URLHide,
  moveToNfa,
  getHistoryOld,
  createPC,
  getHistory,
  linkFile
} from "../../../../../camunda_redux/redux/action";
import { sendToCoord } from "app/camunda_redux/redux/action/backend-rest/initiate-data";
import { Loading } from "../../../therme-source/material-ui/loading";
import { setInboxDatas } from "../../../../../redux/actions/InboxActions";
import history from "../../../../../../history";
import { setPassData } from "../../../../../camunda_redux/redux/ducks/passData";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import CancelIcon from "@material-ui/icons/Cancel";
import InputForm from "../../quickSignFrom";
import "../../../therme-source/material-ui/loading.css";
import SplitViewPdfViewer from "../../pdfViewer/pdfViewer";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import Cookies from "js-cookie";
import NoteAddIcon from "@material-ui/icons/NoteAdd";
import AddCommentIcon from "@material-ui/icons/AddComment";
import LinkIcon from "@material-ui/icons/Link";
import ScheduleIcon from "@material-ui/icons/Schedule";
import UpdateIcon from "@material-ui/icons/Update";
import CommentIcon from "@material-ui/icons/Comment";
import FileUploader from "../../FileUpload";
import FileScanned from "../../EnclosureScanned";
// import RtiUploader from "app/views/RTI/sharedComponents/RtiUploader";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import ShareIcon from "@material-ui/icons/Share";
import CreateIcon from "@material-ui/icons/Create";
import SendIcon from "@material-ui/icons/Send";
import HrmDialog from "../../HrmDialog";
import RtiHrmDialog from "../../RtiHrmDialog";
import CoverLetterDialog from "../../CoverLetterDialog";
import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import {
  Announcement,
  ArrowBack,
  ImportContacts,
  Replay,
  Search,
  MoreHoriz,
  Done,
  Close,
  History,
  Delete,
  Cancel,
  CallToAction
} from "@material-ui/icons";
import {
  Autocomplete,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import DeleteIcon from "@material-ui/icons/Delete";
import LocalOfferIcon from "@material-ui/icons/LocalOffer";
import { unstable_batchedUpdates } from "react-dom";
import GetAppIcon from "@material-ui/icons/GetApp";
import { CgNotes } from "react-icons/cg";
import Axios from "axios";
import { saveAs } from "file-saver";
import { FaBarcode, FaRegCalendarTimes } from "react-icons/fa";
import { useContext } from "react";
import { BmContext } from "./Worker";
import { SplitViewContext } from "../Worker";
import ChatGptDialog from "../../ChatGptDialog";
import SwipeableViews from "react-swipeable-views";
import NotingUplaod from "../../NotingUplaod";
import NotingScanned from "../../NotingScanned";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import ArchiveIcon from "@material-ui/icons/Archive";
import "./style.css";
import { handleError } from "utils";
import DocHistory from "app/views/outbox/shared/DocHistory";
import CreatePC from "app/views/Cabinet/folder/CreatePC";
import BarcodeView from "app/views/Cabinet/folder/BarcodeView";
import { validateYupSchema } from "formik";
import PaginationComp from "app/views/utilities/PaginationComp";
import LinkedFileTable from "../../LinkedFileTable";
import Eric from "app/views/Cabinet/folder/Eric";
import MonitorStatus from "../../MonitorStatus";
import ShareFile from "../../ShareFile";
import ActionPointForm from "../../CorrespondenceView/ActionPointForm"

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3}>
          <Grid>{children}</Grid>
        </Box>
      )}
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  mainDiv: {
    textAlign: "center",
  },
  formControl: {
    marginTop: 7,
    width: 300,
    "& .MuiAutocomplete-inputRoot[class*='MuiOutlinedInput-root'][class*='MuiOutlinedInput-marginDense'] .MuiAutocomplete-input":
    {
      padding: "1.8px 4px",
    },
    "& .MuiInputBase-root": {
      lineHeight: "0.776em",
    },
    "& .MuiSelect-selectMenu": {
      minHeight: "0.776em",
    },
    // minWidth: 150,
    // maxWidth: 250,
  },
  button: {
    marginTop: 6,
    marginLeft: 4,
    minWidth: "16px",
    padding: "10px 12px",
    boxShadow: "none",
    // backgroundColor: "#484747"
  },
  uploadButton: {
    marginTop: 6,
    marginLeft: 4,
    // backgroundColor: "#484747"
  },
  highlighteduploadButton: {
    marginTop: 6,
    marginLeft: 4,
    // backgroundColor: "#484747"
    // height: "1px",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    "&:hover": {
      //   backgroundColor: "rgba(89, 82, 82, 0.15)",
      boxShadow:
        "rgba(14, 30, 37, 0.12) 2px 7px 10px 3px, rgba(14, 30, 37, 0.42) 0px 2px 16px 4px",
      //   color: "#000",
      fontWeight: "bold",
      zIndex: "1",
      transform: "scale(1.05)",
    },
  },

  CreateButton: {
    padding: "10px 12px",
    minWidth: "16px",
    position: "relative",
    top: "6px",
    marginLeft: "4px",
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
  remark_btn: {
    position: "fixed",
    left: "5% !important",
    bottom: "17% !important",
    zIndex: 10,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },
  yellowNote_btn: {
    position: "fixed",
    left: "5% !important",
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
    bottom: "75px",
    right: "35px",
    boxShadow: "none",
    "& .MuiFab-root": {
      height: "48px",
      width: "48px",
    },
  },
  sendIcon: {
    position: "fixed",
    bottom: theme.spacing(2),
    right: "35px",
    zIndex: 100,
    boxShadow: "none",
  },
  sDialIcon: {
    position: "relative",
  },
  cabinetOpen_btn: {
    position: "fixed",
    right: "8px !important",
    bottom: "40px !important",
    zIndex: 5,
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
  },

  nonhighlightbutton: {
    marginTop: 7,
    marginLeft: 4,
    minWidth: "16px",
    padding: "8px 10px",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    "&:hover": {
      //   backgroundColor: "rgba(89, 82, 82, 0.15)",
      boxShadow:
        "rgba(14, 30, 37, 0.12) 2px 7px 10px 3px, rgba(14, 30, 37, 0.42) 0px 2px 16px 4px",
      //   color: "#000",
      fontWeight: "bold",
      zIndex: "1",
      transform: "scale(1.05)",
      //   "& $icon": {
      //     display: "none", // Hide the default icon on hover
      //   },
      //   "& $hoverIcon": {
      //     display: "inline-block", // Show the hover icon on hover
      //   },
    },
  },

  nonhighlightedButton: {
    color: "black",
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
    boxShadow: "none",
    "&:hover": {
      backgroundColor: "rgba(89, 82, 82, 0.15)",
      color: "#000",
      fontWeight: "bold",
      zIndex: "1",
      // transform: "scale(1.1)",
      "& $icon": {
        display: "none", // Hide the default icon on hover
      },
      "& $hoverIcon": {
        display: "inline-block", // Show the hover icon on hover
      },
    },
  },
  icon: {
    display: "inline-block", // Display the default icon
  },
  hoverIcon: {
    display: "none", // Initially hide the hover icon
  },
  nonhighlighteduploadButton: {
    marginTop: 6,
    marginLeft: 4,
    color: "black",
    "&:hover": {
      backgroundColor: "rgba(89 82 82 / 20%)", // Darker background color on hover
      color: "#000", // Darker icon color on hover
      fontWeight: "bold", // Bold icon on hover
      zIndex: "1",
      "& $icon": {
        display: "none", // Hide the default icon on hover
      },
      "& $hoverIcon": {
        display: "inline-block", // Show the hover icon on hover
      },
    },
  },
}));

const ViewOne = (props) => {
  const { t } = useTranslation();

  const theme = useTheme();

  let external = Cookies.get("external") == "true";    // Opening from externam cabinet

  let title = Cookies.get("inboxFile");
  let partCase = Cookies.get("partCase") == "true";
  let isRti = Cookies.get("isRti");
  const WaitingRoom = Cookies.get("WaitingRoom");
  const FileID = Cookies.get("partcaseId");
  let creater = Cookies.get("creater");
  let isRegister = Cookies.get("isRegister");
  let Rtioutbox = Cookies.get("Rtioutbox");
  let forwardRti = Cookies.get("isForward");
  let cabinetIcon = Cookies.get("cabinetStatus");
  let isCabinet = Cookies.get("isCabinet") === "true";
  let cabinetpartcase = Cookies.get("cabinetpartcase");
  let pcId = sessionStorage.getItem("partcaseID");
  const deptName = sessionStorage.getItem("department");

  let isDraft = Cookies.get("isDraft") === "true";
  const isIndex = Cookies.get("isIndex") === "true";

  const isOutbox = Cookies.get("isOutbox") == "true";
  const monitor = Cookies.get("monitor") == "true";
  const outboxId = Cookies.get("outboxId");
  let referenceNumber = Cookies.get("referenceNumber");
  const department = sessionStorage.getItem("department");
  const rolename = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");
  const backPath = Cookies.get("backPath");
  const share = Cookies.get("share") === "true";
  const [fileUrlwithNameNoting, setFileUrlWithNameNoting] = useState([]);
  const [fileUrlwithNameEnclousere, setFileUrlWithNameEnclousere] = useState([]);

  const nfa = Cookies.get("nfa") === "false";

  let enclosureNo = Cookies.get("enc");
  let notingNo = Cookies.get("not");

  const classes = useStyles();
  const dispatch = useDispatch();

  const {
    NOF,
    setNOF,
    NOF1,
    setNOF1,
    sfdtData,
    setSfdtData,
    prevEnclouser,
    setPrevEnclouser,
    blnVisible,
    setBlnVisible,
    rowID,
    setRowID,
    enclosureData,
    setEnclosureData,
    enclosureArr,
    setEnclosureArr,
    open,
    setOpen,
    URL,
    setURL,
    pdfLoads,
    setpdfLoads,
    enclosurePdfLoads,
    setEnclosurePdfLoads,
    blnHideSyncfusion,
    setBlnHideSyncfusion,
    openInPdf,
    setOpenInPdf,
    blnDisable,
    setBlnDisable,
    prevVersionId,
    setPrevVersionId,
    fileChange,
    setFileChange,
    notingURL,
    setNotingURL,
    flag,
    setFlag,
    partCaseId,
    setPartCaseId,
    flagNumber,
    setFlagNumber,
    prevFlagNumberNF,
    setPrevFlagNumberNF,
    prevFlagNumberEnclouser,
    setPrevFlagNumberEnclouser,
    hrmRole,
    setHrmRole,
    hrmDepartmet,
    setHrmDepartmet,
    coverLetter,
    openInternalcomment,
    setopenInternalcomment,
    setCoverLetter,
    coverLetterDialog,
    setCoverLetterDialog,
    extension,
    setExtension,
    extension2,
    setExtension2,
    hasCoverNote,
    setHasCoverNote,
    enclosureSigned,
    setEnclosureSigned,
    notingSigned,
    setNotingSigned,
    blnDisableForward,
    setBlnDisableForward,
    notingData,
    setNotingData,
    send,
    setSend,
    serviceLetterId,
    setServiceLetterId,
    departmentList,
    setDepartmentList,
    status,
    setStatus,
    notingStatus,
    setNotingStatustatus,
    page,
    setPage,
    pageNumber,
    setPageNumber,
    isPdf,
    setIsPdf,
    isDocx,
    setIsDocx,
    isDoc,
    setIsDoc,
    openDialog,
    setOpenDialog,
    touched,
    setTouched,
    flagVal,
    setFlagVal,
    FlagNoArr,
    setFlagNoArr,
    isValid,
    setisValid,
    enclosureAnnoiD,
    setEnclosureAnnoiD,
    enclosurelen,
    setEnclosureLen,
    isrtiforward,
    setIsRtiForward,
    openConfirmation,
    setOpenConfirmation,
    nofAnnoId,
    setNofAnnoId,
    rtifilename,
    setRtifilename,
    addNote,
    setaddNote,
    openRemarks,
    setopenRemarks,
    openYellowNotes,
    setopenYellowNotes,
    cahtGpt,
    setChatGpt,
    count1,
    count2,
    setcount,
    closeFile,
    setcloseFile,
    canClose,
    setcanClose,
    openSpeedDial,
    setOpenSpeedDial,
    pdfViewerButtons,
    setPdfViewerButtons,
    loadSplitViewData,
    loadRtiData,
    fileId,
    setFileId,
    docId,
    isBM, // this will determine whether it is splitview of bm or coalition
    upload,
    setUpload,
    totalFlags,
    settotalFlags,
    ntguploader,
    setNtgUploader,
    ntgstatus,
    notingFlag,
    setNotingFlag,
    dakList,
    setDakList,
    loadData,
    notinglen,
    setNotinglen,
    daklen,
    setDaklen,
    setnotingDocId,
    ntngDocid,
    setenclosureDocId,
    encDocid,
    setNtgStatus,
    filestatus,
    setFilestatus,
    externalList,
    internalList,
    externalInList,
    creator,
    mainFile,
    barCode,
    isLf,
    linkfiles,
    setLinkfiles,
    totalLF,
    linkF,
    setLinkF,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    isError,
    setIsError,
  } = useContext(BmContext);

  const { loading, setLoading, pendingRoute,
    completedRoute, } = useContext(SplitViewContext);

  // State to perform auto save on undo of document
  const [reSaveNof, setreSaveNof] = useState(false);
  const [reSaveEnco, setreSaveEnco] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [toggleState, setToggleState] = useState(true);

  const [resize, setResize] = useState(false);

  // To re-load document when clicked on action uri present in pdf
  const [reLoadPDf, setReLoadPDf] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElNtg, setAnchorElNtg] = useState(null);
  const [swapFlag, setSwapFlag] = useState("");

  // Variable to control disable of some feature in case 504
  const [dsblSign, setdsblSign] = useState(false);

  // const [jsonnof, setJsonNof] = useState(JSON.parse(NOF));

  const [openNfa, setOpenNfa] = useState(false);
  const [openLF, setopenLF] = useState(false);

  const [sampleData, setSampleData] = useState([]);
  const [apOpenForm, setAPOpenForm] = useState(false);
  const [fileUrls, setfileUrls] = useState([]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLfAdd = (lfObj) => {
    loadSplitViewData();
    setopenLF(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickNtg = (event) => {
    setAnchorElNtg(event.currentTarget);
  };

  const handleCloseNtg = () => {
    setAnchorElNtg(null);
  };

  // state for open cloud table dialog
  const [opencloud, setopenCloud] = useState(false);

  // State to manage flag no swap
  const [value, setValue] = useState(0);

  const [encoSubject, setEncoSubject] = useState("");

  const [historyObj, setHistoryObj] = useState({});
  const [extList, setExtList] = useState([]);
  const [dept, setDeptName] = useState("");
  const [blnOpenHistory, setblnOpenHistory] = useState(false);

  const [openPc, setOpenPc] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [pcSubject, setPcSubject] = useState(title);

  const [createEric, setCreateEric] = useState(false);

  // To keep track of sign only on latest-noting
  const [canSign, setCanSign] = useState(true)

  useEffect(() => {
    if (NOF) {
      let notingObj = JSON.parse(NOF)
      setCanSign(notingObj?.fileName == notingData[0]?.fileName)
    }
  }, [NOF, notingData])


  const handleEric = (val) => setCreateEric(val);
  const handleCreateEric = () => {
    setCreateEric(false);
    dispatch(setSnackbar(true, "success", t("create_eric_suc")));
    // history.push({
    //   pathname: `${backPath ? backPath : "/eoffice/inbox/file"}`,
    // });
  };

  const [monitorStatus, setMonitorStatus] = useState(false);
  const handleMonitor = (val) => setMonitorStatus(val);

  const [openShare, setOpenShare] = useState(false);
  const handleShare = (val) => setOpenShare(val);

  const handlePopupClose = () => {
    setBarcodeOpen(false);
  };

  const handlePC = (val) => {
    if (!val) setPcSubject(Cookies.get("inboxFile"));
    setOpenPc(val);
  };

  const handleLF = (val) => {
    setopenLF(val);
  };

  const resetError = () => {
    setIsError(false)
    history.goBack()
  }

  const handleClickPc = (rowItem) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("subject", pcSubject);
    formData.append("fileName", referenceNumber);
    formData.append("classification", "Unclassified");
    props
      .createPC(formData)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            setLoading(false);
          } else {
            dispatch(setSnackbar(true, "success", t("file_pc")));
            handlePC(false);
            setLoading(false);
          }
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        setLoading(false);
      });
    history.push({
      pathname: `${backPath ? backPath : "/eoffice/inbox/file"}`,
    });
  };

  const handleChangePage = (val) => {
    setPage(val);
  };

  const showSWpdf = () => {
    if (pdfLoads) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    let id = enclosureNo;
    setFileUrlWithNameEnclousere(enclosureArr)
    if (id) {
      enclosureArr.some((item, i) => {
        if (item.fileId == id) {
          handleChange1(item);
          return true;
        }
      });
    }
  }, [enclosureNo, enclosureArr]);

  useEffect(() => {
    let id = notingNo;
    if (id) {
      notingData.some((item, i) => {
        if (item.fileId == id) {
          let newVal = {
            target: {
              value: JSON.stringify(item),
            },
          };
          handleChange(newVal);
          return true;
        }
      });
    }
  }, [notingNo, notingData]);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (
      props.disableArr.includes("inbox-sign") ||
      props.disableArr.includes("inbox-send")
    ) {
      setdsblSign(true);
      setOpen(false);
      setSend(false);
    } else {
      setdsblSign(false);
    }
  }, [props.disableArr]);

  useEffect(() => {
    let id = enclosureNo;
    if (id) {
      enclosureArr.some((item, i) => {
        if (item.fileId == id) {
          handleChange1(item);
          return true;
        }
      });
    }
  }, [enclosureNo, enclosureArr]);

  useEffect(() => {
    let id = notingNo;
    if (id) {
      notingData.some((item, i) => {
        if (item.fileId == id) {
          let newVal = {
            target: {
              value: JSON.stringify(item),
            },
          };
          handleChange(newVal);
          return true;
        }
      });
    }
  }, [notingNo, notingData]);

  useEffect(() => {
    if (
      props.disableArr.includes("inbox-sign") ||
      props.disableArr.includes("inbox-send")
    ) {
      setdsblSign(true);
      setOpen(false);
      setSend(false);
    } else {
      setdsblSign(false);
    }
  }, [props.disableArr]);

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  const handleDocsDwnld = (isNoting) => {
    try {
      setLoading(true);
      // console.log(isNoting);
      let sub = "we";
      let url = "";
      let ext = "";
      if (isNoting) {
        url = notingURL;
        ext = extension2;
        sub = JSON.parse(NOF)?.subject?.split(".")[0]?.split(".")[0];
      } else {
        url = URL;
        ext = extension;
        sub = NOF1?.subject?.split(".")[0];
      }
      if (!sub) sub = "file";
      try {
        props
          .URLHide(url)
          .then(async (response) => {
            // console.log(response);
            if (response.status != 200) {
              let errMsg = handleError(response.statusText);
              callMessageOut(errMsg);
              setLoading(false);
            } else if (response.status == 200) {
              let data = await response.blob();

              let blobUrl = window.URL.createObjectURL(data);

              let anchor = document.createElement("a");
              anchor.href = blobUrl;
              anchor.download = `${sub}.${ext}`;

              document.body.appendChild(anchor);
              anchor.click();
              window.URL.revokeObjectURL(blobUrl);
              document.body.removeChild(anchor);
              setLoading(false);
            }
          })
          .catch((e) => {
            let errMsg = handleError(e.error);
            callMessageOut(errMsg);
            setLoading(false);
          });
      } catch (e) {
        let errMsg = handleError(err.error);
        callMessageOut(errMsg);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const handleChange = (event, annoId, isCustomLink) => {
    const data = JSON.parse(event.target.value);
    let url = data.fileUrl;
    const flagNumber = data.flagNumber;
    const hideViewer = data.isSigned;
    let nofUrl;
    let extension = "docx";
    // setFlagNumber(flagNumber);
    // setSfdtData(url);
    if (!data.isSigned && data.prevVersionId) {
      nofUrl = url;
    } else {
      nofUrl = url;
    }

    // let arr = data.subject.split(".");
    // if (arr.length > 1) {
    //   extension = arr[arr.length - 1];
    // }

    if (data?.subject?.includes("..pdf")) {
      let arr = data.subject.split(".");
      arr?.pop()
      arr?.pop()
      extension = arr.length > 1
        ? arr[arr.length - 1]
        : "docx";
    }
    else {
      let arr = data.subject.split(".");
      extension = arr.length > 1
        ? arr[arr.length - 1]
        : "docx";
    }

    setExtension2(extension)

    unstable_batchedUpdates(() => {
      isCustomLink ? setNofAnnoId(annoId) : setNofAnnoId(data.annotationId);

      if (extension == "pdf") {
        setBlnHideSyncfusion(true);
        // setNotingSigned(true);
      } else {
        setNotingSigned(hideViewer);
        setBlnHideSyncfusion(hideViewer);
      }
      setExtension2(extension);
      setNOF(event.target.value);
      setNotingURL(nofUrl);
      if (isCabinet || isOutbox) {
        setOpenInPdf(false);
      } else {
        setOpenInPdf(!data.isSigned && data.status === "Internal");
      }
      setBlnDisable(data.blnDisable);
      setPrevVersionId(data.prevVersionId);
      setFlag("Noting");
      setPrevFlagNumberNF(flagNumber);
      setnotingDocId(data.fileId);
      setNtgUploader(data.uploader);
      setNtgStatus(data.status);
      setFilestatus(data.fileStatus)
    });
  };

  const handleNofAnnoid = (annoId) => {
    let newNotingData = notingData?.map((item) => {
      if (item?.fileId == JSON.parse(NOF)?.fileId) {
        return {
          ...item,
          annotationId: annoId,
        };
      } else {
        return item;
      }
    });
    setNotingData(newNotingData);
    setNOF(
      JSON.stringify({
        ...JSON.parse(NOF),
        annotationId: annoId,
      })
    );
  };

  const handleEncoAnnoid = (annoId) => {
    let newEncoData = enclosureArr?.map((item) => {
      if (item?.fileId == NOF1?.fileId) {
        return {
          ...item,
          annotationId: annoId,
        };
      } else {
        return item;
      }
    });
    setEnclosureArr(newEncoData);
  };

  const handleClearInputNoting = () => {
    setNOF("");
    setNotingStatustatus("");
    // setCoverLetter("");
    setFileChange(true);
    // setFlag("");
    setPrevFlagNumberNF(0);
    // setFlagVal("");
    setExtension2("");
    setNotingURL("");
    setNotingSigned(false);
    setRtifilename("");
    setBlnDisableForward(false);
  };
  const handleClearInput = () => {
    setNOF1("");
    setEnclosureLen(0);
    setNotingStatustatus("");
    setCoverLetter("");
    setFileChange(true);
    setFlag("");
    setPrevEnclouser("");
    setPrevFlagNumberEnclouser(0);
    setFlagVal("");
    setExtension("docx");
    setIsPdf(false);
    setURL(`def`);
    setEnclosureSigned(false);
    setRtifilename("");
  };

  const handleChange1 = (value, page, sfdtId, isCusLink) => {
    if (value !== null) {
      const data = value;
      const url = data.fileUrl;
      let isDocx = false

      const flagNumber = data.flagNumber;
      unstable_batchedUpdates(() => {
        setNOF1(value);
        setNotingStatustatus(data.justCreated);
        setFileChange(true);
        setFlag("Enclouser");
        setPrevEnclouser(url);
        setPrevFlagNumberEnclouser(flagNumber);
        setFlagVal(flagNumber);
        setenclosureDocId(data.fileId);

        if (data?.fileName?.includes("..pdf")) {
          let arr = data.fileName.split(".");
          arr?.pop()
          arr?.pop()
          arr.length > 1
            ? setExtension(arr[arr.length - 1])
            : setExtension("docx");
          isDocx = arr[arr.length - 1] == "docx"
        }
        else {
          let arr = data.fileName.split(".");
          arr.length > 1
            ? setExtension(arr[arr.length - 1])
            : setExtension("docx");
          isDocx = arr[arr.length - 1] == "docx"
        }

        if (data?.status == "External") {
          setCoverLetter(false)
        }
        else {
          setCoverLetter(isDocx)
        }


        setIsPdf(data.fileName.includes(".pdf"));
        setIsDocx(data.fileName.includes(".docx"));
        setIsDoc(data.fileName.includes(".doc"));
        setRtifilename(data.fileName);
        isCusLink ? setPageNumber(page) : setPageNumber(1);
        isCusLink
          ? setEnclosureAnnoiD(sfdtId)
          : setEnclosureAnnoiD(value?.annotationId);
        // read only in cabinet or outbox
        if (isCabinet || isOutbox || isIndex) {
          setEnclosureSigned(true);
        } else {
          setEnclosureSigned(data.isSigned);
        }
        setURL(url);
      });
    }
  };
  const handleChangePreviousEnclosure = () => {
    setPageNumber(1);
    let data = NOF1;
    if (data.serialNo === 0) {
      let newData = enclosureArr[enclosureArr.length - 1];
      handleChange1(newData);
    } else {
      let newData = enclosureArr[data.serialNo - 1];
      handleChange1(newData);
    }
  };

  const handleChangeNextEnclosure = () => {
    setPageNumber(1);
    let data = NOF1;
    if (data.serialNo + 1 === enclosureArr.length) {
      let newData = enclosureArr[0];
      handleChange1(newData);
    } else {
      let newData = enclosureArr[data.serialNo + 1];
      handleChange1(newData);
    }
  };

  const handleChangePreviousNoting = () => {
    setPageNumber(1);
    let data = JSON.parse(NOF);
    let newData;
    if (data.serialNo === 0) {
      newData = notingData[notingData.length - 1];
      let newVal = {
        target: {
          value: JSON.stringify(newData),
        },
      };
      handleChange(newVal);
    } else {
      newData = notingData[data.serialNo - 1];
      let newVal = {
        target: {
          value: JSON.stringify(newData),
        },
      };
      handleChange(newVal);
    }
  };

  const handleChangeNextNoting = () => {
    setPageNumber(1);
    let data = JSON.parse(NOF);
    if (data.serialNo + 1 === notingData.length) {
      let newData = notingData[0];
      let newVal = {
        target: {
          value: JSON.stringify(newData),
        },
      };
      handleChange(newVal);
    } else {
      let newData = notingData[data.serialNo + 1];
      let newVal = {
        target: {
          value: JSON.stringify(newData),
        },
      };
      handleChange(newVal);
    }
  };

  const handleRedirectToHrm = (row) => {
    Cookies.set("hasCoverNote", hasCoverNote);
    Cookies.set("HrmRole", hrmRole);
    Cookies.set("HrmDepartment", hrmDepartmet);
    let tempObj = enclosureArr.find((item) => item.coverNote === true);
    setFileId(tempObj?.fileId);
    // props.setInboxDatas(row); // row is event object no need to save in redux as it is too big
    setSend(true);
  };

  const handleSendtoCoord = () => {
    setLoading(true);
    props.sendToCoord(pcId).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          setLoading(false);
          return;
        }
        if (resp) {
          setLoading(false);
          history.push("/eoffice/inbox/file");
          // props.setInboxDatas(row);
          // setSend(true);
        }
      } catch (error) {
        callMessageOut(error.message);
        setLoading(false);
      }
    });
  };

  const resetButton = () => {
    setLoading(true);
    let tempArr = pdfViewerButtons.map((item, i) => ({
      ...item,
      btnId: i,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    }));
    {
      isRti == "true"
        ? props.savePartCaseTagRti(partCaseId, tempArr).then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
              return;
            }
            if (resp) {
              setLoading(false);
              setPdfViewerButtons(tempArr);
              Cookies.set("HrmRole", hrmRole);
              Cookies.set("HrmDepartment", hrmDepartmet);
              // props.setInboxDatas(row);
              // setSend(true);
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        : props
          .savePartCaseTag(partCaseId, tempArr, isBM)
          .then((resp) => {
            try {
              if (resp.error) {
                callMessageOut(resp.error);
                setLoading(false);
                return;
              }
              if (resp) {
                setLoading(false);
                setPdfViewerButtons(tempArr);
                Cookies.set("HrmRole", hrmRole);
                Cookies.set("HrmDepartment", hrmDepartmet);
                // props.setInboxDatas(row);
                // setSend(true);
              }
            } catch (error) {
              callMessageOut(error.message);
              setLoading(false);
            }
          })
          .catch((err) => {
            callMessageOut(err.message);
            setLoading(false);
          });
    }
  };

  const pdfCustomButton = (e) => {
    setPageNumber(1);
    let elementName = e.target.parentElement.getAttribute("buttonName");
    let fileurl = e.target.parentElement.getAttribute("fileurl");
    let pages = e.target.parentElement.getAttribute("page");

    const tempColour = ["orange", "green", "purple", "blue", "mediumvioletred"];

    let foundPdf = enclosureArr.some((item) => {
      if (item.fileUrl === fileurl && item.fileUrl === URL) {
        let data = { extension: extension, url: URL };
        dispatch(setPassData(data));
        setPageNumber(pages);
        return true;
      } else if (item.fileUrl === fileurl) {
        setURL(fileurl);
        setNOF1(item);
        handleChange1(item);
        setPageNumber(pages);
        return true;
      }
    });

    if (!foundPdf) {
      setLoading(true);
      let updatedElement = pdfViewerButtons.map((item) =>
        item.btnId == elementName
          ? {
            ...item,

            backgroundColor: tempColour[item.btnId],
            fileurl: URL,
            pageNumber: page,
          }
          : item
      );
      setFileChange(false);
      setPdfViewerButtons(updatedElement);
      {
        isRti == "true"
          ? props
            .savePartCaseTagRti(partCaseId, updatedElement)
            .then((resp) => {
              try {
                if (resp.error) {
                  callMessageOut(resp.error);
                  return;
                }
                if (resp) {
                  Cookies.set("HrmRole", hrmRole);
                  Cookies.set("HrmDepartment", hrmDepartmet);
                  // props.setInboxDatas(row);
                  // setSend(true);
                }
              } catch (error) {
                callMessageOut(error.message);
              }
            })
          : props
            .savePartCaseTag(partCaseId, updatedElement, isBM)
            .then((resp) => {
              try {
                if (resp.error) {
                  callMessageOut(resp.error);
                  setLoading(false);
                  return;
                }
                if (resp) {
                  Cookies.set("HrmRole", hrmRole);
                  Cookies.set("HrmDepartment", hrmDepartmet);
                  setLoading(false);
                  // props.setInboxDatas(row);
                  // setSend(true);
                }
              } catch (error) {
                callMessageOut(error.message);
                setLoading(false);
              }
            });
      }
    }

    // console.log(strData)

    // var urlExist = true;
    // var resUrl = "";
    // for (let x = 0; x < pdfViewerButtons.length; x++) {
    //   if (pdfViewerButtons[x].fileurl === URL) {
    //     urlExist = false;
    //   }
    //   if (fileurl) {
    //     resUrl = fileurl;
    //   }
    // }
    // if (resUrl) {
    //   setPageNumber(pages);
    //   setURL(resUrl);
    //   setNOF1(strData);
    //   let arr = data.fileName.split(".");
    //   arr.length !== 1
    //     ? setExtension(arr[arr.length - 1])
    //     : setExtension("docx");
    // } else {
    //   setLoading(true)
    //   let updatedElement = pdfViewerButtons.map((item) =>
    //     item.btnId == elementName && urlExist
    //       ? {
    //         ...item,

    //         backgroundColor: tempColour[item.btnId],
    //         fileurl: URL,
    //         pageNumber: page,
    //       }
    //       : item
    //   );
    //   setFileChange(false);
    //   setPdfViewerButtons(updatedElement);
    //   {
    //     isRti == "true"
    //       ? props
    //         .savePartCaseTagRti(partCaseId, updatedElement)
    //         .then((resp) => {
    //           try {
    //             if (resp.error) {
    //               callMessageOut(resp.error);
    //               return;
    //             }
    //             if (resp) {
    //               Cookies.set("HrmRole", hrmRole);
    //               Cookies.set("HrmDepartment", hrmDepartmet);
    //               // props.setInboxDatas(row);
    //               // setSend(true);
    //             }
    //           } catch (error) {
    //             callMessageOut(error.message);
    //           }
    //         })
    //       : props.savePartCaseTag(partCaseId, updatedElement).then((resp) => {
    //         try {
    //           if (resp.error) {
    //             callMessageOut(resp.error);
    //             setLoading(false)
    //             return;
    //           }
    //           if (resp) {
    //             Cookies.set("HrmRole", hrmRole);
    //             Cookies.set("HrmDepartment", hrmDepartmet);
    //             setLoading(false)
    //             // props.setInboxDatas(row);
    //             // setSend(true);
    //           }
    //         } catch (error) {
    //           callMessageOut(error.message);
    //           setLoading(false)
    //         }
    //       });
    //   }
    // }
  };

  const handleSignedCompleted = (val) => {
    setOpen(false);
  };

  const handleReturnedURL = (val) => {
    let tempArr = notingData.map((item) =>
      item.fileId === val.fileId ? val : item
    );
    setUpload(val.isSigned);
    setNotingData(tempArr);
    let newVal = {
      target: {
        value: JSON.stringify(val),
      },
    };
    handleChange(newVal);
    // // setNotingURL(url);
    // loadSplitViewData();
  };

  const handleAddPartCaseNoting = () => {
    setLoading(true);
    const groupName = sessionStorage.getItem("department");
    props.createPartCaseNotingFile(partCaseId, groupName, isBM).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          return;
        }
        setLoading(false);
        loadSplitViewData();
      } catch (error) {
        callMessageOut(error.message);
      }
    });
  };

  const handleAddNoting = () => {
    const groupName = sessionStorage.getItem("department");
    const deptName = sessionStorage.getItem("department");
    Cookies.set("cabinetStatus", "Draft");
    props.saveRtiFile(FileID, groupName, deptName).then((resp) => {
      loadRtiData();
    });
  };

  const handleDocumentRollback = () => {
    let newFileId = JSON.parse(NOF)?.fileId;

    setLoading(true);
    rowID &&
      props
        .rollbackSplitViewDocument(rowID, prevFlagNumberNF, newFileId, isBM)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
              return;
            }
            const data = resp.edited;
            let temArr = notingData.map((item) =>
              item.fileId === data.fileId
                ? {
                  ...data,
                  serialNo: 0,
                  isEditable: isDraft ? true : false, // changed justcreated to isDraft
                }
                : item
            );

            const flagNumber = data.flagNumber;
            // const hideViewer = data.isSigned;
            let hideViewer;
            if (data.status === "Internal") {
              if (data.isSigned === false && data.prevVersionId.length === 0) {
                hideViewer = false;
              } else if (
                data.isSigned === false &&
                data.prevVersionId.length > 0
              ) {
                hideViewer = true;
              } else if (
                data.isSigned === true &&
                data.prevVersionId.length > 0
              ) {
                hideViewer = true;
              }
            } else {
              hideViewer = true;
            }

            let bool;
            // if (data.uploader === department) {
            //   bool = hideViewer;
            // } else {
            //   bool = true;
            // }

            let newNofUrl = data.fileUrl;

            // if (
            //   !data.signed &&
            //   data.prevVersionId &&
            //   data.status !== "External"
            // ) {
            //   newNofUrl = `${data.fileUrl}?versionId=${data.prevVersionId}`;
            // } else {
            //   newNofUrl = data.fileUrl;
            // }
            unstable_batchedUpdates(() => {
              setPrevVersionId(data.prevVersionId);
              setToggleState((prevState) => !prevState);
              setUpload(data.isSigned);
              setNotingData(temArr);
              setNotingSigned(data.isSigned);
              setBlnHideSyncfusion(hideViewer);
              setOpenInPdf(true);
              setFlag("Noting");
              setNOF(JSON.stringify(temArr[0]));
              setFilestatus(data.fileStatus)
              // setreSaveNof(true);
              setPrevFlagNumberNF(flagNumber);
              setNotingURL(newNofUrl);
            });
            dispatch(setSnackbar(true, "success", t("remove_sign_successful")));
            setLoading(false);
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        });
  };

  const handleRtiDocumentRollback = () => {
    rowID &&
      props
        .rollbackRtiSplitViewDocument(FileID, prevFlagNumberNF)
        .then((resp) => {
          try {
            // // setSfdtData(resp.url);
            // setBlnDisableForward();
            // setBlnHideSyncfusion(false);
            // let fileUrl =
            //   resp.url + !resp.signed && `?versionId=${resp.url.prevVersionId}`;
            // setNotingURL(fileUrl);

            // const data = resp.edited;
            // let temArr = notingData.map((item) =>
            //   item.flagNumber === data.flagNumber
            //     ? { ...data, serialNo: 0, isEditable: false }
            //     : item
            // );
            const data = resp.edited;
            let temArr = notingData.map((item) =>
              item.flagNumber === data.flagNumber
                ? {
                  ...data,
                  serialNo: 0,
                  isEditable: item.status === "Internal" ? true : false,
                }
                : item
            );
            setNOF(JSON.stringify(temArr[0]));
            setNotingData(temArr);
            // let url = data.fileUrl;
            const flagNumber = data.flagNumber;
            const hideViewer = data.isSigned;
            setNotingSigned(hideViewer);
            if (data.uploader === department) {
              setBlnHideSyncfusion(hideViewer);
            } else {
              setBlnHideSyncfusion(true);
            }
            // setBlnHideSyncfusion(true)
            setOpenInPdf(true);
            setFlag("Noting");
            // setFlagNumber(flagNumber);
            // setSfdtData(url);
            let newNotingUrl;
            if (!data.isSigned && data.prevVersionId) {
              newNotingUrl = data.fileUrl;
            } else {
              newNotingUrl = data.fileUrl;
            }
            unstable_batchedUpdates(() => {
              setreSaveNof(true);
              setPrevFlagNumberNF(flagNumber);
              setNotingURL(newNotingUrl);
            });
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleDocumentRollbackEnclosure = () => {
    setLoading(true);
    rowID &&
      props
        .rollbackSplitViewEnclosureDocument(
          partCaseId,
          prevFlagNumberEnclouser,
          fileId,
          isBM
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
              return;
            }
            handleEnclosure(resp.enclosure, true);
            dispatch(setSnackbar(true, "success", t("remove_sign_successful")));
            setLoading(false);
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        });
  };

  const handleRtiDocumentRollbackEnclosure = () => {
    // setLoading(true);
    rowID &&
      props
        .rollbackRtiSplitViewEnclosureDocument(FileID, prevFlagNumberEnclouser)
        .then((resp) => {
          try {
            handleEnclosure(resp.enclosure);
          } catch (error) {
            callMessageOut(error.message);
          }
        });
  };

  const handleCoverLetter = () => {
    setCoverLetterDialog(true);
  };

  const handleAddCoverLetter = (subject, value) => {
    setLoading(true);
    let temArr = [];
    for (let i = 0; i < value.length; i++) {
      temArr.push(value[i].flagNumber);
    }
    const groupName = sessionStorage.getItem("role");
    const department = sessionStorage.getItem("department");
    props
      .createCoverLetter(
        partCaseId,
        groupName,
        subject,
        temArr,
        username,
        department
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            if (resp.hasError === "true") {
              callMessageOut(resp.msg);
              return;
            }

            // loadSplitViewData()  // instead of making api call handling add cv letter case manually
            const cvObj =
              resp.partCase.enclosureList[
              resp.partCase.enclosureList.length - 1
              ];
            unstable_batchedUpdates(() => {
              setCoverLetter(true);
              setHasCoverNote(cvObj.coverNote);
              setServiceLetterId(cvObj.serviceLetterId);
              setDepartmentList(resp?.partCase?.deptList);
              setCoverLetterDialog(false);
              handleAddEnclosure([cvObj]);
            });
            setLoading(false);
            dispatch(setSnackbar(true, "success", resp.msg));
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const handleSendConfirmation = (value) => {
    setLoading(true);
    const deptName = sessionStorage.getItem("department");
    setOpenConfirmation(false);
    // setLoad(true);
    props
      .returnRti(FileID, deptName, username)
      .then((resp) => {
        // setLoading(false)
        // history.push({ pathname: "/eoffice/inbox/file" });
        // dispatch(setSnackbar(true, "success", `${t("file_has_been_returned_successfully")}`));
        try {
          if (resp.error) {
            setLoading(false);

            dispatch(setSnackbar(true, "error", resp.error));
          } else {
            setLoading(false);
            history.push({ pathname: "/eoffice/inbox/file" });
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_returned_successfully")}`
              )
            );
            return;
          }
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.message));
        }

        // dispatch(setSnackbar(true, "Returned file successfully"));
      })
      .catch((err) => console.log(err));
  };

  const handleEnclosure = (data, shouldReSave) => {
    const url = data.fileUrl;
    const flagNumber = data.flagNumber;
    let enclosureName = NOF1;

    let arr = data.fileName.split(".");
    arr.length > 1 ? setExtension(arr[arr.length - 1]) : setExtension("docx");
    let tempArr = enclosureArr.map((item) =>
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
      if (data.status == "External") {
        setCoverLetter(false);
      }
      else {
        setCoverLetter(!data.isSigned);
      }

      setEnclosureSigned(data.isSigned);
      setFileChange(true);
      // shouldReSave && setreSaveEnco(true);
      setURL(url);
      setFlag("Enclouser");
      setPrevEnclouser(url);
      setPrevFlagNumberEnclouser(flagNumber);
      setRtifilename(data.fileName);
      setEnclosureArr(tempArr);
      setNOF1({
        ...enclosureName,
        fileUrl: data.fileUrl,
        isSigned: data.isSigned,
        prevVersionId: data.prevVersionId,
      });
    });
  };

  const handleAddEnclosure = (data) => {
    let tempArr = [];
    enclosureArr.map((item) => tempArr.push(item));
    data.map((item, i) =>
      tempArr.unshift({
        ...item,
        serialNo: enclosureArr.length + i,
        subject: item.subject ? item.subject : item.fileName,
      })
    );
    unstable_batchedUpdates(() => {
      settotalFlags((c) => c + data.length);
      setEnclosureLen(tempArr.length);
      setEnclosureArr(tempArr);
      handleChange1(tempArr[0]);
    });
  };

  const handleSignNoting = () => {
    setFileId(JSON.parse(NOF)?.fileId);
    setFlagNumber(prevFlagNumberNF);
    setFlag("Noting");
    let nofUrl = "";

    if (notingStatus === "Internal") {
      nofUrl = notingURL;
      setSfdtData(nofUrl);
    } else {
      setSfdtData(notingURL);
    }
    setOpen(true);
  };

  const handleFlagOpen = () => {
    setOpenDialog(true);
    setisValid(true);
    setEncoSubject(NOF1?.subject);
  };

  const handleFlagClose = () => {
    setOpenDialog(false);
    setisValid(false);
    setEncoSubject("");
    setValue(0);
  };

  const deleteNotingData = () => {
    setLoading(true);
    const pcId = sessionStorage.getItem("partcaseID");
    const rolename = sessionStorage.getItem("role");
    let fileId = JSON.parse(NOF)?.fileId;
    props
      .deleteNoting(rolename, fileId, prevFlagNumberNF, rowID, isBM)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("Noting_has_been_deleted_successfully")} !`
            )
          );
          // let deletedEnco;
          // const newArray = enclosureArr.filter((item) => {
          //   if (item.flagNumber !== prevFlagNumberEnclouser) {
          //     return deletedEnco;
          //   } else {
          //     deletedEnco = item;
          //   }
          // });
          // const newArray = enclosureArr.filter((item) => {
          //   if (item.flagNumber !== prevFlagNumberEnclouser) {
          //     return deletedEnco;
          //   } else {
          //     deletedEnco = item;
          //   }
          // });
          setBlnDisableForward(!resp?.response?.enableAddNoting);
          const newArray = resp?.response?.notingList?.reverse();
          // .filter((item) => {
          //   return item.flagNumber !== prevFlagNumberNF;
          // });
          setNotingData(newArray);

          if (newArray.length > 0) {
            const event = {
              target: {
                value: JSON.stringify(newArray[0]),
              },
            };
            handleChange(event);
          } else {
            handleClearInputNoting();
          }

          settotalFlags((c) => c - 1);
          setNotinglen(newArray.length);
          setNotingData(newArray);

          if (newArray.length > 0 && newArray[0]?.coverNote) {
            setHasCoverNote(false);
          }

          setLoading(false);
        } catch (error) {
          // callMessageOut(error.message);
          setLoading(false);
        }
      });
  };

  const deleteEnclosureData = () => {
    setLoading(true);
    const pcId = sessionStorage.getItem("partcaseID");
    const rolename = sessionStorage.getItem("role");
    props
      .deleteEnclosure(
        rolename,
        rowID,
        prevFlagNumberEnclouser,
        NOF1.fileId,
        isBM
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("Enclosure_has_been_deleted_successfully")} !`
            )
          );
          // let deletedEnco;
          // const newArray = enclosureArr.filter((item) => {
          //   if (item.flagNumber !== prevFlagNumberEnclouser) {
          //     return deletedEnco;
          //   } else {
          //     deletedEnco = item;
          //   }
          // });
          // const newArray = enclosureArr.filter((item) => {
          //   if (item.flagNumber !== prevFlagNumberEnclouser) {
          //     return deletedEnco;
          //   } else {
          //     deletedEnco = item;
          //   }
          // });
          const newArray = enclosureArr.filter((item) => {
            return item.flagNumber !== prevFlagNumberEnclouser;
          });

          settotalFlags((c) => c - 1);
          setEnclosureLen(newArray.length);
          setEnclosureArr(newArray);
          let newData;
          if (enclosureArr) {
            newData = enclosureArr[0];
          } else {
            newData = [];
          }
          if (newArray.length > 0) {
            let newData = newArray[0];
            handleChange1(newData);
          } else {
            handleClearInput();
          }
          if (deletedEnco?.coverNote) {
            setHasCoverNote(false);
          }
          let newData1;
          // if (enclosureArr) {
          //   newData1 = enclosureArr[0];
          // } else {
          //   newData = [];
          // }
          // if (newArray.length > 0) {
          //   handleChange1(newData1);
          // } else {
          //   handleClearInput();
          // }

          if (newData1?.coverNote) {
            setHasCoverNote(false);
          }


          setLoading(false);
        } catch (error) {
          // callMessageOut(error.message);
          setLoading(false);
        }
      });
  };

  const deleteEnclosureDataRti = () => {
    setLoading(true);
    const pcId = sessionStorage.getItem("partcaseID");
    const rolename = sessionStorage.getItem("role");
    const partcase = Cookies.get("partcaseId");
    props
      .deleteEnclosureRti(rolename, pcId, rtifilename, prevFlagNumberEnclouser)
      .then((resp) => {
        loadRtiData();
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("Enclosure_has_been_deleted_successfully")} !`
            )
          );
          const newArray = enclosureArr.filter((item) => {
            return item.flagNumber !== prevFlagNumberEnclouser;
          });
          setEnclosureArr(newArray);
          let newData;
          if (enclosureArr) {
            newData = enclosureArr[0];
          } else {
            newData = [];
          }
          if (newArray.length > 0) {
            handleChange1(newData);
          } else {
            handleClearInput();
          }
          setLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const handleEncoEdit = (e, type) => {
    setLoading(true);
    e.preventDefault();
    if (type == "noting") {
      handleFlagEdit(true);
    } else {
      handleFlagEdit(false);
    }
  };

  // const handleEditSubject = () => {
  //   const pcId = sessionStorage.getItem("partcaseID");
  //   props.editEncoSubject(pcId, NOF1.fileId, encoSubject).then((res) => {
  //     console.log(res)
  //     try {
  //       if (res.error) {
  //         callMessageOut(res.error)
  //         setLoading(false)
  //       }
  //       else {
  //         let encoObj = {}
  //         let encoArr = enclosureArr.map((item) => {
  //           if (item.fileId == NOF1.fileId) {
  //             encoObj = item
  //             return {
  //               ...item,
  //               subject: encoSubject
  //             }
  //           }
  //           else {
  //             return item
  //           }
  //         })
  //         encoObj.subject = encoSubject
  //         setNOF1({ ...encoObj })
  //         setEnclosureArr(encoArr)
  //         setLoading(false)
  //         handleFlagClose()
  //         dispatch(
  //           // once file has been deleted shows snackbar to notify user.
  //           setSnackbar(
  //             true,
  //             "success",
  //             `${t("enclosure_has_been_edited_successfully")}`
  //           )
  //         );
  //       }
  //     } catch (e) {
  //       callMessageOut(e.message)
  //       setLoading(false)
  //     }
  //   }).catch((err) => {
  //     callMessageOut(err.message)
  //     setLoading(false)
  //   })
  // }

  const handleFlagEdit = (val) => {
    const roleName = sessionStorage.getItem("role");
    props
      .editFlagNumber(
        cabinetpartcase,
        val ? notingFlag : swapFlag?.flagNumber,
        flagVal,
        roleName,
        NOF1.fileId,
        encoSubject,
        isBM
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
            return;
          } else {
            // unstable_batchedUpdates(() => {
            //   sortEncolosure(resp.enclosureList)
            //   setNotingData(resp.notingList)
            //   let n1 = notingFlag
            //   let n2 = flagVal
            //   setNOF(JSON.stringify({
            //     ...resp.notingList[0],
            //   }))
            //   setNOF1({
            //     ...NOF1,
            //     flagNumber: notingFlag
            //   })
            //   setNotingFlag(n2)
            //   setFlag(n1)
            // })
            loadData(resp, true);
            setLoading(false);
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("enclosure_has_been_edited_successfully")}`
              )
            );
          }
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      });
    setOpenDialog(false);
  };

  const sortEncolosure = (list) => {
    list.sort((a, b) => b?.flagNumber - a?.flagNumber);
    // console.log(list);
    setEnclosureArr([...list]);
  };

  const handleRtiFlagEdit = (e) => {
    e.preventDefault();
    const pcId = sessionStorage.getItem("partcaseID");
    const roleName = sessionStorage.getItem("role");
    props
      .editRtiFlagNumber(
        pcId,
        flagVal,
        prevFlagNumberEnclouser,
        roleName,
        NOF1.flagNumberMarking
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          } else {
            let tmpArr = enclosureData.map((item) =>
              item.flagNumber === NOF1.flagNumber
                ? { ...NOF1, flagNumber: flagVal }
                : item
            );
            setEnclosureData(tmpArr);
            handleChange1({ ...NOF1, flagNumber: flagVal });
            dispatch(
              // once file has been deleted shows snackbar to notify user.
              setSnackbar(
                true,
                "success",
                `${t("enclosure_has_been_edited_successfully")}`
              )
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
    setOpenDialog(false);
  };

  // const handleFlagValidate = (e) => {
  //   setValue(Number(e.target.value));
  //   const isFlagExistIndex = FlagNoArr.indexOf(Number(e.target.value));
  //   if (isFlagExistIndex == -1) {
  //     setisValid(true);
  //   } else {
  //     setisValid(false);
  //   }
  // };

  const handleDownload = async (e) => {
    setLoading(true);
    try {
      const res = await Axios.post(
        `/retrieval_service/api/v2/download/inbox`,
        JSON.stringify([sessionStorage.getItem("InboxID")]),
        {
          headers: {
            "Content-Type": "application/json; charset=utf8",
            Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
            sessionId: sessionStorage.getItem("sessionId"),
            userName: localStorage.getItem("username"),
            roleName: sessionStorage.getItem("role"),
            department: sessionStorage.getItem("department"),
          },
          responseType: "arraybuffer",
        }
      );
      if (res) {
        let blob = new Blob([res.data], {
          type: "application/octet-stream",
        });
        setLoading(false);
        saveAs(blob, `${title || "File"}.zip`);
      }
    } catch (e) {
      callMessageOut(e.message);
      setLoading(false);
    }
  };

  const hanldeCheckCondition = () => {
    if (partCase || isRegister || (isOutbox && !isDraft) || WaitingRoom) {
      return false;
    } else if (isrtiforward) {
      return false;
    } else {
      return true;
    }
  };

  const handleuploadCondition = () => {
    if (notingSigned === true) {
      return true;
    } else {
      return false;
    }
  };

  // console.log({
  //   NOF,
  //   linkF,
  // });

  const handleCabinateClick = () => {
    setLoading(true);
    // Cookies.remove("partCase");
    // Cookies.remove("cabinetStatus");
    // Cookies.remove("isCabinet");
    // Cookies.remove("cabinetid");
    // Cookies.remove("cabinetpartcase");
    // Cookies.remove("isFile");
    // loadPartCaseIdData();

    props.openFile(department, cabinetpartcase).then((resp) => {
      // console.log(resp);
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          setLoading(false);
          return;
        } else {
          setLoading(false);
          dispatch(
            setSnackbar(
              true,
              "success",
              `${t("file_has_been_open_successfully")}`
            )
          );
          setTimeout(() => {
            history.push({ pathname: "/eoffice/inbox/file" });
          }, 100);
        }
      } catch (e) {
        callMessageOut(e.message);
        setLoading(false);
      }
    });
  };

  const handleUploadNoting = (values) => {
    let tempArr = notingData;
    for (let i = 0; i < values.length; i++) {
      tempArr.push(values[i]);
    }
    setNotingData(tempArr);
    let event = {
      target: {
        value: JSON.stringify(values[0]),
      },
    };
    handleChange(event);
  };

  const handleHistory = (e) => {
    e.stopPropagation();
    setLoading(true);
    let id = sessionStorage.getItem("InboxID")
    props.getHistory("File", id).then((resp) => {
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
    props.getHistoryOld(referenceNumber).then((resp) => {
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

  const handleMoveToCC = (fileIn) => {
    setLoading(true);
    try {
      props
        .MoveToCC(
          cabinetpartcase,
          fileIn === "noting" ? ntngDocid : encDocid,
          isBM ? true : false
        )
        .then((resp) => {
          setLoading(false);
          // console.log("res", resp);
          dispatch(setSnackbar(true, "success", `${resp.response.message}`));
        })
        .catch((error) => {
          // Handle errors here
          setLoading(false);
          console.error("Error:", error);
          dispatch(setSnackbar(true, "error", resp.response.error));
        });
    } catch (error) {
      // Handle synchronous errors here
      setLoading(false);
      console.error("Error:", error);
      dispatch(setSnackbar(true, "error", "An error occurred."));
    }
  };

  const callMessageSuccess = (message) => {
    dispatch(setSnackbar(true, "success", message));
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
          setOpenNfa(false);
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

  const handleMoveToBm = (fileIn) => {
    setLoading(true);
    try {
      props
        .MoveToBM(
          cabinetpartcase,
          fileIn === "noting" ? ntngDocid : encDocid,
          isBM ? true : false
        )
        .then((resp) => {
          setLoading(false);
          // console.log("res", resp);
          dispatch(setSnackbar(true, "success", `${resp.response.message}`));
        })
        .catch((error) => {
          // Handle errors here
          setLoading(false);
          console.error("Error:", error);
          dispatch(setSnackbar(true, "error", resp.response.error));
        });
    } catch (error) {
      // Handle synchronous errors here
      setLoading(false);
      console.error("Error:", error);
      dispatch(setSnackbar(true, "error", "An error occurred."));
    }
  };

  const handleClickOpenCloudTable = () => {
    setopenCloud(true);
  };

  const handleUploadNtg = () => {
    if (isDraft === true && blnDisableForward === false) {
      return false;
    } else {
      return true;
    }
  };

  const handleDelete = (row, index) => {
    let cabinetpartcase = Cookies.get("cabinetpartcase");
    setLoading(true);
    props
      .linkFile(cabinetpartcase, row?.id, "delete")
      .then((res) => {
        console.log(res)
        try {
          if (res.error) {
            if (res?.error?.includes("aborted")) {
              setLoading(false);
              return;
            }
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            setLoading(false);
          } else {
            linkfiles?.splice(index, 1)
            setLinkfiles([...linkfiles])
            dispatch(setSnackbar(true, "success", t("linked_succ")));
            console.log(res)
            setLoading(false)
          }
        } catch (e) {
          callMessageOut(e.message);
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

  const handleCreateActionPoint = () => {
    let tmpArr = [];
    let tempArr2 = [];
    let tempArr3 = [];
    notingData.map((noting) => {
      tmpArr.push(noting.fileUrl);
      tempArr2.push(noting);
    });
    enclosureData.map((enclosure) => {
      tmpArr.push(enclosure.fileUrl);
      tempArr3.push(enclosure);
    });
    setFileUrlWithNameNoting(tempArr2);
    setfileUrls(tmpArr);
    setAPOpenForm(true);
  }

  const handleCloseAPform = () => {
    setAPOpenForm(false);
  }

  return (
    <>
      {loading && <Loading />}
      {!partCase || !isRegister && !external ? (
        <>
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
            {
              (!partCase || isDraft) && !isOutbox && !isIndex && (
                <SpeedDialAction
                  className={classes.sDialIcon}
                  icon={<CallToAction />}
                  tooltipTitle={t("create_action_point")}
                  onClick={handleCreateActionPoint}
                />
              )
            }
            {isCabinet && (cabinetIcon === "Closed" || cabinetIcon === "In-Cabinet" || cabinetIcon === "closed") && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<ImportContacts />}
                tooltipTitle={t("open_file")}
                onClick={handleCabinateClick}
              />
            )}

            {canClose && !isCabinet && !isOutbox && !WaitingRoom && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<FaRegCalendarTimes />}
                tooltipTitle={t("close_file")}
                onClick={() => setcloseFile(true)}
                FabProps={{
                  disabled: reSaveEnco || reSaveNof,
                }}
              />
            )}



            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<CommentIcon />}
              onClick={() => setopenInternalcomment(true)}
              tooltipTitle={t("internal_comment")}
            />



            {mainFile && partCase && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<FileCopyIcon />}
                onClick={() => handlePC(true)}
                tooltipTitle={t("create_part_case_file")}
              />
            )}

            {(!partCase || isDraft) && !isOutbox && !isIndex && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<LinkIcon />}
                onClick={() => handleLF(true)}
                tooltipTitle={t("link_file")}
              />
            )}

            {/* {partCase && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<ScheduleIcon />}
                onClick={() => handleEric(true)}
                tooltipTitle={t("create_eric")}
              />
            )} */}

            {!partCase && !isOutbox && !isIndex && monitor && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<UpdateIcon />}
                onClick={() => handleMonitor(true)}
                tooltipTitle={t("update_monitor")}
              />
            )}

            {/*
              {share && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<ShareIcon />}
                onClick={() => handleShare(true)}
                tooltipTitle={t("share_file")}
              />
            )}
              */}

            {(isOutbox || partCase) && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<FaBarcode />}
                onClick={() => setBarcodeOpen(true)}
                tooltipTitle={t("view_barcode")}
              />
            )}

            {isRti === "true" ? (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<ArrowBack />}
                tooltipTitle={t("RETURN RTI")}
                onClick={() => setOpenConfirmation(true)}
                style={{
                  display: `${rolename !== creater}`,
                }}
              />
            ) : (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<ArrowBack />}
                tooltipTitle={t("back")}
                onClick={() =>
                  history.push({
                    pathname: `${backPath ? backPath : "/eoffice/inbox/file"}`,
                  })
                }
                style={{
                  display: `${partCase ? "none" : ""}`,
                }}
              />
            )}

            {/*
              {nfa && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<MoveToInboxIcon />}
                tooltipTitle={t("nfa")}
                onClick={() => setOpenNfa(true)}
              />
            )}
              */}

            {!isIndex && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<History />}
                tooltipTitle={t("inbox_history")}
                onClick={handleHistory}
              />
            )}

            <SpeedDialAction
              className={classes.sDialIcon}
              icon={<ArchiveIcon />}
              tooltipTitle={t("DOWNLOAD")}
              onClick={handleDownload}
            />

            {/* <SpeedDialAction
              className={classes.sDialIcon}
              icon={
                <SpeedDialIcon
                  icon={
                    <div>
                      <Announcement />
                      <span className="bm-icons-badge">{count2}</span>
                    </div>
                  }
                />
              }
              tooltipTitle={t("remarks")}
              onClick={() => {
                setopenRemarks(true);
              }}
            />

            <SpeedDialAction
              className={classes.sDialIcon}
              icon={
                <SpeedDialIcon
                  icon={
                    <div>
                      <CgNotes />
                      <span className="bm-icons-badge">{count1}</span>
                    </div>
                  }
                />
              }
              tooltipTitle={t("yellow_notes")}
              onClick={() => {
                setopenYellowNotes(true);
              }}
            /> */}

            {isRegister && (
              <SpeedDialAction
                className={classes.sDialIcon}
                icon={<GetAppIcon />}
                tooltipTitle={t("DOWNLOAD")}
                onClick={handleDownload}
                style={{
                  display: `${!Rtioutbox ? "" : "none"}`,
                }}
              />
            )}
          </SpeedDial>
          {((!isCabinet && !isOutbox) || isDraft) && !isIndex && (
            <Tooltip
              title={reSaveEnco || reSaveNof ? t("autosave") : t("send")}
            >
              <span>
                <Fab
                  color="secondary"
                  className={classes.sendIcon}
                  size="medium"
                  onClick={WaitingRoom ? handleSendtoCoord : handleRedirectToHrm}
                  style={{
                    display: `${!Rtioutbox && (!partCase || isDraft) ? "" : "none"
                      }`,
                  }}
                  disabled={reSaveEnco || reSaveNof}
                >
                  <SendIcon style={{ marginLeft: "3px" }} />
                </Fab>
              </span>
            </Tooltip>
          )}
        </>
      ) : (
        <div></div>
      )}
      {isLf && (
        <div
          style={{
            width: "28%",
            paddingTop: "20px",
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
                  className="nof_table_row head"
                  style={{
                    borderBottom: `1px solid #8080805c`,
                    display: "grid",
                    gridTemplateColumns: "2fr 3fr 3rem",
                    background: "#b1b1b15c",
                  }}
                >
                  <div>
                    <span>{t("file_no")}</span>
                  </div>
                  <div>
                    <span>{t("subject")}</span>
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

                {linkfiles?.length > 0 &&
                  linkfiles?.map((item, i) => {
                    return (
                      <TableRow
                        hover
                        component="div"
                        key={i}
                        selected={item?.id === linkF?.id}
                        style={{
                          cursor: "pointer",
                        }}
                        onClick={() => setLinkF(item)}
                      >
                        <div
                          className="nof_table_row"
                          style={{
                            borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"
                              }`,
                            display: "grid",
                            gridTemplateColumns: "2fr 3fr 3rem",
                            alignItems: "center",
                          }}
                        >
                          <div className="info1">
                            <span>{item.nofFileName}</span>
                          </div>
                          <div className="info2">
                            <span className="mrt-text">{item.subject}</span>
                          </div>

                          <div className="info2">
                            {
                              item?.roleName == rolename && <IconButton
                                onClick={() => {
                                  handleDelete(item, i);
                                }}
                              >
                                <Delete color="error" />
                              </IconButton>
                            }
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
              totalCount={totalLF}
              setPageSize={setPageSize}
            />
          </TableContainer>
        </div>
      )}
      <Grid
        container
        justifyContent="space-between"
        spacing={1}
        style={{
          margin: "0px",
          width: isLf ? "72%" : "100%",
        }}
      >
        {!isIndex && (
          <Grid
            item
            xs={6}
            style={{
              display: "flex",
              // alignItems: "center",
              justifyContent: "flex-start",
            }}
          >
            <Tooltip title={t("previous_noting")} aria-label="Previous Noting">
              <span>
                <IconButton
                  onClick={handleChangePreviousNoting}
                  size="small"
                  className={classes.nonhighlightedButton}
                  disabled={isRegister || isrtiforward || notingData.length <= 1 || open}
                >
                  <ChevronLeftIcon />
                </IconButton>
              </span>
            </Tooltip>
            <Tooltip title={t("next_noting")} aria-label="Next Noting">
              <span>
                <IconButton
                  onClick={handleChangeNextNoting}
                  size="small"
                  className={classes.nonhighlightedButton}
                  disabled={isRegister || isrtiforward || notingData.length <= 1 || open}
                >
                  <ChevronRightIcon />
                </IconButton>
              </span>
            </Tooltip>
            {blnVisible ? (
              <TextField
                select
                label={<>

                  <div>
                    {t("note_on_file")} <span className="viewOne_count">{notinglen}</span>
                  </div>
                </>}
                value={NOF}
                size="small"
                fullWidth
                onChange={handleChange}
                variant="outlined"
                id="noting-len"
                className={classes.formControl}
                disabled={open}
              >
                {notingData?.map((item, index) => (
                  <MenuItem key={index} value={JSON.stringify(item)}>
                    {`Noting #${item.flagNumber}`}
                  </MenuItem>
                ))}
              </TextField>
            ) : null}

            {/* {handleUploadNtg() && ( */}
            {(!isCabinet || isDraft) &&
              !isOutbox &&
              !isLf &&
              !isIndex &&
              !WaitingRoom && (
                <>
                  <Tooltip title={t("add_noting")} aria-label="Add Noting">
                    <span>
                      <Button
                        id="inbox_add_noting"
                        variant="contained"
                        color="primary"
                        className={classes.nonhighlightbutton}
                        disabled={
                          blnDisableForward || isRegister || isrtiforward || open || (NOF && JSON.parse(NOF)?.prevVersionId?.length)
                        }
                        onClick={
                          isRti === "true"
                            ? handleAddNoting
                            : handleAddPartCaseNoting
                        }
                      >
                        {/* <NoteAddOutlinedIcon
                          className={classes.icon}
                          style={{ fontSize: "1rem" }}
                        /> */}
                        <NoteAddIcon
                          //   className={classes.hoverIcon}
                          style={{ fontSize: "1rem" }}
                        />
                      </Button>
                    </span>
                  </Tooltip>

                  {/* <Tooltip title="Add Noting" aria-label="Add Noting">
                    <IconButton
                      onClick={
                        isRti === "true"
                          ? handleAddNoting
                          : handleAddPartCaseNoting
                      }
                      size="small"
                      className={classes.nonhighlightedButton}
                      disabled={blnDisableForward || isRegister || isrtiforward}
                    >
                      <NoteAddOutlinedIcon
                        className={classes.icon}
                        style={{ fontSize: "1.3rem" }}
                      />
                      <NoteAddIcon
                        className={classes.hoverIcon}
                        style={{ fontSize: "1.3rem" }}
                      />
                    </IconButton>
                  </Tooltip> */}
                  {((!isCabinet && !isOutbox) || isDraft) && !WaitingRoom && (
                    <Tooltip
                      title={t("UPLOAD NOTING")}
                      aria-label="Upload File"
                    >
                      <span>
                        <div>
                          <NotingUplaod
                            rowID={rowID}
                            handleUploadNoting={handleUploadNoting}
                            isBM={isBM}
                            loadSplitViewData={loadSplitViewData}
                            isDraft={isDraft}
                            blnDisableForward={blnDisableForward}
                            handleUploadNtg={handleUploadNtg}
                            sty={classes.highlighteduploadButton}
                            disabled={open || (NOF && JSON.parse(NOF)?.prevVersionId?.length)}
                          />
                        </div>
                      </span>
                    </Tooltip>
                  )}
                  {/* {!notingSigned ? ( */}
                  <Tooltip
                    title={reSaveNof ? t("autosave") : t("sign")}
                    aria-label="Sign"
                  >
                    <span>
                      <Button
                        id="inbox_Noting_sign"
                        variant="contained"
                        color="secondary"
                        className={classes.nonhighlightbutton}
                        onClick={handleSignNoting}
                        disabled={
                          // blnDisable ||
                          isRegister ||
                          isrtiforward ||
                          reSaveNof ||
                          notinglen == 0 ||
                          notingSigned ||
                          !canSign ||
                          extension2 == "pdf" || open
                        }
                      >
                        <CreateIcon style={{ fontSize: "1rem" }} />
                      </Button>
                    </span>
                  </Tooltip>

                  {/* <Tooltip
                    title={reSaveNof ? t("autosave") : t("sign")}
                    aria-label="Sign"
                  >
                    <IconButton
                      onClick={handleSignNoting}
                      size="small"
                      className={classes.nonhighlightedButton}
                      disabled={
                        // blnDisable ||
                        isRegister ||
                        isrtiforward ||
                        reSaveNof ||
                        notinglen == 0 ||
                        notingSigned
                      }
                    >
                      <CreateOutlinedIcon
                        className={classes.icon}
                        style={{ fontSize: "1.3rem" }}
                      />
                      <CreateIcon
                        className={classes.hoverIcon}
                        style={{ fontSize: "1.3rem" }}
                      />
                    </IconButton>
                  </Tooltip> */}

                  <Tooltip title={t("remove_sign")} aria-label="Sign">
                    <span>
                      <Button
                        id="inbox_remove_sign"
                        // style={{ marginBottom: "15px" }}
                        variant="contained"
                        color="primary"
                        className={classes.nonhighlightbutton}
                        onClick={() => {
                          setFileId(JSON.parse(NOF)?.fileId);
                          isRti === "true"
                            ? handleRtiDocumentRollback()
                            : handleDocumentRollback();
                        }}
                        disabled={
                          // blnDisable ||
                          isRegister ||
                          isrtiforward ||
                          notinglen == 0 ||
                          prevVersionId.length === 0 || open
                        }
                      >
                        <RestorePageIcon style={{ fontSize: "1rem" }} />
                      </Button>
                    </span>
                  </Tooltip>
                  <Tooltip
                    title={t("delete_noting")}
                    aria-label="Delete Noting"
                  >
                    <span>
                      <Button
                        id="inbox_Noting_delete"
                        variant="contained"
                        color="secondary"
                        className={classes.nonhighlightbutton}
                        onClick={deleteNotingData}
                        disabled={
                          deptName !== ntguploader ||
                          ntgstatus !== "Internal" ||
                          isRegister ||
                          isrtiforward ||
                          notinglen == 0 ||
                          upload ||
                          filestatus != "D" || open
                        }
                      >
                        <DeleteIcon style={{ fontSize: "1rem" }} />
                      </Button>
                    </span>
                  </Tooltip>

                  {/* <Tooltip title={t("remove_sign")} aria-label="Sign">
                    <IconButton
                      onClick={() => {
                        setFileId(JSON.parse(NOF)?.fileId);
                        isRti === "true"
                          ? handleRtiDocumentRollback()
                          : handleDocumentRollback();
                      }}
                      size="small"
                      className={classes.nonhighlightedButton}
                      disabled={
                        // blnDisable ||
                        isRegister ||
                        isrtiforward ||
                        notinglen == 0 ||
                        prevVersionId.length === 0
                      }
                    >
                      <RestorePageOutlinedIcon
                        className={classes.icon}
                        style={{ fontSize: "1.3rem" }}
                      />
                      <RestorePageIcon
                        className={classes.hoverIcon}
                        style={{ fontSize: "1.3rem" }}
                      />
                    </IconButton>
                  </Tooltip> */}

                  {count1 == 0 ? (
                    <Tooltip
                      title={t("add_yellow_note")}
                      aria-label="Add Noting"
                    >
                      <span>
                        <Button
                          id="inbox_add_ylo_note"
                          variant="contained"
                          color="secondary"
                          className={classes.nonhighlightbutton}
                          onClick={() => setaddNote(true)}
                          disabled={
                            isRegister || isrtiforward || notinglen == 0 || open
                          }
                        >
                          <AddCommentIcon style={{ fontSize: "1rem" }} />
                        </Button>
                      </span>
                    </Tooltip>
                  ) : null}
                </>
              )}

            {(backPath?.includes("inbox") && count1) ||
              (cabinetpartcase && rolename == creator && count1) ||
              (isOutbox && count1) ? (
              <Tooltip title={t("yellow_notes")} aria-label="Add Noting">
                <span>
                  <Button
                    id="inbox_view_ylo_note"
                    variant="contained"
                    color="secondary"
                    className={classes.nonhighlightbutton}
                    onClick={() => setopenYellowNotes(true)}
                    disabled={open}
                  >
                    <Badge
                      badgeContent={count1}
                      color="error"
                      className="viewone-badge"
                      showZero
                      overlap="rectangular"
                    >
                      <CgNotes style={{ fontSize: "1rem" }} />
                    </Badge>
                  </Button>
                </span>
              </Tooltip>
            ) : null}
            {(backPath?.includes("inbox") && count2) ||
              (cabinetpartcase && rolename == creator && count2) ||
              (isOutbox && count2) ? (
              <Tooltip title={t("internal_comment")} aria-label="Add Noting">
                <span>
                  <Button
                    id="inbox_view_remarks"
                    variant="contained"
                    color="secondary"
                    className={classes.nonhighlightbutton}
                    onClick={() => setopenInternalcomment(true)}
                    disabled={open}
                  >
                    <Badge
                      badgeContent={count2}
                      color="error"
                      className="viewone-badge"
                      showZero
                      overlap="rectangular"
                    >
                      <CommentIcon style={{ fontSize: "1rem" }} />
                    </Badge>
                  </Button>
                </span>
              </Tooltip>
            ) : null}

            {!WaitingRoom && (
              <Tooltip title="MORE">
                <IconButton
                  style={{ marginTop: "10px" }}
                  id="view-one-moreHorizon"
                  onClick={handleClickNtg}
                  disabled={open}
                >
                  <MoreHoriz />
                </IconButton>
              </Tooltip>
            )}
            <Menu
              id="simple"
              anchorEl={anchorElNtg}
              keepMounted
              style={{ marginTop: "50px", padding: "0px" }}
              open={Boolean(anchorElNtg)}
              onClose={handleCloseNtg}
            >
              <Box display="flex" alignItems="center" px={1}>
                {((!isCabinet && !isOutbox) || isDraft) && (
                  <Tooltip
                    title={t("SCANNED NOTING")}
                    aria-label="Scanned File"
                  >
                    <div>
                      <NotingScanned
                        rowID={rowID}
                        handleUploadNoting={handleUploadNoting}
                        isBM={isBM}
                        loadSplitViewData={loadSplitViewData}
                        isDraft={isDraft}
                        blnDisableForward={blnDisableForward}
                        handleUploadNtg={handleUploadNtg}
                        disabled={open}
                      />
                    </div>
                  </Tooltip>
                )}

                {/* <Tooltip
            title={t("Search on ChatGPT")}
            aria-label="Search on ChatGPT"
          >
            <span>
              <Button
                id="chatGPT_search"
                variant="contained"
                color="primary"
                className={classes.button}
                onClick={() => setChatGpt(true)}
                disabled={
                  blnDisable ||
                  isRegister ||
                  isrtiforward ||
                  notingData.length === 0
                }
              >
                <Search style={{ fontSize: "1rem" }} />
              </Button>
            </span>
          </Tooltip> */}

                {/* {(!isCabinet || isDraft) && !WaitingRoom && !isOutbox && (
                  <Tooltip
                    title={isBM ? "MOVE TO COALITION" : "MOVE TO BM"}
                    aria-label="Move To Coalition"
                  >
                    <span>
                      <Button
                        id="Move_Coalition"
                        variant="contained"
                        color="primary"
                        className={classes.nonhighlightedButton}
                        disabled={
                          // blnDisable ||
                          isRegister ||
                          isrtiforward ||
                          reSaveNof ||
                          notingData.length === 0
                        }
                        onClick={
                          isBM
                            ? () => handleMoveToCC("noting")
                            : () => handleMoveToBm("noting")
                        }
                      >
                        <MoveToInboxIcon style={{ fontSize: "1rem" }} />
                      </Button>
                    </span>
                  </Tooltip>
                )} */}

                <Tooltip title={"DOWNLOAD NOTING"} aria-label="Download Noting">
                  <span>
                    <IconButton
                      onClick={() => handleDocsDwnld(true)}
                      size="small"
                      className={classes.nonhighlightedButton}
                      disabled={
                        // blnDisable ||
                        isRegister ||
                        isrtiforward ||
                        reSaveNof ||
                        notingData.length === 0 || open
                      }
                    >
                      <GetAppIcon style={{ fontSize: "1rem" }} />
                    </IconButton>
                  </span>
                </Tooltip>

                {(!isCabinet || isDraft) &&
                  !WaitingRoom &&
                  !isOutbox &&
                  !isLf && (
                    <Tooltip
                      title={isBM ? "MOVE TO COLLATION" : "MOVE TO BM"}
                      aria-label="Move To collation"
                    >
                      <span>
                        <IconButton
                          onClick={
                            isBM
                              ? () => handleMoveToCC("noting")
                              : () => handleMoveToBm("noting")
                          }
                          size="small"
                          className={classes.nonhighlightedButton}
                          disabled={
                            // blnDisable ||
                            isRegister ||
                            isrtiforward ||
                            reSaveNof ||
                            notingData.length === 0 || open
                          }
                        >
                          <MoveToInboxIcon style={{ fontSize: "1rem" }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}

                {/* <Tooltip
                  title={t("previous_noting")}
                  aria-label="Previous Noting"
                >
                  <span>
                    <Button
                      id="inbox_previous_noting"
                      variant="outlined"
                      color="primary"
                      className={classes.nonhighlightbutton}
                      onClick={handleChangePreviousNoting}
                      disabled={
                        isRegister || isrtiforward || notingData.length == 0
                      }
                    >
                      <ChevronLeftIcon style={{ fontSize: "1rem" }} />
                    </Button>
                  </span>
                </Tooltip> */}

                {/* <Tooltip title={t("next_noting")} aria-label="Next Noting">
                  <span>
                    <Button
                      id="inbox_next_noting"
                      variant="outlined"
                      color="primary"
                      className={classes.nonhighlightbutton}
                      onClick={handleChangeNextNoting}
                      disabled={
                        isRegister || isrtiforward || notingData.length == 0
                      }
                    >
                      <ChevronRightIcon style={{ fontSize: "1rem" }} />
                    </Button>
                  </span>
                </Tooltip> */}

                {/* {isDraft && (
            <Tooltip title={t("SCANNED")} aria-label="SCANNED">
              <div className={classes.uploadButton}>
                <ScanDocument
                  rowID={rowID}
                  handleUploadNoting={handleUploadNoting}
                />
              </div>
            </Tooltip>
          )} */}
              </Box>
            </Menu>
          </Grid>
        )}

        <Grid
          item
          xs={6}
          style={{
            display: "flex",
            // alignItems: "center",
            justifyContent: !isIndex ? "flex-end" : "initial",
            gap: isIndex ? "2rem" : "initial",
          }}
        >
          <Tooltip
            title={t("previous_enclosure")}
            aria-label="Previous Enclosure"
          >
            <span>
              <IconButton
                onClick={handleChangePreviousEnclosure}
                size="small"
                className={classes.nonhighlightedButton}
                disabled={isRegister || isrtiforward || enclosurelen <= 1 || open}
              >
                <ChevronLeftIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title={t("next_enclosure")} aria-label="Next Enclosure">
            <span>
              <IconButton
                onClick={handleChangeNextEnclosure}
                size="small"
                className={classes.nonhighlightedButton}
                disabled={isRegister || isrtiforward || enclosurelen <= 1 || open}
              >
                <ChevronRightIcon />
              </IconButton>
            </span>
          </Tooltip>

          <Autocomplete
            size="small"
            id="enco-length"
            name="enclosure"
            autoHighlight
            disabled={open}
            options={isIndex ? dakList : enclosureArr}
            value={NOF1}
            onChange={(e, value) => handleChange1(value)}
            getOptionLabel={(option) => {
              return typeof option === "object"
                ? `(${option.flagNumber}${option.flagNumberMarking}) ${option && option.subject.split(".")[0]
                }`
                : "";
            }}
            renderInput={(params, i) => (
              <>
                <TextField
                  style={{ marginTop: "7px" }}
                  {...params}
                  variant="outlined"
                  className={classes.formControl}
                  label={<>

                    <div>
                      {t("enclosure")} <span className="viewOne_count">{enclosurelen}</span>
                    </div>
                  </>}
                  margin="normal"
                />
              </>
            )}
          />
          {isIndex && (
            <Typography variant="body1">
              <b>SUBJECT</b> : {NOF1?.subject}
            </Typography>
          )}
          {WaitingRoom && (
            <Tooltip title={t("scanned_enclosure")} aria-label="Scanned File">
              <div className={classes.uploadButton}>
                <FileScanned
                  handleAddEnclosure={handleAddEnclosure}
                  upload={upload}
                  rowID={rowID}
                  handleuploadCondition={handleuploadCondition}
                  notingSigned={notingSigned}
                  disabled={open}
                />
              </div>
            </Tooltip>
          )}
          {(partCase && !isDraft) || isOutbox ? (
            <>
              {/* <Tooltip
                title={t("previous_enclosure")}
                aria-label="Previous Enclosure"
              >
                <span>
                  <Button
                    id="inbox_previous_enclosure"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleChangePreviousEnclosure}
                    disabled={isRegister || isrtiforward || enclosurelen == 0}
                  >
                    <SkipPreviousIcon style={{ fontSize: "1rem" }} />
                  </Button>
                </span>
              </Tooltip>
              <Tooltip title={t("next_enclosure")} aria-label="Next Enclosure">
                <span>
                  <Button
                    id="inbox_next_enclosure"
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleChangeNextEnclosure}
                    disabled={isRegister || isrtiforward || enclosurelen == 0}
                  >
                    <SkipNextIcon style={{ fontSize: "1rem" }} />
                  </Button>
                </span>
              </Tooltip> */}
              {(!isCabinet || isDraft) &&
                !WaitingRoom &&
                !isOutbox &&
                !isLf && (
                  <Tooltip
                    title={isBM ? "Move to Coalition" : "Move to Bm"}
                    aria-label="Move To Coalition"
                  >
                    <span>
                      <Button
                        id="Move_Coalition"
                        variant="contained"
                        color="primary"
                        className={classes.nonhighlightedButton}
                        onClick={
                          isBM
                            ? () => handleMoveToCC("enclosure")
                            : () => handleMoveToBm("enclosure")
                        }
                        disabled={
                          isRegister || isrtiforward || enclosurelen == 0 || open
                        }
                      >
                        <MoveToInboxIcon style={{ fontSize: "1rem" }} />
                      </Button>
                    </span>
                  </Tooltip>
                )}
            </>
          ) : (
            !isIndex &&
            !WaitingRoom &&
            !isLf && (
              <>
                {!enclosureSigned ? (
                  <Tooltip
                    title={reSaveEnco ? t("autosave") : t("sign")}
                    aria-label="Sign"
                  >
                    <span>
                      <Button
                        id="FlagNumberEnclouser_sign_button"
                        variant="contained"
                        color="secondary"
                        className={classes.nonhighlightbutton}
                        onClick={() => {
                          setFileId(NOF1.fileId);
                          setFlagNumber(prevFlagNumberEnclouser);
                          setSfdtData(prevEnclouser);
                          setFlag("Enclouser");
                          setOpen(true);
                        }}
                        disabled={
                          isPdf ||
                          isRegister ||
                          isrtiforward ||
                          enclosurelen == 0 ||
                          reSaveEnco ||
                          !isDocx ||
                          !isDoc || open
                        }
                      >
                        <CreateIcon style={{ fontSize: "1rem" }} />
                      </Button>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("remove_sign")} aria-label="Remove sign">
                    <span>
                      <Button
                        id="FlagNumberEnclouser_removeSign_button"
                        variant="contained"
                        color="primary"
                        className={classes.nonhighlightbutton}
                        onClick={() => {
                          setFileId(NOF1.fileId);
                          isRti === "true"
                            ? handleRtiDocumentRollbackEnclosure()
                            : handleDocumentRollbackEnclosure();
                        }}
                        disabled={
                          isPdf ||
                          isRegister ||
                          isrtiforward ||
                          enclosurelen == 0 || open
                        }
                      >
                        <RestorePageIcon style={{ fontSize: "1rem" }} />
                      </Button>
                    </span>
                  </Tooltip>
                )}
                {/* {handleuploadCondition() && ( */}

                {!WaitingRoom && !isLf && (
                  <Tooltip title={t("upload_file")} aria-label="Upload File">
                    <span>
                      <div>
                        <FileUploader
                          handleAddEnclosure={handleAddEnclosure}
                          upload={upload}
                          rowID={rowID}
                          handleuploadCondition={handleuploadCondition}
                          notingSigned={notingSigned}
                          disabled={open}
                        />
                      </div>
                    </span>
                  </Tooltip>
                )}

                {/* <Tooltip title={t("import_doc")} aria-label="Import Document">
                  <span>
                    <Button
                      id="import_document_button"
                      variant="contained"
                      color="primary"
                      className={classes.button}
                      onClick={() => {
                        setFileId(NOF1.fileId);
                      }}
                      disabled={
                        isPdf || isRegister || isrtiforward || enclosurelen == 0
                      }
                    >
                      <ImportExportIcon style={{ fontSize: "1rem" }} />
                    </Button>
                  </span>
                </Tooltip> */}
                {/* )} */}
                {!WaitingRoom && (
                  <Tooltip title="MORE">
                    <IconButton
                      style={{ marginTop: "10px" }}
                      id="view-one-moreHorizon"
                      onClick={handleClick}
                      disabled={open}
                    >
                      <MoreHoriz />
                    </IconButton>
                  </Tooltip>
                )}
                <Menu
                  id="simple"
                  anchorEl={anchorEl}
                  keepMounted
                  style={{ marginTop: "50px", padding: "0px" }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Box display="flex" alignItems="center" px={1}>
                    <Tooltip
                      title={t("scanned_enclosure")}
                      aria-label="Scanned File"
                    >
                      <div>
                        <FileScanned
                          handleAddEnclosure={handleAddEnclosure}
                          upload={upload}
                          rowID={rowID}
                          handleuploadCondition={handleuploadCondition}
                          notingSigned={notingSigned}
                          disabled={open}
                        />
                      </div>
                    </Tooltip>
                    {/* {!isDraft && !partCase && (
                      <Tooltip
                        title={t(
                          "add_cover_letter_to_forward_pa_to_next_level"
                        )}
                        aria-label="Cover Letter"
                      >
                        <span>
                          <Button
                            id="add_cover_letter"
                            variant="contained"
                            color="primary"
                            className={classes.button}
                            disabled={
                              hasCoverNote || department != hrmDepartmet
                            }
                            onClick={handleCoverLetter}
                            style={{
                              display: `${!isRti ? "" : "none"}`,
                            }}
                          >
                            <AddIcon style={{ fontSize: "1rem" }} />
                          </Button>
                        </span>
                      </Tooltip>
                    )} */}

                    {/*!isDraft && !partCase && (
                      <Tooltip
                        title={t(
                          "add_cover_letter_to_forward_pa_to_next_level"
                        )}
                        aria-label="Cover Letter"
                      >
                        <IconButton
                          onClick={handleCoverLetter}
                          size="medium"
                          className={classes.nonhighlightedButton}
                          disabled={hasCoverNote || department != hrmDepartmet}
                        >
                          <AddIcon style={{ fontSize: "1rem" }} />
                        </IconButton>
                      </Tooltip>
                    )*/}

                    {(isDraft || !partCase) && (
                      <>
                        {/* <Tooltip
                          title={t("edit_enclosure_number")}
                          aria-label="Edit Flagnumber"
                        >
                          <span>
                            <Button
                              id="edit_enclosure_number_button"
                              variant="contained"
                              color="primary"
                              disabled={
                                rolename !== NOF1?.uploader ||
                                isRegister ||
                                isrtiforward ||
                                upload
                              }
                              className={classes.button}
                              onClick={handleFlagOpen}
                            >
                              <LocalOfferIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip> */}

                        <Tooltip
                          title={"DOWNLOAD ENCLOSURE"}
                          aria-label="Download Noting"
                        >
                          <span>
                            <IconButton
                              onClick={() => {
                                handleDocsDwnld(false);
                              }}
                              size="small"
                              className={classes.nonhighlightedButton}
                              disabled={
                                // blnDisable ||
                                isRegister ||
                                isrtiforward ||
                                reSaveNof ||
                                enclosurelen == 0 || open
                              }
                            >
                              <GetAppIcon style={{ fontSize: "1rem" }} />
                            </IconButton>
                          </span>
                        </Tooltip>

                        {/* <Tooltip
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
                                rolename !== NOF1?.uploader ||
                                NOF1?.status !== "Internal" ||
                                isRegister ||
                                isrtiforward ||
                                enclosurelen == 0 ||
                                upload
                              }
                              onClick={() => {
                                setFileId(NOF1?.fileId);
                                setFlagNumber(prevFlagNumberEnclouser);
                                isRti === "true"
                                  ? deleteEnclosureDataRti()
                                  : deleteEnclosureData();
                              }}
                            >
                              <DeleteIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip> */}

                        <Tooltip
                          title={t("delete_enclosure")}
                          aria-label="Delete Enclosure"
                        >
                          <span>
                            <IconButton
                              onClick={() => {
                                setFileId(NOF1?.fileId);
                                setFlagNumber(prevFlagNumberEnclouser);
                                isRti === "true"
                                  ? deleteEnclosureDataRti()
                                  : deleteEnclosureData();
                              }}
                              size="medium"
                              className={classes.nonhighlightedButton}
                              disabled={
                                rolename !== NOF1?.uploader ||
                                NOF1?.status !== "Internal" ||
                                isRegister ||
                                isrtiforward ||
                                enclosurelen == 0 ||
                                upload || open
                              }
                            >
                              <DeleteIcon style={{ fontSize: "1rem" }} />
                            </IconButton>
                          </span>
                        </Tooltip>

                        <Tooltip
                          title={t("edit_enclosure_number")}
                          aria-label="Edit Flagnumber"
                        >
                          <span>
                            <IconButton
                              onClick={handleFlagOpen}
                              size="medium"
                              className={classes.nonhighlightedButton}
                              disabled={
                                rolename !== NOF1?.uploader ||
                                isRegister ||
                                isrtiforward ||
                                upload || open
                              }
                            >
                              <LocalOfferIcon style={{ fontSize: "1rem" }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                        {/* {isDraft && (
                        <Tooltip title={t("Cloud")} aria-label="Cloud_Upload">
                          <span>
                            <Button
                              id="cloud_upload"
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              onClick={handleClickOpenCloudTable}
                            >
                              <CloudUploadIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip>
                      )} */}
                        {/* <Tooltip
                          title={isBM ? "MOVE TO COALITION" : "MOVE TO BM"}
                          aria-label="Move To Coalition"
                        >
                          <span>
                            <Button
                              id="Move_Coalition"
                              variant="contained"
                              color="primary"
                              className={classes.button}
                              disabled={
                                // blnDisable ||
                                isRegister ||
                                isrtiforward ||
                                reSaveNof ||
                                enclosurelen == 0
                              }
                              onClick={
                                isBM
                                  ? () => handleMoveToCC("enclosure")
                                  : () => handleMoveToBm("enclosure")
                              }
                            >
                              <MoveToInboxIcon style={{ fontSize: "1rem" }} />
                            </Button>
                          </span>
                        </Tooltip> */}
                        <Tooltip
                          title={isBM ? "MOVE TO COLLATION" : "MOVE TO BM"}
                          aria-label="Move To Collation"
                        >
                          <span>
                            <IconButton
                              onClick={
                                isBM
                                  ? () => handleMoveToCC("enclosure")
                                  : () => handleMoveToBm("enclosure")
                              }
                              size="medium"
                              className={classes.nonhighlightedButton}
                              disabled={
                                // blnDisable ||
                                isRegister ||
                                isrtiforward ||
                                reSaveNof ||
                                enclosurelen == 0 || open
                              }
                            >
                              <MoveToInboxIcon style={{ fontSize: "1rem" }} />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </>
                    )}
                    {/* <Tooltip
                      title={t("previous_enclosure")}
                      aria-label="Previous Enclosure"
                    >
                      <span>
                        <Button
                          id="inbox_previous_enclosure"
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={handleChangePreviousEnclosure}
                          disabled={
                            isRegister || isrtiforward || enclosurelen == 0
                          }
                        >
                          <SkipPreviousIcon style={{ fontSize: "1rem" }} />
                        </Button>
                      </span>
                    </Tooltip> */}

                    {/* <Tooltip
                      title={t("next_enclosure")}
                      aria-label="Next Enclosure"
                    >
                      <span>
                        <Button
                          id="inbox_next_enclosure"
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          onClick={handleChangeNextEnclosure}
                          disabled={
                            isRegister || isrtiforward || enclosurelen == 0
                          }
                        >
                          <SkipNextIcon style={{ fontSize: "1rem" }} />
                        </Button>
                      </span>
                    </Tooltip> */}
                  </Box>
                </Menu>
              </>
            )
          )}
        </Grid>

        <SplitterComponent
          resizeStop={(e) => {
            setResize(true);
          }}
          style={{ zIndex: "0", marginTop: "-19px" }}
          orientation={width <= 750 ? "Vertical" : "Horizontal"}
        >
          {!isIndex && (
            <div
              style={{
                width: width <= 750 ? "100%" : "60%",
              }}
            >
              <div
                className="text_center"
                style={{
                  display: notingData.length === 0 ? "flex" : "none",
                }}
              >
                <Typography variant="h5" component="h5">
                  No Noting availabe
                </Typography>
              </div>

              <>
                <div
                  style={{
                    display:
                      !blnHideSyncfusion && openInPdf && notingData.length != 0
                        ? "block"
                        : "none",
                  }}
                >
                  <div
                    className="customDiv ss-privacy-hide"
                    style={{
                      border: "1px solid #b6b6b6",
                      height: "calc(100vh - 150px)",
                    }}
                  >
                    <HeadersAndFootersView
                      fileId={!blnHideSyncfusion && openInPdf ? rowID : ""}
                      fileUrl1={
                        !blnHideSyncfusion && openInPdf ? notingURL : ""
                      }
                      comment={true}
                      blnIsPartCase={true}
                      reSave={reSaveNof}
                      setreSave={(val) => {
                        setreSaveNof(val);
                      }}
                      resize={resize}
                      handleResize={(val) => setResize(val)}
                      enclosureData={enclosureData}
                      handleChange1={handleChange1}
                      style={{ border: "1px solid #b6b6b6" }}
                      containerId={isBM ? "container424" : "container55656556"}
                      timer={1000}
                    />
                  </div>
                </div>

                <div
                  style={{
                    display:
                      !showSWpdf() || notingData?.length == 0
                        ? "none"
                        : "block",
                  }}
                >
                  <div
                    style={{
                      border: "1px solid #80808073",
                      height: "calc(100vh - 150px)",
                      overflow: "hidden",
                    }}
                    className="ss-privacy-hide"
                  >
                    <SplitViewPdfViewer
                      fileUrl={!blnHideSyncfusion && openInPdf ? "" : notingURL}
                      pdfLoads={(val) => {
                        setpdfLoads(val);
                      }}
                      isCustomLink={true}
                      enclosureData={enclosureArr}
                      handleChange1={handleChange1}
                      fileId={!blnHideSyncfusion && openInPdf ? "" : rowID}
                      flag={"SPLIT"}
                      editable={isCabinet || isOutbox ? false : true}
                      flagNumber={prevFlagNumberNF}
                      anottId={nofAnnoId}
                      extension={extension2}
                      signed={notingSigned}
                      handleNofAnnoid={handleNofAnnoid}
                      toggleState={toggleState}
                    />
                  </div>
                </div>
              </>
            </div>
          )}

          <div style={{ width: width <= 750 ? "100%" : "40%" }}>
            <Grid
              container
              style={{
                flexWrap: "nowrap",
                height: "100%",
                // display: "grid",
                // gridTemplateColumns: hanldeCheckCondition() ? "1fr 2.2rem" : "1fr",
              }}
            >
              <Grid
                item
                style={{
                  border: "1px solid #b6b6b6",
                  width: hanldeCheckCondition() ? "94%" : "100%",
                }}
              >
                <div
                  className="customDiv ss-privacy-hide"
                  style={{
                    display: !enclosureSigned && coverLetter ? "block" : "none",
                    height: "calc(100vh - 150px)",
                  }}
                >
                  <HeadersAndFootersView
                    fileId={!enclosureSigned && coverLetter ? rowID : ""}
                    fileUrl1={!enclosureSigned && coverLetter ? URL : ""}
                    blnIsPartCase={true}
                    comment={true}
                    reSave={reSaveEnco}
                    setreSave={(val) => {
                      setreSaveEnco(val);
                    }}
                    resize={resize}
                    handleResize={(val) => setResize(val)}
                    enclosureData={enclosureData}
                    style={{ border: "1px solid #b6b6b6" }}
                    containerId={isBM ? "container1002" : "container2000"}
                    timer={1000}
                  />
                </div>

                <div
                  style={{
                    display: !enclosureSigned && coverLetter ? "none" : "block",
                    height: "calc(100vh - 150px)",
                  }}
                  className="ss-privacy-hide"
                >
                  <PdfViewer
                    personalID={!enclosureSigned && coverLetter ? "" : rowID}
                    flag={"SPLIT"}
                    editable={isCabinet || isOutbox ? false : true}
                    flagNumber={prevFlagNumberEnclouser}
                    fileUrl={""}
                    pdfLoads={(val) => {
                      setEnclosurePdfLoads(val);
                    }}
                    handleChangePage={handleChangePage}
                    pageNumber={pageNumber}
                    isPage={true}
                    anottId={enclosureAnnoiD}
                    isSample={enclosureArr.length > 0 || isIndex ? false : true}
                    signed={enclosureSigned}
                    reLoadPdf={reLoadPDf}
                    handleEncoAnnoid={handleEncoAnnoid}
                  />
                </div>
              </Grid>

              {
                // (partCase !== "true" || isRti !== "true")
                /**
                 hanldeCheckCondition() && (
                  <Grid
                    item
                    style={{
                      width: "10%",
                    }}
                  >
                    <div className="split-custom-btn-wrapper">
                      {pdfViewerButtons.map((item, i) => {
                        return (
                          <Button
                            id={`pdfViewerButtons_${i}`}
                            key={item.btnId}
                            size={"small"}
                            fileurl={item.fileurl}
                            buttonname={item.btnId}
                            page={item.pageNumber}
                            style={{ backgroundColor: item.backgroundColor }}
                            onClick={(e) => pdfCustomButton(e)}
                            className="split-btn-custom"
                            variant="contained"
                            color="primary"
                            href="#contained-buttons"
                            disabled={
                              NOF1?.coverNote && item.backgroundColor == "grey"
                            }
                          >
                            {item.btnName}
                          </Button>
                        );
                      })}
                      <Tooltip title={t("reset_tags")}>
                        <div style={{ fontSize: "1rem", color: "grey" }}>
                          <Button
                            id="reset_tags_button"
                            className="split-btn-custom"
                            onClick={resetButton}
                            variant="contained"
                          >
                            <Replay
                              style={{ fontSize: "medium", paddingTop: "5px" }}
                            />
                          </Button>
                        </div>
                      </Tooltip>
                    </div>
                  </Grid>
                )
                */
              }
            </Grid>
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
        hideBackdrop
        disableEnforceFocus
        disableBackdropClick
        style={{
          position: 'initial',
        }}
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("remark_&_sign")}</span>
          <IconButton
            id="Enclosure_remark_&_sign"
            aria-label="close"
            onClick={() => setOpen(false)}
            color="primary"
            className="cancel-drag"
          >
            <CancelIcon
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </DialogTitle>
        <InputForm
          flag={flag}
          callBackURL={handleReturnedURL}
          isSignedCompleted={handleSignedCompleted}
          handleEnclosure={handleEnclosure}
          loadData={loadData}
          fileId={rowID}
          SignURL={sfdtData}
          flagNum={flagNumber}
          docId={fileId}
          setpdfLoads={setpdfLoads}
          setBlnHideSyncfusion={setBlnHideSyncfusion}
          setNotingSigned={setNotingSigned}
          isBM={isBM}
        />
      </Dialog>

      <Dialog
        open={openConfirmation}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenConfirmation(false);
          }
        }}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}?
          <IconButton
            id="setOpenConfirmation_button"
            aria-label="close"
            onClick={() => setOpenConfirmation(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
            className="cancel-drag"
          >
            <CancelIcon
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: props.theme ? "#fff" : "black" }}
          >
            {props.status === "Approved" || props.status === "Rejected" ? (
              <p>
                Update status to applicant <br />
                status = <strong>{props.status}</strong>
              </p>
            ) : (
              <p>
                {t("confirmation_text")} <br />
                {t("confirmation_text_2")}
              </p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <FormControl component="fieldset">
            <RadioGroup row>
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("NO")}
                value="NO"
                onClick={() => setOpenConfirmation(false)}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("YES")}
                value="YES"
                onClick={handleSendConfirmation}
              />
            </RadioGroup>
          </FormControl>
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
            className="dialog_title"
            style={{ cursor: "move" }}
          >
            {t("send_to")}
            <Tooltip title={t("close")}>
              <IconButton
                id="inbox_splitView_send_to"
                aria-label="close"
                onClick={() => setSend(false)}
                color="primary"
                className="cancel-drag"
              >
                <CancelIcon
                  style={{ color: props.theme ? "#fff" : "#484747" }}
                />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          {isRti === "true" ? (
            <RtiHrmDialog
              fileId={FileID}
              handleClose={() => setSend(false)}
              pfileName={referenceNumber}
              departmentList={departmentList}
              status={status}
              enclosureArr={enclosureArr}
            />
          ) : (
            <HrmDialog
              handleClose={() => setSend(false)}
              pfileName={referenceNumber}
              enclosureArr={enclosureArr}
              serviceLetterId={serviceLetterId}
              departmentList={departmentList}
              status={status}
              fileId={fileId}
              notinglen={notinglen}
              enclosurelen={enclosurelen}
              notingSigned={notingSigned}
              isBM={isBM}
              filestatus={filestatus}
              externalList={externalList}
              internalList={internalList}
              externalInList={externalInList}
              notingList={notingData}
              pendingRoute={pendingRoute}
              completedRoute={completedRoute}
            />
          )}
        </Paper>
      </Dialog>

      <Dialog
        open={coverLetterDialog}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setCoverLetterDialog(false);
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
          {t("create_cover_letter")}
          <Tooltip title={t("close")}>
            <IconButton
              id="setCoverLetterDialog_close_button"
              aria-label="close"
              onClick={() => setCoverLetterDialog(false)}
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
        <CoverLetterDialog
          enclosureArr={enclosureArr}
          handleSend={handleAddCoverLetter}
          loading={loading}
        />
      </Dialog>

      <Dialog
        open={openDialog}
        PaperComponent={PaperComponent}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleFlagClose();
          }
        }}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("edit_enclosure_number")}</span>
          <IconButton
            id="add_enclosure_number_close_button"
            aria-label="close"
            onClick={handleFlagClose}
            color="primary"
            className="cancel-drag"
          >
            <CancelIcon
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </DialogTitle>

        <form
          onSubmit={
            value == 0
              ? (e) => handleEncoEdit(e, "noting")
              : (e) => handleEncoEdit(e, "enco")
          }
        >
          <DialogContent dividers>
            <Tabs
              value={value}
              onChange={(e, val) => setValue(val)}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
            >
              <Tab label={t("swap_with_noting")} {...a11yProps(0)} />
              <Tab label={t("swap_with_enco")} {...a11yProps(1)} />
            </Tabs>
            <SwipeableViews
              axis={theme.direction === "rtl" ? "x-reverse" : "x"}
              index={value}
              onChangeIndex={(index) => setValue(index)}
            >
              <TabPanel value={value} index={0} dir={theme.direction}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <TextField
                      value={flagVal}
                      id="outlined-basic"
                      label="Enclosure Flag No"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <SwapHorizIcon fontSize="large" />
                  </Grid>
                  <Grid item>
                    <TextField
                      value={notingFlag}
                      id="outlined-basic"
                      label="Noting Flag No"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={encoSubject}
                      fullWidth
                      onChange={(e) => setEncoSubject(e.target.value)}
                      id="outlined-basic"
                      label="Subject"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={value} index={1} dir={theme.direction}>
                <Grid
                  container
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={2}
                >
                  <Grid item>
                    <TextField
                      value={flagVal}
                      id="outlined-basic"
                      label="Enclosure Flag No"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Grid>
                  <Grid item>
                    <SwapHorizIcon fontSize="large" />
                  </Grid>
                  <Grid item xs={6}>
                    {/*
                    <TextField
                      value={notingFlag}
                      id="outlined-basic"
                      label="Noting Flag No"
                      variant="outlined"
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    */}
                    <Autocomplete
                      freeSolo
                      forcePopupIcon={true}
                      options={enclosureArr}
                      id="tags-outlined"
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? `${option.flagNumber}`
                          : "";
                      }}
                      value={swapFlag}
                      onChange={(event, newValue) => setSwapFlag(newValue)}
                      filterSelectedOptions
                      getOptionDisabled={(option) =>
                        option?.status != "Internal" ||
                        option?.flagNumber == flagVal
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={t("search_favourite")}
                          placeholder={t("enter_service_number")}
                          className={props.theme ? "darkTextField" : ""}
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      value={encoSubject?.split(".")[0]}
                      fullWidth
                      onChange={(e) => setEncoSubject(e.target.value)}
                      id="outlined-basic"
                      label="Subject"
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </TabPanel>
            </SwipeableViews>
          </DialogContent>

          <DialogActions>
            <Button
              id="fileForm_send_btn"
              className="sendIcon"
              color="secondary"
              variant="contained"
              type="submit"
              endIcon={<Done />}
            >
              {t("save")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        open={cahtGpt}
        PaperComponent={PaperComponent}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setChatGpt(false);
          }
        }}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>SEARCH ON ChatGPT</span>
          <IconButton
            id="close_chatGpt"
            aria-label="close"
            onClick={() => setChatGpt(false)}
            color="primary"
            className="cancel-drag"
          >
            <CancelIcon
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </DialogTitle>
        <ChatGptDialog />
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
              <CancelIcon
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
            {t("nfa_confirm_file")} ?{" "}
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
              <CancelIcon style={{ color: props.theme ? "#fff" : "#484747" }} />
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
            deptName={dept}
            extHistory={extList}
            history={historyObj}
          />
        </DialogContent>
      </Dialog>

      {/*
        <div className="cloud_table_container">
        {opencloud && <CloudTable opencloud={opencloud} />}
      </div>
        */}

      <Dialog
        open={openPc}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handlePC(false);
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
          <span>{t("sel_file_pc")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              color="primary"
              style={{ float: "right" }}
              onClick={() => handlePC(false)}
              className="cancel-drag"
            >
              <CancelIcon
                style={{
                  cursor: "pointer",
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("subject")}
            name="subject"
            variant="outlined"
            value={pcSubject}
            onChange={(e) => setPcSubject(e.target.value)}
            fullWidth
            size="small"
            style={{ margin: "1rem 0" }}
            className={props.theme ? "darkTextField" : ""}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={t("subject")}
          />
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_fileList_cancel_button"
            variant="contained"
            endIcon={<Close />}
            onClick={() => handlePC(false)}
            color="primary"
          >
            {t("cancel")}
          </Button>
          <Button
            id="redirectToSplitView_ok_button"
            variant="contained"
            onClick={handleClickPc}
            color="secondary"
            endIcon={<Done />}
            autoFocus
          >
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>

      <BarcodeView
        open={barcodeOpen}
        data={barCode}
        handleBarcodeClose={handlePopupClose}
      />

      <LinkedFileTable
        open={openLF}
        handleClose={() => setopenLF(false)}
        handleAdd={handleLfAdd}
      />

      <Eric
        open={createEric}
        handleClose={handleEric}
        handleEric={handleCreateEric}
        ericType="File"
      />

      <MonitorStatus open={monitorStatus} handleClose={handleMonitor} type />
      <ShareFile open={openShare} handleClose={handleShare} type />

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
                  color: theme ? "#fff" : "#484747",
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
      {apOpenForm && (
        <ActionPointForm
          open={apOpenForm}
          handleClose={handleCloseAPform}
          fileURLs={fileUrls}
          fileUrlwithNameNoting={fileUrlwithNameNoting}
          fileUrlwithNameEnclousere={fileUrlwithNameEnclousere}
        />
      )}

    </>
  );
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
    inboxer: state.inboxer,
    theme: state.theme,
    disableArr: state.gateway.disableArr,
  };
};
export default connect(mapStateToProps, {
  setInboxDatas,
  loadInboxDataSplitView,
  loadPartCaseData,
  getPANotingData,
  getPAEnclosureData,
  savePartCaseTag,
  fetchSplitViewTags,
  createPartCaseNotingFile,
  rollbackSplitViewDocument,
  rollbackSplitViewEnclosureDocument,
  createCoverLetter,
  deleteEnclosure,
  editFlagNumber,
  validateFlagNumber,
  loadRtiPartCaseData,
  rollbackRtiSplitViewDocument,
  rollbackRtiSplitViewEnclosureDocument,
  saveRtiFile,
  loadRtiDataSplitView,
  returnRti,
  sendbackRti,
  getdownloadZip,
  deleteEnclosureRti,
  fetchSplitViewTagsRti,
  savePartCaseTagRti,
  editRtiFlagNumber,
  getcabinetpartcase,
  openFile,
  MoveToCC,
  MoveToBM,
  editEncoSubject,
  sendToCoord,
  deleteNoting,
  URLHide,
  moveToNfa,
  getHistoryOld,
  createPC,
  getHistory,
  linkFile
})(ViewOne);
