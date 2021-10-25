/// <reference path="../game/gamelogic.ts" />

import Phaser from "phaser";
import { enemies } from "~/enemies/enemies";

import { GetPlayerAnims } from "../anims/PlayerAnims";
import { GetLightAnims } from "../anims/WorldAnims";
import { GetRatAnims } from "~/anims/EnemyAnims";

import Rat from "~/enemies/Rat";
import Player from "~/characters/Player";

import { AddWASDKeysToScene, CreateAnimationSet } from "~/game/gamelogic";

const enum Layers {
  Ground,
  Walls,
  Decorations,
}
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
}

export default class Citadel extends Phaser.Scene {
  ShouldEnableDebugForCollision: boolean;
  PlayerFrameRate: number;
  PlayerSpeed: number;
  PlayerName: string;
  PlayerHealth: number;
  PlayerID: string;

  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  directionFacing: Direction;
  swipesound!: Phaser.Sound.BaseSound;

  private MaxRats: number;
  private MaxBigChorts: number;
  private MobAlpha: number;
  RatGroup!: Phaser.Physics.Arcade.Group;
  private RatID: string;
  private CustomKeys!: Phaser.Input.Keyboard.Key[];
  private Spotlight!: Phaser.GameObjects.Light;
  private SpotlightBaseIntensity!: number;
  private isAttacking: boolean;
  private openingtext!: Phaser.GameObjects.Text;

  constructor() {
    super("citadel");
    this.ShouldEnableDebugForCollision = false;
    this.PlayerFrameRate = 10;
    this.PlayerName = "";
    this.PlayerID = "player";
    this.RatID = "enemy-rat";
    this.MobAlpha = 1;
    this.PlayerSpeed = 100;
    this.PlayerHealth = 1000;
  
    this.isAttacking = false;
    this.directionFacing = Direction.DOWN;
    this.MaxRats = 1;
    this.MaxBigChorts = 1;
    this.SpotlightBaseIntensity = 1;
    this.CustomKeys = AddWASDKeysToScene(this);
    
  }

  GetNumberOfRats = (): number => {
    return this.RatGroup.children.entries.length;
  };





  Collides = (layer: Phaser.Tilemaps.TilemapLayer) => {
    layer.setCollisionByProperty({
      collides: true,
    });

  };

  preload() {

    this.swipesound = this.game.sound.add("knifeswipe");
    let music = this.game.sound.add("rainyfeelsbyDonnieOzone");
    music.play({ volume: 0.1 });
    CreateAnimationSet(this, GetPlayerAnims(this.anims, this.PlayerFrameRate, this.PlayerID));
    CreateAnimationSet(this, GetRatAnims(this.anims, 4));
    CreateAnimationSet(this, GetLightAnims(this.anims, 4));

    this.keys = this.input.keyboard.createCursorKeys();
    this.Spotlight = this.lights.addLight(0, 0, 480).setIntensity(this.SpotlightBaseIntensity).setColor(0xffcc99);

    this.Spotlight.scrollFactorX = 1;
    this.Spotlight.scrollFactorY = 1;

    const map = this.make.tilemap({ key: "citadel" });
    const map2 = this.make.tilemap({ key: "citadel2" });

    const tileset2 = map2.addTilesetImage("citadel2", "tiles2");

    const groundLayer = map2.createLayer(Layers.Ground, tileset2)
    const wallsLayer = map2.createLayer(Layers.Walls, tileset2)

    this.player = this.physics.add.sprite(380, 0, this.PlayerID, "player-idledown.png").setPipeline("Light2D").setAlpha(1);
    this.player.setCollideWorldBounds(true);
    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.5);

    this.RatGroup = this.physics.add.group({
      classType: Rat,
      createCallback: (go) => {
        const ratObj = go as Rat;
        ratObj.body.onCollide = true;
      },
      collideWorldBounds: true,
    });

    this.Collides(groundLayer);
    this.Collides(wallsLayer);

    this.physics.add.collider(this.player, groundLayer);
    this.physics.add.collider(this.player, wallsLayer);

    this.physics.add.collider(this.RatGroup, wallsLayer);
    this.physics.add.collider(this.RatGroup, groundLayer);

