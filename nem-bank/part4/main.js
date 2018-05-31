$(document).ready(function () {
	var nem = require("nem-sdk").default;
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);

	var loggedInAccount = "";
	var savedAccounts = window.localStorage.getItem("nem-bank-accounts");
	var accounts;
	if(savedAccounts !== null){
		accounts = JSON.parse(savedAccounts);
	}
	else{
		accounts = {};
	}

  function login() {
		var address = nem.model.address.clean($("#address").val());
		if(!nem.model.address.isValid(address)) return alert('Address not valid');
		if(accounts[address] === undefined){
			accounts[address] = {};
			var randomBytes = nem.crypto.nacl.randomBytes(32);
			var privateKey = nem.utils.convert.ua2hex(randomBytes);
			var keyPair = nem.crypto.keyPair.create(privateKey);
			var bankAddress = nem.model.address.toAddress(keyPair.publicKey.toString(), nem.model.network.data.testnet.id);

			var newAccount = {
				privateKey: privateKey,
				keyPair: keyPair,
				bankAddress: bankAddress,
				privateAddress: address,
				balance: 0
			}

			accounts[address] = newAccount;
			window.localStorage.setItem("nem-bank-accounts", JSON.stringify(accounts));
		}
		loggedInAccount = address;
		nem.com.requests.account.data(endpoint, accounts[address].bankAddress).then(function(res){
			accounts[address].balance = res.account.balance;
			$("#balance").html(accounts[address].balance);
		}, function(err){
			alert("error getting the balance");
		});

		$("#loginWrapper").hide();
		$("#bankAddress").html(accounts[address].bankAddress);
		$("#dashboard").show();
  }

  function refreshBalance(){
		nem.com.requests.account.data(endpoint, accounts[loggedInAccount].bankAddress).then(function(res){
			accounts[loggedInAccount].balance = res.account.balance;
			$("#balance").html(accounts[loggedInAccount].balance);
		}, function(err){
			alert("error getting the balance");
		});
  }

  function withdraw() {
		if($("#withdrawAmount").val() === undefined || !nem.utils.helpers.isTextAmountValid($("#withdrawAmount").val())) return alert("Error in input");

		var transferTransaction = nem.model.objects.get("transferTransaction");
		var common = nem.model.objects.create("common")();
		common.privateKey = accounts[loggedInAccount].privateKey;

		transferTransaction.amount = nem.utils.helpers.cleanTextAmount($("#withdrawAmount").val());
		transferTransaction.recipient = nem.model.address.clean(accounts[loggedInAccount].privateAddress);
		transferTransaction.message = "Nem bank withdrawal";

		var preparedTransaction = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

		nem.model.transactions.send(common, preparedTransaction, endpoint).then(function(res){
			if(res.code >= 2){
				alert(res.message);
			}
			else{
				alert("SUCCESS " + res.message);
			}
		}, function(err){
			alert(err);
		})
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
