import IntroCinematic from './scenes/prototypes/Intro-Cinematic.js';
import MainMenu from './scenes/prototypes/Main-Menu.js';
import Credits from './scenes/prototypes/Credits.js';
import Settings from './scenes/prototypes/Settings.js';
import GameplayPrototype from './scenes/prototypes/Core-Gameplay.js';
import LevelSelect from './scenes/prototypes/Level-Select.js';
import EndScene from './scenes/prototypes/End-Scene.js';
import GameplayPrototypeLevel2 from './scenes/prototypes/Core-Gameplay-Level2.js';
import GameplayPrototypeLevel3 from './scenes/prototypes/Core-Gameplay-Level3.js';
import Pause from './scenes/prototypes/Pause.js';
import ToneLibrary from './scenes/toneLibrary.js';

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
    scene: [IntroCinematic, MainMenu, Credits, Settings, GameplayPrototype, LevelSelect, EndScene, GameplayPrototypeLevel2, GameplayPrototypeLevel3, Pause]
}

let game = new Phaser.Game(config);