import {
  Button,
  DialogActions,
  DialogContent,
  Fab,
  FormControlLabel,
  Grid,
  Paper,
  Radio,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import PaginationComp from "app/views/utilities/PaginationComp";
import React, { useEffect, useState } from "react";
import {
  getIndexFiles,
  saveInFile,
} from "../../../../camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "../../therme-source/material-ui/loading";
import { Add, Done } from "@material-ui/icons";
import { handleError } from "utils";
import history from "../../../../../history";
import GenericSearch from "../../../utilities/GenericSearch";
import GenericChip from "../../../utilities/GenericChips";
import { unstable_batchedUpdates } from "react-dom";
import IndexFileForm from "app/views/Correspondence/IndexFileForm";

const SaveInIndex = ({ handleClose, corrDocId, create, ...props }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);
  const [tableId, setTableId] = useState("");
  const [loading, setLoading] = useState(false);
  const [Filter, setFilter] = useState({});

  // To create new indexFile from save-in form
  const [openIndex, setopenIndex] = useState(false);
  const [trigger, setTrigger] = useState(false);

  const handleForm = (val) => setopenIndex(val);

  const handleTrigger = () => {
    setTrigger(!trigger);
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
    //   value: "status",
    //   label: "Classification",
    // },
    {
      value: "range",
      label: "Date Range",
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

  const StatusOption = ["Unclassified", "Restricted"];

  const FilterValueTypes = [
    {
      name: "subject",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    // {
    //   name: "status",
    //   type: "select",
    //   optionValue: StatusOption,
    //   size: "small",
    //   variant: "outlined",
    //   label: "Value",
    //   color: "primary",
    // },
    {
      name: "range",
      type: "range",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
  ];

  useEffect(() => {
    let indexAbort = new AbortController();
    loadData(indexAbort.signal)
    return () => {
      indexAbort.abort()
    }
  }, [currentPage, pageSize, Filter, trigger]);

  const loadData = (abortSignal) => {
    setLoading(true)
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
    props
      .getIndexFiles(pageSize, currentPage, filter, {}, abortSignal)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
            setLoading(false)
            return;
          } else {
            let tempArr = res.response?.content?.map((item) => {
              return { ...item, isChecked: false };
            });
            setRows(tempArr);
            setTotalCount(res?.response?.totalElements)
            setLoading(false)
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false)
        }
      })
      .catch((e) => {
        callMessageOut(e.message)
        setLoading(false)
      });
  }

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const nofHandleClick = (rowData) => {
    let tempArr = rows.map((item) =>
      item.id === rowData.id
        ? { ...item, isChecked: true }
        : { ...item, isChecked: false }
    );
    // if (e.target.checked) {
    setRow(rowData);
    setTableId(rowData.id);
    // } else {
    //   setRow(null);
    //   setTableId("");
    // }
    setRows(tempArr);
  };

  const handleSubmit = () => {
    setLoading(true)
    props.saveInFile(corrDocId, row?.id, row?.file).then((resp) => {
      try {
        if (resp.error) {
          let errMsg = handleError(resp.error, true);
          callMessageOut(errMsg);
        } else {
          if (resp.response) {
            callMessageSuccess("Saved In Index Successfully");
          }
          setLoading(false);
          handleClose(resp.response?.nofFileName);
        }
      } catch (error) {
        callMessageOut(error.message);
        setLoading(false);
      }
    });
  };

  const callMessageSuccess = (message) => {
    dispatch(setSnackbar(true, "success", message));
  };

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        // setCurrentPage(0);
        // setPageSize(10);
      });
    }
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  return (
    <>
      {loading && <Loading />}
      <div
        className="header-input"
        style={{
          // width: "fit-content",
          padding: "0px 20px 10px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          // padding: "0rem 1rem",
        }}
      >

        <Grid container justifyContent="space-between">
          <Grid item xs={9}>
            <GenericSearch
              FilterTypes={FilterTypes}
              FilterValueTypes={FilterValueTypes}
              addFilter={addFilter}
              cssCls={{}}
              width={"100%"}
            />

          </Grid>
          <Grid item xs={1}>
            <Tooltip
              title={
                t("crt_ind")
              }
            >
              <span>
                <Fab
                  style={{
                    width: "2.2rem",
                    height: ".1rem",
                    backgroundColor: "rgb(230, 81, 71)",
                  }}
                  onClick={() => setopenIndex(true)}
                >
                  <Add style={{ fontSize: "19", color: "#fff" }} />
                </Fab>
              </span>
            </Tooltip>
          </Grid>
        </Grid>
        <GenericChip Filter={Filter} deleteChip={deleteChip} />

      </div>
      <DialogContent dividers>
        <TableContainer
          component={Paper}
          className="inbox-tab"
          elevation={3}
          style={{
            position: "relative",
            borderRadius: "9px",
            border: `1px solid ${props.theme ? "#727272" : "#c7c7c7"}`,
          }}
        >
          <Table component="div" className="App-main-table">
            <div>
              <div
                className="nof_table_row head"
                style={{
                  borderBottom: `1px solid #8080805c`,
                  display: "grid",
                  gridTemplateColumns: "2rem 1fr 1fr",
                  background: "#b1b1b15c",
                }}
              >
                <div></div>
                <div>
                  <span>{t("file_no")}</span>
                </div>
                <div>
                  <span>{t("subject")}</span>
                </div>
              </div>
            </div>
            <TableBody
              component="div"
              style={{
                height: "30vh",
                overflow: "auto",
              }}
            >
              {/* Mapping data coming from backnd */}

              {rows.map((item, i) => {
                return (
                  <TableRow
                    hover
                    component="div"
                    key={i}
                    selected={item.id === tableId}
                  >
                    <div
                      className="nof_table_row"
                      style={{
                        borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"
                          }`,
                        display: "grid",
                        gridTemplateColumns: "2rem 1fr 1fr",
                        alignItems: "center",
                      }}
                    >
                      <div className="checkbox">
                        <FormControlLabel
                          control={
                            <Radio
                              checked={item.isChecked}
                              onClick={(e) => {
                                e.stopPropagation();
                                nofHandleClick(item);
                              }}
                            />
                          }
                        />
                      </div>
                      <div className="info1">
                        <span>{item.file}</span>
                      </div>
                      <div className="info2">
                        <span>{item.subject}</span>
                      </div>
                    </div>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <PaginationComp
            pageSize={pageSize}
            pageSizes={[5, 10, 15]}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            totalCount={totalCount}
            setPageSize={setPageSize}
          />
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button
          id="peronalAppForm_done_btn"
          color="secondary"
          variant="contained"
          type="submit"
          style={{ marginLeft: "1rem" }}
          endIcon={<Done />}
          disabled={!row}
          onClick={handleSubmit}
        >
          {t("save")}
        </Button>
      </DialogActions>

      <IndexFileForm
        open={openIndex}
        handleForm={handleForm}
        handleTrigger={handleTrigger}
        handleSelect={() => { }}
      />

    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  getIndexFiles,
  saveInFile,
})(SaveInIndex);
