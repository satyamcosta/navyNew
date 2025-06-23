import React, { useEffect, useState, useContext } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Autocomplete,
  Button,
  Paper,
  IconButton,
  Tooltip,
  TextField,
  Chip
} from "@mui/material";
import { Cancel, Done } from "@mui/icons-material";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import * as yup from "yup";
import moment from "moment";
import { refcences, createActionTask } from "app/camunda_redux/redux/action";
import { connect } from "react-redux";
import TripleToggleSwitch from "app/views/Personnel/PrioritySwitch/Three";
import Cookies from "js-cookie";
import {
  getInternalServiceNumber,
  getServiceNumber,
  getGroupList,
  filesUpload
} from "app/camunda_redux/redux/action";
import { useDispatch } from "react-redux";
import { styled } from "@mui/material/styles";
import { handleError } from "utils";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import history from "../../../../../history.js";
import "../../therme-source/material-ui/loading.css"
import { Loading } from "../../therme-source/material-ui/loading.jsx"
import "../../../ActionPoints/shared/index.css"
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { CorrContext } from "./Worker.js"

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

function ActionPointForm(props) {
  const { open, handleClose, fileURLs,fileUrlwithNameNoting, fileUrlwithNameEnclousere , annexureList,
    referenceList, noteObj} = props;
  const { t } = useTranslation();
  const department = sessionStorage.getItem("department");
  const subject = Cookies.get("inboxFile");
  const disabledPreviousDate = new Date().toISOString().split("T")[0];
  const dispatch = useDispatch();
  const [refrenceData, setRefrenceData] = useState([]);
  const [intUserList, setIntUserList] = useState([]);
  const [extDeptList, setExtDeptList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [fileName1, setfileName1] = useState(["sattya", "shiva"])
  const isOutBox = Cookies.get("isOutbox") === "true";
  const [files, setFiles] = useState([]); // each item: { name: string, file: File }

  const [fileURLsOfNoting, setFileURLsOfNoting] = useState(
    fileUrlwithNameNoting?.map((file) => file.fileUrl) || []
  );
  const [fileURLsOfEnclousere, setFileURLsOfEnclousere] = useState(
    fileUrlwithNameEnclousere?.map((file) => file.fileUrl) || []
  );

  const [fileURLsOfAnnexture, setFileURLsOfAnnexture] = useState(
    annexureList?.map((file) => file.fileUrl) || []
  );
  const [fileURLsOfReference, setFileURLsOfReference] = useState(
    referenceList?.map((file) => file.fileUrl) || []
  );
  const [fileURLsOfNote, setFileURLsOfNote] = useState(
    noteObj ? [noteObj.fileUrl] : []
  );
  

  useEffect(() => {
    if (annexureList?.length) {
      setFileURLsOfAnnexture(annexureList.map((file) => file.fileUrl));
    }
  }, [annexureList]);

  useEffect(() => {
    if (referenceList?.length) {
      setFileURLsOfReference(referenceList.map((file) => file.fileUrl));
    }
  }, [referenceList]);
  useEffect(() => {
    if (noteObj) {
      setFileURLsOfNote([noteObj.fileUrl]);
    } else {
      setFileURLsOfNote([]);
    }
  }, [noteObj]);
  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };
  // if(CorrContext) {
  // const {noteObj} = useContext(CorrContext);

  //   console.log("nojjjj",noteObj)

  // }

  console.log("noteObj", fileURLs);
  // console.log("annexureList",annexureList);
  // console.log("referenceList",referenceList);
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
  // const createTask =  async (values) => {
  //   setPageLoading(true);
  //   try {
  //     props
  //       .createActionTask(values)
  //       .then((res) => {
  //         if (res.error) {
  //           callMessageOut(res.error);
  //           console.log(err);
  //           setPageLoading(false);
  //         } else {
  //           if (files.length > 0) {
  //             console.log("files lenth is", files.length);
  //             try {
  //               const fd = new FormData();
    
  //               files.forEach((f) => {
  //                 fd.append("files", f.file); // Use File obj
  //               });
  //                props.filesUpload(res.response.assignmentId, fd, null, null);
  //             } catch (uploadErr) {
  //               console.error("Upload failed", uploadErr);
  //               callMessageOut("File upload failed.");
  //             }
  //           }
  //           dispatch(setSnackbar(true, "success", `${t("task_created")}`));
  //           history.push({
  //             pathname: `${"/eoffice/actionpoint"}`,
  //           });
  //           setPageLoading(false);
  //         }
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   } catch (err) {
  //     callMessageOut(err.message);
  //     console.log(err);
  //   }
  // };
  const createTask = async (values) => {
    setLoading(true);
    try {
      const res = await props.createActionTask(values);

      if (res.error) {
        callMessageOut(res.error);
        console.log(res.error);
      } else {
        // ✅ Upload files *after* task creation
        if (files.length > 0) {
          console.log("files lenth is", files.length);
          try {
            const fd = new FormData();

            files.forEach((f) => {
              fd.append("files", f.file); // Use File obj
            });
            await props.filesUpload(res.response.assignmentId, fd, null, null);
          } catch (uploadErr) {
            console.error("Upload failed", uploadErr);
            callMessageOut("File upload failed.");
          }
        }

        dispatch(setSnackbar(true, "success", `${t("task_created")}`));
        history.push({
          pathname: `${"/eoffice/actionpoint"}`,
        });
      }
    } catch (err) {
      callMessageOut(err.message || "Task creation failed");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fileHandleChange = (e) => {
    const newFiles = [];
    for (let i = 0; i < e.target.files.length; i++) {
      newFiles.push({
        name: e.target.files[i].name,
        file: e.target.files[i],
      });
    }

    setFiles((prev) => [...prev, ...newFiles]); // merge with existing files
  };
  const handleDelete = (nameToDelete) => {
    setFiles((prev) => prev.filter((fileObj) => fileObj.name !== nameToDelete));
  };

  const validationSchema = yup
    .object({
      subject: yup.string().required("Subject is required"),
      description: yup.string().required("Description is required"),
      dueDate: yup.string().required("Due date is required"),
      internalUsers: yup.array(),
      externalUsers: yup.array(),
    })
    .test(
      // At least one of internal user or external users is required
      function (value) {
        const { internalUsers, externalUsers } = value;
        const hasInternal =
          Array.isArray(internalUsers) && internalUsers.length > 0;
        const hasExternal =
          Array.isArray(externalUsers) && externalUsers.length > 0;
        return hasInternal || hasExternal;
      }
    );
  const formik = useFormik({
    initialValues: {
      externalUsers: [],
      internalUsers: [],
      description: "",
      subject: subject,
      oldReference: "",
      newReference: "",
      onBehalfOf: null,
      dueDate: "",
      priority: "medium",
      fileUrls: fileURLs,
      recipientDepartments: [],
    },
    validationSchema: validationSchema,

    onSubmit: (values) => {
      setPageLoading(true);
      const formattedDate = moment(values.dueDate).format("DD/MM/YYYY hh:mm A");
      const internalRoles = values.internalUsers.map(
        (user) => user?.deptRole?.[0]?.roleName
      );
      const externalDept = values.recipientDepartments.map(
        (user) => user?.deptName
      );
      const newValue = {
        ...values,
        dueDate: formattedDate,
        onBehalfOf: values.onBehalfOf?.deptRole?.[0]?.roleName || "",
        internalUsers: internalRoles,
        recipientDepartments: externalDept,
        fileUrls: [...fileURLsOfAnnexture, ...fileURLsOfReference, ...fileURLsOfNote,...fileURLsOfNoting,...fileURLsOfEnclousere],
      };

      //call api here for creating action point
      console.log(newValue);
      createTask(newValue);
      setPageLoading(false);
      handleClose();

    },
  });

  console.log("hi test")
  // call the reference api here
  useEffect(() => {
    setLoading(true);
    props.refcences(department).then((resp) => {
      if (resp.error) {
        console.log(resp.error);
        setLoading(false);
      } else {
        setRefrenceData(resp.response);
        setLoading(false);
      }
    });
  }, []);

  console.log("reference", refrenceData);
  const handleOnChangeOnBehalfOf = (newValue) => {
    formik.setFieldValue("onBehalfOf", newValue);
  };
  const handleOnChangeInternalUser = (newValue) => {
    formik.setFieldValue("internalUsers", newValue);
  };
  const handleOnChangeExtDept = (newValue) => {
    formik.setFieldValue("recipientDepartments", newValue);
  };
  const handleChangePriority = (type) => {
    formik.setFieldValue("priority", type);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await props.getInternalServiceNumber("", department);
        if (res.error) {
          let errMsg = handleError(res.error);
          callMessageOut(errMsg);
        } else {
          let tmpArray = [];
          if (res?.data?.length) {
            for (let i = 0; i < res.data.length; i++) {
              if (
                res.data[i].deptRole.length &&
                res.data[i].deptRole[0] != null
              ) {
                for (let j = 0; j < res.data[i].deptRole.length; j++) {
                  let newObj = {
                    ...res.data[i],
                    deptRole: [res.data[i].deptRole[j]],
                  };
                  tmpArray.push(newObj);
                }
              }
            }
            setIntUserList(tmpArray);
            setLoading(false);
          }
        }
      } catch (err) {
        callMessageOut(err.message);
      }
    };

    fetchData();
  }, []);

  const handleExternalValueChange = async () => {
    setLoading(true);
    let formData = new FormData();
    formData.append("sau", "");
    try {
      await props.getGroupList(formData).then((resp) => {
        setExtDeptList(resp.data);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    handleExternalValueChange();
  }, []);

  return (
    <div className="actionpoint">
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        className="add-task-btn"
        PaperProps={{
          style: {
            width: "60vw",
            maxWidth: "none", // allows it to go beyond default max width
          },
        }}
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{
            cursor: "move",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          className="send_dialog"
        >
          {t("create_task")}
          <Tooltip title={t("cancel")}>
            <IconButton
              id="create_task"
              aria-label="close"
              onClick={handleClose}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <form>
          <DialogContent dividers>
            {pageLoading && <Loading />}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
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
                  InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                  InputProps={{
                    style: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={refrenceData}
                  id="tags-outlined"
                  loading={loading}
                  value={formik.values.oldReference}
                  onChange={(event, newValue) => {
                    formik.setFieldValue("oldReference", newValue);
                  }}
                  isOptionEqualToValue={(option, value) => option === value}
                  getOptionLabel={(option) => option || ""}
                  size="small"
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("refrence")}
                      error={
                        formik.touched.oldReference &&
                        Boolean(formik.errors.oldReference)
                      }
                      helperText={
                        formik.touched.oldReference &&
                        formik.errors.oldReference
                      }
                      InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress
                                sx={{ color: "#043c75" }}
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                        style: { fontSize: "0.8rem" },
                      }}
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
                  InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                  InputProps={{
                    style: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <Autocomplete
                  options={intUserList || []}
                  id="tags-outlined"
                  loading={loading}
                  value={formik.values.onBehalfOf}
                  onChange={(event, newValue) => {
                    handleOnChangeOnBehalfOf(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.id === value.id
                  }
                  getOptionLabel={(option) => {
                    if (!option || typeof option !== "object") return "";
                    return `${option?.deptUsername || ""} | ${option?.deptDisplayUsername || ""
                      } | ${option?.deptRole?.[0]?.displayRoleName || ""}`;
                  }}
                  size="small"
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("on_behalf_of")}
                      error={
                        formik.touched.onBehalfOf &&
                        Boolean(formik.errors.onBehalfOf)
                      }
                      helperText={
                        formik.touched.onBehalfOf && formik.errors.onBehalfOf
                      }
                      InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress
                                sx={{ color: "#043c75" }}
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                        style: { fontSize: "0.8rem" },
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
                  InputLabelProps={{ shrink: true, fontSize: "0.8rem" }}
                  InputProps={{
                    style: { fontSize: "0.8rem", width: "100%" },
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
                  label={t("description")}
                  size="small"
                  name="description"
                  required
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
                  InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                  InputProps={{
                    style: { fontSize: "0.8rem" },
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Autocomplete
                  required
                  options={intUserList || []}
                  id="tags-outlined"
                  loading={loading}
                  multiple
                  value={formik.values.internalUsers}
                  onChange={(event, newValue) => {
                    handleOnChangeInternalUser(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.deptRole?.[0]?.displayRoleName ===
                    value?.deptRole?.[0]?.displayRoleName
                  }
                  getOptionLabel={(option) => {
                    if (!option || typeof option !== "object") return "";
                    return `${option?.deptUsername || ""} | ${option?.deptDisplayUsername || ""
                      } | ${option?.deptRole?.[0]?.displayRoleName || ""}`;
                  }}
                  size="small"
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("select_to_send_internally_within_section")}
                      error={
                        formik.touched.internalUsers &&
                        Boolean(formik.errors.internalUsers)
                      }
                      helperText={
                        formik.touched.internalUsers &&
                        formik.errors.internalUsers
                      }
                      InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress
                                sx={{ color: "#043c75" }}
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <div className="action_point_send_or">
                  <span></span>
                  <span>OR</span>
                </div>
              </Grid>
              <Grid item xs={7}>
                <Autocomplete
                  required
                  options={extDeptList || []}
                  id="tags-outlined"
                  loading={loading}
                  multiple
                  value={formik.values.recipientDepartments}
                  onChange={(event, newValue) => {
                    handleOnChangeExtDept(newValue);
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option?.deptDisplayName === value?.deptDisplayName
                  }
                  getOptionLabel={(option) => {
                    if (!option || typeof option !== "object") return "";
                    return `${option?.deptDisplayName || ""} `;
                  }}
                  size="small"
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("select_to_send_to_external_section")}
                      error={
                        formik.touched.recipientDepartments &&
                        Boolean(formik.errors.recipientDepartments)
                      }
                      helperText={
                        formik.touched.recipientDepartments &&
                        formik.errors.recipientDepartments
                      }
                      InputLabelProps={{ style: { fontSize: "0.8rem" } }}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {loading ? (
                              <CircularProgress
                                sx={{ color: "#043c75" }}
                                size={20}
                              />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                        style: { fontSize: "0.8rem" },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={5}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                    gap: ".5rem",
                    justifyContent: "start",
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
                  startIcon={<CloudUploadIcon />}
                >
                  {t("attach_file")}
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={fileHandleChange}
                  />
                </Button>
              </Grid>
              {files.map((fileObj) => (
                  <Chip
                    key={fileObj.name}
                    label={fileObj.name}
                    onDelete={() => handleDelete(fileObj.name)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              {fileUrlwithNameNoting
                ?.filter((file) => fileURLsOfNoting.includes(file?.fileUrl)) // ✅ this is the key fix
                .map((file) => (
                  <Chip
                    key={file?.fileUrl}
                    label={file?.fileName}
                    onDelete={() =>
                      setFileURLsOfNoting((prev) =>
                        prev.filter((url) => url !== file?.fileUrl)
                      )
                    }
                    sx={{ m: 0.5 }}
                  />
                ))}
              {fileUrlwithNameEnclousere
                ?.filter((file) => fileURLsOfEnclousere.includes(file?.fileUrl)) // ✅ this is the key fix
                .map((file) => (
                  <Chip
                    key={file?.fileUrl}
                    label={file?.fileName}
                    onDelete={() =>
                      setFileURLsOfEnclousere((prev) =>
                        prev.filter((url) => url !== file?.fileUrl)
                      )
                    }
                    sx={{ m: 0.5 }}
                  />
                ))}
                {noteObj &&
                fileURLsOfNote.includes(noteObj.fileUrl) && (
                  <Chip
                    key={noteObj.fileUrl}
                    label={noteObj.fileName}
                    onDelete={() =>
                      setFileURLsOfNote((prev) =>
                        prev.filter((url) => url !== noteObj.fileUrl)
                      )
                    }
                    sx={{ m: 0.5 }}
                  />
                )}

              {annexureList
                ?.filter((file) => fileURLsOfAnnexture.includes(file?.fileUrl)) // ✅ this is the key fix
                .map((file) => (
                  <Chip
                    key={file?.fileUrl}
                    label={file?.fileName}
                    onDelete={() =>
                      setFileURLsOfAnnexture((prev) =>
                        prev.filter((url) => url !== file?.fileUrl)
                      )
                    }
                    sx={{ m: 0.5 }}
                  />
                ))}
              {referenceList
                ?.filter((file) => fileURLsOfReference.includes(file?.fileUrl)) // ✅ this is the key fix
                .map((file) => (
                  <Chip
                    key={file?.fileUrl}
                    label={file?.fileName}
                    onDelete={() =>
                      setFileURLsOfReference((prev) =>
                        prev.filter((url) => url !== file?.fileUrl)
                      )
                    }
                    sx={{ m: 0.5 }}
                  />
                ))}

              {/* <Grid item xs={6}>
                {fileName1 &&
                  fileName1.map((item, index) => {
                    // return <li style={{ listStyle: "none" }}> {item}</li>;

                    return <Tooltip title={item}><Chip label={item} onDelete={()=>{}} style={{ marginLeft: "5px", marginBottom: "4px", maxWidth: "15vw" }}
                      size="small" variant="outlined" /></Tooltip>



                  })}
              </Grid> */}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              endIcon={<Done />}
              variant="contained"
              type="submit"
              onClick={formik.handleSubmit}
              disabled={loading}
              sx={{ backgroundColor: "#043c75" }}
            >
              {loading ? (
                <>
                  LOADING
                  <CircularProgress size={24} />
                </>
              ) : (
                t("create")
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
  refcences,
  getInternalServiceNumber,
  getServiceNumber,
  getGroupList,
  createActionTask,
  filesUpload
})(ActionPointForm);
