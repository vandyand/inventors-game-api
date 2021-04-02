var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const Router = require("express-promise-router");
const db = require("../db");
const router = new Router();
module.exports = router;
router.get("/", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { rows } = yield db.query("SELECT * FROM pieces");
        res.send(rows);
    }
    catch (e) {
        console.log(e);
    }
}));
router.get("/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { rows } = yield db.query(`SELECT * FROM pieces where id = ${req.params.id}`);
        res.send(rows);
    }
    catch (e) {
        console.log(e);
    }
}));
router.get("/code/:code", (req, res) => {
    db.query(`SELECT * FROM pieces where code = '${req.params.code}'`)
        .then((result) => res.send(result.rows))
        .catch((err) => console.log(err.message));
});
//# sourceMappingURL=pieces.js.map