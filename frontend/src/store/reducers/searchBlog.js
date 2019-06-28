import {
    FETCH_BLOGS_STARTED,
    FETCH_BLOGS_SUCCEEDED,
    FETCH_BLOGS_REJECTED
} from "../constants";


const initialState = {
    blogList: [],
    isBlogListFetching: false,
    isBlogListError: false
};

const searchBlogReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_BLOGS_STARTED:
            return Object.assign({}, state, {
                blogList: [],
                isBlogListFetching: true,
                isBlogListError: false
            });
        case FETCH_BLOGS_SUCCEEDED:
            return Object.assign({}, state, {
                blogList: action.data,
                isBlogListFetching: false,
                isBlogListError: false
            });
        case FETCH_BLOGS_REJECTED:
            return Object.assign({}, state, {
                isBlogListError: true,
                isBlogListFetching: false
            });
        default:
            return state;
    }
};

export default searchBlogReducer;
