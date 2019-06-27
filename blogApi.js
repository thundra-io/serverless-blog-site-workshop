const thundra = require('@thundra/core');
const common = require('./common');
const blogPostService = require('./service/blogPostService');

const uuidv1 = require('uuid/v1');

module.exports.postBlogPost = (event, context, callback) => {
	console.log('Received blog post post request: ' + JSON.stringify(event));

	const body = JSON.parse(event.body);

	const blogPost = {
		id: uuidv1(),
        title: body.title,
		post: body.post,
        username: body.username,
        phoneNumber: body.phoneNumber,
		timestamp: Date.now()
	};

    thundra.InvocationSupport.setTag('username', blogPost.username);

	blogPostService.sendBlogPostMessage(blogPost)
		.then(result => {
			const message = {
				postId: blogPost.id
			};
			common.sendHttpResponse(200, message, callback);
		})
		.catch(err => {
        	common.sendHttpResponse(500, err, callback);
		});
};

module.exports.getBlogPost = (event, context, callback) => {
    console.log('Received blog post get request: ' +  JSON.stringify(event));

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
                    };
                    if (result.Item.phoneNumber) {
                        blogPost.phoneNumber = result.Item.phoneNumber.S;
                    }
                    common.sendHttpResponse(200, blogPost, callback);
                } else {
                    common.sendHttpResponse(404, 'Not Found', callback);
                }
            })
            .catch(err => {
                common.sendHttpResponse(500, err, callback);
            });
    } else {
        common.sendHttpResponse(400, '\'blogPostId\' is required!', callback);
	}
};

module.exports.deleteBlogPost = (event, context, callback) => {
    console.log('Received blog post delete request: ' + JSON.stringify(event));

    const blogPostId = event.pathParameters && event.pathParameters.blogPostId;
    if (blogPostId !== null) {
        blogPostService.deleteBlogPost(blogPostId)
            .then(result => {
                common.sendHttpResponse(200, 'DELETED', callback);
            })
            .catch(err => {
                common.sendHttpResponse(500, err, callback);
            });
    } else {
        common.sendHttpResponse(400, '\'blogPostId\' is required!', callback);
    }
};

module.exports.searchBlogPosts = (event, context, callback) => {
    console.log('Received blog post search request: ' + JSON.stringify(event));

    const keyword = event.queryStringParameters && event.queryStringParameters.keyword;
    const username = event.queryStringParameters && event.queryStringParameters.username;
    const startTimestamp = event.queryStringParameters && event.queryStringParameters["start-timestamp"];
    const endTimestamp = event.queryStringParameters && event.queryStringParameters["end-timestamp"];
    if (keyword !== null || username !== null || startTimestamp !== null || endTimestamp !== null) {
        blogPostService.searchBlogPosts(keyword, username, startTimestamp, endTimestamp)
            .then(result => {
                const blogPosts = [];
                for (let hit of result.hits.hits) {
                    const blogPost = {
                        id: hit._id,
                        username: hit._source.username,
                        timestamp: hit._source.timestamp
                    };
                    blogPosts.push(blogPost);
                }
                common.sendHttpResponse(200, blogPosts, callback);
            })
            .catch(err => {
                common.sendHttpResponse(500, err, callback);
            });
    } else {
        common.sendHttpResponse(
            400,
            'At least one of the \'keyword\', \'username\', \'start-timestamp\' and \'end-timestamp\' parameters is required!',
            callback);
    }
}
