/*
START CODE
me.speed = 4;
me.dx = 0;
me.dy = 0;
me.ground = false

*/

me.speed = 4;
me.dx = 0;
me.dy +=0.1;
if(keyboard_check(vk_right)){
    me.dx = me.speed
    if(me.dy!=0){me.dx = me.speed/4}
}
 
if(keyboard_check(vk_left)){
    me.dx = -me.speed
    if(me.dy!=0){me.dx = -me.speed/4}
}

if(keyboard_check(vk_up)&&me.ground==true){
    me.dy = -4
}

if(place_free([3,13],me.x+me.dx-13, me.y-13, 26, 26,tiles,32)){
  me.x+=me.dx
}


if(place_free([3,13],me.x-13, me.y+me.dy-13, 26, 26,tiles,32)){
  me.y+=me.dy
me.ground = false
}else{
me.dy = 0;
me.ground = true;
}
document.title = me.dy
if(me.x>viewport.x+viewport.w*0.7){viewport.x+=me.dx}
if(me.x<viewport.x+viewport.w*0.3){viewport.x+=me.dx}



