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
	//enable eye button
	//reset 5 hearts
	for(var i = 0; i <= maxNumberOfGuesses; i ++) {
		var classToModify = ".l" + i+ " span";
		$(classToModify).addClass('glyphicon-heart-empty');
		$(classToModify).removeClass('glyphicon-chevron-up');
		$(classToModify).removeClass('glyphicon-chevron-down');
		$(classToModify).css("color", "#aaa");
		$(classToModify).attr('title', '');
	}

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
		$(classToModify).addClass('glyphicon-chevron-up');
	}
	else {
		$(classToModify).removeClass('glyphicon-heart-empty');
		$(classToModify).addClass('glyphicon-chevron-down');
	}

	//evaluate whether guess is warm or cold and apply COLOR to chevron
	if (Math.abs(targetNumber - curGuess)<= hotRegion) {
		$(classToModify).css("color", "red");
	}
	else if (Math.abs(targetNumber - curGuess)<= warmRegion) {

		$(classToModify).css("color", "orange");
	}
	else {
		$(classToModify).css("color", "blue");
	}

	//store guess number in attr title (mouseOver)
	$(classToModify).attr('title', curGuess);
}

//playerWins function:
function playerWins() {
	alert('You win with ' + arrGuesses.length + ' guess[es]!');
	//disable play button
	//disable eye button
}


/***************************
*********events************/


//viewResult button:


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

