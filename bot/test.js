const assert = require('assert');
const dice = require('./dice');

describe('Dice', () => {
    [
        'k2',
        'd2',
        'k4',
        'k6',
        'k8',
        'k10',
        'k12',
        'k20',
        '1k20',
        '20k20',
		'1 + 1 - 1',
		'1 * 1 / 1',
		'(1) + (1) - (1)',
		'(1) * (1) / (1)',
        '1 + 2 * (k2 - 1) / 2',
		' 1',
		'1 ',
    ].map((args) => {
        it(`should parse "${args}" without errors`, () => {
            dice.parse(args);
        })
    });

    [
        {syntax: '1+1', result: 2},
        {syntax: '12+21', result: 33},
        {syntax: '-2--1', result: -1},
        {syntax: '2*2', result: 4},
        {syntax: '10/2', result: 5},
        {syntax: '10/3', result: 3},
        {syntax: '5/2', result: 3},
    ].map((test) => {
        it(`should calculate single operation "${test.syntax}" as "${test.result}"`, () => {
            assert.equal(dice.parse(test.syntax).sum, test.result);
        })
    });

    [
        {syntax: '1+1+1', result: 3},
        {syntax: '3-1-1', result: 1},
        {syntax: '2*2*2', result: 8},
        {syntax: '100/10/5', result: 2},
        {syntax: '12/5/2', result: 1},
        {syntax: '12/5/3', result: 1},
        {syntax: '12/5/3', result: 1},
    ].map((test) => {
        it(`should calculate sequential operations "${test.syntax}" as "${test.result}"`, () => {
            assert.equal(dice.parse(test.syntax).sum, test.result);
        })
    });

    [
        {syntax: '5+3-1', result: 7},
        {syntax: '5-1+3', result: 7},
        {syntax: '3*4/2', result: 6},
        {syntax: '8/4*2', result: 4},
    ].map((test) => {
        it(`should calculate same-level operators order "${test.syntax}" as "${test.result}"`, () => {
            assert.equal(dice.parse(test.syntax).sum, test.result);
        })
    });

    [
        {syntax: '1+2*3', result: 7},
        {syntax: '4*5+6', result: 26},
        {syntax: '1-4/2', result: -1},
        {syntax: '10/2+1', result: 6},
    ].map((test) => {
        it(`should calculate mixed-level operators order "${test.syntax}" as "${test.result}"`, () => {
            assert.equal(dice.parse(test.syntax).sum, test.result);
        })
    });

    [
        {syntax: '1+2*3', result: 7},
        {syntax: '4*5+6', result: 26},
        {syntax: '1-4/2', result: -1},
        {syntax: '10/2+1', result: 6},
    ].map((test) => {
        it(`should calculate same-level operators order "${test.syntax}" as "${test.result}"`, () => {
            assert.equal(dice.parse(test.syntax).sum, test.result);
        })
    });

    [
        {syntax: '5/2*2', result: 5},
        {syntax: '5/2*2/2*2', result: 5},
        {syntax: '5/2+5/2', result: 5},
    ].map((test) => {
        it(`should round division results at the end of calculation "${test.syntax}" as "${test.result}"`, () => {
            assert.equal(dice.parse(test.syntax).sum, test.result);
        })
    });

    [
        {syntax: '(1)', result: 1},
        {syntax: '(2+2)*2', result: 8},
        {syntax: '28/(2+5)/2', result: 2},
    ].map((test) => {
        it(`should calculate parenthesis in calculation "${test.syntax}" as "${test.result}"`, () => {
            assert.equal(dice.parse(test.syntax).sum, test.result);
        })
    });

    [
        {syntax: 'k2', mockedRolls: [5], rollSets: [[5]], result: 5},
		{syntax: 'k20', mockedRolls: [20, 2], rollSets: [[20, 2]], result: 22},
		{syntax: 'k20', mockedRolls: [20, 20, 20, 4], rollSets: [[20, 20, 20, 4]], result: 64},
		{syntax: 'k20', mockedRolls: [20, 1], rollSets: [[20, 1]], result: 21},
		{syntax: 'k20', mockedRolls: [1, 1], rollSets: [[1, 1]], result: -1},
		{syntax: 'k20', mockedRolls: [1, 10], rollSets: [[1, 10]], result: -10},
		{syntax: 'k20', mockedRolls: [1, 20, 10], rollSets: [[1, 20, 10]], result: -30},
		{syntax: '2k20', mockedRolls: [3, 1, 20, 10], rollSets: [[3, 1, 20, 10]], result: -27},
		{syntax: '2k20', mockedRolls: [20, 2, 4], rollSets: [[20, 2, 4]], result: 26},
		{syntax: '1k20+k2', mockedRolls: [1, 5, 2], rollSets: [[1, 5], [2]], result: -3},
    ].map((test) => {
        it(`should calculate "${test.syntax}" with mocked dices "${test.mockedRolls}" as "${test.result}"`, () => {
            var result = dice.parse(test.syntax, {
				mockedRolls: test.mockedRolls,
			});

			assert.equal(result.sum, test.result);
			assert.deepStrictEqual(result.rollSets.map(s => {
				return s.rolls.map(r => {
					return r.value;
				});
			}), test.rollSets);
        })
    });

    [
        {syntax: 'k20', mockedRolls: [1, 5], rollSets: [
			[
				{value: 1, critical: false},
				{value: 5, critical: null},
			]
		], result: -5},
        {syntax: 'k20', mockedRolls: [20, 5], rollSets: [
			[
				{value: 20, critical: true},
				{value: 5, critical: null},
			]
		], result: 25},
        {syntax: 'k20', mockedRolls: [1, 20, 5], rollSets: [
			[
				{value: 1, critical: false},
				{value: 20, critical: false},
				{value: 5, critical: null},
			]
		], result: -25},
        {syntax: 'k20', mockedRolls: [20, 20, 5], rollSets: [
			[
				{value: 20, critical: true},
				{value: 20, critical: true},
				{value: 5, critical: null},
			]
		], result: 45},
    ].map((test) => {
        it(`should calculate "${test.syntax}" with mocked critical states of dices "${test.mockedRolls}" as "${test.result}"`, () => {
            var result = dice.parse(test.syntax, {
				mockedRolls: test.mockedRolls,
			});

			assert.equal(result.sum, test.result);
			assert.deepStrictEqual(result.rollSets.map(s => {
				return s.rolls;
			}), test.rollSets);
        })
    });

	[
        {syntax: 'k2', mockedRolls: [1], rollSets: [[1]], result: 1},
        {syntax: 'k2', mockedRolls: [2], rollSets: [[2]], result: 2},
        {syntax: 'k4', mockedRolls: [1], rollSets: [[1]], result: 1},
        {syntax: 'k4', mockedRolls: [4], rollSets: [[4]], result: 4},
        {syntax: 'k6', mockedRolls: [1], rollSets: [[1]], result: 1},
        {syntax: 'k6', mockedRolls: [6], rollSets: [[6]], result: 6},
        {syntax: 'k8', mockedRolls: [1], rollSets: [[1]], result: 1},
        {syntax: 'k8', mockedRolls: [8], rollSets: [[8]], result: 8},
        {syntax: 'k10', mockedRolls: [1], rollSets: [[1]], result: 1},
        {syntax: 'k10', mockedRolls: [10], rollSets: [[10]], result: 10},
        {syntax: 'k12', mockedRolls: [1], rollSets: [[1]], result: 1},
        {syntax: 'k12', mockedRolls: [12], rollSets: [[12]], result: 12},
        {syntax: 'k100', mockedRolls: [1], rollSets: [[1]], result: 1},
        {syntax: 'k100', mockedRolls: [100], rollSets: [[100]], result: 100},
    ].map((test) => {
        it(`should not reroll criticals and calculate for "${test.syntax}" with mocked dices "${test.mockedRolls}" as "${test.result}"`, () => {
            var result = dice.parse(test.syntax, {
				mockedRolls: test.mockedRolls,
			});

			assert.equal(result.sum, test.result);
			assert.deepStrictEqual(result.rollSets.map(s => {
				return s.rolls.map(r => {
					return r.value;
				});
			}), test.rollSets);
        })
    });
});
