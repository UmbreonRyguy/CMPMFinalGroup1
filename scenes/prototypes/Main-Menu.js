export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    create() {
   
        const synth = new Tone.Synth().toDestination();


        this.bg = this.add.image(640, 360, 'bg');
        const title = this.add.image(640, 400, 'title');
        const start = this.add.image(640, 400, 'start').setAlpha(0).setInteractive();
        const settings = this.add.image(640, 500, 'settings').setAlpha(0).setInteractive();
        const credits = this.add.image(640, 600, 'credits').setAlpha(0).setInteractive();

        this.cameras.main.fadeIn(1000, 0, 0, 0);

        const fadeIn = (button, delayTime) =>{
            this.tweens.add({
                targets: button,
                alpha: 1,
                ease: 'linear',
                duration: 2000,
                delay: delayTime
            });
        }
        
        fadeIn(start, 0);
        fadeIn(settings, 1000);
        fadeIn(credits, 2000);

        //Tweens for buttons
        this.tweens.add({
            targets: title, y: title.y - 30, duration: 2000,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: title, angle: { from: -7, to: 7 }, duration: 2000,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: [start, settings, credits], scale: 1.05, duration: 750,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })


        start.on('pointerdown', ()=> start.setTint(0x965A0B));
        start.on('pointerover', ()=> start.setTint(0xeab269));
        start.on('pointerup', ()=>{
            synth.triggerAttackRelease("C4", "8n");
            start.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('level-select');
            });
        });
        start.on('pointerout', ()=>start.clearTint());

        settings.on('pointerdown', ()=> settings.setTint(0x965A0B));
        settings.on('pointerover', ()=> settings.setTint(0xeab269));
        settings.on('pointerup', ()=>{
            settings.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('settings');
            });
        });
        settings.on('pointerout', ()=>settings.clearTint());

        credits.on('pointerdown', ()=> credits.setTint(0x965A0B));
        credits.on('pointerover', ()=> credits.setTint(0xeab269));
        credits.on('pointerup', ()=>{
            credits.clearTint();
            this.scene.start('credits');
        });
        credits.on('pointerout', ()=>credits.clearTint());

        //--------------------------
        //Background audio
        //--------------------------
        this.sound.stopByKey('bgmusic');
        this.music = this.sound.add('bgmusic');
        this.music.loop = true;
        this.music.play();
    }
}
