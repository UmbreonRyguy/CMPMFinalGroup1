export default class Settings extends Phaser.Scene {
    constructor() {
        super('settings');
    }
    create() {
        const returnShape = this.add.rectangle(100, 100, 200, 50, 0x5a118a).setInteractive();
        const returnButton = this.add.text(100, 100, "Return", {color: "#d2cccc"}).setInteractive();
        this.add.text(100, 200, "I am the settings screen", {color: "#f7f1f1"});

        returnShape.on('pointerdown', ()=> returnShape.setTint(0x965A0B));
        returnShape.on('pointerup', ()=>{
            returnShape.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('main-menu');
            });
        });
        returnShape.on('pointerout', ()=>returnShape.clearTint());

        returnButton.on('pointerdown', ()=> returnShape.setTint(0x965A0B));
        returnButton.on('pointerup', ()=>{
            returnButton.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('main-menu');
            });
        });
        returnButton.on('pointerout', ()=>returnButton.clearTint());
    
    
    }
}