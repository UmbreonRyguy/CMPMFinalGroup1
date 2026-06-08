












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
        this.CX = this.W * 0.5; //center x and y
        this.CY = this.H * 0.5;
    }

    flipToFuture() {
        const flash = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0xffffff) //screen flash
            .setAlpha(0)
            .setDepth(999);
        this.tweens.add({
            targets: flash,
            alpha: { from: 0.85, to: 0 },
            duration: 350,
            ease: 'Expo.Out',
            onComplete: () => flash.destroy()
        });
        this.overlay = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0xf9a039, 0.1);
    }

    flipToPast() {
        const flash = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0xffffff) //screen flash
            .setAlpha(0)
            .setDepth(999);
        this.tweens.add({
            targets: flash,
            alpha: { from: 0.85, to: 0 },
            duration: 350,
            ease: 'Expo.Out',
            onComplete: () => flash.destroy()
        });
        if(this.overlay){
            this.overlay.destroy();
        }
    }

    makeLeaves(num, size) {
        let leaves = [];
        for (let i = 0; i < num; i++) {
            leaves[i] = this.add.image(i*1280/num, - 50, 'leaf').setOrigin(0, 1).setScale(size + Math.random());
            if (Math.random() < 0.5) {
                leaves[i].flipX = true;
            }
            if (Math.random() < 0.3) {
                leaves[i].setTint(0xff9978);
            }
            if (Math.random() < 0.5) {
                leaves[i].setTint(0xffc3af);
            }
            this.tweens.add({
                targets: leaves[i],
                delay: Math.random() * 10000 + (i % 2) * 1000,
                y: 1280,
                alpha: 0.3,
                scale: 5,
                duration: 5000 + Math.random() * 10000,
                repeat: -1,
            });
            if (!leaves[i].flipX) {
                this.tweens.add({
                    targets: leaves[i],
                    rotation: {from: 0.1, to: -1.4},
                    x: {from: leaves[i].x - (100 + 50*Math.random()), to: leaves[i].x + (100 + 50*Math.random())},
                    yoyo: true,
                    duration: 2000 + Math.random() * 1000,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
            else {
                this.tweens.add({
                    targets: leaves[i],
                    rotation: {from: 1.4, to: -0.1},
                    x: {from: leaves[i].x - (100 + 50*Math.random()), to: leaves[i].x + (100 + 50*Math.random())},
                    yoyo: true,
                    duration: 2000 + Math.random() * 1000,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
    }

    create() {
        this.makeLeaves(50, 1);
        this.future_bg = this.add.rectangle(1280/2, 720/2, 1280, 720, 0x203030).setAlpha(0);

        // --------------------------------------------------------------------------------------------------------
        // Tile map
        // --------------------------------------------------------------------------------------------------------

        this.level3map = this.make.tilemap({key: "level3tilemap"});
        this.level3tiles = this.level3map.addTilesetImage("level3tiles", "level3tiles", 80, 80);
        this.layer1 = this.level3map.createLayer("Tile Layer 1", this.level3tiles, 0, 0);
        this.layer1.setCollisionFromCollisionGroup();

        // --------------------------------------------------------------------------------------------------------
        // MUSIC
        // --------------------------------------------------------------------------------------------------------

        this.anySoundPlaying = this.sound.getAllPlaying().length > 0;
        if(this.anySoundPlaying){
            this.sound.stopByKey('mainMenuTheme');
        }

        this.music = this.sound.add('inGameTheme');
        var musicPlaying = false;

        if (this.registry.get('musicEnabled')) {
            if (!musicPlaying) {
                    this.music.loop = true;
                    this.music.play();
                    musicPlaying = true;
                }
            }
        else{
            this.sound.stopByKey('inGameTheme');
            musicPlaying = false;
        }

        // --------------------------------------------------------------------------------------------------------
        // "present" stuff
        // --------------------------------------------------------------------------------------------------------
        
        //this.teleporter1 = this.physics.add.image(120 , 336 , "spriteAtlas", "teleporter").setAngle(180);
        this.stone = this.physics.add.image(1160 , 80 , "spriteAtlas", "stone");

        this.button = this.physics.add.image(840, 631, "spriteAtlas", "button").setToBack();
        this.button.body.setAllowGravity(0).setImmovable().setDirectControl();

        this.buttonBase = this.add.image(840, 636, "spriteAtlas", "buttonBase");

        this.add.image(1160 , 80 , "spriteAtlas", "pipe");
        this.jumpSound = this.sound.add('shorthop');

        this.door = this.physics.add.image(240 , 80 , "spriteAtlas", "door");
        this.door.body.setAllowGravity(false).setImmovable().setDirectControl();

        // --------------------------------------------------------------------------------------------------------
        // basic player stuff
        // --------------------------------------------------------------------------------------------------------

        this.player = this.physics.add.sprite(80 , 80 , "playerS", 0).setScale(1);
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('playerS', { frames: [0, 1] }),
            frameRate: 8,
            repeat: -1
        });
        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('playerS', { frames: [2] }),
            frameRate: 1,
            repeat: 0
        });
        
        //Player physics
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.layer1);
        this.physics.add.collider(this.player, this.door);
        this.physics.add.collider(this.button, this.stone, () => {
            this.tweens.chain({
                targets: [this.door, this.button, this.stone],
                tweens: [
                    {
                        targets: [this.button, this.stone],
                        onStart: () => {
                            this.stone.body.setAllowGravity(false);
                            this.stone.setY(this.button.y - 13);
                            this.stone.body.setDirectControl();
                        },
                        y: '+=10',
                        duration: 100
                    },
                    {
                        targets: this.door,
                        y: {from: this.door.y, to: this.door.y + 6 },
                        duration: 500,
                        ease: "Cubic.easeOut"
                    },
                    {
                        targets: this.door,
                        y: {from: this.door.y + 6, to: -86 },
                        duration: 1000,
                        ease: "Cubic.easeIn"
                    }
                ]
            });
        });
        this.physics.add.collider(this.stone, this.layer1);

        this.player.body.setMaxVelocity(600);
        this.player.body.setDragX(900);


        this.isJumping = false;
        this.justLanded = false;

        //Keyboard input for player movement
        this.cursors = this.input.keyboard.createCursorKeys();

        // --------------------------------------------------------------------------------------------------------
        // Scene inventories 
        // --------------------------------------------------------------------------------------------------------
        
        this.trashInventory = [] //keep track of the trash here
        this.treasureInventory = [] //keep track of the treasure here

        // -------------------------------------------------------------------
        // function to keep track of inventories
        // -------------------------------------------------------------------

        /**
        * Tests if the player has expected number of items in inventory.
        * @param {int} number number of expected items
        * @param {array} Inventory the inventory I'm checking
        * @returns {boolean}
        */
        this.hasAllItem = (number, Inventory) => Inventory.length == number;

        // --------------------------------------------------------------------------------------------------------
        // Prefab class definition
        // --------------------------------------------------------------------------------------------------------

        //base class 
        class Collectible extends Phaser.Physics.Arcade.Image{
            constructor(scene, x, y, texture){
                super(scene, x, y, texture)
                .setInteractive()
                .setScale(0.5)
                scene.add.existing(this)
                scene.physics.add.existing(this)
                this.body.allowGravity = false
                this.pickupWord = texture;
            }

            getInventory(){
                //override in subclasses
                return null;
            }

            gainItem(item){
                let Inventory = this.getInventory();
                if (Inventory.includes(item)) {
                    console.warn('gaining item already held:', item);
                    return;
                }

                const message = this.scene.add.text(this.x, this.y + 20, "You picked up some " + this.pickupWord + "!").setAlpha(0).setColor('#ffffff');
                this.scene.tweens.add({
                    targets: message,
                    alpha: {from:1, to: 0},
                    duration: 3000,
                    ease: 'linear' 
                });
                
                Inventory.push(item);
            }

        }
        //adding a group for trash so they all get collected when overlapping with player
        //this.trashGroup = this.physics.add.group();

        // --------------------------------------------------------------------------------------------------------
        // prefab for trash
        // --------------------------------------------------------------------------------------------------------

        class TrashInfo extends Collectible{
            constructor(scene, x, y, keyword){
                super(scene, x, y, 'trash');
                //let trashMessage = scene.add.text(this.x, this.y-10, "Someone left trash here.").setColor('#ffffff').setAlpha(0)
                //this.on('pointerover', () => trashMessage.setAlpha(1))
                this.on('pointerdown', () =>{
                    this.scene.tweens.add({
                        targets: this,
                        angle: {from: 0, to: 7},
                        duration: 100,
                        yoyo: true,
                        repeat: 3
                    })
                })
                .on('pointerout', () => this.setAngle(0))
                //scene.trashGroup.add(this)
                //let overlapped = false;
                
                scene.physics.add.overlap(scene.player, this, ()=>{
                    this.gainItem(keyword);
                    this.scene.tweens.add({
                        targets: this, 
                        alpha: {from: 1, to: 0},
                        duration: 500,
                        onComplete: ()=> {this.destroy()
                        }
                      });
                });
            }

            getInventory(){
                return this.scene.trashInventory;
            }
        }

        // --------------------------------------------------------------------------------------------------------
        // prefab for Treasure
        // --------------------------------------------------------------------------------------------------------

        class TreasureInfo extends Collectible{
            constructor(scene, x, y, keyword){
                super(scene, x, y, 'treasure');
                this.resetX = x;
                this.resetY = y;
                this.active = false;
                //scene.add.existing(this)
                //let treasureMessage = scene.add.text(this.x, this.y-10, "ooo treasure").setColor('#ffffff').setAlpha(0)
                //this.on('pointerover', () => treasureMessage.setAlpha(1))
                //.on('pointerout', () => treasureMessage.setAlpha(0))
                this.on('pointerdown', () =>{
                    this.scene.tweens.add({
                        targets: this,
                        angle: {from: 0, to: 360},
                        duration: 300,
                        repeat: 3
                    })
                });
                
                scene.physics.add.overlap(scene.player, this, ()=>{
                    this.gainItem(keyword);
                    this.scene.tweens.add({
                        targets: this, 
                        alpha: {from: 1, to: 0},
                        duration: 500,
                        onComplete: ()=> {
                            //this.destroy(); 
                            this.scene.scene.start('end-scene');
                        }
                    });

                });

                this.setAlpha(0).setInteractive(false).disableBody();

                /*.on('pointerdown', () => {
                    treasureMessage.setAlpha(0);
                    this.gainItem(keyword);
                    this.scene.tweens.add({
                        targets: this, 
                        alpha: {from: 1, to: 0},
                        duration: 500,
                        onComplete: ()=> {this.destroy(); 
                            treasureMessage.destroy();
                        }
                    });
                })*/
            }
                
            getInventory(){
                return this.scene.treasureInventory;
            }

            appear() {
                this.setAlpha(1).setInteractive(true).enableBody(true, this.resetX, this.resetY);
                this.active = true;
            }

        }

        // --------------------------------------------------------------------------------------------------------
        // Adding trash and treasure
        // --------------------------------------------------------------------------------------------------------

        this.trash = new TrashInfo(this, 300, 530, 'trash'); 
        this.trash2 = new TrashInfo(this, 920, 610, 'trash2');

        this.treasure = new TreasureInfo(this, 600, 230, 'treasure');

        this.trashInventCheck = this.add.text(600, 200, "Has the player collected all trash?").setAlpha(0);
        this.treasureInventCheck = this.add.text(600, 220, "Has the player collected all treasure?").setAlpha(0);

        // --------------------------------------------------------------------------------------------------------
        // Adding breakable rock platforms & teleporters
        // NOTE: need to be added after player because their construction references the player
        // --------------------------------------------------------------------------------------------------------

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
        });

        // --------------------------------------------------------------------------------------------------------
        // past and future switch stuff
        // --------------------------------------------------------------------------------------------------------

        this.timestatetext =this.add.text(40, 30, "PAST", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '60px'
        });
        this.lever = this.physics.add.sprite(120, 120, "spriteAtlas", "lever");
        this.lever.body.setCircle(80, -40 , -20 ).setAllowGravity(false).setImmovable();
        this.lever.on('pointerdown', () => {
            if (this.past) {
                this.future_bg.setAlpha(1);
                this.lever.flipX = true;
                this.timestatetext.text = "FUTURE";
                this.flipToFuture();
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
                this.future_bg.setAlpha(0);
                this.lever.flipX = false;
                this.timestatetext.text = "PAST";
                this.flipToPast();
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

        // --------------------------------------------------------------------------------------------------------
        // UI
        // --------------------------------------------------------------------------------------------------------

        this.pauseButton = this.add.image(1200, 70, "pauseIcon").setOrigin(0.5).setScale(2).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.on('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.pause();
            this.scene.launch('pause', { resumeKey: 'core-gameplay-level3' });
        });
        this.helpTip = this.add.text(this.W/2, 25, "Toggle the lever to activate the teleporters and use them \nto help the rock activate the button!", {
            fontSize: '18px',
            fontFamily: 'pixel'
        }).setAlpha(1).setOrigin(0.5);

        // -------------------------------------------------------------------
        // touch UI
        // -------------------------------------------------------------------

        this.leftButton = this.add.image((1280*2/16), (720*4.7/6), 'arrowButton')
            .setScale(4)
            .setAlpha(0.5)
            .setAngle(270)
            .setInteractive();
        this.touchLeft = false;

        this.rightButton = this.add.image(1280*4.5/16, (720*4.7/6), 'arrowButton')
            .setScale(4)
            .setAlpha(0.5)
            .setAngle(90)
            .setInteractive();
        this.touchRight = false;

        this.jumpButton = this.add.image(1280*14/16, (720*4.7/6), 'jumpButton')
            .setScale(4)
            .setAlpha(0.5)
            .setInteractive();
        this.touchJump = false;

        // this.interactButton = this.add.rectangle(1280*14/16, 720*3.5/6, 75, 75, 0xffff00)
        //     .setScale(2)
        //     .setAlpha(0.5)
        //     .setInteractive();
        
        this.leftButton.on('pointerout', () => {
            this.touchLeft = false;
        });
        this.leftButton.on('pointerup', () => {
            this.touchLeft = false;
        });
        this.leftButton.on('pointerover', () => {
            this.touchLeft = true;
        });

        this.rightButton.on('pointerout', () => {
            this.touchRight = false;
        });
        this.rightButton.on('pointerup', () => {
            this.touchRight = false;
        });
        this.rightButton.on('pointerover', () => {
            this.touchRight = true;
        });

        this.jumpButton.on('pointerout', () => {
            this.touchJump = false;
        });
        this.jumpButton.on('pointerup', () => {
            this.touchJump = false;
        });
        this.jumpButton.on('pointerover', () => {
            this.touchJump = true;
        });
        //this.add.rectangle(100, 100, 100, 100, 0x00ff00);
        
        // this.returnButton = this.add.rectangle(640, 650, 200, 50, 0x5a118a).setInteractive();
        // //returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        // this.returnButton.on('pointerup', ()=>{
        //     this.scene.start('level-select');
        // });
        // this.returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);

        // this.pauseButton = this.add.rectangle(400, 300, 100, 100,0xFF0000).setInteractive();
        // //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        // this.pauseButton.once('pointerup', ()=> {
        //     console.log("pause button clicked");
        //     this.scene.transition({
        //         target: 'pause',
        //         duration: 2000,
        //         sleep: true,
        //     });

        // })
    }

    update() {
        const onFloor = this.player.body.onFloor();

        if (onFloor && this.isJumping) {
            this.isJumping = false;
            this.justLanded = true;
        } else if (onFloor) {
            this.justLanded = false;
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
                    }
                });
            }
        }

        // Reduce horizontal drag while in-air so player retains momentum

        if (this.isJumping) {
            this.rock1.playerOff = true;
            this.rock2.playerOff = true;
            this.player.body.setDragX(500);
        } else {
            this.player.body.setDragX(900);
        }
        
        // --------------------------------------------------------------------------------------------------------
        // Movement
        // --------------------------------------------------------------------------------------------------------

        const moveSpeed = 250;
        const movingLeft  = this.cursors.left.isDown  || this.touchLeft;
        const movingRight = this.cursors.right.isDown || this.touchRight;
        const bothPressed = (this.cursors.left.isDown && this.cursors.right.isDown) || (this.touchLeft && this.touchRight);


        if (!bothPressed) {
            if (movingLeft) {
                if (this.player.body.velocity.x > -moveSpeed)
                    this.player.setVelocityX(this.player.body.velocity.x - 25);
                this.player.play('walk', true);
                this.player.setFlipX(true);
            } else if (movingRight) {
                if (this.player.body.velocity.x < moveSpeed)
                    this.player.setVelocityX(this.player.body.velocity.x + 25);
                this.player.play('walk', true);
                this.player.setFlipX(false);
            }
        }

        // --------------------------------------------------------------------------------------------------------
        // Anims
        // --------------------------------------------------------------------------------------------------------

        if (this.isJumping) {
            if (this.player.anims.currentAnim?.key !== 'jump') this.player.play('jump');
        } else if (onFloor) {
            if (this.justLanded) {
                this.tweens.killTweensOf(this.player);
                this.player.setScale(1, 1);
                this.justLanded = false;
            }
            if (movingLeft || movingRight) {
                 if (this.player.anims.currentAnim?.key !== 'walk') this.player.play('walk');
            } 
            else {
                this.player.anims.stop();
                this.player.setFrame(0);
            }
        }

        // --------------------------------------------------------------------------------------------------------
        // Jump
        // --------------------------------------------------------------------------------------------------------

        const jumpCaption = this.add.text(1280/2, 600, '*boing*', {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '50px'
        })
        .setOrigin(0.5).setAlpha(0);

        const mushroomCaption = this.add.text(1280/2, 600, '*bwoump*', {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '50px'
        })
        .setOrigin(0.5).setAlpha(0);

        if ((this.cursors.up.isDown || this.touchJump) && onFloor) {
            this.isJumping = true;
            this.justLanded = false;

            this.tweens.killTweensOf(this.player); //stop current tweens
            this.player.setScale(0.39, 0.18);
            this.tweens.add({ //jump anim
                targets: this.player,
                scaleX: { from: 1.3, to: 0.75 },
                scaleY: { from: 0.6, to: 1.4 },
                duration: 250,
                ease: 'Quad.Out'
            });
            // Jump higher on mushroom platform in past mode
            /*
            if (this.past && this.player.body.touching.down && this.platform.touching.up) {
                    if (this.registry.get('sfxEnabled')) {
                    this.jumpSound.play({rate: 0.3 + Math.random() * 0.2});
                    mushroomCaption.setAlpha(1);
                    this.player.setVelocityY(-700);
                    this.tweens.add({
                        targets: mushroomCaption,
                        alpha: 0,
                        ease: 'linear',
                        duration: 1000
                    });
                }
            }
            else {
                if (this.registry.get('sfxEnabled')) {
                    this.jumpSound.play({rate: 0.7 + Math.random() * 0.3});
                    jumpCaption.setAlpha(1);
                    this.player.setVelocityY(-475);
                    this.tweens.add({
                        targets: jumpCaption,
                        alpha: 0,
                        ease: 'linear',
                        duration: 1000
                    });
                }
            }
                */
            if (this.registry.get('sfxEnabled')) {
                this.jumpSound.play({rate: 0.7 + Math.random() * 0.3});
                jumpCaption.setAlpha(1);
                this.player.setVelocityY(-475);
                this.tweens.add({
                    targets: jumpCaption,
                    alpha: 0,
                    ease: 'linear',
                    duration: 1000
                });
            }
        }

        // --------------------------------------------------------------------------------------------------------
        // lever interactions
        // --------------------------------------------------------------------------------------------------------

        if (!this.physics.overlap(this.lever, this.player)) { // if the player is not in range of the lever
            this.lever.setFrame("lever"); // lever has no outline
            this.lever.disableInteractive(); // cannot click on lever
        }
        else {
            this.lever.setFrame("leverOutline"); // lever has outline
            this.lever.setInteractive(); // can interact with lever
        }

        // --------------------------------------------------------------------------------------------------------
        // Checking if inventory is full
        // --------------------------------------------------------------------------------------------------------

        if (this.hasAllItem(2, this.trashInventory)){
            this.trashInventCheck.setText("Has the player collected all trash? Yes!")
            if (this.treasure.active == false) {
                this.treasure.appear();
            }
        } else {
            this.trashInventCheck.setText("Has the player collected all trash? No")
        }

        if(this.hasAllItem(1, this.treasureInventory)){
            this.treasureInventCheck.setText("Has the player collected all treasure? Yes!")
        }else{
            this.treasureInventCheck.setText("Has the player collected all treasure? No")
        }

        /*if(this.physics.overlap(this.trashGroup, this.player)){

        }*/
    }
}