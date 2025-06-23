import React, { useState, useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import "../../index.css";
import { useTranslation } from "react-i18next";
import "react-tabs/style/react-tabs.css";
import { PreviousStatus } from "app/camunda_redux/redux/action";
import PaginationComp from "app/views/utilities/PaginationComp";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import {
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  Typography,
  TableHead,
} from "@material-ui/core";

const ViewPreviousStatus = (props) => {
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const PreviousStatusData = useSelector(
    (state) => state.PreStatusReducer.preStatus
  );

  useEffect(() => {
    props
      .PreviousStatus(props.id)
      .then((res) => {
        try {
          if (res.error) {
            callMessageOut(res.error);
          }
        } catch (error) {}
      })
      .catch((err) => {
        callMessageOut(err.error);
      });
  }, []);

  return (
    <div
      elevation={3}
      style={{ position: "relative", borderRadius: "9px", marginTop: "1rem" }}
      className="dashboard_table"
    >
      <Paper
        className="dash-table"
        style={{
          borderRadius: "9px",

          width: "100%",
        }}
      >
        <div
          style={{
            padding: "0 1rem",
            marginTop: "1rem",
            height: "calc(100vh - 480px)",
          }}
        >
          <TableContainer
            component={Paper}
            className="DashTableCon"
            style={{
              border: `1px solid ${props.theme ? "#727070" : "#c7c7c7"}`,
              borderRadius: "6px",
              height: "calc(100vh - 480px)",
            }}
          >
            <Table
              component="div"
              className="App-main-table"
              aria-label="simple table"
            >
              <TableHead component="div">
                <TableRow
                  component="div"
                  style={{
                    backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                  }}
                >
                  <div className="DashboardRow">
                    <div className="statusInfo2">
                      <span>{t("status")}</span>
                    </div>
                    <div className="statusInfo2">
                      <span>{t("message")}</span>
                    </div>

                    <div className="DashInfo5">
                      <span>{t("date")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody component="div">
                {/* Mapping data coming from backnd */}
                {PreviousStatusData &&
                  PreviousStatusData.map((item, i) => {
                    // Row defination and styling here

                    return (
                      <TableRow
                        hover
                        component="div"
                        key={i}
                        style={{
                          borderBottom: "1px solid #8080805c",
                          position: "relative",
                        }}
                      >
                        <div className="DashboardRow body">
                          <div className="statusInfo2">
                            <span>{item.status}</span>
                          </div>
                          <div className="statusInfo2">
                            <span>{item.message}</span>
                          </div>
                          <div className="DashInfo3">
                            <span>{item.date}</span>
                          </div>
                        </div>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
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
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, { PreviousStatus })(ViewPreviousStatus);
