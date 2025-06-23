import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  PaneDirective,
  PanesDirective,
  SplitterComponent,
} from "@syncfusion/ej2-react-layouts";
import { Breadcrumb } from "../../../../matx";
import "../folder/index.css";
import {
  Paper,
  Grid,
  Tooltip,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  IconButton,
  TableHead,
  Button,
  Divider,
  Fab,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
  Menu,
  Dialog,
  DialogContent,
  Chip,
  TextField,
  FormControl,
  InputLabel,
  DialogTitle,
  DialogActions,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import {
  getCabinaetData,
  getCabinet,
  getAdvanceSearch,
  loadAdvanceSearch,
  getIndexData,
  deleteFile,
  editFile,
} from "../../../camunda_redux/redux/action/index";
import { changingTableStateCabinet } from "../../../camunda_redux/redux/action/apiTriggers";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import history from "../../../../history";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericChip from "app/views/utilities/GenericChips";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import { unstable_batchedUpdates } from "react-dom";

import SystemUpdateAltTwoToneIcon from "@material-ui/icons/SystemUpdateAltTwoTone";
import AssessmentIcon from "@material-ui/icons/Assessment";
import { FaBarcode } from "react-icons/fa";
import { makeStyles } from "@material-ui/core/styles";
import ConfirmationDialog from "./ConfirmationDialog";
import { Add, Cancel, Delete, Edit, ExpandMore } from "@material-ui/icons";
import CreateFile from "./CreateFile";
import CreateVolumeFile from "./CreateVolumeFile";
import Custodian from "./Custodian";
import AdvanceSeach from "../advanceSeach";
import { useContext } from "react";
import { AdvanceSearchContext } from "../advanceSeach/AdvanceContext";
import { permanentlyClose } from "app/camunda_redux/redux/action/backend-rest/form-data";
// import data from "app/views/RTI/sharedComponents/data";
import CloudTable from "app/views/inbox/shared/SplitviewContainer/CloudTable";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import { DirContext } from "./DirectoryProvider";
import IndexFileForm from "../../Correspondence/IndexFileForm";

// import { getCabinet } from "app/camunda_redux/redux/action/backend-rest/form-data";
import DirectoryView from "./DirectoryView";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import GenericColHider from "app/views/utilities/GenericColHider";
import { CABINET_COLUMNS_STATUS } from "app/camunda_redux/redux/constants/ActionTypes";
import CreatePC from "./CreatePC";
import PaginationComp2 from "app/views/utilities/PaginationComp2";
import Draggable from "react-draggable";
import BarcodeView from "./BarcodeView";
import GenericRefresh from "app/views/utilities/GenericRefresh";

let drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaperNotOpen: {
    width: drawerWidth,
    top: "4.7rem",
    height: Number(window.innerHeight - 98),
    visibility: "initial",
    display: "none",
  },
  drawerPaperOpen: {
    width: drawerWidth,
    top: "5rem",
    height: Number(window.innerHeight - 98),
    display: "initial",
  },
  dialog_paper: {
    transform: "translateX(13%)",
    position: "relative",
    top: "7.5rem !important",
  },
  headerAddIcon: {
    width: "30px",
    minHeight: "30px",
    height: "30px",
    backgroundColor: "rgb(230, 81, 71)",
    marginLeft: "4px",
  },
}));

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
}

