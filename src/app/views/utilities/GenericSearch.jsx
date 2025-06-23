import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputBase,
  MenuItem,
  Paper,
  Select,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import CancelIcon from "@material-ui/icons/Cancel";
import DoneIcon from "@material-ui/icons/Done";
import "./GenericSearch.css";
// import { FaFilter } from "react-icons/fa";
import { Autocomplete } from "@material-ui/lab";
import { connect } from "react-redux";
import { getContentData } from "../../camunda_redux/redux/action";
import { dateFormatter, debounce } from "utils";
import Axios from "axios";
import { useContext } from "react";
import { AdvanceSearchContext } from "../Cabinet/advanceSeach/AdvanceContext";
import TuneIcon from "@material-ui/icons/Tune";
import RenderOption from "./RenderOption";
import Draggable from "react-draggable";
import DateRangeFilter from "../outbox/shared/DateRangeFilter";
import { addDays, subDays } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  selectBox: {
    "& .MuiOutlinedInput-inputMarginDense": {
      paddingTop: "6px",
      paddingBottom: "7px",
    },
    "& .MuiSelect-select.MuiSelect-select": {
      backgroundColor: theme?.palette?.type === "dark" ? "#565555" : "#f1f1f1",
      borderRadius: "0.5rem",
    },
  },
  dateInput: {
    "& .MuiInputBase-input": {
      height: "0.1876em",
    },
  },
}));

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

