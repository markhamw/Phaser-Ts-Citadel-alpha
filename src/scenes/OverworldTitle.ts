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
  SummonMobs,
} from "../game/overworldlogic";
import "../characters/Player";
import Player from "../characters/Player";
import { addTitleTextToScene, displayTitleTextAndEnableInputs, startIntro } from "~/game/overworldtitlelogic";
import { newEnemyGroup } from "~/enemies/enemies";
import Bird from "~/world/Bird";



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
    this.animatedTiles.init(allmappedtiles)
    GetAnimsForOverworld(this, 4);
    createStructuresAndWeather(this);
    this.lights.enable();
    let mainlights = this.lights.setAmbientColor(0x999999);
    let light = this.lights.addLight(0, 0, 10, 0xFF0000);
    let light2 = this.lights.addLight(500, 0, 100)
    let intensity = Phaser.Math.Between(400, 800);
    let speed = Phaser.Math.Between(100, 600);
    var particles = this.add.particles("rain").setDepth(4)
    let birdgroup = this.physics.add.group({
      classType: Bird,
      maxSize: 100,
    })


    for (let i = 0; i < Phaser.Math.Between(4, 15); i++) {
      let bird = birdgroup.get(Phaser.Math.Between(300, 500), Phaser.Math.Between(200, 400), "birds").setPipeline('Light2D')
      bird.setDepth(6);
      bird.anims.play('whiteflyup', true)
      bird.setVelocity(Phaser.Math.Between(2, -2), Phaser.Math.Between(-12, -36));

      this.tweens.add({
        targets: bird,
        framerate: 60,
      })
      this.tweens.add({
        targets: bird,
        y: { from: bird.y, to: bird.y - Phaser.Math.Between(800, 510) },
        duration: 40000,
        ease: 'Linear',
        repeat: -1,
        yoyo: false,
        scale: { from: .7, to: .6 },
      })
    }


    /*   var emitter = particles
        .createEmitter({
          x: { min: -100, max: 500 }, y: { min: 0, max: 500 }, speed: 300,
          speedY: 500, speedX: { min: 120, max: 300 }, lifespan: { min: 600, max: 1000 },
          blendMode: BlendModes.DARKEN, gravityY: 30, frequency: 10,
          scale: { start: .5, end: .5 }
        },
        ).setAlpha(1)
  
      var emitter2 = particles
        .createEmitter({
          x: { min: -50, max: 500 }, y: { min: 0, max: 500 },
          maxParticles: 3, speedY: speed, speedX: intensity, lifespan: { min: 600, max: 1100 },
          blendMode: BlendModes.DARKEN, frequency: 10,
          scale: { min: .3, max: .9 }
        },
        ).setAlpha(1)
   */

  }



}


