import React, { Component } from "react";
import {
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Typography,
} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

import { withStyles } from "@material-ui/styles";
import PersonalAppTable from "./PersonalAppTable";
import PersonalFileTable from "./PersonalFileTable";
import DraftPaFileTable from "./DraftPaTable";
import { Breadcrumb } from "../../../matx";
// import StartProcessPage from "../initiate/shared/startProcess/StartProcessPage";

import InfoForm from "./InfoForm";
import { getPersonalInfo } from "../../camunda_redux/redux/action";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { element, PropTypes } from "prop-types";
import PersonalApplicationForm from "./PersonalApplicationForm";
import PersonalFileForm from "./PersonalFileForm";
import { useTranslation } from "react-i18next";
import { withTranslation } from "react-i18next";
import Draggables from "react-draggable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Loading } from "./therme-source/material-ui/loading";
import "../inbox/therme-source/material-ui/loading.css";
import CancelIcon from "@material-ui/icons/Cancel";
import CancelOutlinedIcon from "@material-ui/icons/CancelOutlined";
import { clearCookie } from "utils";
import CorrespondenceForm from "../Correspondence/CorrespondenceForm";
import { Cancel, Close } from "@material-ui/icons";
import MrDraftDakTable from "./MrDraftDakTable";
import MrDraftFileTable from "./MrDraftFileTable";
// import CorrespondenceForm from "../Correspondence/CorrespondenceForm";

