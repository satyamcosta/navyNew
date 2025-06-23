import {
  SET_USER_DATA,
  REMOVE_USER_DATA,
  USER_LOGGED_OUT,
} from "../actions/UserActions";

const initialState = {
  currentUserRole: {},
  UserRoles: [],
  section: {}
};

const userReducer = function (state = initialState, { type, role, roleArr, section }) {

  switch (type) {
    case SET_USER_DATA: {
      return {
        ...state,
        currentUserRole: role ? role : state.currentUserRole,
        UserRoles: roleArr ? roleArr : state.UserRoles,
        section: section ? section : state.section
      };
    }
    case REMOVE_USER_DATA: {
      return {
        ...state,
        currentUserRole: {},
        UserRoles: [],
        section: {}
      };
    }
    case USER_LOGGED_OUT: {
      return {
        ...state,
        currentUserRole: {},
        UserRoles: [],
        section: {}
      };
    }
    default: {
      return {
        ...state,
      };
    }
  }
};

export default userReducer;
