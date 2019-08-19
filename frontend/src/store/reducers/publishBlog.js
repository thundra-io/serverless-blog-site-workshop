import {
    PUBLISH_BLOG_STARTED,
    PUBLISH_BLOG_SUCCEEDED,
    PUBLISH_BLOG_REJECTED
} from "../constants";


const initialState = {
    publishedBlog: {},
    isPublishBlogFetching: false,
    isPublishBlogError: false
};

const publishBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case PUBLISH_BLOG_STARTED:
            return Object.assign({}, state, {
                publishedBlog: {},
                isPublishBlogFetching: true,
                isPublishBlogError: false
            });
        case PUBLISH_BLOG_SUCCEEDED:
            return Object.assign({}, state, {
                publishedBlog: action.data,
                isPublishBlogFetching: false,
                isPublishBlogError: false
            });
        case PUBLISH_BLOG_REJECTED:
            return Object.assign({}, state, {
                isPublishBlogError: true,
                isPublishBlogFetching: false
            });
        default:
            return state;
    }
};

export default publishBlogReducer;
