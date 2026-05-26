export default class Credits extends Phaser.Scene {
    constructor() {
        super('credits');
    }
    create() {
        this.cameras.main.setBackgroundColor(0x000000);
        this.add.text(640, 700, "Game Created by: ", {color: #FFFFFF});
        this.add.text(640, 680, "Testing Lead - Rheann Kunita", {color: #FFFFFF});
        this.add.text(640, 660, "Backup Tech Lead, Art Direction Lead - Sydney Osako", {color: #FFFFFF});
        this.add.text(640, 640, "Tech Lead - Quetzal Theobald", {color: #FFFFFF});
        this.add.text(640, 620, "Backup Production Lead - Kamalika De", {color: #FFFFFF});
        this.add.text(640, 600, "Production Lead - Ryan Funk", {color: #FFFFFF});
    }
}