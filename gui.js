function createGUI() {
        
        // Character & Ability buttons
        charBG[0] = game.add.sprite(30, 340, 'gui', 3);
        character1 = game.add.button(30, 340, 'characters', selectChar, this, entities.children[playerCharacters[0]].frame, entities.children[playerCharacters[0]].frame);
        character1.id = 0;

        charBG[1] = game.add.sprite(67, 340, 'gui', 5);
        character2 = game.add.button(67, 340, 'characters', selectChar, this, entities.children[playerCharacters[1]].frame, entities.children[playerCharacters[1]].frame);
        character2.id = 1;

        charBG[2] = game.add.sprite(104, 340, 'gui', 5);
        character3 = game.add.button(104, 340, 'characters', selectChar, this, entities.children[playerCharacters[2]].frame, entities.children[playerCharacters[2]].frame);
        character3.id = 2;

        ability1 = game.add.button(200, 340, 'characters', ability, this, 1, 1);
        ability1.id = 1;

        //  The score
        var scoreText = game.add.text(16, 450, 'score: 0', { fontSize: '16px', fill: '#FFF' });
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