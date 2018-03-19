$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);



  var savedAccounts = JSON.parse(window.localStorage.getItem("nemBankAccounts"));
	var accounts = savedAccounts != null ? savedAccounts : {};
  var loggedInAddress = "";

  function login() {
    var address = nem.model.address.clean($("#address").val());
    if (!nem.model.address.isValid(address)) return alert('Invalid recipent address !');
    if(accounts[address]){

    }
    else{
      accounts[address] = {};
      var rBytes = nem.crypto.nacl.randomBytes(32);
      // Convert the random bytes to hex
      var privateKey = nem.utils.convert.ua2hex(rBytes);
      var keyPair = nem.crypto.keyPair.create(privateKey);
      var bankAddress = nem.model.address.toAddress(keyPair.publicKey.toString(), nem.model.network.data.testnet.id);

      var newAccount = {
        privateKey: privateKey,
        keyPair: keyPair,
        bankAddress: bankAddress,
        privateAddress: address
      }
      accounts[address] = newAccount;
      window.localStorage.setItem("nemBankAccounts", JSON.stringify(accounts));

    }

    nem.com.requests.account.data(endpoint, accounts[address].bankAddress).then(function(res) {
    	accounts[address].balance = res.account.balance;
      $("#balance").html(accounts[address].balance);

    }, function(err) {
    	alert("Error getting account data");
    });

    loggedInAddress = address;
    $("#loginWrapper").hide();
    $("#bankAddress").html(accounts[address].bankAddress);
    $("#dashboard").show();
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

  function withdraw() {
    if($("#withdrawAmount").val() === undefined || !nem.utils.helpers.isTextAmountValid($("#withdrawAmount").val())) return alert('Invalid amount !');

    // Get an empty un-prepared transfer transaction object
  	var transferTransaction = nem.model.objects.get("transferTransaction");
  	// Get an empty common object to hold pass and key
  	var common = nem.model.objects.create("common")();

    common.privateKey = accounts[loggedInAddress].privateKey;

    // Check private key for errors
		if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
    if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');

    // Set the cleaned amount into transfer transaction object
		transferTransaction.amount = nem.utils.helpers.cleanTextAmount($("#withdrawAmount").val());

		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = nem.model.address.clean(accounts[loggedInAddress].privateAddress);

    transferTransaction.message = "Nem Bank";

    var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(res.message);
			} else {
				alert(res.message);
			}
		}, function(err) {
			alert(err);
		});

  }
	/**
     * Build transaction from form data and send
     */
	function send() {
		// Check form for errors
		if(!$("#privateKey").val() || !$("#recipient").val()) return alert('Missing parameter !');
		if(undefined === $("#amount").val() || !nem.utils.helpers.isTextAmountValid($("#amount").val())) return alert('Invalid amount !');
		if (!nem.model.address.isValid(nem.model.address.clean($("#recipient").val()))) return alert('Invalid recipent address !');

		// Set the private key in common object
		common.privateKey = $("#privateKey").val();

		// Check private key for errors
		if (common.privateKey.length !== 64 && common.privateKey.length !== 66) return alert('Invalid private key, length must be 64 or 66 characters !');
    if (!nem.utils.helpers.isHexadecimal(common.privateKey)) return alert('Private key must be hexadecimal only !');

		// Set the cleaned amount into transfer transaction object
		transferTransaction.amount = nem.utils.helpers.cleanTextAmount($("#amount").val());

		// Recipient address must be clean (no hypens: "-")
		transferTransaction.recipient = nem.model.address.clean($("#recipient").val());

		// Set message
		transferTransaction.message = $("#message").val();

		// Prepare the updated transfer transaction object
		var transactionEntity = nem.model.transactions.prepare("transferTransaction")(common, transferTransaction, nem.model.network.data.testnet.id);

		// Serialize transfer transaction and announce
		nem.model.transactions.send(common, transactionEntity, endpoint).then(function(res){
			// If code >= 2, it's an error
			if (res.code >= 2) {
				alert(res.message);
			} else {
				alert(res.message);
			}
		}, function(err) {
			alert(err);
		});
	}

	// Call send function when click on send button
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
