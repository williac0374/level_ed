//misc
master_alpha = 1;timeShift=0,FPS=[],fps=0,run=true,fullscreen=false;
// math:
max = Math.max, min = Math.min, round = Math.round, floor = Math.floor, ceil = Math.ceil,
sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, tan = Math.tan, rand = Math.random,
arccos = Math.acos, arcsin = Math.asin, arctan = Math.atan, arctan2 = Math.atan2,
tu_r2d = -180 / Math.PI, tu_d2r = Math.PI / -180, tu_2pi = Math.PI * 2,
// i/o constants:
vk_0 = 48, vk_1 = 49, vk_2 = 50, vk_3 = 51, vk_4 = 52, vk_5 = 53, vk_6 = 54,
vk_7 = 55, vk_8 = 56, vk_9 = 57, vk_a = 65, vk_add = 107, vk_alt = 18, vk_b = 66,
vk_backspace = 8, vk_c = 67, vk_ctrl = 17, vk_d = 68, vk_decimal = 110, vk_delete = 46,
vk_divide = 111, vk_down = 40, vk_e = 69, vk_end = 35, vk_enter = 13, vk_escape = 27,
vk_f1 = 112, vk_f2 = 113, vk_f3 = 114, vk_f4 = 115, vk_f5 = 116, vk_f6 = 117,
vk_f7 = 118, vk_f8 = 119, vk_f9 = 120, vk_f10 = 121, vk_f11 = 122, vk_f12 = 123,
vk_g = 71, vk_h = 72, vk_home = 36, vk_f = 70, vk_i = 73, vk_insert = 45, vk_j = 74, vk_k = 75,
vk_l = 76, vk_left = 37, vk_m = 77, vk_multiply = 106, vk_n = 78, vk_num0 = 96, vk_num1 = 97,
vk_num2 = 98, vk_num3 = 99, vk_num4 = 100, vk_num5 = 101, vk_num6 = 102, vk_num7 = 103,
vk_num8 = 104, vk_num9 = 105, vk_o = 79, vk_p = 80, vk_pagedown = 34, vk_pageup = 33,
vk_pause = 19, vk_q = 81, vk_r = 82, vk_right = 39, vk_s = 83, vk_shift = 16, vk_space = 32,
vk_subtract = 109, vk_t = 84, vk_tab = 9, vk_u = 85, vk_up = 38, vk_v = 86, vk_w = 87,
vk_x = 88, vk_y = 89, vk_z = 90,
// i/o variables:
mouse_x = mouse_y = 0, mouse_down = mouse_pressed = mouse_released = false,wheelDir=0,
key_down = [], key_pressed = [], key_released = [],all_keys_pressed = [],all_keys_released = [];
vk_all_keys = [];
function make_sound(_src,buffers){
  if (_src != '') {
    let temp = [];
    for(let i = 0; i < buffers; i++ ){
      temp[i] = document.createElement('audio');
      temp[i].setAttribute('src', _src);
        temp[i].onerror = function() {
    alert("Error: Failed to load: "+_src);
};
    }
    return temp;
  }
}
function play(sound){
  //.duration > 0 && ! .paused means its playing
  for(let i = 0 ; i < sound.length ; i++){
    if(sound[i].duration > 0 && !sound[i].paused){
    }else{
      sound[i].currentTime = 0;
      sound[i].play()
      i=1000;
    }
  }
}
//request full screen
function requestFullscreen(element) {if (!element) {element = document.documentElement;}if (element.requestFullscreen) {element.requestFullscreen();} else if (element.webkitRequestFullscreen) {element.webkitRequestFullscreen();} else if (element.msRequestFullscreen) {element.msRequestFullscreen();} else if (element.mozRequestFullScreen) {element.mozRequestFullScreen();} else {console.error("Fullscreen API is not supported on this browser.");}}
// detects fullscreen change
document.addEventListener('fullscreenchange', function() {
  if (document.fullscreenElement) {
    fullscreen=true;
  } else {
    fullscreen=false;
  }
  
});
function drawWrappedText(text, x, y, maxWidth, lineHeight,fontSize, weight){
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  // Set font and text style
  if(weight==null){weight=400}
  ctx.font = weight+" "+fontSize+"px Helvetica";
  for (let word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const testWidth = ctx.measureText(testLine).width;
    
    if (testWidth > maxWidth && line) {
      // Draw the current line if it exceeds maxWidth
      ctx.fillText(line, x, currentY);
      line = word; // Start a new line with the current word
      currentY += lineHeight;
    } else {
      line = testLine; // Add the word to the current line
    }
  }
  
  // Draw the last line
  if (line) {
    ctx.fillText(line, x, currentY);
  }
}
function text_fit(text,width){
  for(let i = 6; i<120; i++){// statilesRect.spritert way small
    ctx.font = i+'px Arial'; // set font for testing
    if(ctx.measureText(text).width>=width){ // checks if text doesnt fit bounds
      return i-1; // outputs previous i since it probably fit
    }
  }
}
// draw text:
function draw_text(x, y, text, size,weight) {
  if(weight==null){weight=400}
  ctx.globalAlpha =master_alpha;
if(size==null){size=24}
  ctx.font = weight+" "+size+"px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText(text, x, y);
}
function draw_centered_text(x, y, text, size, weight) {
  if(weight==null){weight=400}
  ctx.globalAlpha =master_alpha;
if(size==null){size=24}
  ctx.font = weight+" "+size+"px Helvetica";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, x, y);
}
function draw_set_image(file){
  let temp = new Image();
  temp.src = file;
  temp.loaded=false;
  temp.onerror = function() {
    alert("Error: Failed to load: "+file);
};
temp.onload = function () {temp.loaded=true};
  return temp;
}
function draw_strip(x,y,strip,frame,w,h,rot,ox,oy){
if (w==null){w=strip.width}
if (h==null){h=strip.height}
if(rot==null){rot=0}
if(ox==null){ox=0}
if(oy==null){oy=0}
  if (strip.loaded==false) return;
  let frames = strip.width/strip.height
  if(frame>=frames) frame=frames-1 // locks it at last frame if asked to draw more frames than it has
  draw_image(strip,x,y,w,h,rot,ox,oy,(strip.width/frames)*frame,0,strip.width/frames,strip.height)
}
function draw_image(img,x,y,w,h,rot,ox,oy,source_x,source_y,source_w,source_h){
if(w==null){w=img.width}
if(h==null){h=img.height}
if(source_x==null){source_x=0}
if(source_y==null){source_y=0}
if(source_w==null){source_w=img.width}
if(source_h==null){source_h=img.height}
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  ctx.globalAlpha =master_alpha;
  if(rot!=null){
    ctx.save();
    //ctx.translate(x+ox,y+oy);
    ctx.translate(x,y);
    if(rot!=0){
    ctx.rotate(rot*Math.PI/180);//tu_r2d = -180 / Math.PI, tu_d2r = Math.PI / -180
    }
    ctx.drawImage(img,source_x, source_y, source_w, source_h, -ox,-oy,w,h);
    ctx.restore()
  }else{
    ctx.drawImage(img, x, y, w, h);
  }
}
// draw shapes:
function draw_rectangle(x, y, w, h,outline,rot,ox,oy) {
  ctx.globalAlpha =master_alpha;
  if(rot!=null){
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(rot*Math.PI/180);
    ctx.beginPath();
    if (outline) ctx.strokeRect( -ox,-oy,w,h);
    else ctx.fillRect( -ox,-oy,w,h );
    ctx.closePath();
    ctx.restore()
  }else{
    ctx.beginPath();
    if (outline) ctx.strokeRect( x,y,w,h);
    else ctx.fillRect( x,y,w,h );
    ctx.closePath()
  }
}
function draw_circle(x, y, r, outline) {
  ctx.globalAlpha =master_alpha;
  ctx.beginPath();
  ctx.arc( x,y,r, 0, tu_2pi, true );
  ctx.closePath();
  !outline ? ctx.fill() : ctx.stroke();
}

