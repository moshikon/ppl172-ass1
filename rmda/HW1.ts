
const invokeN1 = (f, n) => 
    n === 0 ? (x) => x : (x) => f(invokeN1(f,n-1)(x))

interface Tree<T> {
    root: T;
    children: Tree<T>[];
}

{
    let b: Tree<number> = {
        root: 1,
        children: [
            {root: 2, children: []},
            {root: 3, children: [
                {root: 4, children:[]}
            ]}
        ]
    }
    b;
}

const makeLeaf : <T>(v:T)=>Tree<T> =
    v => {return {root: v, children:[]};}
    
const makeTree : <T>(v:T, children:Tree<T>[])=>Tree<T> =
    (v, children) => { return {root:v, children:children}}

const treeRoot : <T>(t: Tree<T>)=>T =
    t => t.root;

const treeChildren: <T>(t: Tree<T>)=>Tree<T>[] =
    t => t.children;
    
const treeLeaf : <T>(t: Tree<T>)=>boolean =
    t => t.children.length === 0;

treeLeaf(makeLeaf(5))

import {map, reduce} from 'ramda'

const treeHeight : <T>(t:Tree<T>)=>number =
    t => treeLeaf(t) ? 
            0 : 
            1 + reduce(Math.max, 0, map(treeHeight, treeChildren(t)));
            
treeHeight(makeTree(1, [makeLeaf(2), makeLeaf(3)]))

treeHeight({ root: 1, children: [ { root: 2, children: [] }, { root: 3, children: [{root: 4, children:[]}] } ] })

type Command<T> = (x:T)=>void;
type Transformer<T1,T2> = (x:T1)=>T2;
type Predicate<T> = (x:T)=>boolean;
type Accumulator<T1,T2> = (acc:T1, item:T2)=>T1;

// Answer 2.1
const treeMap: <T1,T2>(f: Transformer<T1,T2>, tree: Tree<T1>)=>Tree<T2> =
    (f, tree) => treeLeaf(tree) ?
            makeLeaf(f(treeRoot(tree))) :
            makeTree(f(treeRoot(tree)), treeChildren(tree).map((tree) => treeMap(f, tree)));

// treeMap test 1
import * as assert from 'assert';
let tree1 = makeTree(1, [makeLeaf(2), makeLeaf(3)]);
assert.deepEqual(treeMap((x:number) => x*x, tree1), { root: 1, children: [ { root: 4, children: [] }, { root: 9, children: [] } ] } , "test1");
"all ok";

// treeMap test 2
let tree2 = makeTree("a", [makeLeaf("aa"), makeLeaf("aaa")]);
assert.deepEqual(treeMap((s:string) => s.length , tree2), { root: 1, children: [ { root: 2, children: [] }, { root: 3, children: [] } ] } , "test2");
"all ok";

// treeMap test 3
let tree3 = makeTree("aaaa", []);
assert.deepEqual(treeMap((s:string) => s.length , tree3), { root: 4, children: [] } , "test3");
"all ok";

// treeMap test 4
let tree4 = makeTree(1,  [ makeTree(2, [makeLeaf(3), makeLeaf(4)]) , makeTree(5, [makeLeaf(6), makeLeaf(7)])  ]   );
let newTree = treeMap((x:number) => x*x, tree4)
assert.deepEqual(newTree.children[1].children[1].root, 49 , "test4");
"all ok";

// Answer 2.2 
const treeForEachDF: <T>(f: Command<T>, tree: Tree<T>)=>void =
    (f, tree) => {
              if (treeLeaf(tree)){
                f(treeRoot(tree));
              }else{
                f(treeRoot(tree));
                treeChildren(tree).forEach((tree) => treeForEachDF(f, tree));
              }
            }

// treeForEachDF test 1
let i=0
treeForEachDF( () => {++i}, makeTree(1,[]))
assert.ok(i === 1)
"all ok"

// treeForEachDF test 2
let tmp ="DFS - ";
treeForEachDF((x) => {tmp=tmp+x}, makeTree("v",[makeTree("e", [makeLeaf("ry "), makeLeaf("g")]) , makeTree("o", [makeLeaf("o"), makeLeaf("d!!")])]))
assert.ok(tmp === "DFS - very good!!")
"all ok"

