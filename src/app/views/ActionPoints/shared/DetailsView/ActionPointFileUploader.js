import React, { useState, useRef } from "react";
import FileUpload from "./Uploader";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { connect, useDispatch } from "react-redux";
import {
  filesUpload,
  viewDetail,
  uploadEnclosures,
} from "app/camunda_redux/redux/action";
import UploadLoading from "app/views/utilities/UploadLoading";
import { handleError } from "utils";

function ActionUploader(props) {
  const dispatch = useDispatch();

  const [newUserInfo, setNewUserInfo] = useState({
    attachedAnnexures: [],
  });

  const deptName = sessionStorage.getItem("department");
  const role = sessionStorage.getItem("role");
  const [blnProgressBar, setblnProgressBar] = useState(false);
  const [totalFileSelected, setTotalFileSelected] = useState(0);

  const updateUploadedFiles = (files) => {
    setNewUserInfo({ ...newUserInfo, attachedAnnexures: files });
    handleSubmit(files);
  };

  const handleSubmit = (event) => {
    let formData = new FormData();
    let fileData = event;
    for (var x = 0; x < fileData.length; x++) {
      formData.append("files", fileData[x]);
    }
    setTotalFileSelected(fileData.length);
    return props
      .uploadEnclosures(props?.viewDetails?.id, formData, deptName, role)
      .then((resp) => {
        try {
          if (!resp.error) {
            props.newFileData(resp.response);
            console.log(33,resp.response)
          } else {
            let errMsg = handleError(resp.error);
            callMessageOut(errMsg);
          }
        } catch (e) {
          callMessageOut(e.error);
        }
      })
      .catch((e) => {
        callMessageOut(e.error);
      });
  };

  const callMessageOut = (message) => {
    dispatch(setSnackbar(true, "error", message));
  };

  return (
    <div>
      {blnProgressBar && <UploadLoading />}
      <form>
        <FileUpload
          accept="application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/pdf,
                     application/vnd.openxmlformats-officedocument.presentationml.presentation,image/png,image/jpeg,
                     application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          label="Attachment(s)"
          multiple
          totalFileSelected={totalFileSelected}
          blnProgressBar={blnProgressBar}
          updateFilesCb={updateUploadedFiles}
          viewDetails={props.viewDetails}
        />
      </form>
    </div>
  );
}
function mapStateToProps(state) {
  return { props: state.props };
}

export default connect(mapStateToProps, {
  filesUpload,
  viewDetail,
  uploadEnclosures,
})(ActionUploader);
