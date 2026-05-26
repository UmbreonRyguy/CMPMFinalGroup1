export default class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x400E06);
    }
}