/* If you're feeling fancy you can add interactivity 
    to your site with Javascript */

// prints "hi" in the browser's dev tools console
console.log("hi");

const cluePauseTime = 333;
const nextClueWaitTime = 500;
var clueHoldTime = 500;

//Globals
var pattern = [1,2,3,4,5,4,5,1];
var progress = 0; 
var gamePlaying = false;
var tonePlaying = false;
var volume = .5;
var guessCounter = 0;
var mistakes =0;

var timeperround=60;

//shuffles set array into different order
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function startGame(){
  progress = 0;
  gamePlaying=true;
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("stopBtn").classList.remove("hidden");
  mistakes=0;
  shuffleArray(pattern);
  resetMistake();
  
  
  playClueSequence();
}
function stopGame(){
  gamePlaying=false;

  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("stopBtn").classList.add("hidden");
  
}

// Sound Synthesis Functions
const freqMap = {
  1: 200,
  2: 300,
  3: 275,
  4: 375,
  5: 250
}
function playTone(btn,len){ 
  o.frequency.value = freqMap[btn]
  g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)
}
function startTone(btn){
  if(!tonePlaying){
    o.frequency.value = freqMap[btn]
    g.gain.setTargetAtTime(volume,context.currentTime + 0.05,0.025)
    tonePlaying = true
  }
}
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false
}

//Page Initialization
// Init Sound Synthesizer
var context = new AudioContext()
var o = context.createOscillator()
var g = context.createGain()
g.connect(context.destination)
g.gain.setValueAtTime(0,context.currentTime)
o.connect(g)
o.start(0)

function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}
function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }
}
function playClueSequence(){
  guessCounter=0;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    console.log("play single clue: " + pattern[i] + " in " + delay + "ms")
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  if(clueHoldTime!=100){
      clueHoldTime-=50;
  }
  timer();
}

function resetMistake(){
  mistakes=0;
  document.getElementById("mistakes").innerHTML = mistakes + " mistakes";
}

function loseGame(){
  stopGame();
  alert("Game Over. You lost.");
}
function winGame(){
  stopGame();
  alert("You won!")
}
function guess(btn){
  console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  //Nested flow
  if(pattern[guessCounter]==btn){
    if(guessCounter==progress){
      if(progress==pattern.length-1){
        winGame();
      }
      else{
        progress+=1;
        playClueSequence();
      }
    }
    else{
      guessCounter+=1;
    }
  }
  else{
    if(mistakes!=2){
      mistakes++;
      document.getElementById("mistakes").innerHTML = mistakes + " mistakes";
      alert("You've made a mistake!")
      playClueSequence();
    }
    else{
      loseGame();
    }
  }
  // add game logic here
}

function timer(){
    var sec = 60;
    var timer = setInterval(function(){
        document.getElementById('timer').innerHTML='00:'+sec;
        sec--;
        if (sec < 0) {
            clearInterval(timer);
        }
    }, 1000);
}
