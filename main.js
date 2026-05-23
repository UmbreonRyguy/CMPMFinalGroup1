import IntroCinematic from './scenes/prototypes/Intro-Cinematic.js';
import mainMenu from './scenes/prototypes/Main-Menu.js';

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
    scene: [IntroCinematic, mainMenu]
}

let game = new Phaser.Game(config);