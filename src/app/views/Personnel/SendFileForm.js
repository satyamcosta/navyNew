import React, { useCallback, useEffect, useState } from "react";
import {
  Autocomplete,
  ToggleButton,
  ToggleButtonGroup,
} from "@material-ui/lab";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import { connect as reduxConnect, useDispatch } from "react-redux";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import FavoriteIcon from "@material-ui/icons/Favorite";
import DeleteIcon from "@material-ui/icons/Delete";
import {
  getGroupList,
  sendFiles,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  getServiceNumber,
  sendFilesInternal,
  sendPa,
  sendPaInternal,
} from "../../camunda_redux/redux/action";
import {
  changingTableState,
  changingTableStatePA,
  changeTableStateDraft,
} from "../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "../../camunda_redux/redux/ducks/snackbar";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { useTranslation } from "react-i18next";
import "./therme-source/material-ui/loading.css";
import { debounce, handleError } from "utils";
import SwipeableViews from "react-swipeable-views";
import { makeStyles, useTheme } from "@material-ui/styles";
import PropTypes from "prop-types";
import {
  FcHighPriority,
  FcLowPriority,
  FcMediumPriority,
} from "react-icons/fc";
import { Loading } from "./therme-source/material-ui/loading";
import { setGateway } from "app/camunda_redux/redux/ducks/GatewayReducer";
import history from "../../../history";
import {
  FiberManualRecord,
  FormatAlignCenter,
  PriorityHigh,
} from "@material-ui/icons";
import TripleToggleSwitch from "./PrioritySwitch/Three";

