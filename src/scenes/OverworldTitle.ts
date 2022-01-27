import { Animations, BlendModes, Physics } from "phaser";
import { WRGame } from "~/game/game";
import { AddWASDKeysToScene } from "~/game/gamelogic";
import {
  WindDirection,
  GenerateBuildings,
  createBorder,
  CreateAllLayersAndSetCollisions,
  newGroup,
  createGoldOverlay,
  GetAnimsForOverworld,
  createStructuresAndWeather,
  AddCloudWithShadow,
} from "../game/overworldlogic";
import "../characters/Player";
import Player from "../characters/Player";
import { addTitleTextToScene, displayTitleTextAndEnableInputs, startIntro } from "~/game/overworldtitlelogic";
import { newEnemyGroup } from "~/enemies/enemies";



interface Title extends Phaser.Scene {
  titletext0: Phaser.GameObjects.Text;
  titletext1: Phaser.GameObjects.Text;
  titletext2: Phaser.GameObjects.Text;
  titletext4: Phaser.GameObjects.Text;
  titletext5: Phaser.GameObjects.Text;
}

export default class OverworldTitle extends Phaser.Scene implements Title {
  [x: string]: any;
  keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];
  winddirection: WindDirection = {
    xspeed: Phaser.Math.Between(1, 10),
    yspeed: Phaser.Math.Between(1, 10),
  };
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
  goldtext!: Phaser.GameObjects.Text;
  numberofclouds!: number;

  baseLayer!: Phaser.Tilemaps.TilemapLayer;
  decorLayer!: Phaser.Tilemaps.TilemapLayer;
  topLayer!: Phaser.Tilemaps.TilemapLayer;

  cloudGroup!: Phaser.Physics.Arcade.Group;
  islightused!: boolean;
  constructor() {
    super("OverworldTitle");
    this.numberofclouds = Phaser.Math.Between(1, 7);
    this.isLightused = true;
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


  preload() {

    this.load.scenePlugin('AnimatedTiles', 'https://raw.githubusercontent.com/nkholski/phaser-animated-tiles/master/dist/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    this.sound.play("ruinedworld", { volume: 0.03, loop: true });

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



    let allmappedtiles = CreateAllLayersAndSetCollisions(this);
    this.animatedTiles.init(allmappedtiles);
    GetAnimsForOverworld(this, 4);
    createStructuresAndWeather(this);
    AddCloudWithShadow(this)
    this.lights.enable();
    let mainlights = this.lights.setAmbientColor(0x555555);
    let light = this.lights.addLight(0, 0, 300)
    let light2 = this.lights.addLight(500, 0, 300);
    let intensity = Phaser.Math.Between(400, 800);
    let speed = Phaser.Math.Between(100, 600);
    var particles = this.add.particles("rain").setDepth(4).setPipeline(this.isLightused ? 'Light2D' : "");


    var emitter = particles
      .createEmitter({
        x: { min: 0, max: 500 }, y: { min: 0, max: 500 }, speed: intensity,
        maxParticles: 800, speedY: 500, speedX: { min: 120, max: 300 }, lifespan: { min: 200, max: 1000 },
        blendMode: BlendModes.DARKEN, gravityY: 200,
        scale: { start: .5, end: .1 }
      },
      ).setAlpha(1)
    var emitter2 = particles
      .createEmitter({
        x: { min: 300, max: 500 }, y: { min: 0, max: 500 },
        maxParticles: 800, speedY: speed, speedX: intensity, lifespan: { min: 300, max: 1100 },
        blendMode: BlendModes.DARKEN,
        scale: { min: .3, max: .9 }
      },
      ).setAlpha(1)


  }



}


