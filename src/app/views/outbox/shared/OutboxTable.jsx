import React, { useEffect, useMemo, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import {
  IconButton,
  Paper,
  Tooltip,
  FormControl,
  TextField,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  Slide,
  DialogActions,
  Button,
  MenuItem,
  Grid,
  Popper,
  Grow,
  ClickAwayListener,
  MenuList,
  Box,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import SearchIcon from "@material-ui/icons/Search";
import VisibilityIcon from "@material-ui/icons/Visibility";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import { VscDebugRestart } from "react-icons/vsc";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  loadOutboxData,
  getHistory,
  getHistoryOld,
  recallToInb,
  loadOutboxRow,
  getDataForExport,
  moveToMonitor,
  getMonitoredFiles,
} from "../../../camunda_redux/redux/action";
import { changingTableStateOutbox } from "../../../camunda_redux/redux/action/apiTriggers";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import DateRangeFilter from "../shared/DateRangeFilter";
import { addDays, subDays } from "date-fns";
import "../therme-source/material-ui/loading.css";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import { isNullOrUndefined } from "@syncfusion/ej2-base";
import { makeStyles } from "@material-ui/core/styles";
import { useTranslation } from "react-i18next";
import Draggable from "react-draggable";
import HistoryIcon from "@material-ui/icons/History";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import SplitViewPdfViewer from "../../inbox/shared/pdfViewer/pdfViewer";
import Annexure from "./Annexure";
import FileViewTable from "./FileViewTable";
import GetAppIcon from "@material-ui/icons/GetApp";
import Cookies from "js-cookie";
import Done from "@material-ui/icons/Done";
import {
  CancelOutlined,
  Cancel,
  DoneAll,
  MoreVert,
  PlaylistAddCheck,
  Save,
  SaveAlt,
  Replay,
} from "@material-ui/icons";
import Axios from "axios";
import { saveAs } from "file-saver";
import GenericSearch from "app/views/utilities/GenericSearch";
import { unstable_batchedUpdates } from "react-dom";
import GenericChip from "app/views/utilities/GenericChips";
import _ from "lodash";
import GenericFilterMenu from "app/views/utilities/GenericFilterMenu";
import Workbook from "react-excel-workbook";
import MaterialReactTable from "material-react-table";
import Status from "./Status";
import GenericColHider from "app/views/utilities/GenericColHider";
import { OUTBOX_COLUMNS_STATUS } from "app/camunda_redux/redux/constants/ActionTypes";
import PaginationComp2 from "app/views/utilities/PaginationComp2";
import DocHistory from "./DocHistory";
import DesktopMacIcon from "@material-ui/icons/DesktopMac";
import { MdOutbox } from "react-icons/md";
import { FaBarcode } from "react-icons/fa";
import GenericRefresh from "app/views/utilities/GenericRefresh";

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  paper: {
    padding: "6px 16px",
  },
  secondaryTail: {
    backgroundColor: theme.palette.secondary.main,
  },
  historyTimeLine: {
    justifyContent: "flex-start",
    "& .MuiTimelineOppositeContent-root": {
      flex: "none",
    },
  },
  dateInput: {
    "& .MuiInputBase-input": {
      height: "0.6876em",
    },
  },
  chipBox: {
    display: "flex",
    justifyContent: "center",
    marginTop: "-4px",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const OutboxTable = (props) => {
  const { isMonitor, handleMonitor } = props;
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const paramPage = searchParams.get("page");
  const paramSize = searchParams.get("pageSize");
  const paramFilter = searchParams.get("filter");
  const paramSort = searchParams.get("sort");

  const tableInstanceRef = useRef(null);

  const { theme } = useSelector((state) => state);

  const [date, setDate] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);
  const [open, setOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [currentPage, setCurrentPage] = useState(Number(paramPage) || 1);
  const [pageSize, setPageSize] = useState(Number(paramSize) || 25);
  const [Filter, setFilter] = useState(
    JSON.parse(decodeURIComponent(paramFilter)) || {}
  );
  const [SortBy, setSortBy] = useState(
    JSON.parse(decodeURIComponent(paramSort)) || {}
  );

  const [totalCount, setTotalCount] = useState(0);
  const [sampleData, setSampleData] = useState([]);
  const [historyObj, setHistoryObj] = useState({});
  const [extList, setExtList] = useState([]);
  const [blnOpenHistory, setblnOpenHistory] = useState(false);
  const [pageSizes] = useState([5, 10, 15]);
  const [resp, setResp] = useState(null);
  const [tabIndex, setTabIndex] = useState(0);
  const [type, setType] = useState(false);
  const [exportData, setExportData] = useState([]);
  const [selectedList, setSelectedList] = useState([]);
  const [deptName, setDeptName] = useState("");

  const [pdfLoads, setPdfLoads] = useState(false);
  const [propertiesMenu, setPropertiesMenu] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);
  const [type1, setType1] = useState(false);
  const [statusArr, setStatusArr] = useState([]);

  const [itemsInfo, setItemsInfo] = useState({});
  const [selectedType, setSelectedType] = useState("")

  const syncStateWithURL = () => {
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    const size = searchParams.get("pageSize");
    const filter = searchParams.get("filter");
    const sort = searchParams.get("sort");

    if (page && parseInt(page, 25) !== currentPage) {
      setCurrentPage(parseInt(page, 25));
    }
    if (size && parseInt(size, 25) !== pageSize) {
      setPageSize(parseInt(size, 25));
    }

    if (
      filter &&
      JSON.stringify(JSON.parse(decodeURIComponent(filter))) !==
      JSON.stringify(Filter)
    ) {
      try {
        const decodedFilter = decodeURIComponent(filter);
        const parsedFilter = JSON.parse(decodedFilter);
        setFilter(parsedFilter);
      } catch (error) {
        console.error("Failed to parse filter:", error);
      }
    }
    if (
      sort &&
      JSON.stringify(JSON.parse(decodeURIComponent(sort))) !==
      JSON.stringify(SortBy)
    ) {
      try {
        const decodedSort = decodeURIComponent(sort);
        const parsedSort = JSON.parse(decodedSort);
        setSortBy(parsedSort);
      } catch (error) {
        console.error("Failed to parse sort:", error);
      }
    }
  };
  useEffect(() => {
    syncStateWithURL();
  }, []);

  const handleSearchParams = (type, newValue) => {
    const searchParams = new URLSearchParams(location.search);

    if (type === "pageNum") {
      searchParams.set("page", newValue);
    } else if (type === "pageSize") {
      searchParams.set("page", 1);
      searchParams.set("pageSize", newValue);
    } else if (type === "filter") {
      const filter = JSON.stringify(newValue);
      searchParams.set("page", 1);
      searchParams.set("pageSize", 25);
      searchParams.set("filter", encodeURIComponent(filter));
    } else if (type === "sort") {
      const sort = JSON.stringify(newValue);
      searchParams.set("page", 1);
      searchParams.set("pageSize", 25);
      searchParams.set("sort", encodeURIComponent(sort));
    }

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const propertiesRef = useRef();

  const handleCloseMenu = (event) => {
    if (propertiesRef.current && propertiesRef.current.contains(event.target)) {
      return;
    }

    setPropertiesMenu(false);
  };

  // console.log(selectedList);

  // const prevOpen = useRef(propertiesMenu);
  // useEffect(() => {
  //   if (prevOpen.current === true && propertiesMenu === false) {
  //     propertiesRef.current.focus();
  //   }

  //   propertiesRef.current = open;
  // }, [propertiesMenu]);

  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");

  const { outboxHiddenColumns } = useSelector(
    (state) => state.personalizeInfo.muiTableData
  );

  let outboxCol = {
    status: true,
    subject: true,
    dateSent: true,
    inwardsId: true,
    originator: true,
    comment: true,
    to: true,
    fileName: true,
    type: true,
  };

  const [columnVisibility, setColumnVisibility] = useState(
    outboxHiddenColumns || outboxCol
  );

  const { blnValueOutbox } = props.subscribeApi;

  const [checkedRows, setCheckedRows] = useState({}); // For handling mrt table selected row state
  const [selectedRows, setSelectedRows] = useState([]);

  const [trigger, setTrigger] = useState(false);

  useEffect(() => {
    if (tableInstanceRef.current) {
      const rows = tableInstanceRef.current
        ?.getSelectedRowModel()
        .flatRows.map((row) => row.original);
      setSelectedRows(rows);
    }
  }, [checkedRows, tableInstanceRef]);

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
      value: "ref",
      label: "Ref #",
    },
    {
      value: "range",
      label: "Date Range",
    },
    {
      value: "to",
      label: "Send To",
    },
    {
      value: "type",
      label: "Type",
    },
    {
      value: "inwardsId",
      label: "Inward #",
    },
  ];
  const TypeOption = ["File", "Letter"];

  const statusOption = ["sent", "delivered", "seen", "action"];

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
      name: "ref",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "to",
      type: "text",
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
    {
      name: "type",
      type: "select",
      optionValue: TypeOption,
      size: "small",
      variant: "outlined",
      label: "Value",
      color: "primary",
    },
    {
      name: "inwardsId",
      type: "text",
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
      name: "fileName",
      type: "text",
      size: "small",
      variant: "outlined",
      label: "Ref #",
      color: "primary",
    },
    // {
    //   name: "to",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   label: "Send To",
    //   color: "primary",
    // },
    // {
    //   name: "dateSent",
    //   type: "date",
    //   size: "small",
    //   variant: "outlined",
    //   color: "primary",
    //   label: "Date Sent",
    // },
    // {
    //   name: "type",
    //   type: "text",
    //   size: "small",
    //   variant: "outlined",
    //   label: "Type",
    //   color: "primary",
    // },
    {
      name: "dateSent",
      type: "date",
      size: "small",
      variant: "outlined",
      color: "primary",
      label: "Date",
    },
  ];

  // state variable which get track of all filter option with value

  const addFilter = (e, type, value) => {
    e.preventDefault();
    let newFilter = { ...Filter };
    if (value) {
      newFilter[`${type}`] = value;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(1);
        setPageSize(25);
        handleSearchParams("filter", newFilter);
      });
    }
  };

  const deleteChip = (property) => {
    let newFilter = { ...Filter };
    delete newFilter[`${property}`];
    unstable_batchedUpdates(() => {
      setFilter(newFilter);
      setCurrentPage(1);
      setPageSize(25);
    });

    const searchParams = new URLSearchParams(location.search);

    searchParams.set("page", 1);
    searchParams.set("pageSize", 25);

    if (Object.keys(newFilter).length > 0) {
      const updatedFilter = JSON.stringify(newFilter);
      searchParams.set("filter", encodeURIComponent(updatedFilter));
    } else {
      searchParams.delete("filter");
    }

    history.push({
      pathname: location.pathname,
      search: searchParams.toString(),
    });
  };

  const addSort = (sortObj) => {
    unstable_batchedUpdates(() => {
      setSortBy(sortObj);
      setCurrentPage(1);
      setPageSize(25);
      handleSearchParams("sort", sortObj);
    });
  };

  const handleType = (val) => {
    if (val) {
      let newFilter = { ...Filter };
      newFilter["chip|Type"] = val;
      unstable_batchedUpdates(() => {
        setFilter(newFilter);
        setCurrentPage(1);
        setPageSize(25);
        handleSearchParams("filter", newFilter);
      });
    } else {
      setFilter({});
      if (searchParams.has("page")) {
        searchParams.delete("page");
      }

      if (searchParams.has("pageSize")) {
        searchParams.delete("pageSize");
      }

      if (searchParams.has("filter")) {
        searchParams.delete("filter");
      }

      if (searchParams.has("sort")) {
        searchParams.delete("sort");
      }
      history.push({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  };

  const DataSet = [
    {
      columns: [
        {
          title: "SL. NO.",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 60 },
        },
        {
          title: "SUBJECT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "FILE#",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "STATUS",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "DATE SENT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "SEND TO",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "TYPE",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
      ],

      data: exportData?.map((data) => [
        { value: data.serialNo, style: { font: { sz: "12" }, align: "right" } },
        { value: data.subject, style: { font: { sz: "12" } } },
        { value: data.fileName, style: { font: { sz: "12" } } },
        { value: data.status, style: { font: { sz: "12" } } },
        { value: data.dateSent, style: { font: { sz: "12" } } },
        { value: data.to, style: { font: { sz: "12" } } },
        { value: data.type, style: { font: { sz: "12" } } },
      ]),
    },
  ];

  const saveDataSet = [
    {
      columns: [
        {
          title: "SL. NO.",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 60 },
        },
        {
          title: "SUBJECT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "FILE#",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "STATUS",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "DATE SENT",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "SENT TO",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "TYPE",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
        {
          title: "ACTION",
          style: { font: { sz: "16", bold: true } },
          width: { wpx: 180 },
        },
      ],

      data: selectedList.map((data) => [
        { value: data.serialNo, style: { font: { sz: "12" }, align: "right" } },
        { value: data.subject, style: { font: { sz: "12" } } },
        { value: data.fileName, style: { font: { sz: "12" } } },
        { value: data.status, style: { font: { sz: "12" } } },
        { value: data.dateSent, style: { font: { sz: "12" } } },
        { value: data.to, style: { font: { sz: "12" } } },
        { value: data.type, style: { font: { sz: "12" } } },
        { value: data.fileStatus.toUpperCase(), style: { font: { sz: "12" } } },
      ]),
    },
  ];

  const columns = useMemo(() => {
    if (isMonitor) {
      return [
        {
          accessorKey: "indexFile",
          header: t("type"),
          size: 90,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            let type = row?.fileType
            return (
              <div className="cabinet-sts">
                <div className="info4 text-overflow">
                  <span className="mrt-text">{type}</span>
                </div>
              </div>
            );
          },
        },
        {
          accessorKey: "subject",
          header: t("subject"),
          size: 300,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            return (
              <div className="text-m text-b mrt-text" style={{
                color: props.theme ? "#429cff" : "#1a0dab"
              }}>{row?.cabinet?.subject}</div>
            );
          },
        },
        {
          accessorKey: "file",
          header: t("old_file"),
          size: 120,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            return <div className="mrt-text">{row?.file}</div>;
          },
        },
        
        {
          accessorKey: "createdBy",
          header: t("created_by"),
          size: 120,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            return <div className="mrt-text">{row?.cabinet?.createdBy}</div>;
          },
        },
        // {
        //   accessorKey: "status",
        //   header: t("status"),
        //   size: 100,
        //   Cell: ({ cell }) => {
        //     let row = cell?.row?.original;
        //     return <div className="mrt-text">{row?.cabinet?.status}</div>;
        //   },
        // },
        // {
        //   accessorKey: "createdOn",
        //   header: t("created_on"),
        //   size: 110,
        //   Cell: ({ cell }) => {
        //     let row = cell?.row?.original;

        //     return (
        //       <div className="text-overflow">
        //         <Tooltip title={row?.cabinet?.createdOn?.split(" ")[0]}>
        //           <span className="mrt-text">
        //             {row?.cabinet?.createdOn?.split(" ")[0]}
        //           </span>
        //         </Tooltip>
        //       </div>
        //     );
        //   },
        // },
        {
          accessorKey: "residingWith",
          header: t("residing_with"),
          size: 140,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            return <div className="mrt-text">{row?.cabinet?.residingWith}</div>;
          },
        },
        {
          accessorKey: "bookedOutBy",
          header: t("actions_btn"),
          size: 90,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            return (
              <>
                <div
                  style={{
                    display: "flex",
                  }}
                >
                  <Tooltip
                    title={t(
                      `${isMonitor ? t("remove_monitor") : t("move_monitor")}`
                    )}
                  >
                    <IconButton
                      className="InboxBtn"
                      onClick={(e) => {
                        e.stopPropagation();
                        moveToMonitor(row.file);
                      }}
                    >
                      <MoveToInboxIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              </>
            );
          },
        },
      ];
    } else {
      return [
        {
          accessorKey: "type",
          header: t("type"),
          size: 100,
          Cell: ({ cell }) => (
            <div className="info4 text-overflow">
              <span className="mrt-text">{cell.getValue()}</span>
            </div>
          ),
        },
        {
          accessorKey: "subject",
          header: t("subject"),
          size: 300,
          Cell: ({ cell }) => (
            <div className="info2 text-overflow">
              <Tooltip title={cell.getValue()}>
                <span
                  style={{
                    color: props.theme ? "#429cff" : "#1a0dab",
                  }}
                  className="text-m text-b mrt-text"
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            </div>
          ),
        },
        {
          accessorKey: "dateSent",
          header: t("date_sent"),
          size: 100,
          Cell: ({ cell }) => (
            <div className="info4 text-overflow">
              <Tooltip title={cell.getValue()}>
                <span
                  className="mrt-text"
                >
                  {cell.getValue()}
                </span>
              </Tooltip>
            </div>
          ),
        },
        {
          accessorKey: "to",
          header: t("to"),
          size: 150,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            return (
              <div className="info1 text-overflow">
                <Tooltip title={row.to}>
                  <span className="mrt-text">{row.to}</span>
                </Tooltip>
              </div>
            );
          },
        },
        {
          accessorKey: "originator",
          header: t("inbox_originator"),
          size: 140,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip title={item?.originator?.deptDisplayName}>
                <span
                  className="text-m mrt-text"
                  // style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {item?.originator?.deptName?.replace("dir-","")?.toUpperCase() || item?.originator?.deptDisplayName}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "comment",
          header: t("comments"),
          size: 200,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;

            return (
              <Tooltip title={decodeURIComponent(item?.comment || "")}>
                <span
                  className="text-m mrt-text"
                  // style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {decodeURIComponent(item?.comment || "")}
                </span>
              </Tooltip>
            );
          },
        },
        {
          accessorKey: "status",
          header: t("status"),
          size: 100,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;
            if (
              row.departmentStatus?.length > 0 ||
              row.roleStatus?.length > 0
            ) {
              return (
                <Tooltip title="VIEW STATUS">
                  <IconButton
                    className="outboxBtn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenStatus(true);
                      if (row.departmentStatus?.length > 0) {
                        setStatusArr(row.departmentStatus);
                        setType1(true);
                      } else {
                        setStatusArr(row.roleStatus);
                        setType1(false);
                      }
                    }}
                  >
                    <VisibilityIcon fontSize="large" />
                  </IconButton>
                </Tooltip>
              );
            } else {
              return (
                <div className="progress">
                  {row.fileStatus === "sent" ? (
                    <Tooltip title="SENT">
                      <IconButton id="outboxBtn_done" className="outboxBtn">
                        <Done />
                      </IconButton>
                    </Tooltip>
                  ) : row.fileStatus === "delivered" ? (
                    <Tooltip title="DELIVERED">
                      <IconButton id="outboxBtn_doneAll" className="outboxBtn">
                        <DoneAll />
                      </IconButton>
                    </Tooltip>
                  ) : row.fileStatus === "seen" ? (
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
                </div>
              );
            }
          },
        },
        {
          accessorKey: "fileName",
          header: t("file_name"),
          size: 140,
          Cell: ({ cell }) => (
            <div className="info3 text-overflow">
              <Tooltip title={cell.getValue()}>
                <span className="mrt-text">{cell.getValue()}</span>
              </Tooltip>
            </div>
          ),
        },
        
        

        {
          accessorKey: "inwardsId",
          header: t("inward_outword"),
          size: 190,
          Cell: ({ cell }) => {
            let item = cell?.row?.original;
            return (
              <Tooltip
                title={
                  item.inwardsId
                    ? item.inwardsId
                    : item.outwardsId == "-"
                      ? ""
                      : item.outwardsId || ""
                }
              >
                <span
                  className="text-m mrt-text"
                  // style={{ fontWeight: item.read ? "initial" : "bolder" }}
                >
                  {item.inwardsId
                    ? item.inwardsId
                    : item.outwardsId == "-"
                      ? ""
                      : item.outwardsId}
                </span>
              </Tooltip>
            );
          },
        },

        

        {
          accessorKey: "actions",
          header: t("actions_btn"),
          size: 110,
          Cell: ({ cell }) => {
            let row = cell?.row?.original;


            let lastETL = new Date('2025-04-06T00:00:00')






            let type = row?.type == "File" ? "File" : row?.type;
            let show = false;
            // if (
            //   type == "File" &&
            //   row?.outwardsId == "-" &&
            //   (row?.fileStatus == "sent" || row?.fileStatus == "delivered")
            // ) {
            //   show = true;
            // } else if
            if (new Date(row.dateSent) < lastETL) {
              show = false;

            }
            else if (
              type == "File" &&
              (row?.fileStatus == "sent" || row?.fileStatus == "delivered")
            ) {
              show = true;

            } else if (
              row?.roleStatus &&
              (row?.roleStatus[0]?.fileStatus == "delivered" ||
                row?.roleStatus[0]?.fileStatus == "sent")
            ) {
              show = true;

            }
            // else if (
            //   row?.departmentStatus &&
            //   (row?.departmentStatus[0]?.fileStatus == "delivered" ||
            //     row?.departmentStatus[0]?.fileStatus == "sent")
            // ) {
            //   show = true;

            // }
            return (
              <>
                <div className="info5">
                  <div className="outboxIcons">
                    {!row?.monitored && (
                      <Tooltip
                        title={t(
                          `${isMonitor ? t("move_outbox") : t("move_monitor")}`
                        )}
                      >
                        <IconButton
                          className="InboxBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveToMonitor(
                              row.fileName,
                              row.inboxId,
                              row.type,
                              row.subject,
                              row.originator?.deptDisplayName,
                              row.to
                            );
                          }}
                        >
                          <MoveToInboxIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                    {row?.type !== "Pa" && (
                      <Tooltip
                        title={t("user_history")}
                        aria-label="User History"
                      >
                        <IconButton
                          id="outboxBtn_history_btn"
                          className="outboxBtn"
                          onClick={(e) =>
                            handleOnClickOpenHistory(e, row, type)
                          }
                        >
                          <HistoryIcon
                            color={props.theme ? "action" : "primary"}
                          />
                        </IconButton>
                      </Tooltip>
                    )}
                    {show && (
                      <Tooltip title={t("recall")}>
                        <IconButton
                          className="InboxBtn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRecall(row?.id);
                          }}
                        >
                          <VscDebugRestart />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </>
            );
          },
        },
      ];
    }
  }, [rowData, isMonitor, props.theme, t]);

  const moveToMonitor = (
    file,
    fileId,
    type,
    subject,
    creator,
    residingWith
  ) => {
    console.log(file);
    props.blnEnableLoader(true);
    props
      .moveToMonitor(
        file,
        isMonitor ? "remove" : "add",
        fileId,
        type,
        subject,
        creator,
        residingWith
      )
      .then((resp) => {
        try {
          if (resp?.error?.includes("aborted")) {
            return;
          }
          if (resp.error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
          } else {
            dispatch(
              setSnackbar(
                true,
                "success",
                isMonitor ? t("monitor_out") : t("monitor_succ")
              )
            );
            props.blnEnableLoader(false);
            loadOutBoxTable();
          }
        } catch (e) {
          callMessageOut(e.message);
          props.blnEnableLoader(false);
        }
      });
  };

  const handleRecall = (id) => {
    props.blnEnableLoader(true);
    props.recallToInb(id).then((resp) => {
      try {
        if (resp?.error?.includes("aborted")) {
          return;
        }
        if (resp.error) {
          callMessageOut(resp.error);
          props.blnEnableLoader(false);
        } else {
          let newRowData = rowData.filter((item) => item?.id != id);
          setRowData(newRowData);
          props.blnEnableLoader(false);
          dispatch(setSnackbar(true, "success", t("recall_suc")));
        }
      } catch (e) {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      }
    });
  };

  useEffect(() => {
    if (Object.keys(checkedRows).length > 0) {
      setCheckedRows({});
    }
    let outboxAbort = new AbortController();
    loadOutBoxTable(outboxAbort.signal);

    return () => {
      outboxAbort.abort();
    };
  }, [
    blnValueOutbox,
    currentPage,
    pageSize,
    Filter,
    SortBy,
    isMonitor,
    trigger,
  ]);

  useEffect(() => {
    Cookies.remove("Rtioutbox");
  }, []);

  function adjustDivHeight() {
    var zoomLevel = document?.documentElement?.clientWidth / window?.innerWidth;
    var viewportHeight = window?.innerHeight / zoomLevel;
    var adjustableDiv = document?.getElementById("mrt-out");

    if (adjustableDiv) {
      adjustableDiv.style.height = viewportHeight - 210 + "px";
    }
  }

  useEffect(() => {
    adjustDivHeight();
    window.addEventListener("resize", adjustDivHeight);
    return () => {
      window.removeEventListener("resize", adjustDivHeight);
    };
  }, []);

  const loadOutBoxTable = (abortSignal) => {
    let tmpArr = [];
    props.blnEnableLoader(true);
    let filter = {};
    Object.entries(Filter).map(([property, value]) => {
      if (property.includes("range")) {
        let dates = Object.values(value);
        let rangeObj = {
          fromDate: dates[0],
          toDate: dates[1],
        };
        filter = { ...filter, ...rangeObj };
      } else {
        let key = property.split("|")[0];
        filter[`${key}`] = value;
      }
    });
    let sort = null;
    // if (!_.isEmpty(SortBy)) {
    //   sort = {
    //     title: SortBy?.title?.name,
    //     type: SortBy?.type,
    //   };
    // }
    if (SortBy?.title) {
      sort = {
        sortByField: SortBy.title.name,
        asc: SortBy?.type == "Asc" ? true : false,
      };
    }
    setRowData([]);

    if (isMonitor) {
      props
        .getMonitoredFiles(currentPage - 1, pageSize)
        .then((resp) => {
          try {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            if (resp.error) {
              callMessageOut(resp.error);
              props.blnEnableLoader(false);
            } else {
              if (!isNullOrUndefined(resp.response.File)) {
                setTotalCount(resp.response.totalElements);
                const { length, noOfDaks, noOfFiles } = resp?.response;
                setItemsInfo({
                  noOfDaks,
                  noOfFiles,
                  all: noOfDaks + noOfFiles,
                });
                tmpArr = resp.response.File.map((item, index) => {
                  return {
                    ...item,
                    serialNo: pageSize * currentPage - 1 + (index + 1),
                    isChecked: false,
                    status:
                      item.status === 2
                        ? "In-Progress"
                        : item.status === 3
                          ? "Approved"
                          : item.status === 4
                            ? "Rejected"
                            : item.status,
                  };
                });
                // props.changingTableStateOutbox(false, "CHANGE_OUTBOX");
                setRowData(tmpArr);
                props.blnEnableLoader(false);
              }
            }
          } catch (e) {
            callMessageOut(e.message);
            props.blnEnableLoader(false);
          }
        })
        .catch((err) => {
          console.log(err);
          callMessageOut(err.message);
        });
    } else {
      props
        .loadOutboxData(
          role,
          userName,
          pageSize,
          currentPage - 1,
          date[0],
          _.isEmpty(filter) ? {} : filter,
          _.isEmpty(sort) ? {} : sort,
          abortSignal
        )
        .then((resp) => {
          try {
            if (resp?.error?.includes("aborted")) {
              return;
            }
            if (resp.error) {
              callMessageOut(resp.error);
              props.blnEnableLoader(false);
            } else {
              if (!isNullOrUndefined(resp.response.Data)) {
                setTotalCount(resp.response.length);
                const { length, noOfDaks, noOfFiles } = resp?.response;
                setItemsInfo({
                  noOfDaks,
                  noOfFiles,
                  all: noOfDaks + noOfFiles,
                });
                tmpArr = resp.response.Data.map((item, index) => {
                  return {
                    ...item,
                    serialNo: pageSize * currentPage - 1 + (index + 1),
                    isChecked: false,
                    status:
                      item.status === 2
                        ? "In-Progress"
                        : item.status === 3
                          ? "Approved"
                          : item.status === 4
                            ? "Rejected"
                            : item.status,
                  };
                });
                // props.changingTableStateOutbox(false, "CHANGE_OUTBOX");
                setRowData(tmpArr);
                props.blnEnableLoader(false);
              }
            }
          } catch (e) {
            callMessageOut(e.message);
            props.blnEnableLoader(false);
          }
        })
        .catch((err) => {
          console.log(err);
          callMessageOut(err.message);
        });
    }
  };

  const callMessageOut = (message) => {
    props.blnEnableLoader(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const getHistory1 = (type, inboxId) => props.getHistory(type, inboxId);
  const getHistory2 = (file, inboxId) => props.getHistoryOld(file, inboxId);

  const handleOnClickOpenHistory = async (e, row, type) => {
    e.stopPropagation();
    props.blnEnableLoader(true);
    if (row) {
      try {
        const [res1, res2] = await Promise.all([
          getHistory1(type, row?.inboxId),
          getHistory2(row?.fileName, type != 'File' ? row?.inboxId : null),
        ]);
        console.log(res1, res2);

        if (res1.error) {
          setSampleData([]);
        } else {
          setSampleData(res1?.data);
          setblnOpenHistory(true);
        }
        if (res2.error) {
          setHistoryObj({});
        } else {
          setDeptName(res2?.data?.dept);
          setExtList(res2?.data?.deptList);
          setHistoryObj(res2?.data?.roles);
          setblnOpenHistory(true);
        }
        props.blnEnableLoader(false);
      } catch (error) {
        props.blnEnableLoader(false);
      }
    }
  };

  const handleOnClickSaveFile = async (e, list) => {
    props.blnEnableLoader(true);
    let tmpArr = [];
    list?.map((item) => tmpArr.push(item.id));
    if (list.length > 0) {
      try {
        const res = await Axios.post(
          `/retrieval_service/api/v2/download`,
          JSON.stringify(tmpArr),
          {
            headers: {
              "Content-Type": "application/json; charset=utf8",
              Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
              sessionId: sessionStorage.getItem("sessionId"),
              userName: localStorage.getItem("username"),
              roleName: sessionStorage.getItem("role"),
              department: sessionStorage.getItem("department"),
            },
            responseType: "arraybuffer",
          }
        );
        if (res) {
          let blob = new Blob([res.data], {
            type: "application/octet-stream",
          });
          props.blnEnableLoader(false);
          saveAs(blob, "Outbox Data.zip");
          // handleCloseMenu();
        }
      } catch (e) {
        callMessageOut(e.message);
        props.blnEnableLoader(false);
      }
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpenDialog(false);
    setOpen(false);
  };

  const onDateChange = (ranges) => {
    setDate([ranges]);
  };

  const handleSubmit = () => {
    // call api here
    props.blnEnableLoader(true);
    props.getDataForExport(role, userName, date[0]).then((res) => {
      setExportData(res.response.Data);
      // console.log("res dateRange :", exportData);
      handleClose();
      props.blnEnableLoader(false);
    });
  };

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const handleOnRowClick = (rowItem) => {
    props.blnEnableLoader(true);
    Cookies.set("paFileId", rowItem.id);
    if (rowItem.type === "PA" || rowItem.type === "Service Letter") {
      setType(true);
    } else if (rowItem.type === "RTI") {
      Cookies.set("isRti", true);
      Cookies.set("isRegister", rowItem.partcaseId);
      Cookies.set("Rtioutbox", true);
      Cookies.set("backPath", "/eoffice/outbox/file");
      history.push({
        pathname: "/eoffice/splitView/file",
        state: {
          from: "outbox",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
          routeQueryParams: location.search,
        },
      });
    } else {
      reDirectToSplitview(rowItem);
    }

    if (rowItem.type === "PA" || rowItem.type === "Service Letter") {
      props
        .loadOutboxRow(rowItem.id)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              props.blnEnableLoader(false);
              return;
            } else {
              setResp(resp.response.Data);
              setOpenDialog(true);
              props.blnEnableLoader(false);
            }
          } catch (error) {
            callMessageOut(resp.error);
            props.blnEnableLoader(false);
          }
        })
        .catch((err) => {
          console.log(err);
          callMessageOut(resp.error);
          props.blnEnableLoader(false);
        });
    }
  };

  const reDirectToSplitview = (rowItem) => {
    if (isMonitor) {
      if (rowItem?.fileType != "File") {
        sessionStorage.setItem("InboxID", rowItem?.fileInventoryId);
        sessionStorage.setItem("pa_id", rowItem?.personalApplicationInventoryId);
        sessionStorage.setItem("partcaseID", rowItem?.cabinet?.partcaseId);
        Cookies.set("isOutbox", true);
        Cookies.set("inboxFile", rowItem?.cabinet?.subject);
        Cookies.set("priority", rowItem?.cabinet?.priority);
        Cookies.set("referenceNumber", rowItem?.cabinet?.file);
        Cookies.set("type", rowItem?.fileType);
        Cookies.set("partCase", false);
        // Cookies.set("classification", rowItem.classification || "Unclassified");
        Cookies.set("status", rowItem?.cabinet?.statuss);
        Cookies.set("backPath", "/eoffice/outbox/file");
        Cookies.set("outboxCorr", true);
        history.push({
          pathname: "/eoffice/splitView/correspondence",
          state: {
            from: "outbox",
            id: rowItem.id,
            rowData,
            fileNo: rowItem.serialNo,
            routeQueryParams: location.search,
          },
        });
      } else {
        Cookies.set("outboxId", rowItem.id);
        sessionStorage.setItem("InboxID", rowItem?.inboxId);
        Cookies.set("isOutbox", true);
        Cookies.set("inboxFile", rowItem.subject);
        Cookies.set("priority", rowItem.priority);
        Cookies.set("referenceNumber", rowItem.fileName);
        Cookies.set("backPath", "/eoffice/outbox/file");
        props.blnEnableLoader(false);
        history.push({
          pathname: "/eoffice/splitView/file",
          state: {
            from: "outbox",
            data: rowItem.subject,
            rowData,
            fileNo: rowItem.serialNo,
            routeQueryParams: location.search,
          },
        });
      }
    }
    else if (rowItem?.type != "File") {
      sessionStorage.setItem("InboxID", rowItem?.inboxId);
      sessionStorage.setItem("pa_id", rowItem?.personalApplicationInventoryId);
      sessionStorage.setItem("partcaseID", rowItem?.partCase);
      Cookies.set("isOutbox", true);
      Cookies.set("inboxFile", rowItem?.subject);
      Cookies.set("priority", rowItem?.priority);
      Cookies.set("referenceNumber", rowItem?.fileName);
      Cookies.set("type", rowItem?.type);
      Cookies.set("partCase", false);
      // Cookies.set("classification", rowItem.classification || "Unclassified");
      Cookies.set("status", rowItem?.statuss);
      Cookies.set("backPath", "/eoffice/outbox/file");
      Cookies.set("outboxCorr", true);
      history.push({
        pathname: "/eoffice/splitView/correspondence",
        state: {
          from: "outbox",
          id: rowItem.id,
          rowData,
          fileNo: rowItem.serialNo,
          routeQueryParams: location.search,
        },
      });
    } else {
      Cookies.set("outboxId", rowItem.id);
      sessionStorage.setItem("InboxID", rowItem?.inboxId);
      Cookies.set("isOutbox", true);
      Cookies.set("inboxFile", rowItem.subject);
      Cookies.set("priority", rowItem.priority);
      Cookies.set("referenceNumber", rowItem.fileName);
      Cookies.set("backPath", "/eoffice/outbox/file");
      props.blnEnableLoader(false);
      history.push({
        pathname: "/eoffice/splitView/file",
        state: {
          from: "outbox",
          data: rowItem.subject,
          rowData,
          fileNo: rowItem.serialNo,
          routeQueryParams: location.search,
        },
      });
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "end"
        }}
      >
        <div
          className={`mrt-head ${isMonitor ? "un-active" : ""}`}
          onClick={() => handleMonitor(false)}
        >
          <span>{t("outbox")}</span>
        </div>
        <div
          className={`mrt-head ${isMonitor ? "" : "un-active"}`}
          onClick={() => handleMonitor(true)}
        >
          <span>{t("monitor")}</span>
        </div>
      </div>
      <Paper
        className="outbox-table"
        elevation={23}
        style={{
          position: "relative",
          borderRadius: "8px",
          // boxShadow:
          //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
        }}
      >
        <div id="material-table">
          <div
            className="header-input"
            style={{
              width: "100%",
              padding: "0rem 1rem",
            }}
          >
            <div>
              <Grid item xs={4}>
                <GenericSearch
                  FilterTypes={FilterTypes}
                  FilterValueTypes={FilterValueTypes}
                  addFilter={addFilter}
                  cssCls={{}}
                  width={"100%"}
                />
              </Grid>

              <Grid
                item
                xs="auto"
                style={{ display: "flex", alignItems: "center" }}
                className="outbox_hide_responsive"
              >
                <GenericRefresh handleRefresh={() => setTrigger(!trigger)} />
                {/*
                  <FormControl variant="outlined" size="small">
                  <label
                    style={{
                      marginBottom: "0px",
                      marginRight: "15px",
                      fontWeight: "bold",
                    }}
                  >
                    {t("filter_by_date_sent")} :
                  </label>
                  <TextField
                    style={{ marginRight: "1rem" }}
                    className={classes.dateInput}
                    id="outlined-basic"
                    size="small"
                    variant="outlined"
                    value={`${
                      months[date[0].startDate.getMonth()]
                    } ${date[0].startDate.getDate()}, ${date[0].startDate.getFullYear()} - ${
                      months[date[0].endDate.getMonth()]
                    } ${date[0].endDate.getDate()}, ${date[0].endDate.getFullYear()} `}
                    onClick={handleClickOpen}
                  />
                </FormControl>
                  */}
                {/*
                  isMonitor ? (
                  <Tooltip title={t("outbox")}>
                    <IconButton onClick={() => handleMonitor(false)}>
                      <MdOutbox />
                    </IconButton>
                  </Tooltip>
                ) : (
                  <Tooltip title={t("monitor")}>
                    <IconButton onClick={() => handleMonitor(true)}>
                      <DesktopMacIcon />
                    </IconButton>
                  </Tooltip>
                )
                  
                  */}

                {
                  !isMonitor && <>

                    {Boolean(selectedRows.length) ? (
                      <Workbook
                        filename="OutBox_Data.xlsx"
                        element={
                          <IconButton disabled={!Boolean(selectedRows.length)}>
                            <Tooltip
                              title={t("export_data")}
                              aria-label="Export Data"
                            >
                              <GetAppIcon />
                            </Tooltip>
                          </IconButton>
                        }
                      >
                        <Workbook.Sheet
                          data={selectedRows.length > 0 ? selectedRows : exportData}
                          name="Sheet A"
                        >
                          <Workbook.Column label="Sl. NO." value="serialNo" />
                          <Workbook.Column label="SUBJECT" value="subject" />
                          <Workbook.Column label="FILE#" value="status" />
                          <Workbook.Column label="STATUS" value="dateSent" />
                          <Workbook.Column label="SENT TO" value="to" />
                          <Workbook.Column label="TYPE" value="type" />
                          <Workbook.Column label="ACTION" value="fileStatus" />
                        </Workbook.Sheet>
                      </Workbook>
                    ) : (
                      <IconButton disabled={!Boolean(selectedRows.length)}>
                        <Tooltip title={t("export_data")} aria-label="Export Data">
                          <GetAppIcon />
                        </Tooltip>
                      </IconButton>
                    )}

                    <IconButton
                      disabled={!Boolean(selectedRows.length)}
                      onClick={(e) => handleOnClickSaveFile(e, selectedRows)}
                    >
                      <Tooltip title="EXPORT ZIP" aria-label="Search">
                        <Save />
                      </Tooltip>
                    </IconButton>
                    <GenericFilterMenu
                      SortValueTypes={SortValueTypes}
                      addSort={addSort}
                      sort={SortBy}
                    />
                    <GenericColHider
                      tableCols={columnVisibility}
                      setTableCols={setColumnVisibility}
                      moduleName={OUTBOX_COLUMNS_STATUS}
                    />
                  </>
                }
              </Grid>
              <Grid
                item
                xs="auto"
                style={{ display: "flex", alignItems: "center" }}
                className="outbox_show_responsive"
              >
                <GenericFilterMenu
                  SortValueTypes={SortValueTypes}
                  addSort={addSort}
                  sort={SortBy}
                />
                <IconButton
                  ref={propertiesRef}
                  aria-controls={propertiesMenu ? "menu-list-grow" : undefined}
                  aria-haspopup="true"
                  onClick={() => setPropertiesMenu(!propertiesMenu)}
                >
                  <Tooltip title="OTHER PROPERTIES">
                    <MoreVert />
                  </Tooltip>
                </IconButton>
                <Popper
                  open={propertiesMenu}
                  anchorEl={propertiesRef.current}
                  role={undefined}
                  transition
                  disablePortal
                  style={{ zIndex: "1" }}
                >
                  {({ TransitionProps, placement }) => (
                    <Grow
                      {...TransitionProps}
                      style={{
                        transformOrigin:
                          placement === "bottom"
                            ? "center top"
                            : "center bottom",
                      }}
                    >
                      <Paper>
                        <ClickAwayListener onClickAway={handleCloseMenu}>
                          <MenuList
                            autoFocusItem={open}
                            id="menu-list-grow"
                          // onKeyDown={handleListKeyDown}
                          >
                            <MenuItem
                              onClick={handleCloseMenu}
                              style={{ display: "flex", gap: "1rem" }}
                            >
                              <Workbook
                                filename="OutBox_Data.xlsx"
                                element={
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: ".7rem",
                                    }}
                                  >
                                    <GetAppIcon style={{ color: "#808080" }} />
                                    {t("EXPORT DATA")}
                                  </div>
                                }
                              >
                                <Workbook.Sheet
                                  data={
                                    selectedRows.length > 0
                                      ? selectedRows
                                      : exportData
                                  }
                                  name="Sheet A"
                                >
                                  <Workbook.Column
                                    label="Sl. NO."
                                    value="serialNo"
                                  />
                                  <Workbook.Column
                                    label="SUBJECT"
                                    value="subject"
                                  />
                                  <Workbook.Column
                                    label="FILE#"
                                    value="status"
                                  />
                                  <Workbook.Column
                                    label="STATUS"
                                    value="dateSent"
                                  />
                                  <Workbook.Column label="SENT TO" value="to" />
                                  <Workbook.Column label="TYPE" value="type" />
                                  <Workbook.Column
                                    label="ACTION"
                                    value="fileStatus"
                                  />
                                </Workbook.Sheet>
                              </Workbook>
                            </MenuItem>
                            <MenuItem
                              // onClick={handleCloseMenu}
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: ".7rem",
                              }}
                              onClick={(e) =>
                                handleOnClickSaveFile(e, selectedRows)
                              }
                            >
                              <Save style={{ color: "#808080" }} />{" "}
                              {t("EXPORT ZIP")}
                            </MenuItem>
                            <MenuItem>
                              <FormControl variant="outlined" size="small">
                                <label
                                  style={{
                                    marginBottom: "0px",
                                    marginRight: "15px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {t("filter_by_date_sent")} :
                                </label>
                                <TextField
                                  style={{ marginRight: "1rem" }}
                                  id="outlined-basic"
                                  variant="outlined"
                                  size="small"
                                  value={`${months[date[0].startDate.getMonth()]
                                    } ${date[0].startDate.getDate()}, ${date[0].startDate.getFullYear()} - ${months[date[0].endDate.getMonth()]
                                    } ${date[0].endDate.getDate()}, ${date[0].endDate.getFullYear()} `}
                                  onClick={handleClickOpen}
                                />
                                <IconButton onClick={loadOutBoxTable}>
                                  <Tooltip
                                    title={t("search")}
                                    aria-label="Search"
                                  >
                                    <SearchIcon />
                                  </Tooltip>
                                </IconButton>
                              </FormControl>
                            </MenuItem>
                          </MenuList>
                        </ClickAwayListener>
                      </Paper>
                    </Grow>
                  )}
                </Popper>
              </Grid>
            </div>
            {
              !isMonitor && <Box className={classes.chipBox}>
                <div className="flex flex-center">
                  {/*
                  <Button className="chip-info inbox-switch">
                  {isMonitor ? t("monitor") : t("outbox")}
                </Button>
                  */}
                  <Button className={`chip-info ${!selectedType && 'active'}`} onClick={() => {
                    setSelectedType("")
                    handleType(null)
                  }
                  }>
                    {t("all")} <span>{itemsInfo?.all ? itemsInfo?.all : 0}</span>
                  </Button>
                  <Button className={`chip-info dak ${selectedType == "Dak" && 'active'}`} onClick={() => {
                    setSelectedType("Dak")
                    handleType("Dak")
                  }}>
                    {t("dak")} <span> {itemsInfo?.noOfDaks ? itemsInfo?.noOfDaks : 0}</span>
                  </Button>
                  <Button
                    className={`chip-info file ${selectedType == "File" && 'active'}`}
                    onClick={() => {
                      setSelectedType("File")
                      handleType("File")
                    }}
                  >
                    {t("files")} <span>
                      {itemsInfo?.noOfFiles ? itemsInfo?.noOfFiles : 0}</span>
                  </Button>
                  {/* <Button
                    className="chip-info no-cursor"
                    onClick={() => handleType("File")}
                  >
                    {t("action_point")} <span>{0}</span>
                  </Button> */}
                </div>
              </Box>
            }

            <GenericChip Filter={Filter} deleteChip={deleteChip} />
          </div>

          <MaterialReactTable
            tableInstanceRef={tableInstanceRef}
            data={rowData}
            manualPagination
            columns={columns}
            initialState={{
              density: "compact",
            }}
            displayColumnDefOptions={{
              "mrt-row-select": {
                size: 50,
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
            state={{
              rowSelection: checkedRows,
              columnVisibility,
            }}
            onRowSelectionChange={setCheckedRows}
            enableTopToolbar={false}
            enableBottomToolbar={false}
            enableColumnResizing
            enableStickyHeader
            enableRowSelection
            enableFilters={false}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            muiTableBodyRowProps={({ row, staticRowIndex }) => ({
              onClick: () => {
                if (!isMonitor) {
                  handleOnRowClick(row?.original);
                }
              },
              sx: {
                cursor: !isMonitor ? "pointer" : "inherit",
                height: "10px",
                backgroundColor: staticRowIndex % 2 ? props.theme ? "#4c5765" : "#d6e0ec" : "inherit",
              },
            })}
            muiSelectCheckboxProps={{
              sx: { color: props.theme ? "#fff" : "#00000099" },
              color: props.theme ? "warning" : "primary",
            }}
            muiTableContainerProps={() => ({
              sx: {
                border: "1px solid #8080802b",
                height: "61vh",
              },
              id: "mrt-out",
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
        </div>

        <PaginationComp2
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageSize={pageSize}
          setPageSize={setPageSize}
          pageSizes={pageSizes}
          totalCount={totalCount}
          searchParamsSetter={handleSearchParams}
        />
      </Paper>
      <Dialog
        open={blnOpenHistory}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setblnOpenHistory(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth
        className="outbox-history"
        maxWidth="md"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          <span>{t("user_history")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              id="outbox_history_btn"
              onClick={(e) => setblnOpenHistory(false)}
              className="cancel-drag"
            >
              <CancelIcon style={{ color: theme ? "#fff" : "#484747" }} />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers style={{ maxHeight: "600px", display: "flex" }}>
          <Timeline align="left">
            {sampleData.map((item, index) => (
              <TimelineItem
                key={item.id}
                className={classes.historyTimeLine}
                style={{ display: "flex" }}
              >
                <TimelineOppositeContent>
                  <Typography variant="body2" color="textSecondary">
                    {item.typo}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={item.color || "grey"}
                    variant={item.variant || "outlined"}
                  />
                  {sampleData.length === index + 1 ? "" : <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent>
                  <Paper
                    elevation={3}
                    className={classes.paper}
                    style={{ backgroundColor: "#eaeaea" }}
                  >
                    <Typography
                      variant="body2"
                      style={{ fontWeight: "bold", color: "#000" }}
                    >
                      <span
                        style={{ fontWeight: "bold", color: "#000" }}
                      >{`${item.title}: `}</span>
                      {item.description}
                    </Typography>
                  </Paper>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>

          <DocHistory
            deptName={deptName}
            extHistory={extList}
            history={historyObj}
          />
        </DialogContent>
      </Dialog>

      {openDialog && (
        <Dialog
          fullScreen
          open={openDialog}
          onClose={(event, reason) => {
            if (reason === "escapeKeyDown") {
              handleClose();
            }
          }}
          TransitionComponent={Transition}
        >
          <div
            style={{
              backgroundColor: theme ? "rgb(46 46 46)" : "rgb(241 241 241)",
              height: "100%",
              overflow: "hidden",
            }}
          >
            {type ? (
              <Tabs
                forceRenderTabPanel
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
                style={{ height: "100%" }}
              >
                <TabList style={{ marginLeft: "10px" }}>
                  <Tab
                    style={{ borderRadius: "5px 5px 0 0", padding: "4px 10px" }}
                  >
                    {t("personal_application").toUpperCase()}
                  </Tab>
                  <Tab
                    style={{ borderRadius: "5px 5px 0 0", padding: "4px 10px" }}
                  >
                    {t("annexure")}
                  </Tab>
                  <IconButton
                    id="outbox_PA_close_btn"
                    aria-label="close"
                    onClick={handleClose}
                    style={{
                      color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                      float: "right",
                      marginTop: "18px",
                      marginRight: "20px",
                    }}
                    className="icons-button"
                  >
                    <Cancel />
                  </IconButton>
                </TabList>
                <TabPanel style={{ height: "calc(100vh - 60px)" }}>
                  <div
                    style={{
                      border: "1px solid #b6b6b66b",
                      height: "100%",
                      overflow: "hidden",
                    }}
                    className="ss-privacy-hide"
                  >
                    <SplitViewPdfViewer
                      fileUrl={resp && resp.fileUrl}
                      pdfLoads={(val) => {
                        setPdfLoads(val);
                      }}
                      editable={false}
                    />
                  </div>
                </TabPanel>
                <TabPanel style={{ height: "calc(100vh - 60px)" }}>
                  <Annexure resp={resp} />
                </TabPanel>
              </Tabs>
            ) : (
              <Tabs
                forceRenderTabPanel
                selectedIndex={tabIndex}
                onSelect={(index) => setTabIndex(index)}
              >
                <TabList>
                  <Tab
                    style={{ borderRadius: "5px 5px 0 0", padding: "4px 10px" }}
                  >
                    {t("personal_file").toUpperCase()}
                  </Tab>
                  <IconButton
                    id="outbox_PF_close_btn"
                    aria-label="close"
                    onClick={handleClose}
                    style={{
                      color: props.theme ? "#fff" : "rgba(0, 0, 0, 0.54)",
                      float: "right",
                      marginTop: "15px",
                      marginRight: "16px",
                    }}
                    className="icons-button"
                    size="small"
                  >
                    <CancelOutlined fontSize="small" />
                  </IconButton>
                </TabList>
                <TabPanel>
                  <FileViewTable resp={resp} />
                </TabPanel>
              </Tabs>
            )}
          </div>
        </Dialog>
      )}

      <Dialog
        maxWidth="md"
        open={open}
        keepMounted
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleClose();
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          className="send_dialog"
          id="draggable-dialog-title"
        >
          {t("choose_date_range")}
          <Tooltip title={t("close")}>
            <IconButton
              color="primary"
              style={{ float: "right" }}
              onClick={handleClose}
              className="cancel-drag"
            >
              <CancelIcon
                style={{ cursor: "pointer", color: theme ? "#fff" : "#484747" }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <DateRangeFilter onDateChange={onDateChange} date={date} />
        </DialogContent>
        <DialogActions>
          <Button
            id="outbox_apply_btn"
            variant="contained"
            color="secondary"
            endIcon={<DoneIcon />}
            style={{ float: "right" }}
            onClick={handleSubmit}
          >
            APPLY
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        maxWidth="sm"
        open={openStatus}
        keepMounted
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            setOpenStatus(false);
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        aria-describedby="alert-dialog-slide-description"
        id="status-dialog"
      >
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="send_dialog"
        >
          <span>{t("status")}</span>
          <Tooltip title={t("close")}>
            <IconButton
              aria-label="close"
              onClick={() => setOpenStatus(false)}
              color="primary"
              className="cancel-drag"
            >
              <CancelIcon
                style={{
                  color: props.theme ? "#fff" : "#484747",
                }}
              />
            </IconButton>
          </Tooltip>
        </DialogTitle>
        <DialogContent dividers>
          <Status statusArr={statusArr} type={type1} />
        </DialogContent>
      </Dialog>
    </>
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

export default connect(mapStateToProps, {
  loadOutboxData,
  changingTableStateOutbox,
  getHistory,
  getHistoryOld,
  recallToInb,
  loadOutboxRow,
  getDataForExport,
  moveToMonitor,
  getMonitoredFiles,
})(OutboxTable);
