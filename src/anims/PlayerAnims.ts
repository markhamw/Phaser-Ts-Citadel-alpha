import Phaser from 'phaser'

const GetPlayerAnims = (anims: Phaser.Animations.AnimationManager, rate: number, playerID: string) => {
  return [
    {
      key: "player-idledown",
      frames: [
        {
          key: playerID,
          frame: "player-idledown.png",
        },
      ],
    },
    {
      key: "player-idleup",
      frames: [
        {
          key: playerID,
          frame: "player-idleup.png",
        },
      ],
    },
    {
      key: "player-idleright",
      frames: [
        {
          key: playerID,
          frame: "player-idleup.png",
        },
      ],
    },
    {
      key: "player-idleleft",
      frames: [
        {
          key: playerID,
          frame: "player-idleup.png",
        },
      ],
    },
    {
      key: "player-attackup",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackup-",
        suffix: ".png",
      }),
      repeat: 1,
      frameRate: rate,
    },
    {
      key: "player-attackdown",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackdown-",
        suffix: ".png",
      }),
      repeat: 1,
      frameRate: rate,
    },
    {
      key: "player-attackright",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackright-",
        suffix: ".png",
      }),
      repeat: 1,
      frameRate: rate,
    },
    {
      key: "player-attackleft",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 5,
        prefix: "player-attackleft-",
        suffix: ".png",
      }),
      repeat: 1,
      frameRate: rate,
    },

    {
      key: "player-movedown",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-movedown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveup",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-moveup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveright",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-moveright-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveleft",
      frames: anims.generateFrameNames(playerID, {
        start: 0,
        end: 6,
        prefix: "player-moveleft-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
  ]
}

const GetOverworldPlayerAnims = (anims: Phaser.Animations.AnimationManager, rate: number, playerID: string) => {
  return [

    {
      key: "player-movedown",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-movedown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveup",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-moveup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveleft",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-moveleft-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveright",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-moveright-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveleftanddown",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-moveleftanddown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moveleftandup",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-moveleftandup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moverightanddown",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-moverightanddown-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },
    {
      key: "player-moverightandup",
      frames: anims.generateFrameNames(playerID, {
        start: 1,
        end: 4,
        prefix: "player-moverightandup-",
        suffix: ".png",
      }),
      repeat: -1,
      frameRate: rate,
    },

  ]
}


export {
  GetPlayerAnims, GetOverworldPlayerAnims
}