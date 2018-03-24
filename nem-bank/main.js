$(document).ready(function () {
	var nem = require("nem-sdk").default;
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

  function login() {
		
  }

  function refreshBalance(){

  }

  function withdraw() {

  }


	$("#login").click(function() {
	  login();
	});
  $("#refresh_balance").click(function() {
	  refreshBalance();
	});
  $("#withdraw").click(function() {
    withdraw();
  });
});
