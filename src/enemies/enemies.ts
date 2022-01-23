import Player from "~/characters/Player";
import { CreateAnimationSet } from "~/game/gamelogic";
import Overworld from "~/scenes/Overworld";
import Unit, { EnemyData, GetEnemyDataByName } from "./Unit";

const enemies: EnemyData[] = [
  {
    name: "enemy-titan",
    PathToPNG: "enemies/titan.png",
    PathToJSON: "enemies/titan.json",
    IconPng: "IconTitan.png",
    descriptiveName: "Titan",
    speed: Phaser.Math.Between(1, 5),
    SpriteAtlasKey: "enemy-titan",
    JsonPrefixIdle: "TitanIdle",
    JsonPrefixWalk: "TitanWalk",
    JsonPrefixAttack: "TitanAttack",
    JsonPrefixHit: "TileHit",
    JsonPrefixDeath: "TitanDeath",
    IdleAnimKey: "enemy-titan-idle",
    WalkAnimKey: "enemy-titan-walk",
    HitAnimKey: "enemy-titan-hit",
    AttackAnimKey: "enemy-titan-attack",
    DeathAnimKey: "enemy-titan-death",
  },
  {
    name: "enemy-golem",
    PathToPNG: "enemies/golem.png",
    PathToJSON: "enemies/golem.json",
    IconPng: "IconGolem.png",
    descriptiveName: "Golem",
    speed: Phaser.Math.Between(1, 5),
    JsonPrefixIdle: "GolemIdle",
    JsonPrefixWalk: "GolemWalk",
    JsonPrefixAttack: "GolemAttack",
    JsonPrefixHit: "GolemHit",
    JsonPrefixDeath: "GolemDeath",
    SpriteAtlasKey: "enemy-golem",
    IdleAnimKey: "enemy-golem-idle",
    WalkAnimKey: "enemy-golem-walk",
    HitAnimKey: "enemy-golem-hit",
    AttackAnimKey: "enemy-golem-attack",
    DeathAnimKey: "enemy-golem-death"
  },
  {
    name: "enemy-groklin",
    descriptiveName: "Groklin",
    speed: Phaser.Math.Between(0, 5),
    IconPng: "IconGremlin.png",
    PathToPNG: "enemies/groklin.png",
    PathToJSON: "enemies/groklin.json",
    JsonPrefixIdle: "GremlinIdle",
    JsonPrefixWalk: "GremlinWalk",
    JsonPrefixAttack: "GremlinAttack",
    JsonPrefixHit: "GremlinHit",
    JsonPrefixDeath: "GremlinDeath",
    SpriteAtlasKey: "enemy-groklin",
    IdleAnimKey: "enemy-groklin-idle",
    WalkAnimKey: "enemy-groklin-walk",
    HitAnimKey: "enemy-groklin-hit",
    AttackAnimKey: "enemy-groklin-attack",
    DeathAnimKey: "enemy-groklin-death"
  }];
/* {
   name: "enemy-djinn",
   PathToPNG: "enemies/djinn.png",
   PathToJSON: "enemies/djinn.json"
 },
 {
   name: "enemy-gargoyle",
   PathToPNG: "enemies/gargoyle.png",
   PathToJSON: "enemies/gargoyle.json"
 }, */

/* {
  name: "enemy-mage",
  PathToPNG: "enemies/mage.png",
  PathToJSON: "enemies/mage.json"
}, */


