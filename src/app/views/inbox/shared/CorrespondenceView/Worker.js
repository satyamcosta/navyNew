import React from "react";
import { getCorespondence } from "../../../../camunda_redux/redux/action";
import { useState } from "react";
import { connect, useDispatch } from "react-redux";
import { setSnackbar } from "app/camunda_redux/redux/ducks/snackbar";
import { useEffect } from "react";
import { unstable_batchedUpdates } from "react-dom";
import Cookies from "js-cookie";
import { isNullOrUndefined } from "@syncfusion/ej2-base";

export const CorrContext = React.createContext();

const CorrProvider = (props) => {
  const outbox = Cookies.get("outboxCorr") == "true";
  const index = Cookies.get("index") == "true";
  const preview = Cookies.get("preview") == "true";

  const inboxId = sessionStorage.getItem("InboxID");
  // For Advance Search
  const annexIndex = Cookies.get("annexNo");
  const refIndex = Cookies.get("refNo");

  const value = CorrGetterAndSetter();
  const dispatch = useDispatch();

  const callMessageOut = (message) => {
    setLoading(false);
    return dispatch(setSnackbar(true, "error", message));
  };

  useEffect(() => {
    if (props.corrObj || index) {
      loadData(props.corrObj);
    } else {
      getCorrespondence();
    }
  }, [props.corrObj, index, preview, inboxId]);

  const getCorrespondence = () => {
    value.setLoading(true);
    const isNotification = Cookies.get("isNotification") == "true"
    props
      .getCorespondence(inboxId, isNotification)
      .then((res) => {
        if (res.error) {
          console.log(res)
          value.setIsError("Dak Is Not Present In Your Inbox")
          value.setLoading(false)
        }
        else {
          loadData(res.response);
        }
      })
      .catch((err) => {
        console.log(err);
        value.setLoading(false);
      });
  };

  const loadData = (res) => {
    if (!isNullOrUndefined(res)) {
      const {
        annexures,
        references,
        application,
        id,
        classification,
        correspondenceNumber,
        saved,
        subject,
        type,
        priority,
        internalComments,
        externalComments,
        nofFileName,
        mergeDak,
        sequentialToDept,
        deptCcSuggestion,
        deptInfoSuggestion,
        deptToSuggestion,
        deptWithInSuggestion,
        deptToRecord,
        deptCcRecord
      } = res;
      unstable_batchedUpdates(() => {
        value.settabIndex(annexIndex >= 0 ? 1 : refIndex >= 0 ? 2 : 0);

        if (annexures.length > 0) {
          let arr = annexures[0].fileName?.split(".");
          arr.length > 1
            ? value.setannexExtension(arr[arr.length - 1])
            : value.setannexExtension("docx");
        }

        if (references.length > 0) {
          let arr = references[0].fileName?.split(".");
          arr.length > 1
            ? value.setreferExtension(arr[arr.length - 1])
            : value.setreferExtension("docx");
        }

        if (application) {
          let arr = application.fileName?.split(".");
          arr.length > 1
            ? value.setNoteExtension(arr[arr.length - 1])
            : value.setNoteExtension("docx");

          if (arr.length > 1 && arr[arr.length - 1] == "pdf") {
            value.setIsScanned(true)
            value.setNoteSigned(true);
          }
          else {
            value.setNoteSigned(application?.isSigned);


          }

        }

        unstable_batchedUpdates(() => {
          value.setMergeDak(mergeDak);
          value.setCommentList(internalComments);
          value.setExtCommList(externalComments);
          value.setannexureList(annexures);
          value.setreferenceList(references);
          value.setNoteObj(application);
          value.setannexObj(annexures[0]);
          value.setreferObj(references[0]);
          value.setDakType(type);
          value.setSeqArr(sequentialToDept);
          value.setDeptTo(deptToSuggestion);
          value.setDeptCc(deptCcSuggestion);
          value.setDeptInfo(deptInfoSuggestion);
          value.setDeptWithin(deptWithInSuggestion);

          let toString = ''
          toString = deptToRecord?.reduce((acc, item) => {
            if (acc) {

              return acc + ", " + item?.replace('dir-', '')?.toUpperCase()
            }
            return acc + item?.replace('dir-', '')?.toUpperCase()
          }, toString)

          let ccString = ''
          ccString = deptCcRecord?.reduce((acc, item) => {
            if (acc) {

              return acc + ", " + item?.replace('dir-', '')?.toUpperCase()
            }
            return acc + item?.replace('dir-', '')?.toUpperCase()
          }, ccString)

          console.log(ccString)

          value.setDeptToRecord(toString)
          value.setDeptCcRecord(ccString)

          if (outbox || index || preview) {
            value.setNoteSigned(true);
            value.setannexSigned(true);
            value.setreferSigned(true);
          } else {

            value.setannexSigned(annexures[0]?.isSigned);
            value.setreferSigned(references[0]?.isSigned);
          }

          value.setcorrObj({
            classification,
            subject,
            type,
            priority,
          });

          value.setIndexFile(nofFileName);

          value.setnoteAnnotId(application.annotationId);
          value.setannexAnnoId(annexures[0]?.annotationId);
          value.setreferAnnoId(references[0]?.annotationId);
          value.setnoteUrl(application?.fileUrl);
          value.setreferUrl(references[0]?.fileUrl);
          value.setannexUrl(annexures[0]?.fileUrl);
          value.setRowId(id);
          value.setClassification(classification);
          value.setCorrNo(correspondenceNumber);
          value.setSaved(saved);
          value.setLoading(false);
        }, []);
      });
    } else {
      value.setLoading(false);
    }
  };

  const handleTabChange = () => {
    const {
      annexureList,
      referenceList,
      setannexObj,
      setreferObj,
      setannexSigned,
      setreferSigned,
      setannexUrl,
      setreferUrl,
      setannexAnnoId,
      setreferAnnoId,
      setannexExtension,
      setreferExtension,
    } = value;

    if (annexureList.length > 0) {
      let annex = annexureList[0];
      setannexObj(annex);
      if (outbox || index || preview) {
        setannexSigned(true);
      } else {
        setannexSigned(annex?.isSigned);
      }
      let arr = annex.fileName.split(".");
      arr.length > 1
        ? setannexExtension(arr[arr.length - 1])
        : setannexExtension("docx");
      setannexAnnoId(annex.annotationId);
      setannexUrl(annex.fileUrl);
    }
    if (referenceList.length > 0) {
      let refer = referenceList[0];
      setreferObj(refer);
      if (outbox || index || preview) {
        setreferSigned(true);
      } else {
        setreferSigned(refer?.isSigned);
      }
      let arr = refer.fileName.split(".");
      arr.length > 1
        ? setreferExtension(arr[arr.length - 1])
        : setreferExtension("docx");
      setreferAnnoId(refer.annotationId);
      setreferUrl(refer.fileUrl);
    }
  };

  const handleReload = () => {
    value.setOpenRepo(false);
    getCorrespondence();
  };

  return (
    <CorrContext.Provider
      value={{
        ...value,
        handleTabChange,
        loadData,
        handleReload,
      }}
    >
      {props.children}
    </CorrContext.Provider>
  );
};

