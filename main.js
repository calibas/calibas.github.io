"use strict";

console.log("RoNiv-0.13");
//window.onload = function() {
let scale = 2;
let game = new Phaser.Game("100%", "100%", Phaser.AUTO, '', { init: init, preload: preload, create: create, update: update }, false, false);
let easystar = new EasyStar.js();
let map;
let timer;


function init () {
	//Phaser.Canvas.setImageRenderingCrisp(game.canvas);
}

function preload () {
	game.scale.scaleMode = Phaser.ScaleManager.RESIZE;
	game.stage.smoothed = false;
    game.renderer.renderSession.roundPixels = true;
	game.world.setBounds(0,0,0,2000);
	//game.scale.setUserScale(scale,scale);
	//game.scale.setMinMax(400, 300, 800, 600);

	game.load.image('star', 'assets/star.png');
	game.load.image('dude', 'assets/fighter1.png');

	game.load.tilemap('roguelike2-tm', 'assets/roguelike2b.json', null, Phaser.Tilemap.TILED_JSON);
	game.load.image('tiles', 'assets/dg_grounds32.png');
	//game.load.image('characters', 'assets/dg_classm32trans.png');
	game.load.spritesheet('characters', 'assets/dg_classm32trans.png', 32, 32);
	game.load.spritesheet('gui', 'assets/dg_ground32gui.png', 32, 32);
}

let cursors;
let entities;
let entityIDs = 0;
let background;
let foreground;
let moveGrid = [];
let gameTime = 0;
let playerCharacters = [0,1,2];
let charSelection = 0;

function create () {
	map = game.add.tilemap('roguelike2-tm');

	//  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
	//  The second parameter maps this name to the Phaser.Cache key 'tiles'
	map.addTilesetImage('dg_grounds32', 'tiles');
	//map.addTilesetImage('dg_classm32trans', 'characters');
	background = map.createLayer('background');
	foreground = map.createLayer('foreground');
	entities = game.add.group();
	foreground.inputEnabled = true;
	foreground.events.onInputDown.add(listener, this);
	console.log(map);

	for (let i=0;i<map.objects.entities.length;i++) {
		let ent = map.objects.entities[i];
		new Entity(ent.x, ent.y, ent.name, ent.properties);
	}

	cursors = game.input.keyboard.createCursorKeys();

	//Create movement grid
	for (let i=0;i<map.height;i++) {
		if (typeof moveGrid[i] === 'undefined') {
			moveGrid.push([]);
		}
		for (let j=0;j<map.width;j++) {
			moveGrid[i][j] = map.layers[1].data[i][j].index;
		}
	}

	background.scale.set(scale);
	foreground.scale.set(scale);
	entities.scale.set(scale);

	//game.camera.follow(entities.children[charSelection]);
	//game.camera.follow(charSelect1);
	game.world.setBounds(0, 0, map.widthInPixels * scale, map.heightInPixels * scale);
	//game.camera.deadzone = new Phaser.Rectangle(100,180,1,1);
	game.camera.follow(entities.children[charSelection], Phaser.Camera.FOLLOW_LOCKON, 0.9, 0.9);

	createGUI();

	//  entityLogic Timer
	timer = game.time.create(false);
	timer.loop(400, entityLogic, this);
	timer.start();

}

function update () {
/*
	if (cursors.left.isDown)
	else if (cursors.right.isDown)
	if (cursors.up.isDown)
	else if (cursors.down.isDown)
	if (game.input.mousePointer.isDown)
	if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
*/
}

function walkAnimation (obj, obj2) {
	//this.height = 32 + Math.sin(game.time.now * 0.01) * 2;
}

window.addEventListener('resize', resizeGame);

function resizeGame() {
	//console.log(window.innerWidth / scale);
	//console.log(game.scale.scaleFactor.x);
	//game.scale.setGameSize(Math.ceil(window.innerWidth / scale), Math.ceil(window.innerHeight / scale));
	game.scale.refresh();
}

