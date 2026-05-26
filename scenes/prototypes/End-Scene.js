export default class EndScene extends Phaser.Scene {
    constructor() {
        super('end-scene');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);
    }
}
