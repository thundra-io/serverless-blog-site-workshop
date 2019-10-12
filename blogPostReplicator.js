const thundra = require('@thundra/core');

const blogPostService = require('./service/blogPostService');

module.exports.handler = (event, context, callback) => {
	console.log('Processing blog post replication event: ' + JSON.stringify(event));

	const records = event.Records;
	const promises = [];
	for (let record of records) {
        if (record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
            const id = record.dynamodb.Keys.id.S;
            const title = record.dynamodb.NewImage.title.S;
            const post = record.dynamodb.NewImage.post.S;
            const username = record.dynamodb.NewImage.username.S;
            const phoneNumber = record.dynamodb.NewImage.phoneNumber ? record.dynamodb.NewImage.phoneNumber.S : null;
            const timestamp = parseInt(record.dynamodb.NewImage.timestamp.N);
            const state = record.dynamodb.NewImage.state.S;
            const blogPost = {
                id: id,
                title: title,
                post: post,
                username: username,
                timestamp: timestamp,
                state: state
            };
            if (phoneNumber) {
                blogPost.phoneNumber = phoneNumber;
            }
            console.log('Saving blog post: ', JSON.stringify(blogPost));
            const promise = blogPostService.saveBlogPostToIndex(blogPost);
            promises.push(promise);
        } else if (record.eventName === 'REMOVE') {
            const id = record.dynamodb.Keys.id.S;
            console.log('Deleting blog post with id: ', id);
            const promise = blogPostService.deleteBlogPostFromIndex(id);
            promises.push(promise);
        }
	}
	Promise.all(promises)
        .then(result => {
	        callback(null, 'OK');
        }).
        catch(err => {
            callback(err);
        })
};
