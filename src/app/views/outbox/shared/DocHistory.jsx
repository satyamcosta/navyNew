import { Paper, Typography } from "@material-ui/core";
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from "@material-ui/lab";
import React from "react";
import "./docHistory.css";
import TimelineIcon from "@material-ui/icons/Timeline";

const DocHistory = ({ deptName, history, extHistory }) => {
  console.log({
    deptName,
    history,
    extHistory,
  });
  let count = 0;
  return (
    <>
      <Timeline className="history-timeline">
        {extHistory?.map((item, ind) => {
          console.log(count)
          let currDept = item.name;
          return (
            <TimelineItem key={ind}>
              <TimelineOppositeContent>
                <Typography variant="subtitle1" color="textPrimary">
                  {item.time}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineIcon />
                <TimelineConnector />
              </TimelineSeparator>
              <TimelineContent>
                <Typography variant="h6" color="textSecondary">
                  {item.name?.toUpperCase()}
                </Typography>
                <Paper elevation={3}>
                  {currDept == deptName
                    ? history[count]?.map((item2, i) => {
                        if (i == 0) {
                          count++;
                        }
                        return (
                          <ul style={{
                            padding: "0 !important",
                            margin: "0 !important"
                          }}>
                            <TimelineItem key={i}>
                            <TimelineOppositeContent>
                              <Typography variant="body2" color="textSecondary">
                                {item2.time}
                              </Typography>
                            </TimelineOppositeContent>
                            <TimelineSeparator>
                              <TimelineDot />
                              <TimelineConnector />
                            </TimelineSeparator>
                            <TimelineContent>{item2.name}</TimelineContent>
                          </TimelineItem>
                          </ul>
                        );
                      })
                    : ""}
                </Paper>
              </TimelineContent>
            </TimelineItem>
          );
        })}
      </Timeline>
    </>
  );
};

export default DocHistory;
