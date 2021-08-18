/// <reference path="../game/gamelogic.ts" />

import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { enemies } from "~/enemies/enemies";
import Squarebo from "../enemies/Squarebo";
import { GetPlayerAnims } from "../anims/PlayerAnims";
import {
  GetAxeManAnims,
  GetSquareBoAnims,
  GetDinoSaurAnims,
  GetRatAnims,
  GetBigChortAnims,
  GetChortAnims,
} from "~/anims/EnemyAnims";
import Axeman from "~/enemies/Axeman";
import Dinosaur from "~/enemies/Dinosaur";
import Rat from "~/enemies/Rat";
import Player from "~/characters/Player";
import BigChort from "~/enemies/BigChort";

import { GetWASDKeys, CreateAnimationSet } from "~/game/gamelogic";

const enum Layers {
  Ground,
  Walls,
  Decorations,
}

export default class Citadel extends Phaser.Scene {
  ShouldEnableDebugForCollision: boolean;
  PlayerFrameRate: number;
  PlayerSpeed: number;
  PlayerName: string;
  PlayerHealth: number;
  PlayerID: string;
  DebugCollideColor: Phaser.Display.Color;
  DebugFaceColor: Phaser.Display.Color;
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Arcade.Sprite;
  private TitleFontSize: number;
  private TitleX: number;
  private TitleY: number;
  private TitleText: string;
  private TitleAlpha: number;
  private TitleTextGameObject!: Phaser.GameObjects.BitmapText;
  private TitleTextInstructionsGameObject!: Phaser.GameObjects.BitmapText;
  private TitleTextInstructionsGameObject2!: Phaser.GameObjects.BitmapText;
  private TitleFrame!: Phaser.GameObjects.Rectangle;
  private IsAnyKeyPressed!: boolean;
  private IsTitleDisplayed!: boolean;
  private MaxRats: number;
  private MaxBigChorts: number;
  private MobAlpha: number;
  private RatGroup!: Phaser.Physics.Arcade.Group;
  private BigChortGroup!: Phaser.Physics.Arcade.Group;
  private RatID: string;
  private BigChortID: string;
  private CustomKeys!: Phaser.Input.Keyboard.Key[];
  private Spotlight!: Phaser.GameObjects.Light;
  private SpotlightBaseIntensity!: number;

  constructor() {
    super("citadel");
    this.ShouldEnableDebugForCollision = false;
    this.PlayerFrameRate = 10;
    this.PlayerName = "";
    this.PlayerID = "player";
    this.RatID = "enemy-rat";
    this.BigChortID = "enemy-chort";
    this.MobAlpha = 1;
    this.PlayerSpeed = 100;
    this.PlayerHealth = 1000;
    this.DebugCollideColor = new Phaser.Display.Color(243, 234, 48, 255);
    this.DebugFaceColor = new Phaser.Display.Color(40, 39, 37, 255);
    this.TitleText = "--=== Willys Ratfights ===--";
    this.TitleFontSize = 70;
    this.TitleX = -350;
    this.TitleY = 15;
    this.TitleAlpha = 0.5;
    this.IsAnyKeyPressed = false;
    this.IsTitleDisplayed = true;
    this.MaxRats = 3;
    this.MaxBigChorts = 1;
    this.SpotlightBaseIntensity = 1;
  }

  DontShowTitle = () => {
    if (this.IsTitleDisplayed) {
      this.TitleFrame.destroy();
      this.TitleTextGameObject.destroy();
      this.TitleTextInstructionsGameObject.destroy();
      this.TitleTextInstructionsGameObject2.destroy();
      // this.lights.setAmbientColor(0x000000);
      this.IsTitleDisplayed = false;
    }
  };

  ShowTitle = () => {
    this.TitleFrame = this.add.rectangle(100, 100, 1010, 520, 0x000000);
    this.TitleFrame.fillColor = 0x000000;

    this.TitleFrame.setStrokeStyle(10, 0x574b38);
    this.TitleTextGameObject = this.add
      .bitmapText(this.TitleX, this.TitleY, "customfont", this.TitleText, 32)
      .setPipeline("Light2D")
      .setAlpha(this.TitleAlpha)
      .setFontSize(this.TitleFontSize);
    this.TitleTextInstructionsGameObject = this.add
      .bitmapText(
        100,
        100,
        "customfont",
        "Use W,A,S,D or arrow keys (press any key)",
        32
      )
      .setPipeline("Light2D")
      .setAlpha(0.2);
    this.TitleTextInstructionsGameObject2 = this.add
      .bitmapText(
        600,
        215,
        "customfont",
        "Use the cursor or touch to light the area",
        32
      )
      .setPipeline("Light2D")
      .setAlpha(0.2);
  };

