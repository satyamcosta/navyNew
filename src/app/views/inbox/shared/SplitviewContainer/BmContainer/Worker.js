import Cookies from "js-cookie";
import React from "react";
import {
  loadPartCaseData,
  loadInboxDataSplitView,
  fetchSplitViewTags,
  loadRtiPartCaseData,
  loadRtiDataSplitView,
  fetchSplitViewTagsRti,
  getcabinetpartcase,
  loadOutboxRow,
  getLinkedFiles,
} from "../../../../../camunda_redux/redux/action";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useEffect } from "react";
import { SplitViewContext } from "../Worker";
import { useContext } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { setPassData } from "app/camunda_redux/redux/ducks/passData";
import { getMailRoomFile } from "app/camunda_redux/redux/action/backend-rest/initiate-data";
import { handleError } from "utils";
import { handleNotification } from "../../../../../camunda_redux/redux/ducks/NotificationHandler";

export const BmContext = React.createContext();

const BmProvider = (props) => {
  let isDraft = Cookies.get("isDraft") === "true";
  let partCase = Cookies.get("partCase") == "true";
  let isRti = Cookies.get("isRti");
  const isCabinet = Cookies.get("isCabinet") == "true";
  const isOutbox = Cookies.get("isOutbox") == "true";

  const department = sessionStorage.getItem("parent-dir") || sessionStorage.getItem("department");
  const roleName = sessionStorage.getItem("role");
  const username = localStorage.getItem("username");
  const isIndex = Cookies.get("isIndex") === "true";
  const WaitingRoom = Cookies.get("WaitingRoom");
  const cabinetStatus = Cookies.get("cabinetStatus");
  let cabinetpartcase = Cookies.get("cabinetpartcase");

  const value = BmGetterAndSetter();
  const { setLoading, handleRoute, setPendingRoute,
    setCompletedRoute } = useContext(SplitViewContext);
  const { isBM } = props;

  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    if (isRti === "true") {
      loadRtiData();
    } else {
      loadSplitViewData();
    }
  }, [cabinetpartcase, props.isLF, value.currentPage, value.pageSize]);

  useEffect(() => {
    if (value.linkF) {
      getPcData();
    }
  }, [value.linkF]);

  useEffect(() => {
    let temArr = [];
    if (value.enclosureData.length !== 0) {
      value.enclosureData.map((item, i) => {
        temArr.push({
          ...item,
          serialNo: i,
          subject: item.subject ? item.subject : item.fileName,
        });
      });

      // Now enclosure is also read only in cabinet or outbox view
      // if (!isDraft) {
      //   value.setEnclosureSigned(true);
      // } else {
      if (value.enclosureData.length > 0) {
        value.setEnclosureSigned(value.enclosureData[0].isSigned);
      }
      // }
      // value.setCoverLetter(value.enclosureData[0].coverNote);
    }

    value.setEnclosureArr(temArr);
    if (temArr.length !== 0) {
      value.setURL(temArr[0].fileUrl);
      value.setNOF1(temArr[0]);
      // setFlagNumber(temArr[0].flagNumber);
      value.setPrevFlagNumberEnclouser(temArr[0].flagNumber);
      value.setRtifilename(temArr[0].fileName);
      value.setPrevEnclouser(temArr[0].fileUrl);
    }

    if (value.dakList.length !== 0) {
      if (isIndex) {
        value.setEnclosureSigned(true);
        // value.setCoverLetter(false);
        value.setURL(value.dakList[0]?.fileUrl);
      }
    }
  }, [value.enclosureData, value.dakList]);

  useEffect(() => {
    if (value.enclosurePdfLoads === true && value.URL !== undefined && (!value.coverLetter || value.enclosureSigned)) {
      console.log(value.URL, value.extension)
      let data = { extension: value.extension, url: value.URL };
      dispatch(setPassData(data));
    }
  }, [
    value.enclosurePdfLoads,
    value.URL,
    value.enclosureSigned,
    value.enclosureAnnoiD,
    value.coverLetter
  ]);

  useEffect(() => {
    if (!value.blnHideSyncfusion && value.openInPdf) {
      value.setpdfLoads(false);
    }
  }, [value.blnHideSyncfusion, value.openInPdf]);

  // useEffect(() => {
  //   if (value.enclosurePdfLoads === true && value.URL !== undefined) {
  //     let data = { extension: value.extension, url: value.URL };
  //     dispatch(setPassData(data));
  //   }
  // }, [alignment]);

  const handleIsEdit = (status, x, sign, filestatus) => {
    // Now noting is read only in cabinet or outbox view
    // if (isCabinet || isOutbox || partCase) {
    // if (!isDraft) {
    //   return false;
    // } else
    if (isRti === true) {
      if (x === 0 && status === "Internal") {
        return true;
      } else {
        return false;
      }
    } else if (isCabinet || isOutbox) {
      return false;
    } else {
      if (
        x === 0 &&
        status === "Internal" &&
        sign === false &&
        filestatus === "D"
      ) {
        // changed to open the file in docx
        return true;
      } else {
        return false;
      }
    }
  };

  const loadSplitViewData = () => {
    setLoading(true);
    Cookies.set("HrmRole", null);
    const outboxId = Cookies.get("outboxId");
    const inboxId = sessionStorage.getItem("InboxID");

    // here if come inside this if() it means from outbox i come to spitview
    if (isOutbox) {
      props
        .loadOutboxRow(outboxId, isBM)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
              return;
            } else {
              value.setPartCaseId(resp.response?.Data?.id);
              if (props.isLF) {
                value.setisLf(true);
                loadLinkedFile(resp.response?.Data?.id);
              } else {
                loadData(resp.response.Data);
              }
            }
          } catch (error) {
            callMessageOut(error.message);
            setLoading(false);
          }
        })
        .catch((err) => {
          callMessageOut(err.message);
          setLoading(false);
        });
    } else if (props.isLF) {
      value.setisLf(true);
      loadLinkedFile();
    }

    // here if come inside this if() , it means from cabinet i come to splitview and as in cabinet row data i have partcase id present as well so it can be used to fetch the latest yellow note and remarks as well
    else if (partCase || WaitingRoom) {
      loadPartCaseIdData(inboxId);
      value.setPartCaseId(cabinetpartcase);
    } else {
      props.loadInboxDataSplitView(inboxId, username).then((resp) => {
        try {
          if (resp.error) {
            console.log(resp.error)
            callMessageOut(resp.error);
            setLoading(false);
            value.setIsError(resp.error)
            return;
          }
          if (resp.Data.partCaseId) {
            loadPartCaseIdData(resp.Data.partCaseId);
            value.setPartCaseId(resp.Data.partCaseId);
            setCompletedRoute(resp.Data.completedRoute)
            setPendingRoute(resp.Data.pendingRoute)
            // handleRoute(resp.Data.route);
            let deptArr = department.split("-");
            if (!resp.Data.pendingRoute?.length && !resp.Data.completedRoute?.length) {
              handleRoute(resp.Data.route?.length ? resp.Data.route?.concat(deptArr?.length > 1 ? deptArr[deptArr.length - 1]?.toUpperCase() : deptArr[0]?.toUpperCase()) : JSON.parse(sessionStorage.getItem("route")));
            }
          } else {
            setLoading(false);
          }
        } catch (error) {
          callMessageOut(error.message);
          setLoading(false);
        }
      });
    }
  };

  const loadLinkedFile = (id) => {
    props
      .getLinkedFiles(cabinetpartcase || id, value.currentPage, value.pageSize)
      .then((res) => {
        let tmpArr = [];

        try {
          if (res.error) {
            if (res?.error?.includes("aborted")) {
              return;
            }
            let errMsg = handleError(res.error);
            callMessageOut(errMsg);
            setLoading(false);
          } else {
            value.setLinkfiles(res?.data);
            value.setLinkF(res?.data[0]);
            value.settotalLF(res?.totalElements);
            setLoading(false);
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      })
      .catch((e) => {
        console.log(e);
        let errMsg = handleError(e.message);
        callMessageOut(errMsg);
        setLoading(false);
      });
  };

  const loadPartCaseIdData = (val) => {
    sessionStorage.setItem("partcaseID", val);
    let formData = new FormData();
    formData.append("id", val);
    if (partCase) {
      props
        .getcabinetpartcase(department, cabinetpartcase, isBM)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
              return;
            } else {
              loadData(resp);
            }
          } catch (e) {
            callMessageOut(e.message);
            setLoading(false);
          }
        });
    } else if (WaitingRoom) {
      props.getMailRoomFile(cabinetpartcase).then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
            return;
          } else {
            loadData(resp.response);
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      });
    } else {
      props
        .loadPartCaseData(formData, department, roleName, username, isBM)
        .then((resp) => {
          try {
            if (resp.error) {
              callMessageOut(resp.error);
              setLoading(false);
              return;
            } else {
              loadData(resp.data);
            }
          } catch (e) {
            callMessageOut(e.message);
            setLoading(false);
          }
        });
    }
  };

  const getPcData = () => {
    setLoading(true);
    sessionStorage.setItem("partcaseID", value.linkF?.id);
    let formData = new FormData();
    formData.append("id", value.linkF?.id);
    props
      .loadPartCaseData(
        formData,
        department,
        roleName,
        username,
        props.isLF || isBM
      )
      .then((resp) => {
        try {
          if (resp.error) {
            callMessageOut(resp.error);
            setLoading(false);
            return;
          } else {
            loadData(resp.data);
          }
        } catch (e) {
          callMessageOut(e.message);
          setLoading(false);
        }
      });
  };

  const loadRtiData = () => {
    Cookies.set("HrmRole", null);
    setLoading(true);
    const rtiID = sessionStorage.getItem("rtiID");
    const partcase = Cookies.get("partcaseId");
    if (partcase) {
      loadRtiPartCaseIdData(partcase);
    } else {
      props.loadRtiDataSplitView(partcase).then((resp) => {
        if (resp.Data.partcaseId) {
          loadRtiPartCaseIdData(resp.Data.partcaseId);
        }
      });
    }
  };

  const loadRtiPartCaseIdData = (val) => {
    value.setPartCaseId(val);
    sessionStorage.setItem("partcaseID", val);
    let formData = new FormData();
    formData.append("id", val);
    props.loadRtiPartCaseData(formData).then((resp) => {
      // if (resp != undefined) {
      //   loadData(resp.partcase.data);
      // }
      try {
        loadData(resp.data);
      } catch (e) {
        callMessageOut(e.message);
      }
    });
  };

  const loadData = (resp, val) => {
    Cookies.set("mainFile", resp?.mainFile);
    value.setMainFile(resp?.mainFile);
    value.setDocId(resp?.objId);
    value.setEnclosureLen(resp?.enclosureList?.length);
    value.setNotinglen(resp?.notingList?.length);
    value.setDaklen(resp?.dakList?.length);
    value.settotalFlags(resp?.maxFlagNumber);
    value.setNtgUploader(resp?.notingList[0]?.uploader);
    value.setNtgStatus(resp?.notingList[0]?.status);
    value.setFilestatus(resp?.notingList[0]?.fileStatus);
    value.setCreator(resp?.createrRole);

    value.setBarCode({
      subject: resp?.subject,
      createdOn: Cookies.get("date"),
      section: resp?.subSection,
      creatorDepartment: resp?.department,
      file: Cookies.get("referenceNumber"),
      imageDataString: sessionStorage.getItem("barcode"),
    });

    let NotingUrl;
    let CLetter = value.coverLetter;
    let enclouserTmpArr = [];
    let flagNoTmpArr = [];

    let dakList = [];
    for (let i = 0; i < resp?.dakList?.length; i++) {
      for (let j = 0; j < resp?.dakList[i]?.dakList?.length; j++) {
        dakList.push(resp?.dakList[i]?.dakList[j]);
      }
    }

    if (!value.coverLetter) {
      resp.enclosureList.map((item) => {
        if (item.coverNote === true) CLetter = true;
      });
    }
    for (let x = 0; x < resp.enclosureList.length; x++) {
      // if (resp.enclosureList[x].coverNote === true) {
      //   enclouserTmpArr.unshift({
      //     ...resp.enclosureList[x],
      //   });
      //   flagNoTmpArr.unshift(resp.enclosureList[x].flagNumber);
      // }
      enclouserTmpArr.push({
        ...resp.enclosureList[x],
      });
      flagNoTmpArr.push(resp.enclosureList[x].flagNumber);
    }

    let notngTmpArr = [];
    // resp.notingList.reverse().map((item, x) =>
    //   notngTmpArr.push({
    //     ...item,
    //     serialNo: x,
    //     isEditable: handleIsEdit(item.status, x),
    //     blnDisable: x === 0 ? false : true,
    //   })
    // );
    resp.notingList.map((item, x) =>
      notngTmpArr.push({
        ...item,
        serialNo: x,
        isEditable: handleIsEdit(
          item.status,
          x,
          item.isSigned,
          item.fileStatus
        ),
        blnDisable: x === 0 ? false : true,
      })
    );
    // if (resp.notingList.length >= 0) {
    //   const firstItem = resp.notingList[0];
    //   notngTmpArr.push({
    //     ...firstItem,
    //     serialNo: 0, // Setting serialNo for the first item to 0
    //     isEditable: handleIsEdit(firstItem.status, 0), // Passing 0 as x for the first item
    //     blnDisable: false, // Assuming the first item is not disabled
    //   });
    // }
    if (notngTmpArr?.length > 0) {
      if (!notngTmpArr[0].isSigned && notngTmpArr[0].prevVersionId) {
        NotingUrl = notngTmpArr[0].fileUrl;
      } else {
        NotingUrl = notngTmpArr[0].fileUrl;
      }
    }

    unstable_batchedUpdates(() => {
      if (notngTmpArr?.length > 0) {
        value.setnotingDocId(notngTmpArr[0]?.fileId);
        value.setNotingStatustatus(notngTmpArr[0]?.justCreated);
        value.setNotingData(notngTmpArr);
        value.setNofAnnoId(notngTmpArr[0]?.annotationId);
        value.setNotingSigned(notngTmpArr[0]?.isSigned);
        value.setPrevFlagNumberNF(notngTmpArr[0]?.flagNumber);
        value.setNotingFlag(notngTmpArr[0]?.flagNumber);
        value.setNotingURL(NotingUrl);
        value.setNOF(JSON.stringify(notngTmpArr[0]));
        let extension = "docx";
        // let arr = notngTmpArr[0].subject.split(".");
        // if (arr.length > 1) {
        //   extension = arr[arr.length - 1];
        // }
        // value.setExtension2(extension);

        if (notngTmpArr[0]?.subject?.includes("..pdf")) {
          let arr = notngTmpArr[0].subject.split(".");
          arr?.pop()
          arr?.pop()
          extension = arr.length > 1
            ? arr[arr.length - 1]
            : "docx";
        }
        else {
          let arr = notngTmpArr[0].subject.split(".");
          console.log(arr)
          extension = arr.length > 1
            ? arr[arr.length - 1]
            : "docx";
        }

        value.setExtension2(extension)

        if (
          notngTmpArr[0]?.isSigned === false &&
          notngTmpArr[0]?.prevVersionId.length === 0
        ) {
          value.setBlnHideSyncfusion(false);
        } else if (
          notngTmpArr[0]?.isSigned === false &&
          notngTmpArr[0]?.prevVersionId.length > 0
        ) {
          value.setBlnHideSyncfusion(true);
        } else if (
          notngTmpArr[0]?.isSigned === true &&
          notngTmpArr[0]?.prevVersionId.length > 0
        ) {
          value.setBlnHideSyncfusion(true);
        }

        if (extension == "pdf") {
          // value.setUpload(false);
          value.setBlnHideSyncfusion(true);
          // value.setNotingSigned(true);
        } else {
          value.setUpload(notngTmpArr[0]?.isSigned);
        }
        // changed to sign from signed as sign is coming from the backend
        value.setOpenInPdf(notngTmpArr[0]?.isEditable);
        value.setBlnDisable(notngTmpArr[0]?.blnDisable);
        value.setPrevVersionId(notngTmpArr[0]?.prevVersionId);
      }
      // value.setCoverLetter(CLetter);
      value.setStatus(resp.status);
      value.setHrmRole(resp.hrmRole);
      value.setHrmDepartmet(resp.department);
      value.setHasCoverNote(resp.hasCoverNote);
      value.setServiceLetterId(resp.serviceLetterId);
      value.setDepartmentList(resp.deptList);
      value.setExternalList(resp.externalList);
      value.setInternalList(resp.internalList);
      value.setExternalInList(resp.withinSectionList);

      value.setEnclosureData(enclouserTmpArr);
      value.setEnclosureAnnoiD(enclouserTmpArr[0]?.annotationId);

      // Handling case one first document is pdf
      if (enclouserTmpArr.length > 0) {
        let isDocx = false
        value.setenclosureDocId(enclouserTmpArr[0]?.fileId);
        value.setIsPdf(enclouserTmpArr[0].fileName.includes(".pdf"));
        value.setIsDocx(enclouserTmpArr[0].fileName.includes(".docx"));
        value.setIsDoc(enclouserTmpArr[0].fileName.includes(".doc"));

        if (enclouserTmpArr[0]?.fileName?.includes("..pdf")) {
          let arr = enclouserTmpArr[0].fileName.split(".");
          arr?.pop()
          arr?.pop()
          arr.length > 1
            ? value.setExtension(arr[arr.length - 1])
            : value.setExtension("docx");

          isDocx = arr[arr.length - 1] == "docx"
        }
        else {
          let arr = enclouserTmpArr[0].fileName.split(".");
          console.log(arr)
          arr.length > 1
            ? value.setExtension(arr[arr.length - 1])
            : value.setExtension("docx");

          isDocx = arr[arr.length - 1] == "docx"
        }
        if (enclouserTmpArr[0]?.status == "External") {
          value.setCoverLetter(false)
        }
        else {
          value.setCoverLetter(isDocx)
        }
      }


      if (dakList.length > 0) {
        value.setDakList(dakList);
        value.setNOF1(dakList[0]);
        // let arr = dakList[0].fileName.split(".");
        // arr.length > 1
        //   ? value.setExtension(arr[arr.length - 1])
        //   : value.setExtension("docx");
        // value.setURL(dakList[0].fileUrl);
      }
      value.setFlagNoArr(flagNoTmpArr);
      value.setFlagVal(flagNoTmpArr[0]);
      isBM === true
        ? value.setRowID(resp.id)
        : isBM === false
          ? value.setRowID(resp.fileId)
          : "";

      value.setBlnVisible(true);
      value.setBlnDisableForward(!resp.enableAddNoting);
      value.setcanClose(isDraft || department === resp.department);
      setLoading(false);
    });

    // if (!partCase && !isOutbox && !val) {
    //   isRti === "true" ? loadEnclouserTagsRti() : loadEnclouserTags();
    // } else {
    //   setLoading(false);
    // }
  };

  const loadEnclouserTags = () => {
    const dept = sessionStorage.getItem("department");
    const PartCaseID = sessionStorage.getItem("partcaseID");
    props.fetchSplitViewTags(PartCaseID, dept, isBM).then((resp) => {
      try {
        if (resp.error) {
          // callMessageOut(resp.error);
          setLoading(false);
          return;
        }
        if (resp) {
          if (resp.Data != null && resp.Data != [] && resp.Data != "") {
            value.setPdfViewerButtons(resp.Data);
          }
          setLoading(false);
        }
      } catch (error) {
        // callMessageOut(error.message);
        setLoading(false);
      }
    });
  };

  const loadEnclouserTagsRti = () => {
    const dept = sessionStorage.getItem("department");
    const PartCaseID = sessionStorage.getItem("partcaseID");
    props.fetchSplitViewTagsRti(PartCaseID, dept).then((resp) => {
      try {
        if (resp.error) {
          // callMessageOut(resp.error);
          return;
        }
        if (resp) {
          if (resp.Data != null && resp.Data != [] && resp.Data != "") {
            value.setPdfViewerButtons(resp.Data);
          }
        }
      } catch (error) {
        // callMessageOut(error.message);
      }
    });
  };

  const handleCount = (name, val) => {
    if (name === "ylowNote") {
      value.setcount1(val);
    } else {
      value.setcount2(val);
    }
  };

  return (
    <BmContext.Provider
      value={{
        ...value,
        isBM,
        loadSplitViewData,
        handleCount,
        loadRtiData,
        loadData,
      }}
    >
      {props.children}
    </BmContext.Provider>
  );
};

