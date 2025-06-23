import React, { useState, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  TextField,
  Grid,
  Button,
  DialogContent,
  DialogActions,
  TableContainer,
  Table,
  TableBody,
  FormControlLabel,
  Radio,
  Paper,
  TableRow,
  Typography,
  Box,
  debounce,
} from "@material-ui/core";
import { useFormik } from "formik";
import * as Yup from "yup";
import DoneIcon from "@material-ui/icons/Done";
import UndoIcon from "@material-ui/icons/Undo";
import {
  personalFileFormData,
  updateSubjectFileForm,
  getbyfilename,
  getIndexFiles,
} from "../../camunda_redux/redux/action";
import { changingTableState } from "../../camunda_redux/redux/action/apiTriggers";
import { connect as reduxConnect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { setRefresh } from "../../redux/actions/RefreshActions";
import { useTranslation } from "react-i18next";
import {
  CHANGE_PA_FILE,
  UPDATE_FILE_SUBJECT,
} from "app/camunda_redux/redux/constants/ActionTypes";
import { Loading } from "./therme-source/material-ui/loading";
import "./therme-source/material-ui/loading.css";
import PaginationComp from "../utilities/PaginationComp";
import GenericSearch from "../utilities/GenericSearch";
import GenericChip from "../utilities/GenericChips";
import { unstable_batchedUpdates } from "react-dom";

const useStyles = makeStyles((theme) => ({
  btnGrid: {
    textAlign: "right",
    marginTop: theme.spacing(4),
  },
}));

const PersonalFileForm = (props) => {
  // Again same component for both pa and corresspondence
  const { correspondence } = props;

  const { t } = useTranslation();
  const classes = useStyles();

  const username = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");

  const [fileArr, setfileArr] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [blnDisable, setBlnDisable] = useState(() => {
    return correspondence ? true : false;
  });
  const [tableId, setTableId] = useState({});
  const [loading, setloading] = useState(false);
  const [Filter, setFilter] = useState({});

  const { changeFile } = useSelector((state) => state);

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "subject",
      label: "Subject",
    },
    // {
    //   value: "status",
    //   label: "Classification",
    // },
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

  const StatusOption = ["Unclassified", "Restricted"];

  const FilterValueTypes = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
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
      name: "range",
      type: "range",
      size: "small",
      variant: "outlined",
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
        // setCurrentPage(0);
        // setPageSize(10);
      });
    }
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  const nofHandleClick = (e, rowData) => {
    setTableId(rowData);
    setBlnDisable(false);
  };

  const dispatch = useDispatch();

  const configData = {
    fullWidth: true,
    size: "small",
    className: classes.textField,
  };

  const bodyFormData = (val) => {
    const dept = sessionStorage.getItem("pklDirectrate");
    let formData = new FormData();
    let startIndex = currentPage * pageSize + 1;
    let endIndex = pageSize * (currentPage + 1);

    formData.append("pkldirectorate", dept);
    formData.append("filename", val || "");
    formData.append("fileno", "");
    formData.append("startIndex", startIndex);
    formData.append("endIndex", endIndex);
    return formData;
  };

  const INITIAL_STATE = {
    subject: props.updateSubject ? props.fileSubject : "",
    pfileName: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim(t("no_spaces_allowed_at_the_start_and_end"))
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
  });

  useEffect(() => {
    let indexAbort = new AbortController();
    if (correspondence) {
      loadData(indexAbort.signal);
    }
    return () => {
      indexAbort.abort();
    };
  }, [correspondence, pageSize, currentPage, Filter]);

  const loadData = (abortSignal) => {
    setloading(true);
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
    props
      .getIndexFiles(pageSize, currentPage, filter, {}, abortSignal)
      .then((res) => {
        if (res?.error?.includes("aborted")) {
          return;
        }
        try {
          if (res?.error) {
            callMessageOut(res?.error);
            setloading(false);
            return;
          } else {
            setfileArr(res?.response?.content);
            setTotalCount(res?.response?.totalElements);
            setloading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setloading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setloading(false);
      });
  };

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: correspondence ? "" : VALIDATION_SCHEMA,
    onSubmit: (values) => {
      setBlnDisable(true);
      setloading(true);
      if (correspondence) {
        props.selectNof(tableId);
      } else {
        let data = { ...values, subject: values.subject.trim() };
        props.updateSubject
          ? props
            .updateSubjectFileForm(formik.values.subject, props.fileId)
            .then(async (res) => {
              try {
                if (res.error) {
                  callMessageOut("error", res.error);
                  setloading(false);
                } else {
                  props.handleClose();
                  setBlnDisable(false);
                  dispatch({
                    type: UPDATE_FILE_SUBJECT,
                    payload: {
                      subject: formik.values.subject,
                      id: props.fileId,
                    },
                  });
                  setloading(false);
                  callMessageOut(
                    "success",
                    t("personal_application_updated_successfully")
                  );
                }
              } catch (error) {
                callMessageOut("error", error.message);
                setloading(false);
              }
            })
          : props
            .personalFileFormData({
              ...data,
              userName: username,
              roleName: role,
            })
            .then(async (res) => {
              props.handleClose();
              setBlnDisable(false);
              if (res.error) {
                callMessageOut("error", res.error);
                setloading(false);
                return;
              } else {
                setTimeout(() => {
                  let trigger = true;
                  props.changingTableState(trigger, "CHANGE_PA_FILE");
                }, 0);
                dispatch({ type: CHANGE_PA_FILE, payload: true });
                await props.setRefresh(true);
                setloading(false);
                callMessageOut(
                  "success",
                  `${t("personal")} ${t("file_created_successfully!")}`
                );
              }
            });
      }
    },
  });

  const callMessageOut = (type, msg) => {
    dispatch(setSnackbar(true, type, msg));
  };

  const handleSearch = (e, rows) => {
    const { value } = e.target;
    if (value && value.length > 2 && value.trim()) {
      loadData(value);
    } else if (!value) {
      loadData();
    }
  };

  const optimizedSearch = useCallback(debounce(handleSearch), []);

  return (
    <div classes={classes.root}>
      {loading && <Loading />}
      <div
        className="header-input"
        style={{
          width: "fit-content",
          padding: "0px 20px 10px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
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
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          {correspondence ? (
            <>
              {/*
                <Typography
                style={{
                  textAlign: "center",
                  paddingBottom: "1rem",
                  opacity: ".7",
                }}
              >
                {t("please_select_the_file_to_create_partcase_form")}
              </Typography>
                */}

              {/*
                <Box className="nof-search" component="h4">
                <TextField
                  id="outlined-basic"
                  label={t("search_nof")}
                  fullWidth
                  onChange={optimizedSearch}
                  placeholder={t("search_by_file_name")}
                  variant="outlined"
                  size="small"
                  className={props.theme ? "darkTextField" : ""}
                />
              </Box>
                */}
              <TableContainer
                component={Paper}
                className="inbox-tab"
                elevation={3}
                style={{
                  position: "relative",
                  borderRadius: "9px",
                  border: `1px solid ${props.theme ? "#727272" : "#c7c7c7"}`,
                }}
              >
                <Table component="div" className="App-main-table">
                  <div>
                    <div
                      className="nof_table_row head"
                      style={{
                        borderBottom: `1px solid #8080805c`,
                        display: "grid",
                        gridTemplateColumns: "2rem 1fr 1fr",
                        background: "#b1b1b15c",
                      }}
                    >
                      <div></div>
                      <div>
                        <span>{t("file_no")}</span>
                      </div>
                      <div>
                        <span>{t("subject")}</span>
                      </div>
                    </div>
                  </div>
                  <TableBody
                    component="div"
                    style={{
                      height: "30vh",
                      overflow: "auto",
                    }}
                  >
                    {/* Mapping data coming from backnd */}

                    {fileArr?.length > 0 &&
                      fileArr?.map((item, i) => {
                        return (
                          <TableRow
                            id="paTableRow"
                            component="div"
                            key={i}
                            selected={item.id === tableId.id}
                            style={{ backgroundColor: i % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit", cursor: "pointer" }}
                            className={item.id == tableId.id ? "active" : ""}
                          >
                            <div
                              className="nof_table_row"
                              style={{
                                borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"
                                  }`,
                                display: "grid",
                                gridTemplateColumns: "2rem 1fr 1fr",
                                alignItems: "center",
                              }}
                            >
                              <div className="checkbox">
                                <FormControlLabel
                                  control={
                                    <Radio
                                      checked={item.id == tableId.id}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        nofHandleClick(e, item);
                                      }}
                                    />
                                  }
                                />
                              </div>
                              <div className="info1">
                                <span>{item.file}</span>
                              </div>
                              <div className="info2">
                                <span>{item.subject}</span>
                              </div>
                            </div>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
                <PaginationComp
                  pageSize={pageSize}
                  pageSizes={[5, 10, 15]}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  totalCount={totalCount}
                  setPageSize={setPageSize}
                />
              </TableContainer>
            </>
          ) : (
            <TextField
              {...configData}
              variant="outlined"
              multiline
              minRows={3}
              className={props.theme ? "darkTextField" : ""}
              name="subject"
              label={t("pf_subject")}
              value={formik.values.subject}
              onChange={formik.handleChange}
              error={formik.touched.subject && Boolean(formik.errors.subject)}
              helperText={formik.touched.subject && formik.errors.subject}
              autoFocus
            />
          )}
        </DialogContent>
        <DialogActions>
          {/*
          <Button
            id="PA_fileForm_reset"
            color="primary"
            variant="contained"
            style={{ marginLeft: "1rem" }}
            onClick={formik.handleReset}
            endIcon={<UndoIcon />}
          >
            {t("reset")}
          </Button>
          */}
          <Button
            id="personalFile_update"
            color="secondary"
            variant="contained"
            type="submit"
            style={{ marginLeft: "1rem" }}
            endIcon={<DoneIcon />}
            disabled={blnDisable}
          >
            {props.updateSubject ? t("update").toUpperCase() : t("save")}
          </Button>
        </DialogActions>
      </form>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default reduxConnect(mapStateToProps, {
  personalFileFormData,
  changingTableState,
  setRefresh,
  updateSubjectFileForm,
  getbyfilename,
  getIndexFiles,
})(PersonalFileForm);
