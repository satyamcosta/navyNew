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

const Inbox1 = (props) => {
  const [personalid, setPersonalid] = useState("");
  const [isViewerClosed, setIsViewerClosed] = useState(false);

  const [annotId, setAnnotId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [pdfLoads, setPdfLoads] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [isPending, setIsPending] = useState(false);
  const { t } = useTranslation();
  const { theme } = useSelector((state) => state);

  const isMr = sessionStorage.getItem("isMr") == "true"

  const handlePending = (val) => {
    setIsPending(val);
  };

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

  return (
    <>
      {isLoading && <Loading />}
      <div style={{ padding: "1px 0", margin: "2px 10px 0px 10px" }}>
        <div>
          <Grid container justifyContent="center">
            <Grid item xs={4}>
              <Breadcrumb />
            </Grid>
            <Grid item xs={8}></Grid>
          </Grid>
        </div>

        {/* content for splutter component */}
        {/* <div id="left-pane-content" style={{ display: "none" }}>
          <div className="content">
            <div
              style={{
                // width: width <= 750 ? "100%" : "67%",
                borderRadius: "8px",
              }}
            >
              <InboxTable
                isViewerClosed={isViewerClosed}
                setIsViewerClosed={setIsViewerClosed}
                pdfLoadsInbox={pdfLoads}
                personalId={personalID}
                annotationId={hanldeAnnotId}
                blnShowPdf={handleShowPdf}
                handleLoading={handleLoading}
              />
            </div>
          </div>
        </div> */}
        {/* content for splitter component */}
        {/* <div id="right-pane-content" style={{ display: "none" }}>
          <div className="content">
            <div
              style={{
                // width: width <= 750 ? "100%" : "33%",
                height: "calc(100vh - 76px)",
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
        </div> */}

        <div
          style={{
            // boxShadow:
            //   "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            borderRadius: "10px",
            marginTop: "-6px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "end"
            }}
          >
            <div
              className={`mrt-head ${isPending ? "un-active" : ""}`}
              onClick={() => handlePending(false)}
            >
              <span>{t("inbox")}</span>
            </div>
            {
              !isMr && <div
                className={`mrt-head ${isPending ? "" : "un-active"}`}
                onClick={() => handlePending(true)}
              >
                <span>{t("pending_inbox")}</span>
              </div>
            }
          </div>
          <SplitterComponent
            // className="bar-visible"
            // separatorSize={5}
            id="expand-collapse"
            orientation={width <= 750 ? "Vertical" : "Horizontal"}
            style={{
              boxShadow: "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
            }}
          >
            <div
              style={{
                width: width <= 750 ? "100%" : "60%",
                borderRadius: "8px",
                height: "calc(100vh - 76px)",
              }}
            >
              <InboxTable
                isViewerClosed={isViewerClosed}
                setIsViewerClosed={setIsViewerClosed}
                pdfLoadsInbox={pdfLoads}
                personalId={personalID}
                annotationId={hanldeAnnotId}
                blnShowPdf={handleShowPdf}
                handleLoading={handleLoading}
                isPending={isPending}
                handlePending={handlePending}
              />
            </div>
            <div
              style={{
                width: width <= 750 ? "100%" : "40%",
                height: "calc(100vh - 76px)",
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