const PaperComponent = (props) => {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
};
const GenericSearch = (props) => {
  const advanceProps = useContext(AdvanceSearchContext);
  const {
    addFilter,
    FilterTypes,
    FilterValueTypes,
    cssCls,
    width,
    handleOpenAdvance,
    loadAdvanceSearchTable,
  } = props;
  const classes = useStyles();
  // state variables which get track of all filter functionality
  const [FilterBy, setFilterBy] = useState(
    `${FilterTypes.optionValue[1].value}|${FilterTypes.optionValue[1].label}` // combination to handle both ui chips or backend value
  );
  const [FilterVal, setFilterVal] = useState("");
  const [contentArr, setContentArr] = useState([]);
  const { t } = useTranslation();

  const [date, setDate] = useState([
    {
      startDate: subDays(new Date(), 30),
      endDate: addDays(new Date(), 0),
      key: "selection",
    },
  ]);

  const [openDate, setOpenDate] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleDiaClose = () => {
    setDiaOpen(false);
  };

  const handleDateClose = (event, reason) => {
    setOpenDate(false);
  };

  const onDateChange = (ranges) => {
    setDate([ranges]);
  };

  const btnRef = useRef();

  const toggleFilter = (val) => {
    setFilterVal("");
    setstartFilter(val);
  };

  const onChangeFilterBy = (val) => {
    setFilterVal("");
    setFilterBy(val);
  };

  const onChangeValue = (val, type) => {
    if (type === "dateRange") {
      setFilterVal({
        "createdOn|date From": dateFormatter(date[0].startDate),
        "dateTo|date To": dateFormatter(date[0].endDate),
      });
      setFilterBy("range|Date Range");
      setOpenDate(false);
    } else if (type !== "text" && !val.trim()) {
      setFilterVal("");
    } else {
      setFilterVal(val);
    }
  };

  let today = new Date().toISOString().slice(0, 10);

  const [val, setVal] = useState("");

  const getAdvanceSugg = async (value) => {
    localStorage.setItem("searchText", value);
    let rolename = sessionStorage.getItem("role");
    let department = sessionStorage.getItem("department");
    if (value && value.length > 2) {
      setLoading(true);
      try {
        const res = await fetch(
          `/esearchCorrespondance/text-CabinetAutoSuggest?Text=${value}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
              rolename,
              department,
              scope: props.scope,
            },
          }
        );
        const data = await res.json();

        let suggestions = data?.Text;
        const tempArr = Object.keys(suggestions);
        setContentArr(tempArr);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (FilterBy === "advance") {
      loadAdvanceSearchTable(val);
    } else {
      addFilter(e, FilterBy, FilterVal);
    }
  };
  const handleSuggestionHandle = (value) => {
    if (value) {
      setVal(value);
      let suggestValue = value.replaceAll("<b>", "").replaceAll("</b>", "");
      advanceProps.AdvanceOnChange("text", suggestValue?.trim());
      loadAdvanceSearchTable(suggestValue?.trim());
    } else {
      advanceProps.AdvanceOnChange("text", "");
      props.reset();
    }
  };

  const optimizedFn = useCallback(debounce(getAdvanceSugg), []);

  return (
    <>
      <div
        className="GenOutlookCon"
        style={{
          // background: startFilter ? "white" : "#1a020208",
          width: width ? width : "85%",
        }}
      >
        <form onSubmit={handleSubmit}>
          <TextField
            className={`${classes.selectBox} GenFilterOption`}
            select
            size={FilterTypes.size}
            value={FilterBy}
            color={FilterTypes.color}
            onChange={(e) => {
              onChangeFilterBy(e.target.value);
            }}
            variant={FilterTypes.variant}
          >
            {FilterTypes.optionValue.map((item, i) => {
              return (
                <MenuItem
                  key={i}
                  value={`${item.value}|${item.label}`}
                  disabled={i === 0}
                >
                  {t(item.label)}
                </MenuItem>
              );
            })}
          </TextField>

          <div className="GenSearchCon">
            <div className="GenSearchInput">
              {FilterValueTypes.map((type, i) => {
                if (FilterBy.split("|")[0] === type.name) {
                  if (type.type === "select") {
                    return (
                      <Select
                        key={i}
                        size={type.size}
                        className="GenFilterSelectInp"
                        color={type.color}
                        MenuProps={{
                          TransitionProps: {
                            onExited: () => btnRef.current.focus(),
                          },
                        }}
                        value={FilterVal}
                        onChange={(e) => {
                          btnRef.current.focus();
                          onChangeValue(e.target.value, "text");
                        }}
                        variant={type.variant}
                      >
                        {type.optionValue.map((item, i) => {
                          return (
                            <MenuItem key={i} value={item}>
                              {item}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    );
                  } else if (type.type === "date") {
                    return (
                      <TextField
                        key={i}
                        fullWidth
                        size={type.size}
                        type="date"
                        className={`${classes.dateInput} GenFilterDateInp`}
                        value={FilterVal}
                        onChange={(e) => {
                          onChangeValue(e.target.value, "text");
                        }}
                        variant={type.variant}
                        color={type.color}
                        InputProps={{
                          inputProps: { max: today }, // now future date is disabled
                        }}
                      />
                    );
                  } else if (type.type === "range") {
                    return (
                      <TextField
                        key={i}
                        fullWidth
                        variant="outlined"
                        size={type.size}
                        className={`${classes.dateInput} GenFilterDateInp`}
                        value={`${
                          months[date[0].startDate.getMonth()]
                        } ${date[0].startDate.getDate()}, ${date[0].startDate.getFullYear()} - ${
                          months[date[0].endDate.getMonth()]
                        } ${date[0].endDate.getDate()}, ${date[0].endDate.getFullYear()} `}
                        onClick={() => setOpenDate(true)}
                      />
                    );
                  } else if (type.type === "auto") {
                    return (
                      <Autocomplete
                        freeSolo
                        key={i}
                        name="contentnamess"
                        id="disable-clearable"
                        options={contentArr}
                        value={advanceProps?.text}
                        onInputChange={(e) => e && optimizedFn(e.target.value)}
                        onChange={(e, value) => {
                          handleSuggestionHandle(value);
                        }}
                        renderOption={(option) => (
                          <RenderOption option={option} />
                        )}
                        renderInput={(params) => (
                          <>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                margin: "0 auto",
                              }}
                            >
                              <Search
                                className="search_icon"
                                fontSize="small"
                                onClick={handleSubmit}
                              />
                              <TextField
                                {...params}
                                variant="outlined"
                                placeholder="Search Text..."
                                size="small"
                                value={val}
                                className={`${classes.dateInput} GenFilterSelectInp`}
                                onChange={(e) => setVal(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSubmit(e);
                                  }
                                }}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loading ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            </div>
                          </>
                        )}
                      />
                    );
                  } else {
                    return (
                      <InputBase
                        key={i}
                        fullWidth
                        type={type.text}
                        value={FilterVal}
                        onChange={(e) => {
                          onChangeValue(e.target.value, "text");
                        }}
                      />
                    );
                  }
                }
              })}
            </div>
          </div>
          {FilterBy.split("|")[0] === "advance" && (
            <IconButton
              id="RTI_GenSearchBtn"
              className="GenSearchBtn"
              style={{}}
              size="small"
              onClick={handleOpenAdvance}
            >
              <TuneIcon fontSize="small" />
            </IconButton>
          )}
          <IconButton
            id="RTI_GenSearchBtn"
            ref={btnRef} // To automatically focus to search btn when selected any option from select
            className="GenSearchBtn"
            onClick={handleSubmit}
            size="small"
            type="submit"
            style={
              FilterBy.split("|")[0] === "advance"
                ? { display: "none" }
                : { display: "block" }
            }
          >
            <Search fontSize="small" />
          </IconButton>
        </form>
        <Dialog
          maxWidth="md"
          open={openDate}
          keepMounted
          onClose={(event, reason) => {
            if (reason === "escapeKeyDown") {
              handleDateClose();
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
                onClick={handleDateClose}
                className="cancel-drag"
              >
                <CancelIcon style={{ cursor: "pointer", color: "#484747" }} />
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
              onClick={() => onChangeValue(date, "dateRange")}
            >
              APPLY
            </Button>
          </DialogActions>
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
  getContentData,
})(memo(GenericSearch));
