import { normalize, schema } from "normalizr";
import { camelizeKeys } from "humps";

const API_ROOT = "/create_personal_app";

const callApi = (endpoint, settings = {}) => {
  const fullUrl =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;

  return fetch(fullUrl, settings).then((response) => {
    if (response.status == 504) {
      return {
        error:
          "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!",
      };
    } else {
      return response.json().then((res) => {
        return res;
      });
    }
  });
};

export const BACK_CREATEPA_API = "Back CreatePA API";

export default (store) => (next) => (action) => {
  const callAPI = action[BACK_CREATEPA_API];
  if (typeof callAPI === "undefined") {
    return next(action);
  }

  let { endpoint } = callAPI;
  const { types, settings } = callAPI;
  if (typeof endpoint === "function") {
    endpoint = endpoint(store.getState());
  }

  if (typeof endpoint !== "string") {
    throw new Error("Specify a string endpoint URL.");
  }
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error("Expected an array of three action types.");
  }
  if (!types.every((type) => typeof type === "string")) {
    throw new Error("Expected action types to be strings.");
  }

  const actionWith = (data) => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[BACK_CREATEPA_API];
    return finalAction;
  };

  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));
  return callApi(endpoint, settings).then(
    (response) => {
      if (typeof response !== "object") {
        return response;
      }
      if (response.error) {
        return next(
          actionWith({
            type: failureType,
            error: response.error || "Something bad happened",
          })
        );
      }
      return next(
        actionWith({
          response,
          type: successType,
        })
      );
    },
    (error) =>
      next(
        actionWith({
          type: failureType,
          error: error.message || "Something bad happened",
        })
      )
  );
};
