

export type WRGame ={
    isStarted: boolean;
    playerName: string;
    playerHP: number;
    playerCurrentScene?: WRScene;
    playerExperience:number;
    sceneFade:number;
    kingRat: string;
    taskRate: number;
}

export type WRScene = 'Title'|'OverWorld'|'Battle'|'Explore'



