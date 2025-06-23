import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Draggable from "react-draggable";
import Box from "@material-ui/core/Box";
import SwipeableViews from "react-swipeable-views";
// import "../../../../meeting/shared/index.css";
import CloseIcon from "@material-ui/icons/Close";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  Button,
  DialogActions,
  Divider,
  Grid,
  TextField,
  DialogContent,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import PaginationComp from "app/views/utilities/PaginationComp";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { Autocomplete } from "@material-ui/lab";
import ViewPreviousStatus from "./ViewPreviousStatus";
import { useTranslation } from "react-i18next";
import DoneIcon from "@material-ui/icons/Done";
import "../../index.css";
import { updateStatus, PreviousStatus } from "app/camunda_redux/redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import * as yup from "yup";
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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </Box>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function UpdateStatusTab(props) {
  const role = sessionStorage.getItem("role");
  const actionId = props.id;
  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const { t } = useTranslation();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [loading, setLoading] = useState(false);

  const statusUpdates = (data) => {
    setLoading(true);
    props
      .updateStatus(data, actionId, role)
      .then((res) => {
        try {
          if (res.error) {
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            setLoading(false);
          } else {
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("status_has_been_updated_successfully")} !`
              )
            );
            setLoading(false);
            props.updateStatushandleClose();
          }
        } catch (error) {
          callMessageOut(error.error);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
        setLoading(false);
      });
  };

  const validationSchema = yup.object({
    message: yup.string().required("Comment Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      status: "",
      message: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      statusUpdates(values);
    },
  });

  const statusUpdate = ["In-Progress", "Completed", "50% Completed"];

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  // previous Table
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);

  const previousStatusData = () => {
    props
      .PreviousStatus(props.id, "", pageSize, currentPage, role, false)
      .then((resp) => {
        let tmpArr = [];

        try {
          if (!resp.error) {
            setTotalCount(
              resp?.response?.totalElements != null
                ? resp?.response?.totalElements
                : 0
            );

            tmpArr = resp?.response?.content?.map((item, index) => {
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
          callMessageOut(error.error);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
      });
  };

  useEffect(() => {
    previousStatusData();
  }, [pageSize, currentPage]);

  // for show previous status table

  const columns = useMemo(
    () => [
      {
        accessorKey: "status",
        header: t("status"),

        size: 40,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "message",
        header: t("message"),

        size: 100,
        Cell: ({ cell }) => {
          const message = cell.getValue();
          const words = message.split(" ");
          const truncatedMessage = words.slice(0, 18).join(" ");

          return (
            <CustomWidthTooltip title={message}>
              <span className="text-m">
                {truncatedMessage} {message.length > 70 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },
    ],
    [Cookies.get("i18next")]
  );

  return (
    <>
      <Paper>
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h6" component="div">
            {t("update_status")}
            <IconButton
              aria-label="close"
              onClick={props.updateStatushandleClose}
              style={{
                float: "right",
                height: "45px",
                width: "45px",
                color: "#3131d5",
              }}
            >
              <Tooltip title={"close"} aria-label="close">
                <CancelIcon
                  style={{
                    color: props.theme ? "#fff" : "#484747",
                  }}
                />
              </Tooltip>
            </IconButton>
          </Typography>
        </DialogTitle>

        <DialogContent
          dividers
          style={{
            overflow: "hidden",
            width: "720px",
            height: "72vh",
          }}
        >
          <AppBar position="static" className=" statustab">
            <Tabs
              value={value}
              onChange={handleChange}
              textColor="primary"
              variant="fullWidth"
              aria-label="full width tabs example"
              TabIndicatorProps={{
                style: { display: "none" },
              }}
            >
              <Tab label={t("update_status")} {...a11yProps(0)} />
              <Tab label={t("pre_status")} {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={props.theme?.direction === "rtl" ? "x-reverse" : "x"}
            index={value}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel
              value={value}
              index={0}
              dir={props.theme.direction}
              style={{ overflow: "hidden" }}
            >
              <form>
                <Grid container>
                  <Grid item xs={12}>
                    <Autocomplete
                      id="tags-outlined"
                      options={statusUpdate}
                      // onChange={(e, value) => handleInputChange("status", value)}
                      onChange={(e, value) =>
                        formik.setFieldValue("status", value)
                      }
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={t("status")}
                          name="status"
                          fullWidth
                          style={{ marginTop: "10px" }}
                          value={formik.values.status}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      margin="dense"
                      style={{ marginTop: "1.2rem" }}
                      size="small"
                      variant="outlined"
                      label={t("enter_a_comment")}
                      multiline
                      fullWidth
                      minRows={12}
                      maxRows={12}
                      name="message"
                      onChange={formik.handleChange}
                      value={formik.values.message}
                      error={
                        formik.touched.message && Boolean(formik.errors.message)
                      }
                      helperText={
                        formik.touched.message && formik.errors.message
                      }
                    />
                  </Grid>
                </Grid>
              </form>
            </TabPanel>
            <TabPanel value={value} index={1} dir={props.theme.direction}>
              <Paper
                className="previous_status"
                // elevation={3}
                style={{
                  borderRadius: "4px",
                  marginTop: "10px",
                  boxShadow: "none",
                  border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
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
                  muiTableBodyRowProps={({ row ,staticRowIndex}) => ({
                    sx: {
                      cursor: "pointer",
                      // background: "inherit",
                      height: "10px",
                      backgroundColor: staticRowIndex%2?props.theme?"#4c5765":"#d6e0ec":"inherit"
                    },
                  })}
                  muiTableContainerProps={() => ({
                    sx: {
                      border: "1px solid #8080802b",
                      height: "37vh",
                    },
                  })}
                  muiTablePaperProps={() => ({
                    sx: {
                      padding: "1rem 1rem",
                      border: "0",
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
            </TabPanel>
          </SwipeableViews>
        </DialogContent>

        <DialogActions>
          <>
            <Button
              endIcon={<DoneIcon />}
              color="primary"
              variant="contained"
              type="submit"
              disabled={loading}
              style={{ visibility: value === 1 ? "hidden" : "visible" }}
              onClick={formik.handleSubmit}
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
        {/* </Dialog> */}
      </Paper>
    </>
  );
}

function mapStateToProps(state) {
  return {
    props: state.props,

    theme: state.theme,
  };
}

export default connect(mapStateToProps, { updateStatus, PreviousStatus })(
  UpdateStatusTab
);
