"use strict";
exports.__esModule = true;
var invokeN1 = function (f, n) {
    return n === 0 ? function (x) { return x; } : function (x) { return f(invokeN1(f, n - 1)(x)); };
};
{
    var b = {
        root: 1,
        children: [
            { root: 2, children: [] },
            { root: 3, children: [
                    { root: 4, children: [] }
                ] }
        ]
    };
    b;
}
var makeLeaf = function (v) { return { root: v, children: [] }; };
var makeTree = function (v, children) { return { root: v, children: children }; };
var treeRoot = function (t) { return t.root; };
var treeChildren = function (t) { return t.children; };
var treeLeaf = function (t) { return t.children.length === 0; };
treeLeaf(makeLeaf(5));
var ramda_1 = require("ramda");
var treeHeight = function (t) { return treeLeaf(t) ?
    0 :
    1 + ramda_1.reduce(Math.max, 0, ramda_1.map(treeHeight, treeChildren(t))); };
treeHeight(makeTree(1, [makeLeaf(2), makeLeaf(3)]));
treeHeight({ root: 1, children: [{ root: 2, children: [] }, { root: 3, children: [{ root: 4, children: [] }] }] });
// Answer 2.1
var treeMap = function (f, tree) { return treeLeaf(tree) ?
    makeLeaf(f(treeRoot(tree))) :
    makeTree(f(treeRoot(tree)), treeChildren(tree).map(function (tree) { return treeMap(f, tree); })); };
