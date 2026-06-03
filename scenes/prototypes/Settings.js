    const W = 1280; //height and width
    const H = 720;


export default class Settings extends Phaser.Scene {

    toggleMusic() {
        const current = this.registry.get('musicEnabled');
        const next = !current;
        this.registry.set('musicEnabled', next);  
        localStorage.setItem('musicEnabled', next);    
    }

    toggleSFX() {
        const current = this.registry.get('sfxEnabled');
        const next = !current;
        this.registry.set('sfxEnabled', next);  
        localStorage.setItem('sfxEnabled', next);
        Tone.Destination.mute = !next;  // Mute Tone if SFX is disabled
    }

    constructor() {
        super('settings');
    }
    create() {

        const crusher = new Tone.BitCrusher(7).toDestination();
        const synth2 = new Tone.Synth().toDestination().connect(crusher);
        this.add.rectangle(0, 0, W, H, 0x000000, 0.7).setOrigin(0);

        const returnButton = this.add.image(W/2, 600, 'signSmall').setAlpha(1).setInteractive().setScale(2).setOrigin(0.5, 0.5);
        const returnText =this.add.text(W/2, 600, "RETURN", {
            color: "#ffffff",
            fontFamily: 'pixel',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(1);

        this.tweens.add({
            targets: [returnButton], scale: 2.05, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })
        this.tweens.add({
            targets: [returnText], scale: 1.05, duration: 1500,
            yoyo: true, repeat: -1, ease: 'Sine.easeInOut'
        })
        const settingsSign = this.add.image(640, 100, 'signSmall').setOrigin(0.5).setScale(2.5);
        this.add.text(640, 100, "SETTINGS", {color: "#f7f1f1",
            fontSize: "56px",
            fontFamily: "pixel",
        }).setOrigin(0.5).setAlpha(1);

        const settingsBox = this.add.image(640, 360, 'signLong').setOrigin(0.5).setScale(3);
        const musicText = this.add.text(525, 300, "MUSIC", {color: "#f7f1f1",
            fontSize: "40px",
            fontFamily: "pixel",
        }).setOrigin(0.5).setAlpha(1);
        const sfxText = this.add.text(755, 300, "SFX", {color: "#f7f1f1",
            fontSize: "40px",
            fontFamily: "pixel",
        }).setOrigin(0.5).setAlpha(1);

        const musicSwitch = this.add.image(525, 375, 'onSwitch').setOrigin(0.5).setScale(3).setInteractive();
        const musicSwitchOff = this.add.image(525, 375, 'offSwitch').setOrigin(0.5).setScale(3).setInteractive().setAlpha(0);
        const sfxSwitch = this.add.image(755, 375, 'onSwitch').setOrigin(0.5).setScale(3).setInteractive();
        const sfxSwitchOff = this.add.image(755, 375, 'offSwitch').setOrigin(0.5).setScale(3).setInteractive().setAlpha(0);


        if (this.registry.get('musicEnabled')) {
            musicSwitch.setAlpha(1);
            musicSwitchOff.setAlpha(0);
        } else {
            musicSwitch.setAlpha(0);
            musicSwitchOff.setAlpha(1);
        }
        if (this.registry.get('sfxEnabled')) {
            sfxSwitch.setAlpha(1);
            sfxSwitchOff.setAlpha(0);
        } else {
            sfxSwitch.setAlpha(0);
            sfxSwitchOff.setAlpha(1);
        }

        musicSwitch.on('pointerdown', () => { //music off
            musicSwitch.setAlpha(0);
            musicSwitchOff.setAlpha(1);
            musicSwitchOff.setInteractive();
            musicSwitch.disableInteractive();
            synth2.triggerAttackRelease("C2", "8n");
            this.toggleMusic();
            this.tweens.add({
                targets: musicSwitchOff, scale: 2.8, duration: 200,
                yoyo: true, repeat: 0, ease: 'Sine.easeInOut'
                })
            
        });
        musicSwitchOff.on('pointerdown', () => { //music on
            musicSwitch.setAlpha(1);
            musicSwitchOff.setAlpha(0);
            musicSwitch.setInteractive();
            musicSwitchOff.disableInteractive();
            synth2.triggerAttackRelease("C3", "8n");
            this.toggleMusic();
            this.tweens.add({
                targets: musicSwitch, scale: 2.8, duration: 200,
                yoyo: true, repeat: 0, ease: 'Sine.easeInOut'
                })
        });
        sfxSwitch.on('pointerdown', () => { //sfx off
            sfxSwitch.setAlpha(0);
            sfxSwitchOff.setAlpha(1);
            sfxSwitchOff.setInteractive();
            sfxSwitch.disableInteractive();
            synth2.triggerAttackRelease("C2", "8n");
            this.toggleSFX();
            this.tweens.add({
                targets: sfxSwitchOff, scale: 2.8, duration: 200,
                yoyo: true, repeat: 0, ease: 'Sine.easeInOut'
                })
        });
        sfxSwitchOff.on('pointerdown', () => { //sfx on
            sfxSwitch.setAlpha(1);
            sfxSwitchOff.setAlpha(0);
            sfxSwitch.setInteractive();
            sfxSwitchOff.disableInteractive();
            synth2.triggerAttackRelease("C3", "8n");
            this.toggleSFX();
            this.tweens.add({
                targets: sfxSwitch, scale: 2.8, duration: 200,
                yoyo: true, repeat: 0, ease: 'Sine.easeInOut'
                })
        });

        returnButton.on('pointerdown', ()=> returnButton.setTint(0x965A0B));
        returnButton.on('pointerover', ()=> returnButton.setTint(0xeab269));
        returnButton.on('pointerout', ()=> returnButton.clearTint());
        returnButton.on('pointerup', ()=>{
            returnButton.clearTint();
            synth2.triggerAttackRelease("C3", "8n");
            this.scene.resume('main-menu');
            this.scene.stop();

            });
    
    }
}