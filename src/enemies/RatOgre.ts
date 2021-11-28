import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript"
import { CreateAnimationSet, getNewRatName, Direction } from "~/game/gamelogic";


enum VocalEmotes {
    PPSSffkkk,
    GRAAA,
    YOUDONKEY,
}

export default class RatOgre extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private RatSpeed = Phaser.Math.Between(0, 2)
    private moveEvent: Phaser.Time.TimerEvent
    private DiscardCurrentTrashTalk: Phaser.Time.TimerEvent
    private CurrentTrashTalk!: Phaser.GameObjects.Text
    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;
    private ratname: string;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(1000, 2000),
            callback: () => {
                this.CurrentTrashTalk.visible = false;
                let chanceForIdle = Phaser.Math.Between(0, 4);
                let chanceForEmote = Phaser.Math.Between(0, 4);
                if (this.distanceFromStartingLocation() > 5) {
                    this.stop
                    this.facing = Phaser.Math.Between(0, 7)
                }
                this.RatSpeed = Phaser.Math.Between(3, 5);
                if (chanceForIdle == 1) {
                    this.facing == Direction.IDLE;
                    // console.log(`${this.ratname} is idle`)
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

        this.StartingXLoc = x
        this.StartingYLoc = y
        this.CurrentTrashTalk = scene.add.text(this.x, this.y, VocalEmotes[Phaser.Math.Between(0, 7)])
        this.CurrentTrashTalk.visible = false;

        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.TILE_COLLIDE, this.handleCollision, this.scene)
        this.scene.physics.world.on(Phaser.Physics.Arcade.Events.COLLIDE, this.handleCollisionWithSprite, this.scene)
        this.EntityID = Guid.create()
        this.ratname = getNewRatName()

        CreateAnimationSet(this.scene, this.GetRatOgreAnims(4));
    }

    private handleCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as unknown as RatOgre
        _go.moveEvent.callback()

    }

    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as RatOgre
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
        this.CurrentTrashTalk.destroy()
        this.DiscardCurrentTrashTalk.destroy()
        this.destroy()
    }
    GetRatOgreAnims = (rate: number) => {
        return [
            {
                key: `enemy-ratogre-idle`,
                frames: this.anims.generateFrameNames('enemy-ratogre', {
                    start: 296,
                    end: 299,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,

            },
            {
                key: `enemy-ratogre-moveleft`,
                frames: this.anims.generateFrameNames('enemy-ratogre', {
                    start: 300,
                    end: 303,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,

            },
            {
                key: `enemy-ratogre-moveright`,
                frames: this.anims.generateFrameNames('enemy-ratogre', {
                    start: 300,
                    end: 303,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            },
            {
                key: `enemy-ratogre-dead`,
                frames: this.anims.generateFrameNames('enemy-ratogre', {
                    start: 311,
                    end: 315,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            },
            {
                key: `enemy-ratogre-moveup`,
                frames: this.anims.generateFrameNames('enemy-ratogre', {
                    start: 300,
                    end: 303,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            },
            {
                key: `enemy-ratogre-movedown`,
                frames: this.anims.generateFrameNames('enemy-ratogre', {
                    start: 300,
                    end: 303,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: -1,
                frameRate: rate,
            },
            {
                key: `enemy-ratogre-attack`,
                frames: this.anims.generateFrameNames('enemy-ratogre', {
                    start: 304,
                    end: 307,
                    prefix: 'tower-',
                    suffix: '.png',
                }),
                repeat: 0,
                frameRate: rate,
            }

        ]
    }

    preload() {
        this.scene.events.addListener('player-interact-event', () => {
            console.log("RatOgre heard player attack event")
        })

    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt)
        this.CurrentTrashTalk.setPosition(this.x + 25, this.y - 25)
        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -this.RatSpeed)
                this.anims.play('enemy-ratogre-moveup', true)
                break
            case Direction.DOWN:
                this.setVelocity(0, this.RatSpeed)
                this.anims.play('enemy-ratogre-movedown', true)
                break
            case Direction.LEFT:
                this.setVelocity(-this.RatSpeed, 0)
                this.anims.play('enemy-ratogre-moveleft', true)
                this.flipX = true;
                break
            case Direction.RIGHT:
                this.setVelocity(this.RatSpeed, 0)
                this.anims.play('enemy-ratogre-moveright', true)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-ratogre-moveleft', true)
                this.flipX = true;
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-ratogre-moveleft', true)
                this.flipX = true;
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(this.RatSpeed, -this.RatSpeed)
                this.anims.play('enemy-ratogre-moveright', true)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-ratogre-moveright', true)
                break
            case Direction.IDLE:
                this.setVelocity(0, 0)
                this.anims.play('enemy-ratogre-idle', true)
                break
        }
    }
}

