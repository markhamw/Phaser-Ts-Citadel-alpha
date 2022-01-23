import { Physics } from "phaser";
import { WRGame } from "~/game/game";
import { AddWASDKeysToScene } from "~/game/gamelogic";
import {
  WindDirection,
  GenerateBuildings,
  RandomCloud,
  createBorder,
  createOverworldTileMap,
  newGroup,
  createGoldOverlay,
} from "../game/overworldlogic";
import "../characters/Player";
import Player from "../characters/Player";
import { displayTitleTextAndEnableInputs, startIntro } from "~/game/overworldtitlelogic";
import { newEnemyGroup } from "~/enemies/enemies";
import { GetWaterfallAnims } from "~/anims/WorldAnims";


interface Title extends Phaser.Scene {
  titletext0: Phaser.GameObjects.Text;
  titletext1: Phaser.GameObjects.Text;
  titletext2: Phaser.GameObjects.Text;
  titletext4: Phaser.GameObjects.Text;
  titletext5: Phaser.GameObjects.Text;
}

export default class OverworldTitle extends Phaser.Scene implements Title {
  numberofclouds: number = 0;
  keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];
  winddirection: WindDirection = {
    xspeed: Phaser.Math.Between(1, 10),
    yspeed: Phaser.Math.Between(1, 10),
  };
  /*   RatGroup!: Phaser.Physics.Arcade.Group;
    RatOgreGroup!: Phaser.Physics.Arcade.Group;
    ShamanGroup!: Physics.Arcade.Group;
    FlyingRatGroup!: Physics.Arcade.Group;
    EarthGolemGroup!: Physics.Arcade.Group;
    AirElementalGroup!: Physics.Arcade.Group;
    DeerGroup!: Phaser.Physics.Arcade.Group; */
  buildingsGroup!: Physics.Arcade.Group;
  player!: Player;

  wrGame!: WRGame;
  debug!: boolean;

  titletext0!: Phaser.GameObjects.Text;
  titletext1!: Phaser.GameObjects.Text;
  titletext2!: Phaser.GameObjects.Text;
  titletext4!: Phaser.GameObjects.Text;
  titletext5!: Phaser.GameObjects.Text;

  titleAvatarSelect!: Phaser.GameObjects.Image;

  leftArrow!: Phaser.GameObjects.Sprite;
  rightArrow!: Phaser.GameObjects.Sprite;
  head!: Phaser.GameObjects.Sprite;

  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;
  topLayer!: Phaser.Tilemaps.TilemapLayer;


  constructor() {
    super("OverworldTitle");
  }

  init(data) {
    this.wrGame = data;
  }

  createMenuKeyPressEvents = () => {
    this.wasd[1].on("up", () => {
      if (!this.wrGame.hasIntroStarted) {
        this.events.emit("changeHead", "left");
      }
    });
    this.wasd[3].on("up", () => {
      if (!this.wrGame.hasIntroStarted) {
        this.events.emit("changeHead", "right");
      }
    });

  };

  createOverworldPlayerStationary = () => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);
    this.player.stationary = true;
  };


  preload() {

    createOverworldTileMap(this);
    createGoldOverlay(this);
    GenerateBuildings(this);
    GetWaterfallAnims(this.anims, 4);

    let w1 = this.add.sprite(300, 200, "waterfall", "waterfall-2.png").setOrigin(0, 0).setDepth(0);
    w1.anims.play("waterfall-action", true);

    this.events.addListener("startintro", () => {
      startIntro(this);
    });
    this.events.addListener("spawnChapter1", () => {
      this.scene.start("Overworld", this.wrGame);
    });
    let initialTitleTextEvent = this.time.addEvent({
      delay: 500,
      repeat: 0,
      callback: () => {
        displayTitleTextAndEnableInputs(this);
        this.createMenuKeyPressEvents();
      },
    });
  }

  create() {
    this.sound.play("music2", { volume: 0.03, loop: true });
    createBorder(this);
    this.lights.enable();
    let mainlights = this.lights.setAmbientColor(0xCEE8FE);
    //this.lights.addPointLight(10, 240, 0x333333, 500).setAlpha(0.5);
    let light = this.lights.addLight(0, 0, 0, 0xDCE2DA, 2)

    this.tweens.add({
      targets: light,
      x: { from: 50, to: 500 },
      y: { from: 60, to: 450 },
      intensity: { from: .3, to: .8 },
      duration: 200000,
      radius: { from: 200000, to: 200300 },
      ease: "linear",
      yoyo: false,
      repeat: -1,
    })


  }

  update() {
    if (this.player && this.player.isMoving) {
      this.player.speed = 0;
    }
  }
}


