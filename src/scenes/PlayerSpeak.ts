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



export default class PlayerSpeak extends Phaser.Scene {

    debug!: boolean;
    text?: Phaser.GameObjects.Text;

    constructor() {
        super("PlayerSpeak");
        //  this.text = this.add.text(100, 100, "", { fontSize: '32px', fontFamily: 'breathfire', color: '#ffffff' }).setAlpha(0);
    }

    init(data) {

    }


    preload() {

    }

    buildPrimarySceneContents = () => {
        var map = this.make.tilemap({ key: "playerspeakjson" });
        var playerspeakMap = map.addTilesetImage("UI-elements-32x32-original", "ui-elements");
        var playerspeakMapElements = map.addTilesetImage("ui-elements-2", "ui-elements-2");

        let allTileSets = [
            playerspeakMap,
            playerspeakMapElements
        ];


        this.lights.enable();
        this.lights.setAmbientColor(0xFFFFFF);

        let light = this.lights.addLight(0, 0, 1000, 0xFFFFFF, 300);
        // let light2 = this.lights.addLight(500, 0, 100)

        map.createLayer('Base', allTileSets).setPipeline("Light2D");
        map.createLayer('Detail', allTileSets).setPipeline("Light2D");

        this.add.text(10, 0, "Player", { fontSize: "32px", fontFamily: "breathfire", color: "#000000" }).setShadow(2, 2, "#888888", 2, true, true);
        this.text = this.add.text(10, 40, "Playeraaaaaaaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaa aaaaaaaaaa a   aaaaaaaaaaaaaaaaaaaa aaaaaaaaaaaaaaaaaaaaaaaaaaa", { fontSize: "12px", fontFamily: "breathfire", color: "#000000" }).setShadow(2, 2, "#888888", 2, true, true).setAlpha(0);

        /*     const linesZone = this.scene.add.zone(this.x + 20, frameYOffset, this.x + 240, frameYOffset + 100)
    
            Phaser.Display.Align.In.Center(tet, frameZone);
            Phaser.Display.Align.In.Center(tet, headPngZone);
            Phaser.Display.Align.In.Center(tet, linesZone);
     */

    }

    create() {
        this.buildPrimarySceneContents();

        this.tweens.add({
            targets: this.text,
            alpha: { from: 0, to: 1 },
            duration: 2000,
            ease: 'Power1',
            yoyo: true,
            repeat: -1
        });

    }


}
