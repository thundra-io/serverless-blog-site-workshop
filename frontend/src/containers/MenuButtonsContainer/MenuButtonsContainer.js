import {connect} from "react-redux";

// TODO: do not import relative
import {MenuButtons} from "../../components";


function mapStateToProps(store) {
    // console.log("MenuButtonsContainer; store: ", store);
    return {
        
    };
}

function mapDispatchToProps(dispatch) {
    return {

    };
}

const MenuButtonsContainer = connect(mapStateToProps, mapDispatchToProps)(MenuButtons);
export default MenuButtonsContainer;