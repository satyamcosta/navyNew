import React, { useCallback, useEffect, useState } from "react";
import GenericSearch from "app/views/utilities/GenericSearch";
import ClearRoundedIcon from "@material-ui/icons/ClearRounded";
import {
  Paper,
  Grid,
  Tooltip,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  IconButton,
  TableHead,
  Fab,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";

import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import "./Style.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { FieldArray, Formik, useFormik } from "formik";
import * as yup from "yup";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  createDepartment,
  editDepartmentById,
  getAllDepartmentdata,
  getDepartmentById,
  getDepartmentByName,
} from "app/redux/actions/AdminDepartment/CreateDepartment";
import {
  getRoleByDepartmentName,
  getRoleByName,
} from "app/redux/actions/AdminDepartment/CreateRoles";
import Draggable from "react-draggable";
import DepartmentsRole from "./DepartmentsRole";
import { debounce } from "utils";
import EditIcon from "@mui/icons-material/Edit";
import { useRef } from "react";

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

const DepartmentSetting = (props) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [rolesDialog, setRolesDialog] = useState(false);
  const [departMentAddDialoge, setDepartmentDialog] = useState(false);
  const [departMentEdit, setDepartMentEdit] = useState("");
  const [selectRowDept, setSelectRowDept] = useState("");
  const formikRef = useRef(null);

  const dispatch = useDispatch();

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
  const StatusOption = [
    "In Progress",
    "Approved",
    "Draft",
    "Rejected",
    "Return",
  ];
  const classObj = {
    Container: "",
    ChipContainer: "PaChipCon",
    FilterInpContainer: "PaFilterInputs",
  };

  const SortValueTypes = [
    {
      name: "oldFile",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Old FileName",
      color: "primary",
    },
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "caseNumber",
      type: "text",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Case Number",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "CreatedOn",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Status",
      color: "primary",
    },
  ];
  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});

  const { theme } = useSelector((state) => state);

  // generic search

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
      name: "department",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

  const addFilter = (e, type, value) => {
    dispatch(getRoleByName(value, type));
    
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

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;

    let tempArr = rowData.data?.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  // open and close dialoge function
  const handleClickDepartmentOpen = (value, booleanValue) => {
    setDepartmentDialog(true);
    dispatch(getDepartmentById(value.id));
    setDepartMentEdit(booleanValue);
  };

  const handleClickDepartmentClose = () => {
    setDepartmentDialog(false);
  };

  // create department function

  const createDepartments = (values) => {
    let departmentData = [];
    departmentData.push(values);
    dispatch(createDepartment(departmentData));
  };

  // edit department function
  const editDepartments = (values) => {
    dispatch(editDepartmentById(values));
  };

  // get department data
  useEffect(() => {
    dispatch(getAllDepartmentdata(""));
  }, []);

  const allDepartmentsData = useSelector(
    (state) => state.createDepartmentReducer.departmentData
  );
  
  const searchDept = useSelector((state) => state);

  const editDepartment = useSelector(
    (state) => state.getDepartmentById.departmentBYid
  );

  // formik validation and handleSubmit function

  // useEffect(() => {
  //   if (editDepartment) {
  //     formik.setValues({
  //       deptName: editDepartment.deptName,
  //       blockNo: editDepartment.blockNo,
  //       cau: editDepartment.cau,
  //       deptAdminRole: editDepartment.deptAdminRole,
  //       deptCoordRole: editDepartment.deptCoordRole,
  //       deptDisplayName: editDepartment.deptDisplayName,
  //       branch: editDepartment.branch,
  //       section: editDepartment.section,
  //       subSection: editDepartment.subSection,
  //       reportsTo: editDepartment.reportsTo,
  //       id: editDepartment.id,
  //     });
  //   }
  // }, [editDepartment]);

  const validationSchema = yup.object().shape({
    blockNo: yup
      .string()
      .matches(/^[0-9-]+$/, "Invalid input format")
      .required("Range is required")
      .test("is-valid-range", "Invalid range format", (value) => {
        if (!value) return true; // Allow empty value

        // Split the value by the hyphen
        const values = value.split("-").map(Number);

        // Check if there's only one value or if the first value is less than the second (if a hyphen is present)
        return (
          values.length === 1 || (values.length === 2 && values[0] < values[1])
        );
      }),
    subSection: yup.array().of(
      yup.object().shape({
        subsection: yup
          .string()

          .test(
            "is-valid-subsection",
            "Subsection range does not match Block range",
            (value, context) => {
              // Get the current blockNo value
              const blockNo = context?.parent?.blockNo;

              if (!blockNo) return true; // No blockNo provided, allow any subsection

              // Parse the blockNo range
              const blockNoValues = blockNo.split("-").map(Number);

              // If blockNo is not in the correct format or not a valid range, allow any subsection
              if (
                blockNoValues.length !== 2 ||
                blockNoValues[0] >= blockNoValues[1]
              ) {
                return true;
              }

              // Parse the subsection range
              const subSectionValues = value.split("-").map(Number);

              // Check if subsection range is within the blockNo range
              return (
                subSectionValues.length === 2 &&
                subSectionValues[0] >= blockNoValues[0] &&
                subSectionValues[1] <= blockNoValues[1]
              );
            }
          ),
      })
    ),
  });

  let empty = { subsection: "" };
  const initialValues = {
    blockNo: "",
    cau: "",
    deptAdminRole: "",
    deptCoordRole: "",
    deptDisplayName: "",
    branch: "",
    section: "",
    subSection: [empty],
    deptName: "",
    reportsTo: "",
  };

  // const   initialValues =  {

  //   },
  // validationSchema: validationSchema,

  // onSubmit: (values) => {
  //   if (departMentEdit === true) {
  //     editDepartments(values);
  //   } else {
  //     createDepartments(values);
  //   }
  //   handleClickDepartmentClose();

  //   formik.resetForm();
  // },
  // });

  const handleSubmit = (values) => {
    createDepartments(values);
  };

  const [data, setDta] = useState("");

  const handleChangeDeptSearchFun = (e, value) => {
    if (value) {
      dispatch(getAllDepartmentdata(data));
    } else {
      dispatch(getAllDepartmentdata(""));
    }
  };

  const getDepartmentByNameFun = (value) => {
    dispatch(getRoleByName(value, "department"));
    setDta(value);
  };

  const optimizedFn = useCallback(debounce(getDepartmentByNameFun), []);

  const CustomToolbarMarkup = () => (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 1rem",
            }}
          >
            <Typography
              variant="button"
              align="center"
              color="primary"
              style={{
                fontSize: "1.2rem",
                fontFamily: "inherit !important",
                marginRight: "1rem",
              }}
            >
              <span className="heading-font"> {t("DEPARTMENTS")}</span>
            </Typography>
            <GenericSearch
              FilterTypes={FilterTypes}
              FilterValueTypes={FilterValueTypes}
              addFilter={addFilter}
              cssCls={{}}
            />

            <Tooltip title={t("Add Department")}>
              <Fab
                style={{
                  // position: "absolute",
                  marginLeft: "1rem",
                  // right: "1.5rem",
                  width: "2.2rem",
                  height: ".1rem",
                  backgroundColor: "rgb(230, 81, 71)",
                }}
                onClick={() => handleClickDepartmentOpen(false)}
              >
                <AddIcon style={{ fontSize: "19", color: "#fff" }} />
              </Fab>
            </Tooltip>
          </div>
        </Grid>
      </Grid>
    </>
  );

  // roles dialog function

  const handleClickRolesOpen = (item) => {
    setRolesDialog(true);
    setSelectRowDept(item.deptName);
    dispatch(getRoleByDepartmentName(item.deptName));
  };

  const handleClickRolesClose = () => {
    setRolesDialog(false);
  };

  return (
    <div className="cabinate_container getdecision">
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
          // paddingTop: "1rem",
        }}
      >
        {CustomToolbarMarkup()}
        <div
          style={{
            padding: "0 1rem",
            marginTop: "1rem",
          }}
        >
          {" "}
          <TableContainer
            component={Paper}
            style={{
              border: `1px solid ${theme ? "#727070" : "#c7c7c7"}`,
              borderRadius: "6px",
              // height: "calc(100vh - 430px)",
            }}
          >
            <Table
              component="div"
              className="App-main-table"
              aria-label="simple table"
              hover
            >
              <TableHead component="div">
                <TableRow
                  component="div"
                  style={{
                    backgroundColor: theme ? "#e5e5e5" : "#e5e5e5",
                  }}
                >
                  <div
                    className="create-department-header"
                    style={{
                      borderBottom: `1px solid ${
                        theme ? "#727070" : "#c7c7c7"
                      }`,
                      backgroundColor: theme ? "#e5e5e5" : "#e5e5e5",
                      padding: ".4rem",
                    }}
                  >
                    <div></div>
                    <div>
                      <span>{t("DEPARTMENT")}</span>
                    </div>
                    <div>
                      <span>{t(" DISPLAY USER NAME")}</span>
                    </div>

                    <div>
                      <span>{t("BRANCH")}</span>
                    </div>
                    <div>
                      <span>{t("CAU")}</span>
                    </div>

                    <div>
                      <span>{t(" CORD ROLE")}</span>
                    </div>

                    <div></div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                style={{ height: "calc(100vh - 290px)", overflow: "auto" }}
              >
                {allDepartmentsData &&
                  allDepartmentsData
                    .slice(
                      currentPage * pageSizes + 1,
                      (currentPage + 1) * pageSize
                    )
                    .map((item, i) => {
                      return (
                        <TableRow
                          hover
                          component="div"
                          key={i}
                          style={{
                            borderBottom: "1px solid #8080805c",
                            position: "relative",
                          }}
                        >
                          <div className="create-department-header InboxCon">
                            <div>
                              <span>{i + 1}</span>
                            </div>

                            <div>
                              <span>{item.deptName}</span>
                            </div>
                            <div>
                              <span>{item.deptDisplayName}</span>
                            </div>

                            <div>
                              <span>{item.branch}</span>
                            </div>

                            <div>
                              <span>{item.cau}</span>
                            </div>

                            <div>
                              <span>{item.deptCoordRole}</span>
                            </div>
                            <div className="InboxIcons">
                              <>
                                <Tooltip title="VIEW USER" placement="bottom">
                                  <IconButton
                                    className="InboxBtn"
                                    size="small"
                                    onClick={() => handleClickRolesOpen(item)}
                                  >
                                    <VisibilityIcon
                                      style={{ fontSize: "20px" }}
                                      color="primary"
                                    />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="EDIT USER" placement="bottom">
                                  <IconButton
                                    className="InboxBtn"
                                    size="small"
                                    onClick={() =>
                                      handleClickDepartmentOpen(item, true)
                                    }
                                  >
                                    <EditIcon
                                      style={{ fontSize: "20px" }}
                                      color="primary"
                                    />
                                  </IconButton>
                                </Tooltip>
                              </>
                            </div>
                          </div>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
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
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        open={departMentAddDialoge}
        onClose={() => {
          handleClickDepartmentClose();
          // formik.handleReset();
        }}
      >
        <div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            innerRef={formikRef}
          >
            {(formik) => (
              <>
                <DialogTitle
                  style={{ cursor: "move" }}
                  id="draggable-dialog-title"
                >
                  <span className="heading-font">
                    {" "}
                    {t(departMentEdit ? "EDIT DEPARTMENT" : "ADD DEPARTMENT")}
                  </span>
                  <IconButton
                    id="add_department"
                    aria-label="close"
                    onClick={handleClickDepartmentClose}
                    color="primary"
                    style={{ float: "right", padding: "5px !important" }}
                  >
                    <CancelIcon style={{ color: "#484747" }} />
                  </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                  <Grid
                    container
                    className="create-contact-container"
                    spacing={2}
                  >
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="branch"
                        name="branch"
                        label={t("BRANCH")}
                        type="text"
                        size="small"
                        variant="outlined"
                        value={formik.values.branch}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.branch && Boolean(formik.errors.branch)
                        }
                        helperText={
                          formik.touched.branch && formik.errors.branch
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="cau"
                        name="cau"
                        label={t("CAU")}
                        type="text"
                        size="small"
                        variant="outlined"
                        value={formik.values.cau}
                        onChange={formik.handleChange}
                        error={formik.touched.cau && Boolean(formik.errors.cau)}
                        helperText={formik.touched.cau && formik.errors.cau}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="deptName"
                        name="deptName"
                        label={t("DEPARTMENT/SECTION NAME")}
                        size="small"
                        variant="outlined"
                        value={formik.values.deptName}
                        onChange={departMentEdit ? "" : formik.handleChange}
                        error={
                          formik.touched.deptName &&
                          Boolean(formik.errors.deptName)
                        }
                        helperText={
                          formik.touched.deptName && formik.errors.deptName
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        id="deptDisplayName"
                        name="deptDisplayName"
                        label={t("DEPARTMENT DISPLAY NAME")}
                        type="text"
                        size="small"
                        variant="outlined"
                        value={formik.values.deptDisplayName}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.deptDisplayName &&
                          Boolean(formik.errors.deptDisplayName)
                        }
                        helperText={
                          formik.touched.deptDisplayName &&
                          formik.errors.deptDisplayName
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      {/* <TextField
                  fullWidth
                  id="deptCoordRole"
                  name="deptCoordRole"
                  label={t("DEPARTMENT COORD ROLE")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.deptCoordRole}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.deptCoordRole &&
                    Boolean(formik.errors.deptCoordRole)
                  }
                  helperText={
                    formik.touched.deptCoordRole && formik.errors.deptCoordRole
                  }
                /> */}
                    </Grid>
                    {/* <Grid item xs={6}>
                  <TextField
                  fullWidth
                  id="deptAdminRole"
                  name="deptAdminRole"
                  label={t("DEPARTMENT ADMIN ROLE")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.deptAdminRole}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.deptAdminRole &&
                    Boolean(formik.errors.deptAdminRole)
                  }
                  helperText={
                    formik.touched.deptAdminRole && formik.errors.deptAdminRole
                  }
                />
                  </Grid> */}
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        id="blockNo"
                        name="blockNo"
                        label={t("BLOCK NUMBER")}
                        type="text"
                        size="small"
                        variant="outlined"
                        error={
                          formik.touched.blockNo &&
                          Boolean(formik.errors.blockNo)
                        }
                        helperText={
                          formik.touched.blockNo && formik.errors.blockNo
                        }
                        {...formik.getFieldProps("blockNo")}
                        InputProps={{
                          onInput: (e) => {
                            const newValue = e.target.value.replace(
                              /[^0-9-]/g,
                              ""
                            ); // Remove non-digit and non-hyphen characters
                            e.target.value = newValue;
                            formik.handleChange(e); // Manually update Formik's field value
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Paper
                        variant="outlined"
                        style={{
                          overflow: "auto",
                          maxHeight: "120px",
                          marginTop: "6px",
                          width: "100%",
                          padding: "8px",
                        }}
                      >
                        <FieldArray name="subSection">
                          {({ insert, remove, push }) => (
                            <div>
                              {formik.values.subSection &&
                                formik.values.subSection.map(
                                  (contact, index) => (
                                    <div key={index}>
                                      <Grid container className="space_grid">
                                        <Grid item xs={6}>
                                          <TextField
                                            name={`subSection[${index}].subsection`}
                                            id="standard-textarea"
                                            label="ADD NOTE"
                                            onChange={formik.handleChange}
                                            value={
                                              formik.values.subSection[index]
                                                .subsection
                                            }
                                            error={
                                              formik.touched.subSection &&
                                              formik.touched.subSection[
                                                index
                                              ] &&
                                              Boolean(
                                                formik.errors.subSection
                                              ) &&
                                              Boolean(
                                                formik.errors.subSection[index]
                                                  ?.subsection
                                              )
                                            }
                                            helperText={
                                              formik.touched.subSection &&
                                              formik.touched.subSection[
                                                index
                                              ] &&
                                              formik.errors.subSection &&
                                              formik.errors.subSection[index]
                                                ?.subsection
                                            }
                                            fullWidth
                                            variant="outlined"
                                            size="small"
                                            className="file_Name"
                                          />
                                        </Grid>

                                        <IconButton
                                          onClick={() => push(empty)}
                                          style={{
                                            marginTop: "2 px",
                                            width: "1rem",
                                            height: " 1rem",
                                            backgroundColor: "rgb(230, 81, 71)",
                                          }}
                                        >
                                          <AddIcon
                                            style={{
                                              fontSize: "19",
                                              color: "#fff",
                                            }}
                                          />
                                        </IconButton>
                                      </Grid>
                                    </div>
                                  )
                                )}
                            </div>
                          )}
                        </FieldArray>
                      </Paper>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    className="reset-button"
                    type="reset"
                    // onClick={() => handleReset(formik)}
                    variant="contained"
                    color="primary"
                    disableElevation
                    // endIcon={<UndoIcon />}
                  >
                    RESET
                  </Button>
                  <Button
                    className="save-button"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disableElevation
                    style={{ backgroundColor: " #FFAF38", color: "black" }}
                    // endIcon={<DoneIcon />}
                    onClick={formik.handleSubmit}
                  >
                    SAVE
                  </Button>
                </DialogActions>
              </>
            )}
          </Formik>
        </div>
      </Dialog>

      {/* departments role dialog */}
      <Dialog
        className="role-dialog"
        open={rolesDialog}
        onClose={handleClickRolesClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DepartmentsRole
          handleClickRolesClose={handleClickRolesClose}
          handleClickRolesOpen={handleClickRolesOpen}
          selectRowDept={selectRowDept}
        />
      </Dialog>
    </div>
  );
};

export default DepartmentSetting;
