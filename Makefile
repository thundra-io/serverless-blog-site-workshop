export SERVICES = serverless,cloudformation,sts,sqs,dynamodb,s3,sns
export AWS_ACCESS_KEY_ID ?= test
export AWS_SECRET_ACCESS_KEY ?= test
export AWS_DEFAULT_REGION ?= us-east-1
export START_WEB ?= 1
export EXTRA_CORS_ALLOWED_ORIGINS = *
export THUNDRA_APIKEY = 96274451-e537-46ba-8387-aab72114afb5
export THUNDRA_AGENT_TEST_PROJECT_ID = db3cf690-793c-44db-bc79-a7b440217993

usage:              ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

install:            ## Install dependencies
	npm install
	which serverless || npm install -g serverless
	which localstack || pip install localstack
	which awslocal   || pip install awscli-local

test:               ## Test app
	echo "Building Serverless app ..."
	npm test

deploy:             ## Deploy the app locally
	echo "Deploying Serverless app to local environment ..."
	SLS_DEBUG=1 serverless deploy --stage local --region ${AWS_DEFAULT_REGION}

start:              ## Build, deploy and start the app locally
	@make deploy;

.PHONY: usage install deploy start   # usage install test deploy start