// treeMap test 1
var assert = require("assert");
var tree1 = makeTree(1, [makeLeaf(2), makeLeaf(3)]);
assert.deepEqual(treeMap(function (x) { return x * x; }, tree1), { root: 1, children: [{ root: 4, children: [] }, { root: 9, children: [] }] }, "test1");
"all ok";
// treeMap test 2
var tree2 = makeTree("a", [makeLeaf("aa"), makeLeaf("aaa")]);
assert.deepEqual(treeMap(function (s) { return s.length; }, tree2), { root: 1, children: [{ root: 2, children: [] }, { root: 3, children: [] }] }, "test2");
"all ok";
// treeMap test 3
var tree3 = makeTree("aaaa", []);
assert.deepEqual(treeMap(function (s) { return s.length; }, tree3), { root: 4, children: [] }, "test3");
"all ok";
// treeMap test 4
var tree4 = makeTree(1, [makeTree(2, [makeLeaf(3), makeLeaf(4)]), makeTree(5, [makeLeaf(6), makeLeaf(7)])]);
var newTree = treeMap(function (x) { return x * x; }, tree4);
assert.deepEqual(newTree.children[1].children[1].root, 49, "test4");
"all ok";
// Answer 2.2 
var treeForEachDF = function (f, tree) {
    if (treeLeaf(tree)) {
        f(treeRoot(tree));
    }
    else {
        f(treeRoot(tree));
        treeChildren(tree).forEach(function (tree) { return treeForEachDF(f, tree); });
    }
};
// treeForEachDF test 1
var i = 0;
treeForEachDF(function () { ++i; }, makeTree(1, []));
assert.ok(i === 1);
"all ok";
// treeForEachDF test 2
var tmp = "DFS - ";
treeForEachDF(function (x) { tmp = tmp + x; }, makeTree("v", [makeTree("e", [makeLeaf("ry "), makeLeaf("g")]), makeTree("o", [makeLeaf("o"), makeLeaf("d!!")])]));
assert.ok(tmp === "DFS - very good!!");
"all ok";
// treeForEachDF test 3
var j = 2;
treeForEachDF(function (x) { j = j + x; }, makeTree(1, [makeTree(2, [makeLeaf(3), makeLeaf(4)]), makeTree(5, [makeLeaf(6), makeLeaf(7)])]));
assert.ok(j === 30);
"all ok";
// treeForEachDF test 4
var tree = makeTree(1, [makeTree(2, [makeLeaf(3), makeLeaf(4)]), makeTree(5, [makeLeaf(6), makeLeaf(7)])]);
var k = 0;
treeForEachDF(function () { ++k; }, tree);
assert.ok(k === 7);
"all ok";
var treeReduceDF = function (f, init, tree) {
    return (treeLeaf(tree)) ?
        f(init, (treeRoot(tree))) :
        treeChildren(tree).reduce(function (x, tree) { return treeReduceDF(f, x, tree); }, f(init, (treeRoot(tree))));
};
// treeReduceDF test 1
assert.ok(6 === treeReduceDF(function (x, y) { return x + y; }, 0, makeTree(1, [makeLeaf(2), makeLeaf(3)])));
"all ok";
// treeReduceDF test 2
assert.ok("DFS - OK!" === treeReduceDF(function (x, y) { return x + y; }, "DFS - ", makeTree("O", [makeLeaf("K"), makeLeaf("!")])));
"all ok";
// treeReduceDF test 3
assert.ok(128 === treeReduceDF(function (x, y) { return x * y; }, 1, makeTree(2, [makeTree(2, [makeLeaf(2), makeLeaf(2)]), makeTree(2, [makeLeaf(2), makeLeaf(2)])])));
"all ok";
// treeReduceDF test 4
assert.ok(33343 === treeReduceDF(Math.max, -1000, makeTree(-4, [makeTree(2525, [makeLeaf(44), makeLeaf(0)]), makeTree(1212, [makeLeaf(33343), makeLeaf(5)])])));
"all ok";
;
;
;
;
;
// Constructors
// ============
var makeTeString = function () { return { tag: "string" }; };
var makeTeNumber = function () { return { tag: "number" }; };
var makeTeBoolean = function () { return { tag: "boolean" }; };
var makeTeArray = function (itemType) { return { tag: "array", itemType: itemType }; };
var makeTeMap = function (keys, types) { return { tag: "map", keys: keys, types: types }; };
// Type predicates
// ===============
var isTeNumber = function (te) { return te.tag === "number"; };
var isTeBoolean = function (te) { return te.tag === "boolean"; };
var isTeString = function (te) { return te.tag === "string"; };
var isTeArray = function (te) { return te.tag === "array"; };
var isTeMap = function (te) { return te.tag === "map"; };
// Accessors
// =========
var teArrayItemType = function (tea) { return tea.itemType; };
var teMapKey = function (tem, key) { return tem.types[tem.keys.indexOf(key)]; };
// Test constructors
assert.deepEqual({ tag: "string" }, makeTeString(), "test1");
assert.deepEqual({ tag: "boolean" }, makeTeBoolean(), "test1");
assert.deepEqual({ tag: "number" }, makeTeNumber(), "test1");
assert.deepEqual({ tag: "array", itemType: { tag: "string" } }, makeTeArray(makeTeString()), "test1");
assert.deepEqual({ tag: "map", keys: ["a"], types: [{ tag: "string" }] }, makeTeMap(["a"], [makeTeString()]), "test1");
"all ok";
var obj1 = makeTeMap(["a", "b", "c"], [makeTeString(), makeTeArray(makeTeNumber()), makeTeMap(["c1", "c2"], [makeTeBoolean(), makeTeArray(makeTeArray(makeTeString()))])]);
// Test accessors
assert.deepEqual(teMapKey(obj1, "a"), makeTeString(), "test1");
assert.deepEqual(teMapKey(obj1, "b"), makeTeArray(makeTeNumber()), "test1");
assert.deepEqual(teMapKey(obj1, "c"), makeTeMap(["c1", "c2"], [makeTeBoolean(), makeTeArray(makeTeArray(makeTeString()))]), "test1");
assert.deepEqual(teMapKey(teMapKey(obj1, "c"), "c1"), makeTeBoolean(), "test1");
assert.deepEqual(teMapKey(teMapKey(obj1, "c"), "c2"), makeTeArray(makeTeArray(makeTeString())), "test1");
"all ok";
// Answer 3.4
var checkNumber = function (jsValue) { return typeof jsValue === "number"; };
var checkString = function (jsValue) { return typeof jsValue === "string"; };
var checkBoolean = function (jsValue) { return typeof jsValue === "boolean"; };
var checkArray = function (jsValue, te) { return jsValue instanceof Array && jsValue.map(function (childJsValue) { return typeCheck(childJsValue, teArrayItemType(te)); }).reduce(function (x, y) { return x && y; }, true); };
var checkMap = function (jsValue, te) { return jsValue instanceof Object && Object.keys(jsValue).map(function (key) { return typeCheck(jsValue[key], teMapKey(te, key)); }).reduce(function (x, y) { return x && y; }, true); };
var typeCheck = function (jsValue, te) {
    switch (true) {
        case (te === undefined): return false;
        case isTeNumber(te): return checkNumber(jsValue);
        case isTeString(te): return checkString(jsValue);
        case isTeBoolean(te): return checkBoolean(jsValue);
        case isTeArray(te): return checkArray(jsValue, te);
        case isTeMap(te): return checkMap(jsValue, te);
        default: return false;
    }
};
// Test typeCheck with 10 good tests covering the code in increasing order of complexity.
// Make sure to test positive and negative cases (cases where typeCheck returns true and false).
// Test 0
assert.ok(true === typeCheck("test", makeTeString()));
"all ok";
// Test 1
assert.ok(true === typeCheck(true, makeTeBoolean()));
"all ok";
// Test 2
assert.ok(true === typeCheck(9, makeTeNumber()));
"all ok";
// Test 3
assert.ok(false === typeCheck(false, makeTeString()));
"all ok";
// Test 4
assert.ok(true === typeCheck([1, 2, 3], makeTeArray(makeTeNumber())));
"all ok";
// Test 5
assert.ok(false === typeCheck([1, 2, 3], makeTeArray(makeTeString())));
"all ok";
// Test 6
assert.ok(true === typeCheck([[90], [80], [90]], makeTeArray(makeTeArray(makeTeNumber()))));
"all ok";
// Test 7
assert.ok(true === typeCheck({ a: 8, b: "8" }, makeTeMap(["a", "b"], [makeTeNumber(), makeTeString()])));
"all ok";
// Test 8
assert.ok(false === typeCheck({ a: 8, c: "8" }, makeTeMap(["a", "b"], [makeTeNumber(), makeTeString()])));
"all ok";
// Test 9
// { a:string; b:number[]; c:{c1:boolean; c2:string[][]}}
var obj2 = makeTeMap(["a", "b", "c"], [makeTeString(), makeTeArray(makeTeNumber()), makeTeMap(["c1", "c2"], [makeTeBoolean(), makeTeArray(makeTeArray(makeTeString()))])]);
assert.ok(true === typeCheck({ a: "123", b: [1, 2, 3], c: { c1: false, c2: [["o", "k"], ["g", "o", "o", "d"]] } }, obj2));
"all ok";
