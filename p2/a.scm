#lang racket
(define map
  (lambda (f l)
    (if (empty? l)
        '()
        (cons (f (car l))
                 (map f(cdr l))))))

(define reduce
  (lambda (f l n)
    (if (empty? l)
        n
        (reduce f (cdr l) (f n (car l))))))

(define for_each
  (lambda (f l)
    (if (empty? l)
        (void)
        (begin (f (car l)) (newline) (for_each f (cdr l))))))


(define res (map (lambda (x) (* x x)) '(1 2 3 4)))
(for_each display res)
(reduce (lambda (x y) (+ x y)) res 0)
