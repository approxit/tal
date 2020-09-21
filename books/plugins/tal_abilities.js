'use strict';

const iterHeaders = require('./tal_common').iterHeaders;
const shortRequirementsDescription = require('./tal_common').shortRequirementsDescription;
const feedTableBodyFromData = require('./tal_common').feedTableBodyFromData;

var abilities = {};

module.exports = function (md) {
    md.core.ruler.push('tal_abilities', function (state) {
        var pluralAndSingularNames = {
            'ogolne': 'ogolna',
            'kulturowe': 'kulturowa',
            'wrodzone': 'wrodzona',
            'rasowe': 'rasowa',
        }

        iterHeaders(state.tokens, new RegExp('^zdolnosc-(' + Object.values(pluralAndSingularNames).join('|') + ')'), function (title, content, match) {
            var ability = abilities[title] = content;
            ability['Typ'] = match[1];
        });

        for (const typeKey in pluralAndSingularNames) {
            feedTableBodyFromData(state.tokens, state.Token, 'tabela-zdolnosci-' + typeKey, abilities, function (key) {
                return abilities[key]['Typ'] === pluralAndSingularNames[typeKey];
            }, function(key, entry) {
                if (typeKey === 'kulturowe') {
                    return [key, entry['Region'], shortRequirementsDescription(entry['Wymagania'])];
                }
                return [key, shortRequirementsDescription(entry['Wymagania'])];
            });
        }
    });
};