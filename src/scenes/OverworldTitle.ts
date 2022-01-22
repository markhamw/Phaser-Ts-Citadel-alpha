import { Physics } from "phaser";
import { WRGame } from "~/game/game";
import { AddWASDKeysToScene, CreateAnimationSet, RandomCoord } from "~/game/gamelogic";
import {
  WindDirection,
  GenerateBuildings,
  RandomCloud,
  createBorder,
  ShowMenu,
  createOverworldTileMap,
} from "../game/overworldlogic";
import "../characters/Player";
import { GetCoinAnims, GetSmokeAnims } from "~/anims/WorldAnims";
import {
  createUIAnimations,
} from "~/anims/EnemyAnims";

import { enemies, newEnemyGroup } from "~/enemies/enemies";

import Player from "../characters/Player";
import Overworld from "./Overworld";
import { GetRandomExploreText } from "~/game/playerspeech";
import TalkBubbleContext from "~/characters/Player";
import Deer from "~/enemies/Deer";
import { displayTitleText, startIntro } from "~/game/overworldtitlelogic";


interface Title extends Phaser.Scene {
  titletext0: Phaser.GameObjects.Text;
  titletext1: Phaser.GameObjects.Text;
  titletext2: Phaser.GameObjects.Text;
  titletext4: Phaser.GameObjects.Text;
  titletext5: Phaser.GameObjects.Text;
  titletext6: Phaser.GameObjects.Text;

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
  titletext1!: Phaser.GameObjects.Text;
  titletext2!: Phaser.GameObjects.Text;
  titletext4!: Phaser.GameObjects.Text;
  titletext0!: Phaser.GameObjects.Text;

  leftArrow!: Phaser.GameObjects.Sprite;
  rightArrow!: Phaser.GameObjects.Sprite;
  head!: Phaser.GameObjects.Sprite;

  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;
  titletext5!: Phaser.GameObjects.Text;
  titletext6!: Phaser.GameObjects.Text;

  constructor() {
    super("OverworldTitle");
  }

  init(data) {
    this.wrGame = data;
  }

  /* createEnemyGroups = () => {
    this.RatGroup = newEnemyGroup(this, Rat, true, true);
    this.RatOgreGroup = newEnemyGroup(this, RatOgre, true, true);
    this.ShamanGroup = newEnemyGroup(this, Shaman, true, true);
    this.FlyingRatGroup = newEnemyGroup(this, FlyingRat, false, false);
    this.EarthGolemGroup = newEnemyGroup(this, EarthGolem, true, true);
    this.AirElementalGroup = newEnemyGroup(this, AirElemental, true, true);
 
    this.SummonMobs(this.ShamanGroup, "enemy-shaman", 5, 287, 425);
    this.SummonMobs(this.RatOgreGroup, "enemy-ratogre", 5, 156, 284);
    this.SummonMobs(this.RatGroup, "enemy-rat", 8, 199, 409);
    this.SummonMobs(this.FlyingRatGroup, "enemy-flyingrat", 15);
    this.SummonMobs(this.EarthGolemGroup, "enemy-earthgolem", 3, 444, 262);
    this.SummonMobs(this.AirElementalGroup, "enemy-airelemental", 1, 374, 392);
 

  }; */

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
    this.keys.space.on("up", () => {
      if (!this.wrGame.hasIntroStarted) {
        this.wrGame.hasIntroStarted = true;
        this.events.emit("startintro");
      }
    });
  };



  createOverworldPlayerStationary = () => {
    this.player = this.add.player(320, 325, "playeroverworld", "player-movedown-1.png");
    this.player.body.setSize(this.player.width * 0.75, this.player.height * 0.75);
    this.player.stationary = true;

  };


  preload() {
    this.wasd = AddWASDKeysToScene(this);
    //Add Spacebar and Shift and arrow keys to scene
    this.keys = this.input.keyboard.createCursorKeys();
    createOverworldTileMap(this);
    GenerateBuildings(this);
    RandomCloud(this);
    RandomCloud(this);


    /* this.scene.events.addListener("removeTitleMobs", () => {
      DestroySprite(this);
  }); */

    //this.createEnemyGroups();
    // this.SummonMobs(this.FlyingRatGroup, "enemy-Flyingrat", 1);
    //  this.SummonMobs(this.FlyingRatGroup, "enemy-Flyingrat", 1);
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
        displayTitleText(this);
        ShowMenu(this);
        this.createMenuKeyPressEvents();
      },
    });
  }

  create() {
    this.sound.play("music2", { volume: 0.03, loop: true });
    createBorder(this);
    this.lights.enable();

  }

  update() {
    if (this.player && this.player.isMoving) {
      this.player.speed = 0;
    }
  }
}
