import React, { useState, useEffect, useMemo, useRef } from "react";

import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import GenericChip from "app/views/utilities/GenericChips";
import PaginationComp from "app/views/utilities/PaginationComp";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import GenericSearch from "app/views/utilities/GenericSearch";
import { MaterialReactTable } from "material-react-table";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
} from "@material-ui/core";
import { getAllEric, deleteEric } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { Cancel, Delete, Edit } from "@material-ui/icons";
import Eric from "app/views/Cabinet/folder/Eric";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { handleError } from "utils";
import GenericRefresh from "app/views/utilities/GenericRefresh";
import { Loading } from "../../therme-source/material-ui/loading";
import Draggable from "react-draggable";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const MonitorTable = (props) => {

  const role = sessionStorage.getItem("role")

  const dispatch = useDispatch();
  const [Filter, setFilter] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const { t } = useTranslation();
  const [SortBy, setSortBy] = useState({});
  const tableInstanceRef = useRef(null);
  const [rowData, setrowData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [trigger, setTrigger] = useState(false);
  const [openDel, setOpendel] = useState(false);

  const [row, setRow] = useState(false);

  const handleEric = (val) => setEdit(val);

  const handleCreateEric = () => {
    dispatch(setSnackbar(true, "success", t("update_eric_suc")));
    setEdit(false);
    setTrigger(!trigger)
  };

  console.log(props.theme);

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "day",
      label: "Day",
    },
    // {
    //   value: "status",
    //   label: "Status",
    // },
    // {
    //   value: "type",
    //   label: "Type",
    // },
    // {
    //   value: "range",
    //   label: "Date Range",
    // },
  ];
  const StatusOption = [
    "In Progress",
    "Approved",
    "Draft",
    "Rejected",
    "Return",
  ];
  const dayOption = ["All Days", "Today To 3 Days After Tomorrow"];
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
    //   name: "status",
    //   type: "select",
    //   optionValue: StatusOption,
    //   size: "small",
    //   variant: "outlined",
    //   label: "Value",
    //   color: "primary",
    // },
    {
      name: "day",
      type: "select",
      optionValue: dayOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    // {
    //   name: "type",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   label: "Value",
    //   color: "primary",
    // },
    // {
    //   name: "range",
    //   type: "range",
    //   size: "small",
    //   variant: "outlined",
    //   color: "primary",
    // },
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
    var adjustableDiv = document.getElementById("mrt-monitor");
    adjustableDiv.style.height = viewportHeight - 164 + "px";
  }

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
        accessorKey: "ericSubject",
        header: t("subject"),
        size: 180,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.ericSubject}>
              <span className="text-m text-b mrt-text" style={{
                color: props.theme ? "#429cff" : "#1a0dab"
              }}>{cell.getValue()}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "createdOn",
        header: t("created_on"),
        size: 120,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={`${item?.ericDate} ${item?.ericTime}`}>
              <span className="text-m mrt-text">{`${item?.ericDate} ${item?.ericTime}`}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "ericType",
        header: t("type"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={`${item?.ericType}`}>
              <span className="text-m">{`${item?.ericType}`}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "ericRole",
        header: t("creator"),
        size: 120,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.ericRole}>
              <span className="text-m">{cell.getValue()}</span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 80,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                {
                  row?.ericRole == role && (
                    <>
                      <Tooltip title={t("delete_eric")} aria-label="Delete">
                        <IconButton
                          id="draftPA_del_btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpendel(true);
                            setRow(row);
                          }}
                        >
                          <Delete color="error" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={t("edit_eric")} aria-label="Edit Subject">
                        <IconButton
                          id="draftPA_del_btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEdit(row);
                          }}
                        >
                          <Edit color="primary" />
                        </IconButton>
                      </Tooltip>

                    </>
                  )
                }
              </div>
            </>
          );
        },
      },
    ],
    [t, props.theme]
  );

  useEffect(() => {
    let Abort = new AbortController();

    getAllErics(Abort.signal);

    return () => {
      Abort.abort();
    };
  }, [trigger, pageSize, currentPage, Filter, trigger]);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const getAllErics = (abortSignal) => {
    setLoading(true);
    const current = Filter["day|Day"] == "Today To 3 Days After Tomorrow";
    props
      .getAllEric(currentPage, pageSize, current, abortSignal)
      .then(async (resp) => {
        console.log(resp);
        try {
          const res = await resp?.json();
          if (res.error) {
            if (res?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            setLoading(false);
          } else {
            setrowData(
              res?.todayToDayAfterTomorrowData?.data ||
              res?.allDataFromTodayOnwards?.data
            );
            setTotalCount(
              res?.todayToDayAfterTomorrowData?.totalItems ||
              res?.allDataFromTodayOnwards?.totalItems
            );
            setLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setLoading(false);
      });
  };

  const handleDelete = () => {
    setLoading(true);
    props
      .deleteEric(row?.id)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
            return;
          } else {
            let newArr = rowData.filter((item) => {
              return item.id != row?.id;
            });
            setrowData(newArr);
            dispatch(setSnackbar(true, "success", t("eric_delete")));
            setOpendel(false);
            setLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setLoading(false);
      });
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
    }}>
      {loading && <Loading />}
      <div className="mrt-head">
        <span>{t("eric")}</span>
      </div>
      <Paper
        elevation={3}
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
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
                width={"50%"}
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
              id: "mrt-monitor",
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
          {t("delete_eric")}
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
          <h6>{t("delete_eric_confirm")}</h6>
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

      <Eric
        open={edit}
        handleClose={handleEric}
        handleEric={handleCreateEric}
        ericType={""}
        edit={edit}
        update={true}
      />
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
  };
}

export default connect(mapStateToProps, {
  getAllEric,
  deleteEric,
})(MonitorTable);
