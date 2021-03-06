import { BlendModes } from "phaser";
import Overworld from "~/scenes/Overworld";
import OverworldTitle from "~/scenes/OverworldTitle";
import Building from "~/structures/Building";
import { BirdAnims } from "~/world/Bird";
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
  animationname?: string;
  transform?: {
    scale?: number;
  };
  identlines?: string[];
};

export type Landmark = {
  name: string;
  location: Location;
  sprite: Phaser.Physics.Arcade.Sprite;
  speech: Speech;
};
export type Location = {
  x: number;
  y: number;
};

export const enum Layers {
  TopDetail,
  Top,
  Base,
  Decor,
}
export const enum SouthAreaLayers {
  TileLayer3,
  Detail,
  Base,
}
export type WRGameScene = OverworldTitle | Overworld;

export const CreateAllLayersAndSetCollisions = (scene: Overworld | OverworldTitle) => {

  var map = scene.make.tilemap({ key: "allbiomes" });

  var allbiomes = map.addTilesetImage("allbiomes", "tiles3");
  var dirttiles = map.addTilesetImage("Dirt", "Dirt");
  var dirtland = map.addTilesetImage("DirtLand", "DirtLand");
  var dirtrock = map.addTilesetImage("DirtRock", "DirtRock");
  var caveland = map.addTilesetImage("CaveLand", "CaveLand");
  var caverock = map.addTilesetImage("CaveRock", "CaveRock");
  var grasstiles = map.addTilesetImage("Grass", "Grass");
  var grassland = map.addTilesetImage("GrassLand", "GrassLand");
  var grasscoast = map.addTilesetImage("GrassCoast", "GrassCoast");

  var treesmountains = map.addTilesetImage("treesmountains", "treesmountains");
  var oceantiles = map.addTilesetImage("OceanAnimated", "OceanAnimated");

  var lavaland = map.addTilesetImage("LavaLand", "LavaLand");
  var lavacoast = map.addTilesetImage("LavaCoast", "LavaCoast");


  let allTileSets = [
    grasscoast,
    grassland,
    grasstiles,
    allbiomes,
    dirttiles,
    oceantiles,
    dirtland,
    dirtrock,
    caveland,
    caverock,
    lavaland,
    lavacoast,
    treesmountains];


  map.createLayer(Layers.TopDetail, allTileSets)
    .setPipeline("Light2D");
  map.createLayer(Layers.Top, allTileSets)
    .setPipeline("Light2D");
  map.createLayer(Layers.Decor, allTileSets)
    .setPipeline("Light2D");
  map.createLayer(Layers.Base, allTileSets)
    .setPipeline("Light2D");

  return map
};

