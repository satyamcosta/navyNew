import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import React, { useState } from "react";
import { useMemo } from "react";
import AddIcon from "@material-ui/icons/Add";
import GenericSearch from "app/views/utilities/GenericSearch";
import {
  Autocomplete,
  Button,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import PaginationComp from "app/views/utilities/PaginationComp";
import { GetKeyCloakUser } from "app/redux/actions/AdminDepartment/UserList/UserList";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import Draggable from "react-draggable";
import CancelIcon from "@material-ui/icons/Cancel";
import "./Style.css";
import {
  assignRole,
  createRoles,
  getRoleByDepartmentName,
  getRoleByName,
} from "app/redux/actions/AdminDepartment/CreateRoles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { getAllDepartmentdata } from "app/redux/actions/AdminDepartment/CreateDepartment";
import { unstable_batchedUpdates } from "react-dom";

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

const UserTable = (props) => {
  const [pageSize, setPageSize] = useState(5);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [roleAddDialoge, setRoleAddDialoge] = useState(false);
  const [deptUsername, setDeptUsername] = useState("");
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const getAllKeyCloakUser = useSelector(
    (state) => state.KeyCloakUser.getAllUser
  );

  // open and close roles dialoge function
  const handleClickRolesOpen = (role) => {
    setDeptUsername(role.deptUsername);
    setRoleAddDialoge(true);
  };

  const handleClickRolesClose = () => {
    setRoleAddDialoge(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "deptUsername",
        header: "USER NAME",
        size: 60,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "deptDisplayUsername",
        header: "DISPLAY USER NAME",
        size: 90,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
      {
        accessorKey: "deptRole",
        header: "ROLES",
        size: 100,
        Cell: ({ cell }) => (
          <span className="roles-map">
            {cell.getValue()?.map((item, i) => {
              return <li>{item?.roleName}</li>;
            })}
          </span>
        ),
      },
      {
        accessorKey: "cau",
        header: "ACTION",
        size: 30,
        Cell: ({ row }) => {
          let item = row.original;
          return (
            <Tooltip title="ADD MORE ROLE">
              <IconButton onClick={() => handleClickRolesOpen(item)}>
                <AddCircleOutlineIcon
                  size="small"
                  color="#ccc"
                  style={{ fontSize: "1.4rem", height: "1.5rem" }}
                />
              </IconButton>
            </Tooltip>
          );
        },
      },
    ],
    []
  );

  const FilterValueTypes = [
    {
      name: "user",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];
  const FilterOption = [
    {
      value: "Select Field",
      label: "",
    },
    {
      value: "user",
      label: "user",
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

  const CustomToolbarMarkup = ({ table }) => {
    const selectedRowData = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original);

    return (
      <>
        <Grid container className="AcHeader">
          <Grid item xs={12} className="PaHeadTop">
            <div
              style={{
                width: "85%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <GenericSearch
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
              />
              <div style={{ display: "flex" }}></div>
            </div>

            <MRT_ShowHideColumnsButton table={table} />
          </Grid>
          {/* <GenericChip Filter={Filter} deleteChip={deleteChip} /> */}
        </Grid>
      </>
    );
  };

  let isAdmin = false;

  useEffect(() => {
    if (!isAdmin) {
      dispatch(GetKeyCloakUser());
    }
  }, []);

  // get department data
  useEffect(() => {
    dispatch(getAllDepartmentdata(""));
  }, []);

  const allDepartmentsData = useSelector(
    (state) => state.createDepartmentReducer.departmentData
  );

  const allDepartmentsRoleData = useSelector(
    (state) => state.getDepartmentRole.departmentRoleData
  );

  // handleChange department

  const handleChangeDept = (e, value, booleanValue) => {
    if (booleanValue) {
      dispatch(getRoleByDepartmentName(value.deptName));
    }
    formik.setFieldValue("roleName", value.roleName);
    formik.setFieldValue("deptName", value.deptName);
  };

  // add roles function

  const assignRoleFun = (values) => {
    const newValue = { ...values, userName: deptUsername };

    dispatch(assignRole([newValue], "", true));
  };

  // formik validation for create roles
  const validationSchema = yup.object().shape({
    roleName: yup.string().required("Role name is Required"),
    displayRoleName: yup.string().required("User name is Required"),
    deptName: yup.string().required("Department name is Required"),
  });

  const formik = useFormik({
    initialValues: {
      roleName: [],
      deptName: "gddg",
    },
    // validationSchema: validationSchema,

    onSubmit: (values) => {
      assignRoleFun(values);
      handleClickRolesClose();

      formik.resetForm();
    },
  });

  //for check when  login user admin or superAdmin

  const isSuperAdmin = sessionStorage.getItem("superAdmin") === "true";
  const defaultDept = [{ deptName: sessionStorage.getItem("department") }];

  return (
    <>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
          // paddingTop: "1rem",
        }}
      >
        <div>
          {" "}
          <MaterialReactTable
            data={getAllKeyCloakUser}
            manualPagination
            columns={columns}
            initialState={{
              density: "compact",
            }}
            displayColumnDefOptions={{
              "mrt-row-selects": {
                size: 5,
                muiTableHeadCellProps: {
                  sx: {
                    paddingLeft: "2s5px",
                  },
                },
                muiTableBodyCellProps: {
                  sx: {
                    paddingLeft: "25spx",
                  },
                },
              },
            }}
            enableBottomToolbar={false}
            enableColumnResizing
            enableStickyHeader
            // enableRowSelection
            // enableRowNumbers
            // selectedRows={selectedRows}
            // onSelectionChange={handleSelectionChange}
            enableFilters={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            renderTopToolbar={({ table }) => (
              <CustomToolbarMarkup table={table} />
            )}
            muiTableContainerProps={() => ({
              sx: {
                border: "1px solid #8080802b",
                height: "62vh",
              },
            })}
            muiTablePaperProps={() => ({
              sx: {
                padding: "0rem 1rem",
                border: "0",
                boxShadow: "none",
              },
            })}
          />
          <PaginationComp
            currentPage={currentPage}
            totalCount={totalCount}
            pageSize={pageSize}
            pageSizes={pageSizes}
            setCurrentPage={setCurrentPage}
            setPageSize={setPageSize}
          />
        </div>
      </Paper>

      {/* add roles dialog */}
      <Dialog
        className="add-role-dialog"
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
            <CancelIcon style={{ color: "#484747" }} />
          </IconButton>
        </DialogTitle>

        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  id="deptName"
                  options={
                    isSuperAdmin ? allDepartmentsData || [] : defaultDept
                  }
                  getOptionLabel={(option) => option.deptName}
                  onChange={(e, newValue) =>
                    handleChangeDept(e, newValue, true)
                  }
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("SELECT DEPARTMENT")}
                      variant="outlined"
                      placeholder="SELECT DEPARTMENT"
                      type="text"
                      name="deptName"
                      value={formik.values.deptName}
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  id="roleName"
                  options={allDepartmentsRoleData || []}
                  getOptionLabel={(option) => option.roleName}
                  onChange={(e, newValue) => handleChangeDept(e, newValue)}
                  filterSelectedOptions
                  multiple
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("SELECT ROLES")}
                      variant="outlined"
                      placeholder="SELECT ROLES"
                      type="text"
                      name="roleName"
                      value={formik.values.roleName}
                      size="small"
                    />
                  )}
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
    </>
  );
};

export default UserTable;
