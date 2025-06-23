import React, { useEffect, useMemo, useRef, useState } from "react";
import PaginationComp from "../utilities/PaginationComp";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Grid,
  IconButton,
  makeStyles,
  MenuItem,
  Paper,
  Slide,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import GenericSearch from "../utilities/GenericSearch";
import GenericFilterMenu from "../utilities/GenericFilterMenu";
import { useTranslation } from "react-i18next";
import GenericChip from "../utilities/GenericChips";
import { connect, useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { Add, Cancel, Done, Edit } from "@material-ui/icons";
import "./therme-source/material-ui/loading.css";
import Draggable from "react-draggable";
import {
  addMrDraftDak,
  getAllCorespondence,
  getCorespondence,
  createMrDak,
  deleteMrDak,
  editMrDak,
} from "app/camunda_redux/redux/action";
import DeleteIcon from "@material-ui/icons/Delete";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "./therme-source/material-ui/loading";
import SplitViewPdfViewer from "../inbox/shared/pdfViewer/pdfViewer";
import * as Yup from "yup";
import { useFormik } from "formik";
import { unstable_batchedUpdates } from "react-dom";
import GenericColHider from "../utilities/GenericColHider";
import { MRDRAFT_COLUMNS_STATUS } from "app/camunda_redux/redux/constants/ActionTypes";
import GenericRefresh from "../utilities/GenericRefresh";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  divZIndex: {
    zIndex: "0",
    "& .MuiDialogContent-dividers": {
      padding: "0px 0px !important",
    },
    "& #pdfV": {
      height: "calc(100vh - 47px) !important",
    },
    "& .e-de-ctn": {
      height: "calc(100vh - 40px) !important",
    },
  },
  sign_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "30px !important",
    zIndex: 10,
  },
  sign_btn1: {
    position: "fixed",
    right: "30px !important",
    bottom: "90px !important",
    zIndex: 10,
  },
  send_btn: {
    position: "fixed",
    right: "30px !important",
    bottom: "30px !important",
    zIndex: 10,
  },
  headerText: {
    display: "inline-flex",
    justifyContent: "center",
    marginBottom: "0px",
    fontSize: "1rem",
  },
  table: {
    minWidth: "900px",
  },
  prevBtn: {
    position: "absolute",
    top: 1,
    right: "180px",
    zIndex: 999,
  },
  nextBtn: {
    position: "absolute",
    top: 1,
    right: "140px",
    zIndex: 999,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const configData = {
  fullWidth: true,
  size: "small",
};

const MrDraftFileTable = (props) => {
  let today = new Date().toISOString().slice(0, 10);

  const { t } = useTranslation();
  const classes = useStyles();

  const inpRef = useRef();
  const dispatch = useDispatch();

  const [rowData, setRowData] = useState([]);
  const [rowID, setRowID] = useState("");
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const [pdfLoads, setPdfLoads] = useState(false);

  const [Filter, setFilter] = useState({});
  const [SortBy, setSortBy] = useState({});
  const [openUpload, setOpenUpload] = useState(false);
  const [draftDakObj, setDrafDakObj] = useState("");
  const [subject, setSubject] = useState("");
  const [rowItem, setRowItem] = useState("");
  const [application, setApplication] = useState("");
  const [openDraft, setOpenDraft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mrDakId, setMrDakId] = useState("");
  const [openDel, setOpendel] = useState(false);
  const [sub, setSub] = useState("");
  const [edit, setEdit] = useState(false);

  const [trigger, setTrigger] = useState(false);

  const { theme } = useSelector((state) => state);

  const { mrDraftHiddenColumns } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );

  let mrDraftCol = {
    subject: true,
    createdOn: true,
    status: true,
    actions: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    mrDraftHiddenColumns || mrDraftCol
  );

  const fileTypes = [
    "Letter",
    "Note",
    "Fax",
    "Memo",
    "Brief",
    "Minutes Of Meeting",
    "Signal",
    "Circular",
    "Other",
  ];

  const classificationlist = ["Unclassified", "Restricted"];

  const INITIAL_STATE = {
    subject: "",
    type: fileTypes[0],
    classification: classificationlist[0],
    sign_date: "",
    due_date: "",
    ref_no: "",
    from: "",
  };

  const VALIDATION_SCHEMA = Yup.object().shape({
    subject: Yup.string(t("enter_a_subject"))
      .trim()
      .max(250, t("subject_should_not_be_greater_than_250_characters"))
      .required(`${t("this_field_is_required")} !`),

    type: Yup.string(t("enter_correspondence_type")).required(
      `${t("this_field_is_required")} !`
    ),

    classification: Yup.string(
      t("enter_correspondence_classfication")
    ).required(`${t("this_field_is_required")} !`),

    sign_date: Yup.date()
      .required("Date is required")
      .typeError("Invalid date format (must be YYYY-MM-DD)"),

    due_date: Yup.date()
      .required("Date is required")
      .typeError("Invalid date format (must be YYYY-MM-DD)"),

    ref_no: Yup.string(t("enter_reference")).required(
      `${t("this_field_is_required")} !`
    ),

    from: Yup.string(t("enter_from")).required(
      `${t("this_field_is_required")} !`
    ),
  });

  const formik = useFormik({
    initialValues: INITIAL_STATE,
    validationSchema: VALIDATION_SCHEMA,

    onSubmit: (values) => {
      setLoading(true);
      const {
        classification,
        from,
        type,
        ref_no,
        sign_date,
        due_date,
        subject,
      } = formik.values;
      props
        .createMrDak(
          classification,
          from,
          type,
          ref_no,
          sign_date,
          due_date,
          subject,
          mrDakId
        )
        .then((res) => {
          try {
            if (res.response.error) {
              callMessageOut("error", res.response.error);
              setLoading(false);
              return;
            } else {
              setLoading(false);
              dispatch(
                setSnackbar(true, "success", t("corr_sent_successfully"))
              );
              let newRowData = rowData.filter((item) => {
                return item.id != res.response.id;
              });
              setRowData(newRowData);
              setOpenDraft(false);
            }
          } catch (error) {
            callMessageOut("error", error.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-dak");
    adjustableDiv.style.height = viewportHeight - 175 + "px";
  }

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

  const addSort = (sortObj) => {
    setSortBy(sortObj);
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "subject",
      label: "Subject",
    },
    // {
    //   value: "createdOn",
    //   label: "Created On",
    // },
    {
      value: "range",
      label: "Date Range",
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
      name: "range",
      type: "range",
      size: "small",
      variant: "outlined",
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
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Date",
    },
  ];

  const columns = useMemo(
    () => [
      {
        accessorKey: "subject",
        header: t("subject"),
        size: 230,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
      {
        accessorKey: "createdOn",
        header: t("created_on"),
        size: 100,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
      // {
      //   accessorKey: "status",
      //   header: t("status"),
      //   size: 150,
      //   Cell: ({ cell }) => (
      //     <div className="paInfo5">
      //       <span
      //         style={{
      //           backgroundColor:
      //             cell.getValue() === "In Progress"
      //               ? "#ffaf38"
      //               : cell.getValue() === "Draft"
      //               ? "#398ea1"
      //               : cell.getValue() === "Rejected"
      //               ? "#fd4e32"
      //               : cell.getValue() === "Approved"
      //               ? "#37d392"
      //               : cell.getValue() === "Return"
      //               ? "#b73b32"
      //               : cell.getValue() === "Draft_Local"
      //               ? "#003f50"
      //               : "",
      //         }}
      //         className="status"
      //       >
      //         {cell.getValue() == "Draft_Local"
      //           ? "LOCAL DRAFT"
      //           : cell.getValue()?.toUpperCase()}
      //       </span>
      //     </div>
      //   ),
      // },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 60,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <>
              <div
                style={{
                  display: "flex",
                }}
              >
                <Tooltip title={t("delete")} aria-label="Edit Subject">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpendel(true);
                      setRowItem(row);
                    }}
                  >
                    <DeleteIcon color="error" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("edit")} aria-label="Edit Subject">
                  <IconButton
                    id="draftPA_del_btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEdit(true);
                      setRowItem(row);
                      setSub(row?.subject);
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
    ],
    [Cookies.get("i18next"), t]
  );

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
    // };
    // if (this.id === undefined) {
    //   return dispatch(setSnackbar(true, "error", message));
    // }
  };

  const handleDelete = () => {
    props.blnEnableLoader(true);
    props
      .deleteMrDak(rowItem.id)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            let newArr = rowData.filter((item) => {
              return item.id != rowItem.id;
            });
            dispatch(setSnackbar(true, "success", t("dak_delete")));
            setRowData(newArr);
            setOpendel(false);
            props.blnEnableLoader(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      });
  };

  const handleEdit = () => {
    props.blnEnableLoader(true);
    props
      .editMrDak(rowItem.id, sub)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            let newArr = rowData.map((item) => {
              if (item.id != rowItem.id) return { ...item };
              else return { ...item, subject: sub };
            });
            dispatch(setSnackbar(true, "success", t("edit_dak")));
            setRowData(newArr);
            setEdit(false);
            setSub("");
            props.blnEnableLoader(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      });
  };

  const handleSubmit = () => {
    props.blnEnableLoader(true);
    const formData = new FormData();
    formData.append("file", draftDakObj);
    props
      .addMrDraftDak(formData, draftDakObj?.name)
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            handleClick(resp.response);
            handleClose();
            setOpenDraft(true);
            props.blnEnableLoader(false);
            setRowData([...rowData, resp.response]);
            formik.setFieldValue("subject", resp.response?.subject);
          }
        } catch (e) {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      });
  };

  useEffect(() => {
    // console.log(SortBy);
    let draftAbort = new AbortController();
    pADraftTableData(draftAbort.signal);

    return () => {
      draftAbort.abort();
    };
  }, [currentPage, pageSize, Filter, SortBy, trigger]);

  useEffect(() => {
    if (!openDraft) {
      formik.resetForm();
    }
  }, [openDraft]);

  const pADraftTableData = (abortSignal) => {
    props.blnEnableLoader(true);
    setRowData([]);
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      if (property.includes("range")) {
        let dates = Object.values(value);
        let rangeObj = {
          fromDate: dates[0],
          toDate: dates[1],
        };
        filter = { ...filter, ...rangeObj };
      } else {
        let key = property.split("|")[0];
        filter[`${key}`] = value;
      }
    });
    let sort = null;
    if (!_.isEmpty(SortBy)) {
      sort = {
        title: SortBy?.title?.name,
        type: SortBy?.type,
      };
    }

    let corrSort;
    if (SortBy?.title) {
      corrSort = {
        sortByField: SortBy.title.name,
        asc: SortBy?.type == "Asc" ? true : false,
      };
    }
    props
      .getAllCorespondence(
        pageSize,
        currentPage,
        _.isEmpty(filter) ? {} : filter,
        _.isEmpty(corrSort) ? {} : corrSort,
        abortSignal
      )
      .then((resp) => {
        if (resp?.error?.includes("aborted")) {
          return;
        }
        let tmpArr = [];
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
            return;
          } else {
            setTotalCount(
              resp.response.length != null ? resp.response.length : 0
            );
            tmpArr = resp.response.data.map((item, index) => {
              return {
                ...item,
                serialNo: pageSize * currentPage + (index + 1),
              };
            });

            setRowData(tmpArr);
            props.blnEnableLoader(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      });
  };

  const handleClick = (rowData) => {
    handleCorrClick(rowData);
    setRowItem(rowData);
    setMrDakId(rowData.id);
    formik.setFieldValue("subject", rowData.subject);
  };

  const handleCorrClick = (rowData) => {
    props.blnEnableLoader(true);
    props
      .getCorespondence(rowData.correspondenceDocId)
      .then((res) => {
        const { application, id } = res.response;
        sessionStorage.setItem("FileURL", application.fileUrl);
        setApplication(application.fileUrl);
        // setMrDakId(id);
        props.blnEnableLoader(false);
        setOpenDraft(true);
      })
      .catch((err) => {
        console.log(err);
        props.blnEnableLoader(false);
      });
  };

  const handleClose = () => {
    setDrafDakObj(null);
    setOpenUpload(false);
    setSubject("");
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="mrt-head">
        <span>{t("draft_dak")}</span>
      </div>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
        }}
      >
        <div id="material-table">
          <div
            className="PaHeader"
            style={{
              padding: "0rem 1rem",
            }}
          >
            <div className="PaHeadTop">
              <GenericSearch
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
              />

              <div>
                <GenericRefresh handleRefresh={() => setTrigger(!trigger)} />
                <GenericFilterMenu
                  sort={SortBy}
                  SortValueTypes={SortValueTypes}
                  addSort={addSort}
                />
                <div className="PaIconCon">
                  <Tooltip title={t("upload_dak")}>
                    <span>
                      <Fab
                        style={{
                          width: "2.2rem",
                          height: ".1rem",
                          backgroundColor: "rgb(230, 81, 71)",
                        }}
                        onClick={() => {
                          inpRef.current.click();
                        }}
                      >
                        <Add style={{ fontSize: "19", color: "#fff" }} />
                      </Fab>
                    </span>
                  </Tooltip>
                </div>
                <GenericColHider
                  tableCols={columnVisibility}
                  setTableCols={setColumnVisibility}
                  moduleName={MRDRAFT_COLUMNS_STATUS}
                />
              </div>
            </div>

            <GenericChip Filter={Filter} deleteChip={deleteChip} />
          </div>
          <MaterialReactTable
            data={rowData}
            manualPagination
            columns={columns}
            initialState={{
              density: "compact",
            }}
            state={{
              columnVisibility,
            }}
            displayColumnDefOptions={{
              "mrt-row-select": {
                size: 100,
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
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableColumnResizing
            enableStickyHeader
            enableFilters={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            muiTableBodyRowProps={({ row, staticRowIndex }) => ({
              onClick: () => {
                handleClick(row?.original);
              },

              sx: {
                cursor: "pointer",
                // background: "inherit",
                height: "10px",
                backgroundColor: staticRowIndex % 2 ? props.theme ? "#4c5765" : "d6e0ec" : "inherit"
              },
            })}
            muiTableContainerProps={() => ({
              sx: {
                border: "1px solid #8080802b",
                height: "61vh",
              },
              id: "mrt-dak",
            })}
            muiTablePaperProps={() => ({
              sx: {
                padding: "0rem 1rem",
                border: "0",
                boxShadow: "none",
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
            pageSize={pageSize}
            pageSizes={pageSizes}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalCount={totalCount}
            setPageSize={setPageSize}
          />
        </div>
      </Paper>

      <input
        type="file"
        accept="application/pdf"
        ref={inpRef}
        onChange={(e) => {
          setDrafDakObj(e.target.files[0]);
          setSubject(e.target.files[0].name);
          setOpenUpload(true);
        }}
        style={{
          display: "none",
        }}
      />

      <Dialog
        open={openUpload}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleClose();
          }
        }}
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
          {t("upload_dak")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={handleClose}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid>
            <TextField
              label={t("enter_a_subject")}
              variant="outlined"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              size="small"
              style={{ margin: "1rem 0" }}
              className={props.theme ? "darkTextField" : ""}
            />
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            endIcon={<Done />}
            onClick={handleSubmit}
          >
            {t("upload")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDel}
        onClose={(event, reason) => {
          setOpendel(false);
        }}
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
          {t("delete_dak")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={() => setOpendel(false)}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <h6>Are you sure you want to delete this dak?</h6>
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
        open={edit}
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
          {t("edit_subject")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={() => setEdit(false)}
            color="primary"
            className="cancel-drag"
          >
            <Cancel style={{ color: props.theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label={t("edit_subject")}
            variant="outlined"
            value={sub}
            onChange={(e) => setSub(e.target.value)}
            fullWidth
            size="small"
            style={{ margin: "1rem 0" }}
            className={props.theme ? "darkTextField" : ""}
          />
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            onClick={handleEdit}
          >
            {t("update")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openDraft}
        fullScreen
        aria-labelledby="quickSignDialog"
        TransitionComponent={Transition}
        className={`${classes.divZIndex} dialog-wrapper`}
        id="draggable-dialog-title"
      >
        <DialogContent
          dividers
          style={{
            overflow: "hidden",
            backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
            height: "100%",
          }}
        >
          {loading && <Loading />}
          <Grid
            container
            style={{
              height: "100%",
            }}
          >
            <Grid
              item
              style={{
                width: "100%",
              }}
            >
              <IconButton
                id="draftPA_close_PA"
                aria-label="close"
                onClick={() => {
                  setOpenDraft(false);
                }}
                style={{
                  color: theme ? "#fff" : "#484747",
                  float: "right",
                  padding: "0.5rem",
                }}
              >
                <Cancel />
              </IconButton>
            </Grid>
            <Grid
              container
              style={{
                width: "100%",
                height: "100%",
                overflow: "scroll",
              }}
              justifyContent="space-around"
            >
              <div
                style={{
                  width: "60%",
                }}
                className="ss-privacy-hide"
              >
                <SplitViewPdfViewer
                  fileUrl={application}
                  pdfLoads={(val) => {
                    setPdfLoads(val);
                  }}
                  editable={false}
                  extension={"pdf"}
                />
              </div>
              <div
                style={{
                  width: "38%",
                }}
              >
                <Paper
                  elevation={3}
                  style={{
                    position: "relative",
                    borderRadius: "9px",
                  }}
                >
                  <form onSubmit={formik.handleSubmit}>
                    <Typography
                      variant="h6"
                      style={{
                        borderBottom: "1px solid #80808059",
                        padding: "10px",
                        paddingBottom: "0",
                      }}
                    >
                      {t("mrdak_info")}
                    </Typography>
                    <Grid
                      container
                      spacing={2}
                      style={{
                        padding: "1rem",
                      }}
                    >
                      <Grid item xs={12}>
                        <TextField
                          {...configData}
                          variant="outlined"
                          multiline
                          minRows={3}
                          name="subject"
                          label={t("subject")}
                          className={theme ? "darkTextField" : ""}
                          value={formik.values.subject}
                          placeholder={t("dak_subject")}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.subject &&
                            Boolean(formik.errors.subject)
                          }
                          helperText={
                            formik.touched.subject && formik.errors.subject
                          }
                          autoFocus
                        />
                      </Grid>

                      <Grid
                        item
                        md={6}
                        xs={12}
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <TextField
                          {...configData}
                          id="outlined-select-currency"
                          select
                          label={t("type")}
                          name="type"
                          value={formik.values.type}
                          onChange={formik.handleChange}
                          variant="outlined"
                          className={` corr-form-select ${theme ? "darkTextField" : ""
                            }`}
                          error={
                            formik.touched.type && Boolean(formik.errors.type)
                          }
                          helperText={formik.touched.type && formik.errors.type}
                        >
                          {fileTypes.map((option, i) => (
                            <MenuItem key={i} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid
                        item
                        md={6}
                        xs={12}
                        style={{
                          marginTop: "4px",
                        }}
                      >
                        <TextField
                          {...configData}
                          id="outlined-select-currency"
                          select
                          label={t("classification")}
                          name="classification"
                          value={formik.values.classification}
                          onChange={formik.handleChange}
                          variant="outlined"
                          className={`corr-form-select ${props.theme ? "darkTextField" : ""
                            }`}
                          error={
                            formik.touched.classification &&
                            Boolean(formik.errors.classification)
                          }
                          helperText={
                            formik.touched.classification &&
                            formik.errors.classification
                          }
                        >
                          {classificationlist.map((option, i) => (
                            <MenuItem key={i} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          {...configData}
                          variant="outlined"
                          multiline
                          name="from"
                          label={t("enter_from")}
                          className={theme ? "darkTextField" : ""}
                          value={formik.values.from}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.subject &&
                            Boolean(formik.errors.from)
                          }
                          helperText={formik.touched.from && formik.errors.from}
                          autoFocus
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          {...configData}
                          variant="outlined"
                          multiline
                          name="ref_no"
                          label={t("enter_reference")}
                          className={theme ? "darkTextField" : ""}
                          value={formik.values.ref_no}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.ref_no &&
                            Boolean(formik.errors.ref_no)
                          }
                          helperText={
                            formik.touched.ref_no && formik.errors.ref_no
                          }
                          autoFocus
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          type="date"
                          {...configData}
                          variant="outlined"
                          name="sign_date"
                          label={t("sign_date")}
                          className={theme ? "darkTextField" : ""}
                          value={formik.values.sign_date}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.sign_date &&
                            Boolean(formik.errors.sign_date)
                          }
                          helperText={
                            formik.touched.sign_date && formik.errors.sign_date
                          }
                          autoFocus
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                          type="date"
                          {...configData}
                          variant="outlined"
                          name="due_date"
                          label={t("due_date")}
                          className={theme ? "darkTextField" : ""}
                          value={formik.values.due_date}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            inputProps: { min: today },
                          }}
                          onChange={formik.handleChange}
                          error={
                            formik.touched.due_date &&
                            Boolean(formik.errors.due_date)
                          }
                          helperText={
                            formik.touched.due_date && formik.errors.due_date
                          }
                          autoFocus
                        />
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          id="mrDak_done_btn"
                          color="secondary"
                          variant="contained"
                          type="submit"
                          style={{ float: "right" }}
                          endIcon={<Done />}
                        >
                          {t("submit")}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </div>
            </Grid>
          </Grid>
        </DialogContent>
      </Dialog>
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

export default connect(mapStateToProps, {
  addMrDraftDak,
  getAllCorespondence,
  getCorespondence,
  createMrDak,
  deleteMrDak,
  editMrDak,
})(MrDraftFileTable);