const CabinetTable = (props) => {
  const { t } = useTranslation();
  const tableInstanceRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const paramPage = searchParams.get("page");
  const paramSize = searchParams.get("pageSize");
  const paramFilter = searchParams.get("filter");
  const cabinetDept = sessionStorage.getItem("parent-dir") || sessionStorage.getItem("department");
  const { text, sendBy, createdBy, fileNo, subject, status } =
    useContext(AdvanceSearchContext);

  const [totalCount, setTotalCount] = useState(0);
  const [SortBy, setSortBy] = useState({});
  const [currentPage, setCurrentPage] = useState(Number(paramPage) || 1);
  const [pageSize, setPageSize] = useState(Number(paramSize) || 25);
  const [Filter, setFilter] = useState(
    JSON.parse(decodeURIComponent(paramFilter)) || {}
  );
  const [rowData, setRowData] = useState([]);
  
  const { blnValueCabinet } = props.subscribeApi;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [selectedRow, setSelectedRow] = useState(null);

  const [openCustodian, setOpenCustodian] = useState(false);
  const [createVolume, setcreateVolume] = useState(false);
  const [createFile, setcreateFile] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAdvance, setOpenAdvance] = useState(false);
  const [tigger, setTrigger] = useState(false);
  const [type2, setType] = useState("");
  const [apiObj, setapiObj] = useState({
    barCreated: "",
    barDocumenttype: "",
  });
  const [chipState, setchipState] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);

  // State to keep track of which type of file to populate in cabinet
  const [fetchType, setFetchType] = useState(true);

  const [navData, setNavData] = useState("");

  const role = sessionStorage.getItem("role");
  const department = sessionStorage.getItem("parent-dir") || sessionStorage.getItem("department");
  const username = localStorage.getItem("username");
  let cabinetId = Cookies.get("cabinetId");

  const [openIndex, setopenIndex] = useState(false);
  const [openPc, setOpenPc] = useState(false);

  const [edit, setEdit] = useState(false);
  const [del, setDel] = useState(false);
  const [rowItem, setrowItem] = useState("");
  const [sub, setSub] = useState("");
  const [barcodeOpen, setBarcodeOpen] = useState(false);

  const [selectedType, setSelectedType] = useState("")

  const { cabinetHiddenColumns } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );

  let cabinetCol = {
    subject: true,
    file: true,
    indexFile: true,
    createdBy: true,
    status: true,
    createdOn: true,
    residingWith: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    cabinetHiddenColumns || cabinetCol
  );

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handlePopupClose = () => {
    setBarcodeOpen(false);
  };

  const syncStateWithURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    const size = searchParams.get("pageSize");
    const filter = searchParams.get("filter");

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
    }

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const handleForm = (val) => setopenIndex(val);

  const handlePC = (val) => setOpenPc(val);

  const handleTrigger = () => {
    setTrigger(true);
  };

  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl2(null);
  };

  const openFileCreate = () => {
    setcreateFile(!createFile);
  };

  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleFileClose = () => {
    props.permanentlyClose(cabinetId).then((res) => {
      // console.log("File has been closed", res);
    });
  };

  const handleCreateVol = () => {
    setcreateVolume(!createVolume);
  };

  const handleCustodian = () => {
    setOpenCustodian(!openCustodian);
  };

  const handleOpenAdvance = () => {
    setOpenAdvance(!openAdvance);
  };
  const handledata = (type1, type2) => {
    if (type1 === "DocumentType") {
      setapiObj({
        ...apiObj,
        barDocumenttype: type2,
      });
    } else {
      setapiObj({
        ...apiObj,
        barCreated: type2,
      });
    }
  };

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

  const handleChipAndPopulate = (Heading, subHeading) => {
    // console.log(Heading, subHeading);
    handleChipState(Heading, subHeading);
    handledata(Heading, subHeading);
    setCurrentPage(1);
  };
  useEffect(() => {
    loadAdvanceSearchTable();
  }, [apiObj.barCreated, apiObj.barDocumenttype, currentPage, pageSize]);

  const handleChipState = (Heading, subHeading) => {
    setchipState([
      ...chipState,
      {
        key: Heading,
        value: subHeading,
      },
    ]);
  };

  const handleChipDelete = (index, chipKey, activeChip) => {
    let modifiedChips = chipState.filter((item) => item.value !== activeChip);
    setchipState(modifiedChips);

    if (chipKey === "DocumentType") {
      setapiObj({
        ...apiObj,
        barDocumenttype: "",
      });
    } else {
      setapiObj({
        ...apiObj,
        barCreated: "",
      });
    }
    setCurrentPage(1);
  };

  const handleClosemenu = () => {
    setAnchorEl(null);
  };

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "subject",
      label: "Subject",
    },
    // {
    //   value: "type",
    //   label: "Type",
    // },
    {
      value: "file",
      label: "File #",
    },
    {
      value: "advance",
      label: "Advance Search",
    },
    // {
    //   value: "oldFile",
    //   label: "Old File",
    // },
    {
      value: "status",
      label: "Status",
    },
    // {
    //   value: "caseNumber",
    //   label: "Case Number",
    // },
    {
      value: "range",
      label: "Date Range",
    },
    {
      value: "createdOn",
      label: "Created On",
    },
  ];
  const StatusOption = [
    "In-Progress",
    // "Approved",
    "Closed",
    // "Draft",
    // "Rejected",
    // "Return",
    "Reopened",
  ];
  const classObj = {
    Container: "",
    ChipContainer: "PaChipCon",
    FilterInpContainer: "PaFilterInputs",
  };

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
      name: "type",
      type: "select",
      optionValue: ["File", "Correspondence File"],
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "advance",
      type: "auto",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    // {
    //   name: "oldFile",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   label: "Value",
    //   color: "primary",
    // },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "file",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    // {
    //   name: "caseNumber",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   color: "primary",
    // },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
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

  const SortValueTypes = [
    {
      name: "oldFile",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Old FileName",
      color: "primary",
    },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "caseNumber",
      type: "text",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Case Number",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "CreatedOn",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Status",
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
        setCurrentPage(1);
        setPageSize(25);
        handleSearchParams("filter", newFilter);
      });
    }
  };

  const addSort = (sortObj) => {
    // console.log(sortObj);
    setSortBy(sortObj);
  };

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
    searchParams.set("pageSize", 10);

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
  const { mount } = useSelector((state) => state.refreshings);

  const { dirFilter } = useContext(DirContext);

  useEffect(() => {
    let cabinetAbort = new AbortController();
    if (!text && !sendBy && !createdBy && !fileNo && !subject && !status) {
      if (fetchType) {
        loadCabinateData(cabinetAbort.signal);
      } else {
        loadIndexData(cabinetAbort.signal);
      }
    }

    return () => {
      cabinetAbort.abort();
    };
  }, [
    blnValueCabinet,
    dirFilter,
    Filter,
    SortBy,
    mount,
    pageSize,
    currentPage,
    tigger,
    fetchType,
  ]);

  useEffect(() => {
    let cabinetAbort = new AbortController();
    if (text && dirFilter) {
      loadAdvanceSearchTable(text);
    } else if (dirFilter) {
      props.handleLoading(true);
      let filter = {};
      let isType;
      Object.entries(Filter).map(([property, value]) => {
        let key = property.split("|")[0];
        if (property.includes("range")) {
          let dates = Object.values(value);
          let rangeObj = {
            fromDate: dates[0],
            toDate: dates[1],
          };
          filter = { ...filter, ...rangeObj };
        } else if (key == "type" || key == 'chip') {
          isType = true;
          filter['type'] = value;
        }
        if (key == "status" && value == "Closed") {
          filter[`${key}`] = "C";
        } else if (key != 'chip') {
          filter[`${key}`] = value;
        }
      });

      let type =
        filter?.type == "File"
          ? 1
          : filter?.type == "Correspondence File"
            ? 2
            : 0;
      if (isType) {
        delete filter["type"];
      }
      filter.section = dirFilter == "all" ? "" : dirFilter;
      let sort = null;
      if (!_.isEmpty(SortBy)) {
        sort = {
          title: SortBy?.title?.name,
          type: SortBy?.type,
        };
      }
      props
        .getCabinet(
          role,
          cabinetDept,
          username,
          _.isEmpty(filter) ? {} : filter,
          _.isEmpty(sort) ? {} : sort,
          // NoOfItems,
          25,
          0,
          // pageNumber,
          cabinetAbort.signal,
          type
        )
        .then((resp) => {
          if (resp?.error?.includes("aborted")) {
            return;
          }
          let tmpArr = [];
          if (resp.error) {
            callMessageOut(resp.error);
            props.handleLoading(false);
          }
          try {
            tmpArr = resp?.data.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });
            setRowData(tmpArr);
            setTotalCount(resp.length);
            // setCurrentPage(pageNumber);
            // setCurrentPage(0);
            // setPageSize(10);
            // pageNumber !== 0 ? setCurrentPage(pageNumber) : setCurrentPage(0);

            // props.changingTableStateCabinet(false, "CHANGE_CABINET");
            props.handleLoading(false);
          } catch (error) {
            callMessageOut(error.message);
            props.handleLoading(false);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
          props.handleLoading(false);
        });
    }
    return () => {
      cabinetAbort.abort();
    };
  }, [dirFilter]);

  sessionStorage.getItem("parent-dir") ? console.log(111) : console.log(222);
  const loadCabinateData = (abortSignal) => {
    props.handleLoading(true);
    setNavData({});
    let filter = {};
    let isType = false;
    console.log(Filter)
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      if (property.includes("range")) {
        let dates = Object.values(value);
        let rangeObj = {
          fromDate: dates[0],
          toDate: dates[1],
        };
        filter = { ...filter, ...rangeObj };
      } else if (key == "type" || key == 'chip') {
        isType = true;
        filter['type'] = value;
      } else if (key == "status" && value == "Closed") {
        filter[`${key}`] = "C";
      } else if (key != 'chip') {
        filter[`${key}`] = value;
      }
    });
    console.log(filter)
    let type =
      filter?.type == "File"
        ? 1
        : filter?.type == "Correspondence File"
          ? 2
          : 0;
    if (isType) {
      delete filter["type"];
    }

    filter.section = dirFilter == "all" ? "" : dirFilter;
    let sort = null;
    if (!_.isEmpty(SortBy)) {
      sort = {
        title: SortBy?.title?.name,
        type: SortBy?.type,
      };
    }

    props
      .getCabinet(
        role,
        cabinetDept,
        username,
        _.isEmpty(filter) ? {} : filter,
        _.isEmpty(sort) ? {} : sort,
        pageSize,
        currentPage - 1,
        abortSignal,
        type
      )
      .then((resp) => {
        if (resp?.error?.includes("aborted")) {
          return;
        }
        let tmpArr = [];
        if (resp.error) {
          callMessageOut(resp.error);
          props.handleLoading(false);
        }
        try {
          tmpArr = resp?.data.map((item, index) => {
            return {
              ...item,
              serialNo: pageSize * currentPage - 1 + (index + 1),
            };
          });
          setRowData(tmpArr);
          setTotalCount(resp.length);
          // props.changingTableStateCabinet(false, "CHANGE_CABINET");
          props.handleLoading(false);
        } catch (error) {
          callMessageOut(error.message);
          props.handleLoading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        props.handleLoading(false);
      });
  };

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-cab-int");
    adjustableDiv.style.height = viewportHeight - 235 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const loadIndexData = (abortSignal) => {
    props.handleLoading(true);
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
    props
      .getIndexData(
        role,
        department,
        username,
        {
          filter: _.isEmpty(filter) ? null : filter,
          sort: _.isEmpty(sort) ? null : sort,
        },
        pageSize,
        currentPage - 1,
        abortSignal
      )
      .then((resp) => {
        if (resp?.error?.includes("aborted")) {
          return;
        }
        let tmpArr = [];
        if (resp.error) {
          callMessageOut(resp.error);
          props.handleLoading(false);
        }
        try {
          tmpArr = resp?.map((item, index) => {
            return {
              ...item,
              serialNo: pageSize * currentPage - 1 + (index + 1),
            };
          });
          setRowData(tmpArr);
          setTotalCount(resp.length);
          // props.changingTableStateCabinet(false, "CHANGE_CABINET");
          props.handleLoading(false);
        } catch (error) {
          callMessageOut(error.message);
          props.handleLoading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        props.handleLoading(false);
      });
  };

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "file",
        header: t("old_file"),
        size: 80,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return <div>{row?.pcFileNumber || row?.file}</div>;
        },
      },
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 180,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <div className="text-m text-b mrt-text" style={{
              color: props.theme ? "#429cff" : "#1a0dab"
            }}
              onClick={(e) => {
                e.stopPropagation();
                handleClick(row);
              }}
            >{row?.pcSubject || row?.subject}
            </div>
          );
        },
      },
      {
        accessorKey: "status",
        header: t("status"),
        size: 80,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <div>{row?.status == "In-Cabinet" ? "Closed" : row?.status}</div>
          );
        },
      },
      // {
      //   accessorKey: "indexFile",
      //   header: t("file_type"),
      //   size: 140,
      //   Cell: ({ cell }) => {
      //     let row = cell?.row?.original;
      //     let type = row.indexFile ? "CORRESPONDENCE" : "FILE";
      //     return (
      //       <div className="cabinet-sts">
      //         <span
      //           style={{
      //             backgroundColor: row.indexFile ? "#398ea1a1" : "#37d392a1",
      //           }}
      //           className="status"
      //         >
      //           {type}
      //         </span>
      //       </div>
      //     );
      //   },
      // },
      {
        accessorKey: "createdBy",
        header: t("created_by"),
        size: 100,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return <div>{row?.createdBy}</div>;
        },
      },

      {
        accessorKey: "createdOn",
        header: t("created_on"),
        size: 120,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;

          return (
            <div className="text-overflow">
              <Tooltip title={row?.fcreatedOnTime || row?.createdOn}>
                <span>{row?.fcreatedOnTime || row?.createdOn}</span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        accessorKey: "reopen_by",
        header: t("reopen_by"),
        size: 90,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;

          return (
            <div className="text-overflow">
              <Tooltip title={row?.reOpenedBy}>
                <span>{row?.reOpenedBy}</span>
              </Tooltip>
            </div>
          );
        },
      },
      // {
      //   accessorKey: "residingWith",
      //   header: t("residing_with"),
      //   size: 80,
      //   Cell: ({ cell }) => {
      //     return <div>{cell.getValue()}</div>;
      //   },
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
                {!row.indexFile && (
                  <Tooltip title={t("view_barcode")} aria-label="View Barcode">
                    <IconButton
                      style={{
                        padding: "0px",
                        fontSize: "1.2rem",
                        marginRight: "3px",
                      }}
                      id="barcode_btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBarcodeOpen(true);
                        setrowItem(row);
                      }}
                    >
                      <FaBarcode />
                    </IconButton>
                  </Tooltip>
                )}
                {row?.status == "Draft" ? (
                  <>
                    <Tooltip title={t("delete")} aria-label="Delete Subject">
                      <IconButton
                        id="draftPA_del_btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDel(true);
                          setrowItem(row);
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip
                      title={t("edit_subject")}
                      aria-label="Edit Subject"
                    >
                      <IconButton
                        id="draftPA_del_btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEdit(true);
                          setrowItem(row);
                          setSub(row?.subject);
                        }}
                      >
                        <Edit color="primary" />
                      </IconButton>
                    </Tooltip>
                  </>
                ) : (
                  ""
                )}
              </div>
            </>
          );
        },
      },
    ],
    [rowData, props.theme, t]
  );

  const handleClick = (rowItem) => {
    if (rowItem.indexFile) {
      if (rowItem.correspondenceNumber) {
        Cookies.set("corrIndex", rowItem.correspondenceNumber);
      }
      Cookies.set("inboxFile", rowItem.subject);
      Cookies.set("annexNo", rowItem.annexNo);
      Cookies.set("refNo", rowItem.refNo);
      Cookies.set("corrApp", rowItem.application);
      Cookies.set("searchText", text);
      Cookies.set("paFileId", rowItem.id);
      Cookies.set("paFileName", rowItem.file);
      Cookies.set("isCorr", true);
      Cookies.set("index", true);
      Cookies.set("partCase", true);
      Cookies.set("section", rowItem.section);
      Cookies.set("classification", rowItem.typeOfFile);
      history.push({
        pathname: "/eoffice/personnel/fileview",
        state: {
          from: "cabinet",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
          searchText: text,
          routeQueryParams: location.search,
        },
      });
    } else {
      sessionStorage.setItem("InboxID", rowItem.id);
      sessionStorage.setItem("pa_id", rowItem.personalApplicationInventoryId);
      sessionStorage.setItem("barcode", rowItem.imageDataString);
      Cookies.set("date", rowItem.createdOn);
      Cookies.set("inboxFile", rowItem.subject);
      Cookies.set("corrIndex", null);
      Cookies.set("priority", rowItem.priority);
      Cookies.set("cabinetStatus", rowItem.status);
      Cookies.set("referenceNumber", rowItem.file);
      Cookies.set("type", rowItem.type);
      Cookies.set("cabinetpartcase", rowItem.partcaseId);
      Cookies.set("cabinetid", rowItem.id);
      Cookies.set("department", rowItem.department);
      Cookies.set("section", rowItem.section);
      Cookies.set("classification", rowItem.typeOfFile);

      // This cookie will make sure that we are redirecting to splitview from cabinet
      Cookies.set("partCase", true);

      //@@@@@@ Here handling 3 cases of file in cabinet @@@@@@

      // 1. When main file is created from cabinet
      if (
        rowItem.status == "Draft" ||
        (rowItem.status == "Reopened" && role == rowItem?.creatorRole)
      ) {
        Cookies.set("isDraft", true);
        Cookies.set("isIndex", false);
        Cookies.set("isCabinet", false);
        sessionStorage.setItem("partcaseID", rowItem?.partCase);

        // 2. When file in cabinet is the index file
      } else if (!fetchType) {
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
      if (rowItem.encNo) {
        Cookies.set("searchEnc", text);
      }
      if (rowItem.notingNo) {
        Cookies.set("searchNoting", text);
      }

      history.push({
        pathname: "/eoffice/splitView/file",
        state: {
          from: "cabinet",
          data: rowItem.subject,
          rowData,
          fileNo: rowItem.serialNo,
          searchText: text,
          routeQueryParams: location.search,
        },
      });
    }
  };

  const [createOnValue, setCreatedOnValue] = useState(null);

  /*--------------------------------Advance Search------------------------------------*/

  // useEffect(() => {
  //   console.log("Internal scope", scope);
  // }, [scope]);

  const loadAdvanceSearchTable = (val) => {
    const filter = chipState[0]?.value || "";
    if (val || text || sendBy || createdBy || fileNo || subject || status) {
      let section = "";
      if (dirFilter == "all") {
        section = "";
      } else if (dirFilter == null) {
        section = "";
      } else if (dirFilter) {
        section = dirFilter;
      }
      props.handleLoading(true);
      props
        .loadAdvanceSearch(
          val,
          text,
          role,
          pageSize,
          currentPage - 1,
          username,
          department,
          section,
          filter,
          fileNo,
          sendBy,
          createdBy,
          subject,
          status,
          "internal"
        )
        .then(({ response }) => {
          // console.log(response);
          if (response?.error) {
            props.handleLoading(false);
            return callMessageOut(response.error);
          }
          setTotalCount(response?.records);
          setNavData(response?.navData);
          setRowData(response?.dataTest);
          props.handleLoading(false);
          // AdvanceOnChange("filters", response?.navData);
        })
        .catch((error) => {
          console.log(error);
          props.handleLoading(false);
        });
    }
  };

  /*--------------------------------Advance Search------------------------------------*/

  const handleEdit = () => {
    props.handleLoading(true);
    let formData = new FormData();
    formData.append("fileName", rowItem?.file);
    formData.append("subject", sub);
    props
      .editFile(formData)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.handleLoading(false);
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
            props.handleLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          props.handleLoading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.handleLoading(false);
      });
  };

  const handleDelete = () => {
    props.handleLoading(true);
    props
      .deleteFile(rowItem?.file)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.handleLoading(false);
            return;
          } else {
            let newArr = rowData.filter((item) => {
              return item.id != rowItem.id;
            });
            dispatch(
              setSnackbar(true, "success", "FILE HAS BEEN DELETED SUCCESSFULLY")
            );
            setRowData(newArr);
            setDel(false);
            setTotalCount(totalCount - 1);
            props.handleLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          props.handleLoading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.handleLoading(false);
      });
  };

  const handleChange = (e) => {
    // console.log("innertext", e.target.innerText);
  };

  const resetCabinetStates = () => {
    setCurrentPage(1);
    setPageSize(25);
    // setFilter({});
    // setSortBy({});
  };
  return (
    <>
      <Paper
        style={{
          width: "100%",
          borderRadius: "9px",
          marginRight: "1rem",
        }}
      >
        <Grid container style={{ padding: "0 1rem" }}>
          {/* <div id="upper-pane-content" style={{ display: "none" }}>
            <DirectoryView resetCabinetStates={resetCabinetStates} />
          </div>
          <div id="bottom-pane-content" style={{ display: "none" }}>
            {!isNullOrUndefined(navData) && (
              <div>
                {Object.keys(navData).map((childObj) => {
                  return (
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography>{childObj}</Typography>
                      </AccordionSummary>
                      {Object.keys(navData[childObj]).map((innerChild, i) => {
                        // console.log(innerChild, "||", childObj);
                        return (
                          <MenuItem
                            key={i}
                            onChange={(e) => handleChange(e)}
                            onClick={(e) => {
                              handleChipAndPopulate(childObj, innerChild);
                            }}
                          >
                            {" "}
                            {`${innerChild} ( ${navData[childObj][innerChild]} )`}
                          </MenuItem>
                        );
                      })}
                    </Accordion>
                  );
                })}
              </div>
            )}
          </div> */}
          {/* <div id="left-pane-content" style={{ display: "none" }}>
            <SplitterComponent
              id="expand-collapse"
              height="450px"
              separatorSize={1}
              orientation="Vertical"
              className="left-splitter-vertical"
            >
              <PanesDirective>
                <PaneDirective
                  content="#upper-pane-content"
                  collapsible={true}
                  size="225px"
                />
                <PaneDirective
                  content="#bottom-pane-content"
                  collapsible={true}
                  size="225px"
                />
              </PanesDirective>
            </SplitterComponent>
          </div> */}
        </Grid>

        <SplitterComponent id="expand-collapse" style={{ marginTop: "10px" }}>
          <div
            style={{
              width: "16%",
            }}
          >
            {/*  <SplitterComponent orientation="Vertical" id="expand-collapse2"> */}
            <div
              style={{
                height: "60%",
              }}
            >
              <DirectoryView resetCabinetStates={resetCabinetStates} />
            </div>
            <div>
              {!isNullOrUndefined(navData) && (
                <div>
                  {Object.keys(navData).map((childObj) => {
                    return (
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMore />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <Typography>{childObj}</Typography>
                        </AccordionSummary>
                        {Object.keys(navData[childObj]).map((innerChild, i) => {
                          // console.log(innerChild, "||", childObj);
                          return (
                            <MenuItem
                              key={i}
                              onChange={(e) => handleChange(e)}
                              onClick={(e) => {
                                handleChipAndPopulate(childObj, innerChild);
                              }}
                            >
                              {" "}
                              {`${innerChild} ( ${navData[childObj][innerChild]} )`}
                            </MenuItem>
                          );
                        })}
                      </Accordion>
                    );
                  })}
                </div>
              )}
            </div>
            {/* </SplitterComponent> */}
          </div>
          <div
            style={{
              width: "84%",
              padding: "0rem 1rem",
            }}
          >
            <div id="material-table">
              <div>
                <div className="CabinetHeadTop">
                  <GenericSearch
                    FilterTypes={FilterTypes}
                    FilterValueTypes={FilterValueTypes}
                    addFilter={addFilter}
                    cssCls={{}}
                    handleOpenAdvance={handleOpenAdvance}
                    width="70%"
                    loadAdvanceSearchTable={loadAdvanceSearchTable}
                    reset={loadCabinateData}
                    setCurrentPage={setCurrentPage}
                    setchipState={setchipState}
                    setapiObj={setapiObj}
                    scope={"internal"}
                  />
                  <GenericRefresh handleRefresh={() => setTrigger(!tigger)} />
                  <div className="CabinetIconCon">

                    <Menu
                      id="simple-menu"
                      anchorEl={anchorEl2}
                      open={Boolean(anchorEl2)}
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
                      {/*
                        <MenuItem onClick={() => openFileCreate(true)}>
                        {t("crt_file")}
                      </MenuItem>
                        */}
                      <MenuItem onClick={() => handleForm(true)}>
                        {t("crt_ind")}
                      </MenuItem>

                      {/*
                        <MenuItem onClick={() => handlePC(true)}>
                        {t("create_part_case_file")}
                      </MenuItem>
                        */}
                    </Menu>
                  </div>
                  {/* <div>
            <GenericFilterMenu
              FilterValueTypes={SortValueTypes}
              addSort={addSort}
            />
          </div> */}
                  <GenericColHider
                    tableCols={columnVisibility}
                    setTableCols={setColumnVisibility}
                    moduleName={CABINET_COLUMNS_STATUS}
                  />
                  <Fab
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                    aria-controls="simple-menu"
                    aria-haspopup="true"
                    onClick={handleClick2}
                  >
                    <Add style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
                </div>
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
                    {t("all")}
                  </Button>
                  <Button
                    className={`chip-info dak ${selectedType == "Dak" && 'active'}`}
                    onClick={() => {
                      setSelectedType("Dak")
                      handleType("Correspondence File")
                    }}
                  >
                    {t("index")}
                  </Button>
                  <Button
                    className={`chip-info file ${selectedType == "File" && 'active'}`}
                    onClick={() => {
                      setSelectedType("File")
                      handleType("File")
                    }}
                  >
                    {t("files")}
                  </Button>
                  {/* <Button
                    className="chip-info no-cursor"
                    onClick={() => handleType("File")}
                  >
                    {t("action_point")} <span>{0}</span>
                  </Button> */}
                </div>
                <GenericChip Filter={Filter} deleteChip={deleteChip} />
                {Boolean(chipState.length) && (
                  <Grid container spacing={2} style={{ padding: "5px" }}>
                    {chipState &&
                      chipState.map((chipData, i) => {
                        return (
                          <Chip
                            icon
                            label={`${chipData.key} : ${chipData.value}`}
                            key={i}
                            size="small"
                            clickable
                            style={{ margin: "3px 0px 5px 3px" }}
                            onDelete={() => {
                              handleChipDelete(i, chipData.key, chipData.value);
                              // console.log(chipData.value, "chipdatavalue");
                            }}
                          // variant="outlined"
                          />
                        );
                      })}
                  </Grid>
                )}
              </div>

              <MaterialReactTable
                tableInstanceRef={tableInstanceRef}
                data={rowData}
                manualPagination
                columns={columns}
                initialState={{
                  density: "compact",
                }}
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
                state={{
                  columnVisibility,
                }}
                enableTopToolbar={false}
                enableBottomToolbar={false}
                enableColumnResizing
                enableStickyHeader
                enableFilters={false}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                muiTableBodyRowProps={({ row, staticRowIndex }) => ({
                  onDoubleClick: () => {
                    handleClick(row?.original);
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
                    border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                    height: "61vh",
                  },
                  id: "mrt-cab-int",
                })}
                muiTablePaperProps={() => ({
                  sx: {
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
              <PaginationComp2
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                pageSize={pageSize}
                setPageSize={setPageSize}
                pageSizes={[5, 10, 15]}
                totalCount={totalCount}
                searchParamsSetter={handleSearchParams}
              />
            </div>
          </div>
        </SplitterComponent>
      </Paper>

      {/* <Drawer
          className={classes.drawer}
          variant="persistent"
          anchor="right"
          open={openAdvance}
          classes={{
            paper: !openAdvance
              ? classes.drawerPaperNotOpen
              : classes.drawerPaperOpen,
          }}
        >
          <AdvanceSeach
            handleOpenAdvance={handleOpenAdvance}
            loadAdvanceSearchTable={loadAdvanceSearchTable}
          />
        </Drawer> */}
      {/* <Dialog
          open={openAdvance}
          onClose={() => setOpenAdvance(false)}
          maxWidth="md"
          fullWidth
          classes={{
            paper: classes.dialog_paper,
          }}
        >
          <DialogContent>
            <AdvanceSeach
              handleOpenAdvance={handleOpenAdvance}
              loadAdvanceSearchTable={loadAdvanceSearchTable}
            />
          </DialogContent>
        </Dialog> */}

      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        open={openAdvance}
        // onClose={handleClosemenu}
        onClose={() => setOpenAdvance(false)}
        MenuListProps={{
          "aria-labelledby": "lock-button",
          role: "listbox",
        }}
        className={classes.dialog_paper}
        PaperProps={{
          style: {
            width: "55vw",
          },
        }}
      >
        <AdvanceSeach
          handleOpenAdvance={handleOpenAdvance}
          loadAdvanceSearchTable={loadAdvanceSearchTable}
          scope={"internal"}
        />
      </Menu>

      <Custodian
        cabinetFile={selectedRow}
        open={openCustodian}
        handleClose={handleCustodian}
      />
      <CreateVolumeFile
        cabinetFile={selectedRow}
        open={createVolume}
        handleClose={handleCreateVol}
      />
      <ConfirmationDialog
        cabinetFile={selectedRow}
        open={openDialog}
        handleClose={handleDialog}
      />
      <CreateFile
        cabinetFile={selectedRow}
        open={createFile}
        handleClose={openFileCreate}
        handleTrigger={handleTrigger}
      />

      <IndexFileForm
        open={openIndex}
        handleForm={handleForm}
        handleTrigger={handleTrigger}
        handleSelect={() => { }}
      />

      <CreatePC
        open={openPc}
        handleClose={handlePC}
        handleTrigger={handleTrigger}
        handleClick={handleClick}
      />

      <Dialog
        open={del}
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
          {t("delete_file")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={() => setDel(false)}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <h6>Are you sure you want to delete this file ?</h6>
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

      <BarcodeView
        open={barcodeOpen}
        data={rowItem}
        handleBarcodeClose={handlePopupClose}
      />
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    myInfo: state.myInfo,
    subscribeApi: state.subscribeApi,
  };
}
export default connect(mapStateToProps, {
  getCabinaetData,
  getCabinet,
  changingTableStateCabinet,
  getAdvanceSearch,
  loadAdvanceSearch,
  getIndexData,
  deleteFile,
  editFile,
})(CabinetTable);
