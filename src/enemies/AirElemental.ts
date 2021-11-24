import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";

import { Guid } from "guid-typescript"

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    IDLE,
}

enum VocalEmotes {
    GRRAAA,
    GROOOOCK,
    HATECHA,
}

export default class AirElemental extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 4)
    private speed: number;
    private moveEvent: Phaser.Time.TimerEvent
    private DiscardCurrentTrashTalk: Phaser.Time.TimerEvent
    private CurrentTrashTalk!: Phaser.GameObjects.Text
    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;

    private isAlive: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {
                this.CurrentTrashTalk.visible = false;
                let chanceForIdle = Phaser.Math.Between(0, 4);
                let chanceForEmote = Phaser.Math.Between(0, 4);
                this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)

            },
            loop: true
        });
        this.scene.events.addListener('player-interact-event', (player) => {
            this.isAlive = false;
        })


        this.DiscardCurrentTrashTalk = scene.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                if (this.CurrentTrashTalk.visible) {
                    this.CurrentTrashTalk.setActive(false)
                    this.CurrentTrashTalk.visible = false
                }
            }
        })

        this.speed = Phaser.Math.Between(1, 3);
        this.StartingXLoc = x
        this.StartingYLoc = y
        this.CurrentTrashTalk = scene.add.text(this.x, this.y, VocalEmotes[Phaser.Math.Between(0, 7)])
        this.CurrentTrashTalk.visible = false;

        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleCollisionWithSprite, this.scene)
        this.EntityID = Guid.create()

    }

    isNearPlayer(player: Phaser.Physics.Arcade.Sprite): boolean {
        return true
    }

    get getEntityID() {
        return this.EntityID
    }

    private handleCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as unknown as AirElemental

        _go.moveEvent.callback()

        console.log('Collision with tile/map detected')
        console.log('EntityID:', _go.getEntityID)

    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as AirElemental
        _go.moveEvent.callback()
        console.log('Collision with sprite detected')
    }

    distanceFromStartingLocation = (): number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
    }

    selfDestruct = () => {

        this.anims.play('enemy-airelemental-dead', true)
    }

    preload() {

    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt)
        if (this.isAlive) {
            switch (this.facing) {
                case Direction.UP:
                    this.setVelocity(0, -this.speed)
                    this.anims.play('enemy-airelemental-moveup', true)
                    break
                case Direction.DOWN:
                    this.setVelocity(0, this.speed)
                    this.anims.play('enemy-airelemental-movedown', true)
                    break
                case Direction.LEFT:
                    this.setVelocity(-this.speed, 0)
                    this.anims.play('enemy-airelemental-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.RIGHT:
                    this.setVelocity(this.speed, 0)
                    this.anims.play('enemy-airelemental-moveright', true)
                    break
                case Direction.IDLE:
                    this.setVelocity(0, 0)
                    this.anims.play('enemy-airelemental-idle', true)
                    break
            }
        } else {
            this.setVelocity(0, 0)
            this.scene.events.emit('enemy-shaman-dead-event', this)
            //this.anims.play('enemy-shaman-dead', true)
        }

    }
}