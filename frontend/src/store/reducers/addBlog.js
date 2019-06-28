import {
    ADD_BLOG_STARTED,
    ADD_BLOG_SUCCEEDED,
    ADD_BLOG_REJECTED
} from "../constants";


const initialState = {
    addedBlog: {},
    isAddBlogFetching: false,
    isAddBlogError: false
};

const addBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_BLOG_STARTED:
            return Object.assign({}, state, {
                addedBlog: {},
                isAddBlogFetching: true,
                isAddBlogError: false
            });
        case ADD_BLOG_SUCCEEDED:
            return Object.assign({}, state, {
                addedBlog: action.data,
                isAddBlogFetching: false,
                isAddBlogError: false
            });
        case ADD_BLOG_REJECTED:
            return Object.assign({}, state, {
                isAddBlogError: true,
                isAddBlogFetching: false
            });
        default:
            return state;
    }
};

export default addBlogReducer;
