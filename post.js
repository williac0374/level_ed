post_game = `
// zzfx() - the universal entry point -- returns a AudioBufferSourceNode
zzfx=(...t)=>zzfxP(zzfxG(...t))

// zzfxP() - the sound player -- returns a AudioBufferSourceNode
zzfxP=(...t)=>{let e=zzfxX.createBufferSource(),f=zzfxX.createBuffer(t.length,t[0].length,zzfxR);t.map((d,i)=>f.getChannelData(i).set(d)),e.buffer=f,e.connect(zzfxX.destination),e.start();return e}

// zzfxG() - the sound generator -- returns an array of sample data
zzfxG=(q=1,k=.05,c=220,e=0,t=0,u=.1,r=0,F=1,v=0,z=0,w=0,A=0,l=0,B=0,x=0,G=0,d=0,y=1,m=0,C=0)=>{let b=2*Math.PI,H=v*=500*b/zzfxR**2,I=(0<x?1:-1)*b/4,D=c*=(1+2*k*Math.random()-k)*b/zzfxR,Z=[],g=0,E=0,a=0,n=1,J=0,K=0,f=0,p,h;e=99+zzfxR*e;m*=zzfxR;t*=zzfxR;u*=zzfxR;d*=zzfxR;z*=500*b/zzfxR**3;x*=b/zzfxR;w*=b/zzfxR;A*=zzfxR;l=zzfxR*l|0;for(h=e+m+t+u+d|0;a<h;Z[a++]=f)++K%(100*G|0)||(f=r?1<r?2<r?3<r?Math.sin((g%b)**3):Math.max(Math.min(Math.tan(g),1),-1):1-(2*g/b%2+2)%2:1-4*Math.abs(Math.round(g/b)-g/b):Math.sin(g),f=(l?1-C+C*Math.sin(2*Math.PI*a/l):1)*(0<f?1:-1)*Math.abs(f)**F*q*zzfxV*(a<e?a/e:a<e+m?1-(a-e)/m*(1-y):a<e+m+t?y:a<h-d?(h-a-d)/u*y:0),f=d?f/2+(d>a?0:(a<h-d?1:(h-a)/d)*Z[a-d|0]/2):f),p=(c+=v+=z)*Math.sin(E*x-I),g+=p-p*B*(1-1E9*(Math.sin(a)+1)%2),E+=p-p*B*(1-1E9*(Math.sin(a)**2+1)%2),n&&++n>A&&(c+=w,D+=w,n=0),!l||++J%l||(c=D,v=H,n=n||1);return Z}

// zzfxV - global volume
zzfxV=.3

// zzfxR - global sample rate
zzfxR=44100

// zzfxX - the common audio context
zzfxX=new(window.AudioContext||webkitAudioContext);


//! ZzFXM (v2.0.3) | (C) Keith Clark | MIT | https://github.com/keithclark/ZzFXM
zzfxM=(n,f,t,e=125)=>{let l,o,z,r,g,h,x,a,u,c,d,i,m,p,G,M=0,R=[],b=[],j=[],k=0,q=0,s=1,v={},w=zzfxR/e*60>>2;for(;s;k++)R=[s=a=d=m=0],t.map((e,d)=>{for(x=f[e][k]||[0,0,0],s|=!!f[e][k],G=m+(f[e][0].length-2-!a)*w,p=d==t.length-1,o=2,r=m;o<x.length+p;a=++o){for(g=x[o],u=o==x.length+p-1&&p||c!=(x[0]||0)|g|0,z=0;z<w&&a;z++>w-99&&u?i+=(i<1)/99:0)h=(1-i)*R[M++]/2||0,b[r]=(b[r]||0)-h*q+h,j[r]=(j[r++]||0)+h*q+h;g&&(i=g%1,q=x[1]||0,(g|=0)&&(R=v[[c=x[M=0]||0,g]]=v[[c,g]]||(l=[...n[c]],l[2]*=2**((g-12)/12),g>0?zzfxG(...l):[])))}m=G});return[b,j]}

function bpmTimer(initialBpm, callback) {let bpm = initialBpm;let interval = 60000 / bpm;let nextTime = performance.now();let isRunning = true;function loop() {if (!isRunning) return;const now = performance.now();if (now >= nextTime) {callback();nextTime += interval;}if (nextTime < now) {nextTime = now + interval;}setTimeout(loop, nextTime - now);}function setBpm(newBpm) {bpm = newBpm;interval = 60000 / bpm;}function start() {isRunning = false;loop()}function stop() {isRunning = false;}loop();return { setBpm, start, stop };}


canvas.width=0;
canvas.height=0;
tileset = ''
tiles = [];
tiles2 = [];;
objects = [];
mapW = 0;
mapH = 0;
gridSize = 0;
viewport = {}
function load_map(m){
  tileset = draw_set_image(m.tileSet)
  tiles = m.tiles;
  tiles2 = m.tiles2;
  objects = m.objects
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
      if (tiles[y] && tiles[y][x] != -1) {
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
      if (tiles2[y] && tiles2[y][x] != -1) {
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
    if (me.firstRun == true) {
      me.firstRun = false;
      eval(me.startCode);
    }
    eval(me.loopCode);
    if (me.tId != 0) {
      draw_image(tileset, x, y, w, h, rot, ox, oy, sx, sy, gridSize, gridSize);
    } else {
      eval(me.drawCode);
    }
	if(objects[i].kill==true){
	   objects.splice(i,1);
	}

  }
}

function hit(me,other){
  
  if(other!=null && point_distance(me.x,me.y,other.x,other.y)<32){
    return true
  }else{
    return false
  }
}
function place_free(passableIDs, x, y, w, h, map) {
  const hits = getOverlappingTiles(x, y, w, h, map, gridSize);
  
  // Ensure passableIDs is an array
  const passable = Array.isArray(passableIDs) ? passableIDs : [passableIDs];
  
  // Return true if all tiles in hits are in passableIDs
  return hits.every(tile => passable.includes(tile));
}


function getOverlappingTiles(x, y, w, h, map, tileSize) {
  const overlappingTiles = [];
  
  // Calculate the bounding box in terms of tile indices
  const leftTile = Math.floor(x / tileSize);
  const rightTile = Math.floor((x + w) / tileSize);
  const topTile = Math.floor(y / tileSize);
  const bottomTile = Math.floor((y + h) / tileSize);
  
  // Loop through each tile in the bounding box
  for (let row = topTile; row <= bottomTile; row++) {
    for (let col = leftTile; col <= rightTile; col++) {
      // Check if the tile is within map bounds
      if (row >= 0 && row < map.length && col >= 0 && col < map[row].length) {
        overlappingTiles.push(map[row][col]);
      }
    }
  }
  
  return overlappingTiles;
}
function text_fit(text,width){
  for(let i = 6; i<120; i++){// statilesRect.spritert way small
    ctx.font = i+'px Arial'; // set font for testing
    if(ctx.measureText(text).width>=width){ // checks if text doesnt fit bounds
      return i-1; // outputs previous i since it probably fit
    }
  }
}
function drawTile(tId,x,y,w,h){
if(w==null){w=gridSize}
if(h==null){h=gridSize}
        x-= viewport.x;
        y-= viewport.y;
  let sx = tId % columns * gridSize;
  let sy = Math.floor(tId / columns) * gridSize;
  draw_image(tileset,x,y,w,h,0,0,0,sx,sy,gridSize, gridSize
  );
}
function lerp(inp, target, rate) {
  return inp + (target - inp) * rate;
};
function easeIn(inp, target, rate) {
  let diff = target - inp;
  return inp + diff * (Math.pow(rate, 2));
};
function easeOut(inp, target, rate) {
  let diff = target - inp;
  return inp + diff * (1 - Math.exp(-rate));
};
function view_follow(ob,margin,intensity){
   if(ob.x>viewport.x+viewport.w*(1-margin)){
    viewport.x=easeIn(viewport.x, ob.x-viewport.w*(1-margin), intensity)
  }
  if(ob.x<viewport.x+viewport.w*margin){
    viewport.x=easeIn(viewport.x, ob.x-viewport.w*margin, intensity)
  }
  if(ob.y>viewport.y+viewport.h*(1-margin)){
    
    viewport.y=easeIn(viewport.y, ob.y-viewport.h*(1-margin),intensity)
  }
  if(ob.y<viewport.y+viewport.h*margin){
    viewport.y=easeIn(viewport.y, ob.y-viewport.h*margin, intensity)
  }
  // keeps camera inside level
  viewport.x = round(clamp(viewport.x, 0, mapW*gridSize-viewport.w))
  viewport.y = round(clamp(viewport.y, 0, mapH*gridSize-viewport.h))
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
function snap(inp,grid){
	return floor(inp/grid)*grid
}
function ob(name){
  var obj = null;
  for (let i = objects.length - 1; i >= 0; i--) {
    if(objects[i].name===name){
      obj=objects[i]
    }
  }
  return obj
}
function once(name,code){
  var object = null;
  for (let i = objects.length - 1; i >= 0; i--) {
    if(objects[i].name===name){
      object = objects[i]
    }
  }
  if(object!=null){
    object.onceCode=code
  }else{
    alert('theres no object named :'+name)
  }
  
  
}
function get_cell(inp){
  return round(inp/gridSize);
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
<script type='text/javascript' src='data:text/javascript;base64,Ly9taXNjCm1hc3Rlcl9hbHBoYSA9IDE7dGltZVNoaWZ0PTAsRlBTPVtdLGZwcz0wLHJ1bj10cnVlLGZ1bGxzY3JlZW49ZmFsc2U7Ci8vIG1hdGg6Cm1heCA9IE1hdGgubWF4LCBtaW4gPSBNYXRoLm1pbiwgcm91bmQgPSBNYXRoLnJvdW5kLCBmbG9vciA9IE1hdGguZmxvb3IsIGNlaWwgPSBNYXRoLmNlaWwsCnNpbiA9IE1hdGguc2luLCBjb3MgPSBNYXRoLmNvcywgc3FydCA9IE1hdGguc3FydCwgdGFuID0gTWF0aC50YW4sIHJhbmQgPSBNYXRoLnJhbmRvbSwKYXJjY29zID0gTWF0aC5hY29zLCBhcmNzaW4gPSBNYXRoLmFzaW4sIGFyY3RhbiA9IE1hdGguYXRhbiwgYXJjdGFuMiA9IE1hdGguYXRhbjIsCnR1X3IyZCA9IC0xODAgLyBNYXRoLlBJLCB0dV9kMnIgPSBNYXRoLlBJIC8gLTE4MCwgdHVfMnBpID0gTWF0aC5QSSAqIDIsCi8vIGkvbyBjb25zdGFudHM6CnZrXzAgPSA0OCwgdmtfMSA9IDQ5LCB2a18yID0gNTAsIHZrXzMgPSA1MSwgdmtfNCA9IDUyLCB2a181ID0gNTMsIHZrXzYgPSA1NCwKdmtfNyA9IDU1LCB2a184ID0gNTYsIHZrXzkgPSA1NywgdmtfYSA9IDY1LCB2a19hZGQgPSAxMDcsIHZrX2FsdCA9IDE4LCB2a19iID0gNjYsCnZrX2JhY2tzcGFjZSA9IDgsIHZrX2MgPSA2NywgdmtfY3RybCA9IDE3LCB2a19kID0gNjgsIHZrX2RlY2ltYWwgPSAxMTAsIHZrX2RlbGV0ZSA9IDQ2LAp2a19kaXZpZGUgPSAxMTEsIHZrX2Rvd24gPSA0MCwgdmtfZSA9IDY5LCB2a19lbmQgPSAzNSwgdmtfZW50ZXIgPSAxMywgdmtfZXNjYXBlID0gMjcsCnZrX2YxID0gMTEyLCB2a19mMiA9IDExMywgdmtfZjMgPSAxMTQsIHZrX2Y0ID0gMTE1LCB2a19mNSA9IDExNiwgdmtfZjYgPSAxMTcsCnZrX2Y3ID0gMTE4LCB2a19mOCA9IDExOSwgdmtfZjkgPSAxMjAsIHZrX2YxMCA9IDEyMSwgdmtfZjExID0gMTIyLCB2a19mMTIgPSAxMjMsCnZrX2cgPSA3MSwgdmtfaCA9IDcyLCB2a19ob21lID0gMzYsIHZrX2YgPSA3MCwgdmtfaSA9IDczLCB2a19pbnNlcnQgPSA0NSwgdmtfaiA9IDc0LCB2a19rID0gNzUsCnZrX2wgPSA3NiwgdmtfbGVmdCA9IDM3LCB2a19tID0gNzcsIHZrX211bHRpcGx5ID0gMTA2LCB2a19uID0gNzgsIHZrX251bTAgPSA5NiwgdmtfbnVtMSA9IDk3LAp2a19udW0yID0gOTgsIHZrX251bTMgPSA5OSwgdmtfbnVtNCA9IDEwMCwgdmtfbnVtNSA9IDEwMSwgdmtfbnVtNiA9IDEwMiwgdmtfbnVtNyA9IDEwMywKdmtfbnVtOCA9IDEwNCwgdmtfbnVtOSA9IDEwNSwgdmtfbyA9IDc5LCB2a19wID0gODAsIHZrX3BhZ2Vkb3duID0gMzQsIHZrX3BhZ2V1cCA9IDMzLAp2a19wYXVzZSA9IDE5LCB2a19xID0gODEsIHZrX3IgPSA4MiwgdmtfcmlnaHQgPSAzOSwgdmtfcyA9IDgzLCB2a19zaGlmdCA9IDE2LCB2a19zcGFjZSA9IDMyLAp2a19zdWJ0cmFjdCA9IDEwOSwgdmtfdCA9IDg0LCB2a190YWIgPSA5LCB2a191ID0gODUsIHZrX3VwID0gMzgsIHZrX3YgPSA4NiwgdmtfdyA9IDg3LAp2a194ID0gODgsIHZrX3kgPSA4OSwgdmtfeiA9IDkwLAovLyBpL28gdmFyaWFibGVzOgptb3VzZV94ID0gbW91c2VfeSA9IDAsIG1vdXNlX2Rvd24gPSBtb3VzZV9wcmVzc2VkID0gbW91c2VfcmVsZWFzZWQgPSBmYWxzZSx3aGVlbERpcj0wLAprZXlfZG93biA9IFtdLCBrZXlfcHJlc3NlZCA9IFtdLCBrZXlfcmVsZWFzZWQgPSBbXSxhbGxfa2V5c19wcmVzc2VkID0gW10sYWxsX2tleXNfcmVsZWFzZWQgPSBbXTsKdmtfYWxsX2tleXMgPSBbXTsKZnVuY3Rpb24gbWFrZV9zb3VuZChfc3JjLGJ1ZmZlcnMpewogIGlmIChfc3JjICE9ICcnKSB7CiAgICBsZXQgdGVtcCA9IFtdOwogICAgZm9yKGxldCBpID0gMDsgaSA8IGJ1ZmZlcnM7IGkrKyApewogICAgICB0ZW1wW2ldID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYXVkaW8nKTsKICAgICAgdGVtcFtpXS5zZXRBdHRyaWJ1dGUoJ3NyYycsIF9zcmMpOwogICAgICAgIHRlbXBbaV0ub25lcnJvciA9IGZ1bmN0aW9uKCkgewogICAgYWxlcnQoIkVycm9yOiBGYWlsZWQgdG8gbG9hZDogIitfc3JjKTsKfTsKICAgIH0KICAgIHJldHVybiB0ZW1wOwogIH0KfQpmdW5jdGlvbiBwbGF5KHNvdW5kKXsKICAvLy5kdXJhdGlvbiA+IDAgJiYgISAucGF1c2VkIG1lYW5zIGl0cyBwbGF5aW5nCiAgZm9yKGxldCBpID0gMCA7IGkgPCBzb3VuZC5sZW5ndGggOyBpKyspewogICAgaWYoc291bmRbaV0uZHVyYXRpb24gPiAwICYmICFzb3VuZFtpXS5wYXVzZWQpewogICAgfWVsc2V7CiAgICAgIHNvdW5kW2ldLmN1cnJlbnRUaW1lID0gMDsKICAgICAgc291bmRbaV0ucGxheSgpCiAgICAgIGk9MTAwMDsKICAgIH0KICB9Cn0KLy9yZXF1ZXN0IGZ1bGwgc2NyZWVuCmZ1bmN0aW9uIHJlcXVlc3RGdWxsc2NyZWVuKGVsZW1lbnQpIHtpZiAoIWVsZW1lbnQpIHtlbGVtZW50ID0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O31pZiAoZWxlbWVudC5yZXF1ZXN0RnVsbHNjcmVlbikge2VsZW1lbnQucmVxdWVzdEZ1bGxzY3JlZW4oKTt9IGVsc2UgaWYgKGVsZW1lbnQud2Via2l0UmVxdWVzdEZ1bGxzY3JlZW4pIHtlbGVtZW50LndlYmtpdFJlcXVlc3RGdWxsc2NyZWVuKCk7fSBlbHNlIGlmIChlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4pIHtlbGVtZW50Lm1zUmVxdWVzdEZ1bGxzY3JlZW4oKTt9IGVsc2UgaWYgKGVsZW1lbnQubW96UmVxdWVzdEZ1bGxTY3JlZW4pIHtlbGVtZW50Lm1velJlcXVlc3RGdWxsU2NyZWVuKCk7fSBlbHNlIHtjb25zb2xlLmVycm9yKCJGdWxsc2NyZWVuIEFQSSBpcyBub3Qgc3VwcG9ydGVkIG9uIHRoaXMgYnJvd3Nlci4iKTt9fQovLyBkZXRlY3RzIGZ1bGxzY3JlZW4gY2hhbmdlCmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2Z1bGxzY3JlZW5jaGFuZ2UnLCBmdW5jdGlvbigpIHsKICBpZiAoZG9jdW1lbnQuZnVsbHNjcmVlbkVsZW1lbnQpIHsKICAgIGZ1bGxzY3JlZW49dHJ1ZTsKICB9IGVsc2UgewogICAgZnVsbHNjcmVlbj1mYWxzZTsKICB9CiAgCn0pOwpmdW5jdGlvbiBkcmF3V3JhcHBlZFRleHQodGV4dCwgeCwgeSwgbWF4V2lkdGgsIGxpbmVIZWlnaHQsZm9udFNpemUsIHdlaWdodCl7CiAgY29uc3Qgd29yZHMgPSB0ZXh0LnNwbGl0KCcgJyk7CiAgbGV0IGxpbmUgPSAnJzsKICBsZXQgY3VycmVudFkgPSB5OwogIC8vIFNldCBmb250IGFuZCB0ZXh0IHN0eWxlCiAgaWYod2VpZ2h0PT1udWxsKXt3ZWlnaHQ9NDAwfQogIGN0eC5mb250ID0gd2VpZ2h0KyIgIitmb250U2l6ZSsicHggSGVsdmV0aWNhIjsKICBmb3IgKGxldCB3b3JkIG9mIHdvcmRzKSB7CiAgICBjb25zdCB0ZXN0TGluZSA9IGxpbmUgKyAobGluZSA/ICcgJyA6ICcnKSArIHdvcmQ7CiAgICBjb25zdCB0ZXN0V2lkdGggPSBjdHgubWVhc3VyZVRleHQodGVzdExpbmUpLndpZHRoOwogICAgCiAgICBpZiAodGVzdFdpZHRoID4gbWF4V2lkdGggJiYgbGluZSkgewogICAgICAvLyBEcmF3IHRoZSBjdXJyZW50IGxpbmUgaWYgaXQgZXhjZWVkcyBtYXhXaWR0aAogICAgICBjdHguZmlsbFRleHQobGluZSwgeCwgY3VycmVudFkpOwogICAgICBsaW5lID0gd29yZDsgLy8gU3RhcnQgYSBuZXcgbGluZSB3aXRoIHRoZSBjdXJyZW50IHdvcmQKICAgICAgY3VycmVudFkgKz0gbGluZUhlaWdodDsKICAgIH0gZWxzZSB7CiAgICAgIGxpbmUgPSB0ZXN0TGluZTsgLy8gQWRkIHRoZSB3b3JkIHRvIHRoZSBjdXJyZW50IGxpbmUKICAgIH0KICB9CiAgCiAgLy8gRHJhdyB0aGUgbGFzdCBsaW5lCiAgaWYgKGxpbmUpIHsKICAgIGN0eC5maWxsVGV4dChsaW5lLCB4LCBjdXJyZW50WSk7CiAgfQp9CmZ1bmN0aW9uIHRleHRfZml0KHRleHQsd2lkdGgpewogIGZvcihsZXQgaSA9IDY7IGk8MTIwOyBpKyspey8vIHN0YXRpbGVzUmVjdC5zcHJpdGVydCB3YXkgc21hbGwKICAgIGN0eC5mb250ID0gaSsncHggQXJpYWwnOyAvLyBzZXQgZm9udCBmb3IgdGVzdGluZwogICAgaWYoY3R4Lm1lYXN1cmVUZXh0KHRleHQpLndpZHRoPj13aWR0aCl7IC8vIGNoZWNrcyBpZiB0ZXh0IGRvZXNudCBmaXQgYm91bmRzCiAgICAgIHJldHVybiBpLTE7IC8vIG91dHB1dHMgcHJldmlvdXMgaSBzaW5jZSBpdCBwcm9iYWJseSBmaXQKICAgIH0KICB9Cn0KLy8gZHJhdyB0ZXh0OgpmdW5jdGlvbiBkcmF3X3RleHQoeCwgeSwgdGV4dCwgc2l6ZSx3ZWlnaHQpIHsKICBpZih3ZWlnaHQ9PW51bGwpe3dlaWdodD00MDB9CiAgY3R4Lmdsb2JhbEFscGhhID1tYXN0ZXJfYWxwaGE7CmlmKHNpemU9PW51bGwpe3NpemU9MjR9CiAgY3R4LmZvbnQgPSB3ZWlnaHQrIiAiK3NpemUrInB4IEhlbHZldGljYSI7CiAgY3R4LnRleHRBbGlnbiA9ICJsZWZ0IjsKICBjdHgudGV4dEJhc2VsaW5lID0gInRvcCI7CiAgY3R4LmZpbGxUZXh0KHRleHQsIHgsIHkpOwp9CmZ1bmN0aW9uIGRyYXdfY2VudGVyZWRfdGV4dCh4LCB5LCB0ZXh0LCBzaXplLCB3ZWlnaHQpIHsKICBpZih3ZWlnaHQ9PW51bGwpe3dlaWdodD00MDB9CiAgY3R4Lmdsb2JhbEFscGhhID1tYXN0ZXJfYWxwaGE7CmlmKHNpemU9PW51bGwpe3NpemU9MjR9CiAgY3R4LmZvbnQgPSB3ZWlnaHQrIiAiK3NpemUrInB4IEhlbHZldGljYSI7CiAgY3R4LnRleHRBbGlnbiA9ICJjZW50ZXIiOwogIGN0eC50ZXh0QmFzZWxpbmUgPSAibWlkZGxlIjsKICBjdHguZmlsbFRleHQodGV4dCwgeCwgeSk7Cn0KZnVuY3Rpb24gZHJhd19zZXRfaW1hZ2UoZmlsZSl7CiAgbGV0IHRlbXAgPSBuZXcgSW1hZ2UoKTsKICB0ZW1wLnNyYyA9IGZpbGU7CiAgdGVtcC5sb2FkZWQ9ZmFsc2U7CiAgdGVtcC5vbmVycm9yID0gZnVuY3Rpb24oKSB7CiAgICBhbGVydCgiRXJyb3I6IEZhaWxlZCB0byBsb2FkOiAiK2ZpbGUpOwp9Owp0ZW1wLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHt0ZW1wLmxvYWRlZD10cnVlfTsKICByZXR1cm4gdGVtcDsKfQpmdW5jdGlvbiBkcmF3X3N0cmlwKHgseSxzdHJpcCxmcmFtZSx3LGgscm90LG94LG95KXsKaWYgKHc9PW51bGwpe3c9c3RyaXAud2lkdGh9CmlmIChoPT1udWxsKXtoPXN0cmlwLmhlaWdodH0KaWYocm90PT1udWxsKXtyb3Q9MH0KaWYob3g9PW51bGwpe294PTB9CmlmKG95PT1udWxsKXtveT0wfQogIGlmIChzdHJpcC5sb2FkZWQ9PWZhbHNlKSByZXR1cm47CiAgbGV0IGZyYW1lcyA9IHN0cmlwLndpZHRoL3N0cmlwLmhlaWdodAogIGlmKGZyYW1lPj1mcmFtZXMpIGZyYW1lPWZyYW1lcy0xIC8vIGxvY2tzIGl0IGF0IGxhc3QgZnJhbWUgaWYgYXNrZWQgdG8gZHJhdyBtb3JlIGZyYW1lcyB0aGFuIGl0IGhhcwogIGRyYXdfaW1hZ2Uoc3RyaXAseCx5LHcsaCxyb3Qsb3gsb3ksKHN0cmlwLndpZHRoL2ZyYW1lcykqZnJhbWUsMCxzdHJpcC53aWR0aC9mcmFtZXMsc3RyaXAuaGVpZ2h0KQp9CmZ1bmN0aW9uIGRyYXdfaW1hZ2UoaW1nLHgseSx3LGgscm90LG94LG95LHNvdXJjZV94LHNvdXJjZV95LHNvdXJjZV93LHNvdXJjZV9oKXsKaWYodz09bnVsbCl7dz1pbWcud2lkdGh9CmlmKGg9PW51bGwpe2g9aW1nLmhlaWdodH0KaWYoc291cmNlX3g9PW51bGwpe3NvdXJjZV94PTB9CmlmKHNvdXJjZV95PT1udWxsKXtzb3VyY2VfeT0wfQppZihzb3VyY2Vfdz09bnVsbCl7c291cmNlX3c9aW1nLndpZHRofQppZihzb3VyY2VfaD09bnVsbCl7c291cmNlX2g9aW1nLmhlaWdodH0KICB2YXIgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoImNhbnZhcyIpOwogIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgiMmQiKTsKICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKICBpZihyb3QhPW51bGwpewogICAgY3R4LnNhdmUoKTsKICAgIC8vY3R4LnRyYW5zbGF0ZSh4K294LHkrb3kpOwogICAgY3R4LnRyYW5zbGF0ZSh4LHkpOwogICAgaWYocm90IT0wKXsKICAgIGN0eC5yb3RhdGUocm90Kk1hdGguUEkvMTgwKTsvL3R1X3IyZCA9IC0xODAgLyBNYXRoLlBJLCB0dV9kMnIgPSBNYXRoLlBJIC8gLTE4MAogICAgfQogICAgY3R4LmRyYXdJbWFnZShpbWcsc291cmNlX3gsIHNvdXJjZV95LCBzb3VyY2Vfdywgc291cmNlX2gsIC1veCwtb3ksdyxoKTsKICAgIGN0eC5yZXN0b3JlKCkKICB9ZWxzZXsKICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCB4LCB5LCB3LCBoKTsKICB9Cn0KLy8gZHJhdyBzaGFwZXM6CmZ1bmN0aW9uIGRyYXdfcmVjdGFuZ2xlKHgsIHksIHcsIGgsb3V0bGluZSxyb3Qsb3gsb3kpIHsKICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKICBpZihyb3QhPW51bGwpewogICAgY3R4LnNhdmUoKTsKICAgIGN0eC50cmFuc2xhdGUoeCx5KTsKICAgIGN0eC5yb3RhdGUocm90Kk1hdGguUEkvMTgwKTsKICAgIGN0eC5iZWdpblBhdGgoKTsKICAgIGlmIChvdXRsaW5lKSBjdHguc3Ryb2tlUmVjdCggLW94LC1veSx3LGgpOwogICAgZWxzZSBjdHguZmlsbFJlY3QoIC1veCwtb3ksdyxoICk7CiAgICBjdHguY2xvc2VQYXRoKCk7CiAgICBjdHgucmVzdG9yZSgpCiAgfWVsc2V7CiAgICBjdHguYmVnaW5QYXRoKCk7CiAgICBpZiAob3V0bGluZSkgY3R4LnN0cm9rZVJlY3QoIHgseSx3LGgpOwogICAgZWxzZSBjdHguZmlsbFJlY3QoIHgseSx3LGggKTsKICAgIGN0eC5jbG9zZVBhdGgoKQogIH0KfQpmdW5jdGlvbiBkcmF3X2NpcmNsZSh4LCB5LCByLCBvdXRsaW5lKSB7CiAgY3R4Lmdsb2JhbEFscGhhID1tYXN0ZXJfYWxwaGE7CiAgY3R4LmJlZ2luUGF0aCgpOwogIGN0eC5hcmMoIHgseSxyLCAwLCB0dV8ycGksIHRydWUgKTsKICBjdHguY2xvc2VQYXRoKCk7CiAgIW91dGxpbmUgPyBjdHguZmlsbCgpIDogY3R4LnN0cm9rZSgpOwp9CgpmdW5jdGlvbiBkcmF3X2xpbmUoeDEsIHkxLCB4MiwgeTIpIHsKICBjdHguZ2xvYmFsQWxwaGEgPW1hc3Rlcl9hbHBoYTsKICBjdHguYmVnaW5QYXRoKCk7CiAgY3R4Lm1vdmVUbyggeDEsIHkxKTsKICBjdHgubGluZVRvKCB4MiwgeTIpOwogIGN0eC5jbG9zZVBhdGgoKTsKICBjdHguc3Ryb2tlKCk7Cn0KLy8gZHJhdyBzZXR0aW5nczoKZnVuY3Rpb24gZHJhd19zZXRfYWxwaGEoX2FscGhhKSB7CiAgbWFzdGVyX2FscGhhID0gX2FscGhhOwp9CmZ1bmN0aW9uIGRyYXdfc2V0X2NvbG9yKHIsZyxiKSB7CiAgLy8icmdiKDE1NSwgMTAyLCAxMDIpIjsKICBjdHguZmlsbFN0eWxlID0gInJnYigiK3IrIiwiK2crIiwiK2IrIikiOwogIGN0eC5zdHJva2VTdHlsZSA9ICJyZ2IoIityKyIsIitnKyIsIitiKyIpIjsKfQpmdW5jdGlvbiBkcmF3X3NldF9saW5ld2lkdGgod2lkdGgpIHsgY3R4LmxpbmVXaWR0aCA9IHdpZHRoOyB9CmZ1bmN0aW9uIGRyYXdfc2V0X2xpbmVkYXNoKGRhc2gpIHsgY3R4LnNldExpbmVEYXNoKGRhc2gpOyB9CmZ1bmN0aW9uIHNob3dfbW91c2UoKSB7IGNhbnZhcy5zdHlsZS5jdXJzb3IgPSAiZGVmYXVsdCI7IH0KZnVuY3Rpb24gaGlkZV9tb3VzZSgpIHsgY2FudmFzLnN0eWxlLmN1cnNvciA9ICJub25lIjsgfQovLyBtaW5pbWFsIG1hdGg6CmZ1bmN0aW9uIGF2ZXJhZ2UobnVtcyl7bGV0IG91dHB1dCA9IDA7Zm9yKGxldCBpID0gMDsgaSA8IG51bXMubGVuZ3RoOyBpKyspe291dHB1dCs9bnVtc1tpXX1yZXR1cm4gZmxvb3Iob3V0cHV0L251bXMubGVuZ3RoKX0KZnVuY3Rpb24gYWJzKF92YWx1ZSkgeyByZXR1cm4gX3ZhbHVlIDwgMCA/IC1fdmFsdWUgOiBfdmFsdWU7IH0KZnVuY3Rpb24gc2lnbihfdmFsdWUpIHsgcmV0dXJuIF92YWx1ZSA+IDAgPyAxIDogX3ZhbHVlIDwgMCA/IC0xIDogMDsgfQpmdW5jdGlvbiBjaG9vc2UoKSB7IHJldHVybiBhcmd1bWVudHNbfn4oTWF0aC5yYW5kb20oKSAqIGFyZ3VtZW50cy5sZW5ndGgpXTsgfQpmdW5jdGlvbiByYW5kb20oX3ZhbHVlKSB7IHJldHVybiBNYXRoLnJhbmRvbSgpICogX3ZhbHVlOyB9CmZ1bmN0aW9uIGZsb29yKF92YWx1ZSkgeyByZXR1cm4gTWF0aC5mbG9vcihfdmFsdWUpOyB9CmZ1bmN0aW9uIHJvdW5kKF92YWx1ZSkgeyByZXR1cm4gTWF0aC5yb3VuZChfdmFsdWUpOyB9CmZ1bmN0aW9uIHNuYXAoX3ZhbHVlLGdyaWQpICB7IHJldHVybiBmbG9vcihfdmFsdWUvZ3JpZCkqZ3JpZH0KZnVuY3Rpb24gaXJhbmRvbShfdmFsdWUpIHsgcmV0dXJuIH5+KE1hdGgucmFuZG9tKCkgKiBfdmFsdWUgKyAxKTsgfQpmdW5jdGlvbiBjbGFtcCh2YWx1ZSwgbWluLCBtYXgpIHtyZXR1cm4gTWF0aC5taW4oTWF0aC5tYXgodmFsdWUsIG1pbiksIG1heCk7fQpmdW5jdGlvbiBpbnNpZGUocHgsIHB5LCByeCwgcnksIHdpZHRoLCBoZWlnaHQsIGFuZ2xlLCBvcmlnaW5YLCBvcmlnaW5ZKSB7Y29uc3QgcmFkaWFucyA9IChhbmdsZSAqIE1hdGguUEkpIC8gMTgwO2Z1bmN0aW9uIHJvdGF0ZVBvaW50KGN4LCBjeSwgeCwgeSwgcmFkaWFucykge2NvbnN0IGNvcyA9IE1hdGguY29zKHJhZGlhbnMpO2NvbnN0IHNpbiA9IE1hdGguc2luKHJhZGlhbnMpO2NvbnN0IGR4ID0geCAtIGN4O2NvbnN0IGR5ID0geSAtIGN5O3JldHVybiB7eDogY3ggKyBkeCAqIGNvcyAtIGR5ICogc2luLHk6IGN5ICsgZHggKiBzaW4gKyBkeSAqIGNvcyx9O31jb25zdCBjZW50ZXJYID0gcnggKyBvcmlnaW5YO2NvbnN0IGNlbnRlclkgPSByeSArIG9yaWdpblk7Y29uc3QgY29ybmVycyA9IFtyb3RhdGVQb2ludChjZW50ZXJYLCBjZW50ZXJZLCByeCwgcnksIHJhZGlhbnMpLHJvdGF0ZVBvaW50KGNlbnRlclgsIGNlbnRlclksIHJ4ICsgd2lkdGgsIHJ5LCByYWRpYW5zKSxyb3RhdGVQb2ludChjZW50ZXJYLCBjZW50ZXJZLCByeCArIHdpZHRoLCByeSArIGhlaWdodCwgcmFkaWFucykscm90YXRlUG9pbnQoY2VudGVyWCwgY2VudGVyWSwgcngsIHJ5ICsgaGVpZ2h0LCByYWRpYW5zKSxdO2Z1bmN0aW9uIGNyb3NzUHJvZHVjdChBLCBCLCBQKSB7cmV0dXJuIChCLnggLSBBLngpICogKFAueSAtIEEueSkgLSAoQi55IC0gQS55KSAqIChQLnggLSBBLngpO31mb3IgKGxldCBpID0gMDsgaSA8IGNvcm5lcnMubGVuZ3RoOyBpKyspIHtjb25zdCBBID0gY29ybmVyc1tpXTtjb25zdCBCID0gY29ybmVyc1soaSArIDEpICUgY29ybmVycy5sZW5ndGhdO2NvbnN0IGNyb3NzID0gY3Jvc3NQcm9kdWN0KEEsIEIsIHsgeDogcHgsIHk6IHB5IH0pO2lmIChjcm9zcyA8IDApIHtyZXR1cm4gZmFsc2U7fX1yZXR1cm4gdHJ1ZTt9Ci8vIHRyaWcgZnVuY3Rpb25zOgpmdW5jdGlvbiBsZW5ndGhkaXJfeChfbGVuZ3RoLCBfZGlyZWN0aW9uKSB7IHJldHVybiBfbGVuZ3RoICogTWF0aC5jb3MoX2RpcmVjdGlvbiAqIHR1X2Qycik7IH0KZnVuY3Rpb24gbGVuZ3RoZGlyX3koX2xlbmd0aCwgX2RpcmVjdGlvbikgeyByZXR1cm4gX2xlbmd0aCAqIE1hdGguc2luKF9kaXJlY3Rpb24gKiB0dV9kMnIpOyB9CmZ1bmN0aW9uIHBvaW50X2Rpc3RhbmNlKF94MSwgX3kxLCBfeDIsIF95MikgeyByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KCggX3gxIC0gX3gyKSwgMikgKyBNYXRoLnBvdygoX3kxIC0gX3kyKSwgMikpOyB9CmZ1bmN0aW9uIHBvaW50X2RpcmVjdGlvbihfeDEsIF95MSwgX3gyLCBfeTIpIHsgcmV0dXJuIE1hdGguYXRhbjIoX3kyIC0gX3kxLCBfeDIgLSBfeDEpICogdHVfcjJkOyB9CmZ1bmN0aW9uIGRlZ3RvcmFkKF9kZWdyZWUpIHsgcmV0dXJuIF9kZWdyZWUgKiB0dV9kMnI7IH0KZnVuY3Rpb24gcmFkdG9kZWcoX2RlZ3JlZSkgeyByZXR1cm4gX2RlZ3JlZSAqIHR1X3IyZDsgfQovLyBrZXlib2FyZCBmdW5jdGlvbnM6CmZ1bmN0aW9uIGtleWJvYXJkX2NoZWNrKF9rZXkpIHsgcmV0dXJuIGtleV9kb3duW19rZXldOyB9CmZ1bmN0aW9uIGtleWJvYXJkX2NoZWNrX3ByZXNzZWQoX2tleSkgeyByZXR1cm4ga2V5X3ByZXNzZWRbX2tleV07IH0KZnVuY3Rpb24ga2V5Ym9hcmRfY2hlY2tfcmVsZWFzZWQoX2tleSkgeyByZXR1cm4ga2V5X3JlbGVhc2VkW19rZXldOyB9Ci8vIG1vdXNlIHRvdWNoIGZ1bmN0aW9uczoKZnVuY3Rpb24gc3dpcGVkKHNlbnNpdGl2eSl7CiAgbGV0IGRpcyA9IHNlbnNpdGl2eTsKICBsZXQgZGlyID0gMDsKICBsZXQgc3dpcGVkPW51bGw7CiAgaWYgKHR5cGVvZiBzdGFydFggPT0gInVuZGVmaW5lZCIpIHsKICAgIGxldCBzdGFydFggPSAtMTAwOwogICAgbGV0IHN0YXJ0WT0gLTEwMDsKICAgIGxldCBlbmRYID0gLTEwMDsKICAgIGxldCBlbmRZID0gLTEwMDsKICB9OwogIGlmKG1vdXNlX2NoZWNrX3ByZXNzZWQoKSl7CiAgICBzdGFydFggPSBtb3VzZV94OwogICAgc3RhcnRZID0gbW91c2VfeTsKICB9OwogIGlmKG1vdXNlX2NoZWNrX3JlbGVhc2VkKCkpewogICAgc3dpcGVkPSdub25lJwogICAgZW5kWCA9IG1vdXNlX3g7CiAgICBlbmRZID0gbW91c2VfeTsKICAgIGlmKHBvaW50X2Rpc3RhbmNlKHN0YXJ0WCxzdGFydFksZW5kWCxlbmRZKT5kaXMpewogICAgICBkaXIgPSBwb2ludF9kaXJlY3Rpb24oc3RhcnRYLHN0YXJ0WSxlbmRYLGVuZFkpOwogICAgaWYoZGlyPjQ1ICYmIGRpcjwxMzUpe3N3aXBlZD0ndXAnfTsKICAgIGlmKGRpcjw9NDUgJiYgZGlyPj0tNDUpe3N3aXBlZD0ncmlnaHQnfTsKICAgIGlmKGRpcjwtNDUgJiYgZGlyPi0xMzUpe3N3aXBlZD0nZG93bid9OwogICAgaWYoZGlyPj0xMzUgfHwgZGlyPD0tMTM1KXtzd2lwZWQ9J2xlZnQnfTsKICAgIH07CiAgfTsKICByZXR1cm4gc3dpcGVkOwp9OwoKZnVuY3Rpb24gbW91c2VfY2hlY2soKSB7IHJldHVybiBtb3VzZV9kb3duOyB9CmZ1bmN0aW9uIG1vdXNlX2NoZWNrX3ByZXNzZWQoKSB7IHJldHVybiBtb3VzZV9wcmVzc2VkOyB9CmZ1bmN0aW9uIG1vdXNlX2NoZWNrX3JlbGVhc2VkKCkgeyByZXR1cm4gbW91c2VfcmVsZWFzZWQ7IH0KLy9zZXRzIHVwIGNhbnZhcyB2YXJpYWJsZXMKdmFyIGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjYW52YXMnKTsKdmFyIGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCIyZCIpOwpmdW5jdGlvbiBrRG93bihlKXsKICBpZihlLnJlcGVhdCl7CiAgICByZXR1cm47CiAgfQogIHZrX2FsbF9rZXlzLnB1c2goZS5rZXkpCiAgdmFyIGtleUNvZGUgPSBlLmtleUNvZGU7CiAgaWYgKCFrZXlfZG93bltrZXlDb2RlXSkgewogICAga2V5X3ByZXNzZWRba2V5Q29kZV0gPSB0cnVlOwogICAgYWxsX2tleXNfcHJlc3NlZC5wdXNoKGtleUNvZGUpOwogIH0KICBrZXlfZG93bltrZXlDb2RlXSA9IHRydWU7Cn0KZnVuY3Rpb24ga1VwKGUpewogIHZhciBrZXlDb2RlID0gZS5rZXlDb2RlOwogIGlmIChrZXlfZG93bltrZXlDb2RlXSkKICB7CiAgICBrZXlfcmVsZWFzZWRba2V5Q29kZV0gPSB0cnVlOwogICAgYWxsX2tleXNfcmVsZWFzZWQucHVzaChrZXlDb2RlKTsKICB9CiAga2V5X2Rvd25ba2V5Q29kZV0gPSBmYWxzZTsKfQpmdW5jdGlvbiBtRG93bigpewogIGlmICghbW91c2VfZG93bikgewogICAgbW91c2VfZG93biA9IHRydWU7CiAgICBtb3VzZV9wcmVzc2VkID0gdHJ1ZTsKICB9ZWxzZXsKICAgIG1vdXNlX2Rvd24gPSB0cnVlOwogIH0KfQpmdW5jdGlvbiBtRG93bigpIHsKICBpZiAoIW1vdXNlX2Rvd24pIHsKICAgIG1vdXNlX2Rvd24gPSB0cnVlOwogICAgbW91c2VfcHJlc3NlZCA9IHRydWU7CiAgfSBlbHNlIHsKICAgIG1vdXNlX2Rvd24gPSB0cnVlOwogIH0KfQoKZnVuY3Rpb24gbVVwKCkgewogIGlmICghbW91c2VfZG93bikgewogICAgbW91c2VfZG93biA9IGZhbHNlOwogICAgbW91c2VfcHJlc3NlZCA9IGZhbHNlOwogIH0gZWxzZSB7CiAgICBtb3VzZV9kb3duID0gZmFsc2U7CiAgICBtb3VzZV9yZWxlYXNlZCA9IHRydWU7CiAgfQp9CgpmdW5jdGlvbiBtTW92ZShlKSB7CiAgbGV0IHgsIHk7CiAgCiAgLy8gQ2hlY2sgZm9yIHRvdWNoIGlucHV0CiAgaWYgKGUudG91Y2hlcykgewogICAgeCA9IGUudG91Y2hlc1swXS5jbGllbnRYOwogICAgeSA9IGUudG91Y2hlc1swXS5jbGllbnRZOwogIH0KICAvLyBPdGhlcndpc2UgdXNlIG1vdXNlIGlucHV0CiAgZWxzZSBpZiAoZS5wYWdlWCAhPSB1bmRlZmluZWQgJiYgZS5wYWdlWSAhPSB1bmRlZmluZWQpIHsKICAgIHggPSBlLnBhZ2VYOwogICAgeSA9IGUucGFnZVk7CiAgfSBlbHNlIHsKICAgIHggPSBlLmNsaWVudFggKyBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQgKyBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdDsKICAgIHkgPSBlLmNsaWVudFkgKyBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCArIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7CiAgfQogIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLwogIC8vL1pPT00gQ09SUkVDVElPTgogIC8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8KICB2YXIgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKQogIGxldCBzY2FsZVggPSBjYW52YXMud2lkdGggLyByZWN0LndpZHRoOwogIGxldCBzY2FsZVkgPSBjYW52YXMuaGVpZ2h0IC8gcmVjdC5oZWlnaHQ7CiAgbW91c2VfeCA9ICh4IC0gY2FudmFzLm9mZnNldExlZnQpKiBzY2FsZVg7CiAgbW91c2VfeSA9ICh5IC0gY2FudmFzLm9mZnNldFRvcCkqIHNjYWxlWTsKICBlLnByZXZlbnREZWZhdWx0KCk7IC8vIFByZXZlbnQgc2Nyb2xsaW5nIGJlaGF2aW9yCn0KZnVuY3Rpb24gdG91Y2hTdGFydChlKSB7CiAgbU1vdmUoZSk7CiAgbURvd24oKTsKfQoKZnVuY3Rpb24gdG91Y2hFbmQoZSkgewogIG1VcCgpOwp9CmFkZEV2ZW50TGlzdGVuZXIoImtleWRvd24iLCBrRG93biwgZmFsc2UpOy8vMTYgaXMgc2hpZnQgZS5rZXlDb2RlOwphZGRFdmVudExpc3RlbmVyKCJrZXl1cCIsIGtVcCwgZmFsc2UpOwphZGRFdmVudExpc3RlbmVyKCJtb3VzZWRvd24iLG1Eb3duLGZhbHNlKTsKYWRkRXZlbnRMaXN0ZW5lcigibW91c2V1cCIsbVVwLGZhbHNlKTsKYWRkRXZlbnRMaXN0ZW5lcigibW91c2Vtb3ZlIixtTW92ZSxmYWxzZSk7CmFkZEV2ZW50TGlzdGVuZXIoJ3doZWVsJywgd2hlZWwsZmFsc2UpOwovLyBBZGQgdG91Y2ggZXZlbnQgbGlzdGVuZXJzIHdpdGggeyBwYXNzaXZlOiBmYWxzZSB9CmFkZEV2ZW50TGlzdGVuZXIoInRvdWNoc3RhcnQiLCB0b3VjaFN0YXJ0LCB7IHBhc3NpdmU6IGZhbHNlIH0pOwphZGRFdmVudExpc3RlbmVyKCJ0b3VjaGVuZCIsIHRvdWNoRW5kLCB7IHBhc3NpdmU6IGZhbHNlIH0pOwphZGRFdmVudExpc3RlbmVyKCJ0b3VjaG1vdmUiLCBtTW92ZSwgeyBwYXNzaXZlOiBmYWxzZSB9KTsKCmZ1bmN0aW9uIHdoZWVsKGUpIHsKICBpZiAoZS5kZWx0YVkgPCAwKSB7CiAgICB3aGVlbERpcisrOwogIH0gZWxzZSB7CiAgICB3aGVlbERpci0tOwogIH0KfTsKLy8gVGhlIG1haW4gZ2FtZSBsb29wCmZ1bmN0aW9uIG1haW4oKSB7CiAgdmFyIG5vdyA9IERhdGUubm93KCk7CiAgdmFyIGRlbHRhID0gbm93IC0gdGhlbjsKICB0aW1lU2hpZnQgPSBkZWx0YSAvIDEwMDAKICBGUFMucHVzaChNYXRoLmZsb29yKDEvdGltZVNoaWZ0KSk7CiAgaWYoRlBTLmxlbmd0aD4xMCl7CiAgICBmcHMgPSBhdmVyYWdlKEZQUyk7CiAgICBGUFMgPSBbXTsKICB9CiAgaWYocnVuKXsKICAgIGN0eC5jbGVhclJlY3QoMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTsKICAgIGRyYXcoKTsKICB9CiAgbG9vcCgpOwogIAogIC8vY2xlYXJzIGtleXByZXNzZXMgYW5kIG1vdXNlcHJlc3MKICBmb3IgKGxldCBfayA9IDA7IF9rIDwgYWxsX2tleXNfcHJlc3NlZC5sZW5ndGg7IF9rKyspIGtleV9wcmVzc2VkW2FsbF9rZXlzX3ByZXNzZWRbX2tdXSA9IGZhbHNlOwogIGZvciAobGV0IF9rID0gMDsgX2sgPCBhbGxfa2V5c19yZWxlYXNlZC5sZW5ndGg7IF9rKyspIGtleV9yZWxlYXNlZFthbGxfa2V5c19yZWxlYXNlZFtfa11dID0gZmFsc2U7CiAgYWxsX2tleXNfcHJlc3NlZCA9IFtdOyBhbGxfa2V5c19yZWxlYXNlZCA9IFtdO21vdXNlX3ByZXNzZWQgPSBmYWxzZTttb3VzZV9yZWxlYXNlZCA9IGZhbHNlOwogIAogIHRoZW4gPSBub3c7CiAgLy8gUmVxdWVzdCB0byBkbyB0aGlzIGFnYWluIEFTQVAKICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUobWFpbik7Cn07Ci8vIENyb3NzLWJyb3dzZXIgc3VwcG9ydCBmb3IgcmVxdWVzdEFuaW1hdGlvbkZyYW1lCnZhciB3ID0gd2luZG93OwpyZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSB3LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHcubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lOwovLyBMZXQncyBwbGF5IHRoaXMgZ2FtZSEKdmFyIHRoZW4gPSBEYXRlLm5vdygpOwpzdGFydCgpOwptYWluKCk7Cg=='></sc`+`ript>

</b`+`ody>
</ht`+`ml>
`
