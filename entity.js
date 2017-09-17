function entityLogic () {
	let t0 = performance.now();
	for (let i=0;i<entities.children.length;i++) {
		let ent = entities.children[i];
		//if (gameTime % 2 == 0) {
		if (ent.currentAction === "attack") {
			attackTarget(i, ent.target);
		}
		if (ent.currentAction === "wander" && Math.random() > 0.9) {
			let moveTo = findOpenSquares(ent.tileX, ent.tileY, 1)[0];
			ent.moveX = moveTo.x;
			ent.moveY = moveTo.y;
			let wanderDistance = getDistance(ent.moveX, ent.moveY, ent.behavior.wanderCenterX, ent.behavior.wanderCenterY);
			//console.log(ent.behavior.wanderCenterX);
			if ( wanderDistance > ent.behavior.wanderRange) {
				ent.moveX = ent.behavior.wanderCenterX;
				ent.moveY = ent.behavior.wanderCenterY;
			}
		}
		if (ent.moveX > 0) {
			findPath(ent);
			//console.log('moving...');
		}
		//}
	}
	gameTime++;
	let t1 = performance.now();
	console.log('Took', (t1 - t0).toFixed(4), 'milliseconds to generate');
}

Entity = function (x, y, name = 'entity', properties = {}) {
            this.tileX = Math.ceil((x - 10)/32);
            this.tileY = Math.ceil((y - 10)/32);
            this.name = name || 'generic entity';
            //if (properties) {
            this.moveX = properties.moveX || 0;
            this.moveY = properties.moveY || 0;
            this.hp = properties.hp || 100;
            this.currentAction = properties.currentAction || "idle";
            //this.behavior = properties.behavior || 'wander';
            this.behavior = new Behavior(this, properties.behavior || '');
            if (this.behavior.wander == true) {
                this.currentAction = "wander";
            }
            //if (properties.hasOwnProperty('behaviors')) {
            //  this.behaviors = properties.behaviors;
            //}
            //this.wanderRange = properties.wanderRange || 3;
            //this.wanderCenterX = properties.wanderCenterX || 0;
            //this.wanderCenterY = properties.wanderCenterY || 0;
            //}
            //else {
            //  this.moveX = 0;
            //  this.moveY = 0;
            //}

            Phaser.Sprite.call(this, game, this.tileX * 32, this.tileY * 32, 'characters', properties.spriteIndex);
            this.anchor.x = 1;
            this.anchor.y = 1;
            //this.smoothed = false;

            this.eid = entityIDs;
            entities.addAt(this, entityIDs);
            entityIDs++;
        };

        Entity.prototype = Object.create(Phaser.Sprite.prototype);
        Entity.prototype.constructor = Entity;

        Entity.prototype.update = function () {
            //console.log("HELLO!");
            //this.findPath();
        };

        Entity.prototype.move = function (x,y) {
            let deltaX = x * 32;
            let deltaY = y * 32;
            this.tileX = x;
            this.tileY = y;
            let tween = game.add.tween(this).to( { x: deltaX, y: deltaY }, 400, Phaser.Easing.Sinusoidal.Out, true);
            tween.onUpdateCallback(walkAnimation, this);
            tween.onComplete.add(function() { resetSprite(this); }, this);// = resetSpriteSig;
            if (this.tileX === this.moveX && this.tileY === this.moveY) {
                this.moveX = 0;
                this.moveY = 0;
                //console.log("Reached destination " + this.name);
            }
            //console.log(this.x + " " + this.y + " " + this.tileX + " " + this.tileY);
        }

        Behavior = function(entity, properties) {
            // stand, follow, wander
            this.follow = properties.follow || false;
            this.wander = properties.wander || false;
            this.wanderRange = properties.wanderRange || 3;
            this.wanderFrequency = properties.wanderFrequency || 100;
            this.wanderCenterX = entity.tileX;
            this.wanderCenterY = entity.tileY;
            this.followTarget = -1;
        }