import * as AT from "../../constants/ActionTypes";
import { BACK_ACTION_POINT } from "app/middleware/Actionpoints/backend_action_points";

const roleName = sessionStorage.getItem("role");
const userName = localStorage.getItem("username");
const displayRoleName = sessionStorage.getItem("displayRole");
export const addActionTask = (values, role) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.ADD_ACTION_POINTS_REQUEST,
      AT.ADD_ACTION_POINTS_SUCCESS,
      AT.ADD_ACTION_POINTS_FAILURE,
    ],
    endpoint: `/api/addTask`,
    settings: {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: role,
      },
    },
  },
});

export const createActionTask = (values) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.CREATE_ACTION_POINTS_REQUEST,
      AT.CREATE_ACTION_POINTS_SUCCESS,
      AT.CREATE_ACTION_POINTS_FAILURE,
    ],
    endpoint: `/api/add-file-dak-task`,
    settings: {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: sessionStorage.getItem("role"),
        username: localStorage.getItem("username"),
        deptName: sessionStorage.getItem("department"),
        displayRoleName: sessionStorage.getItem("displayRole"),
      },
    },
  },
});

export const getActionTask = (
  userName,
  role,
  pageSize,
  currentPage,
  select,
  filter,
  completed,
  signal
) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.GET_ACTION_POINTS_REQUEST,
      AT.GET_ACTION_POINTS_SUCCESS,
      AT.GET_ACTION_POINTS_FAILURE,
    ],
    endpoint: `/api/getActionPoints`,
    settings: {
      method: "POST",
      signal,
      body: JSON.stringify(filter),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        userName: userName,
        roleName: role,
        pageSize: pageSize,
        pageNumber: currentPage,
        completed:completed,
      },
    },
  },
});

export const assignFurthers = (values, role, priority) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.ASSIGN_FURTHER_REQUEST,
      AT.ASSIGN_FURTHER_SUCCESS,
      AT.ASSIGN_FURTHER_FAILURE,
    ],
    endpoint: `/api/assignFurther`,
    settings: {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        roleName: role,
        newPriority: priority,
      },
    },
  },
});

export const updateStatus = (values, actionId, role) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.UPDATE_STATUS_REQUEST,
      AT.UPDATE_STATUS_SUCCESS,
      AT.UPDATE_STATUS_FAILURE,
    ],
    endpoint: `/api/updateStatus`,
    settings: {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        actionId: actionId,
        roleName: role,
      },
    },
  },
});

export const previousStatus = (
  actionId,
  assigneePreStatus,
  pageSize,
  currentPage,
  role,
  boolean
) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.PREVIOUS_STATUS_REQUEST,
      AT.PREVIOUS_STATUS_SUCCESS,
      AT.PREVIOUS_STATUS_FAILURE,
    ],
    endpoint: `/api/previousStatus`,
    settings: {
      method: "GET",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        actionId: actionId ? actionId : assigneePreStatus,
        pageSize: pageSize,
        pageNumber: currentPage,
        roleName: role,
        isAssigner: boolean,
      },
    },
  },
});

export const ViewStatus = (parentId, pageSize, currentPage) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.VIEW_STATUS_REQUEST,
      AT.VIEW_STATUS_SUCCESS,
      AT.VIEW_STATUS_FAILURE,
    ],
    endpoint: `/api/nestedView`,
    settings: {
      method: "GET",

      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        parentId: parentId,
        pageSize: pageSize,
        pageNumber: currentPage,
      },
    },
  },
});

export const viewDetails = (id, roleName) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.VIEW_DETAILS_REQUEST,
      AT.VIEW_DETAILS_SUCCESS,
      AT.VIEW_DETAILS_FAILURE,
    ],
    endpoint: `/api/all-files`,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        id: id,
        roleName: roleName,
      },
    },
  },
});

export const markCompleted = (
  actionId,
  markCompleted,
  pageSize,
  currentPage
) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.MARK_COMPLETED_REQUEST,
      AT.MARK_COMPLETED_SUCCESS,
      AT.MARK_COMPLETED_FAILURE,
    ],
    endpoint: `/api/markComplete`,
    settings: {
      method: "POST",
      body: JSON.stringify(actionId),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

        markCompleted: markCompleted,
        pageSize: pageSize,
        pageNum: currentPage,
      },
    },
  },
});

export const markCompletedByAssignmentId = (
  actionId,
  markCompleted,
  role,
  pazeSize,
  currentPage
) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.MARK_COMPLETED_BY_ASSIGNMENTID_REQUEST,
      AT.MARK_COMPLETED__BY_ASSIGNMENTID_SUCCESS,
      AT.MARK_COMPLETED__BY_ASSIGNMENTID_FAILURE,
    ],
    endpoint: `/api/markCompleteByAssignmentId`,
    settings: {
      method: "POST",
      body: JSON.stringify(actionId),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),

        markCompleted: markCompleted,
        roleName: role,
        pazeSize: 10,
        pageNum: currentPage,
      },
    },
  },
});

