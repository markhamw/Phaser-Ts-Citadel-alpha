import { Physics, Scene } from "phaser";
import { WRGame } from "~/game/game";
import { WindDirection, RandomCloud, GenerateBuildings } from "../game/overworldlogic";

const enum Layers {
  Base,
  Decor,
}

export default class Overworld extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  winddirection: WindDirection = { xspeed: Math.floor(Math.random() * 3) + 1, yspeed: Math.floor(Math.random() * 3) + 1 };
  numberofclouds: number = 0;
  wrGame!: WRGame;

  constructor() {
    super("Overworld");

  }

  init(data) {
    this.wrGame = data;
    this.wrGame.playerCurrentScene = "OverWorld";
  }

  preload() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.cameras.main.setPipeline("Light2D");
    let map2 = this.make.tilemap({ key: "hasgb" });
    console.log(this.wrGame.playerCurrentScene);
    const tileset3 = map2.addTilesetImage("HASGB", "tiles3");
    const baseLayer = map2.createLayer(Layers.Base, tileset3).setPipeline("Light2D").setAlpha(1);
    const decorLayer = map2.createLayer(Layers.Decor, tileset3).setPipeline("Light2D").setAlpha(1);
    this.lights.enable();
    baseLayer.setOrigin(0, 0);
    GenerateBuildings(this);
    this.lights.addLight(100, 200, 1, 0xffffff);
    RandomCloud(this);
    RandomCloud(this);
  }

  SetupEvents = () => {
    let Start = () => {
      // this.scene.start('citadel')
    };

    let FadeOut = this.time.addEvent({
      delay: 1000,
      repeat: 0,
      callback: () => {
        this.cameras.main.fadeOut(2000, 0, 0, 0);
      },
    });
  };

  create() {
    this.time.addEvent({
      delay:10000,
      repeat: -1,
      callback: ()=>{
        if (this.numberofclouds < 6){
          RandomCloud(this)
        }
      }
    })

    this.events.addListener("start", () => {
       console.log("Heard start event")
    });
  }

  update() {}
}
