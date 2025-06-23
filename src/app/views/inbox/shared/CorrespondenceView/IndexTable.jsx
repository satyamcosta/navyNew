import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import PaginationComp from "app/views/utilities/PaginationComp";
import React, { useContext, useEffect, useState } from "react";
import { Loading } from "../../therme-source/material-ui/loading";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import {
  loadIndexData,
  copyCorrespondence,
} from "app/camunda_redux/redux/action";
import { handleError } from "utils";
import { MdOutlinePreview } from "react-icons/md";
import { Cancel } from "@material-ui/icons";
import CorrContainer from "./CorrContainer";
import Draggable from "react-draggable";
import Cookies from "js-cookie";
import { CorrContext } from "./Worker";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const IndexTable = (props) => {
  const { rowId, loadData } = useContext(CorrContext);

  const { theme, indexFile } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [tableId, setTableId] = useState("");
  const [loading, setLoading] = useState(false);

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    loadIndexFiles();
  }, []);

  const handlePreview = (item) => {
    setRow(item);
    setOpen(true);
    Cookies.set("preview", true);
  };

  const loadIndexFiles = () => {
    props
      .loadIndexData(indexFile?.id, pageSize, currentPage, {
        fromDate: "",
        toDate: "",
        type: "",
        subject: "",
      })
      .then(({ response }) => {
        try {
          if (response.error) {
            callMessageOut(response.error);
            setLoading(false);
          } else {
            let tmpArr = [];
            tmpArr = response?.content?.map((item, index) => {
              return {
                ...item,
                id: item.id,
                subject: item.subject,
                classification: item.classification,
              };
            });
            setTotalCount(tmpArr.length);
            setRows(tmpArr);
            setLoading(false);
          }
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        let errMsg = handleError(e.message);
        callMessageOut(errMsg);
        setLoading(false);
      });
  };

  const handleUpload = () => {
    setLoading(true);
    props
      .copyCorrespondence(
        row.id,
        rowId,
        row.application.fileId,
        "Application",
        "Annexures"
      )
      .then((res) => {
        console.log(res);
        loadData(res?.response);
        setLoading(false);
      });
  };

  return (
    <>
      <TableContainer
        component={Paper}
        className="inbox-tab"
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
          border: `1px solid ${theme ? "#727272" : "#c7c7c7"}`,
        }}
      >
        <Table component="div" className="App-main-table">
          <div>
            <div
              className="nof_table_row head"
              style={{
                borderBottom: `1px solid #8080805c`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr 2rem",
                background: "#b1b1b15c",
              }}
            >
              <div>
                <span>{t("subject")}</span>
              </div>
              <div>
                <span>{t("classification")}</span>
              </div>
              <div></div>
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
                      borderBottom: `1px solid ${
                        theme ? "#727070" : "#c7c7c7"
                      }`,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 2rem",
                      alignItems: "center",
                    }}
                  >
                    <div className="info1">
                      <span>{item.subject}</span>
                    </div>
                    <div className="info2">
                      <span>{item.classification}</span>
                    </div>
                    <div>
                      <Tooltip title="Preview Corr">
                        <IconButton onClick={() => handlePreview(item)}>
                          <MdOutlinePreview />
                        </IconButton>
                      </Tooltip>
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
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            Cookies.remove("preview");
            setOpen(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="md"
        id="corr-preview"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("select_corr")}</span>
          <IconButton
            id="Enclosure_remark_&_sign"
            aria-label="close"
            onClick={() => {
              Cookies.remove("preview");
              setOpen(false);
            }}
            color="primary"
            className="cancel-drag"
          >
            <Cancel
              style={{
                color: props.theme ? "#fff" : "#000",
              }}
            />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {loading && <Loading />}
          <CorrContainer corrObj={row} />
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_fileList_cancel_button"
            variant="contained"
            onClick={handleUpload}
            color="secondary"
          >
            {t("copy")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}
export default connect(mapStateToProps, { loadIndexData, copyCorrespondence })(
  IndexTable
);
