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

export default class EarthGolem extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 4)
    private speed: number;
    private moveEvent: Phaser.Time.TimerEvent


    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;

    private isAlive: boolean = true;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {

                let chanceForIdle = Phaser.Math.Between(0, 4);
                let chanceForEmote = Phaser.Math.Between(0, 4);
                this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)

            },
            loop: true
        });


        this.speed = Phaser.Math.Between(1, 3);
        this.StartingXLoc = x
        this.StartingYLoc = y


        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleCollisionWithSprite, this.scene)
        this.EntityID = Guid.create()
        this.scene.events.addListener('removeTitleMobs', () => {
            this.selfDestruct()
        })
        this.scene.events.addListener('fadeMobs', () => {
            this.fade()
        })
    }

    isNearPlayer(player: Phaser.Physics.Arcade.Sprite): boolean {
        return true
    }

    get getEntityID() {
        return this.EntityID
    }

    private handleCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as unknown as EarthGolem

        _go.moveEvent.callback()


    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as EarthGolem
        _go.moveEvent.callback()

    }
    fade = () => {
        this.scene.time.addEvent({
            repeat: 4,
            delay: 500,
            callback: () => {
                this.setAlpha(this.alpha - .3)
            }
        })
    }
    distanceFromStartingLocation = (): number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
    }

    selfDestruct = () => {
        this.moveEvent.destroy()
        this.destroy()
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
                    this.anims.play('enemy-earthgolem-moveup', true)
                    break
                case Direction.DOWN:
                    this.setVelocity(0, this.speed)
                    this.anims.play('enemy-earthgolem-movedown', true)
                    break
                case Direction.LEFT:
                    this.setVelocity(-this.speed, 0)
                    this.anims.play('enemy-earthgolem-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.RIGHT:
                    this.setVelocity(this.speed, 0)
                    this.anims.play('enemy-earthgolem-moveright', true)
                    break
                case Direction.IDLE:
                    this.setVelocity(0, 0)
                    this.anims.play('enemy-earthgolem-idle', true)
                    break
            }
        } else {
            this.setVelocity(0, 0)
            this.scene.events.emit('enemy-earthgolem-dead-event', this)
            //this.anims.play('enemy-shaman-dead', true)
        }

    }



}