const localeComparator = module.exports.localeComparator = new Intl.Collator('pl').compare;

module.exports.shortRequirementsDescription = function (description) {
    if (!description) {
        return description;
    }

    return description
        .replace(/Atrybut:/g, 'A:')
        .replace(/Cecha dodatkowa:/g, 'C:')
        .replace(/Rasa:/g, 'R:')
        .replace(/Umiejętność:/g, 'U:')
        .replace(/Współczynnik:/g, 'W:')
        .replace(/Zdolność:/g, 'Z:');
}

module.exports.iterHeaders = function (tokens, id_pattern, callback) {
    for (var index = 0; index <= tokens.length - 1; ++index) {
        var token = tokens[index];

        if (token.type === 'heading_open' && token.attrGet('id')) {
            var match = token.attrGet('id').match(id_pattern);
            if (match) {
                var title = tokens[index + 1].content;
                var result = getDlMapUntilNextHeading(tokens, index + 3);

                callback(title, result.content, match);

                index = result.index - 1;
            }
        }
    }
};

const getDlMapUntilNextHeading = module.exports.getDlMapUntilNextHeading = function (tokens, index) {
    var content = {};

    main_loop:
        for (; index <= tokens.length - 1; ++index) {
            var token = tokens[index];

            switch (token.type) {
                case 'heading_open':
                case 'html_block':
                    break main_loop;
                case 'dt_open':
                    content[tokens[index + 1].content] = tokens[index + 5].content.replace(/[.]+$/, '');
                    break;
            }
        }

    return {
        index: index,
        content: content,
    };
}

module.exports.feedTableBodyFromRaw = function (tokens, Token, table_id, data_func) {
    var index = 0;
    index = seekToTableStart(tokens, index, table_id);
    var headingStyles = getTableHeadingStyles(tokens, index);
    index = seekToTableEnd(tokens, index);
    var level = tokens[index].level;

    var newTokens = [];
    var data = data_func();

    for (var i = 0; i <= data.length - 1; ++i) {
        var entry = data[i];

        newTokens = newTokens.concat(createTableRowTokens(Token, level, headingStyles, entry));
    }

    newTokens = createTableBodyTokens(Token, level, newTokens);

    extendAtIndex(tokens, index, newTokens);
};

module.exports.feedTableBodyFromData = function (tokens, Token, table_id, data, filter_keys, fields) {
    var index = 0;
    index = seekToTableStart(tokens, index, table_id);
    var headingStyles = getTableHeadingStyles(tokens, index);
    index = seekToTableEnd(tokens, index);
    var level = tokens[index].level;

    var newTokens = [];
    var sortedKeys = Object.keys(data).sort(localeComparator);

    if (filter_keys) {
        sortedKeys = sortedKeys.filter(filter_keys);
    }

    for (var i = 0; i <= sortedKeys.length - 1; ++i) {
        var key = sortedKeys[i];
        var entry = data[key];

        newTokens = newTokens.concat(createTableRowTokens(Token, level, headingStyles, fields(key, entry)));
    }

    newTokens = createTableBodyTokens(Token, level, newTokens);

    extendAtIndex(tokens, index, newTokens);
};

function seekToTableStart(tokens, index, table_id) {
    for (; index <= tokens.length - 1; ++index) {
        var token = tokens[index];

        if ((token.type === 'table_open') && (token.attrGet('id') === table_id)) {
            return index;
        }
    }

    throw new Error('Table ' + table_id + ' not found!');
}

function getTableHeadingStyles(tokens, index) {
    var styles = [];
    var inHeaders = false;

    for (; index <= tokens.length - 1; ++index) {
        var token = tokens[index];

        if (token.type === 'table_group_open') {
            inHeaders = true;
        }
        else if (token.type === 'table_group_close') {
            break;
        }
        else if ((token.type === 'table_column_open') && (token.tag === 'th')) {
            styles.push(token.attrGet('style'));
        }
    }

    return styles;
}

function seekToTableEnd(tokens, index, table_id) {
    for (; index <= tokens.length - 1; ++index) {
        var token = tokens[index];

        if (token.type === 'table_close') {
            return index;
        }
    }

    throw new Error('End of table ' + table_id + ' not found!');
}

function createTableRowTokens(Token, level, styles, fields) {
    var rowTokens = [];
    var token, text;

    token = new Token('table_row_open', 'tr', 1);
    token.level = level++;
    token.block = true;
    rowTokens.push(token);

    for (var i = 0; i <= fields.length - 1; ++i) {
        token = new Token('table_column_open', 'td', 1);
        token.level = level++;
        token.block = true;
        if (styles[i]) {
            token.attrPush(['style', styles[i]]);
        }
        rowTokens.push(token);

        text = new Token('text', '', 0)
        text.content = (fields[i] || '–') + '';

        token = new Token('inline', '', 0);
        token.level = level;
        token.block = true;
        token.children = [text];
        rowTokens.push(token);

        token = new Token('table_column_close', 'td', -1);
        token.level = --level;
        token.block = true;
        rowTokens.push(token);
    }

    token = new Token('tr_close', 'tr', -1);
    token.level = --level;
    token.block = true;
    rowTokens.push(token);

    return rowTokens;
}

function createTableBodyTokens(Token, level, row_tokens) {
    var tbodyOpen = new Token('table_group_open', 'tbody', 1);
    tbodyOpen.level = level++;
    tbodyOpen.block = true;

    var tbodyClose = new Token('table_group_close', 'tbody', -1);
    tbodyClose.level = --level;
    tbodyClose.block = true;

    return [].concat([tbodyOpen], row_tokens, [tbodyClose]);
}

function extendAtIndex(tokens, index, items) {
    var args = [index, 0].concat(items);
    Array.prototype.splice.apply(tokens, args);
}