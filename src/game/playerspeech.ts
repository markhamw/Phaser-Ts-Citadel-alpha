import Building from "~/structures/Building";
import { Speech } from "./game";

export const ExploreTextLines: Speech[] = [
    { lines: "I work my contract as Ranger. Ill silence all Ratbeasts and other beasties. Let the killin begin. I dont have all cycle." },
    { lines: "Today is a good day to go hunting on my island. For Ratticus!" },
    { lines: "Ah, the great outdoors..only..with Ratmen afoot. Im sure every Ranger from here to....there will be defending Ratticus." },
    { lines: "Gods willing..it is time to silence the invading armies. Rat armies and elementals from across the wastes are moving in." },
    { lines: "I'm a Ranger and I call this island my home! Rat Men and Rat armies from the wastes have invaded. Its my duty to stop them." },
    { lines: "I'm the Ranger damnit. These Ratmen invade our home! Rat armies from the wastes have invaded. Its my duty to stop them." }
]

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
