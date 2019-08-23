import React, {Component} from 'react';
import { Modal, Loader, Dimmer, Table, Icon, Button, Popup, Form, TextArea} from 'semantic-ui-react';
import DatePicker from "react-datepicker";
import "./BlogList.css"

class BlogList extends Component {

    constructor(props) {
        super(props);

        this.state = this.initializeState();
    }

    initializeState = () => {
        // console.log("BlogList, intitializeState")
        const endDate = new Date();
        const startDate = new Date(endDate.getTime() - 604800000); // this is one week ago.

        return {
            isBlogModalOpen: false,
            isReviewBlogModalOpen: false,
            isPublishBlogModalOpen: false,
            reviewBlogModalPost: "",
            searchUsername: "",
            searchKeyword: "", // title or post
            searchTimeStart: startDate,
            searchTimeEnd: endDate
        }
    }

    componentDidMount() {
        this.fetchSearchBlogs();
    }

    static getDerivedStateFromProps(props, state) {
        // if (props.clickedBlog.blogData.post !== state.reviewBlogModalPost && state.renderReviewBlogModal === "") {
        if (props.clickedBlog.blogData.post !== state.reviewBlogModalPost) {
            console.log("getDerivedStateFromProps; props, state: ", props, state);
            return {
                reviewBlogModalPost: props.clickedBlog.blogData.post
                // reviewBlogModalPost: state.reviewBlogModalPost
            }
        }

        return null;
    }

    fetchSearchBlogs = () => {
        const {searchKeyword, searchUsername, searchTimeStart, searchTimeEnd} = this.state
        const {blogState} = this.props;
        this.props.searchBlogs(searchKeyword, searchUsername, searchTimeStart, searchTimeEnd, blogState);
    }

    componentDidUpdate(prevProps) {
        // console.log("BlogList, CDU; props, prevProps: ", this.props, prevProps);

        if (prevProps.deletedBlog.isDeleteBlogFetching &&
            this.props.deletedBlog.isDeleteBlogFetching !== prevProps.deletedBlog.isDeleteBlogFetching
        ) {
            // console.log("BlogList, CDU; props, prevProps: ", this.props, prevProps);
            setTimeout(() => {
                // fetch search blogs after delete happens.
                this.fetchSearchBlogs();
            }, 2000);
        }

        // Fetch blogs if blogState changes.
        if (prevProps.blogState !== this.props.blogState) {
            this.fetchSearchBlogs();
        }
    }

    handleBlogItemClick = (blog) => {
        console.log("handleBlogItemClick; blog: ", blog);
        this.setState({
            isBlogModalOpen: true
        });
        this.props.getBlog(blog.id);
    }

    handleReviewBlogIconClick = (e,blog) => {
        e.stopPropagation(); // this is to prevent blogItemClick instead of review icon click.
        console.log("handleReviewBlogIconClick; blog: ", blog);
        this.setState({
            isReviewBlogModalOpen: true,
            // reviewBlogModalPost: blog.post
        });
        this.props.getBlog(blog.id);
    }

    handlePublishBlogIconClick = (e,blog) => {
        e.stopPropagation(); // this is to prevent blogItemClick instead of review icon click.
        console.log("handleReviewBlogIconClick; blog: ", blog);
        this.setState({
            isPublishBlogModalOpen: true,
        });
        this.props.getBlog(blog.id);
    }

    handleBlogItemDeleteClick = (e, blog) => {
        e.stopPropagation();
        console.log("handleBlogItemDeleteClick; blog: ", blog);
        this.props.deleteBlog(blog.id);
    }

