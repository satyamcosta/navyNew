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
  Paper,
  Fab,
  AppBar,
  Typography,
  Chip
} from "@material-ui/core";
import Draggable from "react-draggable";
import { makeStyles, useTheme } from "@material-ui/styles";
import React, { useEffect, useState, useCallback, useRef } from "react";
import { FormikConsumer, useFormik } from "formik";
import SwipeableViews from "react-swipeable-views";
import PropTypes from "prop-types";
import { Autocomplete } from "@material-ui/lab";
import { useTranslation } from "react-i18next";
import SendIcon from "@material-ui/icons/Send";
import DeleteIcon from "@material-ui/icons/Delete";
import FavoriteIcon from "@material-ui/icons/Favorite";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import CancelIcon from "@material-ui/icons/Cancel";
import { FcHighPriority, FcLowPriority } from "react-icons/fc";
import "../index.css";
import {
  sendFilesInternalServiceNumber,
  RtisendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  rtisendFiles,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  sendbackRti,
  assignFurther,
  getEnclosureInfo,
  filesUpload,
  assigneeFileUpload,
} from "app/camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { debounce, handleError } from "utils";
import { CircularProgress } from "@material-ui/core";
import TripleToggleSwitch from "app/views/Personnel/PrioritySwitch/Three";
import ViewListIcon from "@mui/icons-material/ViewList";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import ZoomOutMapIcon from "@mui/icons-material/ZoomOutMap";
import AssignFurtherPreview from "./AssignFurtherFilePreview";
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

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const AssignFurther = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const deptName = sessionStorage.getItem("department");
  const sessionRole = sessionStorage.getItem("role");
  const roleName = sessionStorage.getItem("role");
  const displayRole = sessionStorage.getItem("displayRole");
  const username = localStorage.getItem("username");
  const [role, setRole] = useState("");
  const [eyesOnlyDep, setEyesOnlyDep] = useState(null);
  const [eyesOnlyArr, setEyesOnlyArr] = useState([]);
  const [value, setValue] = useState(0);
  const [intService, setIntService] = useState("");
  const [intServiceList, setIntServiceList] = useState([]);
  const [intServiceObj, setIntServiceObj] = useState([]);
  const [favIntService, setFavIntService] = useState("");
  const [intServiceFavouriteList, setIntServiceFavouriteList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [favIntServiceObj, setFavIntServicObj] = useState([]);
  const [section, setSection] = useState("");
  const [sectionList, setSectionList] = useState([]);
  const [sectionObj, setSectionObj] = useState([]);
  const [favSection, setFavSection] = useState("");
  const [sectionFavouriteList, setSectionFavouriteList] = useState([]);
  const [favSectionObj, setFavSectionObj] = useState([]);
  const [service, setService] = useState("");
  const [serviceList, setServiceList] = useState([]);

  const [favService, setFavService] = useState("");
  const [serviceFavouriteList, setServiceFavouriteList] = useState([]);

  const [blnDisable, setBlnDisable] = useState(true);
  const [blnNextDisable, setBlnNextDisable] = useState(true);
  const [sameDep, setSameDep] = useState(true);
  const [addFavBlnDisable, setAddFavBlnDisable] = useState(true);
  const [deleteFavBlnDisable, setDeleteFavBlnDisable] = useState(true);
  const [fileList, setFileList] = useState([]); // Your file list
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileIds, setfileIds] = useState([]);
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedFilePreview, setSelectedFilePreview] = useState(null);
  const [fileName, setFileName] = useState("");
  const [fileName1, setFileName1] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [uploadedFileExt, setUploadedFileExt] = useState([]);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      externalUsers: [],
      internalUsers: [],
      recipientDepartments: [],
      description: props?.assignFurtherObj?.description
        ? props?.assignFurtherObj?.description
        : props?.description,
      id: props.assignFurtherObj?.id ? props.assignFurtherObj?.id : props.id,
      priority: "medium",
      enclosureList: [],
    },

    onSubmit: (values) => {
      handleSend(values);
      formik.handleReset();
    },
  });

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };
  function a11yProps(index) {
    return {
      id: `full-width-tab-${index}`,
      "aria-controls": `full-width-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setSection("");
    setIntService("");
    setService("");
    setFavSection("");
    setFavIntService("");
    setFavService("");
    setfileIds([]);
  };

  const handleChangeIndex = (index) => {
    setValue(index);
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
      .catch((err) => { });
  };

  useEffect(() => {
    // fetchFavourite();
  }, []);

  useEffect(() => {
    if (
      service ||
      section ||
      intService ||
      favSection ||
      favService ||
      favIntService ||
      eyesOnlyDep
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

    if (service || section || intService || eyesOnlyDep) {
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

  const handleClearList = (type) => {
    switch (type) {
      case "service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService(""),
          setEyesOnlyDep("")
        );
      case "section":
        return (
          setService(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService(""),
          setEyesOnlyDep("")
        );
      case "internal_service":
        return (
          setSection(""),
          setService(""),
          setFavService(""),
          setFavSection(""),
          setFavIntService(""),
          setEyesOnlyDep("")
        );
      case "fav_service":
        return (
          setSection(""),
          setIntService(""),
          setService(""),
          setFavSection(""),
          setFavIntService(""),
          setEyesOnlyDep("")
        );
      case "fav_section":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setService(""),
          setFavIntService(""),
          setEyesOnlyDep("")
        );
      case "fav_internal_service":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setService(""),
          setEyesOnlyDep("")
        );
      case "eyesOnlyDep":
        return (
          setSection(""),
          setIntService(""),
          setFavService(""),
          setFavSection(""),
          setService(""),
          setEyesOnlyDep("")
        );
      default:
        break;
    }
  };

  const handleInputValueChangeInternalService = async (newValue) => {
    const dept = sessionStorage.getItem("department");
    await props.getInternalServiceNumber(newValue, dept).then((resp) => {
      setIntServiceObj(resp.data);

      try {
        if (resp.error) {
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
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

          setIntServiceList(tmpArray);
        }
      } catch (err) {
        callMessageOut(err.message);
      }
    });
    setSectionList([]);
    setServiceList([]);
  };



  const handleOnChangeInternalService = (newValue) => {
    if (newValue && newValue.length > 0) {
      let tempArr = [];
      for (var i = 0; i < newValue?.length; i++) {
        tempArr.push(newValue[i]?.deptRole[0]?.roleName);
      }

      handleClearList("section");
      formik.setFieldValue("internalUsers", tempArr);
    }
    setBlnDisable(false);
  };
  const handleOnChangeFavInternalService = async (value) => {
    setFavIntService(value);
    formik.setFieldValue("internalUsers", value);
    handleClearList("fav_internal_service");
    const dept = sessionStorage.getItem("department");
    await props
      .getInternalServiceNumber(value, dept)
      .then((resp) => {
        setFavIntServicObj(resp.data);
      })
      .catch((err) => { });
  };

  const handleInputValueChange = async (newValue) => {
    let formData = new FormData();
    formData.append("sau", newValue);
    await props.getGroupList(formData).then((resp) => {
      setSectionObj([...sectionObj, resp.data]);

      // let tmpArray = [];
      // for (var i = 0; i < resp.data.length; i++) {
      //   tmpArray.push(`${resp.data[i].deptName}`);
      // }

      setSectionList(resp.data);
    });
    setServiceList([]);
    setIntServiceList([]);
  };

  const handleOnChange = (val) => {

    if (val.length == 0) {
      setSection(val);
      formik.setFieldValue("recipientDepartments", val);
    } else {
      const newVal = val[val.length - 1];

      if (newVal && typeof newVal === "object" && "id" in newVal) {
        setSection(val);
        formik.setFieldValue("recipientDepartments", val);
      }
    }

    val && val.length > 0 && handleClearList("section");
  };

  const eyeOnlyHandleOnChange = (newValue) => {
    let tempArr = [];

    if (newValue && newValue.length > 0) {
      for (var i = 0; i < newValue?.deptRole; i++) {
        tempArr.push(newValue[i]);
      }

      setEyesOnlyDep(tempArr);

      newValue && newValue.length > 0 && handleClearList("eyesOnlyDep");
    }
    formik.setFieldValue("externalUsers", [newValue?.deptRole[0].roleName]);

    setBlnDisable(false);
    newValue && newValue.length > 0 && handleClearList("eyesOnlyDep");
  };

  const handleEyesOnlyInputChange = async (e) => {
    if (e && e.target) {
      if (!isNullOrUndefined(e.target.value)) {
        optimizedEyesOnlyInpChange(e.target.value);
      }
    }
  };

  const handleOnChangeFavSection = async (value) => {
    setFavSection(value);
    formik.setFieldValue("externalusers", value);
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
          tmpArray.push(`${resp.data[i].deptName}`);
        }
      } catch (e) {
        callMessageOut(e.message);
      }
    });
    setServiceFavouriteList([]);
  };

  // const handleInputValueChangeService = async (newValue) => {
  //   await props.getServiceNumber(newValue).then((resp) => {
  //     let tmpArray = [];
  //     const response = resp.data;
  //     setServiceObj(response);
  //     for (var i = 0; i < resp.data.length; i++) {
  //       tmpArray.push(
  //         `${resp.data[i].deptRole}`
  //       );
  //     }
  //     setServiceList(tmpArray);
  //   });
  //   setSectionList([]);
  //   setIntServiceList([]);
  // };

  // const handleOnChangeService = (newValue) => {
  //   let roleData = !isNullOrUndefined(newValue) && newValue.split(" | ")[1];
  //   setRole(roleData);
  //   let data =
  //     !isNullOrUndefined(newValue) &&
  //     newValue.substr(0, newValue.indexOf(" |"));
  //   setService(data);
  //   newValue && newValue.length > 0 && handleClearList("service");
  // };

  // const handleOnChangeFavService = async (value) => {
  //   setFavService(value);
  //   handleClearList("fav_service");
  //   await props
  //     .getServiceNumber(value)
  //     .then((resp) => {
  //       setFavServiceObj(resp.data);
  //       let data =
  //         resp.data && resp.data.find((ele) => ele.deptUsername === value);
  //       setFavServiceDepName(data.deptName);
  //       setRole(data.deptCoordRole);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const optimizedInternalList = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );
  const optimizedSectionList = useCallback(
    debounce(handleInputValueChange),
    []
  );

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
      .catch((err) => { });
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
      .catch((err) => { });
  };

  async function getInternalGroupListFunc(value) {
    if (value && value.length > 2) {
      const dept = sessionStorage.getItem("department");
      await props
        .getServiceNumber(value, dept)
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
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

  const optimizedEyesOnlyInpChange = useCallback(
    debounce(getInternalGroupListFunc),
    []
  );



  const handleSend = (values) => {
    const recipientDepartments = values?.recipientDepartments?.map((item) => item.deptName)
    setLoading(true);
    props
      .assignFurther({
        ...values,
        recipientDepartments,
        enclosureList: [...values?.enclosureList, ...fileIds]
      }, roleName)
      .then((res) => {
        try {
          if (fileName1.length > 0) {
            props.assigneeFileUpload(fileName, props?.assignFurtherObj?.id);
          }
          if (res.response.message) {
            dispatch(
              setSnackbar(true, "success", `${t("task_assigned_successfully")}`)
            );
            setLoading(false);
            props.getAllTaskData();
            props.assignFurtherhandleClose();
          } else {
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            setLoading(false);
          }
        } catch (error) {
          console.error(error);
          callMessageOut(error.error);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error(error);
        callMessageOut(error.error);
        setLoading(false);
      });
  };

  const handleChangePriority = (type) => {
    formik.setFieldValue("priority", type);
  };

  const handleFileSelectInt = (file) => {
    setSelectedFile(file);
    let fileids1 = [];
    file.map((item) => {
      fileids1.push(item.id);
    });
  
    // formik.setFieldValue("enclosureList", formik.values.enclosureList.concat(fileids1));
    setfileIds(fileids1);

    // You can also store it in formik if needed
  };
  const handleFileSelectExt = (file) => {
    setSelectedFile(file);
    let fileids1 = [];
    file.map((item) => {
      fileids1.push(item.id);
    });
    setfileIds(fileids1);


    // You can also store it in formik if needed
  };

  const handlePreview = (file) => {
    setSelectedFilePreview(file);
    setOpenPreview(true);
  };
  useEffect(() => {

    props
      .getEnclosureInfo(props.assignFurtherObj?.id)
      .then((res) => {
        setFileList(res?.response);
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  }, [props.assignFurtherObj]);

  const handleUploadNewFile = (e) => {

    const files = e.target?.files;
    if (!files || files.length === 0) {
      return;
    }
    const filesNameArr = uploadedFile;
    const formdata = new FormData();
    for (let i = 0; i < files.length; i++) {

      formdata.append("files", files[i]);
      filesNameArr.push(files[i].name);
    }
    setUploadedFile(filesNameArr);
    setFileName1(filesNameArr);
    if(fileName){
      const updatedFormData = new FormData();
      for (let [key,value] of fileName.entries()){
        updatedFormData.append(key,value);
      }
    for(let [key,value] of formdata.entries()){
      updatedFormData.append(key,value);
    }
    setFileName(updatedFormData);
    }else{
      setFileName(formdata); //the actual form data object;
    } 
   
    props
      .assigneeFileUpload(formdata, props?.assignFurtherObj?.id)
      .then((res) => {
        const fileList = res.response?.enclosureList;
        formik.setFieldValue("enclosureList", formik.values.enclosureList.concat(fileList));
      });
  };
  const handleUploadNewFileExt = (e) => {

    const files = e.target?.files;
    if (!files || files.length === 0) {
      return;
    }
    const filesNameArr = uploadedFileExt;
    const formdata = new FormData();
    for (let i = 0; i < files.length; i++) {

      formdata.append("files", files[i]);
      filesNameArr.push(files[i].name);
    }
    setUploadedFileExt(filesNameArr);
    setFileName1(filesNameArr); // Array of filenames;
    if(fileName){
      const updatedFormData = new FormData();
      for (let [key,value] of fileName.entries()){
        updatedFormData.append(key,value);
      }
    for(let [key,value] of formdata.entries()){
      updatedFormData.append(key,value);
    }
    setFileName(updatedFormData);
    }else{
      setFileName(formdata); 
    }
    props
      .assigneeFileUpload(formdata, props?.assignFurtherObj?.id)
      .then((res) => {
        const fileList = res.response?.enclosureList;
        formik.setFieldValue("enclosureList", fileList);
      });
  };
  const handleFileDelete= (item)=>{
    const newFormData = new FormData();
    for(let [key,value] of fileName.entries()){
      if(fileName.getAll(key).indexOf(value)===item){
        continue;
      }
      newFormData.append(key,value);
    }
    setFileName(newFormData);
    let newUploadedFile =uploadedFile.filter((_,index)=> index!==item);

    setUploadedFile(newUploadedFile);
    let newFileName1 =fileName1.filter((_,index)=> index!==item);

    setFileName1(newFileName1);
  }

  const handleFileDeleteExt = (item) => {
    const newFormData = new FormData();
    for(let [key,value] of fileName.entries()){
      if(fileName.getAll(key).indexOf(value)===item){
        continue;
      }
      newFormData.append(key,value);
    }
    setFileName(newFormData);
    let newUploadedFile =uploadedFileExt.filter((_,index)=> index!==item);

    setUploadedFileExt(newUploadedFile);
    let newFileName1 =fileName1.filter((_,index)=> index!==item);

    setFileName1(newFileName1);
    }

  return (
    <div>
      <DialogTitle
        id="draggable-dialog-title"
        style={{ cursor: "move" }}
        className="send_dialog"
      >
        {t("assign_further")}
        <Tooltip title={t("cancel")}>
          <IconButton
            id="assign_further"
            aria-label="close"
            onClick={props.assignFurtherhandleClose}
            color="primary"
            className="cancel-drag"
          >
            <CancelIcon
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </Tooltip>
      </DialogTitle>

      <DialogContent dividers>
        <AppBar
          position="static"
          color="default"
          style={{ padding: "5px" }}
          className=" statustab"
        >
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
            TabIndicatorProps={{
              style: { display: "none" },
            }}
          >
            <Tab label={t("internal")} {...a11yProps(0)} />
            <Tab label={t("external")} {...a11yProps(1)} />
            {/*<Tab label={t("eye only")} {...a11yProps(2)} /> */}
          </Tabs>
        </AppBar>
        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <Grid container>
              <Grid item xs={11}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  name="external"
                  options={fileList} // Replace with your file list array
                  getOptionLabel={(option) => option?.fileName || ""}
                  onChange={(event, newValue) => handleFileSelectInt(newValue)}
                  renderOption={(props) => {
                    return (
                      <li
                        {...props}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            flexGrow: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {props?.fileName}
                        </span>
                        <Tooltip title={t("view_preview")}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent selecting the option
                              handlePreview(props);
                            }}
                            sx={{
                              marginLeft: "auto",
                              padding: "2px 2px",
                              cursor: "pointer",
                            }}
                          >
                            <ZoomOutMapIcon style={{ fontSize: "20" }} />
                          </IconButton>
                        </Tooltip>
                      </li>
                    );
                  }}
                  renderInput={(params, i) => (
                    <TextField
                      {...params}
                      label={t("select_file")} // This will float when focused
                      // placeholder={t("select_file")}
                      variant="outlined"
                      margin="normal"
                      id={i}
                      className={props.theme ? "darkTextField" : ""}
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                xs={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Fab
                  onClick={() => fileInputRef.current.click()}
                  style={{
                    height: ".1rem",
                    width: "2.2rem",
                    cursor: "pointer",
                    marginTop: "6px",
                    marginLeft: "10px",
                    backgroundColor: "#ffa41c",
                  }}
                >
                  <Tooltip title={t("upload_new_file")}>
                    <FileUploadIcon style={{ fontSize: "20px" }} />
                  </Tooltip>
                </Fab>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={handleUploadNewFile}
                />

              </Grid>
              {/* {uploadedFile.length > 0 && (
                <Box
                  mb={1}
                  ml={1}
                  sx={{
                    maxWidth: "500px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={uploadedFile.join(", ")} // full list on hover
                >
                  <Typography variant="caption">
                    📎 {uploadedFile.join(", ")}
                  </Typography>
                </Box>
              )} */}
              {uploadedFile && uploadedFile.map((item,index)=>{
                return <Tooltip title ={item}>
                  <Chip label={item} onDelete={() => handleFileDelete(index)} style={{ marginLeft: "5px", marginBottom: "4px",maxWidth:"15vw"}}
                    size="small" variant="outlined" />
                </Tooltip>
              })}
            </Grid>
            <Autocomplete
              multiple
              disableCloseOnSelect
              options={intServiceList}
              onChange={(event, newValue) => {
                handleOnChangeInternalService(newValue);
              }}
              getOptionLabel={(option) => {
                return typeof option === "object"
                  ? `${option?.deptUsername} | ${option?.deptDisplayUsername} | ${option?.deptRole[0]?.displayRoleName}`
                  : "";
              }}
              fullWidth
              onInputChange={(event, newInputValue) => {
                if (newInputValue.length >= 3) {
                  optimizedInternalList(newInputValue);
                }
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t("select_to_send_internally_within_section")}
                />
              )}
            />

            <TextField
              multiline
              name="description"
              style={{ marginTop: "15px" }}
              id="outlined-multiline-static"
              minRows={5}
              maxRows={5}
              fullWidth
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
              label={t("description")}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: "5rem",
                justifyContent: "start",
                marginTop: "1rem",
              }}
            >
              <p>{t("select_priority")} :&nbsp;&nbsp;</p>

              <TripleToggleSwitch
                priority={formik.values.priority}
                handleChange={handleChangePriority}
              />
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <Grid container>
              <Grid item xs={11}>
                <Autocomplete
                  multiple
                  disableCloseOnSelect
                  size="small"
                  name="external"
                  options={fileList} // Replace with your file list array
                  getOptionLabel={(option) => option?.fileName || ""}
                  onChange={(event, newValue) => handleFileSelectExt(newValue)}
                  renderOption={(props) => {
                    return (
                      <li
                        {...props}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            flexGrow: 1,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {props?.fileName}
                        </span>
                        <Tooltip title={t("view_preview")}>
                          <IconButton
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent selecting the option
                              handlePreview(props);
                            }}
                            sx={{
                              marginLeft: "auto",
                              padding: "2px 2px",
                              cursor: "pointer",
                            }}
                          >
                            <ZoomOutMapIcon style={{ fontSize: "20" }} />
                          </IconButton>
                        </Tooltip>
                      </li>
                    );
                  }}
                  renderInput={(params, i) => (
                    <TextField
                      {...params}
                      label={t("select_file")} // This will float when focused
                      // placeholder={t("select_file")}
                      variant="outlined"
                      margin="normal"
                      id={i}
                      className={props.theme ? "darkTextField" : ""}
                    />
                  )}
                />
              </Grid>

              <Grid
                item
                xs={1}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <label htmlFor="upload-multiple-files">
                  <input
                    id="upload-multiple-files"
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={handleUploadNewFileExt}
                  />
                  <Fab
                    id="assign_further_external_add"
                    component="span"
                    style={{
                      height: ".1rem",
                      width: "2.2rem",
                      cursor: "pointer",
                      marginTop: "6px",
                      marginLeft: "10px",
                      backgroundColor: "#ffa41c",
                    }}
                  >
                    <Tooltip title={t("upload_new_file")}>
                      <FileUploadIcon style={{ fontSize: "20px" }} />
                    </Tooltip>
                  </Fab>
                </label>

              </Grid>
              {/* {uploadedFileExt.length > 0 && (
                <Box
                  mb={1}
                  ml={1}
                  sx={{
                    maxWidth: "500px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={uploadedFileExt.join(", ")} // full list on hover
                >
                  <Typography variant="caption">
                    📎 {uploadedFileExt.join(", ")}
                  </Typography>
                </Box>
              )} */}
              {uploadedFileExt && uploadedFileExt.map((item,index)=>{
                return <Tooltip title ={item}>
                  <Chip label={item} onDelete={() => handleFileDeleteExt(index)} style={{ marginLeft: "5px", marginBottom: "4px",maxWidth:"15vw"}}
                    size="small" variant="outlined" />
                </Tooltip>
              })}
            </Grid>
            <Autocomplete
              multiple
              disableCloseOnSelect
              size="small"
              id="tags-outlined"
              options={sectionList}
              getOptionLabel={(option) => {
                return typeof option === "object"
                  ? option.deptDisplayName
                  : "";
              }}
              onInputChange={(event, newInputValue) => {
                if (newInputValue.length >= 3) {
                  optimizedSectionList(newInputValue);
                }
              }}
              onChange={(event, newValue) => {
                handleOnChange(newValue);
              }}
              filterSelectedOptions
              getOptionSelected={(option, value) => option.id == value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={t("select_to_send_to_external_section")}
                  // placeholder={t("SEARCH BY EXTERNAL DEPARTMENT")}
                  value={formik.values.externalUsers}
                  name="externalUsers"
                />
              )}
            />
            {/* <Tooltip title={t("add_to_favourite")}>
                    <span>
                      <IconButton
                        color="secondary"
                        disabled={addFavBlnDisable}
                        onClick={handleAddToFavourite}
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </span>
                  </Tooltip> */}
            {/* <Grid
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 3rem",
                    width: "100%",
                  }}
                >
                  
                  </Tooltip>
                </Grid> */}

            <TextField
              multiline
              name="description"
              id="outlined-multiline-static"
              minRows={3}
              maxRows={3}
              style={{ marginTop: "15px" }}
              fullWidth
              variant="outlined"
              value={formik.values.description}
              onChange={formik.handleChange}
              label={t("description")}
            />

            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
                gap: "5rem",
                justifyContent: "start",
                marginTop: "1rem",
              }}
            >
              <p> {t("select_priority")}:&nbsp;&nbsp;</p>

              <TripleToggleSwitch
                priority={formik.values.priority}
                handleChange={handleChangePriority}
              />
            </div>
          </TabPanel>
          {/* <TabPanel value={value} index={2} dir={theme.direction}>
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
            onChange={(event, newValue) => {
              eyeOnlyHandleOnChange(newValue);
            }}
            onInputChange={handleEyesOnlyInputChange}
            filterSelectedOptions
            getOptionDisabled={(option) => {
              option?.deptRole[0]?.displayRoleName;
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                style={{ width: "100%" }}
                variant="outlined"
                label={t("eyes_only")}
                className={props.theme ? "darkTextField" : ""}
              />
            )}
          />

          

       

          <TextField
            multiline
            name="description"
            id="outlined-multiline-static"
            minRows={5}
            maxRows={5}
            fullWidth
            style={{ marginTop: "15px" }}
            variant="outlined"
            value={formik.values.description}
            label={t("description")}
            onChange={formik.handleChange}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexDirection: "row",
              gap: "5rem",
              justifyContent: "start",
              marginTop: "1rem",
            }}
          >
            <p> SELECT PRIORITY :&nbsp;&nbsp;</p>

            <TripleToggleSwitch
              priority={formik.values.priority}
              handleChange={handleChangePriority}
            />
          </div>
        </TabPanel> */}
        </SwipeableViews>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          onClick={formik.handleSubmit}
          disabled={blnDisable || loading}
          // className="submitButton"
          endIcon={<SendIcon />}
        >
          {loading ? (
            <>
              LOADING
              <CircularProgress size={24} />
            </>
          ) : (
            t("send")
          )}
        </Button>

        <Dialog
          fullScreen
          open={openPreview}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <AssignFurtherPreview
            setOpenPreview={setOpenPreview}
            selectedFilePreview={selectedFilePreview}
          />
        </Dialog>
      </DialogActions>
    </div>
  );
};

function mapStateToProps(state) {
  return { props: state.props, theme: state.theme };
}

export default connect(mapStateToProps, {
  sendFilesInternalServiceNumber,
  RtisendFilesInternalServiceNumber,
  getInternalServiceNumber,
  getGroupList,
  getSection,
  getServiceNumber,
  rtisendFiles,
  sendFilesServiceNumber,
  PCFileClosuer,
  addToFavourite,
  fetchFavouriteList,
  deleteFavourite,
  sendbackRti,
  assignFurther,
  getEnclosureInfo,
  filesUpload,
  assigneeFileUpload,
})(AssignFurther);
