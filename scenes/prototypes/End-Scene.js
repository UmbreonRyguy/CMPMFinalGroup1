export default class EndScene extends Phaser.Scene {
    constructor() {
        super('end-scene');
        
    }

    init(data) {
        this.itemsHeld = data.itemsHeld || 0; // Default to 0 if itemsHeld is not provided
    }
    create() {
        const fadeIn = (button, delayTime) =>{
            this.tweens.add({
                targets: button,
                alpha: 1,
                ease: 'linear',
                duration: 2000,
                delay: delayTime,
            });
        }

        this.bg = this.add.image(640, 360, 'endScenebg');

        const endSign = this.add.image(640, 200, 'signLong').setScale(3);
        const theEnd = this.add.text(640, 200, "The End", {
            color: "#ffffff",
            fontFamily: "pixel",
            fontSize: '100px'
        }).setOrigin(0.5).setAlpha(0);

        fadeIn(endSign,0);
        fadeIn(theEnd, 0);

        const returnButton = this.add.image(640, 500, 'signSmall').setAlpha(0).setScale(2).setOrigin(0.5, 0.5).setInteractive();
        const returnText =this.add.text(640, 500, " Return \nto  Menu", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(0);

        this.buttonMove = (button, y) => {
            this.tweens.add({
                targets: button,
                y: y,
                ease: 'Back.easeInOut',
                duration: 500
            });
        };

        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerover', ()=> {
            returnButton.setTint(0xcb9958);
        });
        returnButton.on('pointerout', ()=> returnButton.clearTint());
        
        returnButton.on('pointerup', ()=>{
            this.scene.start('main-menu');
        });
        fadeIn(returnButton, 0);
        fadeIn(returnText, 0);


        
    }
}
