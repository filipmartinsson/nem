let nem = require("nem-sdk").default;

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

nem.com.requests.chain.lastBlock(endpoint).then(function(res){
  console.log(res);
}, function(err){
  console.log(err);
})
