import React, { useState, useEffect, useRef, useCallback } from "react";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import "../index.css";
import AddIcon from "@material-ui/icons/Add";
import { useTranslation } from "react-i18next";
import "react-tabs/style/react-tabs.css";
import PaginationComp from "app/views/utilities/PaginationComp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Workbook from "react-excel-workbook";
import Draggable from "react-draggable";
import "../../../Personnel/therme-source/material-ui/loading.css";

import { MdVisibility, MdRedo } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";

import RedoIcon from "@material-ui/icons/Redo";
import UpdateStatusTab from "./StatusUpdates/UpdateStatusTab";
import ViewDetailStatus from "../DetailsView/ViewDetailStatus";
import CheckIcon from "@material-ui/icons/Check";
import SyncIcon from "@material-ui/icons/Sync";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import { viewTaskDetails } from "app/camunda_redux/redux/action";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Fab, Dialog, Paper, IconButton, Grid } from "@material-ui/core";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import ActionPointOpenForm from "./ActionPointopenForm";

import AssignFurtherForm from "./AssignFurtherForm";

import ViewAssignTaskUsers from "./StatusUpdates/ViewAssignTaskUsers";
import { useDispatch, useSelector, connect } from "react-redux";
import { getActionTask } from "app/camunda_redux/redux/action";

import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

