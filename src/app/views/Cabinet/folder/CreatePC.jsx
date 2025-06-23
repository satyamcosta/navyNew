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
import PaginationComp from "app/views/utilities/PaginationComp";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { getMainFiles, createPC } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import BarcodeView from "./BarcodeView";
import GenericChip from "app/views/utilities/GenericChips";
import GenericSearch from "app/views/utilities/GenericSearch";
import { unstable_batchedUpdates } from "react-dom";

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

const configData = {
  fullWidth: true,
  size: "small",
};

const classificationlist = ["Unclassified", "Restricted"];

const CreatePC = ({ open, handleClose, handleTrigger, ...props }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const tableInstanceRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [checkedRow, setCheckedRow] = useState({});
  const [selectedRow, setSelectedRow] = useState("");
  const [Filter, setFilter] = useState({});
  const [subject, setSubject] = useState("");
  const [classification, setClassification] = useState(classificationlist[0]);
  const [date, setDate] = useState();
  const [confirm, setConfirm] = useState(false);
  const [partCaseResponse, setPartCaseResponse] = useState("");
  const [successPopup, setSuccessPopup] = useState(false);
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
        setCurrentPage(0);
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
      setCurrentPage(0);
      setPageSize(10);
    });
  };

  const handleCreate = () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("fileName", selectedRow?.fileName);
    formData.append("classification", classification);
    props
      .createPC(formData)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            setLoading(false);
          } else {
            console.log("createPC", res);
            dispatch(setSnackbar(true, "success", t("file_pc")));
            if (res) {
              setSuccessPopup(true);
              setPartCaseResponse(res?.response?.file);
              handleConfirm(false);
            }

            setLoading(false);
            // props.handleClick(res?.response?.file);
            // setLoading(false);
          }
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

  useEffect(() => {
    if (open) {
      setLoading(true);
      let filter = {};
      Object.entries(Filter).map(([property, value]) => {
        let key = property.split("|")[0];
        filter[`${key}`] = value;
      });
      props
        .getMainFiles(filter, currentPage, pageSize)
        .then((resp) => {
          try {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            let tmpArr = [];
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
            }

            setRowData(resp.response.data);
            setTotalCount(resp.response.length);
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
    }
  }, [open, currentPage, pageSize, Filter]);

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 200,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return <div className="text-m text-b mrt-text" style={{ color: props.theme ? "#429cff" : "#1a0dab" }}>{row?.subject}</div>;
        },
      },
      {
        accessorKey: "fileName",
        header: t("fileName"),
        size: 80,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return <div>{row?.fileName}</div>;
        },
      },
    ],
    [rowData, props.theme, t]
  );

  const handleConfirm = (val) => {
    setConfirm(val);
  };

  const handlePopupClose = () => {
    setSuccessPopup(false);
    if (partCaseResponse) {
      props.handleClick(partCaseResponse);
      setPartCaseResponse(null); // Clear the fileToHandle after using it
    }
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
          <span>{t("create_part_case_file")}</span>
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubject(selectedRow?.subject);
            handleConfirm(true);
          }}
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
                  backgroundColor: row.original.fileName == selectedRow?.fileName ? "#ffd394 !important" : staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit"
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
            <PaginationComp
              pageSize={pageSize}
              pageSizes={[5, 10, 15]}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
            />
          </DialogContent>

          <DialogActions>
            <Button
              endIcon={<Done />}
              color="secondary"
              variant="contained"
              type="submit"
              disabled={!selectedRow}
            >
              {t("submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog
        PaperComponent={PaperComponent2}
        open={confirm}
        onClose={() => handleConfirm(false)}
      >
        {loading && <Loading />}
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title2"
          className="dialog_title"
        >
          {t("are_you_sure_to_create_a_part_case")}
          <IconButton
            id="create_file_dialog_close_button"
            aria-label="close"
            onClick={() => handleConfirm(false)}
            color="primary"
          >
            <Cancel
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2">
                PARENT FILE #: {selectedRow?.fileName}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...configData}
                variant="outlined"
                multiline
                minRows={2}
                name="subject"
                required
                label={t("subject")}
                className={props.theme ? "darkTextField" : ""}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                {...configData}
                id="outlined-select-currency"
                select
                label={t("classification")}
                name="classification"
                required
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
                variant="outlined"
                className={`corr-form-select ${props.theme ? "darkTextField" : ""
                  }`}
              >
                {classificationlist.map((option, i) => (
                  <MenuItem key={i} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/*<Grid item xs={12}>
              <TextField
                type="date"
                {...configData}
                variant="outlined"
                name="due_date"
                label={t("due_date")}
                className={props.theme ? "darkTextField" : ""}
                value={date}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>*/}
          </Grid>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            endIcon={<Done />}
            color="secondary"
            variant="contained"
            type="submit"
            onClick={handleCreate}
            disabled={!selectedRow || !subject?.trim()}
          >
            {t("submit")}
          </Button>
        </DialogActions>
      </Dialog>
      <BarcodeView
        open={successPopup}
        data={partCaseResponse}
        handleBarcodeClose={handlePopupClose}
      />
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
  getMainFiles,
  createPC,
})(CreatePC);
