export type Tokens = string[];

export function tokenize(input: string): Tokens {
    const uppercasedInput = input.toUpperCase();
    const tokens: Tokens = [];
    let currentToken = '';
    const charsToIgnore = ['\r', '\n', '\t'];
    for (let char of uppercasedInput) {
        if (charsToIgnore.includes(char)) {
            tokens.push(currentToken);
            currentToken = '';
            continue;
        }
        if (['(', ')', '{', '}'].includes(char)) {
            tokens.push(currentToken);
            currentToken = '';
            tokens.push(char);
            continue;
        }
        if (char == ' ') {
            tokens.push(currentToken);
            currentToken = '';
            continue;
        }
        currentToken += char;
    }
    tokens.push(currentToken);
    return tokens.filter((value) => value !== '');
}
