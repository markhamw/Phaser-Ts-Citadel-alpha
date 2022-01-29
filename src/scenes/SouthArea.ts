import { Animations, BlendModes, Physics } from "phaser";
import { WRGame } from "~/game/game";
import { AddWASDKeysToScene } from "~/game/gamelogic";
import {
    WindDirection,
    CreateAllLayersAndSetCollisions,
    GetAnimsForOverworld,
    createStructuresAndWeather,
    createBorder,
    Layers,
    SouthAreaLayers,
} from "../game/overworldlogic";
import "../characters/Player";
import Player from "../characters/Player";
import { displayTitleTextAndEnableInputs, startIntro } from "~/game/overworldtitlelogic";
import Bird from "~/world/Bird";



export default class SouthArea extends Phaser.Scene {

    keys!: Phaser.Types.Input.Keyboard.CursorKeys;
    wasd!: Phaser.Input.Keyboard.Key[];

    player!: Player;
    wrGame!: WRGame;
    debug!: boolean;

  
    constructor() {
        super("SouthArea")
        
    }

    init(data) {
        this.wrGame = data;
    }


    preload() {

        
        /*      this.time.addEvent({
                 delay: 5000,
                 callback: () => {
                     
                     this.scene.resume("Overworld")
                 }
             }); */

        // this.sound.play("ruinedworld", { volume: 0.03, loop: true });
    }

    buildPrimarySceneContents = () => {
        var map = this.make.tilemap({ key: "southareajson" });
        var terrain2 = map.addTilesetImage("terrain", "southareaterrain");

        let allTileSets = [
            terrain2,
        ];
        this.lights.enable();
        this.lights.setAmbientColor(0x999999);
        let light = this.lights.addLight(0, 0, 100, 0xFF0000, 3);
        let light2 = this.lights.addLight(500, 0, 100)

        map.createLayer('Base', terrain2).setPipeline("Light2D");
        // .setPipeline("Light2D");
        this.add.text(10, 10, "South Area", { fontSize: "32px", fontFamily: "breathfire", color: "#ffffff" });

    }

    create() {
        this.buildPrimarySceneContents();

    }


}
