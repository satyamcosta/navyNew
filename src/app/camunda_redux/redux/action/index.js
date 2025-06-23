import * as ProcessDefinitionActions from "./camunda-rest/process-definition";
import * as TaskActions from "./camunda-rest/task";
import * as InitiateActions from "./backend-rest/initiate-data";
import * as FormDataAction from "./backend-rest/form-data";
import * as RtiAction from "./backend-rest/rti-data";
// import * as ActionPoints from "./ActionPoints/actionpoint_data";
import {
  CHANGE_ROUTES_ALL,
  CHANGE_ROUTES_MR,
  CHANGE_ROUTES_PA,
  CURRENT_SIGN,
  INSTANCE_CHANGE,
  MYINFO_CHANGE,
  SIDENAV_CHANGE,
  THEME_CHANGE,
} from "../constants/ActionTypes";
import * as ActionPoints from "./ActionPoints/actionpoint_data";

export const loadTasks = () => (dispatch, getState) => {
  return dispatch(TaskActions.fetchTasks());
};

export const getMrInboxData =
  (role, username, department, pageSize, pageNumber, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getMrInboxData(
          role,
          username,
          department,
          pageSize,
          pageNumber,
          abortSignal
        )
      );
    };

export const moveToPending = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.moveToPending(id));
};

export const moveToNfa = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.moveToNfa(id));
};

export const getMailRoomData =
  (role, username, department, id) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getMailRoomData(role, username, department, id)
    );
  };

export const sendFromMailRoom =
  (role, username, department, id) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.sendFromMailRoom(role, username, department, id)
    );
  };

export const downloadMailRoom =
  (role, username, department, id) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.downloadMailRoom(role, username, department, id)
    );
  };

export const getPersonalInfo =
  (values, abortSignal) => (dispatch, getState) => {
    return dispatch(FormDataAction.getPersonalInfo(values, abortSignal));
  };

export const updatePersonalInfo = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.updatePersonalInfo(values));
};

export const getPersonalInfoForm = (roleName) => (dispatch, getState) => {
  return dispatch(FormDataAction.getPersonalInfoForm(roleName));
};

export const loadTaskFormKey = (taskId) => (dispatch, getState) => {
  return dispatch(TaskActions.fetchTaskFormKey(taskId));
};

export const completeTask = (taskId, values) => (dispatch, getState) => {
  return dispatch(TaskActions.postCompleTask(taskId, values));
};

/********************************Advance Search*********************************/

export const loadAdvanceSearch =
  (
    val,
    text,
    role,
    pageSize,
    currentPage,
    username,
    department,
    section,
    filter,
    fileNo,
    sendBy,
    CreatedBy,
    Subject,
    Status,
    scope
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.loadAdvanceSearch(
          val,
          text,
          role,
          pageSize,
          currentPage,
          username,
          department,
          section,
          filter,
          fileNo,
          sendBy,
          CreatedBy,
          Subject,
          Status,
          scope
        )
      );
    };

export const loadContentData =
  (value, roleName, department, userName, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadContentData(
        value,
        roleName,
        department,
        userName,
        scope
      )
    );
  };
export const loadCabinetStatus =
  (roleName, department, userName, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadCabinetStatus(roleName, department, userName, scope)
    );
  };
export const loadSendBy =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadSendBy(value, roleName, userName, department, scope)
    );
  };
export const loadCreatedBy =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadCreatedBy(
        value,
        roleName,
        userName,
        department,
        scope
      )
    );
  };
export const laodFileNo =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.laodFileNo(value, roleName, userName, department, scope)
    );
  };
export const loadCabinetSubject =
  (value, roleName, userName, department, scope) => (dispatch, getStatus) => {
    return dispatch(
      InitiateActions.loadCabinetSubject(
        value,
        roleName,
        userName,
        department,
        scope
      )
    );
  };

/********************************Advance Search*********************************/

export const getAdvanceSearch =
  (
    names,
    files,
    types,
    from,
    to,
    filesubjects,
    oldfilerefs,
    apiObj,
    contentnamess,
    sendbynamess,
    filenamess,
    subjectnamess,
    createdbynamess,
    rolename,
    size
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getAdvanceSearch(
          names,
          files,
          types,
          from,
          to,
          filesubjects,
          oldfilerefs,
          apiObj,
          contentnamess,
          sendbynamess,
          filenamess,
          subjectnamess,
          createdbynamess,
          rolename,
          size
        )
      );
    };
export const getContentData =
  (value, rolename, department) => (dispatch, getstate) => {
    return dispatch(
      InitiateActions.getContentData(value, rolename, department)
    );
  };
export const getSendData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getSendData(value, rolename));
};
export const getFilenumberData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getFilenumberData(value, rolename));
};
export const getSubjectData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getSubjectData(value, rolename));
};
export const getCreatedData = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getCreatedData(value, rolename));
};
export const getCabinetStatus = (value, rolename) => (dispatch, getstate) => {
  return dispatch(InitiateActions.getCabinetStatus(value, rolename));
};

export const loadProcessDefinitions =
  (processDefinitionId) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.fetchProcessDefinitions(processDefinitionId)
    );
  };

export const loadProcessDefinitionsWithXML =
  (processDefinitionId) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.fetchProcessDefinitions(processDefinitionId)
    ).then((data) => {
      data.response.result.forEach((id) => {
        dispatch(ProcessDefinitionActions.fetchProcessDefinitionXML(id));
      });
    });
  };

export const loadProcessDefinitionXML =
  (processDefinitionId) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.fetchProcessDefinitionXML(processDefinitionId)
    );
  };

export const loadFormKey = (processDefinitionKey) => (dispatch, getState) => {
  return dispatch(ProcessDefinitionActions.fetchFormKey(processDefinitionKey));
};

export const startProcessInstance =
  (processDefinitionKey, values) => (dispatch, getState) => {
    return dispatch(
      ProcessDefinitionActions.postProcessInstance(processDefinitionKey, values)
    );
  };

export const loadTaskVariables =
  (taskId, variableNames) => (dispatch, getState) => {
    return dispatch(TaskActions.fetchTaskVariables(taskId, variableNames));
  };

export const loadClassificationData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getClassificationData());
};

export const loadTypesData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getTypeData());
};
export const loadFileTypesData = (role) => (dispatch, getState) => {
  return dispatch(InitiateActions.getFileTypeData(role));
};

export const loadGroupsData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getGroupsData());
};

export const loadRolesData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getRolesData());
};

export const loadDraftData = (role) => (dispatch, getState) => {
  return dispatch(InitiateActions.getDraftData(role));
};

export const loadOutboxData =
  (role, username, pageSize, pageNumber, Date, filter, sort, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getOutboxData(
          role,
          username,
          pageSize,
          pageNumber,
          Date,
          filter,
          sort,
          abortSignal
        )
      );
    };

