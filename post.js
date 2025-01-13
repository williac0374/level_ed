post_game = `
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
        let sx = tId % 10 * gridSize;
        let sy = Math.floor(tId / 10) * gridSize;
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
        let sx = tId % 10 * gridSize;
        let sy = Math.floor(tId / 10) * gridSize;
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
    let sx = tId % 10 * gridSize;
    let sy = Math.floor(tId / 10) * gridSize;
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

function view_follow(obj,margin,speed){
  //horizontal
if(obj.x>viewport.x+viewport.w*(margin/100)){viewport.x+=speed}
if(obj.x<viewport.x+viewport.w*(((100-margin)/100))){viewport.x-=speed}
  viewport.x=clamp(viewport.x, 0, mapW*gridSize-viewport.w)
  
  //vertical
if(obj.y>viewport.y+viewport.h*(margin/100)){viewport.y+=speed}
if(obj.y<viewport.y+viewport.h*(((100-margin)/100))){viewport.y-=speed}
  viewport.y=clamp(viewport.y, 0, mapH*gridSize-viewport.h)
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
