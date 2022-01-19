import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript"
import { getNewRatName, Direction } from "~/game/gamelogic";



enum VocalEmotes {
    PPSSffkkk,
    GRAAA,
    YOUDONKEY,
}
export default class Shaman extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 7)
    private RatSpeed = Phaser.Math.Between(0, 2)
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
                this.RatSpeed = chanceForIdle == 1 ? 0 : Phaser.Math.Between(0, 3)
                this.facing = chanceForIdle == 1 ? Direction.IDLE : Phaser.Math.Between(0, 7)
                if (chanceForEmote == 1) {

                } else if (chanceForEmote == 2) {
                    let atk = this.anims.play({ key: 'enemy-shaman-attack', repeat: 0 })
                } else {
                    this.anims.play('enemy-shaman-idle', true)
                }
            },
            loop: true
        });
        this.scene.events.addListener('player-interact-event', (player) => {
            this.isAlive = false;

        })
        this.scene.events.addListener('fadeMobs', () => {
            this.fade()
        })
        this.scene.events.addListener('enemy-shaman-dead-event', (enemy) => {
            this.anims.play('enemy-shaman-dead', true);

            this.once('animationcomplete', (animation, frame) => {
                this.moveEvent.remove();
                this.DiscardCurrentTrashTalk.remove();
                this.isAlive = false;

                this.setActive(false).setVisible(false);

            })
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
        this.scene.events.addListener('removeTitleMobs', () => {
            this.selfDestruct()
        })

        this.scene.events.addListener('player-clicked-fight', () => {
            this.scene.events.emit('player-killed-shaman', this)
            this.scene.sound.add('ratsound', { volume: 0.1, detune: Phaser.Math.Between(-2000, -3000) }).play()
            this.isAlive = false;
            this.setVelocity(0, 0);
            this.anims.play({ key: 'enemy-shaman-dead', frameRate: 4, repeat: 0 }).on('animationcomplete', () => {
                this.moveEvent.destroy();
                this.DiscardCurrentTrashTalk.destroy();
                this.CurrentTrashTalk.destroy();
                this.isAlive = false;
                this.anims.stop();
            })

        })


    }
    private handleCollisionWithSprite(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {

    }
    selfDestruct = () => {
        this.anims.play('enemy-shaman-dead', true)
        this.moveEvent.destroy()
        this.CurrentTrashTalk.destroy()
        this.DiscardCurrentTrashTalk.destroy()
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
    isNearPlayer(player: Phaser.Physics.Arcade.Sprite): boolean {
        return true
    }

    get getEntityID() {
        return this.EntityID
    }

    private handleCollision(go: Phaser.GameObjects.GameObject, tile: Phaser.Tilemaps.Tile) {
        let _go = go as unknown as Shaman
        _go.moveEvent.callback()

    }


    distanceFromStartingLocation = (): number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
    }



    preload() {

    }
    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt)
        if (this.isAlive) {

            switch (this.facing) {
                case Direction.UP:
                    this.setVelocity(0, -this.RatSpeed)
                    this.anims.play('enemy-shaman-moveup', true)
                    break
                case Direction.DOWN:
                    this.setVelocity(0, this.RatSpeed)
                    this.anims.play('enemy-shaman-movedown', true)
                    break
                case Direction.LEFT:
                    this.setVelocity(-this.RatSpeed, 0)
                    this.anims.play('enemy-shaman-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.RIGHT:
                    this.setVelocity(this.RatSpeed, 0)
                    this.anims.play('enemy-shaman-moveright', true)
                    break
                case Direction.LEFTANDUP:
                    this.setVelocity(-this.RatSpeed, -this.RatSpeed)
                    this.anims.play('enemy-shaman-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.LEFTANDDOWN:
                    this.setVelocity(-this.RatSpeed, this.RatSpeed)
                    this.anims.play('enemy-shaman-moveleft', true)
                    this.flipX = true;
                    break
                case Direction.RIGHTANDUP:
                    this.setVelocity(this.RatSpeed, -this.RatSpeed)
                    this.anims.play('enemy-shaman-moveright', true)
                    break
                case Direction.RIGHTANDDOWN:
                    this.setVelocity(this.RatSpeed, this.RatSpeed)
                    this.anims.play('enemy-shaman-moveright', true)
                    break
                case Direction.IDLE:
                    this.setVelocity(0, 0)
                    this.anims.play('enemy-shaman-idle', true)
                    break
            }
        } else {
            this.setVelocity(0, 0)
        }

    }
}