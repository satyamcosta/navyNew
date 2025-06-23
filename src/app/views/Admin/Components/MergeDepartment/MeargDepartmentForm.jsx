import React, { useEffect, useState, useContext } from "react";
import "./mearg.css";
import {
  Grid,
  TextField,
  Button,
  Divider,
  DialogActions,
} from "@material-ui/core";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import { Autocomplete } from "@material-ui/lab";
import { useFormik } from "formik";
import * as Yup from "yup";
import { connect, useDispatch } from "react-redux";
import {
  sendMeargData,
  getroledata,
  sendAutofilldata,
} from "app/camunda_redux/redux/action";
import { SendFormikDatainTable } from "./MeargDepartment";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const MeargDepartment = (props) => {
  const { setDepartmentList, setDepartment, setDepartment1, selectMergeDept } =
    useContext(SendFormikDatainTable);

  const [deptRoledata, setDeptRoledata] = useState([]);
  const [autofillvalues, setAutofillvalues] = useState([]);
  const dispatch = useDispatch();
  const [autofilldatalist, setAutofilldatalist] = useState([]);
  const [togledata, setTogledata] = useState("no");

  const roledata = () => {
    let tempArr = [];
    props.getroledata().then((response) => {
      for (let i = 0; i < response.length; i++) {
        tempArr.push(
          response[i].deptName + " | " + response[i].deptDisplayName
        );
      }
      setDeptRoledata(tempArr);
    });
  };

  const [pklDirectorates ,setPklDirectorates] = useState("")
  useEffect(() => {
    roledata();
  }, []);

  const initialValues = {
    departments: [],
    autofill: "",
    department: {
      deptName: "",
      deptDisplayName: "",
      deptCoordRole: "",
      branch: "",
      section: "",
      cau: "",
      description: "",
      fromBlock:"",
      toBlock:"",
      pklDirectorate:"",
      subSec:{},
    },
  };

  const validationSchema = Yup.object().shape({
    department: Yup.object().shape({
      deptName: Yup.string()
        .required("Enter Department New Name")
        .matches(/^[a-zA-Z0-9]+$/, "Name should only  alphabets and numbers")
        .min(3, "Department New Name Must Be 3 Word "),

      deptDisplayName: Yup.string().required("Enter Department Display Name "),
      deptCoordRole: Yup.string().required("Enter Department Cord Role"),
    }),
  });

  const handalchangedepartment = (event, newValue) => {
    formik.setFieldValue("departments", newValue).then(() => {
      setAutofillvalues(newValue);
    });
  };

 

  const autofillhandalchange = (event, newValue) => {
    formik.setFieldValue("autofill", newValue);
    if (!newValue) {
      setTogledata("no");
    } else {
      setTogledata("yes");
    }

    props.sendAutofilldata(newValue.deptName).then((response) => {
      setPklDirectorates(response?.Details?.pklDirectorate)
      formik.setValues((prevValues) => ({
        ...prevValues,
        department: {
          ...prevValues.department,
          deptName: response?.Details?.deptName,
          deptDisplayName: response?.Details?.deptDisplayName,
          deptCoordRole: response?.Details?.deptCoordRole,
          branch: response?.Details?.branch,
          cau: response?.Details?.cau,
          section: response?.Details?.section,
          description: response?.Details?.description,
          fromBlock:response?.Details?.fromBlock,
          toBlock:response?.Details?.toBlock,
          pklDirectorate:response?.Details?.pklDirectorate,
          subSec:response?.Details?.subSec,

        },
      }));
      let tempArr = response?.Details?.section || "";
      setAutofilldatalist(tempArr);
    });
  };

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: function (data, action) {
      let departments = [];
      let temparralist = [];
      let newDepartment = data.department;
      let tempArr = data.departments;

      for (let i = 0; i < selectMergeDept.length; i++) {
        departments.push(selectMergeDept[i].deptName);
      }

    const newObject =   { ...newDepartment,pklDirectorate:data.department.deptName}
      setDepartmentList(departments);
      setDepartment(newObject);
      props
        .sendMeargData(departments, newObject, togledata)
        .then((response) => {
          if (response.message === "OK") {
            let data = response.RolesToMap;
            data &&
              data.map((list) => {
                temparralist.push(list);
              });
            setDepartment1(temparralist);
            formik.resetForm();
            props.handleNext();
          } else {
            console.log(response.error);
            dispatch(setSnackbar(true, "error", response.error));
          }
        });
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };

  return (
    <>
      <Divider />
      <div className="mearg_main_div">
      
          
          <form onSubmit={formik.handleSubmit}>
            <div className="mrg_form_grid">
              <Grid
                container
                spacing={3}
                style={{ padding: "0 1.5rem 0 1.5rem " }}
              >
                <Grid item xs={12}>
                  {/* <Autocomplete
                    fullWidth
                    size="small"
                    multiple
                    name="departments"
                    id="tags-outlined"
                    options={deptRoledata}
                    value={formik.values.departments}
                    onChange={handalchangedepartment}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Select Department"
                        placeholder="Departments"
                        error={
                          formik.touched.departments &&
                          Boolean(formik.errors.departments)
                        }
                        helperText={
                          formik.touched.departments &&
                          formik.errors.departments
                        }
                      />
                    )}
                  /> */}
                </Grid>
                <Grid item xs={6}>
                  <Autocomplete
                    fullWidth
                    size="small"
                    name="autofill"
                    id="tags-outlined"
                    options={selectMergeDept}
                    getOptionLabel={(option) => option.deptName}
                    value={formik.values.autofill}
                    onChange={autofillhandalchange}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label="Auto Fill"
                        placeholder="autofill"
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Department New Name"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    name="department.deptName"
                    value={formik.values.department.deptName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.department?.deptName &&
                      Boolean(formik.errors.department?.deptName)
                    }
                    helperText={
                      formik.touched.department?.deptName &&
                      formik.errors.department?.deptName
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label=" Department Display Name "
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    name="department.deptDisplayName"
                    value={formik.values.department.deptDisplayName}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.department?.deptDisplayName &&
                      Boolean(formik.errors.department?.deptDisplayName)
                    }
                    helperText={
                      formik.touched.department?.deptDisplayName &&
                      formik.errors.department?.deptDisplayName
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Department Cord Role "
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    name="department.deptCoordRole"
                    value={formik.values.department.deptCoordRole}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.department?.deptCoordRole &&
                      Boolean(formik.errors.department?.deptCoordRole)
                    }
                    helperText={
                      formik.touched.department?.deptCoordRole &&
                      formik.errors.department?.deptCoordRole
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Branch"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    name="department.branch"
                    value={formik.values.department.branch}
                    onChange={formik.handleChange}
                  />
                </Grid>
               
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Cau"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    name="department.cau"
                    value={formik.values.department.cau}
                    onChange={formik.handleChange}
                  />
                </Grid>
                {/* <Grid item xs={4}>
                  <TextField
                    fullWidth
                    id="outlined-basic"
                    label="Description"
                    variant="outlined"
                    size="small"
                    autoComplete="off"
                    name="department.description"
                    value={formik.values.department.description}
                    onChange={formik.handleChange}
                  />
                </Grid> */}
              </Grid>
            </div>
            <div style={{marginTop:"3.4rem"}}>
           <Divider/>
            <DialogActions>
              <Button
                endIcon={<RotateLeftIcon />}
                size="large"
                variant="contained"
                color="primary"
                onClick={handleReset}
              >
                RESET
              </Button>

              <Button
                type="submit"
                endIcon={<ArrowForwardIcon />}
                size="large"
                variant="contained"
                color="primary"
              >
                NEXT
              </Button>
            </DialogActions>
            </div>
          </form>
       
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  getroledata,
  sendMeargData,
  sendAutofilldata,
})(MeargDepartment);