export const getDataForExport =
  (role, username, ranges) => (dispatch, getState) => {
    return dispatch(InitiateActions.getDataForExport(role, username, ranges));
  };

export const loadOutboxRow = (id, isBM) => (dispatch, getState) => {
  return dispatch(InitiateActions.getOutboxRow(id, isBM));
};

export const loadInboxData =
  (
    role,
    username,
    department,
    pageSize,
    pageNumber,
    selectedMenuItem,
    filter,
    sort,
    abortSignal,
    pending
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getInboxData(
          role,
          username,
          department,
          pageSize,
          pageNumber,
          selectedMenuItem,
          filter,
          sort,
          abortSignal,
          pending
        )
      );
    };

// export const getMrInboxData =
//   (role, username, department, pageSize, pageNumber, abortSignal) =>
//   (dispatch, getState) => {
//     return dispatch(
//       InitiateActions.getMrInboxData(
//         role,
//         username,
//         department,
//         pageSize,
//         pageNumber,
//         abortSignal
//       )
//     );
//   };

// export const getMailRoomData =
//   (role, username, department, id) => (dispatch, getState) => {
//     return dispatch(
//       InitiateActions.getMailRoomData(role, username, department, id)
//     );
//   };

// export const sendFromMailRoom =
//   (role, username, department, id) => (dispatch, getState) => {
//     return dispatch(
//       InitiateActions.sendFromMailRoom(role, username, department, id)
//     );
//   };

// export const downloadMailRoom =
//   (role, username, department, id) => (dispatch, getState) => {
//     return dispatch(
//       InitiateActions.downloadMailRoom(role, username, department, id)
//     );
//   };

export const loadEnclosureData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getEnclosureData(id));
};

export const loadNotingData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getNotingData(id));
};

export const downloadFile = (url) => (dispatch, getState) => {
  return dispatch(InitiateActions.getFileUrl(url));
};

export const createFormData = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.setCreateForm(values));
};

export const uploadEnclosure =
  (id, file, config, grp, subject, role, isBM) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadEnclosure(id, file, config, grp, subject, role, isBM)
    );
  };

export const permanentlyClose = (cabinetId) => (dispatch, getState) => {
  return dispatch(FormDataAction.permanentlyClose(cabinetId));
};

export const getCreateVolume = (cabinetId) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCreateVolume(cabinetId));
};
export const getVolume = (subject) => (dispatch, getState) => {
  return dispatch(FormDataAction.getVolume(subject));
};

export const uploadNoting =
  (id, file, role, username) => (dispatch, getState) => {
    return dispatch(FormDataAction.uploadNoting(id, file, role, username));
  };

export const sendFile = (id, data, role) => (dispatch, getState) => {
  return dispatch(FormDataAction.sendFile(id, data, role));
};

export const loadInstanceVariables = (id) => (dispatch, getState) => {
  return dispatch(ProcessDefinitionActions.postProcessInstanceVariables(id));
};

export const loadSfdt =
  (url, username, id, role, dept) => (dispatch, getState) => {
    return dispatch(InitiateActions.getSfdt(url, username, id, role, dept));
  };

export const loadTemplate = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getTemplate());
};

export const getReadStatus = (inboxId, value) => (dispatch) => {
  return dispatch(InitiateActions.getReadStatus(inboxId, value));
};

export const getPinInboxId = (inboxId) => (dispatch) => {
  return dispatch(InitiateActions.getPinInboxId(inboxId));
};

export const getFlagStatus = (inboxId) => (dispatch) => {
  return dispatch(InitiateActions.getFlagStatus(inboxId));
};

export const URLHide = (url) => (dispatch, getState) => {
  return dispatch(InitiateActions.URLHide(url));
};

export const getFav = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getFav());
};

export const setFav = (body) => (dispatch, getState) => {
  return dispatch(InitiateActions.setFav(body));
};

export const deleteFav = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.deleteFav(id));
};

export const personalFileFormData = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.createPersonalFileForm(values));
};
export const personalApplicationFormData =
  (values, role, grp) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.createPersonalApplicationForm(values, role, grp)
    );
  };

export const updateSubjectApplicationForm =
  (subject, id) => (dispatch, getState) => {
    return dispatch(FormDataAction.updateSubjectApplicationForm(subject, id));
  };

export const replyCorrespondence =
  (subject, type, classification, nofID, nofFileName, priority, id) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.replyCorrespondence(
          subject,
          type,
          classification,
          nofID,
          nofFileName,
          priority,
          id
        )
      );
    };

export const createMrDak =
  (
    classification,
    from,
    type,
    referenceNo,
    signDate,
    dueDate,
    subject,
    mrDakId
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.createMrDak(
          classification,
          from,
          type,
          referenceNo,
          signDate,
          dueDate,
          subject,
          mrDakId
        )
      );
    };

export const deleteMrDak = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.deleteMrDak(id));
};

export const editMrDak = (id, subject) => (dispatch, getState) => {
  return dispatch(FormDataAction.editMrDak(id, subject));
};

export const updateSubjectFileForm = (subject, id) => (dispatch, getState) => {
  return dispatch(InitiateActions.updateSubjectFileForm(subject, id));
};

export const loadPFData =
  (username, role, nofFileId, pageSize, pageNumber, value) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getPF(
          username,
          role,
          nofFileId,
          pageSize,
          pageNumber,
          value
        )
      );
    };

export const loadIndexData =
  (fileId, pageSize, pageNumber, value) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.loadIndexData(fileId, pageSize, pageNumber, value)
    );
  };

export const copyCorrespondence =
  (toDocId, fromDocIds, desDocType) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.copyCorrespondence(toDocId, fromDocIds, desDocType)
    );
  };

export const loadPFileData = (username, role) => (dispatch, getState) => {
  return dispatch(InitiateActions.getPFileData(username, role));
};
export const loadPATableData =
  (username, role, pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPATableData(username, role, pageSize, pageNumber)
    );
  };

export const getPADashboardData =
  (username, role, department, pageSize, pageNumber, value, abortSignal, isDak) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getPADashboardData(
          username,
          role,
          department,
          pageSize,
          pageNumber,
          value,
          abortSignal
        )
      );
    };

export const quickSign =
  (
    value,
    roleName,
    depart,
    username,
    flagNum,
    annexureSign,
    annexureId,
    pfileName,
    isRti,
    fileId,
    body,
    isBM, isDak,
    isNoting
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.quickSign(
          value,
          roleName,
          depart,
          username,
          flagNum,
          annexureSign,
          annexureId,
          pfileName,
          isRti,
          fileId,
          body,
          isBM,
          isDak,
          isNoting
        )
      );
    };

