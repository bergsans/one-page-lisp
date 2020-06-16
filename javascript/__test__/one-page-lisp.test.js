const { 
  tokenize, 
  parse, 
  evaluate, 
  interpret 
} = require('../one-page-lisp');

describe('Tokenize', () => {
  test('No input', () => {
    expect(() => tokenize('')).toThrow(Error('Unexpected EOF.')); 
  });

  test('1', () => {
    expect(tokenize('1')).toEqual([ '1' ]);
  });

  test('"Hello, Lisp!"', () => {
    expect(tokenize('"Hello, Lisp!"')).toEqual([ '\"Hello, Lisp!\"' ]);
  });

  test('()', () => {
    expect(tokenize('()')).toEqual([ '(', ')' ]);
  });

  test('(1 2 3)', () => {
    expect(tokenize('(1 2 3)')).toEqual([ '(', '1', '2', '3', ')' ]);
  });
});

describe('Parse', () => {
  test('(1 2)', () => {
    expect(parse(tokenize('(1 2)'))).toEqual([ 
      { 'type': 'number', 'value': 1 },
      { 'type': 'number', 'value': 2 }
    ]);
  });

  test('(1 (2))', () => {
    expect(parse(tokenize('(1 (2))'))).toEqual([ 
      { 'type': 'number', 'value': 1 },
      [{ 'type': 'number', 'value': 2 }]
    ]);
  });

  test('("Hello, Lisp!")', () => {
    expect(parse(tokenize('("Hello, Lisp!")'))).toEqual([ 
      { 'type': 'string', 'value': 'Hello, Lisp!' }
    ]);
  });
});

describe('Evaluate atom & basic expressions', () => {

  test('(quote 1)', () => {
    expect(interpret('(quote 1)')).toEqual(1);
  });

  test('(quote "Hello, Lisp!")', () => {
    expect(interpret('(quote "Hello, Lisp!")')).toEqual('Hello, Lisp!');
  });

  test('((quote 1 2 3))', () => {
    expect(interpret('(quote (1 2 3))')).toEqual([1, 2, 3]);
  });

  test('(+ 1 2 3)', () => {
    expect(interpret('(+ 1 2 3)')).toEqual(6);
  });

  test('(+ 1 2 3 (- 10 6))', () => {
    expect(interpret('(+ 1 2 3 (- 10 6))')).toEqual(10);
  });

  test('(- 10 8 2)', () => {
    expect(interpret('(- 10 8 2)')).toEqual(0);
  });

  test('(* 1 2 3 (- 10 6))', () => {
    expect(interpret('(* 1 2 3 (- 10 6))')).toEqual(24);
  });

  test('(append 4 (1 2 3)))', () => {
    expect(interpret('(append 4 (1 2 3))')).toEqual([1, 2, 3, 4]);
  });

  test('(append 4 ()))', () => {
    expect(interpret('(append 4 ())')).toEqual([4]);
  });

  test('(pop (1 2 3)))', () => {
    expect(interpret('(pop (1 2 3))')).toEqual([1, 2]);
  });

  test('(empty? (1 2 3)))', () => {
    expect(interpret('(empty? (1 2 3))')).toEqual(false);
  });

  test('(empty? ()))', () => {
    expect(interpret('(empty? ())')).toEqual(true);
  });

  test('(* 10 10)', () => {
    expect(interpret('(* 10 10)')).toEqual(100);
  });

  test('(div 100 10)', () => {
    expect(interpret('(div 100 10)')).toEqual(10);
  });

  test('(+ (- 5 4) (- 5 4))', () => {
    expect(interpret('(+ (- 5 4) (- 5 4))')).toEqual(2);
  });

  test('(car (quote (1 2 3)))', () => {
    expect(interpret('(car (quote (1 2 3)))')).toEqual(1);
  });

  test('(cdr (quote (1 2 3)))', () => {
    expect(interpret('(cdr (quote (1 2 3)))')).toEqual([2, 3]);
  });

  test('(len (quote (1 2 3 4 5)))', () => {
    expect(interpret('(len (quote (1 2 3 4 5)))')).toEqual(5);
  });

  test('(cons 1 2 3))', () => {
    expect(interpret('(cons 1 2 3)')).toEqual([1, 2, 3]);
  });
  
  test('(eq? 4 4)', () => {
    expect(interpret('(eq? (+ 2 2) 4)')).toEqual(true);
  });

  test('(eq? #t #f)', () => {
    expect(interpret('(eq? #t #f)')).toEqual(false);
  });

  test('(eq? (and #t #t) #f)', () => {
    expect(interpret('(eq? (and #t #t) #f)')).toEqual(false);
  });

  test('(eq? (or #f #t) #t)', () => {
    expect(interpret('(eq? (or #f #t) #t)')).toEqual(true);
  });
  
  test('(eq? (> 1 2) #f)', () => {
    expect(interpret('(eq? (> 1 2) #f)')).toEqual(true);
  });
  
  test('(eq? (>= 2 2) #t)', () => {
    expect(interpret('(eq? (>= 2 2) #t)')).toEqual(true);
  });
  test('(eq? (< 1 2) #t)', () => {
    expect(interpret('(eq? (< 1 2) #t)')).toEqual(true);
  });
  
  test('(eq? (<= 1 2) #f)', () => {
    expect(interpret('(eq? (<= 1 2) #f)')).toEqual(false);
  });
  
  test('(if (> 1 2) #t #f)', () => {
    expect(interpret('(if (> 1 2) #t #f)')).toEqual(false);
  });
  
  test('(if (> 3 2) #t #f)', () => {
    expect(interpret('(if (> 3 2) #t #f)')).toEqual(true);
  });

  test('define symbols', () => {
    expect(interpret('(define ((name "tux")) (quote name))')).toEqual('tux');
    expect(interpret('(define ((list-of-names ("tux" "nolok"))) (quote list-of-names))')).toEqual([ 'tux', 'nolok' ]);
    expect(interpret('(define ((a 3)) (quote a))')).toEqual(3);
  });
});

describe('Evaluate composite expressions', () => {

  test('(define ((sum (lambda (x y) (+ x y)))) (sum 4 4))', () => {
    const code = `
(define ((sum (lambda (x y) (+ x y)))) 

(sum 4 4))`;
	  expect(interpret(code)).toEqual(8);
  });

  test('recursion (factorial))', () => {
    const code = `
(define ((factorial (lambda (x) 
	(if (<= x 1) 
		1 
		(* x (factorial (- x 1))))))) 

(factorial 10))`;
    const res = interpret(code);
    expect(res).toEqual(3628800);
  });

  test('(add-one (add-one 2))', () => {
    const code = `
(define ((add-one (lambda (x) 
	(+ x 1)))) 

(add-one (add-one 2)))`;
    expect(interpret(code)).toEqual(4);
  });

  test('higher-order function', () => {
    const code = `
((define ((add-one (lambda (x) 
	(+ x 1)))))

(define ((increase-to-peano-style (lambda (value-from value-to inc-fn) 
	(if (eq? value-from value-to) 
	value-from 
	(increase-to-peano-style (inc-fn value-from) value-to inc-fn))))))

(increase-to-peano-style 10 21 add-one))`;

    const output = interpret(code);
    // output -> [undefined, undefined, 21]
    // since defined epxressions return undefined, and two such
    // expressions are defined
    const [ 
      _resultFromAddOne, 
      _resultFromIncreaseTo, 
      result
    ] = output;
    expect(result).toEqual(21);
  });
});
