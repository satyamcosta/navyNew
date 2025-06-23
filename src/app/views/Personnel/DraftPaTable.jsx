import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  Paper,
  Slide,
  TextField,
  Grid,
} from "@material-ui/core";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import {
  loadPADraftTableData,
  loadSfdt,
  deleteMrDak,
  editMrDak,
  rollbackPADocument,
  getHistory,
  currentSign,
  getAllCorespondence,
  getCorespondence,
  rollbackCorrDocument,
  deleteCorrespondence,
  uploadScannedDak
} from "../../camunda_redux/redux/action";
import { connect as reduxConnect, useDispatch, useSelector } from "react-redux";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import "./therme-source/material-ui/loading.css";
import Annexure from "./Annexure";
import InputForm from "./quickSignFrom";
import { makeStyles } from "@material-ui/core/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import HeadersAndFootersView from "../FileApproval/documentEditor/editor";
import { changeTableStateDraft } from "../../camunda_redux/redux/action/apiTriggers";
import Tooltip from "@material-ui/core/Tooltip";
import SendFileForm from "./SendFileForm";
import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
import CreateIcon from "@material-ui/icons/Create";
import { AiOutlineHistory } from "react-icons/ai";
import { FiEdit2, FiDelete } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import SendIcon from "@material-ui/icons/Send";
import RestorePageIcon from "@material-ui/icons/RestorePage";
import HistoryIcon from "@material-ui/icons/History";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import {
  CHANGE_PA_FILE,
  DRAFT_COLUMNS_STATUS,
  MRDRAFT_COLUMNS_STATUS,
  OPEN_PA_DRAFT,
} from "app/camunda_redux/redux/constants/ActionTypes";
import AddIcon from "@material-ui/icons/Add";
import PaginationComp from "../utilities/PaginationComp";
import { unstable_batchedUpdates } from "react-dom";
import { Loading } from "./therme-source/material-ui/loading";
import _ from "lodash";
import GenericFilterMenu from "../utilities/GenericFilterMenu";
import GenericSearch from "../utilities/GenericSearch";
import GenericChip from "../utilities/GenericChips";
import HistoryDialog from "./HistoryDialog";
import { MaterialReactTable } from "material-react-table";
// import CorrHrmDialog from "../Correspondence/CorrHrmDialog";
import {
  CancelOutlined,
  Cancel,
  Delete,
  Create,
  ChevronLeft,
  ChevronRight,
  Edit,
  Done,

} from "@material-ui/icons";
import UploadIcon from '@mui/icons-material/Upload';
import { handleError } from "utils";
import Cookies from "js-cookie";
import CorrHrmDialog from "../Correspondence/CorrHrmDialog";
import GenericColHider from "../utilities/GenericColHider";
import GenericRefresh from "../utilities/GenericRefresh";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

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
      height: "calc(100vh - 40px) !important",
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
  upload_pdf_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "90px !important",
    zIndex: 10,
  },
  send_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "30px !important",
    zIndex: 10,
  },
  headerText: {
    display: "inline-flex",
    justifyContent: "center",
    marginBottom: "0px",
    fontSize: "1rem",
  },
  table: {
    minWidth: "900px",
  },
  prevBtn: {
    position: "absolute",
    top: 1,
    right: "180px",
    zIndex: 999,
  },
  nextBtn: {
    position: "absolute",
    top: 1,
    right: "140px",
    zIndex: 999,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DraftPaFileTable = (props) => {
  const { roleName } = useSelector((state) => state?.user?.currentUserRole);

  // Now this same component will be used for both pa and correspondence
  const { correspondence } = props;

  const tableInstanceRef = useRef(null);
  const inputRef = useRef(null);

  const { t } = useTranslation();
  const classes = useStyles();
  const dispatch = useDispatch();

  const [rowData, setRowData] = useState([]);
  const [openQuickSign, setOpenQuickSign] = useState(false);
  const [open, setOpen] = useState(false);
  const [send, setSend] = useState(false);
  const [blnOpenQuickSign, setblnOpenQuickSign] = useState(true);
  const [blnOpenEditor, setblnOpenEditor] = useState(true);
  const [tabIndex, setTabIndex] = useState(0);

  const [rowID, setRowID] = useState(""); // this id work as both pa id or coor doc id

  const [fileURL, setFileURL] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [openSign, setOpenSign] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [headerLable, setHeaderLable] = useState({});
  const [pageSizes] = useState([5, 10, 15]);
  const [currentIndex, setCurrentIndex] = useState(1);

  const [handleClickId, setHandleClickId] = useState(""); // this will work as pa id as well as corr id not doc id

  const [blnOpenHistory, setblnOpenHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [openPaDialog, setOpenPaDialog] = useState(false);
  const [reSave, setreSave] = useState(false);
  const [loading, setloading] = useState(false);
  const [sfdtLoading, setSfdtLoading] = useState(false);
  const [extension, setExtension] = useState("docx");

  const [sub, setSub] = useState("");
  const [rowItem, setRowItem] = useState("");
  const [openDel, setOpendel] = useState(false);
  const [edit, setEdit] = useState(false);
  const [openUpload, setOpenUpload] = useState(false);
  const [draftDakObj, setDraftDakObj] = useState("");
  const [subject, setSubject] = useState("");
  const [isScanned, setIsScanned] = useState(false);

  const [toggleState, setToggleState] = useState(false)
  const [checkedRows, setCheckedRows] = useState({}); // For handling mrt table selected row state
  const [selectedRowDataIds, setSelectedRowDataIds] = useState([])//set the row id of selected rows 


  const { draftHiddenColumns } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );

  let draftCol = {
    displayCorrespondenceNumber: true,
    subject: true,
    createdOn: true,
    status: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    draftHiddenColumns || draftCol
  );

  // console.log(columnVisibility);

  console.log("dr");
  console.log("here are selecte rows ", checkedRows)
  console.log("here are selected row ids", selectedRowDataIds)

  // const [isMr, setIsMr] = useState(false);

  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const dept = sessionStorage.getItem("department");

  // Variable to control disable of some feature in case 504
  const [dsblSign, setdsblSign] = useState(false);

  // state Variable which get track of sort option with orderBy
  const [SortBy, setSortBy] = useState({});

  // to handle update single pa either signed or unsigned without calling ap
  const [updatedPa, setupdatedPa] = useState("");

  const [corrType, setCorrType] = useState("");
  const [isMerged, setisMerged] = useState("");
  const [dakType, setDakType] = useState("");

  const [trigger, setTrigger] = useState(false);

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
      value: "pfileName",
      label: "File Name",
    },
    {
      value: "status",
      label: "Status",
    },
    // {
    //   value: "createdOn",
    //   label: "Created On",
    // },
    {
      value: "range",
      label: "Date Range",
    },
  ];

  const FilterOption2 = [
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
    // {
    //   value: "createdOn",
    //   label: "Created On",
    // },
    {
      value: "range",
      label: "Date Range",
    },
  ];

  // useEffect(() => {
  //   if (role == roleName) {
  //     setIsMr(true);
  //   }
  // }, [roleName]);

  const StatusOption = [
    "In Progress",
    "Approved",
    "Draft",
    "Rejected",
    "Return",
  ];

  const FilterTypes = {
    type: "select",
    optionValue: FilterOption,
    size: "small",
    variant: "outlined",
    label: "Filter-By",
    color: "primary",
  };

  const FilterTypes2 = {
    type: "select",
    optionValue: FilterOption2,
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
      name: "pfileName",
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
      name: "range",
      type: "range",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

  const FilterValueTypes2 = [
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
      name: "range",
      type: "range",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
  ];

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
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "File Name",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Date",
    },
  ];
  const SortValueTypes2 = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "ref",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Ref #",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Date",
    },
  ];

  // state variable which get track of all filter option with value
  const [Filter, setFilter] = useState({});

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
    unstable_batchedUpdates(() => {
      setFilter(newFilter);
      setCurrentPage(0);
      setPageSize(10);
    });
  };

  const { theme } = useSelector((state) => state);
  const { mount } = useSelector((state) => state.refreshings);
  const { changeFile } = useSelector((state) => state);
  const { blnValueDraft } = props.subscribeApi;

  useEffect(() => {
    if (tableInstanceRef.current) {
      const rows = tableInstanceRef.current
        ?.getSelectedRowModel()
        .flatRows.map((row) => row.original?.id);
      setSelectedRowDataIds(rows);
    }
  }, [checkedRows, tableInstanceRef]);

  useEffect(() => {
    if (Object.keys(checkedRows).length > 0) {
      setCheckedRows({});
    }
    // console.log(SortBy);
    let draftAbort = new AbortController();
    pADraftTableData(draftAbort.signal);

    return () => {
      draftAbort.abort();
    };
  }, [
    blnValueDraft,
    currentPage,
    pageSize,
    props.subjectReducer,
    mount,
    Filter,
    SortBy,
    trigger,
  ]);

  useEffect(() => {
    if (
      props.disableArr.includes("pa-sign") ||
      props.disableArr.includes("pa-send")
    ) {
      setdsblSign(true);
      setOpenQuickSign(false);
      setOpenSign(false);
      setSend(false);
    } else {
      setdsblSign(false);
    }
  }, [props.disableArr]);

  const pADraftTableData = (abortSignal) => {
    props.blnEnableLoader(true);
    setRowData([]);
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
    if (!_.isEmpty(SortBy)) {
      sort = {
        title: SortBy?.title?.name,
        type: SortBy?.type,
      };
    }
    if (correspondence) {
      let corrSort;
      if (SortBy?.title) {
        corrSort = {
          sortByField: SortBy.title.name,
          asc: SortBy?.type == "Asc" ? true : false,
        };
      }
      props
        .getAllCorespondence(
          pageSize,
          currentPage,
          _.isEmpty(filter) ? {} : filter,
          _.isEmpty(corrSort) ? {} : corrSort,
          abortSignal
        )
        .then((resp) => {
          if (resp?.error?.includes("aborted")) {
            return;
          }
          let tmpArr = [];
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              props.blnEnableLoader(false);
              return;
            } else {
              setTotalCount(
                resp.response.length != null ? resp.response.length : 0
              );
              tmpArr = resp.response.data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });

              setRowData(tmpArr);
              props.blnEnableLoader(false);
              props.changeTableStateDraft(false, "CHANGE_PA_DRAFT");
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
    } else {
      props
        .loadPADraftTableData(
          username,
          role,
          dept,
          pageSize,
          currentPage,
          {
            filter: _.isEmpty(filter) ? null : filter,
            sort: _.isEmpty(sort) ? null : sort,
          },
          abortSignal
        )
        .then((resp) => {
          let tmpArr = [];
          // console.log(resp);
          try {
            if (resp.error) {
              if (resp?.error?.includes("aborted")) {
                return;
              }
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
              props.blnEnableLoader(false);
              return;
            } else {
              setTotalCount(
                resp.response.length != null ? resp.response.length : 0
              );
              tmpArr = resp.response.data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setRowData(tmpArr);
              props.blnEnableLoader(false);
              props.changeTableStateDraft(false, "CHANGE_PA_DRAFT");
            }
          } catch (e) {
            callMessageOut(e.message);
            props.blnEnableLoader(false);
          }
        })
        .catch((e) => {
          console.log(e);
          let errMsg = handleError(e.message);
          callMessageOut(errMsg);
          props.blnEnableLoader(false);
        });
    }
  };

  useEffect(() => {
    if (props.openDraftPa && correspondence) {
      let row = props.openDraftPa;
      handleCorrClick(row);
    } else if (props.openDraftPa) {
      let row = props.openDraftPa;
      // setHandleClickId(row.id);
      setSfdtLoading(true);
      const url = row.fileURL;
      sessionStorage.setItem("FileURL", url);
      loadSFDT(url, row.id, row.status, row.isSigned);
      setHandleClickId(row.id);
      setHeaderLable({ subject: row.subject, pfileName: row.displayPfileName });
      dispatch({ type: CHANGE_PA_FILE, payload: false });
    }
    dispatch({
      type: OPEN_PA_DRAFT,
      payload: null,
    });
  }, [props.openDraftPa, correspondence]);

  useEffect(() => {
    if (!blnOpenQuickSign) {
      setPdfLoads(false);
    }
  }, [blnOpenQuickSign]);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-pa");
    adjustableDiv.style.height = viewportHeight - 175 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const showSWpdf = () => {
    if (pdfLoads) {
      return true;
    } else {
      return false;
    }
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const handleDelete = () => {
    props.blnEnableLoader(true);
    props
      .deleteMrDak([rowItem.id])
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            let newArr = rowData.filter((item) => {
              return item.id != rowItem.id;
            });
            dispatch(setSnackbar(true, "success", t("dak_delete")));
            setRowData(newArr);
            setOpendel(false);
            props.blnEnableLoader(false);
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
  };

  const handleEdit = () => {
    props.blnEnableLoader(true);
    props
      .editMrDak(rowItem.id, sub)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            let newArr = rowData.map((item) => {
              if (item.id != rowItem.id) return { ...item };
              else return { ...item, subject: sub };
            });
            dispatch(setSnackbar(true, "success", t("edit_dak")));
            setRowData(newArr);
            setEdit(false);
            setSub("");
            props.blnEnableLoader(false);
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
  };

  const updateSinglePa = () => {
    let newRowData = [...rowData];
    const index = newRowData.findIndex((item) => {
      return item.id === handleClickId;
    });
    if (index !== -1 && updatedPa) {
      newRowData[index].isSigned = updatedPa.isSigned;
      setRowData(newRowData);
      setupdatedPa("");
    }
  };

  const loadSFDT = (
    url,
    id,
    status,
    signed,
    corrId,
    rowData,
    isMerged,
    nofFileName
  ) => {
    props.blnEnableLoader(true);
    setSfdtLoading(true);
    let URL;
    let fileId = corrId ? corrId : id;
    let OpenPaDialog;
    props
      .loadSfdt(url, username, id, role, dept) // API call to load sfdt which will be visible on sincfusion
      .then((response) => {
        try {
          if (response.error) {
            callMessageOut(response.error);
            props.blnEnableLoader(false);
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
            setHandleClickId(rowData.id);
            if (corrId) {
              setHeaderLable({
                subject: rowData.subject,
                pfileName: rowData.correspondenceNumber,
                indexName: nofFileName,
              });
            } else {
              setHeaderLable({
                subject: rowData.subject,
                pfileName: rowData.displayPfileName,
              });
            }
            setisMerged(isMerged);
            setblnOpenQuickSign(signed);
            setRowID(fileId);
            setFileURL(URL);
            setOpenQuickSign(true);
            setblnOpenEditor(true);
            setTabIndex(0);
            setOpenPaDialog(OpenPaDialog);
            props.blnEnableLoader(false);
            setSfdtLoading(false);
          });
        } catch (e) {
          props.blnEnableLoader(false);
          setSfdtLoading(false);
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setSfdtLoading(false);
        props.blnEnableLoader(false);
      });
  };

  const handleClick = (rowData) => {
    // Again same component for both correspondence and pa
    if (correspondence) {
      handleCorrClick(rowData);
      setCorrType(rowData.type);
    } else {
      const url = rowData.fileURL;
      sessionStorage.setItem("FileURL", url);
      loadSFDT(
        url,
        rowData.id,
        rowData.status,
        rowData.isSigned,
        null,
        rowData
      );
      // unstable_batchedUpdates(() => {
      //   setHandleClickId(rowData.id);
      //   setHeaderLable({
      //     subject: rowData.subject,
      //     pfileName: rowData.displayPfileName,
      //   });
      // });
    }
  };

  console.log(extension);

  const handleCorrClick = (rowData) => {
    props.blnEnableLoader(true);
    props
      .getCorespondence(rowData.correspondenceDocId)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            props.blnEnableLoader(false);
            return;
          } else {
            const {
              application,
              id: corrId,
              mergeDak,
              type,
              nofFileName,
            } = res.response;
            sessionStorage.setItem("FileURL", application.fileUrl);
            setDakType(type);
            setIsScanned(application?.fileName?.includes(".pdf"))
            let arr = application.fileName.split(".");
            arr.length > 1
              ? setExtension(arr[arr.length - 1])
              : setExtension("docx");

            loadSFDT(
              application.fileUrl,
              rowData.id,
              rowData.status,
              application.isSigned,
              corrId,
              rowData,
              mergeDak,
              nofFileName
            );
            // unstable_batchedUpdates(() => {
            //   setHandleClickId(rowData.id);
            //   setHeaderLable({
            //     subject: rowData.subject,
            //     pfileName: rowData.correspondenceNumber,
            //   });
            // });
          }
          // pADraftTableData();
        } catch (e) {
          callMessageOut(e.message);

          props.blnEnableLoader(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        props.blnEnableLoader(false);
      });
  };

  const handleClickQuickSignClose = (shouldUpdatePa) => {
    // Mtd that triggers while clicking on close icon of quick sign dialog
    setOpenQuickSign(false);
    setOpenSign(false)
    setblnOpenEditor(true);
    // setblnOpenQuickSign(false);
    shouldUpdatePa && updateSinglePa();
  };

  const handleDocumentRollback = () => {
    setloading(true);
    let body;
    if (correspondence) {
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
              dispatch(
                setSnackbar(true, "success", t("remove_sign_successful"))
              );
              setblnOpenQuickSign(response.isSigned);
              setFileURL(response.fileUrl);
              // setreSave(true);
              setloading(false);
              setupdatedPa(response);
            });
            sessionStorage.setItem("FileURL", response.fileUrl);
          }
          // pADraftTableData();
        } catch (e) {
          callMessageOut(e.message);
          setloading(false);
        }
      });
    } else {
      rowID &&
        props.rollbackPADocument(rowID).then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setloading(false);
              return;
            } else {
              unstable_batchedUpdates(() => {
                setblnOpenQuickSign(resp.response.personalApplication.isSigned);
                setFileURL(resp.response.personalApplication.fileURL);
                // setreSave(true);
                setloading(false);
                setupdatedPa(resp.response.personalApplication);
              });
              sessionStorage.setItem(
                "FileURL",
                resp.response.personalApplication.fileURL
              );
            }
            // pADraftTableData();
          } catch (e) {
            callMessageOut(e.message);
            setloading(false);
          }
        });
    }
  };

  const handleStatus = (id) => {
    const newArr = rowData.map((item) =>
      item.id === id || item.correspondenceDocId === id
        ? { ...item, status: "In Progress" }
        : item
    );
    setRowData(newArr);
  };

  const handleOnClickOpenHistory = (id, forDialog) => {
    // e.stopPropagation();
    props.blnEnableLoader(true);
    if (id) {
      props.getHistory("PA", id).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            !isNullOrUndefined(resp.data)
              ? setHistoryData(resp.data)
              : setHistoryData([]);
            props.blnEnableLoader(false);
          }
          forDialog && setblnOpenHistory(true);
        } catch (error) {
          callMessageOut(error.message);
          props.blnEnableLoader(false);
        }
      });
    }
  };

  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 210,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.subject}>
              <span className="text-m text-b mrt-text" style={{
                color: props.theme ? "#429cff" : "#1a0dab"
              }}>{cell.getValue()}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: correspondence
          ? "displayCorrespondenceNumber"
          : "pfileName",
        header: t("file_name"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip
              title={
                correspondence
                  ? item?.displayCorrespondenceNumber
                  : item?.pfileName
              }
            >
              <span className="text-m mrt-text">
                {cell.getValue() ? cell.getValue() : "NA"}
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "createdOn",
        header: t("created_on"),
        size: 100,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.createdOn}>
              <span className="text-m mrt-text">{cell.getValue()}</span>
            </Tooltip>
          );
        },
      },
      // {
      //   accessorKey: "status",
      //   header: t("status"),
      //   size: 150,
      //   Cell: ({ cell }) => (
      //     <div className="paInfo5">
      //       <span
      //         style={{
      //           backgroundColor:
      //             cell.getValue() === "In Progress"
      //               ? "#ffaf38"
      //               : cell.getValue() === "Draft"
      //               ? "#398ea1"
      //               : cell.getValue() === "Rejected"
      //               ? "#fd4e32"
      //               : cell.getValue() === "Approved"
      //               ? "#37d392"
      //               : cell.getValue() === "Return"
      //               ? "#b73b32"
      //               : cell.getValue() === "Draft_Local"
      //               ? "#003f50"
      //               : "",
      //         }}
      //         className="status"
      //       >
      //         {cell.getValue() == "Draft_Local"
      //           ? "LOCAL DRAFT"
      //           : cell.getValue()?.toUpperCase()}
      //       </span>
      //     </div>
      //   ),
      // },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 60,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                <Tooltip title={t("delete")} aria-label="Delete">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpendel(true);
                      setRowItem(row);
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("edit_subject")} aria-label="Edit Subject">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEdit(true);
                      setRowItem(row);
                      setSub(row?.subject);
                    }}
                  >
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </>
          );
        },
      },
      // {
      //   accessorKey: "actions",
      //   header: t("actions_btn"),
      //   size: 60,
      //   Cell: ({ cell }) => {
      //     let row = cell?.row?.original;
      //     return (
      //       <>
      //         <div className="paIcons">
      //           {row.status !== "Draft" && row.status !== "Draft_Local" ? (
      //             <Tooltip title={t("user_history")}>
      //               <button
      //                 id="draftPA_history_btn"
      //                 onClick={(e) => {
      //                   e.stopPropagation();
      //                   handleOnClickOpenHistory(row?.id, true);
      //                 }}
      //               >
      //                 <AiOutlineHistory fontSize="medium" />
      //               </button>
      //             </Tooltip>
      //           ) : (
      //             !row.isSigned && (
      //               <Tooltip
      //                 title={t("edit_subject")}
      //                 aria-label="Edit Subject"
      //               >
      //                 <button
      //                   id="draftPA_edit_btn"
      //                   onClick={(e) => {
      //                     e.stopPropagation();
      //                     props.handleUpdateSubject(row);
      //                   }}
      //                 >
      //                   <FiEdit2 />
      //                 </button>
      //               </Tooltip>
      //             )
      //           )}
      //         </div>
      //       </>
      //     );
      //   },
      // },
    ],
    [props.theme, t]
  );

  const handleCorrDelete = (corrObj) => {
    props.deleteCorrespondence(corrObj?.id).then((res) => console.log(res));
  };

  // const CustomToolbarMarkup = ({ table }) => {
  //   return (
  //     <div className="PaHeader">
  //       <div className="PaHeadTop">
  //         <GenericSearch
  //           FilterTypes={correspondence ? FilterTypes2 : FilterTypes}
  //           FilterValueTypes={
  //             correspondence ? FilterValueTypes2 : FilterValueTypes
  //           }
  //           addFilter={addFilter}
  //           cssCls={{}}
  //         />

  //         <div>
  //           <GenericFilterMenu
  //             sort={SortBy}
  //             SortValueTypes={correspondence ? SortValueTypes2 : SortValueTypes}
  //             addSort={addSort}
  //           />
  //           <div className="PaIconCon">
  //             <Tooltip
  //               title={
  //                 correspondence
  //                   ? t("create_correspondence")
  //                   : t("create_a_personal_application")
  //               }
  //             >
  //               <span>
  //                 <Fab
  //                   disabled={!props.myInfo}
  //                   style={{
  //                     width: "2.2rem",
  //                     height: ".1rem",
  //                     backgroundColor: "rgb(230, 81, 71)",
  //                   }}
  //                   onClick={() => props.handleClick()}
  //                 >
  //                   <AddIcon style={{ fontSize: "19", color: "#fff" }} />
  //                 </Fab>
  //               </span>
  //             </Tooltip>
  //           </div>
  //           <MRT_ShowHideColumnsButton
  //             style={{ color: props.theme ? "#fff" : "#676767" }}
  //             table={table}
  //           />
  //         </div>
  //       </div>

  //       <GenericChip Filter={Filter} deleteChip={deleteChip} />
  //     </div>
  //   );
  // };

  const handleNextApp = () => {
    let newIndex = (currentIndex + 1) % rowData?.length;

    if (newIndex == 0) {
      let rowItem = rowData?.find((item) => item?.serialNo === rowData?.length);
      handleClick(rowItem);
      setCurrentIndex(rowData.length);
    } else {
      let rowItem = rowData?.find((item) => item?.serialNo === newIndex);
      handleClick(rowItem);
      setCurrentIndex(newIndex);
    }
  };

  const handlePrevApp = () => {
    let newIndex = currentIndex - 1;

    if (newIndex == 0) {
      let rowItem = rowData?.find((item) => item?.serialNo === rowData?.length);
      handleClick(rowItem);
      setCurrentIndex(rowData.length);
    } else {
      let rowItem = rowData?.find((item) => item?.serialNo === newIndex);
      handleClick(rowItem);
      setCurrentIndex(newIndex);
    }
  };

  const handleUploadClose = () => {
    setDraftDakObj(null);
    setSubject("");
    setOpenUpload(false);
    setIsScanned(false);
  }

  const deleteSelectedFileHandler = () => {
    console.log("getting deleted in draft pa", selectedRowDataIds)
    handleDelete()
  }

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

  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      {/* {sfdtLoading && <Loading />} */}
      <div className="mrt-head">
        <span>{t("draft_dak")}</span>
      </div>
      <Paper
        elevation={4}
        style={{
          position: "relative",
          borderRadius: "9px",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
        }}
      >
        <div id="material-table">
          <div
            className="PaHeader"
            style={{
              padding: "0rem 1rem",
            }}
          >
            <div className="PaHeadTop">
              <GenericSearch
                FilterTypes={correspondence ? FilterTypes2 : FilterTypes}
                FilterValueTypes={
                  correspondence ? FilterValueTypes2 : FilterValueTypes
                }
                addFilter={addFilter}
                cssCls={{}}
              />

              <div>
                <GenericRefresh handleRefresh={() => { setTrigger(!trigger) }} />

                <Tooltip title="Delete" style={{
                  display: selectedRowDataIds.length == 0 ? "none" : ""
                }}><span>
                    <IconButton
                      onClick={deleteSelectedFileHandler}
                      disabled={selectedRowDataIds.length <= 0}
                      size="small"
                      aria-label="previous-app"
                    >
                      <Delete color="Black" />
                    </IconButton>
                  </span>
                </Tooltip>



                <GenericFilterMenu
                  sort={SortBy}
                  SortValueTypes={
                    correspondence ? SortValueTypes2 : SortValueTypes
                  }
                  addSort={addSort}
                />

                <GenericColHider
                  tableCols={columnVisibility}
                  setTableCols={setColumnVisibility}
                  moduleName={MRDRAFT_COLUMNS_STATUS}
                />

                <div className="PaIconCon">
                  <Tooltip
                    title={
                      correspondence
                        ? t("create_correspondence")
                        : t("create_a_personal_application")
                    }
                  >
                    <span>
                      <Fab
                        disabled={!props.myInfo}
                        style={{
                          width: "2.2rem",
                          height: ".1rem",
                          backgroundColor: "rgb(230, 81, 71)",
                        }}
                        onClick={() => props.handleClick()}
                      >
                        <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                      </Fab>
                    </span>
                  </Tooltip>
                </div>
              </div>
            </div>

            <GenericChip Filter={Filter} deleteChip={deleteChip} />
          </div>
          <MaterialReactTable
            tableInstanceRef={tableInstanceRef}
            data={rowData}
            manualPagination
            columns={columns}
            initialState={{
              density: "compact",
            }}
            state={{
              // rowSelection: checkedRows,
              columnVisibility,
            }}
            // onRowSelectionChange={setCheckedRows}
            displayColumnDefOptions={{
              "mrt-row-select": {
                size: 100,
                muiTableHeadCellProps: {
                  align: "center",
                },
                muiTableBodyCellProps: {
                  align: "center",
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
            enableStickyHeader
            enableFilters={false}
            enableFullScreenToggle={false}
            // enableRowSelection
            enableDensityToggle={false}
            enableTopToolbar={false}
            muiTableBodyRowProps={({ row, staticRowIndex }) => ({
              onClick: () => {
                handleClick(row?.original);
                setCurrentIndex(row.original.serialNo);
              },

              sx: {
                cursor: "pointer",
                position: "relative",
                height: "10px",
                backgroundColor:
                  staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit",
              },
            })}
            muiTableContainerProps={() => ({
              sx: {
                border: "1px solid #8080802b",
                height: "61vh",
              },
              id: "mrt-pa",
            })}

            muiTablePaperProps={() => ({
              sx: {
                padding: "0rem 1rem",
                border: "0",
                boxShadow: "none",
                background: theme ? "#424242" : "white",
              },
            })}
            muiTableHeadRowProps={{
              sx: {
                background: theme ? "#938f8f" : "white",
              },
            }}
          // onColumnVisibilityChange={setColumnVisibility}
          />

          <PaginationComp
            pageSize={pageSize}
            pageSizes={pageSizes}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalCount={totalCount}
            setPageSize={setPageSize}
          />
        </div>
      </Paper>

      {/* Here this below dialog will be used for both pa and correspondence */}
      <Dialog
        open={openQuickSign}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleClickQuickSignClose(false);

          }
        }}
        fullScreen
        aria-labelledby="quickSignDialog"
        TransitionComponent={Transition}
        className={`${classes.divZIndex} dialog-wrapper`}
        id="draggable-dialog-title"
      >
        <DialogContent
          dividers
          style={{
            overflow: "hidden",
            backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
          }}
        >
          {loading && <Loading />}

          <Box className={classes.prevBtn}>
            <Tooltip title="PREVIOUS">
              <IconButton
                onClick={handlePrevApp}
                disabled={sfdtLoading || rowData?.length === 1}
                size="small"
                aria-label="previous-app"
              >
                <ChevronLeft />
              </IconButton>
            </Tooltip>
          </Box>
          <Box className={classes.nextBtn}>
            <Tooltip title="NEXT">
              <IconButton
                onClick={handleNextApp}
                disabled={sfdtLoading || rowData?.length === 1}
                size="small"
                aria-label="next-app"
              >
                <ChevronRight />
              </IconButton>
            </Tooltip>
          </Box>

          {openPaDialog ? (
            <Tabs
              forceRenderTabPanel
              selectedIndex={tabIndex}
              onSelect={(index) => {
                setTabIndex(index);
                setOpenSign(false)
              }}
            >
              <TabList
                style={{
                  position: "relative",
                  zIndex: 12,
                  marginLeft: "10px",
                }}
              >
                <Tab
                  style={{ borderRadius: "5px 5px 0 0", padding: "4px 10px" }}
                >
                  {correspondence
                    ? t("correspondence").toUpperCase()
                    : t("personal_application").toUpperCase()}
                </Tab>

                <IconButton
                  id="draftPA_close_PA"
                  aria-label="close"
                  onClick={() => {
                    handleClickQuickSignClose(false);
                  }}
                  style={{
                    color: props.theme ? "#fff" : "#484747",
                    float: "right",
                    marginTop: "7px",
                    marginRight: "24px",
                  }}
                  className="icons-button"
                >
                  <Cancel />
                </IconButton>
              </TabList>

              <TabPanel>
                <div hidden={!blnOpenEditor} style={{ height: "100%" }}>
                  <Annexure
                    fileId={rowID}
                    showUploader={false}
                  // sampleData={sampleData}
                  />
                </div>
              </TabPanel>
            </Tabs>
          ) : (
            <Tabs
              // forceRenderTabPanel
              selectedIndex={tabIndex}
              onSelect={(index) => {
                setTabIndex(index)
                setOpenSign(false)
              }}
            >
              <TabList
                style={{
                  position: "relative",
                  zIndex: 12,
                  margin: "-13px 0 5px 10px",
                }}
              >
                <Tab
                  style={{ borderRadius: "5px 5px 0 0", padding: "4px 10px" }}
                >
                  {correspondence
                    ? t("correspondence").toUpperCase()
                    : t("personal_application").toUpperCase()}
                </Tab>
                {correspondence ? (
                  <>
                    {corrType != "Signal" && (
                      <>
                        <Tab
                          style={{
                            borderRadius: "5px 5px 0 0",
                            padding: "4px 10px",
                          }}
                        >
                          {t("annexure")}
                        </Tab>
                        <Tab
                          style={{
                            borderRadius: "5px 5px 0 0",
                            padding: "4px 10px",
                          }}
                        >
                          {t("references")}
                        </Tab>
                      </>
                    )}
                    {/*
                    <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                    {t("yellow_notes")}
                  </Tab>
                  */}
                  </>
                ) : (
                  <Tab
                    style={{ borderRadius: "5px 5px 0 0", padding: "4px 10px" }}
                  >
                    {t("annexure")}
                  </Tab>
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
                    color: props.theme ? "#fff" : "#484747",
                    float: "right",
                    marginTop: "27px",
                    marginRight: "20px",
                  }}
                  className="icons-button"
                >
                  <Cancel />
                </IconButton>
              </TabList>

              <TabPanel>
                <>
                  {(blnOpenQuickSign || correspondence) && (
                    <>
                      <Tooltip title={t("send")}>
                        <Fab
                          aria-label="close"
                          color="secondary"
                          size="medium"
                          className={`button-glow ${classes.send_btn}`}
                          onClick={(e) => setSend(true)}
                          style={{ padding: "1px" }}
                          disabled={openSign}
                        >
                          <SendIcon style={{ marginLeft: "3px" }} />
                        </Fab>
                      </Tooltip>
                    </>
                  )}
                  {blnOpenQuickSign && !isScanned && (
                    <Tooltip title={t("undo")} className="dialog_sendButton">
                      <Fab
                        aria-label="close"
                        color="primary"
                        size="medium"
                        className={classes.sign_btn1}
                        onClick={handleDocumentRollback}
                        style={{ padding: "1px" }}
                      >
                        <RestorePageIcon />
                      </Fab>
                    </Tooltip>
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
                          disabled={openSign}
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
                      extension={extension}
                      toggleState={toggleState}
                    />
                  </div>
                </>

                <>
                  {!blnOpenQuickSign && !isScanned && (
                    <Tooltip
                      title={
                        reSave
                          ? t("autosave")
                          : dsblSign
                            ? t("gateway_sign")
                            : t("sign")
                      }
                    >
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
                          disabled={reSave || dsblSign || openSign}
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
                    {(blnOpenQuickSign || correspondence) && (
                      <Tooltip title={t("send")}>
                        <Fab
                          id="DraftPaTable_send_btton"
                          aria-label="close"
                          color="secondary"
                          size="medium"
                          className={`button-glow ${classes.send_btn}`}
                          onClick={(e) => setSend(true)}
                          disabled={openSign}
                        >
                          <SendIcon style={{ marginLeft: "3px" }} />
                        </Fab>
                      </Tooltip>
                    )}
                    <Annexure
                      correspondence={correspondence}
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
              {correspondence && (
                <>
                  {corrType != "Signal" && (
                    <TabPanel>
                      <>
                        {(blnOpenQuickSign || correspondence) && (
                          <Tooltip title={t("send")}>
                            <Fab
                              id="DraftPaTable_send_btton"
                              aria-label="close"
                              size="medium"
                              color="secondary"
                              className={`button-glow ${classes.send_btn}`}
                              onClick={(e) => setSend(true)}
                              disabled={openSign}
                            >
                              <SendIcon style={{ marginLeft: "3px" }} />
                            </Fab>
                          </Tooltip>
                        )}
                        <Annexure
                          correspondence={correspondence}
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
                  {/*
                  <TabPanel>
                  <>
                    {blnOpenQuickSign && (
                      <Tooltip title={t("send")}>
                        <Fab
                          id="DraftPaTable_send_btton"
                          aria-label="close"
                          color="secondary"
                          className={`button-glow ${classes.send_btn}`}
                          onClick={(e) => setSend(true)}
                        >
                          <SendIcon />
                        </Fab>
                      </Tooltip>
                    )}

                    <h4>Yellow Notes</h4>
                  </>
                </TabPanel>
                */}
                </>
              )}
            </Tabs>
          )}
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
        hideBackdrop
        disableEnforceFocus
        disableBackdropClick
        style={{
          position: 'initial',
        }}
      >
        <DialogTitle
          id="draggable-dialog-title"
          className="send_dialog"
          style={{ cursor: "move" }}
        >
          {t("sign")}
          <Tooltip title={t("close")}>
            <IconButton
              id="close_draftPA_table"
              aria-label="close"
              color="primary"
              onClick={() => setOpenSign(false)}
              style={{ float: "right", position: "relative", top: "0px" }}
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
        <InputForm
          correspondence={correspondence}
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
          updatePa={(obj) => {
            setupdatedPa(obj);
          }}
          pfileName={headerLable.pfileName}
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
        maxWidth={blnOpenQuickSign ? "xl" : "lg"}
        fullWidth
        id="corr-send"
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
                  <CancelIcon
                    style={{
                      color: props.theme ? "#fff" : "#484747",
                    }}
                  />
                </IconButton>
              </Tooltip>

              {!correspondence && (
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
                    <HistoryIcon
                      style={{
                        color: props.theme ? "#fff" : "inherit",
                      }}
                    />
                  </Tooltip>
                </IconButton>
              )}
            </div>
          </DialogTitle>

          {correspondence ? (
            <CorrHrmDialog
              fileId={rowID}
              handleCloseEvent={(e) => {
                setOpen(false);
                setOpenQuickSign(false);
                setSend(false);
                let draftAbort = new AbortController();
                pADraftTableData(draftAbort.signal);
              }}
              setSend={setSend}
              pfileName={headerLable.pfileName}
              handleStatus={handleStatus}
              signed={blnOpenQuickSign}
              isInfo={isMerged}
            />
          ) : (
            <SendFileForm
              fileId={rowID}
              handleCloseEvent={(e) => {
                setOpen(false);
                setOpenQuickSign(false);
              }}
              setSend={setSend}
              pfileName={headerLable.pfileName}
              handleStatus={handleStatus}
            />
          )}
        </Paper>
      </Dialog>

      <Dialog
        open={blnOpenHistory}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setblnOpenHistory(false);
          }
        }}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
        fullWidth
        maxWidth="sm"
        className="personal-application-history"
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          <span>{t("user_history")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="PA_Histry_btn"
              aria-label="close"
              color="primary"
              onClick={() => setblnOpenHistory(false)}
              className="cancel-drag"
            >
              <CancelIcon
                style={{
                  color: theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <HistoryDialog historyData={historyData} />
      </Dialog>

      <Dialog
        open={openDel}
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
          {t("delete_dak")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={() => setOpendel(false)}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <h6>Are you sure you want to delete this dak?</h6>
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={edit}
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
          {t("edit_subject")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={() => setEdit(false)}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("edit_subject")}
            variant="outlined"
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            fullWidth
            size="small"
            style={{ margin: "1rem 0" }}
            className={props.theme ? "darkTextField" : ""}
          />
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            onClick={handleEdit}
          >
            {t("update")}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    openDraftPa: state.openDraftPa,
    myInfo: state.myInfo,
    theme: state.theme,
    subjectReducer: state.subjectReducer,
    disableArr: state.gateway.disableArr,
  };
}

export default reduxConnect(mapStateToProps, {
  loadPADraftTableData,
  loadSfdt,
  deleteMrDak,
  editMrDak,
  changeTableStateDraft,
  rollbackPADocument,
  getHistory,
  currentSign,
  getAllCorespondence,
  getCorespondence,
  rollbackCorrDocument,
  deleteCorrespondence,
  uploadScannedDak,
})(DraftPaFileTable);
