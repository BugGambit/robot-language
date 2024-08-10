import { Tokens } from "./tokenizer";

export enum Direction {
    Up = "UP",
    Down = "DOWN",
    Left = "LEFT",
    Right = "RIGHT",
}

export type ASTNode = ASTCommand | WhileLoop;
export type ASTCommand = PickCommand | DropCommand | MoveCommand;

type PickCommand = {
    type: 'PICK';
}

type DropCommand = {
    type: 'DROP';
}

type MoveCommand = {
    type: 'MOVE';
    direction: Direction;
}

type WhileLoop = {
    type: 'WHILE',
    condition: ASTNode,
    body: ASTNode[],
}

export function buildAstFromTokens(tokens: Tokens): ASTNode[] {
    console.log('build ast from tokens: ', tokens);
    const stack = [...tokens].reverse();
    const astNodes: ASTNode[] = [];
    while (stack.length > 0) {
        const token = stack.pop();
        switch (token) {
            case 'PICK': {
                astNodes.push({type: 'PICK'});
                break;
            }
            case 'DROP': {
                astNodes.push({type: 'DROP'});
                break;
            }
            case 'MOVE': {
                const direction = stack.pop();
                if (!direction) {
                    throw new Error('Invalid MOVE command. No direction provided');
                }
                if (!Object.values<string>(Direction).includes(direction)) {
                    throw new Error(`Invalid MOVE command. Unknown direction: ${direction}`);
                }
                astNodes.push({type: 'MOVE', direction: direction as Direction});
                break;
            }
            case 'WHILE': {
                const conditionTokens = parseClause(stack, '(', ')');
                const bodyTokens = parseClause(stack, '{', '}');
                const conditionAst = buildAstFromTokens(conditionTokens);
                if (conditionAst.length !== 1) {
                    throw new Error('Invalid condition');
                }
                const bodyAst = buildAstFromTokens(bodyTokens);
                astNodes.push({
                    type: 'WHILE',
                    condition: conditionAst[0],
                    body: bodyAst,
                });
                break;
            }
            default: {
                throw new Error(`Unknown token: ${token}`);
            }
        }
    }
    return astNodes;
}

function parseClause(stack: Tokens, startClauseToken: string, endClauseToken: string): Tokens {
    const tokens: Tokens = [];
    if (stack.pop() !== startClauseToken) {
        throw new Error(`Missing ${startClauseToken}`)
    }
    let numberOfActiveTokens = 1;
    while (stack.length > 0) {
        const currentToken = stack.pop();
        if (!currentToken) {
            throw new Error(`Clause incomplete. Missing ${endClauseToken}`);
        }
        if (currentToken === startClauseToken) {
            tokens.push(currentToken);
            numberOfActiveTokens += 1;
            continue;
        }
        if (currentToken === endClauseToken) {
            if (numberOfActiveTokens === 1) {
                return tokens;
            }
            numberOfActiveTokens -= 1;
            tokens.push(currentToken);
            continue;
        }
        tokens.push(currentToken);
    }
    return tokens;
}