const PaperComponent = (props) => {
  const { t } = useTranslation();
  return (
    <Draggables handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggables>
  );
};
const styles = (theme) => ({});
class Personnel extends Component {
  state = {
    // initializing state of class component
    open: false,
    openPA: false,
    openCorr: false,
    openInfo: false,
    loading: false,
    blnDisableButtoms: false,
    isActive: false,
    pa: false,
    pf: false,
    updateSubject: false,
    draftSubject: "",
    draftId: "",
    fileSubject: "",
    fileId: "",
    nof: "",
    resize: true,
    isMr: sessionStorage.getItem("isMr") == "true",
    container: [
      // {
      //   id: 1,
      //   name: "my_personal_application",
      //   component: (
      //     <PersonalAppTable
      //       blnEnableLoader={(val) => this.setState({ loading: val })}
      //     />
      //   ),
      //   width: 4,
      // },
      {
        id: 1,
        name: "draft_personal_file",

        component: (
          <DraftPaFileTable
            blnDisableButtoms={this.state?.blnDisableButtoms}
            handleClick={() => this.setState({ openPA: true })}
            handleResize={(val) => this.setState({ resize: val })}
            handleUpdateSubject={(val) =>
              this.setState({
                openPA: true,
                updateSubject: true,
                draftSubject: val.subject,
                draftId: val.id,
              })
            }
            blnEnableLoader={(val) => this.setState({ loading: val })}
          />
        ),
        width: 4,
      },
    ],
    container1: [
      // {
      //   id: 1,
      //   name: "my_personal_application",
      //   component: (
      //     <PersonalAppTable
      //       blnEnableLoader={(val) => this.setState({ loading: val })}
      //     />
      //   ),
      //   width: 4,
      // },

      {
        id: 1,
        name: "draft_personal_file",

        component: (
          <DraftPaFileTable
            blnDisableButtoms={this.state?.blnDisableButtoms}
            handleClick={() => this.setState({ openPA: true })}
            handleResize={(val) => this.setState({ resize: val })}
            handleUpdateSubject={(val) =>
              this.setState({
                openPA: true,
                updateSubject: true,
                draftSubject: val.subject,
                draftId: val.id,
              })
            }
            blnEnableLoader={(val) => this.setState({ loading: val })}
          />
        ),
        width: 4,
      },

      {
        id: 2,
        name: "my_personal_file",
        component: (
          <PersonalFileTable
            handleClick={() => this.setState({ open: true })}
            handleResize={(val) => this.setState({ resize: val })}
            blnDisableButtoms={this.state?.blnDisableButtoms}
            blnEnableLoader={(val) => this.setState({ loading: val })}
            handleUpdateSubject={(val) =>
              this.setState({
                open: true,
                updateSubject: true,
                fileSubject: val.subject,
                fileId: val.id,
              })
            }
          />
        ),
        width: 4,
      },
    ],
    container2: [
      {
        id: 1,
        name: "draft_personal_file",

        component: (
          <DraftPaFileTable
            correspondence={true}
            blnDisableButtoms={this.state?.blnDisableButtoms}
            handleClick={() => this.setState({ openCorr: true })}
            handleUpdateSubject={(val) =>
              this.setState({
                openCorr: true,
                updateSubject: true,
                draftSubject: val.subject,
                draftId: val.id,
              })
            }
            blnEnableLoader={(val) => this.setState({ loading: val })}
          />
        ),
        width: 4,
      },
      {
        id: 2,
        name: "my_personal_file",
        component: (
          <PersonalFileTable
            file={true}
            handleClick={() => this.setState({ open: true })}
            handleResize={(val) => this.setState({ resize: val })}
            blnDisableButtoms={this.state?.blnDisableButtoms}
            blnEnableLoader={(val) => this.setState({ loading: val })}
            handleUpdateSubject={(val) =>
              this.setState({
                open: true,
                updateSubject: true,
                fileSubject: val.subject,
                fileId: val.id,
              })
            }
          />
        ),
        width: 4,
      },
    ],
    container3: [
      {
        id: 1,
        name: "draft_personal_file",

        component: (
          <DraftPaFileTable
            correspondence={true}
            blnDisableButtoms={this.state?.blnDisableButtoms}
            handleClick={() => this.setState({ openCorr: true })}
            handleUpdateSubject={(val) =>
              this.setState({
                openCorr: true,
                updateSubject: true,
                draftSubject: val.subject,
                draftId: val.id,
              })
            }
            blnEnableLoader={(val) => this.setState({ loading: val })}
          />
        ),
        width: 4,
      },

      {
        id: 2,
        name: "my_personal_file",
        component: (
          <PersonalFileTable
            file={true}
            handleClick={() => this.setState({ open: true })}
            handleResize={(val) => this.setState({ resize: val })}
            blnDisableButtoms={this.state?.blnDisableButtoms}
            blnEnableLoader={(val) => this.setState({ loading: val })}
            handleUpdateSubject={(val) =>
              this.setState({
                open: true,
                updateSubject: true,
                fileSubject: val.subject,
                fileId: val.id,
              })
            }
          />
        ),
        width: 4,
      },
    ],
    container4: [
      {
        id: 1,
        name: "draft_dak",

        component: (
          <MrDraftDakTable
            blnEnableLoader={(val) => this.setState({ loading: val })}
          />
        ),
        width: 4,
      },
    ],
    container5: [
      {
        id: 1,
        name: "draft_dak",

        component: (
          <MrDraftDakTable
            blnEnableLoader={(val) => this.setState({ loading: val })}
          />
        ),
        width: 4,
      },

      {
        id: 2,
        name: "draft_file",
        component: (
          <MrDraftFileTable
            blnEnableLoader={(val) => this.setState({ loading: val })}
          />
        ),
        width: 4,
      },
    ],
  };

  componentDidMount() {
    this.personalInfoAbort = new AbortController();
    const username = localStorage.getItem("username");
    const mrRole = sessionStorage.getItem("mrRole");
    let formData = new FormData();
    formData.append("username", username);
    // this.props
    //   .getPersonalInfo(formData, this.personalInfoAbort.signal)
    //   .then((res) => {
    //     if (res?.error?.includes("aborted")) {
    //       return;
    //     }
    //     if (res.status === "OK") {
    //       this.setState({ blnDisableButtoms: false });
    //     } else {
    //       this.setState({ blnDisableButtoms: true });
    //     }
    //   })
    //   .catch((e) => {
    //     console.log(e);
    //   });

    // if (this.props.myInfo === false) {
    //   this.setState({ openInfo: true });
    // } else {
    //   this.setState({ openInfo: false });
    // }

    sessionStorage.removeItem("InboxID");
    sessionStorage.removeItem("pa_id");
    sessionStorage.removeItem("partcaseID");
    sessionStorage.removeItem("paFileId");
    sessionStorage.removeItem("route");
    clearCookie();

    if (this.props.user?.roleName == mrRole) {
      this.setState({
        isMr: true,
      });
    }
  }

