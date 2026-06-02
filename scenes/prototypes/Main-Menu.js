export default class MainMenu extends Phaser.Scene {
    constructor() {
        super('main-menu');
    }

    makeLeaves(num, size) {
        let leaves = [];
        for (let i = 0; i < num; i++) {
            leaves[i] = this.add.image(i*1280/num, - 50, 'leaf').setOrigin(0, 1).setScale(size + Math.random());
            if (Math.random() < 0.5) {
                leaves[i].flipX = true;
            }
            if (Math.random() < 0.3) {
                leaves[i].setTint(0xff9978);
            }
            if (Math.random() < 0.5) {
                leaves[i].setTint(0xffc3af);
            }
            this.tweens.add({
                targets: leaves[i],
                delay: Math.random() * 10000 + (i % 2) * 1000,
                y: 1280,
                alpha: 0,
                duration: 5000 + Math.random() * 10000,
                repeat: -1,
                //onComplete:
            });
            if (!leaves[i].flipX) {
                this.tweens.add({
                    targets: leaves[i],
                    rotation: {from: 0.1, to: -1.4},
                    x: {from: leaves[i].x - (100 + 50*Math.random()), to: leaves[i].x + (100 + 50*Math.random())},
                    yoyo: true,
                    duration: 1000 + Math.random() * 1000,
                    repeat: -1,
                });
            }
            else {
                this.tweens.add({
                    targets: leaves[i],
                    rotation: {from: 1.4, to: -0.1},
                    x: {from: leaves[i].x - (100 + 50*Math.random()), to: leaves[i].x + (100 + 50*Math.random())},
                    yoyo: true,
                    duration: 1000 + Math.random() * 1000,
                    repeat: -1,
                });
            }
        }
    }

    create() {
        const synth = new Tone.Synth().toDestination();


        this.bg = this.add.image(640, 360, 'bg');

        // leaves (behind the buttons)
        this.makeLeaves(23, 3.5);

        this.add.image(640, 400, 'title');
        const start = this.add.image(640, 400, 'start').setAlpha(0).setInteractive();
        const settings = this.add.image(640, 500, 'settings').setAlpha(0).setInteractive();
        const credits = this.add.image(640, 600, 'credits').setAlpha(0).setInteractive();

        const fadeIn = (button, delayTime) =>{
            this.tweens.add({
                targets: button,
                alpha: 1,
                ease: 'linear',
                duration: 2000,
                delay: delayTime
            });
        }
        
        fadeIn(start, 0);
        fadeIn(settings, 1000);
        fadeIn(credits, 2000);

        start.on('pointerdown', ()=> start.setTint(0x965A0B));
        start.on('pointerover', ()=> start.setTint(0xeab269));
        start.on('pointerup', ()=>{
            synth.triggerAttackRelease("C4", "8n");
            start.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('level-select');
            });
        });
        start.on('pointerout', ()=>start.clearTint());

        settings.on('pointerdown', ()=> settings.setTint(0x965A0B));
        settings.on('pointerover', ()=> settings.setTint(0xeab269));
        settings.on('pointerup', ()=>{
            settings.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('settings');
            });
        });
        settings.on('pointerout', ()=>settings.clearTint());

        credits.on('pointerdown', ()=> credits.setTint(0x965A0B));
        credits.on('pointerover', ()=> credits.setTint(0xeab269));
        credits.on('pointerup', ()=>{
            credits.clearTint();
            this.scene.start('credits');
        });
        credits.on('pointerout', ()=>credits.clearTint());

        // leaves (in front of buttons)
        this.makeLeaves(10, 4.5);

        //--------------------------
        //Background audio
        //--------------------------
        var music = this.sound.add('bgmusic');
        music.loop = true;
        music.play();
    }
}
