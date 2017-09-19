//let buttons = [];
let charSelect1, charSelect2, charSelect3, ability1;
let charBG = [];
//let scoreText;
let versionText, debugText;
let guiGroup;

function createGUI() {
        
	guiGroup = game.add.group();
	guiGroup.fixedToCamera = true;
	
	// Character & Ability buttons
	charBG[0] = game.add.sprite(30, 340, 'gui', 3, guiGroup);
	charSelect1 = game.add.button(30, 340, 'characters', selectChar, this, entities.children[playerCharacters[0]].frame, entities.children[playerCharacters[0]].frame);
	charSelect1.id = 0;
	guiGroup.add(charSelect1);

	charBG[1] = game.add.sprite(67, 340, 'gui', 5, guiGroup);
	charSelect2 = game.add.button(67, 340, 'characters', selectChar, this, entities.children[playerCharacters[1]].frame, entities.children[playerCharacters[1]].frame);
	charSelect2.id = 1;
	guiGroup.add(charSelect2);

	charBG[2] = game.add.sprite(104, 340, 'gui', 5, guiGroup);
	charSelect3 = game.add.button(104, 340, 'characters', selectChar, this, entities.children[playerCharacters[2]].frame, entities.children[playerCharacters[2]].frame);
	charSelect3.id = 2;
	guiGroup.add(charSelect3);

	ability1 = game.add.button(200, 340, 'characters', ability, this, 1, 1);
	ability1.id = 1;
	guiGroup.add(ability1);
	
	versionText = game.add.text(16, 450, version, { fontSize: '12px', fill: '#FFF' }, guiGroup);
	debugText = game.add.text(16, 450, "game.renderType: " + game.renderType, { fontSize: '12px', fill: '#FFF' }, guiGroup);
	//scoreText = game.add.text(16, 450, 'score: 0', { fontSize: '16px', fill: '#FFF' }, guiGroup);
}

function resetGUI() {
	console.log(charBG[0]);
	charBG[0].reset(30, window.innerHeight - 60);
	charBG[1].reset(67, window.innerHeight - 60);
	charBG[2].reset(104, window.innerHeight - 60);
	charSelect1.reset(30, window.innerHeight - 60);
	charSelect2.reset(67, window.innerHeight - 60);
	charSelect3.reset(104, window.innerHeight - 60);
	ability1.reset(200, window.innerHeight - 60);
	versionText.reset(window.innerWidth - 80, window.innerHeight - 20);
	debugText.reset(30, window.innerHeight - 20);
	//charBG[0].position.y = window.innerHeight - 60;
}

function selectChar(obj) {
	console.log(obj.id);
	charBG[0].frame = 5;
	charBG[1].frame = 5;
	charBG[2].frame = 5;
	charSelection = obj.id;
	charBG[obj.id].frame = 3;
}

function ability(obj) {
	console.log(obj.id);
}