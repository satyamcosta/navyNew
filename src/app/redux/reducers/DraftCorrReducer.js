import {
  ADD_DRAFT_CORRESPONDENCE_REQUEST,
  ADD_DRAFT_CORRESPONDENCE_SUCCESS,
  ADD_DRAFT_CORRESPONDENCE_FAILURE,
} from "../../camunda_redux/redux/constants/ActionTypes";

const initialState = {
  DrafCount: 0,
  error: "",
  loading: true,
};

function draftCorrCount(state = initialState, action) {
  switch (action.type) {
    case ADD_DRAFT_CORRESPONDENCE_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
        DrafCount: 0,
      };
    case ADD_DRAFT_CORRESPONDENCE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: "",
        DrafCount: action.payload,
      };
    default:
      return state;
  }
}

export default draftCorrCount;
