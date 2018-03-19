let nem = require("nem-sdk").default;

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
let common = nem.model.objects.create("common")("password", "5d533ad1c22fb6237b0ed3471a7ed41a845119543ca4fb7baf47711c4c2549e8");

nem.com.requests.account.mosaics.owned(endpoint, "TAX3DWVXWV6LXTJH6GU3M4ZBKJR3EA7ESSOYOO2V").then(function(res) {
	console.log("\nAccount data:");
	console.log(JSON.stringify(res));
}, function(err) {
	console.error(err);
});
