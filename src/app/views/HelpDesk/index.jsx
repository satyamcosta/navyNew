import {
  CircularProgress,
  FormControl,
  Grid,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Breadcrumb } from "matx";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import DeptInfo from "./Components/DeptInfo.jsx";
import PaginationComp from "../utilities/PaginationComp";
import Cookies from "js-cookie";
import MaterialReactTable from "material-react-table";
import { connect, useDispatch } from "react-redux";
import { getHelpDesk, getDepts } from "app/camunda_redux/redux/action";
import "./therma-source/loading.css";
import { Loading } from "./therma-source/loading.jsx";
import { handleError } from "utils.js";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar.js";
import { Autocomplete } from "@material-ui/lab";

const index = (props) => {
  const department = sessionStorage.getItem("department");
  const { t } = useTranslation();
  const tableInstanceRef = useRef();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const [roleList, setRoleList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);

  const [deptObj, setDeptObj] = useState({});
  const [dept, setDept] = useState(department);
  const [isDept, setIsDept] = useState(false);
  const [deptList, setDeptList] = useState([]);

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    getDepts();
  }, []);

  console.log(dept)

  useEffect(() => {
    if (dept) {
      handleDeptData(dept);
    }
  }, [dept, currentPage, pageSize]);

  const getDepts = () => {
    setLoading(true);
    props.getDepts().then((resp) => {
      try {
        if (resp.error) {
          if (resp?.error?.includes("aborted")) {
            return;
          }
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
          setLoading(false);
        } else {
          setDeptList(resp);
          setDept(resp[0])
          setLoading(false);
        }
      } catch (e) {
        let errMsg = handleError(resp.error);
        callMessageOut(errMsg);
        setLoading(false);
      }
    });
  };

  const handleDeptData = (val) => {
    if (val?.deptDisplayName) {
      setLoading(true);
      props.getHelpDesk(val?.deptName, pageSize, currentPage).then((resp) => {
        try {
          if (resp.error) {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setLoading(false);
          } else {
            setDeptObj({
              deptName: resp?.deptName,
              userId: localStorage.getItem("username"),
              coordRole: resp?.coordRole,
              mailRole: resp?.mailRole,
            });
            setRoleList(resp?.data);
            setTotalCount(resp?.totalElements)
            setDept(val);
            setLoading(false);
          }
        } catch (e) {
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
          setLoading(false);
        }
      });
    }
  };

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-help");
    adjustableDiv.style.height = viewportHeight - 180 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const columns = useMemo(() => {
    return [
      {
        accessorKey: "role",
        header: t("role"),
        size: 100,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.role}>
              <span className="text-m" style={{ fontWeight: "initial" }}>
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
            <Tooltip title={item.deptUsername}>
              <span className="text-m" style={{ fontWeight: "initial" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "deptUsername",
        header: t("usr_id"),
        size: 100,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.deptUsername}>
              <span className="text-m" style={{ fontWeight: "initial" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "admin",
        header: t("type"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          let row = cell?.row?.original;
          return (
            <div className="help-status">
              <span
                style={{
                  backgroundColor: row.admin ? "#398ea1" : "#37d392",
                }}
                className="status"
              >
                {row?.admin ? t("admin") : t("user")}
              </span>
            </div>
          );
        },
      },
    ];
  }, [roleList, Cookies.get("i18next"), t]);

  return (
    <div style={{ padding: "1px 0", margin: "2px 10px 0px 10px" }}>
      {loading && <Loading />}
      <div>
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Breadcrumb
              routeSegments={[
                {
                  name: t("help"),
                  path: "/eoffice/user/helpdesk",
                },
              ]}
            />
          </Grid>
        </Grid>
      </div>
      <div
        style={{
          boxShadow:
            "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          borderRadius: "10px",
        }}
      >
        <Grid
          container
          style={{
            padding: "1rem 13px",
          }}
          justifyContent="space-evenly"
        >
          <Grid item xs={5}>
            <Paper
              elevation={3}
              style={{
                position: "relative",
                borderRadius: "9px",
              }}
            >
              <FormControl
                style={{
                  width: "100%",
                  padding: "10px",
                  borderBottom: "1px solid #80808047",
                }}
              >
                <Autocomplete
                  freeSolo
                  options={deptList}
                  getOptionLabel={(option) => option?.deptDisplayName}
                  id="tags-outlined"
                  value={dept}
                  onChange={(event, newValue) => {
                    setCurrentPage(0)
                    setDept(newValue)
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      style={{ width: "100%" }}
                      variant="outlined"
                      label={t("search_by_directorate")}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      placeholder={t("enter_directorate")}
                      className={props.theme ? "darkTextField" : ""}
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isDept ? (
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
              <DeptInfo deptObj={deptObj} />
            </Paper>
          </Grid>
          <Grid id="material-table" item xs={6} style={{
            display: "flex",
            flexDirection: "column"
          }}>
            <div className="mrt-head">
              <span>{t("active_users")}</span>
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
                tableInstanceRef={tableInstanceRef}
                data={roleList}
                manualPagination
                columns={columns}
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
                    border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                    height: "61vh",
                    borderRadius: "4px",
                  },
                  id: "mrt-help",
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
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}
export default connect(mapStateToProps, { getHelpDesk, getDepts })(index);
