TRYpost_game = `
canvas.width=0;
canvas.height=0;
tileset = ''
tiles = [];
tiles2 = [];
objects = [];
tiles3 = [];
mapW = 0;
mapH = 0;
gridSize = 0;
viewport = {}
function load_map(m){
  tileset = draw_set_image(m.tileSet)
  tiles = m.tiles;
  tiles2 = m.tiles2;
  tiles3 =m.tiles3;
  objects = m.objects
  gameCode = m.gameCode
  mapW = m.mapW
  mapH = m.mapH
  viewport = m.view
  gridSize = m.gridSize
  columns = m.tColumns
  canvas.width=viewport.w;//mapW*gridSize;
  canvas.height=viewport.h;//mapH*gridSize;
  for(let i = 0; i <objects.length; i++){
    objects[i].x = objects[i].mapX*gridSize;
    objects[i].y = objects[i].mapY*gridSize;
    objects[i].type = 'basic';
    objects[i].firstRun=true;
    objects[i].onceCode="";
    objects[i].kill=false;
  }

}

function draw_map() {
  // Calculate the visible tile range
  const startTileX = Math.floor(viewport.x / gridSize);
  const endTileX = Math.ceil((viewport.x + viewport.w) / gridSize);
  const startTileY = Math.floor(viewport.y / gridSize);
  const endTileY = Math.ceil((viewport.y + viewport.h) / gridSize);
  
  // Draw tiles within the viewport
  for (let y = startTileY; y < endTileY; y++) {
    for (let x = startTileX; x < endTileX; x++) {
      if (tiles[y] && tiles[y][x] > 0) {
        let tId = tiles[y][x];
        let sx = tId % columns * gridSize;
        let sy = Math.floor(tId / columns) * gridSize;
        draw_image(
        tileset,
        x * gridSize - viewport.x, // Adjust by viewport
        y * gridSize - viewport.y, // Adjust by viewport
        gridSize,
        gridSize,
        0, 0, 0, sx, sy, gridSize, gridSize
        );
      }
      if (tiles2[y] && tiles2[y][x] > 0 ) {
        let tId = tiles2[y][x];
        let sx = tId % columns * gridSize;
        let sy = Math.floor(tId / columns) * gridSize;
        draw_image(
        tileset,
        x * gridSize - viewport.x, // Adjust by viewport
        y * gridSize - viewport.y, // Adjust by viewport
        gridSize,
        gridSize,
        0, 0, 0, sx, sy, gridSize, gridSize
        );
      }
    }
  }
  // Draw objects within the viewport
  for (let i = objects.length - 1; i >= 0; i--) {
    let me = objects[i];
    let tId = me.tId;
    let x = me.x - viewport.x; // Adjust by viewport
    let y = me.y - viewport.y; // Adjust by viewport
    let w = me.w * gridSize;
    let h = me.h * gridSize;
    me.mapX = (me.x/gridSize).toFixed(1)
    me.mapY = (me.y/gridSize).toFixed(1)
    let rot = me.rot;
    let sx = tId % columns * gridSize;
    let sy = Math.floor(tId / columns) * gridSize;
    let ox = (gridSize * me.w) / 2;
    let oy = (gridSize * me.h) / 2;
    
    // Skip objects outside the viewport for optimization
    if (
    x + w < -128 || x > viewport.w+128 ||
    y + h < -128 || y > viewport.h+128
    ) {
      continue;
    }
    try {
      eval(gameCode)
    } catch (error) {
      if(error){
        let emess = " gCode Error: " +gameCode+"<br>"+error.message
      localStorage.setItem("level_ed_error", JSON.stringify({error:error.message,object:null,scriptMode:5}))
        window.close();
      }
    }
    if (me.firstRun == true) {
      me.firstRun = false;
      try {
        eval(me.startCode);
      } catch(error){
        if(error){
          let emess = me.name+" startCode Error: " + me.startCode+"<br>"+error.message
        localStorage.setItem("level_ed_error", JSON.stringify({error:error.message,object:i,scriptMode:0}))
          window.close();
        }
      }
    }
    try {
      eval(me.loopCode);
    } catch (error) {
      if(error){
        let emess = me.name+" loopCode Error: " + me.loopCode+"<br>"+error.message
      localStorage.setItem("level_ed_error", JSON.stringify({error:error.message,object:i,scriptMode:1}))
        window.close();
      }
    }
    if (me.tId != 0) {
      draw_image(tileset, x, y, w, h, rot, ox, oy, sx, sy, gridSize, gridSize);
    } else {
      try {
        eval(me.drawCode);
      } catch(error){
        if(error){
          let emess = me.name+" drawCode Error: " + me.drawCode+"<br>"+error.message
        localStorage.setItem("level_ed_error", JSON.stringify({error:error.message,object:i,scriptMode:2}))
          window.close();
        }
      }
    }
    if(objects[i].kill==true){
      objects.splice(i,1);
    }
    
  }
    // Draw tiles within the viewport
  for (let y = startTileY; y < endTileY; y++) {
    for (let x = startTileX; x < endTileX; x++) {
      if (tiles3[y] && tiles3[y][x] > 0) {
        let tId = tiles3[y][x];
        let sx = tId % columns * gridSize;
        let sy = Math.floor(tId / columns) * gridSize;
        draw_image(
        tileset,
        x * gridSize - viewport.x, // Adjust by viewport
        y * gridSize - viewport.y, // Adjust by viewport
        gridSize,
        gridSize,
        0, 0, 0, sx, sy, gridSize, gridSize
        );
      }
    }
  }
}
function showCenteredPopup(text) {
  var div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '50vh';
  div.style.left = '50vw';
  div.style.transform = 'translate(-50%, -50%)';
  div.style.width = '400px';
  div.style.height = '200px';
  div.style.background = 'white';
  div.style.color = 'black';
  div.style.padding = '20px';
  div.style.borderRadius = '10px';
  div.style.boxShadow = '0 0 10px 0px black';
  div.style.textAlign = 'center';
  div.style.zIndex = '9999';
  div.style.display = 'block';
  div.style.fontSize = '18px';

  var h1 = document.createElement('h1');
  h1.style.margin = '0';
  h1.style.padding = '0 0 10px 0';
  h1.style.fontSize = '18px';
  h1.innerHTML = text;

  var button = document.createElement('button');
  button.style.background = '#00b3cc';
  button.style.border = 'none';
  button.style.borderRadius = '5px';
  button.style.padding = '10px 20px';
  button.style.margin = '10px auto';
  button.style.cursor = 'pointer';
  button.addEventListener('click', function() {
   window.close();
    div.parentNode.removeChild(div);
  });
  button.textContent = 'OK';

  div.appendChild(h1);
  div.appendChild(button);
  document.body.appendChild(div);
}
function get_tile(map,x,y){
  let curr_tId = null
  let mapX = snap(x,gridSize)/gridSize
  let mapY = snap(y,gridSize)/gridSize
  curr_tId= map[mapY][mapX]
  return curr_tId
}
function set_tile(map,x,y,tileID){
  let mapX = snap(x,gridSize)/gridSize
  let mapY = snap(y,gridSize)/gridSize
  map[mapY][mapX]=tileID
}
function ob(name){
  let obj = null
  for(let i = 0; i < objects.length; i++){
    if(objects[i].name==name){
      obj=objects[i]
    }
  }
  return obj
}
function type(type){
  let obj = []
  for(let i = 0; i < objects.length; i++){
    if(objects[i].type==type){
      obj.push(objects[i])
    }
  }
  return obj
}
function all_type(type,callback){
  let obj = []
  for(let i = 0; i < objects.length; i++){
    if(objects[i].type==type){
      callback(objects[i])
    }
  }
  
}
function makeName(){
  var name=null
  for(let index=0; index<100000; index++){
    var match= false;
    for(let i = 0; i < objects.length; i ++){
      if(objects[i].name=='object'+index){
        match = true
      }
    }
    if(match!=true){
      name= 'object'+index
      index = 100000;
    }
  }
  return name
}
function draw_tile(tId,x,y){
  let sx = tId%columns*gridSize;
  let sy = floor(tId/columns)*gridSize;
  draw_image(tileset,viewport.x+x,viewport.y+y,gridSize,gridSize,0,0,0,sx,sy,gridSize,gridSize)
  
}
function makeOb(tId,type,x,y){
  let temp = {
    name:makeName(),
    tId:tId,
    type:type,
    depth:0,
    x:x,
    y:y,
    mapX:round(x/gridSize),
    mapY:round(y/gridSize),
    w:1,
    h:1,
    rot:0,
    ox:0,
    oy:0,
    startCode:'',
    loopCode:'',
    drawCode:'',
    sel:false,
    kill:false,
  }
  objects.push(temp);
  return temp
}
function start(){
  load_map(map)
}


function loop(){
  
}

function draw(){
  draw_map()
}
</scr`+`ipt>
<script type='text/javascript' src='data:application/x-javascript;base64,Ly9taXNjCm1hc3Rlcl9hbHBoYSA9IDE7dGltZVNoaWZ0PTAsRlBTPVtdLGZwcz0wLHJ1bj10cnVlLGZ1bGxzY3JlZW49ZmFsc2U7Ci8vIG1hdGg6Cm1heCA9IE1hdGgubWF4LCBtaW4gPSBNYXRoLm1pbiwgcm91bmQgPSBNYXRoLnJvdW5kLCBmbG9vciA9IE1hdGguZmxvb3IsIGNlaWwgPSBNYXRoLmNlaWwsCnNpbiA9IE1hdGguc2luLCBjb3MgPSBNYXRoLmNvcywgc3FydCA9IE1hdGguc3FydCwgdGFuID0gTWF0aC50YW4sIHJhbmQgPSBNYXRoLnJhbmRvbSwKYXJjY29zID0gTWF0aC5hY29zLCBhcmNzaW4gPSBNYXRoLmFzaW4sIGFyY3RhbiA9IE1hdGguYXRhbiwgYXJjdGFuMiA9IE1hdGguYXRhbjIsCnR1X3IyZCA9IC0xODAgLyBNYXRoLlBJLCB0dV9kMnIgPSBNYXRoLlBJIC8gLTE4MCwgdHVfMnBpID0gTWF0aC5QSSAqIDIsCi8vIGkvbyBjb25zdGFudHM6CnZrXzAgPSA0OCwgdmtfMSA9IDQ5LCB2a18yID0gNTAsIHZrXzMgPSA1MSwgdmtfNCA9IDUyLCB2a181ID0gNTMsIHZrXzYgPSA1NCwKdmtfNyA9IDU1LCB2a184ID0gNTYsIHZrXzkgPSA1NywgdmtfYSA9IDY1LCB2a19hZGQgPSAxMDcsIHZrX2FsdCA9IDE4LCB2a19iID0gNjYsCnZrX2JhY2tzcGFjZSA9IDgsIHZrX2MgPSA2NywgdmtfY3RybCA9IDE3LCB2a19kID0gNjgsIHZrX2RlY2ltYWwgPSAxMTAsIHZrX2RlbGV0ZSA9IDQ2LAp2a19kaXZpZGUgPSAxMTEsIHZrX2Rvd24gPSA0MCwgdmtfZSA9IDY5LCB2a19lbmQgPSAzNSwgdmtfZW50ZXIgPSAxMywgdmtfZXNjYXBlID0gMjcsCnZrX2YxID0gMTEyLCB2a19mMiA9IDExMywgdmtfZjMgPSAxMTQsIHZrX2Y0ID0gMTE1LCB2a19mNSA9IDExNiwgdmtfZjYgPSAxMTcsCnZrX2Y3ID0gMTE4LCB2a19mOCA9IDExOSwgdmtfZjkgPSAxMjAsIHZrX2YxMCA9IDEyMSwgdmtfZjExID0gMTIyLCB2a19mMTIgPSAxMjMsCnZrX2cgPSA3MSwgdmtfaCA9IDcyLCB2a19ob21lID0gMzYsIHZrX2YgPSA3MCwgdmtfaSA9IDczLCB2a19pbnNlcnQgPSA0NSwgdmtfaiA9IDc0LCB2a19rID0gNzUsCnZrX2wgPSA3NiwgdmtfbGVmdCA9IDM3LCB2a19tID0gNzcsIHZrX211bHRpcGx5ID0gMTA2LCB2a19uID0gNzgsIHZrX251bTAgPSA5NiwgdmtfbnVtMSA9IDk3LAp2a19udW0yID0gOTgsIHZrX251bTMgPSA5OSwgdmtfbnVtNCA9IDEwMCwgdmtfbnVtNSA9IDEwMSwgdmtfbnVtNiA9IDEwMiwgdmtfbnVtNyA9IDEwMywKdmtfbnVtOCA9IDEwNCwgdmtfbnVtOSA9IDEwNSwgdmtfbyA9IDc5LCB2a19wID0gODAsIHZrX3BhZ2Vkb3duID0gMzQsIHZrX3BhZ2V1cCA9IDMzLAp2a19wYXVzZSA9IDE5LCB2a19xID0gODEsIHZrX3IgPSA4MiwgdmtfcmlnaHQgPSAzOSwgdmtfcyA9IDgzLCB2a19zaGlmdCA9IDE2LCB2a19zcGFjZSA9IDMyLAp2a19zdWJ0cmFjdCA9IDEwOSwgdmtfdCA9IDg0LCB2a190YWIgPSA5LCB2a191ID0gODUsIHZrX3VwID0gMzgsIHZrX3YgPSA4NiwgdmtfdyA9IDg3LAp2a194ID0gODgsIHZrX3kgPSA4OSwgdmtfeiA9IDkwLAovLyBpL28gdmFyaWFibGVzOgptb3VzZV94ID0gbW91c2VfeSA9IDAsIG1vdXNlX2Rvd24gPSBtb3VzZV9yaWdodF9kb3duPSBtb3VzZV9wcmVzc2VkID0gbW91c2VfcmVsZWFzZWQgPSBmYWxzZSx3aGVlbERpcj0wLAprZXlfZG93biA9IFtdLCBrZXlfcHJlc3NlZCA9IFtdLCBrZXlfcmVsZWFzZWQgPSBbXSxhbGxfa2V5c19wcmVzc2VkID0gW10sYWxsX2tleXNfcmVsZWFzZWQgPSBbXTsKdmtfYWxsX2tleXMgPSBbXTsKZnVuY3Rpb24gbWFrZV9zb3VuZChfc3JjLGJ1ZmZlcnMpewogIGlmIChfc3JjICE9ICcnKSB7CiAgICBsZXQgdGVtcCA9IFtdOwogICAgZm9yKGxldCBpID0gMDsgaSA8IGJ1ZmZlcnM7IGkrKyApewogICAgICB0ZW1wW2ldID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTsKICAgICAgdGVtcFtpXS5zZXRBdHRyaWJ1dGUoJ3NyYycsIF9zcmMpOwogICAgICB0ZW1wW2ldLm9uZXJyb3IgPSBmdW5jdGlvbigpIHsKICAgICAgICBhbGVydCgiRXJyb3I6IEZhaWxlZCB0byBsb2FkOiAiK19zcmMpOwogICAgICB9OwogICAgfQogICAgcmV0dXJuIHRlbXA7CiAgfQp9CmZ1bmN0aW9uIHBsYXkoc291bmQpewogIC8vLmR1cmF0aW9uID4gMCAmJiAhIC5wYXVzZWQgbWVhbnMgaXRzIHBsYXlpbmcKICBmb3IobGV0IGkgPSAwIDsgaSA8IHNvdW5kLmxlbmd0aCA7IGkrKyl7CiAgICBpZihzb3VuZFtpXS5kdXJhdGlvbiA+IDAgJiYgIXNvdW5kW2ldLnBhdXNlZCl7CiAgICB9ZWxzZXsKICAgICAgc291bmRbaV0uY3VycmVudFRpbWUgPSAwOwogICAgICBzb3VuZFtpXS5wbGF5KCkKICAgICAgaT0xMDAwOwogICAgfQogIH0KfQovL3JlcXVlc3QgZnVsbCBzY3JlZW4KZnVuY3Rpb24gcmVxdWVzdEZ1bGxzY3JlZW4oZWxlbWVudCkge2lmICghZWxlbWVudCkge2VsZW1lbnQgPSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7fWlmIChlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKSB7ZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbigpO30gZWxzZSBpZiAoZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbikge2VsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4oKTt9IGVsc2UgaWYgKGVsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbikge2VsZW1lbnQubXNSZXF1ZXN0RnVsbHNjcmVlbigpO30gZWxzZSBpZiAoZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbikge2VsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4oKTt9IGVsc2Uge2NvbnNvbGUuZXJyb3IoIkZ1bGxzY3JlZW4gQVBJIGlzIG5vdCBzdXBwb3J0ZWQgb24gdGhpcyBicm93c2VyLiIpO319Ci8vIGRldGVjdHMgZnVsbHNjcmVlbiBjaGFuZ2UKZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignZnVsbHNjcmVlbmNoYW5nZScsIGZ1bmN0aW9uKCkgewogIGlmIChkb2N1bWVudC5mdWxsc2NyZWVuRWxlbWVudCkgewogICAgZnVsbHNjcmVlbj10cnVlOwogIH0gZWxzZSB7CiAgICBmdWxsc2NyZWVuPWZhbHNlOwogIH0KICAKfSk7CmZ1bmN0aW9uIGRyYXdXcmFwcGVkVGV4dCh0ZXh0LCB4LCB5LCBtYXhXaWR0aCwgbGluZUhlaWdodCxmb250U2l6ZSwgd2VpZ2h0KXsKICBjb25zdCB3b3JkcyA9IHRleHQuc3BsaXQoJyAnKTsKICBsZXQgbGluZSA9ICcnOwogIGxldCBjdXJyZW50WSA9IHk7CiAgLy8gU2V0IGZvbnQgYW5kIHRleHQgc3R5bGUKaWYod2VpZ2h0PT1udWxsKXt3ZWlnaHQ9NDAwfQogIGN0eC5mb250ID0gd2VpZ2h0KyIgIitmb250U2l6ZSsicHggSGVsdmV0aWNhIjsKICBmb3IgKGxldCB3b3JkIG9mIHdvcmRzKSB7CiAgICBjb25zdCB0ZXN0TGluZSA9IGxpbmUgKyAobGluZSA/ICcgJyA6ICcnKSArIHdvcmQ7CiAgICBjb25zdCB0ZXN0V2lkdGggPSBjdHgubWVhc3VyZVRleHQodGVzdExpbmUpLndpZHRoOwogICAgCiAgICBpZiAodGVzdFdpZHRoID4gbWF4V2lkdGggJiYgbGluZSkgewogICAgICAvLyBEcmF3IHRoZSBjdXJyZW50IGxpbmUgaWYgaXQgZXhjZWVkcyBtYXhXaWR0aAogICAgICBjdHguZmlsbFRleHQobGluZSwgeCwgY3VycmVudFkpOwogICAgICBsaW5lID0gd29yZDsgLy8gU3RhcnQgYSBuZXcgbGluZSB3aXRoIHRoZSBjdXJyZW50IHdvcmQKICAgICAgY3VycmVudFkgKz0gbGluZUhlaWdodDsKICAgIH0gZWxzZSB7CiAgICAgIGxpbmUgPSB0ZXN0TGluZTsgLy8gQWRkIHRoZSB3b3JkIHRvIHRoZSBjdXJyZW50IGxpbmUKICAgIH0KICB9CiAgCiAgLy8gRHJhdyB0aGUgbGFzdCBsaW5lCiAgaWYgKGxpbmUpIHsKICAgIGN0eC5maWxsVGV4dChsaW5lLCB4LCBjdXJyZW50WSk7CiAgfQp9CmZ1bmN0aW9uIHRleHRfZml0KHRleHQsd2lkdGgpewogIGZvcihsZXQgaSA9IDY7IGk8MTIwOyBpKyspey8vIHN0YXRpbGVzUmVjdC5zcHJpdGVydCB3YXkgc21hbGwKICAgIGN0eC5mb250ID0gaSsncHggQXJpYWwnOyAvLyBzZXQgZm9udCBmb3IgdGVzdGluZwogICAgaWYoY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoPj13aWR0aCl7IC8vIGNoZWNrcyBpZiB0ZXh0IGRvZXNudCBmaXQgYm91bmRzCiAgICAgIHJldHVybiBpLTE7IC8vIG91dHB1dHMgcHJldmlvdXMgaSBzaW5jZSBpdCBwcm9iYWJseSBmaXQKICAgIH0KICB9Cn0KLy8gZHJhdyB0ZXh0OgpmdW5jdGlvbiBkcmF3X3RleHQoeCwgeSwgdGV4dCwgc2l6ZSx3ZWlnaHQpIHsKaWYod2VpZ2h0PT1udWxsKXt3ZWlnaHQ9NDAwfQogIGN0eC5nbG9iYWxBbHBoYSA9bWFzdGVyX2FscGhhOwppZihzaXplPT1udWxsKXtzaXplPTI0fQogIGN0eC5mb250ID0gd2VpZ2h0KyIgIitzaXplKyJweCBIZWx2ZXRpY2EiOwogIGN0eC50ZXh0QWxpZ24gPSAibGVmdCI7CiAgY3R4LnRleHRCYXNlbGluZSA9ICJ0b3AiOwogIGN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTsKfQpmdW5jdGlvbiBkcmF3X2NlbnRlcmVkX3RleHQoeCwgeSwgdGV4dCwgc2l6ZSwgd2VpZ2h0KSB7CmlmKHdlaWdodD09bnVsbCl7d2VpZ2h0PTQwMH0KICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKaWYoc2l6ZT09bnVsbCl7c2l6ZT0yNH0KICBjdHguZm9udCA9IHdlaWdodCsiICIrc2l6ZSsicHggSGVsdmV0aWNhIjsKICBjdHgudGV4dEFsaWduID0gImNlbnRlciI7CiAgY3R4LnRleHRCYXNlbGluZSA9ICJtaWRkbGUiOwogIGN0eC5maWxsVGV4dCh0ZXh0LCB4LCB5KTsKfQpmdW5jdGlvbiBkcmF3X3NldF9pbWFnZShmaWxlKXsKICBsZXQgdGVtcCA9IG5ldyBJbWFnZSgpOwogIHRlbXAuc3JjID0gZmlsZTsKICB0ZW1wLmxvYWRlZD1mYWxzZTsKICB0ZW1wLm9uZXJyb3IgPSBmdW5jdGlvbigpIHsKICAgIGFsZXJ0KCJFcnJvcjogRmFpbGVkIHRvIGxvYWQ6ICIrZmlsZSk7CiAgfTsKdGVtcC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7dGVtcC5sb2FkZWQ9dHJ1ZX07CiAgcmV0dXJuIHRlbXA7Cn0KZnVuY3Rpb24gZHJhd19zdHJpcCh4LHksc3RyaXAsZnJhbWUsdyxoLHJvdCxveCxveSl7CmlmICh3PT1udWxsKXt3PXN0cmlwLndpZHRofQppZiAoaD09bnVsbCl7aD1zdHJpcC5oZWlnaHR9CmlmKHJvdD09bnVsbCl7cm90PTB9CmlmKG94PT1udWxsKXtveD0wfQppZihveT09bnVsbCl7b3k9MH0KICBpZiAoc3RyaXAubG9hZGVkPT1mYWxzZSkgcmV0dXJuOwogIGxldCBmcmFtZXMgPSBzdHJpcC53aWR0aC9zdHJpcC5oZWlnaHQKICBpZihmcmFtZT49ZnJhbWVzKSBmcmFtZT1mcmFtZXMtMSAvLyBsb2NrcyBpdCBhdCBsYXN0IGZyYW1lIGlmIGFza2VkIHRvIGRyYXcgbW9yZSBmcmFtZXMgdGhhbiBpdCBoYXMKICBkcmF3X2ltYWdlKHN0cmlwLHgseSx3LGgscm90LG94LG95LChzdHJpcC53aWR0aC9mcmFtZXMpKmZyYW1lLDAsc3RyaXAud2lkdGgvZnJhbWVzLHN0cmlwLmhlaWdodCkKfQpmdW5jdGlvbiBkcmF3X2ltYWdlKGltZyx4LHksdyxoLHJvdCxveCxveSxzb3VyY2VfeCxzb3VyY2VfeSxzb3VyY2Vfdyxzb3VyY2VfaCl7CmlmKHc9PW51bGwpe3c9aW1nLndpZHRofQppZihoPT1udWxsKXtoPWltZy5oZWlnaHR9CmlmKHNvdXJjZV94PT1udWxsKXtzb3VyY2VfeD0wfQppZihzb3VyY2VfeT09bnVsbCl7c291cmNlX3k9MH0KaWYoc291cmNlX3c9PW51bGwpe3NvdXJjZV93PWltZy53aWR0aH0KaWYoc291cmNlX2g9PW51bGwpe3NvdXJjZV9oPWltZy5oZWlnaHR9CiAgdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjYW52YXMiKTsKICB2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoIjJkIik7CiAgY3R4Lmdsb2JhbEFscGhhID1tYXN0ZXJfYWxwaGE7CiAgaWYocm90IT1udWxsKXsKICAgIGN0eC5zYXZlKCk7CiAgICAvL2N0eC50cmFuc2xhdGUoeCtveCx5K295KTsKICAgIGN0eC50cmFuc2xhdGUoeCx5KTsKICAgIGlmKHJvdCE9MCl7CiAgICAgIGN0eC5yb3RhdGUocm90Kk1hdGguUEkvMTgwKTsvL3R1X3IyZCA9IC0xODAgLyBNYXRoLlBJLCB0dV9kMnIgPSBNYXRoLlBJIC8gLTE4MAogICAgfQogICAgY3R4LmRyYXdJbWFnZShpbWcsc291cmNlX3gsIHNvdXJjZV95LCBzb3VyY2Vfdywgc291cmNlX2gsIC1veCwtb3ksdyxoKTsKICAgIGN0eC5yZXN0b3JlKCkKICB9ZWxzZXsKICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB4LCB5LCB3LCBoKTsKICB9Cn0KLy8gZHJhdyBzaGFwZXM6CmZ1bmN0aW9uIGRyYXdfcmVjdGFuZ2xlKHgsIHksIHcsIGgsb3V0bGluZSxyb3Qsb3gsb3kpIHsKICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKICBpZihyb3QhPW51bGwpewogICAgY3R4LnNhdmUoKTsKICAgIGN0eC50cmFuc2xhdGUoeCx5KTsKICAgIGN0eC5yb3RhdGUocm90Kk1hdGguUEkvMTgwKTsKICAgIGN0eC5iZWdpblBhdGgoKTsKICAgIGlmIChvdXRsaW5lKSBjdHguc3Ryb2tlUmVjdCggLW94LC1veSx3LGgpOwogICAgZWxzZSBjdHguZmlsbFJlY3QoIC1veCwtb3ksdyxoICk7CiAgICBjdHguY2xvc2VQYXRoKCk7CiAgICBjdHgucmVzdG9yZSgpCiAgfWVsc2V7CiAgICBjdHguYmVnaW5QYXRoKCk7CiAgICBpZiAob3V0bGluZSkgY3R4LnN0cm9rZVJlY3QoIHgseSx3LGgpOwogICAgZWxzZSBjdHguZmlsbFJlY3QoIHgseSx3LGggKTsKICAgIGN0eC5jbG9zZVBhdGgoKQogIH0KfQpmdW5jdGlvbiBkcmF3X2NpcmNsZSh4LCB5LCByLCBvdXRsaW5lKSB7CiAgY3R4Lmdsb2JhbEFscGhhID1tYXN0ZXJfYWxwaGE7CiAgY3R4LmJlZ2luUGF0aCgpOwogIGN0eC5hcmMoIHgseSxyLCAwLCB0dV8ycGksIHRydWUgKTsKICBjdHguY2xvc2VQYXRoKCk7CiAgIW91dGxpbmUgPyBjdHguZmlsbCgpIDogY3R4LnN0cm9rZSgpOwp9CgpmdW5jdGlvbiBkcmF3X2xpbmUoeDEsIHkxLCB4MiwgeTIpIHsKICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKICBjdHguYmVnaW5QYXRoKCk7CiAgY3R4Lm1vdmVUbyggeDEsIHkxKTsKICBjdHgubGluZVRvKCB4MiwgeTIpOwogIGN0eC5jbG9zZVBhdGgoKTsKICBjdHguc3Ryb2tlKCk7Cn0KLy8gZHJhdyBzZXR0aW5nczoKZnVuY3Rpb24gZHJhd19zZXRfYWxwaGEoX2FscGhhKSB7CiAgbWFzdGVyX2FscGhhID0gX2FscGhhOwp9CmZ1bmN0aW9uIGRyYXdfc2V0X2NvbG9yKHIsZyxiKSB7CiAgLy8icmdiKDE1NSwgMTAyLCAxMDIpIjsKICBjdHguZmlsbFN0eWxlID0gInJnYigiK3IrIiwiK2crIiwiK2IrIikiOwogIGN0eC5zdHJva2VTdHlsZSA9ICJyZ2IoIityKyIsIitnKyIsIitiKyIpIjsKfQpmdW5jdGlvbiBkcmF3X3NldF9saW5ld2lkdGgod2lkdGgpIHsgY3R4LmxpbmVXaWR0aCA9IHdpZHRoOyB9CmZ1bmN0aW9uIGRyYXdfc2V0X2xpbmVkYXNoKGRhc2gpIHsgY3R4LnNldExpbmVEYXNoKGRhc2gpOyB9CmZ1bmN0aW9uIHNob3dfbW91c2UoKSB7IGNhbnZhcy5zdHlsZS5jdXJzb3IgPSAiZGVmYXVsdCI7IH0KZnVuY3Rpb24gaGlkZV9tb3VzZSgpIHsgY2FudmFzLnN0eWxlLmN1cnNvciA9ICJub25lIjsgfQovLyBtaW5pbWFsIG1hdGg6CmZ1bmN0aW9uIGF2ZXJhZ2UobnVtcyl7bGV0IG91dHB1dCA9IDA7Zm9yKGxldCBpID0gMDsgaSA8IG51bXMubGVuZ3RoOyBpKyspe291dHB1dCs9bnVtc1tpXX1yZXR1cm4gZmxvb3Iob3V0cHV0L251bXMubGVuZ3RoKX0KZnVuY3Rpb24gYWJzKF92YWx1ZSkgeyByZXR1cm4gX3ZhbHVlIDwgMCA/IC1fdmFsdWUgOiBfdmFsdWU7IH0KZnVuY3Rpb24gc2lnbihfdmFsdWUpIHsgcmV0dXJuIF92YWx1ZSA+IDAgPyAxIDogX3ZhbHVlIDwgMCA/IC0xIDogMDsgfQpmdW5jdGlvbiBjaG9vc2UoKSB7IHJldHVybiBhcmd1bWVudHNbfn4oTWF0aC5yYW5kb20oKSAqIGFyZ3VtZW50cy5sZW5ndGgpXTsgfQpmdW5jdGlvbiByYW5kb20oX3ZhbHVlKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpICogX3ZhbHVlOyB9CmZ1bmN0aW9uIGlyYW5kb20oX3ZhbHVlKSB7IHJldHVybiB+fihNYXRoLnJhbmRvbSgpICogX3ZhbHVlICsgMSk7IH0KZnVuY3Rpb24gZmxvb3IoX3ZhbHVlKSB7IHJldHVybiBNYXRoLmZsb29yKF92YWx1ZSk7IH0KZnVuY3Rpb24gcm91bmQoX3ZhbHVlKSB7IHJldHVybiBNYXRoLnJvdW5kKF92YWx1ZSk7IH0KZnVuY3Rpb24gc25hcChfdmFsdWUsZ3JpZCkgIHsgcmV0dXJuIGZsb29yKF92YWx1ZS9ncmlkKSpncmlkfQpmdW5jdGlvbiBsZXJwKGlucCx0YXJnZXQscmF0ZSl7cmV0dXJuIGlucCsodGFyZ2V0LWlucCkqcmF0ZTt9OwpmdW5jdGlvbiBlYXNlSW4oaW5wLHRhcmdldCxyYXRlKXtsZXQgZGlmZj10YXJnZXQtaW5wO3JldHVybiBpbnArZGlmZiooTWF0aC5wb3cocmF0ZSwyKSk7fTsKZnVuY3Rpb24gZWFzZU91dChpbnAsdGFyZ2V0LHJhdGUpe2xldCBkaWZmPXRhcmdldC1pbnA7cmV0dXJuIGlucCtkaWZmKigxIC1NYXRoLmV4cCgtcmF0ZSkpO307CmZ1bmN0aW9uIGNsYW1wKHZhbHVlLCBtaW4sIG1heCkge3JldHVybiBNYXRoLm1pbihNYXRoLm1heCh2YWx1ZSwgbWluKSwgbWF4KTt9CmZ1bmN0aW9uIGluc2lkZShweCwgcHksIHJ4LCByeSwgd2lkdGgsIGhlaWdodCwgYW5nbGUsIG9yaWdpblgsIG9yaWdpblkpIHtjb25zdCByYWRpYW5zID0gKGFuZ2xlICogTWF0aC5QSSkgLyAxODA7ZnVuY3Rpb24gcm90YXRlUG9pbnQoY3gsIGN5LCB4LCB5LCByYWRpYW5zKSB7Y29uc3QgY29zID0gTWF0aC5jb3MocmFkaWFucyk7Y29uc3Qgc2luID0gTWF0aC5zaW4ocmFkaWFucyk7Y29uc3QgZHggPSB4IC0gY3g7Y29uc3QgZHkgPSB5IC0gY3k7cmV0dXJuIHt4OiBjeCArIGR4ICogY29zIC0gZHkgKiBzaW4seTogY3kgKyBkeCAqIHNpbiArIGR5ICogY29zLH07fWNvbnN0IGNlbnRlclggPSByeCArIG9yaWdpblg7Y29uc3QgY2VudGVyWSA9IHJ5ICsgb3JpZ2luWTtjb25zdCBjb3JuZXJzID0gW3JvdGF0ZVBvaW50KGNlbnRlclgsIGNlbnRlclksIHJ4LCByeSwgcmFkaWFucykscm90YXRlUG9pbnQoY2VudGVyWCwgY2VudGVyWSwgcnggKyB3aWR0aCwgcnksIHJhZGlhbnMpLHJvdGF0ZVBvaW50KGNlbnRlclgsIGNlbnRlclksIHJ4ICsgd2lkdGgsIHJ5ICsgaGVpZ2h0LCByYWRpYW5zKSxyb3RhdGVQb2ludChjZW50ZXJYLCBjZW50ZXJZLCByeCwgcnkgKyBoZWlnaHQsIHJhZGlhbnMpLF07ZnVuY3Rpb24gY3Jvc3NQcm9kdWN0KEEsIEIsIFApIHtyZXR1cm4gKEIueCAtIEEueCkgKiAoUC55IC0gQS55KSAtIChCLnkgLSBBLnkpICogKFAueCAtIEEueCk7fWZvciAobGV0IGkgPSAwOyBpIDwgY29ybmVycy5sZW5ndGg7IGkrKykge2NvbnN0IEEgPSBjb3JuZXJzW2ldO2NvbnN0IEIgPSBjb3JuZXJzWyhpICsgMSkgJSBjb3JuZXJzLmxlbmd0aF07Y29uc3QgY3Jvc3MgPSBjcm9zc1Byb2R1Y3QoQSwgQiwgeyB4OiBweCwgeTogcHkgfSk7aWYgKGNyb3NzIDwgMCkge3JldHVybiBmYWxzZTt9fXJldHVybiB0cnVlO30KLy8gdHJpZyBmdW5jdGlvbnM6CmZ1bmN0aW9uIGxlbmd0aGRpcl94KF9sZW5ndGgsIF9kaXJlY3Rpb24pIHsgcmV0dXJuIF9sZW5ndGggKiBNYXRoLmNvcyhfZGlyZWN0aW9uICogdHVfZDJyKTsgfQpmdW5jdGlvbiBsZW5ndGhkaXJfeShfbGVuZ3RoLCBfZGlyZWN0aW9uKSB7IHJldHVybiBfbGVuZ3RoICogTWF0aC5zaW4oX2RpcmVjdGlvbiAqIHR1X2Qycik7IH0KZnVuY3Rpb24gcG9pbnRfZGlzdGFuY2UoX3gxLCBfeTEsIF94MiwgX3kyKSB7IHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKCBfeDEgLSBfeDIpLCAyKSArIE1hdGgucG93KChfeTEgLSBfeTIpLCAyKSk7IH0KZnVuY3Rpb24gcG9pbnRfZGlyZWN0aW9uKF94MSwgX3kxLCBfeDIsIF95MikgeyByZXR1cm4gTWF0aC5hdGFuMihfeTIgLSBfeTEsIF94MiAtIF94MSkgKiB0dV9yMmQ7IH0KZnVuY3Rpb24gZGVndG9yYWQoX2RlZ3JlZSkgeyByZXR1cm4gX2RlZ3JlZSAqIHR1X2QycjsgfQpmdW5jdGlvbiByYWR0b2RlZyhfZGVncmVlKSB7IHJldHVybiBfZGVncmVlICogdHVfcjJkOyB9Ci8vIGtleWJvYXJkIGZ1bmN0aW9uczoKZnVuY3Rpb24ga2V5Ym9hcmRfY2hlY2soX2tleSkgeyByZXR1cm4ga2V5X2Rvd25bX2tleV07IH0KZnVuY3Rpb24ga2V5Ym9hcmRfY2hlY2tfcHJlc3NlZChfa2V5KSB7IHJldHVybiBrZXlfcHJlc3NlZFtfa2V5XTsgfQpmdW5jdGlvbiBrZXlib2FyZF9jaGVja19yZWxlYXNlZChfa2V5KSB7IHJldHVybiBrZXlfcmVsZWFzZWRbX2tleV07IH0KLy8gbW91c2UgdG91Y2ggZnVuY3Rpb25zOgpmdW5jdGlvbiBzd2lwZWQoc2Vuc2l0aXZ5KXsKICBsZXQgZGlzID0gc2Vuc2l0aXZ5OwogIGxldCBkaXIgPSAwOwogIGxldCBzd2lwZWQ9bnVsbDsKICBpZiAodHlwZW9mIHN0YXJ0WCA9PSAidW5kZWZpbmVkIikgewogICAgbGV0IHN0YXJ0WCA9IC0xMDA7CiAgICBsZXQgc3RhcnRZPSAtMTAwOwogICAgbGV0IGVuZFggPSAtMTAwOwogICAgbGV0IGVuZFkgPSAtMTAwOwogIH07CiAgaWYobW91c2VfY2hlY2tfcHJlc3NlZCgpKXsKICAgIHN0YXJ0WCA9IG1vdXNlX3g7CiAgICBzdGFydFkgPSBtb3VzZV95OwogIH07CiAgaWYobW91c2VfY2hlY2tfcmVsZWFzZWQoKSl7CiAgICBzd2lwZWQ9J25vbmUnCiAgICBlbmRYID0gbW91c2VfeDsKICAgIGVuZFkgPSBtb3VzZV95OwogICAgaWYocG9pbnRfZGlzdGFuY2Uoc3RhcnRYLHN0YXJ0WSxlbmRYLGVuZFkpPmRpcyl7CiAgICAgIGRpciA9IHBvaW50X2RpcmVjdGlvbihzdGFydFgsc3RhcnRZLGVuZFgsZW5kWSk7CiAgICBpZihkaXI+NDUgJiYgZGlyPDEzNSl7c3dpcGVkPSd1cCd9OwogICAgaWYoZGlyPD00NSAmJiBkaXI+PS00NSl7c3dpcGVkPSdyaWdodCd9OwogICAgaWYoZGlyPC00NSAmJiBkaXI+LTEzNSl7c3dpcGVkPSdkb3duJ307CiAgICBpZihkaXI+PTEzNSB8fCBkaXI8PS0xMzUpe3N3aXBlZD0nbGVmdCd9OwogICAgfTsKICB9OwogIHJldHVybiBzd2lwZWQ7Cn07CgpmdW5jdGlvbiBtb3VzZV9jaGVjaygpIHsgcmV0dXJuIG1vdXNlX2Rvd247IH0KZnVuY3Rpb24gbW91c2VfY2hlY2tfcHJlc3NlZCgpIHsgcmV0dXJuIG1vdXNlX3ByZXNzZWQ7IH0KZnVuY3Rpb24gbW91c2VfY2hlY2tfcmVsZWFzZWQoKSB7IHJldHVybiBtb3VzZV9yZWxlYXNlZDsgfQovL3NldHMgdXAgY2FudmFzIHZhcmlhYmxlcwp2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2NhbnZhcycpOwp2YXIgY3R4ID0gY2FudmFzLmdldENvbnRleHQoIjJkIik7CmZ1bmN0aW9uIGtEb3duKGUpewogIGlmKGUucmVwZWF0KXsKICAgIHJldHVybjsKICB9CiAgdmtfYWxsX2tleXMucHVzaChlLmtleSkKICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZTsKICBpZiAoIWtleV9kb3duW2tleUNvZGVdKSB7CiAgICBrZXlfcHJlc3NlZFtrZXlDb2RlXSA9IHRydWU7CiAgICBhbGxfa2V5c19wcmVzc2VkLnB1c2goa2V5Q29kZSk7CiAgfQogIGtleV9kb3duW2tleUNvZGVdID0gdHJ1ZTsKfQpmdW5jdGlvbiBrVXAoZSl7CiAgdmFyIGtleUNvZGUgPSBlLmtleUNvZGU7CiAgaWYgKGtleV9kb3duW2tleUNvZGVdKQogIHsKICAgIGtleV9yZWxlYXNlZFtrZXlDb2RlXSA9IHRydWU7CiAgICBhbGxfa2V5c19yZWxlYXNlZC5wdXNoKGtleUNvZGUpOwogIH0KICBrZXlfZG93bltrZXlDb2RlXSA9IGZhbHNlOwp9CmZ1bmN0aW9uIG1Eb3duKGUpewogIGlmKGUuYnV0dG9uID09IDIpIHsKICAgIG1vdXNlX3JpZ2h0X2Rvd249dHJ1ZQogIH1lbHNlewogICAgaWYgKCFtb3VzZV9kb3duKSB7CiAgICAgIG1vdXNlX2Rvd24gPSB0cnVlOwogICAgICBtb3VzZV9wcmVzc2VkID0gdHJ1ZTsKICAgIH1lbHNlewogICAgICBtb3VzZV9kb3duID0gdHJ1ZTsKICAgIH0KICB9Cn0KCmZ1bmN0aW9uIG1VcChlKSB7CiAgaWYoZS5idXR0b24gPT0gMikgewogICAgbW91c2VfcmlnaHRfZG93bj1mYWxzZQogIH1lbHNlewogICAgaWYgKCFtb3VzZV9kb3duKSB7CiAgICAgIG1vdXNlX2Rvd24gPSBmYWxzZTsKICAgICAgbW91c2VfcHJlc3NlZCA9IGZhbHNlOwogICAgfSBlbHNlIHsKICAgICAgbW91c2VfZG93biA9IGZhbHNlOwogICAgICBtb3VzZV9yZWxlYXNlZCA9IHRydWU7CiAgICB9CiAgfQp9CgpmdW5jdGlvbiBtTW92ZShlKSB7CiAgbGV0IHgsIHk7CiAgCiAgLy8gQ2hlY2sgZm9yIHRvdWNoIGlucHV0CiAgaWYgKGUudG91Y2hlcykgewogICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYOwogICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZOwogIH0KICAvLyBPdGhlcndpc2UgdXNlIG1vdXNlIGlucHV0CiAgZWxzZSBpZiAoZS5wYWdlWCAhPSB1bmRlZmluZWQgJiYgZS5wYWdlWSAhPSB1bmRlZmluZWQpIHsKICAgIHggPSBlLnBhZ2VYOwogICAgeSA9IGUucGFnZVk7CiAgfSBlbHNlIHsKICAgIHggPSBlLmNsaWVudFggKyBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDsKICAgIHkgPSBlLmNsaWVudFkgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7CiAgfQogIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLwogIC8vL1pPT00gQ09SUkVDVElPTgogIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8KICB2YXIgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKQogIGxldCBzY2FsZVggPSBjYW52YXMud2lkdGggLyByZWN0LndpZHRoOwogIGxldCBzY2FsZVkgPSBjYW52YXMuaGVpZ2h0IC8gcmVjdC5oZWlnaHQ7CiAgbW91c2VfeCA9ICh4IC0gY2FudmFzLm9mZnNldExlZnQpKiBzY2FsZVg7CiAgbW91c2VfeSA9ICh5IC0gY2FudmFzLm9mZnNldFRvcCkqIHNjYWxlWTsKICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgc2Nyb2xsaW5nIGJlaGF2aW9yCn0KZnVuY3Rpb24gdG91Y2hTdGFydChlKSB7CiAgbU1vdmUoZSk7CiAgbURvd24oKTsKfQoKZnVuY3Rpb24gdG91Y2hFbmQoZSkgewogIG1VcCgpOwp9CmFkZEV2ZW50TGlzdGVuZXIoImtleWRvd24iLCBrRG93biwgZmFsc2UpOy8vMTYgaXMgc2hpZnQgZS5rZXlDb2RlOwphZGRFdmVudExpc3RlbmVyKCJrZXl1cCIsIGtVcCwgZmFsc2UpOwphZGRFdmVudExpc3RlbmVyKCJtb3VzZWRvd24iLG1Eb3duLGZhbHNlKTsKYWRkRXZlbnRMaXN0ZW5lcigibW91c2V1cCIsbVVwLGZhbHNlKTsKYWRkRXZlbnRMaXN0ZW5lcigibW91c2Vtb3ZlIixtTW92ZSxmYWxzZSk7CmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgd2hlZWwsZmFsc2UpOwovLyBBZGQgdG91Y2ggZXZlbnQgbGlzdGVuZXJzIHdpdGggeyBwYXNzaXZlOiBmYWxzZSB9CmFkZEV2ZW50TGlzdGVuZXIoInRvdWNoc3RhcnQiLCB0b3VjaFN0YXJ0LCB7IHBhc3NpdmU6IGZhbHNlIH0pOwphZGRFdmVudExpc3RlbmVyKCJ0b3VjaGVuZCIsIHRvdWNoRW5kLCB7IHBhc3NpdmU6IGZhbHNlIH0pOwphZGRFdmVudExpc3RlbmVyKCJ0b3VjaG1vdmUiLCBtTW92ZSwgeyBwYXNzaXZlOiBmYWxzZSB9KTsKYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldmVudCkgewogIC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgY29udGV4dCBtZW51IGZyb20gYXBwZWFyaW5nCiAgZXZlbnQucHJldmVudERlZmF1bHQoKTsKCn0pOwpmdW5jdGlvbiB3aGVlbChlKSB7CiAgaWYgKGUuZGVsdGFZIDwgMCkgewogICAgd2hlZWxEaXIrKzsKICB9IGVsc2UgewogICAgd2hlZWxEaXItLTsKICB9Cn07Ci8vIFRoZSBtYWluIGdhbWUgbG9vcApmdW5jdGlvbiBtYWluKCkgewogIHZhciBub3cgPSBEYXRlLm5vdygpOwogIHZhciBkZWx0YSA9IG5vdyAtIHRoZW47CiAgdGltZVNoaWZ0ID0gZGVsdGEgLyAxMDAwCiAgRlBTLnB1c2goTWF0aC5mbG9vcigxL3RpbWVTaGlmdCkpOwogIGlmKEZQUy5sZW5ndGg+MTApewogICAgZnBzID0gYXZlcmFnZShGUFMpOwogICAgRlBTID0gW107CiAgfQogIGlmKHJ1bil7CiAgICBjdHguY2xlYXJSZWN0KDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7CiAgICBkcmF3KCk7CiAgfQogIGxvb3AoKTsKICAKICAvL2NsZWFycyBrZXlwcmVzc2VzIGFuZCBtb3VzZXByZXNzCiAgZm9yIChsZXQgX2sgPSAwOyBfayA8IGFsbF9rZXlzX3ByZXNzZWQubGVuZ3RoOyBfaysrKSBrZXlfcHJlc3NlZFthbGxfa2V5c19wcmVzc2VkW19rXV0gPSBmYWxzZTsKICBmb3IgKGxldCBfayA9IDA7IF9rIDwgYWxsX2tleXNfcmVsZWFzZWQubGVuZ3RoOyBfaysrKSBrZXlfcmVsZWFzZWRbYWxsX2tleXNfcmVsZWFzZWRbX2tdXSA9IGZhbHNlOwogIGFsbF9rZXlzX3ByZXNzZWQgPSBbXTsgYWxsX2tleXNfcmVsZWFzZWQgPSBbXTttb3VzZV9wcmVzc2VkID0gZmFsc2U7bW91c2VfcmVsZWFzZWQgPSBmYWxzZTsKICAKICB0aGVuID0gbm93OwogIC8vIFJlcXVlc3QgdG8gZG8gdGhpcyBhZ2FpbiBBU0FQCiAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKG1haW4pOwp9OwovLyBDcm9zcy1icm93c2VyIHN1cHBvcnQgZm9yIHJlcXVlc3RBbmltYXRpb25GcmFtZQp2YXIgdyA9IHdpbmRvdzsKcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3Lm1velJlcXVlc3RBbmltYXRpb25GcmFtZTsKLy8gTGV0J3MgcGxheSB0aGlzIGdhbWUhCnZhciB0aGVuID0gRGF0ZS5ub3coKTsKc3RhcnQoKTsKbWFpbigpOwo='></script>

</b`+`ody>
</ht`+`ml>
`
