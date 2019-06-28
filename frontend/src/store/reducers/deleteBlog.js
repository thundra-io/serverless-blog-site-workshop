import {
    DELETE_BLOG_STARTED,
    DELETE_BLOG_SUCCEEDED,
    DELETE_BLOG_REJECTED
} from "../constants";


const initialState = {
    deletedBlog: undefined,
    isDeleteBlogFetching: false,
    isDeleteBlogError: false
};

const deleteBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case DELETE_BLOG_STARTED:
            return Object.assign({}, state, {
                deletedBlog: undefined,
                isDeleteBlogFetching: true,
                isDeleteBlogError: false
            });
        case DELETE_BLOG_SUCCEEDED:
            return Object.assign({}, state, {
                deletedBlog: action.data,
                isDeleteBlogFetching: false,
                isDeleteBlogError: false
            });
        case DELETE_BLOG_REJECTED:
            return Object.assign({}, state, {
                isDeleteBlogError: true,
                isDeleteBlogFetching: false
            });
        default:
            return state;
    }
};

export default deleteBlogReducer;