const BmGetterAndSetter = () => {
  let forwardRti = Cookies.get("isForward");
  const [NOF, setNOF] = useState("");
  const [NOF1, setNOF1] = useState("");
  const [sfdtData, setSfdtData] = useState("");
  const [prevEnclouser, setPrevEnclouser] = useState("");
  const [blnVisible, setBlnVisible] = useState(false);
  const [rowID, setRowID] = useState("");
  const [enclosureData, setEnclosureData] = useState([]);
  const [enclosureArr, setEnclosureArr] = useState([]);
  const [open, setOpen] = useState(false);
  const [URL, setURL] = useState("");
  const [pdfLoads, setpdfLoads] = useState(false);
  const [enclosurePdfLoads, setEnclosurePdfLoads] = useState(false);
  const [blnHideSyncfusion, setBlnHideSyncfusion] = useState(false);
  const [openInPdf, setOpenInPdf] = useState(false);
  const [blnDisable, setBlnDisable] = useState(false);
  const [prevVersionId, setPrevVersionId] = useState([]);
  const [fileChange, setFileChange] = useState(false);
  const [docId, setDocId] = useState([]);
  const [notingURL, setNotingURL] = useState("");
  const [flag, setFlag] = useState("Noting");
  const [partCaseId, setPartCaseId] = useState("");
  const [flagNumber, setFlagNumber] = useState(0);
  const [prevFlagNumberNF, setPrevFlagNumberNF] = useState(0);
  const [prevFlagNumberEnclouser, setPrevFlagNumberEnclouser] = useState(0);
  const [hrmRole, setHrmRole] = useState("");
  const [hrmDepartmet, setHrmDepartmet] = useState("");
  const [coverLetter, setCoverLetter] = useState(false);
  const [coverLetterDialog, setCoverLetterDialog] = useState(false);
  const [extension, setExtension] = useState("docx");
  const [extension2, setExtension2] = useState("docx");
  const [hasCoverNote, setHasCoverNote] = useState(false);
  const [enclosureSigned, setEnclosureSigned] = useState(false);
  const [notingSigned, setNotingSigned] = useState(false);
  const [blnDisableForward, setBlnDisableForward] = useState(false);
  const [notingData, setNotingData] = useState([]);
  const [send, setSend] = useState(false);
  const [serviceLetterId, setServiceLetterId] = useState("");
  const [departmentList, setDepartmentList] = useState([]);
  const [status, setStatus] = useState("");
  const [notingStatus, setNotingStatustatus] = useState("");
  const [page, setPage] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [isPdf, setIsPdf] = useState(false);
  const [isDocx, setIsDocx] = useState(false);
  const [isDoc, setIsDoc] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [touched, setTouched] = React.useState(false);
  const [flagVal, setFlagVal] = useState("");
  const [FlagNoArr, setFlagNoArr] = useState([]);
  const [isValid, setisValid] = useState(false);
  const [enclosureAnnoiD, setEnclosureAnnoiD] = useState("");
  const [ntngDocid, setnotingDocId] = useState("");
  const [encDocid, setenclosureDocId] = useState("");

  const [enclosurelen, setEnclosureLen] = useState("");
  const [notinglen, setNotinglen] = useState("");
  const [daklen, setDaklen] = useState("");

  const [isrtiforward, setIsRtiForward] = useState(forwardRti === "false");
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const [nofAnnoId, setNofAnnoId] = useState("");
  const [rtifilename, setRtifilename] = useState("");
  const [addNote, setaddNote] = useState(false);
  const [openRemarks, setopenRemarks] = useState(false);
  const [openYellowNotes, setopenYellowNotes] = useState(false);

  const [openInternalcomment, setopenInternalcomment] = useState(false);

  const [count1, setcount1] = useState(0);
  const [count2, setcount2] = useState(0);
  const [ylwNotes, setylwNotes] = useState([]);

  const [closeFile, setcloseFile] = useState(false);
  const [canClose, setcanClose] = useState(false);
  const [openSpeedDial, setOpenSpeedDial] = useState(true);
  const [cahtGpt, setChatGpt] = useState(false);
  const [fileId, setFileId] = useState("");
  const [dakList, setDakList] = useState([]);
  const [mainFile, setMainFile] = useState(false);

  const [pdfViewerButtons, setPdfViewerButtons] = useState([
    {
      btnName: "A",
      btnId: 0,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "B",
      btnId: 1,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "C",
      btnId: 2,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "D",
      btnId: 3,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
    {
      btnName: "E",
      btnId: 4,
      backgroundColor: "grey",
      fileurl: "",
      pageNumber: 1,
    },
  ]);

  const [upload, setUpload] = useState(false);
  const [totalFlags, settotalFlags] = useState(0);
  const [ntguploader, setNtgUploader] = useState("");
  const [ntgstatus, setNtgStatus] = useState("");
  const [notingFlag, setNotingFlag] = useState(0);
  const [filestatus, setFilestatus] = useState("");
  const [externalList, setExternalList] = useState([]);
  const [internalList, setInternalList] = useState([]);
  const [externalInList, setExternalInList] = useState([]);

  // To control yellow note visibility
  const [creator, setCreator] = useState("");

  // Hold data need for barcode
  const [barCode, setBarCode] = useState({});
  const [isLf, setisLf] = useState(false);

  const [linkfiles, setLinkfiles] = useState([]);
  const [totalLF, settotalLF] = useState(0);
  const [linkF, setLinkF] = useState("");

  const [pageSize, setPageSize] = useState(25);
  const [currentPage, setCurrentPage] = useState(0);

  const [isError, setIsError] = useState(false)

  return {
    NOF,
    setNOF,
    NOF1,
    setNOF1,
    sfdtData,
    setSfdtData,
    prevEnclouser,
    setPrevEnclouser,
    blnVisible,
    setBlnVisible,
    rowID,
    setRowID,
    enclosureData,
    setEnclosureData,
    enclosureArr,
    setEnclosureArr,
    open,
    setOpen,
    URL,
    setURL,
    pdfLoads,
    setpdfLoads,
    enclosurePdfLoads,
    setEnclosurePdfLoads,
    blnHideSyncfusion,
    setBlnHideSyncfusion,
    openInternalcomment,
    setopenInternalcomment,
    openInPdf,
    setOpenInPdf,
    blnDisable,
    setBlnDisable,
    prevVersionId,
    setPrevVersionId,
    fileChange,
    setFileChange,
    notingURL,
    setNotingURL,
    flag,
    setFlag,
    partCaseId,
    setPartCaseId,
    flagNumber,
    setFlagNumber,
    prevFlagNumberNF,
    setPrevFlagNumberNF,
    prevFlagNumberEnclouser,
    setPrevFlagNumberEnclouser,
    hrmRole,
    setHrmRole,
    hrmDepartmet,
    setHrmDepartmet,
    coverLetter,
    setCoverLetter,
    coverLetterDialog,
    setCoverLetterDialog,
    extension,
    setExtension,
    hasCoverNote,
    setHasCoverNote,
    enclosureSigned,
    setEnclosureSigned,
    notingSigned,
    setNotingSigned,
    blnDisableForward,
    setBlnDisableForward,
    notingData,
    setNotingData,
    send,
    setSend,
    serviceLetterId,
    setServiceLetterId,
    departmentList,
    setDepartmentList,
    status,
    setStatus,
    notingStatus,
    setNotingStatustatus,
    page,
    setPage,
    pageNumber,
    setPageNumber,
    isPdf,
    setIsPdf,
    isDocx,
    setIsDocx,
    isDoc,
    setIsDoc,
    openDialog,
    setOpenDialog,
    touched,
    setTouched,
    flagVal,
    setFlagVal,
    FlagNoArr,
    setFlagNoArr,
    isValid,
    setisValid,
    enclosureAnnoiD,
    setEnclosureAnnoiD,
    enclosurelen,
    setEnclosureLen,
    notinglen,
    setNotinglen,
    daklen,
    setDaklen,
    isrtiforward,
    setIsRtiForward,
    openConfirmation,
    setOpenConfirmation,
    nofAnnoId,
    setNofAnnoId,
    rtifilename,
    setRtifilename,
    addNote,
    setaddNote,
    openRemarks,
    setopenRemarks,
    openYellowNotes,
    setopenYellowNotes,
    count1,
    setcount1,
    count2,
    setcount2,
    ylwNotes,
    setylwNotes,
    closeFile,
    setcloseFile,
    canClose,
    setcanClose,
    openSpeedDial,
    setOpenSpeedDial,
    pdfViewerButtons,
    setPdfViewerButtons,
    cahtGpt,
    setChatGpt,
    fileId,
    setFileId,
    docId,
    setDocId,
    upload,
    setUpload,
    totalFlags,
    settotalFlags,
    ntguploader,
    setNtgUploader,
    ntgstatus,
    setNtgStatus,
    notingFlag,
    setNotingFlag,
    dakList,
    setDakList,
    mainFile,
    setMainFile,
    setnotingDocId,
    ntngDocid,
    setenclosureDocId,
    encDocid,
    extension2,
    setExtension2,
    filestatus,
    setFilestatus,
    externalList,
    setExternalList,
    internalList,
    setInternalList,
    creator,
    setCreator,
    externalInList,
    setExternalInList,
    barCode,
    setBarCode,
    isLf,
    setisLf,
    linkfiles,
    setLinkfiles,
    totalLF,
    settotalLF,
    linkF,
    setLinkF,
    pageSize,
    setPageSize,
    currentPage,
    setCurrentPage,
    isError,
    setIsError,
  };
};

const mapStateToProps = (state) => {
  return {
    props: state.props,
    inboxer: state.inboxer,
    theme: state.theme,
  };
};

export default connect(mapStateToProps, {
  loadInboxDataSplitView,
  getcabinetpartcase,
  loadPartCaseData,
  loadOutboxRow,
  loadRtiDataSplitView,
  loadRtiPartCaseData,
  fetchSplitViewTags,
  fetchSplitViewTagsRti,
  getMailRoomFile,
  getLinkedFiles,
})(BmProvider);
