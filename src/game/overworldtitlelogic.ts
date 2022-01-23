import OverworldTitle from "~/scenes/OverworldTitle";
import { AddWASDKeysToScene } from "./gamelogic";
import { AddHead, AddLeftArrow, AddRightArrow } from "./overworldlogic";

export const startIntro = (scene: any) => {


    scene.tweens.add({
        targets: [scene.titletext0, scene.titletext1, scene.titletext2, scene.titletext4, scene.titletext5, scene.titleAvatarSelect],
        alpha: { from: 1, to: 0 },
        duration: 2000,
        ease: 'Linear',
        repeat: 0,
        yoyo: false,

    })
    scene.time.addEvent({
        delay: 100,
        repeat: 10,
        callback: () => {
            //      scene.titletext0.setAlpha((scene.titletext0.alpha -= 0.1));
            //ddd   scene.titletext1.setAlpha((scene.titletext1.alpha -= 0.1));
            //  scene.titletext2.setAlpha((scene.titletext2.alpha -= 0.1));
            //  scene.titletext4.setAlpha((scene.titletext4.alpha -= 0.1));
            //  scene.titletext5.setAlpha((scene.titletext5.alpha -= 0.1));
            //   scene.titletext6.setAlpha((scene.titletext4.alpha -= 0.1));
            scene.leftArrow.setAlpha((scene.leftArrow.alpha -= 0.1));
            scene.rightArrow.setAlpha((scene.rightArrow.alpha -= 0.1));
            scene.head.setAlpha((scene.head.alpha -= 0.1));
        },
    });

    scene.time.addEvent({
        delay: 1100,
        repeat: 0,
        callback: () => {
            scene.titletext0.destroy();
            scene.titletext1.destroy();
            scene.titletext2.destroy();
            scene.titletext4.destroy();
            scene.titletext5.destroy();
            scene.titletext6.destroy();
            scene.leftArrow.destroy();
            scene.rightArrow.destroy();
            scene.head.destroy();
        },
    });

    scene.time.addEvent({
        delay: 1200,
        repeat: 0,
        callback: () => {
            scene.cameras.main.zoomTo(2, 3000, "Linear", true);
            scene.cameras.main.pan(320, 310, 3000);
        },
    });

    scene.time.addEvent({
        delay: 25,
        repeat: 50,
        callback: () => {
            scene.sound.volume = scene.sound.volume -= 0.02;
        },
    });
    scene.time.addEvent({
        delay: 1000,
        repeat: 0,
        callback: () => {
            scene.events.emit("fadeMobs");
        },
    });
    scene.time.addEvent({
        delay: 3000,
        repeat: 0,
        callback: () => {
            scene.events.emit("removeTitleMobs");
        },
    });
    scene.time.addEvent({
        delay: 4300,
        repeat: 0,
        callback: () => {
            scene.sound.stopAll();
            scene.sound.volume = 0.3;
            scene.sound.play("doorOpen", { volume: 0.2 });
        },
    });

    scene.time.addEvent({
        delay: 5900,
        repeat: 0,
        callback: () => {
            scene.sound.play("doorClose", { volume: 0.4 });
        },
    });

    scene.time.addEvent({
        delay: 6200,
        repeat: 0,
        callback: () => {
            scene.createOverworldPlayerStationary();
            scene.player.setDepth(2);
        },
    });

    scene.time.addEvent({
        delay: 6500,
        repeat: 0,
        callback: () => {
            scene.cameras.main.zoomTo(1, 3000, "Linear", true);
            scene.cameras.main.pan(
                scene.cameras.main.centerX,
                scene.cameras.main.centerY,
                3000
            );
        },
    });

    scene.time.addEvent({
        delay: 10000,
        repeat: 0,
        callback: () => {
            scene.events.emit("spawnChapter1");
        },
    });
};

function addTitleTextToScene(
    text: TitleText,
    scene: OverworldTitle
): Phaser.GameObjects.Text {
    let textObject = scene.add.text(0, 0, text.text, {
        fontSize: text.fontSize,
        fontFamily: text.fontFamily,
        color: text.color,
    });
    textObject.setAlpha(0);
    textObject.setDepth(3);
    textObject.setOrigin(0.5, 0.5);
    textObject.setShadow(4, 4, text.shadowColor, 2, true, true);
    Phaser.Display.Align.In.Center(textObject, scene.add.zone(250, text.yPos, 200, 200));
    return textObject;
}

export type TitleText = {
    text: string;
    fontSize: string;
    fontFamily: "breathfire";
    color: string;
    shadowColor: string;
    yPos: number;
}


export type TitleImage = {
    image: string;
}

export type TitleSprite = {
    spriteAtlas: string;
    fileName: string;
}

let titleText: TitleText[] = [
    {
        text: "The Ranger Of",
        fontSize: `32px`,
        fontFamily: "breathfire",
        color: "#CAD6E6",
        shadowColor: "#000000",
        yPos: 100
    },
    {
        text: "Ratticus",
        fontSize: `50px`,
        fontFamily: "breathfire",
        color: "#E69A02",
        shadowColor: "#000000",
        yPos: 130
    },
    {
        text: "Island",
        fontSize: `44px`,
        fontFamily: "breathfire",
        color: "#77F8FF",
        shadowColor: "#000000",
        yPos: 175
    },
    {
        text: "Choose your avatar",
        fontSize: `32px`,
        fontFamily: "breathfire",
        color: "#FFFFFF",
        shadowColor: "#000000",
        yPos: 298
    },
    {
        text: "Press Space to start.",
        fontSize: `16px`,
        fontFamily: "breathfire",
        color: "#FFFFFF",
        shadowColor: "#000000",
        yPos: 450
    },
    {
        text: "Press F2 for help in game.",
        fontSize: `16px`,
        fontFamily: "breathfire",
        color: "#FFFFFF",
        shadowColor: "#000000",
        yPos: 470
    }
];

