import {combineReducers} from 'redux';

import searchBlog from "./searchBlog";
import getBlog from "./getBlog";
import addBlog from "./addBlog";
import deleteBlog from "./deleteBlog";
import globalUrl from "./globalUrl";

// TODO: might need to add a const var.
export default combineReducers ({
    searchBlog,
    getBlog,
    addBlog,
    deleteBlog,
    globalUrl
});