import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Loading } from "../therme-source/material-ui/loading";
import { Cancel, Clear, Done, Print, Undo } from "@material-ui/icons";
import Draggable from "react-draggable";
import MaterialReactTable from "material-react-table";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { getCabinet, linkFile } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import GenericChip from "app/views/utilities/GenericChips";
import GenericSearch from "app/views/utilities/GenericSearch";
import { unstable_batchedUpdates } from "react-dom";
import _ from "lodash";
import PaginationComp2 from "app/views/utilities/PaginationComp2";
import { handleError } from "utils";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const PaperComponent2 = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title2" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const LinkedFile = ({ open, handleClose, ...props }) => {
  const role = sessionStorage.getItem("role");
  const department = sessionStorage.getItem("department");
  const username = localStorage.getItem("username");
  const cabinetDept = sessionStorage.getItem("parent-dir") ? sessionStorage.getItem("parent-dir") : sessionStorage.getItem("department")
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const tableInstanceRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowData, setRowData] = useState([]);
  const [checkedRow, setCheckedRow] = useState({});
  const [selectedRow, setSelectedRow] = useState("");
  const [Filter, setFilter] = useState({});
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
      value: "filename",
      label: "Filename",
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
      name: "filename",
      type: "text",
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
        setCurrentPage(1);
        setPageSize(10);
      });
    }
  };

  useEffect(() => {
    if (tableInstanceRef.current) {
      const row = tableInstanceRef.current
        ?.getSelectedRowModel()
        .flatRows.map((row) => row.original);
      setSelectedRow(row[0]);
    }
  }, [checkedRow, tableInstanceRef]);

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    unstable_batchedUpdates(() => {
      setFilter(newFilter);
      setCurrentPage(1);
      setPageSize(10);
    });
  };

  const handleCreate = () => {
    setLoading(true);
  };

  useEffect(() => {
    let cabinetAbort = new AbortController();
    if (open) {
      loadCabinateData(cabinetAbort.signal);
    }

    return () => {
      cabinetAbort.abort();
    };
  }, [open, currentPage, pageSize, Filter]);

  const loadCabinateData = (abortSignal) => {
    setLoading(true);
    let filter = {};
    let isType = false;
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      if (key == "type") {
        isType = true;
      }
      if (key == "status" && value == "Closed") {
        filter[`${key}`] = "C";
      } else {
        filter[`${key}`] = value;
      }
    });

    let sort = {};

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
        1
      )
      .then((resp) => {
        if (resp?.error?.includes("aborted")) {
          return;
        }
        let tmpArr = [];
        if (resp.error) {
          callMessageOut(resp.error);
          setLoading(false);
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
          setLoading(false);
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        setLoading(false);
      });
  };

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 150,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return <div className="mrt-text">{row?.subject}</div>;
        },
      },
      {
        accessorKey: "file",
        header: t("old_file"),
        size: 100,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return <div>{row?.pcFileNumber || row?.file}</div>;
        },
      },
      {
        accessorKey: "createdOn",
        header: t("created_on"),
        size: 100,
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
    ],
    [rowData, Cookies.get("i18next"), t]
  );

  const handleLinkFile = () => {
    let cabinetpartcase = Cookies.get("cabinetpartcase");
    setLoading(true);
    props
      .linkFile(cabinetpartcase, selectedRow?.partcaseId, "add")
      .then((res) => {
        let tmpArr = [];

        try {
          if (res.error) {
            if (res?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            setLoading(false);

            return;
          } else {
            dispatch(setSnackbar(true, "success", t("linked_succ")));
            setSelectedRow("");
            setCheckedRow({});
            props.handleAdd(res);
            setLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        let errMsg = handleError(e.message);
        callMessageOut(errMsg);
        setLoading(false);
      });
  };

  return (
    <>
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        id="cabinet-create-file"
      >
        {loading && <Loading />}
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("link_file")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="create_file_dialog_close_button"
              aria-label="close"
              onClick={() => {
                // formik.handleReset();
                handleClose();
              }}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <div

          id="material-table"
        >
          <DialogContent dividers>
            <div
              className="header-input"
              style={{
                width: "100%",
                // padding: "0rem 1rem",
              }}
            >
              <GenericSearch
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
                width={"100%"}
              />
              <GenericChip Filter={Filter} deleteChip={deleteChip} />
            </div>
            <MaterialReactTable
              tableInstanceRef={tableInstanceRef}
              data={rowData}
              manualPagination
              enableRowSelection
              enableMultiRowSelection={false}
              columns={columns}
              initialState={{
                density: "compact",
              }}
              state={{
                rowSelection: checkedRow,
              }}
              onRowSelectionChange={setCheckedRow}
              displayColumnDefOptions={{
                "mrt-row-select": {
                  size: 5,
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
              enableStickyHeader
              enableFilters={false}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              muiTableBodyRowProps={({ row, staticRowIndex }) => ({
                sx: {
                  cursor: "pointer",
                  // background: "inherit",
                  height: "10px",
                  backgroundColor: staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit"
                },
              })}
              muiTableContainerProps={() => ({
                sx: {
                  border: "1px solid #8080802b",
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
              pageSize={pageSize}
              pageSizes={[5, 10, 15]}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
              searchParamsSetter={() => { }}
            />
          </DialogContent>

          <DialogActions>
            <Button
              endIcon={<Done />}
              color="secondary"
              variant="contained"
              type="submit"
              disabled={!selectedRow}
              onClick={(e) => {
                e.preventDefault();
                handleLinkFile();
              }}
            >
              {t("submit")}
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  getCabinet,
  linkFile,
})(LinkedFile);
