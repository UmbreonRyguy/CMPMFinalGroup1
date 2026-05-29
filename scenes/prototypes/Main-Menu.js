export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    create() {
        this.bg = this.add.image(640, 360, 'bg');
        this.add.image(640, 400, 'title');
        const start = this.add.image(640, 400, 'start').setAlpha(0).setInteractive();
        const settings = this.add.image(640, 500, 'settings').setAlpha(0).setInteractive();
        const credits = this.add.image(640, 600, 'credits').setAlpha(0).setInteractive();

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

        start.on('pointerdown', ()=> start.setTint(0x965A0B));
        start.on('pointerover', ()=> start.setTint(0xeab269));
        start.on('pointerup', ()=>{
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
        var music = this.sound.add('bgmusic');
        music.loop = true;
        music.play();
    }
}
