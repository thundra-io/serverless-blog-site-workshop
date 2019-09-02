import store from "../store";

import {
    FETCH_BLOG_STARTED,
    FETCH_BLOG_SUCCEEDED,
    FETCH_BLOG_REJECTED,
    SET_BLOG_POST
} from "../constants";

export const fetch_blog = () => {
    return {
        type: FETCH_BLOG_STARTED
    };
};

export const receive_blog = post => {
    return {
        type: FETCH_BLOG_SUCCEEDED,
        data: post
    };
};

export const receive_blog_error = (err) => {
    console.log("receive_blogs_error; err: ", err);
    return {
        type: FETCH_BLOG_REJECTED
    };
};

export const getBlogAction = (blogId) => {

    store.dispatch(fetch_blog());

    return function (dispatch, getState) {
        const url = `${getState().globalUrl.urlText}/${blogId}`;
        // console.log("getBlogAction; url: ", url);

        return fetch(`${url}`)
            .then(data => data.json())
            .then(data => {
                console.log("getBlogAction; data, getState: ", data, getState());
                dispatch(receive_blog(data))
            })
            .catch(err => dispatch(receive_blog_error(err)));
    };
};

export const setBlogPostAction = (post) => {
    return {
        type: SET_BLOG_POST,
        data: post
    }
}
