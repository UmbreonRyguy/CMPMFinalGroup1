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
        const start = this.add.image(640, 400, 'start').setAlpha(0);
        const settings = this.add.image(640, 500, 'settings').setAlpha(0);
        const quit = this.add.image(640, 600, 'quit').setAlpha(0);

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
    }
}
