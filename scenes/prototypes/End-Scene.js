export default class EndScene extends Phaser.Scene {
    constructor() {
        super('end-scene');
        
    }

    init(data) {
        this.itemsHeld = data.itemsHeld || 0; // Default to 0 if itemsHeld is not provided
    }
    create() {

        this.add.rectangle(100, 100, 100, 100, 0x00ff00);
        this.add.text(100, 300, "The player has " + this.itemsHeld + " items right now", {color: "#ffffff"});

        const returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);
        const returnButton = this.add.rectangle(640, 650, 200, 50, 0x5a118a).setInteractive();
        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerup', ()=>{
            this.scene.start('level-select');
        });


        
    }
}