  GetNumberOfRats = (): number => {
    return this.RatGroup.children.entries.length;
  };

  SummonRats = (
    group: Phaser.Physics.Arcade.Group,
    enemyid: string,
    instances: number
  ) => {
    for (let countmade = 0; countmade < instances; countmade++) {
      let mobX = this.RandomCoord(1920);
      let mobY = this.RandomCoord(1080);
      if (this.RatGroup.children.entries.length < this.MaxRats) {
        group
          .get(mobX, mobY, enemyid)
          .setPipeline("Light2D")
          .setAlpha(this.MobAlpha)
          .setSize(32, 32);
      } else {
        console.log("Could not create rat. Too Many");
      }
    }
  };

  SummonBigChorts = (
    group: Phaser.Physics.Arcade.Group,
    enemyid: string,
    instances: number
  ) => {
    for (let countmade = 0; countmade < instances; countmade++) {
      let mobX = this.RandomCoord(1920);
      let mobY = this.RandomCoord(1080);
      if (this.BigChortGroup.children.entries.length < this.MaxBigChorts) {
        group
          .get(mobX, mobY, enemyid)
          .setPipeline("Light2D")
          .setAlpha(this.MobAlpha);
      } else {
        console.log("Could not create big chort. Too Many");
      }
    }
  };

  RandomCoord = (max: number): number => {
    let num = Math.floor(Math.random() * max);
    let minimumAbritraryCoordValue = 49;
    if (num > minimumAbritraryCoordValue) {
      return num;
    } else return num + 30;
  };

  Collides = (layer: Phaser.Tilemaps.TilemapLayer) => {
    layer.setCollisionByProperty({
      collides: true,
    });
    if (this.ShouldEnableDebugForCollision) {
      const debugGraphics = this.add.graphics().setAlpha(0.1);
      layer.renderDebug(debugGraphics, {
        tileColor: null,
        collidingTileColor: this.DebugCollideColor,
        faceColor: this.DebugFaceColor,
      });
    }
  };

  movePlayer = (direction: string) => {
    if (direction == "stop") {
      this.player.anims.stop();
      this.player.setVelocity(0);
      this.IsAnyKeyPressed = false;
      return;
    }

    if (direction) {
      this.IsAnyKeyPressed = true;
    }
    console.log("direction before switchcase: ", direction);
    switch (direction) {
      case "up":
        this.player.setVelocity(0, -this.PlayerSpeed);
        this.player.anims.play(`player-move${direction}`, true);
        return;
      case "down":
        this.player.setVelocity(0, this.PlayerSpeed);
        this.player.anims.play(`player-move${direction}`, true);
        return;
      case "left":
        this.player.setVelocity(-this.PlayerSpeed, 0);
        this.player.anims.play(`player-move${direction}`, true);
        return;
      case "right":
        this.player.setVelocity(this.PlayerSpeed, 0);
        this.player.anims.play(`player-move${direction}`, true);
        return;
      case "leftanddown":
        this.player.setVelocity(-this.PlayerSpeed, this.PlayerSpeed);
        this.player.anims.play("player-moveleft", true);
        return;
      case "leftandup":
        this.player.setVelocity(-this.PlayerSpeed, -this.PlayerSpeed);
        this.player.anims.play("player-moveleft", true);
        return;
      case "rightanddown":
        this.player.setVelocity(this.PlayerSpeed, this.PlayerSpeed);
        this.player.anims.play("player-moveright", true);
        return;
      case "rightandup":
        this.player.setVelocity(this.PlayerSpeed, -this.PlayerSpeed);
        this.player.anims.play("player-moveright", true);
        return;
    }
    //this.player.setVelocity(this.getVelocityXByDirection(direction), this.getVelocityYByDirection(direction));
    // this.player.anims.play(`player-move${direction}`, true);
  };

