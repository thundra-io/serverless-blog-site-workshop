import React, { Component } from 'react';
import { Button, Image, Divider } from 'semantic-ui-react';
import {menuItems} from "../../App";

import thundraImage from "../../assets/thundra.png";

class MenuButtons extends Component {

    renderMenuButtons = () => {
        const {selectedMenu} = this.props;
        return (
            <Button.Group vertical>
                <Button 
                    primary={selectedMenu === menuItems.LIST_APPROVED_BLOG}
                    onClick={this.props.selectListApprovedBlogMenu}
                >
                    List Approved Blogs
                </Button>

                <Button
                    primary={selectedMenu === menuItems.LIST_REVIEWED_BLOG}
                    onClick={this.props.selectListReviewedBlogMenu}
                >
                List Reviewed Blogs
                </Button>

                <Button
                    primary={selectedMenu === menuItems.LIST_PUBLISHED_BLOG}
                    onClick={this.props.selectListPublishedBlogMenu}
                >
                List Published Blogs
                </Button>

                <Button 
                    primary={selectedMenu === menuItems.ADD_BLOG}
                    onClick={this.props.selectAddBlogMenu}
                >
                    Add Blog
                </Button>
            </Button.Group>
        );
    }

    render() {
        return (
            <div className="buttons-holder">
                {this.renderMenuButtons()}
                <Divider />
                <Image 
                    as="a"
                    href="https://console.thundra.io"
                    target="_blank"
                    size='tiny' 
                    src={thundraImage} 
                />
            </div>
        );
    }
}

export default MenuButtons;
