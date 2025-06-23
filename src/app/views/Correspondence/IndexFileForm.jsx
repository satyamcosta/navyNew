import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  Tooltip,
  makeStyles,
  TextField,
} from "@material-ui/core";
import {
  createIndexFile,
  getSubSection,
  getBlock,
} from "app/camunda_redux/redux/action";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loading } from "./therme-source/material-ui/loading";
import Draggables from "react-draggable";
import { Close, Done, Cancel, Undo } from "@material-ui/icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { handleError } from "utils";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  priority_box: {
    width: "100%",
    display: "flex",
    justifyContent: "space-evenly",
  },
  priority_btn: {
    fontSize: "2rem",
    border: "1px solid #8080804f !important",
    borderRadius: "8%",
  },
  btnGrid: {
    textAlign: "right",
    marginTop: theme.spacing(4),
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggables handle="#draggable-dialog-title2" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggables>
  );
};

const configData = {
  fullWidth: true,
  size: "small",
};

const section = ["InfoSec", "Budget", "Software", "Network", "NSAC"];
const series = ["0621-Spare", "0622-Spare", "0623-Spare"];

const IndexFileForm = (props) => {
  const dispatch = useDispatch();
  let department = sessionStorage.getItem("department");

  const { open, handleForm, handleTrigger } = props;

  const classes = useStyles();
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);

  const classificationlist = ["Unclassified", "Restricted"];

  const [subSecArr, setSubSecArr] = useState([]);
  const [blockArr, setblockArr] = useState([]);

  const INITIAL_STATE = {
    subject: "",
    classification: classificationlist[0],
    section: "",
    series: "",
    oldFile: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),
    section: Yup.string(t("enter_section"))
      .nullable()
      .required(`${t("this_field_is_required")} !`),

    classification: Yup.string(
      t("enter_correspondence_classfication")
    ).required(`${t("this_field_is_required")} !`),
    series: Yup.object().shape({
      range: Yup.string().required("this_field_is_required"),
    }),
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_SCHEMA,

    onSubmit: (values) => {
      setLoading(true);
      const { subject, series, section, oldFile, classification } =
        formik.values;
      props
        .createIndexFile(
          {
            subject,
            series: series?.range,
            section,
            oldFile,
            typeOfFile: classification,
            creatorDepartment: sessionStorage.getItem("department"),
            creatorRole: sessionStorage.getItem("role"),
            createdBy: sessionStorage.getItem("displayRole"),
          },
          section
        )
        .then((res) => {
          try {
            if (res.error) {
              let errMsg = handleError(res.error);
              callMessageOut(errMsg);
              setLoading(false);
              return;
            } else {
              setLoading(false);
              dispatch(setSnackbar(true, "success", t("index_succ")));
              formik.resetForm();
              handleForm(false);
              props?.handleSelect(res?.response);
              handleTrigger();
            }
          } catch (e) {
            callMessageOut(e.message);
            setLoading(false);
          }
        });
    },
  });

  const { section } = formik.values;

  useEffect(() => {
    if (props.open) loadSubSection();
  }, [props.open]);

  useEffect(() => {
    if (section) {
      getBlock();
    }
  }, [section]);

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const getBlock = async () => {
    try {
      const res = await props.getBlock(department, section);
      if (res.error) {
        callMessageOut(res.error);
        return;
      } else {
        const range = res.response?.range;
        setblockArr(range);
      }
    } catch (e) {
      callMessageOut(e.message);
    }
  };

  const loadSubSection = () => {
    props
      .getSubSection(department)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            return;
          } else {
            setSubSecArr(res.response);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut(err.message);
      });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleForm(false);
          }
        }}
        aria-labelledby="draggable-dialog-title2"
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="draggable-dialog-title2"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          {t("create_index_file")}
          <Tooltip title={t("close")}>
            <IconButton
              id="Personnel_btnClose"
              aria-label="close"
              onClick={() => handleForm(false)}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "inherit",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <div classes={classes.root}>
          {loading && <Loading />}
          <form onSubmit={formik.handleSubmit}>
            <DialogContent dividers>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    {...configData}
                    variant="outlined"
                    multiline
                    minRows={3}
                    maxRows={5}
                    name="subject"
                    required
                    label={t("subject")}
                    className={props.theme ? "darkTextField" : ""}
                    value={formik.values.subject}
                    onChange={formik.handleChange}
                    inputProps={{ maxLength: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Enter Subject"
                    error={
                      formik.touched.subject && Boolean(formik.errors.subject)
                    }
                    helperText={formik.touched.subject && formik.errors.subject}
                    autoFocus
                  />
                </Grid>

                <Grid
                  item
                  md={6}
                  xs={12}
                  style={{
                    marginTop: "4px",
                  }}
                >
                  <TextField
                    {...configData}
                    id="outlined-select-currency"
                    select
                    label={t("section")}
                    name="section"
                    required
                    value={formik.values.section}
                    onChange={formik.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Select Section"
                    variant="outlined"
                    className={` corr-form-select ${
                      props.theme ? "darkTextField" : ""
                    }`}
                    error={
                      formik.touched.section && Boolean(formik.errors.section)
                    }
                    helperText={formik.touched.section && formik.errors.section}
                  >
                    {subSecArr.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid
                  item
                  md={6}
                  xs={12}
                  style={{
                    marginTop: "4px",
                  }}
                >
                  <TextField
                    {...configData}
                    id="outlined-select-currency"
                    select
                    label={t("series")}
                    required
                    name="series"
                    value={formik.values.series}
                    onChange={formik.handleChange}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Select Series"
                    variant="outlined"
                    className={` corr-form-select ${
                      props.theme ? "darkTextField" : ""
                    }`}
                    error={
                      formik.touched.series && Boolean(formik.errors.series)
                    }
                    helperText={formik.touched.series && formik.errors.series}
                  >
                    {blockArr.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {`${option?.range}-${option?.description}`}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    {...configData}
                    variant="outlined"
                    multiline
                    maxRows={2}
                    name="oldFile"
                    label={t("oldFile")}
                    className={props.theme ? "darkTextField" : ""}
                    value={formik.values.oldFile}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Enter Old File No (Optional)"
                    onChange={formik.handleChange}
                    error={
                      formik.touched.oldFile && Boolean(formik.errors.oldFile)
                    }
                    helperText={formik.touched.oldFile && formik.errors.oldFile}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button
                id="personalAppForm_reset_btn"
                color="primary"
                variant="contained"
                style={{ marginLeft: "1rem" }}
                onClick={formik.handleReset}
                endIcon={<Undo />}
              >
                {t("reset")}
              </Button>
              <Button
                id="peronalAppForm_done_btn"
                color="secondary"
                variant="contained"
                type="submit"
                style={{ marginLeft: "1rem" }}
                endIcon={<Done />}
              >
                {t("submit")}
              </Button>
            </DialogActions>
          </form>
        </div>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  createIndexFile,
  getSubSection,
  getBlock,
})(IndexFileForm);
