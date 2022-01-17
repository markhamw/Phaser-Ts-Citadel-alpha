import Player from "~/characters/Player";
import { Speech } from "./game";


export function showPlayerTalkBubble(scene: any) {
    scene.player.tb.frame.setAlpha(1);
    scene.player.tb.headPngforTalkBubble.setAlpha(1);
    scene.player.tb.line1.setAlpha(1);
    scene.player.tb.line2.setAlpha(1);
    scene.player.tb.line3.setAlpha(1);
}


export function showPlayerTalkBubbleWithConditionalEnter(scene: any, shouldEnableEnterButton: boolean) {
    showPlayerTalkBubble(scene);
    scene.player.tb.enterBtn?.setAlpha(shouldEnableEnterButton);
    scene.player.tb.enterBtn?.setInteractive(shouldEnableEnterButton);
}

export function showPlayerTalkBubbleWithConditionalFight(scene: any, shouldEnableFightButton: boolean) {
    showPlayerTalkBubble(scene);
    scene.player.tb.fightBtn?.setAlpha(shouldEnableFightButton);
    scene.player.tb.fightBtn?.setInteractive(shouldEnableFightButton);
}


export function hidePlayerTalkBubble(scene: any) {
    scene.isSpeaking = false;
    scene.player.tb.frame.setAlpha(0);
    scene.player.tb.headPngforTalkBubble.setAlpha(0);
    scene.player.tb.line1.setAlpha(0);
    scene.player.tb.line2.setAlpha(0);
    scene.player.tb.line3.setAlpha(0);
    scene.player.tb.enterBtn?.setAlpha(0);
    scene.player.tb.enterBtn?.setInteractive(false);

    scene.player.tb.fightBtn?.setAlpha(0);
    scene.player.tb.fightBtn?.setInteractive(false);
}


export function eventForButton(childNode: Phaser.GameObjects.GameObject) {
    console.log("eventForButton");
    console.log(childNode.name)
}
