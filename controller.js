//prevents any Jquery code from running before the document has finished loading
$(document).ready(function () {
	
	var questionBank=new Array;
	var wordArray=new Array;
	var previousGuesses=new Array;
	var currentWord;
	var currentClue;
	var wrongAnswerCount;
	
 
 // words to be used in game paired with clues in a 2dimentional array
questionBank=	[["graveyard","a final resting place"],["executioner","the one who pulls the lever"],["deathrow","the green mile"],["prisoner","title for a cell inhabitant"],["grimreaper","death himself"],["gallows","not a good place to hang out"]];

		  
		
//display title screen upon page load
titleScreen();

 

 
	
function titleScreen(){
	//append is used to display content
	//display title screen upon load, when begin button is pushed start game
	$('#gameContent').append('<div id="gameTitle">GUILLOTINEMAN</div><div id="startButton" class="button">BEGIN</div>');		
	$('#startButton').on("click",function (){gameScreen()});
	}//display game
	
	
	//empty is used to clear the display area
function gameScreen(){
	$('#gameContent').empty();
	$('#gameContent').append('<div id="pixHolder"><img id="guillotineman" src="guillotineman.png"></div>');
	$('#gameContent').append('<div id="wordHolder"></div>');
	$('#gameContent').append('<div id="clueHolder"></div>');
	$('#gameContent').append('<div id="guesses">Previous guesses:</div>');
	$('#gameContent').append('<div id="feedback"></div>');
			
	getWord();
	// sets numberofTiles equal to the ammount of letters in the current word, then it resets the number of wrong answers to 0 and clears out the previous guesses array
	var numberOfTiles=currentWord.length;
	wrongAnswerCount=0;
	previousGuesses=[];
	
	// adds blank tiles to the screen based on number of letters in current word and gives each tile an id t0, t1, t2 etc..
	for(i=0;i<numberOfTiles;i++){
		$('#wordHolder').append('<div class="tile" id=t'+i+'></div>');
	}
	
	// displays clue on the game screen
	$('#clueHolder').append("HINT: " + currentClue);
 
	$(document).on("keyup",handleKeyUp);
	$(document).on("click",function(){$('#dummy').focus();});
	$('#dummy').focus();
}//gamescreen
			
	//pulls a random word from the questionBank		
function getWord(){
	var rnd=Math.floor(Math.random()*questionBank.length);
	currentWord=questionBank[rnd][0];
	currentClue=questionBank[rnd][1];
	//removes the random word and clue that have been chosen
	questionBank.splice(rnd,1); 
	//forms a new array containing the letters of the current word by splitting it.
	wordArray=currentWord.split("");			
}//getword
			
function handleKeyUp(event) {
	//key presses are distinguished by code in Javacript a=65, b=66... z=90. The following tells the program to ignore any other keypresses.
	if(event.keyCode>64 && event.keyCode<91){
		//found help determine if the submitted letter is found in the word.
		var found=false;
		//will help determine if the submitted letter has been previously entered
		var previouslyEntered=false;
		//converts the code to a letter and makes sure it is lower case
		var input=String.fromCharCode(event.keyCode).toLowerCase();
		
		//checks wether the letter pressed has been entered before
		for(i=0;i<previousGuesses.length;i++){if(input==previousGuesses[i]){previouslyEntered=true;}}
		
		//if letter pressed has not been previously entered carry out the next function and add the letter to the previousGuesses array. if the letter has already been used the program will ignore the input
		if(!previouslyEntered){
			previousGuesses.push(input);

			//checks if the letter pressed is part of the current word	
			for(i=0;i<wordArray.length;i++){
				//if it is part of the word, add it to the appropriate tile. $('#t'+i) is a jquery shorthand used to reference the tile
				if(input==wordArray[i]){found=true;$('#t'+i).append(input);}	
				
			}//for
			// checks whether the entire word has been solved
			if(found){checkAnswer();}
			else{wrongAnswer(input);}
		}//if
	}//if
}//handlekeyup
	
// stores the user inuput by adding the text from each of the answer tiles to the variable currentAnswer		
function checkAnswer(){
	var currentAnswer="";	
	for(i=0;i<currentWord.length;i++){
		currentAnswer+=($('#t'+i).text());
	}
	// if the current answer is the same as the current word display victory message		
	if(currentAnswer==currentWord){
		victoryMessage();
	};
}//checkanswer
		
//if wrong answer is inputted this will label the inputted letter as 'a'
function wrongAnswer(a){
	//increase wrong answer count by one
	wrongAnswerCount++;
	//using the number of wrong answers this will recalculate the position of the guillotineman image and apply the new position
	var pos=(wrongAnswerCount*-155) +"px"
	$('#guesses').append("  "+a);
	$('#guillotineman').css("left",pos);
	// if wronganswercount reaches 6 display game over message
	if(wrongAnswerCount==6){
		defeatMessage();}
}//wronganswer
		
function victoryMessage(){
	//removes key handler that was previously active
	$(document).off("keyup", handleKeyUp);
	//displays victory message along with replay button
	$('#feedback').append("CORRECT!<br><br><div id='replay' class='button'>CONTINUE</div>");
	// if there are still questions left in the bank restarts the game, if all questions have been answered displays final page
	$('#replay').on("click",function (){
		if(questionBank.length>0){
			gameScreen()}
		else{finalPage()}
	});
}//victory
		
function defeatMessage(){
	//removes key handler that was previously active
	$(document).off("keyup", handleKeyUp);
	//displays game over message and correct answer along with replay button
	$('#feedback').append("You're Dead!<br>(answer= "+ currentWord +")<div id='replay' class='button'>CONTINUE</div>");
	// if there are still questions left in the bank restarts the game, if all questions have been answered displays final page
	$('#replay').on("click",function (){
		if(questionBank.length>0){
			gameScreen()}
		else{finalPage()}
	});
}//defeat

//clears game screen and displays final game message
function finalPage(){
	$('#gameContent').empty();
	$('#gameContent').append('<div id="finalMessage">You have finished all the words in the game!</div>');
}//finalpage
	
	});//doc ready