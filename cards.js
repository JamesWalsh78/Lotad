///CARD DATA
const cards = [
//Character Cards
	{
		name: "Scruffle",
		colour: "Black",
		value: 1,
		dfcount: 11,
		action: function (tower) {
            const topCard = getTopCard(tower);
            if (topCard && topCard.colour === "Brown") {
                conflict(tower, this.name);
            } else {
                placeCardOnTower(tower, this.colour, this.name.toLowerCase());
            }
		}
	},
	{
		name: "Scrufford",
		colour: "Black",
		value: 2,
		dfcount: 1,
		action: function (tower) {
            const topCard = getTopCard(tower);
            if (topCard && topCard.colour === "Brown") {
                conflict(tower, this.name);
            } else {
                placeCardOnTower(tower, this.colour, this.name.toLowerCase());
            }
		}
	},
	{
		name: "Foravore",
		colour: "Brown",
		value: 1,
		dfcount: 11,
		action: function (tower) {
            const topCard = getTopCard(tower);
            if (topCard && topCard.colour === "Black") {
                conflict(tower, this.name);
            } else {
                placeCardOnTower(tower, this.colour, this.name.toLowerCase());
            }
        }
	},
	{
		name: "Chowrex",
		colour: "Brown",
		value: 2,
		dfcount: 1,
		action: function (tower) {
            const topCard = getTopCard(tower);
            if (topCard && topCard.colour === "Black") {
                conflict(tower, this.name);
            } else {
                placeCardOnTower(tower, this.colour, this.name.toLowerCase());
            }
        }
	},
	{
		name: "Toadl",
		colour: "Blue",
		value: 0,
		dfcount: 3,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Sombribbit",
		colour: "Blue",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Glintine",
		colour: "Blue",
		value: 1,
		dfcount: 1,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Gruffnut",
		colour: "Green",
		value: 0,
		dfcount: 3,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Crackorn",
		colour: "Green",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Dullfin",
		colour: "White",
		value: 1,
		dfcount: 3,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Shinyfin",
		colour: "White",
		value: 2,
		dfcount: 1,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Minimite",
		colour: "Yellow",
		value: 0,
		dfcount: 3,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Magmax",
		colour: "Yellow",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Zaporb",
		colour: "Red",
		value: 0,
		dfcount: 2,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Detenorb",
		colour: "Red",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Revive",
		colour: "Item",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardInHand(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Delivery",
		colour: "Item",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardInHand(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Repellent",
		colour: "Item",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardInHand(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Inspect",
		colour: "Item",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardInHand(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Rebuild",
		colour: "Item",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardInHand(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Return",
		colour: "Item",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardInHand(target, this.colour, this.name.toLowerCase());
		}
	},
	{
		name: "Switch",
		colour: "Item",
		value: 0,
		dfcount: 1,
		action: function (target) {
			placeCardInHand(target, this.colour, this.name.toLowerCase());
		}
	}
];




/*
ARCHIVED Poocheyena action
		action: function (target) {
			placeCardOnTower(target, this.colour, this.name.toLowerCase());
			const playerId = target.id.includes("1") 
								? "player1" 
								: "player2";
            const towerId = target.id.includes("left") 
								? "left" 
								: "right";
            towerTotals[playerId][towerId].black += 1;
            console.log(`Updated Tally for ${playerId} ${towerId}:`, towerTotals[playerId][towerId]);
		}
*/