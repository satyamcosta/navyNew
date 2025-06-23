import React, { Component, createRef } from "react";
import ReactDOM from "react-dom";
import { withRouter } from "react-router-dom";
import {
  FormControl,
  Icon,
  IconButton,
  MenuItem,
  withStyles,
  MuiThemeProvider,
  Select,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Paper,
  DialogActions,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  Box,
} from "@material-ui/core";
import { connect } from "react-redux";
import { setLayoutSettings } from "app/redux/actions/LayoutActions";
import { logoutUser } from "app/redux/actions/UserActions";
import {
  loadUserRoleData,
  changeTheme,
  myInfo,
  getPersonalInfo,
  sideNav,
  sidenavChange,
  sendAuditdata,
  changeRoutes,
  personalizeAction,
  getpersonalizeAction,
  loadTemplate,
  getFav
} from "../../camunda_redux/redux/action";
import { PropTypes } from "prop-types";
import { MatxMenu } from "./../../../matx";
import { isMdScreen } from "utils";
import NotificationBar from "../SharedCompoents/NotificationBar";
import {
  changingTableStatePA,
  changingTableState,
  changingTableStateInbox,
  changingTableStateOutbox,
  changingTableStateCabinet,
} from "../../camunda_redux/redux/action/apiTriggers";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import "./Layout1.css";
import Cookies from "js-cookie";
import { withTranslation } from "react-i18next";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import Brightness7Icon from "@material-ui/icons/Brightness7";
import Brightness4Icon from "@material-ui/icons/Brightness4";
import PersonOutlineOutlinedIcon from "@material-ui/icons/PersonOutlineOutlined";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import { Star } from "@material-ui/icons"
import InfoForm from "app/views/Personnel/InfoForm";
import CancelIcon from "@material-ui/icons/Cancel";
import Draggables from "react-draggable";
import i18next from "i18next";
import CryptoJS from "crypto-js";
import Logout from "app/views/user-activity/logout/Logout";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import Aduiddisable from "app/views/user-activity/logout/Aduiddisable";
import { setUserData } from "app/redux/actions/UserActions";
import { Menu, MoreVert } from "@material-ui/icons";
import LoginPage from "LoginPage";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { setPersonalizeinfo } from "app/redux/actions/PersonalizeInfo";
import FavComponent from "../SharedCompoents/FavouriteComponent";
import { setMyFav } from "app/redux/actions/FavActions";

const PaperComponent = (props) => {
  return (
    <Draggables handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggables>
  );
};

const styles = (theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
  },
  topBarWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  box: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-evenly",
    gap: "4px",
    marginLeft: "4px",
    "@media (max-width: 767px)": {
      display: "none",
    },
  },
  topBarMoreBtn: {
    display: "none",
    "@media (max-width: 767px)": {
      display: "block",
    },
  },
});

const elem = document.documentElement;
class Layout1Topbar extends Component {
  constructor(props) {
    super(props);
    this.menuRef = createRef();
  }
  state = {
    fullScreen: false,
    comboValue: "",
    comboList: [],
    lightMode: Cookies.get("theme") === "red" ? true : false,
    openInfo: false,
    AuditD: false,
    lang: Cookies.get("i18next"),
    openMenu: false,
    loading: false,
    pUser: "",
    openFav: false,
    favObj: {}
  };

