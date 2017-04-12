#lang racket
(define abs
  (lambda
    (x)
      (if
        (> x 0)
         x
         (- x))))
(abs -2)
