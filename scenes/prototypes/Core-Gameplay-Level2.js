export default class GameplayPrototypeLevel2 extends Phaser.Scene {
    constructor() {
        super('core-gameplay-level2');
    }

    init(data) {
        this.W = this.game.config.width; // 1280 under normal circumstances
        this.H = this.game.config.height; // 720
        this.CX = this.W * 0.5; //center x and y
        this.CY = this.H * 0.5;
        this.levelNum = data?.level || 1; // Get level from scene data, default to 1
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
        if(this.overlay){
            this.overlay.destroy();
        }
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
        this.overlay = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0xf9a039, 0.1);
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

    create(){
        // var to keep track of which game state the player is in
        this.past = false;
        this.itemsHeld = 0;
        this.jumpSound = this.sound.add('shorthop');
        this.isJumping = false;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.prev_time = 0;
        this.makeLeaves(50, 1);

        this.future_bg = this.add.rectangle(1280/2, 720/2, 1280, 720, 0x203030);

        //MUSIC
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

        //Keyboard input for player movement

        //------------------------------------------------
        //Scene inventories 
        //--------------------------------------------------------
        this.trashInventory = [] //keep track of the trash here
        this.treasureInventory = [] //keep track of the treasure here
        //function to keep track of inventories----------------------------------------
        //Test if the player has expected number of items in inventory.
            /**
            * @param {int} number number of expected items
            * @param {array} Inventory, the inventory I'm checking
            * @returns {boolean}
            */
            this.hasAllItem = (number, Inventory) => Inventory.length == number;

        //------------------------------------------------------------
        //Prefab class definition
        //--------------------------------------------------
        //base class 
        class Collectible extends Phaser.GameObjects.Image{
            constructor(scene, x, y, texture){
                super(scene, x, y, texture)
                .setInteractive()
                .setScale(0.5)
                scene.add.existing(this)
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

                const message = this.scene.add.text(this.x, this.y + 20, "You picked up a thing!").setAlpha(0).setColor('#ffffff');
                this.scene.tweens.add({
                    targets: message,
                    alpha: {from:1, to: 0},
                    duration: 3000,
                    ease: 'linear' 
                });
                
                Inventory.push(item);
            }

        }

        //prefab for trash---------------------------------------------------------------------------------
        class TrashInfo extends Collectible{
            constructor(scene, x, y, keyword){
                super(scene, x, y, 'trash');
                let trashMessage = scene.add.text(this.x, this.y-10, "Someone left trash here.").setColor('#ffffff').setAlpha(0)
                this.on('pointerover', () => trashMessage.setAlpha(1))
                .on('pointerout', () => trashMessage.setAlpha(0))
                .on('pointerdown', () => {
                    trashMessage.setAlpha(0);
                    this.gainItem(keyword);
                    this.scene.tweens.add({
                        targets: this, 
                        alpha: {from: 1, to: 0},
                        duration: 500,
                        onComplete: ()=> {this.destroy(); 
                            trashMessage.destroy();
                        }
                    });
                })
            }

            //Don't know if this methood was overwritten correctly.
            getInventory(){
                //line below is causing errors
                return this.scene.trashInventory;
            }
        }

        //prefab for Treasure---------------------------------------------------------------------------------
        class TreasureInfo extends Collectible{
            constructor(scene, x, y, keyword){
                super(scene, x, y, 'treasure');
                scene.add.existing(this)
                let treasureMessage = scene.add.text(this.x, this.y-10, "ooo treasure").setColor('#ffffff').setAlpha(0)
                this.on('pointerover', () => treasureMessage.setAlpha(1))
                .on('pointerout', () => treasureMessage.setAlpha(0))
                .on('pointerdown', () => {
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
                })
            }
                
            getInventory(){
                return this.scene.treasureInventory;
            }

        }

        //----------------------------------------
        //TileMap
        //----------------------------------------
        const prototypeMap = this.make.tilemap({key: "lvl2tilemap"});
        const prototypeTiles = prototypeMap.addTilesetImage("Prototype_Tiles", "Prototype_Tiles", 80, 80);
        this.layer1 = prototypeMap.createLayer("Tile Layer 1", prototypeTiles, 0, 0);
        this.layer1.setCollisionFromCollisionGroup();

        this.add.rectangle(560, 460, 480, 60, 0x385a33);
        this.overlay = this.add.rectangle(this.CX, this.CY, this.W, this.H, 0xf9a039, 0.1);

        // ------------------------
        // PLAYER
        // ------------------------

        //Create Player sprite
        this.player = this.physics.add.sprite(880, 720 - 250, "playerS", 0).setScale(1);
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

        this.isJumping = false;
        this.justLanded = false;
        //Player physics
        this.player.setCollideWorldBounds(true);

        this.player.body.setMaxVelocity(600);
        this.player.body.setDragX(900);
        
        // Add player collider now that the tilemap is created
        this.physics.add.collider(this.player, this.layer1);

        this.platform = this.physics.add.body(400 - 80, 400, 480, 30).setAllowGravity(false).setImmovable();

        this.physics.add.collider(this.player, this.platform, () => {
            if (this.player.body.touching.down) {
                // small bounce while on mushroom
                // the real bounce happens in update if you press jump
                if (this.past == true) {
                    this.player.body.setVelocityY((this.player.body.velocity.y - 150));
                }
                else {
                    this.player.body.setVelocityX((this.player.body.velocity.x + 250));
                }
            }
        });

        this.platform2 = this.physics.add.body(1050 + 80, 275, 150, 28).setAllowGravity(false).setImmovable();

        this.physics.add.collider(this.player, this.platform2, () => {
            if (this.player.body.touching.down) {
                // small bounce while on mushroom
                // the real bounce happens in update if you press jump
                if (this.past == true) {
                    this.player.body.setVelocityY((this.player.body.velocity.y - 150));
                }
                else {
                    this.player.body.setVelocityX((this.player.body.velocity.x - 250));
                }
            }
        });

        this.platform3 = this.physics.add.body(50, 500, 220, 28).setAllowGravity(false).setImmovable();

        this.physics.add.collider(this.player, this.platform3, () => {
            if (this.player.body.touching.down) {
                // small bounce while on mushroom
                // the real bounce happens in update if you press jump
                if (this.past == true) {
                    this.player.body.setVelocityY((this.player.body.velocity.y - 250));
                }
                else {
                    this.player.body.setVelocityX((this.player.body.velocity.x + 250));
                }
            }
        });

        this.lever = this.physics.add.sprite(570, 120, "spriteAtlas", "lever");
        this.leverOutline = this.add.sprite(570, 120, "spriteAtlas", "leverOutline").setAlpha(0);
        this.lever.body.setCircle(80, -40 , -25).setAllowGravity(false).setImmovable();

        // mushroom - stored as instance properties for access from other methods
        this.mush1 = this.add.image(400 - 40, 400 + 15, "Prototype_Tiles", 21).setAlpha(0);
        this.mush2 = this.add.image(480 - 40, 400 + 15, "Prototype_Tiles", 22).setAlpha(0);
        this.mush3 = this.add.image(560 - 40, 400 + 15, "Prototype_Tiles", 22).setAlpha(0);
        this.mush4 = this.add.image(640 - 40, 400 + 15, "Prototype_Tiles", 22).setAlpha(0);
        this.mush5 = this.add.image(720 - 40, 400 + 15, "Prototype_Tiles", 22).setAlpha(0);
        this.mush6 = this.add.image(800 - 40, 400 + 15, "Prototype_Tiles", 23).setAlpha(0);

        this.mush11 = this.add.image(1050 + 115, 275 + 15, "Prototype_Tiles", 21).setAlpha(0);
        this.mush12 = this.add.image(1130 + 115, 275 + 15, "Prototype_Tiles", 23).setAlpha(0);

        this.mush21 = this.add.image(50 + 25, 500 + 15, "Prototype_Tiles", 21).setAlpha(0);
        this.mush22 = this.add.image(130 + 25, 500 + 15, "Prototype_Tiles", 22).setAlpha(0);
        this.mush23 = this.add.image(210 + 25, 500 + 15, "Prototype_Tiles", 23).setAlpha(0);

        // conveyor belt - stored as instance properties for access from other methods
        this.con1 = this.add.image(400 - 40, 400 + 15, "Prototype_Tiles", 14);
        this.con2 = this.add.image(480 - 40, 400 + 15, "Prototype_Tiles", 15);
        this.con3 = this.add.image(560 - 40, 400 + 15, "Prototype_Tiles", 15);
        this.con4 = this.add.image(640 - 40, 400 + 15, "Prototype_Tiles", 15);
        this.con5 = this.add.image(720 - 40, 400 + 15, "Prototype_Tiles", 15);
        this.con6 = this.add.image(800 - 40, 400 + 15, "Prototype_Tiles", 16);

        this.con11 = this.add.image(1050 + 115, 275 + 15, "Prototype_Tiles", 14);
        this.con12 = this.add.image(1130 + 115, 275 + 15, "Prototype_Tiles", 16);

        this.con21 = this.add.image(50 + 25, 500 + 15, "Prototype_Tiles", 14);
        this.con22 = this.add.image(130 + 25, 500 + 15, "Prototype_Tiles", 15);
        this.con23 = this.add.image(210 + 25, 500 + 15, "Prototype_Tiles", 16);

        // trash + treasure
        this.trash = new TrashInfo(this, 1230, 350, 'trash') ;
        this.trash2 = new TrashInfo(this, 920, 80, 'trash2');
        this.treasure = new TreasureInfo(this, 160, 175, 'treasure') ;

        this.timestatetext =this.add.text(40, 30, "FUTURE", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '60px'
        });

        this.lever.on('pointerdown', () => {
            console.log("Lever clicked! Current past state:", this.past);
            if (this.past == true) {
                this.lever.flipX = false;
                this.leverOutline.flipX = false;

                this.flipToFuture();

                this.timestatetext.text = "FUTURE";

                this.future_bg.setAlpha(1);

                this.mush1.setAlpha(0);
                this.mush2.setAlpha(0);
                this.mush3.setAlpha(0);
                this.mush4.setAlpha(0);
                this.mush5.setAlpha(0);
                this.mush6.setAlpha(0);

                this.mush11.setAlpha(0);
                this.mush12.setAlpha(0);

                this.mush21.setAlpha(0);
                this.mush22.setAlpha(0);
                this.mush23.setAlpha(0);

                this.platform.y -= 10;
                this.platform2.y -= 10;
                this.platform3.y -= 10;

                this.con1.setAlpha(1);
                this.con2.setAlpha(1);
                this.con3.setAlpha(1);
                this.con4.setAlpha(1);
                this.con5.setAlpha(1);
                this.con6.setAlpha(1);

                this.con11.setAlpha(1);
                this.con12.setAlpha(1);

                this.con21.setAlpha(1);
                this.con22.setAlpha(1);
                this.con23.setAlpha(1);

                this.past = false;
            }
            else {
                this.lever.flipX = true;
                this.leverOutline.flipX = true;

                this.flipToPast();

                this.future_bg.setAlpha(0);

                this.timestatetext.text = "PAST";

                this.con1.setAlpha(0);
                this.con2.setAlpha(0);
                this.con3.setAlpha(0);
                this.con4.setAlpha(0);
                this.con5.setAlpha(0);
                this.con6.setAlpha(0);

                this.con11.setAlpha(0);
                this.con12.setAlpha(0);

                this.con21.setAlpha(0);
                this.con22.setAlpha(0);
                this.con23.setAlpha(0);

                this.platform.y += 10;
                this.platform2.y += 10;
                this.platform3.y += 10;

                this.mush1.setAlpha(1);
                this.mush2.setAlpha(1);
                this.mush3.setAlpha(1);
                this.mush4.setAlpha(1);
                this.mush5.setAlpha(1);
                this.mush6.setAlpha(1);

                this.mush11.setAlpha(1);
                this.mush12.setAlpha(1);

                this.mush21.setAlpha(1);
                this.mush22.setAlpha(1);
                this.mush23.setAlpha(1);

                this.past = true;
            }
        });

        //----------------------------------------
        //UI
        //----------------------------------------

        this.pauseButton = this.add.image(1200, 70, "pauseIcon").setOrigin(0.5).setScale(2).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.on('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.pause();
            this.scene.launch('pause', { resumeKey: 'core-gameplay-level2' });
        })
        // --------------------
        // touch UI
        // --------------------
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

        if (false) {
            this.leftButton.x += -9999;
            this.rightButton.x += -9999;
            this.jumpButton.x += -9999;
            //this.interactButton.x += -9999;
        }

    }


    update() {
        //
        // player stuff
        //
        const onFloor = this.player.body.onFloor();
        if (onFloor && this.isJumping) {
            this.isJumping = false;
            this.justLanded = true;
        } else if (onFloor) {
            this.justLanded = false;
        }

        // Reduce horizontal drag while in-air so player retains momentum
        if (this.isJumping) {
            this.player.body.setDragX(500);
        } else {
            this.player.body.setDragX(900);
        }

        // Movement
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
        if (this.isJumping) {
            if (this.player.anims.currentAnim?.key !== 'jump') this.player.play('jump');
        } else if (onFloor) {
            if (this.justLanded) {
                this.tweens.killTweensOf(this.player);
                //this.player.setScale(1, 1);
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

        // Jump
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
                // scaleX: { from: 1.3, to: 0.75 },
                scaleX: { from: 1.5, to: 1 },
                // scaleY: { from: 0.6, to: 1.4 },
                scaleY: { from: 0.3, to: 1 },
                duration: 250,
                ease: 'Quad.Out'
            });

            // Jump higher on mushroom platform in past mode
            if (this.past && this.player.body.touching.down && (this.platform.touching.up || this.platform2.touching.up || this.platform3.touching.up)) {
                if (this.registry.get('sfxEnabled')) {
                    this.jumpSound.play({rate: 0.3 + Math.random() * 0.2});
                    mushroomCaption.setAlpha(1);
                    this.player.setVelocityY(-750);
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
        }

        // variable jump is dead and phaser killed it
        // if ((this.cursors.up.isDown || this.touchJump) && (Math.floor(time/10) != this.prev_time && Math.floor(time/10) % 5 == 0) && this.player.body.velocity.y < -100) {
        //     this.prev_time = Math.floor(time/10);
        //     this.player.setVelocityY(this.player.body.velocity.y - 13);
        // }

        // lever
        if (!this.physics.overlap(this.lever, this.player)) { // if the player is not in range of the lever
            this.leverOutline.setAlpha(0); // lever has no outline
            this.lever.disableInteractive(); // cannot click on lever
        }
        else {
            this.leverOutline.setAlpha(1); // lever has outline
            this.lever.setInteractive(); // can interact with lever
        }
    }
}