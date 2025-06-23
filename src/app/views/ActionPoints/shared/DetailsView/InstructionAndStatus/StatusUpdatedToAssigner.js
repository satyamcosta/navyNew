import React, { useState, useEffect, useMemo, useContext } from "react";

import "../../index.css";
import {
  previousInstructions,
  updateStatus,
  PreviousStatus,
} from "app/camunda_redux/redux/action";
import { useTranslation } from "react-i18next";
import "react-tabs/style/react-tabs.css";
import PaginationComp from "app/views/utilities/PaginationComp";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";

import {
  Paper,
  Typography,
  Grid,
  Fab,
  IconButton,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
  Button,
  FormControl,
  Box,
  CircularProgress,
} from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Cookies from "js-cookie";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import { unstable_batchedUpdates } from "react-dom";
import AssignerInstruction from "./AssignerInstruction";
import { Autocomplete } from "@material-ui/lab";
import Draggable from "react-draggable";
import { makeStyles, useTheme } from "@material-ui/styles";
import { useFormik } from "formik";
import * as yup from "yup";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { handleError } from "utils";
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

const useStyles = makeStyles((theme) => ({
  priority_box: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
  },
  priority_btn: {
    fontSize: "2rem",
    border: "1px solid #8080804f !important",
    borderRadius: "8%",
  },
}));

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

