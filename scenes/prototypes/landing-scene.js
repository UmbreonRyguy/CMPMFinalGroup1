const W = 1280;
const H = 720;
export default class LandingScene extends Phaser.Scene {
    constructor() {
        super('landing-scene');
    }

    preload() {
        this.load.font('pixel', 'assets/fonts/pixelFont.ttf');
    }

    create() {
        this.add.text(W/2, H/2, "Tap to load the game!", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '50px'
        })
            .setInteractive().setOrigin(0.5);

        this.input.on('pointerdown', () => {
            this.scene.start('intro-cinematic');
        });
    }
}