// treeForEachDF test 3
let j=2
treeForEachDF((x) => {j=j+x}, makeTree(1,[makeTree(2, [makeLeaf(3), makeLeaf(4)]) , makeTree(5, [makeLeaf(6), makeLeaf(7)])]))
assert.ok(j === 30)
"all ok"

// treeForEachDF test 4
let tree = makeTree(1,[makeTree(2, [makeLeaf(3), makeLeaf(4)]) , makeTree(5, [makeLeaf(6), makeLeaf(7)])])
let k=0
treeForEachDF( () => {++k}, tree)
assert.ok(k === 7)
"all ok"

const treeReduceDF: <T1,T2>(f: Accumulator<T1,T2>, init: T1, tree: Tree<T2>)=>T1 =
  (f, init, tree) =>
        (treeLeaf(tree))?
          f (init ,(treeRoot(tree))):
          treeChildren(tree).reduce((x, tree) => treeReduceDF(f, x ,tree) , f (init ,(treeRoot(tree))));

// treeReduceDF test 1
assert.ok(6 === treeReduceDF<number, number>((x, y)=>x+y, 0, makeTree(1, [makeLeaf(2), makeLeaf(3)])))
"all ok"

// treeReduceDF test 2
assert.ok("DFS - OK!" === treeReduceDF<string, string>((x, y)=>x+y, "DFS - ", makeTree("O", [makeLeaf("K"), makeLeaf("!")])))
"all ok"

// treeReduceDF test 3
assert.ok(128 === treeReduceDF<number, number>((x, y)=>x*y, 1,  makeTree(2,[makeTree(2, [makeLeaf(2), makeLeaf(2)]) , makeTree(2, [makeLeaf(2), makeLeaf(2)])])));
"all ok"

// treeReduceDF test 4
assert.ok(33343 === treeReduceDF<number, number>(Math.max, -1000, makeTree(-4,[makeTree(2525, [makeLeaf(44), makeLeaf(0)]) , makeTree(1212, [makeLeaf(33343), makeLeaf(5)])])));
"all ok"

// We adopt the Disjoint Union type pattern discussed in class.

type TE = TeNumber | TeBoolean | TeString | TeArray | TeMap;

// Atomic type expressions have no component
interface TeNumber {
    tag: "number";
};
interface TeBoolean {
    tag: "boolean";
};
interface TeString {
    tag: "string";
};

// Concrete representation of an Array Type Expression
interface TeArray {
    tag: "array";
    itemType: TE;
};

// ANSWER 3.1: Complete the type definition
interface TeMap {
    tag: "map",
    keys: String[],
    types: TE[]
};

// Constructors
// ============
const makeTeString : ()=>TeString = 
    () => { return {tag:"string"}}

const makeTeNumber : ()=>TeNumber =
    () => { return {tag:"number"}}

const makeTeBoolean : ()=>TeBoolean =
    () => { return {tag:"boolean"}}

const makeTeArray : (itemType: TE)=>TeArray =
    itemType => { return {tag: "array", itemType: itemType}}

const makeTeMap : (keys: String[], types: TE[])=>TeMap =
    (keys, types) => { return {tag: "map", keys: keys, types:types}}


// Type predicates
// ===============
const isTeNumber : (te:TE)=>boolean =
    te => te.tag === "number";

const isTeBoolean : (te:TE)=>boolean =
    te => te.tag === "boolean";

const isTeString : (te:TE)=>boolean =
    te => te.tag === "string";

const isTeArray : (te:TE)=>boolean =
    te => te.tag === "array";

const isTeMap : (te:TE)=>boolean =
    te => te.tag === "map";


// Accessors
// =========
const teArrayItemType : (tea : TeArray)=>TE =
    tea => tea.itemType;

const teMapKey : (tem : TeMap, key: string)=> TE =
    (tem, key) => tem.types[tem.keys.indexOf(key)]

// Test constructors
assert.deepEqual({tag:"string"}, makeTeString() , "test1");
assert.deepEqual({tag:"boolean"}, makeTeBoolean() , "test1");
assert.deepEqual({tag:"number"}, makeTeNumber() , "test1");
assert.deepEqual({tag:"array", itemType:{tag:"string"}}, makeTeArray(makeTeString()) , "test1");
assert.deepEqual({tag:"map", keys:["a"], types:[{tag:"string"}]}, makeTeMap(["a"],[makeTeString()]) , "test1");
"all ok"

