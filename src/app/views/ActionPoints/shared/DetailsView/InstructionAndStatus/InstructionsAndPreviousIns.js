import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Draggable from "react-draggable";
import Box from "@material-ui/core/Box";
import SwipeableViews from "react-swipeable-views";
import * as yup from "yup";
import CloseIcon from "@material-ui/icons/Close";
import { FcHighPriority, FcLowPriority } from "react-icons/fc";
import {
  Button,
  DialogActions,
  Grid,
  TextField,
  DialogContent,
  Dialog,
  Typography,
  IconButton,
  DialogTitle,
  FormControl,
  Paper,
  CircularProgress,
} from "@material-ui/core";
import PaginationComp from "app/views/utilities/PaginationComp";

import { useTranslation } from "react-i18next";
import DoneIcon from "@material-ui/icons/Done";
import "../../index.css";
import {
  givenInstruction,
  previousInstructions,
} from "app/camunda_redux/redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import Cookies from "js-cookie";
import { useFormik } from "formik";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import TripleToggleSwitch from "app/views/Personnel/PrioritySwitch/Three";
import { handleError } from "utils";
import CancelIcon from "@material-ui/icons/Cancel";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box>{children}</Box>}
    </div>
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

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
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

function UpdateStatusTab(props) {
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChangeIndex = (index) => {
    setValue(index);
  };
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const actionId = props.id;

  const validationSchema = yup.object({
    description: yup
      .string()

      .required("Instruction Is Required"),
  });

  const formik = useFormik({
    initialValues: {
      description: "",
      priority: "medium",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      giveInstructionFun(values);
    },
  });

  useEffect(() => {
    previousInstructionsFun();
  }, [pageSize, currentPage]);

  const giveInstructionFun = (data) => {
    setLoading(true);

    props
      .givenInstruction(data, actionId, "")
      .then((res) => {
        try {
          if (!res.error) {
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("instruction_add_successfully")} !`
              )
            );
            setLoading(false);
            props.updateStatushandleClose();
          } else {
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            setLoading(false);
            props.updateStatushandleClose();
          }
        } catch (error) {
          callMessageOut(error.error);
          setLoading(false);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
        setLoading(false);
      });
  };

  const previousInstructionsFun = () => {
    props
      .previousInstructions(actionId, true)
      .then((resp) => {
        try {
          let tmpArr = [];

          if (!resp.error) {
            setTotalCount(
              resp?.response?.length != null ? resp?.response?.length : 0
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
        } catch (e) {
          callMessageOut(e.error);
        }
      })

      .catch((error) => {
        callMessageOut(error.error);
      });
  };

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const handleChangePriority = (type) => {
    formik.setFieldValue("priority", type);
  };

  // for show previous status table

  const columns = useMemo(
    () => [
      {
        accessorKey: "instructedOn",
        header: t("date"),

        size: 60,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "description",
        header: t("instruction"),

        size: 200,
        Cell: ({ cell }) => {
          const message = cell.getValue();
          const words = message.split(" ");
          const truncatedMessage = words.slice(0, 18).join(" ");

          return (
            <CustomWidthTooltip title={message}>
              <span className="text-m">
                {truncatedMessage}
                {message.length > 200 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },
    ],
    [Cookies.get("i18next")]
  );

  return (
    <div className={classes.root}>
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
          width: "721px",
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
            <Tab label={t("instruction")} {...a11yProps(0)} />
            <Tab label={t("pre_instruction")} {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel
            value={value}
            index={0}
            dir={theme.direction}
            style={{ overflow: "hidden" }}
          >
            <form>
              <TextField
                style={{ marginTop: "10px" }}
                size="small"
                variant="outlined"
                label={t("instruction")}
                multiline
                fullWidth
                minRows={14}
                maxRows={14}
                id="description"
                name="description"
                onChange={formik.handleChange}
                value={formik.values.description}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  gap: "5rem",
                  justifyContent: "start",
                  marginTop: "2rem",
                }}
              >
                <p>{t("select_priority")} :&nbsp;&nbsp;</p>

                <TripleToggleSwitch
                  priority={formik.values.priority}
                  handleChange={handleChangePriority}
                />
              </div>
            </form>
          </TabPanel>
          <TabPanel
            value={value}
            index={1}
            dir={theme.direction}
            className="open-task"
          >
            <Paper
              elevation={3}
              style={{
                borderRadius: "4px",
                marginTop: "10px",

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
                    height: "38vh",
                    // marginTop: "1rem",
                  },
                  id: "mrt-instructiontable",
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
              t("submit")
            )}
          </Button>
        </>
      </DialogActions>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  previousInstructions,
  givenInstruction,
})(UpdateStatusTab);
