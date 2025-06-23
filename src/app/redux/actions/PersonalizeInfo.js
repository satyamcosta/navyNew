// export const SET_PERSONALIZEINFO_SUCCESS = "SET_PERSONALIZEINFO_SUCCESS";

// export function setPersonalizeinfo(payload) {
//   return (dispatch) => {
//     dispatch({
//       type: SET_PERSONALIZEINFO_SUCCESS,
//       payload: payload,
//     });
//   };
// }

// // Define the initial state
// const initialState = {
//   data: {},
// };

// // Create the reducer function
// export default function personalizeInfoReducer(state = initialState, action) {
//   switch (action.type) {
//     case SET_PERSONALIZEINFO_SUCCESS:
//       return {
//         ...state,
//         data: action.payload,
//       };
//     default:
//       return state;
//   }
// }

import {
  INBOX_COLUMNS_STATUS,
  OUTBOX_COLUMNS_STATUS,
  ACTION_COLUMNS_STATUS,
  DRAFT_COLUMNS_STATUS,
  CABINET_COLUMNS_STATUS,
  EXT_CABINET_COLUMNS_STATUS,
  INDEX_COLUMNS_STATUS,
  MRDRAFT_COLUMNS_STATUS,
} from "app/camunda_redux/redux/constants/ActionTypes";

export const SET_PERSONALIZEINFO_SUCCESS = "SET_PERSONALIZEINFO_SUCCESS";

export const setTableColumns = (moduleName, updatedColumns) => (dispatch) => {
  dispatch({ type: moduleName, payload: updatedColumns });
};

export function setPersonalizeinfo(payload) {
  return (dispatch) => {
    dispatch({
      type: SET_PERSONALIZEINFO_SUCCESS,
      payload: payload,
    });
  };
}

// Define the initial state
const initialState = {
  personalize: {},
  muiTableData: {},
};

// Create the reducer function
export default function personalizeInfoReducer(state = initialState, action) {
  let { type, payload } = action;
  switch (type) {
    case SET_PERSONALIZEINFO_SUCCESS:
      return {
        ...state,
        ...payload,
      };
    case INBOX_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          inboxHiddenColumns: payload,
        },
      };
    case OUTBOX_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          outboxHiddenColumns: payload,
        },
      };
    case ACTION_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          actionHiddenColumns: payload,
        },
      };
    case DRAFT_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          draftHiddenColumns: payload,
        },
      };
    case MRDRAFT_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          mrDraftHiddenColumns: payload,
        },
      };
    case INDEX_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          indexHiddenColumns: payload,
        },
      };
    case CABINET_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          cabinetHiddenColumns: payload,
        },
      };
    case EXT_CABINET_COLUMNS_STATUS:
      return {
        ...state,
        muiTableData: {
          ...state.muiTableData,
          extcabHiddenColumns: payload,
        },
      };
    default:
      return state;
  }
}
