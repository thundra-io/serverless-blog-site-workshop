import store from "../store";

import {
    DELETE_BLOG_STARTED,
    DELETE_BLOG_SUCCEEDED,
    DELETE_BLOG_REJECTED
} from "../constants";

export const delete_blog = () => {
    return {
        type: DELETE_BLOG_STARTED
    };
};

export const receive_delete_blog = deleteResponse => {
    return {
        type: DELETE_BLOG_SUCCEEDED,
        data: deleteResponse
    };
};

export const receive_delete_blog_error = (err) => {
    console.log("receive_delete_blog_error; err: ", err);
    return {
        type: DELETE_BLOG_REJECTED
    };
};

export const deleteBlogAction = (blogId) => {

    store.dispatch(delete_blog());

    return function (dispatch, getState) {

        const url = `${getState().globalUrl.urlText}/${blogId}`;
        // console.log("deleteBlogAction; url: ", url);

        return fetch(`${url}`, {
            method: 'DELETE',
        })
            .then(data => data.json())
            .then(data => {
                // console.log("deleteBlogAction; data, getState: ", data, getState());
                dispatch(receive_delete_blog(data))
            })
            .catch(err => dispatch(receive_delete_blog_error(err)));
    };
};
