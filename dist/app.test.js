"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const chai = require("chai");
const chaiHttp = require("chai-http");
require("mocha");
chai.use(chaiHttp);
const expect = chai.expect;
describe("Hello API Request", () => {
    it("should return hello on call", () => __awaiter(void 0, void 0, void 0, function* () {
        return chai
            .request(app_1.default)
            .get("/")
            .then((res) => {
            chai.expect(res.text).to.eql("Hi");
        });
    }));
});
//# sourceMappingURL=app.test.js.map