  componentWillUnmount() {
    this.personalInfoAbort.abort();
  }
  handleCloseEvent = (e) => {
    // callback function that fires when record of Personal File has been saved
    this.setState({ open: e });
  };

  handleRemove(id) {
    if (this.state.container.length === 2) {
      const newList = this.state.container.filter((item) => item.id !== id);

      this.setState({ container: newList });
      if (id === 1) {
        this.setState({ pa: true });
      } else if (id === 2) {
        this.setState({ pf: true });
      }
    }
  }

  handleRemove2(id) {
    if (this.state.container2.length === 2) {
      const newList = this.state.container2.filter((item) => item.id !== id);

      this.setState({ container2: newList });
      if (id === 1) {
        this.setState({ pa: true });
      } else if (id === 2) {
        this.setState({ pf: true });
      }
    }
  }

  handleRemove3(id) {
    if (this.state.container4.length === 2) {
      const newList = this.state.container4.filter((item) => item.id !== id);

      this.setState({ container4: newList });
      if (id === 1) {
        this.setState({ pa: true });
      } else if (id === 2) {
        this.setState({ pf: true });
      }
    }
  }

  handleShow(id) {
    let arr = [];

    this.state.container1.map((element) => {
      this.state.container.map((item) => {
        if (item.id === element.id) {
          arr.push(item);
        }
      });
    });

    let showItem = this.state.container1.find((item) => item.id === id);
    arr.push(showItem);

    this.setState({ container: arr });
    if (id === 2) {
      this.setState({ pf: false });
    } else if (id === 1) {
      this.setState({ pa: false });
    }
  }

  handleShow2(id) {
    let arr = [];
    this.state.container3.map((element) => {
      this.state.container2.map((item) => {
        if (item.id === element.id) {
          arr.push(item);
        }
      });
    });

    let showItem = this.state.container3.find((item) => item.id === id);
    arr.push(showItem);

    this.setState({ container2: arr });
    if (id === 2) {
      this.setState({ pf: false });
    } else if (id === 1) {
      this.setState({ pa: false });
    }
  }

  handleShow3(id) {
    let arr = [];
    this.state.container5.map((element) => {
      this.state.container4.map((item) => {
        if (item.id === element.id) {
          arr.push(item);
        }
      });
    });

    let showItem = this.state.container5.find((item) => item.id === id);
    arr.push(showItem);

    this.setState({ container4: arr });
    if (id === 2) {
      this.setState({ pf: false });
    } else if (id === 1) {
      this.setState({ pa: false });
    }
  }

  handleCloseEventPA = (e) => {
    // callback function that fires when record of Personal File has been saved
    this.setState({ openPA: e });
  };

  dragEnd = (result) => {
    if (!result.destination) return;
    const containerItems = [...this.state.container];

    const [orderedContainer] = containerItems.splice(result.source.index, 1);
    containerItems.splice(result.destination.index, 0, orderedContainer);

    this.setState({ container: containerItems });
  };

