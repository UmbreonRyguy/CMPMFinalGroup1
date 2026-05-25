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
        this.add.image(640, 400, 'start');
        this.add.image(640, 500, 'settings');
        this.add.image(640, 600, 'quit');
    }
}
