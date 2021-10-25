import Phaser from 'phaser'


const GetLightAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
    return [
      {
        key: `light-on`,
        frames: anims.generateFrameNames('lights', {
          start: 1,
          end: 4,
          prefix: 'torch_',
          suffix: '.png',
        }),
        repeat: -1,
        frameRate: rate,
      }
  
    ]
  }

const GetCoinAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
    return [
      {
        key: `coinrotate`,
        frames: anims.generateFrameNames('coin', {
          start: 1,
          end: 4, 
          prefix: 'coin_',
          suffix: '.png',
        }),
        repeat: -1,
        frameRate: rate,
      }
  
    ]
  }

const GetSmokeAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
    return [
      {
        key: `smoke-on`,
        frames: anims.generateFrameNames('smoke', {
          start: 0,
          end: 6, 
          prefix: 'smoke-',
          suffix: '.png',
        }),
        repeat: -1,
        frameRate: rate,
      }
  
    ]
  }

  export {

    GetLightAnims, GetCoinAnims, GetSmokeAnims
  
  }