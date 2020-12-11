'use strict';

const feedTableBodyFromRaw = require('./tal_common').feedTableBodyFromRaw;

module.exports = function (md) {
    md.core.ruler.push('tal_calculated_tables', function (state) {
        feedTableBodyFromRaw(state.tokens, state.Token, 'tabela-wartosc-atrubutu-a-wartosc-wspolczynnika', function() {
            var rows = [];

            for (var i = 1; i <= 30; ++i) {
                rows.push([
                    i,
                    Math.max(30, ((i - 10) * 2) + 30),
                    Math.max(5, Math.ceil(i / 2)),
                    Math.max(20, i + 10)
                ]);
            }

            rows.push(['etc.', 'etc.', 'etc.', 'etc.'])

            return rows;
        });

        function skillsCostsTableBody() {
            var rows = [];
            var sum = 0;

            for (var i = 1; i <= 20; ++i) {
                sum += i * 100;

                rows.push([
                    i,
                    (i * 100),
                    sum
                ]);
            }

            rows.push(['etc.', 'etc.', 'etc.'])

            return rows;
        }

        feedTableBodyFromRaw(state.tokens, state.Token, 'tabela-zakup-poziomow-umiejetnosci-1', skillsCostsTableBody);
        feedTableBodyFromRaw(state.tokens, state.Token, 'tabela-zakup-poziomow-umiejetnosci-2', skillsCostsTableBody);

        feedTableBodyFromRaw(state.tokens, state.Token, 'tabela-wartosc-sily-a-dodatkowe-obrazenia', function() {
            var rows = [];

            for (var i = 1; i <= 40; ++i) {
                rows.push([
                    i,
                    Math.ceil(i / 8),
                    Math.ceil(i / 4),
                    Math.ceil(i / 2),
                    i,
                    Math.ceil(i * 1.5),
                    i * 2,
                    i * 3,
                ]);
            }

            return rows;
        });

        feedTableBodyFromRaw(state.tokens, state.Token, 'tabela-szybkosc-a-zasieg-podrozy', function() {
            var rows = [];

            for (var i = 1; i <= 15; ++i) {
                rows.push([
                    ((i * 2) - 1) + '–' + (i * 2),
                    (i * 8) + ' km',
                    '+' + i + ' km',
                ]);
            }

            return rows;
        });

        feedTableBodyFromRaw(state.tokens, state.Token, 'tabela-przyklad-dzielenia-wartosci-atrybutow', function() {
            var rows = [];

            for (var i = 1; i <= 50; ++i) {
                var i2 = Math.ceil(i / 2);
                var i4 = Math.ceil(i2 / 2);
                var i8 = Math.ceil(i4 / 2);

                rows.push([
                    i,
                    i2,
                    i4,
                    i8,
                ]);
            }

            return rows;
        });
    });
};
