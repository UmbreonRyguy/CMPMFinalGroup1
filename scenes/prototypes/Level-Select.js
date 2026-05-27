export default class LevelSelect extends Phaser.Scene {
    constructor() {
        super('level-select');
    }
    create() {
        this.cameras.main.setBackgroundColor('#b992db');
        this.add.text("I am the level select screen", 100, 200, {color: "#000000"});
        const lvl1 = this.add.text(100, 200, "level 1", {color: "#000000"}).setInteractive();
        lvl1.on('pointerhover', ()=> lvl1.setTint(0xb66d0f));
        lvl1.on('pointerdown', ()=> lvl1.setTint(0x965A0B));
        lvl1.on('pointerup', () => {
            lvl1.clearTint();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('core-gameplay');
            });
        });

        const lvl2 = this.add.text(100, 300, "level 2", {color: "#000000"}).setInteractive();
        lvl2.on('pointerhover', ()=> lvl2.setTint(0xb66d0f));
        lvl2.on('pointerdown', ()=> lvl2.setTint(0x965A0B));
        lvl2.on('pointerup', () => {
            lvl2.clearTint();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('core-gameplay-level2');
            });
        });

        const lvl3 = this.add.text(100, 400, "level 3", {color: "#000000"}).setInteractive();
        lvl3.on('pointerhover', ()=> lvl3.setTint(0xb66d0f));
        lvl3.on('pointerdown', ()=> lvl3.setTint(0x965A0B));
        lvl3.on('pointerup', () => {
            lvl3.clearTint();
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('core-gameplay-level3');
            });
        });
    }
}

