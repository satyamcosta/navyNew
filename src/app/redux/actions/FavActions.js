export const SET_FAV = "SET_FAV";

export function setMyFav(favList) {
    return dispatch => {
        dispatch({
            type: SET_FAV,
            favList
        });
    };
}

