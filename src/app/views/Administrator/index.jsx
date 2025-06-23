import React, { useEffect, useMemo, useState } from "react";
import "./therma-source/loading.css";
import { Breadcrumb } from "matx";
import { Grid, Paper, Tooltip } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import DeptDetails from "./Components/DeptDetails";
import MaterialReactTable from "material-react-table";
import Cookies from "js-cookie";
import { getAllRoles } from "app/camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import PaginationComp from "../utilities/PaginationComp";
import AdminBtmTable from "./Components/AdminBtmTable";
import { Loading } from "./therma-source/loading";
import { handleError } from "utils";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const index = (props) => {
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [rowData, setRowData] = useState([]);
  const [secList, setSecList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDeptRoles();
  }, [currentPage, pageSize]);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "role",
        header: t("role"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.role}>
              <span className="text-m" style={{ fontWeight: "bolder" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "deptDisplayUsername",
        header: t("username"),
        size: 100,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.deptDisplayUsername}>
              <span className="text-m" style={{ fontWeight: "bolder" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "deptUsername",
        header: t("service_number"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.deptUsername}>
              <span className="text-m" style={{ fontWeight: "bolder" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },
    ];
  }, [rowData, Cookies.get("i18next")],t);

  const handleData = (rolesList, secList) => {
    setRowData(rolesList);
    setSecList(secList);
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const getDeptRoles = () => {
    setLoading(true);
    props.getAllRoles(currentPage, pageSize).then((resp) => {
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
          setRowData(resp?.data);
          setTotalCount(resp?.totalElements);
          setLoading(false);
        }
      } catch (e) {
        let errMsg = handleError(resp.error);
        callMessageOut(errMsg);
        setLoading(false);
      }
    });
  };

  return (
    <div style={{ padding: "1px 0", margin: "2px 10px 0px 10px" }}>
      {loading && <Loading />}
      <div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Breadcrumb />
          </Grid>
        </Grid>
      </div>
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          borderRadius: "10px",
          marginTop: "-13px",
        }}
      >
        <Grid
          container
          style={{
            padding: "1rem",
            gap: "1rem",
          }}
          direction="column"
        >
          <Grid
            container
            xs={12}
            style={{
              justifyContent: "space-between",
            }}
          >
            <Grid
              item
              style={{
                width: "49%",
                padding: "0 1rem",
              }}
            >
              <DeptDetails handleData={handleData} />
            </Grid>

            <Grid
              id="material-table"
              item
              style={{
                width: "49%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <div className="mrt-head">
                <span>{t("series")}</span>
              </div>
              <Paper
                elevation={3}
                style={{
                  position: "relative",
                  borderRadius: "9px",
                  padding: "10px",
                }}
              >
                <MaterialReactTable
                  data={rowData}
                  manualPagination
                  columns={columns}
                  rowCount={totalCount}
                  initialState={{
                    density: "compact",
                  }}
                  enableStickyHeader
                  displayColumnDefOptions={{
                    "mrt-row-select": {
                      size: 5,
                      muiTableHeadCellProps: {
                        sx: {
                          paddingLeft: "25px",
                        },
                      },
                      muiTableBodyCellProps: {
                        sx: {
                          paddingLeft: "25px",
                        },
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
                  enableTopToolbar={false}
                  enableBottomToolbar={false}
                  enableColumnResizing
                  enableFilters={false}
                  enableFullScreenToggle={false}
                  enableDensityToggle={false}
                  muiSelectCheckboxProps={{
                    sx: { color: props.theme ? "#fff" : "#00000099" },
                    color: props.theme ? "warning" : "primary",
                  }}
                  muiTableBodyRowProps={({ row }) => {
                    return {
                      sx: {
                        position: "relative",
                        height: "10px",
                        background: "inherit",
                      },
                    };
                  }}
                  muiTableContainerProps={() => ({
                    sx: {
                      border: `1px solid ${
                        props.theme ? "#727070" : "#c7c7c7"
                      }`,
                      height: "61vh",
                      borderRadius: "4px",
                    },
                    id: "mrt-inbox1",
                  })}
                  muiTablePaperProps={() => ({
                    sx: {
                      padding: "0rem 1rem",
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
                <PaginationComp
                  pageSize={pageSize}
                  pageSizes={pageSizes}
                  setCurrentPage={setCurrentPage}
                  currentPage={currentPage}
                  totalCount={totalCount}
                  setPageSize={setPageSize}
                />
              </Paper>
            </Grid>
          </Grid>
          <Grid
            container
            xs={12}
            style={{
              justifyContent: "space-between",
            }}
          >
            <AdminBtmTable />
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, { getAllRoles })(index);