    renderBlogListTable = () => {
        const {blogList} = this.props.searchedBlogs;
        // console.log("BlogList, renderBlogListTable; blogList: ", blogList);

        const tableRows = blogList.map( blog => {
            const blogTime = new Date(blog.timestamp).toDateString();
            return (
                <Table.Row
                    key={blog.id}
                    className="table-data-row"
                    onClick={() => this.handleBlogItemClick(blog)}
                >
                    <Table.Cell>{blog.title}</Table.Cell>
                    <Table.Cell>{blog.username}</Table.Cell>
                    <Table.Cell>{blogTime}</Table.Cell>
                    <Table.Cell
                        textAlign="right"
                    >
                        { this.props.blogState === "APPROVED" &&
                            <Popup
                                content={`Review post by ${blog.username}`}
                                trigger={
                                    <Button 
                                        icon
                                        compact
                                        size='mini'
                                        // onClick={(e) => console.log("edit clicked; e: ", e)}
                                        onClick={(e) => this.handleReviewBlogIconClick(e, blog)}
                                    >
                                        <Icon name='edit outline' />
                                    </Button>
                                }
                            />
                        }

                        { this.props.blogState === "REVIEWED" &&
                            <Popup
                                content={`Publish post by ${blog.username}`}
                                trigger={
                                    <Button 
                                        icon
                                        compact
                                        size='mini'
                                        // onClick={(e) => console.log("edit clicked; e: ", e)}
                                        onClick={(e) => this.handlePublishBlogIconClick(e, blog)}
                                    >
                                        <Icon name='paper plane outline' />
                                    </Button>
                                }
                            />
                        }
                        

                        <Popup
                            content={`Delete post by ${blog.username}`}
                            trigger={
                                <Button 
                                    icon
                                    compact
                                    size='mini'
                                    onClick={(e) => this.handleBlogItemDeleteClick(e, blog)}
                                >
                                    <Icon name='trash alternate' />
                                </Button>
                            }
                        />
                    </Table.Cell>
                </Table.Row>
            );
        })

        return (
            <Table 
                celled
                selectable
            >
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Title</Table.HeaderCell>
                        <Table.HeaderCell>User</Table.HeaderCell>
                        <Table.HeaderCell>Date</Table.HeaderCell>
                        <Table.HeaderCell>Action</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>

                <Table.Body>
                    {tableRows}
                </Table.Body>
            </Table>
        )
    }

    renderBlogModal = () => {
        const {blogData} = this.props.clickedBlog;
        const blogTime = new Date(blogData.timestamp).toDateString();

        return (
            <Modal
                open={this.state.isBlogModalOpen}
                centered={false}
                onClose={() => this.setState({isBlogModalOpen: false})}
            >
                <Modal.Header>{blogData.title}</Modal.Header>
                <Modal.Content>

                    <Modal.Description>
                        <p>{blogData.post}</p>
                        <p>Author: {blogData.username}</p>
                        <p>Phone: {blogData.phoneNumber}</p>
                        <p>Date: {blogTime}</p>
                    </Modal.Description>
                    
                </Modal.Content>
            </Modal>
        );
    }

