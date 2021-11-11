const urljoin = require('url-join');
const axios = require('axios');
const { executeCommand, generateUuid } = require('../src/utils');
const { BLOG_POST_STATUS } = require('../src/constants');

describe('Review blog post', function () {
    jest.setTimeout(600 * 1000);
    let apiGwUrl;

    beforeAll(async () => {
        await executeCommand(
            'make start',
            {
                env: {
                    BLOG_POST_ES_INDEX_IDENTIFIER: generateUuid(),
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

    it('updates blog state to REVIEWED', async () => {
        const blogPost = {
            title: 'Test Title',
            post: 'Test Post',
            username: 'John Doe',
            phoneNumber: null,
        };

        const addBlogUrl = urljoin(apiGwUrl, 'blog/post');
        const searchBlogUrl = urljoin(apiGwUrl, 'blog/search');
        const reviewBlogUrlFn = (postId) => {
            return urljoin(apiGwUrl, `blog/review/${postId}`);
        }

        const addBlogResult = await axios.post(addBlogUrl, blogPost);

        expect(addBlogResult).toBeTruthy();
        expect(addBlogResult.status).toBe(202);
        expect(addBlogResult.data).toBeTruthy();

        await expect().eventually(async () => {
            const searchSubmittedResult = await axios.get(searchBlogUrl, {
                state: BLOG_POST_STATUS.SUBMITTED
            });

            expect(searchSubmittedResult).toBeTruthy();
            expect(searchSubmittedResult.status).toBe(200);
            expect(searchSubmittedResult.data).toBeTruthy();

            expect(searchSubmittedResult.data.filter((element) => {
                return element.id === addBlogResult.data.postId
            })).toHaveLength(1);
        }, 30, 5);


        const reviewBlogUrl = reviewBlogUrlFn(addBlogResult.data.postId)
        const reviewBlogResult = await axios.post(reviewBlogUrl, JSON.stringify(blogPost.post));

        expect(reviewBlogResult).toBeTruthy();
        expect(reviewBlogResult.status).toBe(200);
        expect(reviewBlogResult.data).toBeTruthy();

        await expect().eventually(async () => {
            const searchSubmittedResult = await axios.get(searchBlogUrl, {
                state: BLOG_POST_STATUS.REVIEWED
            });

            expect(searchSubmittedResult).toBeTruthy();
            expect(searchSubmittedResult.status).toBe(200);
            expect(searchSubmittedResult.data).toBeTruthy();

            expect(searchSubmittedResult.data.filter((element) => {
                return element.id === addBlogResult.data.postId
            })).toHaveLength(1);
        }, 30, 5);
    });
});
