import Phaser from "phaser";

export default class Citadel extends Phaser.Scene {
    ShouldEnableDebugForCollision: boolean;

    constructor() {
        super("citadel");
        this.ShouldEnableDebugForCollision = false;
    }

    preload() {

    }

    create() {
        console.log('in Citadel create method');
        const map = this.make.tilemap({ key: 'citadel' });
        const tileset = map.addTilesetImage('citadel-tileset', 'tiles');

        map.createLayer("Ground", tileset);

        const wallsLayer = map.createLayer("Walls", tileset);

        if (this.ShouldEnableDebugForCollision) {
            wallsLayer.setCollisionByProperty({
                collides: true
            })
            const debugGraphics = this.add.graphics().setAlpha(0.30)
            wallsLayer.renderDebug(debugGraphics, {
                tileColor: null,
                collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
                faceColor: new Phaser.Display.Color(40, 39, 37, 255)
            })
        }

        const player = this.add.sprite(40,40, 'player','kanji-atk-right-2.png')

        this.anims.create({
            key: 'player-idle-down',
            frames: [{
                key: 'player', 
                frame:'kanji-atk-down-0.png'}]
        })
        
        this.anims.create({
            key:'player-idle-up',
            frames:[{
                key: 'player',
                frame: 'kanji-atk-up-0.png'
            }]
        })

        this.anims.create({
            key:'player-move-down',
            frames:this.anims.generateFrameNames('player',{
                start: 0,
                end: 4,
                prefix: 'kanji-rundown-',
                suffix:'.png',
            }),
            repeat:-1,
            frameRate:5
        })

        player.anims.play('player-move-down')
    }

    update() {
        console.log("update Citadelscene");
    }
}
