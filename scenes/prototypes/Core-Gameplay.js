export default class GameplayPrototype extends Phaser.Scene {
    W = 1280;
    H = 720;
    constructor() {
        super('core-gameplay');
    }
    
    updateItemText() {
        this.itemText.destroy();
        itemText = this.add.text(100, 180, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
        this.itemText = itemText;
    }
    
    create() {


        //----------------------------------------
        //TileMap
        //----------------------------------------
        const prototypeMap = this.make.tilemap({key: "prototypeTilemap"});
        const prototypeTiles = prototypeMap.addTilesetImage("Prototype_Tiles", "Prototype_Tiles", 80, 80);
        this.layer1 = prototypeMap.createLayer("Tile Layer 1", prototypeTiles, 0, 0);
        this.layer1.setCollisionFromCollisionGroup();
        this.debugGraphics = this.add.graphics();
        this.drawTileCollisions(this.debugGraphics);
        this.platform = this.physics.add.body(360, 311, 240, 48).setAllowGravity(false);

        //--------------------------------------
        // image physics stuff
        //---------------------------------------
        this.add.image(400, 320, "Prototype_Tiles", 21);
        this.add.image(480, 320, "Prototype_Tiles", 22);
        this.add.image(560, 320, "Prototype_Tiles", 23);

        //let conveyorBelt = this.add.image(400, 320, "Prototype_Tiles", 14);
        //this.add.image(480, 320, "Prototype_Tiles", 15);
        //this.add.image(560, 320, "Prototype_Tiles", 16);
        
        // tiles can collide now
        
        this.itemsHeld = 0;
        //this.add.rectangle(100, 100, 100, 100, 0x00ff00);

        //--------------------------
        //Background audio
        //--------------------------
        // music = this.sound.add();
        // music.on('looped', listener);
        // music.setloop(true);
        // music.play();
        
        //----------------------------------------
        //UI
        //----------------------------------------

        const itemText = this.add.text(1200, 200, "item for player to pick up", {color: "#ffffff", backgroundColor: '#e03f3f', padding: { x: 20, y: 10 }}).setInteractive();
        this.itemText = this.add.text(100, 180, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
        itemText.on('pointerup',()=>{
            itemText.destroy();
            this.itemsHeld += 1;
            this.updateItemText();

            
        });

        const returnButtonText = this.add.text(1200, 100, "Return to Menu", {color: "#fffcfc", backgroundColor: '#3f1352', padding: { x: 20, y: 10 }}).setOrigin(0.5).setInteractive();
        returnButtonText.on('pointerdown', ()=> returnButtonText.setTint(0x965A0B));
        returnButtonText.on('pointerup', ()=>{
            this.scene.start('level-select');
        });

        const endSceneText = this.add.text(1200, 150, "Go to end scene", {color: "#ffffff", backgroundColor: '#3f1352', padding: { x: 20, y: 10 }}).setOrigin(0.5).setToTop().setInteractive();
        endSceneText.on('pointerdown', ()=> endSceneText.setTint(0x965A0B));
        endSceneText.on('pointerup', ()=>{
            this.scene.start('end-scene', { itemsHeld: this.itemsHeld });
        });

        this.pauseButton = this.add.text(1200, 50, "Pause", {color: "#ffffff", backgroundColor: '#333333', padding: { x: 20, y: 10 }}).setOrigin(0.5).setSize(100, 100).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.on('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.pause();
            this.scene.launch('pause', { resumeKey: 'core-gameplay' });
        })
        
        //arrowbuttons
        const jumpButton = this.add.image(50, 50, 'jumpButton').setInteractive();
        jumpButton.setAlpha(0.5);
        const leftButton = this.add.image(40, 50, 'leftButton').setInteractive();
        leftButton.angle = 270;
        leftButton.setAlpha(0.5);
        const rightButton = this.add.image(60, 50, 'rightButton').setInteractive();
        leftButton.angle = 90;
        leftButton.setAlpha(0.5);
        

        //----------------------------------------
        //Player
        //----------------------------------------


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
        this.physics.add.collider(this.player, this.platform, () => {
            if (this.player.body.touching.down)
        })

        this.player.body.setMaxVelocity(500);
        this.player.body.setDragX(1000);


        this.isJumping = false;

        //Keyboard input for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //---------------------------
        //Game Objects
        //--------------------------

    }

    drawTileCollisions(graphics) {
        graphics.clear();
        graphics.lineStyle(3, 0xfc00fc, 1);

        this.layer1.forEachTile(tile => {
            const tileX = tile.getLeft();
            const tileY = tile.getTop();
            const collisionStuff = tile.getCollisionGroup();
            

            if (!collisionStuff || collisionStuff.objects.length === 0) {
                return;
            }
            

            const objects = collisionStuff.objects;

            for (let i = 0; i < objects.length; ++i) {
                const object = objects[i];
                const objX = tileX + object.x;
                const objY = tileY + object.y;

                if (object.rectangle) {
                    graphics.strokeRect(objX, objY, object.width, object.height);
                }
            }
        })
    }

    update(){


        const onFloor = this.player.body.onFloor();
        if (onFloor) {
            this.isJumping = false;
        }

        // Reduce horizontal drag while in-air so player retains momentum
        if (this.isJumping) {
            this.player.body.setDragX(0);
        } else {
            this.player.body.setDragX(1000);
        }

        // Keyboard movement
        const moveSpeed = 250;
        if (this.cursors.left.isDown) {
            while(this.player.body.velocity.x > -moveSpeed) {
                this.player.setVelocityX(this.player.body.velocity.x - 10);
            }
        } else if (this.cursors.right.isDown) {
            while(this.player.body.velocity.x < moveSpeed) {
                this.player.setVelocityX(this.player.body.velocity.x + 10);
            }
        } else {
            this.player.setVelocityX(0);
        }
        // if(this.cursors.left.isUp && this.isJumping == true){
        //     this.player.setVelocityX(0);
        // }
        // if(this.cursors.right.isUp && this.isJumping == true){
        //     this.player.setVelocityX(0);
        // }

        // Jump with keyboard
        if (this.cursors.up.isDown && onFloor) {
            this.isJumping = true;
            this.player.setVelocityY(-400);
        }
    }
}
