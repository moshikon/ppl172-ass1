// // const sum: (t:number[])=>number = (arr)=>R.reduce(  ((x,y)=>x+y)  , 0  , arr)
//
// interface Tree<T> {
//     root: T;
//     children: Tree<T>[];
// }
//
// const makeLeaf : <T>(v:T)=>Tree<T> =
//     v => {return {root: v, children:[]};}
//
// const makeTree : <T>(v:T, children:Tree<T>[])=>Tree<T> =
//     (v, children) => { return {root:v, children:children}}
//
// const treeRoot : <T>(t: Tree<T>)=>T =
//     t => t.root;
//
// const treeChildren: <T>(t: Tree<T>)=>Tree<T>[] =
//     t => t.children;
//
// const treeLeaf : <T>(t: Tree<T>)=>boolean =
//     t => t.children.length === 0;
//
import {map, reduce, forEach} from 'ramda'
//
// const treeHeight : <T>(t:Tree<T>)=>number =
//     t => treeLeaf(t) ?
//             0 :
//             1 + reduce(Math.max, 0, map(treeHeight, treeChildren(t)));
//
// type Command<T> = (x:T)=>void;
// type Transformer<T1,T2> = (x:T1)=>T2;
// type Predicate<T> = (x:T)=>boolean;
// type Accumulator<T1,T2> = (acc:T1, item:T2)=>T1;
//
// const treeMap: <T1,T2>(f: Transformer<T1,T2>, tree: Tree<T1>)=>Tree<T2> =
//     (f, tree) => treeLeaf(tree) ?
//             makeLeaf(f(treeRoot(tree))) :
//             makeTree(f(treeRoot(tree)), map((tree) => treeMap(f, tree), treeChildren(tree)));
//
// // treeMap test 1
// // console.log(treeMap((x:number) => x*x, makeTree(1, [makeLeaf(2), makeLeaf(3)])))
//
// const treeForEachDF: <T>(f: Command<T>, tree: Tree<T>)=>void =
//     (f, tree) => {
//               if (treeLeaf(tree)){
//                 f(treeRoot(tree));
//               }else{
//                 forEach((tree) => treeForEachDF(f, tree), treeChildren(tree));
//                 f(treeRoot(tree));
//               }
//             }
//
// const treeReduceDF: <T1,T2>(f: Accumulator<T1,T2>, init: T1, tree: Tree<T2>)=>T1 =
//   (f, init, tree) =>
//         (treeLeaf(tree)?
//           f (init ,(treeRoot(tree))):
//           f (reduce((x, tree) => treeReduceDF(f, x ,tree) , init, treeChildren(tree)) ,(treeRoot(tree))));
//
//
// console.log(treeReduceDF<number, number>(Math.pow, 1, makeTree(1, [makeLeaf(2), makeLeaf(3)])))
//


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
    tag: "map";
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

// Answer 3.4
// @@@
const checkNumber: (jsValue:any)=>boolean =
    (jsValue) => typeof jsValue === "number"

const checkString: (jsValue:any)=>boolean =
    (jsValue) => typeof jsValue === "string"

const checkBoolean: (jsValue:any)=>boolean =
    (jsValue) => typeof jsValue === "boolean"

const checkArray: (jsValue:any, te:TeArray)=>boolean =
   (jsValue, te) =>  jsValue instanceof Array && reduce ((x, y)=>x&y, 1, map( (childJsValue) => typeCheck(childJsValue, teArrayItemType(te)), jsValue))

const checkMap: (jsValue:any, te:TeMap)=>boolean =
    (jsValue, te) => jsValue instanceof Object && reduce ((x, y)=>x&y, 1, map( (key) => typeCheck(jsValue[key], teMapKey(te, key)), Object.keys(jsValue)))

const typeCheck : (jsValue:any, te:TE)=>boolean =
    (jsValue, te) => {
      if (te===undefined) return false;
      if (isTeNumber(te)) {if(checkNumber(jsValue)) {return true} else {return false}}
      else if (isTeString(te)) {if(checkString(jsValue)) {return true} else {return false}}
      else if (isTeBoolean(te)) {if(checkBoolean(jsValue)) {return true} else {return false}}
      else{
        if (isTeArray(te)) {if(checkArray(jsValue, <TeArray>te)) {return true} else {return false}}
        else if (isTeMap(te)) {if(checkMap(jsValue, <TeMap>te)) {return true} else {return false}}
        else return false
      }
    }

let a : [any,any,any,any,any, void] = [1,2,3,4,5,void];
console.log(a)




















// // s
