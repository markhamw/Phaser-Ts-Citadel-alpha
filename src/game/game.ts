import Player from "~/characters/Player";
import Overworld from "~/scenes/Overworld";
import OverworldTitle from "~/scenes/OverworldTitle";
import { WRGameScene } from "./overworldlogic";

export const TimesOfDay = [0x555555, 0x666666, 0x777777, 0x888888, 0x999999, 0xaaaaaa, 0xbbbbbb, 0xcccccc, 0xdddddd];

export type WRGame = {
  isStarted: boolean;
  playerName: string;
  playerHead: string;
  hasIntroStarted: boolean;

};

export enum Condition {
  Dead,
  Eviscerated,
  Hurt,
  Scuffed,
  Dusty,
  Healthy,
}

export type CombatCapability = {
  offensiveMultiplier: number;
  defense: number;
}

export type PlayerStatus = {
  MaxHP: number;
  CurrentHP: number;
  Condition: Condition;
  XP: number;
  Level: number;
  Gold: number;
};

export type Speech = {
  lines: string;
};

export function AddCollidersForPlayer(scene: Overworld, player: Player) {

  //scene.collider.collider(player, scene.baseLayer);
}