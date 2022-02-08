{
	var rollSets = [];
	var critical = null;
	var rollCount = 0;

	function makeDieRoll(dieValueRange) {
		if (options['mockedRolls']) {
			return options['mockedRolls'].shift();
		}
		return Math.floor((dieValueRange * Math.random()) + 1);
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

Dice = GenericDice / AlienDice

GenericDice "GenericDice" = throws:Integer? GenericDieChar dieValueRange:GenericDieValueRange {
	var throws = throws || 1;
	var sum = 0;
	var rollResult, firstRoll, roll;
	var rolls = [];
	var rollsCritical = null;

	for (var i = 0; i < throws; ++i) {
		var throwRolls = [];
		rollResult = firstRoll = makeDieRoll(dieValueRange);
		throwRolls.push({
			value: firstRoll,
			critical: null
		});
		++rollCount;

		if ((dieValueRange == 20) && ((firstRoll == 20) || (firstRoll == 1))) {
			throwRolls[0].critical = critical = rollsCritical = firstRoll == 20;

			if (options.diceExplosion) {
				do {
					roll = makeDieRoll(dieValueRange);
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

GenericDieChar = "k" / "d"

GenericDieValueRange = "100" / "20" / "12" / "10" / "8" / "6" / "4" / "2" {
	return parseInt(text());
}

AlienDice "AlienDice" = throws:Integer? dieChar:AlienDieChar {
	var throws = throws || 1;
	var sum = 0;
	var rollResult, roll;
	var rolls = [];
	var rollsCritical = null;

	for (var i = 0; i < throws; ++i) {
		rollResult = makeDieRoll(6);
		var c = null;
		if (dieChar == 'n' && rollResult == 6) {
			c = rollsCritical = false;
		}
		if (dieChar == 's' && rollResult == 1) {
			c = rollsCritical = false;
		}

		rolls.push({
			value: rollResult,
			critical: c,
		});
		++rollCount;

		sum += rollResult == 6;
	}

	rollSets.push({
		range: range(),
		rolls: rolls,
		critical: rollsCritical,
		sum: sum,
	});

	return sum;
}

AlienDieChar = "n" / "s"

Integer "integer" = "-"? [0-9]+ {
	return parseInt(text());
}

_ "whitespace" = [ \t\n\r]*