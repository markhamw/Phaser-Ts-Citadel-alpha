import { BlendModes } from "phaser";
import Overworld from "~/scenes/Overworld";
import OverworldTitle from "~/scenes/OverworldTitle";
import Building from "~/structures/Building";
import { Speech } from "./game";
import { RandomCoord } from "./gamelogic";

export type WindDirection = {
  xspeed: number;
  yspeed: number;
};

export type Placement = {
  collection: string;
  tag: string;
  location: Location;
  name: string;
};

export type Landmark = {
  name: string;
  location: Location;
  sprite: Phaser.Physics.Arcade.Sprite;
  speech: Speech;
}
export type Location = {
  x: number;
  y: number;
};

export const enum Layers {
  Top,
  Base,
  Decor,
}

export type WRGameScene = OverworldTitle | Overworld;

export const createOverworldTileMap = (scene: WRGameScene) => {
  let map2 = scene.make.tilemap({ key: "allbiomes" });
  let tileset3 = map2.addTilesetImage("allbiomes", "tiles3");

  scene.topLayer = map2.createLayer(Layers.Top, tileset3)
    .setPipeline("Light2D");
  scene.baseLayer = map2.createLayer(Layers.Base, tileset3)
    .setPipeline("Light2D");
  scene.decorLayer = map2.createLayer(Layers.Decor, tileset3)
    .setPipeline("Light2D");

  scene.baseLayer.setCollisionByProperty({ collides: true });
  scene.decorLayer.setCollisionByProperty({ collides: true });
  scene.topLayer.setCollisionByProperty({ collides: true });
}

export const AddLeftArrow = (scene: OverworldTitle) => {
  scene.leftArrow = scene.add.sprite(130, 260, "arrows", "arrow_scrolling_34.png").setScale(6.5);
  Phaser.Display.Align.In.Center(scene.leftArrow, scene.add.zone(200, 300, 200, 200), -100, 50);
  scene.leftArrow.setInteractive();
  scene.leftArrow.on("pointerdown", () => {
    scene.events.emit("changeHead", "left");
  });
  scene.leftArrow.setDepth(3);
}

export function AddHiddenInfoToScene(scene: Overworld) {
  scene.info = scene.add.sprite(0, 0, "info").setAlpha(1);
  scene.info.setOrigin(0, 0);
  scene.info.setScale(0.97);
  scene.info.setDepth(40);
}

export const AddHead = (scene: OverworldTitle, portraits) => {
  scene.head = scene.add.sprite(230, 240, "playerheads", "heads-1.png").setScale(5.4);
  Phaser.Display.Align.In.Center(scene.head, scene.add.zone(250, 300, 200, 200), 0, 60);
  scene.head.setDepth(3);
  scene.events.addListener("changeHead", (direction: string) => {
    let currentIndex = portraits.indexOf(scene.wrGame.playerHead);
    switch (direction) {
      case "left":
        if (portraits[currentIndex - 1]) {
          scene.wrGame.playerHead = portraits[currentIndex - 1];
          scene.head.setTexture("playerheads", scene.wrGame.playerHead);
        }
        break;
      case "right":
        if (portraits[currentIndex + 1]) {
          scene.wrGame.playerHead = portraits[currentIndex + 1];
          scene.head.setTexture("playerheads", scene.wrGame.playerHead);
        }
        break;
    }
  });
}

export const AddRightArrow = (scene: OverworldTitle) => {
  scene.rightArrow = scene.add.sprite(230, 260, "arrows", "arrow_scrolling_35.png").setScale(6.5);
  Phaser.Display.Align.In.Center(scene.rightArrow, scene.add.zone(200, 300, 200, 200), 200, 50);
  scene.rightArrow.setInteractive();
  scene.rightArrow.on("pointerdown", () => {
    scene.events.emit("changeHead", "right");
  });
  scene.rightArrow.setDepth(3);
}
export const SummonMobs = (
  group: Phaser.Physics.Arcade.Group,
  enemyid: string,
  numberOfMobsToCreate: number,
  x?: number,
  y?: number
) => {
  for (let countmade = 0; countmade < numberOfMobsToCreate; countmade++) {
    let mobX = x ?? RandomCoord(450) + 10;
    let mobY = y ?? RandomCoord(450) + 10;
    let mob = group.get(mobX, mobY, enemyid);
    return mob;
  }
};
export const buildingsforWorldMap: Placement[] = [
  { name: "Tavern", collection: "buildings32", tag: "Tavern.png", location: { x: 320, y: 310 } },
  { name: "Trading Post", collection: "buildings32", tag: "TradingPost.png", location: { x: 250, y: 130 } },
  { name: "Sanctuary", collection: "buildings32", tag: "Sanctuary.png", location: { x: 115, y: 365 } },
  { name: "Cartographer", collection: "buildings32", tag: "Cartographer.png", location: { x: 47, y: 39 } },
  { name: "Prison", collection: "buildings32", tag: "Prison.png", location: { x: 365, y: 95 } },
  { name: "EyeOfTheMagi", collection: "buildings16", tag: "EyeOfTheMagi.png", location: { x: 365, y: 115 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 40, y: 65 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 68, y: 85 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 205, y: 75 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 215, y: 75 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 245, y: 33 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 265, y: 85 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 405, y: 135 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 395, y: 85 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 305, y: 130 } },
  { name: "Old Tree", collection: "treasures", tag: "OldTreeNests.png", location: { x: 335, y: 43 } },
  { name: "Waterfall", collection: "waterfall", tag: "waterfall-1.png", location: { x: 350, y: 151 } },
];

