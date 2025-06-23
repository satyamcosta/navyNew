import { Button, makeStyles } from "@material-ui/core";
import React, { useEffect, useRef, useState } from "react";
import { FormField, UploadFileBtn } from "./file-upload.styles";
import PublishIcon from "@material-ui/icons/Publish";
import PublishOutlinedIcon from "@material-ui/icons/PublishOutlined";
import { IconButton } from "@mui/material";

const KILO_BYTES_PER_BYTE = 10000000000000000;
const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 15728640; // this byte is equivalent to 15 mb

const convertNestedObjectToArray = (nestedObj) =>
  Object.keys(nestedObj).map((key) => nestedObj[key]);

const convertBytesToMB = (bytes) => Math.round(bytes / 1024 ** 2);

const useStyles = makeStyles((theme) => ({
  highlighteduploadButton: {
    marginTop: 7,
    marginLeft: 4,
    // backgroundColor: "#484747"
    // height: "1px",
    boxShadow:
      "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
    "&:hover": {
      //   backgroundColor: "rgba(89, 82, 82, 0.15)",
      boxShadow:
        "rgba(14, 30, 37, 0.12) 2px 7px 10px 3px, rgba(14, 30, 37, 0.42) 0px 2px 16px 4px",
      //   color: "#000",
      fontWeight: "bold",
      zIndex: "1",
      transform: "scale(1.05)",
    },
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
      console.log(file.type)
      if (
        // file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        if (!otherProps.multiple) {
          return { file };
        }
        files[file.name] = file;
      } else {
        alert("Please Select Valid DOCX File");
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
    console.log(newFiles[0]);
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
      <Button
        id="inboxUpload_button"
        onClick={handleUploadBtnClick}
        color="primary"
        variant="contained"
        className={classes.highlighteduploadButton}
        style={{
          minWidth: "16px",
          padding: "8px 10px",
        }}
        disabled={blnDisableForward}
      >
        <PublishIcon style={{ fontSize: "1rem" }} />
      </Button>
      {/* <IconButton
        onClick={handleUploadBtnClick}
        size="small"
        disabled={blnDisableForward === true}
        className={classes.nonhighlighteduploadButton}
      >
        <PublishIcon style={{ fontSize: "1rem" }} />
      </IconButton> */}
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
