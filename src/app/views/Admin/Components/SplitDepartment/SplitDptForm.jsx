import React, { useEffect, useState, useContext, useCallback } from "react";
import {
  Button,
  DialogActions,
  Divider,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import AddIcon from "@material-ui/icons/Add";
import DoneIcon from "@material-ui/icons/Done";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import * as Yup from "yup";
import {
  getroledata,
  getroledatavalues,
  PostSplitdepartmentdta,
} from "app/camunda_redux/redux/action";
import { connect, useDispatch, useSelector } from "react-redux";
import { Resiverolesdata } from "./SplitDepartmentDisplay";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import "./split.css";

const SplitDptForm = (props) => {
  const { setRolesdata, setDepData, setDepDatazero, setDeptnamedata } =
    useContext(Resiverolesdata);

  const [departmentname, setDepartmentname] = useState([]);
  const [deptSectiondata, setDeptSectiondata] = useState([]);
  const [deptsectiondataoption, setDeptsectiondataoption] = useState([]);
  const [deptRoledata, setDeptRoledata] = useState([]);
  const [showRoleInput,setShowRoleInput]= useState(false)
  const dispatch = useDispatch();
  const splitDeptData = useSelector((state) => state.getroledatavalues);
 

  // const roledata = () => {
  //     let tempArr = []
  //     props.getroledata().then((response) => {
  //         for (let i = 0; i < response.length; i++) {
  //             tempArr.push(response[i].deptName + " | " + response[i].deptDisplayName);
  //         }
  //         setDepartmentname(tempArr)
  //     }).catch((resp) => {
  //         dispatch(setSnackbar(true, "error", resp.error));
  //     })
  // }

  useEffect(() => {
    let tempArr = [];
    props.getroledata().then((response) => {
      for (let i = 0; i < response.length; i++) {
        tempArr.push(
          response[i].deptName + " | " + response[i].deptDisplayName
        );
      }
      setDepartmentname(tempArr);
    });
  }, []);

  const emptyDepartment = {
    deptName: "",
    deptDisplayName: "",
    deptCoordRole: "",
    branch: "",
    cau: "",
    section: "",
    fromBlock: "",
    toBlock: "",
    subSection: [],
    roles: [],
    description: "",
    pklDirectorate: "",
  };

  const initialValues = {
    department: null,
    departments: [emptyDepartment, emptyDepartment],
  };


  const newRoles =["hr.role","account.role","finance.role"]

  useEffect(() => {
    if (splitDeptData) {
      formik.setFieldValue(
        "departments[0].deptName",
        splitDeptData?.departmentData?.deptName || ""
      );
      formik.setFieldValue(
        "departments[0].deptDisplayName",
        splitDeptData?.departmentData?.deptDisplayName || ""
      );
      formik.setFieldValue(
        "departments[0].deptCoordRole",
        splitDeptData?.departmentData?.deptCoordRole || ""
      );
      formik.setFieldValue(
        "departments[0].branch",
        splitDeptData?.departmentData?.branch || ""
      );
      formik.setFieldValue(
        "departments[0].pklDirectorate",
        splitDeptData?.departmentData?.pklDirectorate || ""
      );
      formik.setFieldValue(
        "departments[0].cau",
        splitDeptData?.departmentData?.cau || ""
      );
      formik.setFieldValue(
        "departments[0].description",
        splitDeptData?.departmentData?.description || ""
      );
      formik.setFieldValue(
        "departments[0].section",
        splitDeptData?.departmentData?.section || ""
      );
      formik.setFieldValue(
        "departments[0].toBlock",
        splitDeptData?.departmentData?.toBlock || ""
      );
      formik.setFieldValue(
        "departments[0].fromBlock",
        splitDeptData?.departmentData?.fromBlock || ""
      );
    }
  }, [splitDeptData]);

  const transformData = (data) => {
    return Object.keys(data).map((key) => ({ key, value: data[key] }));
  };

  const data = transformData(splitDeptData?.subSec);

  const validationSchema = Yup.object().shape({
    department: Yup.mixed().required(),
    departments: Yup.array()
      .of(
        Yup.object().shape({
          deptName: Yup.string()
            .trim()
            .required("Department Name is required")
            .matches(
              /^[a-zA-Z0-9]+$/,
              "Name should only alphabets and numbers"
            ),
          deptDisplayName: Yup.string()
            .trim()
            .required("Department Display Name is required"),
          deptCoordRole: Yup.string()
            .trim()
            .required("Department CoordRole is required"),
          branch: Yup.string().required("Branch is required"),
          cau: Yup.string().required("Cau is required"),
          section: Yup.array().required("Section is required"),
          roles: Yup.array(),
        })
      )
      .test("secondRoles", "Roles is required", function (value) {
        const secondRoles = value[1].roles;
        if (!secondRoles || secondRoles.length === 0) {
          return this.createError({
            message: "Roles is required",
            path: "departments[1].roles",
          });
        }
        return true;
      })
      .test(
        "uniqueDeptName",
        "Department names must be unique",
        function (value) {
          const firstDeptName = value[0].deptName;
          const secondDeptName = value[1].deptName;
          if (firstDeptName === secondDeptName) {
            return this.createError({
              message: "Department Names Can Not Be Same",
              path: "departments[1].deptName",
            });
          }
          return true;
        }
      )
      .test(
        "uniqueDeptName",
        "Department names must be unique",
        function (value) {
          const firstdeptDisplayName = value[0].deptDisplayName;
          const seconddeptDisplayName = value[1].deptDisplayName;
          if (firstdeptDisplayName === seconddeptDisplayName) {
            return this.createError({
              message: "Department Display Names Can Not Be Same",
              path: "departments[1].deptDisplayName",
            });
          }
          return true;
        }
      )
      .test(
        "uniqueDeptName",
        "Department names must be unique",
        function (value) {
          const firstdeptCoordRole = value[0].deptCoordRole;
          const seconddeptCoordRole = value[1].deptCoordRole;
          if (firstdeptCoordRole === seconddeptCoordRole) {
            return this.createError({
              message: "Department Coord Role Names Can Not Be Same",
              path: "departments[1].deptCoordRole",
            });
          }
          return true;
        }
      )
      .test((departments) => {
        let sum = 0;
        departments?.map((item, ind) => {
          sum += item.section.length;
        });
        if (sum === deptsectiondataoption.length) {
          // console.log("Valid");
          return true;
        } else {
          // console.log("Invalid");
          return false;
        }
      }),
  });

  // const handleDepartmentChange = useCallback((event, newValue) => {
  //     formik.handleReset();
  //     formik.setFieldValue('department', newValue);
  //     if (newValue) {
  //         let data = newValue.slice(0, newValue.indexOf(" | "));
  //         props.getroledatavalues(data).then((resp) => {

  //             formik.setFieldValue('departments[0].deptName', resp?.department?.deptName || "");
  //             formik.setFieldValue('departments[0].deptDisplayName', resp?.department?.deptDisplayName || "");
  //             formik.setFieldValue('departments[0].deptCoordRole', resp?.department?.deptCoordRole || "");
  //             formik.setFieldValue('departments[0].branch', resp?.department?.branch || "");
  //             formik.setFieldValue('departments[0].cau', resp?.department?.cau || "");
  //             formik.setFieldValue('departments[0].description', resp?.department?.description || "");
  //             let tempArr = resp?.department?.section || [];
  //             let tempArrtwo = resp?.allRoles;
  //             setDeptSectiondata(tempArr);
  //             setDeptsectiondataoption(tempArr);
  //             setDeptRoledata(tempArrtwo);
  //             setDeptnamedata(data);
  //         });
  //     }

  // }, []);

  const handleDepartmentFieldChange = useCallback((event, index, fieldName) => {
    formik.setFieldValue(
      `departments[${index}].${fieldName}`,
      event.target.value
    );
  }, []);

  const handleAddDepartment = () => {
    formik.setFieldValue("departments", [
      ...formik.values.departments,
      emptyDepartment,
    ]);
  };

  const handleSectionChange = (index, newValue) => {
    const prevSelectedValues = formik.values.departments[index].subSection;

    formik.setFieldValue(`departments[${index}].subSection`, newValue);

    const deselectedValues = prevSelectedValues.filter(
      (value) => !newValue.includes(value)
    );

    setDeptSectiondata((prevDeptRoledata) => {
      const updatedDeptRoledata = prevDeptRoledata.concat(deselectedValues);
      return updatedDeptRoledata;
    });
    setDeptSectiondata((prevDeptRoledata) => {
      const updatedDeptRoledata = prevDeptRoledata.filter(
        (value) => !newValue.includes(value)
      );
      return updatedDeptRoledata;
    });
  };

  const handleRolesChange = (index, newValue) => {
    if (index === 1) {
      setRolesdata(newValue);
    }
    formik.setFieldValue(`departments[${index}].roles`, newValue);
  };
  const handlecordRolehange = (index, newValue) => {
    // const prevSelectedValues = formik.values.departments[index].deptCoordRole;

    formik.setFieldValue(`departments[${index}].deptCoordRole`, newValue);
  };
  const formik = useFormik({
    initialValues: initialValues,
    // validationSchema: validationSchema,
    onSubmit: (values) => {
      const data = values.departments.map((item) => {
        return {
          ...item,
          pklDirectorate: item.deptName,
        
        };
      });

  

      let newObj = {};
      const transformData = data.map((item) => {
        item.subSection.map((itm) => {
          newObj[itm.key] = itm.value;
        });
        return {
          ...item,
          subSec: newObj,
          fromBlock: splitDeptData?.departmentData?.fromBlock,
          toBlock: splitDeptData?.departmentData?.toBlock,
        };
      });
      // const object = Object.assign({}, ...transformData);
      // console.log(object)

      setDepDatazero(values.departments[0]);
      setDepData(data[1]);

      props
        .PostSplitdepartmentdta(transformData, data[0].deptName)
        .then((resp) => {
          if (resp.message === "OK") {
            setShowRoleInput(true)
            // props.handleNext();
            // formik.resetForm();
            setRolesdata(resp.roles);
          } else {
            dispatch(setSnackbar(true, "error", resp.error));
          }
        });
      // props.handleNext()
    },
  });

  const handleReset = () => {
    formik.resetForm();
  };

  return (
    <>
      {/* <Divider /> */}
      <form>
        {/*                  
                    <Grid item xs={1} className='plus_grid' >
                        <IconButton
                            id="attendeeDetails_close_btn"
                            aria-label="Add"
                            type='button'
                            // onClick={handleAddDepartment}
                            style={{
                                cursor: "pointer",
                                background: "rgba(54, 76, 100, 1)",
                                height: "46px",
                                width: "46px"
                            }}
                        >
                            <Tooltip title={"Add"} aria-label="Add">
                                <AddIcon className='add_field_button_icon' />
                            </Tooltip>
                        </IconButton>
                    </Grid> */}

        {/* ---------------------------------field arrry ---------------------------------- */}
        {formik.values.departments.map((department, index) => (
          <React.Fragment key={index}>
            <Paper className="card_grid_dpt_main">
              <Grid container spacing={1} className="card_grid_dpt">
                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    name={`departments[${index}].deptName`}
                    size="small"
                    fullWidth
                    disabled={showRoleInput?true:false}
                    label="Department New Name"
                    variant="outlined"
                    value={department.deptName}
                    onChange={(event) =>
                      handleDepartmentFieldChange(event, index, "deptName")
                    }
                    error={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      Boolean(formik.errors.departments?.[index]?.deptName)
                    }
                    helperText={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      formik.errors.departments?.[index]?.deptName
                    }
                    InputProps={{
                      readOnly: index === 0,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    name={`departments[${index}].deptDisplayName`}
                    size="small"
                    disabled={showRoleInput?true:false}
                    fullWidth
                    label="Department Display Name"
                    variant="outlined"
                    value={department.deptDisplayName}
                    onChange={(event) =>
                      handleDepartmentFieldChange(
                        event,
                        index,
                        "deptDisplayName"
                      )
                    }
                    error={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      Boolean(
                        formik.errors.departments?.[index]?.deptDisplayName
                      )
                    }
                    helperText={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      formik.errors.departments?.[index]?.deptDisplayName
                    }
                    InputProps={{
                      readOnly: index === 0,
                    }}
                  />
                </Grid>

           
                  {/* <TextField
                    autoComplete="off"
                    name={`departments[${index}].deptCoordRole`}
                    size="small"
                    fullWidth
                    label="Department Coord Role"
                    variant="outlined"
                    value={department.deptCoordRole}
                    onChange={(event,newValue) =>
                      handleCordRole(event, newValue)
                    }
                    error={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      Boolean(formik.errors.departments?.[index]?.deptCoordRole)
                    }
                    helperText={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      formik.errors.departments?.[index]?.deptCoordRole
                    }
                    InputProps={{
                      readOnly: index === 0,
                    }}
                  /> */}
                  {/* <Autocomplete
                    disablePortal
                    name={`departments[${index}].deptCoordRole`}
                    value={department.deptCoordRole}
                    onChange={(event, newValue) =>
                      handlecordRolehange(event, newValue)
                    }
                    options={splitDeptData.allRoles}
                    fullWidth
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Department Coord Role"
                        variant="outlined"
                        size="small"
                      />
                    )}
                  /> */}

                  {/* <Autocomplete
                    fullWidth
                    name={`departments[${index}].deptCoordRole`}
                    // multiple
                    id="tags-standard"
                    // options={deptRoledata.filter(item => !formik.values.departments.some((dep, i) => i !== index && dep.roles.includes(item)))}
                    options={splitDeptData.allRoles}
                    value={department.deptCoordRole}
                    onChange={(event,newValue) =>
                      handleCordRole(event, newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        label="Roles"
                        placeholder="Roles"
                        error={
                          formik.touched.departments &&
                          formik.touched.departments[index] &&
                          Boolean(formik.errors.departments?.[index]?.deptCoordRole)
                        }
                        helperText={
                          formik.touched.departments &&
                          formik.touched.departments[index] &&
                          formik.errors.departments?.[index]?.deptCoordRole
                        }
                      />
                    )}
                  /> */}

                  {/* <Autocomplete
                    fullWidth
                    name={`departments[${index}].deptCoordRole`}
                    id="tags-standard"
                    // options={deptRoledata.filter(item => !formik.values.departments.some((dep, i) => i !== index && dep.roles.includes(item)))}
                    options={splitDeptData.allRoles}
                    freeSolo
                    filterSelectedOptions
                    value={department.deptCoordRole}
                    onChange={(event, newValue) =>
                      handleCordRole(event, newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        size="small"
                        label="Department Coord Role"
                        variant="outlined"
                        error={
                          formik.touched.departments &&
                          formik.touched.departments[index] &&
                          Boolean(
                            formik.errors.departments?.[index]?.deptCoordRole
                          )
                        }
                        helperText={
                          formik.touched.departments &&
                          formik.touched.departments[index] &&
                          formik.errors.departments?.[index]?.deptCoordRole
                        }
                        InputProps={{
                          readOnly: index === 0,
                        }}
                      />
                    )}
                  /> */}
               

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    name={`departments[${index}].branch`}
                    size="small"
                    fullWidth
                    disabled={showRoleInput?true:false}
                    label="Branch"
                    variant="outlined"
                    value={department.branch}
                    onChange={(event) =>
                      handleDepartmentFieldChange(event, index, "branch")
                    }
                    error={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      Boolean(formik.errors.departments?.[index]?.branch)
                    }
                    helperText={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      formik.errors.departments?.[index]?.branch
                    }
                    InputProps={{
                      readOnly: index === 0,
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    autoComplete="off"
                    name={`departments[${index}].cau`}
                    size="small"
                    fullWidth
                    label="Cau"
                    disabled={showRoleInput?true:false}
                    variant="outlined"
                    value={department.cau}
                    onChange={(event) =>
                      handleDepartmentFieldChange(event, index, "cau")
                    }
                    error={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      Boolean(formik.errors.departments?.[index]?.cau)
                    }
                    helperText={
                      formik.touched.departments &&
                      formik.touched.departments[index] &&
                      formik.errors.departments?.[index]?.cau
                    }
                    InputProps={{
                      readOnly: index === 0,
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    fullWidth
                    name={`departments[${index}].subSection`}
                    style={{ display: index === 0 ? "none" : "block" }}
                    multiple
                    id="tags-standard"
                    options={data}
                    getOptionLabel={(option) =>
                      `${option.key}: ${option.value}`
                    }
                    disabled={showRoleInput?true:false}
                    // renderOption={(props, option) => (
                    //   <li {...props}>{`${option.key}: ${option.value}`}</li>
                    // )}
                    value={department.subSection}
                    onChange={(event, newValue) =>
                      handleSectionChange(index, newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        label="Section"
                        placeholder="Section"
                        // error={formik.touched.departments && formik.touched.departments[index] && Boolean(formik.errors.departments?.[index]?.subSection)}
                        // helperText={formik.touched.departments && formik.touched.departments[index] && formik.errors.departments?.[index]?.subSection}
                      />
                    )}
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  key={index}
                  style={{ display: index === 0 ? "none" : "block" }}
                >
                  {showRoleInput && 
                  <>
                  <Autocomplete
                    fullWidth
                    name={`departments[${index}].roles`}
                    multiple
                    id="tags-standard"
                    // options={deptRoledata.filter(item => !formik.values.departments.some((dep, i) => i !== index && dep.roles.includes(item)))}
                    options={newRoles}
                    value={department.roles}
                    onChange={(event, newValue) =>
                      handleRolesChange(index, newValue)
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        size="small"
                        label="Roles"
                        placeholder="Roles"
                        error={
                          formik.touched.departments &&
                          formik.touched.departments[index] &&
                          Boolean(formik.errors.departments?.[index]?.roles)
                        }
                        helperText={
                          formik.touched.departments &&
                          formik.touched.departments[index] &&
                          formik.errors.departments?.[index]?.roles
                        }
                      />
                    )}
                  />
                  
                
                </>
                  }
                  
                </Grid>

                {/* <Grid item xs={4}>
                  <TextField
                    autoComplete="off"
                    name={`departments[${index}].description`}
                    size="small"
                    fullWidth
                    label="Description"
                    variant="outlined"
                    value={department.description}
                    onChange={(event) =>
                      handleDepartmentFieldChange(event, index, "description")
                    }
                  />
                </Grid> */}
                {/* <Button type="button" onClick={() => handleRemoveDepartment(index)}>
                                Remove
                            </Button> */}
              </Grid>
            </Paper>
          </React.Fragment>
        ))}
        {/* -------------------------------------------------- field array ----------------------------------------------*/}
        <Divider />
        <DialogActions>
          {/* <Button
            endIcon={<RotateLeftIcon />}
            size="large"
            variant="contained"
            color="primary"
            onClick={handleReset}
          >
            RESET
          </Button> */}
          {
            showRoleInput ?  <Button
            onClick={props.handleNext}
            style={{ paddingLeft: "1rem" }}
            type="submit"
            endIcon={<DoneIcon />}
            size="large"
            variant="contained"
            color="primary"
          >
            NEXT
          </Button>:  <Button
            onClick={formik.handleSubmit}
            style={{ paddingLeft: "1rem" }}
            type="submit"
            endIcon={<DoneIcon />}
            size="large"
            variant="contained"
            color="primary"
          >
            SUBMIT
          </Button>
          }

        
        </DialogActions>
      </form>
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
  getroledatavalues,
  PostSplitdepartmentdta,
})(SplitDptForm);
