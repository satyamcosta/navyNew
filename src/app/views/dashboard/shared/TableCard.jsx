import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Paper,
  Dialog,
  Slide,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  Grid,
  Fab,
  TableHead,
} from "@material-ui/core";
import {
  getPADashboardData,
  getHistory,
  URLHide,
} from "../../../camunda_redux/redux/action";
import { Tooltip, IconButton } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { setPassData } from "../../../camunda_redux/redux/ducks/passData";
import { useTranslation } from "react-i18next";
import DashbordDialogComp from "./DashbordDialogComp";
import GetAppIcon from "@material-ui/icons/GetApp";
import { makeStyles } from "@material-ui/core/styles";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import PaginationComp from "app/views/utilities/PaginationComp";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import { unstable_batchedUpdates } from "react-dom";
import GenericChip from "app/views/utilities/GenericChips";
import { HiDownload } from "react-icons/hi";
import _ from "lodash";
import { handleError } from "utils";
import {
  MRT_ShowHideColumnsButton,
  MaterialReactTable,
} from "material-react-table";
import Cookies from "js-cookie";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles((theme) => ({
  dialogShowHide: {
    visibility: "hidden",
    PointerEvent: "none",
  },
  table: {
    minWidth: 800,
  },
}));

const TableCard = (props) => {
  const { t } = useTranslation();
  const { handleLoading } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const [rowData, setRowData] = useState([]);
  const [rowId, setRowId] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(true);
  const [pdfUrl, setPdfUrl] = useState("");
  const [pageSizes] = useState([5, 10, 15]);
  const [sampleData, setSampleData] = useState([]);
  const [dialogClassToggle, setDialogClassToggle] = useState(true);
  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});

  let username = localStorage.getItem("username");
  let role = sessionStorage.getItem("role");
  let department = sessionStorage.getItem("department");

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "subject",
      label: "Subject",
    },
    {
      value: "pfileName",
      label: "File Name",
    },
    {
      value: "status",
      label: "Status",
    },
    {
      value: "createdOn",
      label: "Created On",
    },
  ];
  const StatusOption = [
    "In Progress",
    "Approved",
    "Draft",
    "Rejected",
    "Return",
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
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

  const SortValueTypes = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Subject",
      color: "primary",
    },
    {
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "File Name",
      color: "primary",
    },
    {
      name: "status",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Status",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Created On",
    },
  ];

  // state variable which get track of all filter option with value

  const downloadFile = (e, row) => {
    e.stopPropagation();
    try {
      props
        .URLHide(row.fileURL)
        .then(async (response) => {
          // console.log(response);
          if (response.status != 200) {
            let errMsg = handleError(response.statusText);
            callMessageOut(errMsg);
          } else if (response.status == 200) {
            let data = await response.blob();
            let blobUrl = URL.createObjectURL(data);
            let anchor = document.createElement("a");
            anchor.href = blobUrl;
            anchor.download = `${row.displayPfileName}.docx`;
            document.body.appendChild(anchor);
            anchor.click();
            URL.revokeObjectURL(blobUrl);
            document.body.removeChild(anchor);
          }
        })
        .catch((e) => {
          let errMsg = handleError(e.error);
          callMessageOut(errMsg);
        });
    } catch (e) {
      let errMsg = handleError(err.error);
      callMessageOut(errMsg);
    }
  };

  useEffect(() => {
    let dashboardTableAbort = new AbortController();
    loadPATableData(dashboardTableAbort.signal);

    return () => {
      dashboardTableAbort.abort();
    };
  }, [currentPage, pageSize, Filter, SortBy]);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-dashboard");
    adjustableDiv.style.height = viewportHeight - 180 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const loadPATableData = (abortSignal) => {
    handleLoading(true);
    setRowData([]);
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      let key = property.split("|")[0];
      filter[`${key}`] = value;
    });
    let sort = null;
    if (!_.isEmpty(SortBy)) {
      sort = {
        title: SortBy?.title?.name,
        type: SortBy?.type,
      };
    }
    props
      .getPADashboardData(
        username,
        role,
        department,
        pageSize,
        currentPage,
        {
          filter: _.isEmpty(filter) ? null : filter,
          sort: _.isEmpty(sort) ? null : sort,
        },
        abortSignal
      )
      .then((resp) => {
        // console.log(resp);
        try {
          let tmpArr = [];
          if (resp.error) {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            handleLoading(false);
            return;
          } else {
            if (resp.response.data !== undefined) {
              setTotalCount(resp.response.length);
              tmpArr = resp.response.data.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setRowData(tmpArr);
              const dataToBeSend = {
                ApprovalCount: resp.response.Approve,
                RejectCount: resp.response.Reject,
                InProgressCount: resp.response.InProgress,
                SentCount: resp.response.Sent,
              };
              props.totalCountPA(dataToBeSend);
            }
            handleLoading(false);
          }
        } catch (e) {
          console.log(e);
          callMessageOut(e.message);
          handleLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        let errMsg = handleError(e.message);
        callMessageOut(errMsg);
        handleLoading(false);
      });
  };

  const callMessageOut = (message) => {
    handleLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleOnRowClick = (rowData) => {
    setPdfUrl(rowData.fileURL);

    dispatch(setPassData(rowData.fileURL));
    setOpen(true);
    setDialogClassToggle(true);
    setRowId(rowData.id);
    // console.log(rowData);
    if (rowData) {
      props.getHistory("PA", rowData.id).then((resp) => {
        if (resp) {
          !isNullOrUndefined(resp.data)
            ? setSampleData(resp.data)
            : setSampleData([]);
        }
      });
    }
  };

  const blnPdfLoads = (val) => {
    setPdfLoads(val);
  };

  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

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

  const CustomToolbarMarkup = ({ table }) => (
    <Grid
      container
      direction="column"
      style={{
        padding: "0.5rem 0rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 1rem",
        }}
      >
        <GenericSearch
          FilterTypes={FilterTypes}
          FilterValueTypes={FilterValueTypes}
          addFilter={addFilter}
          cssCls={{}}
        />
        <GenericFilterMenu
          SortValueTypes={SortValueTypes}
          addSort={addSort}
          sort={SortBy}
        />
        <MRT_ShowHideColumnsButton
          style={{ color: props.theme ? "#fff" : "#676767" }}
          table={table}
        />
      </div>
      <GenericChip Filter={Filter} deleteChip={deleteChip} />
    </Grid>
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: "displayPfileName",
        header: t("file_name"),
        size: 150,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 150,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
      {
        accessorKey: "createdOn",
        header: t("created_on"),
        size: 130,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
      {
        accessorKey: "status",
        header: t("status"),
        size: 100,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <div className="dashboard-sts">
              <span
                style={{
                  backgroundColor:
                    row.status === "In Progress"
                      ? "#ffaf38"
                      : row.status === "Draft"
                        ? "#398ea1"
                        : row.status === "Rejected"
                          ? "#fd4e32"
                          : row.status === "Approved"
                            ? "#37d392"
                            : row.status === "Return"
                              ? "#b73b32"
                              : "",
                }}
                className="status"
              >
                {row?.status?.toUpperCase()}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 50,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <>
              <Tooltip title={t("download")} aria-label="Download">
                <button id="dashboardDownloadFile_button">
                  <HiDownload
                    onClick={(e) => {
                      downloadFile(e, row);
                    }}
                  />
                </button>
              </Tooltip>
            </>
          );
        },
      },
    ],
    [rowData, Cookies.get("i18next")]
  );

  return (
    <div
      elevation={3}
      style={{ position: "relative", borderRadius: "18px" }}
      className="dashboard_table"
    >
      <Paper
        className="dash-table"
        style={{
          borderRadius: "18px",
          paddingBottom: "1rem",
          // border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
          width: "100%",
        }}
      >
        <div id="material-table">
          <MaterialReactTable
            data={rowData}
            manualPagination
            columns={columns}
            initialState={{
              density: "compact",
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
              onClick: () => {
                handleOnRowClick(row?.original);
              },
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
                height: "64vh",
              },
              id: "mrt-dashboard",
            })}
            muiTablePaperProps={() => ({
              sx: {
                padding: "0rem 1rem",
                borderRadius: "18px",
                border: "0",
                boxShadow: "none",
                background: props.theme ? "#424242" : "white",
              },
            })}
            muiTableHeadRowProps={{
              sx: {
                background: props.theme ? "#938f8f" : "white",
              },
            }}
          />
        </div>
        <PaginationComp
          pageSize={pageSize}
          pageSizes={pageSizes}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          totalCount={totalCount}
          setPageSize={setPageSize}
        />
      </Paper>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      // transitionDuration={1000}
      >
        <DashbordDialogComp
          closeDialog={handleClose}
          pdfUrl={pdfUrl}
          blnPdfLoads={blnPdfLoads}
          fileId={rowId}
          sampleData={sampleData}
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
  getPADashboardData,
  getHistory,
  URLHide,
})(TableCard);
