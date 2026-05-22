let config = {
    parent: 'root',
    type: Phaser.WEBGL,
    backgroundColor: '#111',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 1280,
        height: 720
    },
    physics: {
        default: 'arcade'
    },
    scene: [SceneFlowPrototype]
}

let game = new Phaser.Game(config);