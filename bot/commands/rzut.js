const Discord = require('discord.js');
const dice = require('../dice');
const discord = require('../discord');
const database = require('../database').database;
const systems = require('../systems');
const getChannelSystemOrThrow = require('../common').getChannelSystemOrThrow;
const CommandError = require('../common').CommandError;
const getChannelSystemKey = require('../database').getChannelSystemKey;
const getMemberNickKey = require('../database').getMemberNickKey;
const getMemberImageKey = require('../database').getMemberImageKey;
const getMemberLastDiceOptionsKey = require('../database').getMemberLastDiceOptionsKey;

const critical_up_mark = ':star:';
const critical_up_color = 'ORANGE';
const critical_down_mark = ':boom:';
const critical_down_color = 'RED';

module.exports = {
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
    async execute(guildId, channelId, member, options) {
		const system = await getChannelSystemOrThrow(guildId, channelId);
		
        const diceFormula = options['formuła'];
		const diceRollOptions = {
			diceExplosion: systems.get(system).diceExplosion,
		}

		try {
        	var diceResult = dice.parse(diceFormula, diceRollOptions);
		}
		catch (err) {
			console.log(`Roll for "${member.displayName}" with "${diceFormula}" failed with error "${err}"!`);

			throw new CommandError(`Formuła \`${diceFormula}\` napotkała błąd!\n\`\`\`${err}\`\`\``);
		}

		await saveDiceOptionsForLater(guildId, channelId, member, options);

		const diceAuthor = await getDiceAuthor(guildId, channelId, member);
        const diceAvatar = await getDiceAvatar(guildId, channelId, member);
        const diceFormulaRaw = getDiceFormulaWithRawDiceRolls(diceFormula, diceResult);
        const diceFormulaSums = getDiceFormulaWithSumDiceRolls(diceFormula, diceResult);
        const diceFormulaResult = getDiceFormulaResult(diceResult, diceFormulaSums);

        console.log(`Roll for "${member.displayName}" with "${diceFormula} = ${diceResult.sum}"`)

        var embed = new Discord.MessageEmbed();
        embed.setAuthor(diceAuthor);
        embed.setThumbnail(diceAvatar);
        embed.setTitle(diceFormulaResult);

		if (diceResult.critical !== null) {
			embed.setColor(diceResult.critical ? critical_up_color : critical_down_color);
		}

        if (options['komentarz']) {
            embed.addField('Komentarz', options['komentarz'], false);
        }

        if (1 < diceResult.rollCount && (diceResult.rollCount !== diceResult.rollSets.length)) {
            embed.addField('Kości', diceFormulaRaw, true);
        }

        embed.addField('Formuła', diceFormula, true);

        return {
			type: 4,
			data: {
            	embeds: [embed.toJSON()],
			}
        };
    },
};

async function getDiceAuthor(guildId, channelId, member) {
	const nick = await database.get(getMemberNickKey(guildId, channelId, member)) || member.displayName;
	return `${nick} rzuca kością!`
}

async function getDiceAvatar(guildId, channelId, member) {
	const image = await database.get(getMemberImageKey(guildId, channelId, member))

	if (image) {
		return image;
	}
	else {
    	return member.user.displayAvatarURL();
	}
}

function getDiceFormulaWithRawDiceRolls(diceFormula, diceResult) {
    var result = diceFormula;

    for (var i = diceResult.rollSets.length - 1; 0 <= i; --i) {
        const rollSet = diceResult.rollSets[i];
		const rolls = rollSet.rolls.map(r => {
			return getValueWithCriticalMark(r.value, r.critical);
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
		const diceRollsStr = getValueWithCriticalMark(rollSet.sum, rollSet.critical);
        result = result.substr(0, rollSet.range[0]) + diceRollsStr + result.substr(rollSet.range[1], result.length)
    }

    return result;
}

function getDiceFormulaResult(diceResult, diceFormulaSums) {
	const sum = getValueWithCriticalMark(diceResult.sum, diceResult.critical);

    if ((sum === diceFormulaSums) || !diceResult.rollCount) {
        return `**${sum}**`
    }
    else {
        return `${diceFormulaSums} = **${sum}**`
    }
}

function getValueWithCriticalMark(value, critical) {
	if (critical !== null) {
		return value + (critical ? critical_up_mark : critical_down_mark);
	}
	else {
		return value + '';
	}
}

async function saveDiceOptionsForLater(guildId, channelId, member, options) {
	await database.set(getMemberLastDiceOptionsKey(guildId, channelId, member), options);
}