  preload() {
    CreateAnimationSet(this, GetPlayerAnims(this.anims, this.PlayerFrameRate, this.PlayerID));
    CreateAnimationSet(this, GetRatAnims(this.anims, 4));
    CreateAnimationSet(this, GetChortAnims(this.anims, 4));
    CreateAnimationSet(this, GetBigChortAnims(this.anims, 4));

    this.keys = this.input.keyboard.createCursorKeys();
    this.Spotlight = this.lights
      .addLight(0, 0, 480)
      .setIntensity(this.SpotlightBaseIntensity)
      .setColor(0xffcc99);

    this.Spotlight.scrollFactorX = 1;
    this.Spotlight.scrollFactorY = 1;

    const map = this.make.tilemap({ key: "citadel" });
    const map2 = this.make.tilemap({ key: "citadel2" });
    //const map2decorative = this.make.tilemap({ key: "citadel2decorative" });

    // const tileset = map.addTilesetImage("dungeon-tileset-ii", "tiles");
    // const tileset = map.addTilesetImage("citadel2", "tiles2");
    const tileset2 = map2.addTilesetImage("citadel2", "tiles2");
   // const tileset2decorative = map2.addTilesetImage(
   //   "citadel2decorative",
   //   "citadel2decorative"
   // );

    const groundLayer = map2
      .createLayer(Layers.Ground, tileset2)
      .setPipeline("Light2D")
      .setAlpha(1);
    const wallsLayer = map2
      .createLayer(Layers.Walls, tileset2)
      .setPipeline("Light2D")
      .setAlpha(1);
    //const decorationsLayer = map2
    //  .createLayer(Layers.Decorations, tileset2decorative)
    //  .setPipeline("Light2D")
    //  .setAlpha(1);
    //const outerGroundsLayer = map.createLayer(Layers.OuterGrounds, tileset).setPipeline("Light2D").setAlpha(1);
    /// const decorationsLayer = map.createLayer(Layers.Decorations, tileset2).setPipeline("Light2D").setAlpha(1);
    //this.ShowTitle();

    this.player = this.physics.add
      .sprite(600, 240, this.PlayerID, "player-idledown.png")
      .setPipeline("Light2D")
      .setAlpha(1);

    this.player.body.setSize(this.player.width * 0.5, this.player.height * 0.5);

    // const decorationsLayer = map.createLayer(Layers.Decoration, tileset);
    // const groundLayer = map.createLayer(Layers.Ground, tileset);
    this.RatGroup = this.physics.add.group({
      classType: Rat,
      createCallback: (go)=>{
        const ratObj = go as Rat
        ratObj.body.onCollide = true
      },
      collideWorldBounds: true,
      
      //  console.log("hi",this.player.x,this.player.y)
      //}
    });
    this.Collides(groundLayer);
    this.Collides(wallsLayer);
    //  this.Collides(outerGroundsLayer);
   // this.Collides(decorationsLayer);

    this.physics.add.collider(this.player, groundLayer);
    // this.physics.add.collider(this.player, outerGroundsLayer)
    this.physics.add.collider(this.player, wallsLayer);
   // this.physics.add.collider(this.player, decorationsLayer);
    this.physics.add.collider(this.RatGroup, wallsLayer);

    const RatShouldSpawnIfThereIsRoom = this.time.addEvent({
      delay: 20000,
      repeat: -1,
      callback: () => {
        if (this.GetNumberOfRats() < this.MaxRats) {
          this.SummonRats(this.RatGroup, this.RatID, 1);
        }
      },
    });
  }

  create() {
    this.CustomKeys = GetWASDKeys(this);


    // this.player.body.offset.y = 20;
    this.cameras.main.startFollow(this.player, false).setPipeline("Light2D");

    this.lights.enable();

    this.lights.setAmbientColor(0x000000);

    // const Dinosaurs = this.physics.add.group({
    //   classType:Dinosaur
    // })
    // const SquareBos = this.physics.add.group({
    //   classType:Squarebo
    // })
    //const AxeMen = this.physics.add.group({
    //  classType: Axeman
    // })


    this.BigChortGroup = this.physics.add.group({
      classType: BigChort,
    });

    this.SummonRats(this.RatGroup, this.RatID, 1);
    //SquareBos.get(this.RandomCoord(100),this.RandomCoord(200),'enemy-squarebo')
    // AxeMen.get(this.RandomCoord(100),this.RandomCoord(200),'enemy-axeman')
    // Dinosaurs.get(this.RandomCoord(100),this.RandomCoord(200),'dinosaur')
    this.SummonBigChorts(this.BigChortGroup, this.BigChortID, 1);
  }

  update(t: number, dt: number) {
    if (!this.keys || !this.player) {
      return;
    }
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

    if (leftAndUp) {
      this.movePlayer("leftandup");
    } else if (rightAndUp) {
      this.movePlayer("rightandup");
    } else if (leftAndDown) {
      this.movePlayer("leftanddown");
    } else if (rightAndDown) {
      this.movePlayer("rightanddown");
    } else if (upKeys) {
      this.movePlayer("up");
    } else if (rightKeys) {
      this.movePlayer("right");
    } else if (leftKeys) {
      this.movePlayer("left");
    } else if (downKeys) {
      this.movePlayer("down");
    } else {
      this.movePlayer("stop");
    }
  }
}
