export default class IntroCinematic extends Phaser.Scene {
    constructor() {
        super('intro-cinematic');
    }

    preload() {

    }
    create() {
        this.add.rectangle(200, 200, 100, 100, 0xff0000);
    }
}