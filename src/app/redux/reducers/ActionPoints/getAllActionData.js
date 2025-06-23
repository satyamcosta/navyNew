import * as AT from "../../.././camunda_redux/redux/constants/ActionTypes";
const initState = {
  allAction: [],
  error: "",
  loading: false,
};

export const getActionPointsData = (state = initState, action) => {
  switch (action.type) {
    case AT.GET_ACTION_POINTS_SUCCESS:
      return {
        ...state,
        allAction: action.payload,
      };

    default:
      return state;
  }
};
