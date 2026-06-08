export default class GameplayPrototype extends Phaser.Scene {
    constructor() {
        super('core-gameplay');
    }

    init(data) {
        this.W = this.game.config.width; // 1280 under normal circumstances
        this.H = this.game.config.height; // 720
        this.CX = this.W * 0.5; //center x and y
        this.CY = this.H * 0.5;
        this.levelNum = data?.level || 1; // Get level from scene data, default to 1
    }
    
    updateItemText() {
        this.itemText.destroy();
        itemText = this.add.text(this.W/2, this.H/5, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
        this.itemText = itemText;
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
        console.log("hi");
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

    create(){
        // var to keep track of which game state the player is in

        this.past = false;
        this.itemsHeld = 0;      
        this.jumpSound = this.sound.add('shorthop');
        this.isJumping = false;
        this.cursors = this.input.keyboard.createCursorKeys();
        this.prev_time = 0;


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

        this.events.on('resume', (sys, data) => { //check again on scene resume
            // Update global Tone mute on resume
            Tone.Destination.mute = !this.registry.get('sfxEnabled');
            
            if (this.registry.get('musicEnabled')) {
                if (!musicPlaying) {
                    this.music.loop = true;
                    this.music.play();
                    musicPlaying = true;
                }
            }
            else {
                this.sound.stopByKey('mainMenuTheme');
                musicPlaying = false;
            }
        });
        
        // const itemText = this.add.text(1200, 200, "item for player to pick up", {color: "#ffffff", backgroundColor: '#e03f3f', padding: { x: 20, y: 10}}).setInteractive();
        // this.itemText = this.add.text(640, 360, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
        // itemText.on('pointerup',()=>{
        //     itemText.destroy();
        //     this.itemsHeld += 1;
        //     this.updateItemText();
        // });

        // this.pauseButton = this.add.text(1200, 50, "Pause", {color: "#ffffff", backgroundColor: '#333333', padding: { x: 20, y: 10}}).setOrigin(0.5).setSize(100, 100).setInteractive();
        // //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        // this.pauseButton.on('pointerup', ()=> {
        //     console.log("pause button clicked");
        //     this.scene.pause();
        //     this.scene.launch('pause', { resumeKey: 'core-gameplay' });
        // })
        
        //arrowbuttons
        // const jumpButton = this.add.image(50, 50, 'jumpButton').setInteractive();
        // jumpButton.setAlpha(0.5);
        // const leftButton = this.add.image(40, 50, 'leftButton').setInteractive();
        // leftButton.angle = 270;
        // leftButton.setAlpha(0.5);
        // const rightButton = this.add.image(60, 50, 'rightButton').setInteractive();
        // leftButton.angle = 90;
        // leftButton.setAlpha(0.5);
        
        // ------------------------
        // PLAYER
        // ------------------------
    
        //Create Player sprite
        this.player = this.physics.add.sprite(600, 500, "playerS", 0).setScale(1);

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
        this.player.body.setMaxVelocity(600);
        this.player.body.setDragX(900);

        this.isJumping = false;
        this.justLanded = false;

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

        //Platform? maybe should be in Level 1?
        this.platform = this.physics.add.body(440, 386, 240, 28).setAllowGravity(false).setImmovable();
        // Add platform collider now that platform is created
        this.physics.add.collider(this.player, this.platform, () => {
            if (this.player.body.touching.down) {
                // small bounce while on mushroom
                // the real bounce happens in update if you press jump
                if (this.past == true) {
                    this.player.body.setVelocityY((this.player.body.velocity.y - 250));
                }
                else {
                    this.player.body.setVelocityX((this.player.body.velocity.x - 50));
                }
            }
        });
        //----------------------------------------
        //TileMap
        //----------------------------------------
            const prototypeMap = this.make.tilemap({key: "prototypeTilemap"});
            const prototypeTiles = prototypeMap.addTilesetImage("Prototype_Tiles", "Prototype_Tiles", 80, 80);
            this.layer1 = prototypeMap.createLayer("Tile Layer 1", prototypeTiles, 0, 0);
            this.layer1.setCollisionFromCollisionGroup();
            
            // Add player collider now that the tilemap is created
            this.physics.add.collider(this.player, this.layer1);

            // was there a better way to figure out how to add an outline to the lever?
            // probably. Do I care? No. It is 12 AM. Did I try a better way? Yes. For much too long.
            // this.leverOutline = this.add.image(40, 202, "levers", "leverOutline").setAlpha(0);
            // this.lever = this.physics.add.staticImage(40, 200, "levers", "lever");

            this.lever = this.physics.add.sprite(40, 202, "spriteAtlas", "lever");
            this.leverOutline = this.add.sprite(40, 202, "spriteAtlas", "leverOutline").setAlpha(0);
            this.lever.body.setCircle(80, -80 , -20).setAllowGravity(false).setImmovable();

            // idk why the hitbox is in a weird position either - 
            // changing x or y has seemed to have little effect so I just left it alone
            //this.lever.body.setCircle(80, -80, -40);

            // mushroom - stored as instance properties for access from other methods
            this.mush1 = this.add.image(480, 400, "Prototype_Tiles", 21).setAlpha(0);
            this.mush2 = this.add.image(560, 400, "Prototype_Tiles", 22).setAlpha(0);
            this.mush3 = this.add.image(640, 400, "Prototype_Tiles", 23).setAlpha(0);

            // conveyor belt - stored as instance properties for access from other methods
            this.con1 = this.add.image(480, 400, "Prototype_Tiles", 14);
            this.con2 = this.add.image(560, 400, "Prototype_Tiles", 15);
            this.con3 = this.add.image(640, 400, "Prototype_Tiles", 16);

            //added trash object for player to interact with
            //let trash = this.add.image(100, 220, "trash")
            this.trash = new TrashInfo(this, 100, 220, 'trash'); 

            this.trash2 = new TrashInfo(this, 950, 370, 'trash2') ;
    

            this.trashInventCheck = this.add.text( 600, 200, "Has the player collected all trash?").setAlpha(0);
            this.treasureInventCheck = this.add.text(600, 220, "Has the player collected all treasure?").setAlpha(0);



            this.treasure = new TreasureInfo(this, 1000, 130, 'treasure');

        this.lever.on('pointerdown', () => {
            console.log("Lever clicked! Current past state:", this.past);
            if (this.past == true) {
                console.log("Switching to future - hiding mushrooms, showing conveyors");
                this.flipToFuture();
                this.mush1.setAlpha(0);
                this.mush2.setAlpha(0);
                this.mush3.setAlpha(0);

                this.con1.setAlpha(1);
                this.con2.setAlpha(1);
                this.con3.setAlpha(1);

                this.platform.setSize(240, 28).reset(440, 386);

                this.past = false;
            }
            else {
                console.log("Switching to past - showing mushrooms, hiding conveyors");
                this.flipToPast();
                this.con1.setAlpha(0);
                this.con2.setAlpha(0);
                this.con3.setAlpha(0);

                this.mush1.setAlpha(1);
                this.mush2.setAlpha(1);
                this.mush3.setAlpha(1);

                this.platform.setSize(240, 28).reset(440, 391);

                this.past = true;
            }
        });
        //----------------------------------------
        //UI
        //----------------------------------------

        // const returnButtonText = this.add.text(1200, 100, "Return to Menu", {color: "#fffcfc", backgroundColor: '#3f1352', padding: { x: 20, y: 10 }}).setOrigin(0.5).setInteractive();
        // returnButtonText.on('pointerdown', ()=> returnButtonText.setTint(0x965A0B));
        // returnButtonText.on('pointerup', ()=>{
        //     this.sound.stopByKey('mainMenuTheme');
        //     this.scene.start('main-menu');
        // });

        // const endSceneText = this.add.text(1200, 150, "Go to end scene", {color: "#ffffff", backgroundColor: '#3f1352', padding: { x: 20, y: 10 }}).setOrigin(0.5).setToTop().setInteractive();
        // endSceneText.on('pointerdown', ()=> endSceneText.setTint(0x965A0B));
        // endSceneText.on('pointerup', ()=>{
        //     this.scene.start('end-scene', { itemsHeld: this.itemsHeld });
        // });

        this.pauseButton = this.add.image(1200, 50, "pauseIcon").setOrigin(0.5).setScale(2).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.on('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.pause();
            this.scene.launch('pause', { resumeKey: 'core-gameplay' });
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

        this.helpTip = this.add.text(this.W/2, 25, "Collect the trash and reveal the treasure to finish the level!", {
            fontSize: '18px',
            fontFamily: 'pixel'
        }).setAlpha(1).setOrigin(0.5);

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


        //Animations
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

        //Checking if inventory is full
        if (this.hasAllItem(2, this.trashInventory)){
            this.trashInventCheck.setText("Has the player collected all trash? Yes!")
        } else {
            this.trashInventCheck.setText("Has the player collected all trash? No")
        }

        if(this.hasAllItem(1, this.treasureInventory)){
            this.treasureInventCheck.setText("Has the player collected all treasure? Yes!")
        }else{
             this.treasureInventCheck.setText("Has the player collected all treasure? No")
        }

        // Jump
        const jumpCaption = this.add.text(640, 600, 'boing', {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '20px'
        })
        .setOrigin(0.5).setAlpha(0);

        const mushroomCaption = this.add.text(640, 600, 'bwoump', {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '20px'
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
}