export function AddHiddenInfoToScene(scene: Overworld) {
  scene.info = scene.add.sprite(0, 0, "info").setAlpha(1);
  scene.info.setOrigin(0, 0);
  scene.info.setScale(0.97);
  scene.info.setDepth(40);
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
  {
    name: "Rada Tavern",
    collection: "buildings32",
    tag: "Tavern.png",
    location: { x: 320, y: 310 },
    identlines: ["It's Rada Tavern. The only place to get a beer south of the capital.",
      "The Rada is just a tavern, but it's a good place to drink."],
  },
  {
    name: "Trading Post",
    collection: "buildings32",
    tag: "TradingPost.png",
    location: { x: 250, y: 130 },
    identlines: ["Trading Post...", "It's a place to trade stuff? Or just click on it."],
  },
  {
    name: "Sanctuary",
    collection: "buildings32",
    tag: "Sanctuary.png",
    location: { x: 115, y: 365 },
    identlines: ["The Sanctuary...", "I have no idea what this place is for."],
  },
  {
    name: "Cartographer",
    collection: "buildings32",
    tag: "Cartographer.png",
    location: { x: 47, y: 39 },
    identlines: ["The Cartographer...", "I should find a use for this place"],
  },
  {
    name: "Prison",
    collection: "buildings32",
    tag: "Prison.png",
    location: { x: 365, y: 95 },
    identlines: ["The Prison...", "The prison has been abandoned for a long time."],
  },
  {
    name: "Eye Of The Magi",
    collection: "buildings16",
    tag: "EyeOfTheMagi.png",
    location: { x: 365, y: 115 },
    identlines: ["The Eye of the Magi...", "Its a magical eye. I wonder what it sees."],
  },
  {
    name: "Old Tree",
    collection: "treasures",
    tag: "OldTreeNests.png",
    location: { x: 405, y: 95 },
    identlines: ["An old Tree...", "Another tree", "Its just a tree", "Tree in the wind", "There are too many of these"],
  },
  {
    name: "Old Tree",
    collection: "treasures",
    tag: "OldTreeNests.png",
    location: { x: 335, y: 43 },
    identlines: ["An old Tree...", "Another tree", "Its just a tree", "Tree in the wind", "There are too many of these"],
  },
  {
    name: "Waterfall",
    collection: "waterfall",
    tag: "waterfall-1.png",
    location: { x: 350, y: 151 },
    identlines: ["By the gods..what a sight!", "It's the waterfall",],
    animationname: "waterfall-action",
  },
  {
    name: "Rada Stables",
    collection: "buildings32",
    tag: "Stables.png",
    location: { x: 320, y: 369 },
    identlines: ["The Rada Stables...", "Rada's horses are very well trained."],
  },
  {
    name: "Dwarf Fprtress",
    collection: "treasures",
    tag: "DwarfFortress.png",
    location: { x: 400, y: 28 },
    identlines: ["The Dwarf Fortress...", "I've heard its a dwarf fortress. I wonder what's inside."],
  },
  {
    name: "Imp Cache",
    collection: "treasures",
    tag: "ImpCache.png",
    location: { x: 472, y: 14 },
    identlines: ["The Imp Cache...", "The so-called Imp Cache is a cache of imps."],
  },
  {
    name: "Graveyard",
    collection: "treasures",
    tag: "Graveyard.png",
    location: { x: 112, y: 256 },
    identlines: ["The Graveyard...", "The graveyard is overrun"],
  },
  { name: "Keep", collection: "treasures", tag: "Keep.png", location: { x: 72, y: 310 } },
  {
    name: "Vault of the Mages",
    collection: "treasures",
    tag: "VaultOfTheMages.png",
    location: { x: 177, y: 448 },
    identlines: ["The Vault of the Mages...", "The Vault of the Mages is a pit of evil."],
  },
  {
    name: "Fountain Of Rick",
    collection: "buildings32",
    tag: "FountainOfYouth.png",
    location: { x: 320, y: 75 },
    identlines: ["The Fountain of Youth...", "The fountain is overflowing with youth."],
  },
  {
    name: "Rada Sign",
    collection: "buildings16",
    tag: "BigSign.png",
    location: { x: 294, y: 356 },

  },
  {
    name: "Severians Hut",
    collection: "buildings16",
    tag: "SeersHut.png",
    location: { x: 359, y: 318 },
  },
  {
    name: "Severians Hut Fire",
    collection: "firecolumn",
    tag: "fire_column_medium_8.png",
    location: { x: 359, y: 322 },
    animationname: "firecolumn-action-burn",
    transform: { scale: 0.2 },
  },
  {
    name: "Barrier",
    collection: "buildings16",
    tag: "Barrier.png",
    location: { x: 198, y: 263 },
    transform: { scale: 1.3 },
    identlines: ["The Barrier...", "I cannot pass"],
  },
  {
    name: "Barrier",
    collection: "buildings16",
    tag: "Barrier.png",
    location: { x: 219, y: 263 },
    transform: { scale: 1.3 },
    identlines: ["The Barrier...", "I cannot pass"],
  },
  {
    name: "Rada Well",
    collection: "buildings16",
    tag: "MagicWell.png",
    location: { x: 219, y: 328 },
    identlines: ["The Well...its..well..a well", "The well is overflowing with..dryness"],
  },
  {
    name: "Watermill",
    collection: "watermill",
    tag: "watermill1.png",
    location: { x: 349, y: 488 },
    animationname: "watermill-action",
    identlines: ["The mill is the best thing we have in this town, except for the tavern", "The mill is still running after all these years"],
  },
];

