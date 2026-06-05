const crusher = new Tone.BitCrusher(7).toDestination();
const distortion = new Tone.Distortion(5).toDestination();
const reverb = new Tone.Reverb(3).toDestination();

const synth = new Tone.Synth().toDestination();
const synth2 = new Tone.Synth().toDestination().connect(crusher);
const synth3 = new Tone.Synth().toDestination().connect(distortion);

const synthRumble = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 } }).toDestination();
const crack = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).toDestination().connect(reverb);

const loopA = new Tone.Loop((time) => { 
            synthRumble.triggerAttackRelease("A2", "16n", time);     
            synthRumble.triggerAttackRelease("E2", "16n", time + 0.1);
        }, "8n").start(0);
const loopB = new Tone.Loop((time) => { 
            synthRumble.triggerAttackRelease("A2", "16n", time);     
            synthRumble.triggerAttackRelease("E2", "16n", time + 0.1);
        }, "12n").start(0);

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
            synth2.triggerAttackRelease("C4", "8n", now);
            synth2.triggerAttackRelease("E4", "8n", now + 0.1);
            synth2.triggerAttackRelease("G4", "8n", now + 0.2);
            synth2.triggerAttackRelease("C5", "6n", now + 0.3);
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

        // if(this.cursors.shift.isDown && canPlaySound) { //Credits Button
        //     synth2.triggerAttackRelease("C4", "8n");
        //     synth2.triggerAttackRelease("G4", "8n", now + 0.1);
        //     canPlaySound = false;
        //     setTimeout(() => {
        //         canPlaySound = true;
        //     }, 500);
        // }

        if(this.cursors.shift.isDown && canPlaySound) { //Rock Crack
        loopA.start();
        Tone.getTransport().start();
        setTimeout(() => {
            loopA.stop();
            loopB.start();
        }, 2000);
        setTimeout(() => {
            loopB.stop();
            crack.triggerAttackRelease("16n", now);
        }, 2000);
        canPlaySound = false;
        setTimeout(() => {
        canPlaySound = true;
        }, 500);
    }


    }
}