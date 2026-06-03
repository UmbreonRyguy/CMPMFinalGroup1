const reverb = new Tone.Reverb(3).toDestination();
const synthRumble = new Tone.Synth({ oscillator: { type: "square" }, envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.05 } }).toDestination();
const crack = new Tone.NoiseSynth({ noise: { type: "white" }, envelope: { attack: 0.001, decay: 0.15, sustain: 0, release: 0.05 } }).toDestination().connect(reverb);

const loopA = new Tone.Loop((time) => { 
    synthRumble.triggerAttackRelease("A2", "16n", time);     
    synthRumble.triggerAttackRelease("E2", "16n", time + 0.1);
}, "8n"); 

const loopB = new Tone.Loop((time) => { 
    synthRumble.triggerAttackRelease("B2", "16n", time);     
    synthRumble.triggerAttackRelease("F2", "16n", time + 0.1);
}, "12n"); 

var introOver = false;

export default class IntroCinematic extends Phaser.Scene {
    W = 1280; //height and width 
    H = 720;

    CX = this.W * 0.5; //center x and y
    CY = this.H * 0.5;

    




    shatter() { //function to shatter rock and make dust cloud at same time after rock shakes
        this.logoDone = false;

        for (let i = 0; i < 6; i++) { //generate 6 random rock pieces
            const angle = Phaser.Math.FloatBetween(0, Math.PI*2); //shard angle
            const dis = Phaser.Math.FloatBetween(120, 260); //shard distance
            const sh = this.add.image(this.CX, this.CY, 'shard').setOrigin(0.35, 0.28) //create rock shard
                .setScale(Phaser.Math.FloatBetween(1, 2.5)).setAngle(Phaser.Math.Between(0, 360));
            this.tweens.add({ //tween shard
                targets: sh,
                x: this.CX + Math.cos(angle) * dis, //move based on generated nums
                y: this.CY + Math.sin(angle) * dis + 60,
                angle: sh.angle + Phaser.Math.Between(-180, 180), //spin
                alpha: 0,
                duration: Phaser.Math.Between(700, 1200),
                ease: 'Quad.out',
                onComplete: () => sh.destroy() //destroy shard after tween
            });
        }
        for (let i = 0; i < 3; i++) { //create 3 dust clouds
            const dust = this.add.image(this.CX + Phaser.Math.FloatBetween(-120, 120), this.CY + 180, 'dust') //create dust cloud at random x near rock
                .setOrigin(0.5, 0.8).setAlpha(0).setScale(1.5);
            this.tweens.chain({
                targets: dust, //tween dust cloud
                tweens: [
                    { alpha: 0.9, scale: 1.8, duration: 200, ease: 'Quad.out' }, //rise and expand
                    { alpha: 0, y: this.CY + 40, scale: 2.3, duration: 1100, ease: 'Quad.out' } //fade out and move up
                ],
                onComplete: () => {
                    dust.destroy(); //destroy dust cloud after tween
                    this.time.delayedCall(1000, () => {
                        //this.scene.launch('leaf-transition', {target: 'main-menu' });
                        //this.cameras.main.fadeOut(500, 0, 0, 0); //fade out after cinematic is done
                        this.logoDone = true;
                    });
                }
            });
        }
    }
    
    constructor() {
        super('intro-cinematic');
    }

