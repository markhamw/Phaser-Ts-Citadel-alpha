import { BlendModes } from "phaser";
import Overworld from "~/scenes/Overworld";
import OverworldTitle from "~/scenes/OverworldTitle";
import Building from "~/structures/Building";
import { Speech } from "./game";

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

export type Location = {
  x: number;
  y: number;
};

export const enum Layers {
  Base,
  Decor,
}

export type WRGameScene = OverworldTitle | Overworld;

export const createOverworldTileMap = (scene: WRGameScene) => {
  let map2 = scene.make.tilemap({ key: "allbiomes" });
  let tileset3 = map2.addTilesetImage("allbiomes", "tiles3");
  scene.baseLayer = map2.createLayer(Layers.Base, tileset3);
  scene.decorLayer = map2.createLayer(Layers.Decor, tileset3);
  scene.baseLayer.setDepth(0);
  scene.decorLayer.setDepth(0);
  scene.baseLayer.setCollisionByProperty({ collides: true });
  scene.decorLayer.setCollisionByProperty({ collides: true });
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
];
export const createBorder = (scene: Phaser.Scene) => {
  let borderBox = scene.add.sprite(0, 0, "border");
  borderBox.setOrigin(0, 0);
  borderBox.setScale(0.98);
  borderBox.setAlpha(0.5);
  borderBox.setDepth(5);
};


const newBuildingGroup = (scene: Phaser.Scene, type: any) => {
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
  scene.buildingsGroup = newBuildingGroup(scene, Building);
  buildingsforWorldMap.forEach((building) => {
    let bldg = scene.buildingsGroup.get(building.location.x, building.location.y, building.collection, building.tag).setScale(1.45).setDepth(1);
    bldg.name = building.name;
    bldg.collides = true;
    bldg.setInteractive();
  });
};


export const ShowMenu = (scene: OverworldTitle) => {
  let portraits: string[] = [];

  for (let i = 0; i < 19; i++) {
    portraits.push(`heads-${i}.png`);
  }

  AddLeftArrow(scene);
  AddRightArrow(scene);
  AddHead(scene, portraits);
};

export const RandomCloud = (scene: any) => {
  scene.numberofclouds++;
  let maxXorY = 400;
  let cloudNum = Math.floor(Math.random() * 6) + 1;
  let cloudx = Math.floor(Math.random() * maxXorY);
  let cloudy = Math.floor(Math.random() * maxXorY);
  let cloudshadow = scene.physics.add.sprite(cloudx + 40, cloudy + 50, "cloudsshadows", `Clouds${cloudNum}.png`).setAlpha(0.1).setDepth(2);
  let cloud = scene.physics.add.sprite(cloudx, cloudy, "clouds", `Clouds${cloudNum}.png`).setAlpha(0.2).setDepth(2);
  let cloudSize = Math.floor(Math.random() * 6) + 2;
  cloud.setScale(cloudSize);
  cloudshadow.setScale(cloudSize);
  cloudshadow.setVelocity(scene.winddirection.xspeed, scene.winddirection.yspeed);
  cloud.setVelocity(scene.winddirection.xspeed, scene.winddirection.yspeed);

  let appeardelay = Math.floor(Math.random() * 30000) + 10000;
  let dissipate1delay = Math.floor(Math.random() * 45000) + 30000;
  let dissipate2delay = dissipate1delay + Math.floor(Math.random() * 60000) + 45000;

  let cloudappear = scene.time.addEvent({
    delay: appeardelay,
    repeat: 20,
    callback: () => {
      cloud.alpha += 0.07;
      cloudshadow.alpha += 0.07;
    },
  });

  let clouddisapate1 = scene.time.addEvent({
    delay: dissipate1delay,
    repeat: 20,
    callback: () => {
      cloud.alpha -= 0.07;
      cloudshadow.alpha -= 0.07;
    },
  });

  let clouddisapate2 = scene.time.addEvent({
    delay: dissipate2delay,
    repeat: 0,
    callback: () => {
      cloud.destroy();
      cloudshadow.destroy();
      scene.numberofclouds--;
    },
  });
};