export const sendFiles =
  (id, data, role, username, displayUserName, pfileName, priority) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFiles(
          id,
          data,
          role,
          username,
          displayUserName,
          pfileName,
          priority
        )
      );
    };

export const sendPa =
  (
    id,
    data,
    role,
    username,
    displayUserName,
    pfileName,
    priority,
    signed,
    comment,
    inboxId
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendPa(
          id,
          data,
          role,
          username,
          displayUserName,
          pfileName,
          priority,
          signed,
          comment,
          inboxId
        )
      );
    };

export const sendFilesInternal =
  (id, data, role, username, displayUserName, priority) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFilesInternal(
          id,
          data,
          role,
          username,
          displayUserName,
          priority
        )
      );
    };

export const sendPaInternal =
  (
    id,
    data,
    role,
    username,
    displayUserName,
    priority,
    signed,
    comment,
    inboxId
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendPaInternal(
          id,
          data,
          role,
          username,
          displayUserName,
          priority,
          signed,
          comment,
          inboxId
        )
      );
    };

export const addToFavourite =
  (data, { username, role }, type, isPa) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.addToFavourite(data, { username, role }, type, isPa)
      );
    };

export const fetchFavouriteList =
  ({ username, role, type }, isPa) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.fetchFavouriteList(username, role, type, isPa)
      );
    };

export const deleteFavourite =
  (data, { username, role }, type, isPa) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.deleteFavourite(data, { username, role }, type, isPa)
      );
    };

export const sendFilesSection =
  (
    id,
    data,
    rolename,
    department,
    username,
    value,
    pfileName,
    body,
    flgNo,
    isReturn,
    sendToDep,
    externalAddresse,
    completedList,
    pendingList
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFilesSection(
          id,
          data,
          rolename,
          department,
          username,
          value,
          pfileName,
          body,
          flgNo,
          isReturn,
          sendToDep,
          externalAddresse,
          completedList,
          pendingList
        )
      );
    };

export const sendFilesServiceNumber =
  (
    id,
    data,
    value,
    pfileName,
    body,
    flgNo,
    serviceLetterId,
    isReturn,
    sendToDep
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFilesServiceNumber(
          id,
          data,
          value,
          pfileName,
          body,
          flgNo,
          serviceLetterId,
          isReturn,
          sendToDep
        )
      );
    };

export const sendFilesInternalServiceNumber =
  (id, data, value, pfileName, body, flgNo, sendTo, internalComment, completedList,
    pendingList) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendFilesInternalServiceNumber(
          id,
          data,
          value,
          pfileName,
          body,
          flgNo,
          sendTo,
          internalComment,
          completedList,
          pendingList
        )
      );
    };

export const saveDocument =
  (id, formData, role, userName, isPartCase, fileUrl, isAnnexure) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.saveFiles(
          id,
          formData,
          role,
          userName,
          isPartCase,
          fileUrl,
          isAnnexure
        )
      );
    };

export const saveAnnotation =
  (values, id, flag, flagNumber) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.createAnnotation(values, id, flag, flagNumber)
    );
  };

export const saveExternalAnnotation = (values) => (dispatch, getState) => {
  return dispatch(FormDataAction.createExternalAnnotation(values));
};

export const getAnnotation = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.getAnnotation(id));
};

export const uploadAnnexure =
  (personalAppId, file, role, username, onUploadProgress, subject) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.uploadAnnexure(
          personalAppId,
          file,
          role,
          username,
          onUploadProgress,
          subject
        )
      );
    };

export const uploadPcAnnexure =
  (personalAppId, file, role, username, subject, onUploadProgress) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.uploadPcAnnexure(
          personalAppId,
          file,
          role,
          username,
          subject,
          onUploadProgress
        )
      );
    };

export const getGroupList = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getGroupList(value));
};

export const getGroupListIn = () => (dispatch, getState) => {
  return dispatch(FormDataAction.getGroupListIn());
};

export const getHrmListData = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getHrmFileList(value));
};

export const getServiceLetterList =
  (value, department, username, role, currentPage, pageSize) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getServiceLetterList(
          value,
          department,
          username,
          role,
          currentPage,
          pageSize
        )
      );
    };

export const getPAWithAnnexureList = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getPAWithAnnexureList(value));
};

export const loadAnnexureTableData =
  (username, role, department, id) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getAnnexureTableData(username, role, department, id)
    );
  };

export const loadUserRoleData = (username) => (dispatch, getState) => {
  return dispatch(InitiateActions.getUserRolesData(username));
};

export const sideNav = (value) => (dispatch, getState) => {
  return dispatch(InitiateActions.sideNav(value));
};

export const getMISTableList = (value) => (dispatch, getState) => {
  return dispatch(InitiateActions.getMISTableData(value));
};

export const getMISDetailTableList = (value) => (dispatch, getState) => {
  return dispatch(InitiateActions.getMISDetailTableData(value));
};

export const deleteAnnexureData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.deleteAnnexureData(id));
};

export const deleteCorrAnnexureData =
  (corrDocId, flagNumber, fileId) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.deleteCorrAnnexureData(corrDocId, flagNumber, fileId)
    );
  };

export const updateCorrDocs =
  (corrDocId, isAnnexure, fileId, subject) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.updateCorrAnnexure(corrDocId, isAnnexure, fileId, subject)
    );
  };

export const closeCorrespondence = (inboxId) => (dispatch, getState) => {
  return dispatch(InitiateActions.closeCorrespondence(inboxId));
};

export const discardCorrespondence = (inboxId) => (dispatch, getState) => {
  return dispatch(InitiateActions.discardCorrespondence(inboxId));
};

export const deleteCorrReferenceData =
  (corrDocId, flagNumber, fileId) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.deleteCorrReferenceData(corrDocId, flagNumber, fileId)
    );
  };

export const createPANotingData =
  (
    fileTrackID,
    roleName,
    userName,
    groupName,
    personName,
    nofFileID,
    fileNumber,
    custodian,
    isServiceLetter,
    serviceLetterId,
    nofRowData
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.createPANotingData(
          fileTrackID,
          roleName,
          userName,
          groupName,
          personName,
          nofFileID,
          fileNumber,
          custodian,
          isServiceLetter,
          serviceLetterId,
          nofRowData
        )
      );
    };

export const addPANotingData =
  (userName, groupName, serviceLetterId, InboxID) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.addPANotingData(
        userName,
        groupName,
        serviceLetterId,
        InboxID
      )
    );
  };

export const createPartCaseServiceLetter =
  (
    roleName,
    userName,
    groupName,
    nofFileID,
    fileNumber,
    custodian,
    inboxId,
    partcaseId,
    personName,
    serviceLetterId
  ) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.createPartCaseServiceLetter(
          roleName,
          userName,
          groupName,
          nofFileID,
          fileNumber,
          custodian,
          inboxId,
          partcaseId,
          personName,
          serviceLetterId
        )
      );
    };

