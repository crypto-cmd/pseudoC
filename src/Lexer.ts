import { Token, TokenType } from "./Token";


const is = (regex: RegExp): (str: string) => boolean => {
  return (str: string): boolean => {
    return regex.test(str);
  }
}
const isOperator = is(/[+\-*/%<>=&;:|!]/);
const isNumber = is(/[0-9]/);
const isString = is(/["]/);
const isWhitespace = is(/[\s]/);
const isLetter = is(/[a-zA-Z]/);

const keywords = new Set([
  'if', 'else', 'while', 'for', 'return', 'break', 'continue',
  "declare", "fn", "procedure", "program", "real", "integer", "string", "boolean", "endprogram"]);

const isKeyword = (str: string): boolean => {
  return keywords.has(str.toLowerCase());
}

export class Lexer {
  public tokens: Token[] = [];
  constructor(private source: string) {
    this.tokenize();
  }
  private tokenize() {
    let cursor = 0;

    while (cursor < this.source.length) {
      const char = this.source[cursor];
      if (isOperator(char)) {
        const { value, cursor: newCursor } = this.parseOperator(cursor);
        this.tokens.push(new Token(TokenType.OPERATOR, value));
        cursor = newCursor;
      } else if (isString(char)) {
        const { value, cursor: newCursor } = this.parseString(cursor);
        this.tokens.push(new Token(TokenType.STRING, value));
        cursor = newCursor;
      } else if (isNumber(char)) {
        const { value, cursor: newCursor } = this.parseNumber(cursor);
        this.tokens.push(new Token(TokenType.NUMBER, value));
        cursor = newCursor;
      } else if (isLetter(char)) {
        const { value, cursor: newCursor } = this.parseIdentifier(cursor);
        const type = isKeyword(value) ? TokenType.KEYWORD : TokenType.IDENTIFIER;
        this.tokens.push(new Token(type, value));
        cursor = newCursor;
      } else {
        cursor++;
      }

    }
  }
  parseOperator(cursor: number): { value: string; cursor: number; } {
    let value = '';
    let newCursor = cursor;
    while (newCursor < this.source.length) {
      const char = this.source[newCursor];
      if (!isOperator(char)) break;
      value += char;
      newCursor++;
    }
    return { value, cursor: newCursor };
  }
  parseString(cursor: number): { value: string; cursor: number; } {
    let value = '';
    let newCursor = cursor + 1;
    while (newCursor < this.source.length) {
      const char = this.source[newCursor];
      if (char === '"') break;
      value += char;
      newCursor++;
    }
    return { value, cursor: newCursor + 1 };
  }
  parseNumber(cursor: number): { value: string; cursor: number; } {
    let value = '';
    let newCursor = cursor;
    let hasDot = false;
    while (newCursor < this.source.length) {
      const char = this.source[newCursor];
      if (!isNumber(char) && char !== '.') {
        break
      }
      if (char === '.') {
        if (hasDot)
          throw new Error('Invalid number');

        hasDot = true;
      }
      value += char;
      newCursor++;
    }
    return { value, cursor: newCursor };
  }
  parseIdentifier(cursor: number): { value: string; cursor: number; } {
    let value = '';
    let newCursor = cursor;
    while (newCursor < this.source.length) {
      const char = this.source[newCursor];
      if (!isLetter(char)) break;
      value += char;
      newCursor++;
    }
    return { value, cursor: newCursor };
  }
}