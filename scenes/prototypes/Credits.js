const W = 1280; //height and width
const H = 720;
export default class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }
    create(data) {
        this.resumeKey = data.resumeKey || null;
        const crusher = new Tone.BitCrusher(7).toDestination();
        const synth2 = new Tone.Synth().toDestination().connect(crusher);
        this.add.rectangle(0, 0, W, H, 0x000000, 0.7).setOrigin(0);

        const backgroundSign = this.add.image(W/2, H/2 - 50, 'signSmall').setOrigin(0.5).setScale(6);

        this.add.text(W/2, 200, "Game Created by: ", {color: "#ffffff",
        fontSize: "32px",
        fontFamily: "pixel",
        }).setOrigin(0.5);
        this.add.text(W /2, 340, "Testing Lead - Rheann Kunita", {color: "#ffffff",
            fontSize: "24px",
            fontFamily: "pixel",
        }).setOrigin(0.5);
        this.add.text(W /2, 380, "Backup Tech Lead, Art Direction Lead \n - Sydney Osako", {color: "#ffffff",
            fontSize: "24px",
            fontFamily: "pixel",
            align: "center"
        }).setOrigin(0.5);
        this.add.text(W /2, 310, "Tech Lead - Quetzal Theobald", {color: "#ffffff",
            fontSize: "24px",
            fontFamily: "pixel",
        }).setOrigin(0.5);
        this.add.text(W /2, 280, "Backup Production Lead - Kamalika De", {color: "#ffffff",
            fontSize: "24px",
            fontFamily: "pixel",
        }).setOrigin(0.5);
        this.add.text(W /2, 250, "Production Lead - Ryan Funk", {color: "#ffffff",
            fontSize: "24px",
            fontFamily: "pixel",
        }).setOrigin(0.5);
        
        // const returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#ffffff",
        //     fontSize: "24px",
        //     fontFamily: "pixel",
        //     backgroundColor: '#3333331e',
        //      padding: { x: 20, y: 10 }
        // }).setOrigin(0.5).setSize(24).setInteractive();

        // returnButtonText.on('pointerdown', ()=> {
        //     this.scene.start('main-menu');
        //     this.scene.stop();
        // });
        const returnButton = this.add.image(W/2, 600, 'signSmall').setAlpha(1).setInteractive().setScale(2).setOrigin(0.5, 0.5);
        const returnText =this.add.text(W/2, 600, "RETURN", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(1);

        this.tweens.add({
            targets: [returnButton], scale: 2.05, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })
        this.tweens.add({
            targets: [returnText], scale: 1.05, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })

        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerover', ()=> returnButton.setTint(0xeab269));
        returnButton.on('pointerout', ()=> returnButton.clearTint());
        returnButton.on('pointerup', ()=>{
            returnButton.clearTint();
            synth2.triggerAttackRelease("C3", "8n");
            this.scene.stop();
            this.scene.resume('main-menu');
            });

    }
}