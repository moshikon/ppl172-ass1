"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var ramda_1 = require("ramda");
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
// Answer 3.4
// @@@
var checkNumber = function (jsValue) { return typeof jsValue === "number"; };
var checkString = function (jsValue) { return typeof jsValue === "string"; };
var checkBoolean = function (jsValue) { return typeof jsValue === "boolean"; };
var checkArray = function (jsValue, te) { return jsValue instanceof Array && ramda_1.reduce(function (x, y) { return x & y; }, 1, ramda_1.map(function (childJsValue) { return typeCheck(childJsValue, teArrayItemType(te)); }, jsValue)); };
var checkMap = function (jsValue, te) { return jsValue instanceof Object && ramda_1.reduce(function (x, y) { return x & y; }, 1, ramda_1.map(function (key) { return typeCheck(jsValue[key], teMapKey(te, key)); }, Object.keys(jsValue))); };
var typeCheck = function (jsValue, te) {
    if (te === undefined)
        return false;
    if (isTeNumber(te)) {
        if (checkNumber(jsValue)) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (isTeString(te)) {
        if (checkString(jsValue)) {
            return true;
        }
        else {
            return false;
        }
    }
    else if (isTeBoolean(te)) {
        if (checkBoolean(jsValue)) {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (isTeArray(te)) {
            if (checkArray(jsValue, te)) {
                return true;
            }
            else {
                return false;
            }
        }
        else if (isTeMap(te)) {
            if (checkMap(jsValue, te)) {
                return true;
            }
            else {
                return false;
            }
        }
        else
            return false;
    }
};
var a = Number.MAX_VALUE * 2;
;
console.log(a);
// // s
