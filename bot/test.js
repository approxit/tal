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
        '1 + 2 * (6 - 1)',
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
});
