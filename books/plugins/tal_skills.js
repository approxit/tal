'use strict';

const iterHeaders = require('./tal_common').iterHeaders;
const feedTableBodyFromData = require('./tal_common').feedTableBodyFromData;

var abilities = {};

module.exports = function (md) {
    md.core.ruler.push('tal_skills', function (state) {
        var pluralAndSingularNames = {
            'zwyklych': 'zwykla',
            'walki': 'walki',
            'specjalne': 'specjalna',
        }

        iterHeaders(state.tokens, new RegExp('^umiejetnosc-(' + Object.values(pluralAndSingularNames).join('|') + ')'), function (title, content, match) {
            var ability = abilities[title] = content;
            ability['Typ'] = match[1];
        });

        for (const typeKey in pluralAndSingularNames) {
            feedTableBodyFromData(state.tokens, state.Token, 'tabela-umiejetnosci-' + typeKey, abilities, function (key) {
                return abilities[key]['Typ'] === pluralAndSingularNames[typeKey];
            }, function (key, entry) {
                return [key, entry['Atrybut'], entry['Synergia do']];
            });
        }
    });
};