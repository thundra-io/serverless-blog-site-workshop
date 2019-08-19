import store from "../store";

import {
    PUBLISH_BLOG_STARTED,
    PUBLISH_BLOG_SUCCEEDED,
    PUBLISH_BLOG_REJECTED
} from "../constants";

export const publish_blog = () => {
    return {
        type: PUBLISH_BLOG_STARTED
    };
};

export const receive_publish_blog = post => {
    return {
        type: PUBLISH_BLOG_SUCCEEDED,
        data: post
    };
};

export const receive_publish_blog_error = (err) => {
    console.log("receive_publish_blog_error; err: ", err);
    return {
        type: PUBLISH_BLOG_REJECTED
    };
};

export const publishBlogAction = (blogId) => {
    
    store.dispatch(publish_blog());

    return function (dispatch, getState) {

        const url = `${getState().globalUrl.urlText}/publish/${blogId}`;
        // console.log("publishBlogAction; url: ", url);

        return fetch(`${url}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
        })
            .then(data => data.json())
            .then(data => {
                // console.log("publishBlogAction; data, getState: ", data, getState());
                dispatch(receive_publish_blog(data))
            })
            .catch(err => dispatch(receive_publish_blog_error(err)));
    };
};
