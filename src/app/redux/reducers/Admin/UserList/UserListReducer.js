import * as AT from "app/camunda_redux/redux/constants/ActionTypes";
const KeyCloakUsers = {
  getAllUser: [],
  loading: false,
  error: "",
};

const  GetKeyCloakUser = (state = KeyCloakUsers, action) => {
  switch (action.type) {
    case AT.GET_KEYCLOAK_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: "",
      };
    case AT.GET_KEYCLOAK_USER_SUCCESS:
      return {
        ...state,
        loading: false,
        getAllUser: action.payload,
      };
    case AT.GET_KEYCLOAK_USER_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}
export default  GetKeyCloakUser