/*   {
    name: "enemy-naga",
    PathToPNG: "enemies/naga.png",
    PathToJSON: "enemies/naga.json"
  },
  {
    name: "enemy-harpy",
    PathToPNG: "enemies/harpy.png",
    PathToJSON: "enemies/harpy.json"
  },
  {
    name: "enemy-shamanb",
    PathToPNG: "enemies/shamanb.png",
    PathToJSON: "enemies/shamanB.json"
  },
  {
    name: "enemy-cyclops",
    PathToPNG: "enemies/cyclops.png",
    PathToJSON: "enemies/cyclops.json"
  },
  {
    name: "enemy-centaur",
    PathToPNG: "enemies/centaur.png",
    PathToJSON: "enemies/centaur.json"
  },
  {
    name: "enemy-wolfrider",
    PathToPNG: "enemies/wolfrider.png",
    PathToJSON: "enemies/wolfrider.json"
  },
  {
    name: "enemy-troll",
    PathToPNG: "enemies/troll.png",
    PathToJSON: "enemies/troll.json"
  },
  {
    name: "enemy-deer",
    PathToPNG: "enemies/deer.png",
    PathToJSON: "enemies/deer.json"
  },
  {
    name: "enemy-druid",
    PathToPNG: "enemies/druid.png",
    PathToJSON: "enemies/druid.json"
  },
  {
    name: "enemy-dwarf",
    PathToPNG: "enemies/dwarf.png",
    PathToJSON: "enemies/dwarf.json"
  },
  {
    name: "enemy-hunter",
    PathToPNG: "enemies/hunter.png",
    PathToJSON: "enemies/hunter.json"
  },
  {
    name: "enemy-pixie",
    PathToPNG: "enemies/pixie.png",
    PathToJSON: "enemies/pixie.json"
  },
  {
    name: "enemy-satyr",
    PathToPNG: "enemies/satyr.png",
    PathToJSON: "enemies/satyr.json"
  },
  {
    name: "enemy-treant",
    PathToPNG: "enemies/treant.png",
    PathToJSON: "enemies/treant.json"
  },
  {
    name: "enemy-bknight",
    PathToPNG: "enemies/bknight.png",
    PathToJSON: "enemies/bknight.json"
  },
  {
    name: "enemy-ghost",
    PathToPNG: "enemies/ghost.png",
    PathToJSON: "enemies/ghost.json"
  },
  {
    name: "enemy-lich",
    PathToPNG: "enemies/lich.png",
    PathToJSON: "enemies/lich.json"
  },
  {
    name: "enemy-skeleton",
    PathToPNG: "enemies/skeleton.png",
    PathToJSON: "enemies/skeleton.json"
  },
  {
    name: "enemy-spider",
    PathToPNG: "enemies/spider.png",
    PathToJSON: "enemies/spider.json"
  },
  {
    name: "enemy-vampire",
    PathToPNG: "enemies/vampire.png",
    PathToJSON: "enemies/vampire.json"
  },
  {
    name: "enemy-zombie",
    PathToPNG: "enemies/zombie.png",
    PathToJSON: "enemies/zombie.json"
  },
  {
    name: "enemy-demon",
    PathToPNG: "enemies/demon.png",
    PathToJSON: "enemies/demon.json"
  },
  {
    name: "enemy-devil",
    PathToPNG: "enemies/devil.png",
    PathToJSON: "enemies/devil.json"
  },
  {
    name: "enemy-efreet",
    PathToPNG: "enemies/efreet.png",
    PathToJSON: "enemies/efreet.json"
  },
  {
    name: "enemy-gog",
    PathToPNG: "enemies/gog.png",
    PathToJSON: "enemies/gog.json"
  },
  {
    name: "enemy-hellhound",
    PathToPNG: "enemies/hellhound.png",
    PathToJSON: "enemies/hellhound.json"
  },
  {
    name: "enemy-imp",
    PathToPNG: "enemies/imp.png",
    PathToJSON: "enemies/imp.json"
  },
  {
    name: "enemy-pitfiend",
    PathToPNG: "enemies/pitfiend.png",
    PathToJSON: "enemies/pitfiend.json"
  },
  {
    name: "enemy-archer",
    PathToPNG: "enemies/archer.png",
    PathToJSON: "enemies/archer.json"
  },
  {
    name: "enemy-cavalier",
    PathToPNG: "enemies/cavalier.png",
    PathToJSON: "enemies/cavalier.json"
  },
  {
    name: "enemy-griffin",
    PathToPNG: "enemies/griffin.png",
    PathToJSON: "enemies/griffin.json"
  },
  {
    name: "enemy-monk",
    PathToPNG: "enemies/monk.png",
    PathToJSON: "enemies/monk.json"
  },
  {
    name: "enemy-paladin",
    PathToPNG: "enemies/paladin.png",
    PathToJSON: "enemies/paladin.json"
  },
  {
    name: "enemy-pikeman",
    PathToPNG: "enemies/pikeman.png",
    PathToJSON: "enemies/pikeman.json"
  },
  {
    name: "enemy-swordsman",
    PathToPNG: "enemies/swordsman.png",
    PathToJSON: "enemies/swordsman.json"
  }, */


