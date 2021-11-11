const urljoin = require('url-join');
const axios = require('axios');
const { executeCommand } = require('../src/utils');

const { elasticsearchChaos } = require('./config/chaos');

describe('Add blog post', function () {
    jest.setTimeout(600 * 1000);
    let apiGwUrl;

    beforeAll(async () => {
        await executeCommand(
            'make start',
            {
                env: {
                    THUNDRA_ELASTICSEARCH_CHAOS: JSON.stringify(elasticsearchChaos),
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

    it('shows up on search as SUBMITTED', async () => {
        const blogPost = {
            title: 'Test Title',
            post: 'Test Post',
            username: 'John Doe',
            phoneNumber: null,
        };

        const addBlogUrl = urljoin(apiGwUrl, 'blog/post');
        const searchBlogUrl = urljoin(apiGwUrl, 'blog/search');

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
    });
});