  async UNSAFE_componentWillMount() {
    const department = localStorage.getItem("username");
    this.props.loadUserRoleData(department).then((resp) => {
      let tempArr = [];
      try {
        if (resp.data.length) {
          // tempArr.push({
          //   ...resp.data[0]?.deptRole[0],
          //   showName: resp.data[0]?.deptDisplayUsername,
          //   username: true, // it means first object is user not role based user
          //   superAdmin: resp.data[0]?.superAdmin,
          //   admin: resp.data[0]?.admin,
          // });
          for (let x = 0; x < resp.data[0]?.deptRole?.length; x++) {
            tempArr.push({
              ...resp.data[0].deptRole[x],
              username: false,
              showName: resp.data[0].deptRole[x].displayRoleName,
              superAdmin: false,
              admin: resp.data[0]?.deptRole[x]?.admin,
            });
          }
          if (tempArr.length > 0) {
            this.setState({
              comboList: tempArr,
              comboValue: JSON.stringify(tempArr[0]),
            });
            sessionStorage.setItem("role", "");
            sessionStorage.setItem("department", "");
            sessionStorage.setItem("pklDirectrate", "");
            sessionStorage.setItem("displayUserName", tempArr[0].showName);
            sessionStorage.setItem("signTitle", resp.data[0]?.deptDisplayUsername)
            sessionStorage.setItem("superAdmin", resp.data[0]?.superAdmin);
            sessionStorage.setItem("displayRole", "");
            sessionStorage.setItem("displayDept", "");
            // this.props.setUserData({
            //   role: {
            //     ...tempArr[0],
            //   },
            //   roleArr: tempArr,
            // });
            const data = tempArr[0] || tempArr[1];
            try {
              fetch("/user_service/api/getSectionData", {
                method: "GET",
                headers: {
                  rolename: data.roleName,
                  Accept: "application/json",
                  Authorization:
                    "Bearer " + sessionStorage.getItem("jwt_token"),
                  sessionId: sessionStorage.getItem("sessionId"),
                  userName: localStorage.getItem("username"),
                },
              })
                .then((res) => {
                  if (res.status == 504) {
                    this.props.setSnackbar(
                      true,
                      "error",
                      "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!"
                    );
                  } else {
                    return res.json();
                  }
                })
                .then((res) => {
                  if (res.error) {
                    this.props.setSnackbar(true, "error", res.error);
                    return;
                  }

                  if (res?.role?.penColor) {
                    // this.props.setPersonalizeinfo({
                    //   ...this.props.personalizeInfo,
                    //   personalize: {
                    //     ...this.props.personalizeInfo.personalize,
                    //     penColor: res.role.penColor.toUpperCase(),
                    //   },
                    // });
                    sessionStorage.setItem("penColor", res?.role?.penColor)
                  }

                  console.log(res.section?.cau);
                  sessionStorage.setItem("deptCode", res.section?.cau || "IT");
                  sessionStorage.setItem("deptCodeList", JSON.stringify(res.section?.cauList));
                  sessionStorage.setItem("role", res.role?.roleName);
                  sessionStorage.setItem(
                    "department",
                    res.role?.deptName
                    // ?.replace("dir-", "")
                  );
                  sessionStorage.setItem(
                    "pklDirectrate",
                    res.section?.pklDirectorate
                    // .replace("dir-")
                  );
                  // sessionStorage.setItem("displayUserName", res.deptDisplayUsername);
                  sessionStorage.setItem(
                    "displayRole",
                    res.role?.displayRoleName
                  );
                  sessionStorage.setItem(
                    "displayDept",
                    res.section?.deptDisplayName
                  );
                  sessionStorage.setItem("branch", res.section?.branch);
                  sessionStorage.setItem("mrRole", res.section?.deptMailRole);
                  if (res.role?.deptName == res.section?.parentDir) {
                    sessionStorage.setItem("parent-dir", res.section?.isSuperDir ? res.section?.parentDir : "");
                    sessionStorage.getItem("department", res.section?.isSuperDir ? res.section?.parentDir : res.role?.deptName)
                  }
                  else {

                    sessionStorage.setItem("parent-dir", res.section?.parentDir);
                    sessionStorage.setItem("department", res.section?.parentDir);
                  }
                  sessionStorage.setItem(
                    "coordRole",
                    res.section?.deptCoordRole
                  );

                  if (res.section?.deptMailRole && res.role?.roleName) {
                    sessionStorage.setItem(
                      "isMr",
                      res.section?.deptMailRole == res.role?.roleName
                    );
                  }



                  this.props.loadTemplate().then((res) => console.log(res));

                  // this.props.setUserData({
                  //   role: {
                  //     ...data,
                  //   },
                  // });

                  this.setState({
                    comboValue: JSON.stringify(data),
                    pUser: res.section?.deptCoordRole,
                  });
                  this.refreshTables(data);
                  if (tempArr.length > 0) {
                    this.props.setUserData({
                      role: {
                        ...tempArr[0],
                      },
                      roleArr: tempArr,
                      section: res.section
                    });
                  }
                  this.props.getpersonalizeAction().then((res) => {
                    try {
                      if (!res.error) {
                        if (res?.response?.personalize?.penColor) sessionStorage.setItem("penColor", res?.response?.personalize?.penColor)
                        this.props.setPersonalizeinfo(res?.response);
                        if (res.response?.personalize?.dark)
                          this.handleThemeChangeRed();
                        else this.handleThemeChangeBlue();
                      } else {
                        // throw new Error("Error fetching personalization data:");
                      }
                    } catch (error) {
                      // this.props.setSnackbar(true, "error", error.message);
                    }
                  });

                  this.props.getFav().then((res) => {
                    try {
                      if (res.error) {


                      }
                      else {
                        this.setState({
                          favObj: res
                        })
                        this.props.setMyFav(res)
                      }
                    } catch (error) {

                    }
                  })

                });
            } catch (e) {
              this.props.setSnackbar(true, "error", e.message);
            }
          }
        }
      } catch (e) {
        if (e.message === "Cannot read property 'roleName' of undefined") {
          this.props.history.push("/eoffice/404");
        }
      }
    });

    // this.props.getpersonalizeAction().then((res) => {
    //   try {
    //     if (!res.error) {
    //       this.props.setPersonalizeinfo(res.response);
    //       if (res.response?.dark) this.handleThemeChangeRed();
    //       else this.handleThemeChangeBlue();
    //     } else {
    //       // throw new Error("Error fetching personalization data:");
    //       this.handleChangeToEnglish();
    //     }
    //   } catch (error) {
    //     // this.props.setSnackbar(true, "error", error.message);
    //     this.handleChangeToEnglish();
    //   }
    // });
  }