    const RatShouldSpawnIfThereIsRoom = this.time.addEvent({
      delay: 20000,
      repeat: -1,
      callback: () => {
        if (this.GetNumberOfRats() < this.MaxRats) {
         // this.SummonRats(this.RatGroup, this.RatID, 1);
        }
      },
    });
  }

  create() {

    
    this.cameras.main.startFollow(this.player, false)

    this.physics.world.setBounds(0, 0, 2880, 960);
    this.cameras.main.setBounds(0, 0, 2880, 960, true);

    this.lights.enable();
    this.cameras.main.fadeIn(6000, 0, 0, 0);

    this.SummonRats(this.RatGroup, this.RatID, 1);

   

   
    const lightPositions = [
      { x: 113, y: 40 },
      { x: 256, y: 40 },
      { x: 543, y: 40 },
      { x: 720, y: 40 },
      { x: 848, y: 40 },
      { x: 1135, y: 40 },

      { x: 65, y: 374 },
      { x: 176, y: 374 },
    ];

    lightPositions.forEach((pos) => {
      let light = this.physics.add.sprite(pos.x, pos.y, "lights", "torch_1.png")

      let lightsource = this.lights.addLight(pos.x, pos.y, 1150).setIntensity(0.75).setColor(0xffcc99);

      light.anims.play("light-on");
    });

    let eevent = this.events.addListener("player-interact-event", () => {
      let rats = this.RatGroup.getChildren

      console.log(rats)

    });
   
    
  }

  UpdateCitadel = ()=>{
    
  }

  update(t: number, dt: number) {
    this.Spotlight.x = this.player.x;
    this.Spotlight.y = this.player.y;
    
    let leftKeys = this.CustomKeys[1].isDown || this.keys.left?.isDown;
    let rightKeys = this.CustomKeys[3].isDown || this.keys.right?.isDown;
    let upKeys = this.CustomKeys[0].isDown || this.keys.up?.isDown;
    let downKeys = this.CustomKeys[2].isDown || this.keys.down?.isDown;
    let leftAndUp = leftKeys && upKeys;
    let rightAndUp = rightKeys && upKeys;
    let leftAndDown = leftKeys && downKeys;
    let rightAndDown = rightKeys && downKeys;

    let isAnyKeyDown = leftKeys || rightKeys || upKeys || downKeys || leftAndUp || rightAndUp || leftAndDown || rightAndDown;

    if (leftAndUp) {
      this.directionFacing = Direction.LEFT;
      this.player.setVelocity(-this.PlayerSpeed, -this.PlayerSpeed);
      this.player.anims.play("player-moveleft", true);
    } else if (rightAndUp) {
      this.directionFacing = Direction.RIGHT;
      this.player.setVelocity(this.PlayerSpeed, -this.PlayerSpeed);
      this.player.anims.play("player-moveright", true);
    } else if (leftAndDown) {
      this.directionFacing = Direction.LEFT;
      this.player.setVelocity(-this.PlayerSpeed, this.PlayerSpeed);
      this.player.anims.play("player-moveleft", true);
    } else if (rightAndDown) {
      this.directionFacing = Direction.RIGHT;
      this.player.setVelocity(this.PlayerSpeed, this.PlayerSpeed);
      this.player.anims.play("player-moveright", true);
    } else if (upKeys) {
      this.directionFacing = Direction.UP;
      this.player.setVelocity(0, -this.PlayerSpeed);
      this.player.anims.play(`player-moveup`, true);
    } else if (rightKeys) {
      this.directionFacing = Direction.RIGHT;
      this.player.setVelocity(this.PlayerSpeed, 0);
      this.player.anims.play(`player-moveright`, true);
    } else if (leftKeys) {
      this.directionFacing = Direction.LEFT;
      this.player.setVelocity(-this.PlayerSpeed, 0);
      this.player.anims.play(`player-moveleft`, true);
    } else if (downKeys) {
      this.directionFacing = Direction.DOWN;
      this.player.setVelocity(0, this.PlayerSpeed);
      this.player.anims.play(`player-movedown`, true);
    } else {
      this.player.anims.play("player-idle", true);
      this.player.setVelocity(0);
    }
    if (isAnyKeyDown && this.keys.shift.isDown) {
      this.PlayerSpeed = 200;
    }
    if (!this.keys.shift.isDown) {
      this.PlayerSpeed = 100;
    }

    if (this.keys.space.isDown) {
      this.swipesound.play({ loop: false, volume: 0.2, rate: 0.8 });
      this.player.setVelocity(0);
      this.events.emit("player-attack-event",this.player);

      switch (this.directionFacing) {
        case Direction.LEFT:
          console.log("in attack left");
          this.player.anims.play(`player-attackleft`, true);

          break;
        case Direction.DOWN:
          console.log("in attack down");
          this.player.anims.play(`player-attackdown`, true);
          break;
        case Direction.UP:
          console.log("in attack up");
          this.player.anims.play(`player-attackup`, true);
          break;
        case Direction.RIGHT:
          console.log("in attack right");
          this.player.anims.play(`player-attackright`, true);
          break;
      }
    }
  }
}
