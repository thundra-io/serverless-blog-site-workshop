// const thundra = require('@thundra/core');

const blogPostService = require('./service/blogPostService');

module.exports.handler = async(event, context) => {
	console.log('Processing blog post request: ' + JSON.stringify(event));

	const promises = [];
	const records = event.Records;
	for (let record of records) {
		const blogPost = JSON.parse(record.body);
		console.log('Processing blog post: ' + JSON.stringify(blogPost) + ' ...');
        let hiMessage = 'Hi ' + blogPost.username;
		const rejectReason = blogPostService.validateBlogPost(blogPost.post);
		if (!rejectReason) {
            blogPost.state = 'SUBMITTED';
            const promise1 = blogPostService.saveBlogPost(blogPost);
            // thundra.InvocationTraceSupport.addOutgoingTraceLink(blogPost.id + '::' + 'SUBMITTED');
            promises.push(promise1);
            const promise2 =
                blogPostService.publishBlogPostNotification(
                    hiMessage + ', your blog post with id=' + blogPost.id + ' has been accepted',
					blogPost.phoneNumber);
            promises.push(promise2);
        } else {
            const promise =
                blogPostService.publishBlogPostNotification(
                    hiMessage + ', your blog post with id=' + blogPost.id + ' has been rejected ' +
					'because of the following reason: ' + rejectReason,
                    blogPost.phoneNumber);
            promises.push(promise);
		}
	}
	await Promise.all(promises);
};
