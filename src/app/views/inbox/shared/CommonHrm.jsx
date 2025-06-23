import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  TextField,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import {
  getInternalServiceNumber,
  sendInternalCorespondence,
  sendFilesInternalServiceNumber,
} from "../../../camunda_redux/redux/action";
import { changingTableStateInbox } from "../../../camunda_redux/redux/action/apiTriggers";
import { Add, Cancel, RateReviewOutlined, Send } from "@material-ui/icons";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { debounce } from "utils";
import history from "../../../../history";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Loading } from "../therme-source/material-ui/loading";

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

const CommonHrm = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [addRemark, setaddRemark] = useState(false);
  const [intService, setIntService] = useState("");
  const [intServiceList, setIntServiceList] = useState([]);

  const [sentCount, setsentCount] = useState(0); // to know whether all daks or files has been sent or not

  const [sendToDep, setsendToDep] = useState("");
  const [role, setRole] = useState("");

  useEffect(() => {
    handleInputValueChangeInternalService();
  }, []);

  const initialValue = {
    remark: "",
  };

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

  useEffect(() => {
    const { blnValueInbox } = props.subscribe;
    if (
      props?.checkedData?.length &&
      sentCount === props?.checkedData?.length
    ) {
      callMessageSuccess(t("doc_sent_successfully"));
      props.changingTableStateInbox(!blnValueInbox, "CHANGE_INBOX");
      props.reset();
      props.handleCloseEvent();
      setLoading(false);
    } else if (sentCount == "trigger" && props?.checkedData?.length) {
      props.changingTableStateInbox(true, "CHANGE_INBOX");
      callMessageOut("An Error Occured While Sending The Files");
      setLoading(false);
    }
  }, [sentCount, props?.checkedData]);

  const reload = () => {
    if (props.checkedData) {
      props.reload();
    }
  };

  const callMessageOut = (msg) => {
    dispatch(setSnackbar(true, "error", msg));
  };

  const callMessageSuccess = (msg) => {
    dispatch(setSnackbar(true, "success", t(msg)));
  };

  const handleSend = (val) => {
    const inboxids = props?.checkedData;
    console.log(inboxids);
    if (inboxids?.length) {
      inboxids.forEach((inbox) => {
        handleSendType(
          val,
          inbox?.id,
          inbox?.type,
          inbox?.referenceNumber,
          true
        );
      });
    } else if (props.fileId) {
      handleSendType(val, props.fileId);
    }
  };

  const handleSendType = (val, fileId, type, referenceNumber, multiple) => {
    setLoading(true);
    const { remark } = formik.values;
    const fromRole = sessionStorage.getItem("role");
    if (intService && !isNullOrUndefined(intService) && type != "File") {
      const body = intService.deptRole[0];
      props
        .sendInternalCorespondence(
          fileId,
          [body],
          [],
          [],
          [],
          [],
          [],
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
                callMessageSuccess(t("doc_sent_successfully"));
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
    } else if (intService && !isNullOrUndefined(intService)) {
      let remarkBody = {
        comment: "",
        department: sessionStorage.getItem("department"),
        pcId: sessionStorage.getItem("partcaseID"),
        by: sessionStorage.getItem("role"),
      };
      const intServiceNumberData = {
        groupName: intService.deptRole[0]?.deptName,
        roleName: role,
        userName: intService.deptUsername,
        fromRole: fromRole,
        displayDeptName: intService?.deptDisplayName,
        displayRoleName: intService?.deptRole[0]?.displayRoleName,
      };
      props
        .sendFilesInternalServiceNumber(
          fileId,
          intServiceNumberData,
          val,
          referenceNumber,
          remarkBody,
          null,
          sendToDep,
          remark
        )
        .then((resp) => {
          try {
            if (resp.error) {
              setLoading(false);
              callMessageOut(resp.error);
              setsentCount("trigger");
            } else {
              if (multiple) {
                setsentCount((c) => c + 1);
              } else {
                callMessageSuccess();
                setTimeout(() => {
                  history.push({ pathname: "/eoffice/inbox/file" });
                }, 0);
                props.handleCloseEvent();
                setLoading(false);
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

  const handleInputValueChangeInternalService = async (newValue) => {
    const dept = sessionStorage.getItem("department");
    await props
      .getInternalServiceNumber("", dept)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            let tmpArray = [];
            setIntServiceList(resp.data);
          }
        } catch (err) {
          callMessageOut(err.message);
        }
      })
      .catch((err) => {
        callMessageOut(err.message);
      });
  };

  const handleOnChangeInternalService = async (val) => {
    console.log(val);
    if (val && typeof val === "object" && "id" in val) {
      if (!isNullOrUndefined(val)) {
        let roleData = val?.deptRole?.[0]?.roleName;
        let deptName = val?.deptRole?.[0]?.deptName;
        setRole(roleData);
        setIntService(val);
        setsendToDep(deptName);
      } else {
        setIntService("");
      }
    } else {
      setIntService("");
    }
  };

  const optimizedInternalService = useCallback(
    debounce(handleInputValueChangeInternalService),
    []
  );


  return (
    <>
      {loading && <Loading />}
      <DialogContent dividers>
        <Card elevation={10}>
          <CardHeader
            title={t("internal")}
            style={{
              backgroundColor: "#354c64",
              color: "white",
              padding: "3px 8px",
              borderRadius: "6px 6px 0px 0px",
            }}
          />
          <CardContent>
            <FormControl style={{ width: "100%", marginBottom: "1rem" }}>
              <Autocomplete
                freeSolo
                forcePopupIcon={true}
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
                  !newInputValue.includes("|") &&
                    optimizedInternalService(newInputValue);
                }}
                filterSelectedOptions
                getOptionDisabled={(option) =>
                  option?.deptUsername === intService?.deptUsername
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    style={{ width: "100%" }}
                    variant="outlined"
                    label={t("search_by_service_number")}
                    placeholder={t("enter_service_number")}
                    className={props.theme ? "darkTextField" : ""}
                  />
                )}
              />
            </FormControl>
            <TextField
              fullWidth
              id="remark"
              name="remark"
              label={t("comment")}
              value={formik.values.remark}
              onChange={formik.handleChange}
              multiline
              minRows={10}
              variant="outlined"
            />
          </CardContent>
        </Card>
      </DialogContent>
      <DialogActions>
        {/**
        <Button
        id="hrm_add_remark_button"
        variant="contained"
        color="primary"
        onClick={() => setaddRemark(true)}
        endIcon={<RateReviewOutlined />}
      >
        {t("comment")}
      </Button>
      */}

        <Button
          id="inbox_HrmDialog_send_button"
          variant="contained"
          color="secondary"
          onClick={() => handleSend(false)}
          disabled={!intService}
          endIcon={<Send />}
        >
          {t("send")}
        </Button>
      </DialogActions>

      <Dialog
        open={addRemark}
        onClose={() => {
          setaddRemark(false);
        }}
      >
        <DialogTitle>
          <Box className={classes.remark_title}>
            {t("write_comment")}
            <IconButton
              id="remark-close-button"
              aria-label="close"
              onClick={() => {
                setaddRemark(false);
              }}
              color="primary"
            >
              <Cancel />
            </IconButton>
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
  getInternalServiceNumber,
  changingTableStateInbox,
  sendInternalCorespondence,
  sendFilesInternalServiceNumber,
})(CommonHrm);
