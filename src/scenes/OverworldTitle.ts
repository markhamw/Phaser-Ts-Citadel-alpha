import { Animations, BlendModes, Physics } from "phaser";
import { WRGame } from "~/game/game";
import { AddWASDKeysToScene } from "~/game/gamelogic";
import {
  WindDirection,
  CreateAllLayersAndSetCollisions,
  GetAnimsForOverworld,
  createStructuresAndWeather,
  createBorder,
} from "../game/overworldlogic";
import "../characters/Player";
import Player from "../characters/Player";
import { displayTitleTextAndEnableInputs, startIntro } from "~/game/overworldtitlelogic";
import Bird from "~/world/Bird";


interface Title extends Phaser.Scene {
  titletext0: Phaser.GameObjects.Text;
  titletext1: Phaser.GameObjects.Text;
  titletext2: Phaser.GameObjects.Text;
  titletext4: Phaser.GameObjects.Text;
  titletext5: Phaser.GameObjects.Text;
}

export default class OverworldTitle extends Phaser.Scene implements Title {

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

  buildPrimarySceneContents = () => {
    let allmappedtiles = CreateAllLayersAndSetCollisions(this);
    this.animatedTiles.init(allmappedtiles)
    GetAnimsForOverworld(this, 4);
    createStructuresAndWeather(this);

    this.lights.enable();
    this.lights.setAmbientColor(0x999999);
    let light = this.lights.addLight(0, 0, 100, 0xFF0000, 3);
    let light2 = this.lights.addLight(500, 0, 100)
  }

  create() {
    this.buildPrimarySceneContents();
    createBorder(this)
    let birdgroup = this.physics.add.group({
      classType: Bird,
      maxSize: 100,
    })
    for (let i = 0; i < Phaser.Math.Between(19, 25); i++) {
      let bird = birdgroup.get(Phaser.Math.Between(300, 500), Phaser.Math.Between(200, 400), "birds").setPipeline('Light2D').setScale(Phaser.Math.Between(0.1, 0.2)).setDepth(5);

      bird.anims.play('whiteflyup', true)
      bird.setVelocity(Phaser.Math.Between(2, -2), Phaser.Math.Between(-12, -36));
      let speedRoot = Phaser.Math.Between(4, 6);
      bird.anims.currentAnim.frameRate = speedRoot;
      bird.setVelocity(0, -speedRoot * .4);

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
      })
    }

  }



}


