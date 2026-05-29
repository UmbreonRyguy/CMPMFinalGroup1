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
        this.platform = this.physics.add.body(440, 386, 240, 28).setAllowGravity(false).setImmovable();

        //--------------------------------------
        // image physics stuff
        //---------------------------------------

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

        // var to keep track of which game state the player is in
        this.past = false;
        
        
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

        // if the player hits the top of the conveyor belt, most fast to the left,
        // if the player hits the top of the mushroom, bounce
        this.physics.add.collider(this.player, this.platform, () => {
            if (this.player.body.touching.down && this.platform.touching.up) {
                if (this.past == true) {
                    this.player.setVelocityY(this.player.body.velocity.y - 400);
                    // doesn't work properly; read note in update for full context
                }
                else {
                    this.player.setVelocityX(this.player.body.velocity.x - 200);
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
        


        this.player.body.setMaxVelocity(500);
        this.player.body.setMaxVelocityY(600); 
        // ^ comment this out if you'd like, I'm just doing this for testing purposes
        this.player.body.setDragX(1000);


        this.isJumping = false;

        //Keyboard input for player movement
        this.cursors = this.input.keyboard.createCursorKeys();
        
        //---------------------------
        //Game Objects
        //--------------------------

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
            if (!(this.player.body.touching.down && this.platform.touching.up && !this.past)) { // basically if not on conveyor belt
                this.player.setVelocityX(0);
            }
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
        // ^ hey, didn't want to change this cause idk if it was worked on such that
        // merging would be a pain to deal with. In any case, this and my mushroom boucing stuff
        // do not work together. It seems to be the case that whenever the player is jumping at the
        // same time that the player is standing on the mushroom, the velocity for y only gets set to -400
        // instead of the mushroom adding extra bounce. It's to the point that if you get the velocity of y
        // low enough when on the mushroom, the player will go higher up while not pressing the jump button
        // on the mushroom than when they do.
        // basically, we need to make it so pressing the jump button while on the mushroom will make the player go higher
        // than a regular jump, and right now pressing the jump button will only make the player do a regular jump.
        // Ideally, the player would also bounce a bit on the mushroom, even when not actively jumping on it (which is why the
        // mushroom jump stuff is written the way it is currently) 
        // Also, the idea is that the player cannot complete whatever the goal is without using the past/future mechanic, which
        // is why the top right platform is so high. The player is supposed to jump on the mushrooms to gain extra height in
        // order to reach it, so the jumping not working on the mushroom is quite an issue.
        // -Sydney

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
