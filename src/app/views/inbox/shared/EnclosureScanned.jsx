import React, { useState, useRef, useContext } from "react";
import FileUpload from "./fileUpload/file-upload.enclosure";
import { connect, useDispatch } from "react-redux";
// import {
//   scannedEnclosureFile,
//   // getFlagNumber,
//   scannedEnclosureFile,
// } from "../../../camunda_redux/redux/action";
import { setSnackbar } from "../../../camunda_redux/redux/ducks/snackbar";
import { useTranslation } from "react-i18next";
import UploadLoading from "app/views/utilities/UploadLoading";
// import { getFlagNumber } from "../../../camunda_redux/redux/action";
import {
  getFlagNumber,
  scannedEnclosureFile,
  uploadEnclosure,
} from "app/camunda_redux/redux/action/backend-rest/form-data";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  TextField,
} from "@material-ui/core";
import Draggable from "react-draggable";
import SaveIcon from "@material-ui/icons/Save";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@material-ui/icons/Close";
import Cookies from "js-cookie";
import { SplitViewContext } from "./SplitviewContainer/Worker";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={".cancel-drag"}>
      <Paper {...props} />
    </Draggable>
  );
}

function FileUploader(props) {
  const { t } = useTranslation();
  let cabinetpartcase = Cookies.get("cabinetpartcase");
  const dispatch = useDispatch();
  const role = sessionStorage.getItem("role");
  const { tabIndex } = useContext(SplitViewContext);
  let isInternal = tabIndex;

  const [newUserInfo, setNewUserInfo] = useState({
    attachedAnnexures: [],
  });
  const grp = sessionStorage.getItem("department");
  const partcaseID = sessionStorage.getItem("partcaseID");
  const [blnFlag, setBlnFlag] = useState(false);
  const [singleProgress, setSingleProgress] = useState(0);
  const [blnProgressBar, setblnProgressBar] = useState(false);
  const [totalFileSelected, setTotalFileSelected] = useState(0);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);
  const [file, setFile] = useState(null);
  const [currentEnclosure, setCurrentEnclosure] = useState(0);
  const [subject, setSubject] = useState("");
  const [FlagNumber, setFlagNumber] = useState(0);
  const [toFlagnumber, setToFlagNumber] = useState("");

  const handleClose = () => {
    setCurrentEnclosure(0);
    setOpen(false);
    setFiles([]);
    setFile(null);
    setSubject("");
    setBlnFlag(true);
  };

  const updateUploadedFiles = (files) => {
    setNewUserInfo({ ...newUserInfo, attachedAnnexures: files });
    handleSubmit(files);
  };

  const config = {
    onUploadProgress: (progressEvent) => {
      setSingleProgress(0);
      setblnProgressBar(true);
      const { loaded, total } = progressEvent;
      const percentage = Math.floor((loaded / total) * 100);
      setSingleProgress(percentage - 1);
    },
  };

  const handleSubmit = (event) => {
    let fileData = event;
    setFiles(fileData);
    setFile(fileData[0]);
    setSubject(fileData[0].name);
    setOpen(true);
    props
      .getFlagNumber(
        cabinetpartcase,
        isInternal === 0 ? true : isInternal === 1 ? false : ""
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            setFlagNumber(resp);
            setToFlagNumber(resp);
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const callMessageOut = (message) => {
    setblnProgressBar(false);
    dispatch(setSnackbar(true, "error", message));
  };

  const blnClearFileList = () => {
    if (blnFlag === true) {
      setBlnFlag(false);
      return true;
    }
    return false;
  };

  const handleNextEnclosure = () => {
    currentEnclosure + 1 !== files.length &&
      setCurrentEnclosure(currentEnclosure + 1);
    setFile(files[currentEnclosure + 1]);
    let value = currentEnclosure + 1 === files.length ? true : false;
    handleUploadEnclosure(subject, value);
    !value && setSubject(files[currentEnclosure + 1].name);
  };

  const handleUplaodAll = () => {
    let tempArr = [];
    for (let i = currentEnclosure; i < files.length; i++) {
      tempArr.push(files[i]);
    }
    handleUploadEnclosure(subject, true, tempArr);
  };

  const handleUploadEnclosure = (enclosureSubject, value, tempArr) => {
    // let data = enclosureSubject ? [file] : tempArr;
    // let formData = new FormData();
    // for (var x = 0; x < data.length; x++) {
    //   formData.append("file", data[x]);
    // }
    let data = tempArr || files; // Use tempArr if provided, otherwise use the selected files
    let formData = new FormData();

    // Loop through each file and append it to formData
    for (var x = 0; x < data.length; x++) {
      formData.append("file", data[x]);
    }

    setblnProgressBar(true);

    setTotalFileSelected(data.length);
    return props
      .scannedEnclosureFile(
        cabinetpartcase,
        formData,
        enclosureSubject,
        config,
        isInternal === 0 ? true : isInternal === 1 ? false : "",
        isInternal === 0 ? true : isInternal === 1 ? false : "",
        FlagNumber,
        toFlagnumber
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
          } else {
            props.handleAddEnclosure(resp.response.addedNoting);
            setblnProgressBar(false);
            setBlnFlag(true);
            dispatch(
              setSnackbar(true, "success", t("enclousre_has_been_inserted"))
            );
            if (value) {
              handleClose();
            }
          }
        } catch (e) {
          callMessageOut(e.message);
        }
      })
      .catch((e) => {
        callMessageOut(e.message);
      });
  };

  const handleToFlagNumberChange = (e) => {
    const value = e.target.value;
    if (parseInt(value) < parseInt(FlagNumber)) {
      setToFlagNumber(FlagNumber);
    } else {
      setToFlagNumber(value);
    }
  };

  const handleToFlagNumberKeyDown = (e) => {
    // Prevent typing when the typed value is less than fromFlagNumber
    if (parseInt(e.target.value + e.key) < parseInt(FlagNumber)) {
      e.preventDefault();
    }
  };

  return (
    <div>
      <form>
        <FileUpload
          accept="application/pdf"
          label="Attachment(s)"
          multiple
          totalFileSelected={totalFileSelected}
          blnProgressBar={blnProgressBar}
          updateFilesCb={updateUploadedFiles}
          blnFlag={blnFlag}
          setBlnFlag={(val) => setBlnFlag(val)}
          upload={props.upload}
          handleuploadCondition={props.handleuploadCondition}
          notingSigned={props.notingSigned || props.disabled}
        />
      </form>
      <Dialog
        open={open}
        onClose={(event, reason) => {
          if (reason === "escapeKeyDown") {
            handleClose();
          }
        }}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        {blnProgressBar && (
          <div className="fileUploder">
            <UploadLoading />
          </div>
        )}
        <DialogTitle
          style={{ cursor: "move" }}
          id="draggable-dialog-title"
          className="dialog_title"
        >
          {t("add_enclosure_subject")}
          <IconButton
            id="enclosure_subject_close_button"
            aria-label="close"
            onClick={handleClose}
            color="primary"
            className="cancel-drag"
          >
            <CloseIcon style={{ color: props.theme ? "#fff" : "#000" }} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid>
            <span
              style={{
                float: "right",
                border: "1px solid #ddd",
                padding: "1px 8px",
                borderRadius: "5px",
              }}
            >
              {currentEnclosure + 1}/{files.length}
            </span>
          </Grid>
          <Grid>
            <TextField
              label={t("enter_a_subject")}
              variant="outlined"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              fullWidth
              size="small"
              style={{ margin: "1rem 0" }}
              className={props.theme ? "darkTextField" : ""}
            />
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="From Flag Number"
                variant="outlined"
                value={FlagNumber}
                disabled
                onChange={(e) => setFlagNumber(e.target.value)}
                size="small"
                style={{ margin: "1rem 0" }}
                className={props.theme ? "darkTextField" : ""}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="To Flag Number"
                variant="outlined"
                type="number"
                value={toFlagnumber}
                onChange={handleToFlagNumberChange}
                onKeyDown={handleToFlagNumberKeyDown}
                size="small"
                style={{ margin: "1rem 0" }}
                className={props.theme ? "darkTextField" : ""}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            id="enclosure_save_button"
            variant="contained"
            color="primary"
            endIcon={<SaveIcon />}
            onClick={handleUplaodAll}
          >
            {t("save_all")}
          </Button>
          {/*
            <Button
            id="enclosure_done_skip_button"
            variant="contained"
            color="secondary"
            endIcon={
              currentEnclosure + 1 === files.length ? (
                <DoneIcon />
              ) : (
                <SkipNextIcon />
              )
            }
            onClick={handleNextEnclosure}
            disabled={subject === "" ? true : false}
          >
            {currentEnclosure + 1 === files.length ? t("save") : t("next")}
          </Button>
            */}
        </DialogActions>
      </Dialog>
    </div>
  );
}

function mapStateToProps(state) {
  return { props: state.props, theme: state.theme };
}

export default connect(mapStateToProps, {
  uploadEnclosure,
  scannedEnclosureFile,
  getFlagNumber,
})(FileUploader);
