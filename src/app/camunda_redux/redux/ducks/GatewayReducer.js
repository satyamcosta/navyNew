export const SET_GATEWAY = "teamly/settings/SET_GATEWAY";

const initialState = {
  gatewayOpen: false,
  gatewayMessage: "",
  disableArr: [],
  redirect: "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_GATEWAY:
      const { gatewayOpen, gatewayMessage, disable, redirect } = action;
      return {
        ...state,
        gatewayOpen,
        gatewayMessage,
        disableArr: disable
          ? state.disableArr.includes(disable)
            ? state.disableArr.filter((item) => item !== disable)
            : state.disableArr.concat(disable)
          : state.disableArr,
        redirect,
      };
    default:
      return state;
  }
};

export const setGateway = (
  gatewayOpen,
  gatewayMessage = "",
  disable,
  redirect
) => ({
  type: SET_GATEWAY,
  gatewayOpen,
  gatewayMessage,
  disable,
  redirect,
});
