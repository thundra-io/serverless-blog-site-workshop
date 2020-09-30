const AWS = require('aws-sdk');
const es = require('elasticsearch');

const BLOG_POST_TABLE_NAME = process.env.BLOG_POST_TABLE_NAME;
const BLOG_POST_PROCESS_QUEUE_URL = process.env.BLOG_POST_PROCESS_QUEUE_URL;
const BLOG_POST_PROCESS_QUEUE_DELAY_SECONDS = parseInt(process.env.BLOG_POST_PROCESS_QUEUE_DELAY_SECONDS || '1');
const BLOG_POST_NOTIFICATION_TOPIC_ARN = process.env.BLOG_POST_NOTIFICATION_TOPIC_ARN;
const BLOG_POST_ES_HOST_NAME = process.env.BLOG_POST_ES_HOST_NAME;
const BLOG_POST_ES_HOST_PORT = parseInt(process.env.BLOG_POST_ES_HOST_PORT || '80');
const BLOG_POST_ES_INDEX_IDENTIFIER = process.env.BLOG_POST_ES_INDEX_IDENTIFIER;

const WHITE_SPACE_REGEX = new RegExp("\\s+");
const BANNED_BLOG_POST_WORDS = new Set(['server']);
const MAX_BLOG_POST_LENGTH = 10000;
const INDEX_PARTITION_COUNT = 10;

AWS.config.update({region: process.env.AWS_REGION});

var dynamodb = new AWS.DynamoDB(); // new AWS.DynamoDB.DocumentClient();
var sqs = new AWS.SQS();
var sns = new AWS.SNS();
// Only 'us-east-1', 'us-west-2', 'eu-west-1', 'ap-northeast-1', 'ap-southeast-1' and 'ap-southeast-2' regions support SMS
var snsForSMS = new AWS.SNS({region: 'us-west-2'});

var esClient = new es.Client({
    hosts: [BLOG_POST_ES_HOST_NAME + ':' + BLOG_POST_ES_HOST_PORT]
});

function calculateHashCode(s) {
    if (!s) {
        return 0;
    }
    try {
        let h = 0, l = s.length, i = 0;
        if (l > 0) {
            while (i < l) {
                h = (h << 5) - h + s.charCodeAt(i++) | 0;
            }
        }
        return Math.abs(h);
    } catch (e) {
        console.error(`Unable to calculate hash code for string ${s}`);
    }
}

module.exports.validateBlogPost = (post) => {
    console.log('Validation blog post: ' + post);

    if (post.length > MAX_BLOG_POST_LENGTH) {
        return 'Exceeded max blog length ' + MAX_BLOG_POST_LENGTH;
    }
    for (let word of post.split(WHITE_SPACE_REGEX)) {
        if (BANNED_BLOG_POST_WORDS.has(word.toLowerCase())) {
            return 'Has banned word: ' + word;
        }
    }
    return null;
};

module.exports.getBlogPost = (id) => {
    console.log('Getting blog post with id: ' + id);

    const params = {
        TableName: BLOG_POST_TABLE_NAME,
        Key: {
            'id': {S: id}
        }
    };
    return dynamodb.getItem(params).promise();
};

module.exports.updateBlogPost = (id, post, state, prevState) => {
    console.log('Updating blog post with id: ' + id);

    const attributeUpdates = { };
    if (post) {
        attributeUpdates['post'] = {
            Action: 'PUT',
            Value: {S: post}
        }
    }
    if (state) {
        attributeUpdates['state'] = {
            Action: 'PUT',
            Value: {S: state}
        }
    }

    const params = {
        TableName: BLOG_POST_TABLE_NAME,
        Key: {
            'id': {S: id}
        },
        AttributeUpdates: attributeUpdates,
        Expected: {
            'state': {
                ComparisonOperator: "EQ",
                Value: {S: prevState}
            }
        },
        ReturnValues: 'ALL_NEW'
    };
    return dynamodb.updateItem(params).promise();
};

module.exports.saveBlogPost = (blogPost) => {
    console.log('Saving blog post: ' + JSON.stringify(blogPost));

    const params = {
        TableName: BLOG_POST_TABLE_NAME,
        Item: {
            'id': {S: blogPost.id},
            'title': {S: blogPost.title},
            'post': {S: blogPost.post},
            'username': {S: blogPost.username},
            'timestamp': {N: blogPost.timestamp.toString()},
            'state': {S: blogPost.state}
        }
    };
    if (blogPost.phoneNumber && blogPost.phoneNumber.length > 0) {
        params.Item['phoneNumber'] = {S: blogPost.phoneNumber};
    }
    return dynamodb.putItem(params).promise();
};

module.exports.deleteBlogPost = (blogPostId) => {
    console.log('Deleting blog post with id: ' + blogPostId);

    const params = {
        TableName: BLOG_POST_TABLE_NAME,
        Key: {
            'id': {S: blogPostId}
        },
        ReturnValues: 'ALL_OLD'
    };
    return dynamodb.deleteItem(params).promise();
};

