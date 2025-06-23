import React, { useContext, useEffect, useState } from "react";
import {
  Paper,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableHead,
  Divider,
  Grid,
  Button,
} from "@material-ui/core";
import DoneIcon from "@material-ui/icons/Done";
import { useTranslation } from "react-i18next";
import UserValuedpt from "./UserValuedpt";
import "./split.css";
import { Resiverolesdata } from "./SplitDepartmentDisplay";
import { connect, useDispatch } from "react-redux";
import { sendsplfinaldata } from "app/camunda_redux/redux/action";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllDepartmentdata } from "app/redux/actions/AdminDepartment/CreateDepartment";
import {
  MRT_ShowHideColumnsButton,
  MaterialReactTable,
} from "material-react-table";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ShowFilesOnRole } from "app/redux/actions/AdminDepartment/CreateRoles";
import { useMemo } from "react";
import PaginationComp from "app/views/utilities/PaginationComp";
import { IconButton } from "@mui/material";
import CancelIcon from "@material-ui/icons/Cancel";

const SplidDptTable = (props) => {
  const [pageSize, setPageSize] = useState(5);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const { rolesdata, depData, depDatazero, handleSplitDeptClose } =
    useContext(Resiverolesdata);
  const { deptName, deptDisplayName } = depData;
  const tmpArr = [];
  useEffect(() => {}, [tmpArr]);
  const { t } = useTranslation();
  const [newRoleNames, setNewRoleNames] = useState([]);
  const dispatch = useDispatch();
  const rolesOldAndNew = [];

  for (let i = 0; i < rolesdata.length; i++) {
    const newObj = {
      oldRole: rolesdata[i],
      newRole: newRoleNames[i],
    };
    rolesOldAndNew.push(newObj);
  }

  let newObj = {};

  let dept = [depData];
  const transformData = dept.map((item) => {
    item.subSection.map((itm) => {
      newObj[itm.key] = itm.value;
    });
    return {
      ...item,
      subSec: newObj,
    };
  });

  const object = Object.assign({}, ...transformData);

  const result = [
    {
      department: object,
      rolesOldAndNew: rolesOldAndNew.map((item) => ({
        oldRole: item.oldRole,
        newRole: item.newRole,
      })),
    },
  ];

  function handleSubmit(event) {
    event.preventDefault();
    props.sendsplfinaldata(result, depDatazero.deptName).then((resp) => {
      if (resp.message === "OK") {
        toast.success("Department Split successfully");
        props.handleBack();
      } else {
        dispatch(setSnackbar(true, "error", resp.error));
      }
    });
    dispatch(getAllDepartmentdata());
    handleSplitDeptClose();
  }

  //show all files of roles function
  const [showRoles, setshowRoles] = useState(false);

  const handleClickshowRolesOpen = (roles) => {
    setshowRoles(true);

    dispatch(ShowFilesOnRole(depDatazero.deptName, roles));
  };

  const handleClickshowRolesClose = () => {
    setshowRoles(false);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "pklDirectorate",
        header: "FILES",
        size: 100,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
    ],
    []
  );

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Divider />
        <Grid container className="dpt_name_t">
          <h6>DEPARTMENT NAME :{deptName} </h6>
        </Grid>
        <div style={{ padding: "1rem" }}>
          <TableContainer>
            <Table component="div" aria-label="simple table">
              <TableHead component="div">
                <TableRow component="div">
                  <div
                    className="audit-search-body_split"
                    style={{
                      borderBottom: `1px solid ${
                        props.theme ? "#727070" : "#c7c7c7"
                      }`,
                      backgroundColor: props.theme ? "#585858" : "#e5e5e5",
                      padding: "1rem",
                    }}
                  >
                    <div className="info2">
                      <span>{t("OLD ROLE")}</span>
                    </div>
                    <div className="info3">
                      <span>{t("ASSIGN NEW ROLE")}</span>
                    </div>
                  </div>
                </TableRow>
              </TableHead>
              <TableBody
                className="search-table-body-p"
                component="div"
                style={{
                  height: "calc(100vh - 353px)",
                  overflowY: "auto",
                  overflowX: "hidden",
                }}
              >
                {rolesdata &&
                  rolesdata.map((list, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow hover component="div">
                          <div
                            className="audit-search-body_split"
                            style={{
                              borderBottom: `1px solid ${
                                props.theme ? "#727070" : "#c7c7c7"
                              }`,
                              padding: "10px ",
                            }}
                          >
                            <div className="info2">
                              <span
                                onClick={() => handleClickshowRolesOpen(list)}
                              >
                                {list}
                              </span>
                            </div>
                            <div className="info3">
                              <UserValuedpt
                                index={index}
                                newRoleNames={newRoleNames}
                                setNewRoleNames={setNewRoleNames}
                                tmpArr={tmpArr}
                                clearValue={() =>
                                  setNewRoleNames((prevState) => ({
                                    ...prevState,
                                    [index]: "",
                                  }))
                                }
                              />
                            </div>
                          </div>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <Divider />
        <Grid container className="button_gris_table_split">
          <Grid item xs={12}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              color="primary"
              style={{ float: "right" }}
              endIcon={<DoneIcon />}
            >
              SUMBIT
            </Button>
          </Grid>
        </Grid>
      </form>

      <div>
        <Dialog
          open={showRoles}
          onClose={handleClickshowRolesClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle>
            <IconButton
              id="add_department"
              aria-label="close"
              color="primary"
              style={{
                float: "right",
                padding: "5px !important",
                position: "relative",
                top: "-.8rem",
                fontSize: "20px",
              }}
              size="large"
              onClick={handleClickshowRolesClose}
            >
              <CancelIcon style={{ fontSize: "2rem", color: "#484747" }} />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <div className="disabled-columicon">
              <MaterialReactTable
                data={[]}
                manualPagination
                columns={columns}
                initialState={{
                  density: "compact",
                }}
                displayColumnDefOptions={{
                  "mrt-row-selects": {
                    size: 5,
                    muiTableHeadCellProps: {
                      sx: {
                        paddingLeft: "2s5px",
                      },
                    },
                    muiTableBodyCellProps: {
                      sx: {
                        paddingLeft: "25spx",
                      },
                    },
                  },
                }}
                enableColumnFilterModes={false}
                enableBottomToolbar={false}
                enableColumnResizing={false}
                enableStickyHeader
                // enableRowSelection
                // enableRowNumbers
                // selectedRows={selectedRows}
                // onSelectionChange={handleSelectionChange}
                enableFilters={false}
                enableFullScreenToggle={false}
                enableDensityToggle={false}
                // renderTopToolbar={({ table }) => (
                //   <CustomToolbarMarkup table={table} />
                // )}
                muiTableContainerProps={() => ({
                  sx: {
                    border: "1px solid #8080802b",
                    height: "50vh",
                  },
                })}
                muiTablePaperProps={() => ({
                  sx: {
                    padding: "0rem 1rem",
                    border: "0",
                    boxShadow: "none",
                  },
                })}
              />
            </div>
            <PaginationComp
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              pageSizes={pageSizes}
              setCurrentPage={setCurrentPage}
              setPageSize={setPageSize}
            />
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {
  sendsplfinaldata,
})(SplidDptTable);
