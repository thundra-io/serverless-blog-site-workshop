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
            selectedMenu: menuItems.LIST_BLOG // default: LIST_BLOG
        }
    }

    selectAddBlogMenu = () => {
        this.setState({
            selectedMenu: menuItems.ADD_BLOG
        });
    }

    selectListBlogMenu = () => {
        this.setState({
            selectedMenu: menuItems.LIST_BLOG
        });
	}
	
	renderSelectedMenu = () => {
		const {selectedMenu} = this.state;
		
		switch (selectedMenu) {
			case menuItems.ADD_BLOG:
				return (
					<AddBlogContainer />
				)
			case menuItems.LIST_BLOG:
				return (
					<BlogListContainer />
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
										selectListBlogMenu={this.selectListBlogMenu}
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
    LIST_BLOG: "list_blog"
};
