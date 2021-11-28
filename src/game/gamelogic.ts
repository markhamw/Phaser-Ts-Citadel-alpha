import Phaser from "phaser";

enum RatNameStart {
  Do,
  Ra,
  Ba,
  Ji,
  Ti,
  Di,
  Ci,
  Co,
  Li,
  Vo,
  Va,
  Ri
}
enum Direction {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  RIGHTANDUP,
  RIGHTANDDOWN,
  LEFTANDUP,
  LEFTANDDOWN,
  IDLE,
}
enum RatNameEnd {
  brik,
  dok,
  kil,
  kol,
  ridi,
  rodi,
  sishi,
  duus,
  ruus,
}
enum RatRoyalty {
  'the Stank',
  'the Foul',
  'el Rancid',
  'the KingRat',
  'dook Duke',
  'du Harme',
  'le Prince',
}


function getNewKingRatName() {
  return RatNameStart[Phaser.Math.Between(0, 11)] + RatNameEnd[Phaser.Math.Between(0, 8)] + ' ' + RatRoyalty[Phaser.Math.Between(0, 6)]
}

function getNewRatName() {
  return RatNameStart[Phaser.Math.Between(0, 11)] + RatNameEnd[Phaser.Math.Between(0, 8)]
}

function AddWASDKeysToScene(scene: Phaser.Scene): Phaser.Input.Keyboard.Key[] {
  let W = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  let A = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  let S = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  let D = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  return [W, A, S, D];
}

function CreateAnimationSet(
  scene: Phaser.Scene,
  animations: Phaser.Types.Animations.Animation[]
) {
  animations.forEach((animation) => {
    scene.anims.create(animation);
  });
}

function RandomCoord(max: number): number {
  let num = Math.floor(Math.random() * max);
  let minimumAbritraryCoordValue = 49;
  if (num > minimumAbritraryCoordValue) {
    return num;
  } else return num + 30;
};

export { AddWASDKeysToScene, CreateAnimationSet, getNewKingRatName, getNewRatName, RandomCoord, Direction };
