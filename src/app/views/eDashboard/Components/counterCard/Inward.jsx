import { Paper } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  datesCon: {
    display: "flex",
  },
  date: {
    border: "1px solid #80808045",
    flex: "1",
    padding: "4px",
    textAlign: "center",
  },
  dateCount: {
    border: "1px solid #80808045",
    flex: "1",
    padding: "5px",
    textAlign: "center",
    fontSize: "1.3rem",
    fontWeight: "600",
  },
}));

const getCurrentMonthName = () => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentMonthIndex = new Date().getMonth(); // Returns 0-11
  return months[currentMonthIndex];
};

const getLastFiveDays = () => {
  const days = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    days.push(String(date.getDate()).padStart(2, "0")); // Format: DD
  }

  return days;
};

const Inward = (props) => {

  const { t } = useTranslation()

  const classes = useStyles();
  const currMonth = getCurrentMonthName();

  const [last5Days, setLast5Days] = useState(getLastFiveDays());

  return (
    <div style={{
      display: "flex",
      flexDirection: "column"
    }}>
      <div className="mrt-head">
        <span>{t("last_inward")}</span>
      </div>
      <Paper
        elevation={3}
        style={{
          position: "relative",
          borderRadius: "9px",
          padding: "10px",
          boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
        }}
      >
        <h4>{currMonth}</h4>
        <div className={`${classes.datesCon}`}>
          {last5Days.map((item, i) => {
            return (
              <span key={i} className={`${classes.date}`}>
                {item}
              </span>
            );
          })}
        </div>
        <div className={`${classes.datesCon}`}>
          {props?.count?.map((item, i) => {
            return (
              <span
                key={i}
                className={`${classes.dateCount}`}
                style={{
                  color: props.theme ? "#FFA41C" : "rgb(4, 60, 117)",
                }}
              >
                {item}
              </span>
            );
          })}
        </div>
      </Paper>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    openDraftPa: state.openDraftPa,
    myInfo: state.myInfo,
    theme: state.theme,
  };
}

export default connect(mapStateToProps, null)(Inward);
