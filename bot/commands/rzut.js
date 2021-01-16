const Discord = require('discord.js')
const dice = require('../dice');

const critical_mark = ':grey_exclamation:';

module.exports = {
    name: 'rzut',
    description: 'Rzuca kośćmi zgodnie z podaną formułą.',
    options: [
        {
            type: 3,
            name: 'formuła',
            description: 'Formuła matematyczna (+ - * / i nawiasy) wykorzystująca kostki: k2, k4, k6, k8, k10, k12, k20, k100.',
            required: true,
        },
        {
            type: 3,
            name: 'komentarz',
            description: 'Dodatkowy komentarz do rzutu.',
        }
    ],
    execute(member, options) {
        const diceFormula = options['formuła'];
        const diceResult = dice.parse(diceFormula);
        const diceAvatar = getDiceAvatar(member, options['_client'])
        const diceFormulaRaw = getDiceFormulaWithRawDiceRolls(diceFormula, diceResult);
        const diceFormulaSums = getDiceFormulaWithSumDiceRolls(diceFormula, diceResult);
        const diceFormulaResult = getDiceFormulaResult(diceResult, diceFormulaSums);

        console.log(`Roll for "${member.nick}" with "${diceFormula} = ${diceResult.sum}"`)

        var embed = new Discord.MessageEmbed();
        embed.setAuthor(`${member.nick} rzuca kością!`);
        embed.setThumbnail(diceAvatar);
        embed.setTitle(diceFormulaResult);

		if (diceResult.critical) {
			embed.setColor('RED');
		}

        if (options['komentarz']) {
            embed.addField('Komentarz', options['komentarz'], false);
        }

        if (1 < diceResult.rollCount && (diceResult.rollCount !== diceResult.rollSets.length)) {
            embed.addField('Kości', diceFormulaRaw, true);
        }

        embed.addField('Formuła', diceFormula, true);

        return {
            embeds: [embed.toJSON()],
        };
    },
};

function getDiceAvatar(member, client) {
    return new Discord.User(client, member.user).displayAvatarURL();
}

function getDiceFormulaWithRawDiceRolls(diceFormula, diceResult) {
    var result = diceFormula;

    for (var i = diceResult.rollSets.length - 1; 0 <= i; --i) {
        const rollSet = diceResult.rollSets[i];
		const rolls = rollSet.rolls.map(r => {
			return r.value + (r.critical ? critical_mark : '');
		});
        const diceRollsStr = '[' + rolls.join(', ') + ']'
        result = result.substr(0, rollSet.range[0]) + diceRollsStr + result.substr(rollSet.range[1], result.length)
    }

    return result;
}

function getDiceFormulaWithSumDiceRolls(diceFormula, diceResult) {
    var result = diceFormula;

    for (var i = diceResult.rollSets.length - 1; 0 <= i; --i) {
        const rollSet = diceResult.rollSets[i];
		const diceRollsStr = rollSet.sum + (rollSet.critical ? critical_mark : '');
        result = result.substr(0, rollSet.range[0]) + diceRollsStr + result.substr(rollSet.range[1], result.length)
    }

    return result;
}

function getDiceFormulaResult(diceResult, diceFormulaSums) {
	const sum = diceResult.sum + (diceResult.critical ? critical_mark : '');

    if ((sum === diceFormulaSums) || !diceResult.rollCount) {
        return `**${sum}**`
    }
    else {
        return `${diceFormulaSums} = **${sum}**`
    }
}