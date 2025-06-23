import React, { useState, useRef, useEffect } from "react";
import {
  Icon,
  Badge,
  MuiThemeProvider,
  Card,
  Button,
  IconButton,
  Drawer,
  Fab,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { withStyles } from "@material-ui/styles";
import { getTimeDifference } from "utils.js";
import { PropTypes } from "prop-types";
import { connect, useDispatch, useSelector } from "react-redux";
import "../../redux/actions/NotificationActions";

import {
  getNotification,
  notificationStatus,
  deleteNotification,
  deleteAllNotification,
} from "../../camunda_redux/redux/action";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import ClearIcon from "@material-ui/icons/Clear";
import NotificationsNoneIcon from "@material-ui/icons/NotificationsNone";
import { notificationFun } from "../../camunda_redux/redux/ducks/notification";
import moment from "moment";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import Cookies from "js-cookie";
import _ from "lodash";

function NotificationBar(props) {
  const { container, theme, settings } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [panelOpen, setPanelOpen] = useState(false);
  const [connected, setConnected] = useState(false);
  const [unReadNotifcationList, setUnReadNotifcationList] = useState([]);
  const [notifcationList, setnotifcationList] = useState([]);
  const [stompClient, setStompClient] = useState("");
  const [id, setId] = useState("");
  const { notificationLength } = useSelector((state) => state.notificationFun);

  const role = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");
  const history = useHistory();

  const notificationRedirectPath = "eoffice/inbox/file";

  function handleDrawerToggle() {
    setUnReadNotifcationList([]);
    if (!panelOpen) {
      getNotification();
    }
    setPanelOpen(!panelOpen);
    props.notificationStatus(role, username);
  }
  const parentThemePalette = theme.palette;

  useEffect(() => {
    try {
      if (!_.isEmpty(props.currentUser?.roleName)) {
        // call notification only if user with role is selected
        if (!props.currentUser.username) {
          getNotificationData();
          loadNotification();
        } else {
          handleNotificationRemove();
        }
      }
    } catch (error) { }
  }, [props.currentUser?.roleName]);

  useEffect(() => {
    try {
      if (stompClient && !connected) {
        stompClient.debug = null;
        stompClient.connect({}, onConnected, onError);
      }
    } catch (error) { }
  }, [stompClient]);

  const handleNotificationRemove = () => {
    try {
      if (stompClient && connected) {
        stompClient?.disconnect(() => {
          setnotifcationList([]);
          setUnReadNotifcationList([]);
          dispatch(notificationFun(0));
          setConnected(false);
          setStompClient("");
          setId("");
        });
      }
    } catch (error) { }
  };

  // useEffect(() => {
  //   // clearInterval(myInterval);
  //   // const myInterval = setInterval(() => loadNotification(), 30000)
  // }, [notifcationList]);

  const showNotification = () => {
    const notification = new Notification("CostaCloud", {
      body: "New Message",
    });
    notification.onclick = (value) => { };
  };

  const getNotificationData = () => {
    // remove previous connection if previously logged in with different role
    if (stompClient && connected && id) {
      id?.unsubscribe();

      onConnected();
    } else {
      try {
        let Sock = new SockJS(window.__ENV__.REACT_NOTIFICATION);
        let client = over(Sock);
        setStompClient(client);
      } catch (error) { }
    }
  };

  const onConnected = () => {
    console.log("true")
    const role = sessionStorage.getItem("role");
    setConnected(true);
    let id = stompClient.subscribe(
      `/user/${role}/notifications`,
      onGetNotifications
    );
    // console.log("id", id);
    setId(id);
  };

  const onGetNotifications = (payload) => {
    // console.log(payload);
    let payloadData = JSON.parse(payload?.body);
    setnotifcationList(payloadData);
    let data =
      payloadData && payloadData.filter((item) => item.status === "unread");
    setUnReadNotifcationList(data);
    if (Notification.permission === "granted") {
      // alert("we have permission");
      const notification = new Notification("CostaCloud", {
        data: payloadData[0],
      });
      notification.onclick = (e) => {
        handleRedirect(e.target.data);
      };
    } else {
      Notification.requestPermission().then((permission) => {
        if (Notification.permission === "granted") {
          // after we got permission then send notification again
          const notification = new Notification("CostaCloud", {
            data: payloadData[0],
          });
          notification.onclick = (e) => {
            handleRedirect(e.target.data);
          };
        }
      });
    }
  };

  const onError = (err) => {
    setConnected(false);
    // callMessageOut("Lost Connection To Notification");
  };

  const handleRedirect = (row) => {
    sessionStorage.setItem("InboxID", row.inboxId);
    sessionStorage.setItem("pa_id", row.personalApplicationInventoryId);
    Cookies.set("inboxFile", row.subject);
    Cookies.set("priority", row.priority);
    Cookies.set("referenceNumber", row.referenceNumber);
    Cookies.set("type", row.type);
    Cookies.set("partCase", false);
    Cookies.set("backPath", "/eoffice/inbox/file");
    Cookies.set("isNotification", true)
    setPanelOpen(false);

    if (row.type === "ActionPoint") {
      Cookies.set("isRti", true);
      Cookies.set("partcaseId", row.id);
    }

    row.type === "ActionPoint"
      ? history.push({
        // state: { from: "notification", subject: row.subject },
        pathname: "/eoffice/actionpoint",
        search: row?.actionId,
      })
      : row.type === "RTI"
        ? history.push({
          pathname: "/eoffice/splitView/file",
          // state: row.id,
          state: { from: "notification", id: row.id },
        })
        : row.type === "File"
          ? history.push({
            pathname: "/eoffice/splitView/file",
            // state: row,
            state: { from: "notification", data: row },
          })
          : history.push({
            pathname: "/eoffice/splitView/correspondence",
            state: {
              from: "inbox",
              id: row.id,
              row,
              fileNo: row.serialNo,
            },
          });
  };

  const loadNotification = () => {
    dispatch(notificationFun(notifcationList?.length));
    const roleName = props?.currentUser?.roleName;
    const deptName = props?.currentUser?.deptName;
    props
      .getNotification(roleName, username, deptName)
      .then((resp) => {
        if (resp?.response?.error) {
          callMessageOut(resp?.response?.error);
          return;
        }
        try {
          // setnotificationLen(resp.response.length)
          setnotifcationList(resp?.response);
          let data =
            resp.response &&
            resp.response.filter((item) => item.status === "unread");
          setUnReadNotifcationList(data);
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // console.log(message);
  };

  const deleteSingalNotification = (id) => {
    props.deleteNotification(role, id);
    loadNotification();
  };

  const deleteAllNotifications = () => {
    props
      .deleteAllNotification(role, username)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            return;
          }
          loadNotification();
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  return (
    <MuiThemeProvider theme={settings.themes[settings.activeTheme]}>
      <span
        onClick={handleDrawerToggle}
        style={{
          color: "white",
        }}
      >
        <Badge
          overlap="rectangular"
          color="error"
          badgeContent={unReadNotifcationList && unReadNotifcationList.length}
        >
          <Tooltip title={t("notifications")} aria-label="Notification">
            <NotificationsNoneIcon
              style={{
                color: "#fff",
                fontSize: "1.2rem",
              }}
            />
          </Tooltip>
        </Badge>
      </span>
      <Drawer
        width={"100px"}
        container={container}
        variant="temporary"
        anchor={"right"}
        open={panelOpen}
        onClose={() => {
          handleDrawerToggle()
          if (notifcationList.length) {
            deleteAllNotifications()
          }
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className="notification">
          {/* <div className="flex flex-center">
            <Tooltip title="CLOSE">
              <IconButton onClick={handleDrawerToggle} className="mr-36">
                <Cancel
                  style={{
                    color: props.theme ? "#fff" : "#000",
                  }}
                />
              </IconButton>
            </Tooltip>
          </div> */}
          <div className="notification__topbar flex flex-middle p-16 mb-10">
            <Icon color="primary">notifications</Icon>
            <h5
              className="ml-8 my-0 font-weight-500"
              style={{ color: "inherit !important" }}
            >
              {t("notifications")}
            </h5>
          </div>
          <div className="notifications-wrapper">
            {notifcationList?.length ? (
              notifcationList?.map((notification, index) => (
                <div
                  key={notification.id}
                  className="notification__card position-relative"
                >
                  <Tooltip placement="left" title="CLEAR NOTIFICATION">
                    <IconButton
                      id="notification_clearButton"
                      size="small"
                      className="delete-button bg-light-gray mr-24"
                      onClick={() => deleteSingalNotification(notification.id)}
                    >
                      <ClearIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  {/* <Link
                  to={`/${notificationRedirectPath}`}
                  onClick={handleDrawerToggle}
                > */}
                  <Card
                    className="mx-16 mb-16"
                    elevation={3}
                    onClick={() => handleRedirect(notification)}
                  >
                    <div
                      className={`card__topbar flex flex-middle flex-space-between p-4 ${notification.status === "read"
                        ? "bg-light-gray"
                        : "bg-card-unread"
                        }`}
                    >
                      <div className="flex">{notification?.type}</div>
                      <small className="card__topbar__time text-gray">
                        {/* {getTimeDifference(notification.createdOn.replaceAll("-", "/"))} */}
                        {/* {notificationDate[index] < customDate ? customDate - notificationDate[index] + ' day' : customHour - notificationHour[index] > 1 ? notificationHour[index] + ' hour' : customMin - notificationMin[index] + ' minutes'} */}
                        {/* {moment().endOf('day').fromNow()} */}
                        {moment(
                          notification.createdOn,
                          "YYYYMMDD, HH:mm:ss"
                        ).fromNow()}
                        {/* {t(" ago")} */}
                      </small>
                    </div>
                    <div className="text-wrapper">
                      <p className="m-0">{notification.subject}</p>
                      <small className="text-gray">
                        {notification.referenceNumber}
                      </small>
                    </div>
                  </Card>
                  {/* </Link> */}
                </div>
              ))
            ) : (
              <Typography
                align="left"
                variant="subtitle1"
                color="textPrimary"
                style={{ padding: "1rem" }}
              >
                Notifications empty, There are currently no notifications.
              </Typography>
            )}
          </div>
          <div className="text-center">
            <Button
              onClick={deleteAllNotifications}
              disabled={notifcationList?.length === 0}
              id="clear_notifications_Button"
              color="primary"
              variant="outlined"
              size="small"
            >
              {t("clear_notifications")}
            </Button>
          </div>
        </div>
      </Drawer>
    </MuiThemeProvider>
  );
}

// NotificationBar.propTypes = {
//   settings: PropTypes.object.isRequired,
//   notification: PropTypes.array.isRequired
// };

const mapStateToProps = (state) => ({
  getNotification: PropTypes.func.isRequired,
  deleteNotification: PropTypes.func.isRequired,
  deleteAllNotification: PropTypes.func.isRequired,
  notification: state.notification,
  settings: state.layout.settings,
  currentUser: state.user.currentUserRole,
  theme: state.theme,
});

export default withStyles(
  {},
  { withTheme: true }
)(
  connect(mapStateToProps, {
    getNotification,
    notificationStatus,
    deleteNotification,
    deleteAllNotification,
  })(NotificationBar)
);
