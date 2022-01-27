import Building from "~/structures/Building";
import { Speech } from "./game";

export const ExploreTextLines: Speech[] = [
    { lines: "" },
    { lines: "Looks like the wastes have yet again provided us company for the night. Eff these Groklins.!" },
    { lines: "Gods help me find the courage to get out of this one alive." },
    { lines: "Gods willing..I need to get to the Tavern. Groklin armies and elementals from across the wastes are moving in. Ill head for the tavern" },
    { lines: "I'm a Ranger. Blah Blah. Its my duty to stop them...and protect the wildlife blah blah" },
    { lines: "I'm the Ranger damnit. These shit-for-brain Groklins are going to pay! Its my duty to protect the deer." }
]

export const LineNegativeIdents = [
    "Its too far off",
    "I can't see that from here",
    "I can't see that from this distance",
    "My eyes are not that good at this distance",
    "I dont know what the hell it is",
    "Not sure .. what IS that?",
    "Its too far off to tell what it is",
    "Is that a mirage?",
]


export const LineNegativeActions = [
    "I can get closer to get eyes on it",
    "Ill need to get closer to tell what it is",
    "Ill need to move in get a better view",
    "but once I get closer - well see",
    "but I could head that way to get a better look",
]

export function GetRandomPositiveBuildingIdentLine(sprite: Phaser.GameObjects.Sprite): string {
    let LinePositiveIdents = [
        `Its the ${sprite.name}`,
        `Looks like a ${sprite.name}`,
        `I think its a ${sprite.name}`,
    ]
    let randomIndex = Phaser.Math.Between(0, LinePositiveIdents.length - 1);
    return LinePositiveIdents[randomIndex];
}

export function GetRandomPositiveEnemyIdentLine(sprite: Phaser.GameObjects.Sprite): string {
    let LinePositiveIdents = [
        `Its a ${sprite.name}, guilty of loitering`,
        `Looks like a ${sprite.name} - just standing around`,
        `I believe its a ${sprite.name} standing before me`,
    ]
    let randomIndex = Phaser.Math.Between(0, LinePositiveIdents.length - 1);
    return LinePositiveIdents[randomIndex];
}


export function GetRandomNegativeIdentLine(): string {
    let randomIndex = Phaser.Math.Between(0, LineNegativeIdents.length - 1);
    return LineNegativeIdents[randomIndex];
}

export function GetRandomNegativeIdentAction(): string {
    let randomIndex = Phaser.Math.Between(0, LineNegativeActions.length - 1);
    return LineNegativeActions[randomIndex];
}

export function GetRandomExploreText(): Speech {
    let randomIndex = Phaser.Math.Between(0, ExploreTextLines.length - 1);
    return ExploreTextLines[randomIndex];
}
