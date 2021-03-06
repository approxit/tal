const fs = require('fs-extra');
const MarkdownIt = require('markdown-it');
const slugify = require('slugify');

let inputFile = process.argv[2];
let outputFile = process.argv[3];

function tal_slugify(str) {
    return slugify(str, {
        lower: true,
        remove: /[*+~,.()'"!:@]/g,
    });
}

function slugifyHeader(str) {
    return 'header-' + tal_slugify(str);
}

if (!inputFile) {
    console.error('no input file given!');
    process.exit(1);
}

const md = new MarkdownIt({
    'html': true,
    'typographer': true,
    'quotes': '„”‘’'
});

md.use(require('markdown-it-attrs'));
md.use(require('markdown-it-container'));
md.use(require('markdown-it-abbr'));
md.use(require('markdown-it-deflist'));
md.use(require('markdown-it-include'));
md.use(require('markdown-it-sup'));
md.use(require('markdown-it-anchor'), {
    slugify: slugifyHeader,
    level: [
        2,
        3
    ]
});
md.use(require('markdown-it-toc-done-right'), {
    containerClass: 'book-toc-nav',
    format: function(x, htmlencode) {
        return `<span class="book-toc-text">${htmlencode(x)}</span><span class="book-toc-dots"></span>`;
    },
    slugify: slugifyHeader,
    level: [
        2,
        3
    ]
});
md.use(require('markdown-it-multimd-table'), {
    rowspan: true,
    headerless: true,
});
md.use(require('./plugins/tal_headers'), {
    slugify: tal_slugify,
});
md.use(require('./plugins/tal_skills'));
md.use(require('./plugins/tal_abilities'));
md.use(require('./plugins/tal_extra_traits'));
md.use(require('./plugins/tal_languages'));
md.use(require('./plugins/tal_calculated_tables'));

fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) throw err;
    const result = md.render(data);

    if (outputFile) {
        fs.outputFile(outputFile, result, {encoding: 'utf8'}, err => {
            if (err) {
                throw err;
            }

            console.log(`Wrote to ${outputFile}`);
        });
    } else {
        console.log(result);
    }
});
