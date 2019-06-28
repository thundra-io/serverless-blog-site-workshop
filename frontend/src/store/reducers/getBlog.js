import {
    FETCH_BLOG_STARTED,
    FETCH_BLOG_SUCCEEDED,
    FETCH_BLOG_REJECTED
} from "../constants";


const initialState = {
    blogData: {},
    isBlogDataFetching: false,
    isBlogDataError: false
};

const getBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BLOG_STARTED:
            return Object.assign({}, state, {
                blogData: {},
                isBlogDataFetching: true,
                isBlogDataError: false
            });
        case FETCH_BLOG_SUCCEEDED:
            return Object.assign({}, state, {
                blogData: action.data,
                isBlogDataFetching: false,
                isBlogDataError: false
            });
        case FETCH_BLOG_REJECTED:
            return Object.assign({}, state, {
                isBlogDataError: true,
                isBlogDataFetching: false
            });
        default:
            return state;
    }
};

export default getBlogReducer;
