$(document).ready(function () {

	// Load nem-browser library
	var nem = require("nem-sdk").default;

    // Create an NIS endpoint object
	var endpoint = nem.model.objects.create("endpoint")(nem.model.nodes.defaultTestnet, nem.model.nodes.defaultPort);
	var common = nem.model.objects.create("common")("password", "5d533ad1c22fb6237b0ed3471a7ed41a845119543ca4fb7baf47711c4c2549e8");
	var mosaicDefinitions = nem.model.objects.get("mosaicDefinitionMetaDataPair");

	var savedScores = JSON.parse(window.localStorage.getItem("random-game-highscore"));
	var scores;

	if(savedScores !== null){
		scores = savedScores;
	}
	else{
		scores = {};
	}

  function roll() {
		var random = Math.floor(Math.random()*1000001);
		console.log(random);
		$("#result").html(random);
  }

  function save() {
		var address = nem.model.address.clean($("#address").val());
		var result = $("#result").html();
		if(!(result >= 0)) return alert("You need to roll the dice!");
		scores[address] = result;
		window.localStorage.setItem("random-game-highscore", JSON.stringify(scores));
		updateScoringTable();
  }

	function updateScoringTable(){
		var list = [];
		for (var key in scores) {
			if (scores.hasOwnProperty(key)) {
					list.push(key + ': ' + scores[key]);
			}
		}
		var highscoreTable = $('#highscoreTable')
		highscoreTable.html('');
		$.each(list, function(i)
		{
				var li = $('<li/>')
						.appendTo(highscoreTable);
				var aaa = $('<span/>')
						.text(list[i])
						.appendTo(li);
		});
	}


	updateScoringTable();

	$("#roll").click(function() {
	  roll();
	});
  $("#save").click(function() {
	  save();
	});

});
