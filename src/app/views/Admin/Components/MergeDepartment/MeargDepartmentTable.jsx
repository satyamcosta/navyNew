import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Divider,
  Grid,
  Button,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { useTranslation } from "react-i18next";
import "./mearg.css";
import UserValue from "./UserValue";
import { SendFormikDatainTable } from "./MeargDepartment";
import { connect, useDispatch } from "react-redux";
import SyncProblemIcon from "@material-ui/icons/SyncProblem";
import { sendMeargDatafinal } from "app/camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import { getAllDepartmentdata } from "app/redux/actions/AdminDepartment/CreateDepartment";

const MeargDepartmentTable = (props) => {
  const tmpArr = [];
  useEffect(() => {}, [tmpArr]);
  const { t } = useTranslation();
  const [newRoleNames, setNewRoleNames] = useState([]);
  const dispatch = useDispatch();
  const rolesOldAndNew = [];

  const { departmentList, department, department1, handleMergeDeptClose } =
    useContext(SendFormikDatainTable);

  for (let i = 0; i < department1.length; i++) {
    const newObj = {
      index: i,
      oldRole: department1[i],
      newRole: newRoleNames[i],
    };
    rolesOldAndNew.push(newObj);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    props
      .sendMeargDatafinal(departmentList, department, rolesOldAndNew)
      .then((res) => {
        if (res.message === "OK") {
          toast.success("Department Mearge successfully");
          props.handleBack();
        } else {
          dispatch(setSnackbar(true, "error", res.error));
        }
      });
    dispatch(getAllDepartmentdata(""));
    handleMergeDeptClose();
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Divider />
        <div style={{ padding: "1rem 1rem 0 1rem" }}>
          <TableContainer component={Paper}>
            <Table component="div" aria-label="simple table">
              <TableHead component="div">
                <TableRow component="div">
                  <div
                    className="audit-search-body"
                    style={{
                      borderBottom: `1px solid ${
                        props.theme ? "#727070" : "#c7c7c7"
                      }`,
                      backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                      padding: "1rem",
                    }}
                  >
                    <div className="info2">
                      <span>{t("OLD ROLE")}</span>
                    </div>
                    <div className="info3">
                      <span>{t("ASSIGN NEW ROLE")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                className="search-table-body-p"
                component="div"
                style={{
                  height: "calc(100vh - 437px)",
                  overflowY: "scroll",
                  overflowX: "hidden",
                }}
              >
                {department1.length > 0 ? (
                  department1.map((list, index) => {
                    return (
                      <>
                        <TableRow hover component="div">
                          <div className="audit-search-body">
                            <div className="info2">
                              <span>{list}</span>
                            </div>
                            <div className="info3">
                              <UserValue
                                index={index}
                                newRoleNames={newRoleNames}
                                setNewRoleNames={setNewRoleNames}
                                tmpArr={tmpArr}
                                clearValue={() =>
                                  setNewRoleNames((prevState) => ({
                                    ...prevState,
                                    [index]: "",
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </TableRow>
                      </>
                    );
                  })
                ) : (
                  <div className="merge_no_recode">
                    <div>
                      <SyncProblemIcon className="merge_recore_icon" />
                    </div>
                    <br />
                    <span>NO FILES IN PROGRESS</span> <br />
                    <span>CLICK THE SUMBIT BUTTON FOR DEPARTMENT MERGE</span>
                  </div>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Divider />
        <Grid container className="button_gris_table">
          <Grid item xs={12}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              style={{ float: "right" }}
              endIcon={<DoneIcon />}
            >
              SUMBIT
            </Button>
          </Grid>
        </Grid>
      </form>
      <ToastContainer />
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  sendMeargDatafinal,
})(MeargDepartmentTable);
