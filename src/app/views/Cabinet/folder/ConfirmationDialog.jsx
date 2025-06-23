import React, { useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import { Divider, IconButton } from "@material-ui/core";
import { Cancel } from "@material-ui/icons";
import { useSelector } from "react-redux";

const ConfirmationDialog = ({ open, handleClose, handleFileClose }) => {
  const { theme } = useSelector((state) => state);

  const handlePermanentlyClose = async (e) => {
    e.stopPropagation();
    handleFileClose();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        <span>CONFIRMATION</span>
        <IconButton
          id="create_file_dialog_close_button"
          aria-label="close"
          onClick={() => props.handleClose()}
          color="primary"
        >
          <Cancel
            style={{
              color: theme ? "#fff" : "#484747",
            }}
          />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <p>Are you sure you want to permanently close this file?</p>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button className="CreateButton" onClick={handlePermanentlyClose}>
          COMFIRM
        </Button>
        <Button className=" CabinetCancelButton" onClick={handleClose}>
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
