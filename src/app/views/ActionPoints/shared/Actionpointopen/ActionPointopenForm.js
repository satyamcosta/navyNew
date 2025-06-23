import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import DoneIcon from "@material-ui/icons/Done";
import { connect, useDispatch, useSelector } from "react-redux";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { styled } from "@mui/material/styles";
import CancelIcon from "@material-ui/icons/Cancel";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Tooltip,
  Typography,
  Paper,
  FormControl,
  Box,
  Chip,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { FcHighPriority, FcLowPriority } from "react-icons/fc";
import {
  addActionTask,
  filesUpload,
  refcences,
  getGroupList,
  getInternalServiceNumber,
  getServiceNumber,
} from "app/camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Autocomplete } from "@material-ui/lab";
import Draggable from "react-draggable";
import moment from "moment";
import "../index.css";
import { makeStyles } from "@material-ui/styles";
import { CircularProgress } from "@material-ui/core";
import TripleToggleSwitch from "app/views/Personnel/PrioritySwitch/Three";
import { debounce, handleError } from "utils";

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

const useStyles = makeStyles((theme) => ({
  priority_box: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
  },
  priority_btn: {
    fontSize: "1rem",
    border: "1px solid #8080804f !important",
    borderRadius: "8%",
  },
}));

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

