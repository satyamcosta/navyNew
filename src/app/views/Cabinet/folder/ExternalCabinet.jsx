import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { Breadcrumb } from "../../../../matx";
import { useHistory, useLocation } from "react-router-dom";
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
  TableCell,
  Button,
  Divider,
  Menu,
  Accordion,
  AccordionSummary,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import {
  getexternalcabinet,
  getAdvanceSearch,
  loadAdvanceSearch,
} from "../../../camunda_redux/redux/action/index";
import { changingTableStateCabinet } from "../../../camunda_redux/redux/action/apiTriggers";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
// import history from "../../../../history";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";
import { DataUtil } from "@syncfusion/ej2-data";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericChip from "app/views/utilities/GenericChips";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import NoteAddOutlinedIcon from "@material-ui/icons/NoteAddOutlined";
import { unstable_batchedUpdates } from "react-dom";
import axios from "axios";
import SystemUpdateAltTwoToneIcon from "@material-ui/icons/SystemUpdateAltTwoTone";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import AssessmentIcon from "@material-ui/icons/Assessment";
import FormControl from "@material-ui/core/FormControl";
import { makeStyles } from "@material-ui/core/styles";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import * as yup from "yup";
import MultipleSelect from "./MultipleSelect";
import ConfirmationDialog from "./ConfirmationDialog";
import { clearCookie } from "utils";
import { AdvanceSearchContext } from "../advanceSeach/AdvanceContext";
import AdvanceSeach from "../advanceSeach";
import { ExpandMore } from "@material-ui/icons";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import GenericColHider from "app/views/utilities/GenericColHider";
import { EXT_CABINET_COLUMNS_STATUS } from "app/camunda_redux/redux/constants/ActionTypes";
import PaginationComp2 from "app/views/utilities/PaginationComp2";
import _ from "lodash";
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
}));