function draw_line(x1, y1, x2, y2) {
  ctx.globalAlpha =master_alpha;
  ctx.beginPath();
  ctx.moveTo( x1, y1);
  ctx.lineTo( x2, y2);
  ctx.closePath();
  ctx.stroke();
}
// draw settings:
function draw_set_alpha(_alpha) {
  master_alpha = _alpha;
}
function draw_set_color(r,g,b) {
  //"rgb(155, 102, 102)";
  ctx.fillStyle = "rgb("+r+","+g+","+b+")";
  ctx.strokeStyle = "rgb("+r+","+g+","+b+")";
}
function draw_set_linewidth(width) { ctx.lineWidth = width; }
function draw_set_linedash(dash) { ctx.setLineDash(dash); }
function show_mouse() { canvas.style.cursor = "default"; }
function hide_mouse() { canvas.style.cursor = "none"; }
// minimal math:
function average(nums){let output = 0;for(let i = 0; i < nums.length; i++){output+=nums[i]}return floor(output/nums.length)}
function abs(_value) { return _value < 0 ? -_value : _value; }
function sign(_value) { return _value > 0 ? 1 : _value < 0 ? -1 : 0; }
function choose() { return arguments[~~(Math.random() * arguments.length)]; }
function random(_value) { return Math.random() * _value; }
function irandom(_value) { return ~~(Math.random() * _value + 1); }
function floor(_value) { return Math.floor(_value); }
function round(_value) { return Math.round(_value); }
function snap(_value,grid)  { return floor(_value/grid)*grid}
function lerp(inp,target,rate){return inp+(target-inp)*rate;};
function easeIn(inp,target,rate){let diff=target-inp;return inp+diff*(Math.pow(rate,2));};
function easeOut(inp,target,rate){let diff=target-inp;return inp+diff*(1 -Math.exp(-rate));};
function clamp(value, min, max) {return Math.min(Math.max(value, min), max);}
function inside(px, py, rx, ry, width, height, angle, originX, originY) {const radians = (angle * Math.PI) / 180;function rotatePoint(cx, cy, x, y, radians) {const cos = Math.cos(radians);const sin = Math.sin(radians);const dx = x - cx;const dy = y - cy;return {x: cx + dx * cos - dy * sin,y: cy + dx * sin + dy * cos,};}const centerX = rx + originX;const centerY = ry + originY;const corners = [rotatePoint(centerX, centerY, rx, ry, radians),rotatePoint(centerX, centerY, rx + width, ry, radians),rotatePoint(centerX, centerY, rx + width, ry + height, radians),rotatePoint(centerX, centerY, rx, ry + height, radians),];function crossProduct(A, B, P) {return (B.x - A.x) * (P.y - A.y) - (B.y - A.y) * (P.x - A.x);}for (let i = 0; i < corners.length; i++) {const A = corners[i];const B = corners[(i + 1) % corners.length];const cross = crossProduct(A, B, { x: px, y: py });if (cross < 0) {return false;}}return true;}
// trig functions:
function lengthdir_x(_length, _direction) { return _length * Math.cos(_direction * tu_d2r); }
function lengthdir_y(_length, _direction) { return _length * Math.sin(_direction * tu_d2r); }
function point_distance(_x1, _y1, _x2, _y2) { return Math.sqrt(Math.pow(( _x1 - _x2), 2) + Math.pow((_y1 - _y2), 2)); }
function point_direction(_x1, _y1, _x2, _y2) { return Math.atan2(_y2 - _y1, _x2 - _x1) * tu_r2d; }
function degtorad(_degree) { return _degree * tu_d2r; }
function radtodeg(_degree) { return _degree * tu_r2d; }
// keyboard functions:
function keyboard_check(_key) { return key_down[_key]; }
function keyboard_check_pressed(_key) { return key_pressed[_key]; }
function keyboard_check_released(_key) { return key_released[_key]; }
// mouse touch functions:
function swiped(sensitivy){
  let dis = sensitivy;
  let dir = 0;
  let swiped=null;
  if (typeof startX == "undefined") {
    let startX = -100;
    let startY= -100;
    let endX = -100;
    let endY = -100;
  };
  if(mouse_check_pressed()){
    startX = mouse_x;
    startY = mouse_y;
  };
  if(mouse_check_released()){
    swiped='none'
    endX = mouse_x;
    endY = mouse_y;
    if(point_distance(startX,startY,endX,endY)>dis){
      dir = point_direction(startX,startY,endX,endY);
    if(dir>45 && dir<135){swiped='up'};
    if(dir<=45 && dir>=-45){swiped='right'};
    if(dir<-45 && dir>-135){swiped='down'};
    if(dir>=135 || dir<=-135){swiped='left'};
    };
  };
  return swiped;
};

