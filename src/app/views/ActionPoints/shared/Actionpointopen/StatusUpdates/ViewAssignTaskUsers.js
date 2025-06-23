import React, { useState, useEffect, useMemo } from "react";

import "../../index.css";
import CancelIcon from "@material-ui/icons/Cancel";

import { useTranslation } from "react-i18next";
import "react-tabs/style/react-tabs.css";
import PaginationComp from "app/views/utilities/PaginationComp";
import VisibilityIcon from "@material-ui/icons/Visibility";
import Dialog from "@material-ui/core/Dialog";
import Draggable from "react-draggable";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  ViewsStatus,
  markCompleted,
  showAllAssignTaskUsers,
  cumulatedStatus,
} from "app/camunda_redux/redux/action";
// import VisibilityIcon from "@material-ui/icons/Visibility";
import { IoMdCheckmark } from "react-icons/io";
import {
  Paper,
  Grid,
  Typography,
  IconButton,
  DialogActions,
  Button,
} from "@material-ui/core";
import { MdVisibility } from "react-icons/md";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Cookies from "js-cookie";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import { unstable_batchedUpdates } from "react-dom";
import ViewAssignTaskUsrStatas from "./ViewAssignTaskUsrStatas";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { handleError } from "utils";
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

const ViewAssignStatus = (props) => {
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [Filter, setFilter] = useState({});

  const { theme } = useSelector((state) => state);
  const [ratingValue, setRatingValue] = useState(2); // for rating

  // marked completed start======================
  const [viewUserStatus, setViewUserStatus] = useState(false);
  const [viewUserStatusId, setViewUserStatusId] = useState("");
  const [taskCompletedUser, setTaskCompletedUser] = useState([]);

  console.log(taskCompletedUser);

  const handleClickviewUserStatusOpen = (id) => {
    setViewUserStatus(true);
    setViewUserStatusId(id);
  };

  const handleClickviewUserStatusClose = () => {
    setViewUserStatus(false);
  };

  const [markComplete, setMarkComplete] = useState(false);
  const [markCompleteId, setMarkCompleteId] = useState("");

  const markCompletedhandleClickOpen = (id) => {
    setMarkComplete(true);
    setMarkCompleteId(id);
  };

  const markCompletedhandleClose = () => {
    setMarkComplete(false);
  };

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const cumulatedStatusData = () => {
    try {
      props
        .cumulatedStatus(
          props.viewStatusData.assignmentId,
          pageSize,
          currentPage
        )
        .then((resp) => {
          let tmpArr = [];

          if (!resp.error) {
            setTotalCount(
              resp?.response?.totalElements ? resp?.response?.totalElements : 0
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
          } else {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
          }
        })
        .catch((error) => {
          console.log(error);
          callMessageOut(error.error);
        });
    } catch (error) {
      console.log(error);

      callMessageOut(error.error);
    }
  };

  useEffect(() => {
    cumulatedStatusData();
  }, [pageSize, currentPage]);

  // generic search
  const FilterOption = [
    {
      value: "Select Field",
      label: "",
    },
    {
      value: "Department",
      label: "Department",
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
      name: "Department",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

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
          {/* <GenericChip Filter={Filter} deleteChip={deleteChip} /> */}
        </Grid>
      </>
    );
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "displayRoleName",
        header: t("role"),

        size: 60,
        Cell: ({ row }) => {
          let item = row.original;

          return <span>{item.displayRoleName}</span>;
        },
      },
      {
        accessorKey: "status",
        header: t("status"),

        size: 60,
        Cell: ({ row }) => {
          let item = row.original;

          return <span>{item.status.status}</span>;
        },
      },
      {
        accessorKey: "message",
        header: t("message"),

        size: 120,
        Cell: ({ row }) => {
          let item = row.original;

          const words = item.status?.message?.split(" ");
          const truncatedMessage = words?.slice(0, 15)?.join(" ");

          return (
            <CustomWidthTooltip title={item?.status?.message}>
              <span>
                {truncatedMessage}
                {words?.length > 12 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },

      {
        accessorKey: "action",
        header: t("actions_btn"),
        size: 30,
        Cell: ({ row }) => {
          let item = row.original;

          return (
            <>
              <Tooltip title={t("view_status")} placement="bottom">
                <IconButton
                  className="InboxBtn"
                  onClick={() =>
                    handleClickviewUserStatusOpen(item.status?.actionId)
                  }
                >
                  <MdVisibility size={20} />
                </IconButton>
              </Tooltip>

              {item.actionCompleted !== true && (
                <Tooltip title={t("mark_completed")} placement="bottom">
                  <IconButton
                    className="InboxBtn"
                    onClick={() =>
                      markCompletedhandleClickOpen(item.status?.actionId)
                    }
                  >
                    <IoMdCheckmark size={20} />
                  </IconButton>
                </Tooltip>
              )}
            </>
          );
        },
      },
    ],
    [Cookies.get("i18next")]
  );

  const markCompletedFun = () => {
    props
      .markCompleted([markCompleteId], true, pageSize, currentPage, ratingValue)
      .then((res) => {
        try {
          if (res.error) {
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
          } else {
            setRowData(res.response.content);
            setTotalCount(res?.response?.totalElements);
            dispatch(setSnackbar(true, "success", `${t("task_completed")}`));

            props.getAllTaskData();
            props.getAllTaskDatas();
          }
        } catch (error) {
          callMessageOut(error.error);
        }
      })
      .catch((err) => {
        callMessageOut(err.error);
      });
  };

  return (
    <div className="open-task ">
      <DialogTitle
        id="draggable-dialog-title"
        style={{ cursor: "move" }}
        className="send_dialog"
      >
        {t("view_assigned_users")}
        <Tooltip title={t("cancel")}>
          <IconButton
            id="VIEW_STATUS"
            aria-label="close"
            onClick={props.viewStatushandleClose}
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
                height: "47vh",
              },
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
      </DialogContent>

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
          <Typography variant="h6" gutterBottom component="div">
            {taskCompletedUser.length === 1
              ? t("are_you_sure_you_want_to_end_this_task")
              : t("are_you_sure_you_want_to_complete_this_task")}
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
            {taskCompletedUser.length === 1 ? t("end_task") : t("yes")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* view single user status  */}
      <Dialog
        open={viewUserStatus}
        className="user_status"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <ViewAssignTaskUsrStatas
          handleClickviewUserStatusClose={handleClickviewUserStatusClose}
          viewUserStatusId={viewUserStatusId}
        />
      </Dialog>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, {
  ViewsStatus,
  markCompleted,
  showAllAssignTaskUsers,
  cumulatedStatus,
})(ViewAssignStatus);