function ActionPointOpenForm(props) {
  const [intService, setIntService] = useState("");
  const [intServiceList, setIntServiceList] = useState([]);
  const [intServiceObj, setIntServiceObj] = useState([]);
  const [favIntService, setFavIntService] = useState("");
  const [section, setSection] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [sectionObj, setSectionObj] = useState([]);
  const [favSection, setFavSection] = useState("");
  const [service, setService] = useState("");
  const [favService, setFavService] = useState("");
  const [eyesOnlyArr, setEyesOnlyArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [eyesOnlyDep, setEyesOnlyDep] = useState(null);

  const [isExt, setIsExt] = useState(false)
  const [isInt, setIsInt] = useState(false)

  const { t } = useTranslation();
  const classes = useStyles();
  const disabledPreviousDate = new Date().toISOString().split("T")[0];

  const deptName = sessionStorage.getItem("department");

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const [fileName, setFileName] = useState();
  const [fileName1, setFileName1] = useState([]);

  // file handlechnage ===========================

  const fileHandleChange = (e) => {
    let filesNameArr = fileName1;
    const fd = new FormData();
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]

      if (
        file.type === "application/pdf" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/msword" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type ===
        "application/vnd.openxmlformats-officedocument.presentationml.presentation"
      ) {

        fd.append("files", file);
        const fileName = file.name;

        filesNameArr.push(fileName);
      }
      else {
        alert(
          "Please Select Valid File Type:{DOCX,PPTX,PPT,XLSX,XLS,PDF,JPEG,PNG,JPG}"
        );
        return
      }

    }

    setFileName1(filesNameArr);
    if (fileName) {
      const updatedFormData = new FormData();
      for (let [key, value] of fileName.entries()) {
        updatedFormData.append(key, value);
      }
      for (let [key, value] of fd.entries()) {
        updatedFormData.append(key, value);
      }
      setFileName(updatedFormData);
    } else {
      setFileName(fd)
    }


  };

  // let filesName = [];
  // for (let fName of fileName1) {
  //   filesName.push(fName);
  // }

  //  add task function =============================
  const role = sessionStorage.getItem("role");
  const createTask = (values) => {
    setLoading(true);
    try {
      props
        .addActionTask(values, role)
        .then((res) => {
          try {
            if (fileName1.length > 0) {
              props.filesUpload(
                res.response.assignmentId,
                fileName,
                deptName,
                role
              );
            }
          } catch (error) {
            callMessageOut(error);
          }

          try {
            if (res.error) {
              callMessageOut(res.error);
              setLoading(false);
            } else {
              props.handleData(res.response);

              dispatch(setSnackbar(true, "success", `${t("task_created")} !`));
              setLoading(false);
              props.taskClosehandleClick();
            }
          } catch (error) {
            setLoading(false);
            callMessageOut(error.error);
          }
        })
        .catch((res) => {
          setLoading(false);
          callMessageOut(res.error);
        });
    } catch (error) { }
  };

  const validationSchema = yup.object({
    subject: yup.string().required("Subject Is Required"),
    description: yup.string().required("Description Is Required"),
    dueDate: yup.string().required("Due Date Is Required"),
    internalUsers: yup.array(),
    externalUsers: yup.array().test({
      name: "external-users-required",
      // test: function (value) {
      //   const internalUsers = this.parent.internalUsers;
      //   if (!internalUsers || internalUsers.length === 0) {
      //     return (
      //       (!!value && value.length > 0) ||
      //       this.createError({
      //         message: "External User is required when Internal User is empty",
      //       })
      //     );
      //   }
      //   return true;
      // },
      test: function (value) {
        const internalUsers = this.parent.internalUsers;
        const recipientDepartments = this.parent.recipientDepartments;
        if (
          (!internalUsers || internalUsers.length === 0) &&
          (!recipientDepartments || recipientDepartments.length === 0)
        ) {
          return this.createError({
            message:
              "At least one external user is required when internal users are empty",
          });
        }
        return true;
      },
    }),
  });

  const formik = useFormik({
    initialValues: {
      externalUsers: [],
      internalUsers: [],
      description: "",
      subject: "",
      oldReference: "",
      newReference: "",
      onBehalfOf: "",
      dueDate: "",
      recipientDepartments: [],
      priority: "medium",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formattedDate = moment(values.dueDate).format("DD/MM/YYYY hh:mm A");

      const newValue = {
        ...values,
        dueDate: formattedDate,
      };
      createTask(newValue);
      props.getAllTaskDatas();
      props.actionpoint(!props.actiondata);
    },
  });

  //  eyes olny mode user

  async function getInternalGroupListFunc(value) {
    if (value && value.length > 2) {
      const dept = sessionStorage.getItem("department");
      await props
        .getServiceNumber(value, dept)
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
            } else {
              let tmpArray = [];
              if (resp.data.length) {
                for (let i = 0; i < resp.data.length; i++) {
                  if (
                    resp.data[i].deptRole.length &&
                    resp.data[i].deptRole[0] != null
                  ) {
                    for (let j = 0; j < resp.data[i].deptRole.length; j++) {
                      let newObj = {
                        ...resp.data[i],
                        deptRole: [resp.data[i].deptRole[j]],
                      };
                      tmpArray.push(newObj);
                    }
                  }
                }
              }

              setEyesOnlyArr(tmpArray);
            }
          } catch (err) {
            callMessageOut(err.message);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
        });
    }
  }

  const optimizedEyesOnlyInpChange = useCallback(
    debounce(getInternalGroupListFunc),
    []
  );

  const handleEyesOnlyInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedEyesOnlyInpChange(e.target.value);
      }
    }
  };

  const eyeOnlyHandleOnChange = (newValue) => {
    let tempArr = [];

    if (newValue && newValue.length > 0) {
      for (var i = 0; i < newValue?.deptRole; i++) {
        tempArr.push(newValue[i]);
      }

      setEyesOnlyDep(tempArr);
    }
    formik.setFieldValue("externalUsers", [newValue?.deptRole[0].roleName]);
  };
  // -----------------end------------

  const handleOnChangeInternalService = (newValue) => {
    if (newValue && newValue.length > 0) {
      let tempArr = [];
      for (var i = 0; i < newValue.length; i++) {
        tempArr.push(newValue[i].deptRole[0]?.roleName);
      }

      formik.setFieldValue("internalUsers", tempArr);

      handleClearList("section");
    }
  };
  // const handleOnChangeInternalService = (newValue) => {
  //   if (Array.isArray(newValue) && newValue.length > 0) {
  //     let tempArr = newValue.map((item) => item?.deptRole[0]?.roleName);
  //     formik.setFieldValue("internalUsers", tempArr);
  //     handleClearList("section");
  //   }
  // };

  const handleOnChangeOnBehalfOf = (newValue) => {
    if (newValue && newValue.length > 0) {
      let tempArr = [];
      for (var i = 0; i < newValue?.length; i++) {
        tempArr.push(newValue[i].deptRole[0]?.roleName);
      }

      handleClearList("section");
    }
    formik.setFieldValue("onBehalfOf", newValue?.deptRole[0]?.roleName);
  };

  const handleInputValueChangeInternalService = async (newValue) => {
    setIsInt(true)
    const dept = sessionStorage.getItem("department");
    await props.getInternalServiceNumber(newValue, dept).then((resp) => {
      setIntServiceObj(resp.data);

      try {
        if (resp.error) {
          callMessageOut(resp.error);
          setIsInt(false)
        } else {
          let tmpArray = [];
          if (resp.data.length) {
            for (let i = 0; i < resp.data.length; i++) {
              if (
                resp.data[i].deptRole.length &&
                resp.data[i].deptRole[0] != null
              ) {
                for (let j = 0; j < resp.data[i].deptRole.length; j++) {
                  let newObj = {
                    ...resp.data[i],
                    deptRole: [resp.data[i].deptRole[j]],
                  };
                  tmpArray.push(newObj);
                }
              }
            }
          }

          setIntServiceList(tmpArray);
          setIsInt(false)
        }
      } catch (err) {
        callMessageOut(err.message);
        setIsInt(false)
      }
    });
    // setSectionList([]);
    // setServiceList([]);
  };

  // const handleInputValueChangeInternalService = async (newValue) => {
  //   const dept = sessionStorage.getItem("department");
  //   try {
  //     const resp = await props.getInternalServiceNumber(newValue, dept);
  //     setIntServiceObj(resp?.data);

  //     if (resp.error) {
  //       callMessageOut(resp.error);
  //     } else {
  //       let tmpArray = [];
  //       if (Array.isArray(resp.data) && resp.data.length) {
  //         resp.data.forEach((item) => {
  //           if (Array.isArray(item.deptRole) && item.deptRole.length) {
  //             item.deptRole.forEach((role) => {
  //               let newObj = { ...item, deptRole: [role] };
  //               tmpArray.push(newObj);
  //             });
  //           }
  //         });
  //       }

  //       setIntServiceList(tmpArray);
  //       console.log("intServiceList:", tmpArray); // Debugging step
  //     }
  //   } catch (err) {
  //     callMessageOut(err.message);
  //   }
  //   setSectionList([]);
  //   setServiceList([]);
  // };

  const handleInputValueChange = async (newValue) => {
    setIsExt(true)
    let formData = new FormData();
    formData.append("sau", newValue);
    try {
      await props.getGroupList(formData).then((resp) => {
        setSectionObj([...sectionObj, resp.data]);

        setSectionList(resp.data);
        setIsExt(false)
      });
    } catch (error) {
      setIsExt(false)
    }

    // setServiceList([]);
    // setIntServiceList([]);
  };

  const [refrenceData, setRefrenceData] = useState([]);

  useEffect(() => {
    try {
      props.refcences(deptName).then((res) => {
        if (res.error) {
          // callMessageOut(res.error);
        } else {
          setRefrenceData(res.response);
        }
      });
      // .catch((error) => {
      //   callMessageOut(error.error);
      // });
    } catch (error) {
      // callMessageOut(error);
    }
    handleInputValueChangeInternalService("")
  }, []);

  const optimizedSectionList = useCallback(
    debounce(handleInputValueChange),
    []
  );

  const optimizedInternalList = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );


  const handleClearList = (type) => {
    switch (type) {
      case "service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "section":
        return (
          setService(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "internal_service":
        return (
          setSection(""),
          setService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_service":
        return (
          setSection(""),
          setIntService(""),
          setService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_section":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setService(""),
          setFavIntService("")
        );
      case "fav_internal_service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setService("")
        );
      default:
        break;
    }
  };



  const handleOnChange = (newValue) => {
    let tempArr = [];
    for (let i = 0; i < newValue.length; i++) {
      tempArr.push(newValue[i].deptName);
    }

    formik.setFieldValue("recipientDepartments", tempArr);

    newValue && newValue.length > 0 && handleClearList("section");
  };

  const recipientDepartmentsHandleOnChange = (newValue) => {
    formik.setFieldValue("recipientDepartments", newValue);
    newValue && newValue.length > 0 && handleClearList("section");
  };

  const handleChangePriority = (type) => {
    formik.setFieldValue("priority", type);
  };

  const handleFileDelete = (item) => {
    const newFormData = new FormData();
    for (let [key, value] of fileName.entries()) {
      if (fileName.getAll(key).indexOf(value) === item) {
        continue;
      }
      newFormData.append(key, value);
    }
    setFileName(newFormData);

    let newFileName = fileName1.filter((_, index) => index !== item);
    setFileName1(newFileName)
  }



  return (
    <div className="actionpoint">
      <Dialog
        open={props.firsts}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        className="add-task-btn"
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          {t("create_task")}
          <Tooltip title={t("cancel")}>
            <IconButton
              id="create_task"
              aria-label="close"
              onClick={props.taskClosehandleClick}
              color="primary"
              className="cancel-drag"
            >
              <CancelIcon
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        {/* <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <Typography variant="h6">
            {t("CREATE TASK")}
            <IconButton
              aria-label="close"
              style={{
                float: "right",
                height: "45px",
                width: "45px",
                color: "#3131d5",
              }}
            >
              <Tooltip title={"close"} aria-label="close">
                <CloseIcon color="primary" fontSize="mediume" />
              </Tooltip>
            </IconButton>
          </Typography>
        </DialogTitle> */}
        <form>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  autoFocus
                  id="subject"
                  name="subject"
                  label={t("subject")}
                  size="small"
                  variant="outlined"
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={refrenceData}
                  id="tags-outlined"
                  onChange={(event, newValue) => {
                    formik.setFieldValue("reference", newValue);
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("refrence")}
                      size="small"
                      value={formik.values.oldReference}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="newReference"
                  name="newReference"
                  label={t("new_refrence")}
                  size="small"
                  variant="outlined"
                  value={formik.values.newReference}
                  onChange={formik.handleChange}
                />
              </Grid>

              <Grid item xs={6}>
                <Autocomplete
                  options={intServiceList}
                  id="tags-outlined"
                  // onInputChange={(event, newInputValue) => {
                  //   optimizedInternalList(newInputValue)
                  // }}
                  onChange={(event, newValue) => {
                    handleOnChangeOnBehalfOf(newValue);
                  }}
                  getOptionLabel={(option) => {
                    return typeof option === "object"
                      ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                      : "";
                  }}
                  size="small"
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      variant="outlined"
                      label={t("on_behalf_of")}
                      value={formik.values.onBehalfOf}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isInt ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} className="date-picker">
                <TextField
                  id="dueDate"
                  required
                  label={t("dueDate")}
                  variant="outlined"
                  placeholder="due date"
                  type="date"
                  fullWidth
                  size="small"
                  name="dueDate"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ min: disabledPreviousDate }}
                  value={formik.values.dueDate}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.dueDate && Boolean(formik.errors.dueDate)
                  }
                  helperText={formik.touched.dueDate && formik.errors.dueDate}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  id="description"
                  required
                  name="description"
                  label={t("description")}
                  size="small"
                  variant="outlined"
                  multiline
                  minRows={3}
                  maxRows={3}
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.description &&
                    Boolean(formik.errors.description)
                  }
                  helperText={
                    formik.touched.description && formik.errors.description
                  }
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  options={intServiceList}
                  id="tags-outlined"
                  multiple
                  disableCloseOnSelect
                  onInputChange={(event, newInputValue) => {
                    // if (newInputValue.length >= 3) {
                    //   handleInputValueChangeInternalService(newInputValue);
                    // }
                  }}
                  onChange={(event, newValue) => {
                    handleOnChangeInternalService(newValue);
                  }}
                  getOptionLabel={(option) => {
                    return typeof option === "object"
                      ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                      : "";
                  }}
                  size="small"
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("select_to_send_internally_within_section")}
                      // placeholder={t("SEARCH BY INTERNAL USER")}
                      value={formik.values.internalUsers}
                      error={
                        formik.touched.internalUsers &&
                        Boolean(formik.errors.internalUsers)
                      }
                      helperText={
                        formik.touched.internalUsers &&
                        formik.errors.internalUsers
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isInt ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
                {/* <Autocomplete
                  options={intServiceList}
                  id="tags-outlined"
                  multiple
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue.length >= 3) {
                      handleInputValueChangeInternalService(newInputValue);
                    }
                  }}
                  onChange={(event, newValue) => {
                    handleOnChangeInternalService(newValue);
                  }}
                  getOptionLabel={(option) => {
                    return typeof option === "object"
                      ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                      : "";
                  }}
                  size="small"
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("select_to_send_internally_within_section")}
                      value={formik.values.internalUsers}
                      error={
                        formik.touched.internalUsers &&
                        Boolean(formik.errors.internalUsers)
                      }
                      helperText={
                        formik.touched.internalUsers &&
                        formik.errors.internalUsers
                      }
                    />
                  )}
                /> */}
              </Grid>
              {/* <Grid item xs={12}>
                 <Autocomplete
                freeSolo
                forcePopupIcon={true}
                options={eyesOnlyArr}
                value={eyesOnlyDep}
                getOptionLabel={(option) => {
                  return typeof option === "object"
                    ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                    : "";
                }}
                id="tags-outlined"
                onChange={(event, newValue) => {
                  eyeOnlyHandleOnChange(newValue);
                }}
                size="small"
                onInputChange={handleEyesOnlyInputChange}
                filterSelectedOptions
                getOptionDisabled={(option) => {
                  option?.deptRole[0]?.displayRoleName;
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ width: "100%" }}
                    variant="outlined"
                    label={t("eyes_only")}
                    className={props.theme ? "darkTextField" : ""}
                  />
                )}
              />
              </Grid> */}

              <Grid item xs={12}>
                <div className="action_point_send_or">
                  <span></span>
                  <span>OR</span>
                </div>
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  id="tags-outlined"
                  options={sectionList}
                  onInputChange={(event, newInputValue) => {
                    if (newInputValue.length >= 3) {
                      optimizedSectionList(newInputValue);
                    }
                  }}
                  onChange={(event, newValue) => {
                    handleOnChange(newValue);
                  }}
                  getOptionLabel={(option) => option.deptDisplayName}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label={t("select_to_send_to_external_section")}
                      // placeholder={t("SEARCH BY EXTERNAL DEPARTMENT")}
                      error={
                        formik.touched.externalUsers &&
                        Boolean(formik.errors.externalUsers)
                      }
                      helperText={
                        formik.touched.externalUsers &&
                        formik.errors.externalUsers
                      }
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isExt ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              {/* <Grid item xs={5}>
                 <FormControl
                  style={{
                    paddingLeft: "4px",
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    // paddingTop: "10px",
                  }}
                >
                  <h6>{t("priority")}:</h6>
                  <Box className={classes.priority_box}>
                    <Tooltip title={t("low")}>
                      <IconButton
                        className={classes.priority_btn}
                        onClick={() => formik.setFieldValue("priority", "low")}
                        style={{
                          background:
                            formik.values.priority == "low"
                              ? "rgb(53 76 100 / 39%)"
                              : "none",
                        }}
                      >
                        <FcLowPriority />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title={t("high")}>
                      <IconButton
                        className={classes.priority_btn}
                        onClick={() => formik.setFieldValue("priority", "high")}
                        style={{
                          background:
                            formik.values.priority == "high"
                              ? "rgb(53 76 100 / 39%)"
                              : "none",
                        }}
                      >
                        <FcHighPriority />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </FormControl> 

                
              </Grid> */}
              <Grid item xs={12}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: ".5rem",
                    justifyContent: "center",
                  }}
                >
                  <p>{t("priority")} :&nbsp;&nbsp;</p>

                  <TripleToggleSwitch
                    priority={formik.values.priority}
                    handleChange={handleChangePriority}
                  />
                </div>
              </Grid>

              <Grid item xs={6}>
                <Button
                  component="label"
                  variant="contained"
                  color="primary"
                  fullWidth
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  onChange={fileHandleChange}
                >
                  {t("attach_file")}
                  <VisuallyHiddenInput type="file" multiple fullWidth />
                </Button>
              </Grid>
              <Grid item xs={6}>
                {fileName1 &&
                  fileName1.map((item, index) => {
                    // return <li style={{ listStyle: "none" }}> {item}</li>;

                    return <Tooltip title={item}><Chip label={item} onDelete={() => handleFileDelete(index)} style={{ marginLeft: "5px", marginBottom: "4px", maxWidth: "15vw" }}
                      size="small" variant="outlined" /></Tooltip>



                  })}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              endIcon={<DoneIcon />}
              variant="contained"
              color="secondary"
              type="submit"
              // className="submitButton"
              onClick={formik.handleSubmit}
              style={{
                // opacity: 0.7,
                backgroundColor: loading ? "#f0f0f0" : "",
              }}
              disabled={loading}
            >
              {loading ? (
                <>
                  LOADING
                  <CircularProgress size={24} />
                </>
              ) : (
                t("send")
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
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
  addActionTask,
  filesUpload,
  refcences,
  getGroupList,
  getInternalServiceNumber,
  getServiceNumber,
})(ActionPointOpenForm);
