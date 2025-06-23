import * as AT from "../../constants/ActionTypes";
import { BACK_API } from "../../../../middleware/backend";
import { BACK_API1 } from "../../../../middleware/backendPA";
import { BACKEND_API_MISS } from "../../../../middleware/backendMIS";
import localStorageService from "../../../../services/localStorageService";
import { BACK_USER_MANAGEMENT_API } from "../../../../middleware/backend_userManagement";
import { BACK_CREATEPF_API } from "app/middleware/backend_createPF";
import { BACK_CREATEPA_API } from "app/middleware/backend_createPA";
import { BACK_UTIL_API } from "app/middleware/backend_util";
import { BACK_ANNEXURE_API } from "app/middleware/backend_annexure";
import { BACK_ADVANCESEARCH_API } from "app/middleware/advance_search";
import { BACK_RETRIEVAL_API } from "app/middleware/backend_retrieval";
import { NOTIFICATION_SERVICE } from "app/middleware/notification_service";
import { BACK_PC_API } from "app/middleware/backend_partCase";
import { URL_HIDE } from "app/middleware/URL_hide";
import { BACK_ADASBOARD_COUNT_API } from "app/middleware/Admin/backend_admin_dashboard";
import { BACK_ADMIN_USERS_API } from "app/middleware/Admin/backend_admin_users";
import { BACK_ADMIN_ROLES_API } from "app/middleware/Admin/backend_admin_roles";
import { BACK_ADMIN_DEPARTMENTS_API } from "app/middleware/Admin/backend_admin_departments";
import { SPLIT_DEPARTMENT_API } from "app/middleware/split_department";
import { BACKEND_FILE } from "app/middleware/backend_file";
import { BACK_CREATECORRESPONDENCE_API } from "app/middleware/backend_correspondence";
import { BACK_HRM_API } from "app/middleware/backend_hrm";
import { BACK_FORWARD_API } from "app/middleware/backend_forward";
import { BACK_DEPT_ADMIN } from "app/middleware/backend_dept_admin";

