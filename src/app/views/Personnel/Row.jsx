import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Box,
  Checkbox,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { loadAnnexureTableData } from "../../camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { Loading } from "./therme-source/material-ui/loading";
import Cookies from "js-cookie";

const useStyles = makeStyles((theme) => ({
  tblCell: {
    "& .MuiTableCell-root": {
      padding: "6px 0",
      border: "none",
    },
  },
  subject_overflow: {
    display: "block",
    textOverflow: "ellipsis",
    overflow: "hidden",
    whiteSpace: "nowrap",
    width: "100%",
    maxWidth: "210px",
  },
}));

const Row = (props) => {
  const classes = useStyles();
  const isCorr = Cookies.get("isCorr") == "true";
  const upload = Cookies.get("import") == "true";

  const { row } = props;
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState("");
  const [originNof, setOriginNof] = useState("");

  let username = localStorage.getItem("username");
  let role = sessionStorage.getItem("role");
  let department = sessionStorage.getItem("department");
  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    if (row) {
      let arr = row?.nofFileName?.split("#");
      setOriginNof(arr?.length ? arr[arr?.length - 1] : "");
    }
  }, [row]);

  const handleDropDown = (e, rowData) => {
    e.stopPropagation();
    setLoading(true);
    if (open === false) {
      props
        .loadAnnexureTableData(username, role, department, rowData.id)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              return;
            } else {
              let tmpArr = [];
              tmpArr = resp.data.map((item, i) => {
                return { ...item, serialNo: i };
              });
              setData(tmpArr);
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        });
    }
    setLoading(false);
    setOpen(!open);
  };

  const handleFileSelect = (item) => {
    let arr = [];
    if (item.fileName) {
      arr = item.fileName.split(".");
    } else {
      arr[1] = "docx";
    }
    props.handleAnnexture(item.fileURL || item.fileUrl, arr[1]);
    setSelectedRowId(item.id);
  };

  const handleCheck = () => {
    if (props?.checked) {
      props?.setimportList((list) => {
        return list?.filter((item) => item !== row?.id);
      });
    } else {
      props?.setimportList((list) => list.concat(row?.id));
    }
  };

  const handleChange = () => {
    props.handleUpadtePdf(row.fileURL);
    props.setSelectedRowId(row.id);
    props.setselectedRow(row);
  };

  return (
    <React.Fragment>
      <TableRow
        onClick={handleChange}
        className={props.selectedRowId == row.id ? "active" : ""}
        id="paTableRow"
        // sx={{ backgroundColor: props.index % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit" }}
        style={{ backgroundColor: props.index % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit", cursor: "pointer"}}
      >
        {!isCorr ? (
          <TableCell className={classes.tblCell}>
            <IconButton
              id="PA_up_down"
              aria-label="expand row"
              size="small"
              onClick={(e) => handleDropDown(e, row)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
        ) : upload ? (
          <TableCell
            onClick={(e) => e.stopPropagation()}
            align="left"
            width="20%"
            className={classes.tblCell}
          >
            <Checkbox
              inputProps={{ "aria-label": "primary checkbox" }}
              checked={props.checked}
              onChange={handleCheck}
            />
          </TableCell>
        ) : (
          ""
        )}
        {/*
          <TableCell
          component="th"
          align="center"
          scope="row"
          width="20%"
          className={classes.tblCell}
        >
          {row.serialNo}
        </TableCell>
          
          */}
        <Tooltip title={row.subject}>
          <TableCell
            align="center"
            width="30%"
            className={`${classes.tblCell}`}
          >
            {row.subject}
          </TableCell>
        </Tooltip>

        {isCorr && (
          <>
            <TableCell align="center" width="30%" className={classes.tblCell}>
              {row.classification}
            </TableCell>

            <TableCell align="center" width="20%" className={classes.tblCell}>
              {originNof}
            </TableCell>

            <TableCell align="center" width="20%" className={classes.tblCell}>
              {row.savedDate}
            </TableCell>
          </>
        )}
      </TableRow>
      {
        !isCorr && (
          <TableRow>
            {loading && <Loading />}
            <TableCell
              style={{ paddingBottom: 0, paddingTop: 0 }}
              colSpan={4}
              className={classes.tblCell}
            >
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box padding={2}>
                  {data.length > 0 ? (
                    <React.Fragment>
                      <Typography variant="h6" gutterBottom component="div">
                        Annexure
                      </Typography>
                      <div id="annexureTable">
                        <Table aria-label="purchases">
                          <TableHead>
                            <TableRow id="annexureTableHeader">
                              <TableCell>SNO.</TableCell>
                              <TableCell>SUBJECT</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {data.map((item) => (
                              <TableRow
                                key={item.id}
                                onClick={() => handleFileSelect(item)}
                                id="annexureTableRow"
                                className={
                                  selectedRowId == item.id ? "active" : ""
                                }
                              >
                                <TableCell component="th" scope="row">
                                  {item.serialNo + 1}
                                </TableCell>
                                <Tooltip title={item.subject}>
                                  <TableCell className={classes.subject_overflow}>
                                    {item.subject}
                                  </TableCell>
                                </Tooltip>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </React.Fragment>
                  ) : (
                    <Typography variant="h6" gutterBottom component="div">
                      No Annexure
                    </Typography>
                  )}
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        )
      }
    </React.Fragment >
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, { loadAnnexureTableData })(Row);
