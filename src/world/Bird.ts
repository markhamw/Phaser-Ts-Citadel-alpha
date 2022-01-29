import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";

import { DestroySprite, Stop } from "~/game/enemylogic";
import Overworld from "~/scenes/Overworld";
import Player, { TalkBubble } from "~/characters/Player";
import { Direction } from "~/game/gamelogic";
import { EnemyData } from "~/enemies/Unit";



export default class Bird extends Phaser.Physics.Arcade.Sprite {
    speed = Phaser.Math.Between(50, 100);
    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame?: string | number
    ) {
        super(scene, x, y, texture, frame);
    }
    Move() {

    }

    preload() {

    }

    create() {

    }

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt);
      
    }
}
export interface startkeyFrame {
    start: 19 | 22 | 13
}
export interface endkeyFrame {
    end: 21 | 24 | 15
}

export interface BirdAnim {
    animkey: string;
    start: startkeyFrame;
    end: endkeyFrame;
}

export interface Anims {
    flyright: BirdAnim
    flyleft: BirdAnim
    flyup: BirdAnim
    flydown: BirdAnim
}
export const startkeys = {
    left: 16,
    right: 19,
    up: 22,
    down: 13,
}

export const BirdAnims = {

    white: {
        color: 'white',
        flyleft: {
            animkey: "flyleft",
            start: startkeys.left,
            end: startkeys.left + 2,
        },
        flyright: {
            animkey: "flyright",
            start: startkeys.right,
            end: startkeys.right + 2,
        },
        flyup: {
            animkey: "flyup",
            start: startkeys.up,
            end: startkeys.up + 2,
        },
        flydown: {
            animkey: "flydown",
            start: startkeys.down,
            end: startkeys.down + 2,
        },

    },

    blue: {
        color: 'blue',
        flyleft: {
            animkey: "flyleft",
            start: startkeys.left,
            end: startkeys.left + 2,
        },
        flyright: {
            animkey: "flyright",
            start: startkeys.right,
            end: startkeys.right + 2,
        },
        flyup: {
            animkey: "flyup",
            start: startkeys.up,
            end: startkeys.up + 2,
        },
        flydown: {
            animkey: "flydown",
            start: startkeys.down,
            end: startkeys.down + 2,
        },

    },

    red: {
        color: 'red',
        flyleft: {
            animkey: "flyleft",
            start: startkeys.left,
            end: startkeys.left + 2,
        },
        flyright: {
            animkey: "flyright",
            start: startkeys.right,
            end: startkeys.right + 2,
        },
        flyup: {
            animkey: "flyup",
            start: startkeys.up,
            end: startkeys.up + 2,
        },
        flydown: {
            animkey: "flydown",
            start: startkeys.down,
            end: startkeys.down + 2,
        },

    },
    brown: {
        color: 'brown',
        flyleft: {
            animkey: "flyleft",
            start: startkeys.left,
            end: startkeys.left + 2,
        },
        flyright: {
            animkey: "flyright",
            start: startkeys.right,
            end: startkeys.right + 2,
        },
        flyup: {
            animkey: "flyup",
            start: startkeys.up,
            end: startkeys.up + 2,
        },
        flydown: {
            animkey: "flydown",
            start: startkeys.down,
            end: startkeys.down + 2,
        },

    }
}