export const getPANotingData = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getPANotingData(id));
};

export const getPAEnclosureData =
  (ids, id, role, groupName) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPAEnclosureData(ids, id, role, groupName)
    );
  };
export const getbyfilename = (values, branch) => (dispatch, getState) => {
  return dispatch(FormDataAction.getbyfilename(values, branch));
};

export const getIndexFiles =
  (pageSize, pageNumber, filter, sort, signal) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getIndexFiles(pageSize, pageNumber, filter, sort, signal)
    );
  };

export const getFiles = () => (dispatch, getState) => {
  return dispatch(FormDataAction.getFiles());
};

export const saveInFile =
  (corrDocId, nofFileId, nofFileName) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.saveInFile(corrDocId, nofFileId, nofFileName)
    );
  };

export const createIndexFile = (val, section) => (dispatch, getState) => {
  console.log(section);
  return dispatch(FormDataAction.createIndexFile(val, section));
};

export const getSection = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getSection(value));
};
export const getServiceNumber = (value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getServiceNumber(value));
};
export const getInternalServiceNumber =
  (value, groupName) => (dispatch, getState) => {
    return dispatch(FormDataAction.getInternalServiceNumber(value, groupName));
  };
export const loadPADraftTableData =
  (username, role, dept, pageSize, pageNumber, val, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getPADraftTableData(
          username,
          role,
          dept,
          pageSize,
          pageNumber,
          val,
          abortSignal
        )
      );
    };

export const loadPartCaseData =
  (data, department, roleName, username, isBM) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getPartCaseData(data, department, roleName, username, isBM)
    );
  };

export const loadInboxDataSplitView =
  (id, username, isBM) => (dispatch, getState) => {
    return dispatch(FormDataAction.getSplitViewInboxData(id, username, isBM));
  };
export const getPersonalApplicationFileData =
  (pFileName, pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getPersonalApplicationFileData(
        pFileName,
        pageSize,
        pageNumber
      )
    );
  };
export const savePartCaseTag =
  (partcaseID, data, isBM) => (dispatch, getState) => {
    return dispatch(FormDataAction.savePartCaseTag(partcaseID, data, isBM));
  };
export const fetchSplitViewTags =
  (partcaseID, dept, isBM) => (dispatch, getState) => {
    return dispatch(InitiateActions.fetchSplitViewTags(partcaseID, dept, isBM));
  };
export const createPartCaseNotingFile =
  (partcaseID, groupName, isBM) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.createPartCaseNotingFile(partcaseID, groupName, isBM)
    );
  };
export const createCoverLetter =
  (partcaseID, groupName, subject, value, username, department) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.createCoverLetter(
          partcaseID,
          groupName,
          subject,
          value,
          username,
          department
        )
      );
    };

export const PCFileClosuer =
  (inboxID, status, pfileName, branch) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.PCFileClosuer(inboxID, status, pfileName, branch)
    );
  };
export const getHistory = (type, id) => (dispatch, getState) => {
  return dispatch(FormDataAction.getHistory(type, id));
};

export const getHistoryOld = (file, inboxId) => (dispatch, getState) => {
  return dispatch(FormDataAction.getHistoryOld(file, inboxId));
};

export const recallFile = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.recallFile(id));
};

export const moveToMonitor =
  (file, action, fileInventoryId, fileType, subject, creator, residingWith) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.moveToMonitor(
          file,
          action,
          fileInventoryId,
          fileType,
          subject,
          creator,
          residingWith
        )
      );
    };

export const recallToInb = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.recallToInb(id));
};

export const getMonitoredFiles =
  (pageNumber, pageSize, abortSignal) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getMonitoredFiles(pageNumber, pageSize, abortSignal)
    );
  };

export const changeTheme = (value) => (dispatch) => {
  return dispatch({ type: THEME_CHANGE, payload: value });
};
export const currentSign = (value) => (dispatch) => {
  return dispatch({ type: CURRENT_SIGN, payload: value });
};

export const createInstance = (value) => (dispatch) => {
  return dispatch({ type: INSTANCE_CHANGE, payload: value });
};
export const sidenavChange = (value) => (dispatch) => {
  return dispatch({ type: SIDENAV_CHANGE, payload: value });
};

export const myInfo = (value) => (dispatch) => {
  return dispatch({ type: MYINFO_CHANGE, payload: value });
};

export const rollbackPADocument = (id) => (dispatch, getState) => {
  return dispatch(FormDataAction.rollbackPADocument(id));
};
export const rollbackSplitViewDocument =
  (id, flagNumber, fileId, isBM) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.rollbackSplitViewDocument(id, flagNumber, fileId, isBM)
    );
  };

export const rollbackSplitViewEnclosureDocument =
  (id, flagNumber, fileId, isBM) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.rollbackSplitViewEnclosureDocument(
        id,
        flagNumber,
        fileId,
        isBM
      )
    );
  };

export const deleteEnclosure =
  (rolename, pcId, flagnumber, fileId, isBM) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.deleteEnclosure(rolename, pcId, flagnumber, fileId, isBM)
    );
  };
export const deleteNoting =
  (rolename, docId, flagnumber, fileId, isBM) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.deleteNoting(rolename, docId, flagnumber, fileId, isBM)
    );
  };

export const editFlagNumber =
  (pcId, newFlagNumber, oldFlagNumber, roleName, fileId, subject, isBM) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.editFlagNumber(
          pcId,
          newFlagNumber,
          oldFlagNumber,
          roleName,
          fileId,
          subject,
          isBM
        )
      );
    };

export const editEncoSubject =
  (pcId, fileId, subject) => (dispatch, getState) => {
    return dispatch(FormDataAction.editEncoSubject(pcId, fileId, subject));
  };

export const validateFlagNumber =
  (pcId, flagNumber) => (dispatch, getState) => {
    return dispatch(FormDataAction.validateFlagNumber(pcId, flagNumber));
  };

export const getCabinaetData =
  (roleName, department, username, val, pageSize, currentPage, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getCabinaetData(
          roleName,
          department,
          username,
          val,
          pageSize,
          currentPage,
          abortSignal
        )
      );
    };

export const getCabinet =
  (
    roleName,
    department,
    username,
    filter,
    sort,
    pageSize,
    currentPage,
    abortSignal,
    type
  ) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getCabinet(
          roleName,
          department,
          username,
          filter,
          sort,
          pageSize,
          currentPage,
          abortSignal,
          type
        )
      );
    };

