import Overworld from "~/scenes/Overworld";

export type WindDirection = {
    xspeed: number;
    yspeed: number;
  };
  
export type Placement = {
    collection: string;
    tag: string;
    location: Location;
  };

export type Location = {
    x: number;
    y: number;
  };

export const buildingsforWorldMap: Placement[] = [
    { collection: "buildings32", tag: "Tavern.png", location: { x: 320, y: 310 } },
    { collection: "buildings32", tag: "TradingPost.png", location: { x: 250, y: 130 } },
    { collection: "buildings32", tag: "Sanctuary.png", location: { x: 115, y: 365 } },
    { collection: "buildings32", tag: "Prison.png", location: { x: 415, y: 95 } },
    { collection: "buildings16", tag: "EyeOfTheMagi.png", location: { x: 415, y: 115 } },
    { collection: "treasures", tag: "OldTreeNests.png", location: { x: 155, y: 95 } },
  ];

export const GenerateBuildings = (scene:Overworld) => {
    buildingsforWorldMap.forEach((building) => {
      scene.add.sprite(building.location.x, building.location.y, building.collection, building.tag).setPipeline("Light2D");
    });
  };


export const RandomCloud = (scene:Overworld) => {
    let maxXorY = 400;

    let cloudNum = Math.floor(Math.random() * 6) + 1;

    let cloudx = Math.floor(Math.random() * maxXorY);
    let cloudy = Math.floor(Math.random() * maxXorY);

    let cloudshadow = scene.physics.add.sprite(cloudx + 40, cloudy + 50, "cloudsshadows", `Clouds${cloudNum}.png`).setAlpha(0.1).setPipeline('Light2D');
    let cloud = scene.physics.add.sprite(cloudx, cloudy, "clouds", `Clouds${cloudNum}.png`).setAlpha(0.2).setPipeline('Light2D');

    let window = scene.physics.add.sprite(0, 0, "window");
    window.setOrigin(0.0);
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
        scene.numberofclouds -= 1;
      },
    });
  };