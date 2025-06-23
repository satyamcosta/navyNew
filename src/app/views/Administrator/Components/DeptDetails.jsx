import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  FormControl,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Cancel, Edit, Send } from "@material-ui/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  getAdminData,
  updateAdminData,
  updateAdminRole,
} from "app/camunda_redux/redux/action";
import { handleError } from "utils";
import { Loading } from "../therma-source/loading";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Autocomplete } from "@material-ui/lab";
import { isNullOrUndefined } from "@syncfusion/ej2-base";

const configData = {
  fullWidth: true,
  size: "small",
};

const DeptDetails = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(false);
  const [edit, setEdit] = useState(false);
  const [adminList, setAdminList] = useState([]);
  const [coorRole, setCoorRole] = useState(sessionStorage.getItem("coordRole"));
  const [roleList, setRoleList] = useState([]);

  const deptDisplay = sessionStorage.getItem("displayDept");
  const mrRole = sessionStorage.getItem("mrRole");

  const handleEdit = () => {
    setLoading(true);
    props.updateAdminData(coorRole).then((resp) => {
      try {
        if (resp.error) {
          if (resp?.error?.includes("aborted")) {
            return;
          }
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
          setLoading(false);
        } else {
          callMessageSuccess(t("admin_data_succ"));
          setEdit(false);
          setLoading(false);
        }
      } catch (e) {
        let errMsg = handleError(resp.error);
        callMessageOut(errMsg);
        setLoading(false);
      }
    });
  };

  const handleClose = () => {
    setEdit(false);
  };

  const callMessageSuccess = (message) => {
    dispatch(setSnackbar(true, "success", message));
  };

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    getAdminData();
  }, []);

  const getAdminData = () => {
    setLoading(true);
    props.getAdminData().then((resp) => {
      try {
        if (resp.error) {
          if (resp?.error?.includes("aborted")) {
            return;
          }
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
          setLoading(false);
        } else {
          console.log(resp);
          setRoleList(resp.Roles);
          setAdminList(resp.AdminRoles);
          setCoorRole(resp.coordRole);
          // const secArr = Object.entries(resp.subSec).map(([key, value], i) => {
          //   return {
          //     section: key,
          //     range: value,
          //   };
          // });

          // props.handleData(resp.Roles, secArr);
          setLoading(false);
        }
      } catch (e) {
        let errMsg = handleError(resp.error);
        callMessageOut(errMsg);
        setLoading(false);
      }
    });
  };

  const handleAdminRemove = (val) => {
    if (val && typeof val === "object" && "displayRoleName" in val) {
      if (!isNullOrUndefined(val)) {
        props.updateAdminRole(val.roleName).then((resp) => {
          try {
            if (resp.error) {
              if (resp?.error?.includes("aborted")) {
                return;
              }
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
              setLoading(false);
            } else {
              setAdminList(resp.AdminRoles);
              setLoading(false);
            }
          } catch (e) {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setLoading(false);
          }
        });
        // setadminUi((prev)=>prev.concat())
      } else {
        setAdminList([]);
      }
    }
  };

  const handleAdminChange = async (val) => {
    if (val && typeof val === "object" && "displayRoleName" in val) {
      if (!isNullOrUndefined(val)) {
        setIsAdminLoading(true);
        props.updateAdminRole(val.roleName).then((resp) => {
          try {
            if (resp.error) {
              if (resp?.error?.includes("aborted")) {
                return;
              }
              let errMsg = handleError(resp.error);
              callMessageOut(errMsg);
              setIsAdminLoading(false);
            } else {
              setAdminList(resp.AdminRoles);
              setIsAdminLoading(false);
            }
          } catch (e) {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setIsAdminLoading(false);
          }
        });
        // setadminUi((prev)=>prev.concat())
      } else {
        setAdminList([]);
      }
    }
  };

  return (
    <>
      <Card elevation={3}>
        {loading && <Loading />}
        <div className="card-header">
          <Typography variant="h6">{t("dept_info")}</Typography>
          {edit ? (
            <Tooltip title={t("cancel")}>
              <IconButton
                aria-label="settings"
                color={props.theme ? "secondary" : "primary"}
                onClick={handleClose}
              >
                <Cancel />
              </IconButton>
            </Tooltip>
          ) : (
            <Tooltip title={t("edit")}>
              <IconButton
                aria-label="settings"
                color={props.theme ? "secondary" : "primary"}
                onClick={() => setEdit(true)}
              >
                <Edit />
              </IconButton>
            </Tooltip>
          )}
        </div>

        <CardContent className="card-detail-body">
          <div className="card-detail">
            <Typography variant="subtitle1">{t("dept_name")}</Typography>
            <Typography variant="body1">{deptDisplay}</Typography>
          </div>
          <div className="card-detail">
            <Typography variant="subtitle1">{t("principal_usr")}</Typography>
            {edit ? (
              <TextField
                {...configData}
                id="outlined-select-currency"
                select
                label={t("type")}
                name="type"
                required
                value={coorRole}
                onChange={(e) => setCoorRole(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
                placeholder="Select Principal User"
                variant="outlined"
                className={` corr-form-select ${
                  props.theme ? "darkTextField" : ""
                }`}
              >
                {roleList.map((option, i) => (
                  <MenuItem key={i} value={option.roleName}>
                    {option.displayRoleName}
                  </MenuItem>
                ))}
              </TextField>
            ) : (
              <Typography variant="body1">{coorRole}</Typography>
            )}
          </div>
          <div className="card-detail">
            <Typography variant="subtitle1">{t("admin_role")}</Typography>
            {edit && (
              <FormControl style={{ width: "100%" }}>
                <Autocomplete
                  freeSolo
                  options={roleList}
                  getOptionLabel={(option) => {
                    if (typeof option === "object") {
                      return option?.displayRoleName;
                    } else {
                      return "";
                    }
                  }}
                  id="tags-outlined"
                  onChange={(event, newValue) => {
                    handleAdminChange(newValue);
                  }}
                  filterSelectedOptions
                  getOptionDisabled={(option) => {
                    return adminList.some((item) => {
                      if (item.displayRoleName) {
                        return item.displayRoleName == option?.displayRoleName;
                      }
                    });
                  }}
                  disableClearable
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("search_by_desig")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder={t("search_by_desig")}
                      className={props.theme ? "darkTextField" : ""}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isAdminLoading ? (
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
            )}
            <Typography variant="body1">
              {adminList.map((item, i) => {
                return (
                  <Chip
                    style={{
                      margin: "0 4px",
                    }}
                    onDelete={() => handleAdminRemove(item)}
                    key={item.displayRoleName}
                    label={item.displayRoleName}
                  />
                );
              })}
            </Typography>
          </div>
          <div className="card-detail">
            <Typography variant="subtitle1">{t("mr_user")}</Typography>
            <Typography variant="body1">{mrRole}</Typography>
          </div>
        </CardContent>
        {edit && (
          <CardActions
            style={{
              justifyContent: "end",
            }}
          >
            <Button
              id="admin-cancel"
              variant="contained"
              color="primary"
              endIcon={<Cancel />}
              onClick={handleClose}
            >
              {t("cancel")}
            </Button>
            <Button
              id="admin-edit"
              variant="contained"
              color="secondary"
              onClick={handleEdit}
              endIcon={<Send />}
            >
              {t("save")}
            </Button>
          </CardActions>
        )}
      </Card>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  getAdminData,
  updateAdminData,
  updateAdminRole,
})(DeptDetails);
