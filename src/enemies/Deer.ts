import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript"
import { CreateAnimationSet, getNewRatName, Direction } from "~/game/gamelogic";


export default class Deer extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private speed = Phaser.Math.Between(0, 2)
    private moveEvent: Phaser.Time.TimerEvent
    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;
    private iconPng = "IconDeer.png"

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 2000),
            callback: () => {

                let chanceForIdle = Phaser.Math.Between(0, 4);

                this.speed = Phaser.Math.Between(1, 2);
                if (chanceForIdle == 1) {
                    this.facing == Direction.IDLE;

                } else {
                    this.facing = Phaser.Math.Between(0, 7)
                }

            },
            repeat: -1
        });


        this.scene.events.addListener('removeTitleMobs', () => {
            this.selfDestruct()
        })
        this.scene.events.addListener('fadeMobs', () => {
            this.fade()
        })

        this.StartingXLoc = x
        this.StartingYLoc = y

        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleCollisionWithSprite, this.scene)
        this.EntityID = Guid.create()
        this.name = "deer"

    }

    private handleCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {

    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {


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
        this.scene.events.addListener('player-interact-event', () => {
            console.log("Deer heard player attack event")
        })

    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt)

        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -this.speed)
                this.anims.play('enemy-deer-walk', true)
                break
            case Direction.DOWN:
                this.setVelocity(0, this.speed)
                this.anims.play('enemy-deer-walk', true)
                break
            case Direction.LEFT:
                this.setVelocity(-this.speed, 0)
                this.anims.play('enemy-deer-walk', true)
                this.flipX = true;
                break
            case Direction.RIGHT:
                this.setVelocity(this.speed, 0)
                this.anims.play('enemy-deer-walk', true)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-this.speed, -this.speed)
                this.anims.play('enemy-deer-walk', true)
                this.flipX = true;
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.speed, this.speed)
                this.anims.play('enemy-deer-walk', true)
                this.flipX = true;
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(this.speed, -this.speed)
                this.anims.play('enemy-deer-walk', true)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.speed, this.speed)
                this.anims.play('enemy-deer-walk', true)
                break
            case Direction.IDLE:
                this.setVelocity(0, 0)
                this.anims.play('enemy-deer-idle', true)
                break
        }
    }
}

