import IntroCinematic from './scenes/prototypes/Intro-Cinematic.js';
import MainMenu from './scenes/prototypes/Main-Menu.js';
import Credits from './scenes/prototypes/Credits.js';
import Settings from './scenes/prototypes/Settings.js';
import GameplayPrototype from './scenes/prototypes/Core-Gameplay.js';


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
    pixelArt: true,
    scene: [IntroCinematic, MainMenu, Credits, Settings, GameplayPrototype]
}

let game = new Phaser.Game(config);