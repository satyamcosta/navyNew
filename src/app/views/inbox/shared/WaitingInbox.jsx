import React, { useState, useEffect, useMemo } from "react";
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
} from "@material-ui/core";
import { connect, useDispatch } from "react-redux";
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
  // getWaitingInbox,
} from "../../../camunda_redux/redux/action";
import { getWaitingInbox } from "app/camunda_redux/redux/action/backend-rest/initiate-data";
import history from "../../../../history";
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
import CancelIcon from "@material-ui/icons/Close";
import ReplyIcon from "@material-ui/icons/Reply";
import AddIcon from "@material-ui/icons/Add";
import PaginationComp from "app/views/utilities/PaginationComp";
import HrmDialog from "./HrmDialog";
import { unstable_batchedUpdates } from "react-dom";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import Draggable from "react-draggable";
import NofFilesTable from "./NofFilesTable";
import { clearCookie, handleError } from "utils";
import {
  MRT_ShowHideColumnsButton,
  MaterialReactTable,
} from "material-react-table";
import {
  CancelOutlined,
  Close,
  Cancel,
  Create,
  History,
  Person,
  RestorePage,
  Send,
  SupervisorAccount,
} from "@material-ui/icons";
import CorrespondenceForm from "app/views/Correspondence/CorrespondenceForm";
import PersonalFileForm from "app/views/Personnel/PersonalFileForm";
import { Loading } from "../therme-source/material-ui/loading";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import {
  CHANGE_PA_FILE,
  OPEN_PA_DRAFT,
} from "app/camunda_redux/redux/constants/ActionTypes";
import SplitViewPdfViewer from "../shared/pdfViewer/pdfViewer";
import HeadersAndFootersView from "../../FileApproval/documentEditor/editor";
import CorrHrmDialog from "app/views/Correspondence/CorrHrmDialog";
import Annexure from "app/views/Personnel/Annexure";
import InputForm from "../../Personnel/quickSignFrom";
import MailRoom from "./MailRoom";
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
    bottom: "20px !important",
    zIndex: 10,
  },
  sign_btn1: {
    position: "fixed",
    right: "30px !important",
    bottom: "100px !important",
    zIndex: 10,
  },
  headerText: {
    display: "inline-flex",
    justifyContent: "center",
    marginBottom: "0px",
    fontSize: "1.1rem",
  },
  table: {
    minWidth: "900px",
  },
}));

