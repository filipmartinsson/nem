$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
	var common = nem.model.objects.create("common")("password", "5d533ad1c22fb6237b0ed3471a7ed41a845119543ca4fb7baf47711c4c2549e8");
	var mosaicDefinitions = nem.model.objects.get("mosaicDefinitionMetaDataPair");

  function roll() {
		var random = Math.floor(Math.random()*1000001);
		console.log(random);
		$("#result").html(random);
  }

  function save() {
  }

	function updateScoringTable(){

	}


	updateScoringTable();

	$("#roll").click(function() {
	  roll();
	});
  $("#save").click(function() {
	  save();
	});

});