    renderReviewBlogModal = () => {

        const {blogData} = this.props.clickedBlog;
        console.log("renderReviewBlogModal; blogData, state: ", blogData, this.state);
        const blogTime = new Date(blogData.timestamp).toDateString();

        return (
            <Modal
                open={this.state.isReviewBlogModalOpen}
                centered={false}
                onClose={() => this.setState({isReviewBlogModalOpen: false})}
            >
                <Modal.Header>{blogData.title}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.TextArea 
                            rows={5}
                            placeholder='Tell us more' 
                            // name="reviewBlogModalPost"
                            value={this.state.reviewBlogModalPost}
                            // onChange={this.handleChange}

                            // onInput={(e,data) => {
                            onChange={(e,data) => {
                                console.log("text area; e, data: ", e, data);
                                this.setState({
                                    reviewBlogModalPost: data.value
                                    // reviewBlogModalPost: e.target.vaule
                                });
                                // postData = data.value;
                            }}
                        />   
                    </Form>
                    <Modal.Description>
                        <p>Author: {blogData.username}</p>
                        <p>Phone: {blogData.phoneNumber}</p>
                        <p>Date: {blogTime}</p>
                    </Modal.Description>
                    
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setState({isReviewBlogModalOpen: false})}>
                        Close
                    </Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Accept Post"
                        onClick={() => {
                            this.props.reviewBlog(blogData.id, this.state.reviewBlogModalPost);
                            this.setState({isReviewBlogModalOpen: false});
                        }}
                    />
                </Modal.Actions>
            </Modal>
        );
    }

    renderPublishBlogModal = () => {

        const {blogData} = this.props.clickedBlog;
        console.log("renderPublishBlogModal; blogData, state: ", blogData, this.state);
        const blogTime = new Date(blogData.timestamp).toDateString();

        return (
            <Modal
                open={this.state.isPublishBlogModalOpen}
                centered={false}
                onClose={() => this.setState({isPublishBlogModalOpen: false})}
            >
                <Modal.Header>Are you sure to publish blog?</Modal.Header>
                <Modal.Content>
                    
                    <Modal.Description>
                        <p>Title: {blogData.title}</p>
                        <p>Author: {blogData.username}</p>
                        <p>Phone: {blogData.phoneNumber}</p>
                        <p>Date: {blogTime}</p>
                    </Modal.Description>
                    
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.setState({isPublishBlogModalOpen: false})}>
                        Close
                    </Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Publish"
                        onClick={() => {
                            this.props.publishBlog(blogData.id);
                            this.setState({isPublishBlogModalOpen: false});
                        }}
                    />
                </Modal.Actions>
            </Modal>
        );
    }

    handleChange = (e, {name, value}) => {
        this.setState({
            [name]: value
        });
    }

    handleSearchSubmit = (e, data) => {
        // console.log("BlogList, handlePostSubmit; e, data: ", e, data);
        this.fetchSearchBlogs();
    }

    renderSearchForm = () => {

        return (
            <Form>
                <Form.Group>
                    <Form.Input 
                        width={3}
                        fluid 
                        label='User' 
                        placeholder='Username' 
                        name="searchUsername"
                        value={this.state.searchUsername}
                        onChange={this.handleChange}
                    />
                    <Form.Input 
                        width={3}
                        fluid 
                        label='Keyword' 
                        placeholder='Any word' 
                        name="searchKeyword" 
                        value={this.state.searchKeyword}
                        onChange={this.handleChange}
                    />
                    <Form.Field 
                        width={3}
                    >
                        <label>Start Time</label>
                        <DatePicker
                            selected={this.state.searchTimeStart}
                            timeInputLabel="Time:"
                            onChange={(date) => {
                                // console.log("BlogList; startTime: ", date);
                                this.setState({
                                    searchTimeStart: date
                                });
                            }}
                            dateFormat="dd/MM/yyyy hh:mm aa"
                            showTimeInput
                        />
                    </Form.Field>

                    <Form.Field 
                        width={3}
                    >
                        <label>End Time</label>
                        <DatePicker
                            selected={this.state.searchTimeEnd}
                            timeInputLabel="Time:"
                            onChange={(date) => {
                                // console.log("BlogList; endTime: ", date);
                                this.setState({
                                    searchTimeEnd: date
                                });
                            }}
                            dateFormat="dd/MM/yyyy hh:mm aa"
                            showTimeInput
                        />
                    </Form.Field>

                    <Form.Field 
                        width={4}
                        className="search-form-button"
                    >
                        <Button.Group>
                            <Button
                                type='submit' 
                                onClick={this.handleSearchSubmit}
                            >
                                Submit
                            </Button>

                            <Button
                                onClick={() => {
                                    console.log("clear/reset form clicked");
                                    this.setState(this.initializeState(), () => this.fetchSearchBlogs());
                                }}
                            >
                                Reset
                            </Button>
                        </Button.Group>
                    </Form.Field>

                </Form.Group>
            </Form>
        )
    }

    render() {
        console.log("BlogList; props, state: ", this.props, this.state);
        const {isBlogDataFetching} = this.props.clickedBlog;

        return (
            <>
                <div className="blog-search-form">
                    {this.renderSearchForm()}
                </div>
                <div className="blog-list">
                    {isBlogDataFetching ?
                        <Dimmer inverted active>
                            <Loader>Loading</Loader>
                        </Dimmer>:
                        <>
                            {this.renderBlogModal()}
                            {this.renderReviewBlogModal()}
                            {this.renderPublishBlogModal()}
                        </>
                    }
                    {this.renderBlogListTable()}
                </div>
            </>
        );
    }
}

export default BlogList;