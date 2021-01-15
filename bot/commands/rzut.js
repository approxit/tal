const Discord = require('discord.js')

const dice = require('../dice');

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
        const diceRollsStr = '[' + rollSet.rolls.join(', ') + ']'
        result = result.substr(0, rollSet.range[0]) + diceRollsStr + result.substr(rollSet.range[1], result.length)
    }

    return result;
}

function getDiceFormulaWithSumDiceRolls(diceFormula, diceResult) {
    var result = diceFormula;

    for (var i = diceResult.rollSets.length - 1; 0 <= i; --i) {
        const rollSet = diceResult.rollSets[i];
        const diceRollsStr = rollSet.rolls.reduce((result, element) => {
            return result + element;
        })
        result = result.substr(0, rollSet.range[0]) + diceRollsStr + result.substr(rollSet.range[1], result.length)
    }

    return result;
}

function getDiceFormulaResult(diceResult, diceFormulaSums) {
    if ((`${diceResult.sum}` === diceFormulaSums) || !diceResult.rollCount) {
        return `**${diceResult.sum}**`
    }
    else {
        return `${diceFormulaSums} = **${diceResult.sum}**`
    }
}