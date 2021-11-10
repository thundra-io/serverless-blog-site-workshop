const urljoin = require('url-join');
const axios = require('axios');
const { executeCommand } = require('../src/utils');
const { BLOG_POST_STATUS } = require('../src/constants');

describe('Review blog post', function () {
    jest.setTimeout(300 * 1000);
    let apiGwUrl;

    beforeAll(async () => {
        await executeCommand(
            'make start',
            {
                env: {
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
        await executeCommand('docker stop $(docker ps -a -q --filter ancestor=localstack/localstack --format=\"{{.ID}}\")');
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
            const searchSubmittedResult = await axios.get(searchBlogUrl, {});

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
                state: 'REVIEWED'
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
