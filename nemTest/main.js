var nem = require("nem-sdk").default;

var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

nem.com.requests.chain.height(endpoint).then(function(res) {
	console.log(res)
}, function(err) {
	console.error(err)
})

nem.com.requests.account.data(endpoint, "TB4NNM6QSZCQTA4HRRCIGN5QXXTECQLAT4ECHIAD").then(function(data){
	console.log(data);
});
