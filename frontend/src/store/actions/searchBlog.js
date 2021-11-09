import store from "../store";

import {
    FETCH_BLOGS_STARTED,
    FETCH_BLOGS_SUCCEEDED,
    FETCH_BLOGS_REJECTED
} from "../constants";

export const fetch_blogs = () => {
    return {
        type: FETCH_BLOGS_STARTED
    };
};

export const receive_blogs = post => {
    return {
        type: FETCH_BLOGS_SUCCEEDED,
        data: post
    };
};

export const receive_blogs_error = (err) => {
    console.log("receive_blogs_error; err: ", err);
    return {
        type: FETCH_BLOGS_REJECTED
    };
};

export const searchBlogsAction = (keyword, username, startDate, endDate, state) => {

    store.dispatch(fetch_blogs());

    return function (dispatch, getState) {

        // let startTimestamp = "";
        // if (startDate) {
        //     startTimestamp = new Date(startDate).getTime();
        // }
        const startTimestamp = new Date(startDate).getTime();
        const endTimestamp = new Date(endDate).getTime();

        const url = `${getState().globalUrl.urlText}/search?keyword=${keyword}&username=${username}&start-timestamp=${startTimestamp}&end-timestamp=${endTimestamp}&state=${state}`;
        // console.log("searchBlogsAction; url: ", url);

        return fetch(`${url}`, {
            headers: { 'Content-Type': 'application/json' }
        })
            .then(data => data.json())
            .then(data => {
                // console.log("searchBlogsAction; data, getState: ", data, getState());
                dispatch(receive_blogs(data))
            })
            .catch(err => dispatch(receive_blogs_error(err)));
    };
};
