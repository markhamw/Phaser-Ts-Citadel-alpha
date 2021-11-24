import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript"

enum Direction {
    RIGHTANDDOWN,
    LEFTANDDOWN,
}


export default class FlyingRat extends Phaser.Physics.Arcade.Sprite {

    private facing = Phaser.Math.Between(0, 1)
    private RatSpeed = Phaser.Math.Between(5, 15)
    private moveEvent: Phaser.Time.TimerEvent
    private StartingXLoc: number;
    private StartingYLoc: number;
    private EntityID: Guid;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.moveEvent = scene.time.addEvent({
            delay: Phaser.Math.Between(7000, 29000),
            callback: () => {
                let chancemove = Phaser.Math.Between(0, 4);
                this.facing = chancemove == 2 ? Direction.LEFTANDDOWN : Direction.RIGHTANDDOWN
                if (this.distanceFromStartingLocation() > 150) {
                    this.destroyFlyingRat();
                }
            },
            repeat: -1
        });

        this.StartingXLoc = x
        this.StartingYLoc = y

        this.EntityID = Guid.create()

    }


    destroyFlyingRat = () => {
        this.moveEvent.destroy();
        this.destroy();
    }

    distanceFromStartingLocation = (): number => {
        return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
    }

    preload() {

    }
    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)

        switch (this.facing) {
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-flyingrat-moveleft', true)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.RatSpeed, this.RatSpeed)
                this.anims.play('enemy-flyingrat-moveright', true)
                break
        }


    }
}