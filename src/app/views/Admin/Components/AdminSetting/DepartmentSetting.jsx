import React, { useMemo, useEffect, useState } from "react";
import GenericSearch from "app/views/utilities/GenericSearch";

import DeleteIcon from "@mui/icons-material/Delete";
import { RiSplitCellsHorizontal } from "react-icons/ri";
import {
  MRT_ShowHideColumnsButton,
  MaterialReactTable,
} from "material-react-table";
import { Paper, Grid, Tooltip, IconButton, Fab } from "@material-ui/core";
import { useTranslation } from "react-i18next";

import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { useDispatch, useSelector } from "react-redux";
import VisibilityIcon from "@material-ui/icons/Visibility";
import PaginationComp from "app/views/utilities/PaginationComp";

import "./Style.css";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import { useFormik } from "formik";
import * as yup from "yup";
import CancelIcon from "@material-ui/icons/Cancel";
import {
  createDepartment,
  editDepartmentById,
  getAllDepartmentdata,
  getDepartmentById,
} from "app/redux/actions/AdminDepartment/CreateDepartment";
import {
  getRoleByDepartmentName,
  getRoleByName,
} from "app/redux/actions/AdminDepartment/CreateRoles";
import Draggable from "react-draggable";
import DepartmentsRole from "./DepartmentsRole";

import EditIcon from "@mui/icons-material/Edit";

import { AiOutlineMergeCells } from "react-icons/ai";

