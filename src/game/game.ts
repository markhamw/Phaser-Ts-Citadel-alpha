export const TimesOfDay = [0x555555, 0x666666, 0x777777, 0x888888, 0x999999, 0xaaaaaa, 0xbbbbbb, 0xcccccc, 0xdddddd];

export type WRGame = {
  isStarted: boolean;
  playerName: string;
  playerHead: string;
  playerHP: number;
  playerGold: number;
  playerCurrentScene?: WRScene;
  playerExperience: number;
  sceneFade: number;
  kingRat: string;
  taskRate: number;
  hasIntroStarted: boolean;
};
export enum Condition {
  Healthy,
  Dusty,
  Tired,
  Wounded,
  Eviscerated,
  Dead,
}

export type PlayerStatus = {
  MaxHP: number;
  CurrentHP: number;
  Condition: Condition | null | undefined;
};

export type Speech = {
  line1: string;
  line2: string;
  line3: string;

};
export type WRScene = "Title" | "OverWorld" | "Battle" | "Explore";
