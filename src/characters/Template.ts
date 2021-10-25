import Phaser from "phaser";


declare global{
 namespace Phaser.GameObjects{
     interface GameObjectFactory{
         template(x: number, y: number, texture: string, frame?: string | number): Template
     }
 } 
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

export default class Template extends Phaser.Physics.Arcade.Sprite {
    light!: Phaser.GameObjects.Light;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string | number) {
        super(scene, x, y, texture, frame)
          
        this.light = scene.lights.addLight(x,y,50,0xFBBF77,1)
           
    /*       let updatelight = scene.time.addEvent({
           delay: 200,
           repeat: -1,
           callback: ()=>{
            this.light.setPosition(this.x,this.y)
           }
        
        });  */
       // this.scene.anims
        
        this.scene.events.addListener('sample-event',(player)=>{
            //actions on event occur
                
        })


    }
  
    preload(){}

    create(){}

    preUpdate(t: number, dt: number) {
        super.preUpdate(t, dt)
    }

    
}

Phaser.GameObjects.GameObjectFactory.register('template', function(this: Phaser.GameObjects.GameObjectFactory,x:number,y:number, texture:string, frame?: string | number ){

    var sprite = new Template(this.scene, x,y,texture,frame);

    this.displayList.add(sprite)
    this.updateList.add(sprite)
    this.scene.physics.world.enableBody(sprite, Phaser.Physics.Arcade.DYNAMIC_BODY);
    sprite.setPipeline("Light2D")
    return sprite
})