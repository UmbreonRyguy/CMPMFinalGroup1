const W = 1280; //height and width
const H = 720;

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
        this.makeLeaves(25, 3.5);

        const title = this.add.image(640, 200, 'signLong').setScale(3);
        const titleText =this.add.text(640, 200, "Back to \n the Forest", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '70px'
        }).setOrigin(0.5).setAlpha(0);

        const start = this.add.image(300, 500, 'signSmall').setAlpha(0).setScale(2).setOrigin(0.5, 0.5);
        const startText =this.add.text(300, 500, "START", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(0);

        const settings = this.add.image(640, 500, 'signSmall').setAlpha(0).setScale(2).setOrigin(0.5, 0.5);
        const settingsText =this.add.text(640, 500, "SETTINGS", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(0);


        const credits = this.add.image(980, 500, 'signSmall').setAlpha(0).setScale(2).setOrigin(0.5, 0.5);
        const creditsText =this.add.text(980, 500, "CREDITS", {
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

        fadeIn(start, 0);
        fadeIn(startText, 0);
        fadeIn(settings, 500);
        fadeIn(settingsText, 500);
        fadeIn(credits, 1000); 
        fadeIn(creditsText, 1000);
        this.pressable(start, 100);
        this.pressable(settings, 1100);
        this.pressable(credits, 2100);

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
            targets: [start, settings, credits,], scale: 2.05, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })
        this.tweens.add({
            targets: [startText, settingsText, creditsText], scale: 1.05, duration: 1500,
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

        start.on('pointerdown', ()=> start.setTint(0x965A0B));
        start.on('pointerover', ()=> {
            start.setTint(0xeab269);
            this.buttonMove(start, 450);
            this.buttonMove(startText, 450);
        });
        start.on('pointerup', ()=>{
            const now = Tone.now();
            synth2.triggerAttackRelease("D3", "8n");
            synth2.triggerAttackRelease("G3", "8n", now + 0.1);
            start.clearTint()
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('level-select');
            });
        });
        start.on('pointerout', ()=> {
            start.clearTint();
            this.buttonMove(start, 500);
            this.buttonMove(startText, 500);
        });

        settings.on('pointerdown', ()=> settings.setTint(0x965A0B));
        settings.on('pointerover', ()=> {
            settings.setTint(0xeab269);
            this.buttonMove(settings, 450);
            this.buttonMove(settingsText, 450);
        });
        settings.on('pointerup', ()=>{
            const now = Tone.now();
            synth2.triggerAttackRelease("B2", "8n");
            synth2.triggerAttackRelease("D3", "8n", now + 0.1);
            settings.clearTint()
            this.scene.pause();
            this.scene.launch('settings');
        });
        settings.on('pointerout', ()=> {
            settings.clearTint();
            this.buttonMove(settings, 500);
            this.buttonMove(settingsText, 500);
        });

        credits.on('pointerdown', ()=> credits.setTint(0x965A0B));
        credits.on('pointerover', ()=> {
            credits.setTint(0xeab269);
            this.buttonMove(credits, 450);
            this.buttonMove(creditsText, 450);
        });
        credits.on('pointerup', ()=>{
            const now = Tone.now();
            synth2.triggerAttackRelease("G4", "8n");
            synth2.triggerAttackRelease("C4", "8n", now + 0.1);
            credits.clearTint();
            this.scene.pause();
            this.scene.launch('credits',{ resumeKey: 'main-menu' });
        });
        credits.on('pointerout', ()=> {
            credits.clearTint();
            this.buttonMove(credits, 500);
            this.buttonMove(creditsText, 500);
        });

        // leaves (in front of buttons)
        this.makeLeaves(25, 4.5);

        //--------------------------
        //Background audio
        //--------------------------

        this.music = this.sound.add('mainMenuTheme');
        var musicPlaying = false;

         if (this.registry.get('musicEnabled')) {
            if (!musicPlaying) {
                    this.music.loop = true;
                    this.music.play();
                    musicPlaying = true;
                }
            }
        else{
            this.sound.stopByKey('mainMenuTheme');
            musicPlaying = false;
            }
        this.events.on('resume', (sys, data) => { //check again on scene resume
            // Update global Tone mute on resume
            Tone.Destination.mute = !this.registry.get('sfxEnabled');
            
            if (this.registry.get('musicEnabled')) {
                if (!musicPlaying) {
                    this.music.loop = true;
                    this.music.play();
                    musicPlaying = true;
                }
            }
            else {
                this.sound.stopByKey('mainMenuTheme');
                musicPlaying = false;
            }
        });
    }
}
