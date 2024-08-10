import { describe, expect, test } from 'vitest'
import { ASTNode, Direction } from './ast';
import { runProgram, State } from './stateMachine';

function createState(grid: string[], x: number, y: number, plates: number[]): State {
    return {
        grid: grid.map(row => row.split(' ').map(cell => cell === '_' ? 0 : parseInt(cell))),
        position: {x, y},
        plates,
    };
}

const emptyGrid = [
    '_ _ _ _ _ _ _',
    '_ _ _ _ _ _ _',
    '_ _ _ _ _ _ _',
    '_ _ _ _ _ _ _',
    '_ _ _ _ _ _ _',
];

describe('pick', () => {
    test('should pick up plate if above a plate', () => {
        const state = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 1 _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], 1, 2, []);
        const ast: ASTNode[] = [{type: 'PICK'}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 1, 2, [1]);
        expect(state).toEqual(expectedState);
    })
    
    test('should ignore pick command if no plate on grid', () => {
        const state = createState(emptyGrid, 1, 2, []);
        const ast: ASTNode[] = [{type: 'PICK'}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 1, 2, []);
        expect(state).toEqual(expectedState);
    })
});

describe('drop', () => {
    test('should drop plate', () => {
        const state = createState(emptyGrid, 1, 2, [1]);
        const ast: ASTNode[] = [{type: 'DROP'}];
        runProgram(state, ast);
    
        const expectedState = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 1 _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], 1, 2, []);
        expect(state).toEqual(expectedState);
    })
    
    test('should not drop plate if grid already has a plate', () => {
        const state = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 2 _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], 1, 2, [1]);
        const ast: ASTNode[] = [{type: 'DROP'}];
        runProgram(state, ast);
    
        const expectedState = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 2 _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], 1, 2, [1]);
        expect(state).toEqual(expectedState);
    })

    test('should not drop plate holding no plate', () => {
        const state = createState(emptyGrid, 1, 2, []);
        const ast: ASTNode[] = [{type: 'DROP'}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 1, 2, []);
        expect(state).toEqual(expectedState);
    })
});

describe('move', () => {
    test('should move left', () => {
        const state = createState(emptyGrid, 1, 2, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Left}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 0, 2, []);
        expect(state).toEqual(expectedState);
    })

    test('should move right', () => {
        const state = createState(emptyGrid, 1, 2, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Right}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 2, 2, []);
        expect(state).toEqual(expectedState);
    })

    test('should move up', () => {
        const state = createState(emptyGrid, 1, 2, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Up}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 1, 1, []);
        expect(state).toEqual(expectedState);
    })

    test('should move down', () => {
        const state = createState(emptyGrid, 1, 2, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Down}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 1, 3, []);
        expect(state).toEqual(expectedState);
    })

    test('should not move out of bounds', () => {
        const state = createState(emptyGrid, 0, 2, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Left}];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 0, 2, []);
        expect(state).toEqual(expectedState);
    });
});

describe('while-loops', () => {
    test('should execute while-loop with empty body', () => {
        const state = createState(emptyGrid, 5, 2, []);
        const ast: ASTNode[] = [{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: Direction.Left},
            body: [],
        }];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 0, 2, []);
        expect(state).toEqual(expectedState);
    })

    test('should execute while-loop with simple body', () => {
        const state = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 1 2 5 3 4 _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], 6, 2, []);
        const ast: ASTNode[] = [{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: Direction.Left},
            body: [{type: 'PICK'}],
        }];
        runProgram(state, ast);
    
        const expectedState = createState(emptyGrid, 0, 2, [4, 3, 5, 2, 1]);
        expect(state).toEqual(expectedState);
    })

    test('should execute nested while-loops', () => {
        const state = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 1 2 5 3 4 _',
        ], 6, 4, []);
        const ast: ASTNode[] = [{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: Direction.Left},
            body: [
                {type: 'PICK'},
                {
                    type: 'WHILE',
                    condition: {type: 'MOVE', direction: Direction.Up},
                    body: [],
                },
                {type: 'DROP'},
                {
                    type: 'WHILE',
                    condition: {type: 'MOVE', direction: Direction.Down},
                    body: [],
                },
            ],
        }];
        runProgram(state, ast);
    
        const expectedState = createState([
            '_ 1 2 5 3 4 _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], 0, 4, []);
        expect(state).toEqual(expectedState);
    })
});
