import {
  CHANGE_ROUTES_PA,
  CHANGE_ROUTES_ALL,
  CHANGE_ROUTES_MR,
} from "app/camunda_redux/redux/constants/ActionTypes";

const initialState = {
  showPa: false,
  showAll: true,
};

const routeReducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_ROUTES_PA:
      return { ...state, showPa: true, showMr: false, showAll: false };
    case CHANGE_ROUTES_ALL:
      return { ...state, showPa: false, showMr: false, showAll: true };
    case CHANGE_ROUTES_MR:
      return { ...state, showMr: true, showPa: false, showAll: false };
    default:
      return state;
  }
};

export default routeReducer;
