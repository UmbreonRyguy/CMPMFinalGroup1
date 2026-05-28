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

        //--------------------------------------
        // image physics stuff
        //---------------------------------------
        let mush = this.physics.add.image(400, 320, "Prototype_Tiles", 28).setBodySize(240, 80);
        this.physics.add.image(480, 320, "Prototype_Tiles", 29);
        this.physics.add.image(560, 320, "Prototype_Tiles", 30);

        let conveyorBelt = this.physics.add.image(400, 320, "Prototype_Tiles", 14).setBodySize(240, 80);
        this.physics.add.image(480, 320, "Prototype_Tiles", 15);
        this.physics.add.image(560, 320, "Prototype_Tiles", 16);
        
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

        this.player.body.setMaxVelocity(500);
        this.player.body.setDragX(1000);


        this.isJumping = false;

        // we can use different input if player is using a touchscreen
        this.input.keyboard.on("keydown-" + "LEFT", () =>
        {
            //if (this.player.body.velocity.x > -1000)
            this.player.setVelocityX(this.player.body.velocity.x - 50);
        });
        this.input.keyboard.on("keydown-" + "RIGHT", () =>
        {
            this.player.setVelocityX(this.player.body.velocity.x + 50);
        });
        this.input.keyboard.on("keydown-" + "UP", () =>
        {
            this.isJumping = true;
            if (this.player.body.onFloor()) {
                this.player.setVelocityY(-350);
            }
        });      
        
        // this.input.keyboard.on("keyup-" + "LEFT", () =>
        // {
        //     this.player.setVelocityX(0);
        // });
        // this.input.keyboard.on("keyup-" + "RIGHT", () =>
        // {
        //     this.player.setVelocityX(0);
        // });

        

        //--------------------------
        //Game Objects
        //--------------------------

        //------------------------------------------------------------
        //Prefab class definition
        //--------------------------------------------------
        //prefab for trash---------------------------------------------------------------------------------
        export default class TrashInfo extends Phaser.GameObjects.Image{
            constructor(scene){
                super(scene, 0, 0, 'trashinfo');
            }
            /**
             * @param {{trashInventory?: string[]}} data 
             * 
             */
            init(data){
                this.trashInventory = data.trashInventory || [];
            }

            /* updates the trash inventory
            *
            * @param {string} item Item name. Short and consistent works best (e.g. `"key"`, not `"a shiny key"`)
            * 
            * @param {int} playerX. Player's x position
            * @param {int} playerY. Player's Y position 
            */
            gainItemTrash(item, playerX, playerY){
            if (this.trashInventory.includes(item)) {
                console.warn('gaining item already held:', item);
                return;
            }
                const message = this.add.text(playerX, playerY + 20, "You picked up trash!").setAlpha(0);
                this.tween.add({
                    targets: item,
                    alpha: 1,
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

        //added trash object for player to interact with
        //making a water bottle to throw away
        let trash = this.add.image(W - 50, W + 30, "trash")
            .setInteractive()
            .on('pointerover', () => this.showMessage("Ew, trash"))
            .on('pointerdown', () => {
                this.showMessage("Throw it away!");
                this.gainItem('trash');
                this.tweens.add({
                    targets: trash,
                    alpha: {from: 1, to: 0},
                    duration: 500,
                    onComplete: ()=> trash.destroy()
                });
            })
    }

    update(){
        if (this.player.body.onFloor()) {
            this.isJumping = false;
        }
        if(this.isJumping == true){
            this.player.setDragX(0);
        }
        else{
            this.player.setDragX(1000);
        }

    }
}
