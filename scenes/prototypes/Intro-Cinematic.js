export default class IntroCinematic extends Phaser.Scene {
    constructor() {
        super('intro-cinematic');
    }

    preload() {
        this.load.image("prototypeLogo", "assets/prototypeLogo.png");
        this.load.image("rock", "assets/rockForPrototypeCinematic.png");
        this.load.image("rockPiece", "assets/rockShardForPrototype.png");
        this.load.image("dustCloud", "assets/dustCloud.png");
    }
    create() {
        this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "prototypeLogo")
        .setScale(2);
        let rock = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "rock")
        .setScale(2);
        let rockPiece = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "rockPiece")
        .setScale(2);
        //the scale thing is just because i drew these on a canvas half the size of the current game canvas
        
        this.tweens.chain({
            targets: [rock, rockPiece],
            tweens: [
            {
                x: rock.x + 10,
                ease: "Cubic.easeInOut",
                duration: 600
            },
            {
                x: rock.x - 10,
                ease: "Cubic.easeInOut",
                duration: 600
            },
            {
                x: rock.x - 10,
                ease: "Cubic.easeInOut",
                duration: 600
            },
            {
                x: rock.x + 10,
                ease: "Cubic.easeInOut",
                duration: 600
            }
            ]
        })
    }
}