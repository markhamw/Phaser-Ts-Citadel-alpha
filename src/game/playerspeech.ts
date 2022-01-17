import Building from "~/structures/Building";
import { Speech } from "./game";


export const playerIntroSpeech = { line1: "Today is a good", line2: "day to go hunting", line3: "on my island" }

export const ExploreTextLines: Speech[] = [
    { line1: "Today is day I fulfill my contract as Ranger", line2: "Ill silence all Ratbeasts and other beasties.", line3: "Let the killin begin. I dont have all cycle." },
    { line1: "Ah, the great outdoors..only..with Ratmen", line2: "afoot...", line3: "" },
    { line1: "Gods willing..it is time to silence the", line2: "invading Ratmen", line3: "" }
]

/* export const SelfPonderLines: Speech[] = [
    { line1: "I call this island my home. I think I can", line2: "", line3: "" }
] */

export const LineNegativeIdents = [
    "Its too far to call without a map or wand",
    "I can't see that from here",
    "I can't see that from this distance",
    "That's too far away to identify",
    "My eyes are not that good at this distance",
    "Cant see what the hell that is!",
    "Not sure .. what that is",
    "Its too far off to tell what it is",
    "Is that a mirage?",
    "Self, remind me to go to the ocular medicus"
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
        `I think its the ${sprite.name}`,
    ]
    let randomIndex = Phaser.Math.Between(0, LinePositiveIdents.length - 1);
    return LinePositiveIdents[randomIndex];
}

export function GetRandomPositiveEnemyIdentLine(sprite: Phaser.GameObjects.Sprite): string {
    let LinePositiveIdents = [
        `Its ${sprite.name} the ${sprite.constructor.name}, guilty of loitering `,
        `Looks like ${sprite.name} the ${sprite.constructor.name} - just standing around`,
        `I believe its ${sprite.name} the ${sprite.constructor.name} standing before me`,
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
