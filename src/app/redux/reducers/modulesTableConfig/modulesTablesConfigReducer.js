import { SET_EXT_CABINET_CONFIGURATION } from "app/camunda_redux/redux/constants/ActionTypes";

export const setExtCabinetConfig = (updatedData) => (dispatch) => {
  dispatch({ type: SET_EXT_CABINET_CONFIGURATION, payload: updatedData });
};

const initialState = {
  extCabinet: {
    isHidden: true,
  },
};

const modulesTableConfigReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EXT_CABINET_CONFIGURATION:
      return {
        ...state,
        extCabinet: { ...state.extCabinet, ...action.payload },
      };
    default:
      return state;
  }
};

export default modulesTableConfigReducer;
