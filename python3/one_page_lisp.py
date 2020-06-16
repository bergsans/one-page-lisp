"""
 d888        8888888b.     d8888  .d8888b.  8888888888      888      8888888 .d8888b.  8888888b.
d8888        888   Y88b   d88888 d88P  Y88b 888             888        888  d88P  Y88b 888   Y88b 
  888        888    888  d88P888 888    888 888             888        888  Y88b.      888    888 
  888        888   d88P d88P 888 888        8888888         888        888   "Y888b.   888   d88P 
  888        8888888P" d88P  888 888  88888 888             888        888      "Y88b. 8888888P"  
  888        888      d88P   888 888    888 888             888        888        "888 888        
  888        888     d8888888888 Y88b  d88P 888             888        888  Y88b  d88P 888        
8888888      888    d88P     888  "Y8888P88 8888888888      88888888 8888888 "Y8888P"  888        

"""
__author__ = "claes-magnus <claes-magnus@herebeseaswines.net>"
__version__ = "0.0.1"
__license__ = "MIT"


from re import compile, split
from functools import reduce

HEAD = 0

# tokenize

def remove_noise(temp_token):
    return filter(None, temp_token)

def format_code(input):
    return list(
            remove_noise(
                split(
                    compile('(\()|(\))|\s+|(".+?")'), 
                    input)))

def tokenize(input):
    return [] if len(input) == 0 else format_code(input)

# parse
def identify_type(token):
    if token[HEAD] == '"':
        return {'type': 'string', 'value': token}
    elif token.isnumeric():
        return {'type': 'integer', 'value': int(token)}
    else:
        return {'type': 'identifier', 'name': token}

def flatten_one_level(list):
    return [item for sublist in list for item in sublist]

def parse(tokens):
    if len(tokens) == 0:
        raise ValueError('EOF')

    def _parse(_tokens, body):
        if len(_tokens) == 0:
            return flatten_one_level(body)
        token = _tokens.pop(0)
        if token == '(':
            return _parse(_tokens, body + [_parse(_tokens, [])])
        elif token == ')':
            return body
        else:
            return _parse(_tokens, body + [identify_type(token)])
    return _parse(tokens, [])

# Evaluate
lib = {
    '+': lambda *xs: reduce(lambda a, b: a + b, xs),
    '-': lambda *xs: reduce(lambda a, b: a - b, xs),
    'div': lambda x, y: int(x / y),
    '*': lambda x, y: x * y,
    '=': lambda x, y: x == y,
    '!=': lambda x, y: x != y,
    '&': lambda x, y: x and y,
    'car': lambda arr: arr[0]        
}

def context(scope, parent):
    return {
        'scope': scope,
        'parent': parent,
        'get': lambda id: scope[id] if id in scope else parent.get(id)
    }

def define(input, ctx):
    [ _, fnBody, fnCall] = input
    localEnv = context(lib, ctx)
    for [ token, expression ] in fnBody:
        localEnv['scope'][token['name']] = evaluate(expression, ctx)
    return evaluate(fnCall, localEnv)

def updateScope(fnBody, args):
    scope = {}
    for i, expr in enumerate(fnBody):
        scope.update({ expr['name']: args[i] })
    return scope

def _lambda(input, ctx):
    [ _, fnBody, fnCall] = input
    print(fnBody)
    return lambda *args: evaluate(fnCall, context(updateScope(fnBody, list(args)), ctx))

def _if(input, ctx):
    [_, cond, consq, alt] = input
    expression = consq if evaluate(cond, ctx) else alt
    return evaluate(expression, ctx)

special_forms = {
    'define': define,
    'lambda': _lambda,
    'if': _if,
    'quote': lambda input, ctx: evaluate(input[1], ctx)
}

def evaluate(input, ctx=context(lib, None)):
    if input == None:
        return
    elif isinstance(input, list):
        if len(input) > 0 and input[HEAD]['name'] in special_forms:
            return special_forms[input[HEAD]['name']](input, ctx)
        else:
            evaluated_list = list(map(lambda x: evaluate(x, ctx), input))
            if callable(evaluated_list[HEAD]):
                [ fn, *list_of_expr ] = evaluated_list
                return fn(*list_of_expr)
            else:
                return evaluated_list
    elif input['type'] == 'identifier':
        return ctx['get'](input['name'])
    elif input['type'] == 'integer' or input['type'] == 'string':
        return input['value']

def interpret(expression):
    return evaluate(parse(tokenize(expression)))
