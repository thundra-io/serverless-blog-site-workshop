export SERVICES = serverless,cloudformation,sts,sqs,dynamodb,s3,sns
export AWS_ACCESS_KEY_ID ?= test
export AWS_SECRET_ACCESS_KEY ?= test
export AWS_DEFAULT_REGION ?= us-east-1
export EXTRA_CORS_ALLOWED_ORIGINS = *
export THUNDRA_APIKEY = <YOUR-THUNDRA-API-KEY-HERE>

usage:              ## Show this help
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

install:            ## Install dependencies
	npm install
	which serverless || npm install -g serverless
	which localstack || pip install localstack
	which awslocal   || pip install awscli-local

test:               ## Test app
	echo "Running tests ..."
	npm test

deploy:             ## Deploy the app locally
	echo "Deploying app to local environment ..."
	SLS_DEBUG=1 serverless deploy --stage local --region ${AWS_DEFAULT_REGION}

start:              ## Start LocalStack and deploy the app locally
	echo "Starting LocalStack and deploying app to local environment ..."
	LOCALSTACK_START=true SLS_DEBUG=1 serverless deploy --stage local --region ${AWS_DEFAULT_REGION}

start-localstack:   ## Start LocalStack on Docker
	docker run --rm -it -p 4566:4566 \
		-e "SERVICES=${SERVICES}" \
		-e "HOST_TMP_FOLDER=/private${TMPDIR}localstack" \
		-e "LAMBDA_EXECUTOR=docker" \
		-e "LAMBDA_REMOTE_DOCKER=0" \
		-e "DOCKER_HOST:unix:///var/run/docker.sock" \
		-e "AWS_ACCESS_KEY_ID=${AWS_ACCESS_KEY_ID}" \
		-e "AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}" \
		-e "AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION}" \
		-e "EXTRA_CORS_ALLOWED_ORIGINS=${EXTRA_CORS_ALLOWED_ORIGINS}" \
		-e "THUNDRA_APIKEY=${THUNDRA_APIKEY}" \
		-v "/private${TMPDIR}localstack:/tmp/localstack" \
		-v "/var/run/docker.sock:/var/run/docker.sock" \
	    localstack/localstack

stop-localstack:    ## Stop running LocalStack container on Docker
	docker stop $(shell docker ps -a -q --filter ancestor=localstack/localstack --format="{{.ID}}")

.PHONY: usage install deploy start start-localstack stop-localstack