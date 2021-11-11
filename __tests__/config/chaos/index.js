const elasticsearchChaos = {
    type: 'FilteringSpanListener',
    config: {
        listener: {
            type: 'ErrorInjectorSpanListener',
            config: {
                errorType: 'ChaosError',
                errorMessage: 'Elasticsearch Chaos Injected!',
                injectPercentage: 100,
            }
        },
        filters: [
            {
                className: 'ELASTICSEARCH',
            }
        ]
    }
}

module.exports = {
    elasticsearchChaos,
}