export const getDraftFiles =
  (roleName, department, filter, sort, pageSize, currentPage, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getDraftFiles(
          roleName,
          department,
          filter,
          sort,
          pageSize,
          currentPage,
          abortSignal
        )
      );
    };

export const deleteFile = (fileName) => (dispatch, getState) => {
  return dispatch(FormDataAction.deleteFile(fileName));
};

export const editFile = (formData) => (dispatch, getState) => {
  return dispatch(FormDataAction.editFile(formData));
};

export const getIndexData =
  (roleName, department, username, val, pageSize, currentPage, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getIndexData(
          roleName,
          department,
          username,
          val,
          pageSize,
          currentPage,
          abortSignal
        )
      );
    };

export const rollbackAnnexureDocument = (id, value) => (dispatch, getState) => {
  return dispatch(InitiateActions.rollbackAnnexureDocument(id, value));
};

export const updateAnnexureData = (id, newFileName) => (dispatch, getState) => {
  return dispatch(InitiateActions.updateAnnexureData(id, newFileName));
};
export const MoveToBM = (fileId, docId, isBM) => (dispatch) => {
  return dispatch(InitiateActions.MoveToBm(fileId, docId, isBM));
};
export const getSectionData = (department) => (dispatch) => {
  return dispatch(InitiateActions.getSectionData(department));
};

export const MoveToCC = (fileId, docId, isBM) => (dispatch) => {
  return dispatch(InitiateActions.MoveToCC(fileId, docId, isBM));
};

export const getNotification =
  (role, username, deptName) => (dispatch, getState) => {
    return dispatch(InitiateActions.getNotification(role, username, deptName));
  };

export const notificationStatus = (role, username) => (dispatch, getState) => {
  return dispatch(InitiateActions.notificationStatus(role, username));
};

export const deleteNotification = (role, id) => (dispatch, getState) => {
  return dispatch(InitiateActions.deleteNotification(role, id));
};

export const deleteAllNotification =
  (role, username) => (dispatch, getState) => {
    return dispatch(InitiateActions.deleteAllNotification(role, username));
  };

export const returnPA = (id, group) => (dispatch, getState) => {
  return dispatch(FormDataAction.returnPA(id, group));
};

// ADMIN ACTION CREATORS
export const getADasboardCount = (date) => (dispatch, getState) => {
  return dispatch(InitiateActions.getADasboardCount(date));
};

export const getADUsers = (userId) => (dispatch, getState) => {
  return dispatch(InitiateActions.getADUsers(userId));
};

export const getADRoles = (deptName) => (dispatch, getState) => {
  return dispatch(InitiateActions.getADRoles(deptName));
};

export const getADDepartmens = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getADDepartmens());
};
export const loadRtiPartCaseData = (data) => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiPartCaseData(data));
};

export const loadRtiDataSplitView = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getSplitViewRtiData(id));
};

export const rollbackRtiSplitViewDocument =
  (id, flagNumber) => (dispatch, getState) => {
    return dispatch(RtiAction.rollbackRtiSplitViewDocument(id, flagNumber));
  };

export const rollbackRtiSplitViewEnclosureDocument =
  (id, flagNumber) => (dispatch, getState) => {
    return dispatch(
      RtiAction.rollbackRtiSplitViewEnclosureDocument(id, flagNumber)
    );
  };

export const addRTI = (value, role, deptName) => (dispatch, getState) => {
  return dispatch(RtiAction.addRti(value, role, deptName));
};

export const forwardToDepts = (id, data) => (dispatch, getState) => {
  return dispatch(RtiAction.forwardToDepts(id, data));
};

export const getPartcaseEnclosures = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getPartcaseEnclosures(id));
};

export const getPartcaseNoting = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getPartcaseNoting(id));
};

export const getRtiDepartment = () => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiDepartment());
};

export const loadRtiList = (status) => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiList(status));
};

export const uploadRti =
  (id, file, onUploadProgress, deptName) => (dispatch, getState) => {
    return dispatch(RtiAction.uploadRti(id, file, onUploadProgress, deptName));
  };

export const saveRtiFile =
  (id, file, onUploadProgress, deptName) => (dispatch, getState) => {
    return dispatch(
      RtiAction.saveRtiFile(id, file, onUploadProgress, deptName)
    );
  };

export const saveDoc =
  (id, formData, role, userName, isPartCase, fileUrl, isAnnexure) =>
    (dispatch, getState) => {
      return dispatch(
        RtiAction.saveFiles(
          id,
          formData,
          role,
          userName,
          isPartCase,
          fileUrl,
          isAnnexure
        )
      );
    };

export const rtisendFiles =
  (id, data, role, username, displayUserName, pfileName) =>
    (dispatch, getState) => {
      return dispatch(
        RtiAction.rtisendFiles(
          id,
          data,
          role,
          username,
          displayUserName,
          pfileName
        )
      );
    };

export const RtisendFilesInternalServiceNumber =
  (id, data, value, pfileName, body) => (dispatch, getState) => {
    return dispatch(
      RtiAction.RtisendFilesInternalServiceNumber(
        id,
        data,
        value,
        pfileName,
        body
      )
    );
  };

export const RtisendFilesSection =
  (id, data, value, pfileName, body, isReturn) => (dispatch, getState) => {
    return dispatch(
      RtiAction.RtisendFilesSection(id, data, value, pfileName, body, isReturn)
    );
  };

export const returnRti = (id, deptName, username) => (dispatch, getState) => {
  return dispatch(RtiAction.returnRti(id, deptName, username));
};

export const loadRtiRegister = () => (dispatch, getState) => {
  return dispatch(RtiAction.getRtiRegister());
};

// export const RTIURLHide = (url) => (dispatch, getState) => {
//     return dispatch(RtiAction.RTIURLHide(url))
// };

export const sendbackRti = (id, username) => (dispatch, getState) => {
  return dispatch(RtiAction.sendbackRti(id, username));
};

export const getStatus = (type, id) => (dispatch, getState) => {
  return dispatch(RtiAction.getStatus(type, id));
};

export const getDraftStatus = (type, id) => (dispatch, getState) => {
  return dispatch(RtiAction.getDraftStatus(type, id));
};

export const loadFinalreg = () => (dispatch, getState) => {
  return dispatch(RtiAction.getFinalRegister());
};

export const DeleteDraft = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.DeleteDraft(id));
};

export const getFilterStatus = (id, status) => (dispatch, getState) => {
  return dispatch(RtiAction.getFilterStatus(id, status));
};

export const FindByAppeal = (appealNumber) => (dispatch, getState) => {
  return dispatch(RtiAction.FindByAppeal(appealNumber));
};

export const getSearchedData = (search) => (dispatch, getState) => {
  return dispatch(RtiAction.getSearchedData(search));
};

