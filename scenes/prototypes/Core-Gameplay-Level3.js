class Rock extends Phaser.Physics.Arcade.Sprite { //made these because my code started to hurt to look at
    constructor(scene, x, y) {
        super(scene, x, y, "spriteAtlas", "unbroken");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false).setImmovable();
        this.resetX = this.x;
        this.resetY = this.y;
        this.playerOff = true;
        this.stoneOff = true;
        this.setupCollider(scene.player, this.playerOff, 'playerOff');
        this.setupCollider(scene.stone, this.stoneOff, 'stoneOff');
    }

    setupCollider(collidingObj, offBool, propName) {
        this.scene.physics.add.collider(collidingObj, this, () => {
            if (collidingObj.body.onFloor() && this[propName]) {
                
                switch (this.frame.customData.filename) {
                    case 'unbroken':
                        this.setFrame('broken1');
                        break;
                    case 'broken1': 
                        this.setFrame('broken2');
                        break;
                    case 'broken2':
                        this.setAlpha(0);
                        this.disableBody();
                        break;
                }
                this[propName] = false; //i want the actual property to update which is why this has to be written a bit weird
            }
        })
    }
}

class Teleporter extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, to_X, to_Y, orientation) {
        super(scene, x, y, "spriteAtlas", "teleporter");
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false).setImmovable();
        this.setBodySize(240, 6);
        switch (orientation) {
            case 1: //upside down
                this.setAngle(180);
                this.body.setOffset(0, 0);
                break;
            default:
                this.body.setOffset(0, 26);
                break;
        }
        this.resetX = this.x;
        this.resetY = this.y;
        scene.physics.add.overlap(scene.stone, this, () => {
            scene.stone.setPosition(to_X, to_Y); //sends stone to next teleporter
        })

    }
}

export default class GameplayPrototypeLevel3 extends Phaser.Scene {
    constructor() {
        super('core-gameplay-level3');
    }

    init() {
        this.past = true;
        this.W = this.game.config.width; // 1280 under normal circumstances
        this.H = this.game.config.height; // 720
        this.W / 1280;
        this.CX = this.W * 0.5; //center x and y
        this.CY = this.H * 0.5;
    }

    create() {
        // ---------------------------------------------------------------------------------------------
        // Tile map
        // -----------------------------------------------------------------------------------------------
        this.level2map = this.make.tilemap({key: "level2tilemap"});
        this.level2tiles = this.level2map.addTilesetImage("level2tiles", "level2tiles", 80, 80);
        this.layer1 = this.level2map.createLayer("Tile Layer 1", this.level2tiles, 0, 0);
        this.layer1.setCollisionFromCollisionGroup();
        // ---------------------------------------------------------------------------------------------
        // "present" stuff
        // ----------------------------------------------------------------------------------------------
        
        //this.teleporter1 = this.physics.add.image(120 , 336 , "spriteAtlas", "teleporter").setAngle(180);
        this.stone = this.physics.add.image(1160 , 80 , "spriteAtlas", "stone");

        this.add.image(1160 , 80 , "spriteAtlas", "pipe");

        this.door = this.physics.add.image(240 , 80 , "spriteAtlas", "door");
        this.door.body.setAllowGravity(false).setImmovable().setDirectControl();

        // --------------------------------------------------------------------------------------------------
        // basic player stuff
        // --------------------------------------------------------------------------------------------------
        this.player = this.physics.add.sprite(80 , 80 , "player", 0).setScale(0.3);
        
        //Player physics
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.layer1);
        this.physics.add.collider(this.player, this.door);
        this.physics.add.collider(this.layer1, this.stone, () => {
            this.stone.disableBody(); //there's actually supposed to be a button that the stone lands on to open the door, but im super tired rn
            this.tweens.chain({
                targets: this.door,
                tweens: [
                    {
                        y: {from: this.door.y, to: this.door.y + 6 },
                        duration: 500,
                        ease: "Cubic.easeOut"
                    },
                    {
                        y: {from: this.door.y, to: -86 },
                        duration: 1000,
                        ease: "Cubic.easeIn"
                    }
                ]
            })

        })

        this.player.body.setMaxVelocity(600 );
        this.player.body.setDragX(900 );


        this.isJumping = false;

        //Keyboard input for player movement
        this.cursors = this.input.keyboard.createCursorKeys();

