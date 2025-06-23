import Cookies from "js-cookie";
import React, { useMemo, useState, useEffect } from "react";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import CancelIcon from "@material-ui/icons/Cancel";
import { Paper, Grid, Typography, IconButton } from "@material-ui/core";
import Draggable from "react-draggable";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import PaginationComp from "app/views/utilities/PaginationComp";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { PreviousStatus } from "app/camunda_redux/redux/action";
import { useTranslation } from "react-i18next";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { handleError } from "utils";

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

const ViewAssignTaskUsrStatas = (props) => {
  const role = sessionStorage.getItem("role");
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const { theme } = useSelector((state) => state);
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "updatedOn",
        header: t("date"),

        size: 50,
        Cell: ({ cell }) => (
          <span className="table-row-text ">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "status",
        header: t("status"),

        size: 40,
        Cell: ({ cell }) => (
          <span className="table-row-text">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "message",
        header: t("message"),

        size: 100,
        Cell: ({ cell }) => {
          const message = cell.getValue();
          const words = message?.split(" ");
          const truncatedMessage = words?.slice(0, 18)?.join(" ");

          return (
            <CustomWidthTooltip title={message}>
              <span className="table-row-text">
                {truncatedMessage}
                {message?.length > 200 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },
    ],
    [Cookies.get("i18next")]
  );

  const previousStatusData = () => {
    props
      .PreviousStatus(
        props.viewUserStatusId,
        props.assigneePreStatus,
        pageSize,
        currentPage,
        role,
        true
      )
      .then((resp) => {
        let tmpArr = [];

        try {
          if (!resp.error) {
            setTotalCount(
              resp?.response?.totalElements != null
                ? resp?.response?.totalElements
                : 0
            );
            console.log(resp.response);

            tmpArr = resp?.response?.content?.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });
            setRowData(tmpArr);
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

  return (
    <div className="previous_status">
      <DialogTitle
        id="draggable-dialog-title"
        style={{ cursor: "move" }}
        className="send_dialog"
      >
        {t("view_status")}
        <Tooltip title={t("cancel")}>
          <IconButton
            id="VIEW_STATUS"
            aria-label="close"
            onClick={
              props.handleClickviewUserStatusClose
                ? props.handleClickviewUserStatusClose
                : props.viewStatushandleClose
            }
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
    </div>
  );
};
function mapStateToProps(state) {
  return {
    props: state.props,

    theme: state.theme,
  };
}

export default connect(mapStateToProps, { PreviousStatus })(
  ViewAssignTaskUsrStatas
);