let obj1 = makeTeMap(["a", "b", "c"],[makeTeString(), makeTeArray(makeTeNumber()), makeTeMap(["c1", "c2"],[makeTeBoolean(), makeTeArray(makeTeArray(makeTeString()))])])
// Test accessors
assert.deepEqual(teMapKey(obj1, "a"), makeTeString() , "test1");
assert.deepEqual(teMapKey(obj1, "b"), makeTeArray(makeTeNumber()) , "test1");
assert.deepEqual(teMapKey(obj1, "c"), makeTeMap(["c1", "c2"],[makeTeBoolean(), makeTeArray(makeTeArray(makeTeString()))]) , "test1");
assert.deepEqual(teMapKey(<TeMap>teMapKey(obj1, "c"), "c1"), makeTeBoolean() , "test1");
assert.deepEqual(teMapKey(<TeMap>teMapKey(obj1, "c"), "c2"), makeTeArray(makeTeArray(makeTeString())) , "test1");
"all ok"

// Answer 3.4
const checkNumber: (jsValue:any)=>boolean =
    (jsValue) => typeof jsValue === "number"

const checkString: (jsValue:any)=>boolean =
    (jsValue) => typeof jsValue === "string"

const checkBoolean: (jsValue:any)=>boolean =
    (jsValue) => typeof jsValue === "boolean"

const checkArray: (jsValue:any, te:TeArray)=>boolean =
   (jsValue, te) =>  jsValue instanceof Array && jsValue.map( (childJsValue) => typeCheck(childJsValue, teArrayItemType(te))).reduce ((x, y)=>x&&y, true)

const checkMap: (jsValue:any, te:TeMap)=>boolean =
    (jsValue, te) => jsValue instanceof Object && Object.keys(jsValue).map( (key) => typeCheck(jsValue[key], teMapKey(te, key))).reduce ((x, y)=>x&&y, true)

const typeCheck : (jsValue:any, te:TE)=>boolean =
    (jsValue, te) => {
      switch (true){
        case (te===undefined): return false;
        case isTeNumber(te): return checkNumber(jsValue);
        case isTeString(te): return checkString(jsValue);
        case isTeBoolean(te): return checkBoolean(jsValue);
        case isTeArray(te): return checkArray(jsValue, <TeArray>te);
        case isTeMap(te): return checkMap(jsValue, <TeMap>te);
        default: return false;
      }
    }

// Test typeCheck with 10 good tests covering the code in increasing order of complexity.
// Make sure to test positive and negative cases (cases where typeCheck returns true and false).
// Test 0
assert.ok(true === typeCheck("test", makeTeString()));
"all ok"

// Test 1
assert.ok(true === typeCheck(true, makeTeBoolean()));
"all ok"

// Test 2
assert.ok(true === typeCheck(9, makeTeNumber()));
"all ok"

// Test 3
assert.ok(false === typeCheck(false, makeTeString()));
"all ok"

// Test 4
assert.ok(true === typeCheck([1,2,3], makeTeArray(makeTeNumber())));
"all ok"

// Test 5
assert.ok(false === typeCheck([1,2,3], makeTeArray(makeTeString())));
"all ok"

// Test 6
assert.ok(true === typeCheck([[90],[80],[90]], makeTeArray(makeTeArray(makeTeNumber()))));
"all ok"

// Test 7
assert.ok(true === typeCheck({a:8, b:"8"}, makeTeMap(["a", "b"],[makeTeNumber(), makeTeString()])));
"all ok"

// Test 8
assert.ok(false === typeCheck({a:8, c:"8"}, makeTeMap(["a", "b"],[makeTeNumber(), makeTeString()])));
"all ok"

// Test 9
// { a:string; b:number[]; c:{c1:boolean; c2:string[][]}}
let obj2 = makeTeMap(["a", "b", "c"],[makeTeString(), makeTeArray(makeTeNumber()), makeTeMap(["c1", "c2"],[makeTeBoolean(), makeTeArray(makeTeArray(makeTeString()))])])
assert.ok(true === typeCheck({a:"123", b:[1,2,3], c:{c1:false, c2:[["o","k"],["g","o","o","d"]]}}, obj2));
"all ok"
