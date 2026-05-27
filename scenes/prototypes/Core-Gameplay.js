export default class GameplayPrototype extends Phaser.Scene {
    constructor() {
        super('core-gameplay');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);
        
        const itemText = this.add.text(100, 100, "item for player to pick up", {color: "#ffffff"}).setInteractive();
        

    }
}
