invoke:
	sam local invoke -e event.json BlogPostProcessor
debug:
	sam local invoke -e event.json --debug-port 5858 BlogPostProcessor