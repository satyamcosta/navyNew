import React, { useEffect, useMemo, useRef, useState } from "react";
import Paper from "@material-ui/core/Paper/Paper";
import {
  Fab,
  makeStyles,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
  Typography,
  IconButton,
  TableHead,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Menu,
  MenuItem,
} from "@material-ui/core";
import {
  loadPFData,
  getIndexFiles,
  getDraftFiles,
  editFile,
  deleteFile,
} from "../../camunda_redux/redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import history from "../../../history";
import { changingTableState } from "../../camunda_redux/redux/action/apiTriggers";
import { setRefresh1 } from "../../redux/actions/Refresh1Actions";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import "./therme-source/material-ui/loading.css";
import AddIcon from "@material-ui/icons/Add";
import PaginationComp from "../utilities/PaginationComp";
import GenericSearch from "../utilities/GenericSearch";
import GenericFilterMenu from "../utilities/GenericFilterMenu";
import { unstable_batchedUpdates } from "react-dom";
import GenericChip from "../utilities/GenericChips";
import _ from "lodash";
import { FiEdit2 } from "react-icons/fi";
import {
  MRT_ShowHideColumnsButton,
  MaterialReactTable,
} from "material-react-table";
import IndexFileForm from "../Correspondence/IndexFileForm";
import GenericColHider from "../utilities/GenericColHider";
import { INDEX_COLUMNS_STATUS } from "app/camunda_redux/redux/constants/ActionTypes";
import { FaBarcode } from "react-icons/fa";
import { Cancel, Delete, Edit } from "@material-ui/icons";
import BarcodeView from "../Cabinet/folder/BarcodeView";
import CreatePC from "../Cabinet/folder/CreatePC";
import Draggable from "react-draggable";
import CreateFile from "../Cabinet/folder/CreateFile";
import Eric from "../Cabinet/folder/Eric";
import GenericRefresh from "../utilities/GenericRefresh";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: "350px",
  },
}));

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
    value: "displayFileName",
    label: "File Name",
  },
  // {
  //   value: "status",
  //   label: "Status",
  // },
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
];

const FilterOption3 = [
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
    label: "FILE #",
  },
  {
    value: "range",
    label: "Date Range",
  },
];

const StatusOption = ["In Progress", "Approved", "Draft", "Rejected", "Return"];

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

const FilterTypes3 = {
  type: "select",
  optionValue: FilterOption3,
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
    name: "displayFileName",
    type: "text",
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
];

const FilterValueTypes3 = [
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
    name: "displayFileName",
    type: "text",
    size: "small",
    variant: "outlined",
    label: "File Name",
    color: "primary",
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

const SortValueTypes2 = [
  {
    name: "subject",
    type: "text",
    size: "small",
    variant: "outlined",
    label: "Subject",
    color: "primary",
  },
];

const SortValueTypes3 = [
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
    label: "Date",
  },
];

