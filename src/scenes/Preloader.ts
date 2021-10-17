import Phaser, { Physics } from "phaser";
import { enemies } from "~/enemies/enemies";
import {WRGame} from "../game/game"
import {getNewKingRatName} from "../game/gamelogic"

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        
        this.load.image("tiles3","tileset/Grass.png")
        this.load.tilemapTiledJSON("hasgb","tiles/HASGB.json");
        this.load.atlas('lights',"assets/lights.png","assets/lights.json")
        this.load.atlas('buildings32',"assets/buildings32.png","assets/buildings32.json")
        this.load.atlas('clouds',"assets/clouds.png","assets/clouds.json")
        this.load.atlas('cloudsshadows',"assets/cloudshadows.png","assets/cloudsshadows.json")
        
        this.load.atlas('buildings16',"assets/buildings16.png","assets/buildings16.json")
        this.load.atlas('treasures',"assets/treasures.png","assets/treasures.json")

        this.load.image("emptyheart","character/ui_heart_empty.png")
        this.load.image("fullheart","character/ui_heart_full.png")
         
        //ui
        this.load.image("scroll","assets/scroll.png")
        this.load.image("tavern","assets/Tavern.png")
        this.load.image("window","assets/Windows/window.png")


        this.load.image("willysratfights","assets/WillysRatfights.png")

        this.load.bitmapFont('customfont','fonts/Guevara_0.png','fonts/Guevara.xml')
        
        this.load.bitmapFont('invertedfont','fonts/font-inverted.png','fonts/Guevara.xml')

        this.load.bitmapFont('invertedfontyellow','fonts/font-inverted-yellow.png','fonts/Guevara.xml')

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
       
        this.load.audio('rainyfeelsbyDonnieOzone',["assets/music.mp3"])
        
        this.load.audio('idunnobygrapesofwrath',["assets/titlemusicidunno.mp3"])

    
    }

    create() {
        let wrGame: WRGame = {
            isStarted: true,
            playerName: "Player",
            playerHP: 100,
            playerExperience:0,
            sceneFade:2000,
            kingRat:getNewKingRatName(),
            taskRate: Math.floor(Math.random() * 250) + 175
        }

        //this.scene.start("Overworld", wrGame);
        this.scene.start("Splash", wrGame);
      //  this.scene.start("citadel");
        
    }
}
