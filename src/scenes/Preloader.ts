import Phaser from "phaser";
import { enemies } from "~/enemies/enemies";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        this.load.image("tiles", "tileset/dungeon-tileset-ii.png");
        this.load.tilemapTiledJSON("citadel", "tiles/citadel.json");
        
        this.load.image("tiles2", "tileset/citadel2.png")
        this.load.image("citadel2decorative","tiles/citadel2decorative.png")
        this.load.tilemapTiledJSON("citadel2","tiles/citadel2.json");

        this.load.atlas("player", "character/player.png", "character/player.json");
        this.load.atlas("player2", "character/knight.png", "character/knight.json");

        this.load.atlas('lights',"assets/lights.png","assets/lights.json")

        this.load.image("emptyheart","character/ui_heart_empty.png")
        this.load.image("fullheart","character/ui_heart_full.png")
        
        this.load.bitmapFont('customfont','fonts/Guevara_0.png','fonts/Guevara.xml')
        enemies.forEach(enemy => {
            this.load.atlas(enemy.name,enemy.PathToPNG, enemy.PathToJSON)
        }) 

        this.load.audio('ratsound',["assets/ratscream.mp3"])
        this.load.audio('knifeswipe',["assets/knifeSwipe2.mp3"])
        this.load.audio('noteShuffle',["assets/bookFlip2.ogg"])
        
        this.load.audio('step1',["assets/footstep01.mp3"])
        this.load.audio('step2',["assets/footstep02.mp3"])
        this.load.audio('step3',["assets/footstep03.mp3"])
        this.load.audio('step4',["assets/footstep04.mp3"])
        
        
        this.load.audio('doorOpen',["assets/doorOpen_2.ogg"])
        this.load.audio('doorClose',["assets/doorClose_4.ogg"])
        

    
    }

    create() {
        this.scene.start("Titlescene");
      //  this.scene.start("citadel");
        
    }
}