export const createBorder = (scene: Phaser.Scene) => {
  let borderBox = scene.add.sprite(0, 0, "border");
  borderBox.setOrigin(0, 0);
  borderBox.setScale(1);
  borderBox.setDepth(10);
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
};

export const GenerateBuildings = (scene: Overworld | OverworldTitle) => {
  scene.buildingsGroup = newGroup(scene, Building);

  buildingsforWorldMap.forEach((building) => {
    let bldg = scene.buildingsGroup
      .get(building.location.x, building.location.y, building.collection, building.tag)
      .setDepth(3).setPipeline("Light2D");
    bldg.name = building.name;
    bldg.collides = true;
    bldg.setDepth(3);
    bldg.setInteractive();
    bldg.body.setSize(15, 20);
    bldg.on("pointerover", () => { });
    if (building.animationname) {
      bldg.anims.play(building.animationname, true);
    }
    if (building.transform) {
      if (building.transform.scale) {
        bldg.setScale(building.transform.scale);
      }
    }
  });
};

export function createGoldOverlay(scene: any) {
  /*   scene.goldtext = scene.add.text(42, 470, "x" + 100, {
      fontSize: "20px",
      fontFamily: "breathfire",
      color: "#77F8FF",
    }); */

  scene.goldCoin = scene.add.sprite(25, 480, "coin", "coin_1.png");
  scene.goldCoin.anims.play("coinrotate");
  scene.goldCoin.setScale(2.5).setDepth(10);

}

export function createStructuresAndWeather(scene: OverworldTitle | Overworld) {
  GenerateBuildings(scene);
  scene.cloudGroup = scene.physics.add.group()
  for (let i = 0; i < scene.numberofclouds; i++) {
    AddCloudWithShadow(scene)
  }

}

