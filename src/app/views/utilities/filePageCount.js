import axios from "axios";

export const countPages = (files, errorCallback) => {
  axios
    .post("/file/count/upload", files)
    .then((resp) => {
      if (resp.status === "504") {
        // errorCallback(
        //   "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!"
        // );
        return;
      }
      if (resp.data) {
        let formData = new FormData();
        formData.append("count", resp.data.pages);
        axios
          .post("/create_personal_app/api/pagesCount", formData, {
            headers: {
              Authorization: "Bearer " + sessionStorage.getItem("jwt_token"),
              sessionId: sessionStorage.getItem("sessionId"),
            },
          })
          .then((res) => {
            try {
              if (res.status === "504") {
                // errorCallback(
                //   "Oops! It seems like our servers are a bit busy right now processing your request.Please wait for a moment and refresh the page in 30 seconds. We appreciate your patience!"
                // );
                return;
              }
              if (res.error) {
                // errorCallback(error.message);
              }
            } catch (error) {
              // errorCallback(error.message);
            }
          })
          .catch((error) => {
            // errorCallback(error.message);
          });
      }
    })
    .catch((error) => {
      // errorCallback(
      //   "Unable to count pages internal server error".toUpperCase()
      // );
    });
};
