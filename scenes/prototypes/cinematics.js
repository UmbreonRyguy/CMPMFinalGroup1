class CinematicsPrototype extends Phaser.Scene {
    constructor() {
        super('cinematics');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0xff0000);
    }
}