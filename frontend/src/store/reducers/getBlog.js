import {
    FETCH_BLOG_STARTED,
    FETCH_BLOG_SUCCEEDED,
    FETCH_BLOG_REJECTED,
    SET_BLOG_POST
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
        case SET_BLOG_POST:
            return Object.assign({}, state, {
                blogData: {
                    ...state.blogData,
                    post: action.data
                }
            });
        default:
            return state;
    }
};

export default getBlogReducer;
