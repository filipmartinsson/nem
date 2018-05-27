let nem = require('nem-sdk').default;

let endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

let common = nem.model.objects.create('common')('', '5d533ad1c22fb6237b0ed3471a7ed41a845119543ca4fb7baf47711c4c2549e8');

let transferTransaction = nem.model.objects.create('transferTransaction')("TB4NNM6QSZCQTA4HRRCIGN5QXXTECQLAT4ECHIAD", 0, "Hello from mosaicTransaction program");

var mosaicDefinitions = nem.model.objects.get("mosaicDefinitionMetaDataPair");

var mosaicAttachment = nem.model.objects.create("mosaicAttachment")("filip", "filipcoin", 10000);

transferTransaction.mosaics.push(mosaicAttachment);

nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId).then(function(res){
  var definitions = nem.utils.helpers.searchMosaicDefinitionArray(res.data, ["filipcoin"]);
  var fullName = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaidId);

  mosaicDefinitions[fullName] = {};
  mosaicDefinitions[fullName].mosaicDefinition = definitions[fullName];

  let preparedTransaction = nem.model.transactions.prepare('mosaicTransferTransaction')(common, transferTransaction, mosaicDefinitions, nem.model.network.data.testnet.id);
  preparedTransaction.fee = 1000000;

  nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
    console.log(res);
  }, function(err){
    console.log(err);
  });

}, function(err){
  console.log(err);
})
