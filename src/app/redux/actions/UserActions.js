import history from "history.js";
import jwtAuthService from "../../services/jwtAuthService";

export const SET_USER_DATA = "USER_SET_DATA";
export const REMOVE_USER_DATA = "USER_REMOVE_DATA";
export const USER_LOGGED_OUT = "USER_LOGGED_OUT";

export function setUserData({role,roleArr,section}) {
  return dispatch => {
    dispatch({
      type: SET_USER_DATA,
      role,
      roleArr,
      section
    });
  };
}

export function logoutUser() {
  return dispatch => {
    jwtAuthService.logout();

    history.push({
      pathname: "/eoffice"
    });

    dispatch({
      type: USER_LOGGED_OUT
    });
  };
}