  // componentDidUpdate() {
  //   this.setState({ lang: Cookies.get("i18next") });
  // }

  // fecth Personalize info funcation
  // fetchPersonalize() {
  //   this.props.getpersonalizeAction().then((res) => {
  //     try {
  //       if (!res.error) {
  //         this.props.setPersonalizeinfo(res);
  //         this.setState({ lightMode: res.response?.dark });
  //       } else {
  //         throw new Error("Error fetching personalization data:");
  //       }
  //     } catch (error) {
  //       this.props.setSnackbar(true, "error", error.message);
  //     }
  //   });
  // }

  handleChangeToEnglish = () => {
    // this.props.setPersonalizeinfo({
    //   ...this.props.personalizeInfo.data,
    //   language: "en",
    // });
    // i18next.changeLanguage("en");
    // this.setState({ lang: "en" });

    this.props.setPersonalizeinfo({
      ...this.props.personalizeInfo,
      personalize: {
        ...this.props.personalizeInfo.personalize,
        language: "en",
      },
    });
    i18next.changeLanguage("en");
    this.setState({ lang: "en" });
  };

  handleChangeToHindi = () => {
    // this.props.setPersonalizeinfo({
    //   ...this.props.personalizeInfo.data,
    //   language: "hi",
    // });

    this.props.setPersonalizeinfo({
      ...this.props.personalizeInfo,
      personalize: {
        ...this.props.personalizeInfo.personalize,
        language: "hi",
      },
    });
    i18next.changeLanguage("hi");
    this.setState({ lang: "hi" });
  };

  componentDidMount() {
    const username = localStorage.getItem("username");
    let formData = new FormData();
    formData.append("username", username);

    // full screen handler
    const handleResize = () => {
      if (
        document.webkitIsFullScreen ||
        document.mozFullscreen ||
        document.mozFullScreenElement
      ) {
        // console.log("FS mode");
        this.setState({ fullScreen: true });
        this.setState({ openMenu: false });
      } else {
        // console.log("DS mode");
        this.setState({ fullScreen: false });
      }
    };
    window.addEventListener("resize", handleResize);

    window.addEventListener("keydown", (e) => {
      if (e.key == "F11") {
        if (this.state.fullScreen == false) {
          window.removeEventListener("resize", handleResize);
          // console.log(`pressed ${e.key} for FS`);
          this.setState({ fullScreen: true });
        }
        setTimeout(() => {
          window.addEventListener("resize", handleResize);
        }, 1000);
      }
    });

    // username &&
    //   this.props.getPersonalInfo(formData).then((res) => {
    //     if (res.status === "OK") {
    //       this.props.myInfo(true);
    //     } else {
    //       this.props.myInfo(false);
    //     }
    //   });

    this.props.myInfo(true);

    // this.props.changeRoutes("PA");
    this.props.changeRoutes("ALL");
  }

  componentDidUpdate(prevProps, prevState) {
    //  change language mode
    const language = this.props.personalizeInfo.data?.language;
    if (language && language !== this.state.lang) {
      if (this.state.lang === "en") {
        this.handleChangeToEnglish();
      } else {
        this.handleChangeToHindi();
      }
    }
  }

  openFullScreen = () => {
    this.setState({ fullScreen: true });
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      // elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    }
  };

  closeFullScreen = () => {
    this.setState({ fullScreen: false });
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      // document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  handleHelpDesk = () => {
    this.props.history.push("/eoffice/user/helpdesk");
  };

  updateSidebarMode = (sidebarSettings) => {
    let { settings, setLayoutSettings } = this.props;
    setLayoutSettings({
      ...settings,
      layout1Settings: {
        ...settings.layout1Settings,
        leftSidebar: {
          ...settings.layout1Settings.leftSidebar,
          ...sidebarSettings,
        },
      },
    });
  };

  handleSidebarToggle = () => {
    let { settings } = this.props;
    let { layout1Settings } = settings;

    let mode;
    if (isMdScreen()) {
      mode = layout1Settings.leftSidebar.mode === "close" ? "mobile" : "close";
    } else {
      mode = layout1Settings.leftSidebar.mode === "full" ? "close" : "full";
    }
    this.updateSidebarMode({ mode });
  };

