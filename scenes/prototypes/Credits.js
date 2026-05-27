const W = 1280; //height and width
const H = 720;
export default class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }
    create() {
        this.cameras.main.setBackgroundColor(0x000000);
        this.add.text(W /2, H/2 + 20, "Game Created by: ", {color: "#ffffff"}).setOrigin(0.5);
        this.add.text(W /2, H/2 + 40, "Testing Lead - Rheann Kunita", {color: "#ffffff"}).setOrigin(0.5);
        this.add.text(W /2, H/2 + 60, "Backup Tech Lead, Art Direction Lead - Sydney Osako", {color: "#ffffff"}).setOrigin(0.5);
        this.add.text(W /2, H/2 + 80, "Tech Lead - Quetzal Theobald", {color: "#ffffff"}).setOrigin(0.5);
        this.add.text(W /2, H/2 + 100, "Backup Production Lead - Kamalika De", {color: "#ffffff"}).setOrigin(0.5);
        this.add.text(W /2, H/2 + 120, "Production Lead - Ryan Funk", {color: "#ffffff"}).setOrigin(0.5);
        
        const returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);
        const returnButton = this.add.rectangle(640, 650, 200, 50, 0x5a118a).setInteractive();
        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerup', ()=>{
            this.scene.start('main-menu');
        });
        
    }
}