const PersonalFileTable = (props) => {
  const tableInstanceRef = useRef(null);

  const { t } = useTranslation();
  //Initialization of state variables
  const dispatch = useDispatch();
  const [rowData, setRowData] = useState([]);
  const username = localStorage.getItem("username");
  const department = sessionStorage.getItem("department");
  const role = sessionStorage.getItem("role");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});

  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const [edit, setEdit] = useState(false);
  const [barcodeOpen, setBarcodeOpen] = useState(false);
  const [rowItem, setrowItem] = useState("");
  const [sub, setSub] = useState("");
  const [createFile, setcreateFile] = useState(false);

  const [del, setDel] = useState(false);

  const [openPc, setOpenPc] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [createEric, setCreateEric] = useState(false);
  const [checkedRows, setCheckedRows] = useState({}); // For handling mrt table selected row state
  const [selectedRowDataIds, setSelectedRowDataIds] = useState([])//set the row id of selected rows 

  const handlePC = (val) => setOpenPc(val);
  const openFileCreate = () => {
    setcreateFile(!createFile);
  };

  const handleEric = (val) => setCreateEric(val);

  const handleCreateEric = () => {
    dispatch(setSnackbar(true, "success", t("create_eric_suc")));
    setCreateEric(false);
  };

  const { indexHiddenColumns } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );

  let indexCol = {
    subject: true,
    typeOfFile: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    indexHiddenColumns || indexCol
  );

  const handleForm = (val) => setOpen(val);
  const handleTrigger = () => setTrigger(!trigger);

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

  const deleteSelectedFileHandler = () => {
    
    console.log("getting deleted in pa file",selectedRowDataIds)
    handleDelete()
  }


  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  const addSort = (sortObj) => {
    // console.log(sortObj);
    setSortBy(sortObj);
  };

  const classes = useStyles();

  const handlePopupClose = () => {
    setBarcodeOpen(false);
  };

  const handleEdit = () => {
    props.blnEnableLoader(true);
    let formData = new FormData();
    formData.append("fileName", rowItem?.file);
    formData.append("subject", sub);
    props
      .editFile(formData)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            console.log(resp);
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

  const handleDelete = () => {
    props.blnEnableLoader(true);

    props
      .deleteFile(rowItem?.file)
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
            dispatch(
              setSnackbar(true, "success", "FILE HAS BEEN DELETED SUCCESSFULLY")
            );
            setRowData(newArr);
            setDel(false);
            setTotalCount(totalCount - 1);
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

  const handleClick = (rowItem) => {
    // mtd that has been triggered while row clicks
    if (props.correspondence && rowItem) {
      Cookies.set("paFileId", rowItem.id);
      Cookies.set("paFileName", rowItem.file);
      Cookies.set("isCorr", true);
      Cookies.set("index", true);
      history.push({
        pathname: "/eoffice/personnel/fileview",
        state: {
          from: "indexFile",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
        },
      });
    } else if (props.file && rowItem) {
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
      if (rowItem.status == "Draft") {
        Cookies.set("isDraft", true);
        Cookies.set("isIndex", false);
        Cookies.set("isCabinet", false);
        Cookies.set("isInitiate", true);
        sessionStorage.setItem("partcaseID", rowItem?.partCase);

        // 2. When file in cabinet is the index file
      }

      Cookies.set("backPath", "/eoffice/correspondence/file");

      history.push({
        pathname: "/eoffice/splitView/file",
        state: {
          from: "cabinet",
          data: rowItem.subject,
          rowData,
          fileNo: rowItem.serialNo,
          searchText: "",
          routeQueryParams: location.search,
        },
      });
    } else if (rowItem !== undefined && rowItem !== "") {
      Cookies.set("paFileId", rowItem.id);
      Cookies.set("paFileName", rowItem.displayFileName);
      history.push({
        pathname: "/eoffice/personnel/fileview",
        state: {
          from: "indexFile",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
        },
      });
    } else {
      const errorMessage = t("failed_to_load,_kindly_refresh_the_page!");
      callMessageOut(errorMessage);
    }
  };
  const { blnValuePF } = props.subscribeApi; // redux trigger that helps in refreshing table
  useEffect(() => {
    if (Object.keys(checkedRows).length > 0) {
      setCheckedRows({});
    }
    let indexAbort = new AbortController();
    loadPFTableData(indexAbort.signal);
  }, [
    blnValuePF,
    trigger,
    currentPage,
    pageSize,
    Filter,
    SortBy,
    props.fileSubjectReducer,
  ]);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-pf");
    adjustableDiv.style.height = viewportHeight - 175 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  useEffect(() => {
   
    if (tableInstanceRef.current) {
    
      const rows = tableInstanceRef.current
        ?.getSelectedRowModel()
        .flatRows.map((row) => row.original?.id);
      setSelectedRowDataIds(rows);
    }
  }, [checkedRows, tableInstanceRef]);

  const loadPFTableData = (abortSignal) => {
    setRowData([]);
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
    // console.log(filter);
    props.blnEnableLoader(true);
    if (props.correspondence) {
      let corrSort;
      if (SortBy?.title) {
        corrSort = {
          sortByField: SortBy.title.name,
          asc: SortBy?.type == "Asc" ? true : false,
        };
      }
      props
        .getIndexFiles(
          pageSize,
          currentPage,
          _.isEmpty(filter) ? {} : filter,
          _.isEmpty(corrSort) ? {} : corrSort,
          abortSignal
        )
        .then((resp) => {
          let tmpArr = [];
          try {
            if (resp?.response?.error) {
              callMessageOut(resp?.response?.error);
              props.blnEnableLoader(false);
            } else {
              if (resp.response !== undefined) {
                tmpArr = resp.response?.content?.map((item, index) => {
                  return {
                    ...item,
                    serialNo: pageSize * currentPage + (index + 1),
                  };
                });
                setRowData(tmpArr);
                setTotalCount(resp.response?.totalElements);
                props.blnEnableLoader(false);
              } else {
                const errorMessage =
                  resp.status + " : " + resp.error + " AT " + resp.path;
                callMessageOut(errorMessage);
                props.blnEnableLoader(false);
              }
              props.changingTableState(false, "CHANGE_PA_FILE"); // setting trigger to false as table got updated
              props.setRefresh1(false);
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
    } else if (props.file) {
      let fileSort;
      if (SortBy?.title) {
        fileSort = {
          sortByField: SortBy.title.name,
          asc: SortBy?.type == "Asc" ? true : false,
        };
      }
      props
        .getDraftFiles(
          role,
          department,
          _.isEmpty(filter) ? {} : filter,
          _.isEmpty(fileSort) ? {} : fileSort,
          pageSize,
          currentPage,
          abortSignal
        )
        .then((resp) => {
          console.log(resp);
          if (resp?.error?.includes("aborted")) {
            return;
          }
          let tmpArr = [];
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          }
          try {
            tmpArr = resp?.response?.content?.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });
            setRowData(tmpArr);
            setTotalCount(resp?.response?.totalElements);
            // setCurrentPage(pageNumber);
            // setCurrentPage(0);
            // setPageSize(10);
            // pageNumber !== 0 ? setCurrentPage(pageNumber) : setCurrentPage(0);

            // props.changingTableStateCabinet(false, "CHANGE_CABINET");
            props.blnEnableLoader(false);
          } catch (error) {
            callMessageOut(error.message);
            props.blnEnableLoader(false);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
          props.blnEnableLoader(false);
        });
    } else {
      props
        .loadPFData(username, role, pageSize, currentPage, {
          filter: _.isEmpty(filter) ? null : filter,
          sort: _.isEmpty(sort) ? null : sort,
          abortSignal,
        })
        .then((resp) => {
          let tmpArr = [];
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              props.blnEnableLoader(false);
            } else {
              if (resp.data !== undefined) {
                tmpArr = resp.data.map((item, index) => {
                  return {
                    ...item,
                    serialNo: pageSize * currentPage + (index + 1),
                  };
                });
                setRowData(tmpArr);
                setTotalCount(resp.length != null ? resp.length : 0);
                props.blnEnableLoader(false);
              } else {
                const errorMessage =
                  resp.status + " : " + resp.error + " AT " + resp.path;
                callMessageOut(errorMessage);
                props.blnEnableLoader(false);
              }
              props.changingTableState(false, "CHANGE_PA_FILE"); // setting trigger to false as table got updated
              props.setRefresh1(false);
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

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClick2 = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 230,
        Cell: ({ cell }) => (
          <span className="text-m mrt-text">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "displayFileName",
        header: t("file_name"),
        size: 150,
        Cell: ({ cell }) => (
          <span className="text-m mrt-text">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 60,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <>
              <div>
                <Tooltip title={t("edit_subject")} aria-label="Edit Subject">
                  <button
                    id="pFile_edit_button"
                    onClick={(e) => {
                      e.stopPropagation();
                      props.handleUpdateSubject(row);
                    }}
                  >
                    <FiEdit2 />
                  </button>
                </Tooltip>
              </div>
            </>
          );
        },
      },
    ],
    [rowData, Cookies.get("i18next"), t]
  );

  const columns1 = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 210,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <div className="text-m text-b mrt-text" style={{
              color: props.theme ? "#429cff" : "#1a0dab"
            }}>{row?.pcSubject || row?.subject}</div>
          );
        },
      },
      {
        accessorKey: "file",
        header: t("old_file"),
        size: 120,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <div className="mrt-text">{row?.pcFileNumber || row?.file}</div>
          );
        },
      },

      {
        accessorKey: "status",
        header: t("status"),
        size: 100,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return <div className="mrt-text">{row?.status}</div>;
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
                <span className="mrt-text">
                  {row?.fcreatedOnTime || row?.createdOn}
                </span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 100,
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

  const columns2 = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 230,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.subject}>
              <span className="text-m">{cell.getValue()}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "typeOfFile",
        header: t("typeOfFile"),
        size: 150,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.typeOfFile}>
              <span className="text-m">{cell.getValue()}</span>
            </Tooltip>
          );
        },
      },
    ],
    [rowData, Cookies.get("i18next"), t]
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="mrt-head">
        <span>{t("draft_file")}</span>
      </div>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
          // border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
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
                FilterTypes={
                  props.correspondence
                    ? FilterTypes2
                    : props.file
                      ? FilterTypes3
                      : FilterTypes
                }
                FilterValueTypes={
                  props.correspondence
                    ? FilterValueTypes2
                    : props.file
                      ? FilterValueTypes3
                      : FilterValueTypes
                }
                addFilter={addFilter}
                cssCls={{}}
              />
              <div>
                <GenericRefresh handleRefresh={() => setTrigger(!trigger)} />
                <Tooltip title="Delete" style={{
                  display: selectedRowDataIds.length == 0 ? "none" : ""
                }}>
                  <span>
                  <IconButton
                    onClick={deleteSelectedFileHandler}
                    // disabled={selectedRowDataIds.length <= 0}
                    size="small"
                    aria-label="previous-app"
                  >
                    <Delete color="Black" />
                  </IconButton>
                  </span>
                </Tooltip>

                <GenericFilterMenu
                  SortValueTypes={
                    props.correspondence
                      ? SortValueTypes2
                      : props.file
                        ? SortValueTypes3
                        : SortValueTypes
                  }
                  addSort={addSort}
                  sort={SortBy}
                />

              </div>
              <GenericColHider
                tableCols={columnVisibility}
                setTableCols={setColumnVisibility}
                moduleName={INDEX_COLUMNS_STATUS}
              />
              <div className="PaIconCon">
                <span>
                  <Fab
                    disabled={!props.myInfo}
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                    onClick={(e) => {
                      props.correspondence
                        ? setOpen(true)
                        : props.file
                          ? handleClick2(e)
                          : props.handleClick();
                    }}
                  >
                    <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
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
                    <MenuItem onClick={() => openFileCreate(true)}>
                      {t("crt_file")}
                    </MenuItem>

                    <MenuItem onClick={() => handlePC(true)}>
                      {t("create_part_case_file")}
                    </MenuItem>

                    <MenuItem onClick={() => handleEric(true)}>
                      {t("schedule")}
                    </MenuItem>
                  </Menu>
                </span>
              </div>
            </div>
            <GenericChip Filter={Filter} deleteChip={deleteChip} />
          </div>

          <MaterialReactTable
            tableInstanceRef={tableInstanceRef}
            data={rowData}
            manualPagination
            columns={
              props.correspondence ? columns2 : props.file ? columns1 : columns
            }
            initialState={{
              density: "compact",
            }}
            state={{
              // rowSelection: checkedRows,
              columnVisibility,
            }}
            // onRowSelectionChange={setCheckedRows}
            displayColumnDefOptions={{
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
              id: "mrt-pf",
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
          pageSizes={pageSizes}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalCount={totalCount}
          setPageSize={setPageSize}
        />

        <CreateFile
          open={createFile}
          handleClose={openFileCreate}
          handleTrigger={handleTrigger}
        />

        <IndexFileForm
          open={open}
          handleForm={handleForm}
          handleTrigger={handleTrigger}
          handleSelect={() => { }}
        />

        <BarcodeView
          open={barcodeOpen}
          data={rowItem}
          handleBarcodeClose={handlePopupClose}
        />

        <CreatePC
          open={openPc}
          handleClose={handlePC}
          handleTrigger={handleTrigger}
          handleClick={handleClick}
        />

        <Eric
          open={createEric}
          handleClose={handleEric}
          handleEric={handleCreateEric}
          ericType={""}
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
      </Paper>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    refreshing: state.refreshing,
    theme: state.theme,
    myInfo: state.myInfo,
    fileSubjectReducer: state.fileSubjectReducer,
  };
}

export default connect(mapStateToProps, {
  setRefresh1,
  loadPFData,
  changingTableState,
  getIndexFiles,
  getDraftFiles,
  editFile,
  deleteFile,
})(PersonalFileTable);
