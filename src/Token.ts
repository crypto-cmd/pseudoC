export enum TokenType {
  KEYWORD = 'KEYWORD',
  IDENTIFIER = 'IDENTIFIER',
  NUMBER = 'NUMBER',
  STRING = 'STRING',
  OPERATOR = 'OPERATOR',
}
export class Token {
  constructor(
    private type: TokenType,
    private value: string,
  ) {

  }
}