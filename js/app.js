/*app.js

	by Jonatan Schumacher
	10/17/2015

*/


//global variables
var maxNumberOfGuesses = 5;
var arrGuesses = [];
var targetNumber = 50; //randomly generated number 'targetNumber'
var $playButton;
var documentLoaded = false;
var curGuess = 0;
var hotRegion = 5;
var warmRegion = 10;
var colHot = '#F06868';
var colWarm = '#FAB57A';
var colCold = '#80D6FF';
//set Selectors
$( document ).ready(function() {
	console.log('!!!doc ready!!!');
	$playButton = $('#playButton');
	documentLoaded = true;
	prepareNewGame();
});


//newGame function:
function prepareNewGame() {
	targetNumber = generateRandomNumber();	//generate random number
	arrGuesses = [];	//reset array of guesses
	//debugger;
	console.log("preparing new game: ", targetNumber);
	$playButton[0].disabled = true;	//enable play button DOES NOT WORK WITH JQUERY SELECTOR ???

	//reset 5 hearts and their borders
	for(var i = 0; i <= maxNumberOfGuesses; i ++) {
		var classToModify = ".l" + i+ " span";
		$(classToModify).addClass('glyphicon-heart-empty');
		$(classToModify).removeClass('glyphicon-chevron-up');
		$(classToModify).removeClass('glyphicon-chevron-down');
		$(classToModify).css("color", "#aaa");
		$(classToModify).removeAttr('title');
		paintBorderColor($(classToModify));
	}

	//reset input value
	$( "#inputNumber" )[0].value = '';


}

function generateRandomNumber() {
	return Math.round((Math.random() * 100) + 1,0);;
}


//playerFeedback function:
function processGuess() {
  	//if guess has been guessed before, let player know try again
	if(arrGuesses.indexOf(curGuess)!= -1) {
		alert('You previously guessed this number - try a different one!');
	}
	else {
		arrGuesses.push(curGuess);
		console.log("arrGuesses: " + arrGuesses);

	  	//compare guess to targetNumber
		if(curGuess === targetNumber) {
			playerWins();
		}
		else {
			updateUI();
		}
	}
	//evaluate whether arrGuesses is 'full'
  	if(arrGuesses.length === maxNumberOfGuesses) {
  		alert('Game Over');
  		alert('Click OK to start new game');
  		prepareNewGame();
  	}
}

function updateUI(){
	//evaluate whether too high or too low
	var classToModify = ".l" + arrGuesses.length + " span";
	console.log(classToModify);

	if(curGuess > targetNumber) {
		$(classToModify).removeClass('glyphicon-heart-empty');
		$(classToModify).addClass('glyphicon-chevron-down');
	}
	else {
		$(classToModify).removeClass('glyphicon-heart-empty');
		$(classToModify).addClass('glyphicon-chevron-up');
	}

	//determine which color to use for icon:
	var deviation = Math.abs(targetNumber - curGuess);
	var colToApply = colCold;
	if (deviation <= hotRegion) {
		colToApply = colHot;
	}
	else if (deviation <= warmRegion) {
		colToApply = colWarm;
	}

	$(classToModify).css("color", colToApply);

	//store guess number in attr title (mouseOver)
	$(classToModify).attr('title', curGuess);

	//paint border based on trend:
	var trend = 'down';
	var prevGuess = arrGuesses[arrGuesses.length-2];
	console.log('prevGuess ', prevGuess);
	if (Math.abs(targetNumber - curGuess) >= Math.abs(targetNumber - prevGuess)) {
		trend = 'up';
	}

	if(arrGuesses.length > 1) {
		paintBorderColor($(classToModify), trend, colToApply);
		displayAlertDiv(trend, colToApply);
	}
}

//playerWins function:
function playerWins() {
	alert('You win with ' + arrGuesses.length + ' guess[es]!');
	//disable play button
	//disable eye button
}

function paintBorderColor(classToModify, trend, colorToApply) {
	//style="color: rgb(170, 170, 170);border-bottom-style: double;
	if (typeof(trend) === "undefined") {
		//remove border styles
		classToModify.css('border-top-style', '');
		classToModify.css('border-bottom-style', '');
	}
	else{
		if (trend === 'up') {
		//classToModify.attr('border-top', 'red');
			classToModify.css('border-top-style', 'double');
		}

		else if (trend === 'down') {
		//classToModify.attr('border-bottom', 'red');
			classToModify.css('border-bottom-style', 'double');
		}
	}
}

function displayAlertDiv(trend, colorToApply) {
	//var txt = '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	var txt = "You were closer before!";
	if(trend === 'up') txt = "Getting closer!";
	$('#alertDiv').text(txt);
	$('#alertDiv').show(500);
}


/***************************
*********events************/

//submitGuess function:
$( "#gameForm" ).submit(function( event ) {
  event.preventDefault();	//not to trigger document ready function again
  processGuess();
});

//change input number:
$( "#inputNumber" ).change(function() {
  if($( "#inputNumber" )[0].value != "") {
  	curGuess = Number($( "#inputNumber" )[0].value);
  	$playButton[0].disabled = false;	
  }
  else 	{
  	$playButton[0].disabled = true;
  }	
});

//newGame button
$("#newGameButton").mouseup(function() {
	prepareNewGame();
});

//viewHint button:
$("#hintButton").mouseup(function() {
	if(arrGuesses.length === 0) {
		alert("you must make at least one guess!");
	}
	else {

		var lowerHotBound = targetNumber - (warmRegion - Math.round(Math.random() * arrGuesses.length, 0));
		var upperHotBound = targetNumber + (warmRegion - Math.round(Math.random() * arrGuesses.length, 0));
		if (lowerHotBound < 0) {
			lowerHotBound = 0;
			upperHotBound = (warmRegion - Math.round(Math.random() * arrGuesses.length, 0));
		}

		if (upperHotBound > 100) {
			upperHotBound = 100;
			lowerHotBound = 100 - (warmRegion - Math.round(Math.random() * arrGuesses.length, 0));
		}
		alert("Make a guess between " + lowerHotBound + " and " + upperHotBound);
	}
});

