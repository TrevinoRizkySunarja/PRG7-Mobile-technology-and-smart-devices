// Puzzel 1: Ternary Operators
// Schrijf de function getRank die een speler een rank geeft op basis van zijn score.
// 1000 punten of meer: "Legendary". Minder dan 1000 punten: "Beginner".

function getRank(score) {
    return score >= 1500 ? "Legendary" : "Beginner";
}

console.log("\n-- Puzzel 1 --");
console.log(getRank(1500)); // "Legendary"
console.log(getRank(500)); // "Beginner"



// Puzzel 2: Nullish Coalescing Operator
// Schrijf de function getPlayerName die de name van de player moet retourneren.
// Als name niet bestaat, moet "Unknown Player" geretourneerd worden.

function getPlayerName(playerName) {
    return playerName.name ?? "Unknown Player"
}

console.log("\n-- Puzzel 2 --");
console.log(getPlayerName( {name:"ShadowNinja"})); // "ShadowNinja"
console.log(getPlayerName( {rank:"Legendary"})); // "Unknown Player"




// Puzzel 3: Optional Chaining
// Schrijf de function getWeaponDamage die van een character het damage-veld uit weapon retourneert.
// Voorkom dat er foutmeldingen ontstaan wanneer player niet de juiste velden bevat.

function getWeaponDamage (Damage) {
    return Damage.weapon?.damage;
}


console.log("\n-- Puzzel 3 --");
console.log(getWeaponDamage({name: "Archer", weapon: {damage: 50}})); // 50
console.log(getWeaponDamage({name: "Mage"})); // undefined






// Puzzel 4: Spread Operator
// Schrijf de function updateCharacter die een character bijwerkt met nieuwe eigenschappen.
// De eerste parameter is de character en de tweede zijn de nieuwe eigenschappen

function updateCharacter(character, updates) {
    return {...character,...updates}
}

console.log("\n-- Puzzel 4 --");
console.log(updateCharacter({name: "Warrior", hp: 100}, {hp: 150, attack: 20}));
// { name: "Warrior", hp: 150, attack: 20 }

console.log(updateCharacter({name: "Rogue", speed: 30}, {speed: 40, stealth: true}));
// { name: "Rogue", speed: 40, stealth: true }






// Puzzel 5: Rest Parameters
// Schrijf de function calculateTotalXP die alle XP-waarden optelt. Let op: de function verwacht maar 1 parameter.


function calculateTotalXP(...xps) {
    return xps;
}


console.log("\n-- Puzzel 5 --");
console.log(calculateTotalXP(100, 200, 300)); // 600
console.log(calculateTotalXP(50, 80, 30, 25, 135, 170, 5, 15)); // 510







// Puzzel 6: Destructuring Arrays
// Schrijf de function createGame die een array ontvangt met gegevens over de game.
// Deze array moet altijd de volgende volgorde hebben: de naam van de game, het max aantal players en het genre.
// Gebruik array destructuring om de waarden gameName, maxPlayers en genre op te halen en terug te geven in een object.


function createGame (games) {
    return games
}

console.log("\n-- Puzzel 6 --");
console.log(createGame(["Battle Royale", 100, "Shooter"])); // { gameName: "Battle Royale", maxPlayers: 100, genre: "Shooter" }
console.log(createGame(["Fantasy Quest", 4, "RPG"])); // { gameName: "Fantasy Quest", maxPlayers: 4, genre: "RPG" }

// Puzzel 7: Destructuring Objects
// Schrijf de function describeEnemy die een omschrijving van de enemy geeft op basis van het object dat wordt meegegeven.
// Het object moet de volgende velden hebben: name, hp en specialAbility

// Schrijf hier de code...

// console.log("\n-- Puzzel 7 --");
// console.log(describeEnemy({name: "Goblin", hp: 50, specialAbility: "turn invisible"}));
// // "The enemy Goblin has 50 health points and can turn invisible."
//
// console.log(describeEnemy({name: "Dragon", hp: 500, specialAbility: "breathe fire"}));
// // "The enemy Dragon has 500 health points and can breathe fire."


// Puzzel 8: Array Iteration
// Schrijf de function doubleDamage die een array verwacht met damages van attacks en vervolgens
// een array retourneert waar alle aanvalsschade is verdubbeld.

function doubleDamage (damages) {
    return damages.map(damage=>damage*2)
}

console.log("\n-- Puzzel 8 --");
console.log(doubleDamage([10, 20, 30])); // [20, 40, 60]
console.log(doubleDamage([5, 15, 25])); // [10, 30, 50]


// Puzzel 9: Object Iteration
// Schrijf de function inventoryList die een object omzet naar een array van [item, quantity] paren.

// Schrijf hier de code...

// console.log("\n-- Puzzel 9 --");
// console.log(inventoryList({ sword: 1, potion: 5, shield: 2 }));
// // [["sword", 1], ["potion", 5], ["shield", 2]]
//
// console.log(inventoryList({ arrow: 50, bow: 1, food: 10 }));
// // [["arrow", 50], ["bow", 1], ["food", 10]]

// Puzzel 10: Try/catch Await/Async Fetch
// Schrijf de functie getSmileys die een lijst met alle smiley-namen ophaalt van: https://raw.githubusercontent.com/cheatsnake/emojihub/refs/heads/master/emojistore/data/emojibase.json

// console.log(getSmileys());
// ['grinning face', 'grinning face with smiling eyes', 'face with tears of joy', ... ]
