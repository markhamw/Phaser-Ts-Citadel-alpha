import Phaser, { FacebookInstantGamesLeaderboard } from "phaser";
import { Guid } from "guid-typescript"


export default class Building extends Phaser.Physics.Arcade.Sprite {

    private bldgname!: string;
    private EntityID: Guid;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
        this.EntityID = Guid.create()
        this.setInteractive();
        this.on('pointerdown', () => {
            console.log(`clicked ${this.name}`);
        });
    }


    preload() {

    }
    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)


    }
}