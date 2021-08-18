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

        this.load.image("emptyheart","character/ui_heart_empty.png")
        this.load.image("fullheart","character/ui_heart_full.png")
        
        this.load.bitmapFont('customfont','fonts/Guevara_0.png','fonts/Guevara.xml')
        enemies.forEach(enemy => {
            this.load.atlas(enemy.name,enemy.PathToPNG, enemy.PathToJSON)
        })
        this.load.audio('ratsound',["assets/ratscream.mp3"])
    }

    create() {
        this.scene.start("citadel");
        
    }
}
