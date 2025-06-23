import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { setGateway } from "app/camunda_redux/redux/ducks/GatewayReducer";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../history";
import CancelIcon from "@material-ui/icons/Cancel";
import { useTranslation } from "react-i18next";

const GatewayPopper = () => {
  const gateway = useSelector((state) => state.gateway);
  const { theme } = useSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const resetSnackBar = useCallback(() => {
    if (gateway.redirect) {
      history.push({
        pathname: gateway.redirect,
      });
    } else {
      history.push({
        pathname: "/eoffice/inbox/file",
      });
    }
    dispatch(setGateway(false, "", "", ""));
  }, [gateway]);

  return (
    <>
      <Dialog
        open={gateway.gatewayOpen}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          GATEWAY TIMEOUT
          <Tooltip title={t("close")}>
            <IconButton
              id="close_gateway_alert"
              aria-label="close"
              color="primary"
              size="small"
              onClick={resetSnackBar}
              style={{ float: "right", position: "relative", top: "0px" }}
              className="cancel-drag"
            >
              <CancelIcon
                style={{
                  color: theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="body1">{gateway.gatewayMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={resetSnackBar}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default GatewayPopper;
