'use strict';

module.exports = function (md, options) {
    options = options || {};

    md.core.ruler.push('tal_headers', function (state) {
        var tokens = state.tokens;
        var header_slugs = {};
        var last_children_id_prefix = null;
        var last_parent_header_level = parseFloat('infinity');

        for (var i = 0; i <= tokens.length - 1; ++i) {
            var token = tokens[i];

            if (token.type === 'heading_open') {
                var level = parseInt(token.tag[1]);
                var header = tokens[i + 1]
                    .children
                    .filter(function (token) { return token.type === 'text' || token.type === 'code_inline' })
                    .reduce(function (s, t) { return s + t.content }, '');

                var log = '\t'.repeat(level) + ' ' + header;

                var id_prefix = token.attrGet('data-children-id-prefix');
                if (id_prefix) {
                    last_children_id_prefix = id_prefix;
                    last_parent_header_level = level;

                    // console.log(log);

                    continue;
                }

                if (level === last_parent_header_level + 1) {
                    var header_slug = token.attrGet('id') || options.slugify(last_children_id_prefix + ' ' + header);

                    if (header_slugs[header_slug]) {
                        throw new Error(`Duplicated ${header_slug} header!`)
                    }
                    else {
                        header_slugs[header_slug] = true;
                    }

                    if (header_slug) {
                        token.attrSet('id', header_slug)
                        log += ' #' + header_slug;
                    }

                }
                else if (level === last_parent_header_level) {
                    last_children_id_prefix = null;
                    last_parent_header_level = parseFloat('infinity');
                }

                // console.log(log);
            }
        }
    });
};