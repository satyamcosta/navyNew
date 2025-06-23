import {
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  Fab,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Announcement, Close, Cancel } from "@material-ui/icons";
import PaginationComp from "app/views/utilities/PaginationComp";
import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Draggable from "react-draggable";
import { loadInternalcommentDataSplitview } from "app/camunda_redux/redux/action";
import { useTranslation } from "react-i18next";
import { connect, useDispatch } from "react-redux";
import { BmContext } from "./SplitviewContainer/BmContainer/Worker";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: "350px",
  },
}));

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const InternalCommentFile = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSizes] = useState([5, 10, 15]);
  const [internal, setInternal] = useState([]);
  const department = sessionStorage.getItem("department");
  const classes = useStyles();

  const {
    partCaseId,
    openInternalcomment,
    setopenInternalcomment,
    handleCount,
  } = useContext(BmContext);

  const refNo = Cookies.get("referenceNumber");
  const updatedRefNo = refNo?.replace(/\//g, "-");

  useEffect(() => {
    if (partCaseId) {
      getInternalcomment();
    }
  }, [partCaseId, currentPage, pageSize]);

  const getInternalcomment = async () => {
    props
      .loadInternalcommentDataSplitview(
        updatedRefNo,
        currentPage,
        pageSize,
        department
      )
      .then((res) => {

        try {
          if (res.error) {
            callMessageOut("error", res.error);
            return;
          } else {
            setInternal(res);
            setTotalCount(res?.length);
            handleCount("internal-comment", res?.length);
          }
        } catch (e) {
          console.log(e.message);
          callMessageOut("error", e.message);
        }
      })
      .catch((err) => {
        console.log(err);
        callMessageOut("error", err.message);
      });
  };

  const callMessageOut = (type, message) => {
    dispatch(setSnackbar(true, type, message));
  };

  return (
    <>
      <Dialog
        open={openInternalcomment}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setopenInternalcomment(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
          onClose={() => setopenInternalcomment(false)}
        >
          <span>{t("INTERNAL COMMENT")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="internal_dialog_close_button"
              aria-label="close"
              onClick={() => setopenInternalcomment(false)}
              color="primary"
              className="cancel-drag"
            >
              <Cancel
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>

        <DialogContent dividers>
          <Paper
            style={{
              width: "100%",
              position: "relative",
              borderRadius: "6px",
              border: `1px solid ${props.theme ? "#727272" : "#c7c7c7"}`,
            }}
          >
            <TableContainer component={Paper} className="remarkTableCon">
              <Table
                component="div"
                className={`${classes.table} App-main-table`}
                aria-label="simple table"
              >
                <div>
                  <div
                    className="internal_table_head"
                    style={{
                      fontWeight: "600",
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 2fr",
                      alignItems: "center",
                      textAlign: "center",
                      backgroundColor: "#e3e3e3",
                      padding: "0.4rem",
                      borderBottom: `1px solid ${props.theme ? "#727272" : "#c7c7c7"
                        }`,
                    }}
                  >
                    <div>
                      <span>{t("date")}</span>
                    </div>
                    <div>
                      <span>{t("by")}</span>
                    </div>
                    <div>
                      <span>{t("comment")}</span>
                    </div>
                  </div>
                </div>
                <TableBody
                  component="div"
                  style={{
                    height: "30vh",
                  }}
                >
                  {/* Mapping data coming from backnd */}
                  {internal?.map((item, i) => {
                    // Row defination and styling here

                    return (
                      <TableRow
                        hover
                        component="div"
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        key={i}
                        style={{
                          border: "1px solid #8080805c",
                          borderWidth: "0px 0px 1px 0px",
                          position: "relative",
                        }}
                      >
                        <div
                          className="remarks_table_row"
                          style={{
                            borderBottom: `1px solid ${props.theme ? "#727070" : "#c7c7c7"
                              }`,
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr 2fr",
                            alignItems: "center",
                            textAlign: "center",
                          }}
                        >
                          <div className="remarks_info1">
                            <span>{item.createdAt}</span>
                          </div>
                          <div className="remarks_info2">
                            <span>{item.displayFrom || item.displayFromRole}</span>
                          </div>
                          <div className="remarks_info_3">
                            <span>{decodeURIComponent(item.comment)}</span>
                          </div>
                        </div>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>

            <PaginationComp
              pageSize={pageSize}
              pageSizes={pageSizes}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              totalCount={totalCount}
              setPageSize={setPageSize}
            />
          </Paper>
        </DialogContent>
      </Dialog>
    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}
export default connect(mapStateToProps, {
  loadInternalcommentDataSplitview,
})(InternalCommentFile);
