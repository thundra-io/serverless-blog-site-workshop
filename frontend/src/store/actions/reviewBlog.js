import store from "../store";

import {
    REVIEW_BLOG_STARTED,
    REVIEW_BLOG_SUCCEEDED,
    REVIEW_BLOG_REJECTED
} from "../constants";

export const review_blog = () => {
    return {
        type: REVIEW_BLOG_STARTED
    };
};

export const receive_review_blog = post => {
    return {
        type: REVIEW_BLOG_SUCCEEDED,
        data: post
    };
};

export const receive_review_blog_error = (err) => {
    console.log("receive_review_blog_error; err: ", err);
    return {
        type: REVIEW_BLOG_REJECTED
    };
};

export const reviewBlogAction = (blogId, post) => {

    store.dispatch(review_blog());

    return function (dispatch, getState) {

        const url = `${getState().globalUrl.urlText}/review/${blogId}`;
        // console.log("reviewBlogAction; url: ", url);
        // console.log("reviewBlogAction; post: ", JSON.stringify(post));

        return fetch(`${url}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: post
        })
            .then(data => data.json())
            .then(data => {
                // console.log("reviewBlogAction; data, getState: ", data, getState());
                dispatch(receive_review_blog(data))
            })
            .catch(err => dispatch(receive_review_blog_error(err)));
    };
};
