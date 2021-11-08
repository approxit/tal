{
	var rollSets = [];
	var critical = null;
	var rollCount = 0;

	function makeDiceRoll(diceType) {
		if (options['mockedRolls']) {
			return options['mockedRolls'].shift();
		}
		return Math.floor((diceType * Math.random()) + 1);
	}
}

Root = _ value:Expression _ {
	return {
		sum: Math.round(value),
		rollSets: rollSets,
		rollCount: rollCount,
		critical: critical
	}
}

Expression = AddSub

AddSub = head:MulDiv tail:(_ @("+" / "-") _ @MulDiv)* {
	return tail.reduce(function(result, element) {
		if (element[0] === "+") return result + element[1];
		if (element[0] === "-") return result - element[1];
	}, head);
}

MulDiv = head:Atom tail:(_ @("*" / "/") _ @Atom)* {
	return tail.reduce(function(result, element) {
		if (element[0] === "*") return result * element[1];
		if (element[0] === "/") return result / element[1];
	}, head);
}

Atom = Dice / Integer / "(" _ @Expression _ ")"

Dice "dice" = throws:Integer? DiceChar diceType:diceTypes {
	var throws = throws || 1;
	var sum = 0;
	var rollResult, firstRoll, roll;
	var rolls = [];
	var rollsCritical = null;

	for (var i = 0; i < throws; ++i) {
		var throwRolls = [];
		rollResult = firstRoll = makeDiceRoll(diceType);
		throwRolls.push({
			value: firstRoll,
			critical: null
		});
		++rollCount;

		if ((diceType == 20) && ((firstRoll == 20) || (firstRoll == 1))) {
			throwRolls[0].critical = critical = rollsCritical = firstRoll == 20;

			if (options.diceExplosion) {
				do {
					roll = makeDiceRoll(diceType);
					throwRolls.push({
						value: roll,
						critical: null
					});
					++rollCount;
					rollResult += roll;
				}
				while (roll == 20);

				if (firstRoll == 1) {
					rollResult = firstRoll - rollResult;
				}
			}

			for (var j = 0; j < throwRolls.length - 1; ++j) {
				throwRolls[j].critical = firstRoll == 20;
			}
		}

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
}

DiceChar = "k" / "d"

diceTypes = "100" / "20" / "12" / "10" / "8" / "6" / "4" / "2" {
	return parseInt(text());
}

Integer "integer" = "-"? [0-9]+ {
	return parseInt(text());
}

_ "whitespace" = [ \t\n\r]*