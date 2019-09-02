import {connect} from "react-redux";

// TODO: do not import relative
import {BlogList} from "../../components";
import {searchBlogsAction} from "../../store/actions/searchBlog";
import {reviewBlogAction} from "../../store/actions/reviewBlog";
import {publishBlogAction} from "../../store/actions/publishBlog";
import {deleteBlogAction} from "../../store/actions/deleteBlog";
import {getBlogAction, setBlogPostAction} from "../../store/actions/getBlog";


function mapStateToProps(store) {
    // console.log("ApprovedBlogListContainer; store: ", store);
    return {
        searchedBlogs: store.searchBlog,
        clickedBlog: store.getBlog,
        deletedBlog: store.deleteBlog
    };
}

function mapDispatchToProps(dispatch) {

    return {

        searchBlogs (keyword, username, startTimestamp, endTimestamp, blogState) {
            dispatch(searchBlogsAction(keyword, username, startTimestamp, endTimestamp, blogState));
        },
        reviewBlog (blogId, reviewedBlogPost) {
            dispatch(reviewBlogAction(blogId, reviewedBlogPost));
        },
        publishBlog (blogId) {
            dispatch(publishBlogAction(blogId));
        },
        deleteBlog (blogId) {
            dispatch(deleteBlogAction(blogId));
        },
        getBlog (blogId) {
            dispatch(getBlogAction(blogId));
        },
        setBlogPost (post) {
            dispatch(setBlogPostAction(post))
        }

    };
}

// TODO: change name to blog list again, drop approved.
const ApprovedBlogListContainer = connect(mapStateToProps, mapDispatchToProps)(BlogList);
export default ApprovedBlogListContainer;