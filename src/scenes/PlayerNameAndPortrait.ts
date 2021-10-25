import { WRGame } from "~/game/game";
import { AddWASDKeysToScene } from "~/game/gamelogic";

export default class PlayerNameAndPortrait extends Phaser.Scene {
  private keys!: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd!: Phaser.Input.Keyboard.Key[];

  wrGame!: WRGame;

  constructor() {
    super("PlayerNameAndPortrait");
  }

  init(data) {
    this.wrGame = data;
    this.wrGame.playerCurrentScene = "Title";
  }

  preload() {
    this.keys = this.input.keyboard.createCursorKeys();
    this.wasd = AddWASDKeysToScene(this);
  }

  create() {
    this.ShowMenu();
    this.wasd[1].on("up", () => {
      this.events.emit("changeHead", "left");
    });
    this.wasd[3].on("up", () => {
      this.events.emit("changeHead", "right");
    });
    this.keys.space.on("up", () => {
      this.scene.start("Titlescene", this.wrGame);
    });
  }
  ShowMenu = () => {
    let portraits: string[] = [];
    let FitToViewScale = 1.8;
    for (let i = 0; i < 19; i++) {
      portraits.push(`heads-${i}.png`);
    }
    let selectText0 = this.add.text(230, 100, "Press Space To Continue", { fontSize: "48" }).setScale(FitToViewScale);
    Phaser.Display.Align.In.Center(selectText0, this.add.zone(200, 200, 200, 200), 0, 120);

    let selectText1 = this.add.text(230, 230, "--== Select A Portrait ==--", { fontSize: "48" }).setScale(FitToViewScale);
    Phaser.Display.Align.In.Center(selectText1, this.add.zone(200, 200, 200, 200));

    let leftArrow = this.add.sprite(130, 260, "arrows", "arrow_scrolling_34.png").setScale(5.8);
    Phaser.Display.Align.In.Center(leftArrow, this.add.zone(200, 200, 200, 200), -100, 0);
    leftArrow.setInteractive();
    leftArrow.on("pointerdown", () => {
      this.events.emit("changeHead", "left");
    });

    let rightArrow = this.add.sprite(230, 260, "arrows", "arrow_scrolling_35.png").setScale(5.8);
    Phaser.Display.Align.In.Center(rightArrow, this.add.zone(200, 200, 200, 200), 200, 0);
    rightArrow.setInteractive();
    rightArrow.on("pointerdown", () => {
      this.events.emit("changeHead", "right");
    });

    let head = this.add.sprite(230, 240, "playerheads", this.wrGame.playerHead).setScale(4.8);
    Phaser.Display.Align.In.Center(head, this.add.zone(200, 200, 200, 200), 40, 60);

    this.events.addListener("changeHead", (direction: string) => { 
      let currentIndex = portraits.indexOf(this.wrGame.playerHead);
      switch (direction) {
        case "left":
          if (portraits[currentIndex - 1]) {
            this.wrGame.playerHead = portraits[currentIndex - 1];
            head.setTexture("playerheads", this.wrGame.playerHead);
          }
          break;
        case "right":
          if (portraits[currentIndex + 1]) {
            this.wrGame.playerHead = portraits[currentIndex + 1];
            head.setTexture("playerheads", this.wrGame.playerHead);
          }
          break;
      }
    });
  };

  Start = () => {
    this.cameras.main.fadeOut(2000, 0, 0, 0);
    this.sound.stopAll();
    this.scene.start("Titlescene", this.wrGame);
  };

  update() {}
}
