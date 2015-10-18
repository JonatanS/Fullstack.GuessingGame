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
	//TODO: Show instructions for first use
	alert("Make a guess between 1 and 100./nYou have 5 tries./nThe direction of the arrow [insert] whether you should guess lower or higher./nColors indicate how close you are.")
	prepareNewGame();
});


//newGame function:
function prepareNewGame() {
	targetNumber = generateRandomNumber();	//generate random number
	arrGuesses = [];	//reset array of guesses
	//debugger;
	console.log("preparing new game: ", targetNumber);

	//in case they are still showing
	$('#alertInfoDiv').hide();
	$('#alertRepeatDiv').hide();

	$playButton[0].disabled = true;
	$("#hintButton")[0].disabled = false;

	//reset 5 hearts and their borders
	for(var i = 0; i <= maxNumberOfGuesses; i ++) {
		var classToModify = ".l" + i+ " span";
		if($(classToModify).hasClass('glyphicon-chevron-up')) {
			replaceIcon($(classToModify),'glyphicon-chevron-up', 'glyphicon-heart-empty');
		}
		if($(classToModify).hasClass('glyphicon-chevron-down')) {
			replaceIcon($(classToModify),'glyphicon-chevron-down', 'glyphicon-heart-empty');
		}
		if($(classToModify).hasClass('glyphicon-ok')) {
			replaceIcon($(classToModify),'glyphicon-ok', 'glyphicon-heart-empty');
		}
		$(classToModify).css("color", "#aaa");
		$(classToModify).removeAttr('title');
		paintBorderColor($(classToModify));	//remove borders
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
		$('#alertRepeatDiv').show(500);
	}
	else {
		arrGuesses.push(curGuess);
		console.log("arrGuesses: " + arrGuesses);

		updateUI();
	  	//compare guess to targetNumber
		if(curGuess === targetNumber) {
			//TODO: updateUI
			playerWins();
		}
	}
	//evaluate whether arrGuesses is 'full'
  	if(arrGuesses.length === maxNumberOfGuesses && curGuess !== targetNumber) {
  		playerLoses();
  	}
}

function updateUI(){
	//evaluate whether too high or too low
	var classToModify = ".l" + arrGuesses.length + " span";
	console.log(classToModify);

	//replace glyphicon
	if(curGuess === targetNumber) {
		replaceIcon($(classToModify),'glyphicon-heart-empty', 'glyphicon-ok');
	}
	else if(curGuess > targetNumber) {
		replaceIcon($(classToModify),'glyphicon-heart-empty', 'glyphicon-chevron-down');
	}
	else {
		replaceIcon($(classToModify),'glyphicon-heart-empty', 'glyphicon-chevron-up');
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

	//apply color to css of class to modify
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

	//dont paint border for first guess, or for winning guess
	if(arrGuesses.length > 1 && deviation !== 0) {
		paintBorderColor($(classToModify), trend, colToApply);
		displayAlertDiv(trend, colToApply);
	}
}

//playerWins function:
function playerWins() {
	//$playButton[0].disabled = false;
	$("#hintButton")[0].disabled = true;
	customizeModal('win');
}

//playerLoses function:
function playerLoses() {
	customizeModal('lose');
}

function customizeModal(result) {

	var imageLocation = '';
	var modalHeader = '* * * YOU ARE A WINNER * * *';
	var pMessage = '';

	//generate a number from 1 to 10
	var imgNum = Math.floor(Math.random() * 10 + 1);
	if (result === 'win') {
		//select image
		imageLocation = 'images/winner/winner' + imgNum + '.gif';

		//alter paragraph message
		if(arrGuesses.length === 1){
			pMessage = 'You nailed it first time!';
		}
		else 
		{
			pMessage = 'You did it in ' + arrGuesses.length + ' rounds!';
		}

	}
	else {

		//select image
		imageLocation = 'images/loser/loser' + imgNum + '.gif';

		//alter Modal Text
		modalHeader = 'BETTER LUCK NEXT TIME!';

		//alter paragraph message
		pMessage = 'Bummer! The secret number was ' + targetNumber + '.';

	}

	$( ".modal-body" ).children( ".img-responsive" ).attr('src',imageLocation);
	$( ".modal-body" ).children( "p" ).text(pMessage);
	$( ".modal-header" ).children( "h4" ).text(modalHeader);
	$('#myModal').modal('show');
	//embed button to play new game in modal
}

function replaceIcon(classToModify,oldIcon, newIcon) {
		//$(classToModify).removeClass('glyphicon-heart-empty');
		//$(classToModify).addClass('glyphicon-ok');
		classToModify.removeClass(oldIcon);
		classToModify.addClass(newIcon);

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
	
	var txt = "You were closer before!";
	if(trend === 'down') txt = "Getting closer!";
	$('#alertInfoDiv').text(txt);
	$('#alertInfoDiv').show(500);
}


/**************************
***** E V E N T S *********
**************************/

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
	$('#alertInfoDiv').hide();
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
	var alertText = "you must make at least one guess!";
	if(arrGuesses.length > 0) {

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
		alertText = "Make a guess between " + lowerHotBound + " and " + upperHotBound;
	}

	$('#alertInfoDiv').text(alertText);
	$('#alertInfoDiv').show();
});

//resetGameModal button
$('#modal-reset-game-button').mouseup(function() {
	prepareNewGame();
	//hide modal
	$('#myModal').modal('hide');
});

