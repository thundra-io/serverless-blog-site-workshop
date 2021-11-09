import {
    TOGGLE_URL_LOCK,
    SET_URL_TEXT
} from "../constants";

export const toggleUrlLock = () => {
    return {
        type: TOGGLE_URL_LOCK
    };
};

export const setUrlText = urlString => {
    return {
        type: SET_URL_TEXT,
        data: urlString.replace(/\/$/, ""),
    };
};
