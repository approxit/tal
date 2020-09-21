'use strict';

const iterHeaders = require('./tal_common').iterHeaders;
const feedTableBodyFromData = require('./tal_common').feedTableBodyFromData;

var extraTraits = {};

module.exports = function (md) {
    md.core.ruler.push('tal_languages', function (state) {
        iterHeaders(state.tokens, /^cecha-dodatkowa/, function (title, content) {
            extraTraits[title] = content;
        });


        feedTableBodyFromData(state.tokens, state.Token, 'tabela-cechy-dodatkowe', extraTraits, null, function (key, entry) {
            return [key, entry['Zakazane']];
        });
    });
};