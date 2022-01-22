import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript";
import { CreateAnimationSet, getNewRatName, Direction } from "~/game/gamelogic";
import { AnimatedEnemy, AnimatedEnemyHit, AnimatedEnemyIdle, AnimatedEnemyWalk, Behavior, CollideWithOverWorldAndPlayer, InitAnims } from "./enemies";
import { DestroySprite } from "~/game/enemylogic";
import Overworld from "~/scenes/Overworld";
import Player from "~/characters/Player";
import { IdleAnim, } from "./enemies";
import { enemies } from "./enemies";

export type UnitData = {
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


export class MakeUnit {
    constructor(byAtlasName_unitToCreate: UnitData, scene: Phaser.Scene) {
        let enemyToCreate = enemies.find(enemy => enemy.name == byAtlasName_unitToCreate.SpriteAtlasKey);
    }

}


export default class Groklin
    extends Phaser.Physics.Arcade.Sprite {
    private facing = 0;
    UnitData?: UnitData
    hit: number = 1;
    inBattle: boolean = false;
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number,
    ) {
        super(scene, x, y, texture, frame);
        this.UnitData = enemies.find(enemy => enemy.name == "enemy-groklin");
        this.scene.physics.world.on(
            Phaser.Physics.Arcade.Events.TILE_COLLIDE,
            this.handleCollision
        );
        this.scene.physics.world.on(
            Phaser.Physics.Arcade.Events.COLLIDE,
            this.handleCollisionWithSprite
        );
        InitAnims(this)
        CollideWithOverWorldAndPlayer(this, this.scene as Overworld);
        this.setInteractive();
        this.hit = 0;
    }
    Move() {
        let chanceForIdle = Phaser.Math.Between(0, 4);

        this.UnitData!.speed = Phaser.Math.Between(1, 8);
        if (chanceForIdle == 1 || 2) {
            this.facing = 0;
        } else {
            this.facing = Phaser.Math.Between(1, 7);
        }
    }
    Stop() {
        this.UnitData!.speed = 0;
        this.facing = 0;
    }

    handleCollision(
        go: Phaser.GameObjects.GameObject,
        tile: Phaser.Tilemaps.Tile
    ) {

    }

    handleCollisionWithSprite(
        groklin: Phaser.GameObjects.GameObject,
        obj2: Phaser.GameObjects.GameObject
    ) {
        if (this.inBattle) {
            console.log("Collision with sprite", groklin);
            console.log("tile data", obj2);
            let player = obj2 as Player;
            let grok = groklin as Groklin;
            const diffX = grok.x - player.x;
            const diffY = grok.y - player.y;
            const vector = new Phaser.Math.Vector2(diffX, diffY).normalize().scale(200)
            grok.setVelocity(vector.x, vector.y);
            grok.hit = 1;
        }

    }

    preload() {
        this.scene.load.atlas(this.UnitData!.name, this.UnitData!.PathToPNG, this.UnitData!.PathToJSON)
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
        let { speed } = this.UnitData!;
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


/* this.scene.events.addListener('player-clicked-fight', () => {
    this.scene.events.emit('player-killed-rat', this)
    this.scene.sound.add('ratsound', { volume: 0.1, detune: Phaser.Math.Between(-500, -1200) }).play()
    this.isAlive = false;
    this.anims.play({ key: 'enemy-rat-dead', frameRate: 3, repeat: 0, delay: 1 })
}) */