export const getClassificationData = () => ({
  [BACK_API]: {
    types: [
      AT.CLASSIFICATION_REQUEST,
      AT.CLASSIFICATION_SUCCESS,
      AT.CLASSIFICATION_FAILURE,
    ],
    endpoint: `/api/getFileClassification`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getTypeData = () => ({
  [BACK_API]: {
    types: [AT.TYPE_REQUEST, AT.TYPE_SUCCESS, AT.TYPE_FAILURE],
    endpoint: `/api/getFileType`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getRolesData = () => ({
  [BACK_API]: {
    types: [AT.ROLES_REQUEST, AT.ROLES_SUCCESS, AT.ROLES_FAILURE],
    endpoint: `/api/getRoles`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});
export const getUserRolesData = (username) => ({
  [BACK_USER_MANAGEMENT_API]: {
    types: [
      AT.USER_ROLES_REQUEST,
      AT.USER_ROLES_SUCCESS,
      AT.USER_ROLES_FAILURE,
    ],
    endpoint: `/api/getUserRoles`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username || localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sideNav = (value, isServiceNumber, isRole) => ({
  [BACK_USER_MANAGEMENT_API]: {
    types: [AT.SIDENAV_REQUEST, AT.SIDENAV_SUCCESS, AT.SIDENAV_FAILURE],
    endpoint: `/api/sidenav`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        dropdown: value,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getGroupsData = () => ({
  [BACK_API]: {
    types: [AT.GROUPS_REQUEST, AT.GROUPS_SUCCESS, AT.GROUPS_FAILURE],
    endpoint: `/api/getGroups`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getDraftData = (role) => ({
  [BACK_API]: {
    types: [
      AT.DRAFT_DATA_FAILURE,
      AT.DRAFT_DATA_SUCCESS,
      AT.DRAFT_DATA_REQUEST,
    ],
    endpoint: `/api/getDraftData`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getOutboxData = (
  role,
  username,
  pageSize,
  pageNumber,
  Date,
  filter,
  sort,
  abortSignal
) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.OUTBOX_DATA_REQUEST,
      AT.OUTBOX_DATA_SUCCESS,
      AT.OUTBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getOutboxData`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        pageSize: pageSize,
        pageNumber: pageNumber,
      },
      body: JSON.stringify({ ...filter, ...sort }),
    },
  },
});

export const getDataForExport = (role, username, ranges) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.OUTBOX_DATA_EXPORT_REQUEST,
      AT.OUTBOX_DATA_EXPORT_SUCCESS,
      AT.OUTBOX_DATA_EXPORT_FAILURE,
    ],
    endpoint: `/api/exportOutboxData`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(ranges),
    },
  },
});

export const getOutboxRow = (id, isBM) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.OUTBOX_ROW_REQUEST,
      AT.OUTBOX_ROW_SUCCESS,
      AT.OUTBOX_ROW_FAILURE,
    ],
    endpoint: `/api/getOutbox/${id}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        isBM
      },
    },
  },
});

export const getInboxData = (
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
) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.INBOX_DATA_REQUEST,
      AT.INBOX_DATA_SUCCESS,
      AT.INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getInboxData2`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        filter: selectedMenuItem,
        pending,
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify({ ...filter, ...sort }),
    },
  },
});

export const getMrInboxData = (
  role,
  username,
  department,
  pageSize,
  pageNumber,
  selectedMenuItem,
  val,
  abortSignal
) => ({
  [BACK_HRM_API]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getMailRoomInbox`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const moveToPending = (id) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.MOVE_TO_PENDING_REQUEST,
      AT.MOVE_TO_PENDING_SUCCESS,
      AT.MOVE_TO_PENDING_FAILURE,
    ],
    endpoint: `/api/pending`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: sessionStorage.getItem("role"),
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(id),
    },
  },
});

export const moveToNfa = (id) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.MOVE_TO_NFA_REQUEST,
      AT.MOVE_TO_NFA_SUCCESS,
      AT.MOVE_TO_NFA_FAILURE,
    ],
    endpoint: `/api/nfa/${id}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: sessionStorage.getItem("role"),
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getMailRoomData = (role, username, department, id) => ({
  [BACK_HRM_API]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getMailRoom/${id}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendFromMailRoom = (role, username, department, id) => ({
  [BACK_HRM_API]: {
    types: [
      AT.SEND_MAIL_ROOM_REQUEST,
      AT.SEND_MAIL_ROOM_SUCCESS,
      AT.SEND_MAIL_ROOM_FAILURE,
    ],
    endpoint: `/api/sendFromMailRoom/${id}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const downloadMailRoom = (role, username, department, id) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.DOWNLOAD_MAIL_ROOM_REQUEST,
      AT.SEND_MAIL_ROOM_SUCCESS,
      AT.SEND_MAIL_ROOM_FAILURE,
    ],
    endpoint: `/api/v2/downloadFromMailroom/${id}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getEnclosureData = (id) => ({
  [BACK_API]: {
    types: [
      AT.ENCLOSURE_DATA_FAILURE,
      AT.ENCLOSURE_DATA_REQUEST,
      AT.ENCLOSURE_DATA_SUCCESS,
    ],
    endpoint: `/api/enclosure/data/` + id,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getNotingData = (id) => ({
  [BACK_API]: {
    types: [
      AT.NOTING_DATA_FAILURE,
      AT.NOTING_DATA_REQUEST,
      AT.NOTING_DATA_SUCCESS,
    ],
    endpoint: `/api/noting/data/` + id,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getFileUrl = (url) => ({
  [BACK_API]: {
    types: [AT.FILE_FAILURE, AT.FILE_REQUEST, AT.FILE_SUCCESS],
    endpoint: `/api/fileUrl`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        url: url,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getSfdt = (url, username, id, role, grp) => ({
  [BACK_UTIL_API]: {
    types: [AT.SFDT_FAILURE, AT.SFDT_REQUEST, AT.SFDT_SUCCESS],
    endpoint: `/api/sfdt`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        url: url,
        userName: username,
        fileId: id,
        roleName: role,
        groupName: grp,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getTemplate = () => ({
  [BACK_UTIL_API]: {
    types: [AT.TEMPLATE_FAILURE, AT.TEMPLATE_REQUEST, AT.TEMPLATE_SUCCESS],
    endpoint: `/api/uploadTemplates`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        department: sessionStorage.getItem("department"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getReadStatus = (inboxId, readStatus) => ({
  [BACK_RETRIEVAL_API]: {
    types: [AT.STATUS_REQUEST, AT.STATUS_SUCCESS, AT.STATUS_FAILURE],
    endpoint: `/api/inboxStatus`,
    settings: {
      method: "POST",
      body: JSON.stringify(inboxId),
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        status: readStatus,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getFlagStatus = (inboxId) => ({
  [BACK_RETRIEVAL_API]: {
    types: [AT.FLAG_REQUEST, AT.FLAG_SUCCESS, AT.FLAG_FAILURE],
    endpoint: `/api/flagInbox`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inboxId: inboxId,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPinInboxId = (inboxId) => ({
  [BACK_RETRIEVAL_API]: {
    types: [AT.PIN_REQUEST, AT.PIN_SUCCESS, AT.PIN_FAILURE],
    endpoint: `/api/pinInbox`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inboxId: inboxId,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const URLHide = (url) => ({
  [URL_HIDE]: {
    types: [AT.TEST_URL_REQUEST, AT.TEST_URL_SUCCESS, AT.TEST_URL_FAILURE],
    endpoint: `/api/url?urls=${encodeURIComponent(url)}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getFav = () => ({
  [BACK_USER_MANAGEMENT_API]: {
    types: [AT.GET_FAV_REQUEST, AT.GET_FAV_SUCCESS, AT.GET_FAV_FAILURE],
    endpoint: `/api/getFavList`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const setFav = (body) => ({
  [BACK_USER_MANAGEMENT_API]: {
    types: [AT.SET_FAV_REQUEST, AT.SET_FAV_SUCCESS, AT.SET_FAV_FAILURE],
    endpoint: `/api/createFavorite`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(body)
    },
  },
});

export const deleteFav = (id) => ({
  [BACK_USER_MANAGEMENT_API]: {
    types: [AT.DELETE_FAV_REQUEST, AT.DELETE_FAV_SUCCESS, AT.DELETE_FAV_FAILURE],
    endpoint: `/api/delete`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        id
      },
    },
  },
});

export const getFileTypeData = () => ({
  [BACK_API]: {
    types: [AT.PATYPE_REQUEST, AT.PATYPE_SUCCESS, AT.PATYPE_FAILURE],
    endpoint: `/api/getPersonalFileType`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPF = (username, role, pageSize, pageNumber, value) => ({
  [BACK_CREATEPF_API]: {
    types: [AT.PF_REQUEST, AT.PF_SUCCESS, AT.PF_FAILURE],
    endpoint: `/api/getPersonalFile`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(value),
    },
  },
});

export const getPFileData = (username, role) => ({
  [BACK_CREATEPF_API]: {
    types: [AT.PFILE_REQUEST, AT.PFILE_SUCCESS, AT.PFILE_FAILURE],
    endpoint: `/api/getPFile`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPATableData = (username, role, pageSize, pageNumber) => ({
  [BACK_CREATEPA_API]: {
    types: [AT.PA_TABLE_REQUEST, AT.PA_TABLE_SUCCESS, AT.PA_TABLE_FAILURE],
    endpoint: `/api/getApplicationData`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPADashboardData = (
  username,
  role,
  department,
  pageSize,
  pageNumber,
  value,
  abortSignal
) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.PA_DASHBOARD_REQUEST,
      AT.PA_DASHBOARD_SUCCESS,
      AT.PA_DASHBOARD_FAILURE,
    ],
    endpoint: `/api/getDashboardData`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(value),
    },
  },
});

export const getAnnexureTableData = (userName, roleName, department, id) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.ANNEXURE_LIST_REQUEST,
      AT.ANNEXURE_LIST_SUCCESS,
      AT.ANNEXURE_LIST_FAILURE,
    ],
    endpoint: `/api/getAnnexureData/${id ? id : userName}`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

// export const getMISTableData = (value) => ({
//     [BACKEND_API_MISS]: {
//         types: [ AT.MIS_LIST_REQUEST, AT.MIS_LIST_SUCCESS, AT.MIS_LIST_FAILURE ],
//         endpoint: `/api/gethierarchyParent1List`,
//         settings: {
//             method: 'POST',
//             body: value,
//             headers: { }
//         }
//     }
//
// });

export const getMISTableData = (value) => ({
  [BACKEND_API_MISS]: {
    types: [AT.MIS_LIST_REQUEST, AT.MIS_LIST_SUCCESS, AT.MIS_LIST_FAILURE],
    endpoint: `/api/getSauData`,
    settings: {
      method: "GET",
      headers: {
        groupName: value,
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});
export const getMISDetailTableData = (value) => ({
  [BACKEND_API_MISS]: {
    types: [
      AT.MIS_DETAIL_LIST_REQUEST,
      AT.MIS_DETAIL_LIST_SUCCESS,
      AT.MIS_DETAIL_LIST_FAILURE,
    ],
    endpoint: `/api/gettotalfiles`,
    settings: {
      method: "POST",
      body: value,
      headers: {
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteAnnexureData = (id) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.DELETE_ANNEXURE_REQUEST,
      AT.DELETE_ANNEXURE_SUCCESS,
      AT.DELETE_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/deleteAnnexureData/` + id,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const closeCorrespondence = (inboxId) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.CLOSE_CORR_ANNEXURE_REQUEST,
      AT.CLOSE_CORR_ANNEXURE_SUCCESS,
      AT.CLOSE_CORR_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/v2/closeCorrespondence`,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        inboxId,
      },
    },
  },
});

export const discardCorrespondence = (inboxId) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.DISCARD_CORR_ANNEXURE_REQUEST,
      AT.DISCARD_CORR_ANNEXURE_SUCCESS,
      AT.DISCARD_CORR_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/v2/discardCorrespondence`,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        inboxId,
      },
    },
  },
});

export const loadIndexData = (fileId, pageSize, pageNumber, val) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.LOAD_INDEX_FILE_REQUEST,
      AT.LOAD_INDEX_FILE_SUCCESS,
      AT.LOAD_INDEX_FILE_FAILURE,
    ],
    endpoint: `/api/v2/getIndexCorrDoc`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        pageSize,
        fileId,
        pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(val),
    },
  },
});

export const copyCorrespondence = (toDocId, fromDocIds, desDocType) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [AT.COPY_CORR_REQUEST, AT.COPY_CORR_SUCCESS, AT.COPY_CORR_FAILURE],
    endpoint: `/api/v2/copyFromCorrespondence`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify({
        toDocId,
        fromDocIds,
        desDocType,
      }),
    },
  },
});

export const deleteCorrAnnexureData = (corrDocId, flagNumber, fileId) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.DELETE_CORR_ANNEXURE_REQUEST,
      AT.DELETE_CORR_ANNEXURE_SUCCESS,
      AT.DELETE_CORR_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/v2/delete-annexure`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        corrDocId,
        flagNumber,
        fileId,
      },
    },
  },
});

export const updateCorrAnnexure = (corrDocId, isAnnexure, fileId, subject) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.UPDATE_CORR_ANNEXURE_REQUEST,
      AT.UPDATE_CORR_ANNEXURE_SUCCESS,
      AT.UPDATE_CORR_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/v2/updateDoc`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        corrDocId,
        isAnnexure,
        fileId,
        subject,
      },
    },
  },
});

export const deleteCorrReferenceData = (corrDocId, flagNumber, fileId) => ({
  [BACK_CREATECORRESPONDENCE_API]: {
    types: [
      AT.DELETE_CORR_REFERENCE_REQUEST,
      AT.DELETE_CORR_REFERENCE_SUCCESS,
      AT.DELETE_CORR_REFERENCE_FAILURE,
    ],
    endpoint: `/api/v2/delete-reference`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        corrDocId,
        flagNumber,
        fileId,
      },
    },
  },
});

export const rollbackAnnexureDocument = (id, value) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.ROLLBACK_PA_REQUEST,
      AT.ROLLBACK_PA_SUCCESS,
      AT.ROLLBACK_PA_FAILURE,
    ],
    endpoint: `/api/annexure/${id}`,
    settings: {
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        edit: value,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteEnclosure = (rolename, pcId, flagnumber, fileId, isBM) => ({
  [BACK_PC_API]: {
    types: [
      AT.ENCLOSURE_DATA_REQUEST,
      AT.ENCLOSURE_DATA_SUCCESS,
      AT.ENCLOSURE_DATA_FAILURE,
    ],
    endpoint: `/api/deleteEnclosure`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: rolename,
        pcId: pcId,
        flagnumber: flagnumber,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        fileId,
        isBM,
      },
    },
  },
});
export const deleteNoting = (rolename, docId, flagnumber, fileId, isBM) => ({
  [BACKEND_FILE]: {
    types: [
      AT.ENCLOSURE_DATA_REQUEST,
      AT.ENCLOSURE_DATA_SUCCESS,
      AT.ENCLOSURE_DATA_FAILURE,
    ],
    endpoint: `/api/deleteNoting`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: rolename,
        docId: docId,
        flagnumber: flagnumber,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        fileId,
        isBM,
      },
    },
  },
});

export const updateAnnexureData = (id, newFileName) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.UPDATE_ANNEXURE_REQUEST,
      AT.UPDATE_ANNEXURE_SUCCESS,
      AT.UPDATE_ANNEXURE_FAILURE,
    ],
    endpoint: `/api/renameAnnexure/` + id,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        rename: newFileName,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const MoveToBm = (fileId, docId, isBM) => ({
  [BACKEND_FILE]: {
    types: [AT.MOVE_BM_REQUEST, AT.MOVE_BM_SUCCESS, AT.MOVE_BM_FAILURE],
    endpoint: `/api/moveToBM`,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        fileId,
        docId,
        isBM,
      },
    },
  },
});

export const getSectionData = (department) => ({
  [BACKEND_FILE]: {
    types: [
      AT.GET_SECTION_REQUEST,
      AT.GET_SECTION_SUCCESS,
      AT.GET_SECTION_FAILURE,
    ],
    endpoint: `/api/getSection`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        department,
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      },
    },
  },
});

export const MoveToCC = (fileId, docId, isBM) => ({
  [BACKEND_FILE]: {
    types: [AT.MOVE_BM_REQUEST, AT.MOVE_BM_SUCCESS, AT.MOVE_BM_FAILURE],
    endpoint: `/api/moveToCC`,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        fileId,
        docId,
        isBM,
      },
    },
  },
});

export const createPANotingData = (
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
) => ({
  [BACK_PC_API]: {
    types: [
      AT.CREATE_PANOTING_REQUEST,
      AT.CREATE_PANOTING_SUCCESS,
      AT.CREATE_PANOTING_FAILURE,
    ],
    endpoint: `/api/createPartCaseFile?fileNumber=${personName}`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: roleName,
        username: userName,
        department: groupName,
        fileTrackId: fileTrackID,
        nofFileID: nofFileID,
        fileNo: fileNumber,
        custodian: custodian,
        isServiceLetter,
        serviceLetterId: isServiceLetter ? serviceLetterId : "",
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(nofRowData),
    },
  },
});

export const addPANotingData = (
  userName,
  groupName,
  serviceLetterId,
  inboxid
) => ({
  [BACK_PC_API]: {
    types: [
      AT.ADD_PANOTING_REQUEST,
      AT.ADD_PANOTING_SUCCESS,
      AT.ADD_PANOTING_FAILURE,
    ],
    endpoint: `/api/addToPartCase`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: userName,
        department: groupName,
        serviceLetterId: serviceLetterId,
        inboxid,
        roleName: sessionStorage.getItem("role"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const createPartCaseServiceLetter = (
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
) => ({
  [BACK_PC_API]: {
    types: [
      AT.CREATE_COVER_LETTER_REQUEST,
      AT.CREATE_COVER_LETTER_SUCCESS,
      AT.CREATE_SERVICE_LETTER_FAILURE,
    ],
    endpoint: `/api/createPartCaseServiceLetter`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: roleName,
        userName: userName,
        nofFileID: nofFileID,
        grp: groupName,
        fileNo: fileNumber,
        custodian: custodian,
        inboxId: inboxId,
        partcaseId: partcaseId,
        fileNumber: personName,
        serviceLetterId: serviceLetterId,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPANotingData = (id) => ({
  [BACK_API]: {
    types: [
      AT.FETCH_PANOTING_REQUEST,
      AT.FETCH_PANOTING_SUCCESS,
      AT.FETCH_PANOTING_FAILURE,
    ],
    endpoint: `/api/getPANotingData/` + id,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPAEnclosureData = (ids, id, role, groupName) => ({
  [BACK_API]: {
    types: [
      AT.FETCH_PAENCLOSURE_REQUEST,
      AT.FETCH_PAENCLOSURE_SUCCESS,
      AT.FETCH_PAENCLOSURE_FAILURE,
    ],
    endpoint: `/api/getPAEnclosureData/` + id,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        inboxId: ids,
        grp: groupName,
        userName: localStorage.getItem("username"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getPADraftTableData = (
  username,
  role,
  dept,
  pageSize,
  pageNumber,
  value,
  abortSignal
) => ({
  [BACK_CREATEPA_API]: {
    types: [AT.PADRAFT_REQUEST, AT.PADRAFT_SUCCESS, AT.PADRAFT_FAILURE],
    endpoint: `/api/getApplicationData`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        roleName: role,
        department: dept,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify(value),
    },
  },
});

export const getPersonalApplicationFileData = (
  pFileName,
  pageSize,
  pageNumber
) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.PA_FILE_DATA_REQUEST,
      AT.PA_FILE_DATA_SUCCESS,
      AT.PA_FILE_DATA_FAILURE,
    ],
    endpoint: `/api/getPersonalApplicationFileData/` + pFileName,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        pageSize: pageSize,
        pageNumber: pageNumber,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const fetchSplitViewTags = (partcaseID, dept, isBM) => ({
  [BACK_PC_API]: {
    types: [
      AT.FETCH_PARTCASE_TAG_REQUEST,
      AT.FETCH_PARTCASE_TAG_SUCCESS,
      AT.FETCH_PARTCASE_TAG_FAILURE,
    ],
    endpoint: `/api/fetch-tags/` + partcaseID,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        grp: dept,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        isBM,
      },
    },
  },
});

export const getNotification = (role, username, deptName) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.GET_NOTIFICATION_REQUEST,
      AT.GET_NOTIFICATION_SUCCESS,
      AT.GET_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/notification`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: deptName,
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const notificationStatus = (role, username) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.STATUS_NOTIFICATION_REQUEST,
      AT.STATUS_NOTIFICATION_SUCCESS,
      AT.STATUS_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/notification/change-status`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteNotification = (role, id) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.DELETE_NOTIFICATION_REQUEST,
      AT.DELETE_NOTIFICATION_SUCCESS,
      AT.DELETE_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/delete_notification/` + id,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        // 'role': role,
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const deleteAllNotification = (role, username) => ({
  [NOTIFICATION_SERVICE]: {
    types: [
      AT.DELETE_ALL_NOTIFICATION_REQUEST,
      AT.DELETE_ALL_NOTIFICATION_SUCCESS,
      AT.DELETE_ALL_NOTIFICATION_FAILURE,
    ],
    endpoint: `/api/delete_all_notification/`,
    settings: {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

// ADMIN MODULE

export const getADasboardCount = (date) => ({
  [BACK_ADASBOARD_COUNT_API]: {
    types: [
      AT.ADMIN_DBOARD_COUNT_REQUEST,
      AT.ADMIN_DBOARD_COUNT_SUCCESS,
      AT.ADMIN_DBOARD_COUNT_FAILURE,
    ],
    endpoint: `/dataCount`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: date,
    },
  },
});

export const getADUsers = (userId) => ({
  [BACK_ADMIN_USERS_API]: {
    types: [
      AT.GET_ADMIN_USERS_REQUEST,
      AT.GET_ADMIN_USERS_SUCCESS,
      AT.GET_ADMIN_USERS_FAILURE,
    ],
    endpoint: `/UsersTable`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: userId,
    },
  },
});

export const getADRoles = (deptName) => ({
  [BACK_ADMIN_ROLES_API]: {
    types: [
      AT.GET_ADMIN_ROLES_REQUEST,
      AT.GET_ADMIN_ROLES_SUCCESS,
      AT.GET_ADMIN_ROLES_FAILURE,
    ],
    endpoint: `/RolesTable`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: deptName,
    },
  },
});

export const getADDepartmens = () => ({
  [BACK_ADMIN_DEPARTMENTS_API]: {
    types: [
      AT.GET_ADMIN_DEPARTMENTS_REQUEST,
      AT.GET_ADMIN_DEPARTMENTS_SUCCESS,
      AT.GET_ADMIN_DEPARTMENTS_FAILURE,
    ],
    endpoint: `/DepartmentsTable`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

/***************************************Advance Search************************************** */

export const getAdvanceSearch = (
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
) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/text-Cabinet?${createdbynamess && `CreatedBy=${createdbynamess}`
      }&${filenamess && `PcFileNumber=${filenamess}`}&${contentnamess && `Text=${contentnamess.slice(0, 100) + "..."}`
      }&${sendbynamess && `SendBy=${sendbynamess}`}&${from && `Datefrom=${from}`
      }&${to && `Dateto=${to}`}&${subjectnamess && `Subject=${subjectnamess}`}&${oldfilerefs && `Oldref=${oldfilerefs}`
      }&${apiObj?.barCreated && `CreatedBy=${apiObj?.barCreated}`}&${apiObj?.barType && `Type=${apiObj?.barType}`
      }&${apiObj?.barSend && `SendBy=${apiObj?.barSend}`}&${apiObj?.barDate && `SType=${apiObj?.barDate}`
      }&${apiObj?.barDocumenttype && `DocumentType=${apiObj?.barDocumenttype}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
        size: size,
      },
    },
  },
});

export const getContentData = (value, rolename, department) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/text-CabinetAutoSuggest?Text=${value}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename,
        department,
      },
    },
  },
});
export const getSendData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/sendBy-autoSuggest?${value && `SendBy=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getFilenumberData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/pcFileNumber-autoSuggest?${value && `PcFileNumber=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getSubjectData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/subject-autoSuggest?${value && `Subject=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getCreatedData = (value, rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/createdBy-autoSuggest?${value && `CreatedBy=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        rolename: rolename,
      },
    },
  },
});

export const getCabinetStatus = (rolename) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/getStatusList?rolename=${rolename}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
      },
    },
  },
});

export const updateSubjectFileForm = (subject, id) => ({
  [BACK_CREATEPF_API]: {
    types: [
      AT.UPDATE_SUBJECT_FILE_REQUEST,
      AT.UPDATE_SUBJECT_FILE_SUCCESS,
      AT.UPDATE_SUBJECT_FILE_FAILURE,
    ],
    endpoint: `/api/editSubject`,
    settings: {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
      },
      body: JSON.stringify({
        newSubject: subject,
        id: id,
      }),
    },
  },
});

export const getchardata = (time, abortSignal) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.FETCH_BARCHAT_REQUEST,
      AT.FETCH_BARCHAT_SUCCESS,
      AT.FETCH_BARCHAT_FAILURE,
    ],
    endpoint: `/api/getRating`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        time: time,
      },
    },
  },
});

export const getauditsearch = (
  auditType,
  fileNo,
  filterby,
  user,
  role,
  responseDate,
  createdOnDate
) => ({
  [BACK_ANNEXURE_API]: {
    types: [
      AT.FETCH_AUDIT_REQUEST,
      AT.FETCH_AUDIT_SUCCESS,
      AT.FETCH_AUDIT_FAILURE,
    ],
    endpoint: `/api/search`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        auditType: auditType,
        fileNo: fileNo,
        filterBy: filterby,
        user: user,
        role: role,
        responseDate: responseDate,
        createdOnDate: createdOnDate,
      },
    },
  },
});

/********************************Advance Search*********************************/

export const loadAdvanceSearch = (
  val,
  text,
  roleName,
  pageSize,
  currentPage,
  userName,
  department,
  section,
  filter,
  fileNo,
  sendBy,
  CreatedBy,
  Subject,
  Status,
  scope
) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/advance-searchCabinet?${`Text=${val ? encodeURIComponent(val) : encodeURIComponent(text)
      }&Section=${section}&Updated=${filter}&FileNumber=${fileNo}&SendBy=${sendBy}&CreatedBy=${CreatedBy}&Subject=${Subject}&Status=${Status}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        pageSize,
        pageNumber: currentPage,
        userName,
        department,
        sessionId: sessionStorage.getItem("sessionId"),
        section,
        scope,
      },
    },
  },
});

export const loadContentData = (
  value,
  roleName,
  department,
  userName,
  scope
) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/text-CabinetAutoSuggest?${value && `Text=${encodeURIComponent(value)}`
      }`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadCabinetStatus = (roleName, department, userName, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: "/status-autoSuggestCab",
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        department,
        userName,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadSendBy = (value, roleName, userName, department, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/sendBy-autoSuggestCab?${value && `SendBy=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadCreatedBy = (
  value,
  roleName,
  userName,
  department,
  scope
) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/createdBy-autoSuggest?${value && `CreatedBy=${encodeURIComponent(value)}`
      }`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const laodFileNo = (value, roleName, userName, department, scope) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/fileNumber-autoSuggest?${value && `FileNumber=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

export const loadCabinetSubject = (
  value,
  roleName,
  userName,
  department,
  scope
) => ({
  [BACK_ADVANCESEARCH_API]: {
    types: [
      AT.ADVANCE_SEARCH_REQUEST,
      AT.ADVANCE_SEARCH_SUCCESS,
      AT.ADVANCE_SEARCH_FAILURE,
    ],
    endpoint: `/subject-autoSuggestCab?${value && `Subject=${value}`}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName,
        userName,
        department,
        scope,
        sessionId: sessionStorage.getItem("sessionId"),
      },
    },
  },
});

/********************************Advance Search*********************************/

/*-----------------------------Audit Search-----------------------------*/

export const getUniquedata = (time, username, abortSignal) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.GET_UNIQUE_USERS_REQUEST,
      AT.GET_UNIQUE_USERS_SUCCES,
      AT.GET_UNIQUE_USERS_FAILUER,
    ],
    endpoint: `/api/uniqueUsers`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: username,
        deptName: sessionStorage.getItem("department"),
        time: time,
      },
    },
  },
});

export const treeSaved = (time, abortSignal) => ({
  [BACK_CREATEPA_API]: {
    types: [
      AT.GET_TREE_SAVED_REQUEST,
      AT.GET_TREE_SAVED_SUCCES,
      AT.GET_TREE_SAVED_FAILUER,
    ],
    endpoint: `/api/treesSaved`,
    settings: {
      method: "POST",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        time: time,
      },
    },
  },
});

/*-----------------------------Audit Search-----------------------------*/
export const getroledata = () => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.GET_DEPARTMENT_ROLE_REQUEST,
      AT.GET_DEPARTMENT_ROLE_SUCCES,
      AT.GET_DEPARTMENT_ROLEVALUE_FAILURE,
    ],
    endpoint: `/deptNameList`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
      },
    },
  },
});

export const getroledatavalues = (data) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.GET_DEPARTMENT_ROLEVALUE_REQUEST,
      AT.GET_DEPARTMENT_ROLEVALUE_SUCCES,
      AT.GET_DEPARTMENT_ROLEVALUE_FAILURE,
    ],
    // endpoint: `/deptListRoles`,
    endpoint: `/deptSplit1`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        deptName: data,
      },
    },
  },
});

export const PostSplitdepartmentdta = (departments, deptName) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.POST_DEPARTMENT_POSTROLE_REQUEST,
      AT.POST_DEPARTMENT_POSTROLE_SUCCESS,
      AT.POST_DEPARTMENT_POSTROLE_FAILURE,
    ],
    endpoint: `/deptSplit2`,

    settings: {
      method: "post",
      body: JSON.stringify(departments),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        deptName: deptName,
      },
    },
  },
});

export const sendMeargData = (departments, department, togledata) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.SEND_DEPARTMENT_MERGE_REQUEST,
      AT.SEND_DEPARTMENT_MERGE_SUCCES,
      AT.SEND_DEPARTMENT_MERGE_FAILURE,
    ],
    endpoint: `/deptMerge`,

    settings: {
      method: "post",
      body: JSON.stringify({ departments, department }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        autofill: togledata,
      },
    },
  },
});

export const sendMeargDatafinal = (
  departments,
  department,
  rolesOldAndNew
) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.SEND_MERGE_FINALDATA_REQUEST,
      AT.SEND_MERGE_FINALDATA_SUCCESS,
      AT.SEND_MERGE_FINALDATA_FAILURE,
    ],
    endpoint: `/deptMergeFinal`,

    settings: {
      method: "POST",
      body: JSON.stringify({ departments, department, rolesOldAndNew }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        // roleName: sessionStorage.getItem("role"),
      },
    },
  },
});

export const sendAutofilldata = (data) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.SEND_AUTOFILLDATA_REQUEST,
      AT.SEND_AUTOFILLDATA_SUCCESS,
      AT.SEND_AUTOFILLDATA_FAILURE,
    ],
    endpoint: `/deptAM/FillDept`,
    settings: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        deptName: data,
      },
    },
  },
});

export const sendsplfinaldata = (result, deptnamedata) => ({
  [SPLIT_DEPARTMENT_API]: {
    types: [
      AT.SEND_SPLDATA_REQUEST,
      AT.SEND_SPLDATA_SUCCESS,
      AT.SEND_SPLDATA_FAILURE,
    ],
    endpoint: `/deptSplit3`,

    settings: {
      method: "post",
      body: JSON.stringify(result),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        deptName: deptnamedata,
      },
    },
  },
});

export const getMailRoomRegister = (
  inwards,
  pageNumber,
  pageSize,
  department
) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.DOWNLOAD_MAIL_ROOM_REQUEST,
      AT.SEND_MAIL_ROOM_SUCCESS,
      AT.SEND_MAIL_ROOM_FAILURE,
    ],
    endpoint: `/api/getMailRoomRegister`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        inwards: inwards,
        pageNumber: pageNumber,
        pageSize: pageSize,
        department: department,
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getWaitingInbox = (
  role,
  username,
  department,
  pageSize,
  pageNumber,
  selectedMenuItem,
  val,
  abortSignal
) => ({
  [BACK_HRM_API]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getWaitingMailRoomInbox`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendFromWaitingRoom = (
  id,
  role,
  username,
  department,
  pageSize,
  pageNumber,
  selectedMenuItem,
  val,
  abortSignal
) => ({
  [BACK_HRM_API]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/sendFromWaitingMailRoom/${id}`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: role,
        userName: username,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const changeMailRoomStatus = (
  id,
  instructions,
  role,
  username,
  department,
  pageSize,
  pageNumber,
  selectedMenuItem,
  val,
  abortSignal
) => ({
  [BACK_HRM_API]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/changeMailRoomStatus/${id}`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        instructions: instructions,
        roleName: role,
        userName: username,
        department,
        pageSize: pageSize,
        pageNumber: pageNumber,
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const importDocumentFromFile = () => ({
  [BACKEND_FILE]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/importDocumentFromFile`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const importDocument = (fromFileId, toFileId, docId, fromBM, isBM) => ({
  [BACKEND_FILE]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/importDocument`,
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        fromFileId: fromFileId,
        toFileId: toFileId,
        docId: docId,
        fromBM: fromBM,
        isBM: isBM,
      },
    },
  },
});

export const getMailRoomFile = (id) => ({
  [BACKEND_FILE]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getMailRoomFile/${id}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const sendToCoord = (id) => ({
  [BACK_FORWARD_API]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/sendToCoord/${id}`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});
export const getSubSectionFileNameList = (subSection, items) => ({
  [BACKEND_FILE]: {
    types: [
      AT.MR_INBOX_DATA_REQUEST,
      AT.MR_INBOX_DATA_SUCCESS,
      AT.MR_INBOX_DATA_FAILURE,
    ],
    endpoint: `/api/getSubSectionFileNameList`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        subSection: subSection,
        items: items,
      },
    },
  },
});

/*-----------------------------Audit Search-----------------------------*/

/*----------------------------- get  personalize  Action -----------------------------*/

export const getpersonalizeAction = () => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.GET_PERSONALIZEINFO_REQUEST,
      AT.GET_PERSONALIZEINFO_SUCCESS,
      AT.GET_PERSONALIZEINFO_FAILURE,
    ],
    endpoint: `/api/getPersonalize`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: sessionStorage.getItem("role"),
      },
    },
  },
});

export const personalizeAction = (
  userName,
  paFile,
  pa,
  tab,
  role,
  dark,
  language,
  penColor,
  muiTableData
) => ({
  [BACK_RETRIEVAL_API]: {
    types: [
      AT.PERSONALINFOSTORE_REQUEST,
      AT.PERSONALINFOSTORE_SUCCESS,
      AT.PERSONALINFOSTORE_FAILURE,
    ],
    endpoint: `/api/personalize`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        department: sessionStorage.getItem("department"),
      },
      body: JSON.stringify({
        personalize: {
          userName,
          paFile,
          pa,
          tab,
          role,
          dark,
          language,
          penColor,
        },
        muiTableData,
      }),
    },
  },
});

export const updateAdminData = (coordRole) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.UPDATE_ADMIN_DATA_REQUEST,
      AT.UPDATE_ADMIN_DATA_SUCCESS,
      AT.UPDATE_ADMIN_DATA_FAILURE,
    ],
    endpoint: `/api/updateCoordRole`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        coordRole,
      },
    },
  },
});

export const updateAdminRole = (currRole) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.UPDATE_ADMIN_ROLE_REQUEST,
      AT.UPDATE_ADMIN_ROLE_SUCCESS,
      AT.UPDATE_ADMIN_ROLE_FAILURE,
    ],
    endpoint: `/api/changeAdStatus`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        currRole,
      },
    },
  },
});

export const getAdminData = () => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.GET_ADMIN_DATA_REQUEST,
      AT.GET_ADMIN_DATA_SUCCESS,
      AT.GET_ADMIN_DATA_FAILURE,
    ],
    endpoint: `/api/adminSectionData`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getAllRoles = (pageNumber, pageSize) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.GET_ALL_ROLES_REQUEST,
      AT.GET_ALL_ROLES_SUCCESS,
      AT.GET_ALL_ROLES_FAILURE,
    ],
    endpoint: `/api/getAllRoles`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        deptName: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        pageNumber,
        pageSize,
      },
    },
  },
});

export const getSections = (pageNumber, pageSize) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.GET_SECTIONS_REQUEST,
      AT.GET_SECTIONS_SUCCESS,
      AT.GET_SECTIONS_FAILURE,
    ],
    endpoint: `/api/getSections`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        deptName: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        pageSize: pageSize,
        pageNumber: pageNumber,
      },
    },
  },
});

export const getSeries = (section, pageSize, pageNumber) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.GET_SERIES_REQUEST,
      AT.GET_SERIES_SUCCESS,
      AT.GET_SERIES_FAILURE,
    ],
    endpoint: `/api/getLabel`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        pageSize: pageSize,
        pageNumber: pageNumber,
        section,
      },
    },
  },
});

export const updateSeries = (labelRange, labelData, section) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.UPDATE_SERIES_REQUEST,
      AT.UPDATE_SERIES_SUCCESS,
      AT.UPDATE_SERIES_FAILURE,
    ],
    endpoint: `/api/setLabel`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        deptName: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        labelRange,
        labelData,
        section,
      },
    },
  },
});

export const addSection = (section, range) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.ADD_SECTION_REQUEST,
      AT.ADD_SECTION_SUCCESS,
      AT.ADD_SECTION_FAILURE,
    ],
    endpoint: `/api/setSubSecInDepartment`,
    settings: {
      method: "POST",
      body: JSON.stringify([
        {
          deptName: sessionStorage.getItem("department"),
          subSec: {
            [section]: range,
          },
        },
      ]),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const delSection = (section, range) => ({
  [BACK_DEPT_ADMIN]: {
    types: [
      AT.DEL_SECTION_REQUEST,
      AT.DEL_SECTION_SUCCESS,
      AT.DEL_SECTION_FAILURE,
    ],
    endpoint: `/api/removeSubSecInDepartment`,
    settings: {
      method: "POST",
      body: JSON.stringify([
        {
          deptName: sessionStorage.getItem("department"),
          subSec: {
            [section]: range,
          },
        },
      ]),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const getHelpDesk = (deptName, pageSize, pageNumber) => ({
  [BACK_DEPT_ADMIN]: {
    types: [AT.GET_HELP_REQUEST, AT.GET_HELP_SUCCESS, AT.GET_HELP_FAILURE],
    endpoint: `/api/helpData`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        pageSize: pageSize,
        pageNumber: pageNumber,
        deptName,
      },
    },
  },
});

export const getDepts = (deptName, pageSize, pageNumber) => ({
  [BACK_DEPT_ADMIN]: {
    types: [AT.GET_DEPTS_REQUEST, AT.GET_DEPTS_SUCCESS, AT.GET_DEPTS_FAILURE],
    endpoint: `/api/getDept`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
    },
  },
});

export const createEric = (
  ericSubject,
  ericType,
  ericDate,
  ericTime,
  type
) => ({
  [URL_HIDE]: {
    types: [
      AT.CREATE_ERIC_REQUEST,
      AT.CREATE_ERIC_SUCCESS,
      AT.CREATE_ERIC_FAILURE,
    ],
    endpoint: "/api/createEric",
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify({
        ericSubject,
        ericType,
        ericDate,
        ericTime,
        ericRole: sessionStorage.getItem("role"),
        deptName: sessionStorage.getItem("department"),
        file_or_dak: type,
      }),
    },
  },
});

export const editEric = (
  id,
  ericSubject,
  ericType,
  ericDate,
  ericTime,
  type
) => ({
  [URL_HIDE]: {
    types: [AT.EDIT_ERIC_REQUEST, AT.EDIT_ERIC_SUCCESS, AT.EDIT_ERIC_FAILURE],
    endpoint: `/api/updateEric?ericId=${id}`,
    settings: {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
      },
      body: JSON.stringify({
        ericSubject,
        ericType,
        ericDate,
        ericTime,
        ericRole: sessionStorage.getItem("role"),
        deptName: sessionStorage.getItem("department"),
        file_or_dak: type,
      }),
    },
  },
});

export const getAllEric = (pageNumber, pageSize, current, abortSignal) => ({
  [URL_HIDE]: {
    types: [
      AT.GET_ALL_ERIC_REQUEST,
      AT.GET_ALL_ERIC_SUCCESS,
      AT.GET_ALL_ERIC_FAILURE,
    ],
    endpoint: "/api/getAllEric",
    settings: {
      method: "GET",
      signal: abortSignal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        deptName: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        pageNumber,
        pageSize,
        current,
      },
    },
  },
});

export const deleteEric = (id) => ({
  [URL_HIDE]: {
    types: [
      AT.DELETE_ERIC_REQUEST,
      AT.DELETE_ERIC_SUCCESS,
      AT.DELETE_ERIC_FAILURE,
    ],
    endpoint: `/api/deleteEric`,
    settings: {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        sessionId: sessionStorage.getItem("sessionId"),
        userName: localStorage.getItem("username"),
        roleName: sessionStorage.getItem("role"),
        department: sessionStorage.getItem("department"),
        address: sessionStorage.getItem("ipAddress"),
        ericId: id,
      },
    },
  },
});