        //-------------------------------------------------------------------------------------------
        // adding breakable rock platforms & teleporters
        // NOTE: need to be added after player because their construction references the player
        //--------------------------------------------------------------------------------------------
        this.testRock = new Rock(this, 1160, 680); 
        this.rock1 = new Rock(this, 120, 680);     
        this.rock2 = new Rock(this, 1160, 440);
        this.teleporter1 = new Teleporter(this, 120, 336, 0, 0, 1);
        this.teleporter2 = new Teleporter(this, 840, 384, 120, 336, 0);
        this.teleporter3 = new Teleporter(this, 840, 16, 0, 0, 1);
        this.teleporter4 = new Teleporter(this, 1160, 496, 840, 16, 0);
        this.pastObjects = [this.rock1, this.rock2];
        this.futureObjects = [this.teleporter1, this.teleporter2, this.teleporter3, this.teleporter4];
        this.futureObjects.forEach((futureObject) => {
            futureObject.disableBody();
            futureObject.setAlpha(0);
        })
        //---------------------------------------------------------------------------------------------
        // past and future switch stuff
        //---------------------------------------------------------------------------------------------
        this.lever = this.physics.add.sprite(120, 120, "spriteAtlas", "lever");
        this.lever.body.setCircle(80, -40 , -20 ).setAllowGravity(false).setImmovable();
        this.lever.on('pointerdown', () => {
            if (this.past) {
                this.pastObjects.forEach((pastObject) => {
                    pastObject.disableBody();
                    pastObject.setAlpha(0);
                });
                this.futureObjects.forEach((futureObject) => {
                    futureObject.enableBody(true, futureObject.resetX, futureObject.resetY);
                    futureObject.setAlpha(1);
                })
                this.past = false;
            }
            else {
                this.futureObjects.forEach((futureObject) => {
                    futureObject.disableBody();
                    futureObject.setAlpha(0);
                });
                this.pastObjects.forEach((pastObject) => {
                    pastObject.enableBody(true, pastObject.resetX, pastObject.resetY);
                    pastObject.setAlpha(1);
                })
                this.past = true;
            }
        })

        //this.add.rectangle(100, 100, 100, 100, 0x00ff00);
        
        this.returnButton = this.add.rectangle(640, 650, 200, 50, 0x5a118a).setInteractive();
        //returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        this.returnButton.on('pointerup', ()=>{
            this.scene.start('level-select');
        });
        this.returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);

        this.pauseButton = this.add.rectangle(400, 300, 100, 100,0xFF0000).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.once('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.transition({
                target: 'pause',
                duration: 2000,
                sleep: true,
            });

        })
    }

    update() {
        const onFloor = this.player.body.onFloor();
        if (onFloor) {
            this.isJumping = false;
        }

        if (this.stone.body.onFloor()) {
            if ((this.stone.body.position.y == this.stone.body.prev.y)) {
                this.tweens.add({
                    targets: this.stone,
                    alpha: 0,
                    onComplete: () => {
                        this.stone.setPosition(1160 , 80 );
                        this.stone.body.setVelocityY(0);
                        this.stone.setAlpha(1);
                        this.rock1.stoneOff = true;
                        this.rock2.stoneOff = true;
                        this.testRock.stoneOff = true;
                    }
                });
            }
        }

        // Reduce horizontal drag while in-air so player retains momentum
        if (this.isJumping) {
            this.rock1.playerOff = true;
            this.rock2.playerOff = true;
            this.testRock.playerOff = true;
            this.player.body.setDragX(500);
        } else {
            this.player.body.setDragX(900);
        }

        // Keyboard movement
        const moveSpeed = 250 ;

        if (!(this.cursors.left.isDown && this.cursors.right.isDown)) {
            if (this.cursors.left.isDown) {
                if (this.player.body.velocity.x > -moveSpeed) {
                    this.player.setVelocityX(this.player.body.velocity.x - (25 ));
                }
            }
            else if (this.cursors.right.isDown) {
                if (this.player.body.velocity.x < moveSpeed) {
                    this.player.setVelocityX(this.player.body.velocity.x + (25 ));
                }
            }
        }

        if (this.cursors.up.isDown && onFloor) {
            this.isJumping = true;
            this.player.setVelocityY(-375 );
        }

        if (!this.physics.overlap(this.lever, this.player)) { // if the player is not in range of the lever
            this.lever.setFrame("lever"); // lever has no outline
            this.lever.disableInteractive(); // cannot click on lever
        }
        else {
            this.lever.setFrame("leverOutline"); // lever has outline
            this.lever.setInteractive(); // can interact with lever
        }
    }
}