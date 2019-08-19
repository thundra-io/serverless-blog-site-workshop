import {
    REVIEW_BLOG_STARTED,
    REVIEW_BLOG_SUCCEEDED,
    REVIEW_BLOG_REJECTED
} from "../constants";


const initialState = {
    reviewedBlog: {},
    isReviewBlogFetching: false,
    isReviewBlogError: false
};

const reviewBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case REVIEW_BLOG_STARTED:
            return Object.assign({}, state, {
                reviewedBlog: {},
                isReviewBlogFetching: true,
                isReviewBlogError: false
            });
        case REVIEW_BLOG_SUCCEEDED:
            return Object.assign({}, state, {
                reviewedBlog: action.data,
                isReviewBlogFetching: false,
                isReviewBlogError: false
            });
        case REVIEW_BLOG_REJECTED:
            return Object.assign({}, state, {
                isReviewBlogError: true,
                isReviewBlogFetching: false
            });
        default:
            return state;
    }
};

export default reviewBlogReducer;
