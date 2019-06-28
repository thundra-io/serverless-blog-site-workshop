import {connect} from "react-redux";

// TODO: do not import relative
import {UrlHolder} from "../../components";
import {toggleUrlLock, setUrlText} from "../../store/actions/globalUrl";


function mapStateToProps(store) {
    // console.log("UrlHolderContainer; store: ", store);
    return {
        urlData: store.globalUrl
    };
}

function mapDispatchToProps(dispatch) {
    return {
        toggleUrlLock () {
            dispatch(toggleUrlLock());
        },
        setUrlText(urlString) {
            dispatch(setUrlText(urlString));
        }
    };
}

const UrlHolderContainer = connect(mapStateToProps, mapDispatchToProps)(UrlHolder);
export default UrlHolderContainer;