import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Typography } from "@material-ui/core"
import { Cancel } from "@material-ui/icons"
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import history from "../../../history";
import { handleNotification } from "../../camunda_redux/redux/ducks/NotificationHandler";

const NotificationHandler = () => {

    const handler = useSelector((state) => state.notificationHandler);
    const { theme } = useSelector((state) => state);
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const resetNotification = useCallback(() => {
        if (handler.error) {
            history.goBack()
        }
        dispatch(handleNotification(false, "file", ""));
    }, [handler]);

    console.log(handler)

    return <>
        <Dialog
            open={handler.error}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                NOTIFICATION NOT FOUND
                <Tooltip title={t("close")}>
                    <IconButton
                        id="close_gateway_alert"
                        aria-label="close"
                        color="primary"
                        size="small"
                        onClick={resetNotification}
                        style={{ float: "right", position: "relative", top: "0px" }}
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
            <DialogContent dividers>
                <Typography variant="body1">{handler.message}</Typography>
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={resetNotification}>
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    </>
}

export default NotificationHandler