var canvas, canvasContext;

var ballX = 50, ballY = 20;
var ballSpeedX = 150;
var ballSpeedY = 200;
const BALL_SIZE = 10;
const BALL_COLOR = 'red';

var paddle1Y = 250;
var paddle2Y = 250;
const paddleSpeed = 250;
const PADDLE_OFFSET = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 20;
const PADDLE_COLOR = 'white';

const framesPerSecond = 30;
const time = 1000 / framesPerSecond;
const t = 1/framesPerSecond;

var firstPlayerScore = 0;
var secondplayerScore = 0;
var GameGoOn = true;
var whoHadWon = '';
const WINNING_SCORE = 10;

function calculateMausePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.lef - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x: mouseX,
    y: mouseY
  }
}

window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0,0,canvas.width, canvas.height);
  canvasContext.stroke();

  var interval = setInterval(function() {
    if(GameGoOn){
      drawCanvas();
      ballMovement();
      computerMovement();
      drawRocket(PADDLE_OFFSET, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, PADDLE_COLOR); // your
      drawRocket(canvas.width - PADDLE_OFFSET - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, PADDLE_COLOR); // computer
      drawBall(ballX, ballY, BALL_SIZE, BALL_COLOR);
    }else {
      WinningProcedure();
      clearInterval(interval);
    }
  },time);

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = calculateMausePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
  })
}
function drawCanvas() {
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'white';
  canvasContext.font="34px Georgia";
  canvasContext.fillText(firstPlayerScore, 100, 100);
  canvasContext.fillText(secondplayerScore, canvas.width - 200, 100);
}

function drawRocket(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}

function drawBall(centerX, centerY, radius, drawColor) {
  canvasContext.beginPath();
  canvasContext.fillStyle = drawColor;
  canvasContext.arc(centerX, centerY, radius, 0, 2 * Math.PI, true);
  canvasContext.fill();
}

function ballReset() {
  ballSpeedX = 150;
  ballSpeedY = 200;
  let random = (Math.random() * 2) - 1;
  if(random > 0){
    ballSpeedY *= Math.ceil(random);
    ballSpeedX *= Math.ceil(random);
  }else if(random < 0){
    ballSpeedY *= Math.floor(random);
    ballSpeedX *= Math.floor(random);
  }else {
    ballSpeedY = 200;
    ballSpeedX = 150;
  }  
  ballX = canvas.width/2;
  ballY = canvas.height/2;

  if(firstPlayerScore >= WINNING_SCORE){
    GameGoOn = false;
    whoHadWon = 'First player';
  }else if(secondplayerScore >= WINNING_SCORE){
    GameGoOn = false;
    whoHadWon = 'Second player';
  }
}

function ballSpeedChange(paddle) {
  ballSpeedX = -ballSpeedX;
  let deltaY;
  if(paddle == 'first'){
    deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2)
  }else if(paddle == 'second'){
    deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2)
  }  
  ballSpeedY = deltaY * 8;
}

function computerMovement() {

  let paddle2YCenter = paddle2Y + PADDLE_HEIGHT/2;
  let localSpeed = Math.abs(paddle2YCenter - ballY)/t;
  let speed = localSpeed < paddleSpeed ? localSpeed: paddleSpeed;

  if(paddle2YCenter < ballY + 35 && ballSpeedX > 0 && ballX > 600){
      paddle2Y += speed * t;  
  }else if(paddle2YCenter > ballY - 35 && ballSpeedX > 0 && ballX > 600) {
      paddle2Y -= speed * t;
  }else if(ballSpeedX < 0){
    moveToTheCenter();
  }else{
    // do nothing
  }
} 

function moveToTheCenter() {
  let paddle2YCenter = paddle2Y + PADDLE_HEIGHT/2;
  if(paddle2YCenter > canvas.height / 2 + 35){
     paddle2Y -= paddleSpeed * t;
  }else if(paddle2YCenter < canvas.height /2 - 35){
     paddle2Y += paddleSpeed * t;
  }else {
    // do nothing
  }
}

function ballMovement() {
  ballX = ballX + ballSpeedX * t;
  ballY = ballY + ballSpeedY * t;

  if(ballX > PADDLE_OFFSET && ballX < PADDLE_OFFSET + PADDLE_THICKNESS){
    if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
      ballSpeedChange('first');
    }
  }
  if(ballX < canvas.width - PADDLE_OFFSET && ballX > canvas.width - PADDLE_OFFSET - PADDLE_THICKNESS){
    if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
      ballSpeedChange('second');
    }
  }
  if(ballX >= canvas.width){
    firstPlayerScore++; // score incrementing should be before reset
    ballReset();
    // point for player
  }else if (ballX <= 0) {
    secondplayerScore++; // score incrementing should be before reset
    ballReset();    
    // point for computer
  }
  if(ballY >= canvas.height || ballY <= 0) { ballSpeedY = -ballSpeedY;}
}

function WinningProcedure() {

  drawRocket(PADDLE_OFFSET, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'blue'); // your
  drawRocket(canvas.width - PADDLE_OFFSET - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'blue'); // computer
  drawBall(ballX, ballY, BALL_SIZE, 'blue');

  canvasContext.fillStyle = 'blue';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  canvasContext.fillStyle = 'white';
  canvasContext.font="34px Georgia";
  canvasContext.fillText(`${whoHadWon} had won the Game`, canvas.width/2 - 250, canvas.height/2);
}
