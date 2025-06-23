import React, { useState } from "react";

import "../../index.css";
import { Grid } from "@material-ui/core";
import StatusUpdatedToAssigner from "./StatusUpdatedToAssigner";
import StatusUpdatedToMe from "./StatusUpdatedToMe";
import { useTranslation } from "react-i18next";

const Index = (props) => {
  let { rowData, viewDetails, getAllTaskData } = props;
  const { t } = useTranslation();
  const roleName = sessionStorage.getItem("role");

  const [cab, setCab] = useState(false);
  const [closefile, setClosefile] = useState(true);
  const [cabinet, setCabinet] = useState(true);

  const handleShow = () => {
    setCab(false);
    setCabinet(true);
    setClosefile(true);
  };

  const handleclose = () => {
    setClosefile(false);
    setCab(true);
    setCabinet(false);
  };

  const checktaskAssigner = rowData?.assignees?.includes(roleName);

  return (
    <div className="m-sm-30">
      <Grid container>
        <>
          <Grid
            style={{
              display: "grid",
              gridTemplateColumns: "  1fr 1.3rem",
            }}
          >
            <Grid item>
              {rowData.assigner === "Self" && checktaskAssigner && cabinet ? (
                <StatusUpdatedToAssigner
                  rowData={rowData}
                  viewDetails={viewDetails}
                />
              ) : rowData.assigner === "Self" && cabinet ? (
                <StatusUpdatedToMe
                  rowData={rowData}
                  getAllTaskData={getAllTaskData}
                />
              ) : rowData.assignees.length === 0 && cabinet ? (
                <StatusUpdatedToAssigner
                  rowData={rowData}
                  viewDetails={viewDetails}
                />
              ) : rowData.assignees.length > 0 && cabinet ? (
                <StatusUpdatedToAssigner
                  rowData={rowData}
                  viewDetails={viewDetails}
                />
              ) : (
                <StatusUpdatedToMe
                  rowData={rowData}
                  getAllTaskData={getAllTaskData}
                />
              )}
            </Grid>

            <Grid item>
              <ul
                style={{
                  position: "sticky",
                  right: "16px",
                  padding: 0,
                }}
              >
                {rowData.assigner !== "Self" && rowData.assignees.length > 0 ? (
                  <>
                    <li
                      className={cab ? "hide" : "hide1"}
                      onClick={() => handleShow()}
                    >
                      Instruction
                    </li>
                    <li
                      className={cabinet ? "hide" : "hide1"}
                      onClick={() => handleclose()}
                    >
                      {t("status_to_me")}
                    </li>
                  </>
                ) : rowData.assigner === "Self" && !checktaskAssigner ? (
                  <li
                    className={!cabinet ? "hide" : "hide1"}
                    onClick={() => handleShow()}
                  >
                    {t("status_to_me")}
                  </li>
                ) : (
                  rowData.assigner !== "Self" &&
                  rowData.assignees.length === 0 && (
                    <li
                      className={cab ? "hide" : "hide1"}
                      onClick={() => handleShow()}
                    >
                      Instruction
                    </li>
                  )
                )}
              </ul>
            </Grid>
          </Grid>
        </>
      </Grid>
    </div>
  );
};

export default Index;