const InboxTable = (props) => {
  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [inboxId, setInboxId] = useState("");
  const dispatch = useDispatch();
  const { blnValueInbox } = props.subscribeApi;
  const { personalId, annotationId, blnShowPdf } = props;
  const [open, setOpen] = useState(false);
  const [anchorEl, SetAnchorEl] = useState(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState("All");
  const [selectedList, setSelectedList] = useState([]); // use to keep track of checkbox selected rowData but will store only unique identity of each row for better performance and to avoid use of loop
  const [pinListener, setPinListener] = useState(false);
  const [nofDialog, setNofDialog] = useState(false);
  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");
  const department = sessionStorage.getItem("department");

  // console.log("sfsdfs", selectedList);
  // Filter State Variables
  const [Filter, setFilter] = useState({});

  const [waitingClick, setWaitingClick] = useState(null);
  const [lastClick, setLastClick] = useState(0);

  // Create draft / correspondence from inbox
  const [openCorr, setOpenCorr] = useState(false);
  const [nof, setNof] = useState("");
  const [corrFile, setCorrFile] = useState(false);
  const [handleClickId, setHandleClickId] = useState("");

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
  const [sfdtLoading, setSfdtLoading] = useState(false);
  const [corrType, setCorrType] = useState("");
  const [openSign, setOpenSign] = useState(false);

  const [isMr, setisMr] = useState(false);
  const [openMr, setOpenMr] = useState(false);
  const [mailRoomId, setmailRoomId] = useState("");
  const [trigger, setTrigger] = useState(false);

  const classes = useStyles();

  const handleNof = (file) => {
    setNof(file);
    setCorrFile(false);
  };

  const handleCorr = (val) => {
    setOpenCorr(val);
    setNof("");
  };

  const openMenu = Boolean(anchorEl);

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
      value: "referenceNumber",
      label: "File No",
    },
    {
      value: "from",
      label: "From",
    },
    {
      value: "type",
      label: "Type",
    },
    {
      value: "createdOn",
      label: "Received On",
    },
    {
      value: "priority",
      label: "Priority",
    },
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
      name: "referenceNumber",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "type",
      type: "select",
      optionValue: ["File", "Service Letter", "PA"],
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
      name: "priority",
      type: "select",
      optionValue: ["low", "medium", "high"],
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(0);
        setPageSize(10);
      });
    }
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  const addSort = (sortObj) => {
    setSortBy(sortObj);
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

  const handleMenuClose = (event) => {
    event.stopPropagation();
    if (event.target.innerText != "") {
      setSelectedMenuItem(event.target.innerText);
      setCurrentPage(0);
    }
    SetAnchorEl(null);
  };

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

  // Filter State Variables

  // state Variable which get track of sort option with orderBy
  const [SortBy, setSortBy] = useState({});

  // Here inbox only available when user have selected some role
  useEffect(() => {
    let inboxAbort = new AbortController();
    loadInboxTable(inboxAbort.signal);

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
  ]);

  const loadInboxTable = (abortSignal) => {
    props.handleLoading(true);
    setRowData([]);
    const mrRole = sessionStorage.getItem("mrRole");
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      filter[`${key}`] = value;
    });
    let sort = null;
    if (!_.isEmpty(SortBy)) {
      sort = {
        title: SortBy?.title?.name,
        type: SortBy?.type,
      };
    }
    if (role == mrRole) {
      setisMr(true);
      props
        .getWaitingInbox(
          role,
          userName,
          department,
          pageSize,
          currentPage,
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
      setisMr(false);
      props
        .loadInboxData(
          role,
          userName,
          department,
          pageSize,
          currentPage,
          selectedMenuItem,
          {
            filter: _.isEmpty(filter) ? null : filter,
            sort: _.isEmpty(sort) ? null : sort,
          },
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
              if (resp.response.Data !== undefined) {
                props.handleLoading(false);
                for (var i = 0; i < resp.response.Data.length; i++) {
                  tmpArr.push({ ...resp.response.Data[i], isChecked: false });
                }
                // props.changingTableStateInbox(false, "CHANGE_INBOX");
                blnShowPdf(true);
                setTotalCount(resp.response.length);
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
    var adjustableDiv = document.getElementById("mrt-inbox");
    adjustableDiv.style.height = viewportHeight - 170 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const loadSFDT = (url, id, status, signed, corrId) => {
    let URL;
    let fileId = corrId ? corrId : id;
    let OpenPaDialog;
    props
      .loadSfdt(url, userName, id, role, department) // API call to load sfdt which will be visible on sincfusion
      .then((response) => {
        try {
          if (response.error) {
            callMessageOut(response.error);

            setSfdtLoading(false);
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
            setblnOpenQuickSign(signed);
            setRowID(fileId);
            setFileURL(URL);
            setblnOpenEditor(true);
            setTabIndex(0);
            setOpenQuickSign(true);
            setOpenPaDialog(OpenPaDialog);

            setSfdtLoading(false);
          });
        } catch (e) {
          setSfdtLoading(false);
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setSfdtLoading(false);
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
            setblnOpenQuickSign(response.signed);
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
    props
      .getCorespondence(rowData.correspondenceDocId)
      .then((res) => {
        const { application, id: corrId } = res.response;
        sessionStorage.setItem("FileURL", application.fileUrl);
        loadSFDT(
          application.fileUrl,
          rowData.id,
          rowData.status,
          application.signed,
          corrId
        );
        unstable_batchedUpdates(() => {
          setHandleClickId(rowData.id);
          setHeaderLable({
            subject: rowData.subject,
            pfileName: rowData.correspondenceNumber,
          });
        });
      })
      .catch((err) => {
        console.log(err);
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
          // handleOnRowClick(item);
        }, 251)
      );
    }
  };

  const handleOnRowClick = (rowData) => {
    annotationId(rowData.annotationId);
    setInboxId(rowData.id);
    personalId(rowData.personalApplicationInventoryId);
    let data = { extension: "docx", url: rowData.personalUrl };
    dispatch(setPassData(data));
  };

  const handleOnRowDoubleClick = (rowData) => {
    Cookies.set("WaitingRoom", true);
    Cookies.set("cabinetpartcase", rowData.corrDocId);
    sessionStorage.removeItem("InboxIDS");
    props.setInboxDatas(rowData);
    if (isMr && rowData?.type !== "File") {
      setOpenMr(true);
      setmailRoomId(rowData.id);
    } else if (rowData?.type === "File") {
      sessionStorage.setItem("InboxID", rowData.id);
      sessionStorage.setItem("pa_id", rowData.personalApplicationInventoryId);
      sessionStorage.setItem("partcaseID", rowData?.partCase);
      Cookies.set("inboxFile", rowData.subject);
      Cookies.set("priority", rowData.priority);
      Cookies.set("referenceNumber", rowData.referenceNumber);
      Cookies.set("type", rowData.type);
      Cookies.set("partCase", false);
      Cookies.set("status", rowData.statuss);
      Cookies.set("backPath", "/eoffice/inbox/file");

      if (rowData.type === "RTI") {
        Cookies.set("isRti", true);
        Cookies.set("partcaseId", rowData.partCase);
      }

      rowData.deciderType > 4
        ? history.push({
          pathname: "/eoffice/splitView/correspondence",
          state: rowData.id,
        })
        : rowData.type === "PA"
          ? history.push({
            pathname: "/eoffice/hrmConcernedView/file",
            state: rowData.id,
          })
          : rowData.type === "File"
            ? history.push({
              pathname: "/eoffice/splitView/file",
              state: rowData.subject,
            })
            : rowData.type === "RTI"
              ? history.push({
                pathname: "/eoffice/splitView/file",
                state: rowData.partcase,
              })
              : rowData.pcCoverNote === true
                ? history.push({
                  pathname: "/eoffice/splitView/file",
                  state: rowData.id,
                })
                : history.push({
                  pathname: "/eoffice/hrmConcernedView/file",
                  state: rowData.id,
                });
    } else {
      const errorMessage = `${t("ID_is_undefined_please_refresh_page")} !`;
      callMessageOut(errorMessage);
    }
  };

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
                item.id === id ? { ...item, read: true } : item
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

  const handleClickOpenDialog = (selectedRows) => {
    setSelectedList(selectedRows);
    setOpen(true);
    sessionStorage.setItem("InboxIDS", JSON.stringify(selectedRows));
  };

  const handleFilterOpen = (event) => {
    SetAnchorEl(event.currentTarget);
  };

  const CheckBoxSelection = (event, unique) => {
    let tempArr = rowData.map((item) =>
      item.id === unique.id ? { ...item, isChecked: !item.isChecked } : item
    );
    if (event.target.checked) {
      setSelectedList([...selectedList, unique]);
    } else {
      let checkData = selectedList.filter((item) => item.id !== unique.id);
      setSelectedList(checkData);
    }
    setRowData(tempArr);
  };

  const CheckBoxSelectAll = (e) => {
    const newSelecteds = rowData.map((item) => ({
      ...item,
      isChecked: e.target.checked,
    }));
    setRowData(newSelecteds);
    if (e.target.checked) {
      setSelectedList(newSelecteds);
    } else {
      setSelectedList([]);
    }
  };

  const handleNofDialog = (selectedRows) => {
    setSelectedList(selectedRows);
    setNofDialog(true);
  };

  const handleNofDialogClose = () => {
    setNofDialog(false);
  };

  const handleIconsVisibility = (item) => item.type === "PA";

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
              <Tooltip title={item.referenceNumber}>
                <span
                  className="text-m"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
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
              <Tooltip title={item.subject}>
                <span
                  className="text-m text-b"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()}
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
              <Tooltip title={item.type}>
                <span
                  className="text-m text-b"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()}
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
              <Tooltip title={item.createdOn}>
                <span
                  className="text-m text-b"
                  style={{ color: item.read ? "initial" : priorityColor }}
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            );
          },
        },
        // {
        //   accessorKey: "actions",
        //   header: t("actions_btn"),
        //   size: 120,
        //   Cell: ({ cell }) => {
        //     let item = cell?.row?.original;
        //     return (
        //       <div>
        //         <div
        //           className={
        //             item.pin || item.flag ? "InboxIconsPinned" : "InboxIcons"
        //           }
        //         >
        //           <Tooltip
        //             title={t(
        //               `${item.read ? "mark_as_unread" : "mark_as_read"}`
        //             )}
        //           >
        //             <IconButton
        //               className="InboxBtn"
        //               onClick={(e) => {
        //                 e.stopPropagation();
        //                 item.read
        //                   ? handleReadUnread([item.id], false, false)
        //                   : handleReadUnread([item.id], true, false);
        //               }}
        //             >
        //               {item.read ? <AiOutlineMail /> : <RiMailOpenLine />}
        //             </IconButton>
        //           </Tooltip>
        //           <Tooltip
        //             title={t(
        //               `${item.flag ? "mark_as_unflag" : "mark_as_flag"}`
        //             )}
        //           >
        //             <IconButton
        //               id="inbox_item_flag_button"
        //               className="InboxBtn"
        //               onClick={(e) => {
        //                 e.stopPropagation();
        //                 handleFlag(item.id);
        //               }}
        //             >
        //               {item.flag ? <RiFlag2Fill /> : <RiFlag2Line />}
        //             </IconButton>
        //           </Tooltip>
        //           <Tooltip
        //             title={t(`${item.pin ? "mark_as_unpin" : "mark_as_pin"}`)}
        //           >
        //             <IconButton
        //               id="inbox_item_pin_button"
        //               className="InboxBtn"
        //               onClick={(e) => {
        //                 e.stopPropagation();
        //                 handlePin(item.id);
        //               }}
        //             >
        //               {item.pin ? <AiFillPushpin /> : <AiOutlinePushpin />}
        //             </IconButton>
        //           </Tooltip>
        //         </div>
        //       </div>
        //     );
        //   },
        // },
      ];
    } else {
      return [
        {
          accessorKey: "displayFrom",
          header: t("from"),
          size: 100,
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

            const StripColor = sts && sts;
            return (
              <div>
                <Tooltip title={item.displayFrom}>
                  <span
                    className="text-m text-b"
                    style={{
                      fontWeight: item.read ? "initial" : "bolder",
                    }}
                  >
                    {cell.getValue()}
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
          accessorKey: "referenceNumber",
          header: t("inbox_referenceNumber"),
          size: 140,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item.referenceNumber}>
                <span
                  className="text-m"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
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
              <Tooltip title={item.subject}>
                <span
                  className="text-m text-b"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()}
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
          accessorKey: "originator",
          header: t("inbox_originator"),
          size: 140,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item.referenceNumber}>
                <span
                  className="text-m"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {item?.originator?.deptDisplayName}
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
              <Tooltip title={item.type}>
                <span
                  className="text-m text-b"
                  style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "assign",
          header: t("assign"),
          size: 70,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <span
                className="text-m text-b"
                style={{ fontWeight: item.read ? "initial" : "bolder" }}
              >
                {cell.getValue() ? "ASSIGNED" : "REVIEW"}
              </span>
            );
          },
        },
        {
          accessorKey: "createdOn",
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
              <Tooltip title={item.createdOn}>
                <span
                  className="text-m text-b"
                  style={{ color: item.read ? "initial" : priorityColor }}
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "actions",
          header: t("actions_btn"),
          size: 120,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <div>
                <div
                  className={
                    item.pin || item.flag ? "InboxIconsPinned" : "InboxIcons"
                  }
                >
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
  }, [rowData, Cookies.get("i18next"), isMr, t]);

  const CustomToolbarMarkup = ({ table }) => {
    const selectedRows = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original);

    return (
      <div
        className="InboxHeader"
        style={{
          marginLeft: "-14px",
        }}
      >
        <div className="headChild1" style={{
          padding: "0rem 1rem",
        }}>
          <Grid container>
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
                <GenericRefresh handleRefresh={() => setTrigger(!trigger)} />
                {/* {selectedRows?.length > 0 && (
                  <div>
                    <Tooltip title={t("mark_as_read")} arrow>
                      <IconButton
                        id="inbox_Mark_as_Read_button"
                        onClick={() => handleReadAll(selectedRows)}
                      >
                        <DraftsIcon className="inbox_header_icons" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("forward")} arrow>
                      <IconButton
                        id="inbox_reply_button"
                        onClick={() => handleClickOpenDialog(selectedRows)}
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
                    <Tooltip title={t("create_part_case_file")} arrow>
                      <IconButton
                        id="inbox_Nof_Save_Button"
                        className="checkbox_action_icons"
                        style={{
                          display: !selectedRows?.every(handleIconsVisibility)
                            ? "none"
                            : "",
                        }}
                        onClick={() => handleNofDialog(selectedRows)}
                      >
                        <SaveIcon className="inbox_header_icons" />
                      </IconButton>
                    </Tooltip>
                  </div>
                )} */}
              </div>
            </Grid>

            {/* <Grid item xs="auto">
              <Tooltip title={t("create_correspondence")}>
                <span>
                  <Fab
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                    onClick={() => handleCorr(true)}
                  >
                    <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
                </span>
              </Tooltip>
              <GenericFilterMenu
                SortValueTypes={SortValueTypes}
                addSort={addSort}
                NestedSort={NestedSort}
                sort={SortBy}
              />
              <MRT_ShowHideColumnsButton
                style={{ color: props.theme ? "#fff" : "#676767" }}
                table={table}
              />
            </Grid> */}
          </Grid>
          <div style={{ marginLeft: "-17px" }}>
            <GenericChip Filter={Filter} deleteChip={deleteChip} />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="inbox_table" id="inbox_table" style={{
      height: "100%", display: "flex",
      flexDirection: "column"
    }}>
      <div className="mrt-head">
        <span>{t("waitinginbox")}</span>
      </div>
      <Paper
        className="inbox_paper"
        style={{
          borderRadius: "8px",
        }}
      >
        <div id="material-table">
          <MaterialReactTable
            data={rowData}
            manualPagination
            columns={columns}
            initialState={{
              density: "compact",
            }}
            enableStickyHeader
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
            enableBottomToolbar={false}
            enableColumnResizing
            // enableRowSelection
            enableFilters={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            renderTopToolbar={({ table }) => (
              <CustomToolbarMarkup table={table} />
            )}
            muiSelectCheckboxProps={{
              sx: { color: props.theme ? "#fff" : "#00000099" },
              color: props.theme ? "warning" : "primary",
            }}
            muiTableBodyRowProps={({ row }) => {
              return {
                onClick: (e) => {
                  processClick(e, row?.original);
                },

                sx: {
                  position: "relative",
                  backgroundColor:
                    row.original.id === inboxId ? "#a2eaea24" : "inherit",
                },
              };
            }}
            muiTableContainerProps={() => ({
              sx: {
                border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                height: "63vh",
                borderRadius: "4px",
              },
              id: "mrt-inbox",
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
        <PaginationComp
          pageSize={pageSize}
          pageSizes={[5, 10, 15]}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalCount={totalCount}
          setPageSize={setPageSize}
        />
      </Paper>

      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleDialogClose();
          }
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperComponent={PaperComponent}
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
          checkedData={selectedList}
          handleClose={handleDialogClose}
          loadInboxTable={loadInboxTable}
        />
      </Dialog>
      <Dialog
        open={nofDialog}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleNofDialogClose();
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          onClose={handleNofDialogClose}
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
          selectedList={selectedList}
          multiplePartCase={nofDialog}
          loadInboxTable={loadInboxTable}
          handleCloseDialog={handleNofDialogClose}
        />
      </Dialog>
      <Menu
        id="filter_menu"
        anchorEl={anchorEl}
        getContentAnchorEl={null}
        open={openMenu}
        MenuListProps={{
          "aria-labelledby": "filter_button",
        }}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={handleMenuClose} style={{ marginLeft: "0.3rem" }}>
          All
        </MenuItem>
        <MenuItem onClick={handleMenuClose} style={{ marginLeft: "0.3rem" }}>
          Unread
        </MenuItem>
        <MenuItem onClick={handleMenuClose} style={{ marginLeft: "0.3rem" }}>
          Flagged
        </MenuItem>
      </Menu>

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
          <Tooltip title={t("cancel")}>
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
          selectNof={() => { }}
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
          <Tooltip title={t("cancel")}>
            <IconButton
              id="create_a_personal_file_closeBtn"
              aria-label="close"
              onClick={() => setCorrFile(false)}
              color="primary"
              className="cancel-drag"
            >
              <CancelIcon
                style={{
                  color: props.theme ? "#fff" : "inherit",
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

      <Dialog
        open={openQuickSign}
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
                  width: "40%",
                }}
              >
                <b>{t("subject")} : &nbsp;</b>
                {headerLable.subject &&
                  headerLable.subject?.toUpperCase().slice(0, 25)}
                <b>&nbsp;| {t("inbox_referenceNumber")}&nbsp;</b>
                {headerLable.pfileName?.toUpperCase()}
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
                {blnOpenQuickSign && (
                  <>
                    <Tooltip title={t("send")}>
                      <Fab
                        aria-label="close"
                        color="secondary"
                        size="medium"
                        className={`button-glow ${classes.sign_btn}`}
                        onClick={(e) => setSend(true)}
                        style={{ padding: "1px" }}
                      >
                        <Send style={{ marginLeft: "3px" }} />
                      </Fab>
                    </Tooltip>
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
                  />
                </div>
              </>

              <>
                {!blnOpenQuickSign && (
                  <Tooltip title={reSave ? t("autosave") : t("sign")}>
                    <span className={`${classes.sign_btn}`}>
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
                  {blnOpenQuickSign && (
                    <Tooltip title={t("send")}>
                      <Fab
                        id="DraftPaTable_send_btton"
                        aria-label="close"
                        size="small"
                        color="secondary"
                        className={`button-glow ${classes.sign_btn}`}
                        onClick={(e) => setSend(true)}
                      >
                        <Send style={{ marginLeft: "3px" }} />
                      </Fab>
                    </Tooltip>
                  )}
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
                      {blnOpenQuickSign && (
                        <Tooltip title={t("send")}>
                          <Fab
                            id="DraftPaTable_send_btton"
                            aria-label="close"
                            color="secondary"
                            size="small"
                            className={`button-glow ${classes.sign_btn}`}
                            onClick={(e) => setSend(true)}
                          >
                            <Send style={{ marginLeft: "3px" }} />
                          </Fab>
                        </Tooltip>
                      )}
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
            {t("forward_file_for_review_approval")}
            <div>
              <Tooltip title={t("cancel")}>
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

              <IconButton
                id="draftPA_historyBtn"
                aria-label="userHistory"
                color="primary"
                style={{ float: "right" }}
                onClick={(e) => {
                  handleOnClickOpenHistory(handleClickId, true);
                }}
              >
                <Tooltip
                  title={t("show_user_history")}
                  aria-label="Show User History"
                >
                  <History
                    style={{
                      color: props.theme ? "#fff" : "inherit",
                    }}
                  />
                </Tooltip>
              </IconButton>
            </div>
          </DialogTitle>

          <CorrHrmDialog
            fileId={rowID}
            handleCloseEvent={(e) => {
              setOpen(false);
              setOpenQuickSign(false);
              setSend(false);
            }}
            setSend={setSend}
            pfileName={headerLable.pfileName}
            handleStatus={() => { }}
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
          <DialogTitle id="draggable-dialog-title" style={{ cursor: "move" }}>
            {t("mail_room")}
            <IconButton
              id="close_draftPA_table"
              aria-label="close"
              color="primary"
              onClick={() => setOpenMr(false)}
              style={{ float: "right", position: "relative", top: "-9px" }}
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "inherit",
                }}
              />
            </IconButton>
          </DialogTitle>

          <MailRoom
            id={mailRoomId}
            handleClose={() => {
              setOpenMr(false);
              setTrigger(!trigger);
            }}
          />
        </Paper>
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
  getWaitingInbox,
})(InboxTable);
