import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript";
import { CreateAnimationSet, getNewRatName, Direction } from "~/game/gamelogic";
import { AnimatedEnemy, AnimatedEnemyHit, AnimatedEnemyIdle, AnimatedEnemyWalk, CollideWithOverWorldAndPlayer, InitAnims } from "./enemies";
import { DestroySprite } from "~/game/enemylogic";
import Overworld from "~/scenes/Overworld";
import Player from "~/characters/Player";
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

}
export function GetEnemyDataByName(enemies: EnemyData[], name: string): EnemyData {
    let data = enemies.find(e => e.name === name);
    return data ?? {} as EnemyData;
}

export function GetEnemyType(key: string): EnemyType {
    return enemies[key];
}

export function GetEnemyData(key: string): EnemyData {
    return GetEnemyType(key).enemydata;
}

export function GetEnemyName(key: string): string {
    return GetEnemyData(key).name;
}

export function GetEnemyDescriptiveName(key: string): string {
    return GetEnemyData(key).descriptiveName;
}

export function GetEnemySpeed(key: string): number {
    return GetEnemyData(key).speed;
}

export function GetEnemySpriteAtlasKey(key: string): string {
    return GetEnemyData(key).SpriteAtlasKey;
}

export function GetEnemyIconPng(key: string): string {
    return GetEnemyData(key).IconPng;
}

export function GetEnemyPathToPNG(key: string): string {
    return GetEnemyData(key).PathToPNG;
}

export function GetEnemyPathToJSON(key: string): string {
    return GetEnemyData(key).PathToJSON;
}

export function GetEnemyJsonPrefixIdle(key: string): string {
    return GetEnemyData(key).JsonPrefixIdle;
}

export function GetEnemyJsonPrefixWalk(key: string): string {
    return GetEnemyData(key).JsonPrefixWalk;
}

export function GetEnemyJsonPrefixAttack(key: string): string {
    return GetEnemyData(key).JsonPrefixAttack;
}

export function GetEnemyJsonPrefixHit(key: string): string {
    return GetEnemyData(key).JsonPrefixHit;
}

export function GetEnemyJsonPrefixDeath(key: string): string {
    return GetEnemyData(key).JsonPrefixDeath;
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
    private facing = 0;
    enemydata: EnemyData;
    hit: number = 0;
    inBattle: boolean = false;

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
    }
    Move() {
        let chanceForIdle = Phaser.Math.Between(0, 4);

        this.enemydata!.speed = Phaser.Math.Between(1, 8);
        if (chanceForIdle == 1 || 2) {
            this.facing = 0;
        } else {
            this.facing = Phaser.Math.Between(1, 7);
        }
    }
    Stop() {
        this.enemydata!.speed = 0;
        this.facing = 0;
    }

    handleCollision(
        go: Phaser.GameObjects.GameObject,
        tile: Phaser.Tilemaps.Tile
    ) {

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
        let { speed } = this.enemydata!;
        switch (this.facing) {
            case Direction.UP:
                this.setVelocity(0, -speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.DOWN:
                this.setVelocity(0, speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.LEFT:
                this.setVelocity(-speed, 0)
                AnimatedEnemyWalk(this)
                this.flipX = true;
                break
            case Direction.RIGHT:
                this.setVelocity(speed, 0)
                AnimatedEnemyWalk(this)
                break
            case Direction.LEFTANDUP:
                this.setVelocity(-speed, -speed)
                AnimatedEnemyWalk(this)
                this.flipX = true;
                break
            case Direction.LEFTANDDOWN:
                this.setVelocity(-speed, speed)
                AnimatedEnemyWalk(this)
                this.flipX = true;
                break
            case Direction.RIGHTANDUP:
                this.setVelocity(speed, -speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.RIGHTANDDOWN:
                this.setVelocity(speed, speed)
                AnimatedEnemyWalk(this)
                break
            case Direction.IDLE:
                this.setVelocity(0, 0)
                AnimatedEnemyIdle(this);
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
                this.decideMovement();
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