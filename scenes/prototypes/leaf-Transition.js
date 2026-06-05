export default class LeafTransition extends Phaser.Scene {
    constructor() {
        super('leaf-transition');
    }

    preload() {
        this.load.image('leaf1', 'assets/leafs/leaf1.png');
        this.load.image('leaf2', 'assets/leafs/leaf2.png');
        this.load.image('leaf3', 'assets/leafs/leaf3.png');
        this.load.image('leaf4', 'assets/leafs/leaf4.png');
    }

    create(data) {
        const W = 1280;
        const H = 720;
        const targetScene = this.scene.get(data.target);
        this.scene.launch(targetScene);
        this.scene.sendToBack(targetScene);
        
        //targetScene.cameras.main.fadeOut(1,0,0,0);

        this.time.delayedCall(100, () => {
            //targetScene.cameras.main.fadeIn(2500, 0, 0, 0);
        });

        for(let i = 0; i < 100; i++) {
            const delay = Phaser.Math.Between(0, 500);
            const leaf = this.add.image(-50, Phaser.Math.Between(0, H), `leaf${Phaser.Math.Between(1, 4)}`)
            .setScale(Phaser.Math.FloatBetween(2, 5))
            .setAngle(Phaser.Math.Between(0, 360))
            .setY(Phaser.Math.Between(-90, H + 90));
            
            this.tweens.add({
                targets: leaf,
                x: W + 50,
                y: { from: leaf.y, to: leaf.y + Phaser.Math.Between(-90, 90) },
                angle: leaf.angle + Phaser.Math.Between(-180, 540),
                duration: Phaser.Math.Between(1000, 1500),
                delay,
                ease: 'Quad.out',
                onComplete: () => leaf.destroy()
            });
        }
        this.time.delayedCall(3000, () => { this.scene.stop('leaf-transition'); });
    }


}