class CinematicsPrototype extends Phaser.Scene {
    constructor() {
        super('cinematics');
    }

    create() {
        this.add.rectangle(200, 200, 100, 100, 0x00ffff);
    }
}