function mouse_check() { return mouse_down; }
function mouse_check_pressed() { return mouse_pressed; }
function mouse_check_released() { return mouse_released; }
//sets up canvas variables
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext("2d");
function kDown(e){
  if(e.repeat){
    return;
  }
  vk_all_keys.push(e.key)
  var keyCode = e.keyCode;
  if (!key_down[keyCode]) {
    key_pressed[keyCode] = true;
    all_keys_pressed.push(keyCode);
  }
  key_down[keyCode] = true;
}
function kUp(e){
  var keyCode = e.keyCode;
  if (key_down[keyCode])
  {
    key_released[keyCode] = true;
    all_keys_released.push(keyCode);
  }
  key_down[keyCode] = false;
}
function mDown(){
  if (!mouse_down) {
    mouse_down = true;
    mouse_pressed = true;
  }else{
    mouse_down = true;
  }
}
function mDown() {
  if (!mouse_down) {
    mouse_down = true;
    mouse_pressed = true;
  } else {
    mouse_down = true;
  }
}

function mUp() {
  if (!mouse_down) {
    mouse_down = false;
    mouse_pressed = false;
  } else {
    mouse_down = false;
    mouse_released = true;
  }
}

function mMove(e) {
  let x, y;
  
  // Check for touch input
  if (e.touches) {
    x = e.touches[0].clientX;
    y = e.touches[0].clientY;
  }
  // Otherwise use mouse input
  else if (e.pageX != undefined && e.pageY != undefined) {
    x = e.pageX;
    y = e.pageY;
  } else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  /////////////////////////////////////////////
  ///ZOOM CORRECTION
  //////////////////////////////////////////////
  var rect = canvas.getBoundingClientRect()
  let scaleX = canvas.width / rect.width;
  let scaleY = canvas.height / rect.height;
  mouse_x = (x - canvas.offsetLeft)* scaleX;
  mouse_y = (y - canvas.offsetTop)* scaleY;
  e.preventDefault(); // Prevent scrolling behavior
}
function touchStart(e) {
  mMove(e);
  mDown();
}

