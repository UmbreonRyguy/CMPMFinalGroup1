const W = 1280;
const H = 720;
export default class Pause extends Phaser.Scene {
    constructor() {
        super('pause');
    }
    create(data) {
        console.log('pause scene start');
        this.anySoundPlaying = this.sound.getAllPlaying().length > 0;
        this.resumeKey = data.resumeKey || null;
        //this.cameras.main.setBackgroundColor('#f9f9f7a5');
        //this.screen_tint = this.add.rectangle(0, 0, W, H, 0xffffff, 0); //tint over other scene, starts fully transparent but is tweened later

        //this.add.text(W/2, H/2-100, 'I am the Pause screen', {color: 0x5a118a});
        //this.add.rectangle(0, 0, W, H, 0x000000, 0.6).setOrigin(0);
        const resumeSign = this.add.image(W/2, H/2 - 30, 'signSmall').setOrigin(0.5).setScale(2).setInteractive();
        const resumeButton = this.add.text(W / 2, H / 2 - 30, 'Resume', {
            fontSize: '32px', 
            color: "#ffffff",
            fontFamily: 'pixel'
        }).setOrigin(0.5);
        resumeSign.on('pointerover', ()=> resumeSign.setTint(0xeab269));
        resumeSign.on('pointerout', ()=> resumeSign.clearTint());
        resumeSign.on('pointerdown', () => {
            this.scene.resume(this.resumeKey);
            this.scene.stop();
        });
        
        const returnSign = this.add.image(W/2, H/2 + 200, 'signLong').setOrigin(0.5).setScale(2).setInteractive();
        const menuButton = this.add.text(W / 2, H / 2 + 200, 'Exit to Main Menu', {
            fontSize: '32px', 
            fontFamily: 'pixel',
            color: '#ffffff',
        }).setOrigin(0.5);
        returnSign.on('pointerover', ()=> returnSign.setTint(0xeab269));
        returnSign.on('pointerout', ()=> returnSign.clearTint());
        returnSign.on('pointerdown', () => {
            if(this.anySoundPlaying){
            this.sound.stopByKey('inGameTheme');
            }
            this.scene.stop(this.resumeKey);
            this.sound.stopByKey('mainMenuTheme');
            this.scene.start('main-menu');
            this.scene.stop();
        });
        

        //this.pausecontainer = this.add.container(0, 0, [resumebutton, resumetext, quitbutton, quittext]);
        //this.pausecontianer.y = H;

        // this.events.on('transitionstart', function (fromScene, duration)
        // {
        //     this.tweens.add({
        //         targets: this.screen_tint,
        //         ease: 'Quart.easeInOut',
        //         alpha: 0.5,
        //         duration: 1000
        //     });
        //     // this.tweens.add({
        //     //     targets: this.pausecontainer,
        //     //     ease: 'Quart.easeInOut',
        //     //     scaleX: 1,
        //     //     scaleY: 1,
        //     //     y: H/2,
        //     //     duration: duration
        //     // });
        // }, this);
    }
}