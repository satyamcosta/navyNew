import React, { useState, useEffect, useMemo, useRef } from "react";

import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import GenericChip from "app/views/utilities/GenericChips";
import PaginationComp from "app/views/utilities/PaginationComp";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericSearch from "app/views/utilities/GenericSearch";
import { MaterialReactTable } from "material-react-table";
import { Paper, Tooltip } from "@material-ui/core";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { getMonitoredFiles } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { Loading } from "../../therme-source/material-ui/loading";
import GenericRefresh from "app/views/utilities/GenericRefresh";

const EventTable = (props) => {
  const dispatch = useDispatch();
  const [Filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const { t } = useTranslation();
  const [SortBy, setSortBy] = useState({});
  const tableInstanceRef = useRef(null);
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

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
      value: "type",
      label: "Type",
    },
    {
      value: "range",
      label: "Date Range",
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
      name: "type",
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
      name: "type",
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
  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-event");
    adjustableDiv.style.height = viewportHeight - 268.83 + "px";
  }

  useEffect(() => {
    let monitorAbort = new AbortController();
    loadMonitor(monitorAbort.signal);
    return () => {
      monitorAbort.abort();
    };
  }, [trigger, pageSize, currentPage]);

  const loadMonitor = (abortSignal) => {
    setLoading(true);
    let tmpArr = [];
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
    // if (!_.isEmpty(SortBy)) {
    //   sort = {
    //     title: SortBy?.title?.name,
    //     type: SortBy?.type,
    //   };
    // }
    if (SortBy?.title) {
      sort = {
        sortByField: SortBy.title.name,
        asc: SortBy?.type == "Asc" ? true : false,
      };
    }
    props
      .getMonitoredFiles(currentPage, pageSize, abortSignal)
      .then((resp) => {
        try {
          if (resp?.error?.includes("aborted")) {
            setLoading(false);
            return;
          }
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
          } else {
            if (!isNullOrUndefined(resp.response.File)) {
              setTotalCount(resp.response.totalElements);
              const { length, noOfDaks, noOfFiles } = resp?.response;

              tmpArr = resp.response.File.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage - 1 + (index + 1),
                  isChecked: false,
                  status:
                    item.status === 2
                      ? "In-Progress"
                      : item.status === 3
                        ? "Approved"
                        : item.status === 4
                          ? "Rejected"
                          : item.status,
                };
              });
              // props.changingTableStateOutbox(false, "CHANGE_OUTBOX");
              setRowData(tmpArr);
              setLoading(false);
            }
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut(err.message);
        setLoading(false);
      });
  };

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 150,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item?.cabinet?.subject}>
              <span className="text-m text-b mrt-text" style={{
                color: props.theme ? "#429cff" : "#1a0dab"
              }}>{item?.cabinet?.subject}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "by",
        header: t("by"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item?.cabinet?.createdBy}>
              <span className="text-m">{item?.cabinet?.createdBy}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "type",
        header: t("type"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item?.cabinet?.typeOfFile}>
              <span className="text-m">{item?.cabinet?.typeOfFile}</span>
            </Tooltip>
          );
        },
      },
      // {
      //   accessorKey: "time",
      //   header: t("time"),
      //   size: 80,
      //   Cell: ({ cell }) => {
      //     let item = cell?.row?.original;
      //     return (
      //       <Tooltip title={item?.cabinet?.createdOn}>
      //         <span className="text-m mrt-text">
      //           {item?.cabinet?.createdOn}
      //         </span>
      //       </Tooltip>
      //     );
      //   },
      // },
      // {
      //   accessorKey: "edit",
      //   header: "Edit",
      //   size: 70,
      // },
    ],
    [t, props.theme]
  );

  useEffect(() => {
    setTotalCount(rowData.length);
  }, []);
  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      {loading && <Loading />}
      <div className="mrt-head">
        <span>{t("monitor_table")}</span>
      </div>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
           boxShadow:"rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
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
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
                width={"70%"}
              />

              <div>
                <GenericRefresh handleRefresh={() => setTrigger(!trigger)} />
                <GenericFilterMenu
                  sort={SortBy}
                  SortValueTypes={SortValueTypes}
                  addSort={addSort}
                />
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
            enableDensityToggle={false}
            enableTopToolbar={false}
            muiTableBodyRowProps={({ row, staticRowIndex }) => ({
              sx: {
                cursor: "pointer",
                height: "10px",
                backgroundColor:
                  staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit",
              },
            })}
            muiTableContainerProps={() => ({
              sx: {
                border: "1px solid #8080802b",
                height: "45vh !important",
              },
              id: "mrt-event",
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
            pageSize={pageSize}
            pageSizes={[5, 10, 15]}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalCount={totalCount}
            setPageSize={setPageSize}
          />
        </div>
      </Paper>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  getMonitoredFiles,
})(EventTable);
