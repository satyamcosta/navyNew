import React, { createContext, useEffect, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import LowPriorityIcon from "@mui/icons-material/LowPriority";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import { Autocomplete } from "@material-ui/lab";
import SplitViewPdfViewer from "app/views/inbox/shared/pdfViewer/pdfViewer";
import { useDispatch, connect, useSelector } from "react-redux";
import GetAppIcon from "@material-ui/icons/GetApp";
import { setPassData } from "app/camunda_redux/redux/ducks/passData";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import RedoIcon from "@material-ui/icons/Redo";
import VisibilityIcon from "@material-ui/icons/Visibility";
import CancelIcon from "@material-ui/icons/Cancel";

import "../index.css";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import ScheduleIcon from "@material-ui/icons/Schedule";
import { Loading } from "../../../dashboard/therme-source/material-ui/loading";
import "../../../dashboard/therme-source/material-ui/loading.css";
import PersonIcon from "@mui/icons-material/Person";
import { handleError } from "utils";
import {
  viewDetail,
  filesDetele,
  markCompleted,
  getAllFiles,
  viewTaskDetails,
  cumulatedStatus,
  PreviousStatus,
} from "app/camunda_redux/redux/action";
import {
  Paper,
  Typography,
  makeStyles,
  Button,
  Dialog,
  IconButton,
  DialogActions,
  DialogTitle,
  TextField,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { useTranslation } from "react-i18next";

import ActionPointFileUploader from "./ActionPointFileUploader";
import AssignFurtherForm from "../Actionpointopen/AssignFurtherForm";
import { HiUsers } from "react-icons/hi";

import DeleteIcon from "@material-ui/icons/Delete";

import AssignmentIcon from "@material-ui/icons/Assignment";

import { SplitterComponent } from "@syncfusion/ej2-react-layouts";
import Draggable from "react-draggable";
import PaginationComp from "app/views/utilities/PaginationComp";
import ViewPreviousStatus from "../Actionpointopen/StatusUpdates/ViewPreviousStatus";
import ViewAssignTaskUsrStatas from "../Actionpointopen/StatusUpdates/ViewAssignTaskUsrStatas";
import Tooltip from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Index from "./InstructionAndStatus/Index";
import moment from "moment";
import { Rating, Stack } from "@mui/material";
import { unstable_batchedUpdates } from "react-dom";

export const AssignerContext = createContext(null);

const useStyleses = makeStyles((theme) => ({
  headerText: {
    display: "inline-flex",
    justifyContent: "center",
    marginBottom: "0px",
    marginLeft: "20px",
    fontSize: "1rem",
    fontFamily: "Arial, Helvetica, sans-serif",
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

function ViewDetailStatus(props) {
  const displayRoleName = sessionStorage.getItem("role");
  let { rowData, viewDetails } = props;


  const cls = useStyleses();
  const dispatch = useDispatch();
  const roleName = sessionStorage.getItem("role");
  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };
  const [isLoading, setIsLoading] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [assinerRowData, setAssinerRowData] = useState([]);
  // camulated status pagination state
  const [camuStatusPageSize, setCamuStatusPageSize] = useState(25);
  const [camuStatusPageSizes] = useState([10, 15]);
  const [camuStatusTotalCount, setCamuStatusTotalCount] = useState(0);
  const [camuStatusCurrentPage, setCamuStatusCurrentPage] = useState(0);
  const [assineesRowData, setAssineesRowData] = useState([]);
  const { t } = useTranslation();
  const [viewDetailsFileId, setViewDetailsFileId] = useState("");

  const [value, setValue] = useState("");
  const [NOF1, setNOF1] = useState("");
  const [prevEnclouser, setPrevEnclouser] = useState("");
  const [enclosureArr, setEnclosureArr] = useState([]);
  const [URL, setURL] = useState("");
  const [enclosurePdfLoads, setEnclosurePdfLoads] = useState(false);
  const [fileChange, setFileChange] = useState(false);
  const [prevFlagNumberEnclouser, setPrevFlagNumberEnclouser] = useState("");
  const [extension, setExtension] = useState("docx");

  const [pageNumber, setPageNumber] = useState(1);
  const [isPdf, setIsPdf] = useState(false);
  const [urlNew, seturlNew] = useState("");
  const [actionData, setActionData] = useState([]);
  const [ratingValue, setRatingValue] = useState(2); //rating value


  // mark completed
  const [markComplete, setMarkComplete] = useState(false);

  const [fileUploaderRoleName, setFileUploaderRoleName] = useState("");
  const [markCompleteId, setMarkCompleteId] = useState([]);

  const [openTab2, setOpenTab2] = useState(true)

  const [pdfLoading, setPdfLoading] = useState(false)

  const markCompletedhandleClickOpen = (id) => {
    setMarkComplete(true);
  };

  const markCompletedhandleClose = () => {
    setMarkComplete(false);
  };



  const markCompletedFun = () => {

    props
      .markCompleted([props.rowData.id], true, pageSize, currentPage, ratingValue)
      .then((res) => {
        try {
          if (res.error) {
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
          } else {
            const filterData = actionData.filter((item) => {
              return item.id !== res.response.actionId;
            });

            setActionData(filterData);
            dispatch(setSnackbar(true, "success", `${t("task_completed")}`));
            props.viewDetailStatushandleClose();
            props.getAllTaskData();
          }
        } catch (error) {
          callMessageOut(error.error);
        }
      })
      .catch((err) => {
        callMessageOut(err.error);
      });
  };

  const previousStatusData = () => {
    props
      .PreviousStatus(
        props.rowData.id,
        "",
        pageSize,
        currentPage,
        roleName,
        false
      )
      .then((resp) => {
        try {
          let tmpArr = [];
          if (!resp.error) {
            setTotalCount(
              resp?.response?.length != null ? resp?.response?.length : 0
            );

            tmpArr = resp?.response?.content?.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });
            setAssinerRowData(tmpArr);
          } else {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
          }
        } catch (error) {
          callMessageOut(error.error);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
      });
  };

  useEffect(() => {
    previousStatusData();
  }, [pageSize, currentPage]);

  const getFile = (fileName, value) => {
    setPdfLoading(true)
    fetch("/actionPoint/api/get-file", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        fileName: fileName,
      },
    })
      .then(async (response) => {
        try {
          if (response.error) {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setPdfLoading(false)
          }
          return response.blob();
        } catch (error) {
          callMessageOut(error.message);
          setPdfLoading(false)
        }
      })
      .then((blobData) => {
        setURL(blobData);
        
        // setNOF1(value);
      
        setPdfLoading(false)
      })
      .catch((error) => {
        callMessageOut(error.message);
        setPdfLoading(false)
      });
  };

  const handleChange1 = (value) => {
    setFileUploaderRoleName(value?.uploaderRoleName);
    if (value !== undefined) {
      const data = value;

      getFile(data?.s3FileName, value);
      const url = data?.fileBlob;
      

      unstable_batchedUpdates(() => {
        seturlNew(url);
        const flagNumber = data?.flagNumber;
        setNOF1(value);
        setFileChange(true);
        setPrevEnclouser(url);
        setPrevFlagNumberEnclouser(flagNumber);
        setViewDetailsFileId(value?.id);
        setPageNumber(1);
        let arr = data?.fileName.split(".");
        arr?.length !== 1
          ? setExtension(arr[arr?.length - 1])
          : setExtension("docx");
        setIsPdf(data?.fileName.includes(".pdf"));
      }, [])


    }
  };

  useEffect(() => {
    props
      .viewDetail(props?.rowData?.id, roleName)
      .then((res) => {

        try {
          if (res?.error) {
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
          } else {
            setViewDetailsFileId(res?.response?.id);
            setEnclosureArr(res?.response);
            setPrevFlagNumberEnclouser(res?.response?.flagNumber);
            setIsLoading(false);

            handleChange1(res?.response[0]);
          }
        } catch (error) {
          callMessageOut(error.error);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
      });
  }, []);

  useEffect(() => {
    let data = { extension, url: URL };

    dispatch(setPassData(data));
  }, []);

  // ===================================

  const CustomToolbarMarkup = () => (
    <div
      style={{
        padding: "0.5rem 1rem",
      }}
    >
      <Typography
        variant="h6"
        style={{
          fontFamily: "inherit !important",
          // borderBottom: "1px solid ",
        }}
      >
        {t("task_details")}
      </Typography>
    </div>
  );

  const handleClearInput = () => {
    setNOF1("");

    setFileChange(true);

    setPrevEnclouser("");
    setPrevFlagNumberEnclouser(0);
    setValue("");
    setExtension("docx");
    setIsPdf(false);
    setURL("def");
   
  };

  const newFileData = (data) => {
    const lastIndex = data.length - 1;
    const lastValue = data[lastIndex];

    // data?.map((item) => {
    //   setEnclosureArr([...enclosureArr, item]);
    // });
    setEnclosureArr(data)


    handleChange1(lastValue);
    dispatch(
      setSnackbar(true, "success", `${t("file_has_been_added_successfully")} !`)
    );
  };

  // deleteFiless

  const deleteEnclosureData = () => {
    props
      .filesDetele(
        viewDetailsFileId,
        prevFlagNumberEnclouser,
        props?.rowData?.id,
        roleName
      )
      .then((resp) => {
        try {
          if (!resp.error) {
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("file_has_been_deleted_successfully")} !`
              )
            );
            const newArray = enclosureArr.filter((item) => {
              return item.id !== viewDetailsFileId;
            });
            setEnclosureArr(newArray);
            let newData;
            if (enclosureArr) {
              newData = enclosureArr[0];
            } else {
              
              newData = [];
            }
            
            if (newArray?.length > 0) {
              // setNOF1(newArray[0])
              handleChange1(newArray[0]);
          
              
            } else {
           
              handleClearInput();
             
             
            }
            setIsLoading(false);
          } else {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
          }
        } catch (error) {
          callMessageOut(error.error);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
      });
  };

  // assign further start=========================
  const [assignFurtherDialoge, setAssignFurtherDialoge] = useState(false);


  const assignFurtherhandleClickOpen = () => {
    setAssignFurtherDialoge(true);
  };
  const assignFurtherhandleClose = () => {
    setAssignFurtherDialoge(false);
  };
  // assign further end ============================

  const [viewStatus, setviewStatust] = useState(false);
  const [assigneePreStatus, setAssigneePreStatus] = useState("");

  const viewStatushandleClose = () => {
    setviewStatust(false);
  };
  const { theme } = props;

  const [tabIndex, setTabIndex] = useState(1);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-detail");
    adjustableDiv.style.height = viewportHeight - 190 + "px";
  }



  useEffect(() => {
    if (openTab2) {
      adjustDivHeight();
      window.addEventListener("resize", adjustDivHeight);
    }
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, [openTab2]);

  //  for getting assinees value
  const assignees = props?.rowData?.assignees;
  const assigneesUsers = assignees && assignees.join(" | ");
 

  return (
    <>
      <div className="view-details-tab">
        {isLoading && <Loading />}
        <DialogContent
          id="alert-dialog-slide-description"
          style={{ backgroundColor: theme ? "" : "#ffffffc2" }}
        >
          <Tabs
            forceRenderTabPanel={openTab2}
            selectedIndex={tabIndex}
            onSelect={(index) => {
              setTabIndex(index)
              setOpenTab2(index == 1)
            }}
          >
            <TabList
              style={{
                position: "relative",
                zIndex: 12,
              }}
            >
              <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                {t("ins_and_status").toUpperCase()}
              </Tab>
              <Tab style={{ borderRadius: "5px 5px 0 0" }}>
                {t("task_detail_and_doc").toUpperCase()}
              </Tab>

              <p className={`${cls.headerText} hideText`}>
                <b>{t("subject")} : &nbsp;</b>

                <span style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
                  {viewDetails?.subject?.toUpperCase()?.slice(0, 25)}
                </span>

                <b>&nbsp;| {t("action_point_number")} : &nbsp;</b>
                {viewDetails?.serialNumber?.toUpperCase()}
              </p>
              <IconButton
                id="task_details"
                aria-label="close"
                onClick={()=>{
                  props.viewDetailStatushandleClose();
                  props.getAllTaskData()
                }}
                style={{
                  color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                  float: "right",
                  marginTop: "18px",
                  marginRight: "20px",
                }}
                className="icons-button"
              >
                <CancelIcon />
              </IconButton>
            </TabList>

            <TabPanel>
              <Index
                rowData={rowData}
                viewDetails={viewDetails}
                getAllTaskData={props.getAllTaskData}
              />
            </TabPanel>
            <TabPanel>
              <SplitterComponent>
                <div
                  style={{
                    width: "50%",
                  }}
                >
                  <Paper
                    elevation={4}
                    style={{
                      padding: "8px",
                      margin: "5px 6px",

                      borderRadius: "7px",
                      border: "1px solid #b6b6b66b",

                      boxShadow: "rgba(40, 43, 61, 0.15) 0px 2px 2px 0px",
                    }}
                  >
                    <CustomToolbarMarkup />

                    <div id="mrt-detail">
                      <List component="nav" aria-label="main mailbox folders">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ width: "250px" }}>
                            <CalendarTodayIcon
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("created_on")}
                            />
                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              {viewDetails?.createdOn}
                            </ListItemText>
                          </ListItem>
                        </div>
                        <Divider />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ width: "250px" }}>
                            <ScheduleIcon
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("dueDate")}
                            />
                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <Typography>
                              {viewDetails?.dueDate?.slice(0, 11)}
                            </Typography>
                          </ListItem>
                        </div>
                        <Divider />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ width: "250px" }}>
                            <LowPriorityIcon
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("priority")}
                            />
                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <ListItemText>{viewDetails?.priority}</ListItemText>
                          </ListItem>
                        </div>
                        <Divider />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ width: "250px" }}>
                            <PersonIcon
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("assigner")}
                            />
                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <ListItemText>{viewDetails?.assigner}</ListItemText>
                          </ListItem>
                        </div>

                        <Divider />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ width: "250px" }}>
                            <HiUsers
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("assignees")}
                            />
                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <ListItemText>{assigneesUsers}</ListItemText>
                          </ListItem>
                        </div>

                        <Divider />
                        
                        

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ width: "250px" }}>
                            <PersonIcon
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("on_behalf_of")}
                            />
                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <ListItemText>
                              {viewDetails?.onBehalfOf}
                            </ListItemText>
                          </ListItem>
                        </div>
                        <Divider />
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ width: "250px" }}>
                            <LowPriorityIcon
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("new_refrence")}
                            />
                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <ListItemText>{viewDetails?.newReference}</ListItemText>
                          </ListItem>
                        </div>

                        <Divider />

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <ListItem style={{ height: "3rem", width: "250px" }}>
                            <AssignmentIcon
                              style={{
                                marginRight: "10px",
                                color: theme
                                  ? "#fffcf2"
                                  : "rgba(47, 43, 61, 0.78)",
                              }}
                            />
                            <ListItemText
                              primaryTypographyProps={{
                                style: {
                                  fontWeight: theme ? 500 : "bold",
                                  fontSize: "13px",
                                  fontFamily:
                                    "Roboto, Helvetica, Arial, sans-serif",
                                  color: theme
                                    ? "#fffcf2"
                                    : "rgba(47, 43, 61, 0.78)",
                                },
                              }}
                              primary={t("description")}
                            />

                            <span style={{ float: "left" }}></span>
                          </ListItem>
                          <ListItem>
                            <ListItemText
                              style={{
                                height: "5rem",
                                overflowY: "auto",
                                fontFamily:
                                  "Roboto, Helvetica, Arial, sans-serif",
                                textAlign: "justify",
                                // fontFamily: " Helvetica Arial sans-serif",
                              }}
                            >
                              {viewDetails?.description}
                            </ListItemText>
                          </ListItem>
                          
                          
                        </div>
                        
                      </List>
                    </div>
                    {/* </Paper> */}
                    <DialogActions>
                      <Button
                        disabled={
                          viewDetails?.from !== roleName ||
                          viewDetails?.completed === true
                        }
                        variant="contained"
                        color="secondary"
                        // className="submitButton"
                        onClick={markCompletedhandleClickOpen}
                      >
                        {t("mark_completed")}
                      </Button>
                      {/* {viewDetails?.from === roleName &&(<Button
                        disabled={viewDetails?.completed === true}
                        variant="contained"
                        color="primary"
                        // className="submitButton"
                        onClick={assignFurtherhandleClickOpen}
                      >
                        {t("assign_further")}
                      </Button>)} */}
                      <Button
                        disabled={viewDetails?.completed === true}
                        variant="contained"
                        color="primary"
                        // className="submitButton"
                        onClick={assignFurtherhandleClickOpen}
                      >
                        {t("assign_further")}
                      </Button>
                    </DialogActions>
                  </Paper>
                </div>
                <div style={{ width: "50%", overflow: "hidden" }}>
                  <div
                    style={{
                      display: "flex",
                      // marginBottom: ".5rem",
                      marginTop: "10px",
                      marginRight: "10px",
                      width: "100%",
                    }}
                  >
                    <Autocomplete
                      size="small"
                      name="enclosure"
                      autoHighlight
                      options={enclosureArr?.map((option) => option)}
                      value={NOF1 || null}
                      onChange={(e, value) => handleChange1(value)}
                      getOptionLabel={(option) => `${option.fileName} `}
                      renderInput={(params, i) => (
                        <>
                          <TextField
                            {...params}
                            variant="outlined"
                            style={{
                              width: 300,
                              marginRight: "15px",
                            }}
                            label={t("documents")}
                            id={i}
                          />
                        </>
                      )}
                    />
                    <Tooltip title={t("upload")} aria-label="upload">
                      <div>
                        <ActionPointFileUploader
                          viewDetails={viewDetails}
                          newFileData={newFileData}
                        />
                      </div>
                    </Tooltip>
                    {/* {buttonTheme(enclosureArr)} */}
                    <Tooltip title={t("delete")} aria-label="delete">
                      <Button
                        aria-label="delete"
                        variant="contained"
                        color="secondary"
                        disabled={
                          fileUploaderRoleName !== displayRoleName ||
                          viewDetails?.completed === true || enclosureArr.length===0
                        }
                        style={{
                          minWidth: "12px",
                          height: "36px",
                          padding: "12px 11px",
                          marginLeft: "10px",
                        }}
                        onClick={deleteEnclosureData}
                      >
                        <DeleteIcon style={{ fontSize: "18px" }} />
                      </Button>
                    </Tooltip>
                  </div>

                  <div style={{ height: "92%" }}>
                    <SplitViewPdfViewer
                      extension={extension}
                      pdfLoading={pdfLoading}
                      action
                      fileUrl={URL}
                      pdfLoads={(val) => {
                        setEnclosurePdfLoads(val);
                      }}
                    />
                  </div>
                </div>
              </SplitterComponent>
            </TabPanel>
          </Tabs>
        </DialogContent>
      </div>

      <Dialog open={viewStatus}>
        <ViewAssignTaskUsrStatas
          assigneePreStatus={assigneePreStatus}
          viewStatushandleClose={viewStatushandleClose}
        />
      </Dialog>

      {/* Assign further dialog */}

      <Dialog
        className="header-tab assign-further"
        open={assignFurtherDialoge}
        PaperComponent={PaperComponent}
      >
        <AssignFurtherForm
          id={viewDetails?.id}
          description={viewDetails?.description}
          getAllTaskData={props.getAllTaskData}
          assignFurtherhandleClose={assignFurtherhandleClose}
          assignFurtherDialoge={assignFurtherDialoge}
          assignFurtherObj={props.rowData}
        />
      </Dialog>

      <Dialog open={markComplete} PaperComponent={PaperComponent}>
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          {t("mark_completed")}
          <Tooltip title={t("cancel")}>
            <IconButton
              id="mark_markcompled"
              aria-label="close"
              onClick={markCompletedhandleClose}
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
          <DialogContentText>
            <Typography variant="h6" gutterBottom>
              {t("are_you_sure_you_want_to_complete_this_task")}
            </Typography>
            <Stack sx={{ pl: "6rem" }}>
              {/* <Typography component="legend">Rating</Typography> */}
              {/* <Rating
                name="simple-controlled"
                value={ratingValue}
                onChange={(event, newValue) => {
                  setRatingValue(newValue);
                }}
              /> */}
            </Stack>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            // className="resetButton"
            color="primary"
            style={{ width: "100px" }}
            onClick={markCompletedhandleClose}
          >
            {t("no")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            // className="submitButton"
            style={{ width: "100px" }}
            onClick={() => {
              markCompletedFun();
              markCompletedhandleClose();
            }}
          >
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function mapStateToProps(state) {
  return {
    props: state.props,
    // subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  viewDetail,
  filesDetele,
  markCompleted,
  getAllFiles,
  viewTaskDetails,
  cumulatedStatus,
  PreviousStatus,
})(ViewDetailStatus);
