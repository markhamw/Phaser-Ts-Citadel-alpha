import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript"
import { CreateAnimationSet, Direction, getNewRatName } from "~/game/gamelogic";
import OverworldTitle from "~/scenes/OverworldTitle";
import Player from "~/characters/Player";
import Overworld from "~/scenes/Overworld";

enum VocalEmotes {
    Squee,
    SQQUEE,
    EEEEeee,
    PPSSffkkk,
    ReeeeeEEEttt,
    Effyou,
}
type WRGameScene = OverworldTitle | Overworld;


export default class Rat extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private RatSpeed: number;
    private moveEvent: Phaser.Time.TimerEvent;
    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;
    public isAlive: boolean = true;
    private stationary: boolean = false;

    constructor(scene: Overworld | OverworldTitle, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)

        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(2000, 9000),
            callback: () => {

            },
            loop: true
        });

        this.StartingXLoc = x
        this.StartingYLoc = y
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleCollisionWithSprite, this.scene)
        this.EntityID = Guid.create()
        this.name = getNewRatName()
        this.RatSpeed = 0;
        this.scene.events.addListener('removeTitleMobs', () => {
            this.selfDestruct()
        })
        this.scene.events.addListener('fadeMobs', () => {
            this.fade()
        })

        this.scene.events.addListener('player-clicked-fight', () => {
            this.scene.events.emit('player-killed-rat', this)
            this.scene.sound.add('ratsound', { volume: 0.1, detune: Phaser.Math.Between(-500, -1200) }).play()
            this.selfDestruct()
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

    isNearPlayer(player: Player): boolean {
        let distance = this.distanceFrom(player, this.scene)
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

    }


    distanceFromStartingLocation = (): number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
    }

    selfDestruct = () => {
        this.moveEvent.destroy()
        this.isAlive = false;
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
        /* this.scene.events.addListener('player-interact-event', (player) => {
            console.log(player)
        }) */
    }

    distanceFrom(obj: Player, scene: any): number {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, scene.player.x, scene.player.y))
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

