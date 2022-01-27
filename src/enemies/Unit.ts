import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript";
import { CreateAnimationSet, getNewRatName, Direction } from "~/game/gamelogic";
import { AnimatedEnemy, AnimatedEnemyAttack, AnimatedEnemyHit, AnimatedEnemyIdle, AnimatedEnemyWalk, CollideWithOverWorldAndPlayer, InitAnims } from "./enemies";
import { DestroySprite, Stop } from "~/game/enemylogic";
import Overworld from "~/scenes/Overworld";
import Player, { TalkBubble } from "~/characters/Player";
import { IdleAnim, } from "./enemies";
import { enemies } from "./enemies";

export interface EnemyType {
    enemydata: EnemyData;
}

export type EnemyData = {
    name: string;
    descriptiveName: string;
    speed: number;
    SpriteAtlasKey: string;
    IconPng: string;
    PathToPNG: string;
    PathToJSON: string;
    JsonPrefixIdle: string;
    JsonPrefixWalk: string;
    JsonPrefixAttack: string;
    JsonPrefixHit: string;
    JsonPrefixDeath: string;
    IdleAnimKey: string;
    WalkAnimKey: string;
    HitAnimKey: string;
    AttackAnimKey: string;
    DeathAnimKey: string;
    PlayerInteractionLines?: string[];
    ResponseToPlayerLines?: string[];
}


declare global {
    namespace Phaser.GameObjects {
        interface GameObjectFactory {
            unit(x: number, y: number, texture: string, enemydata: EnemyData, frame?: string | number): Unit;
        }
    }
}


export default class Unit
    extends Phaser.Physics.Arcade.Sprite implements EnemyType {
    facing = 8;
    enemydata: EnemyData;
    hit: number = 0;
    inBattle: boolean = false;
    tb!: TalkBubble;
    roam?: boolean;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        data: EnemyData,
        frame?: string | number,
    ) {
        super(scene, x, y, texture, frame);
        this.enemydata = data
        this.scene.physics.world.on(
            Phaser.Physics.Arcade.Events.TILE_COLLIDE,
            this.handleCollision
        );
        this.scene.physics.world.on(
            Phaser.Physics.Arcade.Events.COLLIDE,
            this.handleCollisionWithSprite
        );
        InitAnims(this)
        CollideWithOverWorldAndPlayer(this, this.scene);
        this.setInteractive();
        this.play(this.enemydata!.IdleAnimKey);
    }
    Move() {
        let chanceForIdle = Phaser.Math.Between(0, 4);
        if (chanceForIdle == 1 || 2 || 3) {
            this.facing = 8;
            Stop(this.scene, this)
            this.play(this.enemydata!.IdleAnimKey);
        } else {
            this.facing = Phaser.Math.Between(0, 7);
            this.enemydata!.speed = Phaser.Math.Between(1, 3);
        }
    }


    handleCollision(
        go: Phaser.GameObjects.GameObject,
        tile: Phaser.Tilemaps.Tile
    ) {
        Stop(this, go)

    }

    handleCollisionWithSprite(
        unit: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ) {
        console.log("emitting hit event")
        this.scene.events.emit('enemy-collision', this, obj2);
        console.log(this, obj2)
    }

    preload() {
        this.scene.load.atlas(this.enemydata!.name, this.enemydata!.PathToPNG, this.enemydata!.PathToJSON)
    }

    create() {
        this.scene.time.addEvent({
            delay: Phaser.Math.Between(4000, 7000),
            callback: () => {
                this.Move()
            },
            repeat: -1,
        });
    }

    decideMovement() {

        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -this.enemydata!.speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.DOWN:
                this.setVelocity(0, this.enemydata!.speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.LEFT:
                this.setVelocity(-this.enemydata!.speed, 0)
                AnimatedEnemyWalk(this)
                this.flipX = true;
                break
            case Direction.RIGHT:
                this.setVelocity(this.enemydata!.speed, 0)
                AnimatedEnemyWalk(this)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-this.enemydata!.speed, -this.enemydata!.speed)
                AnimatedEnemyWalk(this)
                this.flipX = true;
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-this.enemydata!.speed, this.enemydata!.speed)
                AnimatedEnemyWalk(this)
                this.flipX = true;
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(this.enemydata!.speed, -this.enemydata!.speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(this.enemydata!.speed, this.enemydata!.speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.IDLE:
                this.setVelocity(0, 0)
                let chancenum = Phaser.Math.Between(0, 4);
                //1 to 50 because its using delta time
                let chanceforIdleAnim = Phaser.Math.Between(0, 75);
                if (chanceforIdleAnim == 1) {
                    AnimatedEnemyIdle(this);
                }
                let chanceforAttackAir = Phaser.Math.Between(0, 175);
                if (chanceforAttackAir == 2) {
                    AnimatedEnemyAttack(this);
                }
                break
        }
    }

    preUpdate(t: number, dt: number) {
        this.flipX = false;
        super.preUpdate(t, dt);

        if (this.hit > 0) {
            console.log('being hit')
            ++this.hit;
            if (this.hit > 8) {
                this.hit = 0;
            }
            return
        } else {
            if (this.active) {
                if (this.roam) {
                    this.decideMovement();
                }

            }
        }


    }
}


Phaser.GameObjects.GameObjectFactory.register(
    "unit",
    function (this: Phaser.GameObjects.GameObjectFactory, x: number, y: number, texture: string, enemydata: EnemyData, frame?: string | number) {
        var sprite = new Unit(this.scene as any, x, y, texture, enemydata, frame);

        this.displayList.add(sprite);
        this.updateList.add(sprite);
        this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);

        return sprite;
    }
);

/* this.scene.events.addListener('player-clicked-fight', () => {
    this.scene.events.emit('player-killed-rat', this)
    this.scene.sound.add('ratsound', { volume: 0.1, detune: Phaser.Math.Between(-500, -1200) }).play()
    this.isAlive = false;
    this.anims.play({ key: 'enemy-rat-dead', frameRate: 3, repeat: 0, delay: 1 })
}) */