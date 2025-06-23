import React, { useState, useEffect, useMemo, useRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  Paper,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  Menu,
  MenuItem,
  Grid,
  Fab,
  Slide,
  makeStyles,
  DialogContent,
  Box,
  Button,
  TextField,
  DialogActions,
} from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  loadInboxData,
  loadSfdt,
  getReadStatus,
  getPinInboxId,
  getFlagStatus,
  rollbackCorrDocument,
  getCorespondence,
  currentSign,
  getMrInboxData,
  moveToPending,
  uploadScannedDak
} from "../../../camunda_redux/redux/action";
import { setPassData } from "../../../camunda_redux/redux/ducks/passData";
import { setInboxDatas } from "../../../redux/actions/InboxActions";
import { changingTableStateInbox } from "../../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import "../therme-source/material-ui/loading.css";
import { RiFlag2Fill, RiMailOpenLine, RiFlag2Line } from "react-icons/ri";
import { AiFillPushpin, AiOutlineMail, AiOutlinePushpin } from "react-icons/ai";
import DraftsIcon from "@material-ui/icons/Drafts";
import SaveIcon from "@material-ui/icons/Save";
import CancelIcon from "@material-ui/icons/Cancel";
import ReplyIcon from "@material-ui/icons/Reply";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import AddIcon from "@material-ui/icons/Add";
import UploadIcon from '@mui/icons-material/Upload';
import HrmDialog from "./HrmDialog";
import { unstable_batchedUpdates } from "react-dom";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import Draggable from "react-draggable";
import NofFilesTable from "./NofFilesTable";
import { clearCookie, handleError } from "utils";
import { MaterialReactTable } from "material-react-table";
import {
  CancelOutlined,
  Cancel,
  Create,
  RestorePage,
  Send,
  Done,
  Mail,
} from "@material-ui/icons";
import CorrespondenceForm from "app/views/Correspondence/CorrespondenceForm";
import PersonalFileForm from "app/views/Personnel/PersonalFileForm";
import { Loading } from "../therme-source/material-ui/loading";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  INBOX_COLUMNS_STATUS,
  OPEN_PA_DRAFT,
} from "app/camunda_redux/redux/constants/ActionTypes";
import SplitViewPdfViewer from "../shared/pdfViewer/pdfViewer";
import HeadersAndFootersView from "../../FileApproval/documentEditor/editor";
import CorrHrmDialog from "app/views/Correspondence/CorrHrmDialog";
import Annexure from "app/views/Personnel/Annexure";
import InputForm from "../../Personnel/quickSignFrom";
import MailRoom from "./MailRoom";
import CreateFile from "app/views/Cabinet/folder/CreateFile";
import CommonHrm from "./CommonHrm";
import GenericColHider from "app/views/utilities/GenericColHider";
import PaginationComp2 from "app/views/utilities/PaginationComp2";
import GenericRefresh from "app/views/utilities/GenericRefresh";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  divZIndex: {
    zIndex: "0",
    "& .MuiDialogContent-dividers": {
      padding: "0px 0px !important",
    },
    "& #pdfV": {
      height: "calc(100vh - 47px) !important",
    },
    "& .e-de-ctn": {
      height: "calc(100vh - 48px) !important",
    },
  },
  sign_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "30px !important",
    zIndex: 10,
  },
  sign_btn1: {
    position: "fixed",
    right: "30px !important",
    bottom: "150px !important",
    zIndex: 10,
  },
  send_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "30px !important",
    zIndex: 10,
  },
  upload_pdf_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "90px !important",
    zIndex: 10,
  },
  headerText: {
    display: "inline-flex",
    justifyContent: "center",
    marginBottom: "0px",
    margin: 0,
    fontSize: "1rem",
  },
  table: {
    minWidth: "900px",
  },
  prevBtn: {
    position: "absolute",
    top: 1,
    right: "215px",
    zIndex: 999,
  },
  nextBtn: {
    position: "absolute",
    top: 1,
    right: "140px",
    zIndex: 999,
  },
  headerAddIcon: {
    width: "30px",
    minHeight: "30px",
    height: "30px",
    backgroundColor: "rgb(230, 81, 71)",
    marginLeft: "4px",
  },
  chipBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "-4px",
  },
}));