export function CreateEnemy(scene: any, enemy: string, x: number, y: number, scale?: number) {
  if (!scene.unitgroup) {
    scene.unitgroup = newEnemyGroup(scene, Unit, true, true);
  }
  let unit = scene.add.unit(x, y, enemy, GetEnemyDataByName(enemies, enemy));
  scene.unitgroup.add(unit)
  unit.setDepth(3);
  return unit;
}

export interface AnimatedEnemy extends Phaser.Physics.Arcade.Sprite {
  IdleAnim(): void;
  WalkAnim(): void;
  AttackAnim(): void;
  HitAnim(): void;
  DeathAnim(): void;
}

export interface Collides extends Phaser.Physics.Arcade.Sprite {
  CollideWithOverWorldAndPlayer(): void;
  handleCollision(player: Player): void;
  handleCollisionWithSprite(sprite: Phaser.Physics.Arcade.Sprite): void;
}

export const CollideWithOverWorldAndPlayer = (sprite: any, scene: any) => {
  sprite.scene.physics.add.collider(sprite, scene.baseLayer);
  sprite.scene.physics.add.collider(sprite, scene.decorLayer);
  if (scene.player != null && scene.player.active) {
    sprite.scene.physics.add.collider(sprite, scene.player);
  }
}


export const IdleAnim = (sprite: any) => {
  sprite.scene.anims.create({
    key: sprite.enemydata.IdleAnimKey,
    frames: sprite.anims.generateFrameNames(sprite.enemydata.SpriteAtlasKey, {
      start: 1,
      end: 4,
      prefix: sprite.enemydata.JsonPrefixIdle,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 5,
  })
}

export const WalkAnim = (sprite: any) => {
  sprite.scene.anims.create({
    key: sprite.enemydata.WalkAnimKey,
    frames: sprite.anims.generateFrameNames(sprite.enemydata.SpriteAtlasKey, {
      start: 1,
      end: 4,
      prefix: sprite.enemydata.JsonPrefixWalk,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 5,
  })
}

export const AttackAnim = (sprite: any) => {
  sprite.scene.anims.create({
    key: sprite.enemydata.AttackAnimKey,
    frames: sprite.anims.generateFrameNames(sprite.enemydata.SpriteAtlasKey, {
      start: 1,
      end: 4,
      prefix: sprite.enemydata.JsonPrefixAttack,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 5,
  })
}

export const HitAnim = (sprite: any) => {
  sprite.scene.anims.create({
    key: sprite.enemydata.HitAnimKey,
    frames: sprite.anims.generateFrameNames(sprite.enemydata.SpriteAtlasKey, {
      start: 1,
      end: 4,
      prefix: sprite.enemydata.JsonPrefixHit,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 3,
  })
}

export const DeathAnim = (sprite: any) => {
  sprite.scene.anims.create({
    key: sprite.enemydata.DeathAnimKey,
    frames: sprite.anims.generateFrameNames(sprite.enemydata.SpriteAtlasKey, {
      start: 1,
      end: 4,
      prefix: sprite.enemydata.JsonPrefixDeath,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 3,
  })
}


export function AnimatedEnemyIdle(sprite: any) {
  sprite.anims.play(sprite.enemydata.IdleAnimKey, true);
}
export function AnimatedEnemyWalk(sprite: any) {
  sprite.anims.play(sprite.enemydata.WalkAnimKey, true);
}
export function AnimatedEnemyAttack(sprite: any) {
  sprite.anims.play(sprite.enemydata.AttackAnimKey, true);
}
export function AnimatedEnemyHit(sprite: any) {
  sprite.anims.play(sprite.enemydata.HitAnimKey, true);
}
export function AnimatedEnemyDeath(sprite: any) {
  sprite.anims.play(sprite.enemydata.DeathAnimKey, true);
}

export function InitAnims(sprite: any): void {
  IdleAnim(sprite);
  WalkAnim(sprite);
  AttackAnim(sprite);
  HitAnim(sprite);
  DeathAnim(sprite);
}


const newEnemyGroup = (scene: Phaser.Scene, type: any, collides: boolean, collideWorldBounds: boolean) => {
  return scene.physics.add.group({
    classType: type,
    createCallback: (gameObject) => {
      const unit = gameObject as typeof type;
      unit.body.onCollide = collides;
    },
    collideWorldBounds: collideWorldBounds,
  });
}

//
export { enemies, newEnemyGroup }

