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
    let mapX = floor(me.x/gridSize);
    let mapY = floor(me.y/gridSize);
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
  viewport.x = clamp(viewport.x, 0, mapW*gridSize-viewport.w)
  viewport.y = clamp(viewport.y, 0, mapH*gridSize-viewport.h)
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
<script type='text/javascript' src='engine.js'></sc`+`ript>

</b`+`ody>
</ht`+`ml>
`
