export default class GameplayPrototype extends Phaser.Scene {
    constructor() {
        super('core-gameplay');
    }
    
    updateItemText() {
        this.itemText.destroy();
        itemText = this.add.text(100, 180, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
        this.itemText = itemText;
    }
    preload(){}
    create() {

        this.itemsHeld = 0;
        //this.add.rectangle(100, 100, 100, 100, 0x00ff00);

        const itemText = this.add.text(100, 100, "item for player to pick up", {color: "#ffffff", backgroundColor: '#e03f3f', padding: { x: 60, y: 20 }}).setInteractive();
        this.itemText = this.add.text(100, 180, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});
        itemText.on('pointerup',()=>{
            itemText.destroy();
            this.itemsHeld += 1;
            this.updateItemText();

            
        });

        const returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#fffcfc", backgroundColor: '#3f1352', padding: { x: 60, y: 20 }}).setOrigin(0.5).setInteractive();
        returnButtonText.on('pointerdown', ()=> returnButtonText.setTint(0x965A0B));
        returnButtonText.on('pointerup', ()=>{
            this.scene.start('level-select');
        });

        const endSceneText = this.add.text(1000, 650, "Go to end scene", {color: "#ffffff", backgroundColor: '#3f1352', padding: { x: 60, y: 20 }}).setOrigin(0.5).setToTop().setInteractive();
        endSceneText.on('pointerdown', ()=> endSceneText.setTint(0x965A0B));
        endSceneText.on('pointerup', ()=>{
            this.scene.start('end-scene', { itemsHeld: this.itemsHeld });
        });

        this.pauseButton = this.add.text(1000, 50, "Pause", {color: "#ffffff", backgroundColor: '#333333', padding: { x: 20, y: 10 }}).setOrigin(0.5).setSize(100, 100).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.on('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.pause();
            this.scene.launch('pause', { resumeKey: 'core-gameplay' });
        })
    }

    update(){
    }
}
