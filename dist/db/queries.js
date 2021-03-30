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
exports.getBoards = void 0;
const pg_1 = require("pg");
// export const dbConnect = () => {
//   const;
// };
const getBoards = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = new pg_1.Client();
    yield client.connect();
    client
        .query("SELECT * FROM boards")
        .then((res) => console.log(res))
        .catch((e) => console.log(e));
    yield client.end();
});
exports.getBoards = getBoards;
//# sourceMappingURL=queries.js.map