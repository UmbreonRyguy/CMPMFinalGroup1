const W = 1280;
const H = 720
class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }
    create() {
        const resumebutton = this.add.rectangle(W/2, H/2+20, 200, 50).setInteractive();
        const resumetext = this.add.text(W/2, H/2 + 20, 'resume').setOrigin(0.5);
    }
}