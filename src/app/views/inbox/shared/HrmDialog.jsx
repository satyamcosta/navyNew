import {
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContentText,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import { Autocomplete } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import "./Hrm.css";
import {
  sendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  sendFilesSection,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  getGroupListIn,
} from "../../../camunda_redux/redux/action";
import { changingTableStateInbox } from "../../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import history from "../../../../history";
import { Loading } from "../therme-source/material-ui/loading";
import SelectFile from "./SelectFile";
import PaFlowDialog from "./PaFlowDialof";
import { Add, Done } from "@material-ui/icons";
import * as Yup from "yup";
import { useFormik } from "formik";
import { debounce, handleError } from "utils";
import { useCallback } from "react";
import { setGateway } from "app/camunda_redux/redux/ducks/GatewayReducer";

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

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    width: 500,
  },
  remark_title: {
    display: "flex",
    justifyContent: "space-between",
    gap: "2rem",
    alignItems: "center",
  },
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

const HrmDialog = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const currentSection = useSelector((state) => state.user.section)
  const favObj = useSelector((state) => state.fav)

  const { pendingRoute,
    completedRoute } = props


  const [role, setRole] = useState("");
  const [value, setValue] = useState(0);
  const [intService, setIntService] = useState([]);
  const [intServiceList, setIntServiceList] = useState([]);
  const [intServiceObj, setIntServiceObj] = useState([]);
  const [favIntService, setFavIntService] = useState("");
  const [intServiceFavouriteList, setIntServiceFavouriteList] = useState([]);
  const [favIntServiceDepName, setFavIntServiceDepName] = useState("");
  const [favIntServiceObj, setFavIntServicObj] = useState([]);
  const [section, setSection] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [sectionIn, setSectionIn] = useState([]);
  const [sectionInList, setSectionInList] = useState([]);
  const [sectionObj, setSectionObj] = useState([]);
  const [favSection, setFavSection] = useState("");
  const [sectionFavouriteList, setSectionFavouriteList] = useState([]);
  const [favSectionObj, setFavSectionObj] = useState([]);
  const [service, setService] = useState("");
  const [serviceList, setServiceList] = useState([]);
  const [serviceObj, setServiceObj] = useState([]);
  const [favService, setFavService] = useState("");
  const [serviceFavouriteList, setServiceFavouriteList] = useState([]);
  const [favServiceObj, setFavServiceObj] = useState([]);
  const [favServiceDepName, setFavServiceDepName] = useState("");
  const [blnDisable, setBlnDisable] = useState(true);
  const [blnNextDisable, setBlnNextDisable] = useState(true);
  const [sameDep, setSameDep] = useState(true);
  const [addFavBlnDisable, setAddFavBlnDisable] = useState(true);
  const [deleteFavBlnDisable, setDeleteFavBlnDisable] = useState(true);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectFileDialog, setSelectFileDialog] = useState(false);
  const [paFlowDialog, setPaFlowDialog] = useState(false);
  const [alreadyFav, setAlreadyFav] = useState(false);
  const [priority, setPriorty] = useState("medium");
  const [comment, setComment] = useState("");
  const [extAddresses, setExtAddresses] = useState("");

  const [addRemark, setaddRemark] = useState(false); // toggle add remark dialog
  const [sendToDep, setsendToDep] = useState(""); // to know whether sending file to same dept user
  const [remark, setremark] = useState(""); // remark message to be send
  const [sentCount, setsentCount] = useState(0); // to know whether all files has been sent or not

  const [endTask, setEndTask] = useState("Approved");

  // To show loading while fetching in autocomplete
  const [isInt, setIsInt] = useState(false);
  const [isExt, setIsExt] = useState(false);
  const [isExtIn, setIsExtIn] = useState(false);

  // Route handling state
  const [pendingList, setPendingList] = useState([])
  const [completedList, setCompletedList] = useState([currentSection])

  // Fav Select State
  const [groupList, setGroupList] = useState([])
  const [group, setGroup] = useState("")


  const initialValue = {
    remark: "",
  };

  const hrmRole = Cookies.get("HrmRole");
  const hrmDepartmet = Cookies.get("HrmDepartment");
  let hasCoverNote = Cookies.get("hasCoverNote");
  const sessionRole = sessionStorage.getItem("role");
  const inboxid = sessionStorage.getItem("InboxID");
  const Dept = sessionStorage.getItem("department");
  const username = localStorage.getItem("username");
  const parentDir = Boolean(sessionStorage.getItem("parent-dir"));

  const validationSchema = Yup.object({
    remark: Yup.string(t("enter_a_remark"))
      .trim()
      .required(t("must_enter_a_valid_remark")),
  });

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    // onSubmit: handleAddRemark,
  });

  const callMessageOut = (msg) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", msg));
  };

  const callMessageSuccess = () => {
    dispatch(setSnackbar(true, "success", "File has been send successfully!"));
  };

  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    formik.setFieldValue("remark", "");
    if (!props.externalList) {
      setsendToDep("");
      // setSection([]);
    }
    if (!props.internalList) {
      // setIntService([]);
      setsendToDep("");
    }
    setService("");
    setFavSection("");
    setFavIntService("");
    setFavService("");
    setAlreadyFav(false);
  };

  const handlePriority = (type) => {
    if (type == priority) {
      setPriorty("medium");
    } else {
      setPriorty(type);
    }
    // setPriorty(type);
  };

  const handleEnd = () => {
    if (endTask == "Rejected") {
      handleSendConfirmation("Rejected");
    } else {
      handleApprove();
    }
  };

  const handleChangeIndex = (index) => {
    setValue(index);
    formik.setFieldValue("remark", "");
    setsendToDep("");
  };

  const fetchFavourite = async () => {
    let type =
      value == 0 ? "internalService" : value == 1 ? "section" : "service";
    let role = sessionRole;
    await props
      .fetchFavouriteList({ role, type })
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            const {
              internalServiceFavourite,
              sectionFavourite,
              serviceFavourite,
            } = resp.favourite;
            setSectionFavouriteList(sectionFavourite);
            setServiceFavouriteList(serviceFavourite);
            setIntServiceFavouriteList(internalServiceFavourite);
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut(err.message);
      });
  };

  useEffect(()=>{
    console.log(pendingRoute, completedRoute)
  },[pendingRoute, completedRoute])

  useEffect(() => {
    if (favObj?.favList) {
      setGroupList(favObj?.favList)
    }
  }, [favObj])

  useEffect(() => {
    handleInputValueChangeIn();
  }, []);

  useEffect(() => {
    // fetchFavourite();
    if (value == 0) handleInputValueChangeInternalService();
  }, [value]);

  useEffect(() => {
    if (
      service ||
      section.length ||
      intService.length ||
      favSection ||
      favService ||
      favIntService
    ) {
      setBlnDisable(false);
    } else {
      setBlnDisable(true);
    }

    if (section || favSection) {
      if (sameDep) {
        setBlnNextDisable(true);
      } else {
        setBlnNextDisable(false);
      }
    } else {
      setBlnNextDisable(true);
    }

    if (service || section || intService) {
      setAddFavBlnDisable(false);
    } else {
      setAddFavBlnDisable(true);
    }

    if (favSection || favService || favIntService) {
      setDeleteFavBlnDisable(false);
    } else {
      setDeleteFavBlnDisable(true);
    }
  }, [section, service, intService, favIntService, favSection, favService]);

  useEffect(() => {
    const { blnValueInbox } = props.subscribe;
    console.log(props?.checkedData, sentCount);
    if (sentCount === props?.checkedData?.length) {
      props.changingTableStateInbox(!blnValueInbox, "CHANGE_INBOX");
      props?.reset();
      props?.handleClose();
      callMessageSuccess();
      setLoading(false);
    } else if (sentCount == "trigger" && props?.checkedData?.length) {
      props.changingTableStateInbox(true, "CHANGE_INBOX");
      callMessageOut("An Error Occured While Sending The File");
      setLoading(false);
    }
  }, [sentCount, props?.checkedData]);

  useEffect(() => {
    if (props.externalList || props.internalList || props.externalInList) {
      setSection(props.externalList);
      setIntService(props.internalList);
      setSectionIn(props.externalInList);
      if (props.internalList?.length) {
        let roleData = props.internalList[0]?.roleName;
        let deptName = props.internalList[0]?.deptName;
        setsendToDep(deptName);
        setRole(roleData);
      }
      if (props.externalList?.length) {
        let roleData = props.externalList[0]?.deptCoordRole;
        let deptName = props.externalList[0]?.deptName;
        setsendToDep(deptName);
        setRole(roleData);
      }
      if (props.externalInList?.length) {
        let roleData = props.externalInList[0]?.deptCoordRole;
        let deptName = props.externalInList[0]?.deptName;
        setsendToDep(deptName);
        setRole(roleData);
      }
    }
  }, [props.externalList, props.internalList, props.externalInList]);

  // console.log({
  //   sendToDep,
  //   role,
  // });

  const handleClearList = (type) => {
    switch (type) {
      case "service":
        return (
          setSection([]),
          setIntService([]),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "section":
        return (
          setService(""),
          // setIntService([]),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "internal_service":
        return (
          // setSection([]),
          setService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_service":
        return (
          setSection([]),
          setIntService([]),
          setService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_section":
        return (
          setSection([]),
          setIntService([]),
          setFavService(""),
          setService(""),
          setFavIntService("")
        );
      case "fav_internal_service":
        return (
          setSection([]),
          setIntService([]),
          setFavService(""),
          setFavSection(""),
          setService("")
        );
      default:
        break;
    }
  };

  const handleInputValueChangeInternalService = async (newValue) => {
    // if (newValue && newValue.length >= 3) {
    //   const dept = sessionStorage.getItem("department");
    //   await props.getInternalServiceNumber(newValue, dept).then((resp) => {
    //     try {
    //       if (resp.error) {
    //         callMessageOut(resp.error)
    //       }
    //       else {
    //         let tmpArray = [];
    //         setIntServiceObj(resp.data);
    //         // for (var i = 0; i < resp.data.length; i++) {
    //         //   tmpArray.push(
    //         //     `${resp.data[i].deptUsername} | ${resp.data[i].deptDisplayUsername} | ${resp.data[i].deptRole?.displayRoleName}`
    //         //   );
    //         // }
    //         setIntServiceList(resp.data);
    //       }
    //     } catch (err) {
    //       callMessageOut(err.message);
    //     }
    //   }).catch((err) => {
    //     callMessageOut(err.message);
    //   });
    //   ;
    //   setSectionList([]);
    //   setServiceList([]);
    // }
    const dept = sessionStorage.getItem("department");
    setIsInt(true);
    await props
      .getInternalServiceNumber("", dept)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setIsInt(false);
          } else {
            let tmpArray = [];
            setIntServiceObj(resp.data || []);
            // for (var i = 0; i < resp.data.length; i++) {
            //   tmpArray.push(
            //     `${resp.data[i].deptUsername} | ${resp.data[i].deptDisplayUsername} | ${resp.data[i].deptRole?.displayRoleName}`
            //   );
            // }
            setIntServiceList(resp.data || []);
            setIsInt(false);
          }
        } catch (err) {
          callMessageOut(err.message);
          setIsInt(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
        setIsInt(false);
      });
    setSectionList([]);
    setServiceList([]);
  };

  // const handleOnChangeInternalService = async (newValue) => {
  //   if (!isNullOrUndefined(newValue)) {
  //     let roleData = newValue?.deptRole[0]?.roleName;
  //     let deptName = newValue?.deptRole[0]?.deptName;
  //     setRole(roleData);
  //     setIntService(newValue);
  //     setsendToDep(deptName);
  //     handleClearList("internal_service");
  //     let bool = intServiceFavouriteList?.some(
  //       (item) =>
  //         item?.deptRole[0]?.displayRoleName ===
  //         value?.deptRole[0]?.displayRoleName
  //     );
  //     setAlreadyFav(bool);
  //   } else {
  //     setRole("");
  //     setIntService("");
  //     setsendToDep("");
  //     setAlreadyFav(false);
  //   }
  // };

  const handleChangeGroup = (val) => {
    setGroup(val)
    setIntService(val?.roles)
  }

  const handleOnChangeInternalService = async (val) => {
    if (val.length == 0) {
      setIntService(val);
    } else {
      const newVal = val[val.length - 1];
      console.log(newVal);
      if (
        newVal &&
        typeof newVal === "object" &&
        ("id" in newVal || "displayRoleName" in newVal)
      ) {
        if (!isNullOrUndefined(val)) {
          let roleData = val[0]?.deptRole?.[0]?.roleName; // Added additional check for deptRole
          let deptName = val[0]?.deptRole?.[0]?.deptName; // Added additional check for deptRole
          setRole(roleData);
          setIntService(val);
          setsendToDep(deptName);
          handleClearList("internal_service");
          // let bool = intServiceFavouriteList?.some(
          //   (item) =>
          //     item?.deptRole[0]?.displayRoleName ===
          //     newValue?.deptRole?.[0]?.displayRoleName // Use newValue instead of value
          // );
          // setAlreadyFav(bool);
        } else {
          setRole("");
          setIntService([]);
          setsendToDep("");
          setAlreadyFav(false);
        }
      }
    }
  };

  const handleOnChangeFavInternalService = async (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptRole[0]?.roleName;
      let deptName = newValue?.deptRole[0]?.deptName;
      setFavIntService(newValue);
      setRole(roleData);
      handleClearList("fav_internal_service");
      setsendToDep(deptName);
      setAlreadyFav(false);
    } else {
      setAlreadyFav(false);
      setRole("");
      setsendToDep("");
      setFavIntService("");
    }
    // await props
    //   .getInternalServiceNumber(value, dept)
    //   .then((resp) => {
    //     setFavIntServicObj(resp.data);
    //     const data =
    //       resp.data && resp.data.find((ele) => ele.deptUsername === value);
    //     setFavIntServiceDepName(data.deptName);
    //     setRole(data.deptCoordRole);
    //   })
    //   .catch((err) => {
    //     callMessageOut(err);
    //   });
  };

  const handleInputValueChange = async (newValue) => {
    // const dept = sessionStorage.getItem("department");
    if (newValue && newValue.length >= 2) {
      let formData = new FormData();
      formData.append("sau", newValue);
      setIsExt(true);
      await props
        .getGroupList(formData)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setIsExt(false);
            } else {
              let tmpArray = [];
              // for (var i = 0; i < resp.data.length; i++) {
              //   // if(resp.data[i].deptName !== dept){
              //   tmpArray.push(
              //     `${resp.data[i].deptDisplayName} | ${resp.data[i].deptCoordRole} | ${resp.data[i].deptName}`
              //   );
              //   // }
              // }
              setSectionList(resp.data || []);
              setIsExt(false);
              // setSectionObj(resp.data);
            }
          } catch (error) {
            callMessageOut(error.message);
            setIsExt(false);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
          setIsExt(false);
        });
      setServiceList([]);
      setIntServiceList([]);
    }
  };

  const handleInputValueChangeIn = async (newValue) => {
    setIsExtIn(true);
    props.getGroupListIn().then((resp) => {
      try {
        if (resp.error) {
          setIsExtIn(false);
          return;
        } else {
          setSectionInList(resp.data);
          setIsExtIn(false);
        }
      } catch (error) {
        setIsExtIn(false);
      }
    });
    setServiceList([]);
    setIntServiceList([]);
  };

  const handleOnChange = (val) => {
    if (val.length == 0) {
      setSection(val);
    } else {
      const newVal = val[val.length - 1];
      console.log(newVal);
      if (newVal && typeof newVal === "object" && "id" in newVal) {
        if (!isNullOrUndefined(val)) {
          let roleData = val[0]?.deptCoordRole;
          let deptName = val[0]?.deptName;
          let same = props.departmentList?.some(
            (item) => item === val[0]?.deptName
          );
          setSameDep(same);
          setSection(val);
          setPendingList(val)
          setRole(roleData);
          handleClearList("section");
          setsendToDep(deptName);
          let bool = sectionFavouriteList.some(
            (item) => item?.deptName === val[0]?.deptName
          );
          setAlreadyFav(bool);
        } else {
          setAlreadyFav(false);
          setRole("");
          setsendToDep("");
          setSection([]);
          setSameDep(true);
        }
      }
    }
  };

  const handleOnChangeIn = (val) => {
    if (val.length == 0) {
      setSectionIn(val);
    } else {
      const newVal = val[val.length - 1];
      console.log(newVal);
      if (newVal && typeof newVal === "object" && "id" in newVal) {
        setSectionIn(val);
      }
    }

    // newValue && newValue.length > 0 && handleClearList("section");
  };

  const handleOnChangeFavSection = async (newValue) => {
    // await props
    //   .getSection(value)
    //   .then((resp) => {
    //     setFavSectionObj(resp.data);
    //     console.log(resp.data);
    //     let data = resp.data && resp.data.find((ele) => ele.deptName === value);
    //     setRole(data.deptCoordRole);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptCoordRole;
      let deptName = newValue?.deptName;
      let val = props.departmentList?.some(
        (item) => item === newValue?.deptName
      );
      setSameDep(val);
      setFavSection(newValue);
      setRole(roleData);
      handleClearList("fav_section");
      setsendToDep(deptName);
      setAlreadyFav(false);
    } else {
      setAlreadyFav(false);
      setRole("");
      setsendToDep("");
      setFavSection("");
      setSameDep(true);
    }
  };

  const handleDisableRemark = () => {
    if (value === 0) {
      return false;
    } else if (value === 1 && sendToDep !== Dept) {
      return true;
    } else if (value === 2 && sendToDep !== Dept) {
      return true;
    } else if (sendToDep === Dept) {
      return false;
    }
  };

  const handleInputValueChangeService = async (newValue) => {
    if (newValue && newValue.length >= 2) {
      await props
        .getServiceNumber(newValue)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
            }
            // else {
            //   let tmpArray = [];
            //   const response = resp.data;
            //   setServiceObj(response);

            //   setServiceList(response);
            // }
            else {
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
              // console.log(tmpArray);
              setServiceList(tmpArray);
              setServiceObj(tmpArray);
            }
          } catch (err) {
            callMessageOut(err.message);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
        });
      setSectionList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChangeService = (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue.deptRole[0]?.roleName;
      let deptName = newValue.deptRole[0]?.deptName;
      setRole(roleData);
      setService(newValue);
      setsendToDep(deptName);
      handleClearList("service");
      let bool = serviceFavouriteList.some(
        (item) => item.deptUsername === newValue?.deptUsername
      );
      setAlreadyFav(bool);
    } else {
      setRole("");
      setService("");
      setsendToDep("");
      setAlreadyFav(false);
    }
  };

  const handleOnChangeFavService = async (newValue) => {
    if (!isNullOrUndefined(newValue)) {
      let roleData = newValue?.deptRole[0]?.roleName;
      let deptName = newValue?.deptRole[0]?.deptName;
      setAlreadyFav(false);
      setFavService(newValue);
      setRole(roleData);
      setsendToDep(deptName);
      handleClearList("fav_service");
    } else {
      setAlreadyFav(false);
      setRole("");
      setsendToDep("");
      setFavService("");
    }
    // await props
    //   .getServiceNumber(value)
    //   .then((resp) => {
    //     setFavServiceObj(resp.data);
    //     let data =
    //       resp.data && resp.data.find((ele) => ele.deptUsername === value);
    //     setFavServiceDepName(data.deptName);
    //     setRole(data.deptCoordRole);
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  };

  const handleAddToFavourite = async () => {
    setLoading(true);
    let role = sessionRole;
    let data = section
      ? section.id
      : service
        ? service.deptRole[0]?.roleName
        : intService
          ? intService.deptRole[0]?.roleName
          : "";
    let type = section
      ? "section"
      : service
        ? "service"
        : intService
          ? "internalService"
          : "";
    await props
      .addToFavourite(data, { role }, type)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setAlreadyFav(true);
            fetchFavourite();
            setLoading(false);
            dispatch(
              setSnackbar(true, "success", "Add to favourite list successfully")
            );
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteFavourite = () => {
    setLoading(true);
    let role = sessionRole;
    let data = favSection
      ? favSection.id
      : favService
        ? favService.deptRole[0]?.roleName
        : favIntService
          ? favIntService.deptRole[0]?.roleName
          : "";
    let type = favSection
      ? "section"
      : favService
        ? "service"
        : favIntService
          ? "internalService"
          : "";
    props
      .deleteFavourite(data, { role }, type)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            fetchFavourite();
            setFavSection("");
            setFavService("");
            setFavIntService("");
            setLoading(false);
            dispatch(
              setSnackbar(
                true,
                "success",
                "Delete to favourite list successfully"
              )
            );
          }
        } catch (error) {
          callMessageOut(resp.error);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handle504 = () => {
    dispatch(
      setGateway(
        true,
        "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!",
        "inbox-send",
        "/eoffice/inbox/file"
      )
    );
    setTimeout(() => {
      dispatch(setGateway(false, "", "inbox-send", ""));
    }, 30000);
  };

  const handleSend = (val, flagNumber, isReturn, message) => {
    const inboxId = sessionStorage.getItem("InboxID");
    // const inboxids = JSON.parse(sessionStorage.getItem("InboxIDS"));
    const inboxids = props?.checkedData;
    console.log(inboxids);
    if (inboxids) {
      inboxids.forEach((inbox) => {
        handleSendType(val, flagNumber, isReturn, inbox, message, true);
      });
    } else if (inboxId) {
      handleSendType(val, flagNumber, isReturn, inboxId, message);
    }
  };

  // here below inbox can be either id or object
  const handleSendType = (
    val,
    flagNumber,
    isReturn,
    inbox,
    message,
    multiple
  ) => {
    setLoading(true);
    flagNumber = flagNumber ? flagNumber : null;
    const canSendRemark = !handleDisableRemark();

    const id = typeof inbox === "object" ? inbox.id : inbox;
    const fileName =
      typeof inbox === "object" ? inbox.referenceNumber : props.pfileName;
    const pcId =
      typeof inbox === "object"
        ? inbox.partCase
        : sessionStorage.getItem("partcaseID");
    const remarkBody = {
      comment: formik.getFieldMeta("remark").value,
      department: sessionStorage.getItem("department"),
      pcId: sessionStorage.getItem("partcaseID"),
      by: sessionStorage.getItem("role"),
    };

    // let body = canSendRemark ? remarkBody : null;
    let body = remarkBody;

    // let group = serviceObj.find((data) => data.deptRole?.roleName === role);
    // let intGroup = intServiceObj.find(
    //   (data) => data.deptRole?.roleName === role
    // );
    // let sectionGroup = sectionObj.find(
    //   (data) => data.deptDisplayName === section
    // );

    // console.log(!isNullOrUndefined(favService));

    const partcaseID = sessionStorage.getItem("partcaseID");
    const fromRole = sessionStorage.getItem("role");

    if (intService.length && !isNullOrUndefined(intService)) {
      let newIntService = intService.map((item, i) => {
        if (item?.displayRoleName) {
          return item;
        } else {
          return item.deptRole[0];
        }
      });
      const intServiceBody = intService[0];
      let deptData =
        intServiceBody?.deptName || intServiceBody?.deptRole?.[0]?.deptName;
      let roleData =
        intServiceBody?.roleName || intServiceBody?.deptRole?.[0]?.roleName;
      newIntService.shift();
      body.internalList = newIntService;
      const intServiceNumberData = {
        groupName:
          intServiceBody?.deptName || intServiceBody?.deptRole[0]?.deptName,
        roleName: roleData, // role
        userName: intServiceBody?.deptUsername,
        fromRole: fromRole,
        displayDeptName: intServiceBody?.deptDisplayName,
        displayRoleName:
          intServiceBody?.displayRoleName ||
          intServiceBody?.deptRole[0]?.displayRoleName,
      };

      let newSection = [...section];
      body.externalList = newSection;

      let newSectionIn = [...sectionIn];
      body.withinSectionList = newSectionIn;

      props
        .sendFilesInternalServiceNumber(
          id,
          intServiceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          deptData, // sendToDep
          comment,
          completedRoute,
          completedList.concat(section)
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess();
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setsentCount("trigger");
          console.log(error);
          setLoading(false);
        });
    } else if (section.length && !isNullOrUndefined(section)) {
      const sectionBody = section[0];
      let roleData = sectionBody?.deptCoordRole;
      let deptData = sectionBody?.deptName;
      let newSection = [...section];
      newSection.shift();
      body.externalList = newSection;
      const sectionData = {
        groupName: sectionBody?.deptName,
        roleName: roleData, // role
        fromRole: fromRole,
        displayDeptName: sectionBody?.deptDisplayName,
        displayRoleName: sectionBody?.deptRoleDisplayName,
      };
      props
        .sendFilesSection(
          id,
          sectionData,
          sessionRole,
          Dept,
          username,
          val,
          fileName,
          body,
          flagNumber,
          isReturn,
          deptData, // sendToDept
          extAddresses,
          completedRoute?.concat(completedList),
          section
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (message) {
                approveRejectMessage(message);
              } else {
                callMessageSuccess();
              }
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setsentCount("trigger");
          console.log(error);
          setLoading(false);
        });
    } else if (sectionIn.length && !isNullOrUndefined(sectionIn)) {
      const sectionInBody = sectionIn[0];
      let roleData = sectionInBody?.deptCoordRole;
      let deptData = sectionInBody?.deptName;
      let newSectionIn = [...sectionIn];
      newSectionIn.shift();
      body.withinSectionList = newSectionIn;
      const sectionInData = {
        groupName: sectionInBody?.deptName,
        roleName: roleData, // role
        fromRole: fromRole,
        displayDeptName: sectionInBody?.deptDisplayName,
        displayRoleName: sectionInBody?.deptRoleDisplayName,
      };
      props
        .sendFilesSection(
          id,
          sectionInData,
          sessionRole,
          Dept,
          username,
          val,
          fileName,
          body,
          flagNumber,
          isReturn,
          deptData, // sendToDept
          extAddresses
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (message) {
                approveRejectMessage(message);
              } else {
                callMessageSuccess();
              }
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setsentCount("trigger");
          console.log(error);
          setLoading(false);
        });
    } else if ((service && !isNullOrUndefined(service)) || isReturn) {
      const serviceNumberData = {
        groupName: isReturn ? "" : service.deptRole[0]?.deptName,
        roleName: role,
        userName: service.deptUsername,
        fromRole: fromRole,
        displayDeptName: isReturn ? "" : service?.deptDisplayName,
        displayRoleName: isReturn ? "" : service?.deptRole[0]?.displayRoleName,
      };
      props
        .sendFilesServiceNumber(
          id,
          serviceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          props.serviceLetterId,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess();
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(resp.error);
            setLoading(false);
          }
        })
        .catch((error) => {
          setsentCount("trigger");
          console.log(error);
          setLoading(false);
        });
    } else if (extAddresses !== "") {
      const sectionData = {
        groupName: sessionStorage.getItem("department"),
        roleName: sessionStorage.getItem("role"),
        fromRole: sessionStorage.getItem("role"),
        displayDeptName: sessionStorage.getItem("displayDept"),
        displayRoleName: sessionStorage.getItem("displayRole"),
      };
      props
        .sendFilesSection(
          id,
          sectionData,
          sessionRole,
          sessionStorage.getItem("department"),
          localStorage.getItem("username"),
          val,
          fileName,
          body,
          flagNumber,
          isReturn,
          sendToDep,
          extAddresses
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (message) {
                approveRejectMessage(message);
              } else {
                callMessageSuccess();
              }
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess();
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setsentCount("trigger");
          console.log(error);
          setLoading(false);
        });
    } else if (favSection && !isNullOrUndefined(favSection)) {
      const favData = {
        groupName: favSection?.deptName,
        roleName: role,
        fromRole: fromRole,
        displayDeptName: favSection?.deptDisplayName,
        displayRoleName: favSection?.deptRoleDisplayName,
      };
      props
        .sendFilesSection(
          id,
          favData,
          sessionRole,
          Dept,
          username,
          val,
          fileName,
          body,
          flagNumber,
          isReturn,
          sendToDep,
          extAddresses
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess();
                setRole("");
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          setsentCount("trigger");
          console.log(err);
          setLoading(false);
        });
    } else if (favService && !isNullOrUndefined(favService)) {
      const favData = {
        groupName: favService.deptRole[0]?.deptName,
        roleName: role,
        userName: favService?.deptUsername,
        fromRole: fromRole,
        displayDeptName: favService?.deptDisplayName,
        displayRoleName: favService.deptRole[0]?.displayRoleName,
      };
      props
        .sendFilesServiceNumber(
          id,
          favData,
          val,
          fileName,
          body,
          flagNumber,
          props.serviceLetterId,
          isReturn,
          sendToDep
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess();
                setRole("");
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setsentCount("trigger");
          console.log(error);
          setLoading(false);
        });
    } else if (favIntService && !isNullOrUndefined(favIntService)) {
      let intServiceNumberData = {
        groupName: favIntService.deptRole[0]?.deptName,
        roleName: role,
        userName: favIntService?.deptUsername,
        fromRole: fromRole,
        displayDeptName: favIntService?.deptDisplayName,
        displayRoleName: favIntService?.deptRole[0]?.displayRoleName,
      };
      props
        .sendFilesInternalServiceNumber(
          id,
          intServiceNumberData,
          val,
          fileName,
          body,
          flagNumber,
          sendToDep,
          comment
        )
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              if (errMsg?.flag) {
                handle504();
                setLoading(false);
                return;
              }
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess();
                setRole("");
                props.handleClose();
                setLoading(false);
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
              }
            }
          } catch (error) {
            setsentCount("trigger");
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((error) => {
          setsentCount("trigger");
          console.log(error);
          setLoading(false);
        });
    }
  };

  const approveRejectMessage = (msg) => {
    dispatch(setSnackbar(true, "success", msg));
  };

  const handleSendConfirmation = (value) => {
    setOpenConfirmation(false);
    setLoading(true);
    const inboxId = sessionStorage.getItem("InboxID");
    const branch = sessionStorage.getItem("branch");
    if (value != null) {
      props
        .PCFileClosuer(inboxId, value, props.pfileName, branch)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            }
            if (value === "Approved") {
              approveRejectMessage("File has been approved successfully");
            } else if (value === "Rejected") {
              approveRejectMessage("File has been rejected ");
            }

            if (resp) {
              setLoading(false);
            }
            history.push({ pathname: "/eoffice/inbox/file" });
          } catch (error) {
            callMessageOut(error.message);
          }
        });
    }
  };

  const handleApprove = () => {
    if (props.serviceLetterId) {
      setSelectFileDialog(true);
    } else {
      handleSendConfirmation("Approved");
    }
  };

  // Optimized debounce function
  const optimizedInternalService = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );

  const optimizedSectionList = useCallback(
    debounce(handleInputValueChange),
    []
  );

  const optimizedChangeService = useCallback(
    debounce(handleInputValueChangeService),
    []
  );

  const handleSendButton = () => {
    if (intService.length || sectionIn.length) {
      return false;
    } else if (!section.length) {
      if (extAddresses && props.notinglen && !props.notingSigned) {
        return false;
      }
      return true;
    } else if (section.length) {
      // if (props.notinglen <= 0 || !props.notingList[0]?.isSigned) {
      //   return true;
      // }
      if (props.notinglen <= 0 || !props.notingList[0]?.prevVersionId?.length) {
        return true;
      }
      return false;
    }
  };


  return (
    <div>
      {loading && <Loading />}
      <DialogContent dividers>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={t("internal")} {...a11yProps(0)} />
          {parentDir ? <Tab label={t("external_in")} {...a11yProps(2)} /> : <div></div>}
          <Tab label={t("external")} {...a11yProps(1)} />
          {/* <Tab label={t("eyes_only")} {...a11yProps(2)} /> */}
        </Tabs>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container justifyContent="center">

              {
                groupList?.length != 0 && (<TextField
                  fullWidth
                  size='small'
                  id="outlined-select-currency"
                  select
                  style={{
                    marginBottom: "13px"
                  }}
                  label={"group"}
                  value={group}
                  onChange={(e) => handleChangeGroup(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  placeholder="Select Favourite Group"
                  variant="outlined"
                  className={` corr-form-select ${props.theme ? "darkTextField" : ""
                    }`}
                // error={formik.touched.type && Boolean(formik.errors.type)}
                // helperText={formik.touched.type && formik.errors.type}
                >
                  {groupList.map((option, i) => (
                    <MenuItem key={i} value={option}>
                      {option?.label}
                    </MenuItem>
                  ))}
                </TextField>)
              }

              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    disableCloseOnSelect
                    // forcePopupIcon={true}
                    options={intServiceList}
                    getOptionLabel={(option) => {
                      if (typeof option === "object") {
                        if (option?.displayRoleName) {
                          return `${option?.displayRoleName}`;
                        } else {
                          return `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`;
                        }
                      } else {
                        return "";
                      }
                    }}
                    id="tags-outlined"
                    value={intService}
                    onChange={(event, newValue) => {
                      handleOnChangeInternalService(newValue);
                    }}
                    // onInputChange={(event, newInputValue) => {
                    //   !newInputValue.includes("|") &&
                    //     optimizedInternalService(newInputValue);
                    // }}
                    filterSelectedOptions
                    getOptionDisabled={(option) => {
                      return intService.some((item) => {
                        if (item.displayRoleName) {
                          return (
                            item.displayRoleName ==
                            option?.deptRole[0]?.displayRoleName
                          );
                        } else {
                          return (
                            item?.deptRole[0]?.displayRoleName ==
                            option?.deptRole[0]?.displayRoleName
                          );
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder={t("enter_service_number")}
                        className={props.theme ? "darkTextField" : ""}
                        helperText={
                          props?.internalList?.length ? t("file_seq") : ""
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isInt ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
                {/**
                 {alreadyFav ? (
                  <Tooltip title={t("ALREADY FAVOURITE")}>
                    <span>
                      <IconButton color="secondary">
                        <FavoriteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("add_to_favourite")}>
                    <span>
                      <IconButton
                        id="inbox_add_to_favourite"
                        color="secondary"
                        disabled={addFavBlnDisable}
                        onClick={handleAddToFavourite}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
                */}
              </Grid>
              {/**
               <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    // forcePopupIcon={true}
                    options={intServiceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                        : "";
                    }}
                    value={favIntService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavInternalService(newValue);
                    }}
                    filterSelectedOptions
                    getOptionDisabled={(option) =>
                      option?.deptUsername === favIntService?.deptUsername
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_service_number")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="inbox_delete_favourite"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              */}

              <TextField
                variant="outlined"
                fullWidth
                size="medium"
                label={t("comment")}
                placeholder="ENTER YOUR COMMENT"
                className="pa-comment"
                multiline
                minRows={1}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{ maxLength: 250 }}
              />
            </Grid>
          </TabPanel>
          {parentDir ? (
            <TabPanel value={value} index={1} dir={theme.direction}>
              <Grid container justifyContent="center">
                <Grid
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    width: "100%",
                  }}
                >
                  <FormControl style={{ width: "100%" }}>
                    <Autocomplete
                      freeSolo
                      multiple
                      disableCloseOnSelect
                      // forcePopupIcon={true}
                      options={sectionInList}
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? option.deptDisplayName
                          : "";
                      }}
                      value={sectionIn}
                      id="tags-outlined"
                      onChange={(event, newValue) => {
                        handleOnChangeIn(newValue);
                      }}
                      // onInputChange={(event, newInputValue) => {
                      //   !newInputValue.includes("|") &&
                      //     optimizedSectionList(newInputValue);
                      // }}
                      filterSelectedOptions
                      getOptionSelected={(option, value) =>
                        option.id == value.id
                      }
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          style={{ width: "100%" }}
                          variant="outlined"
                          label={t("search_by_directorate")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder={t("enter_directorate")}
                          className={props.theme ? "darkTextField" : ""}
                          helperText={
                            props?.externalList?.length ? t("file_seq") : ""
                          }
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isExtIn ? (
                                  <CircularProgress color="inherit" size={20} />
                                ) : null}
                                {params.InputProps.endAdornment}
                              </>
                            ),
                          }}
                        />
                      )}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>
          ) : <div></div>}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    disableCloseOnSelect
                    // forcePopupIcon={true}
                    options={sectionList}
                    disabled={extAddresses !== ""}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? option.deptDisplayName
                        : "";
                    }}
                    value={section}
                    id="tags-outlined"
                    onChange={(event, newValue) => {
                      handleOnChange(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      !newInputValue.includes("|") &&
                        optimizedSectionList(newInputValue);
                    }}
                    filterSelectedOptions
                    getOptionSelected={(option, value) => option.id == value.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_directorate")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder={t("enter_directorate")}
                        className={props.theme ? "darkTextField" : ""}
                        disabled={extAddresses !== ""}
                        helperText={
                          props?.externalList?.length ? t("file_seq") : ""
                        }
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isExt ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </FormControl>
                {/*
                {alreadyFav ? (
                  <Tooltip title={t("ALREADY FAVOURITE")}>
                    <span>
                      <IconButton color="secondary">
                        <FavoriteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("add_to_favourite")}>
                    <span>
                      <IconButton
                        id="AddToFavourite_button"
                        color="secondary"
                        disabled={addFavBlnDisable}
                        onClick={handleAddToFavourite}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
                */}
              </Grid>
              {/**
               <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    // forcePopupIcon={true}
                    options={sectionFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    getOptionLabel={(option) => {
                      return option.deptDisplayName
                        ? option.deptDisplayName
                        : "";
                    }}
                    value={favSection}
                    onChange={(event, newValue) => {
                      handleOnChangeFavSection(newValue);
                    }}
                    filterSelectedOptions
                    getOptionSelected={(option, value) =>
                      option.deptDisplayName === value.deptDisplayName
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_directorate")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="DeleteFavourite_button"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
              */}
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <TextField
                  variant="outlined"
                  fullWidth
                  label="EXTERNAL ADDRESSES"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{ maxLength: 100 }}
                  placeholder="ENTER EXTERNAL ADDRESSES"
                  className="pa-comment"
                  multiline
                  minRows={1}
                  disabled={!section.length}
                  value={extAddresses}
                  onChange={(e) => setExtAddresses(e.target.value)}
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/**
           <TabPanel value={value} index={2} dir={theme.direction}>
            <Grid container justifyContent="center">
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%" }}>
                  <Autocomplete
                    freeSolo
                    // forcePopupIcon={true}
                    options={serviceList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={service}
                    onChange={(event, newValue) => {
                      handleOnChangeService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      !newInputValue.includes("|") &&
                        optimizedChangeService(newInputValue);
                    }}
                    getOptionDisabled={(option) =>
                      typeof service == "string"
                        ? false
                        : option?.deptRole[0]?.displayRoleName ===
                          service?.deptRole[0]?.displayRoleName
                    }
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        placeholder={t("enter_service_number")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                {alreadyFav ? (
                  <Tooltip title={t("ALREADY FAVOURITE")}>
                    <span>
                      <IconButton color="secondary">
                        <FavoriteIcon />
                      </IconButton>
                    </span>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("add_to_favourite")}>
                    <span>
                      <IconButton
                        id="inbox_addFav_button"
                        color="secondary"
                        disabled={addFavBlnDisable}
                        onClick={handleAddToFavourite}
                      >
                        <FavoriteBorder />
                      </IconButton>
                    </span>
                  </Tooltip>
                )}
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 3rem",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    // forcePopupIcon={true}
                    options={serviceFavouriteList.map((option) => option)}
                    id="tags-outlined"
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                        : "";
                    }}
                    value={favService}
                    onChange={(event, newValue) => {
                      handleOnChangeFavService(newValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("search_favourite")}
                        placeholder={t("enter_service_number")}
                        className={props.theme ? "darkTextField" : ""}
                      />
                    )}
                  />
                </FormControl>
                <Tooltip
                  title={t("delete_favourite")}
                  style={{ marginTop: "1rem" }}
                >
                  <span>
                    <IconButton
                      id="inbox_delFav_button"
                      color="secondary"
                      disabled={deleteFavBlnDisable}
                      onClick={handleDeleteFavourite}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </span>
                </Tooltip>
              </Grid>
            </Grid>
          </TabPanel>
          */}
        </SwipeableViews>
        {/* {!props.isPa && (
          <FormControl
            style={{
              paddingLeft: "4px",
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
            }}
          >
            <h6>PRIORITY:</h6>
            <Box className={classes.priority_box}>
              <Tooltip title={t("low")}>
                <IconButton
                  className={classes.priority_btn}
                  onClick={() => handlePriority("low")}
                  style={{
                    background:
                      priority == "low" ? "rgb(53 76 100 / 39%)" : "none",
                  }}
                >
                  <FcLowPriority />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("medium")}>
                <IconButton className={classes.priority_btn} onClick={() => handlePriority("medium")} style={{
                  background: priority == "medium" ? "#354c6491" : "none"
                }}>
                  <FcMediumPriority />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("high")}>
                <IconButton
                  className={classes.priority_btn}
                  onClick={() => handlePriority("high")}
                  style={{
                    background:
                      priority == "high" ? "rgb(53 76 100 / 39%)" : "none",
                  }}
                >
                  <FcHighPriority />
                </IconButton>
              </Tooltip>
            </Box>
          </FormControl>
        )} */}
      </DialogContent>
      <DialogActions>
        {/*
        <Button
        id="hrm_add_remark_button"
        variant="contained"
        color="primary"
        disabled={handleDisableRemark()}
        onClick={() => setaddRemark(true)}
        endIcon={<RateReviewOutlined />}
      >
        {t("Add Remark")}
      </Button>
      */}

        {/*
        <Button
        id="inbox_end_task_button"
        variant="contained"
        color="primary"
        style={{
          display: `${Dept === hrmDepartmet ? "" : "none"}`,
        }}
        onClick={() =>
          props.serviceLetterId
            ? setPaFlowDialog(true)
            : setOpenConfirmation(true)
        }
        endIcon={<MailOutlineIcon />}
      >
        {t("end_task")}
      </Button>

      <Button
        id="send_to_next_level_button"
        variant="contained"
        color="secondary"
        style={{
          display: `${hasCoverNote === "true" ? "" : "none"}`,
        }}
        disabled={blnNextDisable}
        onClick={() => setSelectFileDialog(true)}
        endIcon={<MailOutlineIcon />}
      >
        {t("send_to_next_level")}
      </Button>
      */}

        <Button
          id="inbox_HrmDialog_send_button"
          variant="contained"
          color="secondary"
          onClick={() => handleSend(false)}
          disabled={handleSendButton()}
          endIcon={<SendIcon />}
        >
          {t("send")}
        </Button>
      </DialogActions>

      <Dialog
        open={openConfirmation}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenConfirmation(false);
          }
        }}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle className="send_dialog">
          {t("confirmation")}?
          <Tooltip title={t("close")}>
            <IconButton
              id="inbox_HrmDialog_close_button"
              aria-label="close"
              onClick={() => setOpenConfirmation(false)}
              color="primary"
              style={{ float: "right", padding: "5px !important" }}
            >
              <CancelIcon style={{ color: props.theme ? "#fff" : "#484747" }} />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText
            id="alert-dialog-description"
            style={{ color: props.theme ? "#fff" : "black" }}
          >
            {props.status === "Approved" || props.status === "Rejected" ? (
              <p>
                Update status to applicant <br />
                status = <strong>{props.status}</strong>
              </p>
            ) : (
              <p>
                {t("confirmation_text")} <br />
                {t("confirmation_text_2")}
              </p>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {props.status === "Approved" || props.status === "Rejected" ? (
            <Button
              id="inbox_fileStatus_done_button"
              variant="contained"
              endIcon={<Done />}
              color="secondary"
              onClick={() => handleSendConfirmation(props.status)}
            >
              SUBMIT
            </Button>
          ) : (
            <>
              <FormControl component="fieldset">
                <RadioGroup
                  row
                  value={endTask}
                  onChange={(e) => setEndTask(e.target.value)}
                >
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    label={t("rejectConfirmation")}
                    value="Rejected"
                  />
                  <FormControlLabel
                    control={<Radio color="primary" />}
                    label={t("approveConfirmation")}
                    value="Approved"
                  />
                </RadioGroup>
              </FormControl>
              <Button
                id="inbox_fileStatus_done_button"
                variant="contained"
                endIcon={<Done />}
                color="secondary"
                disabled={!endTask}
                onClick={handleEnd}
              >
                SUBMIT
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>

      <Dialog
        open={selectFileDialog}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setSelectFileDialog(false);
          }
        }}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle
          style={{
            cursor: "move",
          }}
          id="draggable-dialog-title"
        >
          <span>{t("select_file")}</span>
          <IconButton
            id="inbox_fileDialog_close_button"
            aria-label="close"
            onClick={() => setSelectFileDialog(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CancelIcon />
          </IconButton>
        </DialogTitle>
        <SelectFile
          enclosureArr={props.enclosureArr}
          handleSend={handleSend}
          loading={loading}
          fileId={props.fileId}
        />
      </Dialog>

      <Dialog
        open={paFlowDialog}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setPaFlowDialog(false);
          }
        }}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        style={{ minWidth: "300px" }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("Select File")}
          <IconButton
            id="PAFlowDialog_close_button"
            aria-label="close"
            onClick={() => setPaFlowDialog(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CancelIcon style={{ color: "#484747" }} />
          </IconButton>
        </DialogTitle>
        <PaFlowDialog
          enclosureArr={props.enclosureArr}
          closeDialog={() => setPaFlowDialog(false)}
          handleSend={handleSend}
          setSection={setSection}
          inboxId={inboxid}
          pfileName={props.pfileName}
          approveRejectMessage={approveRejectMessage}
          fileId={props.fileId}
        />
      </Dialog>

      <Dialog
        open={addRemark}
        fullWidth
        maxWidth="xs"
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setaddRemark(false);
          }
        }}
      >
        <DialogTitle className="send_dialog">
          {t("WRITE INTERNAL REMARK")}
          <Tooltip title={t("close")}>
            <IconButton
              id="remark-close-button"
              aria-label="close"
              onClick={() => {
                setaddRemark(false);
              }}
              color="primary"
            >
              <CancelIcon style={{ color: "#484747" }} />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            id="remark"
            error={
              formik.touched.remark ? Boolean(formik.errors.remark) : false
            }
            name="remark"
            label={t("remark")}
            value={formik.values.remark}
            onChange={formik.handleChange}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{ maxLength: 250 }}
            multiline
            minRows={10}
            variant="outlined"
          />
          <div style={{ fontSize: "small", color: "red", textAlign: "start" }}>
            {formik.touched.remark && Boolean(formik.errors.remark)
              ? formik.errors.remark
              : ""}
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            id="remark_add_done_button"
            variant="contained"
            color="secondary"
            endIcon={<Add />}
            onClick={() => setaddRemark(false)}
          >
            ADD
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
    subscribe: state.subscribeApi,
  };
}

export default connect(mapStateToProps, {
  sendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  sendFilesSection,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  changingTableStateInbox,
  getGroupListIn,
})(HrmDialog);

// NOTE:::::

// working with formik never make handler function as arrow function as formik handler function does not work well with arrow function so always use simple js function

// In mui autocomplete sometimes there exist a case when the option present is different than the actual value you want to put in input tag in this case use combination of renderOption and getOptionLabel props
