import React from "react";
import { Box, Typography } from "@mui/material";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  gaugeContainer: {
    position: "relative",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  gaugeCircle: (props) => ({
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    background: `conic-gradient(
      ${props.theme ? "#FFA41C" : theme.palette.primary.main} ${props.value}%,
      #e0e0e0 ${props.value}% 100%
    )`,
  }),
  gaugeInnerCircle: {
    position: "absolute",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    backgroundColor: "#fff",
  },
  gaugeLabel: {
    position: "absolute",
    fontSize: "1rem",
  },
}));

const CircularGauge = ({ value, num, theme }) => {
  const classes = useStyles({ value, theme });

  return (
    <Box className={classes.gaugeContainer}>
      <Box className={classes.gaugeCircle}></Box>
      <Box className={classes.gaugeInnerCircle}></Box>
      <Typography
        className={classes.gaugeLabel}
        style={{
          color: "black"
        }}
      >
        {num}
      </Typography>
    </Box>
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

export default connect(mapStateToProps, null)(CircularGauge);
