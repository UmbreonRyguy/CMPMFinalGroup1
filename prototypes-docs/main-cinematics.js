import IntroCinematic from '../scenes/prototypes/Intro-Cinematic.js';

let config = {
    parent: 'root',
    type: Phaser.WEBGL,
    backgroundColor: '#223',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
        width: 1280,
        height: 720
    },
    physics: {
        default: 'arcade',
        arcade: {
                gravity: { y: 600 },
                debug: true
        }
    },
    pixelArt: true,
    scene: [IntroCinematic]
}

let game = new Phaser.Game(config);