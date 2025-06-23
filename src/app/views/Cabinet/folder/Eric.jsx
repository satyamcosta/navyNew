import React, { useEffect } from "react";
import { Loading } from "../therme-source/material-ui/loading";
import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  MenuItem,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Cancel, Done } from "@material-ui/icons";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { createEric, editEric } from "app/camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const configData = {
  fullWidth: true,
  size: "small",
};

const Eric = ({
  open,
  handleClose,
  handleTrigger,
  handleEric,
  ericType,
  edit,
  update,
  ...props
}) => {
  const dispatch = useDispatch();
  let today = new Date().toISOString().slice(0, 10);
  const ericTypes = ["Meeting", "Reply", "Other"];
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [subject, setSubject] = useState("");
  const [type, setType] = useState(ericTypes[0]);
  const [date, setDate] = useState(today);
  const [time, setTime] = useState(() => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  });

  const handleReset = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    let time = `${hours}:${minutes}`;
    setSubject("");
    setType(ericTypes[0]);
    setDate(today);
    setTime(time);
  };

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  useEffect(() => {
    if (edit) {
      let [d, m, y] = edit?.ericDate?.split("-");
      setSubject(edit?.ericSubject);
      setType(edit?.ericType);
      setDate(`${y}-${m}-${d}`);
      setTime(edit?.ericTime);
    }
  }, [edit]);

  useEffect(() => {
    if (!open) {
      handleReset();
    }
  }, [open]);

  const handleCreate = () => {
    setLoading(true);
    if (edit) {
      props
        .editEric(edit?.id, subject, type, date, time, ericType)
        .then((res) => {
          if (res.error) {
            callMessageOut("error", res.error);
            setLoading(false);
          } else {
            setLoading(false);
            handleEric();
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
    } else {
      props
        .createEric(subject, type, date, time, ericType)
        .then((res) => {
          if (res.error) {
            callMessageOut("error", res.error);
            setLoading(false);
          } else {
            setLoading(false);
            handleEric();
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
    }
  };

  return (
    <>
      <Dialog
        open={open}
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
          <span>{update ? t("edit_eric_suc") : t("create_eric")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="create_file_dialog_close_button"
              aria-label="close"
              onClick={() => {
                // formik.handleReset();
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <DialogContent dividers>
            <Typography
              style={{
                textAlign: "center",
                opacity: ".7",
              }}
            >
              {t("eric_info")}
            </Typography>
            <Typography
              style={{
                textAlign: "center",
                padding: "10px 0rem",
                opacity: ".7",
              }}
            >
              YOU CAN EDIT IT LATER FROM THE DASHBOARD
            </Typography>
            <Box sx={{ width: "100%" }} className="cabinate_container">
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <TextField
                    {...configData}
                    variant="outlined"
                    multiline
                    minRows={3}
                    name="subject"
                    required
                    label={t("subject")}
                    className={props.theme ? "darkTextField" : ""}
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    inputProps={{ maxLength: 250 }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Enter Subject"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    {...configData}
                    id="outlined-select-currency"
                    select
                    label={t("type")}
                    name="type"
                    required
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    placeholder="Select Dak Type"
                    variant="outlined"
                    className={` corr-form-select ${
                      props.theme ? "darkTextField" : ""
                    }`}
                  >
                    {ericTypes.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    type="date"
                    {...configData}
                    variant="outlined"
                    name="due_date"
                    label={t("due_date")}
                    className={props.theme ? "darkTextField" : ""}
                    value={date}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      inputProps: { min: today },
                    }}
                    onChange={(e) => setDate(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    id="time"
                    type="time"
                    variant="outlined"
                    label={t("due_time")}
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={`${
                      props.theme ? "darkTextField" : ""
                    } eric-time`}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      step: 300, // 5 min
                      min: time,
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
          </DialogContent>

          <DialogActions>
            <Button
              endIcon={<Done />}
              color="secondary"
              variant="contained"
              type="submit"
            >
              {edit ? t("edit") : t("submit")}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  createEric,
  editEric,
})(Eric);
