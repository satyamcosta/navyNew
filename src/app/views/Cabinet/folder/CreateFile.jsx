import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Close, Cancel, Done, Undo, Clear, Print } from "@material-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState, useCallback, useRef } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import {
  createFile,
  getSubSection,
  getBlock,
  getCustodian,
  getSectionData,
} from "app/camunda_redux/redux/action/index";
import { connect, useDispatch } from "react-redux";
import { Autocomplete } from "@material-ui/lab";
import { debounce, handleError } from "utils";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { Loading } from "../therme-source/material-ui/loading";
import Cookies from "js-cookie";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import history from "../../../../history";
import BarcodeView from "./BarcodeView";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const PaperComponent2 = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title2" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const useStyles = makeStyles({
  noCursor: {
    cursor: "default",
  },
});

const FileForm = (props) => {
  const classes = useStyles();
  const { open, handleClose, handleTrigger } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [subSectionList, setSubSectionList] = useState([]);
  const [blockList, setBlockList] = useState([]);
  const [custodianData, setCustodianData] = useState([]);
  const [getSection, setGetSection] = useState([]);
  const [autoComplete, setAutoComplete] = useState([]);
  const [userRolesCustodian, setUserRolesCustodian] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blockRange, setBlockRange] = useState("");
  const [blockRangeOptions, setBlockRangeOptions] = useState([]);
  const [fetchType, setFetchType] = useState(true);
  const [fileResponse, setFileResponse] = useState({});
  const [successPopup, setSuccessPopup] = useState(false);

  let branch = sessionStorage.getItem("branch");

  const fileType = ["Unclassified", "Restricted"];
  const fyType = ["22-23", "23-24", "24-25"];

  const config = {
    variant: "outlined",
    size: "small",
    fullWidth: true,
  };

  const INITIAL_STATE = {
    fileClassification: fileType[0],
    financialYear: fyType[2],
    subject: "",
    section: "",
    sectionCode: "",
    codeList: [],
    subSection: [],
    selSubSection: "",
    blockNumber: "",
    selBlockNumber: "",
    volume: 1,
    caseNo: "",
    custodian: ["23"],
    mainHead: "",
    subHead: "",
    oldFile: "",
    connectedFiles: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    fileClassification: Yup.string(t("this_field_is_required")).required(
      `${t("this_field_is_required")} !`
    ),
    financialYear: Yup.string(),
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
    section: "",
    selSubSection: Yup.string(t("this_field_is_required")).required(
      `${t("this_field_is_required")} !`
    ),
    // selBlockNumber: Yup.number(t("this_field_is_required"))
    //   .required(`${t("this_field_is_required")} !`)
    //   .test("is-in-range", "Number is not in the specified range.", (val) => {
    //     // console.log(val);
    //     let rangeArr = blockRangeOptions;
    //     // console.log(rangeArr)
    //     let max = rangeArr[rangeArr.length - 1]?.range;
    //     let min = rangeArr[0]?.range;

    //     return val >= min && val <= max;
    //   }),
    selBlockNumber: Yup.object().shape({
      range: Yup.string().required(t("this_field_is_required")),
    }),
    volume: Yup.string(t("this_field_is_required")),
    caseNo: "",
    // custodian: Yup.array().when("fileClassification", {
    //   is: "Confidential",
    //   then: Yup.array().required(`${t("this_field_is_required")} !`),
    //   otherwise: Yup.array(),
    // }),
    mainHead: "",
    subHead: "",
    oldFile: "",
    connectedFiles: "",
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_SCHEMA,
    validateOnChange: true,
    onSubmit: (values) => {
      setLoading(true);
      //  Connected Files Should be in Array of Strings
      const connectedFilesArray = values.connectedFiles
        .split(",")
        .map((file) => file.trim());
      let data = {
        ...values,
        subSection: values.selSubSection,
        custodian: values.custodian.map((item) => item.roleName),
        blockNumber: values.selBlockNumber?.range,
        connectedFiles: connectedFilesArray,
      };
      props
        .createFile(data, values.sectionCode)
        .then((res) => {
          if (res.error) {
            callMessageOut("error", res.error);
            setLoading(false);
          } else {
            callMessageOut("success", "File created successfully");
            formik.handleReset();
            if (res.response) {
              handleClose();
              setFileResponse(res.response);
              setSuccessPopup(true);
            }

            setLoading(false);
            {
              /*handleTrigger();
            handleClose();
            sessionStorage.setItem("InboxID", res.response?.cabinetId);
            sessionStorage.setItem(
              "pa_id",
              res.response?.file?.personalApplicationInventoryId
            );
            Cookies.set("inboxFile", res.response?.file?.subject);
            Cookies.set("priority", res.response?.file?.priority);
            Cookies.set("cabinetStatus", res.response?.file?.status);
            Cookies.set(
              "referenceNumber",
              res.response?.file?.displayPcFileNumber
            );
            Cookies.set("type", res.response?.file?.type);
            Cookies.set("cabinetpartcase", res.response?.file?.id);
            Cookies.set("cabinetid", res.response?.cabinetId);
            Cookies.set("department", res.response?.file?.department);

            // This cookie will make sure that we are redirecting to splitview from cabinet
            Cookies.set("partCase", true);

            //@@@@@@ Here handling 3 cases of file in cabinet @@@@@@

            // 1. When main file is created from cabinet
            if (res.response.file.status == "Draft") {
              Cookies.set("isDraft", true);
              Cookies.set("isIndex", false);
              Cookies.set("isCabinet", false);
              sessionStorage.setItem("partcaseID", res.response?.file?.id);

              // 2. When file in cabinet is the index file
            } else if (!fetchType) {
              Cookies.set("isDraft", false);
              Cookies.set("isIndex", true);
              Cookies.set("isCabinet", false);
            } else {
              Cookies.set("isDraft", false);
              Cookies.set("isIndex", false);
              Cookies.set("isCabinet", true);
            }

            // Cookies.set("enc", res.response?.encNo);
            // Cookies.set("not", res.response?.notingNo);
            Cookies.set("backPath", "/eoffice/cabinet/file");
            history.push({
              pathname: "/eoffice/splitView/file",
              state: res.response?.file?.subject,
            });*/
            }
          }
          try {
          } catch (error) {
            callMessageOut("error", error);
          }
        })
        .catch((error) => {
          callMessageOut("error", error);
          setLoading(false);
        });
    },
  });

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  let department = sessionStorage.getItem("parent-dir") || sessionStorage.getItem("department");

  useEffect(() => {
    const getFormData = async () => {
      const [res1] = await Promise.all([
        // getSectionData(),
        getSubSection(),
        // getBlock(),
      ]);
      if (res1.response) {
        // formik.setFieldValue("subSection", res1.response);
        setSubSectionList(res1.response);
      }
    };
    if (open) getFormData();
  }, [open]);

  useEffect(() => {
    if (formik.values.selSubSection) getBlock(formik.values.selSubSection);
  }, [formik.values.selSubSection]);

  useEffect(() => {
    const dirCodeList = JSON.parse(sessionStorage.getItem("deptCodeList"))
    if (sessionStorage.getItem("parent-dir")) {
      const dept = sessionStorage.getItem("parent-dir")?.split("-")
      const parentDir = dept.length > 1 ? dept[dept.length - 1] : dept[0]
      formik.setFieldValue("section", parentDir?.toUpperCase());
    }
    else {
      formik.setFieldValue("section", sessionStorage.getItem("displayDept"));
    }
    if (dirCodeList?.length) {
      formik.setFieldValue("sectionCode", dirCodeList[0]);
      formik.setFieldValue("codeList", dirCodeList);
    }
    else {
      formik.setFieldValue("sectionCode", sessionStorage.getItem("deptCode"));
      formik.setFieldValue("codeList", [sessionStorage.getItem("deptCode")]);
    }
  }, [open]);

  console.log(formik.values.codeList)

  // const getSectionData = () => props.getSectionData(department);

  const getSubSection = () => props.getSubSection(department);

  // const getBlock = async () => {
  //   const res = await props.getBlock(department, formik.values.selSubSection);
  //   formik.setFieldValue("blockNumber", res.response.range);
  //   setBlockRange(res.response.range);
  // };

  const getBlock = async () => {
    try {
      const res = await props.getBlock(department, formik.values.selSubSection);
      if (res.error) {
        callMessageOut("error", res.error);
        return;
      } else {
        const range = res.response?.range;

        formik.setFieldValue("blockNumber", range);
        setBlockRangeOptions(range);
      }
    } catch (error) { }
  };

  async function getCustodian(value) {
    await props
      .getCustodian(department, value)
      .then(({ response }) => {
        try {
          if (response.error) {
            callMessageOut("error", response.error);
          } else {
            setCustodianData(response);
          }
        } catch (error) {
          callMessageOut("error", error);
        }
      })
      .catch((error) => {
        callMessageOut("error", error);
      });
  }

  const optimizedInpChange = useCallback(debounce(getCustodian), []);

  const handleInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedInpChange(e.target.value);
      }
    }
  };

  const handlegetSection = (event, newValue) => {
    setAutoComplete(newValue);
  };

  const handlePopupClose = () => {
    setSuccessPopup(false);
    if (fileResponse) {
      handleTrigger();
      sessionStorage.setItem("InboxID", fileResponse?.cabinetId);
      sessionStorage.setItem(
        "pa_id",
        fileResponse?.file?.personalApplicationInventoryId
      );
      sessionStorage.setItem("barcode", fileResponse?.cabinet?.imageDataString);
      Cookies.set("inboxFile", fileResponse?.file?.subject);
      Cookies.set("priority", fileResponse?.file?.priority);
      Cookies.set("cabinetStatus", fileResponse?.file?.status);
      Cookies.set("referenceNumber", fileResponse?.file?.displayPcFileNumber);
      Cookies.set("type", fileResponse?.file?.type);
      Cookies.set("cabinetpartcase", fileResponse?.file?.id);
      Cookies.set("cabinetid", fileResponse?.cabinetId);
      Cookies.set("department", fileResponse?.file?.department);
      Cookies.set("section", fileResponse?.cabinet?.section);
      Cookies.set("classification", fileResponse?.cabinet?.typeOfFile);

      // This cookie will make sure that we are redirecting to splitview from cabinet
      Cookies.set("partCase", true);

      //@@@@@@ Here handling 3 cases of file in cabinet @@@@@@

      // 1. When main file is created from cabinet
      if (fileResponse?.file?.status == "Draft") {
        Cookies.set("isDraft", true);
        Cookies.set("isIndex", false);
        Cookies.set("isCabinet", false);
        sessionStorage.setItem("partcaseID", fileResponse?.file?.id);

        // 2. When file in cabinet is the index file
      } else if (!fetchType) {
        Cookies.set("isDraft", false);
        Cookies.set("isIndex", true);
        Cookies.set("isCabinet", false);
      } else {
        Cookies.set("isDraft", false);
        Cookies.set("isIndex", false);
        Cookies.set("isCabinet", true);
      }

      // Cookies.set("enc", fileResponse?.encNo);
      // Cookies.set("not", fileResponse?.notingNo);
      Cookies.set("backPath", "/eoffice/cabinet/file");
      history.push({
        pathname: "/eoffice/splitView/file",
        state: fileResponse?.file?.subject,
      });
      setFileResponse(null); // Clear the fileToHandle after using it
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            formik.handleReset();
            handleClose();
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        id="cabinet-create-file"
      >
        {loading && <Loading />}
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("create_file")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="create_file_dialog_close_button"
              aria-label="close"
              onClick={() => {
                formik.handleReset();
                handleClose();
              }}
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
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              {/**<Grid item xs={3}>
                <TextField
                  id="outlined-volume-normal"
                  {...config}
                  className={props.theme ? "darkTextField" : ""}
                  label={t("volume")}
                  name="volume"
                  required
                  value={formik.values.volume}
                />
              </Grid>*/}
              {/*
                
                <Grid item xs={6}>
                <TextField
                  {...config}
                  id="outlined-select-fy-native"
                  select
                  className={props.theme ? "darkTextField" : ""}
                  label={t("finanacial_year")}
                  name="financialYear"
                  required
                  value={formik.values.financialYear || "23-24"}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Select Finanacial Year"
                >
                  {fyType.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
                */}
              <Grid item xs={12}>
                <TextField
                  id="outlined-subject-normal"
                  {...config}
                  className={props.theme ? "darkTextField" : ""}
                  label={t("subject")}
                  name="subject"
                  required
                  value={formik.values.subject}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 250 }}
                  placeholder="Enter Subject"
                  error={
                    formik.touched.subject && Boolean(formik.errors.subject)
                  }
                  helperText={formik.touched.subject && formik.errors.subject}
                  autoFocus
                  minRows={4}
                  multiline
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-section-normal"
                  {...config}
                  className={props.theme ? "darkTextField" : ""}
                  label={t("directorate")}
                  name="section"
                  required
                  value={formik.values.section}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Directorate"
                  InputProps={{
                    readOnly: true,
                    classes: {
                      input: classes.noCursor,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  id="outlined-select-sub-section-native"
                  {...config}
                  select
                  className={props.theme ? "darkTextField" : ""}
                  label={t("section")}
                  name="selSubSection"
                  required
                  value={formik.values.selSubSection}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Select Section"
                  error={
                    formik.touched.selSubSection &&
                    Boolean(formik.errors.selSubSection)
                  }
                  helperText={
                    formik.touched.selSubSection && formik.errors.selSubSection
                  }
                >
                  {subSectionList?.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                {/* <TextField
                  id="outlined-select-block-no-native"
                  {...config}
                  label={t("block_no")}
                  name="selBlockNumber"
                  type="text"
                  value={formik.values.selBlockNumber}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.selBlockNumber &&
                    Boolean(formik.errors.selBlockNumber)
                  }
                  helperText={
                    (formik.touched.selBlockNumber &&
                      formik.errors.selBlockNumber) ||
                    (formik.values.blockNumber.length
                      ? `Enter The Block No In A Range Of ${formik.values.blockNumber}`
                      : "")
                  }
                /> */}
                <Autocomplete
                  freeSolo
                  id="outlined-select-block-no-native"
                  options={blockRangeOptions}
                  getOptionLabel={(option) => {
                    if (typeof option == "object")
                      return `${option?.range}-${option?.description}`;
                    else return option;
                  }}
                  // getOptionSelected={(option, value) =>
                  //   option?.toString() === value?.toString()
                  // }
                  value={formik.values.selBlockNumber}
                  onChange={(e, value) => {
                    formik.setFieldValue("selBlockNumber", value);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...config}
                      label={t("series")}
                      name="selBlockNumber"
                      variant="outlined"
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Select Series"
                      className={props.theme ? "darkTextField" : ""}
                      error={
                        formik.touched.selBlockNumber &&
                        Boolean(formik.errors.selBlockNumber?.range)
                      }
                      helperText={
                        formik.touched.selBlockNumber &&
                        formik.errors.selBlockNumber?.range
                      }
                    />
                  )}
                />
              </Grid>
              {/*
                <Grid item xs={4}>
                <TextField
                  id="outlined-main-head-normal"
                  {...config}
                  label={t("main_head")}
                  name="mainHead"
                  className={props.theme ? "darkTextField" : ""}
                  value={formik.values.mainHead}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter Main Head"
                />
              </Grid>
                */}
              <Grid item xs={4}>
                {/* <TextField
                  id="outlined-section-normal"
                  {...config}
                  className={props.theme ? "darkTextField" : ""}
                  label={t("directorate_code")}
                  name="section"
                  required
                  value={formik.values.sectionCode}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Directorate"
                  InputProps={{
                    readOnly: true,
                    classes: {
                      input: classes.noCursor,
                    },
                  }}
                /> */}
                <TextField
                  id="outlined-section-normal"
                  {...config}
                  select
                  className={props.theme ? "darkTextField" : ""}
                  label={t("directorate_code")}
                  name="sectionCode"
                  required
                  value={formik.values.sectionCode}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Directorate"
                >
                  {formik.values.codeList?.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  {...config}
                  id="outlined-select-classification-native"
                  select
                  className={props.theme ? "darkTextField" : ""}
                  label={t("classification")}
                  name="fileClassification"
                  required
                  value={formik.values.fileClassification}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Select Classification Type"
                  error={
                    formik.touched.fileClassification &&
                    Boolean(formik.errors.fileClassification)
                  }
                  helperText={
                    formik.touched.fileClassification &&
                    formik.errors.fileClassification
                  }
                >
                  {fileType.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              {/*
                <Grid item xs={4}>
                <TextField
                  id="outlined-sub-head-normal"
                  {...config}
                  label={t("sub_head")}
                  className={props.theme ? "darkTextField" : ""}
                  name="subHead"
                  value={formik.values.subHead}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter Sub Head"
                />
              </Grid>
                */}
              {/*
                <Grid item xs={12}>
                <Autocomplete
                  freeSolo
                  multiple
                  id="outlined-select-custodian-native"
                  options={custodianData}
                  getOptionLabel={(option) => {
                    return typeof option === "object"
                      ? option?.displayRoleName
                      : "";
                  }}
                  // renderTags={(value, getTagProps) =>
                  //   value.map((option, index) => (
                  //     <Chip
                  //       variant="outlined"
                  //       label={option}
                  //       {...getTagProps({ index })}
                  //     />
                  //   ))
                  // }
                  value={formik.values.custodian}
                  onChange={(e, values) => {
                    formik.setFieldValue("custodian", values);
                  }}
                  onInputChange={handleInputChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      {...config}
                      label={t("custodian")}
                      className={props.theme ? "darkTextField" : ""}
                      name="custodian"
                      variant="outlined"
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder="Enter Custodian"
                      error={
                        formik.touched.custodian &&
                        Boolean(formik.errors.custodian)
                      }
                      helperText={
                        formik.touched.custodian && formik.errors.custodian
                      }
                    />
                  )}
                />
              </Grid>
                */}
              {/*
                <Grid item xs={4}>
                <TextField
                  id="outlined-old-case-no-normal"
                  {...config}
                  label={t("case_no")}
                  className={props.theme ? "darkTextField" : ""}
                  name="caseNo"
                  value={formik.values.caseNo}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter Case No"
                />
              </Grid>
                */}
              <Grid item xs={4}>
                <TextField
                  id="outlined-old-file-reference-normal"
                  {...config}
                  label={t("old_file_refrence")}
                  className={props.theme ? "darkTextField" : ""}
                  name="oldFile"
                  value={formik.values.oldFile}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter Old File Reference"
                />
              </Grid>
              {/*
                <Grid item xs={4}>
                <TextField
                  id="outlined-connected-files-normal"
                  {...config}
                  label={t("connected_files")}
                  className={props.theme ? "darkTextField" : ""}
                  name="connectedFiles"
                  value={formik.values.connectedFiles}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Enter Connected Files"
                />
              </Grid>
                */}
            </Grid>
          </DialogContent>

          <DialogActions>
            <Button
              endIcon={<Undo />}
              color="primary"
              variant="contained"
              onClick={() => {
                formik.handleReset();
                formik.setFieldValue(
                  "section",
                  sessionStorage.getItem("displayDept")
                );
                formik.setFieldValue(
                  "sectionCode",
                  sessionStorage.getItem("deptCode")
                );
              }}
            >
              {t("reset")}
            </Button>
            <Button
              endIcon={<Done />}
              color="secondary"
              variant="contained"
              type="submit"
            >
              {t("submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <BarcodeView
        open={successPopup}
        data={fileResponse?.cabinet}
        handleBarcodeClose={handlePopupClose}
      />
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  createFile,
  getSubSection,
  getBlock,
  getCustodian,
  getSectionData,
})(FileForm);
