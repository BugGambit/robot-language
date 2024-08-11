import { State } from "./state";

type Coordinates = {
    x: number;
    y: number;
};

type RectCoordinates = {
    topLeft: Coordinates;
    bottomRight: Coordinates;
};

const canvas = document.getElementById('grid') as HTMLCanvasElement;
const lineWidth = 4;
function getContext() {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        throw new Error('Could not get canvas context');
    }
    return ctx;
}

function getCellSize(gridSize: number) {
    const cellWidth = (canvas.width - lineWidth) / gridSize;
    const cellHeight = (canvas.height - lineWidth) / gridSize;
    return { cellWidth, cellHeight };
}

function getCellCoordinates(column: number, row: number, gridSize: number): RectCoordinates {
    const { cellWidth, cellHeight } = getCellSize(gridSize);
    const halfLineWidth = lineWidth / 2;
    const x1 = column * cellWidth + halfLineWidth;
    const y1 = row * cellHeight + halfLineWidth;
    return {
        topLeft: {x: x1, y: y1},
        bottomRight: {x: x1 + cellWidth - halfLineWidth, y: y1 + cellHeight - halfLineWidth},
    };
}

function getCellCenter(column: number, row: number, gridSize: number): Coordinates {
    const { topLeft, bottomRight } = getCellCoordinates(column, row, gridSize);
    return {
        x: (topLeft.x + bottomRight.x) / 2,
        y: (topLeft.y + bottomRight.y) / 2,
    };
}

function drawTextInCell(column: number, row: number, gridSize: number, text: string) {
    const ctx = getContext();
    ctx.font = "50px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const { x, y } = getCellCenter(column, row, gridSize);
    ctx.fillText(text, x, y);
}

function drawRobot(column: number, row: number, gridSize: number) {
    drawTextInCell(column, row, gridSize, '🤖');
}

function drawNumber(column: number, row: number, gridSize: number, number: number) {
    const ctx = getContext();
    const { cellWidth } = getCellSize(gridSize);
    const { x, y } = getCellCenter(column, row, gridSize);
    ctx.beginPath();
    ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    ctx.arc(x, y, cellWidth * 0.3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = 'black';
    drawTextInCell(column, row, gridSize, number.toString());
}

export function drawGrid(state: State) {
    updateCanvasSize();
    const gridSize = state.grid.length;
    const ctx = getContext();

    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = "rgb(2, 7, 159)";

    for (let column = 0; column <= gridSize; column++) {
        const {topLeft: { x }} = getCellCoordinates(column, 0, gridSize);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
    }

    for (let row = 0; row <= gridSize; row++) {
        const {topLeft: { y }} = getCellCoordinates(0, row, gridSize);
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();

    for (let row = 0; row < gridSize; row++) {
        for (let column = 0; column < gridSize; column++) {
            const cell = state.grid[row][column];
            if (cell !== 0) {
                drawNumber(column, row, gridSize, cell);
            }
        }
    }

    drawRobot(state.position.x, state.position.y, gridSize);
}

function updateCanvasSize() {
    const size = 500;
    const dpi = window.devicePixelRatio;
    canvas.width = size * dpi;
    canvas.height = size * dpi;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
}
