import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import {
  getIndexFiles,
  copyCorrespondence,
} from "../../../../camunda_redux/redux/action";
import PaginationComp from "app/views/utilities/PaginationComp";
import { Loading } from "../../therme-source/material-ui/loading";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import { Cancel } from "@material-ui/icons";
import IndexTable from "./IndexTable";
import { MdOutlinePreview } from "react-icons/md";
import Cookies from "js-cookie";
import history from "../../../../../history";
import FileViewTable from "app/views/Personnel/FileViewTable";
import { CorrContext } from "./Worker";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title1" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const ImportDak = (props) => {
  const { handleReload, rowId } = useContext(CorrContext);
  const { theme } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);
  const [tableId, setTableId] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // State to keep track of imported file or dak
  const [importList, setimportList] = useState([]);

  useEffect(() => {
    let Abort = new AbortController();
    loadIndexFiles(Abort.signal);
    return () => Abort.abort();
  }, [currentPage, pageSize]);

  const loadIndexFiles = (abortSignal) => {
    setLoading(true);
    props
      .getIndexFiles(pageSize, currentPage, {}, {}, abortSignal)
      .then((resp) => {
        let tmpArr = [];
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
          } else {
            if (resp.response !== undefined) {
              tmpArr = resp.response?.content?.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setRows(tmpArr);
              setTotalCount(resp.response?.totalElements || 0);
              setLoading(false);
            } else {
              const errorMessage =
                resp.status + " : " + resp.error + " AT " + resp.path;
              callMessageOut(errorMessage);
              setLoading(false);
            }
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
        setLoading(false);
      });
  };

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const handleClose = () => {
    Cookies.remove("preview");
    Cookies.remove("isCorr");
    Cookies.remove("import");
    Cookies.remove("paFileId");
    Cookies.remove("index");
    // setimportList([]);
  };

  const handleClick = (item) => {
    setRow(item);
    setOpen(true);
    Cookies.set("isCorr", true);
    Cookies.set("import", true);
    Cookies.set("paFileId", item.id);
    Cookies.set("index", true);
    Cookies.set("preview", true);
  };

  const handleUpload = () => {
    setLoading(true);
    props.copyCorrespondence(rowId, importList, "Annexures").then((res) => {
      setLoading(false);
      setOpen(false);
      handleClose();
      handleReload();
    });
  };

  return (
    <>
      {loading && <Loading />}
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
                <span>{t("typeOfFile")}</span>
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
                  onDoubleClick={() => handleClick(item)}
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
                      <span>{item.typeOfFile}</span>
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
            setOpen(false);
            handleClose();
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="md"
        id="viewone-preview"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title1"
          className="dialog_title"
        >
          <span>{t("preview")}</span>
          <IconButton
            id="Enclosure_remark_&_sign"
            aria-label="close"
            onClick={() => {
              setOpen(false);
              handleClose();
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
          <FileViewTable
            setimportList={setimportList}
            importList={importList}
          />
        </DialogContent>
        <DialogActions>
          <Button
            id="inbox_fileList_cancel_button"
            variant="contained"
            onClick={handleUpload}
            color="secondary"
            disabled={!importList.length}
          >
            {t("import")}
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
export default connect(mapStateToProps, { getIndexFiles, copyCorrespondence })(
  ImportDak
);
