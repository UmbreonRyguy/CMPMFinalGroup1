export default class GameplayPrototype extends Phaser.Scene {
    W = 1280;
    H = 720;
    constructor() {
        super('core-gameplay');
    }
    
    updateItemText() {
        this.itemText.destroy();
        itemText = this.add.text(W/2, H/5, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
        this.itemText = itemText;
    }

    init(data){
        this.levelNum = data.level || 1;
    }

            
    
    create() {

        //------------------------------------------------------------
        //Prefab class definition
        //--------------------------------------------------
        //prefab for trash---------------------------------------------------------------------------------
        class TrashInfo extends Phaser.GameObjects.Image{
            constructor(scene, x, y){
                super(scene, x, y, 'trash');
                scene.add.existing(this)
                this.trashInventory = []
            }
            /**
             * @param {{trashInventory?: string[]}} data 
             * 
             */
            init(data){
                this.trashInventory = data.trashInventory || [];
            }

            /* updates the trash inventory

            */
            gainItemTrash(item){
            if (this.trashInventory.includes(item)) {
                console.warn('gaining item already held:', item);
                return;
            }
                const message = this.scene.add.text(this.x, this.y + 20, "You picked up trash!").setAlpha(0).setColor('#ffffff');
                this.scene.tweens.add({
                    targets: message,
                    alpha: {from:1, to: 0},
                    duration: 3000,
                    ease: 'linear' 
                });
                
                this.trashInventory.push(item);
            }

            /*
            decreaseTrashInventory(){

            }*/
                
            //Test if the player has all trash items in trashInventory
            /**
            * @param {int} item Item name.
            * @returns {boolean}
            */
            hasAllItemTrash(number) {
                if(this.trashInventory.length == number){
                    return true;
                }else{
                    return false;
                }
            }
        }
        //prefab for trash---------------------------------------------------------------------------------
        class TreasureInfo extends Phaser.GameObjects.Image{
            constructor(scene, x, y){
                super(scene, x, y, 'treasure');
                scene.add.existing(this)
                this.treasureInventory = []
            }
            /**
             * @param {{treasureInventory?: string[]}} data 
             * 
             */
            init(data){
                this.treasureInventory = data.treasureInventory || [];
            }

            gainItemTreasure(item){
            if (this.treasureInventory.includes(item)) {
                console.warn('gaining item already held:', item);
                return;
            }
                const message = this.scene.add.text(this.x, this.y + 20, "You picked up treasure!").setAlpha(0).setColor('#ffffff');
                this.scene.tweens.add({
                    targets: message,
                    alpha: {from:1, to: 0},
                    duration: 3000,
                    ease: 'linear' 
                });
                
                this.treasureInventory.push(item);
            }

            /*
            decreaseTreasureInventory(){

            }*/
                
            //Test if the player has all treasure items in treasureInventory
            /**
            * @param {int} item Item name.
            * @returns {boolean}
            */
            hasAllItemTreasure(number) {
                if(this.treasureInventory.length == number){
                    return true;
                }else{
                    return false;
                }
            }
        }
        //----------------------------------------
        //TileMap
        //----------------------------------------
        if(this.levelNum == 1){ //level 1
            const prototypeMap = this.make.tilemap({key: "prototypeTilemap"});
            const prototypeTiles = prototypeMap.addTilesetImage("Prototype_Tiles", "Prototype_Tiles", 80, 80);
            this.layer1 = prototypeMap.createLayer("Tile Layer 1", prototypeTiles, 0, 0);
            this.layer1.setCollisionFromCollisionGroup();

            // was there a better way to figure out how to add an outline to the lever?
            // probably. Do I care? No. It is 12 AM. Did I try a better way? Yes. For much too long.
            this.leverOutline = this.add.image(40, 202, "levers", "leverOutline").setAlpha(0);
            this.lever = this.physics.add.staticImage(40, 200, "levers", "lever");

            // idk why the hitbox is in a weird position either - 
            // changing x or y has seemed to have little effect so I just left it alone
            this.lever.body.setCircle(80, -80, -40);

            // mushroom
            const mush1 = this.add.image(480, 400, "Prototype_Tiles", 21).setAlpha(0);
            const mush2 = this.add.image(560, 400, "Prototype_Tiles", 22).setAlpha(0);
            const mush3 = this.add.image(640, 400, "Prototype_Tiles", 23).setAlpha(0);

            // conveyor belt
            const con1 = this.add.image(480, 400, "Prototype_Tiles", 14);
            const con2 = this.add.image(560, 400, "Prototype_Tiles", 15);
            const con3 = this.add.image(640, 400, "Prototype_Tiles", 16);

            const itemText = this.add.text(1200, 200, "item for player to pick up", {color: "#ffffff", backgroundColor: '#e03f3f', padding: { x: 20, y: 10 }}).setInteractive();
            this.itemText = this.add.text(640, 360, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
            itemText.on('pointerup',()=>{
                itemText.destroy();
                this.itemsHeld += 1;
                this.updateItemText();
            });

            //added trash object for player to interact with
            //let trash = this.add.image(100, 220, "trash")
            this.trash = new TrashInfo(this, 100, 220) 
                .setScale(0.5)
                .setInteractive()
                let trashMessage = this.trash.scene.add.text(100, 210, "Someone left trash here.").setColor('#ffffff').setAlpha(0)
                this.trash.on('pointerover', () => trashMessage.setAlpha(1))
                .on('pointerout', () => trashMessage.setAlpha(0))
                .on('pointerdown', () => {
                    trashMessage.setAlpha(0);
                    this.trash.gainItemTrash('trash');
                    this.trash.scene.tweens.add({
                        targets: this.trash, 
                        alpha: {from: 1, to: 0},
                        duration: 500,
                        onComplete: ()=> this.trash.destroy()
                    });
                })

            this.trash2 = new TrashInfo(this, 950, 370) 
                .setScale(0.5)
                .setInteractive()
                let trashMessage2 = this.trash2.scene.add.text(this.trash2.x, this.trash2.y - 10, "Someone left more trash here.").setColor('#ffffff').setAlpha(0)
                this.trash2.on('pointerover', () => trashMessage2.setAlpha(1))
                .on('pointerout', () => trashMessage2.setAlpha(0))
                .on('pointerdown', () => {
                    trashMessage2.setAlpha(0);
                    this.trash2.gainItemTrash('trash2');
                    this.trash2.scene.tweens.add({
                        targets: this.trash2, 
                        alpha: {from: 1, to: 0},
                        duration: 500,
                        onComplete: ()=> this.trash2.destroy()
                    });
                })

                this.trashInventCheck = this.add.text( 600, 200, "Has the player collected all trash?")

                this.treasure = new TreasureInfo(this, 1000, 130) 
                .setScale(0.5)
                .setInteractive()
                let treasureMessage = this.treasure.scene.add.text(1000, 130, "Someone left treasure here.").setColor('#ffffff').setAlpha(0)
                this.treasure.on('pointerover', () => treasureMessage.setAlpha(1))
                .on('pointerout', () => treasureMessage.setAlpha(0))
                .on('pointerdown', () => {
                    treasureMessage.setAlpha(0);
                    this.treasure.gainItemTreasure('treasure');
                    this.treasure.scene.tweens.add({
                        targets: this.treasure, 
                        alpha: {from: 1, to: 0},
                        duration: 500,
                        onComplete: ()=> this.treasure.destroy()
                    });
                })


            
        }
        else if(this.levelNum == 2){ //level 2

        }
        else{ //level 3

        }
        this.platform = this.physics.add.body(440, 386, 240, 28).setAllowGravity(false).setImmovable();

        //--------------------------------------
        // image physics stuff
        //---------------------------------------

        

        // var to keep track of which game state the player is in
        this.past = false;
        

        this.itemsHeld = 0;
        //this.add.rectangle(100, 100, 100, 100, 0x00ff00); 

        //
        // player stuff
        //

        this.jumpSound = this.sound.add('shorthop');

        //Create Player sprite
        this.player = this.physics.add.sprite(800, 500, "player", 0).setScale(0.3);
        
        //Player physics
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, this.layer1);
        // this.physics.add.collider(this.player, mush, () => {
        //     if (this.player.touching.down && mush.body.touching.up){
        //         //make jump up big
                
        //     }  
        // });

        // if the player hits the top of the conveyor belt, most fast to the left,
        // if the player hits the top of the mushroom, bounce
        this.physics.add.collider(this.player, this.platform, () => {
            if (this.player.body.touching.down && this.platform.touching.up) {
                if (this.past == true) {
                    this.player.setVelocityY(this.player.body.velocity.y - 250);
                }
                else {
                    this.player.setVelocityX(this.player.body.velocity.x - 50);
                }
            }
        });

        // if player clicks on lever, switch past to future or future to past;
        // only works when player is near the switch
        this.lever.on('pointerdown', () => {
            if (this.past == true) {
                mush1.setAlpha(0);
                mush2.setAlpha(0);
                mush3.setAlpha(0);

                con1.setAlpha(1);
                con2.setAlpha(1);
                con3.setAlpha(1);

                this.past = false;
            }
            else {
                con1.setAlpha(0);
                con2.setAlpha(0);
                con3.setAlpha(0);

                mush1.setAlpha(1);
                mush2.setAlpha(1);
                mush3.setAlpha(1);

                this.platform.setSize(240, 28).reset(440, 391);

                this.past = true;
            }
            //console.log("bean");
        });
        


        this.player.body.setMaxVelocity(600);
        this.player.body.setDragX(900);


        this.isJumping = false;

        //Keyboard input for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
        
        
        //----------------------------------------
        //UI
        //----------------------------------------

        const returnButtonText = this.add.text(1200, 100, "Return to Menu", {color: "#fffcfc", backgroundColor: '#3f1352', padding: { x: 20, y: 10 }}).setOrigin(0.5).setInteractive();
        returnButtonText.on('pointerdown', ()=> returnButtonText.setTint(0x965A0B));
        returnButtonText.on('pointerup', ()=>{
            this.sound.stopByKey('mainMenuTheme');
            this.scene.start('main-menu');
        });

        const endSceneText = this.add.text(1200, 150, "Go to end scene", {color: "#ffffff", backgroundColor: '#3f1352', padding: { x: 20, y: 10 }}).setOrigin(0.5).setToTop().setInteractive();
        endSceneText.on('pointerdown', ()=> endSceneText.setTint(0x965A0B));
        endSceneText.on('pointerup', ()=>{
            this.scene.start('end-scene', { itemsHeld: this.itemsHeld });
        });

        this.pauseButton = this.add.image(1200, 50, "pauseIcon").setOrigin(0.5).setScale(2).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.on('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.pause();
            this.scene.launch('pause', { resumeKey: 'core-gameplay' });
        })
        
        //
        // touch UI
        //
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
        
        //---------------------------
        //Game Objects
        //--------------------------
    }

    

    update() {
        //
        // player stuff
        //
        const onFloor = this.player.body.onFloor();
        if (onFloor) {
            this.isJumping = false;
        }

        // Reduce horizontal drag while in-air so player retains momentum
        if (this.isJumping) {
            this.player.body.setDragX(500);
        } else {
            this.player.body.setDragX(900);
        }

        // Movement
        const moveSpeed = 250;

        if (!(this.cursors.left.isDown && this.cursors.right.isDown) && !(this.touchLeft && this.touchRight)) {
            if (this.cursors.left.isDown || this.touchLeft) {
                if (this.player.body.velocity.x > -moveSpeed) {
                    this.player.setVelocityX(this.player.body.velocity.x - 25);
                }
            }
            else if (this.cursors.right.isDown || this.touchRight) {
                if (this.player.body.velocity.x < moveSpeed) {
                    this.player.setVelocityX(this.player.body.velocity.x + 25);
                }
            }
        }

        // Jump
        if ((this.cursors.up.isDown || this.touchJump) && onFloor) {
            this.isJumping = true;
            if (this.past && this.player.body.touching.down && this.platform.touching.up) {
                this.jumpSound.play({rate: 0.3 + Math.random() * 0.2});
                this.player.setVelocityY(-500);
            }
            else {
                this.jumpSound.play({rate: 0.7 + Math.random() * 0.3});
                this.player.setVelocityY(-375);
            }
        }

        // variable jump height
        if ((this.cursors.up.isDown || this.touchJump) && this.player.body.velocity.y < -75) {
            this.player.setVelocityY(this.player.body.velocity.y - 3);
        }

        //let answer
        if (this.trash.hasAllItemTrash(2)){
            this.trashInventCheck.setText("Has the player collected all trash? Yes!")
        } else {
            this.trashInventCheck.setText("Has the player collected all trash? No")
        }

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