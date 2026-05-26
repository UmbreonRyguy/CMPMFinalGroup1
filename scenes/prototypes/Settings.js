export default class Settings extends Phaser.Scene {
    constructor() {
        super('settings');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x400E06);
    }
}