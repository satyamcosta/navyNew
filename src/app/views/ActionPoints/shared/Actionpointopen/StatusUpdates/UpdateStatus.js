import {
  Button,
  DialogActions,
  Divider,
  Grid,
  TextField,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import DoneIcon from "@material-ui/icons/Done";
import "../../index.css";
import { updateStatus } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { makeStyles } from "@material-ui/styles";

const UpdateStatus = (props) => {
  const actionId = props.id;

  const useStyle = makeStyles((theme) => ({
    root: {
      width: 500,

      "& > * + *": {
        marginTop: theme.spacing(3),
      },
    },
  }));

  const [data, setData] = useState({
    message: "",
    status: "",
    updatedOn: new Date(),
  });

  const handleInputChange = (name, value) => {
    setData({ ...data, [name]: value });
  };

  const statusUpdate = ["Inprogress", "Completed", "50% Completed"];

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const userFrom = localStorage.getItem("username");

  const deptFrom = sessionStorage.getItem("department");
  const statusUpdates = (e) => {
    e.preventDefault();

    props
      .updateStatus(data, actionId, userFrom, deptFrom)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
          }
        } catch (error) {}
      })
      .catch(() => {
        callMessageOut(res.error);
      });
    props.updateStatushandleClose();
  };
  const classess = useStyle();

  return (
    <form onSubmit={statusUpdates}>
      <Grid container spacing={2} className="actionpoint">
        <Grid item xs={12} className={classess.root}>
          <Autocomplete
            id="tags-outlined"
            options={statusUpdate}
            // onChange={(event, newValue) => setData(newValue)}
            onChange={(e, value) => handleInputChange("status", value)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                size="small"
                variant="outlined"
                label={t("status")}
                name="status"
                fullWidth
                value={data.status}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} className={classess.root}>
          <TextField
            margin="dense"
            style={{ marginTop: "1.2rem" }}
            size="small"
            variant="outlined"
            label={t("update_status")}
            multiline
            fullWidth
            minRows={6}
            name="message"
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            value={data.message}
          />
        </Grid>
      </Grid>

      <DialogActions style={{ marginTop: "1.5rem" }} Dividers>
        <Button variant="contained" color="primary">
          {t("cancel")}
        </Button>
        <Button
          endIcon={<DoneIcon />}
          color="primary"
          variant="contained"
          type="submit"
        >
          {t("update")}
        </Button>
      </DialogActions>
    </form>
  );
};

function mapStateToProps(state) {
  return {
    // props: state.props,
    // subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, { updateStatus })(UpdateStatus);
