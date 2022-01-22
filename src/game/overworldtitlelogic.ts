export const startIntro = (scene: any) => {
    scene.time.addEvent({
        delay: 100,
        repeat: 10,
        callback: () => {
            scene.titletext0.setAlpha((scene.titletext0.alpha -= 0.1));
            scene.titletext1.setAlpha((scene.titletext1.alpha -= 0.1));
            scene.titletext2.setAlpha((scene.titletext2.alpha -= 0.1));
            scene.titletext4.setAlpha((scene.titletext4.alpha -= 0.1));
            scene.titletext5.setAlpha((scene.titletext4.alpha -= 0.1));
            scene.titletext6.setAlpha((scene.titletext4.alpha -= 0.1));
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
    scene: any,
    text: string,
    x: number,
    y: number,
    fontSize: number,
    fontFamily: string,
    color: string,
    depth: number
): Phaser.GameObjects.Text {
    let textObject = scene.add.text(x, y, text, {
        fontSize: `${fontSize}px`,
        fontFamily: fontFamily,
        color: color,
    });
    textObject.setAlpha(0);
    textObject.setDepth(depth);
    textObject.setOrigin(0.5, 0.5);
    textObject.setShadow(2, 2, "#87CEEB", 2, true, true);

    return textObject;
}

export function displayTitleText(scene: any) {
    let fontFamily = "breathfire";

    scene.titletext0 = scene.add
        .text(100, 100, "The Ranger Of", {
            fontSize: `32px`,
            fontFamily: fontFamily,
            color: "#ffffff",
        })
        .setAlpha(0)
        .setDepth(3)
        .setOrigin(0.5, 0.5)
        .setShadow(2, 2, "#87CEEB", 2, true, true).setPipeline("Light2D");

    scene.lights.addLight(200, 100, 280).setIntensity(0.5);

    scene.titletext1 = scene.add
        .text(100, 48, "Ratticus", {
            fontSize: `32px`,
            fontFamily: fontFamily,
            color: "#BE620C",
        })
        .setAlpha(0)
        .setDepth(3)
        .setOrigin(0.5, 0.5)
        .setShadow(2, 2, "#87CEEB", 2, true, true).setScale(2.25).setPipeline("Light2D");

    scene.titletext2 = scene.add.text(
        100,
        68,
        "Island", {
        fontSize: `32px`,
        fontFamily: fontFamily,
        color: "#000055",
    }).setShadow(2, 2, "#87CEEB", 2, true, true).setScale(2.25).setPipeline("Light2D");


    scene.titletext4 = addTitleTextToScene(
        scene,
        "Choose your avatar",
        250,
        230,
        20,
        fontFamily,
        "#FFFFFF",
        3
    ).setScale(1.25);


    scene.titletext5 = addTitleTextToScene(
        scene,
        "Press Space to start.",
        250,
        350,
        20,
        fontFamily,
        "#000000",
        3
    );
    scene.titletext6 = addTitleTextToScene(
        scene,
        "Press F2 for help in game.",
        250,
        370,
        20,
        fontFamily,
        "#000000",
        3
    );

    scene.titletext4.setInteractive();
    scene.titletext4
        .on("pointerover", () => {
            scene.titletext4.setText("Use A & D or arrows.");
        })
        .on("pointerout", () => {
            scene.titletext4.setText("Choose your avatar");
        });

    Phaser.Display.Align.In.Center(scene.titletext0, scene.add.zone(250, 100, 200, 200));
    Phaser.Display.Align.In.Center(scene.titletext1, scene.add.zone(250, 130, 200, 200));
    Phaser.Display.Align.In.Center(scene.titletext2, scene.add.zone(250, 175, 200, 200));
    Phaser.Display.Align.In.Center(scene.titletext4, scene.add.zone(250, 300, 200, 200));
    Phaser.Display.Align.In.Center(scene.titletext5, scene.add.zone(250, 450, 200, 200));
    Phaser.Display.Align.In.Center(scene.titletext6, scene.add.zone(250, 470, 200, 200));

    let fadeTextIn = scene.time.addEvent({
        delay: 50,
        repeat: 10,
        callback: () => {
            scene.titletext0.setAlpha((scene.titletext0.alpha += 0.1));
            scene.titletext1.setAlpha((scene.titletext1.alpha += 0.1));
            scene.titletext2.setAlpha((scene.titletext2.alpha += 0.1));
            scene.titletext4.setAlpha((scene.titletext4.alpha += 0.1));
            scene.titletext5.setAlpha((scene.titletext5.alpha += 0.1));
            scene.titletext6.setAlpha((scene.titletext5.alpha += 0.1));
        },
    });

    let startingTextAnim = scene.time.addEvent({
        delay: 50,
        repeat: 10,
        callback: () => {
            scene.titletext4.setScale((scene.titletext4.scaleX -= 0.025));
            scene.titletext4.setScale((scene.titletext4.scaleY -= 0.025));
        },
    });
}
