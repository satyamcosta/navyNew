import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  useCallback,
} from "react";

import "../index.css";
import { getActionTask } from "app/camunda_redux/redux/action";
import { useTranslation } from "react-i18next";
import "react-tabs/style/react-tabs.css";
import PaginationComp from "app/views/utilities/PaginationComp";
import { DateRangePickerComponent } from "@syncfusion/ej2-react-calendars";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericRefresh from "app/views/utilities/GenericRefresh"
import { Dialog, Paper, Grid } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Cookies from "js-cookie";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import { unstable_batchedUpdates } from "react-dom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import ViewDetailStatus from "../DetailsView/ViewDetailStatus";
import Slide from "@material-ui/core/Slide";
import { handleError } from "utils";
import { viewTaskDetails } from "app/camunda_redux/redux/action";
import { Loading } from "../../../dashboard/therme-source/material-ui/loading";
import "../../../Personnel/therme-source/material-ui/loading.css";
import { CLOSE_TASK_TABLE } from "app/camunda_redux/redux/constants/ActionTypes";
import GenericColHider from "app/views/utilities/GenericColHider";
const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    maxHeight: 300,
    overflowY: "scroll",
    fontSize: "13px",
  },
});

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const ActionPointCloseTable = (props) => {
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [Filter, setFilter] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { theme } = useSelector((state) => state);
  const [rowData, setRowData] = useState([]);

  const { t } = useTranslation();
  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");
  //search-table-filter
  const [checkedRows, setCheckedRows] = useState({}); // For handling mrt table selected row state
  const tableInstanceRef = useRef(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const [trigger, setTrigger] = useState(false)

  useEffect(() => {
    if (tableInstanceRef.current) {
      const rows = tableInstanceRef.current
        ?.getSelectedRowModel()
        .flatRows.map((row) => row.original);
      setSelectedRows(rows);
    }
  }, [checkedRows, tableInstanceRef]);

  //search-table-filter
  const { closeTaskTable } = useSelector(
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
    description: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    closeTaskTable || inboxCol
  );

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
    {
      name: "assignee",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Assignee",
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

  // const CustomToolbarMarkup = ({ table }) => {
  //   return (
  //     <>
  //       <Grid container className="AcHeader">
  //         <Grid item xs={12} className="PaHeadTop">
  //           <div
  //             style={{
  //               margin: "7px 0",
  //               width: "85%",
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

  //           <MRT_ShowHideColumnsButton table={table} />
  //         </Grid>
  //         <GenericChip Filter={Filter} deleteChip={deleteChip} />
  //       </Grid>
  //     </>
  //   );
  // };

  // View detailed status=====================

  const [viewDetailStatusData, setViewDetailStatustData] = useState({});
  const [viewDetailStatus, setViewDetailStatust] = useState(false);
  const [viewDetailStatusId, setViewDetailStatustId] = useState({});
  const [viewDetails, setViewDetails] = useState({});
  const viewDetailStatushandleOpen = (event, data) => {
    event.stopPropagation();
    setIsLoading(true)
    props.viewTaskDetails(data?.id).then((resp) => {
      try {
        if (resp.error) {
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
          setIsLoading(false)
        } else {
          setViewDetails(resp?.response);
          setViewDetailStatust(true);
          setIsLoading(false)
        }
      } catch (error) {
        callMessageOut(error.error);
        setIsLoading(false)
      }
    });

    setViewDetailStatustId(data);
  };
  // const viewDetailStatushandleOpen = (event, data) => {
  //   event.stopPropagation();

  //   setViewDetailStatust(true);
  //   setViewDetailStatustData(data);
  // };

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
        Cell: ({ cell }) => {
          const subject = cell.getValue();
          // const words = subject.split(" ");
          // const truncatedSubject = words.slice(0, 10).join(" ");

          return (
            // <CustomWidthTooltip title={subject}>
            //   <span className="text-m">
            //     {truncatedSubject} {subject.length > 70 ? "..." : ""}
            //   </span>
            // </CustomWidthTooltip>
            <div className="info2 text-overflow">
              <Tooltip title={subject}>
                {/* <span className="text-m">
                            {truncatedSubject} {subject.length > 70 ? "..." : ""}
                          </span> */}
                <span style={{
                  color: props.theme ? "#429cff" : "#1a0dab", textDecoration: "underline", fontWeight: "inherit"
                }}
                  className="text-m text-b mrt-text">{cell.getValue()?.toUpperCase()}</span>
              </Tooltip>
            </div>
          );
        },
      },
      {
        accessorKey: "assigner",
        header: t("initiated_by"),

        size: 130,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          if (row.assigner !== 'Self') { return (<span className="text-m">{row.assigner}</span>) }
          else {
            return (<span className="text-m">{row.from}</span>)
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

          // if (assignees.length > 2) {
          //   assigneeValue = assignees.slice(-2).join(" | ");
          // } else {
          //   assigneeValue = assignees.join(" | ");
          // }

          assigneeValue = assignees.join(" | ");

          return (
            <div className="info2 text-overflow">
              <Tooltip title={assigneeValue}>
                <span className="text-m" >
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
        size: 130,

        Cell: ({ cell }) => (
          <span className="text-m">{cell.getValue()?.slice(0, 11)}</span>
        ),
      },

      {
        accessorKey: "description",
        header: t("description"),
        size: 140,
        Cell: ({ cell }) => {
          const description = cell.getValue();
          const words = description.split(" ");
          const truncatedDescription = words.slice(0, 6).join(" ");

          return (
            <CustomWidthTooltip title={description}>
              <span className="text-m">
                {truncatedDescription} {description.length > 200 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },
      // {
      //   accessorKey: "assigner",
      //   header: t("from"),

      //   size: 40,
      //   Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      // },
    ],
    [Cookies.get("i18next"), t]
  );

  const dispatch = useDispatch();
  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  // Here inbox only available when user have selected some role
  useEffect(() => {
    if (Object.keys(checkedRows).length > 0) {
      setCheckedRows({});
    }
    let inboxAbort = new AbortController();
    if (roleName && deptName) {
      closeActionDataFun(inboxAbort.signal);
    }

    return () => {
      inboxAbort.abort();
    };
  }, [currentPage, pageSize, Filter, SortBy, roleName, deptName, trigger]);

  const closeActionDataFun = (abortSignal) => {
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
          specialFilter: "all",
          dueDateFrom: selectedDates ? selectedDates.startDate : null,
          dueDateTill: selectedDates ? selectedDates.endDate : null,

          sort: _.isEmpty(sort) ? null : sort,
        },
        true,
        abortSignal
      )
      .then((resp) => {
        let tmpArr = [];
        try {
          if (resp) {
            if (!resp.error) {
              tmpArr = resp?.response?.content?.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              let newData = tmpArr.filter((item) => item.completed === true);
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

  // Here inbox only available when user have selected some role
  // useEffect(() => {
  //   let inboxAbort = new AbortController();
  //   closeActionDataFun(inboxAbort.signal);

  //   return () => {
  //     inboxAbort.abort();
  //   };
  // }, [currentPage, pageSize, "", Filter, SortBy, selectedDates]);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-closeactiontable");
    adjustableDiv.style.height = viewportHeight - 198 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  return (
    <div className="open-task">
      {isLoading && <Loading />}
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
        }}
        id="material-table"
      >
        <Grid container className="AcHeader">
          <Grid item xs={12} className="PaHeadTop">
            <div
              style={{
                margin: "7px 16px",
                width: "85%",
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
              moduleName={CLOSE_TASK_TABLE}
            />

            {/* <MRT_ShowHideColumnsButton table={table} /> */}
          </Grid>
          <GenericChip Filter={Filter} deleteChip={deleteChip} />
        </Grid>
        <MaterialReactTable
          tableInstanceRef={tableInstanceRef}
          data={rowData}
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
          displayColumnDefOptions={{
            "mrt-row-select": {
              size: 0,
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
          enableTopToolbar={false}
          enableBottomToolbar={false}
          enableColumnResizing
          enableFilters={false}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          // renderTopToolbar={({ table }) => (
          //   <CustomToolbarMarkup table={table} />
          // )}
          muiTableBodyRowProps={({ row, staticRowIndex }) => ({
            onClick: (event) => {
              viewDetailStatushandleOpen(event, row?.original);
            },
            sx: {
              // backgroundColor: props.theme ? "#a2eaea24" : "inherit",
              cursor: "pointer",
              height: "10px",
              backgroundColor: staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit"
            },
          })}
          muiTableContainerProps={() => ({
            sx: {
              border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
              height: "63vh",
              borderRadius: "4px",
              overflowX: "auto", // Allow horizontal overflow
            },
            id: "mrt-closeactiontable",
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
          // rowData={viewDetailStatusData}
          getAllTaskData={()=>{}}
          viewDetailStatushandleClose={viewDetailStatushandleClose}
          rowData={viewDetailStatusId}
          viewDetails={viewDetails}
        />
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps, { getActionTask, viewTaskDetails })(
  ActionPointCloseTable
);

// "proxy": "http://52.66.174.26:9090",

// "proxy": "http://gateway-test.apps.ocp4.pacosta.com",
