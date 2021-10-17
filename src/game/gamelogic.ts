import Phaser from "phaser";
enum RatNameStart{
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

enum RatNameEnd{
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

export function getNewKingRatName(){
  return RatNameStart[Phaser.Math.Between(0,11)] + RatNameEnd[Phaser.Math.Between(0,8)]
}

function GetWASDKeys(scene: Phaser.Scene): Phaser.Input.Keyboard.Key[] {
  let W = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
  let A = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
  let S = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
  let D = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  return [W, A, S, D];
}

function ResizeGame(): void {}
function CreateAnimationSet(
  scene: Phaser.Scene,
  animations: Phaser.Types.Animations.Animation[]
) {
  animations.forEach((animation) => {
    scene.anims.create(animation);
  });
}



export { GetWASDKeys, CreateAnimationSet };
