const W = 1280;
const H = 720;
export default class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }
    create() {
        console.log('pause scene start');
        this.cameras.main.setBackgroundColor('#f9f9f7a5');
        //this.screen_tint = this.add.rectangle(0, 0, W, H, 0xffffff, 0); //tint over other scene, starts fully transparent but is tweened later

        this.add.text(W/2, H/2-100, 'I am the Pause screen', {color: 0x5a118a});

        const resumebutton = this.add.rectangle(W/2, H/2, 200, 50, 0x5a118a).setInteractive();
            resumebutton.on('pointerdown', ()=> resumeButton.setTint(0x965A0B));
            resumebutton.on('pointerup', ()=>{
                resumebutton.clearTint();
                this.scene.stop('pause');
        });
        const resumetext = this.add.text(W/2, H/2, 'resume', {color: "#ffffff"}).setOrigin(0.5).setToTop();

        const quitbutton = this.add.rectangle(W/2, H/2+200, 200, 50, 0x5a118a).setInteractive();
        quitbutton.on('pointerdown', ()=> quitButton.setTint(0x965A0B));
        quitbutton.on('pointerup', ()=>{
            quitbutton.clearTint();
            this.scene.start('main-menu');
        });
        const quittext = this.add.text(W/2, H/2+200, 'Quit to Menu', {color: "#ffffff"}).setOrigin(0.5).setToTop();

        //this.pausecontainer = this.add.container(0, 0, [resumebutton, resumetext, quitbutton, quittext]);
        //this.pausecontianer.y = H;

        this.events.on('transitionstart', function (fromScene, duration)
        {
            this.tweens.add({
                targets: this.screen_tint,
                ease: 'Quart.easeInOut',
                alpha: 0.5,
                duration: 1000
            });
            // this.tweens.add({
            //     targets: this.pausecontainer,
            //     ease: 'Quart.easeInOut',
            //     scaleX: 1,
            //     scaleY: 1,
            //     y: H/2,
            //     duration: duration
            // });
        }, this);
    }
}