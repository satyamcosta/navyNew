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
import React, { useState } from "react";
import { Draggable } from "react-draggable";
import { connect } from "react-redux";
import { Loading } from "../therme-source/material-ui/loading";
import { Cancel, Done } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { updateMonitor } from "app/camunda_redux/redux/action";
import Cookies from "js-cookie";

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

const StatusArr = [
  "In Progress",
  "Under Review",
  "Awaiting Additional Inputs",
  "Hard Copy Sent And Reply Awaited",
  "Action Pending",
  "Completed",
];

const MonitorStatus = ({ open, type, handleClose, ...props }) => {
  let referenceNumber = Cookies.get("referenceNumber");
  let subject = Cookies.get("inboxFile");

  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState("");
  const [status, setStatus] = useState(StatusArr[0]);

  const handleStatus = () => {
    props
      .updateMonitor({ comment }, referenceNumber, status)
      .then((res) => console.log(res));
  };

  return (
    <>
      <Dialog
        open={open}
        aria-labelledby="draggable-dialog-title"
        id="cabinet-create-file"
      >
        {loading && <Loading />}
        <DialogTitle
          // style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{type ? t("update_mon_file") : t("update_mon_dak")}</span>
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
            handleStatus()
          }}
        >
          <DialogContent dividers>
            <Typography
              style={{
                textAlign: "center",
                opacity: ".7",
                marginBottom: "5px",
              }}
            >
              {t("monitor_info")}
            </Typography>
            <Typography variant="subtitle2">
              {`${type ? t("file") : t("dak")} #: ${referenceNumber}`}
            </Typography>
            <Typography variant="subtitle2">Subject #: {subject}</Typography>
            <Box
              sx={{ width: "100%", marginTop: "5px" }}
              className="cabinate_container"
            >
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
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    {...configData}
                    id="outlined-select-currency"
                    select
                    label={t("classification")}
                    name="classification"
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    variant="outlined"
                    className={`corr-form-select ${
                      props.theme ? "darkTextField" : ""
                    }`}
                  >
                    {StatusArr.map((option, i) => (
                      <MenuItem key={i} value={option}>
                        {option}
                      </MenuItem>
                    ))}
                  </TextField>
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
              disabled={!comment?.trim()}
            >
              {t("ok")}
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

export default connect(mapStateToProps, { updateMonitor })(MonitorStatus);
