/*=====================================================================================
                       General helper and shorthand functions
=======================================================================================*/
var byId = id => document.getElementById(id);

var byClass = className => document.getElementsByClassName(className);

var sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

var hide = id => byId(id).style.display = "none"; // Hides html elements

var show = id => byId(id).style.display = "block"; // Shows html elements

/*=====================================================================================
                       Game-specific shorthand and misc functions
=======================================================================================*/
function menuSwitch(which) { // To easily switch between which menu/slide is displayed
  hide('mainMenu'); hide('how'); hide('create'); hide('names'); hide('rounds'); hide('turn'); hide('scenario'); hide('timeUp'); hide('who'); hide('score'); hide('last'); // Hides all of them...
  show(which); // ... then shows one
}

function createElement(content, attribute, attributeType, location, type) { // Shortcut for creating html elements with JavaScript
  var str = document.createElement(type);

  if(attribute != '') {
    str.setAttribute(attributeType, attribute);
  }
  str.setAttribute('class', 'turn' + turns); // Adds a class to easily hide elements from each round

  str.innerHTML = content;
  byId(location).prepend(str);
}

function hideByClass(which) { // For hiding several elements at once
  var x = document.getElementsByClassName(which);
  for (var i = 0; i < x.length; i++) {
    x[i].style.display = 'none';
  }
}

// Capturing the enter key
var input = byId('playerNameInput');
input.addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   byId('addPlayer').click();
  }
});

var colorSequence = ['#00afbf', '#22c7d6', '#00ccb8', '#14d9c5', '#14d9c5', '#2285d6', '#a322d6', '#cd56fc', '#e299ff', '#ff99eb', '#f56786', '#f73962', '#f73939', '#00afbf', '#22c7d6', '#00ccb8', '#14d9c5', '#3ff731', '#12ff00']
var colorSequencePos = 0;
setInterval(function() { // Gradually chaning the background color
  document.body.style.backgroundColor = colorSequence[colorSequencePos];

  var x = document.getElementsByClassName('gameButton');
  for (var i = 0; i < x.length; i++) {
    x[i].style.backgroundColor = colorSequence[colorSequencePos];
  }
  colorSequencePos++;
  if(colorSequencePos == colorSequence.length) {colorSequencePos = 0;}
}, 2000);

/*=====================================================================================
                                        Game code
=======================================================================================*/
var gameScenario = [];
var players = 0;
var rounds;
var roundsPlayed = 0;
var turns = 0;
var time = 45;

var scenarios = ["Meeting your favorite celebrity", "Meeting a large bear in the woods", "You just won the lottery", "Hurting your leg", "Having a headache", "Watching a scary movie", "Watching a funny movie.", "Falling in love", "Getting fired from your job", "Being bored at school", "Getting a failed test back", "Having your driver's licence test", "Meeting your girlfriend / boyfriend's parents for the first time", "Waking up late and work starts in 5 minutes", "Not being able to sleep", "Feeling sick", "Nervous about going to school", "Can't find any paper towel when sitting on the toilet", "Trying to talk, but no one is listening to you", "Just finished a delicious meal", "You are a jellyfish", "Riding a rollercoaster", "Winning an award", "Getting married", "Seeing something funny", 'Getting arrested', 'Being robbed', 'You are a rabbit', 'Your hair is on fire', 'Getting bit by an animal', 'Winning a race', 'Fishing', 'Farting', 'Crossing the road', 'Getting married', 'Playing football', 'Riding a bike', 'driving a car'];

function playerObject() {
  this.name,
  this.score,
  this.number
}

function start() {
  byId("playerNameInput").focus(); // Gives focus to the input field (doesn't actually work)
  menuSwitch('names');
}

var playersCreated = 0;
function addPlayer() {
  if(byId('playerNameInput').value != '') {
    window['player' + playersCreated] = new playerObject;
    window['player' + playersCreated].name = byId('playerNameInput').value;
    window['player' + playersCreated].number = playersCreated;

    playersCreated++;
    players++;

    createElement(byId('playerNameInput').value, "displayedNames", "id", "nameAnchor", 'div');

    byId('playerNameInput').value = '';
  }
}

function addRounds(number) {
  rounds = number;
  menuSwitch('turn');
  startGame();
}

