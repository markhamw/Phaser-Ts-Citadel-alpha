import Phaser from "phaser";
import { enemies } from "~/enemies/enemies";

export default class Preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    preload() {
        this.load.image("tiles", "tileset/citadel-tileset.png");
        this.load.tilemapTiledJSON("citadel", "tiles/citadel.json");
        this.load.atlas("player", "character/player.png", "character/player.json");
        this.load.bitmapFont('customfont','fonts/Guevara_0.png','fonts/Guevara.xml')
        enemies.forEach(enemy => {
            this.load.atlas(enemy.name,enemy.PathToPNG, enemy.PathToJSON)
        })
        
    }

    create() {
        this.scene.start("citadel");
    }
}