const StatusUpdatedToAssigner = (props) => {
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [Filter, setFilter] = useState({});
  const { theme } = useSelector((state) => state);
  const [rowData, setRowData] = useState([]);
  const classes = useStyles();
  const { t } = useTranslation();
  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");
  const [loading, setLoading] = useState(false);

  // generic search
  const FilterOption = [
    {
      value: "Select Field",
      label: "",
    },
    {
      value: "department",
      label: "department",
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
    setFilter(newFilter);
  };

  //   add instruction dialog funs

  const [addInstruction, setAddInstruction] = useState(false);

  const addInstructionFunOpen = () => {
    setAddInstruction(true);
  };
  const addInstructionFunClose = () => {
    setAddInstruction(false);
  };



  const CustomToolbarMarkup = ({ table }) => {
    return (
      <>
        <Grid container className="AcHeader">
          <Grid item xs={12} className="PaHeadTop">
            <div
              style={{
                width: "90%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {" "}
                {t("status_updated_to_assigner")}
              </Typography>
            </div>

            <div className="taskIconCon">
              <Tooltip title={t("update_status")}>
                <span>
                  <Fab
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: props?.viewDetails?.completed
                        ? "#eee"
                        : "rgb(230, 81, 71)",
                      display:
                        props?.viewDetails?.completed === true
                          ? "none"
                          : "block",
                    }}
                    onClick={addInstructionFunOpen}
                    disabled={props?.viewDetails?.completed === true}
                  >
                    <AddIcon
                      style={{
                        fontSize: "19",
                        color: "#fff",
                        paddingTop: "8px",
                      }}
                    />
                  </Fab>
                </span>
              </Tooltip>
            </div>

            <MRT_ShowHideColumnsButton table={table} />
          </Grid>
        </Grid>
      </>
    );
  };

  // new table code start

  const columns = useMemo(
    () => [
      {
        accessorKey: "updatedOn",
        header: t("date"),

        size: 70,
        Cell: ({ cell }) => <span className="text-m ">{cell.getValue()}</span>,
      },
      {
        accessorKey: "status",
        header: t("status"),

        size: 60,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },

      {
        accessorKey: "message",
        header: t("instruction"),

        size: 120,
        Cell: ({ cell }) => {
          const description = cell.getValue();
          const words = description?.split(" ");
          const truncateDescription = words?.slice(0, 9).join(" ");

          return (
            <CustomWidthTooltip title={description}>
              <span className="text-m">
                {truncateDescription}
                {description?.length > 30 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },
    ],
    [Cookies.get("i18next")]
  );
  const dispatch = useDispatch();
  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const previousInstructionsFun = () => {
    props
      .PreviousStatus(props.rowData.id, "", pageSize, currentPage, role, false)
      .then((resp) => {
        let tmpArr = [];

        try {
          if (!resp.error) {
            setTotalCount(
              resp?.response?.length != null ? resp?.response?.length : 0
            );

            tmpArr = resp?.response?.content.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });

            setRowData(tmpArr);
          } else {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((error) => {
        callMessageOut(error.message);
      });
  };

  const statusUpdate = ["In-Progress", "50% Completed", "Completed"];

  const validationSchema = yup.object({
    message: yup
      .string()

      .required("Comment Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      status: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      statusUpdates(values);
      formik.handleReset();
    },
  });

  useEffect(() => {
    previousInstructionsFun();
  }, [pageSize, currentPage]);

  const statusUpdates = (data) => {
    setLoading(true);
    props
      .updateStatus(data, props.rowData.id, role)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
          } else {
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("status_has_been_updated_successfully")} !`
              )
            );
            setLoading(false);
            addInstructionFunClose();
            previousInstructionsFun();
          }
        } catch (error) {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        callMessageOut(res.error);
      });
  };

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-statusupdate");
    adjustableDiv.style.height = viewportHeight - 172 + "px";
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
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <AssignerInstruction rowData={props.rowData} />
        </Grid>
        <Grid item xs={6}>
          <Paper
            elevation={3}
            style={{
              position: "relative",
              borderRadius: "8px",
            }}
            id="material-table"
          >
            <MaterialReactTable
              data={rowData}
              manualPagination
              columns={columns}
              initialState={{
                density: "compact",
              }}
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
              enableBottomToolbar={false}
              enableColumnResizing
              enableStickyHeader
              enableFilters={false}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              renderTopToolbar={({ table }) => (
                <CustomToolbarMarkup table={table} />
              )}
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
                id: "mrt-statusupdate",
              })}
              muiTablePaperProps={() => ({
                sx: {
                  padding: "0rem 1rem",
                  border: "0",
                  background: theme ? "#424242" : "white",
                },
              })}
              muiTableHeadRowProps={{
                sx: {
                  background: theme ? "#938f8f" : "white",
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
        </Grid>
      </Grid>

      <Dialog
        open={addInstruction}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        className="status_to_assigner"
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          {t("update_status")}
          <Tooltip title={t("cancel")}>
            <IconButton
              id="update_status"
              aria-label="close"
              onClick={addInstructionFunClose}
              color="primary"
              className="cancel-drag"
            >
              <CancelIcon
                style={{
                  color: theme ? "#fff" : "inherit",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <form>
          <DialogContent dividers>
            <Autocomplete
              options={statusUpdate}
              onChange={(e, value) => {
                formik.setFieldValue("status", value);
              }}
              value={formik.values.status}
              name="status"
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="STATUS"
                  fullWidth
                  margin="dense"
                />
              )}
            />

            <TextField
              margin="dense"
              style={{ marginTop: "1.2rem" }}
              size="small"
              variant="outlined"
              label=" UPDATE STATUS"
              multiline
              fullWidth
              minRows={12}
              maxRows={12}
              name="message"
              onChange={formik.handleChange}
              value={formik.values.message}
              error={formik.touched.message && Boolean(formik.errors.message)}
              helperText={formik.touched.message && formik.errors.message}
            />
          </DialogContent>
          <DialogActions>
            <>
              <Button
                endIcon={<DoneIcon />}
                color="primary"
                variant="contained"
                type="submit"
                onClick={formik.handleSubmit}
                style={{
                  backgroundColor: loading ? "#f0f0f0" : "",
                }}
                disabled={loading}
              >
                {loading ? (
                  <>
                    LOADING
                    <CircularProgress size={24} />
                  </>
                ) : (
                  t("update")
                )}
              </Button>
            </>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  previousInstructions,
  updateStatus,
  PreviousStatus,
})(StatusUpdatedToAssigner);