module.exports.sendBlogPostMessage = (blogPost) => {
    console.log('Sending blog post message: ' + JSON.stringify(blogPost));

    const params = {
        MessageBody: JSON.stringify(blogPost),
        QueueUrl: BLOG_POST_PROCESS_QUEUE_URL,
        DelaySeconds: BLOG_POST_PROCESS_QUEUE_DELAY_SECONDS,
    };

    return sqs.sendMessage(params).promise();
};

module.exports.publishBlogPostNotification = (message, phoneNumber) => {
    console.log('Publishing blog post notification: ' + message);

    const promises = [];
    if (phoneNumber && phoneNumber.length > 0) {
        const params = {
            PhoneNumber: phoneNumber,
            Message: message
        };
        const promise = new Promise((resolve, reject) => {
            snsForSMS.publish(params).promise()
                .then(result => {
                    return resolve(result);
                })
                .catch(err => {
                    if (err.code === 'InvalidParameter') {
                        console.log('Couldn\'t send SMS as the phone number is invalid: ' + phoneNumber);
                        return resolve(err);
                    } else {
                        return reject(err);
                    }
                });
        });
        promises.push(promise);
    }
    const params = {
        TopicArn: BLOG_POST_NOTIFICATION_TOPIC_ARN,
        Message: message
    };
    const promise = sns.publish(params).promise();
    promises.push(promise);
    return Promise.all(promises);
};

module.exports.saveBlogPostToIndex = (blogPost) => {
    console.log('Indexing blog post: ' + JSON.stringify(blogPost));

    let partition;
    const hashCode = calculateHashCode(blogPost.username);
    if (hashCode) {
        partition = hashCode % INDEX_PARTITION_COUNT;
    }
    if (partition) {
        const indexName = `blogpost-${BLOG_POST_ES_INDEX_IDENTIFIER}-${partition}`;
        return esClient.index({
            index: indexName,
            type: '_doc',
            id: blogPost.id,
            body: {
                "title": blogPost.title,
                "post": blogPost.post,
                "username": blogPost.username,
                "phoneNumber": blogPost.phoneNumber,
                "timestamp": blogPost.timestamp,
                "state": blogPost.state
            }
        });
    } else {
        // If we couldn't resolve partition, we cannot save the blog post.
        // But if we reject here, it will be retried infinitely from DynamoDB streams.
        // So we are returning resolved promise here with "false" value
        // which indicates that it is not saved but skipped silently without need to retry
        return Promise.resolve(false);
    }
};

module.exports.deleteBlogPostFromIndex = (blogPostId) => {
    console.log('Deleting blog post with id=' + blogPostId);

    return esClient.delete({
            index: 'blogpost-' + BLOG_POST_ES_INDEX_IDENTIFIER + "-*",
            type: '_doc',
            body: {
                query: {
                    match: { _id: blogPostId }
                }
            }
    });
};

module.exports.searchBlogPosts = (keyword, username, startTimestamp, endTimestamp, state) => {
    console.log('Searching blog posts for keyword=' + keyword + ', username=' + username +
                ', startTimestamp=' + startTimestamp + ', endTimestamp=' + endTimestamp);
    const conditions = [];
    if (keyword) {
        conditions.push({
            bool: {
                should: [
                    {
                        match: {
                            "title": keyword
                        }
                    },
                    {
                        match: {
                            "post": keyword
                        }
                    }
                ]
            }
        });
    }
    if (username) {
        conditions.push({
            term: {
                "username": {
                    "value": username
                }
            }
        });
    }
    if (startTimestamp) {
        conditions.push({
            range: {
                "timestamp": {
                    "gte": parseInt(startTimestamp)
                }
            }
        });
    }
    if (endTimestamp) {
        conditions.push({
            range: {
                "timestamp": {
                    "lte": parseInt(endTimestamp)
                }
            }
        });
    }
    if (state) {
        conditions.push({
            term: {
                "state": {
                    "value": state
                }
            }
        });
    }

    let partition;
    const hashCode = calculateHashCode(username);
    if (hashCode) {
        partition = hashCode % INDEX_PARTITION_COUNT;
    }

    let indexName = `blogpost-${BLOG_POST_ES_INDEX_IDENTIFIER}`;
    if (partition) {
        // If we could decide partition, target that index
        indexName = `${indexName}-${partition}`;
    } else {
        // Otherwise, search in all indexes
        indexName = `${indexName}-*`;
    }

    return new Promise((resolve, reject) => {
        esClient.search({
            index: indexName,
            ignoreUnavailable: true,
            type: '_doc',
            body: {
                size: 10000,
                query: {
                    bool: {
                        must: conditions
                    }
                },
                sort: [
                    {
                        "timestamp": {
                            "order": "desc"
                        }
                    }
                ]
            }
        }).then(result => {
            const blogPosts = [];
            for (let hit of result.hits.hits) {
                const blogPost = {
                    id: hit._id,
                    username: hit._source.username,
                    title: hit._source.title,
                    timestamp: hit._source.timestamp,
                    state: hit._source.state
                };
                blogPosts.push(blogPost);
            }
            resolve(blogPosts);
        }).catch(err => {
            reject(err);
        });
    });
};
