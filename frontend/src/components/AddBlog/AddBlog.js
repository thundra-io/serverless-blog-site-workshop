import React, {Component} from 'react';
import { Form } from 'semantic-ui-react';

class AddBlog extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "", // required
            phone: "",
            title: "", // required
            post: "", // required
        }
    }

    handleChange = (e, {name, value}) => {
        this.setState({
            [name]: value
        });
    }

    handlePostSubmit = (e, data) => {
        console.log("AddBlog, handlePostSubmit; e, data: ", e, data);
        const {title, post, username, phone} = this.state;
        this.props.addBlog(title, post, username, phone);

        // clear form
        this.setState({
            username: "",
            phone: "",
            title: "",
            post: "",
        });
    }

    isStrEmpty = (testStr) => {
        if (typeof testStr !== "string") {
            return true;
        }

        const str = testStr.trim();
        return (!str || 0 === str.length);
    }

    isFormValid = () => {
        const {username, title, post} = this.state;
        if (
            !(!this.isStrEmpty(username) &&
            !this.isStrEmpty(title) &&
            !this.isStrEmpty(post))
        ) {
            return true;
        }

        return false;
    }

    render() {
        // console.log("AddBlog; props, state: ", this.props, this.state);

        return (

            <div className="add-blog-form">
                <Form>
                    <Form.Input 
                        fluid 
                        label='Title(*)' 
                        placeholder='Title' 
                        name="title" 
                        value={this.state.title}
                        onChange={this.handleChange}
                    />

                    <Form.TextArea 
                        label='Post(*)' 
                        placeholder='Write your post here...' 
                        rows={5}
                        name="post"
                        value={this.state.post}
                        onChange={this.handleChange}
                    />

                    <Form.Group widths='equal'>
                        <Form.Input 
                            fluid 
                            label='User(*)' 
                            placeholder='Username' 
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                        />
                        <Form.Input 
                            fluid 
                            label='Phone' 
                            placeholder='+901231231212' 
                            name="phone" 
                            value={this.state.phone}
                            onChange={this.handleChange}
                        />
                    </Form.Group>

                    <Form.Button
                        type='submit' 
                        onClick={this.handlePostSubmit}
                        disabled={this.isFormValid()}
                    >
                        Submit
                    </Form.Button>
                </Form>
            </div>
        );
    }
}

export default AddBlog;