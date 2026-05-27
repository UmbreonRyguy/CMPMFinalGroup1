export default class GameplayPrototypeLevel3 extends Phaser.Scene {
    constructor() {
        super('core-gameplay-level3');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);

        const returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);
        const returnButton = this.add.rectangle(640, 650, 200, 50, 0x5a118a).setInteractive();
        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerup', ()=>{
            this.scene.start('level-select');
        });
    }
}