export const createBorder = (scene: Phaser.Scene) => {
  let borderBox = scene.add.sprite(0, 0, "border");
  borderBox.setOrigin(0, 0);
  borderBox.setScale(.98);
  borderBox.setDepth(5);
};


export const newGroup = (scene: Phaser.Scene, type: any) => {
  return scene.physics.add.group({
    classType: type,
    createCallback: (gameObject) => {
      const obj = gameObject as typeof type;
      obj.body.onCollide = true;
    },
    collideWorldBounds: true,
    immovable: true,
  });
}

export const GenerateBuildings = (scene: any) => {
  scene.buildingsGroup = newGroup(scene, Building);
  buildingsforWorldMap.forEach((building) => {
    let bldg = scene.buildingsGroup.get(building.location.x, building.location.y, building.collection, building.tag).setScale(1.45).setDepth(3).setPipeline("Light2D");
    bldg.name = building.name;
    bldg.collides = true;
    bldg.setDepth(3);
    bldg.setInteractive();
  });
};

export function createGoldOverlay(scene: any) {
  scene.goldDisplay = scene.add.text(32, 470, "x" + 100, {
    fontSize: "20px",
    fontFamily: "breathfire",
    color: "#ffffff",
  });
  scene.goldCoin = scene.add.sprite(25, 480, "coin", "coin_1.png");
  scene.goldCoin.anims.play("coinrotate");
  scene.goldCoin.setScale(2.5);
  scene.goldCoin.setAlpha(0.6);
};


export function createStructuresAndWeather(scene: any) {
  GenerateBuildings(scene);
  let AddClouds = scene.time.addEvent({
    delay: 2000,
    repeat: -1,
    callback: () => {
      if (scene.numberofclouds < 2) {
        RandomCloud(scene);
      }
    },
  });
}


const AddCloudWithShadow = (scene: Overworld | OverworldTitle) => {
  let maxXorY = 400;
  let cloudPngNumberVariant = Phaser.Math.Between(1, 6);
  let cloudx = Phaser.Math.Between(1, maxXorY);
  let cloudy = Phaser.Math.Between(1, maxXorY);
  let cloudshadow = scene.physics.add.sprite(cloudx, cloudy, "cloudsshadows", `Clouds${cloudPngNumberVariant}.png`).setAlpha(0.1).setDepth(2).setPipeline("Light2D");
  let cloud = scene.physics.add.sprite(cloudx + 10, cloudy + 20, "clouds", `Clouds${cloudPngNumberVariant}.png`).setAlpha(0.2).setDepth(2).setPipeline("Light2D");
  let cloudSize = Phaser.Math.Between(2, 10)
  cloud.setScale(cloudSize);
  cloudshadow.setScale(cloudSize);
  cloudshadow.setVelocity(Phaser.Math.Between(2, 10), scene.winddirection.yspeed);
  cloud.setVelocity(Phaser.Math.Between(2, 10), scene.winddirection.yspeed);
  scene.numberofclouds++;

  scene.tweens.add({
    targets: cloud,
    alpha: { from: .2, to: 0 },
    duration: 200000,
    ease: 'Linear',
    repeat: 0,
    onComplete: () => {
      cloud.setAlpha(cloud.alpha - 0.2);
    },
    yoyo: true
  })

  scene.tweens.add({
    targets: cloudshadow,
    alpha: { from: .3, to: .2 },
    duration: 200000,
    ease: 'Linear',
    repeat: 0,
    yoyo: true,
    onComplete: () => {
      cloudshadow.setAlpha(cloud.alpha - 0.2)
    },
  })
}

export const RandomCloud = (scene: Overworld | OverworldTitle) => {
  AddCloudWithShadow(scene);
};