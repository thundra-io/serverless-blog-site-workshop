import store from "../store";

import {
    ADD_BLOG_STARTED,
    ADD_BLOG_SUCCEEDED,
    ADD_BLOG_REJECTED
} from "../constants";

export const add_blog = () => {
    return {
        type: ADD_BLOG_STARTED
    };
};

export const receive_add_blog = post => {
    return {
        type: ADD_BLOG_SUCCEEDED,
        data: post
    };
};

export const receive_add_blog_error = (err) => {
    console.log("receive_add_blog_error; err: ", err);
    return {
        type: ADD_BLOG_REJECTED
    };
};

export const addBlogAction = (title, post, username, phoneNumber) => {

    const newPost = {
        title,
        post,
        username,
        phoneNumber
    };

    store.dispatch(add_blog());

    return function (dispatch, getState) {

        const url = `${getState().globalUrl.urlText}/post`;
        // console.log("addBlogAction; url: ", url);
        // console.log("addBlogAction; newPost: ", JSON.stringify(newPost));

        return fetch(`${url}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newPost)
        })
            .then(data => data.json())
            .then(data => {
                // console.log("addBlogAction; data, getState: ", data, getState());
                dispatch(receive_add_blog(data))
            })
            .catch(err => dispatch(receive_add_blog_error(err)));
    };
};
