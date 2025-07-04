const API_ROOT = "/actionPoint";

const callApi = (endpoint, settings = {}) => {
  // console.log(endpoint)
  const fullUrl =
    endpoint.indexOf(API_ROOT) === -1 ? API_ROOT + endpoint : endpoint;
  // console.log(fullUrl)
  return fetch(fullUrl, settings).then((response) =>
    response.json().then((res) => {
      return res;
    })
  );
};

export const BACK_ACTION_POINT = "Back Action Point";

export default (store) => (next) => (action) => {
  const callAPI = action[BACK_ACTION_POINT];

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
    delete finalAction[BACK_ACTION_POINT];
    return finalAction;
  };
  const [requestType, successType, failureType] = types;
  next(actionWith({ type: requestType }));
  return callApi(endpoint, settings).then(
    (response) => {
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
          type: successType,
          response: response,
        })
      );
    },
    (error) => {
      return next(
        actionWith({
          type: failureType,
          error: error.message || "Something bad happened",
        })
      );
    }
  );
};
