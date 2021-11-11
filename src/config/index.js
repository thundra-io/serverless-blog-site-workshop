const URL = require('url');
const common = require('../common');

const getUrl = (url) => {
    if (!url) {
        return null;
    }
    const localstackHostname = process.env.LOCALSTACK_HOSTNAME;
    if (localstackHostname) {
        url = url.replace(new URL.URL(url).hostname, process.env.LOCALSTACK_HOSTNAME);
    }
    return url;
}

const config = {
    AWS_REGION: process.env.AWS_REGION,
    LOCALSTACK_URL: process.env.LOCALSTACK_HOSTNAME ? `http://${process.env.LOCALSTACK_HOSTNAME}:4566`: undefined,

    BLOG_POST_TABLE_NAME: process.env.BLOG_POST_TABLE_NAME,
    BLOG_POST_PROCESS_QUEUE_URL: getUrl(process.env.BLOG_POST_PROCESS_QUEUE_URL),
    BLOG_POST_PROCESS_QUEUE_DELAY_SECONDS: parseInt(process.env.BLOG_POST_PROCESS_QUEUE_DELAY_SECONDS || '1'),
    BLOG_POST_NOTIFICATION_TOPIC_ARN: process.env.BLOG_POST_NOTIFICATION_TOPIC_ARN,
    BLOG_POST_ES_HOST_NAME: process.env.BLOG_POST_ES_HOST_NAME,
    BLOG_POST_ES_HOST_PORT: parseInt(process.env.BLOG_POST_ES_HOST_PORT || '80'),
    BLOG_POST_ES_INDEX_IDENTIFIER: process.env.BLOG_POST_ES_INDEX_IDENTIFIER || common.calculateHashCode(process.env.THUNDRA_APIKEY),
}

module.exports = config;
