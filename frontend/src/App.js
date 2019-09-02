import React from 'react';
// import logo from './logo.svg';
import 'semantic-ui-css/semantic.min.css'
import './App.css';
import "react-datepicker/dist/react-datepicker.css";

import { Grid } from 'semantic-ui-react'

import {
  UrlHolderContainer,
  MenuButtonsContainer,
  BlogListContainer,
  AddBlogContainer,
} from "./containers";


export default class App extends React.Component {

	constructor(props) {
        super(props);

        this.state = {
            selectedMenu: menuItems.LIST_APPROVED_BLOG // default: LIST_APPROVED_BLOG
        }
    }

    selectAddBlogMenu = () => {
        this.setState({
            selectedMenu: menuItems.ADD_BLOG
        });
    }

    selectListApprovedBlogMenu = () => {
        this.setState({
            selectedMenu: menuItems.LIST_APPROVED_BLOG
        });
	}

    selectListReviewedBlogMenu = () => {
        this.setState({
            selectedMenu: menuItems.LIST_REVIEWED_BLOG
        });
    }

    selectListPublishedBlogMenu = () => {
        this.setState({
            selectedMenu: menuItems.LIST_PUBLISHED_BLOG
        });
    }

	renderSelectedMenu = () => {
		const {selectedMenu} = this.state;
		
		switch (selectedMenu) {
			case menuItems.ADD_BLOG:
				return (
					<AddBlogContainer />
				)
			case menuItems.LIST_APPROVED_BLOG:
				return (
					<BlogListContainer 
						blogState="APPROVED"
					/>
				)
            case menuItems.LIST_REVIEWED_BLOG:
                return (
					<BlogListContainer 
						blogState="REVIEWED"
					/>
            	)
            case menuItems.LIST_PUBLISHED_BLOG:
                return (
					<BlogListContainer 
						blogState="PUBLISHED"
					/>
            	)
			default:
				return (
					<div>default</div>
				)
		}
	}

	render() {
		return (
			<div className="App">
					
					<div className="app-header">
						<UrlHolderContainer />
					</div>

					<div className="app-content">
						<Grid>
							<Grid.Row>
								<Grid.Column width={2}>
									<MenuButtonsContainer 
										selectedMenu={this.state.selectedMenu}
										selectAddBlogMenu={this.selectAddBlogMenu}
										selectListApprovedBlogMenu={this.selectListApprovedBlogMenu}
        								selectListReviewedBlogMenu={this.selectListReviewedBlogMenu}
        								selectListPublishedBlogMenu={this.selectListPublishedBlogMenu}
									/>
									
								</Grid.Column>

								<Grid.Column width={14}>
									{this.renderSelectedMenu()}									
								</Grid.Column>
							</Grid.Row>
						</Grid>
					</div>      
			</div>
		);
	}
}

export const menuItems = {
    ADD_BLOG: "add_blog",
    LIST_APPROVED_BLOG: "list_approved_blog",
    LIST_REVIEWED_BLOG: "list_reviewed_blog",
    LIST_PUBLISHED_BLOG: "list_published_blog"
};
