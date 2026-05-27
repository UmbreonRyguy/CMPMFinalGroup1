export default class GameplayPrototypeLevel2 extends Phaser.Scene {
    constructor() {
        super('core-gameplay-level3');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);

    }
}