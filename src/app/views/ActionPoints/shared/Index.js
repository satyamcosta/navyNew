import React, { useEffect, useState } from "react";

import "./index.css";
import { Breadcrumb } from "../../../../matx";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { Grid } from "@material-ui/core";
import ActionPointOpenTable from "./Actionpointopen/ActionPointOpenTable";
import ActionPointCloseTable from "./ActionPointClose/ActionPointCloseTable";

import { getActionTask } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const Index = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const userName = localStorage.getItem("username");
  const role = sessionStorage.getItem("role");
  const [totalClosedTask, setTotalClosedTask] = useState(0);
  const [cab, setCab] = useState(false);
  const [closefile, setClosefile] = useState(true);
  const [cabinet, setCabinet] = useState(true);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizes] = useState([10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterStatus, setFilterStatus] = useState("all");
  const [reloadData, setReloadData] = useState(false);

  const [opentask, setTaskOpenTask] = useState({});
  const [isActiveBtn, setIsActiveBtn] = useState(1);
  const [buttonNum, setButtonNum] = useState(1);

  const [isClose, setIsClose] = useState(false);
  
  const handleActions = (val) => {
    setIsClose(val);
    setCabinet(!val);
  };

  const handleShow = (btnNum) => {
    setCab(false);
    setCabinet(true);
    setClosefile(true);
    setIsActiveBtn(btnNum);
    setButtonNum(btnNum);
    // setIsActiveBtn(1);
    // if (isActiveBtn == 2) {
    //   setIsActiveBtn(buttonNum);
    // }
  };

  const handleclose = () => {
    setClosefile(false);
    setCab(true);
    setCabinet(false);
    setButtonNum(2);
    setIsActiveBtn(2);
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const getAllTaskData = (type) => {
    // const filters = { priority: type };
    // const headers = {
    //   "Content-Type": "application/json; charset=utf8",
    //   Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
    //   userName: userName,
    //   roleName: role,
    //   pageSize: pageSize,
    //   pageNumber: currentPage,
    //   completed: false,
    // };
    // axios
    //   .post(
    //     "/actionPoint/api/getActionPoints",
    //     {
    //       filter: null,
    //       dueDateFrom: null,
    //       dueDateTill: null,
    //       specialFilter: type ? type : "all",
    //       sort: null,
    //     },
    //     { headers: headers }
    //   )
    //   .then((resp) => {
    //     try {
    //       if (resp.error) {
    //         callMessageOut(resp.error);
    //         return;
    //       }

    //       if (!resp.error) {
    //         setTaskOpenTask({
    //           openTasks: resp.headers.totalopen,
    //           closedTask: resp.headers.totalclosed,
    //           assignedTaskByMe: resp.headers.totalassignedbyme,
    //           assignedTaskToMe: resp.headers.totalassignedtome,
    //         });
    //         // setFilterStatus(true);
    //       } else {
    //         const errorMessage =
    //           resp.status + " : " + resp.error + " AT " + resp.path;
    //         callMessageOut(errorMessage);
    //       }
    //     } catch (e) {
    //       callMessageOut(e.message);
    //     }
    //   })
    //   .catch((error) => {
    //     callMessageOut(error.message);
    //   });
    const filters = { priority: type };
    const headers = {
      "Content-Type": "application/json; charset=utf8",
      Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      roleName: role,
    };
    axios
      .get("/actionPoint/api/actionCount", {
        headers: {
          "Content-Type": "application/json; charset=utf8",
          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          roleName: role,
        },
      })

      .then((resp) => {
        try {
          if (!resp.error) {
            setTaskOpenTask({
              openTasks: resp.data.open,
              closedTask: resp.data.closed,
              assignedTaskByMe: resp.data.assignedByMe,
              assignedTaskToMe: resp.data.assignedToMe,
            });
          
          } else {
            const errorMessage =
              resp.status + " : " + resp.error + " AT " + resp.path;
            callMessageOut(errorMessage);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((error) => {
        callMessageOut(error.message);
      });
  };

  // Here inbox only available when user have selected some role
  useEffect(() => {
    let inboxAbort = new AbortController();
    getAllTaskData();

    return () => {
      inboxAbort.abort();
    };
  }, [currentPage, pageSize]);

  const filterData = (filterType, value, btnNum) => {
    setFilterStatus(filterType);
    setIsActiveBtn(btnNum);
    setCabinet(value);
    if (!value) {
      handleclose();
    } else {
      handleShow(btnNum);
    }
  };

  return (
    <div style={{ padding: "1px 0", margin: "2px 10px 0px 10px" }}>
      <Grid container>
        <Grid item xs={3}>
          <Breadcrumb />
        </Grid>
        <Grid item xs={9}>
          <div className="buttons">
            <button
              className={
                isActiveBtn === 1 ? "btn-hover color-1" : "btn-hover color-11"
              }
              onClick={() => {
                setButtonNum(1), setIsActiveBtn(1), filterData("all", true, 1);
                handleActions(false);
              }}
            >
              {/* {t("open_action")} <span>{opentask.openTasks || 0}</span> */}
              {t("open_action")} 
            </button>
            <button
              className={
                isActiveBtn === 2 ? "btn-hover color-1" : "btn-hover color-11"
              }
              onClick={() => {
                setButtonNum(2), setIsActiveBtn(2), filterData("all", false, 2);
                handleActions(true);
              }}
            >
              {/* {t("close_actions")}  <span>{opentask.closedTask || 0}</span> */}
              {t("close_actions")} 
            </button>
            <button
              className={
                isActiveBtn === 3 ? "btn-hover color-1" : "btn-hover color-11"
              }
              onClick={() => {
                setButtonNum(3),
                  setIsActiveBtn(3),
                  filterData("totalAssignedByMe", true, 3);
                  handleActions(false);
              }}
            >
              {/* {t("task_assigned_by_me")} <span>{opentask.assignedTaskByMe || 0}</span> */}
              {t("task_assigned_by_me")} 
            </button>
            <button
              className={
                isActiveBtn === 4 ? "btn-hover color-1" : "btn-hover color-11"
              }
              onClick={() => {
                setButtonNum(4),
                  setIsActiveBtn(4),
                  filterData("totalAssignedToMe", true, 4);
                  handleActions(false);
              }}
            >
              {/* {t("task_assigned_to_me")} <span>{opentask.assignedTaskToMe || 0}</span> */}
              {t("task_assigned_to_me")} 
              
            </button>
          </div>
        </Grid>

        <>
          <Grid>
            <div
              style={{
                display: "flex",
                alignItems: "end"
              }}
            >
              <div
                className={`mrt-head ${isClose ? "un-active" : ""}`}
                onClick={() => {handleActions(false);setIsActiveBtn(1)}}
              >
                <span>{t("open_action")}</span>
              </div>
              <div
                className={`mrt-head ${isClose ? "" : "un-active"}`}
                onClick={() => {handleActions(true);setIsActiveBtn(2)}}
              >
                <span>{t("close_actions")}</span>
              </div>
            </div>
            <Grid item style={{ overflowX: "auto", boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px" }}>
              {cabinet ? (
                <ActionPointOpenTable
                  totalCount={totalCount}
                  filterStatus={filterStatus}
                  setFilterStatus={setFilterStatus}
                  reloadData={reloadData}
                  setReloadData={setReloadData}
                  getAllTaskData={getAllTaskData}
                />
              ) : (
                <ActionPointCloseTable />
              )}
            </Grid>
            {/*
            
            <Grid item>
              <ul
                style={{
                  position: "sticky",
                  right: "16px",
                  padding: 0,
                }}
              >
                {cab ? (
                  <li className="hide" onClick={() => handleShow(1)}>
                    {t("open_action")}
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    {t("open_action")}
                  </li>
                )}

                {closefile ? (
                  <li className="hide" onClick={() => handleclose()}>
                    {t("close_actions")}
                  </li>
                ) : (
                  <li
                    className="hide1"
                    style={{ userSelect: "none", cursor: "default" }}
                  >
                    {t("close_action")}
                  </li>
                )}
              </ul>
            </Grid>
            */}
          </Grid>
        </>
      </Grid>
    </div>
  );
};
function mapStateToProps(state) {
  return {
    props: state.props,
  };
}
export default connect(mapStateToProps, { getActionTask })(Index);
