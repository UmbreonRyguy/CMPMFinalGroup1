export default class LevelSelect extends Phaser.Scene {
    constructor() {
        super('level-select');
    }
    create() {
        this.add.rectangle(100, 100, 100, 100, 0x00ff00);
        this.add.text("I am the level select screen", 100, 200, {color: "#000000"});
        const lvl1 = this.add.text(100, 500, "level 1", {color: "#000000"});
            lvl1.setInteractive();
            lvl1.on('pointerhover', ()=> lvl1.setTint(0xb66d0f));
            lvl1.on('pointerup', () => this.scene.start('core-gameplay'));
        const lvl2 = this.add.text(100, 600, "level 2", {color: "#000000"}).setInteractive();
        const lvl3 = this.add.text(100, 700, "level 3", {color: "#000000"}).setInteractive();
    }
}