import Slide from "@material-ui/core/Slide";
import Cookies from "js-cookie";
import { useMemo } from "react";
import { unstable_batchedUpdates } from "react-dom";
import MarkCompletedComp from "./MarkCompleted/MarkCompleted";
import { ActionContext } from "../../ContextApi/ActionContext";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericRefresh from "app/views/utilities/GenericRefresh"
import { styled } from "@mui/material/styles";
import { Loading } from "../../../dashboard/therme-source/material-ui/loading";
import { handleError } from "utils";
import _ from "lodash";
import GenericColHider from "app/views/utilities/GenericColHider";
import { OPEN_TASK_TABLE } from "app/camunda_redux/redux/constants/ActionTypes";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 800,
    // maxHeight: 300,
    // overflowY: "scroll",
    fontSize: "13px",
  },
});
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const ActionPointOpenTable = (props) => {
  const userName = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const { theme } = useSelector((state) => state);
  const [actionId, setActionId] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [Filter, setFilter] = useState({});
  const [rowData, setRowData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  // assign further start=========================
  const [assignFurtherObj, setAssignFurtherObj] = useState({});
  const [assignFurtherDialoge, setAssignFurtherDialoge] = useState(false);
  const [viewDetails, setViewDetails] = useState({});
  const [checkedRows, setCheckedRows] = useState({}); // For handling mrt table selected row state
  const tableInstanceRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [trigger, setTrigger] = useState(false)

  const [notifyAction, setNotifyAction] = useState(() => {
    const actionId = window.location.search
    return actionId?.replace("?", "")
  })

  console.log(notifyAction)

  useEffect(() => {
    if (notifyAction) {
      viewDetailStatushandleOpen({
        id: notifyAction
      }, true)
    }
  }, [notifyAction])

  useEffect(() => {
    if (tableInstanceRef.current) {
      const rows = tableInstanceRef.current
        ?.getSelectedRowModel()
        .flatRows.map((row) => row.original);
      setSelectedRows(rows);
    }
  }, [checkedRows, tableInstanceRef]);

  const assignFurtherhandleClickOpen = (data) => {
    setAssignFurtherDialoge(true);
    setAssignFurtherObj(data);
  };
  const assignFurtherhandleClose = () => {
    setAssignFurtherDialoge(false);
  };

  // serach table filter data
  const { openTaskTable } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );
  const { roleName, deptName } = useSelector(
    (state) => state?.user?.currentUserRole
  );

  let inboxCol = {
    subject: true,
    assigner: true,
    assignees: true,
    dueDate: true,
    priority: true,
    action: true,
  };
  const [columnVisibility, setColumnVisibility] = useState(
    openTaskTable || inboxCol
  );

  // assign further end ============================

  // update Status start=========================
  const [updateStatus, setUpdateStatus] = useState(false);
  const updateStatushandleClickOpen = (id) => {
    setUpdateStatus(true);
    setActionId(id);
  };
  const updateStatushandleClose = () => {
    setUpdateStatus(false);
  };
  // update Status end ============================

  const dispatch = useDispatch();
  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleData = (data) => {
    let temArr = [data, ...rowData];
    setRowData(temArr);
  };

  const actionpoint = (data) => {
    props.setReloadData(data);
  };

  // create task state and function
  const [taskOpen, setTaskOpen] = useState(false);
  const taskOpenhandleClick = () => {
    setTaskOpen(true);
  };
  const taskClosehandleClick = () => {
    setTaskOpen(false);
  };
  const { t } = useTranslation();

  // generic search

  const FilterOption = [
    {
      value: "Select Field",
      label: "",
    },
    {
      value: "subject",
      label: "Subject",
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
      name: "priority",
      type: "select",
      optionValue: ["low", "medium", "high"],
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },

  ];

  const SortValueTypes = [
    {
      name: "dueDate",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Due Date",
    },
    {
      name: "priority",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Priority",
    },
    {
      name: "assigner",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Assigner",
    },
  ];

  // state Variable which get track of sort option with orderBy
  const [SortBy, setSortBy] = useState({});
  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

  //for dueDate calander

  const [selectedDates, setSelectedDates] = useState({
    startDate: null,
    endDate: null,
  });

  const handleDateRangeChange = useCallback((args) => {
    setSelectedDates({
      startDate: args.startDate,
      endDate: args.endDate,
    });
  }, []);

  // Generic search and filter
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

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-actiontable");
    adjustableDiv.style.height = viewportHeight - 198 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  // Here inbox only available when user have selected some role
  useEffect(() => {
    if (Object.keys(checkedRows).length > 0) {
      setCheckedRows({});
    }
    let inboxAbort = new AbortController();
    if (roleName && deptName) {
      getAllTaskData(inboxAbort.signal);
    }

    return () => {
      inboxAbort.abort();
    };
  }, [currentPage, pageSize, Filter, SortBy, roleName, deptName, props.filterStatus, trigger]);

  // const CustomToolbarMarkup = ({ table }) => {
  //   const selectedRows = table
  //     .getSelectedRowModel()
  //     .flatRows.map((row) => row.original);

  //   return (
  //     <>
  //       <Grid container className="AcHeader">
  //         <Grid item xs={12} className="PaHeadTop">
  //           <div
  //             style={{
  //               width: "90%",
  //               display: "flex",
  //               justifyContent: "space-between",
  //             }}
  //           >
  //             <GenericSearch
  //               FilterTypes={FilterTypes}
  //               FilterValueTypes={FilterValueTypes}
  //               addFilter={addFilter}
  //               cssCls={{}}
  //             />
  //           </div>
  //           <div className="control-pane">
  //             <div className="control-section">
  //               <div className="daterangepicker-control-section">
  //                 <DateRangePickerComponent
  //                   placeholder="Filter by date"
  //                   style={{ fontSize: "15px" }}
  //                   change={handleDateRangeChange}
  //                   startDate={selectedDates.startDate} // Pass the start date to the startDate property
  //                   endDate={selectedDates.endDate} // Pass the end date to the endDate property
  //                 ></DateRangePickerComponent>
  //               </div>
  //             </div>
  //           </div>
  //           <GenericFilterMenu
  //             SortValueTypes={SortValueTypes}
  //             addSort={addSort}
  //             // NestedSort={NestedSort}
  //             sort={SortBy}
  //           />
  //           <GenericColHider
  //             tableCols={columnVisibility}
  //             setTableCols={setColumnVisibility}
  //             moduleName={OPEN_TASK_TABLE}
  //           />

  //           {selectedRows.length >= 2 ? (
  //             <Tooltip title={t("mark_all_complete")} placement="bottom">
  //               <IconButton
  //                 className="InboxBtn"
  //                 onClick={(e) => {
  //                   e.stopPropagation();
  //                   markCompletedhandleClickOpen(selectedRows);
  //                 }}
  //                 size="medium"
  //               >
  //                 <CheckIcon style={{ fontSize: "20px" }} />
  //               </IconButton>
  //             </Tooltip>
  //           ) : null}
  //           <div className="taskIconCon">
  //             <Tooltip title={t("create_task")}>
  //               <span>
  //                 <Fab
  //                   style={{
  //                     width: "2.2rem",
  //                     height: ".1rem",
  //                     backgroundColor: "rgb(230, 81, 71)",
  //                   }}
  //                   onClick={taskOpenhandleClick}
  //                 >
  //                   <AddIcon style={{ fontSize: "19", color: "#fff" }} />
  //                 </Fab>
  //               </span>
  //             </Tooltip>
  //           </div>
  //           <MRT_ShowHideColumnsButton table={table} />
  //           <Workbook
  //             filename="Action_point_Data.xlsx"
  //             element={
  //               <IconButton>
  //                 <Tooltip title={t("export_data")} aria-label="Export Data">
  //                   <GetAppIcon />
  //                 </Tooltip>
  //               </IconButton>
  //             }
  //           >
  //             <Workbook.Sheet data={rowData} name="Sheet A">
  //               <Workbook.Column label="SUBJECT" value="subject" />
  //               <Workbook.Column label="FROM" value="assigner" />
  //               <Workbook.Column label="DUE DATE" value="dueDate" />
  //               <Workbook.Column
  //                 label="SENT TO"
  //                 value={(rowData) => rowData.assignees.join(", ")}
  //               />
  //               <Workbook.Column label="DESCRIPTION" value="description" />
  //               <Workbook.Column label="ON BEHALF OF" value="onBelfOf" />
  //             </Workbook.Sheet>
  //           </Workbook>
  //         </Grid>
  //         <GenericChip Filter={Filter} deleteChip={deleteChip} />
  //       </Grid>
  //     </>
  //   );
  // };


  const getAllTaskData = (abortSignal) => {
    setIsLoading(true);
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
      .getActionTask(
        userName,
        role,
        pageSize,
        currentPage,
        "",
        {
          filter: _.isEmpty(filter) ? null : filter,
          specialFilter: props.filterStatus,
          dueDateFrom: selectedDates ? selectedDates.startDate : null,
          dueDateTill: selectedDates ? selectedDates.endDate : null,

          sort: _.isEmpty(sort) ? null : sort,
        },
        false,
        abortSignal
      )
      .then((resp) => {
        let tmpArr = [];

        try {
          if (!resp.error) {
            tmpArr = resp?.response?.content.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });
            let newData = tmpArr.filter((item) => item.completed === false);
            // setRowData(newData);
            // setTotalCount(newData.length);
            setRowData(tmpArr);
            setTotalCount(resp?.response?.totalElements);

            setIsLoading(false);
          } else {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setIsLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
        setIsLoading(false);
      });
  };

  // useEffect(() => {
  //   let inboxAbort = new AbortController();
  //   getAllTaskData(inboxAbort.signal);

  //   return () => {
  //     inboxAbort.abort();
  //   };
  // }, [
  //   currentPage,
  //   pageSize,
  //   Filter,
  //   SortBy,
  //   selectedDates,
  //   props.filterStatus,
  // ]);

  // mark completed  ============================
  const [markComplete, setMarkComplete] = useState(false);
  const [markCompleteId, setMarkCompleteId] = useState({
    id: [],
    markCompleteobj: [],
  });

  const markCompletedhandleClickOpen = (data) => {
    let tempIds = [];
    let tempArrObj = [];
    for (let i = 0; i < data.length; i++) {
      tempIds.push(data[i].id);
      tempArrObj.push(data[i]);
    }
    setMarkComplete(true);
    setMarkCompleteId({ id: tempIds, markCompleteobj: tempArrObj });
  };

  const markCompletedhandleClose = () => {
    setMarkComplete(false);
  };

  // mark completd end ============================

  // mark completd end ============================
  const [viewStatus, setviewStatust] = useState(false);
  const [viewStatusData, setviewStatusData] = useState();

  const viewStatushandleClickOpen = (data) => {
    setviewStatust(true);
    setviewStatusData(data);
  };

  const viewStatushandleClose = () => {
    setviewStatust(false);
  };

  // View detailed status=====================

  const [viewDetailStatus, setViewDetailStatust] = useState(false);
  const [viewDetailStatusId, setViewDetailStatustId] = useState({});

  const viewDetailStatushandleOpen = (data, notification) => {

    if (notification) {
      setIsLoading(true)
      props.viewTaskDetails(data?.id).then((resp) => {
        try {
          if (resp.error) {
            setIsLoading(false)
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
          } else {
            setViewDetails(resp?.response);
            setViewDetailStatustId(resp?.response)
            setViewDetailStatust(true);
            setIsLoading(false)
            setNotifyAction("")
          }
        } catch (error) {
          callMessageOut(error.error);
          setIsLoading(false)
        }
      });
    }
    else {

      setIsLoading(true);
      setViewDetails(data);
      setViewDetailStatustId(data);
      setViewDetailStatust(true);
      setIsLoading(false);
    }



  };

  const viewDetailStatushandleClose = () => {
    setViewDetailStatust(false);
  };

  // new table code start

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 300,
        // cellStyle: { size: "100px", minSize: "100px !important" },

        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <div className="info2 text-overflow">
              <Tooltip title={row?.subject}>

                <span style={{
                  color: props.theme ? "#429cff" : "#1a0dab", textDecoration: "underline", fontWeight: row?.read ? "inherit" : "bolder"
                }}
                  className="text-m text-b mrt-text">{row?.subject?.toUpperCase()}</span>
              </Tooltip>
            </div>

          );
        },
      },
      {
        accessorKey: "assigner",
        header: t("initiated_by"),

        size: 140,
        // cellStyle: { width: 60, minWidth: 60 },
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          if (row.assigner !== 'Self') {
            return (<span style={{
              fontWeight: row?.read ? "inherit" : "bolder"
            }} className="text-m">{row.assigner}</span>)
          }
          else {
            return (< span style={{
              fontWeight: row?.read ? "inherit" : "bolder"
            }} className="text-m">{row.from}</span>)
          }
        }

        ,
      },



      {
        accessorKey: "assignees",
        header: t("to"),
        size: 140,
        Cell: ({ cell }) => {
          const assignees = cell.getValue();
          let assigneeValue;
          let row = cell?.row?.original;

          assigneeValue = assignees.join(" | ");


          return (
            <div className="info2 text-overflow">
              <Tooltip title={assigneeValue} arrow>
                <span style={{
                  fontWeight: row?.read ? "inherit" : "bolder"
                }} className="text-m" >
                  {assigneeValue}
                </span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        accessorKey: "dueDate",
        header: t("dueDate"),
        size: 100,
        // cellStyle: { width: 50, minWidth: 50 },

        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (<span style={{
            fontWeight: row?.read ? "inherit" : "bolder"
          }} className="text-m">{cell.getValue()?.slice(0, 11)}</span>)
        },
      },
      {
        accessorKey: "priority",
        header: t("priority"),
        size: 100,
        // cellStyle: { width: 40, minWidth: 40 },
        Cell: ({ cell }) => (
          <div className="paInfo5">
            <span
              style={{
                backgroundColor:
                  cell.getValue() === "high"
                    ? "#ff5f38d1"
                    : cell.getValue() === "medium"
                      ? "#ffaf38"
                      : cell.getValue() === "low"
                        ? "#37d392"
                        : cell.getValue() === "Approved"
                          ? "#37d392"
                          : cell.getValue() === "Return"
                            ? "#b73b32"
                            : "",
              }}
              className="status"
            >
              {cell.getValue()?.toUpperCase()}
            </span>
          </div>
        ),
      },

      {
        accessorKey: "action",
        header: t("actions_btn"),
        size: 70,
        // cellStyle: { width: 40, minWidth: 40 },
        Cell: ({ row }) => {
          let item = row.original;

          return (
            <div>
              <>
                {item.from === role && (
                  <Tooltip title={t("view_assigned_users")} placement="bottom">
                    <IconButton
                      className="InboxBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        viewStatushandleClickOpen(item);
                      }}
                    >
                      <MdVisibility size={20} />
                    </IconButton>
                  </Tooltip>
                )}

                <Tooltip title={t("assign_further")} placement="bottom">
                  <IconButton
                    className="InboxBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      assignFurtherhandleClickOpen(item);
                    }}
                  >
                    <MdRedo size={20} />
                  </IconButton>
                </Tooltip>

                {/* {item.assigner==='Self'&&(<Tooltip title={t("assign_further")} placement="bottom">
                  <IconButton
                    className="InboxBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      assignFurtherhandleClickOpen(item);
                    }}
                  >
                    <MdRedo size={20} />
                  </IconButton>
                </Tooltip>)} */}

                {item.assigner !== "Self" && item.onBeHalfOf !== role ? (
                  <Tooltip title={t("update_status")} placement="bottom">
                    <IconButton
                      className="InboxBtn"
                      disabled={item.assigner === "Self"}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateStatushandleClickOpen(item.id);
                      }}
                    >
                      <GrUpdate />
                    </IconButton>
                  </Tooltip>
                ) : null}
              </>
            </div>
          );
        },
      },
    ],
    [Cookies.get("i18next"), t]
  );

  const handleMarkComplete = (newData) => {
    setRowData(newData);
  };

  return (
    <div className="open-task">
      {isLoading && <Loading />}
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
          // paddingTop: "1rem",
        }}
        id="material-table"
      >
        <Grid container className="AcHeader">
          <Grid item xs={12} className="PaHeadTop">
            <div
              style={{
                paddingLeft: "1rem",
                width: "90%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <GenericSearch
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
              />
            </div>
            <div className="control-pane">
              <div className="control-section">
                <div className="daterangepicker-control-section">
                  <DateRangePickerComponent
                    placeholder={t("filter_by_date")}
                    style={{ fontSize: "15px" }}
                    change={handleDateRangeChange}
                    startDate={selectedDates.startDate} // Pass the start date to the startDate property
                    endDate={selectedDates.endDate} // Pass the end date to the endDate property
                  ></DateRangePickerComponent>
                </div>
              </div>
            </div>
            <GenericRefresh handleRefresh={() => setTrigger(!trigger)} />
            <GenericFilterMenu
              SortValueTypes={SortValueTypes}
              addSort={addSort}
              // NestedSort={NestedSort}
              sort={SortBy}
            />
            <GenericColHider
              tableCols={columnVisibility}
              setTableCols={setColumnVisibility}
              moduleName={OPEN_TASK_TABLE}
            />

            {selectedRows.length >= 2 ? (
              <Tooltip title={t("mark_all_complete")} placement="bottom">
                <IconButton
                  className="InboxBtn"
                  onClick={(e) => {
                    e.stopPropagation();
                    markCompletedhandleClickOpen(selectedRows);
                  }}
                  size="medium"
                >
                  <CheckIcon style={{ fontSize: "20px" }} />
                </IconButton>
              </Tooltip>
            ) : null}

            {/* <MRT_ShowHideColumnsButton table={table} /> */}
            <Workbook
              filename="Action_point_Data.xlsx"
              element={
                <IconButton disabled={!selectedRows.length}>
                  <Tooltip title={t("export_data")} aria-label="Export Data">
                    <GetAppIcon />
                  </Tooltip>
                </IconButton>
              }
            >
              <Workbook.Sheet data={selectedRows} name="Sheet A">
                <Workbook.Column label="SUBJECT" value="subject" />
                <Workbook.Column label="FROM" value="assigner" />
                <Workbook.Column label="DUE DATE" value="dueDate" />
                <Workbook.Column
                  label="SENT TO"
                  value={(rowData) => rowData.assignees.join(", ")}
                />
                <Workbook.Column label="DESCRIPTION" value="description" />
                <Workbook.Column label="ON BEHALF OF" value="onBelfOf" />
              </Workbook.Sheet>
            </Workbook>
            <div className="taskIconCon">
              <Tooltip title={t("create_task")}>
                <span>
                  <Fab
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                    onClick={taskOpenhandleClick}
                  >
                    <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
                </span>
              </Tooltip>
            </div>
          </Grid>
          <GenericChip Filter={Filter} deleteChip={deleteChip} />
        </Grid>
        <MaterialReactTable
          tableInstanceRef={tableInstanceRef}
          data={rowData || []}
          manualPagination
          columns={columns}
          initialState={{
            density: "compact",
          }}
          enableStickyHeader
          state={{
            rowSelection: checkedRows,
            columnVisibility,
          }}
          onRowSelectionChange={setCheckedRows}
          onHoveredRowChange={false}
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
          muiSelectCheckboxProps={{
            sx: { color: props.theme ? "#fff" : "#00000099" },
            color: props.theme ? "warning" : "primary",
          }}
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableColumnResizing
          enableRowSelection
          enableFilters={false}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          // renderTopToolbar={({ table }) => (
          //   <CustomToolbarMarkup table={table} />
          // )}
          muiTableBodyRowProps={({ row, staticRowIndex }) => ({
            onClick: (event) => {
              event.stopPropagation();
              viewDetailStatushandleOpen(row?.original);
            },
            sx: {
              // backgroundColor: props.theme ? "#a2eaea24" : "inherit",
              cursor: "pointer",
              height: "10px",
              backgroundColor: staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit",

            },
          })}
          muiTableContainerProps={() => ({
            sx: {
              border: "1px solid #8080802b",
              height: "61vh",
            },
            id: "mrt-actiontable",
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

        <PaginationComp
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          pageSizes={pageSizes}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      </Paper>

      {/* dialoges =============================== */}

      {!taskOpen ? null : (
        <ActionPointOpenForm
          firsts={taskOpen}
          taskClosehandleClick={taskClosehandleClick}
          taskOpenhandleClick={taskOpenhandleClick}
          handleData={handleData}
          actiondata={props.reloadData}
          actionpoint={actionpoint}
          getAllTaskDatas={props.getAllTaskData}
        />
      )}

      {/* action point form end==================================== */}

      {/* /*close Action dialoge start===================== */}

      <Dialog
        open={markComplete}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <ActionContext.Provider
          value={{
            markCompletedhandleClose,
            markComplete,
            markCompletedhandleClickOpen,
            rowData,
            markCompleteId,
            handleMarkComplete,
            getAllTaskData,
            pageSize,
            currentPage,
          }}
        >
          <MarkCompletedComp />
        </ActionContext.Provider>
      </Dialog>

      {/* /* close Action  dialoge end============================ */}

      {/* /* Assign further  dialoge start ================================*/}
      <Dialog
        className="header-tab assign-further"
        open={assignFurtherDialoge}
        PaperComponent={PaperComponent}
      >
        <AssignFurtherForm
          id={actionId}
          assignFurtherhandleClose={assignFurtherhandleClose}
          assignFurtherDialoge={assignFurtherDialoge}
          assignFurtherObj={assignFurtherObj}
          viewDetailStatushandleClose={viewDetailStatushandleClose}
          getAllTaskData={getAllTaskData}
        />
      </Dialog>

      {/* /* Assign further  dialoge end  =======================================*/}

      {/* /*update status  dialoge start =======================================*/}

      <Dialog
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        className="updateStatus"
        open={updateStatus}
        onClose={updateStatushandleClose}
      >
        <UpdateStatusTab
          updateStatus={updateStatus}
          id={actionId}
          updateStatushandleClose={updateStatushandleClose}
        />
      </Dialog>

      {/* View Assign Task Users */}

      <Dialog
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        open={viewStatus}
        onClose={viewStatushandleClose}
        className="viewstatus"
      >
        <ViewAssignTaskUsers
          getAllTaskData={getAllTaskData}
          viewStatusData={viewStatusData}
          viewStatushandleClose={viewStatushandleClose}
          getAllTaskDatas={props.getAllTaskData}
        />
      </Dialog>

      {/* view  task details and documents ======================= */}
      <Dialog
        fullScreen
        open={viewDetailStatus}
        onClose={viewDetailStatushandleClose}
        TransitionComponent={Transition}
        className="view-details-dialog dialog-wrapper"
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <ViewDetailStatus
          getAllTaskData={getAllTaskData}
          rowData={viewDetailStatusId}
          viewDetails={viewDetails}
          viewDetailStatushandleClose={viewDetailStatushandleClose}
        />
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,

    theme: state.theme,
  };
}

export default connect(mapStateToProps, { getActionTask, viewTaskDetails })(
  ActionPointOpenTable
);
