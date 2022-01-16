import Player from "~/characters/Player";
import { Speech } from "./game";

export function showPlayerTalkBubble(scene: any) {
    scene.player.tb.frame.setAlpha(1);
    scene.player.tb.headPngforTalkBubble.setAlpha(1);
    scene.player.tb.line1.setAlpha(1);
    scene.player.tb.line2.setAlpha(1);
    scene.player.tb.line3.setAlpha(1);
}

export function hidePlayerTalkBubble(scene: any) {
    scene.player.isSpeaking = false;
    scene.player.tb.frame.setAlpha(0);
    scene.player.tb.headPngforTalkBubble.setAlpha(0);
    scene.player.tb.line1.setAlpha(0);
    scene.player.tb.line2.setAlpha(0);
    scene.player.tb.line3.setAlpha(0);
}

export function updatePlayerTalkBubblePosition(scene: any, player: Player) {
    let playerX = scene.player.x;
    let playerY = scene.player.y;
    let FrameYOffset = playerY - 50;
    scene.player.tb.frame.setPosition(playerX, FrameYOffset);
    scene.player.tb.headPngforTalkBubble.setPosition(playerX, FrameYOffset);
    scene.player.tb.line1.setPosition(playerX + 30, FrameYOffset);
    scene.player.tb.line2.setPosition(playerX + 30, FrameYOffset + 8);
    scene.player.tb.line3.setPosition(playerX + 30, FrameYOffset + 17);
}

export function updatePlayerTalkBubbleText(scene: any, speech: Speech, player: Player) {

    player.tb.line1.setText(speech.line1);
    player.tb.line2.setText(speech.line2);
    player.tb.line3.setText(speech.line3);
}