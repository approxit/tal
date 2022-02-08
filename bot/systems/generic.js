module.exports = {
	name: 'Generyczny',
	diceExplosion: false,
	showD20Criticals: false,
	handleDiceThrow(throws, diceType) {
		var throws = throws || 1;
		var sum = 0;
		var rollResult, firstRoll, roll;
		var rolls = [];
		var rollsCritical = null;

		for (var i = 0; i < throws; ++i) {
			var throwRolls = [];
			rollResult = firstRoll = makeDieRoll(diceType);
			throwRolls.push({
				value: firstRoll,
				critical: null
			});
			++rollCount;

			sum += rollResult;
			rolls = rolls.concat(throwRolls);
		}

		rollSets.push({
			range: range(),
			rolls: rolls,
			critical: rollsCritical,
			sum: sum,
		});

		return sum;
	},
};