
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
  {
    name: "enemy-titan",
    PathToPNG: "enemies/titan.png",
    PathToJSON: "enemies/titan.json"
  },
  {
    name: "enemy-djinn",
    PathToPNG: "enemies/djinn.png",
    PathToJSON: "enemies/djinn.json"
  },
  {
    name: "enemy-gargoyle",
    PathToPNG: "enemies/gargoyle.png",
    PathToJSON: "enemies/gargoyle.json"
  },
  {
    name: "enemy-golem",
    PathToPNG: "enemies/golem.png",
    PathToJSON: "enemies/golem.json"
  },
  {
    name: "enemy-groklin",
    PathToPNG: "enemies/groklin.png",
    PathToJSON: "enemies/groklin.json"
  },
  {
    name: "enemy-mage",
    PathToPNG: "enemies/mage.png",
    PathToJSON: "enemies/mage.json"
  },
  {
    name: "enemy-naga",
    PathToPNG: "enemies/naga.png",
    PathToJSON: "enemies/naga.json"
  },
  {
    name: "enemy-harpy",
    PathToPNG: "enemies/harpy.png",
    PathToJSON: "enemies/harpy.json"
  },
  {
    name: "enemy-shamanb",
    PathToPNG: "enemies/shamanb.png",
    PathToJSON: "enemies/shamanB.json"
  },
  {
    name: "enemy-cyclops",
    PathToPNG: "enemies/cyclops.png",
    PathToJSON: "enemies/cyclops.json"
  },
  {
    name: "enemy-centaur",
    PathToPNG: "enemies/centaur.png",
    PathToJSON: "enemies/centaur.json"
  },
  {
    name: "enemy-wolfrider",
    PathToPNG: "enemies/wolfrider.png",
    PathToJSON: "enemies/wolfrider.json"
  },
  {
    name: "enemy-troll",
    PathToPNG: "enemies/troll.png",
    PathToJSON: "enemies/troll.json"
  },
  {
    name: "enemy-deer",
    PathToPNG: "enemies/deer.png",
    PathToJSON: "enemies/deer.json"
  },
  {
    name: "enemy-druid",
    PathToPNG: "enemies/druid.png",
    PathToJSON: "enemies/druid.json"
  },
  {
    name: "enemy-dwarf",
    PathToPNG: "enemies/dwarf.png",
    PathToJSON: "enemies/dwarf.json"
  },
  {
    name: "enemy-hunter",
    PathToPNG: "enemies/hunter.png",
    PathToJSON: "enemies/hunter.json"
  },
  {
    name: "enemy-pixie",
    PathToPNG: "enemies/pixie.png",
    PathToJSON: "enemies/pixie.json"
  },
  {
    name: "enemy-satyr",
    PathToPNG: "enemies/satyr.png",
    PathToJSON: "enemies/satyr.json"
  },
  {
    name: "enemy-treant",
    PathToPNG: "enemies/treant.png",
    PathToJSON: "enemies/treant.json"
  },
  {
    name: "enemy-bknight",
    PathToPNG: "enemies/bknight.png",
    PathToJSON: "enemies/bknight.json"
  },
  {
    name: "enemy-ghost",
    PathToPNG: "enemies/ghost.png",
    PathToJSON: "enemies/ghost.json"
  },
  {
    name: "enemy-lich",
    PathToPNG: "enemies/lich.png",
    PathToJSON: "enemies/lich.json"
  },
  {
    name: "enemy-skeleton",
    PathToPNG: "enemies/skeleton.png",
    PathToJSON: "enemies/skeleton.json"
  },
  {
    name: "enemy-spider",
    PathToPNG: "enemies/spider.png",
    PathToJSON: "enemies/spider.json"
  },
  {
    name: "enemy-vampire",
    PathToPNG: "enemies/vampire.png",
    PathToJSON: "enemies/vampire.json"
  },
  {
    name: "enemy-zombie",
    PathToPNG: "enemies/zombie.png",
    PathToJSON: "enemies/zombie.json"
  },
  {
    name: "enemy-demon",
    PathToPNG: "enemies/demon.png",
    PathToJSON: "enemies/demon.json"
  },
  {
    name: "enemy-devil",
    PathToPNG: "enemies/devil.png",
    PathToJSON: "enemies/devil.json"
  },
  {
    name: "enemy-efreet",
    PathToPNG: "enemies/efreet.png",
    PathToJSON: "enemies/efreet.json"
  },
  {
    name: "enemy-gog",
    PathToPNG: "enemies/gog.png",
    PathToJSON: "enemies/gog.json"
  },
  {
    name: "enemy-hellhound",
    PathToPNG: "enemies/hellhound.png",
    PathToJSON: "enemies/hellhound.json"
  },
  {
    name: "enemy-imp",
    PathToPNG: "enemies/imp.png",
    PathToJSON: "enemies/imp.json"
  },
  {
    name: "enemy-pitfiend",
    PathToPNG: "enemies/pitfiend.png",
    PathToJSON: "enemies/pitfiend.json"
  },
  {
    name: "enemy-archer",
    PathToPNG: "enemies/archer.png",
    PathToJSON: "enemies/archer.json"
  },
  {
    name: "enemy-cavalier",
    PathToPNG: "enemies/cavalier.png",
    PathToJSON: "enemies/cavalier.json"
  },
  {
    name: "enemy-griffin",
    PathToPNG: "enemies/griffin.png",
    PathToJSON: "enemies/griffin.json"
  },
  {
    name: "enemy-monk",
    PathToPNG: "enemies/monk.png",
    PathToJSON: "enemies/monk.json"
  },
  {
    name: "enemy-paladin",
    PathToPNG: "enemies/paladin.png",
    PathToJSON: "enemies/paladin.json"
  },
  {
    name: "enemy-pikeman",
    PathToPNG: "enemies/pikeman.png",
    PathToJSON: "enemies/pikeman.json"
  },
  {
    name: "enemy-swordsman",
    PathToPNG: "enemies/swordsman.png",
    PathToJSON: "enemies/swordsman.json"
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

