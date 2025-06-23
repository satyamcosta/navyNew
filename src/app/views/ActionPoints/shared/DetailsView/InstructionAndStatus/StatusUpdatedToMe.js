import React, { useState, useEffect, useMemo, useContext } from "react";
import CancelIcon from "@material-ui/icons/Cancel";
import "../../index.css";
import {
  previousInstructions,
  cumulatedStatus,
  markCompleted,
} from "app/camunda_redux/redux/action";
import { useTranslation } from "react-i18next";
import "react-tabs/style/react-tabs.css";
import PaginationComp from "app/views/utilities/PaginationComp";
import "../../../../Personnel/therme-source/material-ui/loading.css";

import { Loading } from "../../../../dashboard/therme-source/material-ui/loading";
import { GrAddCircle } from "react-icons/gr";
import {
  Paper,
  Typography,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Button,
} from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Cookies from "js-cookie";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import { unstable_batchedUpdates } from "react-dom";
import AssignerInstruction from "./AssignerInstruction";
import { AssignerContext } from "../ViewDetailStatus";
import ViewAssignTaskUsrStatas from "../../Actionpointopen/StatusUpdates/ViewAssignTaskUsrStatas";
import { Draggable } from "react-draggable";
import InstructionsAndPreviousIns from "./InstructionsAndPreviousIns";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { handleError } from "utils";
import { MdVisibility } from "react-icons/md";
import { IoMdCheckmark } from "react-icons/io";
import { Rating, Stack } from "@mui/material";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    maxHeight: 300,
    overflowY: "scroll",
    fontSize: "13px",
  },
});

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
const StatusUpdatedToMe = (props) => {
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [Filter, setFilter] = useState({});

  const { theme } = useSelector((state) => state);
  const [rowData, setRowData] = useState([]);

  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);

  const [ratingValue, setRatingValue] = useState(2); //rating value

  // generic search
  const FilterOption = [
    {
      value: "Select Field",
      label: "",
    },
    {
      value: "Rolename",
      label: "Rolename",
    },
  ];

  const FilterTypes = {
    type: "select",
    optionValue: FilterOption,
    size: "small",
    variant: "outlined",
    label: "Filter-By",
    color: "primary",
  };

  const FilterValueTypes = [
    {
      name: "Rolename",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

  // user previous stATUS FUNS

  // marked completed start======================
  const [viewUserStatus, setViewUserStatus] = useState(false);
  const [viewUserStatusId, setViewUserStatusId] = useState("");

  const handleClickviewUserStatusOpen = (id) => {
    setViewUserStatus(true);
    setViewUserStatusId(id);
  };

  const handleClickviewUserStatusClose = () => {
    setViewUserStatus(false);
  };

  // mark completed funs
  const [markComplete, setMarkComplete] = useState(false);
  const [markCompleteId, setMarkCompleteId] = useState("");

  const markCompletedhandleClickOpen = (id) => {
    setMarkComplete(true);
    setMarkCompleteId(id);
  };

  const markCompletedhandleClose = () => {
    setMarkComplete(false);
  };

  const markCompletedFun = () => {
    setIsLoading(true);
    props
      .markCompleted([markCompleteId], true, pageSize, currentPage, ratingValue)
      .then((res) => {
        try {
          if (res.error) {
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
          } else {
            setRowData(res?.response?.content);
            setTotalCount(res?.response?.totalElements);
            dispatch(
              setSnackbar(
                true,
                "success",
                `${t("task_completed_successfully")} !`
              )
            );
          }
          props.getAllTaskData();
          setIsLoading(false);
        } catch (error) {
          callMessageOut(error.error);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        callMessageOut(err.error);
        setIsLoading(false);
      });
  };

  // update Status start=========================
  const [updateStatus, setUpdateStatus] = useState(false);
  const [actionId, setActionId] = useState("");
  const [taskCompletedUser, setTaskCompletedUser] = useState([]);

  const updateStatushandleClickOpen = (id) => {
    setUpdateStatus(true);
    setActionId(id);
  };
  const updateStatushandleClose = () => {
    setUpdateStatus(false);
  };
  // update Status end ============================

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(0);
        setPageSize(10);
      });
    }
  };
  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  const CustomToolbarMarkup = ({ table }) => {
    return (
      <>
        <Grid container className="AcHeader">
          <Grid item xs={12} className="PaHeadTop">
            <div
              style={{
                margin: "7px 0",
                width: "85%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {/* <GenericSearch
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
              /> */}
            </div>

            <MRT_ShowHideColumnsButton table={table} />
          </Grid>
          <GenericChip Filter={Filter} deleteChip={deleteChip} />
        </Grid>
      </>
    );
  };

  // new table code start

  const columns = useMemo(
    () => [
      {
        accessorKey: "date",
        header: t("date"),

        size: 50,
        Cell: ({ row }) => {
          let item = row.original;

          return <span className="text-m">{item.status.updatedOn}</span>;
        },
      },
      {
        accessorKey: "displayRoleName",
        header: t("role"),

        size: 60,
        Cell: ({ row }) => {
          let item = row.original;

          return <span className="text-m">{item.displayRoleName}</span>;
        },
      },
      {
        accessorKey: "status",
        header: t("status"),

        size: 60,
        Cell: ({ row }) => {
          let item = row.original;

          return <span className="text-m">{item.status.status}</span>;
        },
      },
      {
        accessorKey: "message",
        header: t("message"),

        size: 90,
        Cell: ({ row }) => {
          let item = row.original;

          const words = item.status?.message?.split(" ");
          const truncatedMessage = words?.slice(0, 9).join(" ");

          return (
            <CustomWidthTooltip title={item.status?.message}>
              <span className="text-m">
                {truncatedMessage}
                {words?.length > 12 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },

      {
        accessorKey: "description",
        header: t("description"),
        size: 90,

        Cell: ({ cell }) => {
          const description = cell.getValue();
          const words = description?.split(" ");
          const truncatedDescription = words.slice(0, 9).join(" ");

          return (
            <CustomWidthTooltip title={description}>
              <span className="text-m">
                {truncatedDescription} {description.length > 200 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },
      {
        accessorKey: "action_btn",
        header: t("actions_btn"),
        size: 10,
        Cell: ({ row }) => {
          let item = row.original;

          return (
            <div>
              <>
                <Tooltip title={t("pre_status")} placement="bottom">
                  <IconButton
                    className="InboxBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClickviewUserStatusOpen(item.status.actionId);
                    }}
                    size="medium"
                  >
                    <MdVisibility size={20} />
                  </IconButton>
                </Tooltip>
              </>

              {props.rowData.completed === true ||
                (item.actionCompleted === false && (
                  <>
                    <Tooltip title={t("instruction")} placement="bottom">
                      <IconButton
                        className="InboxBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatushandleClickOpen(item.status.actionId);
                        }}
                      >
                        <GrAddCircle size={20} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t("mark_completed")} placement="bottom">
                      <IconButton
                        className="InboxBtn"
                        onClick={(e) => {
                          e.stopPropagation();
                          markCompletedhandleClickOpen(item.status.actionId);
                        }}
                      >
                        <IoMdCheckmark size={20} />
                      </IconButton>
                    </Tooltip>
                  </>
                ))}
            </div>
          );
        },
      },
    ],
    [Cookies.get("i18next")]
  );
  const dispatch = useDispatch();
  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  //   props
  //     .cumulatedStatus(props.rowData.assignmentId)
  //     .then((resp) => {
  //       let tmpArr = [];

  //       try {
  //         if (resp) {
  //           // condition to check if response then perform further
  //           if (!resp.error) {
  //             setTotalCount(
  //               resp?.response?.length != null ? resp?.response?.length : 0
  //             );

  //             tmpArr = resp?.response?.map((item, index) => {
  //               return {
  //                 ...item,
  //                 serialNo:
  //                   camuStatusPageSize * camuStatusCurrentPage + (index + 1),
  //               };
  //             });
  //             setRowData(tmpArr);
  //           } else {
  //             let errMsg = handleError(resp.error);
  //             callMessageOut(errMsg);
  //           }
  //         }
  //       } catch (error) {
  //         callMessageOut("An error occurred while processing response.");
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error, "cumulated");
  //       callMessageOut(error);
  //     });
  // };

  const cumulatedStatusData = () => {
    setIsLoading(true);
    props
      .cumulatedStatus(props.rowData.assignmentId, pageSize, currentPage)
      .then((resp) => {
        let tmpArr = [];

        console.log(resp);
        try {
          if (!resp.error) {
            setTotalCount(
              resp.response.totalElements ? resp.response.totalElements : 0
            );

            tmpArr = resp?.response?.content?.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });

            setRowData(tmpArr);
            const statuscompleteUser = resp?.response?.content?.filter(
              (item) => item.actionCompleted === false
            );
            setTaskCompletedUser(statuscompleteUser);
            setIsLoading(false);
          } else {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setIsLoading(false);
          }
        } catch (e) {
          callMessageOut(e.error);
          setIsLoading(false);
        }
      })
      .catch((error) => {
        callMessageOut(error.error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    cumulatedStatusData();
  }, [pageSize, currentPage]);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-statusupdatetome");
    adjustableDiv.style.height = viewportHeight - 165 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  return (
    <div className="open-task">
      {isLoading && <Loading />}
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
        }}
        id="material-table"
      >
        <MaterialReactTable
          data={rowData}
          manualPagination
          columns={columns}
          initialState={{
            density: "compact",
          }}
          displayColumnDefOptions={{
            "mrt-row-select": {
              size: 0,
              muiTableHeadCellProps: {
                align: "center",
              },
              muiTableBodyCellProps: {
                align: "center",
              },
            },
            "mrt-row-numbers": {
              enableResizing: true,
              muiTableHeadCellProps: {
                sx: {
                  fontSize: "1.2rem",
                },
              },
            },
          }}
          enableBottomToolbar={false}
          enableColumnResizing
          enableStickyHeader
          enableFilters={false}
          enableFullScreenToggle={false}
          enableDensityToggle={false}
          renderTopToolbar={({ table }) => (
            <CustomToolbarMarkup table={table} />
          )}
          muiTableBodyRowProps={({ row, staticRowIndex }) => ({
            sx: {
              cursor: "pointer",
              // background: "inherit",
              height: "10px",
              backgroundColor: staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit"
            },
          })}
          muiTableContainerProps={() => ({
            sx: {
              border: "1px solid #8080802b",
              height: "61vh",
            },
            id: "mrt-statusupdatetome",
          })}
          muiTablePaperProps={() => ({
            sx: {
              padding: "0rem 1rem",
              border: "0",
              background: theme ? "#424242" : "white",
            },
          })}
          muiTableHeadRowProps={{
            sx: {
              background: theme ? "#938f8f" : "white",
            },
          }}
        />
        <PaginationComp
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          pageSizes={pageSizes}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      </Paper>

      <Dialog open={markComplete}>
        <DialogTitle
          id="draggable-dialog-title"
          style={{ cursor: "move" }}
          className="send_dialog"
        >
          {t("mark_completed")}
          <Tooltip title={t("cancel")}>
            <IconButton
              id="mark_completed"
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
            style={{ width: "7rem" }}
            onClick={markCompletedhandleClose}
          >
            {t("no")}
          </Button>
          <Button
            variant="contained"
            color="secondary"
            // className="submitButton"
            style={{ width: "7rem" }}
            onClick={() => {
              markCompletedFun();
              markCompletedhandleClose();
            }}
          >
            {t("yes")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* PREVIOUS STATUS DIALOG */}

      <Dialog open={viewUserStatus} className="user_status">
        <ViewAssignTaskUsrStatas
          handleClickviewUserStatusClose={handleClickviewUserStatusClose}
          viewUserStatusId={viewUserStatusId}
        />
      </Dialog>

      {/* instruction dialog */}
      <Dialog
        className="updateStatus"
        open={updateStatus}
        onClose={updateStatushandleClose}
        // PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <InstructionsAndPreviousIns
          updateStatus={updateStatus}
          id={actionId}
          updateStatushandleClose={updateStatushandleClose}
        />
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  previousInstructions,
  markCompleted,
  cumulatedStatus,
})(StatusUpdatedToMe);
