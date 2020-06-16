from one_page_lisp import compile_one_page_lisp

logo = """
  __    _____        _____ ______    _      _____  _____ _____  
 /_ |  |  __ \ /\   / ____|  ____|  | |    |_   _|/ ____|  __ \ 
  | |  | |__) /  \ | |  __| |__     | |      | | | (___ | |__) |
  | |  |  ___/ /\ \| | |_ |  __|    | |      | |  \___ \|  ___/ 
  | |  | |  / ____ \ |__| | |____   | |____ _| |_ ____) | |     
  |_|  |_| /_/    \_\_____|______|  |______|_____|_____/|_|     


  by claes-magnus <claes-magnus@herebeseaswines.net>, 2020

  --------------------------------------------------------------

  READ-EVALUATE-PRINT-LOOP

  ...or type 'help' or 'exit'

"""

print(logo)
while True:
    code = input('> ')
    if code == 'exit':
        break
    elif code == 'help':
        print("""
  --------------------------------------------------------------
  Some examples:

  > (= (+ 4 4)(* 2 4))
  True
  
  > (- (* (* (+ 1 1 1 1)(+ 3 3)) 2) 6)
  42

  --------------------------------------------------------------
                """)
    else:
        print(compile_one_page_lisp(code))

