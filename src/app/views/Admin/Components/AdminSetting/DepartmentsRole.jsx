import React, { useState, useEffect, Fragment, useCallback } from "react";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import AddIcon from "@material-ui/icons/Add";
import CancelIcon from "@material-ui/icons/Cancel";
import { debounce } from "utils";
import { useTranslation } from "react-i18next";
import PaginationComp from "app/views/utilities/PaginationComp";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid";

import { FaUserEdit } from "react-icons/fa";
// import { getUsers } from "app/redux/actions/addAgendaAction";
import { getUsers } from "app/redux/actions/AdminDepartment/CreateRoles";
import { useFormik } from "formik";
import * as yup from "yup";
import "./Style.css";
import {
  Paper,
  Grid,
  Tooltip,
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Fab,
  TextField,
  IconButton,
  Button,
} from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import Draggable from "react-draggable";
import {
  assignRole,
  switchRole,
  createRoles,
  getRoleByName,
  getRoleByDepartmentName,
  ShowFilesOnRole,
} from "app/redux/actions/AdminDepartment/CreateRoles";
import { Autocomplete } from "@material-ui/lab";
import { valuesIn } from "lodash";
import { InputAdornment } from "@mui/material";
import GenericSearch from "app/views/utilities/GenericSearch";

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

const DepartmentsRole = (props) => {
  const [open, setOpen] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const { theme } = useSelector((state) => state);
  const [roleAddDialoge, setRoleAddDialoge] = useState(false);
  const [status, setStatus] = useState("");
  const [assignUserRole, setAssignUserRole] = useState("");
  const [roleEdit, setroleEdit] = useState("");
  const [selectRowRole, setSelectRowRole] = useState("");

  const [currentUserData, setCurrentUserData] = useState({
    userName: "",
    userRole: "",
  });

  const dispatch = useDispatch();

  const assignSwitchRoleHandleOpen = (username, userrole) => {
    setAssignUserRole(userrole.roleName);
    setStatus(username ? "SWITCH" : "ASSIGN");
    setOpen(true);
    setCurrentUserData({ userName: username, userRole: userrole.roleName });
  };

  const assignSwitchRoleHandleClose = () => {
    setOpen(false);
  };

  // open and close roles dialoge function
  const handleClickRolesOpen = (booleanValue, data) => {
    setroleEdit(booleanValue);
    setRoleAddDialoge(true);
    // dispatch(getRoleById(data.id));
  };

  const handleClickRolesClose = () => {
    setRoleAddDialoge(false);
  };

  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;

    let tempArr = rowData.data?.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  const { t } = useTranslation();

  const CustomToolbarMarkup = () => (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <Grid container>
          <Grid item xs={3}>
            <Typography
              variant="button"
              align="center"
              color="primary"
              style={{
                fontSize: "1rem",
              }}
            >
              <span className="heading-font">
                {" "}
                {t(`${props.selectRowDept.deptName}  ROLES`)}
              </span>
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <GenericSearch
              FilterTypes={FilterTypes}
              FilterValueTypes={FilterValueTypes}
              addFilter={addFilter}
              cssCls={{}}
            />
          </Grid>
          <Grid item xs={1}>
            <IconButton
              id="add_roles"
              aria-label="close"
              onClick={props.handleClickRolesClose}
              color="primary"
              style={{
                padding: "5px !important",
                position: "relative",
                top: "-.5rem",
              }}
            >
              <CancelIcon style={{ color: theme ? "#fff" : "#484747" }} />
            </IconButton>
          </Grid>
        </Grid>
      </div>
    </>
  );

  const allDepartmentsRoleData = useSelector(
    (state) => state.getDepartmentRole.departmentRoleData
  );

  const searchRole = useSelector(
    (state) => state.getRoleDeptByName.filetrRoleDeptData
  );

  // add roles function

  const createRole = (values) => {
    let rolesData = [];
    rolesData.push(values);
    dispatch(createRoles(rolesData, props.selectRowDept));
  };

  // formik validation for create roles
  const validationSchema = yup.object().shape({
    roleName: yup.string().required("Role name is Required"),
    displayRoleName: yup.string().required("User name is Required"),
    deptName: yup.string().required("Department name is Required"),
  });

  const formik = useFormik({
    initialValues: {
      roleName: "",
      displayRoleName: "",
      deptName: props.selectRowpklDirectorate,
    },
    // validationSchema: validationSchema,

    onSubmit: (values) => {
      createRole(values);
      handleClickRolesClose();

      formik.resetForm();
    },
  });

  // get user for add role
  const getMeetingUser = (value) => {
    dispatch(getUsers("", value));
  };
  const optimizedFn = useCallback(debounce(getMeetingUser), []);
  const searchUsers = useSelector((state) => state.getAllUsers.userData);

  const roleFormik = useFormik({
    initialValues: {
      roles: [],
    },
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      if (currentUserData.userName && assignUserRole) {
        switchRoleFun(values);
      } else {
        assignRoleFun(values);
      }
      assignSwitchRoleHandleClose();
      formik.resetForm({ values: "" });
    },
  });

  const roleHandleChange = (e, value) => {
    roleFormik.setFieldValue("roles", value);
  };

  const assignRoleFun = (values) => {
    const UserAssignValue = {
      userName: values.roles.deptUsername,
      roleName: assignUserRole,
    };

    dispatch(assignRole([UserAssignValue], props.selectRowDept.deptName, ""));
  };
  const switchRoleFun = (values) => {
    let newRole = values.roles?.deptUsername;

    dispatch(
      switchRole(
        currentUserData.userRole,
        currentUserData.userName,
        newRole,
        props.selectRowDept.deptName
      )
    );
  };

  const getRoleByNameFun = (value) => {
    dispatch(getRoleByName(value, "role"));
  };

  const handleChangeDeptSearchFun = (e, value) => {

    dispatch(getRoleByName(value.roleName, "role"));
  };
  const roleOptimizedFn = useCallback(debounce(getRoleByNameFun), []);

  const FilterOption = [
    {
      value: "Select Field",
      label: "",
    },
    {
      value: "role",
      label: "Role",
    },
  ];

  const FilterValueTypes = [
    {
      name: "role",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
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
  const [Filter, setFilter] = useState({});
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
  return (
    <Fragment className="roles-table">
      <DialogTitle>{CustomToolbarMarkup()}</DialogTitle>

      <DialogContent dividers>
        {" "}
        <Paper
          elevation={3}
          style={{
            position: "relative",
            borderRadius: "8px",
            // paddingTop: "1rem",
          }}
        >
          <div
            style={{
              padding: "1rem  1rem 0 1rem",
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
                      className="create-roles-header"
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
                        <span>{t("ROLE")}</span>
                      </div>
                      <div>
                        <span>{t("DISPALY NAME ")}</span>
                      </div>

                      <div>
                        <span>{t(" USER ID")}</span>
                      </div>
                      <div>
                        {" "}
                        <Tooltip title={t("ADD ROLES")}>
                          <Fab
                            style={{
                              position: "absolute",
                              top: ".4rem",
                              right: "1.5rem",
                              width: "2.2rem",
                              height: ".1rem",
                              backgroundColor: "rgb(230, 81, 71)",
                            }}
                            onClick={() => handleClickRolesOpen(false)}
                          >
                            <AddIcon
                              style={{ fontSize: "19", color: "#fff" }}
                            />
                          </Fab>
                        </Tooltip>
                      </div>
                    </div>
                  </TableRow>
                </TableHead>
                <TableBody
                  style={{ height: "calc(100vh - 390px)", overflow: "auto" }}
                >
                  {allDepartmentsRoleData &&
                    allDepartmentsRoleData
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
                            onClick={() =>
                              dispatch(
                                ShowFilesOnRole(
                                  props.selectRowDept.deptName,
                                  item.roleName
                                )
                              )
                            }
                          >
                            <div className="create-roles-header InboxCon ">
                              <div>
                                <span>{i + 1}</span>
                              </div>
                              <div>
                                <span style={{ paddingLeft: "10px" }}>
                                  {item.roleName}
                                </span>
                              </div>

                              <div>
                                <span>{item.displayRoleName}</span>
                              </div>
                              <div>
                                <span style={{ paddingLeft: "10px" }}>
                                  {item.userDetails?.deptUsername}
                                </span>
                              </div>

                              <div className="InboxIcons">
                                <>
                                  <Tooltip
                                    title={
                                      item.userDetails?.deptUsername
                                        ? "SWITCH ROLE"
                                        : "ASSIGN ROLE"
                                    }
                                    placement="bottom"
                                  >
                                    <IconButton
                                      className="InboxBtn"
                                      size="small"
                                      onClick={() =>
                                        assignSwitchRoleHandleOpen(
                                          item.userDetails?.deptUsername,
                                          item
                                        )
                                      }
                                    >
                                      {item.userDetails?.deptUsername ? (
                                        <FlipCameraAndroidIcon
                                          style={{ fontSize: "20px" }}
                                        />
                                      ) : (
                                        <FaUserEdit
                                          style={{ fontSize: "20px" }}
                                          color="primary"
                                        />
                                      )}
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
      </DialogContent>

      {/* add roles dialog */}
      <Dialog
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        open={roleAddDialoge}
        onClose={() => {
          handleClickRolesClose();
          formik.handleReset();
        }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="heading-font"> {t("ADD ROLES")}</span>
          <IconButton
            id="add_department"
            aria-label="close"
            onClick={handleClickRolesClose}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CancelIcon style={{ color: theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent style={{ Width: "600px" }} dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="roleName"
                  name="roleName"
                  label={t(" ROLE NAME")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.roleName}
                  onChange={formik.handleChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {props.selectRowpklDirectorate}.
                      </InputAdornment>
                    ),
                  }}
                  error={
                    formik.touched.roleName && Boolean(formik.errors.roleName)
                  }
                  helperText={formik.touched.roleName && formik.errors.roleName}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="displayRoleName"
                  name="displayRoleName"
                  label={t("DISPLAY NAME ")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.displayRoleName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.displayRoleName &&
                    Boolean(formik.errors.displayRoleName)
                  }
                  helperText={
                    formik.touched.displayRoleName &&
                    formik.errors.displayRoleName
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="deptName"
                  name="deptName"
                  label={t("DEPARTMENT")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.deptName}
                  error={
                    formik.touched.deptName && Boolean(formik.errors.deptName)
                  }
                  helperText={formik.touched.deptName && formik.errors.deptName}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              id="add_agendaForm_reset_btn"
              variant="outlined"
              color="primary"
              onClick={formik.resetForm}
            >
              {t("RESET")}
            </Button>
            <Button
              id="add_agendaForm_submit_btn"
              // endIcon={<DoneIcon />}
              color="primary"
              variant="outlined"
              type="submit"
            >
              {t("SUBMIT")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* get user for add role dialog */}
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          formik.handleReset();
        }}
      >
        <DialogTitle>
          <span className="heading-font"> {t(`${status} USER`)}</span>

          <IconButton
            id="close_attendMeeting_btn"
            aria-label="close"
            onClick={() => {
              assignSwitchRoleHandleClose();
              formik.handleReset();
            }}
            style={{
              float: "right",
              height: "45px",
              width: "45px",
              color: "#3131d5",
              top: "-.4rem",
            }}
          >
            <Tooltip title={t("CLOSE")} aria-label="close">
              <CancelIcon style={{ color: theme ? "#fff" : "#484747" }} />
            </Tooltip>
          </IconButton>
        </DialogTitle>
        <form onSubmit={roleFormik.handleSubmit}>
          <DialogContent style={{ width: "500px" }} dividers>
            <Autocomplete
              options={searchUsers || []}
              id="tags-outlined"
              getOptionLabel={(option) =>
                `${option.deptDisplayUsername} ${option.deptUsername}`
              }
              onInputChange={(e) => e && optimizedFn(e.target.value)}
              onChange={(event, newValue) => {
                roleHandleChange(event, newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  style={{ width: "100%" }}
                  size="small"
                  variant="outlined"
                  label={t("USER")}
                  name="roles"
                />
              )}
            />
          </DialogContent>
          <DialogActions>
            <Button
              id="submit_attendMeeting_btn"
              // endIcon={<DoneIcon />}
              color="primary"
              variant="outlined"
              type="submit"
            >
              {t("SUBMIT")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Fragment>
  );
};

export default DepartmentsRole;
