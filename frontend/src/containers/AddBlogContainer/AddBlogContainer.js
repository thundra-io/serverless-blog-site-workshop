import {connect} from "react-redux";

// TODO: do not import relative
import {AddBlog} from "../../components";
import {addBlogAction} from "../../store/actions/addBlog";


function mapStateToProps(store) {
    console.log("AddBlogContainer; store: ", store);
    return {
        searchedBlogs: store.searchBlog,
        addedBlog: store.addBlog
    };
}

function mapDispatchToProps(dispatch) {
    return {

        addBlog (title, post, username, phoneNumber) {
            dispatch(addBlogAction(title, post, username, phoneNumber));
        }

    };
}

const AddBlogContainer = connect(mapStateToProps, mapDispatchToProps)(AddBlog);
export default AddBlogContainer;