import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
} from "@material-ui/core";
import { getFiles } from "../../../../camunda_redux/redux/action";
import PaginationComp from "app/views/utilities/PaginationComp";
import React, { useEffect, useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const ImportFile = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [row, setRow] = useState(null);
  const [tableId, setTableId] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleClick = (item) => {
    setRow(item);
    setOpen(true);
    Cookies.set("isCorr", true);
    Cookies.set("import", true);
    Cookies.set("paFileId", item.id);
    Cookies.set("index", true);
    Cookies.set("preview", true);
  };

  useEffect(() => {
    let Abort = new AbortController();
    loadFiles(Abort.signal);
    return ()=> Abort.abort()
  }, [currentPage, pageSize]);

  const callMessageOut = (message) => {
    setLoading(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const loadFiles = (abortSignal) => {
    setLoading(true);
    props
      .getFiles(pageSize, currentPage, {}, {}, abortSignal)
      .then((resp) => {
        let tmpArr = [];
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
          } else {
            if (resp.response !== undefined) {
              tmpArr = resp.response?.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });
              setRows(tmpArr);
              setTotalCount(
                resp.response?.length != null ? resp.response?.length : 0
              );
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

  return (
    <>
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
                        props.theme ? "#727070" : "#c7c7c7"
                      }`,
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr 2rem",
                      alignItems: "center",
                    }}
                  >
                    <div className="info1">
                      <span>{item?.bmFile?.subject}</span>
                    </div>
                    <div className="info2">
                      <span>{item?.bmFile?.fileClassification}</span>
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
    </>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}
export default connect(mapStateToProps, { getFiles })(ImportFile);