  encryptFun(password, username) {
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

  // handleSignOut = async () => {
  //   const userName = localStorage.getItem("username");
  //   const tab = document.title.split("(")[1].split(")")[0];
  //   let role = sessionStorage.getItem("role");
  //   let dark = this.state.lightMode;
  //   let language = this.state.lang;
  //   let paFile = 0;
  //   let pa = 1;

  //   this.props.personalizeAction(
  //     userName,
  //     paFile,
  //     pa,
  //     tab,
  //     role,
  //     dark,
  //     language
  //   );

  //   const data = JSON.stringify({
  //     refresh_token: localStorage.getItem("refresh_token"),
  //   });

  //   const headers = {
  //     "Content-Type": "application/json",
  //     Accept: "application/json",
  //     Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
  //   };

  //   const sessionId = sessionStorage.getItem("sessionId");
  //   const Authorization = "Bearer " + sessionStorage.getItem("jwt_token");
  //   const department = sessionStorage.getItem("department");
  //   const displayUserName = sessionStorage.getItem("displayUserName");

  //   this.props.setUserData({
  //     role: {},
  //     roleArr: [],
  //   });

  //   // unsubscribe to refresh token api
  //   const id = localStorage.getItem("refresh_session");
  //   clearInterval(id);

  //   ReactDOM.render(
  //     <LoginPage
  //       feedbackdialog={true}
  //       userNameFeedback={userName}
  //       sessionId={sessionId}
  //       Authorization={Authorization}
  //       deptName={department}
  //     />,
  //     document.getElementById("root")
  //   );
  //   localStorage.clear();
  //   sessionStorage.clear();
  //   const logout = await fetch("/auth/logout", {
  //     method: "POST",
  //     headers,
  //     body: data,
  //   });
  // };

  handleSignOut = async () => {
    const userName = localStorage.getItem("username");
    const tab = document.title.split("(")[1].split(")")[0];
    let role = sessionStorage.getItem("role");
    let penColor =
      sessionStorage.getItem("penColor") ||
      this.props.personalizeInfo?.personalize?.penColor;
    console.log(penColor);
    let dark = this.state.lightMode;
    let language = this.state.lang;
    let paFile = 0;
    let pa = 1;
    let muiTableData = this.props.personalizeInfo.muiTableData;
    this.props.personalizeAction(
      role,
      paFile,
      pa,
      tab,
      role,
      dark,
      language,
      penColor,
      muiTableData
    );

    const data = JSON.stringify({
      refresh_token: localStorage.getItem("refresh_token"),
      username: localStorage.getItem("username"),
    });

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
    };

    const sessionId = sessionStorage.getItem("sessionId");
    const Authorization = "Bearer " + sessionStorage.getItem("jwt_token");
    const department = sessionStorage.getItem("department");
    const displayUserName = sessionStorage.getItem("displayUserName");

    this.props.setUserData({
      role: {},
      roleArr: [],
      section: {}
    });

    // unsubscribe to refresh token api
    const id = localStorage.getItem("refresh_session");
    clearInterval(id);

    ReactDOM.render(
      <LoginPage
        feedbackdialog={true}
        userNameFeedback={userName}
        sessionId={sessionId}
        Authorization={Authorization}
        deptName={department}
      />,
      document.getElementById("root")
    );
    localStorage.clear();
    sessionStorage.clear();
    setTimeout(async () => {
      const logout = await fetch("/auth/logout", {
        method: "POST",
        headers,
        body: data,
      });
      // window.location.reload()
    }, 500);
  };

  handleThemeChangeBlue = (e) => {
    let { settings } = this.props;
    let { layout1Settings } = settings;
    this.setState({ lightMode: false });
    let sideBarTheme, tobBarTheme, buttonTheme;
    sideBarTheme = layout1Settings.leftSidebar.theme = "blue";
    tobBarTheme = layout1Settings.topbar.theme = "blue";
    tobBarTheme = layout1Settings.footer.theme = "#001049";
    buttonTheme = layout1Settings.activeButton.theme = "blue";
    this.updateSidebarMode({ sideBarTheme, tobBarTheme, buttonTheme });
    Cookies.set("theme", "blue");

    setTimeout(() => {
      this.props.changeTheme(false);
      // document.getElementById(
      //   "theme"
      // ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion.css`;
      document.body.classList.add("theme-light");
      document.body.classList.remove("theme-dark");
    }, [500]);
    // "%PUBLIC_URL%/assets1/css/syncfusion.css";
  };

  handleThemeChangeRed = (e) => {
    let { settings } = this.props;
    let { layout1Settings } = settings;
    this.setState({ lightMode: true });
    let sideBarTheme, tobBarTheme, buttonTheme;
    sideBarTheme = layout1Settings.leftSidebar.theme = "darkTheme";
    tobBarTheme = layout1Settings.topbar.theme = "darkTheme";
    tobBarTheme = layout1Settings.footer.theme = "#001049";
    buttonTheme = layout1Settings.activeButton.theme = "darkTheme";
    this.updateSidebarMode({ sideBarTheme, tobBarTheme, buttonTheme });
    Cookies.set("theme", "darkTheme");

    setTimeout(() => {
      this.props.changeTheme(true);
      // document.getElementById(
      //   "theme"
      // ).href = `${process.env.PUBLIC_URL}/assets1/css/syncfusion-dark.css`;
      document.body.classList.add("theme-dark");
      document.body.classList.remove("theme-light");
    }, [500]);
  };