export const fileUpload = (id, file, deptName, role) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.UPLOAD_FILES_REQUEST,
      AT.UPLOAD_FILES_SUCCESS,
      AT.UPLOAD_FILES_FAILURE,
    ],
    endpoint: `/api/add-enclosures/by-assignment-id/${id}`,
    settings: {
      method: "POST",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        deptName: deptName,
        roleName: role,
        userName: userName,
        displayRoleName: displayRoleName,
      },
    },
  },
});
export const getAllFiles = (fileName) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.GET_ALLFILES_REQUEST,
      AT.GET_ALLFILES_SUCCESS,
      AT.GET_ALLFILES_FAILURE,
    ],
    endpoint: `/api/get-file`,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        fileName: fileName,
      },
    },
  },
});
export const uploadEnclosure = (id, file, deptName, role) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.UPLOAD_FILES_REQUEST,
      AT.UPLOAD_FILES_SUCCESS,
      AT.UPLOAD_FILES_FAILURE,
    ],
    endpoint: `/api/add-enclosures/by-action-id/${id}`,
    settings: {
      method: "POST",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        deptName: deptName,
        roleName: role,
        userName: userName,
        displayRoleName: displayRoleName,
      },
    },
  },
});
export const getFile = (id) => ({
  [BACK_ACTION_POINT]: {
    types: [AT.GET_FILES_REQUEST, AT.GET_FILES_SUCCESS, AT.GET_FILES_FAILURE],
    endpoint: `/api/fileUrl`,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        id: id,
      },
    },
  },
});
export const downloadFiles = (id) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.FILES__DOWNLOAD_REQUEST,
      AT.FILES__DOWNLOAD_SUCCESS,
      AT.FILES__DOWNLOAD_FAILURE,
    ],
    endpoint: `/api/fileUrl`,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        id: id,
      },
    },
  },
});
export const getrefrence = (deptName) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.GET_REFRENCE_REQUEST,
      AT.GET_REFRENCE_SUCCESS,
      AT.GET_REFRENCE_FAILURE,
    ],
    endpoint: `/api/getReference `,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        deptName: deptName,
      },
    },
  },
});

export const deleteFile = (id, flagNumber, actionId, roleName) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.FILES_DELETE_REQUEST,
      AT.FILES_DELETE_SUCCESS,
      AT.FILES_DELETE_FAILURE,
    ],
    endpoint: `/api/deleteFiles`,
    settings: {
      method: "DELETE",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        id: id,
        flagNumber: flagNumber,
        actionId: actionId,
        roleName: roleName,
      },
    },
  },
});

export const viewTaskDetails = (id) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.CLOSE_ACTION_REQUEST,
      AT.CLOSE_ACTION_SUCCESS,
      AT.CLOSE_ACTION_FAILURE,
    ],
    endpoint: `/api/viewDetails `,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        id: id,
      },
    },
  },
});

export const showAllAssignTaskUsers = (
  assignmentId,
  pageSize,
  currentPage
) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.ALL_ASSIGN_TASK_USER_REQUEST,
      AT.ALL_ASSIGN_TASK_USER_SUCCESS,
      AT.ALL_ASSIGN_TASK_USER_FAILURE,
    ],
    endpoint: `/api/all-task-assignments-for-same-task`,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        assignmentId: assignmentId,
        pageSize: pageSize,
        pageNumber: currentPage,
      },
    },
  },
});

export const cumulatedStatus = (id, pageSize, Pagenumber) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.CAMULATED_STATUS_REQUEST,
      AT.CAMULATED_STATUS_SUCCESS,
      AT.CAMULATED_STATUS_FAILURE,
    ],
    endpoint: `/api/cumulated-status`,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        assignmentId: id,
        pageSize: pageSize,
        pageNum: Pagenumber,
      },
    },
  },
});

export const givenInstruction = (value, actionId, priority) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.GIVEN_INSTRUCTION_REQUEST,
      AT.GIVEN_INSTRUCTION_SUCCESS,
      AT.GIVEN_INSTRUCTION_FAILURE,
    ],
    endpoint: `/api/giveInstruction`,
    settings: {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        newPriority: priority,
        actionId: actionId,
      },
    },
  },
});

export const previousInstructions = (actionId, boolean, role) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.PREVIOUS_INSTRUCTION_REQUEST,
      AT.PREVIOUS_INSTRUCTION_SUCCESS,
      AT.PREVIOUS_INSTRUCTION_FAILURE,
    ],
    endpoint: `/api/previousInstructions`,
    settings: {
      method: "GET",

      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        actionId: actionId,
        roleName: role,
        isAssigner: boolean,
      },
    },
  },
});

export const getEnclosureInfo = (id) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.ASSIGN_FURTHER_FILE_REQUEST,
      AT.ASSIGN_FURTHER_FILE_SUCCESS,
      AT.ASSIGN_FURTHER_FILE_FAILURE,
    ],
    endpoint: `/api/file-info`,
    settings: {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf8",
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        id,
      },
    },
  },
});

export const assigneeFileUpload = (file, actionId) => ({
  [BACK_ACTION_POINT]: {
    types: [
      AT.ASSIGNEE_FILE_REQUEST,
      AT.ASSIGNEE_FILE_SUCCESS,
      AT.ASSIGNEE_FILE_FAILURE,
    ],
    endpoint: `/api/uploading-file-while-assigning`,
    settings: {
      method: "POST",
      body: file,
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
        deptName: sessionStorage.getItem("department"),
        displayRoleName: sessionStorage.getItem("displayRole"),
        roleName: sessionStorage.getItem("role"),
        username: localStorage.getItem("username"),
        actionId: actionId,
      },
    },
  },
});
