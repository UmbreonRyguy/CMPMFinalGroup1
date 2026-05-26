export default class Settings extends Phaser.Scene {
    constructor() {
        super('settings');
    }
    create() {


        const returnShape = this.add.rectangle(100, 100, 100, 100, 0x00ff00).setInteractive();
        const returnButton = this.add.text(100, 100, "Return", {color: "#000000"}).setInteractive();

        returnShape.on('pointerdown', ()=> returnShape.setTint(0x965A0B));
        returnShape.on('pointerhover', ()=> returnShape.setTint(0xb66d0f));
        returnShape.on('pointerup', ()=>{
            returnShape.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('main-menu');
            });
        });
        returnShape.on('pointerout', ()=>returnShape.clearTint());
        





        this.add.rectangle(100, 100, 100, 100, 0x400E06);
    }
}