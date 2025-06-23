import React, { useState, useEffect } from "react";
import styles from "./styles.module.css";
import { Tooltip } from "@material-ui/core";
import {
  FiberManualRecord,
  FormatAlignCenter,
  PriorityHigh,
} from "@material-ui/icons";

const TripleToggleSwitch = (props) => {
  const { priority, handleChange } = props;
  const [switchPosition, setSwitchPosition] = useState("left");
  const [animation, setAnimation] = useState(null);

  useEffect(() => {
    if (priority && priority === "normal") {
      setSwitchPosition("left");
    } else if (priority && priority === "medium") {
      setSwitchPosition("center");
    } else {
      setSwitchPosition("right");
    }
  }, []);

  const getSwitchAnimation = (value) => {
    let newAnimation = null;
    if (value === "center" && switchPosition === "left") {
      newAnimation = styles["left-to-center"];
    } else if (value === "right" && switchPosition === "center") {
      newAnimation = styles["center-to-right"];
    } else if (value === "center" && switchPosition === "right") {
      newAnimation = styles["right-to-center"];
    } else if (value === "left" && switchPosition === "center") {
      newAnimation = styles["center-to-left"];
    } else if (value === "right" && switchPosition === "left") {
      newAnimation = styles["left-to-right"];
    } else if (value === "left" && switchPosition === "right") {
      newAnimation = styles["right-to-left"];
    }
    // props.onChange(value);

    if (value === "left") {
      handleChange("normal");
    } else if (value === "center") {
      handleChange("medium");
    } else {
      handleChange("high");
    }
    setSwitchPosition(value);
    setAnimation(newAnimation);
  };

  return (
    <div className={styles["priority-wrapper"]}>
      <div className={styles["main-container"]}>
        <div
          className={`${styles.switch} ${animation} ${
            styles[switchPosition + "-position"]
          }`}
        ></div>

        <input
          onChange={(e) => getSwitchAnimation(e.target.value)}
          name="map-switch"
          id="left"
          type="radio"
          value="left"
        />

        <Tooltip title="NORMAL">
          <label
            className={`${styles["left-label"]} ${
              switchPosition === "left" && styles["black-font"]
            }`}
            htmlFor="left"
          >
            <svg
              width="25px"
              height="25px"
              viewBox="-25.6 -25.6 563.20 563.20"
              version="1.1"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeWidth="round"
                strokeLinejoin="round"
              />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>prio-normal</title>{" "}
                <g
                  id="Page-1"
                  strokeWidth="0.00512"
                  fill="none"
                  fillRule="evenodd"
                >
                  {" "}
                  <g
                    id="icon"
                    fill="#17db24"
                    transform="translate(213.333333, 85.333333)"
                  >
                    {" "}
                    <rect
                      id="Rectangle"
                      x="2.84217094e-14"
                      y="1.42108547e-14"
                      width="85.3333333"
                      height="341.333333"
                    >
                      {" "}
                    </rect>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
            {/* <FiberManualRecord
              fontSize="medium"
              style={{ color: "#3ab93a", marginTop: "1px" }}
            /> */}
          </label>
        </Tooltip>

        <input
          onChange={(e) => getSwitchAnimation(e.target.value)}
          name="map-switch"
          id="center"
          type="radio"
          value="center"
        />
        <Tooltip title="MEDIUM">
          <label
            className={`${styles["center-label"]} ${
              switchPosition === "center" && styles["black-font"]
            }`}
            htmlFor="center"
          >
            {/* <FormatAlignCenter fontSize="medium" style={{ color: "orange" }} /> */}
            <svg
              width="25px"
              height="25px"
              viewBox="-25.6 -25.6 563.20 563.20"
              version="1.1"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeWidth="round"
                strokeLinejoin="round"
              />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>prio-middle</title>{" "}
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  {" "}
                  <g
                    id="icon"
                    fill="#000000"
                    transform="translate(128.000000, 85.333333)"
                  >
                    {" "}
                    <path
                      d="M0,1.42108547e-14 L85.3333333,1.42108547e-14 L85.3333333,341.333333 L0,341.333333 L0,1.42108547e-14 Z M170.666667,1.42108547e-14 L256,1.42108547e-14 L256,341.333333 L170.666667,341.333333 L170.666667,1.42108547e-14 Z"
                      id="Combined-Shape"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </label>
        </Tooltip>

        <input
          onChange={(e) => getSwitchAnimation(e.target.value)}
          name="map-switch"
          id="right"
          type="radio"
          value="right"
        />
        <Tooltip title="HIGH">
          <label
            className={`${styles["right-label"]} ${
              switchPosition === "right" && styles["black-font"]
            }`}
            htmlFor="right"
          >
            {/* <PriorityHigh fontSize="medium" style={{ color: "red" }} /> */}
            <svg
              width="25px"
              height="25px"
              viewBox="-25.6 -25.6 563.20 563.20"
              version="1.1"
              fill="#000000"
            >
              <g id="SVGRepo_bgCarrier" strokeWidth="0" />

              <g
                id="SVGRepo_tracerCarrier"
                strokeWidth="round"
                strokeLinejoin="round"
              />

              <g id="SVGRepo_iconCarrier">
                {" "}
                <title>prio-urgent</title>{" "}
                <g
                  id="Page-1"
                  stroke="none"
                  strokeWidth="1"
                  fill="none"
                  fillRule="evenodd"
                >
                  {" "}
                  <g
                    id="icon"
                    fill="#ff2600"
                    transform="translate(64.000000, 85.333333)"
                  >
                    {" "}
                    <path
                      d="M-4.26325641e-14,1.42108547e-14 L85.3333333,1.42108547e-14 L85.3333333,341.333333 L-4.26325641e-14,341.333333 L-4.26325641e-14,1.42108547e-14 Z M149.333333,1.42108547e-14 L234.666667,1.42108547e-14 L234.666667,341.333333 L149.333333,341.333333 L149.333333,1.42108547e-14 Z M298.666667,1.42108547e-14 L384,1.42108547e-14 L384,341.333333 L298.666667,341.333333 L298.666667,1.42108547e-14 Z"
                      id="Combined-Shape"
                    >
                      {" "}
                    </path>{" "}
                  </g>{" "}
                </g>{" "}
              </g>
            </svg>
          </label>
        </Tooltip>
      </div>
    </div>
  );
};

export default TripleToggleSwitch;
