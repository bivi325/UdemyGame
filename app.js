var canvas, canvasContext;

var ballX = 50, ballY = 20;
var ballSpeedX = 200;
var ballSpeedY = 200;
const BALL_SIZE = 10;
const BALL_COLOR = 'red';

var paddle1Y = 250;
var paddle2Y = 250;
const PADDLE_OFFSET = 20;
const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 20;
const PADDLE_COLOR = 'white';

const framesPerSecond = 30;
const time = 1000 / framesPerSecond;

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
  setInterval(function() {
    drawCanvas();
    ballMovement();
    computerMovement();
    drawRocket(PADDLE_OFFSET, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, PADDLE_COLOR); // your
    drawRocket(canvas.width - PADDLE_OFFSET - PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, PADDLE_COLOR); // computer
    drawBall(ballX, ballY, BALL_SIZE, BALL_COLOR);
  },time);

  canvas.addEventListener('mousemove', function(evt) {
    var mousePos = calculateMausePos(evt);
    paddle1Y = mousePos.y - PADDLE_HEIGHT/2;
  })
}
function drawCanvas() {
  canvasContext.fillStyle = 'black';
  canvasContext.fillRect(0, 0, canvas.width, canvas.height);
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
  let random = (Math.random() * 2) - 1;
  if(random > 0){
    ballSpeedY *= Math.ceil(random);
    ballSpeedX *= Math.ceil(random);
  }else if(random < 0){
    ballSpeedY *= Math.floor(random);
    ballSpeedX *= Math.floor(random);
  }else {
    ballSpeedY = 200;
    ballSpeedX = 200;
  }  
  ballX = canvas.width/2;
  ballY = canvas.height/2;
}

function ballSpeedChange() {
  ballSpeedX = -ballSpeedX;
  ballSpeedY = -ballSpeedY;
}

function computerMovement() {
  if((paddle2Y + PADDLE_HEIGHT/2) < ballY){
    paddle2Y += Math.abs(ballSpeedY) * time / 1000;
  }else if((paddle2Y + PADDLE_HEIGHT/2) > ballY) {
    paddle2Y -= Math.abs(ballSpeedY) * time / 1000;
  }else{
    paddle2Y += (Math.random() * 2) - 1;
  }
}

function ballMovement() {
  ballX = ballX + ballSpeedX * time / 1000;
  ballY = ballY + ballSpeedY * time / 1000;

  if(ballX > PADDLE_OFFSET && ballX < PADDLE_OFFSET + PADDLE_THICKNESS){
    if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
      ballSpeedChange();
    }
  }
  if(ballX < canvas.width - PADDLE_OFFSET && ballX > canvas.width - PADDLE_OFFSET - PADDLE_THICKNESS){
    if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
      ballSpeedChange();
    }
  }
  if(ballX >= canvas.width){
    ballReset();
    // point for player
  }else if (ballX <= 0) {
    ballReset();
    // point for computer
  }
  if(ballY >= canvas.height || ballY <= 0) { ballSpeedY = -ballSpeedY;}
}
