import React, { useState, useEffect, useMemo, useContext } from "react";
import "../../index.css";
import { previousInstructions } from "app/camunda_redux/redux/action";
import { useTranslation } from "react-i18next";
import "react-tabs/style/react-tabs.css";
import PaginationComp from "app/views/utilities/PaginationComp";
import { Paper, Typography, Grid } from "@material-ui/core";
import { connect, useDispatch, useSelector } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import Cookies from "js-cookie";
import MaterialReactTable, {
  MRT_ShowHideColumnsButton,
} from "material-react-table";
import GenericSearch from "app/views/utilities/GenericSearch";
import GenericChip from "app/views/utilities/GenericChips";
import { unstable_batchedUpdates } from "react-dom";
import { AssignerContext } from "../ViewDetailStatus";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";

const CustomWidthTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 500,
    maxHeight: 300,
    overflowY: "scroll",
    fontSize: "13px",
  },
});

const AssignerInstruction = (props) => {
  const [pageSize, setPageSize] = useState(25);
  const [pageSizes] = useState([10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [Filter, setFilter] = useState({});
  const { theme } = useSelector((state) => state);
  const [rowData, setRowData] = useState([]);
  const { t } = useTranslation();
  const roleName = sessionStorage.getItem("role");

  // generic search
  const FilterOption = [
    {
      value: "Select Field",
      label: "",
    },
    {
      value: "department",
      label: "department",
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

  const FilterValueTypes = [
    {
      name: "department",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
  ];

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

  const CustomToolbarMarkup = ({ table }) => {
    return (
      <>
        <Grid container className="AcHeader">
          <Grid item xs={12} className="PaHeadTop">
            <div
              style={{
                width: "90%",
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <Typography variant="h6"> {t("assigner_instruction")}</Typography>
            </div>

            <MRT_ShowHideColumnsButton table={table} />
          </Grid>
        </Grid>
      </>
    );
  };

  // new table code start

  const columns = useMemo(
    () => [
      {
        accessorKey: "instructedOn",
        header: t("date"),

        size: 90,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },

      {
        accessorKey: "description",
        header: t("instruction"),

        size: 170,
        Cell: ({ cell }) => {
          const description = cell.getValue();
          const words = description.split(" ");
          const truncateDescription = words.slice(0, 18).join(" ");

          return (
            <CustomWidthTooltip title={description}>
              <span className="text-m">
                {truncateDescription}
                {description.length > 200 ? "..." : ""}
              </span>
            </CustomWidthTooltip>
          );
        },
      },
      {
        accessorKey: "priority",
        header: t("priority"),
        size: 70,
        Cell: ({ cell }) => (
          <div className="paInfo5">
            <span
              style={{
                backgroundColor:
                  cell.getValue() === "high"
                    ? "#ff5f38d1"
                    : cell.getValue() === "medium"
                      ? "#ffaf38"
                      : cell.getValue() === "low"
                        ? "#37d392"
                        : cell.getValue() === "Approved"
                          ? "#37d392"
                          : cell.getValue() === "Return"
                            ? "#b73b32"
                            : "",
              }}
              className="status"
            >
              {cell.getValue()?.toUpperCase()}
            </span>
          </div>
        ),
      },
    ],
    [Cookies.get("i18next")]
  );
  const dispatch = useDispatch();
  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  const previousInstructionsFun = () => {
    props
      .previousInstructions(props.rowData.id, false, roleName)
      .then((resp) => {
        let tmpArr = [];

        try {
          if (resp) {
            // condition to check if response then perform further
            if (resp !== undefined) {
              setTotalCount(
                resp.response.length != null ? resp.response.length : 0
              );

              tmpArr = resp.response.content.map((item, index) => {
                return {
                  ...item,
                  serialNo: pageSize * currentPage + (index + 1),
                };
              });

              setRowData(tmpArr);
            } else {
              const errorMessage =
                resp.status + " : " + resp.error + " AT " + resp.path;
              callMessageOut(errorMessage);
            }
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((error) => { });
  };

  useEffect(() => {
    previousInstructionsFun();
  }, [pageSize, currentPage]);

  function adjustDivHeight() {
    var zoomLevel = document.documentElement.clientWidth / window.innerWidth;
    var viewportHeight = window.innerHeight / zoomLevel;
    var adjustableDiv = document.getElementById("mrt-assignertable");
    adjustableDiv.style.height = viewportHeight - 172 + "px";
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  return (
    <div className="open-task">
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
        }}
        id="material-table"
      >
        <MaterialReactTable
          data={rowData}
          manualPagination
          columns={columns}
          initialState={{
            density: "compact",
          }}
          displayColumnDefOptions={{
            "mrt-row-select": {
              size: 0,
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
          muiTableBodyRowProps={({ row, staticRowIndex }) => ({
            sx: {
              cursor: "pointer",
              // background: "inherit",
              height: "10px",
              backgroundColor: staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit"
            },
          })}
          muiTableContainerProps={() => ({
            sx: {
              border: "1px solid #8080802b",
              height: "61vh",
            },
            id: "mrt-assignertable",
          })}
          muiTablePaperProps={() => ({
            sx: {
              padding: "0rem 1rem",
              border: "0",
              background: theme ? "#424242" : "white",
            },
          })}
          muiTableHeadRowProps={{
            sx: {
              background: theme ? "#938f8f" : "white",
            },
          }}
        />
        <PaginationComp
          currentPage={currentPage}
          totalCount={totalCount}
          pageSize={pageSize}
          pageSizes={pageSizes}
          setCurrentPage={setCurrentPage}
          setPageSize={setPageSize}
        />
      </Paper>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    theme: state.theme,
  };
}

export default connect(mapStateToProps, { previousInstructions })(
  AssignerInstruction
);
