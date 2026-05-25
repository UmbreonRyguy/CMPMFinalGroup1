export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    preload() {
       this.load.image('bg', 'assets/finalproj-main-menu-protbg.png');
       this.load.image('quit', 'assets/finalproj-main-menu-prototype-quitsign.png');
       this.load.image('settings', 'assets/finalproj-main-menu-prototype-settingssign.png');
       this.load.image('start', 'assets/finalproj-main-menu-prototype-startsign.png');
       this.load.image('title', 'assets/finalproj-main-menu-prototype-titlesign.png') 
    }
    create() {
        this.add.image(640, 360, 'bg');
        this.add.image(640, 400, 'title');
        const start = this.add.image(640, 400, 'start').setAlpha(0).setInteractive();
        const settings = this.add.image(640, 500, 'settings').setAlpha(0).setInteractive();
        const quit = this.add.image(640, 600, 'quit').setAlpha(0).setInteractive();

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
        fadeIn(settings, 2000);
        fadeIn(quit, 4000);

        start.on('pointerdown', ()=> start.setTint(0x965A0B));
        start.on('pointerup', ()=>start.clearTint());
        start.on('pointerout', ()=>start.clearTint());

        settings.on('pointerdown', ()=> settings.setTint(0x965A0B));
        settings.on('pointerup', ()=>settings.clearTint());
        settings.on('pointerout', ()=>settings.clearTint());

        quit.on('pointerdown', ()=> quit.setTint(0x965A0B));
        quit.on('pointerup', ()=>quit.clearTint());
        quit.on('pointerout', ()=>quit.clearTint());
    }
}
