import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  getMailRoomData,
  sendFromMailRoom,
  downloadMailRoom,
  changeMailRoomStatus,
} from "../../../camunda_redux/redux/action";
import { connect, useDispatch } from "react-redux";
import { Done, Undo, Send, GetApp } from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import Axios from "axios";
import { saveAs } from "file-saver";
import { Loading } from "../therme-source/material-ui/loading";
import { handleError } from "utils";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";

const MailRoom = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data, handleClose } = props;
  const role = sessionStorage.getItem("role");
  const userName = localStorage.getItem("username");
  const department = sessionStorage.getItem("department");

  const [mailRoomObj, setmailRoomObj] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.id) {
      setLoading(true);
      props
        .getMailRoomData(role, userName, department, data.id)
        .then((resp) => {
          try {
            if (resp.error) {
              let errMsg = handleError(resp.error, true);
              callMessageOut(errMsg);
            } else {
              let toDept = "";
              resp?.to?.forEach((item) => {
                if (resp.to.length > 0) {
                  toDept += item?.deptDisplayName + " ";
                } else {
                  toDept = item?.deptDisplayName;
                }
              });
              setmailRoomObj({
                ...resp,
                toDept,
              });
              setLoading(false);
            }
          } catch (error) {
            callMessageOut(error.message);
          }
        });
    }
  }, [data]);

  const handleSend = () => {
    setLoading(true);
    props.sendFromMailRoom(role, userName, department, data.id).then((resp) => {
      try {
        if (resp.error) {
          let errMsg = handleError(resp.error, true);
          callMessageOut(errMsg);
        } else {
          setLoading(false);
          handleClose();
        }
      } catch (error) {
        callMessageOut(error.message);
      }
    });
  };

  const handleSendstatus = () => {
    setLoading(true);
    props
      .changeMailRoomStatus(data.id, role, userName, department)
      .then((resp) => {
        try {
          if (resp.error) {
            let errMsg = handleError(resp.error, true);
            callMessageOut(errMsg);
          } else {
            setLoading(false);
            handleClose();
          }
        } catch (error) {
          callMessageOut(error.message);
        }
      });
  };

  const handleDownload = async (id) => {
    try {
      setLoading(true);
      const res = await Axios.get(
        `/correspondence_service/api/v2/downloadFromMailroom/${id}`,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",

            Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
            sessionId: sessionStorage.getItem("sessionId"),
            roleName: role,
            userName,
            department,
            address: sessionStorage.getItem("ipAddress"),
          },
          responseType: "arraybuffer",
        }
      );

      if (res.data?.error || res.data?.httpStatus === "INTERNAL_SERVER_ERROR") {
        setLoading(false);
      } else if (res.data) {
        let blob = new Blob([res.data], {
          type: "application/octet-stream",
        });
        saveAs(blob, "Outbox Data.zip");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error occurred during file download:", error);
      callMessageOut(error.message);
      setLoading(false);
    }
  };

  const handleDownloadFile = async (id) => {
    try {
      setLoading(true);
      const res = await Axios.get(`/file_service/api/downloadFile/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",

          Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
          sessionId: sessionStorage.getItem("sessionId"),
          roleName: role,
          userName,
          department,
          address: sessionStorage.getItem("ipAddress"),
        },
        responseType: "arraybuffer",
      });

      if (res.data?.error || res.data?.httpStatus === "INTERNAL_SERVER_ERROR") {
        setLoading(false);
        callMessageOut(res.data?.error || res.data?.httpStatus);
      } else if (res.data) {
        let blob = new Blob([res.data], {
          type: "application/octet-stream",
        });
        saveAs(blob, "Outbox Data.zip");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error occurred during file download:", error);
      callMessageOut(error.message);
      setLoading(false);
    }
  };

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  const callMessageOutSuccess = (message) => {
    // setLoading(false);
    return dispatch(setSnackbar(true, "success", message));
  };

  return (
    <>
      {loading && <Loading />}
      <DialogContent dividers>
        {mailRoomObj?.imageDataString && (
          <div className="flex flex-middle mr-dialog-heading">
            <span>BARCODE</span> &nbsp;
            <span>            <img src={`data:image/png;base64,${mailRoomObj.imageDataString}`} alt="barcode" /></span>          </div>
        )}
        <div className="mr-dialog-heading"><span>SUBJECT</span>  {mailRoomObj?.subject}</div>
        <div className="mr-dialog-heading"><span>DAK NO</span>  {mailRoomObj?.refId}</div>
        <div className="mr-dialog-heading"><span>TYPE</span>  {mailRoomObj?.type}</div>
        <div className="mr-dialog-heading"><span>DATE SENT</span>  {mailRoomObj?.dateSent}</div>
        {/* <div>TO DEPARTMENT : {mailRoomObj?.to[0]?.deptDisplayName}</div> */}
        <div className="mr-dialog-heading"><span>TO DEPARTMENT</span> {mailRoomObj?.toDept}</div>
        <div className="mr-dialog-heading"><span>EXTERNAL ADDRESSES</span>  {mailRoomObj?.externalAddresse}</div>
        <div className="mr-dialog-heading"><span>INSTRUCTION</span>  {mailRoomObj?.instruction}</div>
      </DialogContent>
      <DialogActions>
        <Button
          id="PA_fileForm_reset"
          color="primary"
          variant="contained"
          style={{ marginLeft: "1rem" }}
          onClick={() =>
            data.type === "File"
              ? handleDownloadFile(mailRoomObj?.corrDocId)
              : handleDownload(mailRoomObj?.corrDocId)
          }
          endIcon={<GetApp />}
          disabled={!mailRoomObj}
        >
          {t("download")}
        </Button>

        {data.type === "File" && (
          <Button
            id="personalFile_update"
            color="secondary"
            variant="contained"
            type="submit"
            style={{ marginLeft: "1rem" }}
            endIcon={<Send />}
            onClick={() =>
              data.type === "File" ? handleSendstatus() : handleSend()
            }
            disabled={!mailRoomObj}
          >
            {t("send")}
          </Button>
        )}
      </DialogActions>

      {/* <Dialog>
        <DialogTitle></DialogTitle>
        <DialogContent>hello</DialogContent>
      </Dialog> */}
    </>
  );
};

function mapStateToProps(state) {
  return {
    props: state.props,
    subscribeApi: state.subscribeApi,
    theme: state.theme,
    openDraftPa: state.openDraftPa,
  };
}
export default connect(mapStateToProps, {
  getMailRoomData,
  sendFromMailRoom,
  downloadMailRoom,
  changeMailRoomStatus,
})(MailRoom);
