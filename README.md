# blog-site-workshop

## Prerequisite

- Node.js 10.x+
- Python 3.6+
- Docker
- AWS CLI

## Setup

#### Backend

- Sign-up to [Thundra](https://start.thundra.io) and get your API key.
- Choose **Thundra Foresight** and create your first project.
- Go to the Projects page and select your project's settings.
- Get the API key and set it to `THUNDRA_APIKEY` property in the `Makefile`.
- Get the Project ID and set it to `THUNDRA_AGENT_TEST_PROJECT_ID` property in the `Makefile`.
- If you're using **AWS CLI v2**, `awslocal` won't work properly. To workaround the issue, we recommend using a Python Virtual Environment to run the project.
  - To activate a virtual environment, run the following commands.

    ```
    python3 -m venv .venv
    . .venv/bin/activate
    ```
- Run `make install` to install the dependencies.
- Run `make test` to run the tests.

## Endpoints

### Send blog post
This is the endpoint for sending blog post which is shown as
`POST - https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/post/{blogPostId}`
in the deploy output as shown in the `Install` section above.
- Its HTTP method type is `POST`.
- It gets blog post information in the request body in JSON format as shown below:
```json
{
    "title": "<title of the blog post>",
    "post": "<content of the blog post>",
    "username": "<username of the person who sends blog post or author in other words>",
    "phoneNumber": "<phone number to interact over SMS about blog post acceptance status>"
}
```
**Note:** `phoneNumber` is optional.

### Review blog post
This is the endpoint for reviewing blog post which is shown as
`POST - https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/review`
in the deploy output as shown in the `Install` section above.
- Its HTTP method type is `POST`.
- It gets blog post id to be reviewed as path parameter:
```
https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/review/1234-5678-90
```
- It gets reviewed blog post content in the request body in String format as shown below:
```
"<reviewed content of the blog post>"
```

### Publish blog post
This is the endpoint for publishing blog post which is shown as
`POST - https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/publish`
in the deploy output as shown in the `Install` section above.
- Its HTTP method type is `POST`.
- It gets blog post id to be published as path parameter:
```
https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/publish/1234-5678-90
```

### Search blog post
This is the endpoint for searching according to given criteria in the blog posts which is shown as
`GET - https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/search`
in the deploy output as shown in the `Install` section above.
- Its HTTP method type is `GET`.
- It gets `username`, `keyword`, `start-time` and `end-time` query parameters as search criteria.
  * `username`: Name of the user who sent blog post
  * `keyword`: Keyword must be exist in the either blog post title or context
  * `start-time`: Time that blog post must be sent after
  * `end-time`: Time that blog post must be sent before
- Parameters are optional and at least one of them must be specified
- It gets query parameters shown below:
```
https://<api-id>.eu-west-2.amazonaws.com/dev/blog/search?username=<username>&keyword=<keyword>&start-timestamp=<startTimestamp>&end-timestamp=<endTimestamp>
```

### Get blog post
This is the endpoint for getting blog post by id which is shown as
`GET - https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/{blogPostId}`
in the deploy output as shown in the `Install` section above.
- Its HTTP method type is `GET`.
- It gets blog post id to be retrieved as path parameter:
```
https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/1234-5678-90
```

### Delete blog post
This is the endpoint for deleting blog post by id which is shown as
`DELETE - https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/{blogPostId}`
in the deploy output as shown in the `Install` section above.
- Its HTTP method type is `DELETE`.
- It gets blog post id to be deleted as path parameter:
```
https://<api-id>.execute-api.eu-west-2.amazonaws.com/dev/blog/1234-5678-90
```

## Web Application

Blog site application is available at [blog-site-app.thundra.io](https://blog-site-app.thundra.io).
You can set your base URL (`https://<api-id>.eu-west-2.amazonaws.com/dev/blog`) to be used/consumed by the frontend application.
