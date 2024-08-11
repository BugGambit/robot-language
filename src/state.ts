export type State = {
    grid: Grid;
    position: Position;
    plates: Plate[];
};

type Grid = number[][];
type Position = {
    x: number;
    y: number;
};
type Plate = number;

export function createState(grid: string[], position: Position, plates: number[]): State {
    if (grid.length === 0) {
        throw new Error('Grid must have at least one row');
    }
    grid.forEach(row => {
        if (row.split(' ').length !== grid.length) {
            throw new Error('All rows must have the same length and the grid must be square');
        }
    });

    return {
        grid: grid.map(row => row.split(' ').map(cell => cell === '_' ? 0 : parseInt(cell))),
        position,
        plates,
    };
}

export function cloneState(state: State): State {
    return JSON.parse(JSON.stringify(state));
}
