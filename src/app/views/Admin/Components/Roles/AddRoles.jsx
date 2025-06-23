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
// import { Autocomplete } from "@material-ui/lab";
// import { debounce } from "utils";
import { getUsers } from "app/redux/actions/AdminDepartment/CreateRoles";
import { useFormik } from "formik";
import * as yup from "yup";

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
} from "app/redux/actions/AdminDepartment/CreateRoles";
import { Autocomplete } from "@material-ui/lab";

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

const AddRoles = () => {
  const { theme } = useSelector((state) => state);
  const [roleAddDialoge, setRoleAddDialoge] = useState(false);

  // open and close roles dialoge function
  const handleClickRolesOpen = () => {
    setRoleAddDialoge(true);
  };

  const handleClickRolesClose = () => {
    setRoleAddDialoge(false);
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
      departmentName: "",
    },
    // validationSchema: validationSchema,

    onSubmit: (values) => {
      createRole(values);
      handleClickRolesClose();

      formik.resetForm();
    },
  });
  return (
    <div>
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
    </div>
  );
};

export default AddRoles;
