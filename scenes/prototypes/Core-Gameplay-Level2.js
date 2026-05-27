export default class GameplayPrototypeLevel2 extends Phaser.Scene {
    constructor() {
        super('core-gameplay-level2');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);
        
        this.returnButton = this.add.rectangle(640, 650, 200, 50, 0x5a118a).setInteractive();
        //returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        this.returnButton.on('pointerup', ()=>{
            this.scene.start('level-select');
        });
        this.returnButtonText = this.add.text(640, 650, "Return to Menu", {color: "#000000"}).setOrigin(0.5).setSize(24);

        this.pauseButton = this.add.rectangle(400, 300, 100, 100,0xFF0000).setInteractive();
        //this.pauseButton.on('pointerover', () =>this.pauseButton.setTint(0xFF5C5));
        this.pauseButton.once('pointerup', ()=> {
            console.log("pause button clicked");
            this.scene.transition({
                target: 'pause',
                duration: 2000,
                sleep: true,
            });

        })
    }
}