//Reset sprite dimension signal
let resetSpriteSig = new Phaser.Signal();
resetSpriteSig.add(resetSprite, game);

function resetSprite (obj) {
	obj.height = obj.texture.frame.height;
	obj.width = obj.texture.frame.width;
}

/*
BehavorItem = function(entity, properties) {
	this.type = properties.type;
	this.target = properties.target || -1;
	this.range = properties.range || -1;
	this.data = properties.data || '';
}
*/

function findPath(targetEntity) {
	easystar.setGrid(moveGrid);
	easystar.setAcceptableTiles([-1]);
	//console.log(targetEntity.x + " " + targetEntity.y + " " + targetEntity.tileX + " " + targetEntity.tileY);
	easystar.stopAvoidingAllAdditionalPoints();
	for (let i=0;i<entities.children.length;i++) {
		if (!(entities.children[i].tileX == targetEntity.moveX && entities.children[i].tileY == targetEntity.moveY)) {
			easystar.avoidAdditionalPoint(entities.children[i].tileX - 1, entities.children[i].tileY - 1);
			//console.log("avoid point: " + level.entities[i].posX + " " + level.entities[i].posY)
		}
	}
	easystar.findPath(targetEntity.tileX - 1, targetEntity.tileY - 1, targetEntity.moveX - 1, targetEntity.moveY - 1, function( path ) {
		try {
			if (path[1] != null && checkForEntity(path[1].x + 1, path[1].y + 1) == -1) {
				targetEntity.move(path[1].x + 1, path[1].y + 1);
			} else {
				targetEntity.moveX = 0;
				targetEntity.moveY = 0;
				return;
			}
		}
		catch(err) {
			console.log(targetEntity.name + ": Invalid path");
			targetEntity.moveX = 0;
			targetEntity.moveY = 0;
			return;
		}
	});
	easystar.calculate();
}


function listener () {

	let clickX = game.input.activePointer.positionDown.x + game.camera.x;
	let clickY = game.input.activePointer.positionDown.y + game.camera.y;
	let posX = Math.ceil((clickX)/(32 * scale));
	let posY = Math.ceil((clickY)/(32 * scale));
	//console.log(this);
	//console.log(Math.ceil((clickX)/32) + " " + Math.ceil((clickY)/32));
	//console.log(clickX + " " + clickY);
	if (posX <= map.width && posY <= map.height) {
		entities.children[charSelection].moveX = posX;
		entities.children[charSelection].moveY = posY;
	}

}

function findOpenSquares (centerX,centerY,radius,randomize = true,includeCenter = false) {
	let openSquares = [];
	for (let i = centerX - radius;i <= centerX + radius;i++){
		for (let j = centerY - radius;j <= centerY + radius;j++){
			if (checkMoveableTile(i,j) && !(i == centerX && j == centerY)) {
				openSquares.push({"x":i,"y":j});
			}
		}
	}
	if (includeCenter)
		openSquares.push({"x":centerX,"y":centerY});
	return (randomize) ? shuffleArray(openSquares) : openSquares;
}

function checkMoveableTile (x,y) {
	if (x > 0 && x <= map.width && y > 0 && y <= map.height) {
		return moveGrid[y-1][x-1] == -1;
	} else {
		return false;
	}
}

function checkForEntity (x,y) {
	for (let i=0;i<entities.children.length;i++) {
		//console.log(entities.children[i].tileX + " " + entities.children[i].tileY + " " + x + " " + y);
		if (entities.children[i].tileX == x && entities.children[i].tileY == y) {
			//console.log("found entity");
			return i;
		}
	}
	//console.log("found no entity");
	return -1;
}

/**
 * Randomize array element order in-place.
 * Using Durstenfeld shuffle algorithm.
 */
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

function getDistance(x1, y1, x2, y2, returnXY = false) {
	let deltaX = x2 - x1;
	let deltaY = y2 - y1;
	if (returnXY) {
		return [deltaX, deltaY];
	} else {
		return Math.abs(deltaX) + Math.abs(deltaY);
	}
}

//};
