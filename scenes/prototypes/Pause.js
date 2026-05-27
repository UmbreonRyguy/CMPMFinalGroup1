const W = 1280;
const H = 720;
class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }
    create() {
        this.add.rectangle(0, 0, W, H, 0x000000, 0.5); //tint over other scene
        this.add.text(W/2, H/2-100, 'I am the Pause screen', {color: 0x5a118a});
        const resumebutton = this.add.rectangle(W/2, H/2+20, 200, 50, 0x5a118a).setInteractive();
            resumebutton.on('pointerdown', ()=> resumeButton.setTint(0x965A0B));
            resumebutton.on('pointerup', ()=>{
                resumebutton.clearTint();
                this.scene.stop('pause');
        });
        const resumetext = this.add.text(W/2, H/2 + 20, 'resume', {color: 0x000000}).setOrigin(0.5);

        const quitbutton = this.add.rectangle(W/2, H/2+70, 200, 50, 0x5a118a).setInteractive();
        quitbutton.on('pointerdown', ()=> quitButton.setTint(0x965A0B));
        quitbutton.on('pointerup', ()=>{
            quitbutton.clearTint();
            this.scene.start('main-menu');
        });
        const quittext = this.add.text(W/2, H/2+70, 'Quit to Menu', {color: 0x000000}).setOrigin(0.5);
    }
}