const InboxTable = (props) => {
  const { t } = useTranslation();

  const history = useHistory();
  const location = useLocation();

  const inputRef = useRef(null);

  const searchParams = new URLSearchParams(location.search);
  const paramPage = searchParams.get("page");
  const paramSize = searchParams.get("pageSize");
  const paramFilter = searchParams.get("filter");
  const paramSort = searchParams.get("sort");

  const tableInstanceRef = useRef(null);

  const { roleName, deptName } = useSelector(
    (state) => state?.user?.currentUserRole
  );

  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(paramPage) || 1);
  const [pageSize, setPageSize] = useState(Number(paramSize) || 25);
  const [Filter, setFilter] = useState(() => {
    const filter = JSON.parse(decodeURIComponent(paramFilter))
    if (filter) return filter
    else {
      const type = window.location.search
      return type == "?File" ? { "type|Type": "File" } : type == "?Dak" ? { "type|Type": "Dak" } : {}
    }
  });
  const [SortBy, setSortBy] = useState(
    JSON.parse(decodeURIComponent(paramSort)) || {}
  );

  const [totalCount, setTotalCount] = useState(0);

  const [inboxId, setInboxId] = useState("");
  const dispatch = useDispatch();
  const { blnValueInbox } = props.subscribeApi;
  const {
    personalId,
    annotationId,
    blnShowPdf,
    isViewerClosed,
    setIsViewerClosed,
    isPending,
    handlePending,
  } = props;

  const [open, setOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState("All");
  const [pinListener, setPinListener] = useState(false);
  const [nofDialog, setNofDialog] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");
  const department = sessionStorage.getItem("department");

  const [waitingClick, setWaitingClick] = useState(null);
  const [lastClick, setLastClick] = useState(0);
  // Create draft / correspondence from inbox
  const [openCorr, setOpenCorr] = useState(false);
  const [nof, setNof] = useState("");
  const [corrFile, setCorrFile] = useState(false);
  const [handleClickId, setHandleClickId] = useState("");

  // Create BM file from inbox
  const [openfile, setOpenfile] = useState(false);

  // DraftPaTable State
  const [openQuickSign, setOpenQuickSign] = useState(false);
  const [send, setSend] = useState(false);
  const [blnOpenQuickSign, setblnOpenQuickSign] = useState(true);
  const [blnOpenEditor, setblnOpenEditor] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);
  const [rowID, setRowID] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [pdfLoads, setPdfLoads] = useState(false);
  const [headerLable, setHeaderLable] = useState({});
  const [openPaDialog, setOpenPaDialog] = useState(false);
  const [reSave, setreSave] = useState(false);
  const [loading, setloading] = useState(false);
  const [corrType, setCorrType] = useState("");
  const [openSign, setOpenSign] = useState(false);

  const [isMr, setisMr] = useState(false);
  const [openMr, setOpenMr] = useState(false);
  const [mailRoomData, setmailRoomData] = useState("");
  const [itemsInfo, setItemsInfo] = useState({});

  // create BM file from inbox

  const [commonSend, setCommonSend] = useState(false);

  const [checkedRows, setCheckedRows] = useState({}); // For handling mrt table selected row state

  const [openDate, setOpenDate] = useState(false);

  const [openUpload, setOpenUpload] = useState(false);
  const [draftDakObj, setDraftDakObj] = useState("");
  const [subject, setSubject] = useState("");
  const [isScanned, setIsScanned] = useState(false);

  const [toggleState, setToggleState] = useState(false)
  const [selectedType, setSelectedType] = useState("")

  const handleUploadClose = () => {
    setDraftDakObj(null);
    setSubject("");
    setOpenUpload(false);
    setIsScanned(false);
  }

  const { inboxHiddenColumns } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );

  let inboxCol = {
    subject: true,
    createdOn: true,
    displayFrom: true,
    receivedIn: true,
    inwardsId: true,
    classification: true,
    originator: true,
    referenceNumber: true,
    type: true,
    assign: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    inboxHiddenColumns || inboxCol
  );

  const classes = useStyles();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const syncStateWithURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    const size = searchParams.get("pageSize");
    const filter = searchParams.get("filter");
    const sort = searchParams.get("sort");

    if (page && parseInt(page, 25) !== currentPage) {
      setCurrentPage(parseInt(page, 25));
    }
    if (size && parseInt(size, 25) !== pageSize) {
      setPageSize(parseInt(size, 25));
    }

    if (
      filter &&
      JSON.stringify(JSON.parse(decodeURIComponent(filter))) !==
      JSON.stringify(Filter)
    ) {
      try {
        const decodedFilter = decodeURIComponent(filter);
        const parsedFilter = JSON.parse(decodedFilter);
        setFilter(parsedFilter);
      } catch (error) {
        console.error("Failed to parse filter:", error);
      }
    }
    if (
      sort &&
      JSON.stringify(JSON.parse(decodeURIComponent(sort))) !==
      JSON.stringify(SortBy)
    ) {
      try {
        const decodedSort = decodeURIComponent(sort);
        const parsedSort = JSON.parse(decodedSort);
        setSortBy(parsedSort);
      } catch (error) {
        console.error("Failed to parse sort:", error);
      }
    }
  };
  useEffect(() => {
    syncStateWithURL();
  }, []);

  const handleSearchParams = (type, newValue) => {
    const searchParams = new URLSearchParams(location.search);

    if (type === "pageNum") {
      searchParams.set("page", newValue);
    } else if (type === "pageSize") {
      searchParams.set("page", 1);
      searchParams.set("pageSize", newValue);
    } else if (type === "filter") {
      const filter = JSON.stringify(newValue);
      searchParams.set("page", 1);
      searchParams.set("pageSize", 25);
      searchParams.set("filter", encodeURIComponent(filter));
    } else if (type === "sort") {
      const sort = JSON.stringify(newValue);
      searchParams.set("page", 1);
      searchParams.set("pageSize", 25);
      searchParams.set("sort", encodeURIComponent(sort));
    }

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSubmit = () => {
    setloading(true);
    const formData = new FormData();
    formData.append("file", draftDakObj);

    props.uploadScannedDak(rowID, formData, subject).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          setloading(false);
        } else {
          unstable_batchedUpdates(() => {
            setblnOpenQuickSign(resp.response.isSigned);
            dispatch(setSnackbar(true, "success", t("scan_dak_upload_succ")));
            setIsScanned(true);
            setOpenUpload(false);
            setToggleState(!toggleState)
            setFileURL(resp.response.fileUrl);
            setloading(false);
          })

        }

      } catch (e) {
        callMessageOut(e.message);
        setloading(false);
      }
    })
  }

  useEffect(() => {
    if (tableInstanceRef.current) {
      const rows = tableInstanceRef.current
        ?.getSelectedRowModel()
        .flatRows.map((row) => row.original);
      setSelectedRows(rows);
    }
  }, [checkedRows, tableInstanceRef]);

  const handleNof = (file) => {
    setNof(file);
    setCorrFile(false);
  };

  const handleFile = (val) => {
    setOpenfile(val);
  };

  const handleTrigger = () => {
    setTrigger(true);
  };

  const handleCorr = (val) => {
    setOpenCorr(val);
    setNof("");
  };

  let ClickTimer;
  let preventClick = false;

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "subject",
      label: "Subject",
    },
    {
      value: "ref",
      label: "Ref #",
    },
    {
      value: "from",
      label: "From",
    },
    // {
    //   value: "type",
    //   label: "Type",
    // },
    {
      value: "inwardsId",
      label: "Inward #",
    },
    // {
    //   value: "createdOn",
    //   label: "Received On",
    // },
    {
      value: "range",
      label: "Date Range",
    },
    // {
    //   value: "priority",
    //   label: "Priority",
    // },
  ];

  const FilterTypes = {
    type: "select",
    optionValue: FilterOption,
    size: "small",
    variant: "outlined",
    label: "Filter-By",
    color: "primary",
  };
  const FilterValueTypes = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "ref",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    // {
    //   name: "createdOn",
    //   type: "date",
    //   size: "small",
    //   variant: "outlined",
    //   color: "primary",
    // },
    {
      name: "type",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "inwardsId",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "from",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "range",
      type: "range",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    // {
    //   name: "priority",
    //   type: "select",
    //   optionValue: ["low", "medium", "high"],
    //   size: "small",
    //   variant: "outlined",
    //   label: "Value",
    //   color: "primary",
    // },
  ];

  const handleMenuClose = (event) => {
    event.stopPropagation();
    if (event.target.innerText != "") {
      setSelectedMenuItem(event.target.innerText);
      setCurrentPage(1);
    }
  };

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(1);
        setPageSize(25);
        handleSearchParams("filter", newFilter);
      });
    }
  };

  // console.log(Filter);

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    unstable_batchedUpdates(() => {
      setFilter(newFilter);
      setCurrentPage(1);
      setPageSize(25);
    });

    const searchParams = new URLSearchParams(location.search);

    searchParams.set("page", 1);
    searchParams.set("pageSize", 25);

    if (Object.keys(newFilter).length > 0) {
      const updatedFilter = JSON.stringify(newFilter);
      searchParams.set("filter", encodeURIComponent(updatedFilter));
    } else {
      searchParams.delete("filter");
    }

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const addSort = (sortObj) => {
    unstable_batchedUpdates(() => {
      setSortBy(sortObj);
      setCurrentPage(1);
      setPageSize(25);
      handleSearchParams("sort", sortObj);
    });
  };

  const SortValueTypes = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Received On",
    },
  ];

  const NestedSort = [
    {
      name: "All",
      onClick: handleMenuClose,
    },
    {
      name: "Unread",
      onClick: handleMenuClose,
    },
    {
      name: "Flagged",
      onClick: handleMenuClose,
    },
  ];

  useEffect(() => {
    if (!blnOpenQuickSign) {
      setPdfLoads(false);
    }
  }, [blnOpenQuickSign]);

  // Here inbox only available when user have selected some role
  useEffect(() => {
    if (Object.keys(checkedRows).length > 0) {
      setCheckedRows({});
    }
    let inboxAbort = new AbortController();
    if (roleName && deptName) {
      console.log({
        roleName, deptName
      })
      loadInboxTable(inboxAbort.signal);
    }

    return () => {
      inboxAbort.abort();
    };
  }, [
    blnValueInbox,
    currentPage,
    pageSize,
    selectedMenuItem,
    Filter,
    SortBy,
    trigger,
    roleName,
    deptName,
    isPending,
  ]);

  const loadInboxTable = (abortSignal) => {
    props.handleLoading(true);
    setRowData([]);
    const mrRole = sessionStorage.getItem("mrRole");
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      if (property.includes("range")) {
        let dates = Object.values(value);
        let rangeObj = {
          fromDate: dates[0],
          toDate: dates[1],
        };
        filter = { ...filter, ...rangeObj };
      } else {
        let key = property.split("|")[0];
        filter[`${key}`] = value;
      }
    });
    let sort = null;
    if (SortBy?.title) {
      sort = {
        sortByField: SortBy.title.name,
        asc: SortBy?.type == "Asc" ? true : false,
      };
    }
    if (roleName == mrRole) {
      setisMr(true);
      props
        .getMrInboxData(
          roleName,
          userName,
          deptName,
          pageSize,
          currentPage - 1,
          abortSignal
        )
        .then((resp) => {
          const tmpArr = [];
          try {
            if (resp.error) {
              if (resp?.error?.includes("aborted")) {
                return;
              }
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
              props.handleLoading(false);
            } else {
              if (resp.content !== undefined) {
                props.handleLoading(false);
                for (var i = 0; i < resp.content?.length; i++) {
                  tmpArr.push({
                    ...resp.content[i],
                    isChecked: false,
                    serialNo: pageSize * currentPage - 1 + (i + 1),
                  });
                }
                // props.changingTableStateInbox(false, "CHANGE_INBOX");
                blnShowPdf(true);
                setTotalCount(resp.content?.length);
                if (tmpArr.length > 0) {
                  annotationId(tmpArr[0].annotationId);
                  personalId(tmpArr[0].personalApplicationInventoryId);
                  setInboxId(tmpArr[0].id);
                  let data = { extension: "docx", url: tmpArr[0].personalUrl };
                  dispatch(setPassData(data));
                }
              }
              props.handleLoading(false);
            }
            setRowData(tmpArr);
          } catch (e) {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            props.handleLoading(false);
          }
        });
    } else {
      const userName = localStorage.getItem("username")
      const roleName = sessionStorage.getItem("role")
      const deptName = sessionStorage.getItem("department")
      console.log({
        userName,
        roleName,
        deptName
      })
      setisMr(false);
      props
        .loadInboxData(
          roleName,
          userName,
          deptName,
          pageSize,
          currentPage - 1,
          selectedMenuItem,
          _.isEmpty(filter) ? {} : filter,
          _.isEmpty(sort) ? {} : sort,
          abortSignal,
          isPending
        )
        .then((resp) => {
          const tmpArr = [];
          try {
            if (resp.error) {
              if (resp?.error?.includes("aborted")) {
                return;
              }
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
              props.handleLoading(false);
            } else {
              if (resp.response.Data !== undefined) {
                props.handleLoading(false);
                const { length, noOfDaks, noOfFiles } = resp?.response;
                setItemsInfo({
                  noOfDaks,
                  noOfFiles,
                  all: noOfDaks + noOfFiles,
                });
                for (var i = 0; i < resp.response.Data.length; i++) {
                  tmpArr.push({
                    ...resp.response.Data[i],
                    isChecked: false,
                    serialNo: pageSize * currentPage - 1 + (i + 1),
                  });
                }
                // props.changingTableStateInbox(false, "CHANGE_INBOX");
                blnShowPdf(true);
                setTotalCount(resp.response.length);
                if (tmpArr.length > 0) {
                  let extension = "docx";
                  let arr = tmpArr[0]?.fileName?.split(".");
                  if (arr?.length > 1) {
                    extension = arr[arr.length - 1];
                  }
                  console.log(extension);
                  annotationId(tmpArr[0].annotationId);
                  personalId(tmpArr[0].personalApplicationInventoryId);
                  setInboxId(tmpArr[0].id);
                  let data = { extension, url: tmpArr[0].personalUrl };
                  dispatch(setPassData(data));
                } else {
                  let extension = "docx";
                  let data = { extension, url: rowData.personalUrl || "def" };
                  dispatch(setPassData(data));
                  annotationId("");
                  personalId("");
                  setInboxId("");
                }
              }
              props.handleLoading(false);
            }
            setRowData(tmpArr);
          } catch (e) {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            props.handleLoading(false);
          }
        });
    }
  };

  const callMessageOut = (message) => {
    props.handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    sessionStorage.removeItem("route");
    clearCookie();
  }, []);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-inbox1");
    adjustableDiv.style.height = viewportHeight - 220 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const loadSFDT = (url, id, status, isSigned, corrId) => {
    props.handleLoading(true);
    let URL;
    let fileId = corrId ? corrId : id;
    let OpenPaDialog;
    props
      .loadSfdt(url, userName, id, roleName, deptName) // API call to load sfdt which will be visible on sincfusion
      .then((response) => {
        try {
          if (response.error) {
            callMessageOut(response.error);

            props.handleLoading(false);
            return;
          } else {
            URL = response.url;
            if (URL) {
              if (status === "Draft" || status === "Return") {
                OpenPaDialog = false; // show with editor
              } else {
                OpenPaDialog = true; // to show without editor
              }
            }
          }
          unstable_batchedUpdates(() => {
            setblnOpenQuickSign(isSigned);
            setRowID(fileId);
            setFileURL(URL);
            setblnOpenEditor(true);
            setTabIndex(0);
            setOpenQuickSign(true);
            setOpenPaDialog(OpenPaDialog);

            props.handleLoading(false);
          });
        } catch (e) {
          props.handleLoading(false);
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.handleLoading(false);
      });
  };

  const handleClickQuickSignClose = () => {
    setOpenQuickSign(false);
    setblnOpenEditor(true);
  };

  const handleDocumentRollback = () => {
    setloading(true);
    let body;

    body = {
      corrDocId: rowID,
      annexure: false,
      reference: false,
      application: true,
      flagNumber: 0,
    };
    props.rollbackCorrDocument(body).then((resp) => {
      try {
        if (resp.error) {
          callMessageOut(resp.error);
          setloading(false);
          return;
        } else {
          const { response } = resp;
          unstable_batchedUpdates(() => {
            setblnOpenQuickSign(response.isSigned);
            setFileURL(response.fileUrl);
            // setreSave(true);
            setloading(false);
          });
          sessionStorage.setItem("FileURL", response.fileUrl);
        }
        // pADraftTableData();
      } catch (e) {
        callMessageOut(e.message);
        setloading(false);
      }
    });
  };

  useEffect(() => {
    if (props.openDraftPa) {
      let row = props.openDraftPa;
      handleCorrClick(row);
      dispatch({
        type: OPEN_PA_DRAFT,
        payload: null,
      });
    }
  }, [props.openDraftPa]);

  const handleCorrClick = (rowData) => {
    props.handleLoading(true);
    props
      .getCorespondence(rowData.correspondenceDocId)
      .then((res) => {
        try {
          if (res.error) {
            if (res?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            props.handleLoading(false);
          } else {
            const { application, id: corrId, nofFileName } = res.response;
            sessionStorage.setItem("FileURL", application.fileUrl);
            loadSFDT(
              application.fileUrl,
              rowData.id,
              rowData.status,
              application.isSigned,
              corrId
            );
            unstable_batchedUpdates(() => {
              setHandleClickId(rowData.id);
              setHeaderLable({
                subject: rowData.subject,
                pfileName: rowData.correspondenceNumber,
                indexName: nofFileName,
              });
            });
          }
        } catch (e) {
          let errMsg = handleError(res.error);
          callMessageOut(errMsg);
          props.handleLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut(err.message);
        props.handleLoading(false);
      });
  };

  const processClick = (e, item) => {
    if (lastClick && e.timeStamp - lastClick < 250 && waitingClick) {
      setLastClick(0);
      clearTimeout(waitingClick);
      setWaitingClick(null);
      handleOnRowDoubleClick(item);
    } else {
      setLastClick(e.timeStamp);
      setWaitingClick(
        setTimeout(() => {
          setWaitingClick(null);
          handleOnRowClick(item);
        }, 251)
      );
    }
  };

  const handleOnRowClick = (rowData) => {
    let extension = "docx";
    annotationId(rowData.annotationId);
    setInboxId(rowData.id);
    personalId(rowData.personalApplicationInventoryId);
    let arr = rowData.fileName?.split(".");
    if (arr?.length > 1) {
      extension = arr[arr.length - 1];
    }
    console.log(extension);
    let data = { extension, url: rowData.personalUrl || "def" };
    dispatch(setPassData(data));
  };

  console.log({
    isMr,
    openMr
  })
  const handleOnRowDoubleClick = (rowItem) => {
    sessionStorage.removeItem("InboxIDS");
    props.setInboxDatas(rowItem);
    if (isMr) {
      console.log('came')
      setOpenMr(true);
      setmailRoomData(rowItem);
    } else if (
      rowItem?.personalApplicationInventoryId !== undefined &&
      rowItem?.personalApplicationInventoryId !== ""
    ) {
      sessionStorage.setItem("InboxID", rowItem?.id);
      sessionStorage.setItem("pa_id", rowItem?.personalApplicationInventoryId);
      sessionStorage.setItem("barcode", rowItem.imageDataString);
      Cookies.set("date", rowItem.createdOn);
      sessionStorage.setItem("partcaseID", rowItem?.partCase);
      Cookies.set("cabinetpartcase", rowItem?.partCase);
      Cookies.set("inboxFile", rowItem?.subject);
      Cookies.set("priority", rowItem?.priority);
      Cookies.set("referenceNumber", rowItem?.referenceNumber);
      Cookies.set("type", rowItem?.type);
      Cookies.set("partCase", false);
      Cookies.set("status", rowItem?.statuss);
      Cookies.set("nfa", rowItem?.nfaApp);
      Cookies.set("monitor", rowItem?.monitored);
      let readOnly = false
      if (rowItem?.receivedIn == "info-internal" || rowItem?.receivedIn == "info") {
        readOnly = true
      }
      Cookies.set("readOnly", readOnly)
      if (rowItem?.route.length) {
        sessionStorage.setItem("route", JSON.stringify(rowItem?.route));
      }
      else {

        let deptArr = department.split("-");
        const prevDept = rowItem?.displayFrom?.split(".") > 2
        if (rowItem?.displayFrom?.split(".")?.length > 2) {
          sessionStorage.setItem("route", JSON.stringify([deptArr?.length > 1 ? deptArr[deptArr.length - 1] : deptArr[0]]));
        }
        else {
          sessionStorage.setItem("route", JSON.stringify([rowItem?.displayFrom, deptArr?.length > 1 ? deptArr[deptArr.length - 1] : deptArr[0]]));

        }
      }
      Cookies.set("backPath", "/eoffice/inbox/file");
      // Cookies.set("section", rowItem.section);
      Cookies.set("classification", rowItem.classification || "Unclassified");
      Cookies.set("share", true);

      if (rowItem.type === "RTI") {
        Cookies.set("isRti", true);
        Cookies.set("partcaseId", rowItem?.partCase);
      }

      rowItem.deciderType > 4
        ? history.push({
          pathname: "/eoffice/splitView/correspondence",
          state: {
            from: "inbox",
            id: rowItem.id,
            rowData,
            fileNo: rowItem.serialNo,
            routeQueryParams: location.search,
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
              routeQueryParams: location.search,
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
                routeQueryParams: location.search,
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
                  routeQueryParams: location.search,
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
                    routeQueryParams: location.search,
                  },
                })
                : history.push({
                  pathname: "/eoffice/hrmConcernedView/file",
                  state: {
                    from: "inbox",
                    id: rowItem.id,
                    rowData,
                    fileNo: rowItem.serialNo,
                    routeQueryParams: location.search,
                  },
                });
    } else {
      const errorMessage = `${t("ID_is_undefined_please_refresh_page")} !`;
      callMessageOut(errorMessage);
    }
  };

  // const handleOnRowDoubleClick = (rowData) => {
  //   sessionStorage.removeItem("InboxIDS");
  //   props.setInboxDatas(rowData);
  //   if (isMr) {
  //     setOpenMr(true);
  //     setmailRoomData(rowData);
  //   } else if (
  //     rowData.personalApplicationInventoryId !== undefined &&
  //     rowData.personalApplicationInventoryId !== ""
  //   ) {
  //     sessionStorage.setItem("InboxID", rowData.id);
  //     sessionStorage.setItem("pa_id", rowData.personalApplicationInventoryId);
  //     sessionStorage.setItem("partcaseID", rowData?.partCase);
  //     Cookies.set("cabinetpartcase", rowData?.partCase);
  //     Cookies.set("inboxFile", rowData.subject);
  //     Cookies.set("priority", rowData.priority);
  //     Cookies.set("referenceNumber", rowData.referenceNumber);
  //     Cookies.set("type", rowData.type);
  //     Cookies.set("partCase", false);
  //     Cookies.set("status", rowData.statuss);
  //     Cookies.set("backPath", "/eoffice/inbox/file");

  //     if (rowData.type === "RTI") {
  //       Cookies.set("isRti", true);
  //       Cookies.set("partcaseId", rowData.partCase);
  //     }

  //     rowData.deciderType > 4
  //       ? history.push({
  //           pathname: "/eoffice/splitView/correspondence",
  //           state: rowData.id,
  //         })
  //       : rowData.type === "PA"
  //       ? history.push({
  //           pathname: "/eoffice/hrmConcernedView/file",
  //           state: rowData.id,
  //         })
  //       : rowData.type === "File"
  //       ? history.push({
  //           pathname: "/eoffice/splitView/file",
  //           state: rowData.subject,
  //         })
  //       : rowData.type === "RTI"
  //       ? history.push({
  //           pathname: "/eoffice/splitView/file",
  //           state: rowData.partcase,
  //         })
  //       : rowData.pcCoverNote === true
  //       ? history.push({
  //           pathname: "/eoffice/splitView/file",
  //           state: rowData.id,
  //         })
  //       : history.push({
  //           pathname: "/eoffice/hrmConcernedView/file",
  //           state: rowData.id,
  //         });
  //   } else {
  //     const errorMessage = `${t("ID_is_undefined_please_refresh_page")} !`;
  //     callMessageOut(errorMessage);
  //   }
  // };

  function handleReadUnread(inboxIds, value, selectCheckBox) {
    let tempArr = [];
    props.handleLoading(true);
    props
      .getReadStatus(inboxIds, value)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }
          if (selectCheckBox) {
            tempArr = rowData;
            for (let id of inboxIds) {
              tempArr = tempArr.map((item) =>
                item.id === id ? { ...item, read: value } : item
              );
            }
          } else {
            tempArr = rowData.map((item) =>
              item.id === inboxIds[0] ? { ...item, read: value } : item
            );
          }
          setRowData(tempArr);
          props.handleLoading(false);
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  }

  const handleReadAll = (selectedRows) => {
    let tmpArr = [];
    selectedRows.map((item) => {
      tmpArr.push(item.id);
    });
    handleReadUnread(tmpArr, true, true);
  };

  const handleUnReadAll = (selectedRows) => {
    let tmpArr = [];
    selectedRows.map((item) => {
      tmpArr.push(item.id);
    });
    handleReadUnread(tmpArr, false, true);
  };

  const handlePin = (id) => {
    props.handleLoading(true);
    props
      .getPinInboxId(id)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(e.message);
          } else {
            let tmpArr = rowData
              .map((item) =>
                item.id === id ? { ...item, pin: !item.pin } : item
              )
              .sort((a, b) => (b.pin ? 1 : -1));

            setRowData(tmpArr);
          }
          setPinListener(!pinListener);
          props.handleLoading(false);
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const showSWpdf = () => {
    if (pdfLoads) {
      return true;
    } else {
      return false;
    }
  };

  const handleFlag = (id) => {
    props.handleLoading(true);
    props
      .getFlagStatus(id)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(e.message);
          } else {
            let tmpArr = rowData.map((item) =>
              item.id === id ? { ...item, flag: !item.flag } : item
            );
            setRowData(tmpArr);
            props.handleLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const handleDialogClose = () => {
    setOpen(false);
  };

  const handleClickOpenDialog = () => {
    let c1 = 0;
    let c2 = 0;
    for (let i = 0; i < selectedRows.length; i++) {
      const item = selectedRows[i];
      if (item?.deciderType > 4) {
        c1 += 1;
      } else {
        c2 += 1;
      }
    }

    if (c1 == selectedRows.length) {
      // setSend(true);
      setCommonSend(true);
      // sessionStorage.setItem("InboxIDS", JSON.stringify(selectedRows));
    } else if (c2 == selectedRows.length) {
      // setOpen(true);
      setCommonSend(true);
      // sessionStorage.setItem("InboxIDS", JSON.stringify(selectedRows));
    } else {
      setCommonSend(true);
    }
  };

  const moveToPending = (selectedRows) => {
    props.handleLoading(true);
    let ids = selectedRows?.map((item) => item.id);
    props
      .moveToPending(ids)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            return;
          }

          let newData = rowData.filter((item) => resp?.response.id !== item.id);
          setRowData(newData);
          dispatch(
            setSnackbar(
              true,
              "success",
              isPending ? t("pending_inb") : t("pending_succ")
            )
          );
          props.handleLoading(false);
          setCheckedRows({})
          loadInboxTable();
        } catch (error) {
          callMessageOut(error.message);
          props.handleLoading(true);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.handleLoading(false);
      });
  };

  // const handleMenuClose = (event) => {
  //   event.stopPropagation();
  //   if (event.target.innerText != "") {
  //     setSelectedMenuItem(event.target.innerText);
  //     setCurrentPage(0);
  //   }
  //   SetAnchorEl(null);
  // };

  const handleNofDialog = (selectedRows) => {
    setNofDialog(true);
  };

  const handleNofDialogClose = () => {
    setNofDialog(false);
  };

  const handleIconsVisibility = (item) => {
    return item.type === "PA" || item.receivedIn?.includes('info')
  };

  const columns = useMemo(() => {
    if (isMr) {
      return [
        {
          accessorKey: "refId",
          header: t("inbox_referenceNumber"),
          size: 140,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item.refId}>
                <span
                  className="text-m mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder", color: props.theme ? "#429cff" : "#1a0dab", textDecoration: "underline" }}
                >
                  {cell.getValue()?.toUpperCase()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "dateSent",
          header: t("received_on"),
          size: 140,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            const sts =
              !item.read && item.priority == "high"
                ? "#d73c3c"
                : !item.read && item.priority == "medium"
                  ? "#4b4bbf"
                  : !item.read
                    ? "rgb(75, 191, 148)"
                    : "initial";

            const priorityColor = sts && sts;
            return (
              <Tooltip title={item.dateSent}>
                <span
                  className="text-m text-b mrt-text"
                  style={{
                    color: item.read ? "inherit" : priorityColor,
                    fontWeight: item.read ? "initial" : "800",
                  }}
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "subject",
          header: t("subject"),
          size: 100,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.subject}>
                <span
                  className="text-m text-b mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder", color: props.theme ? "#429cff" : "#1a0dab", textDecoration: "underline" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOnRowDoubleClick(item)
                  }}
                >
                  {cell.getValue()?.toUpperCase()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "type",
          header: t("type"),
          size: 70,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.type}>
                <span
                  className="text-m text-b mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()?.toUpperCase()}
                </span>
              </Tooltip>
            );
          },
        },
      ];
    } else {
      return [
        {
          accessorKey: "type",
          header: t("type"),
          size: 100,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item.type}>
                <span
                  className="text-m text-b mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder", color: item.type == "File" ? "#ff6961" : "#0696ed" }}
                >
                  {cell.getValue()?.toUpperCase()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "subject",
          header: t("subject"),
          size: 250,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.subject}>
                <span
                  className="text-m text-b mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder", color: props.theme ? "#429cff" : "#1a0dab", textDecoration: "underline" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleOnRowDoubleClick(item)
                  }}
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "receivedIn",
          header: t("action"),
          size:80,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.receivedIn?.split("-")[0]?.toUpperCase()}>
                <span
                  className="text-m mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {item?.receivedIn?.split("-")[0]?.toUpperCase()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "displayFrom",
          header: t("from"),
          size: 140,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            const sts = item.type == "File" ? "initial" :
              !item.read && item.priority == "high"
                ? "#d73c3ca1"
                : !item.read && item.priority == "medium"
                  ? "#4b4bbfa1"
                  : !item.read
                    ? "#4bbf94b3"
                    : "initial";

            const StripColor = sts && sts;
            return (
              <div>
                <Tooltip title={item?.displayFrom?.toUpperCase()}>
                  <span
                    className="text-m text-b mrt-text"
                    style={{
                      fontWeight: item.read ? "initial" : "bolder",
                    }}
                  >
                    {cell.getValue()?.toUpperCase()}
                  </span>
                </Tooltip>

                <div
                  className="strips"
                  style={{
                    background: StripColor,
                  }}
                ></div>
              </div>
            );
          },
        },

        {
          accessorKey: "originator",
          header: t("inbox_originator"),
          size: 140,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.originator?.deptDisplayName?.toUpperCase() || item?.meetingId || ""}>
                <span
                  className="text-m mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {item?.originator?.deptName?.replace("dir-","")?.toUpperCase() || item?.originator?.deptDisplayName?.toUpperCase() || item?.meetingId}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "createdOn",
          header: t("receivedIn"),
          size: 100,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.createdOn?.split("-")[0]?.toUpperCase()}>
                <span
                  className="text-m mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {item?.createdOn?.split("-")[0]?.toUpperCase()}
                </span>
              </Tooltip>
            );
          },
        },

        {
          accessorKey: "assign",
          header: t("assign"),
          size: 120,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <span
                className="text-m text-b mrt-text"
                style={{ fontWeight: item.read ? "initial" : "bolder" }}
              >
                {cell.getValue() ? "ASSIGNED" : "REVIEW"}
              </span>
            );
          },
        },

        {
          accessorKey: "referenceNumber",
          header: t("inbox_referenceNumber"),
          size: 120,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.referenceNumber}>
                <span
                  className="text-m mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            );
          },
        },
        // {
        //   accessorKey: "createdOn",
        //   header: t("received_on"),
        //   size: 140,
        //   Cell: ({ cell }) => {
        //     let item = cell?.row?.original;
        //     const sts =
        //       !item.read && item.priority == "high"
        //         ? "#d73c3c"
        //         : !item.read && item.priority == "medium"
        //         ? "#4b4bbf"
        //         : !item.read
        //         ? "rgb(75, 191, 148)"
        //         : "initial";

        //     const priorityColor = sts && sts;
        //     return (
        //       <Tooltip title={item.createdOn}>
        //         <span
        //           className="text-m text-b"
        //           style={{
        //             color: item.read ? "inherit" : priorityColor,
        //             fontWeight: item.read ? "initial" : "800",
        //           }}
        //         >
        //           {cell.getValue()}
        //         </span>
        //       </Tooltip>
        //     );
        //   },
        // },
        {
          accessorKey: "inwardsId",
          header: t("inward"),
          size: 120,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.inwardsId || ""}>
                <span
                  className="text-m mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            );
          },
        },


        {
          accessorKey: "classification",
          header: t("classification"),
          size: 150,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip
                title={item?.classification?.toUpperCase() || "UNCLASSIFIED"}
              >
                <span
                  className="text-m mrt-text"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()?.toUpperCase() || "UNCLASSIFIED"}
                </span>
              </Tooltip>
            );
          },
        },

        // {
        //   accessorKey: "originator",
        //   header: t("inbox_originator"),
        //   size: 140,
        //   Cell: ({ cell }) => {
        //     let item = cell?.row?.original;
        //     return (
        //       <Tooltip title={item.referenceNumber}>
        //         <span
        //           className="text-m"
        //           style={{ fontWeight: item.read ? "initial" : "bolder" }}
        //         >
        //           {item?.originator?.deptDisplayName}
        //         </span>
        //       </Tooltip>
        //     );
        //   },
        // },

        {
          accessorKey: "actions",
          header: t("actions_btn"),
          size: 130,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <div>
                <div
                  className={
                    item.pin || item.flag ? "InboxIconsPinned" : "InboxIcons"
                  }
                >
                  {/**
                   <Tooltip
                    title={t(
                      `${isPending ? t("move_inbox") : t("move_pending")}`
                    )}
                  >
                    <IconButton
                      className="InboxBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveToPending(item.id);
                      }}
                    >
                      <MoveToInboxIcon />
                    </IconButton>
                  </Tooltip>
                  */}

                  <Tooltip
                    title={t(
                      `${item.read ? "mark_as_unread" : "mark_as_read"}`
                    )}
                  >
                    <IconButton
                      className="InboxBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        item.read
                          ? handleReadUnread([item.id], false, false)
                          : handleReadUnread([item.id], true, false);
                      }}
                    >
                      {item.read ? <AiOutlineMail /> : <RiMailOpenLine />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={t(
                      `${item.flag ? "mark_as_unflag" : "mark_as_flag"}`
                    )}
                  >
                    <IconButton
                      id="inbox_item_flag_button"
                      className="InboxBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFlag(item.id);
                      }}
                    >
                      {item.flag ? <RiFlag2Fill /> : <RiFlag2Line />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    title={t(`${item.pin ? "mark_as_unpin" : "mark_as_pin"}`)}
                  >
                    <IconButton
                      id="inbox_item_pin_button"
                      className="InboxBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePin(item.id);
                      }}
                    >
                      {item.pin ? <AiFillPushpin /> : <AiOutlinePushpin />}
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            );
          },
        },
      ];
    }
  }, [rowData, props.theme, isMr, t]);

  const handleType = (val) => {
    if (val) {
      let newFilter = { ...Filter };
      newFilter["chip|Type"] = val;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(1);
        setPageSize(25);
        handleSearchParams("filter", newFilter);
      });
    } else {
      setFilter({});
      if (searchParams.has("page")) {
        searchParams.delete("page");
      }

      if (searchParams.has("pageSize")) {
        searchParams.delete("pageSize");
      }

      if (searchParams.has("filter")) {
        searchParams.delete("filter");
      }

      if (searchParams.has("sort")) {
        searchParams.delete("sort");
      }
      history.push({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  };

  return (
    <div className="inbox_table" id="inbox_table" style={{ height: "100%" }}>
      <Paper
        className="inbox_paper"
        style={{
          borderRadius: "8px",
          height: "100%",
        }}
      >
        <div id="material-table">
          <div
            className="InboxHeader"
            style={{
              padding: "0rem 1rem",
            }}
          >
            <div className="headChild1">
              <Grid container justifyContent="space-between">
                <Grid item xs={7}>
                  <GenericSearch
                    FilterTypes={FilterTypes}
                    FilterValueTypes={FilterValueTypes}
                    addFilter={addFilter}
                    cssCls={{}}
                    width={"100%"}
                  />
                </Grid>
                <Grid
                  item
                  xs="auto"
                  style={{
                    marginLeft: "auto",
                  }}
                >
                  <div>
                    {selectedRows?.length > 0 && (
                      <div>
                        <Tooltip
                          title={t(
                            `${isPending ? t("move_inbox") : t("move_pending")}`
                          )}
                        >
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation();
                              moveToPending(selectedRows);
                            }}
                          >
                            <MoveToInboxIcon className="inbox_header_icons" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("mark_as_read")} arrow>
                          <IconButton
                            id="inbox_Mark_as_Read_button"
                            onClick={() => handleReadAll(selectedRows)}
                          >
                            <DraftsIcon className="inbox_header_icons" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("mark_as_unread")} arrow>
                          <IconButton
                            id="inbox_Mark_as_Read_button"
                            onClick={() => handleUnReadAll(selectedRows)}
                          >
                            <Mail className="inbox_header_icons" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t("forward")} arrow>
                          <IconButton
                            id="inbox_reply_button"
                            onClick={handleClickOpenDialog}
                            style={{
                              display: selectedRows?.some(handleIconsVisibility)
                                ? "none"
                                : "initial",
                            }}
                          >
                            <ReplyIcon
                              className="inbox_header_icons"
                              style={{ transform: "rotateY(180deg)" }}
                            />
                          </IconButton>
                        </Tooltip>
                        {/* <Tooltip title={t("create_part_case_file")} arrow>
                          <IconButton
                            id="inbox_Nof_Save_Button"
                            className="checkbox_action_icons"
                            style={{
                              display: !selectedRows?.every(
                                handleIconsVisibility
                              )
                                ? "none"
                                : "",
                            }}
                            onClick={() => handleNofDialog(selectedRows)}
                          >
                            <SaveIcon className="inbox_header_icons" />
                          </IconButton>
                        </Tooltip> */}
                      </div>
                    )}
                  </div>
                </Grid>

                <Grid
                  item
                  xs="auto"
                  style={{
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  {/**
                   {isPending ? (
                    <Tooltip title={t("inbox")}>
                      <IconButton onClick={() => handlePending(false)}>
                        <MdInbox />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("pending")}>
                      <IconButton onClick={() => handlePending(true)}>
                        <MdOutlinePendingActions />
                      </IconButton>
                    </Tooltip>
                  )}
                  */}

                  <GenericRefresh handleRefresh={() => setTrigger(!trigger)} />

                  <GenericFilterMenu
                    SortValueTypes={SortValueTypes}
                    addSort={addSort}
                    NestedSort={NestedSort}
                    sort={SortBy}
                  />
                  <GenericColHider
                    tableCols={columnVisibility}
                    setTableCols={setColumnVisibility}
                    moduleName={INBOX_COLUMNS_STATUS}
                  />
                  <>
                    {/**
                     {isViewerClosed ? (
                      <Tooltip title="SHOW VIEWER">
                        <IconButton
                          onClick={() =>
                            setIsViewerClosed((prevValue) => !prevValue)
                          }
                        >
                          <VerticalSplitOutlined />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="HIDE VIEWER">
                        <IconButton
                          onClick={() =>
                            setIsViewerClosed((prevValue) => !prevValue)
                          }
                        >
                          <Reorder />
                        </IconButton>
                      </Tooltip>
                    )}
                    */}
                  </>

                  <>
                    <div>
                      {
                        !isMr && <Fab
                          className="CabinetIconCon"
                          aria-controls="simple-menu"
                          aria-haspopup="true"
                          style={{
                            width: "2.2rem",
                            height: ".1rem",
                            backgroundColor: "rgb(230, 81, 71)",
                          }}
                          onClick={handleClick}
                        >
                          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                        </Fab>
                      }
                    </div>
                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                      getContentAnchorEl={null}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "center",
                      }}
                    >
                      <MenuItem onClick={() => handleFile(true)}>
                        {t("crt_file")}
                      </MenuItem>
                      <MenuItem onClick={() => handleCorr(true)}>
                        {t("crt_dak")}
                      </MenuItem>
                    </Menu>
                  </>
                </Grid>
              </Grid>
              <Box className={classes.chipBox}>
                <div className="flex flex-center">
                  {/**
                   <Button className="chip-info inbox-switch">
                    {isPending ? t("pending") : t("inbox")}
                  </Button>
                  */}
                  <Button
                    className={`chip-info ${!selectedType && 'active'}`}
                    onClick={() => {
                      setSelectedType("")
                      handleType(null)
                    }}
                  >
                    {t("all")} <span>{itemsInfo?.all ? itemsInfo?.all : 0}</span>
                  </Button>
                  <Button
                    className={`chip-info dak ${selectedType == "Dak" && 'active'}`}
                    onClick={() => {
                      setSelectedType("Dak")
                      handleType("Dak")
                    }}
                  >
                    {t("dak")}  <span>{itemsInfo?.noOfDaks ? itemsInfo?.noOfDaks : 0}</span>
                  </Button>
                  <Button
                    className={`chip-info file ${selectedType == "File" && 'active'}`}
                    onClick={() => {
                      setSelectedType("File")
                      handleType("File")
                    }}
                  >
                    {t("files")} <span>{itemsInfo?.noOfFiles ? itemsInfo?.noOfFiles : 0}</span>
                  </Button>
                  {/* <Button
                    className="chip-info no-cursor"
                    onClick={() => handleType("File")}
                  >
                    {t("action_point")} <span>{0}</span>
                  </Button> */}
                </div>
              </Box>
              <div>
                <GenericChip Filter={Filter} deleteChip={deleteChip} />
              </div>
            </div>
          </div>

          <MaterialReactTable
            tableInstanceRef={tableInstanceRef}
            data={rowData}
            manualPagination
            columns={columns}
            rowCount={totalCount}
            initialState={{
              density: "compact",
            }}
            enableStickyHeader
            state={{
              rowSelection: checkedRows,
              columnVisibility,
            }}
            onRowSelectionChange={setCheckedRows}
            displayColumnDefOptions={{
              "mrt-row-select": {
                size: 5,
                muiTableHeadCellProps: {
                  sx: {
                    paddingLeft: "25px",
                  },
                },
                muiTableBodyCellProps: {
                  sx: {
                    paddingLeft: "25px",
                  },
                },
              },
              "mrt-row-numbers": {
                enableResizing: true,
                muiTableHeadCellProps: {
                  sx: {
                    fontSize: "1.2rem",
                  },
                },
              },
            }}
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableColumnResizing
            enableRowSelection
            enableFilters={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            muiSelectCheckboxProps={{
              sx: { color: props.theme ? "#fff" : "#00000099" },
              color: props.theme ? "warning" : "primary",
            }}
            muiTableBodyRowProps={({ row, staticRowIndex }) => {

              return {
                onClick: (e) => {
                  handleOnRowClick(row?.original);
                },
                sx: {
                  cursor: "pointer",
                  position: "relative",
                  height: "10px",
                  backgroundColor:
                    row.original.id === inboxId ? "#ffd394 !important" : staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit",
                },
              };
            }}
            muiTableContainerProps={() => ({
              sx: {
                border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                height: "61vh",
                borderRadius: "4px",
              },
              id: "mrt-inbox1",
            })}
            muiTablePaperProps={() => ({
              sx: {
                padding: "0rem 1rem",
                border: "0",
                boxShadow: "none",
                background: props.theme ? "#424242" : "white",
              },
            })}
            muiTableHeadRowProps={{
              sx: {
                background: props.theme ? "#938f8f" : "white",
              },
            }}
          />
        </div>
        <PaginationComp2
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizes={[5, 10, 15]}
          totalCount={totalCount}
          searchParamsSetter={handleSearchParams}
        />
      </Paper>

      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperComponent={PaperComponent}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleDialogClose();
          }
        }}
      >
        <DialogTitle
          id="draggable-dialog-title"
          className="dialog_title"
          style={{ cursor: "move" }}
        >
          {t("send_to")}
          <IconButton
            id="inboxTable_close_button"
            onClick={handleDialogClose}
            aria-label="close"
            color="primary"
            className="cancel-drag"
          >
            <CancelIcon style={{ color: "#484747" }} />
          </IconButton>
        </DialogTitle>
        <HrmDialog
          reset={() => setCheckedRows({})}
          checkedData={selectedRows}
          handleClose={handleDialogClose}
          loadInboxTable={loadInboxTable}
        />
      </Dialog>
      <Dialog
        open={nofDialog}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleNofDialogClose();
          }
        }}
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("part_case_file_creation")}</span>
          <IconButton
            id="part_case_file_close_button"
            aria-label="close"
            onClick={handleNofDialogClose}
            color="primary"
            style={{ float: "right" }}
            className="cancel-drag"
          >
            <CancelIcon style={{ color: "#484747" }} />
          </IconButton>
        </DialogTitle>
        <NofFilesTable
          // onSelectFileData={nofHandleClick}
          // onSelectFileID={(id) => setNofFileID(id)}
          // handleCloseDialog={handleCloseDialog}
          selectedList={selectedRows}
          multiplePartCase={nofDialog}
          loadInboxTable={loadInboxTable}
          handleCloseDialog={handleNofDialogClose}
        />
      </Dialog>

      <Dialog
        open={openCorr}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleCorr(false);
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
          {t("create_a_correspondence")}
          <Tooltip title={t("close")}>
            <IconButton
              id="Personnel_btnClose"
              aria-label="close"
              onClick={() => handleCorr(false)}
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
          handleClose={() => handleCorr(false)}
          handleClickFile={() => setCorrFile(true)}
          updateSubject={""}
          draftSubject={""}
          draftId={""}
          nofFile={nof}
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
              <CancelIcon
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <PersonalFileForm
          correspondence={true}
          handleClose={() => setOpenCorr(false)}
          handleClickFile={() => setCorrFile(true)}
          updateSubject={""}
          fileSubject={""}
          fileId={""}
          selectNof={(file) => handleNof(file)}
        />
      </Dialog>

      <CreateFile
        open={openfile}
        handleClose={() => setOpenfile(false)}
        handleTrigger={handleTrigger}
      />

      <Dialog
        open={openQuickSign}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenQuickSign(false);
          }
        }}
        fullScreen
        aria-labelledby="quickSignDialog"
        TransitionComponent={Transition}
        className={classes.divZIndex}
        id="draggable-dialog-title"
      >
        <DialogContent
          dividers
          style={{
            overflow: "hidden",
            backgroundColor: props.theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
          }}
        >
          {loading && <Loading />}

          <Tabs
            // forceRenderTabPanel
            selectedIndex={tabIndex}
            onSelect={(index) => setTabIndex(index)}
          >
            <TabList
              style={{
                position: "relative",
                zIndex: 12,
              }}
            >
              <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                {t("correspondence").toUpperCase()}
              </Tab>

              {corrType != "Signal" && (
                <>
                  <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                    {t("annexure")}
                  </Tab>
                  <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                    {t("references")}
                  </Tab>
                </>
              )}

              <p
                className={`${classes.headerText} hideText`}
                style={{
                  width: "60%",
                }}
              >
                <b>{t("subject")} : &nbsp;</b>
                {headerLable.subject &&
                  headerLable.subject?.toUpperCase().slice(0, 25)}
                {/*
                <b>&nbsp;| {t("inbox_referenceNumber")}&nbsp;</b>
                {headerLable.pfileName?.toUpperCase()}
                */}
                <b>&nbsp;| {t("index_name")} : &nbsp;</b>
                {headerLable.indexName?.toUpperCase()}
              </p>
              <IconButton
                id="draftPA_close_PA"
                aria-label="close"
                onClick={() => {
                  handleClickQuickSignClose(true);
                }}
                style={{
                  color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                  float: "right",
                  marginTop: "17px",
                  marginRight: "16px",
                }}
                className="icons-button"
                size="small"
              >
                <CancelOutlined fontSize="small" />
              </IconButton>
            </TabList>
            <TabPanel>
              <>
                <Tooltip title={t("send")}>
                  <Fab
                    aria-label="close"
                    color="secondary"
                    size="medium"
                    className={`button-glow ${classes.send_btn}`}
                    onClick={(e) => setSend(true)}
                    style={{ padding: "1px" }}
                  >
                    <Send style={{ marginLeft: "3px" }} />
                  </Fab>
                </Tooltip>
                {blnOpenQuickSign && !isScanned && (
                  <>
                    <Tooltip title={t("undo")} className="dialog_sendButton">
                      <Fab
                        aria-label="close"
                        color="primary"
                        size="medium"
                        className={classes.sign_btn1}
                        onClick={handleDocumentRollback}
                        style={{ padding: "1px" }}
                      >
                        <RestorePage />
                      </Fab>
                    </Tooltip>
                  </>
                )}
                {
                  (!blnOpenQuickSign || isScanned)
                  && <Tooltip
                    title={
                      t("upload_scan_dak")
                    }
                  >
                    <span className={`${classes.upload_pdf_btn}`}>
                      <Fab
                        aria-label="close"
                        color="secondary"
                        size="medium"
                        className={`button-glow`}
                        onClick={(e) => {
                          inputRef.current.click()
                        }}

                      >
                        <UploadIcon />
                      </Fab>
                    </span>
                  </Tooltip>
                }
                <input
                  type="file"
                  accept="application/pdf"
                  ref={inputRef}
                  onChange={(e) => {
                    setDraftDakObj(e.target.files[0]);
                    setSubject(e.target.files[0].name);
                    setOpenUpload(true);

                  }}
                  style={{
                    display: "none",
                  }}
                />
                <Dialog
                  open={openUpload}
                  onClose={(event, reason) => {
                    if (reason === "escapeKeyDown") {
                      handleUploadClose();
                    }
                  }}
                  PaperComponent={PaperComponent}
                  aria-labelledby="draggable-dialog-title"
                  maxWidth="xs"
                  fullWidth
                >
                  <DialogTitle
                    style={{ cursor: "move" }}
                    id="draggable-dialog-title"
                    className="dialog_title"
                  >
                    {t("upload_scan_dak")}
                    <IconButton
                      id="upload_pdf_subject_close_button"
                      aria-label="close"
                      onClick={handleUploadClose}
                      color="primary"
                      className="cancel-drag"
                    >
                      <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
                    </IconButton>
                  </DialogTitle>
                  <DialogContent dividers>
                    <Grid>
                      <TextField
                        label={t("enter_a_subject")}
                        variant="outlined"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        fullWidth
                        size="small"
                        style={{ margin: "1rem 0" }}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    </Grid>
                  </DialogContent>

                  <DialogActions>
                    <Button
                      id="upload_pdf_skip_button"
                      variant="contained"
                      color="secondary"
                      endIcon={<Done />}
                      onClick={handleSubmit}
                    >
                      {t("upload")}
                    </Button>
                  </DialogActions>
                </Dialog>
                <div
                  style={{
                    display: showSWpdf() ? "initial" : "none",
                    height: "calc(100vh - 200px)",
                    overflow: "hidden",
                  }}
                  className="ss-privacy-hide"
                >
                  <SplitViewPdfViewer
                    fileUrl={blnOpenQuickSign ? fileURL : ""}
                    pdfLoads={(val) => {
                      setPdfLoads(val);
                    }}
                    editable={false}
                    toggleState={toggleState}
                  />
                </div>
              </>

              <>
                {!blnOpenQuickSign && (
                  <Tooltip title={reSave ? t("autosave") : t("sign")}>
                    <span className={`${classes.sign_btn1}`}>
                      <Fab
                        aria-label="close"
                        color="secondary"
                        size="medium"
                        className={`button-glow`}
                        onClick={(e) => {
                          setOpenSign(true);
                          props.currentSign(true);
                        }}
                        disabled={reSave}
                      >
                        <Create />
                      </Fab>
                    </span>
                  </Tooltip>
                )}
                <div
                  className="customDiv ss-privacy-hide"
                  style={{
                    display: !blnOpenQuickSign ? "initial" : "none",
                  }}
                >
                  <HeadersAndFootersView
                    fileId={!blnOpenQuickSign ? rowID : ""}
                    blnIsPartCase={false}
                    fileUrl1={!blnOpenQuickSign ? fileURL : ""}
                    isAnnexure={false}
                    blnShowQuickSign={true}
                    pane={true}
                    comment={false}
                    reSave={reSave}
                    setreSave={(val) => {
                      setreSave(val);
                    }}
                    containerId={"container1"}
                    timer={200}
                  />
                </div>
              </>
            </TabPanel>
            <TabPanel>
              {corrType != "Signal" && (
                <>
                  <Tooltip title={t("send")}>
                    <Fab
                      id="DraftPaTable_send_btton"
                      aria-label="close"
                      size="medium"
                      color="secondary"
                      className={`button-glow ${classes.send_btn}`}
                      onClick={(e) => setSend(true)}
                    >
                      <Send style={{ marginLeft: "3px" }} />
                    </Fab>
                  </Tooltip>

                  <Annexure
                    correspondence={true}
                    references={false}
                    fileId={rowID}
                    sendToogle={(e) => {
                      setTabIndex(3);
                    }}
                    containerId="container2"
                    showUploader={true}
                  />
                </>
              )}
            </TabPanel>
            {
              <>
                {corrType != "Signal" && (
                  <TabPanel>
                    <>
                      <Tooltip title={t("send")}>
                        <Fab
                          id="DraftPaTable_send_btton"
                          aria-label="close"
                          color="secondary"
                          size="medium"
                          className={`button-glow ${classes.send_btn}`}
                          onClick={(e) => setSend(true)}
                        >
                          <Send style={{ marginLeft: "3px" }} />
                        </Fab>
                      </Tooltip>

                      <Annexure
                        correspondence={true}
                        references={true}
                        fileId={rowID}
                        sendToogle={(e) => {
                          setTabIndex(3);
                        }}
                        showUploader={true}
                        containerId="container21"
                      />
                    </>
                  </TabPanel>
                )}
              </>
            }
          </Tabs>
        </DialogContent>
      </Dialog>

      <Dialog
        open={openSign}
        // onClose={(event, reason) => {
        //   if (reason === "escapeKeyDown") {
        //     setOpenSign(false);
        //   }
        // }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="md"
        id="pa-sign"
      >
        <Paper>
          <DialogTitle
            id="draggable-dialog-title"
            className="send_dialog"
            style={{ padding: "0px 24px !important", cursor: "move" }}
          >
            {t("sign")}
            <IconButton
              id="close_draftPA_table"
              aria-label="close"
              color="primary"
              onClick={() => setOpenSign(false)}
              style={{ float: "right", position: "relative", top: "0px" }}
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "inherit",
                }}
              />
            </IconButton>
          </DialogTitle>
          <InputForm
            correspondence={true}
            fileId={rowID}
            toggleViewer={(e, url) => {
              unstable_batchedUpdates(() => {
                setOpenSign(e);
                setblnOpenQuickSign(!e);
                setFileURL(url);
              });
            }}
            returnToEditor={(e) => {
              setblnOpenEditor(true);
            }}
            pfileName={headerLable.pfileName}
            updatePa={() => { }}
          />
        </Paper>
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
        maxWidth="md"
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
            checkedData={selectedRows}
            fileId={rowID}
            handleCloseEvent={(e) => {
              setOpen(false);
              setOpenQuickSign(false);
              setSend(false);
            }}
            setSend={setSend}
            pfileName={headerLable.pfileName}
            handleStatus={() => { }}
            reload={() => {
              loadInboxTable();
            }}
            signed={blnOpenQuickSign}
            reset={() => setCheckedRows({})}
          />
        </Paper>
      </Dialog>

      <Dialog
        open={openMr}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenMr(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="md"
        id="pa-sign"
      >
        <Paper>
          <DialogTitle
            id="draggable-dialog-title"
            className="send_dialog"
            style={{ cursor: "move" }}
          >
            {t("mail_room")}
            <Tooltip title={t("close")}>
              <IconButton
                id="close_draftPA_table"
                aria-label="close"
                color="primary"
                onClick={() => setOpenMr(false)}
                style={{ float: "right", position: "relative", top: "0px" }}
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

          <MailRoom
            data={mailRoomData}
            handleClose={() => {
              setOpenMr(false);
              setTrigger(!trigger);
            }}
          />
        </Paper>
      </Dialog>

      <Dialog
        open={commonSend}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setCommonSend(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="idle-dialog"
      >
        <DialogTitle
          id="draggable-dialog-title"
          className="send_dialog"
          style={{ cursor: "move" }}
        >
          <span>{t("forward")}</span>
          <Tooltip title="CLOSE">
            <IconButton
              aria-label="close"
              onClick={() => setCommonSend(false)}
              color="primary"
              className="cancel-drag"
              style={{ float: "right" }}
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <CommonHrm
          checkedData={selectedRows}
          fileId={rowID}
          handleCloseEvent={(e) => {
            setCommonSend(false);
            setOpenQuickSign(false);
            setSend(false);
          }}
          setSend={setSend}
          pfileName={headerLable.pfileName}
          handleStatus={() => { }}
          reload={() => {
            loadInboxTable();
          }}
          reset={() => setCheckedRows({})}
        />
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
    openDraftPa: state.openDraftPa,
  };
}
export default connect(mapStateToProps, {
  setInboxDatas,
  loadInboxData,
  loadSfdt,
  getReadStatus,
  changingTableStateInbox,
  getPinInboxId,
  getFlagStatus,
  rollbackCorrDocument,
  getCorespondence,
  currentSign,
  getMrInboxData,
  moveToPending,
  uploadScannedDak
})(InboxTable);
