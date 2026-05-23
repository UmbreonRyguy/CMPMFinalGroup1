export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('Main-Menu');
    }

    preload() {

    }
    create() {
        this.add.rectangle(200, 200, 100, 100, 0xff0000);
    }
}