    preload() {
        // load assets used in logo/intro
        this.load.image("prototypeLogo", "assets/prototypeLogo.png");
        this.load.image("rock", "assets/rockForPrototypeCinematic.png");
        this.load.image("shard", "assets/rockShardForPrototype.png");
        this.load.image("dust", "assets/dustCloud.png");

    }
    create() {
        

        // all the rest of the assets used in the game are loaded here
        // this loading happens while the logo cinematic is playing
        this.loadingDone = false;
        // assets go here
        this.load.image('bg', 'assets/finalproj-main-menu-protbg.png');
        this.load.image('credits', 'assets/finalproj-main-menu-prototype-creditssign.png'); //assets must be switched out to credits button
        this.load.image('settings', 'assets/finalproj-main-menu-prototype-settingssign.png');
        this.load.image('start', 'assets/finalproj-main-menu-prototype-startsign.png');
        this.load.image('title', 'assets/finalproj-main-menu-prototype-titlesign.png');
        this.load.image('leaf', 'assets/leaf.png');
        this.load.tilemapTiledJSON("prototypeTilemap", "assets/prototypeTilemap.json");
        this.load.spritesheet("Prototype_Tiles", "assets/Prototype_Tiles.png", {frameWidth: 80, frameHeight: 80});
        this.load.atlas("levers", "assets/levers.png", "assets/textureAtlas.json");
        this.load.image('player', 'assets/PlaceholderPlayer.png');
        this.load.image('jumpButton', 'assets/ArrowButton.png');
        this.load.image('leftButton', 'assets/ArrowButton.png');
        this.load.image('rightButton', 'assets/ArrowButton.png');
        
        //assets used for prefab
        this.load.image('trash', 'assets/Trash.png');
        this.load.image('treasure', 'assets/treasure.png');
        this.load.image('jumpButton', 'assets/LargerArrowButton.png');
        this.load.image('leftButton', 'assets/LargerArrowButton.png');
        this.load.image('rightButton', 'assets/LargerArrowButton.png');
        this.load.audio('bgmusic', 'assets/prototype-bg-music.mp3');
        this.load.audio('shorthop', 'assets/ShortHop.wav');
        this.load.start();

        this.load.once("complete", () => {
            this.loadingDone = true;
        });

        this.prototypeLogo = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "prototypeLogo")
            .setScale(2)
            .setAlpha(0);
        this.rock = this.add.image(this.game.config.width * 0.5, this.game.config.height * 0.5, "rock")
            .setScale(2);
        //the scale thing is just because i drew these on a canvas half the size of the current game canvas


        //sound fx for rock shattering

        Tone.getTransport().start();
        loopA.start();


        this.tweens.chain({
            targets: this.rock,
            tweens: [
                { x: { from: this.CX - 6, to: this.CX + 6 }, angle: { from: -2.5, to: 2.5 }, //shake
                    duration: 60, yoyo: true, repeat: 5, ease: 'Sine.inOut',
                    onComplete: () => {
                        loopA.stop();
                        loopB.start();
                    }
                 },
                { x: { from: this.CX - 12, to: this.CX + 12 }, angle: { from: -5, to: 5 }, //more intense shake
                    duration: 42, yoyo: true, repeat: 8, ease: 'Sine.inOut', 
                    onComplete: () => {
                        loopB.stop();
                        Tone.getTransport().stop();
                    }
                },
                { x: this.CX, angle: 0, duration: 50 }, //center rock

                { alpha: 0, scaleX: this.S * 1.12, scaleY: this.S * 1.12, duration: 320, ease: 'Quad.in',
                    onStart: () => {this.shatter(), //shatter rock and make dust cloud
                    crack.triggerAttackRelease("16n", Tone.now());
                    }
                },  
                { targets: this.prototypeLogo, alpha: 1, scaleX: 2, scaleY: 2,
                    duration: 850, ease: 'Back.out' } //reveal logo
            ]
        });

        // button to skip intro
        this.skip = this.input.keyboard.addKey('SPACE');
    }
    update() {
        if (this.loadingDone && (!this.introOver && (this.logoDone || Phaser.Input.Keyboard.JustDown(this.skip)))) {
            introOver = true;
            this.scene.start('leaf-transition', {target: 'main-menu'}); // load main menu after cinematic is done AND loading is done
            this.cameras.main.fadeOut(500, 0, 0, 0); //fade out after cinematic is done
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.stop('intro-cinematic');
            });
            Tone.getTransport().stop();
            //this.scene.start('core-gameplay'); // skip to a further scene for debug/testing
        }
    }
}