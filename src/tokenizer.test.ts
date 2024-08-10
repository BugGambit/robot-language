import { describe, expect, test } from 'vitest'
import { tokenize } from './tokenizer'

test('can tokenize simple one-liner', () => {
    const actual = tokenize('MOVE LEFT');
    expect(actual).toEqual(['MOVE', 'LEFT']);
})

test('ignore extra spaces', () => {
    const actual = tokenize(' MOVE  LEFT   ');
    expect(actual).toEqual(['MOVE', 'LEFT']);
});

test('ignore new lines', () => {
    const actual = tokenize(`
        MOVE  
        LEFT  
    `);
    expect(actual).toEqual(['MOVE', 'LEFT']);
});

test('ignore tabs', () => {
    const actual = tokenize(`\t \t MOVE  LEFT  \t`);
    expect(actual).toEqual(['MOVE', 'LEFT']);
});

describe('while loops', () => {
    test('should tokenize simple while loop', () => {
        const actual = tokenize(`
            WHILE (MOVE RIGHT) {
                DROP
            }
        `);
        expect(actual).toEqual(['WHILE', '(', 'MOVE', 'RIGHT', ')', '{', 'DROP', '}']);
    });

    test('should tokenize nested while loops', () => {
        const actual = tokenize(`
            WHILE (MOVE RIGHT) {
                DROP
                WHILE (MOVE LEFT) {
                    PICK
                }
            }
        `);
        expect(actual).toEqual(['WHILE', '(', 'MOVE', 'RIGHT', ')', '{', 'DROP', 'WHILE', '(', 'MOVE', 'LEFT', ')', '{', 'PICK', '}', '}']);
    });
});
