$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
	var common = nem.model.objects.create("common")("password", "5d533ad1c22fb6237b0ed3471a7ed41a845119543ca4fb7baf47711c4c2549e8");
	var mosaicDefinitions = nem.model.objects.get("mosaicDefinitionMetaDataPair");



  var savedScores = JSON.parse(window.localStorage.getItem("nemHighScores"));
	var scores = savedScores != null ? savedScores : {};

  function roll() {
		var random = Math.floor(Math.random() * 1000001);
		console.log(random);
    $("#result").html(random);
  }

  function refreshBalance(){
    if(loggedInAddress){
      nem.com.requests.account.data(endpoint, accounts[loggedInAddress].bankAddress).then(function(res) {
      	accounts[loggedInAddress].balance = res.account.balance;
        $("#balance").html(accounts[loggedInAddress].balance*0.000001);
      }, function(err) {
      	alert("Error getting account data");
      });
    }
  }

  function save() {

		var address = nem.model.address.clean($("#address").val());
		var result = $("#result").html();
		if(!(result >= 0)) return alert("You need to roll the dice!");
		if(scores[address] >= 0 && result < scores[address]) return alert("Not your best score so far.");
    // Get an empty un-prepared transfer transaction object
  	var transferTransaction = nem.model.objects.get("transferTransaction");
  	// Get an empty common object to hold pass and key

    // Set the cleaned amount into transfer transaction object
		transferTransaction.amount = 0;

		console.log($("#address").val());
		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = address;

    transferTransaction.message = "Random game";

		var mosaicAttachment = nem.model.objects.create("mosaicAttachment")("filip", "score", result);

		transferTransaction.mosaics.push(mosaicAttachment);

		nem.com.requests.namespace.mosaicDefinitions(endpoint, mosaicAttachment.mosaicId.namespaceId).then(function(res){
		  var definition = nem.utils.helpers.searchMosaicDefinitionArray(res.data, ["score"]);
		  var fullName = nem.utils.format.mosaicIdToName(mosaicAttachment.mosaicId);
		  mosaicDefinitions[fullName] = {};
		  mosaicDefinitions[fullName].mosaicDefinition = definition[fullName];

		  var preparedTransaction = nem.model.transactions.prepare("mosaicTransferTransaction")(common, transferTransaction, mosaicDefinitions, nem.model.network.data.testnet.id);
		  preparedTransaction.fee = 500000;

		  nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
		    console.log(res);
				if (res.code >= 2) {
				alert(res.message);
			} else {
				scores[address] = $("#result").html();
				window.localStorage.setItem("nemHighScores", JSON.stringify(scores));
				updateScoringTable();
			}
		  }, function(err){
		    console.log(err);
		  });

		}, function(err){
		  console.log(err);
		});

  }

	function updateScoringTable(){
		//FORTSÄTT HÄR. SKAPA TABELL FRÅN SCORES[]
	}


	updateScoringTable();
	// Call send function when click on send button
	$("#roll").click(function() {
	  roll();
	});
  $("#save").click(function() {
	  save();
	});
  $("#withdraw").click(function() {
    withdraw();
  });




});