export const GetAnimsForOverworld = (scene: Phaser.Scene, rate: number) => {
  scene.anims.create({
    key: `watermill-action`,
    frames: scene.anims.generateFrameNames("watermill", {
      start: 1,
      end: 4,
      prefix: "watermill",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 4,
  });
  scene.anims.create({
    key: `waterfall-action`,
    frames: scene.anims.generateFrameNames("waterfall", {
      start: 0,
      end: 3,
      prefix: "waterfall-",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: 4,
  });
  scene.anims.create({
    key: `coinrotate`,
    frames: scene.anims.generateFrameNames("coin", {
      start: 1,
      end: 4,
      prefix: "coin_",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });
  scene.anims.create({
    key: `firecolumn-action-start`,
    frames: scene.anims.generateFrameNames("firecolumn", {
      start: 1,
      end: 9,
      prefix: "fire_column_medium_",
      suffix: ".png",
    }),
    repeat: 0,
    frameRate: rate,
  });
  scene.anims.create({
    key: `firecolumn-action-burn`,
    frames: scene.anims.generateFrameNames("firecolumn", {
      start: 5,
      end: 9,
      prefix: "fire_column_medium_",
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });
  scene.anims.create({
    key: `firecolumn-action-stop`,
    frames: scene.anims.generateFrameNames("firecolumn", {
      start: 9,
      end: 14,
      prefix: "fire_column_medium_",
      suffix: ".png",
    }),
    repeat: 0,
    frameRate: rate,
  });



  scene.anims.create({
    key: BirdAnims.white.color + BirdAnims.white.flyleft.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.white.flyleft.start,
      end: BirdAnims.white.flyleft.end,
      prefix: BirdAnims.white.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.white.color + BirdAnims.white.flyright.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.white.flyright.start,
      end: BirdAnims.white.flyright.end,
      prefix: BirdAnims.white.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.white.color + BirdAnims.white.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.white.flyup.start,
      end: BirdAnims.white.flyup.end,
      prefix: BirdAnims.white.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.white.color + BirdAnims.white.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.white.flyup.start,
      end: BirdAnims.white.flyup.end,
      prefix: BirdAnims.white.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });







  scene.anims.create({
    key: BirdAnims.blue.color + BirdAnims.blue.flyleft.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.blue.flyleft.start,
      end: BirdAnims.blue.flyleft.end,
      prefix: BirdAnims.blue.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.blue.color + BirdAnims.blue.flyright.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.blue.flyright.start,
      end: BirdAnims.blue.flyright.end,
      prefix: BirdAnims.blue.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.blue.color + BirdAnims.blue.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.blue.flyup.start,
      end: BirdAnims.blue.flyup.end,
      prefix: BirdAnims.blue.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.blue.color + BirdAnims.blue.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.blue.flyup.start,
      end: BirdAnims.blue.flyup.end,
      prefix: BirdAnims.blue.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });







  scene.anims.create({
    key: BirdAnims.red.color + BirdAnims.red.flyleft.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.red.flyleft.start,
      end: BirdAnims.red.flyleft.end,
      prefix: BirdAnims.red.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.red.color + BirdAnims.red.flyright.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.red.flyright.start,
      end: BirdAnims.red.flyright.end,
      prefix: BirdAnims.red.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.red.color + BirdAnims.red.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.red.flyup.start,
      end: BirdAnims.red.flyup.end,
      prefix: BirdAnims.red.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.red.color + BirdAnims.red.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.red.flyup.start,
      end: BirdAnims.red.flyup.end,
      prefix: BirdAnims.red.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });




  scene.anims.create({
    key: BirdAnims.brown.color + BirdAnims.brown.flyleft.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.brown.flyleft.start,
      end: BirdAnims.brown.flyleft.end,
      prefix: BirdAnims.brown.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.brown.color + BirdAnims.brown.flyright.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.brown.flyright.start,
      end: BirdAnims.brown.flyright.end,
      prefix: BirdAnims.brown.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.brown.color + BirdAnims.brown.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.brown.flyup.start,
      end: BirdAnims.brown.flyup.end,
      prefix: BirdAnims.brown.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });

  scene.anims.create({
    key: BirdAnims.brown.color + BirdAnims.brown.flyup.animkey,
    frames: scene.anims.generateFrameNames("birds", {
      start: BirdAnims.brown.flyup.start,
      end: BirdAnims.brown.flyup.end,
      prefix: BirdAnims.brown.color,
      suffix: ".png",
    }),
    repeat: -1,
    frameRate: rate,
  });




};

export const AddCloudWithShadow = (scene: Overworld | OverworldTitle) => {

  let maxXorY = 400;
  let cloudPngNumberVariant = Phaser.Math.Between(1, 6);
  let cloudx = Phaser.Math.Between(1, maxXorY);
  let cloudy = Phaser.Math.Between(1, maxXorY);
  let cloudshadow = scene.physics.add
    .sprite(cloudx, cloudy, "cloudsshadows", `Clouds${cloudPngNumberVariant}.png`)
    .setAlpha(0.4)
    .setDepth(4)
    .setPipeline(scene.islightused ? "Light2D" : "");
  let cloud = scene.physics.add
    .sprite(cloudx + 10, cloudy + 20, "clouds", `Clouds${cloudPngNumberVariant}.png`)
    .setAlpha(0.2)
    .setDepth(4)
    .setPipeline(scene.islightused ? "Light2D" : "");
  let cloudSize = Phaser.Math.Between(2, 10);
  cloud.setScale(cloudSize);
  cloudshadow.setScale(cloudSize);

  cloudshadow.setVelocity(Phaser.Math.Between(2, 10), 5);
  cloud.setVelocity(Phaser.Math.Between(2, 10), 7);
  //scene.cloudGroup.add(cloud);
  //  scene.cloudGroup.add(cloudshadow);

  scene.tweens.add({
    targets: cloud,
    alpha: { from: 0.4, to: 0 },
    duration: 30000,
    ease: "Linear",
    repeat: 0,
    onComplete: () => {

    },
    yoyo: true,
  });
  scene.tweens.add({
    targets: cloudshadow,
    alpha: { from: 0.2, to: 0 },
    duration: 30000,
    ease: "Linear",
    repeat: 0,
    yoyo: true,
    onComplete: () => {

    },
  });

  scene.time.addEvent({
    delay: 1000,
    callback: () => {

    }
  });

  return cloud

};

