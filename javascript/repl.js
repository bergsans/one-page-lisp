const {createInterface } = require('readline');

const {interpret} = require('./one-page-lisp.js');

const repl = createInterface({
  input: process.stdin,
  output: process.stdout
});
const { helpMsg, onePageLispMsg } = getHelpTexts();

const commands = {
  ':exit': () => process.exit(0),
  ':help': () => console.log(helpMsg)
};

console.log(onePageLispMsg);

(function main() {
  repl.question('> ', input => {
    input in commands
      ? commands[input]()
      : handleUserInput(input);
    main();
  });
})();

function handleUserInput(input) {
  try {
    console.log(interpret(input));
  } catch(e) {
    console.log(e);
  }
}

function getHelpTexts() {
  const onePageLispMsg = `
   d888        8888888b.     d8888  .d8888b.  8888888888      888      8888888 .d8888b.  8888888b.
  d8888        888   Y88b   d88888 d88P  Y88b 888             888        888  d88P  Y88b 888   Y88b
    888        888    888  d88P888 888    888 888             888        888  Y88b.      888    888
    888        888   d88P d88P 888 888        8888888         888        888   "Y888b.   888   d88P
    888        8888888P" d88P  888 888  88888 888             888        888      "Y88b. 8888888P"
    888        888      d88P   888 888    888 888             888        888        "888 888
    888        888     d8888888888 Y88b  d88P 888             888        888  Y88b  d88P 888
  8888888      888    d88P     888  "Y8888P88 8888888888      88888888 8888888 "Y8888P"  888

  by claes-magnus <claes-magnus@herebeseaswines.net>, 2020

  --------------------------------------------------------------

  READ-EVALUATE-PRINT-LOOP

  ...or type ':help' or ':exit'


`;

  const helpMsg = `
--------------------------------------------------------------
Some examples:

> (eq? (+ 4 4)(* 2 4))
True

> (- (* (* (+ 1 1 1 1)(+ 3 3)) 2) 6)
42

> (define ((double (lambda (x) (+ x x)))) (double 4))
8
--------------------------------------------------------------
`;
  return {onePageLispMsg, helpMsg};
}
