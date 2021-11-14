const urljoin = require('url-join');
const axios = require('axios');

const { executeCommand, generateShortUuid } = require('../src/utils');
const { BLOG_POST_STATUS } = require('../src/constants');

describe('Submit and search blog post', function () {

    jest.setTimeout(300 * 1000);

    let apiGwUrl;

    beforeAll(async () => {
        await executeCommand(
            'make start',
            {
                env: {
                    BLOG_POST_ES_INDEX_IDENTIFIER: generateShortUuid(),
                    ...process.env
                }
            }
        );

        const resultRaw = await executeCommand('awslocal apigateway get-rest-apis');
        if (resultRaw && resultRaw.stdout) {
            const result = JSON.parse(resultRaw.stdout);
            if (result && result.items) {
                const restApiId = result.items[0].id;
                apiGwUrl = `http://localhost:4566/restapis/${restApiId}/local/_user_request_`;
            }
        }
    });

    afterAll(async () => {
        await executeCommand('make stop-localstack');
    });

    it('submitted blog post should be able to searched', async () => {
        const userName = 'john-doe';
        const blogPost = {
            title: 'Hello',
            post: 'Hello world!',
            username: userName,
        };

        /////////////////////////////////////////////////////////////////////////////////

        // 1. Submit blog post first

        const addBlogUrl = urljoin(apiGwUrl, 'blog/post');
        const addBlogResult = await axios.post(addBlogUrl, blogPost);
        console.log("Add blog result:", addBlogResult.data);
        expect(addBlogResult).toBeTruthy();
        expect(addBlogResult.status).toBe(202);
        expect(addBlogResult.data).toBeTruthy();

        /////////////////////////////////////////////////////////////////////////////////

        // 2. Later verify that submitted blog post is able to be retrieved

        const getBlogUrl = urljoin(apiGwUrl, `blog/${addBlogResult.data.postId}`);

        await expect().eventually(async () => {
            const getBlogResult = await axios.get(getBlogUrl);
            console.log("Get blog result:", getBlogResult.data);
            expect(getBlogResult).toBeTruthy();
            expect(getBlogResult.status).toBe(200);
            expect(getBlogResult.data).toBeTruthy();
            expect(getBlogResult.data.id).toBe(addBlogResult.data.postId);
            expect(getBlogResult.data.username).toBe(userName);
            expect(getBlogResult.data.state).toBe(BLOG_POST_STATUS.SUBMITTED);
        }, 30, 5);

        /////////////////////////////////////////////////////////////////////////////////

        // 3. Then verify that submitted blog post is able to be searched

        const searchBlogUrl = urljoin(apiGwUrl, `blog/search?username=${userName}&state=${BLOG_POST_STATUS.SUBMITTED}`);
        await expect().eventually(async () => {
            const searchSubmittedResult = await axios.get(searchBlogUrl);
            console.log("Search submitted result:", searchSubmittedResult.data);
            expect(searchSubmittedResult).toBeTruthy();
            expect(searchSubmittedResult.status).toBe(200);
            expect(searchSubmittedResult.data).toBeTruthy();
            expect(searchSubmittedResult.data.length).toBe(1);
            expect(searchSubmittedResult.data[0].id).toBe(addBlogResult.data.postId);
            expect(searchSubmittedResult.data[0].username).toBe(userName);
            expect(searchSubmittedResult.data[0].state).toBe(BLOG_POST_STATUS.SUBMITTED);
        }, 30, 5);
    });

});
