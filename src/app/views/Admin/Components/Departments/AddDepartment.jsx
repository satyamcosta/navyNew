import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
} from "@material-ui/core";
import Draggables from "react-draggable";
import CancelIcon from "@material-ui/icons/Cancel";
import { useTranslation } from "react-i18next";

const PaperComponent = (props) => {
  return (
    <Draggables handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggables>
  );
};

const AddDepartment = ({ openDialog, closeDialog }) => {
  const { t } = useTranslation();

  return (
    <>
      <Dialog
        open={openDialog}
        onClose={() => {
          closeDialog(false);
        }}
        aria-labelledby="draggable-dialog-title"
        PaperComponent={PaperComponent}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          id="draggable-dialog-title"
          style={{ padding: "0px 24px !important", cursor: "move" }}
        >
          <div className="flex1">
            {t("Add New Role")}
            <IconButton
              id="newRole_Button"
              aria-label="close"
              onClick={() => {
                closeDialog(false);
              }}
              color="primary"
              style={{
                float: "right",
                cursor: "pointer",
                position: "relative",
                top: "-9px",
              }}
              className="cancel-drag"
            >
              <CancelIcon style={{ color: "#484747" }} />
            </IconButton>
          </div>
        </DialogTitle>
        <DialogContent dividers pt={0}>
          <h1>Hello</h1>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddDepartment;
