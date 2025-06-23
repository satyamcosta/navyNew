import { Button, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { FormField, UploadFileBtn } from "./file-upload.styles";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { IconButton } from "@mui/material";

const KILO_BYTES_PER_BYTE = 10000000000000000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 15728640; // this byte is equivalent to 15 mb

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToMB = (bytes) => Math.round(bytes / 1024 ** 2);

const useStyles = makeStyles((theme) => ({
  highlighteduploadButton: {
    minWidth: "16px",
    padding: "10px 12px",
    color: "black",
    maxHeight: "50px",
    minHeight: "50px",
    minWidth: "50px",
    maxWidth: "50px",
    marginTop: 6,
    marginLeft: 4,
  },
}));

const FileUpload = ({
  label,
  updateFilesCb,
  totalFileSelected,
  blnProgressBar,
  upload,
  handleUploadNtg,
  blnDisableForward,
  isDraft,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  ...otherProps
}) => {
  const fileInputField = useRef(null);
  const [files, setFiles] = useState({});
  const classes = useStyles();

  const handleUploadBtnClick = () => {
    fileInputField.current.click();
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      // if (convertBytesToMB(file?.size) >= 15) {
      //   alert(
      //     "Please Make Sure The Size Of File Should Not Be More Than 15 mb"
      //   );
      //   clearFileList();
      //   otherProps?.setBlnFlag(false);
      //   return "Invalid";
      // }
      if (file.type === "application/pdf") {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      } else {
        alert(
          "Please Select A Valid PDF File"
        );
        return "Invalid";
      }
    }
    return { ...files };
  };
  useEffect(() => {
    let blnFlag = otherProps.blnFlag;

    if (blnFlag === true) {
      clearFileList();
      otherProps?.setBlnFlag(false);
    }
  }, [otherProps.blnFlag]);

  const clearFileList = () => {
    setFiles({});
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = convertNestedObjectToArray(files);
    updateFilesCb(filesAsArray);
  };

  const handleNewFileUpload = (e) => {
    clearFileList();
    const { files: newFiles } = e.target;
    console.log(newFiles[0])
    if (newFiles.length) {
      let updatedFiles = addNewFiles(newFiles);
      if (updatedFiles != "Invalid") {
        setFiles(updatedFiles);
        callUpdateFilesCb(updatedFiles);
      }
    }
  };

  return (
    <>
      {/* <UploadFileBtn type="button" onClick={handleUploadBtnClick}>
        <i className="fas fa-file-upload" />
      </UploadFileBtn> */}
      {/* <Button
        id="inboxUpload_button"
        onClick={handleUploadBtnClick}
        color="primary"
        variant="contained"
        style={{ minWidth: "16px", padding: "10px 12px" }}
        disabled={blnDisableForward === true}
      >
        <CloudUploadIcon style={{ fontSize: "1rem" }} />
      </Button> */}

      <IconButton
        onClick={handleUploadBtnClick}
        size="small"
        disabled={blnDisableForward === true}
        className={classes.highlighteduploadButton}
      >
        <CloudUploadIcon style={{ fontSize: "1rem" }} />
      </IconButton>

      <FormField
        type="file"
        ref={fileInputField}
        onChange={handleNewFileUpload}
        title=""
        value=""
        {...otherProps}
      />
    </>
  );
};

export default FileUpload;
