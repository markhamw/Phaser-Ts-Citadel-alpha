import Phaser from 'phaser'


export default class Player extends Phaser.Physics.Arcade.Sprite{

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number){
        super(scene,x,y,texture, frame)
        
    }

    GetPlayerSprite = (x: number, y: number, id: string, frame: string) => {
        
    }


      
}