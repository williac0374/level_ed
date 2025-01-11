me.speed = 4;
me.dx = 0;
me.dy = 0;
if(keyboard_check(vk_right)){
    me.dx = me.speed
}
 
if(keyboard_check(vk_left)){
    me.dx = -me.speed
}
if(place_free([3,13],me.x+me.dx-13, me.y-13, 26, 26,tiles,32)){
  me.x+=me.dx
}

if(keyboard_check(vk_up)){
    me.dy = -me.speed
}
 
if(keyboard_check(vk_down)){
    me.dy = me.speed
}

if(place_free([3,13],me.x-13, me.y+me.dy-13, 26, 26,tiles,32)){
  me.y+=me.dy
}









