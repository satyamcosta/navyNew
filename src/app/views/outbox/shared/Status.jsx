import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import { Done, DoneAll } from "@material-ui/icons";
import PaginationComp from "app/views/utilities/PaginationComp";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const Status = ({ statusArr, type, theme, ...props }) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(statusArr?.length);
  const [pageSize, setPageSize] = useState(25);

  return (
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
        <TableHead component="div">
          <TableRow
            style={{
              borderBottom: `1px solid #8080805c`,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              background: "#b1b1b15c",
              placeItems: "center",
            }}
            component="div"
          >
            <>
              <TableCell component="div">
                {type ? t("department").toUpperCase() : t("role")}
              </TableCell>
              <TableCell component="div">{t("status")}</TableCell>
            </>
          </TableRow>
        </TableHead>
        <TableBody
          style={{
            height: "30vh",
            overflow: "auto",
          }}
          component="div"
        >
          {statusArr?.map((item) => (
            <TableRow
              hover
              component="div"
              key={item.id} // Assuming item has a unique identifier like 'id'
              style={{
                borderBottom: `1px solid ${theme ? "#727070" : "#c7c7c7"}`,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                placeItems: "center",
              }}
            >
              <TableCell
                component="div"
                className="info1"
                style={{ borderBottom: "unset" }}
              >
                {type
                  ? item?.department?.deptDisplayName
                  : item?.role?.displayRoleName}
              </TableCell>
              <TableCell
                component="div"
                className="info2"
                style={{ borderBottom: "unset" }}
              >
                {item.fileStatus === "sent" ? (
                  <Tooltip title="SENT">
                    <IconButton id="outboxBtn_done" className="outboxBtn">
                      <Done />
                    </IconButton>
                  </Tooltip>
                ) : item.fileStatus === "delivered" ? (
                  <Tooltip title="DELIVERED">
                    <IconButton id="outboxBtn_doneAll" className="outboxBtn">
                      <DoneAll />
                    </IconButton>
                  </Tooltip>
                ) : item.fileStatus === "seen" ? (
                  <Tooltip title="SEEN">
                    <IconButton
                      id="outboxBtn_PlaylistAddCheck"
                      className="outboxBtn"
                    >
                      <DoneAll
                        style={{
                          color: props.theme ? "#5cabff" : "rgb(5 100 200)",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title="FORWARDED">
                    <IconButton
                      id="outbox_addCheck_btn"
                      className="outboxBtn tripple-tick"
                    >
                      <Done
                        id="tick-1"
                        style={{
                          color: props.theme ? "#5cabff" : "rgb(5 100 200)",
                          padding: "0px",
                        }}
                      />
                      <Done
                        id="tick-2"
                        style={{
                          color: props.theme ? "#5cabff" : "rgb(5 100 200)",
                          padding: "0px",
                        }}
                      />
                      <Done
                        id="tick-3"
                        style={{
                          color: props.theme ? "#5cabff" : "rgb(5 100 200)",
                          padding: "0px",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* PaginationComp component */}
      <PaginationComp
        pageSize={pageSize}
        pageSizes={[5, 10, 15]}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalCount={totalCount}
        setPageSize={setPageSize}
      />
    </TableContainer>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
  };
}

export default connect(mapStateToProps)(Status);
