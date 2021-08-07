import Phaser from "phaser";
import { enemies } from "~/enemies/enemies";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        this.load.image("tiles", "tileset/dungeon-tileset-ii.png");
        this.load.tilemapTiledJSON("citadel", "tiles/citadel.json");
        this.load.atlas("player", "character/player.png", "character/player.json");
        this.load.image("emptyheart","character/ui_heart_empty.png")
        this.load.image("fullheart","character/ui_heart_full.png")
        this.load.bitmapFont('customfont','fonts/Guevara_0.png','fonts/Guevara.xml')
        enemies.forEach(enemy => {
            this.load.atlas(enemy.name,enemy.PathToPNG, enemy.PathToJSON)
        })
        
    }

    create() {
        this.scene.start("citadel");
    }
}
