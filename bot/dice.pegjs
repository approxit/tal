{
	var rollSets = [];
	var rollCount = 0;
}

Root = value:Expression {
	return {
		sum: Math.round(value),
		rollSets: rollSets,
		rollCount: rollCount,
	}
}

Expression = AddSub

AddSub = head:MulDiv _ tail:(@("+" / "-") _ @MulDiv)* {
	return tail.reduce(function(result, element) {
		if (element[0] === "+") return result + element[1];
		if (element[0] === "-") return result - element[1];
	}, head);
}

MulDiv = head:Atom _ tail:(@("*" / "/") _ @Atom)* {
	return tail.reduce(function(result, element) {
		if (element[0] === "*") return result * element[1];
		if (element[0] === "/") return result / element[1];
	}, head);
}

Atom = Dice / Integer / "(" _ @Expression _ ")"

Dice = throws:Integer? DiceChar diceType:diceTypes {
	var throws = throws || 1;
	var sum = 0;
	var roll;
	var rolls = [];

	for (var i = 0; i < throws; ++i) {
		roll = Math.floor((diceType * Math.random()) + 1)
		rolls.push(roll);
		++rollCount;
		sum += roll;
	}

	rollSets.push({
		'range': range(),
		'rolls': rolls,
	});

	return sum;
}

DiceChar = "k" / "d"

diceTypes = "100" / "20" / "12" / "10" / "8" / "6" / "4" / "2" {
	return parseInt(text());
}

Integer = "-"? [0-9]+ {
	return parseInt(text());
}

_ "whitespace" = [ \t\n\r]*