const CorrGetterAndSetter = () => {
  const [tabIndex, settabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [alignment, setAlignment] = useState("one");
  const [classification, setClassification] = useState("");
  const [corrNo, setCorrNo] = useState("");

  const handleAlignment = (event, newAlignment) => {
    setAlignment(newAlignment);
  };

  const [rowId, setRowId] = useState("");
  const [saved, setSaved] = useState(false);
  const [corrObj, setcorrObj] = useState({});

  const [commentList, setCommentList] = useState([]);
  const [extCommList, setExtCommList] = useState([]);
  const [annexureList, setannexureList] = useState([]);
  const [referenceList, setreferenceList] = useState([]);
  const [noteObj, setNoteObj] = useState("");
  const [annexObj, setannexObj] = useState("");
  const [referObj, setreferObj] = useState("");

  const [noteSigned, setNoteSigned] = useState(true);
  const [annexSigned, setannexSigned] = useState(true);
  const [referSigned, setreferSigned] = useState(true);

  const [noteUrl, setnoteUrl] = useState(false);
  const [annexUrl, setannexUrl] = useState(false);
  const [referUrl, setreferUrl] = useState(false);

  const [noteAnnotId, setnoteAnnotId] = useState("");
  const [annexAnnoId, setannexAnnoId] = useState("");
  const [referAnnoId, setreferAnnoId] = useState("");

  const [noteExtension, setNoteExtension] = useState("docx");
  const [annexExtension, setannexExtension] = useState("docx");
  const [referExtension, setreferExtension] = useState("docx");

  const [indexFile, setIndexFile] = useState("");

  // A common state for annexure and reference to upload from existing dak or file
  const [openRepo, setOpenRepo] = useState(false);

  // State to control sign , upload , delete of docs in dak
  const [mergeDak, setMergeDak] = useState(true);
  const [dakType, setDakType] = useState("");

  // Sending internal or external in sequence
  const [seqArr, setSeqArr] = useState([]);
  const [deptCc, setDeptCc] = useState([]);
  const [deptInfo, setDeptInfo] = useState([]);
  const [deptTo, setDeptTo] = useState([]);
  const [deptWithin, setDeptWithin] = useState([]);

  const [isScanned, setIsScanned] = useState(false)
  const [isError, setIsError] = useState("")

  const [deptCcRecord, setDeptCcRecord] = useState([])
  const [deptToRecord, setDeptToRecord] = useState([])

  return {
    tabIndex,
    settabIndex,
    loading,
    setLoading,
    alignment,
    setAlignment,
    classification,
    setClassification,
    corrNo,
    setCorrNo,
    handleAlignment,
    annexureList,
    setannexureList,
    referenceList,
    setreferenceList,
    noteObj,
    setNoteObj,
    annexObj,
    setannexObj,
    referObj,
    setreferObj,
    noteSigned,
    setNoteSigned,
    annexSigned,
    setannexSigned,
    referSigned,
    setreferSigned,
    noteUrl,
    setnoteUrl,
    annexUrl,
    setannexUrl,
    referUrl,
    setreferUrl,
    noteAnnotId,
    setnoteAnnotId,
    annexAnnoId,
    setannexAnnoId,
    referAnnoId,
    setreferAnnoId,
    noteExtension,
    setNoteExtension,
    annexExtension,
    setannexExtension,
    referExtension,
    setreferExtension,
    rowId,
    setRowId,
    saved,
    setSaved,
    corrObj,
    setcorrObj,
    commentList,
    setCommentList,
    extCommList,
    setExtCommList,
    indexFile,
    setIndexFile,
    openRepo,
    setOpenRepo,
    mergeDak,
    setMergeDak,
    dakType,
    setDakType,
    seqArr,
    setSeqArr,
    deptCc,
    deptInfo,
    deptTo,
    setDeptCc,
    setDeptInfo,
    setDeptTo,
    deptWithin,
    setDeptWithin,
    isScanned, setIsScanned,
    isError, setIsError, deptCcRecord,
    setDeptCcRecord,
    deptToRecord,
    setDeptToRecord
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
  getCorespondence,
})(CorrProvider);
