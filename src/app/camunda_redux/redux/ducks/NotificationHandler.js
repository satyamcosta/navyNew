export const HANDLE_NOTIFICATION = "teamly/settings/HANDLE_NOTIFICATION";

const initialState = {
    error: false,
    notification_type: "file",
    message: ""
};

export default (state = initialState, action) => {
    switch (action.type) {
        case HANDLE_NOTIFICATION:
            const { error, notification_type, message } = action;
            return {
                ...state,
                error, notification_type, message
            };
        default:
            return state;
    }
};

export const handleNotification = (
    error, notification_type = "file", message = ""
) => ({
    type: HANDLE_NOTIFICATION,
    error, notification_type, message
});