export const getAutoDetails = (appeal) => (dispatch, getState) => {
  return dispatch(RtiAction.getAutoDetails(appeal));
};

export const getdownloadZip = (id) => (dispatch, getState) => {
  return dispatch(RtiAction.getdownloadZip(id));
};

export const deleteEnclosureRti =
  (rolename, pcId, fileName, flagnumber) => (dispatch, getState) => {
    return dispatch(
      RtiAction.deleteEnclosureRti(rolename, pcId, fileName, flagnumber)
    );
  };

export const fetchSplitViewTagsRti =
  (partcaseID, dept) => (dispatch, getState) => {
    return dispatch(RtiAction.fetchSplitViewTagsRti(partcaseID, dept));
  };

export const savePartCaseTagRti =
  (partcaseID, data) => (dispatch, getState) => {
    return dispatch(RtiAction.savePartCaseTagRti(partcaseID, data));
  };

export const PCFileClosuerRti =
  (inboxID, status, pfileName) => (dispatch, getState) => {
    return dispatch(RtiAction.PCFileClosuerRti(inboxID, status, pfileName));
  };

export const sendAuditdata =
  (username, actions, status) => (dispatch, getState) => {
    return dispatch(FormDataAction.sendAuditdata(username, actions, status));
  };

export const getchardata = (time, abortSignal) => (dispatch, getState) => {
  return dispatch(InitiateActions.getchardata(time, abortSignal));
};

export const getauditsearch =
  (auditType, fileNo, filterby, user, role, responseDate, createdOnDate) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getauditsearch(
          auditType,
          fileNo,
          filterby,
          user,
          role,
          responseDate,
          createdOnDate
        )
      );
    };
export const editRtiFlagNumber =
  (pcId, newFlagNumber, oldFlagNumber, roleName, flagNumberMarking) =>
    (dispatch, getState) => {
      return dispatch(
        RtiAction.editRtiFlagNumber(
          pcId,
          newFlagNumber,
          oldFlagNumber,
          roleName,
          flagNumberMarking
        )
      );
    };

export const fetchAddress = (state, district) => (dispatch, getState) => {
  return dispatch(RtiAction.fetchAddress(state, district));
};

// YELLOW NOTES AND REMAKRS SPLITVIEW
export const loadYlwNotesDataSplitview =
  (pcID, pageNumber, pageSize) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getYlowNotesDataSplitview(pcID, pageNumber, pageSize)
    );
  };

export const loadRemarksDataSplitview =
  (pcID, pageNumber, pageSize, department) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getRemarksDataSplitview(
        pcID,
        pageNumber,
        pageSize,
        department
      )
    );
  };

export const addYlowNote =
  (comment, color, fileId, user, roles) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.addYlowNoteSplitview({
        comment,
        color,
        fileId,
        user,
        roles,
      })
    );
  };

export const deleteYlowNote = (id, roleName) => (dispatch, getState) => {
  return dispatch(FormDataAction.deleteYlowNoteSplitview(id, roleName));
};

export const closeFileTemporary = (val) => (dispatch, getState) => {
  return dispatch(FormDataAction.temporaryCloseFileSplitView(val));
};

export const getexternalcabinet =
  (department, pageSize, pageNumber, abortSignal, filter, sort) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.getexternalcabinet(
          department,
          pageSize,
          pageNumber,
          abortSignal,
          filter,
          sort
        )
      );
    };
export const getcabinetpartcase =
  (department, cabinetpartcase, isBM) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getcabinetpartcase(department, cabinetpartcase, isBM)
    );
  };
export const openFile =
  (department, cabinetpartcase) => (dispatch, getState) => {
    return dispatch(FormDataAction.openFile(department, cabinetpartcase));
  };

/*--------------------------------File Module----------------------------------- */
export const createFile = (value, cau) => (dispatch, getState) => {
  return dispatch(FormDataAction.createFile(value, cau));
};
export const getSubSection = (dept) => (dispatch, getState) => {
  return dispatch(FormDataAction.getSubSection(dept));
};
export const getSubSecFiles =
  (department, section, items) => (dispatch, getState) => {
    return dispatch(FormDataAction.getSubSecFiles(department, section, items));
  };

export const getSubSecList =
  (department, section, items) => (dispatch, getState) => {
    return dispatch(FormDataAction.getSubSecList(department, section, items));
  };

export const getBlock = (department, subSection) => (dispatch, getState) => {
  return dispatch(FormDataAction.getBlock(department, subSection));
};

export const getCustodian = (department, value) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCustodian(department, value));
};

export const getMainFiles =
  (body, pageNumber, pageSize) => (dispatch, getState) => {
    return dispatch(FormDataAction.getMainFiles(body, pageNumber, pageSize));
  };

export const createPC = (formData) => (dispatch, getState) => {
  return dispatch(FormDataAction.createPC(formData));
};

export const getLinkedFiles =
  (id, pageNumber, pageSize) => (dispatch, getState) => {
    return dispatch(FormDataAction.getLinkedFiles(id, pageNumber, pageSize));
  };

export const linkFile = (srcId, destId, action) => (dispatch, getState) => {
  return dispatch(FormDataAction.linkFile(srcId, destId, action));
};

export const uploadNotingFile =
  (id, file, subject, config, isInternal, isBM) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadNotingFile(
        id,
        file,
        subject,
        config,
        isInternal,
        isBM
      )
    );
  };
export const scannedNotingFile =
  (id, file, subject, config, isInternal, isBM, fromFlagNumber, toFlagNumber) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.scannedNotingFile(
          id,
          file,
          subject,
          config,
          isInternal,
          isBM,
          fromFlagNumber,
          toFlagNumber
        )
      );
    };

export const scannedEnclosureFile =
  (id, file, subject, config, isInternal, isBM, fromFlagNumber, toFlagNumber) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.scannedEnclosureFile(
          id,
          file,
          subject,
          config,
          isInternal,
          isBM,
          fromFlagNumber,
          toFlagNumber
        )
      );
    };

export const getFlagNumber = (id, isBM) => (dispatch, getState) => {
  return dispatch(FormDataAction.getFlagNumber(id, isBM));
};

/*--------------------------------File Module----------------------------------- */

/*-------------------------------Correspondence----------------------------------- */
export const getAllCorespondence =
  (pageSize, pageNumber, filter, sort, abortSignal) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getAllCorespondence(
        pageSize,
        pageNumber,
        filter,
        sort,
        abortSignal
      )
    );
  };

export const addCorrespondence =
  (subject, type, classification, nofID, nofFileName, priority) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.addCorrespondence(
          subject,
          type,
          classification,
          nofID,
          nofFileName,
          priority
        )
      );
    };