import MergeDepartment from "../MergeDepartment/MeargDepartment";
import SplitDepartmentDisplay from "../SplitDepartment/SplitDepartmentDisplay";
import { getroledatavalues } from "app/redux/actions/SplitDepartment/SplitDepartment";
// import { CancelOutlined } from "@material-ui/icons";
function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const DepartmentSetting = (props) => {
  const { t } = useTranslation();
  const [pageSize, setPageSize] = useState(5);
  const [pageSizes] = useState([5, 10, 15]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowData, setRowData] = useState([]);
  const [rows, setRows] = useState([]);
  const [rolesDialog, setRolesDialog] = useState(false);
  const [departMentAddDialoge, setDepartmentDialog] = useState(false);
  const [departMentEdit, setDepartMentEdit] = useState(false);
  const [selectRowDept, setSelectRowDept] = useState("");
  const [selectRowpklDirectorate, setSelectRowpklDirectorate] = useState("");
  const [departmentMerge, setDepartmentMerge] = useState(false);
  const [departmentSplit, setDepartmentSplit] = useState(false);
  const [selectMergeDept, setSelectMergeDept] = useState([]);
  const [role, setRole] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);

  const dispatch = useDispatch();

  const handleSelectionChange = (newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  };

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

  const [Filter, setFilter] = useState({});

  const { theme } = useSelector((state) => state);

  // generic search

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
    dispatch(getRoleByName(value, type));
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

  // implement pagination
  useEffect(() => {
    let start = currentPage * pageSize;
    let end = (currentPage + 1) * pageSize;

    let tempArr = rowData.data?.slice(start, end);
    setRows(tempArr);
  }, [rowData, pageSize, currentPage]);

  // open and close dialoge function
  const handleClickDepartmentOpen = (value, booleanValue) => {
    setDepartmentDialog(true);
    setDepartMentEdit(booleanValue);
    if (value) {
      dispatch(getDepartmentById(value.id));
      dispatch(getRoleByDepartmentName(value.deptName));
    }
  };
  const allDepartmentsRoleData = useSelector(
    (state) => state.getDepartmentRole.departmentRoleData
  );

  const handleClickDepartmentClose = () => {
    setDepartmentDialog(false);
  };

  // create department function

  const createDepartments = (values) => {
    let departmentData = [];
    departmentData.push(values);
    dispatch(createDepartment(departmentData));
    handleClickDepartmentClose();
    formik.handleReset();
  };

  // edit department function
  const editDepartments = (values) => {
    dispatch(editDepartmentById(values));
    formik.handleReset();
    handleClickDepartmentClose();
  };

  // get department data
  useEffect(() => {
    dispatch(getAllDepartmentdata(""));
  }, []);

  const allDepartmentsData = useSelector(
    (state) => state.createDepartmentReducer.departmentData
  );

  const editDepartment = useSelector(
    (state) => state.getDepartmentById.departmentBYid
  );

  // formik validation and handleSubmit function

  const getEditaDataValue = () => {
    let data = [];
    if (editDepartment.subSec) {
      var keys = editDepartment.subSec;
      data.push(keys);
    }

    const result = [];
    data.forEach((obj) => {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          const newObj = {};
          newObj[key] = obj[key];
          result.push(newObj);
        }
      }
    });
    formik.setValues({
      pklDirectorate: editDepartment.pklDirectorate,
      deptName: editDepartment.deptName,
      dependsOn: editDepartment.dependsOn,
      active: editDepartment.active,

      fromBlock: editDepartment.fromBlock,
      toBlock: editDepartment.toBlock,
      cau: editDepartment.cau,
      deptAdminRole: editDepartment.deptAdminRole,
      deptCoordRole: editDepartment.deptCoordRole,
      deptDisplayName: editDepartment.deptDisplayName,
      branch: editDepartment.branch,
      section: editDepartment.section,
      sectionBlock: editDepartment.sectionBlock,
      reportsTo: editDepartment.reportsTo,
      independent: editDepartment.independent,
      id: editDepartment.id,
      subSec: result
        ? result.map((item) => {
            const key = Object.keys(item)[0];
            const value = item[key];
            return { subsection: value, sectionName: key };
          })
        : [{ subsection: "", sectionName: "" }],
    });
  };

  useEffect(() => {
    if (editDepartment) {
      getEditaDataValue();
    }
  }, [editDepartment]);

  const validationSchema = yup.object().shape({
    // fromBlock: yup
    //   .string()
    //   .required("Block number is required")

    //   .test("error", (value) => {
    //     console.log(formik?.values.toBlock)

    //     const values = value
    //     return values < formik?.values.toBlock;
    //   }),

    fromBlock: yup
      .number()
      .typeError("Block number must be a number") // Show a type error if it's not a number
      .required("Block number is required")
      .when("toBlock", (toBlock, schema) =>
        schema.test({
          name: "lessThanToBlock",
          message: "From Block must be less than To Block",
          test: function (value) {
            const toBlockValue = this.resolve(toBlock);
            return !toBlockValue || (value && value < toBlockValue);
          },
        })
      ),
    toBlock: yup
      .number()
      .typeError("Block number must be a number")
      .required("Block number is required"),

    pklDirectorate: yup.string().required("Department  Name is required"),
  });

  const initialValues = {
    cau: "",
    deptAdminRole: [],
    deptCoordRole: "",
    deptDisplayName: "",
    branch: "",
    section: "",
    fromBlock: Number,
    toBlock: Number,
    pklDirectorate: "",
    reportsTo: "",
    blockNo: "",
    subSec: [{ subsection: "", sectionName: "" }],
  };

  const formik = useFormik({
    initialValues: initialValues,
    validate: (values) => {
      const errors = {};

      if (
        values.fromBlock !== "" &&
        values.toBlock !== "" &&
        Number(values.fromBlock) > Number(values.toBlock)
      ) {
        errors.fromBlock = "From Block must be less than or equal to To Block";
      }

      if (values.subSec) {
        values.subSec.forEach((subSection, index) => {
          const subSectionValue = subSection.subsection.trim();

          if (values.fromBlock !== "" && values.toBlock !== "") {
            // Both fromBlock and toBlock are provided, validate range
            const rangeRegex = new RegExp(`^(\\d+)-(\\d+)$`);
            const [, start, end] = subSectionValue.match(rangeRegex) || [];
            if (
              !start ||
              !end ||
              Number(start) < Number(values.fromBlock) ||
              Number(end) > Number(values.toBlock)
            ) {
              errors.subSec = errors.subSec || [];
              errors.subSec[
                index
              ] = `Sub-section value must be a valid range between ${values.fromBlock} and ${values.toBlock}`;
            }
          } else if (values.fromBlock !== "") {
            // Only fromBlock is provided, validate single value
            if (subSectionValue !== values.fromBlock) {
              errors.subSec = errors.subSec || [];
              errors.subSec[
                index
              ] = `Sub-section value must be equal to From Block (${values.fromBlock})`;
            }
          }

          // Additional check for consecutive values
          if (index > 0) {
            const prevSubsection = values.subSec[index - 1].subsection.trim();
            const currentStart = Number(subSectionValue.split("-")[0]);
            const prevEnd = Number(prevSubsection.split("-")[1]);

            if (currentStart <= prevEnd) {
              errors.subSec = errors.subSec || [];
              errors.subSec[index] =
                "Sub-section value must be greater than the previous last value";
            }
          }
        });
      }

      return errors;
    },
    onSubmit: (values) => {
      const blockNoValues = values.toBlock - values.fromBlock;
      const subSectionErrors = {};
      let lastSubsectionRange = [-Infinity, values.fromBlock];

      values.subSec.forEach((subSection, index) => {
        const subSectionValues = subSection.subsection.split("-").map(Number);
        if (subSectionValues.length === 2) {
          if (
            subSectionValues[0] >= values.fromBlock ||
            subSectionValues[1] <= values.toBlock ||
            subSectionValues[0] > lastSubsectionRange[1]
          ) {
            lastSubsectionRange = subSectionValues;
          } else {
            subSectionErrors[index] = "Invalid subsection range";
          }
        } else {
          subSectionErrors[index] = "Invalid subsection format";
        }
      });

      if (Object.keys(subSectionErrors).length > 0) {
        formik.setErrors({
          ...formik.errors,
          subSec: subSectionErrors,
        });
        return;
      }

      if (departMentEdit === true) {
        dispatch(editDepartments(values));
      } else {
        dispatch(createDepartments(values));
      }
      formik.handleReset();
    },
  });

  const addSubSection = () => {
    formik.setFieldValue("subSec", [
      ...formik.values.subSec,
      { subsection: "", sectionName: "" },
    ]);
  };

  if (formik.values.subSec.length === 0) {
    formik.values.subSec.push({ subsection: "", sectionName: "" });
  }

  const removeSubSection = (indexToRemove) => {
    formik.setFieldValue(
      "subSec",
      formik.values.subSec.filter((_, index) => index !== indexToRemove)
    );
  };

  const [data, setDta] = useState("");

  const handleChangeDeptSearchFun = (e, value) => {
    if (value) {
      dispatch(getAllDepartmentdata(data));
    } else {
      dispatch(getAllDepartmentdata(""));
    }
  };

  const getDepartmentByNameFun = (value) => {
    dispatch(getRoleByName(value, "department"));
    setDta(value);
  };

  const [tableData, setTableData] = useState([]);
  const CustomToolbarMarkup = ({ table }) => {
    const selectedRowData = table
      .getSelectedRowModel()
      .flatRows.map((row) => row.original);

    return (
      <>
        <Grid container className="AcHeader">
          <Grid item xs={12} className="PaHeadTop">
            <div
              style={{
                width: "85%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <GenericSearch
                FilterTypes={FilterTypes}
                FilterValueTypes={FilterValueTypes}
                addFilter={addFilter}
                cssCls={{}}
              />
              <div style={{ display: "flex" }}>
                {/* {selectedRowData.length > 1 && (
                  <div className="AcIconCon">
                    <Tooltip title=" MULTIPLE EDIT ">
                      <IconButton>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </div>
                )} */}
              </div>
            </div>
            {selectedRowData.length > 1 && selectedRowData.length <= 2 && (
              <Tooltip title="Merge Department">
                <IconButton
                  onClick={() => handleMergeDeptOpen(selectedRowData)}
                >
                  <AiOutlineMergeCells
                    size="small"
                    color="#757575"
                    style={{ fontSize: "19px", height: "1.2rem" }}
                  />
                </IconButton>
              </Tooltip>
            )}

            <div className="PaIconCon">
              <Tooltip title="CREATE DEPARTMENT">
                <span>
                  <Fab
                    onClick={() => handleClickDepartmentOpen("", false)}
                    style={{
                      width: "2.2rem",
                      height: ".1rem",
                      backgroundColor: "rgb(230, 81, 71)",
                    }}
                  >
                    <AddIcon style={{ fontSize: "19", color: "#fff" }} />
                  </Fab>
                </span>
              </Tooltip>
            </div>
            <MRT_ShowHideColumnsButton table={table} />
          </Grid>
          {/* <GenericChip Filter={Filter} deleteChip={deleteChip} /> */}
        </Grid>
      </>
    );
  };

  function validateSubsection(subsection, fromBlock, toBlock) {
    if (!subsection) {
      return true; // Empty field is valid
    }

    const parts = subsection.split("-");

    if (parts.length === 1) {
      // Single number
      const number = parseFloat(parts[0]);
      return !isNaN(number) && number >= fromBlock && number <= toBlock;
    } else if (parts.length === 2) {
      // Range
      const start = parseFloat(parts[0]);
      const end = parseFloat(parts[1]);
      return (
        !isNaN(start) &&
        !isNaN(end) &&
        start >= fromBlock &&
        end <= toBlock &&
        start <= end
      );
    } else {
      return false; // Invalid format
    }
  }

  // const CustomToolbarMarkup = () => (
  //   <>
  //     <Grid container spacing={2}>
  //       <Grid item xs={12}>
  //         <div
  //           style={{
  //             display: "flex",
  //             alignItems: "center",
  //             justifyContent: "space-between",
  //             padding: "0 1rem",
  //           }}
  //         >
  //           <Typography
  //             variant="button"
  //             align="center"
  //             color="primary"
  //             style={{
  //               fontSize: "1.2rem",
  //               fontFamily: "inherit !important",
  //               marginRight: "1rem",
  //             }}
  //           >
  //             <span className="heading-font"> {t("DEPARTMENTS")}</span>
  //           </Typography>
  //           <GenericSearch
  //             FilterTypes={FilterTypes}
  //             FilterValueTypes={FilterValueTypes}
  //             addFilter={addFilter}
  //             cssCls={{}}
  //           />

  //           <Tooltip title={t("Add Department")}>
  //             <Fab
  //               style={{
  //                 // position: "absolute",
  //                 marginLeft: "1rem",
  //                 // right: "1.5rem",
  //                 width: "2.2rem",
  //                 height: ".1rem",
  //                 backgroundColor: "rgb(230, 81, 71)",
  //               }}
  //               onClick={() => handleClickDepartmentOpen("", false)}
  //             >
  //               <AddIcon style={{ fontSize: "19", color: "#fff" }} />
  //             </Fab>
  //           </Tooltip>
  //         </div>
  //       </Grid>
  //     </Grid>
  //   </>
  // );

  // roles dialog function

  const handleClickRolesOpen = (item) => {
    setRolesDialog(true);
    setSelectRowDept(item);
    setSelectRowpklDirectorate(item.pklDirectorate);

    dispatch(getRoleByDepartmentName(item.deptName));
  };

  const handleClickRolesClose = () => {
    setRolesDialog(false);
  };

  const handleDeptCoordAdminRole = (e, value) => {
    formik.setFieldValue("deptCoordRole", value.roleName);
  };
  const handleDeptAdminRole = (e, value) => {
    formik.setFieldValue("deptAdminRole", value.roleName);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "pklDirectorate",
        header: "DEPARTMENT",
        size: 100,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "deptDisplayName",
        header: "DISPLAY USER NAME",
        size: 100,
        Cell: ({ cell }) => <span className="text-m">{cell.getValue()}</span>,
      },
      {
        accessorKey: "branch",
        header: "BRANCH",
        size: 100,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "cau",
        header: "CAU",
        size: 100,
        Cell: ({ cell }) => (
          <span className="text-m text-b">{cell.getValue()}</span>
        ),
      },
      {
        accessorKey: "actions", // New column for icons
        header: "Actions", // You can customize the header name
        size: 100, // Adjust the size as needed
        Cell: ({ row }) => {
          let item = row.original;
          return (
            <div style={{ display: "flex" }}>
              <Tooltip title="EDIT">
                <IconButton
                  onClick={() => handleClickDepartmentOpen(item, true)}
                >
                  <EditIcon
                    size="small"
                    color="#ccc"
                    style={{ fontSize: "19px", height: "1rem" }}
                  />
                </IconButton>
              </Tooltip>

              <Tooltip title="View Details">
                <IconButton onClick={() => handleClickRolesOpen(item)}>
                  <VisibilityIcon
                    size="small"
                    color="#ccc"
                    style={{ fontSize: "19px", height: "1rem" }}
                  />
                </IconButton>
              </Tooltip>
              <Tooltip title="Split Department">
                <IconButton onClick={() => handleSplitDeptOpen(item)}>
                  <RiSplitCellsHorizontal
                    size="small"
                    color="#757575"
                    style={{ fontSize: "19px", height: "1.2rem" }}
                  />
                </IconButton>
              </Tooltip>
            </div>
          );
        },
      },
    ],
    [allDepartmentsData]
  );

  // ===================================== department merge function start

  const handleMergeDeptOpen = (value) => {
    setDepartmentMerge(true);
    setSelectMergeDept(value);
  };

  const handleMergeDeptClose = () => {
    setDepartmentMerge(false);
  };
  // ===================================== department merge function end

  // ===================================== department split function start

  const handleSplitDeptOpen = (value) => {
    setDepartmentSplit(true);
    dispatch(getroledatavalues(value.deptName));
    // setSelectMergeDept(value);
  };

  const handleSplitDeptClose = () => {
    setDepartmentSplit(false);
  };
  // ===================================== department split function end

  return (
    <div className="cabinate_container getdecision">
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "8px",
          // paddingTop: "1rem",
        }}
      >
        <div>
          <MaterialReactTable
            data={allDepartmentsData}
            columns={columns}
            manualPagination
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
            enableBottomToolbar={false}
            enableColumnResizing
            enableStickyHeader
            enableRowSelection
            // enableRowNumbers
            selectedRows={selectedRows}
            onSelectionChange={handleSelectionChange}
            enableFilters={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            renderTopToolbar={({ table }) => (
              <CustomToolbarMarkup table={table} />
            )}
            muiTableContainerProps={() => ({
              sx: {
                border: "1px solid #8080802b",
                height: "61vh",
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
      </Paper>

      <Dialog
        className="create-department-dialog"
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        open={departMentAddDialoge}
        onClose={() => {
          handleClickDepartmentClose();
          formik.handleReset();
        }}
      >
        <DialogTitle style={{ cursor: "move" }} id="draggable-dialog-title">
          <span className="heading-font">
            {t(departMentEdit ? "EDIT DEPARTMENT" : "ADD DEPARTMENT")}
          </span>
          <IconButton
            id="add_department"
            aria-label="close"
            onClick={() => {
              handleClickDepartmentClose(), formik.handleReset();
            }}
            color="primary"
            style={{
              float: "right",
              padding: "5px !important",
              position: "relative",
              top: "-.8rem",
            }}
          >
            <CancelIcon style={{ color: theme ? "#fff" : "#484747" }} />
          </IconButton>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent dividers>
            <Grid container className="create-contact-container" spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="branch"
                  name="branch"
                  label={t("BRANCH")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.branch}
                  onChange={formik.handleChange}
                  error={formik.touched.branch && Boolean(formik.errors.branch)}
                  helperText={formik.touched.branch && formik.errors.branch}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="cau"
                  name="cau"
                  label={t("CAU")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.cau}
                  onChange={formik.handleChange}
                  error={formik.touched.cau && Boolean(formik.errors.cau)}
                  helperText={formik.touched.cau && formik.errors.cau}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="pklDirectorate"
                  name="pklDirectorate"
                  label={t("DEPARTMENT/SECTION")}
                  size="small"
                  variant="outlined"
                  value={formik.values.pklDirectorate}
                  onChange={departMentEdit ? "" : formik.handleChange}
                  error={
                    formik.touched.pklDirectorate &&
                    Boolean(formik.errors.pklDirectorate)
                  }
                  helperText={
                    formik.touched.pklDirectorate &&
                    formik.errors.pklDirectorate
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="deptDisplayName"
                  name="deptDisplayName"
                  label={t("DEPARTMENT DISPLAY NAME")}
                  type="text"
                  size="small"
                  variant="outlined"
                  value={formik.values.deptDisplayName}
                  onChange={formik.handleChange}
                  error={
                    formik.touched.deptDisplayName &&
                    Boolean(formik.errors.deptDisplayName)
                  }
                  helperText={
                    formik.touched.deptDisplayName &&
                    formik.errors.deptDisplayName
                  }
                />
              </Grid>
              {departMentEdit === true ? (
                <>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="deptCoordRole"
                      options={allDepartmentsRoleData || []}
                      getOptionLabel={(option) => option.roleName}
                      // value={formik.values.deptCoordRole} // Use null as a default value
                      onChange={(e, newValue) =>
                        handleDeptCoordAdminRole(e, newValue)
                      }
                      filterSelectedOptions
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("DEPARTMENT COORD ROLE")}
                          variant="outlined"
                          placeholder="Favorites"
                          type="text"
                          name="deptCoordRole"
                          value={formik.values.deptCoordRole}
                          size="small"
                        />
                      )}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Autocomplete
                      id="deptAdminRole"
                      multiple
                      options={allDepartmentsRoleData || []}
                      getOptionLabel={(option) => option.roleName}
                      onChange={(e, newValue) => {
                        handleDeptAdminRole(e, newValue);
                        // formik.setFieldValue("deptAdminRole", newValue);
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label={t("DEPARTMENT ADMIN ROLE")}
                          variant="outlined"
                          type="text"
                          size="small"
                          name="deptAdminRole"
                          value={formik.values.deptAdminRole}
                        />
                      )}
                    />
                  </Grid>
                </>
              ) : null}

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="fromBlock"
                  name="fromBlock"
                  label=" FROM BLOCK "
                  variant="outlined"
                  size="small"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.fromBlock}
                  error={formik.touched.fromBlock && !!formik.errors.fromBlock}
                  helperText={
                    formik.touched.fromBlock && formik.errors.fromBlock
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  id="toBlock"
                  name="toBlock"
                  label="TO BLOCK "
                  variant="outlined"
                  size="small"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.toBlock}
                  error={formik.touched.toBlock && !!formik.errors.toBlock}
                  helperText={formik.touched.toBlock && formik.errors.toBlock}
                />
              </Grid>
              <Paper
                style={{
                  height: "150px",
                  overflowY: "auto",
                  overflowX: "hidden",
                  width: "100%",
                  marginTop: "10px",
                }}
              >
                <Grid container spacing={2}>
                  {formik.values.subSec.map((subSection, index) => {
                    return (
                      <>
                        <Grid item xs={6} key={subSection}>
                          <TextField
                            fullWidth
                            name={`subSec[${index}].sectionName`}
                            label={`SUB SECTION NAME ${index + 1}`}
                            variant="outlined"
                            size="small"
                            onChange={formik.handleChange}
                            value={subSection.sectionName}
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <TextField
                            fullWidth
                            name={`subSec[${index}].subsection`}
                            label={`RANGE `}
                            variant="outlined"
                            size="small"
                            onChange={formik.handleChange}
                            value={subSection.subsection || []}
                            error={
                              formik.touched.subSec &&
                              formik.touched.subSec[index] &&
                              !!formik.errors.subSec &&
                              formik.errors.subSec[index]
                            }
                            helperText={
                              formik.touched.subSec &&
                              formik.touched.subSec[index] &&
                              !!formik.errors.subSec &&
                              formik.errors.subSec[index]
                            }
                          />
                        </Grid>
                        {formik.values.subSec.length > 1 && (
                          <Grid item xs={1}>
                            <IconButton
                              style={{
                                marginTop: "-10px",
                              }}
                              color="secondary"
                              aria-label="delete"
                              onClick={() => removeSubSection(index)}
                            >
                              <DeleteIcon
                                style={{
                                  fontSize: "1.8rem",
                                }}
                              />
                            </IconButton>
                          </Grid>
                        )}
                      </>
                    );
                  })}

                  <Grid item xs={1}>
                    <IconButton
                      onClick={addSubSection}
                      style={{
                        marginTop: "3px",
                        width: "1.7rem",
                        height: "1.7rem",
                        backgroundColor: "rgb(230, 81, 71)",
                      }}
                    >
                      <AddIcon
                        style={{
                          fontSize: "1.4rem",
                          color: "#fff",
                        }}
                      />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button
              className="reset-button"
              type="reset"
              onClick={formik.handleReset}
              variant="contained"
              color="primary"
              disableElevation
              // endIcon={<UndoIcon />}
            >
              RESET
            </Button>
            <Button
              className="save-button"
              type="submit"
              variant="contained"
              color="primary"
              disableElevation
              style={{ backgroundColor: " #FFAF38", color: "#fff" }}
              // endIcon={<DoneIcon />}
              // onClick={formik.handleSubmit}
            >
              SAVE
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* departments role dialog */}
      <Dialog
        className="role-dialog"
        open={rolesDialog}
        onClose={handleClickRolesClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DepartmentsRole
          handleClickRolesClose={handleClickRolesClose}
          handleClickRolesOpen={handleClickRolesOpen}
          selectRowDept={selectRowDept}
          selectRowpklDirectorate={selectRowpklDirectorate}
        />
      </Dialog>

      {/* departments merge dialog */}
      <Dialog
        className="department_merge_dialog"
        open={departmentMerge}
        onClose={handleMergeDeptClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <MergeDepartment
          handleMergeDeptClose={handleMergeDeptClose}
          handleMergeDeptOpen={handleMergeDeptOpen}
          selectMergeDept={selectMergeDept}
        />
      </Dialog>
      {/* departments split dialog */}
      <div>
        <Dialog
          className="split-dialog"
          open={departmentSplit}
          onClose={handleSplitDeptClose}
          PaperComponent={PaperComponent}
          aria-labelledby="draggable-dialog-title"
        >
          <SplitDepartmentDisplay
            handleSplitDeptClose={handleSplitDeptClose}
            handleSplitDeptOpen={handleSplitDeptOpen}
            // selectMergeDept={selectMergeDept}
          />
        </Dialog>
      </div>
    </div>
  );
};

export default DepartmentSetting;