  handleChange = (event) => {
    let data = JSON.parse(event.target.value);
    if (!data.username) {
      sessionStorage.setItem("displayUserName", data?.showName);
      try {
        fetch("/user_service/api/getSectionData", {
          method: "GET",
          headers: {
            rolename: data.roleName,
            Accept: "application/json",
            Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
            sessionId: sessionStorage.getItem("sessionId"),
            userName: localStorage.getItem("username"),
          },
        })
          .then((res) => {
            if (res.status == 504) {
              this.props.setSnackbar(
                true,
                "error",
                "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!"
              );
            } else {
              return res.json();
            }
          })
          .then((res) => {
            if (res.error) {
              this.props.setSnackbar(true, "error", res.error);
              return;
            }

            if (res?.role?.penColor) {
              // this.props.setPersonalizeinfo({
              //   ...this.props.personalizeInfo,
              //   personalize: {
              //     ...this.props.personalizeInfo.personalize,
              //     penColor: res.role.penColor.toUpperCase(),
              //   },
              // });
              sessionStorage.setItem("penColor", res?.role?.penColor)
            }

            sessionStorage.setItem("role", res.role?.roleName);
            sessionStorage.setItem(
              "department",
              res.role?.deptName
              // ?.replace("dir-", "")
            );
            sessionStorage.setItem(
              "pklDirectrate",
              res.section?.pklDirectorate
              // ?.replace("dir-", "")
            );
            // sessionStorage.setItem("displayUserName", res.deptDisplayUsername);
            console.log(res.section?.cau);
            sessionStorage.setItem("deptCode", res.section?.cau || "IT");
            sessionStorage.setItem("deptCodeList", JSON.stringify(res.section?.cauList));
            sessionStorage.setItem("displayRole", res.role?.displayRoleName);
            sessionStorage.setItem("displayDept", res.section?.deptDisplayName);
            sessionStorage.setItem("branch", res.section?.branch);
            sessionStorage.setItem("mrRole", res.section?.deptMailRole);
            sessionStorage.setItem("coordRole", res.section?.deptCoordRole);
            if (res.role?.deptName == res.section?.parentDir) {
              sessionStorage.setItem("parent-dir", res.section?.isSuperDir ? res.section?.parentDir : "");
              sessionStorage.getItem("department", res.section?.isSuperDir ? res.section?.parentDir : res.role?.deptName)
            }
            else {

              sessionStorage.setItem("parent-dir", res.section?.parentDir);
              sessionStorage.setItem("department", res.section?.parentDir);
            }

            if (res.section?.deptMailRole && res.role?.roleName) {
              sessionStorage.setItem(
                "isMr",
                res.section?.deptMailRole == res.role?.roleName
              );
            }

            this.props.setUserData({
              role: {
                ...data,
              },
              section: res.section
            });
            this.setState({
              comboValue: JSON.stringify(data),
              pUser: res.section?.deptCoordRole,
            });
            this.refreshTables(data);
            this.props.getpersonalizeAction().then((res) => {
              try {
                if (!res.error) {
                  if (res?.response?.personalize?.penColor) sessionStorage.setItem("penColor", res?.response?.personalize?.penColor)
                  this.props.setPersonalizeinfo(res?.response);
                  if (res.response?.personalize?.dark)
                    this.handleThemeChangeRed();
                  else this.handleThemeChangeBlue();
                } else {
                  // throw new Error("Error fetching personalization data:");
                }
              } catch (error) {
                // this.props.setSnackbar(true, "error", error.message);
              }
            });
            this.props.getFav().then((res) => {
              try {
                if (res.error) {


                }
                else {
                  this.setState({
                    favObj: res
                  })
                  this.props.setMyFav(res)
                }
              } catch (error) {

              }
            })
          });
      } catch (e) {
        this.props.setSnackbar(true, "error", e.message);
      }
    } else {
      sessionStorage.setItem("role", "");
      sessionStorage.setItem("department", "");
      sessionStorage.setItem("pklDirectrate", "");
      // sessionStorage.setItem("displayUserName", res.deptDisplayUsername);
      sessionStorage.setItem("displayRole", "");
      sessionStorage.setItem("displayDept", "");
      sessionStorage.setItem("branch", "");
      this.props.setUserData({
        role: {
          ...data,
        },
      });
      this.setState({ comboValue: JSON.stringify(data) });
      this.refreshTables(data);
    }

    // setTimeout(() => {
    //   if (data.username) {
    //     this.props.changeRoutes("PA");
    //   } else {
    //     this.props.changeRoutes("ALL");
    //   }
    // }, 500); // delay so that once trigger to redux of inbox , outbox , cabinet based on role is done then i will change the route
  };

