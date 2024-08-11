import { describe, expect, test } from 'vitest'
import { ASTNode, Direction } from './ast';
import { runProgram } from './stateMachine';
import { createState, State } from './state';

function getFinalStateFromProgram(state: State, astNodes: ASTNode[]): State {
    const programIterator = runProgram(state, astNodes);
    for (const _ of programIterator) {
        continue;
    }
    return state;
}

const emptyGrid = [
    '_ _ _ _ _ _ _',
    '_ _ _ _ _ _ _',
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
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], {x: 1, y: 2}, []);
        const ast: ASTNode[] = [{type: 'PICK'}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 1, y: 2}, [1]);
        expect(state).toEqual(expectedState);
    })
    
    test('should ignore pick command if no plate on grid', () => {
        const state = createState(emptyGrid, {x: 1, y: 2}, []);
        const ast: ASTNode[] = [{type: 'PICK'}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 1, y: 2}, []);
        expect(state).toEqual(expectedState);
    })
});

describe('drop', () => {
    test('should drop plate', () => {
        const state = createState(emptyGrid, {x: 1, y: 2}, [1]);
        const ast: ASTNode[] = [{type: 'DROP'}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 1 _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], {x: 1, y: 2}, []);
        expect(state).toEqual(expectedState);
    })
    
    test('should not drop plate if grid already has a plate', () => {
        const state = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 2 _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], {x: 1, y: 2}, [1]);
        const ast: ASTNode[] = [{type: 'DROP'}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 2 _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], {x: 1, y: 2}, [1]);
        expect(state).toEqual(expectedState);
    })

    test('should not drop plate holding no plate', () => {
        const state = createState(emptyGrid, {x: 1, y: 2}, []);
        const ast: ASTNode[] = [{type: 'DROP'}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 1, y: 2}, []);
        expect(state).toEqual(expectedState);
    })
});

describe('move', () => {
    test('should move left', () => {
        const state = createState(emptyGrid, {x: 1, y: 2}, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Left}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 0, y: 2}, []);
        expect(state).toEqual(expectedState);
    })

    test('should move right', () => {
        const state = createState(emptyGrid, {x: 1, y: 2}, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Right}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 2, y: 2}, []);
        expect(state).toEqual(expectedState);
    })

    test('should move up', () => {
        const state = createState(emptyGrid, {x: 1, y: 2}, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Up}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 1, y: 1}, []);
        expect(state).toEqual(expectedState);
    })

    test('should move down', () => {
        const state = createState(emptyGrid, {x: 1, y: 2}, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Down}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 1, y: 3}, []);
        expect(state).toEqual(expectedState);
    })

    test('should not move out of bounds', () => {
        const state = createState(emptyGrid, {x: 0, y: 2}, []);
        const ast: ASTNode[] = [{type: 'MOVE', direction: Direction.Left}];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 0, y: 2}, []);
        expect(state).toEqual(expectedState);
    });
});

describe('while-loops', () => {
    test('should execute while-loop with empty body', () => {
        const state = createState(emptyGrid, {x: 5, y: 2}, []);
        const ast: ASTNode[] = [{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: Direction.Left},
            body: [],
        }];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 0, y: 2}, []);
        expect(state).toEqual(expectedState);
    })

    test('should execute while-loop with simple body', () => {
        const state = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 1 2 5 3 4 _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], {x: 6, y: 2}, []);
        const ast: ASTNode[] = [{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: Direction.Left},
            body: [{type: 'PICK'}],
        }];
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState(emptyGrid, {x: 0, y: 2}, [4, 3, 5, 2, 1]);
        expect(state).toEqual(expectedState);
    })

    test('should execute nested while-loops', () => {
        const state = createState([
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ 1 2 5 3 4 _',
        ], {x: 6, y: 6}, []);
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
        getFinalStateFromProgram(state, ast);
    
        const expectedState = createState([
            '_ 1 2 5 3 4 _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
            '_ _ _ _ _ _ _',
        ], {x: 0, y: 6}, []);
        expect(state).toEqual(expectedState);
    })

    test('iterator should yield after each command', () => {
        const state = createState(emptyGrid, {x: 3, y: 2}, [4, 3, 1, 2, 5]);
        const ast: ASTNode[] = [{
            type: 'WHILE',
            condition: {type: 'MOVE', direction: Direction.Left},
            body: [{type: 'DROP'}],
        }];
        const programIterator = runProgram(state, ast);
        expect(state.position).toEqual({x: 3, y: 2});
        expect(state.plates).toEqual([4, 3, 1, 2, 5]);
        
        programIterator.next();
        expect(state.position).toEqual({x: 2, y: 2});
        expect(state.plates).toEqual([4, 3, 1, 2, 5]);

        programIterator.next();
        expect(state.position).toEqual({x: 2, y: 2});
        expect(state.plates).toEqual([4, 3, 1, 2]);

        programIterator.next();
        expect(state.position).toEqual({x: 1, y: 2});
        expect(state.plates).toEqual([4, 3, 1, 2]);

        programIterator.next();
        expect(state.position).toEqual({x: 1, y: 2});
        expect(state.plates).toEqual([4, 3, 1]);

        programIterator.next();
        expect(state.position).toEqual({x: 0, y: 2});
        expect(state.plates).toEqual([4, 3, 1]);

        programIterator.next();
        expect(state.position).toEqual({x: 0, y: 2});
        expect(state.plates).toEqual([4, 3]);

        expect(programIterator.next().done).toBe(true);
    })
});