export const addDraftCorrespondence =
  (id, subject, type, classification, nofID, nofFileName, priority) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.addDraftCorrespondence(
          id,
          subject,
          type,
          classification,
          nofID,
          nofFileName,
          priority
        )
      );
    };

export const addMrDraftDak = (file, subject) => (dispatch, getState) => {
  return dispatch(FormDataAction.addMrDraftDak(file, subject));
};

export const getCorespondence = (id, isNotification) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCorespondence(id, isNotification));
};

export const deleteCorrespondence = (corrId) => (dispatch, getState) => {
  return dispatch(FormDataAction.deleteCorrespondence(corrId));
};

export const getCorrAnnexureTableData = (docId) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCorrAnnexureTableData(docId));
};

export const getCorrReferenceTableData = (docId) => (dispatch, getState) => {
  return dispatch(FormDataAction.getCorrReferenceTableData(docId));
};

export const rollbackCorrDocument = (body) => (dispatch, getState) => {
  return dispatch(FormDataAction.rollbackCorrDocument(body));
};

export const uploadCorrespondenceAnnexure =
  (id, file, subject) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadCorrespondenceAnnexure(id, file, subject)
    );
  };

export const uploadScannedDak =
  (id, file, subject) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadScannedDak(id, file, subject)
    );
  };

export const uploadCorrespondenceReference =
  (id, file, subject) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.uploadCorrespondenceReference(id, file, subject)
    );
  };

export const sendInternalCorespondence =
  (id, data, data2, data3, data4, data5, data6, value, pfileName, comment, pendingRoute, completedRoute) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendInternalCorespondence(
          id,
          data,
          data2,
          data3,
          data4,
          data5,
          data6,
          value,
          pfileName,
          comment, pendingRoute, completedRoute
        )
      );
    };

export const sendAsDraft = (corrDocId, roleName) => (dispatch, getState) => {
  return dispatch(FormDataAction.sendAsDraft(corrDocId, roleName));
};

export const sendEyesonlyCorespondence =
  (id, data, data1, data2, value, pfileName, body) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.sendEyesonlyCorespondence(
        id,
        data,
        data1,
        data2,
        value,
        pfileName,
        body
      )
    );
  };
export const sendExternalCorespondence =
  (id, data, data1, data2, external, instruction, comment, pendingRoute, completedRoute) =>
    (dispatch, getState) => {
      return dispatch(
        FormDataAction.sendExternalCorespondence(
          id,
          data,
          data1,
          data2,
          external,
          instruction,
          comment, pendingRoute, completedRoute
        )
      );
    };

export const sendExternalInCorespondence =
  (id, data) => (dispatch, getState) => {
    return dispatch(FormDataAction.sendExternalInCorespondence(id, data));
  };

// To change Routes
export const changeRoutes = (type) => (dispatch, getState) => {
  if (type === "PA") {
    return dispatch({ type: CHANGE_ROUTES_PA });
  } else if (type === "MAIL") {
    return dispatch({ type: CHANGE_ROUTES_MR });
  } else if (type === "ALL") {
    return dispatch({ type: CHANGE_ROUTES_ALL });
  }
};

export const getUniquedata =
  (time, username, abortSignal) => (dispatch, getState) => {
    return dispatch(InitiateActions.getUniquedata(time, username, abortSignal));
  };

export const treeSaved = (time, abortSignal) => (dispatch, getState) => {
  return dispatch(InitiateActions.treeSaved(time, abortSignal));
};

// department merge and split
export const getroledata = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getroledata());
};

export const getroledatavalues = (data) => (dispatch, getState) => {
  return dispatch(InitiateActions.getroledatavalues(data));
};
export const PostSplitdepartmentdta =
  (values, deptName) => (dispatch, getState) => {
    return dispatch(InitiateActions.PostSplitdepartmentdta(values, deptName));
  };

export const sendMeargData =
  (departments, department, togledata) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.sendMeargData(departments, department, togledata)
    );
  };

export const sendMeargDatafinal =
  (departmentList, department, rolesOldAndNew) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.sendMeargDatafinal(
        departmentList,
        department,
        rolesOldAndNew
      )
    );
  };

export const sendAutofilldata = (data) => (dispatch, getState) => {
  // console.log(data);
  return dispatch(InitiateActions.sendAutofilldata(data));
};

export const sendsplfinaldata =
  (result, deptnamedata) => (dispatch, getState) => {
    // console.log(result);
    return dispatch(InitiateActions.sendsplfinaldata(result, deptnamedata));
  };

export const getMailRoomRegister =
  (inwards, pageNumber, pageSize, department) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getMailRoomRegister(
        inwards,
        pageNumber,
        pageSize,
        department
      )
    );
  };

export const getWaitingInbox =
  (role, username, department, pageSize, pageNumber, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.getWaitingInbox(
          role,
          username,
          department,
          pageSize,
          pageNumber,
          abortSignal
        )
      );
    };

export const sendFromWaitingRoom =
  (id, role, username, department, pageSize, pageNumber, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.sendFromWaitingRoom(
          id,
          role,
          username,
          department,
          pageSize,
          pageNumber,
          abortSignal
        )
      );
    };

export const changeMailRoomStatus =
  (id, role, username, department, pageSize, pageNumber, abortSignal) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.changeMailRoomStatus(
          id,
          role,
          username,
          department,
          pageSize,
          pageNumber,
          abortSignal
        )
      );
    };

export const importDocumentFromFile = () => (dispatch, getState) => {
  return dispatch(InitiateActions.importDocumentFromFile());
};

export const importDocument =
  (fromFileId, toFileId, docId, fromBM, isBM) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.importDocument(fromFileId, toFileId, docId, fromBM, isBM)
    );
  };

export const getMailRoomFile = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.getMailRoomFile(id));
};

export const sendToCoord = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.sendToCoord(id));
};
export const getSubSectionFileNameList =
  (subSection, items) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getSubSectionFileNameList(subSection, items)
    );
  };

//------------------------------------- action points-------------------------------------------//

export const addActionTask = (values, role) => (dispatch, getState) => {
  return dispatch(ActionPoints.addActionTask(values, role));
};

export const createActionTask = (values, role) => (dispatch, getState) => {
  return dispatch(ActionPoints.createActionTask(values, role));
};

export const getActionTask =
  (userName, role, pageSize, currentPage, select, filter, completed,
    signal
  ) =>
    (dispatch, getState) => {
      return dispatch(
        ActionPoints.getActionTask(
          userName,
          role,
          pageSize,
          currentPage,
          select,
          filter,
          completed,
          signal
        )
      );
    };
export const assignFurther = (values, roleName) => (dispatch, getState) => {
  const { priority } = values;

  return dispatch(ActionPoints.assignFurthers(values, roleName, priority));
};

