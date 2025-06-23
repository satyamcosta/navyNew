import React, { useCallback, useEffect, useState } from "react";
import { Grid, IconButton } from "@material-ui/core";
import { Breadcrumb } from "../../../matx";
import {
  PaneDirective,
  PanesDirective,
  SplitterComponent,
} from "@syncfusion/ej2-react-layouts";
import InboxTable from "./shared/InboxTable";
import PdfViewer from "../../pdfViewer/pdfViewer";
import { Loading } from "./therme-source/material-ui/loading";
import { connect } from "react-redux";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import "./therme-source/material-ui/loading.css";
import WaitingInbox from "./shared/WaitingInbox";

const Inbox1 = (props) => {
  const [personalid, setPersonalid] = useState("");
  const [annotId, setAnnotId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);
  const personalID = (id) => {
    setPersonalid(id);
  };

  const hanldeAnnotId = (val) => {
    setAnnotId(val);
  };

  const handleShowPdf = (val) => {
    setShowPdf(val);
  };

  const handleLoading = (val) => {
    setIsLoading(val);
  };

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const firstPaneContent = useCallback(() => {
    return (
      <div className="content">
        <div
          style={{
            // width: width <= 750 ? "100%" : "67%",
            borderRadius: "8px",
          }}
        >
          <WaitingInbox
            pdfLoadsInbox={pdfLoads}
            personalId={personalID}
            annotationId={hanldeAnnotId}
            blnShowPdf={handleShowPdf}
            handleLoading={handleLoading}
          />
        </div>
      </div>
    );
  }, []);

  const secondPaneContent = useCallback(() => {
    return (
      <div className="content">
        <div
          style={{
            // width: width <= 750 ? "100%" : "33%",
            height: "calc(100vh - 100px)",
          }}
          className="ss-privacy-hide"
        >
          <PdfViewer
            personalID={personalid}
            anottId={annotId}
            flag={"PA"}
            pdfLoads={(val) => {
              setPdfLoads(val);
            }}
            editable={false}
          />
        </div>
      </div>
    );
  }, []);
  return (
    <>
      {isLoading && <Loading />}
      <div style={{ padding: "8px" }}>
        {/* <div>
          <Grid container justifyContent="center" spacing={2}>
            <Grid item xs={4}>
              <Breadcrumb
                routeSegments={[
                  { name: t("waitinginbox"), path: "/inbox/file" },
                ]}
              />
            </Grid>
            <Grid item xs={8}></Grid>
          </Grid>
        </div> */}
        <div
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            borderRadius: "10px",
            // marginTop: "-13px",
          }}
        >
          <SplitterComponent
            // className="bar-visible"
            // separatorSize={5}
            id="expand-collapse"
            orientation={width <= 750 ? "Vertical" : "Horizontal"}
          >
            <PanesDirective>
              <PaneDirective
                resizable
                size="100%"
                content={firstPaneContent}
                collapsible={true}
              />
              {/* <PaneDirective
                size="30%"
                resizable
                content={secondPaneContent}
                collapsible={true}
              /> */}
            </PanesDirective>
          </SplitterComponent>
        </div>
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  theme: state.theme,
});

export default connect(mapStateToProps)(Inbox1);
