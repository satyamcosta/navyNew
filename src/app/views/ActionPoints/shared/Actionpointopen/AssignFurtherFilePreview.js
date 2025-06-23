import React, { useEffect, useState } from "react";
import {
  DialogActions,
  DialogContent,
  Tab,
  Tabs,
  Box,
  Grid,
  FormControl,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  Paper,
  Fab,
  AppBar,
} from "@material-ui/core";
import CancelIcon from "@material-ui/icons/Cancel";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import SplitViewPdfViewer from "app/views/inbox/shared/pdfViewer/pdfViewer";

function AssignFurtherFilePreview(props) {
  const { t } = useTranslation();
  const [URL, setURL] = useState("");
  const [enclosurePdfLoads, setEnclosurePdfLoads] = useState(false);
  const getFile = (fileName) => {
    fetch("/actionPoint/api/get-file", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        fileName: fileName,
      },
    })
      .then(async (response) => {
        try {
          if (response.error) {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
          }
          return response.blob();
        } catch (error) {
          callMessageOut(error.message);
        }
      })
      .then((blobData) => {
        setURL(blobData);
      })
      .catch((error) => {
        callMessageOut(error.message);
      });
  };
  useEffect(() => {
    getFile(props.selectedFilePreview.s3FileName);
  }, []);
  const previewhandleClose = () => {
    props.setOpenPreview(false);
  };
  return (
    <>
      <DialogTitle
        id="draggable-dialog-title"
        style={{ cursor: "move" }}
        className="send_dialog"
      >
        {props.selectedFilePreview.fileName}
        <Tooltip title={t("cancel")}>
          <IconButton
            id="FILE PREVIEW"
            aria-label="close"
            onClick={previewhandleClose}
            color="primary"
            className="cancel-drag"
          >
            <CancelIcon
              style={{
                color: props.theme ? "#fff" : "#484747",
              }}
            />
          </IconButton>
        </Tooltip>
      </DialogTitle>
      <DialogContent dividers>
        <div style={{ height: "100%" }}>
          <SplitViewPdfViewer
            extension={`${props.selectedFilePreview.fileName?.split(".")[1]}`}
            // extension="pdf"
            action
            fileUrl={URL}
            pdfLoads={(val) => {
              setEnclosurePdfLoads(val);
            }}
          />
        </div>
      </DialogContent>
    </>
  );
}
function mapStateToProps(state) {
  return {
    props: state.props,
  };
}

export default connect(mapStateToProps, {})(AssignFurtherFilePreview);
