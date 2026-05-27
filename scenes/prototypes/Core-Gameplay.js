export default class GameplayPrototype extends Phaser.Scene {
    constructor() {
        super('core-gameplay');
    }
    preload(){}
    create() {

        let itemsHeld = 0;
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);

        const itemText = this.add.text(100, 100, "item for player to pick up", {color: "#ffffff"}).setInteractive();
        itemText.on('pointerDown',()=>{
            itemText.destroy();
            itemsHeld += 1;
        });

        const returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);
        const returnButton = this.add.rectangle(640, 650, 200, 50, 0x5a118a).setInteractive();
        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerup', ()=>{
            this.scene.start('level-select');
        });

        const endSceneText = this.add.text(800, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);
        const endSceneButton = this.add.rectangle(800, 650, 200, 50, 0x5a118a).setInteractive();
        endSceneButton.on('pointerdown', ()=> endSceneButton.setTint(0x965A0B));
        endSceneButton.on('pointerup', ()=>{
            this.scene.start('end-scene', { itemsHeld: this.itemsHeld });
        });
    }
    update(){
        this.add.text(100, 300, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"}); 
    }
}
