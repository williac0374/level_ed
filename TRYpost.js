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
<script type='text/javascript' src='data:text/javascript;base64,Ly9taXNjCm1hc3Rlcl9hbHBoYSA9IDE7dGltZVNoaWZ0PTAsRlBTPVtdLGZwcz0wLHJ1bj10cnVlLGZ1bGxzY3JlZW49ZmFsc2U7Ci8vIG1hdGg6Cm1heCA9IE1hdGgubWF4LCBtaW4gPSBNYXRoLm1pbiwgcm91bmQgPSBNYXRoLnJvdW5kLCBmbG9vciA9IE1hdGguZmxvb3IsIGNlaWwgPSBNYXRoLmNlaWwsCnNpbiA9IE1hdGguc2luLCBjb3MgPSBNYXRoLmNvcywgc3FydCA9IE1hdGguc3FydCwgdGFuID0gTWF0aC50YW4sIHJhbmQgPSBNYXRoLnJhbmRvbSwKYXJjY29zID0gTWF0aC5hY29zLCBhcmNzaW4gPSBNYXRoLmFzaW4sIGFyY3RhbiA9IE1hdGguYXRhbiwgYXJjdGFuMiA9IE1hdGguYXRhbjIsCnR1X3IyZCA9IC0xODAgLyBNYXRoLlBJLCB0dV9kMnIgPSBNYXRoLlBJIC8gLTE4MCwgdHVfMnBpID0gTWF0aC5QSSAqIDIsCi8vIGkvbyBjb25zdGFudHM6CnZrXzAgPSA0OCwgdmtfMSA9IDQ5LCB2a18yID0gNTAsIHZrXzMgPSA1MSwgdmtfNCA9IDUyLCB2a181ID0gNTMsIHZrXzYgPSA1NCwKdmtfNyA9IDU1LCB2a184ID0gNTYsIHZrXzkgPSA1NywgdmtfYSA9IDY1LCB2a19hZGQgPSAxMDcsIHZrX2FsdCA9IDE4LCB2a19iID0gNjYsCnZrX2JhY2tzcGFjZSA9IDgsIHZrX2MgPSA2NywgdmtfY3RybCA9IDE3LCB2a19kID0gNjgsIHZrX2RlY2ltYWwgPSAxMTAsIHZrX2RlbGV0ZSA9IDQ2LAp2a19kaXZpZGUgPSAxMTEsIHZrX2Rvd24gPSA0MCwgdmtfZSA9IDY5LCB2a19lbmQgPSAzNSwgdmtfZW50ZXIgPSAxMywgdmtfZXNjYXBlID0gMjcsCnZrX2YxID0gMTEyLCB2a19mMiA9IDExMywgdmtfZjMgPSAxMTQsIHZrX2Y0ID0gMTE1LCB2a19mNSA9IDExNiwgdmtfZjYgPSAxMTcsCnZrX2Y3ID0gMTE4LCB2a19mOCA9IDExOSwgdmtfZjkgPSAxMjAsIHZrX2YxMCA9IDEyMSwgdmtfZjExID0gMTIyLCB2a19mMTIgPSAxMjMsCnZrX2cgPSA3MSwgdmtfaCA9IDcyLCB2a19ob21lID0gMzYsIHZrX2YgPSA3MCwgdmtfaSA9IDczLCB2a19pbnNlcnQgPSA0NSwgdmtfaiA9IDc0LCB2a19rID0gNzUsCnZrX2wgPSA3NiwgdmtfbGVmdCA9IDM3LCB2a19tID0gNzcsIHZrX211bHRpcGx5ID0gMTA2LCB2a19uID0gNzgsIHZrX251bTAgPSA5NiwgdmtfbnVtMSA9IDk3LAp2a19udW0yID0gOTgsIHZrX251bTMgPSA5OSwgdmtfbnVtNCA9IDEwMCwgdmtfbnVtNSA9IDEwMSwgdmtfbnVtNiA9IDEwMiwgdmtfbnVtNyA9IDEwMywKdmtfbnVtOCA9IDEwNCwgdmtfbnVtOSA9IDEwNSwgdmtfbyA9IDc5LCB2a19wID0gODAsIHZrX3BhZ2Vkb3duID0gMzQsIHZrX3BhZ2V1cCA9IDMzLAp2a19wYXVzZSA9IDE5LCB2a19xID0gODEsIHZrX3IgPSA4MiwgdmtfcmlnaHQgPSAzOSwgdmtfcyA9IDgzLCB2a19zaGlmdCA9IDE2LCB2a19zcGFjZSA9IDMyLAp2a19zdWJ0cmFjdCA9IDEwOSwgdmtfdCA9IDg0LCB2a190YWIgPSA5LCB2a191ID0gODUsIHZrX3VwID0gMzgsIHZrX3YgPSA4NiwgdmtfdyA9IDg3LAp2a194ID0gODgsIHZrX3kgPSA4OSwgdmtfeiA9IDkwLAovLyBpL28gdmFyaWFibGVzOgptb3VzZV94ID0gbW91c2VfeSA9IDAsIG1vdXNlX2Rvd24gPSBtb3VzZV9yaWdodF9kb3duPSBtb3VzZV9wcmVzc2VkID0gbW91c2VfcmVsZWFzZWQgPSBmYWxzZSx3aGVlbERpcj0wLAprZXlfZG93biA9IFtdLCBrZXlfcHJlc3NlZCA9IFtdLCBrZXlfcmVsZWFzZWQgPSBbXSxhbGxfa2V5c19wcmVzc2VkID0gW10sYWxsX2tleXNfcmVsZWFzZWQgPSBbXTsKdmtfYWxsX2tleXMgPSBbXTtpc190b3VjaD1mYWxzZQpmdW5jdGlvbiBtYWtlX3NvdW5kKF9zcmMsYnVmZmVycyl7CiAgaWYgKF9zcmMgIT0gJycpIHsKICAgIGxldCB0ZW1wID0gW107CiAgICBmb3IobGV0IGkgPSAwOyBpIDwgYnVmZmVyczsgaSsrICl7CiAgICAgIHRlbXBbaV0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhdWRpbycpOwogICAgICB0ZW1wW2ldLnNldEF0dHJpYnV0ZSgnc3JjJywgX3NyYyk7CiAgICAgIHRlbXBbaV0ub25lcnJvciA9IGZ1bmN0aW9uKCkgewogICAgICAgIGFsZXJ0KCJFcnJvcjogRmFpbGVkIHRvIGxvYWQ6ICIrX3NyYyk7CiAgICAgIH07CiAgICB9CiAgICByZXR1cm4gdGVtcDsKICB9Cn0KZnVuY3Rpb24gcGxheShzb3VuZCl7CiAgLy8uZHVyYXRpb24gPiAwICYmICEgLnBhdXNlZCBtZWFucyBpdHMgcGxheWluZwogIGZvcihsZXQgaSA9IDAgOyBpIDwgc291bmQubGVuZ3RoIDsgaSsrKXsKICAgIGlmKHNvdW5kW2ldLmR1cmF0aW9uID4gMCAmJiAhc291bmRbaV0ucGF1c2VkKXsKICAgIH1lbHNlewogICAgICBzb3VuZFtpXS5jdXJyZW50VGltZSA9IDA7CiAgICAgIHNvdW5kW2ldLnBsYXkoKQogICAgICBpPTEwMDA7CiAgICB9CiAgfQp9Ci8vcmVxdWVzdCBmdWxsIHNjcmVlbgpmdW5jdGlvbiByZXF1ZXN0RnVsbHNjcmVlbihlbGVtZW50KSB7aWYgKCFlbGVtZW50KSB7ZWxlbWVudCA9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDt9aWYgKGVsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4pIHtlbGVtZW50LnJlcXVlc3RGdWxsc2NyZWVuKCk7fSBlbHNlIGlmIChlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKSB7ZWxlbWVudC53ZWJraXRSZXF1ZXN0RnVsbHNjcmVlbigpO30gZWxzZSBpZiAoZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKSB7ZWxlbWVudC5tc1JlcXVlc3RGdWxsc2NyZWVuKCk7fSBlbHNlIGlmIChlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKSB7ZWxlbWVudC5tb3pSZXF1ZXN0RnVsbFNjcmVlbigpO30gZWxzZSB7Y29uc29sZS5lcnJvcigiRnVsbHNjcmVlbiBBUEkgaXMgbm90IHN1cHBvcnRlZCBvbiB0aGlzIGJyb3dzZXIuIik7fX0KLy8gZGV0ZWN0cyBmdWxsc2NyZWVuIGNoYW5nZQpkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdmdWxsc2NyZWVuY2hhbmdlJywgZnVuY3Rpb24oKSB7CiAgaWYgKGRvY3VtZW50LmZ1bGxzY3JlZW5FbGVtZW50KSB7CiAgICBmdWxsc2NyZWVuPXRydWU7CiAgfSBlbHNlIHsKICAgIGZ1bGxzY3JlZW49ZmFsc2U7CiAgfQogIAp9KTsKZnVuY3Rpb24gZHJhd1dyYXBwZWRUZXh0KHRleHQsIHgsIHksIG1heFdpZHRoLCBsaW5lSGVpZ2h0LGZvbnRTaXplLCB3ZWlnaHQpewogIGNvbnN0IHdvcmRzID0gdGV4dC5zcGxpdCgnICcpOwogIGxldCBsaW5lID0gJyc7CiAgbGV0IGN1cnJlbnRZID0geTsKICAvLyBTZXQgZm9udCBhbmQgdGV4dCBzdHlsZQppZih3ZWlnaHQ9PW51bGwpe3dlaWdodD00MDB9CiAgY3R4LmZvbnQgPSB3ZWlnaHQrIiAiK2ZvbnRTaXplKyJweCBIZWx2ZXRpY2EiOwogIGZvciAobGV0IHdvcmQgb2Ygd29yZHMpIHsKICAgIGNvbnN0IHRlc3RMaW5lID0gbGluZSArIChsaW5lID8gJyAnIDogJycpICsgd29yZDsKICAgIGNvbnN0IHRlc3RXaWR0aCA9IGN0eC5tZWFzdXJlVGV4dCh0ZXN0TGluZSkud2lkdGg7CiAgICAKICAgIGlmICh0ZXN0V2lkdGggPiBtYXhXaWR0aCAmJiBsaW5lKSB7CiAgICAgIC8vIERyYXcgdGhlIGN1cnJlbnQgbGluZSBpZiBpdCBleGNlZWRzIG1heFdpZHRoCiAgICAgIGN0eC5maWxsVGV4dChsaW5lLCB4LCBjdXJyZW50WSk7CiAgICAgIGxpbmUgPSB3b3JkOyAvLyBTdGFydCBhIG5ldyBsaW5lIHdpdGggdGhlIGN1cnJlbnQgd29yZAogICAgICBjdXJyZW50WSArPSBsaW5lSGVpZ2h0OwogICAgfSBlbHNlIHsKICAgICAgbGluZSA9IHRlc3RMaW5lOyAvLyBBZGQgdGhlIHdvcmQgdG8gdGhlIGN1cnJlbnQgbGluZQogICAgfQogIH0KICAKICAvLyBEcmF3IHRoZSBsYXN0IGxpbmUKICBpZiAobGluZSkgewogICAgY3R4LmZpbGxUZXh0KGxpbmUsIHgsIGN1cnJlbnRZKTsKICB9Cn0KZnVuY3Rpb24gdGV4dF9maXQodGV4dCx3aWR0aCl7CiAgZm9yKGxldCBpID0gNjsgaTwxMjA7IGkrKyl7Ly8gc3RhdGlsZXNSZWN0LnNwcml0ZXJ0IHdheSBzbWFsbAogICAgY3R4LmZvbnQgPSBpKydweCBBcmlhbCc7IC8vIHNldCBmb250IGZvciB0ZXN0aW5nCiAgICBpZihjdHgubWVhc3VyZVRleHQodGV4dCkud2lkdGg+PXdpZHRoKXsgLy8gY2hlY2tzIGlmIHRleHQgZG9lc250IGZpdCBib3VuZHMKICAgICAgcmV0dXJuIGktMTsgLy8gb3V0cHV0cyBwcmV2aW91cyBpIHNpbmNlIGl0IHByb2JhYmx5IGZpdAogICAgfQogIH0KfQovLyBkcmF3IHRleHQ6CmZ1bmN0aW9uIGRyYXdfdGV4dCh4LCB5LCB0ZXh0LCBzaXplLHdlaWdodCkgewppZih3ZWlnaHQ9PW51bGwpe3dlaWdodD00MDB9CiAgY3R4Lmdsb2JhbEFscGhhID1tYXN0ZXJfYWxwaGE7CmlmKHNpemU9PW51bGwpe3NpemU9MjR9CiAgY3R4LmZvbnQgPSB3ZWlnaHQrIiAiK3NpemUrInB4IEhlbHZldGljYSI7CiAgY3R4LnRleHRBbGlnbiA9ICJsZWZ0IjsKICBjdHgudGV4dEJhc2VsaW5lID0gInRvcCI7CiAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpOwp9CmZ1bmN0aW9uIGRyYXdfY2VudGVyZWRfdGV4dCh4LCB5LCB0ZXh0LCBzaXplLCB3ZWlnaHQpIHsKaWYod2VpZ2h0PT1udWxsKXt3ZWlnaHQ9NDAwfQogIGN0eC5nbG9iYWxBbHBoYSA9bWFzdGVyX2FscGhhOwppZihzaXplPT1udWxsKXtzaXplPTI0fQogIGN0eC5mb250ID0gd2VpZ2h0KyIgIitzaXplKyJweCBIZWx2ZXRpY2EiOwogIGN0eC50ZXh0QWxpZ24gPSAiY2VudGVyIjsKICBjdHgudGV4dEJhc2VsaW5lID0gIm1pZGRsZSI7CiAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpOwp9CmZ1bmN0aW9uIGRyYXdfc2V0X2ltYWdlKGZpbGUpewogIGxldCB0ZW1wID0gbmV3IEltYWdlKCk7CiAgdGVtcC5zcmMgPSBmaWxlOwogIHRlbXAubG9hZGVkPWZhbHNlOwogIHRlbXAub25lcnJvciA9IGZ1bmN0aW9uKCkgewogICAgYWxlcnQoIkVycm9yOiBGYWlsZWQgdG8gbG9hZDogIitmaWxlKTsKICB9Owp0ZW1wLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHt0ZW1wLmxvYWRlZD10cnVlfTsKICByZXR1cm4gdGVtcDsKfQpmdW5jdGlvbiBkcmF3X3N0cmlwKHgseSxzdHJpcCxmcmFtZSx3LGgscm90LG94LG95KXsKaWYgKHc9PW51bGwpe3c9c3RyaXAud2lkdGh9CmlmIChoPT1udWxsKXtoPXN0cmlwLmhlaWdodH0KaWYocm90PT1udWxsKXtyb3Q9MH0KaWYob3g9PW51bGwpe294PTB9CmlmKG95PT1udWxsKXtveT0wfQogIGlmIChzdHJpcC5sb2FkZWQ9PWZhbHNlKSByZXR1cm47CiAgbGV0IGZyYW1lcyA9IHN0cmlwLndpZHRoL3N0cmlwLmhlaWdodAogIGlmKGZyYW1lPj1mcmFtZXMpIGZyYW1lPWZyYW1lcy0xIC8vIGxvY2tzIGl0IGF0IGxhc3QgZnJhbWUgaWYgYXNrZWQgdG8gZHJhdyBtb3JlIGZyYW1lcyB0aGFuIGl0IGhhcwogIGRyYXdfaW1hZ2Uoc3RyaXAseCx5LHcsaCxyb3Qsb3gsb3ksKHN0cmlwLndpZHRoL2ZyYW1lcykqZnJhbWUsMCxzdHJpcC53aWR0aC9mcmFtZXMsc3RyaXAuaGVpZ2h0KQp9CmZ1bmN0aW9uIGRyYXdfaW1hZ2UoaW1nLHgseSx3LGgscm90LG94LG95LHNvdXJjZV94LHNvdXJjZV95LHNvdXJjZV93LHNvdXJjZV9oKXsKaWYodz09bnVsbCl7dz1pbWcud2lkdGh9CmlmKGg9PW51bGwpe2g9aW1nLmhlaWdodH0KaWYoc291cmNlX3g9PW51bGwpe3NvdXJjZV94PTB9CmlmKHNvdXJjZV95PT1udWxsKXtzb3VyY2VfeT0wfQppZihzb3VyY2Vfdz09bnVsbCl7c291cmNlX3c9aW1nLndpZHRofQppZihzb3VyY2VfaD09bnVsbCl7c291cmNlX2g9aW1nLmhlaWdodH0KICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImNhbnZhcyIpOwogIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgiMmQiKTsKICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKICBpZihyb3QhPW51bGwpewogICAgY3R4LnNhdmUoKTsKICAgIC8vY3R4LnRyYW5zbGF0ZSh4K294LHkrb3kpOwogICAgY3R4LnRyYW5zbGF0ZSh4LHkpOwogICAgaWYocm90IT0wKXsKICAgICAgY3R4LnJvdGF0ZShyb3QqTWF0aC5QSS8xODApOy8vdHVfcjJkID0gLTE4MCAvIE1hdGguUEksIHR1X2QyciA9IE1hdGguUEkgLyAtMTgwCiAgICB9CiAgICBjdHguZHJhd0ltYWdlKGltZyxzb3VyY2VfeCwgc291cmNlX3ksIHNvdXJjZV93LCBzb3VyY2VfaCwgLW94LC1veSx3LGgpOwogICAgY3R4LnJlc3RvcmUoKQogIH1lbHNlewogICAgY3R4LmRyYXdJbWFnZShpbWcsIHgsIHksIHcsIGgpOwogIH0KfQovLyBkcmF3IHNoYXBlczoKZnVuY3Rpb24gZHJhd19yZWN0YW5nbGUoeCwgeSwgdywgaCxvdXRsaW5lLHJvdCxveCxveSkgewogIGN0eC5nbG9iYWxBbHBoYSA9bWFzdGVyX2FscGhhOwogIGlmKHJvdCE9bnVsbCl7CiAgICBjdHguc2F2ZSgpOwogICAgY3R4LnRyYW5zbGF0ZSh4LHkpOwogICAgY3R4LnJvdGF0ZShyb3QqTWF0aC5QSS8xODApOwogICAgY3R4LmJlZ2luUGF0aCgpOwogICAgaWYgKG91dGxpbmUpIGN0eC5zdHJva2VSZWN0KCAtb3gsLW95LHcsaCk7CiAgICBlbHNlIGN0eC5maWxsUmVjdCggLW94LC1veSx3LGggKTsKICAgIGN0eC5jbG9zZVBhdGgoKTsKICAgIGN0eC5yZXN0b3JlKCkKICB9ZWxzZXsKICAgIGN0eC5iZWdpblBhdGgoKTsKICAgIGlmIChvdXRsaW5lKSBjdHguc3Ryb2tlUmVjdCggeCx5LHcsaCk7CiAgICBlbHNlIGN0eC5maWxsUmVjdCggeCx5LHcsaCApOwogICAgY3R4LmNsb3NlUGF0aCgpCiAgfQp9CmZ1bmN0aW9uIGRyYXdfY2lyY2xlKHgsIHksIHIsIG91dGxpbmUpIHsKICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKICBjdHguYmVnaW5QYXRoKCk7CiAgY3R4LmFyYyggeCx5LHIsIDAsIHR1XzJwaSwgdHJ1ZSApOwogIGN0eC5jbG9zZVBhdGgoKTsKICAhb3V0bGluZSA/IGN0eC5maWxsKCkgOiBjdHguc3Ryb2tlKCk7Cn0KCmZ1bmN0aW9uIGRyYXdfbGluZSh4MSwgeTEsIHgyLCB5MikgewogIGN0eC5nbG9iYWxBbHBoYSA9bWFzdGVyX2FscGhhOwogIGN0eC5iZWdpblBhdGgoKTsKICBjdHgubW92ZVRvKCB4MSwgeTEpOwogIGN0eC5saW5lVG8oIHgyLCB5Mik7CiAgY3R4LmNsb3NlUGF0aCgpOwogIGN0eC5zdHJva2UoKTsKfQovLyBkcmF3IHNldHRpbmdzOgpmdW5jdGlvbiBkcmF3X3NldF9hbHBoYShfYWxwaGEpIHsKICBtYXN0ZXJfYWxwaGEgPSBfYWxwaGE7Cn0KZnVuY3Rpb24gZHJhd19zZXRfY29sb3IocixnLGIpIHsKICAvLyJyZ2IoMTU1LCAxMDIsIDEwMikiOwogIGN0eC5maWxsU3R5bGUgPSAicmdiKCIrcisiLCIrZysiLCIrYisiKSI7CiAgY3R4LnN0cm9rZVN0eWxlID0gInJnYigiK3IrIiwiK2crIiwiK2IrIikiOwp9CmZ1bmN0aW9uIGRyYXdfc2V0X2xpbmV3aWR0aCh3aWR0aCkgeyBjdHgubGluZVdpZHRoID0gd2lkdGg7IH0KZnVuY3Rpb24gZHJhd19zZXRfbGluZWRhc2goZGFzaCkgeyBjdHguc2V0TGluZURhc2goZGFzaCk7IH0KZnVuY3Rpb24gc2hvd19tb3VzZSgpIHsgY2FudmFzLnN0eWxlLmN1cnNvciA9ICJkZWZhdWx0IjsgfQpmdW5jdGlvbiBoaWRlX21vdXNlKCkgeyBjYW52YXMuc3R5bGUuY3Vyc29yID0gIm5vbmUiOyB9Ci8vIG1pbmltYWwgbWF0aDoKZnVuY3Rpb24gYXZlcmFnZShudW1zKXtsZXQgb3V0cHV0ID0gMDtmb3IobGV0IGkgPSAwOyBpIDwgbnVtcy5sZW5ndGg7IGkrKyl7b3V0cHV0Kz1udW1zW2ldfXJldHVybiBmbG9vcihvdXRwdXQvbnVtcy5sZW5ndGgpfQpmdW5jdGlvbiBhYnMoX3ZhbHVlKSB7IHJldHVybiBfdmFsdWUgPCAwID8gLV92YWx1ZSA6IF92YWx1ZTsgfQpmdW5jdGlvbiBzaWduKF92YWx1ZSkgeyByZXR1cm4gX3ZhbHVlID4gMCA/IDEgOiBfdmFsdWUgPCAwID8gLTEgOiAwOyB9CmZ1bmN0aW9uIGNob29zZSgpIHsgcmV0dXJuIGFyZ3VtZW50c1t+fihNYXRoLnJhbmRvbSgpICogYXJndW1lbnRzLmxlbmd0aCldOyB9CmZ1bmN0aW9uIHJhbmRvbShfdmFsdWUpIHsgcmV0dXJuIE1hdGgucmFuZG9tKCkgKiBfdmFsdWU7IH0KZnVuY3Rpb24gaXJhbmRvbShfdmFsdWUpIHsgcmV0dXJuIH5+KE1hdGgucmFuZG9tKCkgKiBfdmFsdWUgKyAxKTsgfQpmdW5jdGlvbiBmbG9vcihfdmFsdWUpIHsgcmV0dXJuIE1hdGguZmxvb3IoX3ZhbHVlKTsgfQpmdW5jdGlvbiByb3VuZChfdmFsdWUpIHsgcmV0dXJuIE1hdGgucm91bmQoX3ZhbHVlKTsgfQpmdW5jdGlvbiBzbmFwKF92YWx1ZSxncmlkKSAgeyByZXR1cm4gZmxvb3IoX3ZhbHVlL2dyaWQpKmdyaWR9CmZ1bmN0aW9uIGxlcnAoaW5wLHRhcmdldCxyYXRlKXtyZXR1cm4gaW5wKyh0YXJnZXQtaW5wKSpyYXRlO307CmZ1bmN0aW9uIGVhc2VJbihpbnAsdGFyZ2V0LHJhdGUpe2xldCBkaWZmPXRhcmdldC1pbnA7cmV0dXJuIGlucCtkaWZmKihNYXRoLnBvdyhyYXRlLDIpKTt9OwpmdW5jdGlvbiBlYXNlT3V0KGlucCx0YXJnZXQscmF0ZSl7bGV0IGRpZmY9dGFyZ2V0LWlucDtyZXR1cm4gaW5wK2RpZmYqKDEgLU1hdGguZXhwKC1yYXRlKSk7fTsKZnVuY3Rpb24gY2xhbXAodmFsdWUsIG1pbiwgbWF4KSB7cmV0dXJuIE1hdGgubWluKE1hdGgubWF4KHZhbHVlLCBtaW4pLCBtYXgpO30KZnVuY3Rpb24gaW5zaWRlKHB4LCBweSwgcngsIHJ5LCB3aWR0aCwgaGVpZ2h0LCBhbmdsZSwgb3JpZ2luWCwgb3JpZ2luWSkge2NvbnN0IHJhZGlhbnMgPSAoYW5nbGUgKiBNYXRoLlBJKSAvIDE4MDtmdW5jdGlvbiByb3RhdGVQb2ludChjeCwgY3ksIHgsIHksIHJhZGlhbnMpIHtjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWRpYW5zKTtjb25zdCBzaW4gPSBNYXRoLnNpbihyYWRpYW5zKTtjb25zdCBkeCA9IHggLSBjeDtjb25zdCBkeSA9IHkgLSBjeTtyZXR1cm4ge3g6IGN4ICsgZHggKiBjb3MgLSBkeSAqIHNpbix5OiBjeSArIGR4ICogc2luICsgZHkgKiBjb3MsfTt9Y29uc3QgY2VudGVyWCA9IHJ4ICsgb3JpZ2luWDtjb25zdCBjZW50ZXJZID0gcnkgKyBvcmlnaW5ZO2NvbnN0IGNvcm5lcnMgPSBbcm90YXRlUG9pbnQoY2VudGVyWCwgY2VudGVyWSwgcngsIHJ5LCByYWRpYW5zKSxyb3RhdGVQb2ludChjZW50ZXJYLCBjZW50ZXJZLCByeCArIHdpZHRoLCByeSwgcmFkaWFucykscm90YXRlUG9pbnQoY2VudGVyWCwgY2VudGVyWSwgcnggKyB3aWR0aCwgcnkgKyBoZWlnaHQsIHJhZGlhbnMpLHJvdGF0ZVBvaW50KGNlbnRlclgsIGNlbnRlclksIHJ4LCByeSArIGhlaWdodCwgcmFkaWFucyksXTtmdW5jdGlvbiBjcm9zc1Byb2R1Y3QoQSwgQiwgUCkge3JldHVybiAoQi54IC0gQS54KSAqIChQLnkgLSBBLnkpIC0gKEIueSAtIEEueSkgKiAoUC54IC0gQS54KTt9Zm9yIChsZXQgaSA9IDA7IGkgPCBjb3JuZXJzLmxlbmd0aDsgaSsrKSB7Y29uc3QgQSA9IGNvcm5lcnNbaV07Y29uc3QgQiA9IGNvcm5lcnNbKGkgKyAxKSAlIGNvcm5lcnMubGVuZ3RoXTtjb25zdCBjcm9zcyA9IGNyb3NzUHJvZHVjdChBLCBCLCB7IHg6IHB4LCB5OiBweSB9KTtpZiAoY3Jvc3MgPCAwKSB7cmV0dXJuIGZhbHNlO319cmV0dXJuIHRydWU7fQovLyB0cmlnIGZ1bmN0aW9uczoKZnVuY3Rpb24gbGVuZ3RoZGlyX3goX2xlbmd0aCwgX2RpcmVjdGlvbikgeyByZXR1cm4gX2xlbmd0aCAqIE1hdGguY29zKF9kaXJlY3Rpb24gKiB0dV9kMnIpOyB9CmZ1bmN0aW9uIGxlbmd0aGRpcl95KF9sZW5ndGgsIF9kaXJlY3Rpb24pIHsgcmV0dXJuIF9sZW5ndGggKiBNYXRoLnNpbihfZGlyZWN0aW9uICogdHVfZDJyKTsgfQpmdW5jdGlvbiBwb2ludF9kaXN0YW5jZShfeDEsIF95MSwgX3gyLCBfeTIpIHsgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygoIF94MSAtIF94MiksIDIpICsgTWF0aC5wb3coKF95MSAtIF95MiksIDIpKTsgfQpmdW5jdGlvbiBwb2ludF9kaXJlY3Rpb24oX3gxLCBfeTEsIF94MiwgX3kyKSB7IHJldHVybiBNYXRoLmF0YW4yKF95MiAtIF95MSwgX3gyIC0gX3gxKSAqIHR1X3IyZDsgfQpmdW5jdGlvbiBkZWd0b3JhZChfZGVncmVlKSB7IHJldHVybiBfZGVncmVlICogdHVfZDJyOyB9CmZ1bmN0aW9uIHJhZHRvZGVnKF9kZWdyZWUpIHsgcmV0dXJuIF9kZWdyZWUgKiB0dV9yMmQ7IH0KLy8ga2V5Ym9hcmQgZnVuY3Rpb25zOgpmdW5jdGlvbiBrZXlib2FyZF9jaGVjayhfa2V5KSB7IHJldHVybiBrZXlfZG93bltfa2V5XTsgfQpmdW5jdGlvbiBrZXlib2FyZF9jaGVja19wcmVzc2VkKF9rZXkpIHsgcmV0dXJuIGtleV9wcmVzc2VkW19rZXldOyB9CmZ1bmN0aW9uIGtleWJvYXJkX2NoZWNrX3JlbGVhc2VkKF9rZXkpIHsgcmV0dXJuIGtleV9yZWxlYXNlZFtfa2V5XTsgfQovLyBtb3VzZSB0b3VjaCBmdW5jdGlvbnM6CmZ1bmN0aW9uIHN3aXBlZChzZW5zaXRpdnkpewogIGxldCBkaXMgPSBzZW5zaXRpdnk7CiAgbGV0IGRpciA9IDA7CiAgbGV0IHN3aXBlZD1udWxsOwogIGlmICh0eXBlb2Ygc3RhcnRYID09ICJ1bmRlZmluZWQiKSB7CiAgICBsZXQgc3RhcnRYID0gLTEwMDsKICAgIGxldCBzdGFydFk9IC0xMDA7CiAgICBsZXQgZW5kWCA9IC0xMDA7CiAgICBsZXQgZW5kWSA9IC0xMDA7CiAgfTsKICBpZihtb3VzZV9jaGVja19wcmVzc2VkKCkpewogICAgc3RhcnRYID0gbW91c2VfeDsKICAgIHN0YXJ0WSA9IG1vdXNlX3k7CiAgfTsKICBpZihtb3VzZV9jaGVja19yZWxlYXNlZCgpKXsKICAgIHN3aXBlZD0nbm9uZScKICAgIGVuZFggPSBtb3VzZV94OwogICAgZW5kWSA9IG1vdXNlX3k7CiAgICBpZihwb2ludF9kaXN0YW5jZShzdGFydFgsc3RhcnRZLGVuZFgsZW5kWSk+ZGlzKXsKICAgICAgZGlyID0gcG9pbnRfZGlyZWN0aW9uKHN0YXJ0WCxzdGFydFksZW5kWCxlbmRZKTsKICAgIGlmKGRpcj40NSAmJiBkaXI8MTM1KXtzd2lwZWQ9J3VwJ307CiAgICBpZihkaXI8PTQ1ICYmIGRpcj49LTQ1KXtzd2lwZWQ9J3JpZ2h0J307CiAgICBpZihkaXI8LTQ1ICYmIGRpcj4tMTM1KXtzd2lwZWQ9J2Rvd24nfTsKICAgIGlmKGRpcj49MTM1IHx8IGRpcjw9LTEzNSl7c3dpcGVkPSdsZWZ0J307CiAgICB9OwogIH07CiAgcmV0dXJuIHN3aXBlZDsKfTsKCmZ1bmN0aW9uIG1vdXNlX2NoZWNrKCkgeyByZXR1cm4gbW91c2VfZG93bjsgfQpmdW5jdGlvbiBtb3VzZV9jaGVja19wcmVzc2VkKCkgeyByZXR1cm4gbW91c2VfcHJlc3NlZDsgfQpmdW5jdGlvbiBtb3VzZV9jaGVja19yZWxlYXNlZCgpIHsgcmV0dXJuIG1vdXNlX3JlbGVhc2VkOyB9Ci8vc2V0cyB1cCBjYW52YXMgdmFyaWFibGVzCnZhciBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY2FudmFzJyk7CnZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgiMmQiKTsKZnVuY3Rpb24ga0Rvd24oZSl7CiAgaWYoZS5yZXBlYXQpewogICAgcmV0dXJuOwogIH0KICB2a19hbGxfa2V5cy5wdXNoKGUua2V5KQogIHZhciBrZXlDb2RlID0gZS5rZXlDb2RlOwogIGlmICgha2V5X2Rvd25ba2V5Q29kZV0pIHsKICAgIGtleV9wcmVzc2VkW2tleUNvZGVdID0gdHJ1ZTsKICAgIGFsbF9rZXlzX3ByZXNzZWQucHVzaChrZXlDb2RlKTsKICB9CiAga2V5X2Rvd25ba2V5Q29kZV0gPSB0cnVlOwp9CmZ1bmN0aW9uIGtVcChlKXsKICB2YXIga2V5Q29kZSA9IGUua2V5Q29kZTsKICBpZiAoa2V5X2Rvd25ba2V5Q29kZV0pCiAgewogICAga2V5X3JlbGVhc2VkW2tleUNvZGVdID0gdHJ1ZTsKICAgIGFsbF9rZXlzX3JlbGVhc2VkLnB1c2goa2V5Q29kZSk7CiAgfQogIGtleV9kb3duW2tleUNvZGVdID0gZmFsc2U7Cn0KZnVuY3Rpb24gbURvd24oZSl7CiAgaWYoIWlzX3RvdWNoKXsKICAgIGlmKGUuYnV0dG9uID09IDIpIHsKICAgICAgbW91c2VfcmlnaHRfZG93bj10cnVlCiAgICB9ZWxzZXsKICAgICAgaWYgKCFtb3VzZV9kb3duKSB7CiAgICAgICAgbW91c2VfZG93biA9IHRydWU7CiAgICAgICAgbW91c2VfcHJlc3NlZCA9IHRydWU7CiAgICAgIH1lbHNlewogICAgICAgIG1vdXNlX2Rvd24gPSB0cnVlOwogICAgICB9CiAgICB9CiAgfWVsc2V7CiAgICBpZiAoIW1vdXNlX2Rvd24pIHsKICAgICAgbW91c2VfZG93biA9IHRydWU7CiAgICAgIG1vdXNlX3ByZXNzZWQgPSB0cnVlOwogICAgfWVsc2V7CiAgICAgIG1vdXNlX2Rvd24gPSB0cnVlOwogICAgfQogIH0KfQoKZnVuY3Rpb24gbVVwKGUpIHsKICBpZighaXNfdG91Y2gpewogICAgaWYoZS5idXR0b24gPT0gMikgewogICAgICBtb3VzZV9yaWdodF9kb3duPWZhbHNlCiAgICB9ZWxzZXsKICAgICAgaWYgKCFtb3VzZV9kb3duKSB7CiAgICAgICAgbW91c2VfZG93biA9IGZhbHNlOwogICAgICAgIG1vdXNlX3ByZXNzZWQgPSBmYWxzZTsKICAgICAgfSBlbHNlIHsKICAgICAgICBtb3VzZV9kb3duID0gZmFsc2U7CiAgICAgICAgbW91c2VfcmVsZWFzZWQgPSB0cnVlOwogICAgICB9CiAgICB9CiAgfWVsc2V7CiAgICBpZiAoIW1vdXNlX2Rvd24pIHsKICAgICAgbW91c2VfZG93biA9IGZhbHNlOwogICAgICBtb3VzZV9wcmVzc2VkID0gZmFsc2U7CiAgICB9IGVsc2UgewogICAgICBtb3VzZV9kb3duID0gZmFsc2U7CiAgICAgIG1vdXNlX3JlbGVhc2VkID0gdHJ1ZTsKICAgIH0KICB9CiAgaXNfdG91Y2g9ZmFsc2UKfQoKZnVuY3Rpb24gbU1vdmUoZSkgewogIGxldCB4LCB5OwogIAogIC8vIENoZWNrIGZvciB0b3VjaCBpbnB1dAogIGlmIChlLnRvdWNoZXMpIHsKICAgIGlzX3RvdWNoPXRydWUKICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDsKICAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTsKICB9CiAgLy8gT3RoZXJ3aXNlIHVzZSBtb3VzZSBpbnB1dAogIGVsc2UgaWYgKGUucGFnZVggIT0gdW5kZWZpbmVkICYmIGUucGFnZVkgIT0gdW5kZWZpbmVkKSB7CiAgICB4ID0gZS5wYWdlWDsKICAgIHkgPSBlLnBhZ2VZOwogIH0gZWxzZSB7CiAgICB4ID0gZS5jbGllbnRYICsgZG9jdW1lbnQuYm9keS5zY3JvbGxMZWZ0ICsgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQ7CiAgICB5ID0gZS5jbGllbnRZICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3AgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wOwogIH0KICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8KICAvLy9aT09NIENPUlJFQ1RJT04KICAvLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vCiAgdmFyIHJlY3QgPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkKICBsZXQgc2NhbGVYID0gY2FudmFzLndpZHRoIC8gcmVjdC53aWR0aDsKICBsZXQgc2NhbGVZID0gY2FudmFzLmhlaWdodCAvIHJlY3QuaGVpZ2h0OwogIG1vdXNlX3ggPSAoeCAtIGNhbnZhcy5vZmZzZXRMZWZ0KSogc2NhbGVYOwogIG1vdXNlX3kgPSAoeSAtIGNhbnZhcy5vZmZzZXRUb3ApKiBzY2FsZVk7CiAgZS5wcmV2ZW50RGVmYXVsdCgpOyAvLyBQcmV2ZW50IHNjcm9sbGluZyBiZWhhdmlvcgp9CmZ1bmN0aW9uIHRvdWNoU3RhcnQoZSkgewogIGlzX3RvdWNoPXRydWUKICBtTW92ZShlKTsKICBtRG93bigpOwp9CgpmdW5jdGlvbiB0b3VjaEVuZChlKSB7CiAgaXNfdG91Y2g9dHJ1ZQogIG1VcCgpOwp9CmFkZEV2ZW50TGlzdGVuZXIoImtleWRvd24iLCBrRG93biwgZmFsc2UpOy8vMTYgaXMgc2hpZnQgZS5rZXlDb2RlOwphZGRFdmVudExpc3RlbmVyKCJrZXl1cCIsIGtVcCwgZmFsc2UpOwphZGRFdmVudExpc3RlbmVyKCJtb3VzZWRvd24iLG1Eb3duLGZhbHNlKTsKYWRkRXZlbnRMaXN0ZW5lcigibW91c2V1cCIsbVVwLGZhbHNlKTsKYWRkRXZlbnRMaXN0ZW5lcigibW91c2Vtb3ZlIixtTW92ZSxmYWxzZSk7CmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgd2hlZWwsZmFsc2UpOwovLyBBZGQgdG91Y2ggZXZlbnQgbGlzdGVuZXJzIHdpdGggeyBwYXNzaXZlOiBmYWxzZSB9CmFkZEV2ZW50TGlzdGVuZXIoInRvdWNoc3RhcnQiLCB0b3VjaFN0YXJ0LCB7IHBhc3NpdmU6IGZhbHNlIH0pOwphZGRFdmVudExpc3RlbmVyKCJ0b3VjaGVuZCIsIHRvdWNoRW5kLCB7IHBhc3NpdmU6IGZhbHNlIH0pOwphZGRFdmVudExpc3RlbmVyKCJ0b3VjaG1vdmUiLCBtTW92ZSwgeyBwYXNzaXZlOiBmYWxzZSB9KTsKYWRkRXZlbnRMaXN0ZW5lcignY29udGV4dG1lbnUnLCBmdW5jdGlvbihldmVudCkgewogIC8vIFByZXZlbnQgdGhlIGRlZmF1bHQgY29udGV4dCBtZW51IGZyb20gYXBwZWFyaW5nCiAgZXZlbnQucHJldmVudERlZmF1bHQoKTsKICAKfSk7CmZ1bmN0aW9uIHdoZWVsKGUpIHsKICBpZiAoZS5kZWx0YVkgPCAwKSB7CiAgICB3aGVlbERpcisrOwogIH0gZWxzZSB7CiAgICB3aGVlbERpci0tOwogIH0KfTsKLy8gVGhlIG1haW4gZ2FtZSBsb29wCmZ1bmN0aW9uIG1haW4oKSB7CiAgdmFyIG5vdyA9IERhdGUubm93KCk7CiAgdmFyIGRlbHRhID0gbm93IC0gdGhlbjsKICB0aW1lU2hpZnQgPSBkZWx0YSAvIDEwMDAKICBGUFMucHVzaChNYXRoLmZsb29yKDEvdGltZVNoaWZ0KSk7CiAgaWYoRlBTLmxlbmd0aD4xMCl7CiAgICBmcHMgPSBhdmVyYWdlKEZQUyk7CiAgICBGUFMgPSBbXTsKICB9CiAgaWYocnVuKXsKICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTsKICAgIGRyYXcoKTsKICB9CiAgbG9vcCgpOwogIAogIC8vY2xlYXJzIGtleXByZXNzZXMgYW5kIG1vdXNlcHJlc3MKICBmb3IgKGxldCBfayA9IDA7IF9rIDwgYWxsX2tleXNfcHJlc3NlZC5sZW5ndGg7IF9rKyspIGtleV9wcmVzc2VkW2FsbF9rZXlzX3ByZXNzZWRbX2tdXSA9IGZhbHNlOwogIGZvciAobGV0IF9rID0gMDsgX2sgPCBhbGxfa2V5c19yZWxlYXNlZC5sZW5ndGg7IF9rKyspIGtleV9yZWxlYXNlZFthbGxfa2V5c19yZWxlYXNlZFtfa11dID0gZmFsc2U7CiAgYWxsX2tleXNfcHJlc3NlZCA9IFtdOyBhbGxfa2V5c19yZWxlYXNlZCA9IFtdO21vdXNlX3ByZXNzZWQgPSBmYWxzZTttb3VzZV9yZWxlYXNlZCA9IGZhbHNlOwogIAogIHRoZW4gPSBub3c7CiAgLy8gUmVxdWVzdCB0byBkbyB0aGlzIGFnYWluIEFTQVAKICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbik7Cn07Ci8vIENyb3NzLWJyb3dzZXIgc3VwcG9ydCBmb3IgcmVxdWVzdEFuaW1hdGlvbkZyYW1lCnZhciB3ID0gd2luZG93OwpyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHcubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lOwovLyBMZXQncyBwbGF5IHRoaXMgZ2FtZSEKdmFyIHRoZW4gPSBEYXRlLm5vdygpOwpzdGFydCgpOwptYWluKCk7Cg=='></script>
</b`+`ody>
</ht`+`ml>
`
