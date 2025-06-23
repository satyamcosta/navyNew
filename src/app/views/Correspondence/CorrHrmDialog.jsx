import {
  DialogActions,
  DialogContent,
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
  Card,
  CardHeader,
  CardContent,
  CircularProgress,
  MenuItem,
} from "@material-ui/core";
import { makeStyles, useTheme } from "@material-ui/styles";
import React, { useCallback, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Autocomplete } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import { changingTableStateInbox } from "../../camunda_redux/redux/action/apiTriggers";
import {
  sendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getGroupListIn,
  getSection,
  getServiceNumber,
  rtisendFiles,
  sendInternalCorespondence,
  sendEyesonlyCorespondence,
  sendExternalCorespondence,
  sendExternalInCorespondence,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  sendbackRti,
  PCFileClosuerRti,
} from "../../camunda_redux/redux/action";
import { sendAsDraft } from "app/camunda_redux/redux/action/backend-rest/form-data";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Loading } from "./therme-source/material-ui/loading";
import { debounce } from "utils";
import { Add } from "@material-ui/icons";
import { useFormik } from "formik";
import * as Yup from "yup";
import { CorrContext } from "../inbox/shared/CorrespondenceView/Worker";

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
}));

let data = ["item1", "item2", "item3"];

const CorrHrmDialog = (props) => {

  const favObj = useSelector((state) => state.fav)

  const corrContext = useContext(CorrContext);

  console.log("he", corrContext);

  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const hrmRole = Cookies.get("HrmRole");
  let hasCoverNote = Cookies.get("hasCoverNote");
  let creater = Cookies.get("creater");
  let Rtistatus = Cookies.get("status");
  const sessionRole = sessionStorage.getItem("role");
  const inboxid = sessionStorage.getItem("InboxID");
  const parentDir = Boolean(sessionStorage.getItem("parent-dir"));

  const [role, setRole] = useState("");
  const [value, setValue] = useState(0);

  // Send Internal
  const [intService, setIntService] = useState([]);
  const [intServiceList, setIntServiceList] = useState([]);
  const [intInfoTo, setIntInfoTo] = useState([]);
  const [intInfoToList, setIntInfoToList] = useState([]);
  const [intServiceObj, setIntServiceObj] = useState([]);
  const [favIntService, setFavIntService] = useState("");
  const [intServiceFavouriteList, setIntServiceFavouriteList] = useState([]);
  const [favIntServiceDepName, setFavIntServiceDepName] = useState("");
  const [favIntServiceObj, setFavIntServicObj] = useState([]);
  // Send External
  const [section, setSection] = useState([]);
  const [sectionCopy, setSectionCopy] = useState([]);
  const [sectionInfo, setSectionInfo] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [secCopyList, setSecCopyList] = useState([]);
  const [secInfoList, setSecInfoList] = useState([]);
  const [sectionObj, setSectionObj] = useState([]);
  const [favSection, setFavSection] = useState("");
  const [sectionFavouriteList, setSectionFavouriteList] = useState([]);
  const [favSectionObj, setFavSectionObj] = useState([]);

  // Send Within External
  const [sectionIn, setSectionIn] = useState([]);
  const [sectionInList, setSectionInList] = useState([]);

  // Send Eyes Only
  const [service, setService] = useState([]);
  const [serviceCopy, setServiceCopy] = useState([]);
  const [serviceInfo, setServiceInfo] = useState([]);
  const [serviceList, setServiceList] = useState([]);
  const [serCopyList, setSerCopyList] = useState([]);
  const [serInfoList, setSerInfoList] = useState([]);
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
  // const [openCoverLetterDialog, setOpenCoverLetterDialog] = useState(false);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectFileDialog, setSelectFileDialog] = useState(false);
  const [paFlowDialog, setPaFlowDialog] = useState(false);
  // const username = sessionStorage.getItem("username");
  const username = localStorage.getItem("username");
  const displayUserName = sessionStorage.getItem("displayUserName");
  const FileID = Cookies.get("partcaseId");
  let isRegister = Cookies.get("isRegister");
  let status = Cookies.get("status");
  // let corrDocId = Cookies.get("props.corrDocId");
  const [list, setList] = useState([]);

  const [addRemark, setaddRemark] = useState(false); // toggle add remark dialog
  const [externalAdd, setExternalAdd] = useState("");
  const [instMessage, setInstMessage] = useState("");

  const [sentCount, setsentCount] = useState(0); // to know whether all daks has been sent or not

  // To show loading while fetching in autocomplete
  const [isInt, setIsInt] = useState(false);
  const [isIntInfo, setIsIntInfo] = useState(false);
  const [isExt, setIsExt] = useState(false);
  const [isExtInfo, setIsExtInfo] = useState(false);
  const [isExtCopy, setIsExtCopy] = useState(false);
  const [isExtIn, setIsExtIn] = useState(false);

  // Fav Select State
  const [groupList, setGroupList] = useState([])
  const [group, setGroup] = useState("")

  const validationSchema = Yup.object({
    remark: Yup.string(t("enter_a_remark"))
      .trim()
      .required(t("must_enter_a_valid_remark")),
  });

  const initialValue = {
    remark: "",
  };

  const formik = useFormik({
    initialValues: initialValue,
    validationSchema: validationSchema,
    // onSubmit: handleAddRemark,
  });

  const { corrId, corrDocId } = props;
  const dispatch = useDispatch();

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const callMessageSuccess = (msg) => {
    dispatch(setSnackbar(true, "success", t(msg)));
  };

  const fetchFavourite = async () => {
    await props
      .fetchFavouriteList(sessionRole)
      .then((resp) => {
        const { internalServiceFavourite, sectionFavourite, serviceFavourite } =
          resp.favourite;
        setSectionFavouriteList(sectionFavourite);
        setServiceFavouriteList(serviceFavourite);
        setIntServiceFavouriteList(internalServiceFavourite);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // useEffect(() => {
  //   fetchFavourite();
  // }, []);

  useEffect(() => {
    if (favObj?.favList) {
      setGroupList(favObj?.favList)
    }
  }, [favObj])

  useEffect(() => {
    handleInputValueChangeIn();
  }, []);

  useEffect(() => {
    if (typeof corrContext?.seqArr == "object") {
      // setIntServiceList(corrContext?.seqArr);
    }
  }, [corrContext?.seqArr]);

  useEffect(() => {
    const { blnValueInbox } = props.subscribe;
    if (
      props?.checkedData?.length &&
      sentCount === props?.checkedData?.length
    ) {
      callMessageSuccess(t("corr_sent_successfully"));
      props.changingTableStateInbox(!blnValueInbox, "CHANGE_INBOX");
      props.reset();
      props.handleCloseEvent();
      setLoading(false);
    } else if (sentCount == "trigger" && props?.checkedData?.length) {
      props.changingTableStateInbox(true, "CHANGE_INBOX");
      callMessageOut("An Error Occured While Sending The Dak");
      setLoading(false);
    }
  }, [sentCount, props?.checkedData]);

  useEffect(() => {
    console.log("these ae intinfo", intInfoTo)

    if (
      service.length ||
      section.length ||
      intService.length ||
      favSection.length ||
      favService.length ||
      favIntService.length ||
      sectionIn.length ||
      intInfoTo.length

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
  }, [
    section,
    service,
    intService,
    favIntService,
    favSection,
    favService,
    sectionIn,
    intInfoTo
  ]);

  useEffect(() => {
    if (
      props.seqArr ||
      props.deptTo ||
      props.deptCc ||
      props.deptInfo ||
      props.deptWithin
    ) {
      setIntService(props.seqArr);
      setSection(props.deptTo);
      setSectionCopy(props.deptCc);
      setSectionInfo(props.deptInfo);
      setSectionIn(props.deptWithin);
    }
  }, [
    props.seqArr,
    props.deptTo,
    props.deptCc,
    props.deptInfo,
    props.deptWithin,
  ]);

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
          setService([]),
          // setIntService([]),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "internal_service":
        return (
          // setSection([]),
          setService([]),
          setFavService(""),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_service":
        return (
          setSection([]),
          setIntService([]),
          setService([]),
          setFavSection(""),
          setFavIntService("")
        );
      case "fav_section":
        return (
          setSection([]),
          setIntService([]),
          setFavService(""),
          setService([]),
          setFavIntService("")
        );
      case "fav_internal_service":
        return (
          setSection([]),
          setIntService([]),
          setFavService(""),
          setFavSection(""),
          setService([])
        );
      default:
        break;
    }
  };

  const handleDisableRemark = () => {
    if (value == 1) {
      return true;
    } else {
      return false;
    }
  };

  const handleInputValueChangeInternalService = async (newValue, type) => {
    if (newValue && newValue.length >= 2) {
      const dept = sessionStorage.getItem("department");

      if (type == "internal-to") {
        setIsInt(true);
      } else {
        setIsIntInfo(true);
      }

      props.getInternalServiceNumber(newValue, dept).then((resp) => {
        try {
          if (resp.error) {
            setIsInt(false);
            setIsIntInfo(false);
            return;
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

            switch (type) {
              case "internal-to":
                setIntServiceObj(tmpArray);
                setIntServiceList(tmpArray);
                setIsInt(false);
                break;

              case "internal-info":
                setIntInfoToList(tmpArray);
                setIsIntInfo(false);
              default:
                break;
            }
          }
        } catch (error) {
          setIsInt(false);
          setIsIntInfo(false);
        }
      });
      setSectionList([]);
      setServiceList([]);
    }
  };

  const handleOnChangeInternalService = async (val, type) => {
    switch (type) {
      case "internal-to":
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
            setIntService(val);
          }
        }
        break;
      case "internal-info":
        if (val.length == 0) {
          setIntInfoTo(val);
        } else {
          const newVal = val[val.length - 1];
          console.log(newVal);
          if (newVal && typeof newVal === "object" && ("id" in newVal || "displayRoleName" in newVal)) {
            setIntInfoTo(val);
          }
        }
        break;
      default:
        break;
    }
    val && handleClearList("internal_service");
  };

  const handleOnChangeFavInternalService = async (value) => {
    setFavIntService(value);
    handleClearList("fav_internal_service");
    const dept = sessionStorage.getItem("department");
    await props
      .getInternalServiceNumber(value, dept)
      .then((resp) => {
        setFavIntServicObj(resp.data);
        const data =
          resp.data && resp.data.find((ele) => ele.deptUsername === value);
        setFavIntServiceDepName(data.deptName);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleInputValueChange = async (newValue, type) => {
    if (newValue && newValue.length >= 2) {
      let formData = new FormData();
      formData.append("sau", newValue);

      if (type == "section-to") {
        setIsExt(true);
      } else if (type == "section-copy") {
        setIsExtCopy(true);
      } else {
        setIsExtInfo(true);
      }

      props.getGroupList(formData).then((resp) => {
        try {
          if (resp.error) {
            setIsExt(false);
            setIsExtInfo(false);
            setIsExtCopy(false);
            return;
          } else {
            switch (type) {
              case "section-to":
                setSectionObj(resp.data);
                setSectionList(resp.data);
                setIsExt(false);
                break;
              case "section-copy":
                setSecCopyList(resp.data);
                setIsExtCopy(false);
                break;
              case "section-info":
                setSecInfoList(resp.data);
                setIsExtInfo(false);
                break;
            }
          }
        } catch (error) {
          setIsExt(false);
          setIsExtInfo(false);
          setIsExtCopy(false);
        }
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

  const handleOnChange = (val, type) => {
    // let tmpArr = newValue.map((item, i) => {
    //   return {
    //     ...item,
    //     branch: item.branch[0],
    //   };
    // });
    switch (type) {
      case "section-to":
        if (val.length == 0) {
          setSection(val);
        } else {
          const newVal = val[val.length - 1];
          console.log(newVal);
          if (newVal && typeof newVal === "object" && "id" in newVal) {
            setSection(val);
          }
        }
        break;
      case "section-copy":
        if (val.length == 0) {
          setSectionCopy(val);
        } else {
          const newVal = val[val.length - 1];
          console.log(newVal);
          if (newVal && typeof newVal === "object" && "id" in newVal) {
            setSectionCopy(val);
          }
        }
        break;
      case "section-info":
        if (val.length == 0) {
          setSectionInfo(val);
        } else {
          const newVal = val[val.length - 1];
          console.log(newVal);
          if (newVal && typeof newVal === "object" && "id" in newVal) {
            setSectionInfo(val);
          }
        }
        break;
    }
    val && val.length > 0 && handleClearList("section");
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

  const handleOnChangeFavSection = async (value) => {
    setFavSection(value);
    handleClearList("fav_section");
    let formData = new FormData();
    formData.append("sau", value);
    await props.getGroupList(formData).then((resp) => {
      try {
        setFavSectionObj([...favSectionObj, resp.data]);
        // let data =
        //   resp.data && resp.data.find((ele) => ele.deptDisplayName === value);
        // setRole(data.deptCoordRole);
        let tmpArray = [];
        for (var i = 0; i < resp.data.length; i++) {
          tmpArray.push(`${resp.data[i].deptDisplayName}`);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
    });
    setServiceFavouriteList([]);
  };

  const handleInputValueChangeService = async (newValue, type) => {
    if (newValue && newValue.length >= 2) {
      await props.getServiceNumber(newValue).then((resp) => {
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
        switch (type) {
          case "service-to":
            setServiceObj(tmpArray);
            setServiceList(tmpArray);
            break;
          case "service-copy":
            setSerCopyList(tmpArray);
            break;
          case "service-info":
            setSerInfoList(tmpArray);
            break;
        }
      });
      setSectionList([]);
      setIntServiceList([]);
    }
  };

  const handleOnChangeService = (newValue, type) => {
    switch (type) {
      case "service-to":
        setService(newValue);
        break;
      case "service-copy":
        setServiceCopy(newValue);
        break;
      case "service-info":
        setServiceInfo(newValue);
        break;
    }
    newValue && newValue.length > 0 && handleClearList("service");
  };

  const handleOnChangeFavService = async (value) => {
    setFavService(value);
    handleClearList("fav_service");
    await props
      .getServiceNumber(value)
      .then((resp) => {
        setFavServiceObj(resp.data);
        let data =
          resp.data && resp.data.find((ele) => ele.deptUsername === value);
        setFavServiceDepName(data.deptName);
        setRole(data.deptCoordRole);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddToFavourite = async () => {
    let data = section
      ? section
      : service
        ? service
        : intService
          ? intService
          : "";
    let type = section
      ? "section"
      : service
        ? "service"
        : intService
          ? "internalService"
          : "";
    await props
      .addToFavourite(data, sessionRole, type)
      .then((resp) => {
        fetchFavourite();
        dispatch(
          setSnackbar(true, "success", "Add to favourite list successfully")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteFavourite = () => {
    let data = favSection
      ? favSection
      : favService
        ? favService
        : favIntService
          ? favIntService
          : "";
    let type = favSection
      ? "section"
      : favService
        ? "service"
        : favIntService
          ? "internalService"
          : "";
    props
      .deleteFavourite(data, sessionRole, type)
      .then((resp) => {
        fetchFavourite();
        setFavSection("");
        setFavService("");
        setFavIntService("");
        dispatch(
          setSnackbar(true, "success", "Delete to favourite list successfully")
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const backRti = () => {
    setLoading(true);
    props
      .sendbackRti(FileID, username)
      .then((resp) => {
        // setLoading(false);
        // history.push({ pathname: "/eoffice/inbox/file" });
        // dispatch(setSnackbar(true, "success", `${t("file_has_been_sended_successfully")}`));

        try {
          if (resp.error) {
            setLoading(false);
            dispatch(setSnackbar(true, "error", resp.error));
            return;
          } else {
            setLoading(false);

            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_sended_successfully")}`
              )
            );
            return;
          }
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.message));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSend = (val) => {
    const inboxids = props?.checkedData;

    if (inboxids?.length) {
      inboxids.forEach((inbox) => {
        handleSendType(val, inbox?.id, true);
      });
    } else if (props.fileId) {
      handleSendType(val, props.fileId);
    }
  };

  const handleSendType = (val, fileId, multiple) => {
    setLoading(true);
    const inboxId = sessionStorage.getItem("InboxID");
    const fromRole = sessionStorage.getItem("role");

    const { remark } = formik.values;

    if (service.length > 0) {
      const body1 = service.map((item, i) => item.deptRole[0]);
      const body2 = serviceCopy.map((item, i) => item.deptRole[0]);
      const body3 = serviceInfo.map((item, i) => item.deptRole[0]);
      props
        .sendEyesonlyCorespondence(
          fileId,
          body1,
          body2,
          body3,
          val,
          props.pfileName
        )
        .then((resp) => {
          callMessageSuccess(t("corr_sent_successfully"));
          props.handleStatus(fileId);
          props.handleCloseEvent();
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
    } else if (intService.length > 0 || intInfoTo.length > 0) {
      const body = intService.map((item, i) => {
        if (item?.displayRoleName) {
          return item;
        } else {
          return item.deptRole[0];
        }
      });
      const body2 = intInfoTo.map((item, i) => {
        if (item?.displayRoleName) {
          return item;
        } else {
          return item.deptRole[0];
        }
      });
      props
        .sendInternalCorespondence(
          fileId,
          body,
          body2,
          section,
          sectionCopy,
          sectionInfo,
          sectionIn,
          val,
          props.pfileName,
          remark
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setsentCount("trigger");
              setLoading(false);
              reload();
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess(t("corr_sent_successfully"));
                props.handleStatus(fileId);
                props.handleCloseEvent();
                setLoading(false);
              }
            }
          } catch (error) {
            callMessageOut(error.message);
            reload();
          }
        }).catch,
        (error) => {
          console.log(error);
          setLoading(false);
          setsentCount("trigger");
          reload();
        };
    } else if (section.length > 0) {
      props
        .sendExternalCorespondence(
          fileId,
          section,
          sectionCopy,
          sectionInfo,
          externalAdd,
          instMessage.trim(),
          remark,
          [],
          []
        )
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setsentCount("trigger");
              setLoading(false);
              reload();
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess(t("corr_sent_successfully"));
                props.handleStatus(fileId);
                props.handleCloseEvent();
                setLoading(false);
              }
            }
          } catch (error) {
            callMessageOut(error.message);
            reload();
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          reload();
        });
    } else if (sectionIn.length > 0) {
      props
        .sendExternalInCorespondence(fileId, sectionIn, remark)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setsentCount("trigger");
              setLoading(false);
              reload();
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess(t("corr_sent_successfully"));
                props.handleStatus(fileId);
                props.handleCloseEvent();
                setLoading(false);
              }
              console.log(resp);
            }
          } catch (error) {
            callMessageOut(error.message);
            reload();
          }
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
          reload();
        });
    } else if (favService.length > 0) {
      const favData = {
        groupName: favServiceDepName,
        roleName: favServiceObj[0].deptRole,
        userName: favService,
        fromRole: fromRole,
        displayDeptName: favServiceObj[0].deptDisplayName,
        displayRoleName: favServiceObj[0].deptRoleDisplayName,
      };
      props
        .sendEyesonlyCorespondence(inboxId, favData, val, props.pfileName, body)
        .then((resp) => {
          setRole("");
          callMessageSuccess();

          props.handleClose();
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (favIntService.length > 0) {
      const intServiceNumberData = {
        groupName: favIntServiceDepName,
        roleName: favIntServiceObj[0].deptRole,
        userName: favIntService,
        fromRole: fromRole,
        displayDeptName: favIntServiceObj[0].deptDisplayName,
        displayRoleName: favIntServiceObj[0].deptRoleDisplayName,
      };

      props
        .sendInternalCorespondence(
          //   props.fileId,
          corrDocId,
          intServiceNumberData,
          val,
          props.pfileName
          // body
        )
        .then((resp) => {
          setRole("");
          callMessageSuccess();

          props.handleClose();
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const reload = () => {
    if (props.checkedData) {
      props.reload();
    }
  };

  const state = useSelector((state) => state.rtiReducer);

  const approveRejectMessage = (msg) => {
    dispatch(setSnackbar(true, "success", msg));
  };

  const handleSendConfirmation = (value) => {
    setLoad(true);
    setOpenConfirmation(false);

    const inboxId = sessionStorage.getItem("InboxID");
    if (value != null) {
      setLoad(true);
      props.PCFileClosuerRti(FileID, value).then((resp) => {
        // setLoad(false)
        // dispatch(setSnackbar(true, "success", `${t("file_has_been_merged_successfully")}`));

        // history.push({ pathname: "/eoffice/inbox/file" });
        try {
          if (resp.Error) {
            setLoad(false);

            dispatch(setSnackbar(true, "error", resp.Error));
          } else {
            setLoad(false);

            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_merged_successfully")}`
              )
            );
          }
        } catch (error) {
          dispatch(setSnackbar(true, "error", error.message));
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

  // Optimized call
  const optimizedInternalService = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );

  const optimizedSection = useCallback(debounce(handleInputValueChange), []);

  // const optimizedSectionIn = useCallback(
  //   debounce(handleInputValueChangeIn),
  //   []
  // );

  const optimizedService = useCallback(
    debounce(handleInputValueChangeService),
    []
  );

  const handleSuccess = () => {
    dispatch(
      setSnackbar(true, "success", t("correspondence_sent_successfully!"))
    );
    setLoading(false);
    props.handleCloseEvent(false);
    props.handleStatus(props.fileId);
    let trigger = false;
    setTimeout(() => {
      trigger = true;
      props.changingTableState(trigger, "CHANGE_PA_FILE");
      props.changingTableStatePA(trigger, "CHANGE_PA_APPLICATION");
      props.changeTableStateDraft(trigger, "CHANGE_PA_DRAFT");
    }, 0);
  };

  const handleChangeGroup = (val) => {
    setGroup(val)
    setIntService(val?.roles)
    setIntInfoTo(val?.roles)
  }

  return (
    <>
      {loading && <Loading />}
      <DialogContent dividers>
        {/**<Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label={t("internal")} {...a11yProps(0)} />
          <Tab
          
            label={t("external")}
            {...a11yProps(1)}
          />
          
        </Tabs>}
        
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container justifyContent="center" style={{ hight: "500px" }}>
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
                    options={intServiceList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                        : "";
                    }}
                    id="tags-outlined"
                    value={intService}
                    onChange={(event, newValue) => {
                      handleOnChangeInternalService(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedInternalService(newInputValue);
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        style={{ width: "100%" }}
                        variant="outlined"
                        label={t("search_by_service_number")}
                        placeholder={t("enter_service_number")}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container justifyContent="center" style={{ hight: "500px" }}>
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
                    id="tags-outlined"
                    options={sectionList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? option.deptDisplayName
                        : "";
                    }}
                    value={section}
                    onChange={(event, newValue) => {
                      handleOnChange(newValue, "section-to");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedSection(newInputValue, "section-to");
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("SEND TO")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    id="tags-outlined"
                    options={secCopyList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? option.deptDisplayName
                        : "";
                    }}
                    value={sectionCopy}
                    onChange={(event, newValue) => {
                      handleOnChange(newValue, "section-copy");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedSection(newInputValue, "section-copy");
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("COPY TO")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    id="tags-outlined"
                    options={secInfoList}
                    getOptionLabel={(option) => {
                      return typeof option === "object"
                        ? option.deptDisplayName
                        : "";
                    }}
                    value={sectionInfo}
                    onChange={(event, newValue) => {
                      handleOnChange(newValue, "section-info");
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedSection(newInputValue, "section-info");
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        label={t("INFO")}
                        placeholder={t("enter_section")}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <TextField
                    label={t("Non eoffice Users (Not Part Of This System)")}
                    variant="outlined"
                    size="small"
                    maxRows={2}
                    fullWidth
                    placeholder={t("Indicate Addreses Separated By Commas")}
                    value={externalAdd}
                    onChange={(e) => setExternalAdd(e.target.value)}
                  />
                </FormControl>
              </Grid>
              {externalAdd?.trim() && (
                <Grid
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    width: "100%",
                  }}
                >
                  <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                    <TextField
                      label={t("Instruction For Mail Room User")}
                      variant="outlined"
                      minRows={5}
                      size="medium"
                      fullWidth
                      placeholder={t("Instructions")}
                      value={instMessage}
                      onChange={(e) => setInstMessage(e.target.value)}
                    />
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </TabPanel>

            </SwipeableViews> */}

        <Grid container justifyContent="space-around" alignItems="stretch" style={{
          gap: "1.5rem"
        }}>
          <Card
            elevation={10}
            style={{
              flex: 1,
            }}
          >
            <CardHeader
              title={t("internal")}
              style={{
                background: "rgb(20, 70, 107)",
                color: "white",
                padding: "3px 8px",
                borderRadius: "6px 6px 0px 0px",
              }}
            />

            <CardContent>
              <Grid item>

                {
                  groupList?.length != 0 && (
                    <Grid
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        width: "100%",
                      }}
                    >
                      <TextField
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
                      </TextField>
                    </Grid>
                  )
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
                        handleOnChangeInternalService(newValue, "internal-to");
                      }}
                      onInputChange={(event, newInputValue) => {
                        optimizedInternalService(newInputValue, "internal-to");
                      }}
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
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          style={{ width: "100%" }}
                          variant="outlined"
                          className={props.theme ? "darkTextField" : ""}
                          label={t("send_to_int")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder={t("enter_service_number")}
                          helperText={props?.seqArr?.length ? t("dak_seq") : ""}
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
                </Grid>
              </Grid>
              {/* gheydugeud */}
              <Grid
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  width: "100%",
                }}
              >
                <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                  <Autocomplete
                    freeSolo
                    multiple
                    disableCloseOnSelect
                    id="tags-outlined"
                    options={intInfoToList}
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
                    value={intInfoTo}
                    onChange={(event, newValue) => {
                      handleOnChangeInternalService(
                        newValue,
                        "internal-info"
                      );
                    }}
                    onInputChange={(event, newInputValue) => {
                      optimizedInternalService(
                        newInputValue,
                        "internal-info"
                      );
                    }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        variant="outlined"
                        className={props.theme ? "darkTextField" : ""}
                        label={t("info")}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        placeholder={t("enter_service_number")}
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <>
                              {isIntInfo ? (
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

            </CardContent>
          </Card>
          {/**
          <div className="corr-dialog-or">
          <span></span>
          <span>OR</span>
        </div>
        */}
          {parentDir && (
            <Card
              elevation={10}
              style={{
                flex: 1,
              }}
            >
              <CardHeader
                title={t("external_in")}
                style={{
                  background: "rgb(20, 70, 107)",
                  color: "white",
                  padding: "3px 8px",
                  borderRadius: "6px 6px 0px 0px",
                }}
              />
              <CardContent>
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
                      id="tags-outlined"
                      options={sectionInList}
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? option.deptDisplayName
                          : "";
                      }}
                      value={sectionIn}
                      onChange={(event, newValue) => {
                        handleOnChangeIn(newValue);
                      }}
                      // onInputChange={(event, newInputValue) => {
                      //   optimizedSectionIn(newInputValue);
                      // }}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className={props.theme ? "darkTextField" : ""}
                          label={t("send_to")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder={t("enter_section")}
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
              </CardContent>
            </Card>
          )}
          {props?.signed && (
            <Card
              elevation={10}
              style={{
                flex: 1,
              }}
            >
              <CardHeader
                title={t("external")}
                style={{
                  background: "rgb(20, 70, 107)",
                  color: "white",
                  padding: "3px 8px",
                  borderRadius: "6px 6px 0px 0px",
                }}
              />
              <CardContent>
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
                      id="tags-outlined"
                      options={sectionList}
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? option.deptDisplayName
                          : "";
                      }}
                      value={section}
                      onChange={(event, newValue) => {
                        handleOnChange(newValue, "section-to");
                      }}
                      onInputChange={(event, newInputValue) => {
                        optimizedSection(newInputValue, "section-to");
                      }}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className={props.theme ? "darkTextField" : ""}
                          label={t("send_to")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder={t("enter_section")}
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
                </Grid>
                <Grid
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    width: "100%",
                  }}
                >
                  <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                    <Autocomplete
                      freeSolo
                      multiple
                      disableCloseOnSelect
                      id="tags-outlined"
                      options={secCopyList}
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? option.deptDisplayName
                          : "";
                      }}
                      value={sectionCopy}
                      onChange={(event, newValue) => {
                        handleOnChange(newValue, "section-copy");
                      }}
                      onInputChange={(event, newInputValue) => {
                        optimizedSection(newInputValue, "section-copy");
                      }}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className={props.theme ? "darkTextField" : ""}
                          label={t("copy_to")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder={t("enter_section")}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isExtCopy ? (
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
                {/* <Grid
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    width: "100%",
                  }}
                >
                  <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                    <Autocomplete
                      freeSolo
                      multiple
                      id="tags-outlined"
                      options={secInfoList}
                      getOptionLabel={(option) => {
                        return typeof option === "object"
                          ? option.deptDisplayName
                          : "";
                      }}
                      value={sectionInfo}
                      onChange={(event, newValue) => {
                        handleOnChange(newValue, "section-info");
                      }}
                      onInputChange={(event, newInputValue) => {
                        optimizedSection(newInputValue, "section-info");
                      }}
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          className={props.theme ? "darkTextField" : ""}
                          label={t("info")}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          placeholder={t("enter_section")}
                          InputProps={{
                            ...params.InputProps,
                            endAdornment: (
                              <>
                                {isExtInfo ? (
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
                </Grid> */}
                <Grid
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    width: "100%",
                  }}
                >
                  <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                    <TextField
                      label={t("Non_eOffice_Users")}
                      variant="outlined"
                      className={props.theme ? "darkTextField" : ""}
                      size="small"
                      maxRows={2}
                      fullWidth
                      placeholder={t("comma_seperate")}
                      value={externalAdd}
                      onChange={(e) => setExternalAdd(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    // inputProps={{ maxLength: 250 }}
                    />
                  </FormControl>
                </Grid>
                {externalAdd?.trim() && (
                  <Grid
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr",
                      width: "100%",
                    }}
                  >
                    <FormControl style={{ width: "100%", marginTop: "1rem" }}>
                      <TextField
                        label={t("Instruction For Mail Room User")}
                        variant="outlined"
                        minRows={5}
                        size="medium"
                        className={props.theme ? "darkTextField" : ""}
                        fullWidth
                        placeholder={t("Instructions")}
                        value={instMessage}
                        onChange={(e) => setInstMessage(e.target.value)}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      // inputProps={{ maxLength: 250 }}
                      />
                    </FormControl>
                  </Grid>
                )}
              </CardContent>
            </Card>
          )}

          <Card
            elevation={10}
            style={{
              flex: 1,
            }}
          >
            <Grid item>
              <CardHeader
                title={t("remarks")}
                style={{
                  background: "rgb(20, 70, 107)",
                  color: "white",
                  padding: "3px 8px",
                  borderRadius: "6px 6px 0px 0px",
                }}
              />
              <CardContent>
                <TextField
                  fullWidth
                  id="remark"
                  name="remark"
                  label={t("comment")}
                  className={props.theme ? "darkTextField" : ""}
                  value={formik.values.remark}
                  onChange={formik.handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  // inputProps={{ maxLength: 250 }}
                  multiline
                  minRows={10}
                  variant="outlined"
                />
              </CardContent>
            </Grid>
          </Card>
        </Grid>
      </DialogContent>
      <DialogActions>
        {/**
        <Button
        id="hrm_add_remark_button"
        variant="contained"
        color="primary"
        // disabled={handleDisableRemark()}
        onClick={() => setaddRemark(true)}
        endIcon={<RateReviewOutlined />}
      >
        {t("ADD COMMENT")}
      </Button>
      */}
        <Button
          id="RTI_sendFile_button"
          variant="contained"
          color="secondary"
          onClick={() => handleSend(false)}
          disabled={blnDisable}
          endIcon={<SendIcon />}
        >
          {t("send")}
        </Button>
        {/*
        {value == 0 ? (
          <Button
            id="RTI_sendFile_button"
            variant="contained"
            color="primary"
            onClick={() => handleSend(true)}
            disabled={blnDisable}
            endIcon={<SendIcon />}
          >
            {t("send_as_draft")}
          </Button>
        ) : (
          ""
        )}
      */}
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
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          {t("confirmation")}?
          <IconButton
            id="RTI_openConfirmation_close_button"
            aria-label="close"
            onClick={() => setOpenConfirmation(false)}
            color="primary"
            style={{ float: "right", padding: "5px !important" }}
          >
            <CancelIcon style={{ color: "#484747" }} />
          </IconButton>
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
          <FormControl component="fieldset">
            {/* {props.status !== "Approved" ||
                (props.status !== "Rejected" && ( */}
            <RadioGroup row>
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("NO")}
                value="NO"
                onClick={() => setOpenConfirmation(false)}
              />
              <FormControlLabel
                control={<Radio color="primary" />}
                label={t("YES")}
                value="YES"
                onClick={handleSendConfirmation}
              />

              {/* <FormControlLabel
                  control={<Radio color="primary" />}
                  label={t("SEND TO")}
                  disabled={blnDisable}
                  value="Send"
                  onClick={() => handleSend(false)}
                /> */}
            </RadioGroup>
            {/* ))} */}
          </FormControl>
        </DialogActions>
      </Dialog>

      <Dialog
        open={addRemark}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setaddRemark(false);
          }
        }}
      >
        <DialogTitle className="send_dialog">
          <Box className={classes.remark_title}>
            {value ? t("write_ext_comment") : t("write_int_comment")}
            <Tooltip title={t("close")}>
              <IconButton
                id="remark-close-button"
                aria-label="close"
                onClick={() => {
                  setaddRemark(false);
                }}
                color="primary"
              >
                <CancelIcon />
              </IconButton>
            </Tooltip>
          </Box>
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
            className={props.theme ? "darkTextField" : ""}
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
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </>
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
  getGroupListIn,
  getSection,
  getServiceNumber,
  rtisendFiles,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  sendbackRti,
  PCFileClosuerRti,
  sendInternalCorespondence,
  sendEyesonlyCorespondence,
  sendExternalCorespondence,
  sendExternalInCorespondence,
  sendAsDraft,
  changingTableStateInbox,
})(CorrHrmDialog);
