import { createState, State } from "./state";

export type Task = {
    description: string;
    validator: (state: State) => boolean;
    testCases: State[];
}

export const tasks: Task[] = [
    {
        description: 'Pick up all plates from the grid',
        validator: noPlatesOnGrid,
        testCases: [
            createState([
                '1 _ _',
                '_ _ _',
                '_ _ _',
            ], {x: 1, y: 0}, []),
            createState([
                '1 _ _',
                '_ 2 _',
                '_ _ 3',
            ], {x: 1, y: 1}, []),
            createState([
                '1 2 3',
                '4 5 6',
                '7 8 9',
            ], {x: 2, y: 2}, []),
        ],
    },
    {
        description: 'Put a number in each corner (only 4 numbers)',
        validator: state => state.grid[0][0] !== 0 && state.grid[0][4] !== 0 && state.grid[4][0] !== 0 && state.grid[4][4] !== 0,
        testCases: [
            createState([
                '1 _ _ _ _',
                '_ 2 _ _ _',
                '_ _ _ _ _',
                '_ _ 4 _ _',
                '3 _ _ _ _',
            ], {x: 1, y: 0}, []),
            createState([
                '_ _ 4 _ _',
                '3 _ _ _ _',
                '_ 1 2 _ _',
                '_ _ 4 _ _',
                '_ _ _ _ _',
            ], {x: 2, y: 2}, []),
        ],
    }
];

function noPlatesOnGrid(state: State): boolean {
    return !state.grid.some(row => row.some(cell => cell !== 0));
}