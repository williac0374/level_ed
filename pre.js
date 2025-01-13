pre_game = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>level_Play_tester</title>
<style>
body{
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: black;
  
}
canvas {
  // border: 2px solid #000;
  background-color: white;
  height:100vh;
}
</style>
</head>

<body>
<canvas id="canvas"></canvas>

<script>
function resizeCanvas() {
  
  var WIDTH = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  var HEIGHT = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  canvas.style.width=WIDTH+'px';
  canvas.style.height=HEIGHT+'px';
  requestFullscreen(element)
}
//window.addEventListener('resize', resizeCanvas);
//setTimeout(function(){resizeCanvas()},100);

`
