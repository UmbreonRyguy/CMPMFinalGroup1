class SceneFlowPrototype extends Phaser.Scene {
    constructor() {
        super('scene-flow');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x0000ff);
    }
}