  refreshTables = (data) => {
    const { appRoutes } = this.props;
    if (data?.username) {
      this.props.changeRoutes("PA");
      this.props.history.push("/eoffice/inbox/file");
    } else {
      const {
        blnValuePA,
        blnValuePF,
        blnValueInbox,
        blnValueOutbox,
        blnValueCabinet,
      } = this.props.subscribe;

      const mrRole = sessionStorage.getItem("mrRole");
      this.props.changingTableStatePA(!blnValuePA, "CHANGE_PA_APPLICATION");
      this.props.changingTableState(!blnValuePF, "CHANGE_PA_FILE");
      // this.props.changingTableStateInbox(!blnValueInbox, "CHANGE_INBOX");
      this.props.changingTableStateOutbox(!blnValueOutbox, "CHANGE_OUTBOX");
      this.props.changingTableStateCabinet(!blnValueCabinet, "CHANGE_CABINET");

      if (mrRole == data?.roleName) {
        this.props.changeRoutes("MAIL");
        this.props.history.push("/eoffice/inbox/file");
      } else {
        this.props.changeRoutes("ALL");
      }

      if (appRoutes.showPa) {
        this.props.history.push("/eoffice/inbox/file");
      }
    }
  };

  handalclose = () => {
    this.setState({ AuditD: false });
  };

  handleCloseFav = () => {
    this.setState({ openFav: false })
  }

  handleCloseMenu = (event) => {
    if (
      this.menuRef?.current &&
      this.MenuanchorRef?.current?.contains(event.target)
    ) {
      return;
    }

    this.setState({ openMenu: false });
  };

