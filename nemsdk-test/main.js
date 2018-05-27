var nem = require("nem-sdk").default;

var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

nem.com.requests.chain.lastBlock(endpoint).then(function(block) {
	console.log(block)
}, function(err) {
	console.error(err)
})
