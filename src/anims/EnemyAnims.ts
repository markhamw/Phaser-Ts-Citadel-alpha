import Phaser from 'phaser'



const GetRatAnims = (anims: Phaser.Animations.AnimationManager, rate: number) => {
  return [
    {
      key: `enemy-rat-idle`,
      frames: [
        {
          key: 'enemy-rat',
          frame: 'enemy-rat-movedown-0.png',
        },
      ],

    },
    {
      key: `enemy-rat-moveleft`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 0,
        end: 2,
        prefix: 'enemy-rat-moveleft-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },

    {
      key: `enemy-rat-moveright`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 0,
        end: 2,
        prefix: 'enemy-rat-moveright-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-rat-moveup`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 0,
        end: 2,
        prefix: 'enemy-rat-moveup-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: `enemy-rat-movedown`,
      frames: anims.generateFrameNames('enemy-rat', {
        start: 0,
        end: 2,
        prefix: 'enemy-rat-movedown-',
        suffix: '.png',
      }),
      repeat: -1,
      frameRate: rate,
    }

  ]
}


export {

  GetRatAnims,

}