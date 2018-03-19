let nem = require("nem-sdk").default;

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
let common = nem.model.objects.create("common")("password", "5d533ad1c22fb6237b0ed3471a7ed41a845119543ca4fb7baf47711c4c2549e8");

nem.com.requests.account.data(endpoint, "TCYGRKNKYRMDS636VA4NLU4M3GJZNFDYZERAJWJT").then(function(res) {
	console.log("\nAccount data:");
	console.log(res);
}, function(err) {
	console.error(err);
});
