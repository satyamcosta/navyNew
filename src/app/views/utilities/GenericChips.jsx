import React from "react";
import { Chip } from "@material-ui/core";
import "./GenericChip.css";
import _ from "lodash";

const GenericChip = ({ Filter, deleteChip }) => {
  const dateCombiner = (rangeObj) => {
    return Object.values(rangeObj).join(" - ");
  };

  return (
    <>
      <div
        className="GenHeadChip"
        style={{
          display: _.isEmpty(Filter) ? "none" : "initial",
        }}
      >
        {Object.entries(Filter).map(([property, value], index) => {
          return (
            <Chip
              key={index}
              label={`${property.split("|")[1]} : ${
                property.includes("range") ? dateCombiner(value) : value
              }`}
              onDelete={() => {
                deleteChip(property);
              }}
              style={{ marginLeft: "5px", marginBottom: "4px" }}
              size="small"
              variant="outlined"
            />
          );
        })}
      </div>
    </>
  );
};

export default GenericChip;
