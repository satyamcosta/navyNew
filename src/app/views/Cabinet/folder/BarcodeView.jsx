import { useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Cancel, Clear, Print } from "@material-ui/icons";
import { useSelector } from "react-redux";
import Draggable from "react-draggable";
import { makeStyles } from "@material-ui/core/styles";
import ReactToPrint from "react-to-print";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    backgroundColor: "#f4f0e2",
    maxWidth: 700,
    margin: "auto",
  },
  label: {
    fontWeight: "bold",
    fontSize: "1rem",
    marginBottom: theme.spacing(1),
    color: "#000000",
  },
  value: {
    fontSize: "1rem",
    marginBottom: theme.spacing(1),
    color: "#000000",
  },
  barcode: {
    textAlign: "right",
    marginBottom: theme.spacing(1),
  },
  section: {
    marginBottom: "4px",
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const BarcodeView = (props) => {
  const { open, data, handleBarcodeClose } = props;
  const classes = useStyles();
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  let branch = sessionStorage.getItem("branch");

  const dialogPrintRef = useRef();

  return (
    <Dialog
      open={open}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        style={{ cursor: "move" }}
        id="draggable-dialog-title"
        className="dialog_title"
      >
        <span>{t("preview")}</span>
        <Tooltip title={t("close")}>
          <IconButton
            id="preview_dialog_close_button"
            aria-label="close"
            onClick={handleBarcodeClose}
            color="primary"
            className="cancel-drag"
          >
            <Cancel
              style={{
                color: theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers ref={dialogPrintRef} id="print-area">
        {data && (
          <Paper className={classes.root} elevation={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} className={classes.barcode}>
                <img
                  src={`data:image/png;base64,${data?.imageDataString}`}
                  alt="barcode"
                />
              </Grid>
              {branch && (
                <Grid item xs={6} className={classes.section}>
                  <Typography className={classes.label}>शाखा:</Typography>
                  <Typography className={classes.value}>
                    <strong> Branch: </strong>
                    {branch}
                  </Typography>
                </Grid>
              )}

              <Grid item xs={6} className={classes.section}>
                <Typography className={classes.label}>नंबर से:</Typography>
                <Typography className={classes.value}>
                  <strong>File Number: </strong> {data?.file}
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.section}>
                <Typography className={classes.label}>निदेशालय:</Typography>
                <Typography className={classes.value}>
                  <strong>Directorate: </strong> {data?.creatorDepartment}
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.section}>
                <Typography className={classes.label}>अनुभाग:</Typography>
                <Typography className={classes.value}>
                  <strong> Section: </strong> {data?.section}
                </Typography>
              </Grid>
              <Grid item xs={6} className={classes.section}>
                <Typography className={classes.label}>तारीख:</Typography>
                <Typography className={classes.value}>
                  <strong> Date: </strong>
                  {data?.createdOn?.split(" ")[0]}
                </Typography>
              </Grid>
              <Grid item xs={12} className={classes.section}>
                <Typography className={classes.label}>विषय:</Typography>
                <Typography className={classes.value}>
                  <strong> Subject: </strong> {data?.subject}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        )}
      </DialogContent>
      <DialogActions>
        <ReactToPrint
          trigger={() => (
            <Button endIcon={<Print />} color="primary" variant="contained">
              {t("print")}
            </Button>
          )}
          pageStyle="print"
          content={() => dialogPrintRef.current}
        />
        <Button
          endIcon={<Clear />}
          color="primary"
          variant="contained"
          type="submit"
          onClick={handleBarcodeClose}
        >
          {t("close")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BarcodeView;
