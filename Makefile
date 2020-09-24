invoke:
	sam local invoke -e sqs_event.json BlogPostProcessor
debug:
	sam local invoke -e sqs_event.json --debug-port 5858 BlogPostProcessor