let titleImages: TitleImage[] = [
    {
        image: "chooseavatarbg"
    }
]
let titleSprites: TitleSprite[] = [
    {
        spriteAtlas: "playerheads",
        fileName: "heads-1.png"
    }
]
export function AddTitleImageToScene(image: TitleImage, scene: OverworldTitle) {
    let imageObject = scene.add.image(0, 0, image.image);
    imageObject.setDepth(2);
    imageObject.setScale(1.35);
    imageObject.setOrigin(0.5, 0.5);
    imageObject.setAlpha(0);
    Phaser.Display.Align.In.Center(imageObject, scene.add.zone(250, 150, 200, 200), 0, 200);
    return imageObject;
}

export function AddTitleSpriteToScene(sprite: TitleSprite, scene: OverworldTitle) {
    let imageObject = scene.add.sprite(0, 0, sprite.spriteAtlas, sprite.fileName);
    imageObject.setDepth(3);
    imageObject.setOrigin(0.5, 0.5);
    imageObject.setAlpha(0);
    Phaser.Display.Align.In.Center(imageObject, scene.add.zone(250, 150, 200, 200), 0, 205);
    return imageObject;
}


export function displayTitleTextAndEnableInputs(scene: any) {

    scene.wasd = AddWASDKeysToScene(scene);
    scene.keys = scene.input.keyboard.createCursorKeys();
    scene.time.addEvent({});




    scene.leftArrow = scene.add.sprite(130, 260, "arrows", "arrow_scrolling_34.png").setScale(2.0)
    Phaser.Display.Align.In.Center(scene.leftArrow, scene.add.zone(200, 300, 200, 200), -2, 50);
    scene.leftArrow.setInteractive().setAlpha(0);
    scene.leftArrow.on("pointerdown", () => {
        scene.events.emit("changeHead", "left");
    });
    scene.leftArrow.setDepth(5);

    scene.rightArrow = scene.add.sprite(230, 260, "arrows", "arrow_scrolling_35.png").setScale(2.0)
    Phaser.Display.Align.In.Center(scene.rightArrow, scene.add.zone(200, 300, 200, 200), 100, 50)
    scene.rightArrow.setInteractive().setAlpha(0);
    scene.rightArrow.on("pointerdown", () => {
        scene.events.emit("changeHead", "right");
    });
    scene.rightArrow.setDepth(5).setAlpha(0);
    scene.titletext0 = addTitleTextToScene(titleText[0], scene);
    scene.titletext1 = addTitleTextToScene(titleText[1], scene);
    scene.titletext2 = addTitleTextToScene(titleText[2], scene);
    scene.titletext4 = addTitleTextToScene(titleText[3], scene);
    scene.titletext5 = addTitleTextToScene(titleText[4], scene);
    scene.titletext6 = addTitleTextToScene(titleText[5], scene);

    scene.titletext4.setInteractive();
    scene.titletext4
        .on("pointerover", () => {
            scene.titletext4.setText("Use A & D or arrows.");
        })
        .on("pointerout", () => {
            scene.titletext4.setText("Choose your avatar");
        });
    scene.head = AddTitleSpriteToScene(titleSprites[0], scene).setScale(5.4);
    scene.titleAvatarSelect = AddTitleImageToScene(titleImages[0], scene);

    scene.tweens.add({
        targets: scene.titletext0,
        alpha: { from: 0, to: 1 },
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 0,
    });
    scene.tweens.add({
        targets: scene.titletext1,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 1000,
    });
    scene.tweens.add({
        targets: scene.titletext2,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 2000,
    });
    scene.tweens.add({
        targets: scene.titletext4,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 3000,
    });
    scene.tweens.add({
        targets: scene.titletext5,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 3000,
    });
    scene.tweens.add({
        targets: scene.titletext6,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 3000,
    });
    scene.tweens.add({
        targets: scene.titleAvatarSelect,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 3000,
        onComplete: () => {
            scene.keys.space.on("up", () => {
                if (!scene.wrGame.hasIntroStarted) {
                    scene.wrGame.hasIntroStarted = true;
                    scene.events.emit("startintro");
                }
            });
        }
    });
    scene.tweens.add({
        targets: scene.head,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 3000,
    });
    scene.tweens.add({
        targets: scene.leftArrow,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 3000,
    });
    scene.tweens.add({
        targets: scene.rightArrow,
        alpha: 1,
        duration: 1000,
        ease: "Power1",
        yoyo: false,
        repeat: 0,
        delay: 3000,
    });


    let startingTextAnim = scene.time.addEvent({
        delay: 100,
        repeat: 10,
        callback: () => {
            scene.titletext4.setScale((scene.titletext4.scaleX -= 0.025));
            scene.titletext4.setScale((scene.titletext4.scaleY -= 0.025));
        },
    });


    let portraits: string[] = [];

    for (let i = 0; i < 19; i++) {
        portraits.push(`heads-${i}.png`);
    }



    scene.events.addListener("changeHead", (direction: string) => {
        let currentIndex = portraits.indexOf(scene.wrGame.playerHead);
        switch (direction) {
            case "left":
                if (portraits[currentIndex - 1]) {
                    scene.wrGame.playerHead = portraits[currentIndex - 1];
                    scene.head.setTexture("playerheads", scene.wrGame.playerHead);
                }
                break;
            case "right":
                if (portraits[currentIndex + 1]) {
                    scene.wrGame.playerHead = portraits[currentIndex + 1];
                    scene.head.setTexture("playerheads", scene.wrGame.playerHead);
                }
                break;
        }
    });

}
