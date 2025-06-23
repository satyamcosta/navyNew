import {
  Avatar,
  Button,
  CircularProgress,
  Dialog,
  Grid,
  IconButton,
  InputAdornment,
  Slide,
} from "@material-ui/core";
import App from "app/App";
import Axios from "axios";
import qs from "qs";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import "./_index.scss";
import "./login.css";
import { TextField } from "@material-ui/core";
import Loading from "matx/components/MatxLoadable/Loading";
// import { setSnackbar } from "../../pa/src/app/camunda_redux/redux/ducks/snackbar";
// import bcrypt from 'bcryptjs';
import CryptoJS from "crypto-js";
import { Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import history from "./history";
import {
  LoadCanvasTemplate,
  loadCaptchaEnginge,
  validateCaptcha,
} from "react-simple-captcha";
import { makeStyles } from "@material-ui/styles";
import Feedback from "app/views/user-activity/logout/Feedback";
import { handleError } from "utils";
import eOffice from "./eoffice-new05_cropped.png"
import GroupIcon from "@material-ui/icons/Group";
import Person from "@material-ui/icons/Person"


const useStyles = makeStyles((theme) => ({
  dialog_paper: {
    position: "relative",
    minWidth: "51%",
    maxHeight: "100%",
    bottom: "8px",
    borderRadius: "15px !important",
    boxShadow:
      "rgba(14, 30, 37, 0.12) 2px 7px 10px 3px, rgba(14, 30, 37, 0.32) 0px 2px 16px 4px !important",
  },
}), {
  new: "new-dialog"
});

const LoginPage = (props) => {
  const [showPassword, setshowPassword] = useState(false);
  const [Cred, setCred] = useState({
    username: "",
    password: "",
    error: "",
  });
  const Authorization = props.Authorization;
  const username = props.userNameFeedback;
  const deptName = props.deptName;
  const [startMaxTime, setStartMaxTime] = useState(false);
  const classes = useStyles();
  const [OTP, setOTP] = useState("");
  const [captcha, setCaptcha] = useState("");
  const [isOTPInputVisible, setIsOTPInputVisible] = useState(false);
  const [isResendOTPVisible, setIsResendOTPVisible] = useState(false);
  const [isCaptchaError, setIsCaptchaError] = useState(false);
  const [Secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);
  const [activeUsers, setActiveUser] = useState(0)
  const [visitors, setVisitors] = useState(0)


  let Prime_No, Primitive, Private_Key_A, Secret_A, Shared_Secret;

  console.log(window.__ENV__.REACT_KIBANA)

  // let salt;

  const userName = localStorage.getItem("username");
  const autoLogin = sessionStorage.getItem("re_intiate");

  function encryptFun(password, username) {
    var keybefore = username + "appolocomputers";
    var ivbefore = username + "costacloud012014";
    var key = CryptoJS.enc.Latin1.parse(keybefore.substring(0, 16));
    var iv = CryptoJS.enc.Latin1.parse(ivbefore.substring(0, 16));
    var ciphertext = CryptoJS.AES.encrypt(password, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding,
    }).toString();
    return ciphertext;
  }

  async function getLoginCount() {
    try {
      const res = await fetch("/auth/activeUsers/count", {
        method: "GET",
      });
      let data = await res.json()
      if (res.status == 200) {
        setActiveUser(data)
      }
    }
    catch (error) {
      console.log(error)
    }

  }
  async function getVisitorsCount() {
    try {
      const res = await fetch("/auth/totalLoggedInCount", {
        method: "GET",
      });
      let data = await res.json()
      if (res.status == 200) {
        setVisitors(data)
      }
    }
    catch (error) {
      console.log(error)
    }

  }
  useEffect(() => {
    getLoginCount()
    getVisitorsCount()
  }, [])

  const handleClose = () => setOpen(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const data = JSON.stringify({
        username: Cred.username?.toLowerCase(),
        password: encryptFun(Cred.password, Cred.username?.toLowerCase()),
        // keycloak: window.__ENV__.REACT_APP_KEYCLOACK,
        // client_id: window.__ENV__.REACT_APP_CLIENT_ID,
      });
      let user_captacha = captcha;
      if (true) {
        setIsCaptchaError(false);
        setIsOTPInputVisible(true);
        setIsResendOTPVisible(true);
        setStartMaxTime(true);
        const res = await fetch("/auth/token", {
          method: "POST",
          headers,
          body: data,
        });
        if (res.status == "500") {
          const error = "Internal Server Error";
          setCred({
            ...Cred,
            error,
          });
          setLoading(false);
          return;
        }
        const login = await res.json();
        if (login.message || !login.access_token) {
          setCred({
            ...Cred,
            error: login.message || login.error,
          });
          setLoading(false);
        } else {
          // Here means login is successfull
          sessionStorage.setItem("jwt_token", login.access_token);
          sessionStorage.setItem("sessionId", login.session_state);
          localStorage.setItem("refresh_token", login.refresh_token);
          localStorage.setItem("username", Cred.username?.toLowerCase());
          localStorage.setItem("expires_in", login.expires_in);
          document.body.style.zoom = "95%";

          // Login is succesfull so now i am listining for referesh token after some time
          const id = setInterval(() => {
            refreshToken();
          }, 400000);
          setLoading(false);
          localStorage.setItem("refresh_session", id); // on logout i will unsubscribe from refresh token
          sessionStorage.setItem("re_intiate", true); // to handle the bug of automatically login when re-open app after close
          ReactDOM.render(<App />, document.getElementById("root"));
          history.push({
            pathname: "/eoffice/dashboard/app",
          });

          // history.push({
          //   pathname: "/eoffice/personnel/file",
          // });
        }
      } else {
        setIsCaptchaError(true);
        setCaptcha("");
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      let errMsg = handleError(error.message);
      setCred({
        ...Cred,
        error: errMsg,
      });
    }
  };

  // const getPublicSecret = async (secret_front) => {
  //   const headers = {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //     clientKey: secret_front,
  //   };
  //   const secret_back = (await Axios.get("/auth/share", { headers })).data;
  //   Shared_Secret = power(secret_back, Private_Key_A, Prime_No);
  //   setSecret(Shared_Secret);
  //   setSuccess(true);
  // };

  const handleClickShowPassword = () => {
    setshowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  // Power function to return value of a ^ b mod P
  const power = (a, b, p) => {
    if (b == 1) return a;
    else return Math.pow(a, b) % p;
  };

  // for handling refresh token
  useEffect(() => {
    // loadCaptchaEnginge(5, "#00000033", "#fff");
    userName && autoLogin && handleRefreshToken();
  }, []);

  useEffect(() => {
    if (props.timeout) {
      setCred({
        ...Cred,
        error: "Session Timeout",
      });
    }
  }, [props.timeout]);

  useEffect(() => {
    if (!autoLogin) {
      localStorage.clear();
      sessionStorage.clear();
    }
  }, [autoLogin]);

  // for handling diffi hellman alogrithm
  // useEffect(() => {
  //   Prime_No = process.env.REACT_APP_PRIME_NO;
  //   Primitive = process.env.REACT_APP_PRIMITIVE;
  //   Private_Key_A = Math.floor(Math.random() * (10 - 1 + 1) + 1);
  //   Secret_A = power(Primitive, Private_Key_A, Prime_No);
  //   // getPublicSecret(Secret_A);
  // }, []);

  const handleRefreshToken = () => {
    // unsubscribe to refresh token api when refresh
    const id = localStorage.getItem("refresh_session");
    clearInterval(id);
    const isSuccess = refreshToken();
    if (isSuccess) {
      // Refresh is succesfull so now i am listining for refresh token after some time
      const id = setInterval(() => {
        refreshToken();
      }, 400000);

      localStorage.setItem("refresh_session", id); // on logout i will unsubscribe from refresh token
      ReactDOM.render(<App />, document.getElementById("root"));
    }
  };

  const refreshToken = async () => {
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      // new FormData()
      // require
      const data = JSON.stringify({
        grant_type: "refresh_token",
        refresh_token: localStorage.getItem("refresh_token"),
      });
      const res = await fetch("/auth/refresh-token", {
        method: "POST",
        headers,
        body: data,
      });
      if (res.status != "200") {
        redirectToLogin(true);
        return;
      }
      const login = await res.json();

      if (login.message) {
        localStorage.clear();
        sessionStorage.clear();
        setCred({
          ...Cred,
          error: login.message,
        });

        redirectToLogin();
      } // important to clear first because previous logged in might contain some inboxId or imp data
      else if (login.access_token) {
        sessionStorage.setItem("jwt_token", login.access_token);
        sessionStorage.setItem("sessionId", login.session_state);
        localStorage.setItem("refresh_token", login.refresh_token);
        localStorage.setItem("expires_in", login.expires_in);
        return true;
      } else {
        redirectToLogin();
      }
    } catch (error) {
      let errMsg = handleError(error.message);
      setCred({
        ...Cred,
        error: errMsg,
      });
      redirectToLogin();
      // dispatch(setSnackbar(true, "error", error));
    }
  };

  const redirectToLogin = () => {
    // unsubscribe to refresh token api when there is an error in it

    const id = localStorage.getItem("refresh_session");
    clearInterval(id);
    localStorage.clear();
    sessionStorage.clear();
    ReactDOM.render(
      <LoginPage timeout={true} />,
      document.getElementById("root")
    );
  };

  const handleRn = () => {
    const link = document.createElement("a");
    link.href = `${process.env.PUBLIC_URL}/assets/Release_note_v1.6.pdf`; // Specify the path to the PDF in the public folder
    link.download = "Release_note_v1.6.pdf"; // Filename for the downloaded file
    link.click();
  };

  return (
    <>
      {/* {props.feedbackdialog ? (
        <Dialog
          className="feedback_dialog"
          classes={{
            paper: classes.dialog_paper,
          }}
          aria-labelledby="customized-dialog-title"
          open={open}
        >
          <Feedback
            handleClose={handleClose}
            username={username}
            Authorization={Authorization}
            deptName={deptName}
          />
        </Dialog>
      ) : null} */}

      {userName && autoLogin ? (
        <>
          <Loading />
          <Grid
            item
            lg={6}
            xs={12}
            style={{
              display: "none",
            }}
          >
            {/* Fale capta load to avoid getContext error */}
            <LoadCanvasTemplate reloadColor="rgb(254, 152, 50)" />
          </Grid>
        </>
      ) : (
        <div
          className="app"
          style={{
            // backgroundImage: `
            // linear-gradient(118deg, rgb(88 86 86 / 19%), rgb(73 75 77 / 43%)), url(${process.env.PUBLIC_URL}/assets/images/navy-logo-background.jpg)`,
            // backgroundPosition:"center"
            background: "#85cae1c7",
          }}
        >
          <Slide
            direction="up"
            className="sign-in-alert"
            in={Cred.error ? true : false}
            mountOnEnter
            unmountOnExit
          >
            <Alert
              variant="filled"
              severity="error"
              onClose={() => {
                setCred({ ...Cred, error: false });
              }}
            >
              {Cred.error}
            </Alert>
          </Slide>

          <div
            className="form-animate"
            style={{
              // opacity: props.feedbackdialog && open ? 0 : 1,
              opacity: 1,
            }}
          >
            <div className="eoffice-img-Con">
              <img
                src={eOffice}
                alt="eOffice.png"
                loading="lazy"
                className="eoffice-logo"
              />
              <span>
                {" "}
                Go Digital, Go Beyond
              </span>
              <img
                src={process.env.PUBLIC_URL + "/assets/images/navy-logo.png"}
                alt="eOffice.png"
                loading="lazy"
              />

            </div>
            <form onSubmit={handleSubmit} autoComplete="off">
              <h4>Sign In</h4>
              <TextField
                autoComplete="off"
                required
                fullWidth
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
                className="inp"
                size="small"
                name="username"
                label="Username"
                variant="outlined"
                value={Cred.username}
                onChange={(e) => {
                  setCred({ ...Cred, [e.target.name]: e.target.value });
                }}
              />
              <TextField
                autoComplete="off"
                required
                InputLabelProps={{
                  style: { color: "#fff" },
                }}
                className="inp"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? (
                          <Visibility
                            style={{
                              color: "#fe9832",
                            }}
                          />
                        ) : (
                          <VisibilityOff
                            style={{
                              color: "#fe9832",
                            }}
                          />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                fullWidth
                size="small"
                name="password"
                type={showPassword ? "text" : "password"}
                label="Password"
                variant="outlined"
                value={Cred.password}
                onChange={(e) => {
                  setCred({ ...Cred, [e.target.name]: e.target.value });
                }}
              />
              {/*
              <Grid container spacing={1}>
                <Grid item lg={6} xs={12}>
                <LoadCanvasTemplate reloadColor="rgb(254, 152, 50)" />
              </Grid>
              <Grid item lg={6} xs={12}>
                <TextField
                  fullWidth
                  autoComplete="off"
                  required
                  InputLabelProps={{
                    style: { color: "#fff" },
                  }}
                  size="small"
                  name="user_captcha_input"
                  id="user_captcha_input"
                  label="Captcha"
                  variant="outlined"
                  value={captcha}
                  onChange={(e) => setCaptcha(e.target.value)}
                  error={isCaptchaError}
                  helperText={
                    isCaptchaError ? "Captcha Does not matched" : ""
                  }
                />
              </Grid>
              </Grid>
              */}
              <Button
                fullWidth
                variant="contained"
                type="submit"
                className="sign-in-submit"
                style={{ background: "#fe9832", color: "white" }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} className="login-disable-btn" />
                ) : (
                  "SIGN IN"
                )}
              </Button>
            </form>

            {/* <Avatar className="form-icon">
              <Lock />
            </Avatar> */}
            {/* <iframe className="iframe-model" style={{ borderRadius: "8px" }} src="http://kibana-eo.apps.ocp4.pacosta.com/goto/a563b4d0-3c84-11f0-8805-7b4907671074" height="110"></iframe> */}
            {/* <iframe className="iframe-model" src={window.__ENV__.REACT_KIBANA}></iframe> */}
            {/* <iframe className="iframe-model" src="http://kibana-eo.apps.ocp4.pacosta.com/app/dashboards#/view/1bdbb3d0-41d8-11f0-9927-bb96d6d2aac9?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-30d%2Fd%2Cto%3Anow))&show-time-filter=true" ></iframe> */}
            {/* <iframe className="iframe-model" src="http://kibana-eo.apps.ocp4.pacosta.com/app/dashboards#/view/1bdbb3d0-41d8-11f0-9927-bb96d6d2aac9?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-30d%2Fd%2Cto%3Anow))&show-time-filter=true" ></iframe> */}
            {/* <iframe className="iframe-model" src="http://159.12.45.172:30819/app/dashboards#/view/589e1c20-3bbd-11f0-b086-8350c5ec1e9c?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-30d%2Fd%2Cto%3Anow))&show-time-filter=true" ></iframe> */}
            <iframe className="iframe-model"  src="http://kibana-test.apps.ocp4.pacosta.com/app/dashboards#/view/1dd8bed0-3ba2-11f0-8e82-75e90817a1db?embed=true&_g=(filters%3A!()%2CrefreshInterval%3A(pause%3A!t%2Cvalue%3A0)%2Ctime%3A(from%3Anow-30d%2Fd%2Cto%3Anow))&show-time-filter=true" ></iframe>
         
          </div>
        </div>
      )}

      {/* for display logged in user and no of visitors */}
      {/* <div className="app-v">
        <span>v2.0</span>
      </div> */}

      <div className="app-manual">
        <div>
          <a href="http://eoffice-v1.indiannavy.mil.indiannavy.mil/Paperless/signin.jsp?" target="_blank">eOffice 1.0</a>
          <span> - Read Only Mode</span>
        </div>
        <div>
          <a href="https://intranet.indiannavy.mil:8080/Services/Guidelines?folderId=49410&view=gridview&pageSize=100" target="_blank"><span>User Manual And Tutorials</span></a>
        </div>
        <div>
          <a href="https://apps.indiannavy.mil/edesk/#no-back-button" target="_blank"><span>Helpdesk</span></a>
        </div>
        <div>
          <span style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "7px",
            fontSize: "1.5rem"
          }}>Active Users <Person style={{
            color: "rgb(254, 152, 50)"
          }} /> - {activeUsers}</span>

        </div>
        <div>
          <span style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "7px",
            fontSize: "1.5rem"
          }}>Total Visitors <GroupIcon style={{
            color: "rgb(254, 152, 50)"
          }} /> - {visitors}</span>

        </div>
      </div>


      {/* <div className="app-rn">
        <span onClick={handleRn}>Release Note</span>
      </div> */}

    </>
  );
};
export default LoginPage;

// In local storage even if tab or application is closed or even if whole pc is shutdown still local storage item remain persitent but in case of session as soon as app is closed the whole session storage is cleared
