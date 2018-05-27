'use strict';
let nem = require("nem-sdk").default;

let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

nem.com.requests.chain.time(endpoint).then(function(block){
  console.log(block);
}, function(err){
  console.log(err);
})
