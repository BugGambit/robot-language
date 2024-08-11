import { buildAstFromTokens } from './ast';
import { drawGrid } from './grid';
import { sleep } from './sleep';
import { cloneState, State } from './state';
import { runProgram } from './stateMachine';
import './styles.css';
import { Task, tasks } from './tasks';
import { tokenize } from './tokenizer';

let state: State;
let task: Task;

const codeEditor = document.getElementById('code') as HTMLTextAreaElement;

function updateStack(state: State) {
    const stack = document.getElementById('stack') as HTMLDivElement;
    stack.innerHTML = state.plates.map(plate => `<div>${plate}</div>`).join('');
}

function setTaskList(tasks: Task[]) {
    const taskList = document.getElementById('task-list') as HTMLSelectElement;
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const option = document.createElement('option');
        option.value = index.toString();
        option.innerText = `Task ${index + 1}`;
        option.selected = index === 0;
        taskList.appendChild(option);
    });
    taskList.onchange = (e) => {
        const target = e.target as HTMLSelectElement;
        setTask(tasks[parseInt(target.value)]);
    };
}

function setTask(targetTask: Task) {
    task = targetTask;
    document.getElementById('description')!.innerText = task.description;
    const testCases = document.getElementById('test-cases') as HTMLDivElement;
    testCases.innerHTML = '';
    task.testCases.forEach((state, index) => {
        const input = document.createElement('input');
        input.type = 'radio';
        input.classList.add('btn-check');
        input.name = 'btnradio';
        input.id = `btnradio${index}`;
        input.autocomplete = 'off';
        input.checked = index === 0;
        input.onclick = () => {
            setState(cloneState(state));
        };
        const label = document.createElement('label');
        label.classList.add('btn', 'btn-outline-primary');
        label.htmlFor = input.id;
        label.innerText = `Test case ${index + 1}`;
        testCases.appendChild(input);
        testCases.appendChild(label);
    });
    setState(cloneState(task.testCases[0]));
}

document.getElementById('run')?.addEventListener('click', async () => {
    const program = codeEditor.value;
    const tokens = tokenize(program);
    const astNodes = buildAstFromTokens(tokens);
    const programIterator = runProgram(state, astNodes);
    for (const _ of programIterator) {
        drawGrid(state);
        updateStack(state);
        await sleep(100);
    }
    if (task.validator(state)) {
        console.log('Task completed');
    } else {
        console.log('Task failed');
    }
});

codeEditor.value = `
do {} while (move left)
do {} while (move up)
do {
	do {pick} while (move right)
	move down
	do {pick} while (move left)
} while (move down)
`;

// add support for Tab for indentation
codeEditor.addEventListener('keydown', function(e) {
    if (e.key == 'Tab') {
        e.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = this.value.substring(0, start) +
        "\t" + this.value.substring(end);

        // put caret at right position again
        this.selectionStart =
        this.selectionEnd = start + 1;
    }
});

function setState(targetState: State) {
    state = targetState;
    drawGrid(state);
    updateStack(state);
}

setTaskList(tasks);
setTask(tasks[0]);


window.addEventListener('resize', () => {
    drawGrid(state);
});