function touchEnd(e) {
  mUp();
}
addEventListener("keydown", kDown, false);//16 is shift e.keyCode;
addEventListener("keyup", kUp, false);
addEventListener("mousedown",mDown,false);
addEventListener("mouseup",mUp,false);
addEventListener("mousemove",mMove,false);
addEventListener('wheel', wheel,false);
// Add touch event listeners with { passive: false }
addEventListener("touchstart", touchStart, { passive: false });
addEventListener("touchend", touchEnd, { passive: false });
addEventListener("touchmove", mMove, { passive: false });

function wheel(e) {
  if (e.deltaY < 0) {
    wheelDir++;
  } else {
    wheelDir--;
  }
};
// The main game loop
function main() {
  var now = Date.now();
  var delta = now - then;
  timeShift = delta / 1000
  FPS.push(Math.floor(1/timeShift));
  if(FPS.length>10){
    fps = average(FPS);
    FPS = [];
  }
  if(run){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw();
  }
  loop();
  
  //clears keypresses and mousepress
  for (let _k = 0; _k < all_keys_pressed.length; _k++) key_pressed[all_keys_pressed[_k]] = false;
  for (let _k = 0; _k < all_keys_released.length; _k++) key_released[all_keys_released[_k]] = false;
  all_keys_pressed = []; all_keys_released = [];mouse_pressed = false;mouse_released = false;
  
  then = now;
  // Request to do this again ASAP
  requestAnimationFrame(main);
};
// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
// Let's play this game!
var then = Date.now();
start();
main();