const CabinetTable = (props) => {
  const { t } = useTranslation();
  const tableInstanceRef = useRef(null);
  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const paramPage = searchParams.get("page");
  const paramSize = searchParams.get("pageSize");
  const paramFilter = searchParams.get("filter");

  const [currentPage, setCurrentPage] = useState(Number(paramPage) || 1);
  const [pageSize, setPageSize] = useState(Number(paramSize) || 25);
  const [Filter, setFilter] = useState(
    JSON.parse(decodeURIComponent(paramFilter)) || {}
  );
  const [SortBy, setSortBy] = useState({});
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const { blnValueCabinet } = props.subscribeApi;
  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");
  const department = sessionStorage.getItem("parent-dir") || sessionStorage.getItem("department");
  const username = localStorage.getItem("username");
  const [selectedRow, setSelectedRow] = useState(null);
  const [open, setOpen] = React.useState(false);
  const [openCustodian, setOpenCustodian] = React.useState(false);
  const [value, setValue] = React.useState(1);
  const [financialYear, setFinancialYear] = React.useState(2021);
  const [classificationValue, setClassificationValue] = React.useState(null);
  const [financialYearValue, setFinancialYearValue] = React.useState(null);
  const [subSectionValue, setSubSectionValue] = useState(null);
  const [custodianValue, setCustodianValue] = useState(null);
  const [anchorEl, setanchorEl] = useState(null);
  const [navData, setNavData] = useState(null);
  const [openAdvance, setOpenAdvance] = useState(false);

  const [trigger, setTrigger] = useState(false);

  const { extcabHiddenColumns } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );

  let extCabCol = {
    residingWith: true,
    oldFile: true,
    subject: true,
    custodian: true,
    createdOn: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    extcabHiddenColumns || extCabCol
  );

  let cabinetId = Cookies.get("cabinetId");

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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpenManageCustodian = () => {
    setOpenCustodian(true);
  };

  const handleClickCloseManageCustodian = () => {
    setOpenCustodian(false);
  };

  const handleOpenAdvance = () => {
    setOpenAdvance(!openAdvance);
  };

  const classes = useStyles();

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubSectionChange = (event, newValue) => {
    setSubSectionValue(newValue);
  };

  const handleCustodianChange = (event, newValue) => {
    setCustodianValue(newValue);
  };

  const handleClassificationChange = (event, newValue) => {
    setClassificationValue(newValue);
  };

  const handleFinancialYearChange = (event, newValue) => {
    setFinancialYearValue(newValue);
  };

  const [openDialog, setOpenDialog] = useState(false);

  const handleConfirmationDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmDialog = () => {
    setOpenDialog(false);
  };

  const subSectionOptions = [
    { title: "Option 1" },
    { title: "Option 2" },
    { title: "Option 3" },
  ];

  const custodianOptions = [
    { title: "Custodian 1" },
    { title: "Custodian 2" },
    { title: "Custodian 3" },
  ];

  const API_URLA = "https://mocki.io/v1/7af3523c-b1e6-49a6-a2f6-8b0c7a1ead80";
  const handleVolumeFile = async (e) => {
    e.stopPropagation();
    try {
      const response = await axios.get(API_URLA);
      const data = response.data;
      data.id = false;
      await axios.get(API_URLA, data);
    } catch (error) {
      console.error(error);
    }
  };

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    // {
    //   value: "advance",
    //   label: "Advance Search",
    // },
    // {
    //   value: "oldFile",
    //   label: "Old File",
    // },
    {
      value: "subject",
      label: "Subject",
    },
    // {
    //   value: "status",
    //   label: "Status",
    // },
    // {
    //   value: "caseNumber",
    //   label: "Case Number",
    // },
    // {
    //   value: "createdOn",
    //   label: "Created On",
    // },
    {
      value: "range",
      label: "Date Range",
    },
  ];
  const StatusOption = [
    "In Progress",
    "Approved",
    "Draft",
    "Rejected",
    "Return",
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
    // {
    //   name: "advance",
    //   type: "auto",
    //   size: "small",
    //   variant: "outlined",
    //   label: "Value",
    //   color: "primary",
    // },
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
    // {
    //   name: "caseNumber",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   color: "primary",
    // },
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

    // {
    //   name: "status",
    //   type: "select",
    //   optionValue: StatusOption,
    //   size: "small",
    //   variant: "outlined",
    //   label: "Value",
    //   color: "primary",
    // },
  ];

  const SortValueTypes = [
    // {
    //   name: "oldFile",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   label: "Old FileName",
    //   color: "primary",
    // },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    // {
    //   name: "caseNumber",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   color: "primary",
    //   label: "Case Number",
    // },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "CreatedOn",
    },
    // {
    //   name: "status",
    //   type: "select",
    //   optionValue: StatusOption,
    //   size: "small",
    //   variant: "outlined",
    //   label: "Status",
    //   color: "primary",
    // },
  ];

  const [apiObj, setapiObj] = useState({
    barCreated: "",
    barDocumenttype: "",
  });

  const [chipState, setchipState] = useState([]);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-cab-ext");
    adjustableDiv.style.height = viewportHeight - 198 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

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

  const { mount } = useSelector((state) => state.refreshings);

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 200,
        Cell: ({ cell }) => <div className="text-m text-b mrt-text" style={{
          color: props.theme ? "#429cff" : "#1a0dab"
        }}>{cell.getValue()}</div>,
      },
      {
        accessorKey: "residingWith",
        header: t("residing_with"),
        size: 80,
        Cell: ({ cell }) => <div>{cell.getValue()}</div>,
      },
      {
        accessorKey: "file",
        header: t("old_file"),
        size: 80,
        Cell: ({ cell }) => <div>{cell.getValue()}</div>,
      },
      // {
      //   accessorKey: "custodian",
      //   header: t("custodian"),
      //   size: 150,
      //   Cell: ({ cell }) => {
      //     let custodianStr = cell
      //       .getValue()
      //       ?.reduce(
      //         (a, c, i) =>
      //           (a = a.concat(
      //             `${c}${i + 1 === cell.getValue()?.length ? "" : ", "}`
      //           )),
      //         ""
      //       );

      //     return (
      //       <div className="text-overflow">
      //         <Tooltip title={custodianStr}>
      //           <span className="mrt-text">{custodianStr}</span>
      //         </Tooltip>
      //       </div>
      //     );
      //   },
      // },
      {
        accessorKey: "createdOn",
        header: t("created_on"),
        size: 80,
        Cell: ({ cell }) => (
          <div className="text-overflow">
            <Tooltip title={cell.getValue()?.split(" ")[0]}>
              <span>{cell.getValue()?.split(" ")[0]}</span>
            </Tooltip>
          </div>
        ),
      },
    ],
    [rowData, props.theme, t]
  );

  // implement pagination
  // useEffect(() => {
  //   let start = currentPage * pageSize;
  //   let end = (currentPage + 1) * pageSize;
  //   let tempArr = rowData.data?.slice(start, end);
  //   setRows(tempArr);
  // }, [rowData, pageSize, currentPage]);

  useEffect(() => {
    let cabinetAbort = new AbortController();
    // if (!text && !sendBy && !createdBy && !fileNo && !subject && !status) {
    //   loadCabinateData(cabinetAbort.signal);
    // }
    loadCabinateData(cabinetAbort.signal);

    return () => {
      cabinetAbort.abort();
    };
  }, [blnValueCabinet, Filter, SortBy, mount, pageSize, currentPage, trigger]);

  useEffect(() => {
    sessionStorage.removeItem("route");
    clearCookie();
  }, []);

  useEffect(() => {
    loadAdvanceSearchTable();
  }, [apiObj.barCreated, apiObj.barDocumenttype, currentPage, pageSize]);

  const loadCabinateData = (abortSignal) => {
    props.handleLoading(true);
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
    props
      .getexternalcabinet(
        department,
        pageSize,
        currentPage - 1,
        abortSignal,
        _.isEmpty(filter) ? {} : filter,
        _.isEmpty(sort) ? {} : sort
      )
      .then((resp) => {
        if (resp?.error?.includes("aborted")) {
          return;
        }
        if (resp.error) {
          callMessageOut(resp.error);
          props.handleLoading(false);
          return;
        }
        try {
          let tmpArr = resp.data.map((item, index) => {
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

  // const handleClick = (rowItem) => {
  //   sessionStorage.setItem("InboxID", rowItem.id);
  //   sessionStorage.setItem("pa_id", rowItem.personalApplicationInventoryId);
  //   Cookies.set("inboxFile", rowItem.subject);
  //   Cookies.set("priority", rowItem.priority);
  //   Cookies.set("isCabinet", true);
  //   Cookies.set("cabinetStatus", rowItem.status);
  //   Cookies.set("cabinetpartcase", rowItem.partcaseId);
  //   Cookies.set("referenceNumber", rowItem.referenceNumber);
  //   Cookies.set("type", rowItem.type);
  //   Cookies.set("partCase", true);
  //   Cookies.set("enc", rowItem.encNo);
  //   Cookies.set("not", rowItem.notingNo);
  //   Cookies.set("backPath", "/eoffice/cabinet/file");
  //   if (rowItem.encNo) {
  //     Cookies.set("searchEnc", text);
  //   }
  //   if (rowItem.notingNo) {
  //     Cookies.set("searchNoting", text);
  //   }
  //   history.push({
  //     pathname: "/eoffice/splitView/file",
  //     state: {
  //       from: "cabinet",
  //       data: rowItem.subject,
  //       rowData,
  //       fileNo: rowItem.serialNo,
  //     },
  //   });
  // };

  const handleClick = (rowData) => {
    sessionStorage.setItem("InboxID", rowData.id);
    sessionStorage.setItem("pa_id", rowData.personalApplicationInventoryId);
    Cookies.set("inboxFile", rowData.subject);
    Cookies.set("priority", rowData.priority);
    Cookies.set("isCabinet", true);
    Cookies.set("cabinetStatus", rowData.status);
    Cookies.set("cabinetpartcase", rowData.partcaseId);
    Cookies.set("referenceNumber", rowData.referenceNumber);
    Cookies.set("type", rowData.type);
    Cookies.set("partCase", true);
    Cookies.set("classification", rowData.typeOfFile);
    Cookies.set("enc", rowData.encNo);
    Cookies.set("not", rowData.notingNo);
    Cookies.set("backPath", "/eoffice/cabinet/file");

    // Cookies to know file opening from external cabinet
    Cookies.set("external", true)

    if (rowData.encNo) {
      Cookies.set("searchEnc", text);
    }
    if (rowData.notingNo) {
      Cookies.set("searchNoting", text);
    }
    history.push({
      pathname: "/eoffice/splitView/file",
      state: { subject: rowData.subject, routeQueryParams: location.search },
    });
  };
  const { text, sendBy, createdBy, fileNo, subject, status, scope } =
    useContext(AdvanceSearchContext);

  const loadAdvanceSearchTable = (val) => {
    const filter = chipState[0]?.value || "";
    if (val || text || sendBy || createdBy || fileNo || subject || status) {
      props
        .loadAdvanceSearch(
          val,
          text,
          role,
          pageSize,
          currentPage - 1,
          username,
          department,
          "",
          filter,
          fileNo,
          sendBy,
          createdBy,
          subject,
          status,
          "external"
        )
        .then(({ response }) => {
          let tempArr = [];
          for (let i = 0; i < response.dataTest.length; i++) {
            let obj = response.dataTest[i];
            tempArr.push({
              residingWith: obj.cabResidingWith,
              oldFile: obj.caboldFile,
              subject: obj.cabSubject,
              status: obj.cabStatus,
              createdOn: obj.fcreatedOnTime,
              custodian: [],
              partcaseId: obj.partcaseId,
            });
          }
          setNavData(response.navData);
          setRowData(tempArr);
          setTotalCount(tempArr.length);
        });
    }
  };

  const validationSchema = yup.object({
    subject: yup.string().required("Please enter your feedback"),
  });

  const formik = useFormik({
    initialValues: {
      subject: "",
    },

    validationSchema: validationSchema,
    onSubmit: (value) => {
      handleVolumeFile(value);
    },
  });

  const handleChipAndPopulate = (Heading, subHeading) => {
    // console.log(Heading, subHeading);
    handleChipState(Heading, subHeading);
    handledata(Heading, subHeading);
    setCurrentPage(1);
  };

  const handleChipState = (Heading, subHeading) => {
    setchipState([
      ...chipState,
      {
        key: Heading,
        value: subHeading,
      },
    ]);
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

  return (
    <>
      <Grid container>
        <Grid>
          <Paper
            style={{
              width: "100%",
              borderRadius: "9px",
              border: "1px solid #c7c7c7",
              marginRight: "1rem",
            }}
          >
            <Grid container spacing={2} style={{ padding: "0 1rem" }}>
              {navData && (
                <Grid item xs={3}>
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
                          return (
                            <MenuItem
                              key={i}
                              onClick={(e) => {
                                handleChipAndPopulate(childObj, innerChild);
                              }}
                            >{`${innerChild} ( ${navData[childObj][innerChild]} )`}</MenuItem>
                          );
                        })}
                      </Accordion>
                    );
                  })}
                </Grid>
              )}
              <Grid item xs={navData ? 9 : 12}>
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
                        scope={"external"}
                      />
                      {/* <div>
          <GenericFilterMenu
            FilterValueTypes={SortValueTypes}
            addSort={addSort}
          />
        </div> */}
                      <GenericRefresh
                        handleRefresh={() => setTrigger(!trigger)}
                      />
                      <GenericColHider
                        tableCols={columnVisibility}
                        setTableCols={setColumnVisibility}
                        moduleName={EXT_CABINET_COLUMNS_STATUS}
                      />
                    </div>
                    <GenericChip Filter={Filter} deleteChip={deleteChip} />
                    {Boolean(chipState.length) && (
                      <Grid container spacing={2} style={{ padding: "10px" }}>
                        {chipState &&
                          chipState.map((chipData, i) => {
                            return (
                              <Chip
                                icon
                                label={`${chipData.key} : ${chipData.value}`}
                                key={i}
                                clickable
                                style={{ margin: "3px 0px 5px 3px" }}
                                onDelete={() => {
                                  handleChipDelete(
                                    i,
                                    chipData.key,
                                    chipData.value
                                  );
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
                      onClick: () => {
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
                        border: "1px solid #8080802b",
                        height: "63vh",
                      },
                      id: "mrt-cab-ext",
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
                </div>
              </Grid>
            </Grid>
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
        </Grid>
        <Menu
          id="lock-menu"
          anchorEl={anchorEl}
          open={openAdvance}
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
            scope={"external"}
          />
        </Menu>
      </Grid>
      <form onSubmit={formik.handleSubmit}>
        <Dialog
          className="createVolumeForm"
          open={open}
          onClose={handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="md"
          fullWidth={true}
        >
          <DialogTitle className="CreateTitle" id="form-dialog-title">
            CREATE VOLUME FILE
          </DialogTitle>
          <DialogContent>
            <Divider />
            <Grid className="formStyle" item xs={12}>
              <Grid container>
                <TextField
                  id="subject"
                  label="SUBJECT"
                  variant="outlined"
                  className="Subjectclass"
                  name="subject"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="mainHead"
                    label="MAIN HEAD"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="classification-autocomplete"
                    size="small"
                    className="SubjectclassTwo"
                    options={["CLASSIFIED", "UNCLASSIFIED"]}
                    getOptionLabel={(option) => option}
                    value={classificationValue}
                    onChange={handleClassificationChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Classification" />
                    )}
                  />
                </Grid>
                <Grid item xs={3}>
                  <Autocomplete
                    id="financial-year-autocomplete"
                    className="SubjectclassThree"
                    size="small"
                    options={[
                      "2020-2021",
                      "2022-2023",
                      "2023-2024",
                      "2024-2025",
                      "2025-2026",
                    ]}
                    getOptionLabel={(option) => option}
                    value={financialYearValue}
                    onChange={handleFinancialYearChange}
                    renderInput={(params) => (
                      <TextField {...params} label="Financial Year" />
                    )}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="subHead"
                    label="SUB HEAD"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={3}>
                  <FormControl className="Subjectclass">
                    <Autocomplete
                      id="subSection-autocomplete"
                      size="small"
                      className="SubjectclassTwo"
                      options={subSectionOptions}
                      getOptionLabel={(option) => option.title}
                      value={subSectionValue}
                      onChange={handleSubSectionChange}
                      renderInput={(params) => (
                        <TextField {...params} label="SubSection" />
                      )}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl className="Subjectclass">
                    <Autocomplete
                      id="custodian-autocomplete"
                      size="small"
                      className="SubjectclassThree"
                      options={custodianOptions}
                      getOptionLabel={(option) => option.title}
                      value={custodianValue}
                      onChange={handleCustodianChange}
                      renderInput={(params) => (
                        <TextField {...params} label="Custodian" />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="connectedFiles"
                    label="CONNECTED FILES"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    id="volume"
                    label="VOLUME"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="caseNumber"
                    label="CASE NUMBER"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="oldFileRefrence"
                    label="OLD FILE REFRENCE"
                    variant="outlined"
                    className="Subjectclass"
                    size="small"
                  />
                </Grid>
              </Grid>
            </Grid>

            <Divider />
            <div className="DialogIcons">
              <Button className="CreateButton" onClick={handleVolumeFile}>
                CREATE
              </Button>
              <Button className="CabinetCancelButton" onClick={handleClose}>
                CANCEL
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </form>
      <div className="selectRolesForm">
        <Dialog
          className="selectRoles"
          open={openCustodian}
          onClose={handleClickCloseManageCustodian}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle className="CreateTitle" id="form-dialog-title">
            SELECT ROLES
          </DialogTitle>
          <DialogContent>
            <Divider />
            <Grid className="formStyle" item xs={12}>
              <Grid container>
                <MultipleSelect />
              </Grid>
              <Divider />
            </Grid>
            <div className="DialogIcons">
              <Button className="CreateButton">UPDATE</Button>
              <Button
                className="CabinetCancelButton"
                onClick={handleClickCloseManageCustodian}
              >
                CANCEL
              </Button>
            </div>
          </DialogContent>
          <Paper
            style={{
              maxHeight: "2vh",
              minHeight: "2vh",
              maxWidth: "60vh",
              minWidth: "60vh",
            }}
          />
        </Dialog>
      </div>
      <ConfirmationDialog open={openDialog} handleClose={handleCloseDialog} />
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    subscribeApi: state.subscribeApi,
  };
}
export default connect(mapStateToProps, {
  getexternalcabinet,
  changingTableStateCabinet,
  loadAdvanceSearch,
})(CabinetTable);
