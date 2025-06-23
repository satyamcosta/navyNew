import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Tooltip,
  Checkbox,
  Grid,
  Typography,
} from "@material-ui/core";
import Row from "./Row";
import "./TreeTable.css";
import Cookies from "js-cookie";
import GenericSearch from "../utilities/GenericSearch";
import { unstable_batchedUpdates } from "react-dom";
import { useTranslation } from "react-i18next";
import GenericChip from "../utilities/GenericChips";

const TreeTable = (props) => {
  const { t } = useTranslation();

  const isCorr = Cookies.get("isCorr") == "true";
  const upload = Cookies.get("import") == "true";

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...props.Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        props.setFilter(newFilter);
        // setCurrentPage(0);
        // setPageSize(10);
      });
    }
  };

  const deleteChip = (property) => {
    let newFilter = { ...props.Filter };
    delete newFilter[`${property}`];
    props.setFilter(newFilter);
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
    {
      value: "status",
      label: "Classification",
    },
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
    {
      name: "status",
      type: "select",
      optionValue: StatusOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "range",
      type: "range",
      size: "small",
      variant: "outlined",
      color: "primary",
    },
  ];

  return (
    <>
      {isCorr && (
        <>
          <Grid
            container
            alignItems="center"
            // justifyContent="space-evenly"
            style={{ margin: "10px" }}
          >
            <Grid item xs={12}>
              <GenericSearch
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
              />
            </Grid>
          </Grid>
          <div style={{ marginTop: "10px", marginLeft: "5px" }}>
            <GenericChip Filter={props.Filter} deleteChip={deleteChip} />
          </div>
        </>
      )}
      <TableContainer
        component={Paper}
        style={{
          height: "Calc(94vh - 133px)",
          maxHeight: "Calc(100vh - 133px)",
          overflowY: "scroll",
        }}
      >
        <Table
          stickyHeader={true}
          component="div"
          aria-label="collapsible table"
        >
          <TableHead component="div">
            <TableRow id="tableHeader">
              {!isCorr ? (
                <TableCell width="15%" />
              ) : upload ? (
                <TableCell align="left" width="20%">
                  <Tooltip title="Select All">
                    <Checkbox
                      inputProps={{ "aria-label": "primary checkbox" }}
                    />
                  </Tooltip>
                </TableCell>
              ) : (
                ""
              )}
              {/*
              <TableCell align="center" width="20%">
                SNO.
              </TableCell>
              */}
              <TableCell align="center" width={isCorr ? "30%" : "60%"}>
                {t("subject")}
              </TableCell>
              {isCorr && (
                <>
                  <TableCell align="center" width="30%" color="black">
                  {t("classification")}
                  </TableCell>
                  <TableCell align="center" width="20%" color="black">
                    {t("dak#")}
                  </TableCell>
                  <TableCell align="center" width="20%" color="black">
                    {t("updated")}
                  </TableCell>
                </>
              )}
            </TableRow>
          </TableHead>
          <TableBody style={{ overflow: "auto" }}>
            {props?.data?.length > 0 ? (
              props?.data.map((row,index) => (
                <Row
                  key={row.id}
                  row={row}
                  isCorr={isCorr}
                  handleUpadtePdf={props.handleUpadtePdf}
                  handleAnnexture={props.handleAnnexture}
                  setSelectedRowId={props.setSelectedRowId}
                  selectedRowId={props.selectedRowId}
                  setselectedRow={props.setselectedRow}
                  checked={props.importList?.includes(row?.id)}
                  setimportList={props.setimportList}
                  index={index}
                />
              ))
            ) : (
              <div className="flex flex-center">
                <Typography
                  variant="subtitle2"
                  style={{ fontStyle: "italic", color: "gray" }}
                >
                  No records to display
                </Typography>
              </div>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TreeTable;
