# Level_Ed - Drag and Drop Game Maker

## Overview
Level_Ed is a JavaScript-based game editor that allows users to create levels by dragging and dropping tiles and objects. It features an integrated CodeMirror-based IDE for scripting object behaviors.

## Features
- **Drag-and-Drop Interface**: Easily place and manipulate tiles and objects.
- **Built-in Code Editor**: Edit object scripts directly within the application.
- **Multiple Script Modes**: Supports start, loop, and draw scripts for each object.
- **Tile & Object Management**: Import custom tilesets and organize objects.
- **Save/Load Projects**: Store your levels as JSON and reload them anytime.
- **Game Export**: Export your project as a standalone playable game.

## Installation
### Local Installation
1. Clone or download this repository.
2. Open `level_ed.html` in a browser.
### Online Usage
Simply open https://williac0374.github.io/level_ed/level_ed.html in any modern web browser (Chrome, Firefox, Edge).

## Usage Guide
### **Adding Tiles & Objects**
1. Click `Load Tileset` to import a tileset image.
2. Click `tilegrid size` to adjust for tilesheets tile size. (only works with square tiles no padding or offset.)
3. Click `mapW` to change maps width in cells (clears map!).
4. Click `mapH` to change maps height in cells (clears map!).
5. Click `Save Project` to save current project to json file.
6. Click `Load Project` to load a saved project.
7. Select a tile from the right panel.
8. Click on the level area to place the tile.
9. right Click on the level area to place the delete tiles.
10. Switch to `Objects` mode to add or delete game objects.
### **Editing Object Scripts**
1. Select an object and open the `Code Editor`.
2. Edit the script in one of the available modes:
   - `START`: Initialization code.
   - `LOOP`: Code that runs every frame.
   - `DRAW`: Rendering logic.
   - `HELP`: pulls up help that when clicked on injects code into editor(also saves to clipboard for copying)
   - `LOAD`: load .js file into current code window.
   - `SAVE`: save current code window content of .js file.
  - `Gcode`: global logic. nice for functions all objects can use 
3. Save changes by clicking `SAVE`.

### **Project Management**
- `Save Project`: Exports the project as a JSON file.
- `Load Project`: Imports a previously saved JSON file.
- `Export Game`: Generates a standalone HTML file.

### **Keyboard Shortcuts**
- `Shift + d`: Copy selected object(click left mouse button to place copy of object)
- `Shift + e`: Export selected object to a json file.
- `Shift + i`: import a previously saved object into the currently selected one(doesnt change tId)
- `LeftMouse + v`: Moves viewport around map.
- `LeftMouse + v + s`: sets Lower right corner of viewport.
- `F9`: test game in a new tab

## Future Improvements
- maybe???

## License
This project is open-source and free to use and probalby super buggy.
 
## P.S
- the game engine this is built on is based off of tululoo game maker and other things Ive looked up copied and pasted.
- in the object editor `me` is how the obects refer themselves for example in the loop of an object `me.x++` increases an objects x coordinate by one.
- the viewport which is shown in yellow dotted lines on the map is the what you will see when running the game.
- by increaseing or decreasing its size you effectifly zoom in or out.
- it can be moved by setting `viewport.x` , `viewport.y`, `viewport.w`, `viewport.h` although changing width and height refreshes the screen and is jarring.
-- by setting the x and y of the viewport you can cause it to follow an object.
- by looking at the pre.js  post.js  and help.js It is possible to rip the engine out and put yours in possibly.


