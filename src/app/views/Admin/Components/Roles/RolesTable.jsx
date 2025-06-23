import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import React, { useCallback, useEffect, useState } from "react";
import { getUsers } from "app/redux/actions/AdminDepartment/CreateRoles";
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
  Button, // Add Button import
  TextField, // TextField import
} from "@mui/material"; // Updated import path

import { useTranslation } from "react-i18next";
import AddIcon from "@mui/icons-material/Add"; // Updated import path
import Autocomplete from "@mui/material/Autocomplete"; // Updated import path
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@mui/icons-material/Visibility"; // Updated import path
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Dialog from "@mui/material/Dialog"; // Updated import path
import DialogActions from "@mui/material/DialogActions"; // Updated import path
import DialogContent from "@mui/material/DialogContent"; // Updated import path
import DialogTitle from "@mui/material/DialogTitle"; // Updated import path
import { useFormik } from "formik";
import * as yup from "yup";
import CancelIcon from "@mui/icons-material/Cancel"; // Updated import path
import Draggable from "react-draggable";
import FlipCameraAndroidIcon from "@mui/icons-material/FlipCameraAndroid"; // Updated import path
import "./style.css";
import { FaUserEdit } from "react-icons/fa";
import { debounce } from "utils";
import {
  assignRole,
  switchRole,
  createRoles,
  getRoleByName,
  getRoleByDepartmentName,
} from "app/redux/actions/AdminDepartment/CreateRoles";
import AddRoles from "./AddRoles";
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
  const [pageSize, setPageSize] = useState(5);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [roleAddDialog, setRoleAddDialog] = useState(false);
  const [roleAddDialoge, setRoleAddDialoge] = useState(false);
  const [status, setStatus] = useState("");
  const [assignUserRole, setAssignUserRole] = useState("");
  const [assignSwitch, setAssignSwitch] = useState(false);
  const [selectRowRole, setSelectRowRole] = useState("");
  const dispatch = useDispatch();

  const deptName = sessionStorage.getItem("department");

  const [currentUserData, setCurrentUserData] = useState({
    userName: "",
    userRole: "",
  });
  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "department",
      label: "Department",
    },
    {
      value: "role",
      label: "Role",
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

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;

    let tempArr = rowData.data?.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  // get department data
  let department = sessionStorage.getItem("department");
  useEffect(() => {
    if (department) {
      dispatch(getRoleByDepartmentName(department));
    }
  }, [department]);

  // const allDepartmentsRoleData = useSelector(
  //   (state) => state.getRoleByName.filetrRoleData
  // );
  const allDepartmentsRoleData = useSelector(
    (state) => state.getDepartmentRole.departmentRoleData
  );
  
  const searchRole = useSelector(
    (state) => state.getDepartmentByName.filetrRoleDeptData
  );
  

  // formik validation and handleSubmit function

  // open and close roles dialoge function
  const handleClickRolesOpen = () => {
    setRoleAddDialog(true);
  };

  const handleClickRolesClose = () => {
    setRoleAddDialog(false);
  };

  // add roles function

  const createRole = (values) => {
    let rolesData = [];
    rolesData.push(values);
    dispatch(createRoles(rolesData));
  };

  // formik validation for create roles
  const validationSchema = yup.object().shape({
    roleName: yup.string().required("Role name is Required"),
    displayRoleName: yup.string().required("User name is Required"),
    departmentName: yup.string().required("Department name is Required"),
  });

  const formik = useFormik({
    initialValues: {
      roleName: "",
      displayRoleName: "",
      departmentName: deptName,
    },
    // validationSchema: validationSchema,

    onSubmit: (values) => {
      createRole(values);
      handleClickRolesClose();

      formik.resetForm();
    },
  });

  const handleChangeDeptSearchFun = (e, value) => {
    if (value) {
      dispatch(getRoleByName(value.deptName));
    } else {
      dispatch(getRoleByName(department));
    }
  };

  const getDepartmentByNameFun = (value) => {
    dispatch(getDepartmentByName(value));
  };

  const optimizedFn = useCallback(debounce(getDepartmentByNameFun), []);

  // const CustomToolbarMarkup = () => (
  //   <div
  //     style={{
  //       padding: ".6rem",
  //       borderBottom: "1px solid #c7c7c7",
  //       display: "flex",
  //       justifyContent: "space-between",
  //     }}
  //   >
  //     <Typography
  //       variant="button"
  //       align="center"
  //       color="primary"
  //       style={{
  //         fontSize: "1.2rem",
  //         fontFamily: "inherit !important",
  //         marginLeft: "15px",
  //       }}
  //     >
  //       <span className="heading-font"> {t("ROLES")}</span>
  //     </Typography>

  //     <Autocomplete
  //       id="tags-outlined"
  //       options={[]}
  //       // getOptionLabel={(options)=>options.deptName}
  //       onChange={(e, newVlaue) => handleChangeDeptSearchFun(e, newVlaue)}
  //       onInputChange={(e) => e && optimizedFn(e.target.value)}
  //       style={{
  //         position: "absolute",

  //         right: "4.5rem",
  //         width: "300px",
  //       }}
  //       size="small"
  //       filterSelectedOptions
  //       renderInput={(params) => (
  //         <TextField
  //           {...params}
  //           variant="outlined"
  //           label={t("SEARCH ROLES")}
  //           className="department-search"
  //           placeholder="SEARCH ROLES"
  //           // name="search"
  //           // values={formik.values.blockNo}
  //         />
  //       )}
  //     />

  //     <Tooltip title={t("Add Department")}>
  //       <Fab
  //         style={{
  //           position: "absolute",

  //           right: "1.5rem",
  //           width: "2.2rem",
  //           height: ".1rem",
  //           backgroundColor: "rgb(230, 81, 71)",
  //         }}
  //         onClick={handleClickRolesOpen}
  //       >
  //         <AddIcon style={{ fontSize: "19", color: "#fff" }} />
  //       </Fab>
  //     </Tooltip>
  //   </div>
  // );

  const assignSwitchRoleHandleOpen = (item) => {
    setSelectRowRole(item.department);
    setAssignUserRole(item.roleName);

    setStatus("");
    setAssignSwitch(true);
    setCurrentUserData({
      userName: item.userDetails?.deptUsername,
      userRole: item.roleName,
    });
  };

  const assignSwitchRoleHandleClose = () => {
    setAssignSwitch(false);
  };

  const roleHandleChange = (e, value) => {
    roleFormik.setFieldValue("roles", value);
  };

  const assignRoleFun = (values) => {
    let userName = values.roles.deptUsername;
    dispatch(assignRole(userName, assignUserRole, selectRowRole));
  };
  const switchRoleFun = (values) => {
    let newRole = values.roles?.deptUsername;
    dispatch(
      switchRole(
        currentUserData.userRole,
        currentUserData.userName,
        newRole,
        selectRowRole
      )
    );
  };

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
      roleFormik.resetForm({ values: "" });
    },
  });
  const getMeetingUser = (value) => {
    dispatch(getUsers("", value));
  };
  const searchUsers = useSelector((state) => state.getAllUsers.userData);

  const roleOptimizedFn = useCallback(debounce(getMeetingUser), []);

  // for search dept and role

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
      name: "role",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "department",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
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

  const CustomToolbarMarkup = () => (
    <Grid
      container
      direction="column"
      style={{
        padding: "0.5rem 0rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <GenericSearch
          FilterTypes={FilterTypes}
          FilterValueTypes={FilterValueTypes}
          addFilter={addFilter}
          cssCls={{}}
        />
      </div>
      <Tooltip title={t("ADD ROLES")}>
        <Fab
          style={{
            position: "absolute",
            top: ".8rem",
            right: "1.5rem",
            width: "2.2rem",
            height: ".1rem",
            backgroundColor: "rgb(230, 81, 71)",
          }}
          onClick={() => handleClickRolesOpen()}
        >
          <AddIcon style={{ fontSize: "19", color: "#fff" }} />
        </Fab>
      </Tooltip>
    </Grid>
  );

  return (
    <div style={{ width: "100%", padding: "0 1rem" }}>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
          // paddingTop: "1rem",
          width: "100%",
        }}
      >
        {CustomToolbarMarkup()}
        <div
          style={{
            width: "100%",
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
              width: "100%",
              // height: "calc(100vh - 430px)",
            }}
          >
            <Table
              component="div"
              className="App-main-table"
              aria-label="simple table"
              hover
              style={{ width: "100%" }}
            >
              <TableHead component="div">
                <TableRow
                  component="div"
                  style={{
                    backgroundColor: theme ? "#e5e5e5" : "#e5e5e5",
                  }}
                >
                  <div
                    className="roles-table-header"
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
                      <span>{t("DISPLAY NAME")}</span>
                    </div>

                    <div>
                      <span>{t("ROLE")}</span>
                    </div>
                    <div>
                      {" "}
                      <span>{t("USER ID")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                style={{ height: "calc(100vh - 290px)", overflow: "auto" }}
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
                        >
                          <div className="roles-table-header InboxCon">
                            <div>
                              <span>{i + 1}</span>
                            </div>

                            <div>
                              <span>{item.displayRoleName}</span>
                            </div>

                            <div>
                              <span>{item.roleName}</span>
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
                                    onClick={() =>
                                      assignSwitchRoleHandleOpen(item)
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
      {/* department role add dialog */}
      <Dialog
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        open={roleAddDialog}
        onClose={() => {
          handleClickRolesClose();
          formik.handleReset();
        }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="heading-font"> {t("ADD ROLE")}</span>
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
                  label={t(" USER NAME ")}
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
                  id="departmentName"
                  name="departmentName"
                  label={t("DEPARTMENT")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.departmentName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.departmentName &&
                    Boolean(formik.errors.departmentName)
                  }
                  helperText={
                    formik.touched.departmentName &&
                    formik.errors.departmentName
                  }
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
        open={assignSwitch}
        onClose={() => {
          assignSwitchRoleHandleClose();
          roleFormik.handleReset();
        }}
      >
        <DialogTitle>
          <span className="heading-font"> {t(`${status} USER`)}</span>

          <IconButton
            id="close_attendMeeting_btn"
            aria-label="close"
            onClick={() => {
              assignSwitchRoleHandleClose();
              roleFormik.handleReset();
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
              onInputChange={(e) => e && roleOptimizedFn(e.target.value)}
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
    </div>
  );
};

export default DepartmentSetting;
