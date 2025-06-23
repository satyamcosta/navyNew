import {
    SET_FAV
} from "../actions/FavActions";

const initialState = {
    favList: []
};

const favReducer = function (state = initialState, { type, favList }) {
    // console.log(type, favObj)
    switch (type) {
        case SET_FAV: {
            return {
                ...state,
                favList
            };
        }

        default: {
            return {
                ...state,
            };
        }
    }
};

export default favReducer;