const useStyles = makeStyles((theme) => ({
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
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box py={3}>
          <Grid>{children}</Grid>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const SendFileForm = (props) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const dispatch = useDispatch();

  const [priority, setPriorty] = useState("medium");
  const [tabValue, setTabValue] = useState(0);

  const classes = useStyles();

  const [externalList, setExternalList] = useState([]);
  const [externalDep, setExternalDep] = useState(null);
  const [eyesOnlyArr, setEyesOnlyArr] = useState([]);
  const [eyesOnlyDep, setEyesOnlyDep] = useState(null);
  const [favouriteList, setFavouriteList] = useState([]);
  const [serviceFavouriteList, setServiceFavouriteList] = useState([]);
  const [favDep, setFavDep] = useState("");
  const [blnDisable, setBlnDisable] = useState(true);
  const [eyesOnlyfavObj, setEyesOnlyfavObj] = useState(null);
  const [alreadyFav, setAlreadyFav] = useState(false);

  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState("");

  const username = localStorage.getItem("username");
  const displayUserName = sessionStorage.getItem("displayUserName");
  const role = sessionStorage.getItem("role");

  const handleClearAll = () => {
    setExternalList([]);
    setExternalDep(null);
    setEyesOnlyArr([]);
    setEyesOnlyDep(null);
    setEyesOnlyfavObj(null);
    setFavDep("");
    setBlnDisable(true);
    setAlreadyFav(false);
    setComment("");
  };

  useEffect(() => {
    if (externalDep || eyesOnlyDep || favDep) {
      setBlnDisable(false);
    } else {
      setBlnDisable(true);
    }
  }, [externalDep, eyesOnlyDep, favDep]);

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  useEffect(async () => {
    fetchFavourite();
  }, [tabValue]);

  const handle504 = () => {
    dispatch(
      setGateway(
        true,
        "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!",
        "pa-send",
        "/eoffice/personnel/file"
      )
    );
    setTimeout(() => {
      dispatch(setGateway(false, "", "pa-send", ""));
    }, 30000);
  };

  const onHandleSubmitExtenal = async (value) => {
    let inboxId = sessionStorage.getItem("inboxId");
    if (props.isPa) {
      await props
        .sendPa(
          props.fileId,
          value,
          role,
          username,
          displayUserName,
          props.pfileName,
          priority,
          true,
          comment,
          inboxId
        )
        .then((resp) => {
          // console.log(resp);
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(errMsg);
              setLoading(false);
            } else {
              dispatch(
                setSnackbar(true, "success", t("file_sent_successfully!"))
              );
              props.setSend(false);
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          callMessageOut(error.message);
          setLoading(false);
        });
    } else {
      await props
        .sendFiles(
          props.fileId,
          value,
          role,
          username,
          displayUserName,
          props.pfileName,
          priority
        )
        .then((resp) => {
          // console.log(resp);
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(errMsg);
              setLoading(false);
            } else {
              dispatch(
                setSnackbar(true, "success", t("file_sent_successfully!"))
              );
              props.handleCloseEvent(false);
              props.handleStatus(props.fileId);
              let trigger = false;
              props.setSend(false);
              setLoading(false);
              setTimeout(() => {
                trigger = true;
                props.changingTableState(trigger, "CHANGE_PA_FILE");
                props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
                props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
              }, 0);
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          callMessageOut(error.message);
          setLoading(false);
        });
    }
  };

  const handleEyesOnlySubmit = async (value) => {
    let inboxId = sessionStorage.getItem("inboxId");
    if (props.isPa) {
      let dept = value?.deptRole[0]?.deptName;
      let sendTo = value?.deptRole[0]?.roleName;
      await props
        .sendPaInternal(
          props.fileId,
          dept,
          sendTo,
          username,
          displayUserName,
          priority,
          true,
          comment,
          inboxId
        )
        .then((resp) => {
          // console.log(resp);
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(errMsg);
              setLoading(false);
            } else {
              dispatch(
                setSnackbar(true, "success", t("file_sent_successfully!"))
              );
              props.setSend(false);
              setLoading(false);
              history.push({ pathname: "/eoffice/inbox/file" });
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          callMessageOut(error.message);
          setLoading(false);
        });
    } else {
      await props
        .sendFilesInternal(
          props.fileId,
          value,
          role,
          username,
          displayUserName,
          priority
        )
        .then((resp) => {
          // console.log(resp);
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setLoading(false);
            } else {
              dispatch(
                setSnackbar(true, "success", t("file_sent_successfully!"))
              );
              props.handleCloseEvent(false);
              props.handleStatus(props.fileId);
              let trigger = false;
              props.setSend(false);
              setLoading(false);
              setTimeout(() => {
                trigger = true;
                props.changingTableState(trigger, "CHANGE_PA_FILE");
                props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
                props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
              }, 0);
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          callMessageOut(error.message);
          setLoading(false);
        });
    }
  };

  // Debounce function
  const optimizedInpChange = useCallback(debounce(getGroupListFunc), []);
  const optimizedEyesOnlyInpChange = useCallback(
    debounce(getInternalGroupListFunc),
    []
  );

  const handleInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedInpChange(e.target.value);
      }
    }
  };

  const handleEyesOnlyInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedEyesOnlyInpChange(e.target.value);
      }
    }
  };

  async function getGroupListFunc(value) {
    if (value && value.length > 2) {
      let formData = new FormData();
      formData.append("sau", value);
      await props
        .getGroupList(formData)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              let tmpArray = [];
              // for (var i = 0; i < resp.data.length; i++) {
              //   tmpArray.push(resp.data[i]);
              // }
              setExternalList(resp.data);
            }
          } catch (err) {
            callMessageOut(err.message);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
        });
    }
  }

  async function getInternalGroupListFunc(value) {
    if (value && value.length > 2) {
      const dept = sessionStorage.getItem("department");
      await props
        .getServiceNumber(value, dept)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            } else {
              let tmpArray = [];
              if (resp.data.length) {
                for (let i = 0; i < resp.data.length; i++) {
                  if (
                    resp.data[i].deptRole.length &&
                    resp.data[i].deptRole[0] != null
                  ) {
                    for (let j = 0; j < resp.data[i].deptRole.length; j++) {
                      let newObj = {
                        ...resp.data[i],
                        deptRole: [resp.data[i].deptRole[j]],
                      };
                      tmpArray.push(newObj);
                    }
                  }
                }
              }

              setEyesOnlyArr(tmpArray);
            }
          } catch (err) {
            callMessageOut(err.message);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
        });
    }
  }

  const handleAddToFavourite = async (newValues, type) => {
    await props
      .addToFavourite(newValues, { username, role }, type, props.isPa)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setAlreadyFav(true);
            fetchFavourite();
            dispatch(
              setSnackbar(true, "success", "Added to favourite successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const fetchFavourite = async () => {
    let type = tabValue == 0 ? "section" : "service";
    await props
      .fetchFavouriteList({ username, role, type }, props.isPa)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            let tmpArray = [];
            setServiceFavouriteList(resp.favourite.serviceFavourite);
            setFavouriteList(resp.favourite.sectionFavourite);
          }
        } catch (err) {
          callMessageOut(err.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const handleDeletFavourite = async (newValues, type) => {
    await props
      .deleteFavourite(newValues, { username, role }, type, props.isPa)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setFavDep("");
            fetchFavourite();
            dispatch(
              setSnackbar(true, "success", "Delete to favourite successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const handleSubmitBtn = (e) => {
    e.preventDefault();
    setLoading(true);
    if (tabValue === 0) {
      if (externalDep) {
        onHandleSubmitExtenal(externalDep?.deptName);
      } else if (favDep) {
        onHandleSubmitExtenal(favDep?.deptName);
      }
    } else if (tabValue === 1) {
      if (eyesOnlyDep) {
        handleEyesOnlySubmit(eyesOnlyDep);
      } else if (favDep) {
        handleEyesOnlySubmit(eyesOnlyfavObj);
      }
    }
  };

  const handleChangeAddToFav = async (value) => {
    setFavDep(value);
    setAlreadyFav(false);
    setEyesOnlyDep(null);
    setEyesOnlyfavObj(value);
    // if (value) {
    //   const dept = sessionStorage.getItem("department");
    //   await props
    //     .getServiceNumber(value, dept)
    //     .then((resp) => {
    //       try {
    //         if (resp.error) {
    //           callMessageOut(resp.error);
    //         } else {
    //           setEyesOnlyfavObj(resp?.data[0]);
    //         }
    //       } catch (err) {
    //         callMessageOut(err.message);
    //       }
    //     })
    //     .catch((err) => {
    //       callMessageOut(err.message);
    //     });
    // }
  };

  const handleTabs = (event, newValue) => {
    setTabValue(newValue);
    handleClearAll();
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
    handleClearAll();
  };

  const handleChangeExternal = (value) => {
    if (!isNullOrUndefined(value)) {
      setExternalDep(value);
      setFavDep("");
      let bool = favouriteList.some(
        (item) => item?.deptName === value?.deptName
      );
      setAlreadyFav(bool);
    } else {
      setExternalDep(null);
      setAlreadyFav(false);
      setFavDep("");
    }
  };

  const handleOnChangeEyesOnly = (value) => {
    if (!isNullOrUndefined(value)) {
      setEyesOnlyDep(value);
      setFavDep("");
      let bool = serviceFavouriteList.some(
        (item) =>
          item?.deptRole[0]?.displayRoleName ===
          value?.deptRole[0]?.displayRoleName
      );
      setAlreadyFav(bool);
    } else {
      setEyesOnlyDep(null);
      setAlreadyFav(false);
      setFavDep("");
    }
  };

  const handleChangePriority = (type) => {
    // if (type != null) {
    setPriorty(type);
    // };
  };

  return (
    <>
      {loading && <Loading />}
      <form>
        <DialogContent dividers>
          <Tabs
            value={tabValue}
            onChange={handleTabs}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label={t("external")} {...a11yProps(0)} />
            <Tab label={t("eyes_only")} {...a11yProps(1)} />
          </Tabs>
          <SwipeableViews
            axis={theme.direction === "rtl" ? "x-reverse" : "x"}
            index={tabValue}
            onChangeIndex={handleChangeIndex}
          >
            <TabPanel value={tabValue} index={0} dir={theme.direction}>
              <>
                <div style={{ display: "flex" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Autocomplete
                      freeSolo
                      forcePopupIcon={true}
                      limitTags={2}
                      value={externalDep}
                      options={externalList}
                      onChange={(_, value) => {
                        if (_.key != "Enter") handleChangeExternal(value);
                      }}
                      onInputChange={handleInputChange}
                      name="section"
                      getOptionLabel={(option) => {
                        return option.deptDisplayName
                          ? option.deptDisplayName
                          : "";
                      }}
                      getOptionSelected={(option, value) =>
                        option.deptDisplayName === value.deptDisplayName
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          label={t("choose_department")}
                          margin="normal"
                          fullWidth
                          className={props.theme ? "darkTextField" : ""}
                        />
                      )}
                    />
                  </FormControl>
                  {alreadyFav ? (
                    <IconButton color="secondary" style={{ cursor: "pointer" }}>
                      <Tooltip title={t("ALREADY FAVOURITE")}>
                        <FavoriteIcon />
                      </Tooltip>
                    </IconButton>
                  ) : (
                    <IconButton
                      color="secondary"
                      id="fileForm_favourite"
                      onClick={() =>
                        handleAddToFavourite(externalDep?.id, "section")
                      }
                      style={{ cursor: "pointer" }}
                      disabled={!externalDep}
                    >
                      <Tooltip title={t("ADD TO FAVOURITE")}>
                        <FavoriteBorderIcon />
                      </Tooltip>
                    </IconButton>
                  )}
                </div>
                <div className="favourite_list">
                  <div style={{ display: "flex" }}>
                    <FormControl style={{ width: "100%" }}>
                      <Autocomplete
                        freeSolo
                        forcePopupIcon={true}
                        value={favDep}
                        options={favouriteList}
                        onChange={(_, value) => {
                          setFavDep(value);
                          setExternalDep(null);
                          setAlreadyFav(false);
                        }}
                        name="section"
                        getOptionLabel={(option) => {
                          return option.deptDisplayName
                            ? option.deptDisplayName
                            : "";
                        }}
                        getOptionSelected={(option, value) =>
                          option.deptDisplayName === value.deptDisplayName
                        }
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t("CHOOSE FROM FAVOURITE LIST")}
                            margin="normal"
                            className={props.theme ? "darkTextField" : ""}
                          />
                        )}
                      />
                    </FormControl>
                    <IconButton
                      id="fileForm_delete_fav"
                      color="secondary"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeletFavourite(favDep?.id, "section")
                      }
                      disabled={!favDep}
                    >
                      <Tooltip title={t("delete_favourite")}>
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
                {props.isPa && (
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="medium"
                    label="COMMENT"
                    placeholder="ENTER YOUR COMMENT"
                    className="pa-comment"
                    multiline
                    minRows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                )}
              </>
            </TabPanel>
            <TabPanel value={tabValue} index={1} dir={theme.direction}>
              <>
                <div style={{ display: "flex" }}>
                  <FormControl style={{ width: "100%" }}>
                    <Autocomplete
                      freeSolo
                      forcePopupIcon={true}
                      options={eyesOnlyArr}
                      value={eyesOnlyDep}
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                          : "";
                      }}
                      id="tags-outlined"
                      onChange={(_, value) => {
                        if (_.key != "Enter") handleOnChangeEyesOnly(value);
                      }}
                      onInputChange={handleEyesOnlyInputChange}
                      filterSelectedOptions
                      getOptionDisabled={(option) => {
                        typeof eyesOnlyDep == "string"
                          ? false
                          : option?.deptRole[0]?.displayRoleName ===
                            eyesOnlyDep?.deptRole[0]?.displayRoleName;
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          style={{ width: "100%" }}
                          variant="outlined"
                          margin="normal"
                          label={t("search_by_service_number")}
                          placeholder={t("enter_service_number")}
                          className={props.theme ? "darkTextField" : ""}
                        />
                      )}
                    />
                  </FormControl>
                  {alreadyFav ? (
                    <IconButton color="secondary">
                      <Tooltip title={t("ALREADY FAVOURITE")}>
                        <FavoriteIcon />
                      </Tooltip>
                    </IconButton>
                  ) : (
                    <IconButton
                      color="secondary"
                      id="fileForm_favourite"
                      onClick={() =>
                        handleAddToFavourite(
                          eyesOnlyDep?.deptRole[0]?.roleName,
                          "service"
                        )
                      }
                      style={{ cursor: "pointer" }}
                      disabled={!eyesOnlyDep}
                    >
                      <Tooltip title={t("ADD TO FAVOURITE")}>
                        <FavoriteBorderIcon />
                      </Tooltip>
                    </IconButton>
                  )}
                </div>
                <div className="favourite_list">
                  <div style={{ display: "flex" }}>
                    <FormControl style={{ width: "100%" }}>
                      <Autocomplete
                        freeSolo
                        forcePopupIcon={true}
                        limitTags={2}
                        value={favDep}
                        options={serviceFavouriteList}
                        onChange={(_, value) => handleChangeAddToFav(value)}
                        name="section"
                        getOptionLabel={(option) => {
                          return typeof option === "object"
                            ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                            : "";
                        }}
                        getOptionDisabled={(option) => {
                          typeof favDep == "string"
                            ? false
                            : option?.deptRole[0]?.displayRoleName ===
                              favDep?.deptRole[0]?.displayRoleName;
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            label={t("CHOOSE FROM FAVOURITE LIST")}
                            margin="normal"
                            className={props.theme ? "darkTextField" : ""}
                          />
                        )}
                      />
                    </FormControl>
                    <IconButton
                      id="eyes_only_delete_fav"
                      color="secondary"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        handleDeletFavourite(
                          favDep?.deptRole[0]?.roleName,
                          "service"
                        )
                      }
                      disabled={!favDep}
                    >
                      <Tooltip title={t("delete_favourite")}>
                        <DeleteIcon />
                      </Tooltip>
                    </IconButton>
                  </div>
                </div>
                {props.isPa && (
                  <TextField
                    variant="outlined"
                    fullWidth
                    size="medium"
                    label="COMMENT"
                    placeholder="ENTER YOUR COMMENT"
                    className="pa-comment"
                    multiline
                    minRows={2}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                )}
              </>
            </TabPanel>
          </SwipeableViews>

          {!props.isPa && (
            <div
              style={{
                paddingLeft: "4px",
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: "5rem",
                justifyContent: "start",
              }}
            >
              <p>SELECT PRIORITY :&nbsp;&nbsp;</p>
              {/* <ToggleButtonGroup
                  size="small"
                  value={priority}
                  exclusive
                  onChange={handleChangePriority}
                  aria-label="priority controller"
                  style={{
                    backgroundColor: "#e0dada5c",
                    width: "max-content",
                    display: "flex",
                    justifyContent: "space-between",
                    borderRadius: "2rem",
                    gap: ".5rem",
                    padding: "6px",
                  }}
                >
                  <ToggleButton
                    value="low"
                    aria-label="low"
                    style={{
                      borderRadius: "1rem",
                      border: "none",
                      backgroundColor: priority == "low" ? "white" : "",
                    }}
                  >
                    <Tooltip title="LOW">
                      <FiberManualRecord
                        style={{ color: priority == "low" ? "green" : "" }}
                      />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton
                    value="medium"
                    aria-label="medium"
                    style={{
                      borderRadius: "1rem",
                      border: "none",
                      backgroundColor: priority == "medium" ? "white" : "",
                    }}
                  >
                    <Tooltip title="MEDIUM">
                      <FormatAlignCenter
                        style={{ color: priority == "medium" ? "orange" : "" }}
                      />
                    </Tooltip>
                  </ToggleButton>
                  <ToggleButton
                    value="high"
                    aria-label="high"
                    style={{
                      borderRadius: "1rem",
                      border: "none",
                      backgroundColor: priority == "high" ? "white" : "",
                    }}
                  >
                    <Tooltip
                      title="HIGH"
                      style={{
                        borderRadius: "1rem",
                      }}
                    >
                      <PriorityHigh
                        style={{
                          color: priority == "high" ? "red" : "",
                        }}
                      />
                    </Tooltip>
                  </ToggleButton>
                </ToggleButtonGroup> */}
              <TripleToggleSwitch
                priority={priority}
                handleChange={handleChangePriority}
              />
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            id="fileForm_send_btn"
            color="secondary"
            variant="contained"
            disabled={blnDisable}
            endIcon={<SendIcon />}
            onClick={handleSubmitBtn}
          >
            {t("send")}
          </Button>
        </DialogActions>
      </form>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default reduxConnect(mapStateToProps, {
  getGroupList,
  sendFiles,
  addToFavourite,
  fetchFavouriteList,
  changingTableState,
  changingTableStatePA,
  changeTableStateDraft,
  deleteFavourite,
  getServiceNumber,
  sendFilesInternal,
  sendPa,
  sendPaInternal,
})(SendFileForm);