  render() {
    const { fullScreen, comboList, lightMode } = this.state;
    let {
      theme,
      settings,
      className,
      style,
      darkState,
      t,
      showHam,
      toggleHam,
      classes,
    } = this.props;
    const topbarTheme =
      settings.themes[settings.layout1Settings.topbar.theme] || theme;
    let { layout1Settings } = settings;
    const serviceNumber = localStorage.getItem("username");

    return (
      <MuiThemeProvider theme={topbarTheme}>
        <div className="topbar">
          <div
            className={`topbar-hold ${className}`}
            style={Object.assign(
              {},
              {
                background: this.props.appTheme
                  ? "linear-gradient(90deg, #383837 39%, #2D221B 60%, #473D3A 89%)"
                  : "linear-gradient(90deg, rgb(4 77 131) 39%, rgb(29, 79, 140) 60%, rgb(5 84 142) 89%)",
              },
              // { background: topbarTheme.palette.primary.main },
              style
            )}
          >
            <div className="flex flex-space-between flex-middle h-100">
              <div className="flex">
                <IconButton
                  onClick={() => {
                    // this.handleSidebarToggle()
                    toggleHam(!showHam);
                  }}
                  className="topbar-toggle-btn"
                  style={{
                    color: this.props.appTheme ? "#fff" : "inherit",
                  }}
                >
                  {showHam ? (
                    <CancelIcon
                      style={{
                        color: this.props.appTheme ? "#fff" : "#484747",
                      }}
                    />
                  ) : (
                    <Menu />
                  )}
                </IconButton>

                <div className="topbar-img">
                  <div className="app-logo-img"></div>
                  {/* <img src="./inbox-alt-svgrepo-com.svg" alt="c" /> */}
                  {/* <img
                    src={
                      process.env.PUBLIC_URL +
                      "/assets/images/navy-paperless.png"
                    }
                    alt={"EOffice"}
                    style={{
                      imageRendering: "-webkit-optimize-contrast",
                      maxWidth: "15%",
                    }}
                    loading="lazy"
                  /> */}
                </div>
              </div>

              <div className={classes.topBarWrapper}>
                <FormControl
                  className="topbarSelect"
                  style={{
                    minWidth: 300,
                    background: "white",
                    borderRadius: "50px",
                    textAlignLast: "center",
                  }}
                >
                  <Select
                    native
                    value={this.state.comboValue}
                    onChange={this.handleChange}
                    inputProps={{
                      name: "age",
                      id: "age-native-simple",
                    }}
                    style={{ fontSize: "12px", color: "black" }}
                  >
                    {/* {comboList.map((x) => (
                      <option key={x.deptRole}> {x.deptRole}</option>
                    ))} */}
                    {comboList.map((x, i) => (
                      <option
                        style={{
                          color: this.props.appTheme ? "white" : "black",
                        }}
                        key={i + 1}
                        value={JSON.stringify(x)}
                      >
                        {x.showName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <Box className={classes.box}>
                  {/* <Tooltip title={t("AUDIT INFO")} aria-label="AUDIT INFO">
                    <IconButton
                      onClick={() => this.setState({ AuditD: true })}
                      className="hide_menu_topbar"
                    >
                      <AssignmentTurnedInIcon
                        style={{
                          fontSize: "1.25rem",
                          color: "white",
                        }}
                      />
                    </IconButton>
                  </Tooltip> */}

                  {/*<Tooltip title={t("my_info")} aria-label="myInfo">
                    <IconButton
                      id="my_info_button"
                      onClick={() => this.setState({ openInfo: true })}
                      className="hide_menu_topbar"
                    >
                      <PersonOutlineOutlinedIcon
                        style={{
                          fontSize: "1.25rem",
                          color: "white",
                          // padding: "0px 4px",
                        }}
                      />
                    </IconButton>
                      </Tooltip> */}

                  <div
                    style={{ display: "inline-block" }}
                    className="hide_menu_topbar"
                  >
                    {this.state.lang == "en" ? (
                      <Tooltip title="हिन्दी">
                        <IconButton
                          id="hindi_lang_Button"
                          onClick={() => {
                            this.handleChangeToHindi("hi");
                          }}
                          className="hide_menu_topbar"
                        >
                          <div
                            style={{
                              fontSize: "1.15rem",
                              color: "white",
                              marginTop: "-1px",
                              // padding: "0 4px",
                            }}
                          >
                            अ
                          </div>
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <Tooltip title="ENGLISH">
                        <IconButton
                          id="eng_lang_Button"
                          onClick={() => {
                            this.handleChangeToEnglish("en");
                          }}
                          className="hide_menu_topbar"
                        >
                          <div
                            style={{
                              fontSize: "1.1rem",
                              color: "white",
                              // padding: "0 4px",
                            }}
                          >
                            A
                          </div>
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                  {this.props.appTheme ? (
                    <Tooltip title={t("light_mode")} aria-label="DarkMode">
                      <IconButton
                        id="darkMode_Button"
                        onClick={this.handleThemeChangeBlue}
                        className="hide_menu_topbar"
                      >
                        <Brightness7Icon style={{ fontSize: "1.1rem" }} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("dark_mode")} aria-label="LightMode">
                      <IconButton
                        id="lightMode_Button"
                        onClick={this.handleThemeChangeRed}
                        className="hide_menu_topbar"
                      >
                        <Brightness4Icon
                          style={{
                            fontSize: "1.1rem",
                            color: "#fff",
                            // padding: "0px 4px",
                          }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                  <IconButton
                    id="notification_Button"
                    className="hide_menu_topbar"
                    style={{ marginTop: "-2px" }}
                  >
                    <NotificationBar style={{ fontSize: "1.1rem" }} />
                  </IconButton>

                  {fullScreen ? (
                    <Tooltip
                      title={t("exit_fullScreen")}
                      aria-label="Exit FullScreen"
                    >
                      <span className="hide_menu_topbar">
                        <IconButton
                          id="closeFullScreen_Button"
                          onClick={this.closeFullScreen}
                        >
                          <FullscreenExitIcon style={{ color: "#fff" }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  ) : (
                    <Tooltip title={t("fullScreen")} aria-label="FullScreen">
                      <span className="hide_menu_topbar">
                        <IconButton
                          id="fullScreen_Button"
                          onClick={this.openFullScreen}
                        >
                          <FullscreenIcon style={{ color: "#fff" }} />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )}
                  <Tooltip title={t("fav")} aria-label="help">
                    <span className="hide_menu_topbar">
                      <IconButton
                        id="helpDeskp_Button"
                        onClick={() => this.setState({ openFav: true })}
                      >
                        <Star style={{ color: "#fff" }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={t("help")} aria-label="help">
                    <span className="hide_menu_topbar">
                      <IconButton
                        id="helpDeskp_Button"
                        onClick={this.handleHelpDesk}
                      >
                        <HelpOutlineIcon style={{ color: "#fff" }} />
                      </IconButton>
                    </span>
                  </Tooltip>
                  <Tooltip title={t("logout")} aria-label="Logout">
                    <IconButton
                      id="logout_Button"
                      onClick={this.handleSignOut}
                      color="secondary"
                      className="hide_menu_topbar"
                    >
                      <ExitToAppIcon style={{ fontSize: "1.2rem" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={t("p_user")} aria-label="FullScreen">
                    <span
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "5px",
                        color: "#fff",
                      }}
                    >
                      <SupervisorAccountIcon />: {this.state.pUser}
                    </span>
                  </Tooltip>
                </Box>
                <IconButton
                  onClick={() =>
                    this.setState({ openMenu: !this.state.openMenu })
                  }
                  ref={this.menuRef}
                  className={classes.topBarMoreBtn}
                >
                  <Tooltip title="MENU">
                    <MoreVert style={{ color: "#fff" }} />
                  </Tooltip>
                </IconButton>
                <Popper
                  open={this.state.openMenu}
                  anchorEl={this.menuRef.current}
                  role={undefined}
                  transition
                  disablePortal
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={this.handleCloseMenu}>
                          <MenuList
                            autoFocusItem={this.state.openMenu}
                            id="topbar-menu-list-grow"
                            style={{ zIndex: "1" }}
                          >
                            {this.state.lang == "en" ? (
                              <MenuItem
                                onClick={() => {
                                  this.handleChangeToHindi("hi");
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                हिन्दी
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={() => {
                                  this.handleChangeToEnglish("en");
                                }}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                ENGLISH
                              </MenuItem>
                            )}
                            {/* <MenuItem
                              onClick={() => this.setState({ AuditD: true })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                            >
                              <AssignmentTurnedInIcon /> {t("AUDIT INFO")}
                            </MenuItem> */}
                            {/*<MenuItem
                              onClick={() => this.setState({ openInfo: true })}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                            >
                              <PersonOutlineOutlinedIcon /> {t("my_info")}
                            </MenuItem>*/}

                            {this.props.appTheme ? (
                              <MenuItem
                                onClick={this.handleThemeChangeBlue}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <Brightness7Icon /> {t("light_mode")}
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={this.handleThemeChangeRed}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <Brightness4Icon /> {t("dark_mode")}
                              </MenuItem>
                            )}
                            {fullScreen ? (
                              <MenuItem
                                onClick={this.closeFullScreen}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <FullscreenExitIcon /> {t("exit_fullScreen")}
                              </MenuItem>
                            ) : (
                              <MenuItem
                                onClick={this.openFullScreen}
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: ".7rem",
                                }}
                              >
                                <FullscreenIcon /> {t("fullScreen")}
                              </MenuItem>
                            )}
                            <MenuItem
                              onClick={this.handleSignOut}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                            >
                              <ExitToAppIcon /> {t("logout")}
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
                {/*
                  <div className="app-v2">
                  <span>v1.4.0 beta</span>
                </div>
                  */}
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={this.state.openInfo}
          onClose={(event, reason) => {
            if (reason === "escapeKeyDown") {
              this.setState({ openInfo: false });
            }
          }}
          aria-labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
          maxWidth="sm"
        >
          <DialogTitle
            id="draggable-dialog-title"
            className="send_dialog"
            style={{ cursor: "move" }}
          >
            {t("personal_information")}
            <Tooltip title={t("close")}>
              <IconButton
                id="myInfo_CancelIcon"
                aria-label="close"
                onClick={() => this.setState({ openInfo: false })}
                color="primary"
                style={{
                  float: "right",
                  position: "relative",
                  top: "0px",
                  color: this.props.appTheme ? "#fff" : "inherit",
                }}
                className="cancel-drag"
              >
                <CancelIcon
                  style={{ color: this.props.appTheme ? "#fff" : "#484747" }}
                />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <InfoForm handleSubmit={(val) => this.setState({ openFav: val })} />
        </Dialog>

        <Dialog
          open={this.state.AuditD}
          aria-labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
          maxWidth="sm"
        >
          <DialogTitle
            id="draggable-dialog-title"
            style={{ cursor: "move", userSelect: "none" }}
            className="dialog_title"
          >
            {t("audit_information")}
            <Tooltip title={t("close")}>
              <IconButton
                aria-label="close"
                onClick={this.handalclose}
                color="primary"
                style={{
                  float: "right",
                  position: "relative",
                  top: "-9px",
                  color: this.props.appTheme ? "#fff" : "inherit",
                }}
                className="cancel-drag"
              >
                <CancelIcon
                  style={{
                    color: this.props.appTheme ? "#fff" : "#484747",
                  }}
                />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <Aduiddisable handalclose={this.handalclose} />
        </Dialog>

        <Dialog
          open={this.state.openFav}
          aria-labelledby="draggable-dialog-title"
          PaperComponent={PaperComponent}
          maxWidth="sm"
          fullWidth
          id="fav"
        >
          <DialogTitle
            id="draggable-dialog-title"
            style={{ cursor: "move", userSelect: "none" }}
            className="dialog_title"
          >
            {t("fav")}
            <Tooltip title={t("close")}>
              <IconButton
                aria-label="close"
                onClick={this.handleCloseFav}
                color="primary"
                style={{
                  float: "right",
                  position: "relative",
                  color: this.props.appTheme ? "#fff" : "inherit",
                }}
                className="cancel-drag"
              >
                <CancelIcon
                  style={{
                    color: this.props.appTheme ? "#fff" : "#484747",
                  }}
                />
              </IconButton>
            </Tooltip>
          </DialogTitle>
          <FavComponent handleClose={this.handleCloseFav} favObj={this.state.favObj} />
        </Dialog>
      </MuiThemeProvider>
    );
  }
}

Layout1Topbar.propTypes = {
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loadUserRoleData: PropTypes.func.isRequired,
  settings: PropTypes.object.isRequired,
  changeTheme: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  setLayoutSettings: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  loadUserRoleData: PropTypes.func.isRequired,
  settings: state.layout.settings,
  appTheme: state.theme,
  paInfo: state.myInfo,
  subscribe: state.subscribeApi,
  appRoutes: state.appRoutes,
  personalizeInfo: state.personalizeInfo,
});

export default withStyles(styles, { withTheme: true })(
  withRouter(
    connect(mapStateToProps, {
      setUserData,
      setLayoutSettings,
      logoutUser,
      loadUserRoleData,
      changingTableStatePA,
      changingTableState,
      changingTableStateInbox,
      changingTableStateOutbox,
      changingTableStateCabinet,
      changeTheme,
      myInfo,
      getPersonalInfo,
      sideNav,
      sidenavChange,
      sendAuditdata,
      changeRoutes,
      setSnackbar,
      personalizeAction,
      getpersonalizeAction,
      setPersonalizeinfo,
      loadTemplate,
      getFav,
      setMyFav
    })(withTranslation()(Layout1Topbar))
  )
);
