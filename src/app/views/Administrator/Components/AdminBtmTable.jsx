import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Add, Cancel, Delete, Edit } from "@material-ui/icons";
import PaginationComp from "app/views/utilities/PaginationComp";
import Cookies from "js-cookie";
import MaterialReactTable from "material-react-table";
import React, { useEffect, useMemo, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import {
  getSections,
  getSeries,
  addSection,
  delSection,
  updateSeries,
} from "app/camunda_redux/redux/action";
import { handleError } from "utils";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "../therma-source/loading";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const AdminBtmTable = (props) => {
  const dispatch = useDispatch();
  const tableInstanceRef1 = useRef(null);
  const { t } = useTranslation();
  const [sectionList, setSectionList] = useState([]);
  const [sectionCount, setSectionCount] = useState(0);
  const [pageSize1, setPageSize1] = useState(25);
  const [currentPage1, setCurrentPage1] = useState(0);
  const [pageSizes1] = useState([5, 10, 15]);
  const [loading, setLoading] = useState(false);

  const [seriesList, setSeriesList] = useState([]);
  const [seriesCount, setSeriesCount] = useState(0);
  const [pageSize2, setPageSize2] = useState(25);
  const [currentPage2, setCurrentPage2] = useState(0);
  const [pageSizes2] = useState([5, 10, 15]);
  const [selSection, setSelSection] = useState("");

  const [editSection, setEditSection] = useState(false);
  const [secObj, setsecObj] = useState({
    section: "",
    sectionRange: "",
  });
  const [createSec, setCreateSec] = useState(false);
  const [delSec, setDelSec] = useState(false);

  const [editSeries, setEditSeries] = useState(false);
  const [seriesObj, setSeriesObj] = useState({
    range: "",
    description: "",
  });
  const [createSer, setCreateSer] = useState(false);
  const [delSeries, setDelSeries] = useState(false);

  useEffect(() => {
    getSections();
  }, [currentPage1, pageSize1]);

  console.log(selSection);

  useEffect(() => {
    if (selSection.sectionRange) {
      handleClick();
    }
  }, [currentPage2, pageSize2, selSection]);

  const getSections = () => {
    setLoading(true);
    props.getSections(currentPage1, pageSize1).then((resp) => {
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
          setSectionList(resp.sections);
          setSectionCount(resp.totalItems);
          setLoading(false);
        }
      } catch (e) {
        let errMsg = handleError(resp.error);
        callMessageOut(errMsg);
        setLoading(false);
      }
    });
  };

  const columns1 = useMemo(() => {
    return [
      {
        accessorKey: "section",
        header: t("section"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.section}>
              <span className="text-m mrt-text" style={{ fontWeight: "initial" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },

      {
        accessorKey: "sectionRange",
        header: t("section-range"),
        size: 100,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item?.sectionRange}>
              <span className="text-m text-b mrt-text" style={{ fontWeight: "initial" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
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
              <div
                style={{
                  display: "flex",
                }}
              >
                <Tooltip title={t("delete_section")} aria-label="Delete">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDelSec(true);
                      setsecObj(row);
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </Tooltip>
                {/*
                  <Tooltip title={t("edit_series")} aria-label="Edit Subject">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditSection(true);
                      setsecObj(row);
                    }}
                  >
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
                  */}
              </div>
            </>
          );
        },
      },
    ];
  }, [sectionList, Cookies.get("i18next")], t);

  const columns2 = useMemo(() => {
    return [
      {
        accessorKey: "range",
        header: t("range"),
        size: 80,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item.range}>
              <span className="text-m" style={{ fontWeight: "initial" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },

      {
        accessorKey: "description",
        header: t("description"),
        size: 100,
        Cell: ({ cell }) => {
          let item = cell?.row?.original;
          return (
            <Tooltip title={item?.description}>
              <span className="text-m text-b mrt-text" style={{ fontWeight: "initial" }}>
                {cell.getValue()?.toUpperCase()}
              </span>
            </Tooltip>
          );
        },
      },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 80,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                {/*
                <Tooltip title={t("delete_series")} aria-label="Delete">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDelSeries(true);
                      setSeriesObj(row);
                    }}
                  >
                    <Delete color="error" />
                  </IconButton>
                </Tooltip>
                */}
                <Tooltip title={t("edit_series")} aria-label="Edit Subject">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditSeries(true);
                      setSeriesObj(row);
                    }}
                  >
                    <Edit color="primary" />
                  </IconButton>
                </Tooltip>
              </div>
            </>
          );
        },
      },
    ];
  }, [seriesList, Cookies.get("i18next"), t]);

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const callMessageSuccess = (message) => {
    dispatch(setSnackbar(true, "success", message));
  };

  const handleClick = () => {
    setLoading(true);
    props
      .getSeries(selSection.section, pageSize2, currentPage2)
      .then((resp) => {
        try {
          if (resp.error) {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
            setLoading(false);
          } else {
            setSeriesList(resp.labels);
            setSeriesCount(resp.totalItems);
            setLoading(false);
          }
        } catch (e) {
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
          setLoading(false);
        }
      });
  };

  const handleSubmit = () => {
    setLoading(true);
    if (createSec) {
      props.addSection(secObj.section, secObj.sectionRange).then((resp) => {
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
            let newSec = {
              section: resp.section,
              sectionRange: resp.range,
            };
            setSectionList((prev) => prev.concat(newSec));
            callMessageSuccess(t("sec_add"));
            handleClose1();
            setLoading(false);
          }
        } catch (e) {
          let errMsg = handleError(resp.error);
          callMessageOut(errMsg);
          setLoading(false);
        }
      });
    } else {
    }
  };

  const handleDelete = () => {
    setLoading(true);
    props.delSection(secObj.section, secObj.sectionRange).then((resp) => {
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
          let newSec = sectionList.filter(
            (item) =>
              item.section != resp.section && item.sectionRange != resp.range
          );
          setSectionList(newSec);
          callMessageSuccess(t("sec_delete"));
          handleClose1();
          setLoading(false);
        }
      } catch (e) {
        let errMsg = handleError(resp.error);
        callMessageOut(errMsg);
        setLoading(false);
      }
    });
  };

  const handleSubmit2 = () => {
    if (createSer) {
    } else {
      setLoading(true);
      props
        .updateSeries(
          seriesObj.range,
          seriesObj.description,
          selSection.section
        )
        .then((resp) => {
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
              let newSer = seriesList.map((item) => {
                if (item.range == seriesObj.range) {
                  return {
                    ...item,
                    description: seriesObj.description,
                  };
                } else return item;
              });
              setSeriesList(newSer);
              callMessageSuccess(t("ser_update"));
              handleClose2();
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

  const handleDelete2 = () => { };

  const handleClose1 = () => {
    setEditSection(false);
    setCreateSec(false);
    setDelSec(false);
    setsecObj({
      section: "",
      sectionRange: "",
    });
  };

  const handleClose2 = () => {
    setEditSeries(false);
    setCreateSec(false);
    setSeriesObj({
      range: "",
      description: "",
    });
  };

  return (
    <>
      {loading && <Loading />}

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
          <span>{t("section")}</span>
        </div>
        <Paper
          elevation={3}
          style={{
            position: "relative",
            borderRadius: "9px",
            padding: "10px",
          }}
        >
          <div className="sectionHeader">
            {/**
             <Typography variant="h6" color="textPrimary">
              {t("section")}
            </Typography>
            */}
            <div className="secIcons">
              <Tooltip title={t("create_new_section")}>
                <span>
                  <Fab
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                    onClick={() => {
                      setCreateSec(true);
                    }}
                  >
                    <Add style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
                </span>
              </Tooltip>
            </div>
          </div>
          <MaterialReactTable
            tableInstanceRef={tableInstanceRef1}
            data={sectionList}
            manualPagination
            columns={columns1}
            rowCount={sectionCount}
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
                onClick: (e) => {
                  e.preventDefault();
                  setCurrentPage2(0);
                  setPageSize2(10);
                  setSelSection(row?.original);
                },
                sx: {
                  position: "relative",
                  height: "10px",
                  backgroundColor:
                    row.original.section === selSection.section
                      ? "#a2eaea24"
                      : "inherit",
                },
              };
            }}
            muiTableContainerProps={() => ({
              sx: {
                border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                height: "61vh",
                borderRadius: "4px",
              },
              id: "mrt-admin-section",
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
            pageSize={pageSize1}
            pageSizes={pageSizes1}
            setCurrentPage={setCurrentPage1}
            currentPage={currentPage1}
            totalCount={sectionCount}
            setPageSize={setPageSize1}
          />
        </Paper>
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
          <div
            className="sectionHeader"
            style={{
              padding: "6px 1rem",
            }}
          >
            {/*
            
            <Typography variant="h6" color="textPrimary">
              {t("series")}
            </Typography>
            */}
            <div className="secIcons">
              {/*
              <Tooltip title={t("create_new_series")}>
                <span>
                  <Fab
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                    onClick={() => {
                      setCreateSer(true);
                    }}
                  >
                    <Add style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
                </span>
              </Tooltip>
              */}
            </div>
          </div>
          <MaterialReactTable
            data={seriesList}
            manualPagination
            columns={columns2}
            rowCount={seriesCount}
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
                  backgroundColor: "inherit",
                },
              };
            }}
            muiTableContainerProps={() => ({
              sx: {
                border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
                height: "66vh",
                borderRadius: "4px",
              },
              id: "mrt-admin-series",
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
            pageSize={pageSize2}
            pageSizes={pageSizes2}
            setCurrentPage={setCurrentPage2}
            currentPage={currentPage2}
            totalCount={seriesCount}
            setPageSize={setPageSize2}
          />
        </Paper>
      </Grid>

      <Dialog
        open={delSec}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {t("delete_section")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={handleClose1}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <h6>Are you sure you want to delete this section?</h6>
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editSection || createSec}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {editSection ? t("edit_section") : t("create_new_section")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={handleClose1}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("section")}
            name="section"
            variant="outlined"
            value={secObj.section}
            onChange={(e) =>
              setsecObj({
                ...secObj,
                [e.target.name]: e.target.value,
              })
            }
            fullWidth
            size="small"
            style={{ margin: "1rem 0" }}
            className={props.theme ? "darkTextField" : ""}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={t("section")}
          />
          <TextField
            label={t("section-range")}
            name="sectionRange"
            variant="outlined"
            value={secObj.sectionRange}
            onChange={(e) =>
              setsecObj({
                ...secObj,
                [e.target.name]: e.target.value,
              })
            }
            fullWidth
            size="small"
            style={{ margin: "1rem 0" }}
            className={props.theme ? "darkTextField" : ""}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={t("section-range")}
          />
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            disabled={!secObj?.section?.trim() || !secObj?.sectionRange?.trim()}
            onClick={handleSubmit}
          >
            {editSection ? t("update") : t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={delSeries}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {t("delete_series")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={() => setDelSec(false)}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <h6>Are you sure you want to delete this series?</h6>
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            onClick={handleDelete2}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editSeries || createSer}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {editSeries ? t("edit_series") : t("create_new_series")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={handleClose2}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("series")}
            name="series"
            variant="outlined"
            value={seriesObj.range}
            onChange={(e) =>
              setSeriesObj({
                ...seriesObj,
                [e.target.name]: e.target.value,
              })
            }
            fullWidth
            size="small"
            style={{ margin: "1rem 0" }}
            className={props.theme ? "darkTextField" : ""}
            InputProps={{
              readOnly: editSeries,
            }}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={t("series")}
          />
          <TextField
            label={t("ser_desc")}
            name="description"
            variant="outlined"
            value={seriesObj.description}
            onChange={(e) =>
              setSeriesObj({
                ...seriesObj,
                [e.target.name]: e.target.value,
              })
            }
            fullWidth
            size="small"
            style={{ margin: "1rem 0" }}
            className={props.theme ? "darkTextField" : ""}
            InputLabelProps={{
              shrink: true,
            }}
            placeholder={t("ser_desc")}
          />
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            onClick={handleSubmit2}
          >
            {editSeries ? t("update") : t("save")}
          </Button>
        </DialogActions>
      </Dialog>
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
  getSections,
  getSeries,
  addSection,
  delSection,
  updateSeries,
})(AdminBtmTable);
