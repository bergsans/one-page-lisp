import unittest
from one_page_lisp import tokenize, parse, evaluate

class TestOnePageLisp(unittest.TestCase):
    
    def test_no_input(self):
        self.assertEqual(tokenize(''), [])
    
    def test_tokenize(self):
        self.assertEqual(
            tokenize('(+ 1 1 10 "Hello, world!")'),
            [
                '(', 
                '+',
                '1',
                '1',
                '10',
                '"Hello, world!"',
                ')'
            ])

    def test_parser(self):
        self.assertEqual(
            parse(
                tokenize('(+ (+ 2 (+ 3 4 4 3 3)) 4)')
            ),
            [{'type': 'identifier',  'name': '+'},
                [
                    { 'type': 'identifier',  'name': '+'},
                    { 'type': 'integer', 'value': 2},
                        [
                            { 'type': 'identifier',  'name': '+'},
                            { 'type': 'integer', 'value': 3},
                            { 'type': 'integer', 'value': 4},
                            { 'type': 'integer', 'value': 4},
                            { 'type': 'integer', 'value': 3},
                            { 'type': 'integer', 'value': 3}]],
                        {'type': 'integer', 'value': 4}]
            ) 

    def test_evaluate_sum(self):
        self.assertEqual(evaluate(parse(tokenize('(+ (+ 1 2 3)(+ 1 2 3))'))), 12)

    def test_evaluate_substraction(self):
        self.assertEqual(evaluate(parse(tokenize('(- 4 3)'))), 1)

    def test_evaluate_multiplication(self):
        self.assertEqual(evaluate(parse(tokenize('(* 3 3)'))), 9)

    def test_evaluate_division(self):
        self.assertEqual(evaluate(parse(tokenize('(div 4 2)'))), 2)

    def test_evaluate_composite(self):
        self.assertEqual(evaluate(parse(tokenize('(* 2 (- (+ (div 4 2) 2) 2))'))), 4)

    def test_evaluate_equals(self):
        self.assertEqual(evaluate(parse(tokenize('(= 2 (+ 1 1))'))), True)

    def test_evaluate_not_equals(self):
        self.assertEqual(evaluate(parse(tokenize('(!= 5 (+ 2 2))'))), True)

    @unittest.skip('Work in progress')
    def test_evaluate_define(self):
        output = evaluate(parse(tokenize('(define ((sum (lambda (x y) (+ x y)))) (sum 4 4))')))
        print(object)
        self.assertEqual(output, 2)

if __name__ == '__main__':
    unittest.main()
