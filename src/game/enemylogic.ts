import { AnimatedEnemy, enemies } from "~/enemies/enemies";
import { EnemyData, EnemyType } from "~/enemies/Unit";

export const DestroySprite = (sprite: any) => {
    try {
        sprite.MoveEvent.destroy();
        sprite.destroy();
    } catch {
        sprite.destroy();
    }
};

/* distanceFromStartingLocation = (): number => {
    return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, this.StartingXLoc, this.StartingYLoc))
}

distanceFrom(obj: Player, scene: any): number {
    return Phaser.Math.FloorTo(Phaser.Math.Distance.Between(this.x, this.y, scene.player.x, scene.player.y))
}

isNearPlayer(player: Player): boolean {
    let distance = this.distanceFrom(player, this.scene)
    return true
} */

/* fade = () => {
    this.scene.time.addEvent({
        repeat: 4,
        delay: 500,
        callback: () => {
            this.setAlpha(this.alpha - 0.3);
        },
    });
}; */


/* this.scene.events.addListener("fadeMobs", () => {
    this.fade();
}); */
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
export function Stop(scene?: any, sprite?: any) {
    sprite.enemydata!.speed = 0;
    sprite.facing = 0;
    sprite.play(sprite.enemydata!.IdleAnimKey);
}

//1-21-22
export function IdleAnim(sprite: any) {
    sprite.scene.anims.create({
        key: sprite.UnitData.IdleAnimKey,
        frames: sprite.anims.generateFrameNames(sprite.UnitData.SpriteAtlasKey, {
            start: 1,
            end: 4,
            prefix: sprite.UnitData.JsonPrefixIdle,
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 5,
    })
}
export function WalkAnim(sprite: any) {
    sprite.scene.anims.create({
        key: sprite.UnitData.WalkAnimKey,
        frames: sprite.anims.generateFrameNames(sprite.UnitData.SpriteAtlasKey, {
            start: 1,
            end: 4,
            prefix: sprite.UnitData.JsonPrefixWalk,
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 5,
    })
}

export function AttackAnim(sprite: any) {
    sprite.scene.anims.create({
        key: sprite.UnitData.AttackAnimKey,
        frames: sprite.anims.generateFrameNames(sprite.UnitData.SpriteAtlasKey, {
            start: 1,
            end: 4,
            prefix: sprite.UnitData.JsonPrefixAttack,
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 5,
    })
}
export function HitAnim(sprite: any) {
    sprite.scene.anims.create({
        key: sprite.UnitData.HitAnimKey,
        frames: sprite.anims.generateFrameNames(sprite.UnitData.SpriteAtlasKey, {
            start: 1,
            end: 4,
            prefix: sprite.UnitData.JsonPrefixHit,
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 3,
    })
}
export function DeathAnim(sprite: any) {
    sprite.scene.anims.create({
        key: sprite.UnitData.DeathAnimKey,
        frames: sprite.anims.generateFrameNames(sprite.UnitData.SpriteAtlasKey, {
            start: 1,
            end: 4,
            prefix: sprite.UnitData.JsonPrefixDeath,
            suffix: ".png",
        }),
        repeat: -1,
        frameRate: 3,
    })
} 