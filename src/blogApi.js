const thundra = require('@thundra/core');

const common = require('./common');
const blogPostService = require('./service/blogPostService');
const { generateUuid } = require('./utils/index');

module.exports.postBlogPost = (event, context, callback) => {
    console.log('Received blog post post request: ' + JSON.stringify(event));

    const body = JSON.parse(event.body);

    if (body.title && body.post && body.username) {
        const blogPost = {
            id: generateUuid(),
            title: body.title,
            post: body.post,
            username: body.username,
            phoneNumber: body.phoneNumber,
            timestamp: Date.now()
        };

        thundra.setTag('username', blogPost.username);

        blogPostService.sendBlogPostMessage(blogPost)
            .then(result => {
                const message = {
                    postId: blogPost.id
                };
                common.sendHttpResponse(202, message, callback);
            })
            .catch(err => {
                common.sendHttpResponse(500, err, callback);
            });
    } else {
        common.sendHttpResponse(400, '\'title\', \'post\' and \'username\' are required in body!', callback);
    }
};

module.exports.reviewBlogPost = (event, context, callback) => {
    console.log('Received blog post review request: ' + JSON.stringify(event));

    const blogPostId = event.pathParameters && event.pathParameters.blogPostId;
    if (blogPostId !== null) {
        thundra.addIncomingTraceLink(blogPostId + '::' + 'SUBMITTED');
        const post = JSON.parse(event.body);
        blogPostService.updateBlogPost(blogPostId, post, 'REVIEWED', 'SUBMITTED')
            .then(result => {
                if (result.Attributes) {
                    thundra.addOutgoingTraceLink(blogPostId + '::' + 'REVIEWED');
                    const id = result.Attributes.id.S;
                    const username = result.Attributes.username.S;
                    const phoneNumber = result.Attributes.phoneNumber ? result.Attributes.phoneNumber.S : null;
                    thundra.setTag('username', username);
                    if (phoneNumber) {
                        const notificationMessage =
                            'Hi ' + username + ', your blog post ' +
                            'with id=' + id + ' has been reviewed';
                        blogPostService.publishBlogPostNotification(notificationMessage, phoneNumber)
                            .then(result => {
                                common.sendHttpResponse(200, 'REVIEWED', callback);
                            })
                            .catch(err => {
                                common.sendHttpResponse(500, err, callback);
                            });
                    } else {
                        common.sendHttpResponse(200, 'REVIEWED', callback);
                    }
                } else {
                    common.sendHttpResponse(404, 'NOT FOUND', callback);
                }
            })
            .catch(err => {
                if (err.code === 'ConditionalCheckFailedException') {
                    common.sendHttpResponse(400, 'To review, blog post must be in \'SUBMITTED\' state!', callback);
                } else {
                    common.sendHttpResponse(500, err, callback);
                }
            });
    } else {
        common.sendHttpResponse(400, '\'blogPostId\' is required as path parameter!', callback);
    }
};

module.exports.publishBlogPost = (event, context, callback) => {
    console.log('Received blog post publish request: ' + JSON.stringify(event));

    const blogPostId = event.pathParameters && event.pathParameters.blogPostId;
    if (blogPostId !== null) {
        thundra.addIncomingTraceLink(blogPostId + '::' + 'REVIEWED');
        blogPostService.updateBlogPost(blogPostId, null, 'PUBLISHED', 'REVIEWED')
            .then(result => {
                if (result.Attributes) {
                    const id = result.Attributes.id.S;
                    const username = result.Attributes.username.S;
                    const phoneNumber = result.Attributes.phoneNumber ? result.Attributes.phoneNumber.S : null;
                    thundra.setTag('username', username);
                    if (phoneNumber) {
                        const notificationMessage =
                            'Hi ' + username + ', your blog post ' +
                            'with id=' + id + ' has been published';
                        blogPostService.publishBlogPostNotification(notificationMessage, phoneNumber)
                            .then(result => {
                                common.sendHttpResponse(200, 'PUBLISHED', callback);
                            })
                            .catch(err => {
                                common.sendHttpResponse(500, err, callback);
                            });
                    } else {
                        common.sendHttpResponse(200, 'PUBLISHED', callback);
                    }
                } else {
                    common.sendHttpResponse(404, 'NOT FOUND', callback);
                }
            })
            .catch(err => {
                if (err.code === 'ConditionalCheckFailedException') {
                    common.sendHttpResponse(400, 'To publish, blog post must be in \'REVIEWED\' state!', callback);
                } else {
                    common.sendHttpResponse(500, err, callback);
                }
            });
    } else {
        common.sendHttpResponse(400, '\'blogPostId\' is required as path parameter!', callback);
    }
};

module.exports.getBlogPost = (event, context, callback) => {
    console.log('Received blog post get request: ' + JSON.stringify(event));

    const blogPostId = event.pathParameters && event.pathParameters.blogPostId;
    if (blogPostId !== null) {
        blogPostService.getBlogPost(blogPostId)
            .then(result => {
                if (result.Item) {
                    const blogPost = {
                        id: result.Item.id.S,
                        title: result.Item.title.S,
                        post: result.Item.post.S,
                        username: result.Item.username.S,
                        timestamp: parseInt(result.Item.timestamp.N),
                        state: result.Item.state.S
                    };
                    if (result.Item.phoneNumber) {
                        blogPost.phoneNumber = result.Item.phoneNumber.S;
                    }
                    thundra.setTag('username', blogPost.username);
                    common.sendHttpResponse(200, blogPost, callback);
                } else {
                    common.sendHttpResponse(404, 'NOT FOUND', callback);
                }
            })
            .catch(err => {
                common.sendHttpResponse(500, err, callback);
            });
    } else {
        common.sendHttpResponse(400, '\'blogPostId\' is required as path parameter!', callback);
    }
};

module.exports.deleteBlogPost = (event, context, callback) => {
    console.log('Received blog post delete request: ' + JSON.stringify(event));

    const blogPostId = event.pathParameters && event.pathParameters.blogPostId;
    if (blogPostId !== null) {
        blogPostService.deleteBlogPost(blogPostId)
            .then(result => {
                console.log("Result: " + JSON.stringify(result));
                if (result.Attributes) {
                    common.sendHttpResponse(200, 'DELETED', callback);
                } else {
                    common.sendHttpResponse(404, 'NOT FOUND', callback);
                }
            })
            .catch(err => {
                common.sendHttpResponse(500, err, callback);
            });
    } else {
        common.sendHttpResponse(400, '\'blogPostId\' is required as path parameter!', callback);
    }
};

module.exports.searchBlogPosts = (event, context, callback) => {
    console.log('Received blog post search request: ' + JSON.stringify(event));

    const keyword = event.queryStringParameters && event.queryStringParameters.keyword;
    const username = event.queryStringParameters && event.queryStringParameters.username;
    const startTimestamp = event.queryStringParameters && event.queryStringParameters["start-timestamp"];
    const endTimestamp = event.queryStringParameters && event.queryStringParameters["end-timestamp"];
    const state = event.queryStringParameters && event.queryStringParameters["state"];

    blogPostService.searchBlogPosts(keyword, username, startTimestamp, endTimestamp, state)
        .then(result => {
            common.sendHttpResponse(200, result, callback);
        })
        .catch(err => {
            common.sendHttpResponse(500, err, callback);
        });
};
