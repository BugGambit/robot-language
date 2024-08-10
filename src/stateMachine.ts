import { ASTCommand, ASTNode, Direction } from "./ast";

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

export function runProgram(state: State, astNodes: ASTNode[]) {
    console.log('run program: ', astNodes);
    for (const node of astNodes) {
        switch (node.type) {
            case 'PICK':
            case 'DROP':
            case 'MOVE': {
                runCommand(state, node);
                break;
            }
            case 'WHILE': {
                while (checkCondition(state, node.condition)) {
                    runProgram(state, node.body);
                }
                break;
            }
            default:
                throw new Error(`Unknown node type: ${node}`);
        }
    }
}

function runCommand(state: State, command: ASTCommand): boolean {
    switch (command.type) {
        case 'PICK': {
            const cell = state.grid[state.position.y][state.position.x];
            if (cell === 0) {
                return false;
            }
            state.plates.push(cell);
            state.grid[state.position.y][state.position.x] = 0;
            return true;
        }
        case 'DROP': {
            const cell = state.grid[state.position.y][state.position.x];
            if (cell !== 0) {
                return false;
            }
            const topPlate = state.plates.pop();
            if (!topPlate) {
                return false;
            }
            state.grid[state.position.y][state.position.x] = topPlate;
            return true;
        }
        case 'MOVE': {
            const deltaY = command.direction === Direction.Up ? -1 : (command.direction === 'DOWN' ? 1 : 0);
            const deltaX = command.direction === Direction.Left ? -1 : (command.direction === 'RIGHT' ? 1 : 0);
            const newPosition = {
                x: state.position.x + deltaX,
                y: state.position.y + deltaY,
            };
            if (newPosition.x < 0 || newPosition.x >= state.grid[0].length || newPosition.y < 0 || newPosition.y >= state.grid.length) {
                return false;
            }
            state.position = newPosition;
            return true;
        }
    }
}

function checkCondition(state: State, condition: ASTNode): boolean {
    switch (condition.type) {
        case 'PICK':
        case 'DROP':
        case 'MOVE': {
            return runCommand(state, condition);
        }
        default:
            throw new Error(`Unknown condition: ${condition}`);
    }
}