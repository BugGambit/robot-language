import { describe, expect, test } from 'vitest'
import { buildAstFromTokens } from './ast';

test('should generate ast for simple command', () => {
    const actual = buildAstFromTokens(['PICK']);
    expect(actual).toEqual([{type: 'PICK'}]);
})

test('should generate ast for two commands', () => {
    const actual = buildAstFromTokens(['PICK', 'DROP']);
    expect(actual).toEqual([{type: 'PICK'}, {type: 'DROP'}]);
})

test('should generate ast for MOVE commands', () => {
    const actual = buildAstFromTokens(['MOVE', 'LEFT']);
    expect(actual).toEqual([{type: 'MOVE', direction: 'LEFT'}]);
})

describe('while loops', () => {
    test('should handle simple while loop', () => {
        const actual = buildAstFromTokens(['WHILE', '(', 'MOVE', 'RIGHT', ')', '{', 'DROP', '}']);
        expect(actual).toEqual([{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: 'RIGHT'},
            body: [{type: 'DROP'}]
        }]);
    });

    test('should handle while loop with multiple body commands', () => {
        const actual = buildAstFromTokens(['WHILE', '(', 'MOVE', 'RIGHT', ')', '{', 'PICK', 'MOVE', 'DOWN', 'DROP', '}']);
        expect(actual).toEqual([{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: 'RIGHT'},
            body: [
                {type: 'PICK'},
                {type: 'MOVE', direction: 'DOWN'},
                {type: 'DROP'},
            ]
        }]);
    });

    test('should handle nested while loops', () => {
        const actual = buildAstFromTokens(['WHILE', '(', 'MOVE', 'RIGHT', ')', '{',
            'PICK',
            'WHILE', '(', 'MOVE', 'DOWN', ')', '{',
                'DROP',
            '}',
        '}']);
        expect(actual).toEqual([{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: 'RIGHT'},
            body: [
                {type: 'PICK'},
                {
                    type: 'WHILE',
                    condition: {type: 'MOVE', direction: 'DOWN'},
                    body: [
                        {type: 'DROP'},
                    ]
                }
            ]
        }]);
    });
});
