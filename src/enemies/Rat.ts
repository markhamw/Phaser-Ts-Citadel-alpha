import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript"
import { CreateAnimationSet, Direction, getNewRatName } from "~/game/gamelogic";

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
    private moveEvent: Phaser.Time.TimerEvent;
    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;
    private ratname: string;
    private stationary: boolean = false;
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {
                if (this.distanceFromStartingLocation() > 5) {
                    this.stop()
                    this.setVelocity(0, 0);
                    this.facing = Phaser.Math.Between(0, 7)
                }
                if (!this.stationary) {
                    let chanceForIdle = Phaser.Math.Between(0, 4);
                    this.RatSpeed = chanceForIdle == 1 ? 0 : chanceForIdle
                    this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)

                }
            },
            loop: true
        });

        this.StartingXLoc = x
        this.StartingYLoc = y

        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleCollisionWithSprite, this.scene)
        this.EntityID = Guid.create()
        this.ratname = getNewRatName()
        this.scene.events.addListener('removeTitleMobs', () => {
            this.selfDestruct()
        })
        this.scene.events.addListener('fadeMobs', () => {
            this.fade()
        })
        CreateAnimationSet(this.scene, this.GenerateAnims(4));
    }

    GenerateAnims = (rate: number) => {
        return [
            {
                key: `enemy-rat-idle`,
                frames: this.anims.generateFrameNames('enemy-rat', {
                    start: 192,
                    end: 195,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,

            },
            {
                key: `enemy-rat-dead`,
                frames: this.anims.generateFrameNames('enemy-rat', {
                    start: 208,
                    end: 211,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,

            },
            {
                key: `enemy-rat-moveleft`,
                frames: this.anims.generateFrameNames('enemy-rat', {
                    start: 196,
                    end: 199,
                    prefix: 'tower-',
                    suffix: '.png',

                }),
                repeat: -1,
                frameRate: rate,
            },

            {
                key: `enemy-rat-moveright`,
                frames: this.anims.generateFrameNames('enemy-rat', {
                    start: 196,
                    end: 199,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            },
            {
                key: `enemy-rat-moveup`,
                frames: this.anims.generateFrameNames('enemy-rat', {
                    start: 196,
                    end: 199,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            },
            {
                key: `enemy-rat-movedown`,
                frames: this.anims.generateFrameNames('enemy-rat', {
                    start: 196,
                    end: 199,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            },
            {
                key: `enemy-rat-attack`,
                frames: this.anims.generateFrameNames('enemy-rat', {
                    start: 200,
                    end: 203,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            }

        ]
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


    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as Rat
        _go.moveEvent.callback()
        console.log(`Collision with ${_go.EntityID} detected on tile at ${tile.x}, ${tile.y}`)
    }


    distanceFromStartingLocation = (): number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
    }

    selfDestruct = () => {
        this.moveEvent.destroy()
        this.destroy()
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
    preload() {
        this.scene.events.addListener('player-interact-event', () => {
            console.log("Rat heard player attack event")
        })
    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt)
        if (this.stationary) {
            this.facing = Direction.IDLE;
        }
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