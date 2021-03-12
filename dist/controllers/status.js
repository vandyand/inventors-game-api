"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.awesome = exports.hello = exports.hi = void 0;
let hi = (req, res) => {
    res.send("hello");
};
exports.hi = hi;
let hello = (req, res) => {
    res.send("how's it going?");
};
exports.hello = hello;
let awesome = (req, res) => {
    res.send("EVERYTHING IS AWESOME");
};
exports.awesome = awesome;
//# sourceMappingURL=status.js.map