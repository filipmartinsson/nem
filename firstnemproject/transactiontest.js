let nem = require('nem-sdk').default;

let endpoint = nem.model.objects.create('endpoint')(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

let common = nem.model.objects.create('common')('password', 'privateKey');

let transferTransaction = nem.model.objects.create('transferTransaction')("TB4NNM6QSZCQTA4HRRCIGN5QXXTECQLAT4ECHIAD", 5, "Hello from transfertest program");

let preparedTransaction = nem.model.transactions.prepare('transferTransaction')(common, transferTransaction, nem.model.network.data.testnet.id);

nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
  console.log(res);
}, function(err){
  console.log(err);
});
