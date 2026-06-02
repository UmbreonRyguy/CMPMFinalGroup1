const crusher = new Tone.BitCrusher(7).toDestination();

const synth = new Tone.Synth().toDestination();
const synth2 = new Tone.Synth().toDestination().connect(crusher);
var canPlaySound = true;

export default class Example extends Phaser.Scene {
    constructor() {
        super('example');
    }
    create() {
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const now = Tone.now();
        if(this.cursors.left.isDown && canPlaySound) {
            canPlaySound = false;
            setTimeout(() => {
                canPlaySound = true;
            }, 500);
        }

        if(this.cursors.right.isDown && canPlaySound) { //Level Select Button
            synth2.triggerAttackRelease("C5", "8n", now);
            synth2.triggerAttackRelease("E5", "8n", now + 0.1);
            synth2.triggerAttackRelease("G4", "8n", now + 0.2);
            synth2.triggerAttackRelease("C4", "8n", now + 0.3);
            canPlaySound = false;
            setTimeout(() => {
                canPlaySound = true;
            }, 500);
        }
        if(this.cursors.up.isDown && canPlaySound) { //Start Button
            synth2.triggerAttackRelease("D3", "8n");
            synth2.triggerAttackRelease("G3", "8n", now + 0.1);
            canPlaySound = false;
            setTimeout(() => {
                canPlaySound = true;
            }, 500);
        }

        if(this.cursors.down.isDown && canPlaySound) { //Settings Button
            synth2.triggerAttackRelease("B3", "8n");
            canPlaySound = false;
            setTimeout(() => {
                canPlaySound = true;
            }, 500);
        }

        if(this.cursors.space.isDown && canPlaySound) { //Settings Toggle
            synth2.triggerAttackRelease("D3", "8n");
            canPlaySound = false;
            setTimeout(() => {
                canPlaySound = true;
            }, 500);
        }

        if(this.cursors.shift.isDown && canPlaySound) { //Credits Button
            synth2.triggerAttackRelease("C4", "8n");
            synth2.triggerAttackRelease("G4", "8n", now + 0.1);
            canPlaySound = false;
            setTimeout(() => {
                canPlaySound = true;
            }, 500);
        }


    }
}