import Shaman from "./Shaman";

const enemies = [
  {
    name: "enemy-rat",
    PathToPNG: "enemies/goblin.png",
    PathToJSON: "enemies/goblin.json"
  },
  {
    name: "enemy-ratogre",
    PathToPNG: "enemies/ogre.png",
    PathToJSON: "enemies/ogre.json"
  },
  {
    name: "enemy-shaman",
    PathToPNG: "enemies/shaman.png",
    PathToJSON: "enemies/shaman.json"
  },
  {
    name: "enemy-flyingrat",
    PathToPNG: "enemies/flyingrat.png",
    PathToJSON: "enemies/flyingrat.json"
  },
  {
    name: "enemy-earthgolem",
    PathToPNG: "enemies/earthgolem.png",
    PathToJSON: "enemies/earthgolem.json"
  },
  {
    name: "enemy-airelemental",
    PathToPNG: "enemies/airelemental.png",
    PathToJSON: "enemies/airelemental.json"
  },
];

const newEnemyGroup = (scene: Phaser.Scene, type: any, collides: boolean, collideWorldBounds: boolean) => {
  return scene.physics.add.group({
    classType: type,
    createCallback: (go) => {
      const ratObj = go as typeof type;
      ratObj.body.onCollide = collides;
    },
    collideWorldBounds: collideWorldBounds,
  });
}

//
export { enemies, newEnemyGroup }

