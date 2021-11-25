import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";

import { Guid } from "guid-typescript"
import { getNewRatName } from "~/game/gamelogic";

enum Direction {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    RIGHTANDUP,
    RIGHTANDDOWN,
    LEFTANDUP,
    LEFTANDDOWN,
    IDLE,
}


enum VocalEmotes {
    Squee,
    SQQUEE,
    EEEEeee,
    PPSSffkkk,
    ReeeeeEEEttt,
    Effyou,
}
export default class Rat extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private RatSpeed = Phaser.Math.Between(0, 2)
    private moveEvent: Phaser.Time.TimerEvent


    private RatAlpha!: number;
    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;
    private ratname: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {

                let chanceForIdle = Phaser.Math.Between(0, 4);
                let chanceForEmote = Phaser.Math.Between(0, 4);
                this.RatSpeed = chanceForIdle == 1 ? 0 : Phaser.Math.Between(0, 3)
                this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)

            },
            loop: true
        });
        this.scene.events.addListener('player-interact-event', (player) => {

            console.log('heard by rat in listener')
            console.log(`${this.ratname} is at ${this.x} ${this.y}`)
            console.log("player is at ", player.x, player.y)
            let xDiff = this.x - player.x
            let yDiff = this.y - player.y
            if (xDiff && yDiff < 10) {
                this.selfDestruct()
            }

            //broken here

        })





        this.StartingXLoc = x
        this.StartingYLoc = y


        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleCollisionWithSprite, this.scene)
        this.EntityID = Guid.create()
        this.ratname = getNewRatName()
    }

    isNearPlayer(player: Phaser.Physics.Arcade.Sprite): boolean {
        return true
    }

    get getEntityID() {
        return this.EntityID
    }

    private handleCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as unknown as Rat

        _go.moveEvent.callback()

        console.log('Collision with tile/map detected')
        console.log('EntityID:', _go.getEntityID)
        console.log('Entity Name:', _go.ratname)
    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as Rat
        _go.moveEvent.callback()
        console.log('Collision with sprite detected')
    }
    /*   Scream = () => {
          this.scene.sound.play('ratsound',{detune: Phaser.Math.Between(150,250), volume: .1})
      }  */

    distanceFromStartingLocation = (): number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
    }

    selfDestruct = () => {
        this.moveEvent.destroy()

    }

    preload() {
        this.scene.events.addListener('player-interact-event', () => {
            console.log("Rat heard player attack event")
        })
    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt)

        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -this.RatSpeed)
                this.anims.play('enemy-rat-moveup', true)
            case Direction.DOWN:
                this.setVelocity(0, this.RatSpeed)
                this.anims.play('enemy-rat-movedown', true)
                break
            case Direction.LEFT:
                this.setVelocity(-this.RatSpeed, 0)
                this.anims.play('enemy-rat-moveleft', true)
                this.flipX = true;
                break
            case Direction.RIGHT:
                this.setVelocity(this.RatSpeed, 0)
                this.anims.play('enemy-rat-moveright', true)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-rat-moveleft', true)
                this.flipX = true;
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-rat-moveleft', true)
                this.flipX = true;
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-rat-moveright', true)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-rat-moveright', true)
                break
            case Direction.IDLE:
                this.setVelocity(0, 0)
                this.anims.play('enemy-rat-idle', true)
        }
    }
}