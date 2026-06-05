export default class LevelSelect extends Phaser.Scene {
    constructor() {
        super('level-select');
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
                alpha: 0.3,
                scale: 5,
                duration: 5000 + Math.random() * 10000,
                repeat: -1,
            });
            if (!leaves[i].flipX) {
                this.tweens.add({
                    targets: leaves[i],
                    rotation: {from: 0.1, to: -1.4},
                    x: {from: leaves[i].x - (100 + 50*Math.random()), to: leaves[i].x + (100 + 50*Math.random())},
                    yoyo: true,
                    duration: 2000 + Math.random() * 1000,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
            else {
                this.tweens.add({
                    targets: leaves[i],
                    rotation: {from: 1.4, to: -0.1},
                    x: {from: leaves[i].x - (100 + 50*Math.random()), to: leaves[i].x + (100 + 50*Math.random())},
                    yoyo: true,
                    duration: 2000 + Math.random() * 1000,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        }
    }

    create() {
        const now = Tone.now();
        const crusher = new Tone.BitCrusher(7).toDestination();
        const distortion = new Tone.Distortion(5).toDestination();
        const reverb = new Tone.Reverb(3).toDestination();

        const synth = new Tone.Synth().toDestination();
        const synth2 = new Tone.Synth().toDestination().connect(crusher);
        const synth3 = new Tone.Synth().toDestination().connect(distortion);
        
        // Apply global Tone mute based on SFX setting
        Tone.Destination.mute = !this.registry.get('sfxEnabled');
        
        this.bg = this.add.image(640, 360, 'mainMenubg');
        this.bg.setTint(0x888888);

        // leaves (BEHIND the buttons)
        this.makeLeaves(50, 3.5);

        const title = this.add.image(640, 200, 'signLong').setScale(3);
        const titleText =this.add.text(640, 200, "Level \n Select", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '100px'
        }).setOrigin(0.5).setAlpha(0);

        const levelOne = this.add.image(300, 500, 'signSmall').setAlpha(0).setScale(2).setOrigin(0.5, 0.5);
        const levelOneText =this.add.text(300, 500, "LEVEL 1", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(0);

        const levelTwo = this.add.image(640, 500, 'signSmall').setAlpha(0).setScale(2).setOrigin(0.5, 0.5);
        const levelTwoText =this.add.text(640, 500, "LEVEL 2", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(0);


        const levelThree = this.add.image(980, 500, 'signSmall').setAlpha(0).setScale(2).setOrigin(0.5, 0.5);
        const levelThreeText =this.add.text(980, 500, "LEVEL 3", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(0);

        this.cameras.main.fadeIn(1000, 0, 0, 0);



        const fadeIn = (button, delayTime) =>{
            this.tweens.add({
                targets: button,
                alpha: 1,
                ease: 'linear',
                duration: 2000,
                delay: delayTime,
            });
        }

        this.pressable = (button, delayTime) => {
            this.tweens.add({
                targets: button,
                y: button.y,
                onComplete: () => {
                    button.setInteractive();
                }
            });
        }
        
        fadeIn(title, 0);
        fadeIn(titleText, 0);

        fadeIn(levelOne, 0);
        fadeIn(levelOneText, 0);
        fadeIn(levelTwo, 500);
        fadeIn(levelTwoText, 500);
        fadeIn(levelThree, 1000); 
        fadeIn(levelThreeText, 1000);
        this.pressable(levelOne, 100);
        this.pressable(levelTwo, 1100);
        this.pressable(levelThree, 2100);

        //Tweens for buttons
        this.tweens.add({
            targets: title, y: title.y - 30, duration: 2000,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: titleText, y: title.y - 30, duration: 2000,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        });
        this.tweens.add({
            targets: [levelOne, levelTwo, levelThree,], scale: 2.05, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })
        this.tweens.add({
            targets: [levelOneText, levelTwoText, levelThreeText], scale: 1.05, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })

        this.buttonMove = (button, y) => {
            this.tweens.add({
                targets: button,
                y: y,
                ease: 'Back.easeInOut',
                duration: 500
            });
        }

        levelOne.on('pointerdown', ()=> levelOne.setTint(0x965A0B));
        levelOne.on('pointerover', ()=> {
            levelOne.setTint(0xeab269);
            this.buttonMove(levelOne, 450);
            this.buttonMove(levelOneText, 450);
        });
        levelOne.on('pointerup', ()=>{
            const now = Tone.now();
            synth2.triggerAttackRelease("D3", "8n");
            synth2.triggerAttackRelease("G3", "8n", now + 0.1);
            levelOne.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('core-gameplay', {level: 1});
            });
        });
        levelOne.on('pointerout', ()=> {
            levelOne.clearTint();
            this.buttonMove(levelOne, 500);
            this.buttonMove(levelOneText, 500);
        });

        levelTwo.on('pointerdown', ()=> levelTwo.setTint(0x965A0B));
        levelTwo.on('pointerover', ()=> {
            levelTwo.setTint(0xeab269);
            this.buttonMove(levelTwo, 450);
            this.buttonMove(levelTwoText, 450);
        });
        levelTwo.on('pointerup', ()=>{
            const now = Tone.now();
            synth2.triggerAttackRelease("B2", "8n");
            synth2.triggerAttackRelease("D3", "8n", now + 0.1);
            levelTwo.clearTint()
            this.scene.start('level-select');
        });
        levelTwo.on('pointerout', ()=> {
            levelTwo.clearTint();
            this.buttonMove(levelTwo, 500);
            this.buttonMove(levelTwoText, 500);
        });

        levelThree.on('pointerdown', ()=> levelThree.setTint(0x965A0B));
        levelThree.on('pointerover', ()=> {
            levelThree.setTint(0xeab269);
            this.buttonMove(levelThree, 450);
            this.buttonMove(levelThreeText, 450);
        });
        levelThree.on('pointerup', ()=>{
            const now = Tone.now();
            synth2.triggerAttackRelease("G4", "8n");
            synth2.triggerAttackRelease("C4", "8n", now + 0.1);
            levelThree.clearTint();
            this.scene.start('level-select');
        });
        levelThree.on('pointerout', ()=> {
            levelThree.clearTint();
            this.buttonMove(levelThree, 500);
            this.buttonMove(levelThreeText, 500);
        });


        // const lvl1 = this.add.text(100, 200, "level 1", {color: "#000000"}).setInteractive();
        // lvl1.on('pointerhover', ()=> lvl1.setTint(0xb66d0f));
        // lvl1.on('pointerdown', ()=> lvl1.setTint(0x965A0B));
        // lvl1.on('pointerup', () => {
        //     lvl1.clearTint();
        //     this.cameras.main.fadeOut(500, 0, 0, 0);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.start('core-gameplay');
        //     });
        // });

        // const lvl2 = this.add.text(100, 300, "level 2", {color: "#000000"}).setInteractive();
        // lvl2.on('pointerhover', ()=> lvl2.setTint(0xb66d0f));
        // lvl2.on('pointerdown', ()=> lvl2.setTint(0x965A0B));
        // lvl2.on('pointerup', () => {
        //     lvl2.clearTint();
        //     this.cameras.main.fadeOut(500, 0, 0, 0);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.start('core-gameplay-level2');
        //     });
        // });

        // const lvl3 = this.add.text(100, 400, "level 3", {color: "#000000"}).setInteractive();
        // lvl3.on('pointerhover', ()=> lvl3.setTint(0xb66d0f));
        // lvl3.on('pointerdown', ()=> lvl3.setTint(0x965A0B));
        // lvl3.on('pointerup', () => {
        //     lvl3.clearTint();
        //     this.cameras.main.fadeOut(500, 0, 0, 0);
        //     this.cameras.main.once('camerafadeoutcomplete', () => {
        //         this.scene.start('core-gameplay-level3');
        //     });
        // });
        const returnButton = this.add.image(640, 650, 'signSmall').setScale(1.7).setOrigin(0.5, 0.5).setInteractive().setAlpha(0);
        const returnButtonText = this.add.text(640, 650, "Return \n to Menu", {color: "#fffcfc",
        fontFamily: 'pixel',
        fontSize: '32px'
        }).setOrigin(0.5).setAlpha(0);

        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerover', ()=> {
            returnButton.setTint(0xcb9958);
        });
        returnButton.on('pointerout', ()=> returnButton.clearTint());
        
        returnButton.on('pointerup', ()=>{
            this.sound.stopByKey('mainMenuTheme');
            this.scene.start('main-menu');
        });
        fadeIn(returnButton, 0);
        fadeIn(returnButtonText, 0);

        // leaves (in front of buttons)
        this.makeLeaves(8, 4.5);
    }
}

