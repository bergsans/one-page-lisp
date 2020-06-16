```

 d888        8888888b.     d8888  .d8888b.  8888888888      888      8888888 .d8888b.  8888888b.  
d8888        888   Y88b   d88888 d88P  Y88b 888             888        888  d88P  Y88b 888   Y88b 
  888        888    888  d88P888 888    888 888             888        888  Y88b.      888    888 
  888        888   d88P d88P 888 888        8888888         888        888   "Y888b.   888   d88P 
  888        8888888P" d88P  888 888  88888 888             888        888      "Y88b. 8888888P"  
  888        888      d88P   888 888    888 888             888        888        "888 888        
  888        888     d8888888888 Y88b  d88P 888             888        888  Y88b  d88P 888        
8888888      888    d88P     888  "Y8888P88 8888888888      88888888 8888888 "Y8888P"  888        
                                                                                                  
```

Small Lisp interpreter with REPL. Can handle Lisp expression such as:

```
(define ((factorial (lambda (x) 
	(if (<= x 1) 
		1 
		(* x (factorial (- x 1))))))) 

(factorial 6))
```

## Try it
```
// install dependencies
$ npm install

// tests
$ npm test or npm run watch

// repl
$ node repl
```
