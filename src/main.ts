import { readFile, readdir } from 'fs/promises'
import { Lexer } from './Lexer';

(async () => {
  // Get all files ending in .pseudo from the current directory

  const files = (await readdir('./'))

  files
    .filter(file => file.endsWith('.pseudo'))
    .filter(Boolean)
    .forEach(async file => {
      const source = await readFile(file, 'utf8');
      const lexer = new Lexer(source)
      console.log(lexer.tokens)
    })
})();