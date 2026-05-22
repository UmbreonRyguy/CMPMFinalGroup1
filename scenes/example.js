class Example extends Phaser.Scene {
    constructor() {
        super('example');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0xffffff);
    }
}