  render() {
    const {
      loading,
      blnDisableButtoms,
      openInfo,
      container,
      container2,
      container4,
      updateSubject,
      draftSubject,
      draftId,
      fileSubject,
      fileId,
      nof,
      resize,
      isMr,
    } = this.state;

    const { t, myInfo, isCorres, theme } = this.props;

    return (
      <div style={{ padding: "1px 0", margin: "2px 10px 0px 10px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumb />
          </Grid>
          {/*!myInfo && (
            <Grid item xs={12} style={{ textAlign: "center" }}>
              <Typography component="h4">
                <span style={{ color: "red" }}>
                  ***{t("please")} {t("update")} <b>{t("my_info")} </b>
                  {t("before_further_processing")}.***
                </span>
              </Typography>
            </Grid>
          )*/}
        </Grid>

        {/* Condition for either correspondence or pa as component for both is almost same */}
        {isMr ? (
          <div
            style={{
              display: "flex",
              marginTop: "-14px",
            }}
          >
            <div
              style={{
                width: "100%",
                // boxShadow:
                //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                borderRadius: "10px",
              }}
            >
              <DragDropContext onDragEnd={this.dragEnd}>
                <Droppable
                  droppableId="itemSequence"
                  direction="horizontal"
                  type="column"
                >
                  {(provided) => (
                    <Grid
                      container
                      // justifyContent="center"
                      spacing={2}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {this.state.container4.map(
                        ({ component, width, id }, i) => (
                          <Draggable
                            draggableId={`draggable-${i}`}
                            key={`draggable-${i}`}
                            index={i}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <Grid
                                item
                                md={
                                  container4.length == 1
                                    ? 12
                                    : container4.length == 2
                                    ? 6
                                    : width
                                }
                                xs={12}
                                className="personal-file"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                // style={{position: "relative"}}
                              >
                                <div className="div_wrap">
                                  {/*
                                  <Tooltip title={t("close")}>
                                    <IconButton
                                      id={`Personnnel_cancel_btn_${i}`}
                                      size="small"
                                      style={{
                                        color: theme
                                          ? "#fff"
                                          : "rgba(0, 0, 0, 0.54)",
                                      }}
                                      className="icons-button"
                                      onClick={() => this.handleRemove3(id)}
                                    >
                                      <CancelIcon
                                        style={{
                                          height: "1.7rem",
                                          width: "1.7rem",
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  */}

                                  {component}
                                </div>
                              </Grid>
                            )}
                          </Draggable>
                        )
                      )}

                      {loading && <Loading />}
                      {provided.placeholder}
                    </Grid>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            {/**
             <div>
              <ul
                style={{
                  position: "sticky",
                  right: "16px",
                  padding: 0,
                }}
              >
                {this.state.pa ? (
                  <li className="hide" onClick={() => this.handleShow3(1)}>
                    DRAFT DAK
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    DRAFT DAK
                  </li>
                )}

                {this.state.pf ? (
                  <li className="hide" onClick={() => this.handleShow3(2)}>
                    DRAFT FILE
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    DRAFT FILE
                  </li>
                )}
              </ul>
            </div> 
             
            */}

            {loading && <Loading />}
          </div>
        ) : isCorres && !isMr ? (
          <div
            style={{
              display: "flex",
              marginTop: "-14px",
            }}
          >
            <div
              style={{
                width: "100%",
                // boxShadow:
                //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
                borderRadius: "10px",
              }}
            >
              <DragDropContext onDragEnd={this.dragEnd}>
                <Droppable
                  droppableId="itemSequence"
                  direction="horizontal"
                  type="column"
                >
                  {(provided) => (
                    <Grid
                      container
                      // justifyContent="center"
                      spacing={2}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {this.state.container2.map(
                        ({ component, width, id }, i) => (
                          <Draggable
                            draggableId={`draggable-${i}`}
                            key={`draggable-${i}`}
                            index={i}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <Grid
                                item
                                md={
                                  container2.length == 1
                                    ? 12
                                    : container2.length == 2
                                    ? 6
                                    : width
                                }
                                xs={12}
                                className="personal-file"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                // style={{position: "relative"}}
                              >
                                <div className="div_wrap">
                                  {/*
                                  <Tooltip title={t("close")}>
                                    <IconButton
                                      id={`Personnnel_cancel_btn_${i}`}
                                      size="small"
                                      style={{
                                        color: theme
                                          ? "#fff"
                                          : "rgba(0, 0, 0, 0.54)",
                                      }}
                                      className="icons-button"
                                      onClick={() => this.handleRemove2(id)}
                                    >
                                      <CancelIcon
                                        style={{
                                          height: "1.7rem",
                                          width: "1.7rem",
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  */}

                                  {component}
                                </div>
                              </Grid>
                            )}
                          </Draggable>
                        )
                      )}

                      {loading && <Loading />}
                      {provided.placeholder}
                    </Grid>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
            {/**
             <div>
              <ul
                style={{
                  position: "sticky",
                  right: "16px",
                  padding: 0,
                }}
              >
                {this.state.pa ? (
                  <li className="hide" onClick={() => this.handleShow2(1)}>
                    DRAFT DAK
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    DRAFT DAK
                  </li>
                )}

                {this.state.pf ? (
                  <li className="hide" onClick={() => this.handleShow2(2)}>
                    DRAFT FILE
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    DRAFT FILE
                  </li>
                )}
              </ul>
            </div>
            */}

            {loading && <Loading />}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
            }}
          >
            <div
              style={{
                width: "100%",
              }}
            >
              <DragDropContext onDragEnd={this.dragEnd}>
                <Droppable
                  droppableId="itemSequence"
                  direction="horizontal"
                  type="column"
                >
                  {(provided) => (
                    <Grid
                      container
                      // justifyContent="center"
                      spacing={2}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {this.state.container.map(
                        ({ component, width, id }, i) => (
                          <Draggable
                            draggableId={`draggable-${i}`}
                            key={`draggable-${i}`}
                            index={i}
                            isDragDisabled={true}
                          >
                            {(provided) => (
                              <Grid
                                item
                                md={
                                  container.length == 1
                                    ? 12
                                    : container.length == 2
                                    ? 6
                                    : width
                                }
                                xs={12}
                                className="personal-file"
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                ref={provided.innerRef}
                                // style={{position: "relative"}}
                              >
                                <div className="div_wrap">
                                  {/*
                                  <Tooltip title={t("close")}>
                                    <IconButton
                                      id={`Personnnel_cancel_btn_${i}`}
                                      style={{
                                        color: theme
                                          ? "#fff"
                                          : "rgba(0, 0, 0, 0.54)",
                                      }}
                                      className="icons-button"
                                      onClick={() => this.handleRemove(id)}
                                    >
                                      <CancelIcon
                                        style={{
                                          height: "1.7rem",
                                          width: "1.7rem",
                                        }}
                                      />
                                    </IconButton>
                                  </Tooltip>
                                  */}

                                  {component}
                                </div>
                              </Grid>
                            )}
                          </Draggable>
                        )
                      )}

                      {loading && <Loading />}
                      {provided.placeholder}
                    </Grid>
                  )}
                </Droppable>
              </DragDropContext>
            </div>

            <div>
              <ul
                style={{
                  position: "sticky",
                  right: "16px",
                  padding: 0,
                }}
              >
                {this.state.pa ? (
                  <li className="hide" onClick={() => this.handleShow(1)}>
                    APPLICATION
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    APPLICATION
                  </li>
                )}

                {this.state.pf ? (
                  <li className="hide" onClick={() => this.handleShow(2)}>
                    FILES
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    FILES
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        <div>
          <Dialog
            open={this.state.open}
            onClose={(event, reason) => {
              if (reason === "escapeKeyDown") {
                this.setState({ open: false });
              }
            }}
            aria-labelledby="draggable-dialog-title"
            PaperComponent={PaperComponent}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              id="draggable-dialog-title"
              style={{ cursor: "move" }}
              className="send_dialog"
            >
              {isCorres
                ? t("select_corress_file")
                : t("create_a_personal_file")}
              <Tooltip title={t("close")}>
                <IconButton
                  id="create_a_personal_file_closeBtn"
                  aria-label="close"
                  onClick={() => this.setState({ open: false })}
                  color="primary"
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
            {/* <StartProcessPage process={'personalFile'} handleCloseEvent={this.handleCloseEvent} didMounting={this.mountData}/> */}
            <PersonalFileForm
              correspondence={isCorres}
              handleClose={() =>
                this.setState({ open: false, updateSubject: false })
              }
              handleClickFile={() => this.setState({ open: true })}
              updateSubject={updateSubject}
              fileSubject={fileSubject}
              fileId={fileId}
              selectNof={(file) =>
                this.setState({ nof: file, open: false, updateSubject: false })
              }
            />
          </Dialog>

          <Dialog
            open={this.state.openPA}
            onClose={(event, reason) => {
              if (reason === "escapeKeyDown") {
                this.setState({ openPA: false, updateSubject: false });
              }
            }}
            aria-labelledby="draggable-dialog-title"
            PaperComponent={PaperComponent}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              id="draggable-dialog-title"
              style={{ cursor: "move" }}
              className="send_dialog"
            >
              {t("create_a_personal_application")}
              <Tooltip title={t("close")}>
                <IconButton
                  id="Personnel_btnClose"
                  aria-label="close"
                  onClick={() =>
                    this.setState({ openPA: false, updateSubject: false })
                  }
                  color="primary"
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
            {/* <StartProcessPage process={'personalApplication'} handleCloseEvent={this.handleCloseEventPA} didMounting={this.mountData}/> */}
            <PersonalApplicationForm
              handleClose={() =>
                this.setState({ openPA: false, updateSubject: false })
              }
              handleClickFile={() => this.setState({ open: true })}
              updateSubject={updateSubject}
              draftSubject={draftSubject}
              draftId={draftId}
            />
          </Dialog>

          <Dialog
            open={this.state.openCorr}
            onClose={(event, reason) => {
              if (reason === "escapeKeyDown") {
                this.setState({
                  openCorr: false,
                  updateSubject: false,
                  nof: "",
                });
              }
            }}
            aria-labelledby="draggable-dialog-title"
            PaperComponent={PaperComponent}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle
              id="draggable-dialog-title"
              style={{ cursor: "move" }}
              className="send_dialog"
            >
              {updateSubject
                ? t("edit_corr_subject")
                : t("create_a_correspondence")}
              <Tooltip title={t("close")}>
                <IconButton
                  id="Personnel_btnClose"
                  aria-label="close"
                  onClick={() =>
                    this.setState({
                      openCorr: false,
                      updateSubject: false,
                      nof: "",
                    })
                  }
                  color="primary"
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
            <CorrespondenceForm
              handleClose={() =>
                this.setState({
                  openCorr: false,
                  updateSubject: false,
                  nof: "",
                })
              }
              handleClickFile={() => this.setState({ open: true })}
              updateSubject={updateSubject}
              draftSubject={draftSubject}
              draftId={draftId}
              nofFile={nof}
              selectNof={(file) => this.setState({ nof: file })}
            />
          </Dialog>

          <Dialog
            open={openInfo}
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
              style={{ cursor: "move" }}
              className="send_dialog"
            >
              <span>{t("personal_information")}</span>
              <IconButton
                id="PA_info_btn"
                aria-label="close"
                color="primary"
                onClick={() => this.setState({ openInfo: false })}
                className="cancel-drag"
              >
                <CancelIcon
                  style={{
                    color: theme ? "#fff" : "#484747",
                  }}
                />
              </IconButton>
            </DialogTitle>
            <InfoForm
              handleSubmit={(val) => this.setState({ openInfo: val })}
              disableBtn={(val) => this.setState({ blnDisableButtoms: val })}
            />
          </Dialog>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  getPersonalInfo: PropTypes.func.isRequired,
  theme: state.theme,
  myInfo: state.myInfo,
  user: state.user?.currentUserRole,
});

export default withRouter(
  connect(mapStateToProps, { getPersonalInfo })(withTranslation()(Personnel))
);