export const updateStatus =
  (values, actionId, role) => (dispatch, getState) => {
    return dispatch(ActionPoints.updateStatus(values, actionId, role));
  };
export const PreviousStatus =
  (actionId, assigneePreStatus, pageSize, currentPage, role, boolean) =>
    (dispatch, getState) => {
      return dispatch(
        ActionPoints.previousStatus(
          actionId,
          assigneePreStatus,
          pageSize,
          currentPage,
          role,
          boolean
        )
      );
    };
export const ViewsStatus =
  (actionId, pageSize, currentPage) => (dispatch, getState) => {
    return dispatch(ActionPoints.ViewStatus(actionId, pageSize, currentPage));
  };
export const filesUpload =
  (assignmentId, fileName, deptName, role) => (dispatch, getState) => {
    return dispatch(
      ActionPoints.fileUpload(assignmentId, fileName, deptName, role)
    );
  };
export const uploadEnclosures =
  (taskId, fileName, deptName, role) => (dispatch, getState) => {
    return dispatch(
      ActionPoints.uploadEnclosure(taskId, fileName, deptName, role)
    );
  };

export const viewDetail = (actionId, roleName) => (dispatch, getState) => {
  return dispatch(ActionPoints.viewDetails(actionId, roleName));
};

export const markCompletedByAssignmentId =
  (actionId, markCompleted, role, pazeSize, currentPage) =>
    (dispatch, getState) => {
      return dispatch(
        ActionPoints.markCompletedByAssignmentId(
          actionId,
          markCompleted,
          role,
          pazeSize,
          currentPage
        )
      );
    };
export const markCompleted =
  (actionId, markCompleted, pageSize, currentPage) => (dispatch, getState) => {
    return dispatch(
      ActionPoints.markCompleted(actionId, markCompleted, pageSize, currentPage)
    );
  };

export const filesDownload = (actionId) => (dispatch, getState) => {
  return dispatch(ActionPoints.downloadFiles(actionId));
};
export const refcences = (userName) => (dispatch, getState) => {
  return dispatch(ActionPoints.getrefrence(userName));
};
export const filesDetele =
  (id, flagNumber, actionId, roleName) => (dispatch, getState) => {
    return dispatch(
      ActionPoints.deleteFile(id, flagNumber, actionId, roleName)
    );
  };
export const viewTaskDetails = (id) => (dispatch, getState) => {
  return dispatch(ActionPoints.viewTaskDetails(id));
};
export const showAllAssignTaskUsers =
  (assignmentId, pageSize, currentPage) => (dispatch, getState) => {
    return dispatch(
      ActionPoints.showAllAssignTaskUsers(assignmentId, pageSize, currentPage)
    );
  };
export const getAllFiles = (fileName) => (dispatch, getState) => {
  return dispatch(ActionPoints.getAllFiles(fileName));
};

export const loadInternalcommentDataSplitview =
  (pcID, pageNumber, pageSize, department) => (dispatch, getState) => {
    return dispatch(
      FormDataAction.getInternalcommentDataSplitview(
        pcID,
        pageNumber,
        pageSize,
        department
      )
    );
  };

export const cumulatedStatus =
  (id, pageSize, currentPage) => (dispatch, getState) => {
    return dispatch(ActionPoints.cumulatedStatus(id, pageSize, currentPage));
  };
export const givenInstruction =
  (value, actionId, priority) => (dispatch, getState) => {
    return dispatch(ActionPoints.givenInstruction(value, actionId, priority));
  };
export const previousInstructions =
  (actionId, boolean, role) => (dispatch, getState) => {
    return dispatch(ActionPoints.previousInstructions(actionId, boolean, role));
  };

export const personalizeAction =
  (userName, paFile, pa, tab, role, dark, language, penColor, muiTableData) =>
    (dispatch, getState) => {
      return dispatch(
        InitiateActions.personalizeAction(
          userName,
          paFile,
          pa,
          tab,
          role,
          dark,
          language,
          penColor,
          muiTableData
        )
      );
    };

export const getpersonalizeAction = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getpersonalizeAction());
};

// DEPARTMENT ADMIN

export const getAdminData = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getAdminData());
};

export const getAllRoles = (pageNumber, pageSize) => (dispatch, getState) => {
  return dispatch(InitiateActions.getAllRoles(pageNumber, pageSize));
};

export const updateAdminData = (coordRole) => (dispatch, getState) => {
  return dispatch(InitiateActions.updateAdminData(coordRole));
};

export const updateAdminRole = (currRole) => (dispatch, getState) => {
  return dispatch(InitiateActions.updateAdminRole(currRole));
};

export const getSeries =
  (section, pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(InitiateActions.getSeries(section, pageSize, pageNumber));
  };

export const getSections = (pageNumber, pageSize) => (dispatch, getState) => {
  return dispatch(InitiateActions.getSections(pageNumber, pageSize));
};

export const updateSeries =
  (labelRange, labelData, section) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.updateSeries(labelRange, labelData, section)
    );
  };

export const addSection = (section, range) => (dispatch, getState) => {
  return dispatch(InitiateActions.addSection(section, range));
};

export const delSection = (section, range) => (dispatch, getState) => {
  return dispatch(InitiateActions.delSection(section, range));
};

export const getHelpDesk =
  (deptName, pageSize, pageNumber) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getHelpDesk(deptName, pageSize, pageNumber)
    );
  };

export const getDepts = () => (dispatch, getState) => {
  return dispatch(InitiateActions.getDepts());
};

export const createEric =
  (subject, ericType, date, time, type) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.createEric(subject, ericType, date, time, type)
    );
  };

export const editEric =
  (id, subject, ericType, date, time, type) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.editEric(id, subject, ericType, date, time, type)
    );
  };

export const getAllEric =
  (pageNumber, pageSize, today, abortSignal) => (dispatch, getState) => {
    return dispatch(
      InitiateActions.getAllEric(pageNumber, pageSize, today, abortSignal)
    );
  };

export const deleteEric = (id) => (dispatch, getState) => {
  return dispatch(InitiateActions.deleteEric(id));
};

export const getDashboardCount = () => (dispatch, getState) => {
  return dispatch(FormDataAction.getDashboardCount());
};

export const getLast5Days = () => (dispatch, getState) => {
  return dispatch(FormDataAction.getLast5Days());
};

export const updateMonitor =
  (val, fileName, status) => (dispatch, getState) => {
    return dispatch(FormDataAction.updateMonitor(val, fileName, status));
  };
export const getEnclosureInfo = (id) => (dispatch, getState) => {
  return dispatch(ActionPoints.getEnclosureInfo(id));
};
export const assigneeFileUpload = (file, actionId) => (dispatch, getState) => {
  return dispatch(ActionPoints.assigneeFileUpload(file, actionId));
};
