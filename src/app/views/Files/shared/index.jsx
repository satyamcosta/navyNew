import {
  Fab,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { Breadcrumb } from "matx";
import React, { useMemo } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FileForm from "./FileForm";
import "../therme-source/material-ui/loading.css";
import PaginationComp from "app/views/utilities/PaginationComp";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import GenericSearch from "../../utilities/GenericSearch";
import GenericFilterMenu from "../../utilities/GenericFilterMenu";
import GenericChips from "../../utilities/GenericChips";

const useStlyes = makeStyles({
  root: {
    padding: ".5rem 1rem",
  },
  paper_comp: {
    borderRadius: "9px",
  },
  file_header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: ".5rem 1rem",
  },
});

const index = () => {
  const { t } = useTranslation();
  const classes = useStlyes();

  const [openForm, setOpenForm] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  // to handle update single pa either signed or unsigned without calling ap
  const [updatedPa, setupdatedPa] = useState("");
  const FilterOption = [
    {
      value: "Select Field",
      label: "Select Field",
    },
    {
      value: "subject",
      label: "Subject",
    },
    {
      value: "pfileName",
      label: "File Name",
    },
    {
      value: "status",
      label: "Status",
    },
    {
      value: "createdOn",
      label: "Created On",
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
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "createdOn",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Value",
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
      name: "pfileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "File Name",
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

  // state variable which get track of all filter option with value
  const [Filter, setFilter] = useState({});

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

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    setFilter(newFilter);
  };

  function handleForm() {
    setOpenForm(!openForm);
  }

  const columns = useMemo(
    () => [
      {
        accessorKey: "pfileName",
        header: t("file_name"),
        size: 100,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "type",
        header: t("type"),
        size: 230,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
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
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "actions",
        header: t("actions_btn"),
        size: 60,
        Cell: ({ cell }) => {
          let row = cell?.row?.original;
          return (
            <>
              <div className="paIcons"></div>
            </>
          );
        },
      },
    ],
    [rowData, Cookies.get("i18next")]
  );

  const CustomToolbarMarkup = ({ table }) => {
    return (
      <div className="PaHeader">
        <div className="PaHeadTop">
          <GenericSearch
            FilterTypes={FilterTypes}
            FilterValueTypes={FilterValueTypes}
            addFilter={addFilter}
            cssCls={{}}
          />

          <div>
            <GenericFilterMenu
              sort={SortBy}
              SortValueTypes={SortValueTypes}
              addSort={addSort}
            />
            <div className="PaIconCon">
              <Tooltip
                title={
                  correspondence
                    ? t("create_correspondence")
                    : t("create_a_personal_application")
                }
              >
                <span>
                  <Fab
                    disabled={!props.myInfo}
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                    onClick={() => props.handleClick()}
                  >
                    <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
                </span>
              </Tooltip>
            </div>
            <MRT_ShowHideColumnsButton table={table} />
          </div>
        </div>

        <GenericChips Filter={Filter} deleteChip={deleteChip} />
      </div>
    );
  };

  return (
    <>
      <Grid className={classes.root}>
        <Breadcrumb routeSegments={[{ name: t("file"), path: "/File/file" }]} />
        <Grid container={true} spacing={2}>
          <Grid item xs={12}>
            <Paper
              elevation={3}
              style={{
                position: "relative",
                borderRadius: "9px",
              }}
            >
              <div className="FileHeader">
                <Typography variant="h5" component="h5">
                  {t("draft_file")}
                </Typography>
                <Fab
                  id="create_file_btn"
                  style={{
                    height: ".1rem",
                    width: "2.2rem",
                    cursor: "pointer",
                    marginTop: "6px",
                    marginLeft: "2px",
                    backgroundColor: "#5f78c4",
                  }}
                  onClick={handleForm}
                >
                  <Tooltip title={t("create_file")}>
                    <Add style={{ fontSize: "20", color: "#fff" }} />
                  </Tooltip>
                </Fab>
              </div>

              <div style={{ padding: "0 1rem" }} id="material-table">
                <MaterialReactTable
                  data={rowData}
                  manualPagination
                  columns={columns}
                  initialState={{
                    density: "compact",
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
                  enableBottomToolbar={false}
                  enableColumnResizing
                  enableStickyHeader
                  enableFilters={false}
                  enableFullScreenToggle={false}
                  enableDensityToggle={false}
                  renderTopToolbar={({ table }) => (
                    <CustomToolbarMarkup table={table} />
                  )}
                  muiTableBodyRowProps={({ row }) => ({
                    onClick: () => {
                      // handleClick(row?.original);
                    },
                    onDoubleClick: () => {
                      console.log("double click");
                    },
                    sx: {
                      cursor: "pointer",
                      background: "inherit",
                    },
                  })}
                  muiTableContainerProps={() => ({
                    sx: {
                      border: "1px solid #8080802b",
                      height: "63vh",
                    },
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

                <TableContainer
                  component={Paper}
                  className="FileTableCon"
                  style={{
                    border: `1px solid #8080805c`,
                  }}
                >
                  <Table
                    component="div"
                    className={`${classes.table} App-main-table`}
                    aria-label="simple table"
                  >
                    <TableHead
                      component="div"
                      style={{
                        backgroundColor: "#8080805c",
                      }}
                    >
                      <TableRow component="div">
                        <div className="FileRow">
                          <div></div>
                          <div>
                            <span>{t("file_name")}</span>
                          </div>
                          <div>
                            <span>{t("type")}</span>
                          </div>
                          <div>
                            <span>{t("created_on")}</span>
                          </div>
                          <div>
                            <span>{t("subject")}</span>
                          </div>
                        </div>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      component="div"
                      style={{
                        height: `calc(100vh - 260px )`,
                        overflowY: "auto",
                      }}
                    >
                      {/* Mapping data coming from backnd */}
                      {[].map((item, i) => {
                        const sts = item.status;

                        return (
                          <TableRow
                            hover
                            component="div"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(item);
                            }}
                            key={i}
                            style={{
                              // backgroundColor: bgc,
                              borderBottom: "1px solid #8080805c",
                              position: "relative",
                            }}
                          >
                            <div className="FileRow body">
                              <div>
                                <span>{item.serialNo}</span>
                              </div>
                              <div>
                                <span>{item.pfileName}</span>
                              </div>
                              <div>
                                <span>{item.type}</span>
                              </div>
                              <div>
                                <span>{item.createdOn}</span>
                              </div>
                              <div className="text-overflow">
                                <Tooltip
                                  title={item.subject}
                                  aria-label="text-adjust"
                                >
                                  <span>{item.subject}</span>
                                </Tooltip>
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
                pageSizes={[5, 10, 15]}
                setCurrentPage={setCurrentPage}
                currentPage={currentPage}
                totalCount={totalCount}
                setPageSize={setPageSize}
              />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
      <FileForm handleForm={handleForm} openForm={openForm} />
    </>
  );
};

export default index;
