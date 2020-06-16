/*
 
   d888        8888888b.     d8888  .d8888b.  8888888888      888      8888888 .d8888b.  8888888b.
  d8888        888   Y88b   d88888 d88P  Y88b 888             888        888  d88P  Y88b 888   Y88b
    888        888    888  d88P888 888    888 888             888        888  Y88b.      888    888
    888        888   d88P d88P 888 888        8888888         888        888   "Y888b.   888   d88P
    888        8888888P" d88P  888 888  88888 888             888        888      "Y88b. 8888888P"
    888        888      d88P   888 888    888 888             888        888        "888 888
    888        888     d8888888888 Y88b  d88P 888             888        888  Y88b  d88P 888
  8888888      888    d88P     888  "Y8888P88 8888888888      88888888 8888888 "Y8888P"  888
 
  Claes-Magnus Berg <claes-magnus@herebeseaswines.net>
 
 */

// Tokenize
function removeNoise(tokens) {
  return tokens.filter(
    token => token !== undefined && token.length > 0,
  );
}

function tokenize(input) {
  if (input.length === 0) {
    throw new Error('Unexpected EOF.');
  } else {
    return removeNoise(input.split(/(\()|(\))|\s+|(".+?")/));
  }
}

// Parse
function identifyType(token) {
  let tokenType = {};
  if (token[0] === '"') {
    tokenType = {
      type: 'string',
      value: token.slice(1, token.length - 1)
    };
  } else if (Number.isInteger(parseInt(token))) {
    tokenType = {
      type: 'number',
      value: parseInt(token)
    };
  } else if (token === '#t' || token === '#f') {
    tokenType = {
      type: 'boolean',
      value: token === '#t' ? true : false
    };
  } else {
    tokenType = {
      type: 'symbol',
      name: token
    };
  }
  return tokenType;
}

function parse(tokens, body = []) {
  if (tokens.length === 0) {
    return body.flat();
  }
  const token = tokens.shift();
  if (token === '(') {
    return parse(tokens, body.concat([parse(tokens, [])]));
  } else if (token === ')') {
    return body;
  } else {
    return parse(tokens, [...body, identifyType(token)]);
  }
}

// Evaluate
const HEAD = 0;

const standard_library = {
  '+': (...xs) => xs.reduce((a, b) => a + b),
  '-': (...xs) => xs.reduce((a, b) => a - b),
  '*': (...xs) => xs.reduce((a, b) => a * b),
  div: (x, y) => x / y,
  '>': (x, y) => x > y,
  '>=': (x, y) => x >= y,
  '<': (x, y) => x < y,
  '<=': (x, y) => x <= y,
  car: x => x[0],
  cdr: x => x.slice(1),
  len: x => x.length,
  cons: (...xs) => [...xs],
  'eq?': (x, y) => x === y,
  'empty?': (x) => x.length === 0,
  not: x => !x,
  or: (x, y) => x || y,
  and: (x, y) => x && y,
  append: (x, y) => y.length > 0 ? [...y, x] : [x],
  pop: (x) => x.length > 0? x.slice(0, x.length - 1) : []
};

function env(scope, parent) {
  return {
    scope,
    parent,
    get: symbol =>
      symbol in scope
        ? scope[symbol]
        : parent !== undefined && parent.get(symbol)
  };
}

const specialForms = {
  define: ([ _, fnBody, fnCall ], context) => {
    const localEnv = env(standard_library, context);
    for (let [ { _, name }, expression ] of fnBody) {
      localEnv.scope[name] = evaluate(expression, context);
    }
    return evaluate(fnCall, localEnv);
  },
  lambda: (
    [ _, fnBody, fnCall ], 
    context
  ) => (...lambdaArguments) => {
    const lambdaScope = fnBody.reduce(
      (acc, { _, name }, i) => ({
        ...acc,
        [name]: lambdaArguments[i]
      }),
      {}
    );
    return evaluate(fnCall, env(lambdaScope, context));
  },
  'if': ([_, condition, consquence, alternative], context) => {
    const expression = evaluate(condition, context)
      ? consquence
      : alternative;
    return evaluate(expression, context);
  },
  'quote': ( [_, expression], context) => evaluate(expression, context)
};

function evaluate(input, context = env(standard_library)) {
  if (input === undefined) {
    return;
  } else if (Array.isArray(input)) {
    if (input.length > 0 && input[HEAD].name in specialForms) {
      return specialForms[input[HEAD].name](input, context);
    } else {
      const evaluatedList = input.map(x => evaluate(x, context));
      if (evaluatedList[HEAD] instanceof Function) {
        const [fn, ...list] = evaluatedList;
        return fn(...list);
      } else {
        return evaluatedList;
      }
    }
  } else if (input.type === 'symbol') {
    return context.get(input.name);
  } else if (
    input.type === 'number' ||
    input.type === 'string' ||
    input.type === 'boolean'
  ) {
    return input.value;
  } else {
    throw new Error('Unallowed character');
  }
}

function interpret(input) {
  return evaluate(parse(tokenize(input)));
}

module.exports = {
  tokenize,
  parse,
  evaluate,
  interpret
};
