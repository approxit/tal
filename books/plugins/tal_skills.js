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
            ability['id'] = match.input;
        });

        for (const typeKey in pluralAndSingularNames) {
            feedTableBodyFromData(state.tokens, state.Token, 'tabela-umiejetnosci-' + typeKey, abilities, function (key) {
                return abilities[key]['Typ'] === pluralAndSingularNames[typeKey];
            }, function (key, entry) {
                var requirements;
                if (entry['Synergia do']) {
                    requirements = entry['Synergia do'].split(', ').map(function(requirementFull) {
                        var requirement = requirementFull.replace(/\s*\([^)]*\)/, '');

                        if (abilities[requirement]) {
                            return {href: '#' + abilities[requirement]['id'], text: requirementFull};
                        }
                        else {
                            return requirementFull
                        }
                    }).reduce(function(array, value) {
                        return array.concat([value, ', '])
                    }, []);
                }

                if (requirements) {
                    requirements.pop();
                }

                return [{href: '#' + entry['id'], text: key}, entry['Atrybut'], requirements];
            });
        }
    });
};
