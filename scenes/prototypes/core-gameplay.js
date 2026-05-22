class GameplayPrototype extends Phaser.Scene {
    constructor() {
        super('core-gameplay');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);
    }
}