function namesComplete() { // Ensures two or more players have been added
  if(players > 1) {
    menuSwitch('rounds');
  } else {
  	createElement('You need two or more players to start!', "displayedNames", "id", "noticeAnchor", 'div');
  }
}

function startGame() {
  createElement("It's " + window['player' + turns].name + "'s turn! Hand the device to " + window['player' + turns].name + ".", 'header', 'id', 'turnAnchor', 'div');
  if(gameScenario.length < 20) {
    gameScenario = scenarios;
  }
}

function createScenario() {
  var scenario = Math.floor(Math.random() * gameScenario.length);
  if(scenario == undefined) {
    scenario = Math.floor(Math.random() * gameScenario.length);
  }
  createElement(gameScenario[scenario], 'scenarioText', 'id', 'scenarioAnchor', 'div');
  gameScenario.splice(scenario, 1);
  countdown();
  
}

async function countdown() {
  if(time == 60) {
    byId('timer').innerHTML = '01:00';
  }
  if(time > 9) {
    byId('timer').innerHTML = '00:' + time;
  } else {
    byId('timer').innerHTML = '00:0' + time;
  }
  time--;
  if(time >= 0) {
  	await sleep(1000);
    countdown();
  } else if(!scenarioEnded) {
    menuSwitch('timeUp');
  }
}

var scenarioEnded = false;
function end() {
	  time = 0;
	  countdown();
    scenarioEnded = true;
}

function endScenario() {
  for(var i = 0; i < players; i++) {
  	if(i != turns) {
      createElement(window['player' + i].name, 'addScore(' + window['player' + i].number + '), menuSwitch("score"), createScoreboard()', 'onclick', 'buttonAnchor', 'button');
	}
    if(window['player' + i].score == undefined) {
      window['player' + i].score = 0;
	}
  }
}

function addScore(number) {
  window['player' + number].score += 2;
  window['player' + turns].score++;
}

function createScoreboard() {
  createElement(sortList(), 'scoreSection', 'id', 'scoreAnchor', 'div');
}

function newTurn() {
  // Resetting values
  time = 45;
  scenarioEnded = false;

  hideByClass('turn' + turns);

  if(turns == players-1) {
    roundsPlayed++;
    if(roundsPlayed == rounds) { // Checks if all rounds have been played
      gameFinished();
    } else {
      turns = 0;
    }
  } else {
    turns++;
  }
  if(roundsPlayed != rounds) {
    menuSwitch('turn');
    startGame();
  }

  if(gameScenario.length < 2) { // Ensuring that the array always has content
    gameScenario = scenarios;
  }

}

function gameFinished() {
  menuSwitch('last');
  var outcome;
  for(var i = 0; i < players; i++) { // Compares the winning score with the other scores to detect a draw
    if(window['player' + i].score == window['player' +currentLead].score && window['player' + i].name != window['player' + currentLead].name) {
      outcome = 'draw';
    } else if(outcome != 'draw') {
      outcome = 'winner';
    }
  }
  if(outcome == 'draw') {
    createElement("It's a draw! No one won!", "header", "id", "winnerAnchor", 'div');
  } else {
    createElement('The winner is ' + window['player' + currentLead].name + '!', "header", "id", "winnerAnchor", 'div');
  }
}

var currentLead;
var namesOnList = 0;
var firstAddition = true;
function sortList() { // Compares all scores with a value, descending by 1 every iteration, until all scores have been added to the string, in the right order
var string = ''
  if(turns == 0 && roundsPlayed == 0) {
    var iterations = 2;
  } else {
    var iterations = highestPrevious + 2;
  }
  
  while(namesOnList <= players) {
    for(var i = 0; i < players; i++) {
      if(window['player' + i].score == iterations) {
        string += window['player' + i].name + ': ' + window['player' + i].score + '<br />';
        namesOnList++;

        if(firstAddition) {
          highestPrevious = window['player' + i].score;
          currentLead = window['player' + i].number;
          firstAddition = false;
        }
      }
    }

    if(namesOnList == players) {
      namesOnList = 0;
      firstAddition = true;
      return string
    }
  iterations--;
  }
}

function resetGame() { // Simply resets all game variables
  hideByClass('turn' + turns);
  players = 0;
  gameScenario = [];
  rounds = 0;
  roundsPlayed = 0;
  playersCreated = 0;
  turns = 0;
}
