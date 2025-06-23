import React from "react";
import { Card, Typography, CardContent, Box } from "@mui/material";
import CircularGauge from "./CircularGauge";
import task from "../../images/task.webp";
import letter from "../../images/letter.webp";
import file from "../../images/file.webp";
import { CardActionArea } from "@material-ui/core";
import history from "../../../../../history";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";

const CircularGaugeCard = ({ info, name, theme }) => {

  const { t } = useTranslation()

  const gaugeName =
    name === t("daks")
      ? ["today", "external", "pending", "total"]
      : name === t("file(s)")
        ? ["today", "In-Circulation", "pending", "total"]
        : ["new", "open", "closed", "total"];
  const backgroundUrl =
    name === t("daks") ? letter : name === t("file(s)") ? file : task;
  function percentCalculator(a, b) {
    return Math.round((a * 100) / b);
  }

  const handleRedirect = () => {
    history.push({
      pathname: info?.link,
      search: info?.chip
    });
  };

  console.log(info)

  return (
    <Card
      variant="outlined"
      sx={{
        // paddingBottom: "8px",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(10px)",
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        overflow: "hidden",
        // backgroundImage: { sm: `url(${backgroundUrl})` },
        // backgroundSize: { sm: "14%" },
        // backgroundPosition: { sm: "calc(100% - 33px) center" },
        // backgroundRepeat: "no-repeat",
        // height: "90%",
      }}
    >
      <CardActionArea onClick={handleRedirect}>
        <CardContent style={{
          padding: "8px",
          display: "flex"
        }}>

          <Box sx={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                {name}
              </Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-evenly",
                width: { md: "100%" },
              }}
            >
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CircularGauge
                  value={percentCalculator(info.today, info.total)}
                  num={info.today}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {t(gaugeName[0])}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CircularGauge
                  value={percentCalculator(info.external, info.total)}
                  num={info.external}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {t(gaugeName[1])}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CircularGauge
                  value={percentCalculator(info.pending, info.total)}
                  num={info.pending}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {t(gaugeName[2])}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <CircularGauge
                  value={percentCalculator(info.total, info.total)}
                  num={info.total}
                />
                <Typography
                  variant="subtitle2"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "0.75rem",
                  }}
                >
                  {t(gaugeName[3])}
                </Typography>
              </Box>
            </Box>
          </Box>
          <div style={{
            position: "relative",
            display: "flex"
          }}>
            <img src={backgroundUrl} style={{
              width: "90px",
              objectFit: "contain",
              filter: "drop-shadow(0px 4px 2px grey)"
            }} />
            {/*
            <div style={{
              position: "absolute",
              fontSize: "1rem",
              top: "68%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              fontWeight: "bolder",
              border: "1px solid grey",
              borderRadius: "50%",
              background: "rgb(230, 81, 71)",
              color: "white",
              minWidth: "36px",
              minHeight: "36px",
              display: "flex",
              justifyContent: "center",
              alignItems: 'center'

            }}>{`${info.total}`}</div>
            */}
          </div>
        </CardContent>
      </CardActionArea>
    </Card>
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

export default connect(mapStateToProps, null)(CircularGaugeCard);
