let nem = require("nem-sdk").default;
let endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

let common = nem.model.objects.create("common")("","5d533ad1c22fb6237b0ed3471a7ed41a845119543ca4fb7baf47711c4c2549e8");

let transferTransaction = nem.model.objects.create("transferTransaction")("TCYGRKNKYRMDS636VA4NLU4M3GJZNFDYZERAJWJT", 1, "Sent mosaic");

var mosaicDefinitions = nem.model.objects.get("mosaicDefinitionMetaDataPair");

var mosaicAttachment = nem.model.objects.create("mosaicAttachment")("filip", "filipcoin", 10000);

transferTransaction.mosaics.push(mosaicAttachment);

nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId).then(function(res){
  var definition = nem.utils.helpers.searchMosaicDefinitionArray(res.data, ["filipcoin"]);
  var fullName = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaicId);
  mosaicDefinitions[fullName] = {};
  mosaicDefinitions[fullName].mosaicDefinition = definition[fullName];

  var preparedTransaction = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, mosaicDefinitions, nem.model.network.data.testnet.id);
  preparedTransaction.fee = 1000000;

  nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
    console.log(res);
  }, function(err){
    console.log(err);
  });

}, function(err){
  console.log(err);
});
