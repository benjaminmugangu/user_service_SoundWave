"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_js_1 = require("./controller.js");
const middleware_js_1 = require("./middleware.js");
const router = express_1.default.Router();
router.post("/user/register", controller_js_1.registerUser);
router.post("/user/login", controller_js_1.loginUser);
router.get("/user/me", middleware_js_1.isAuth, controller_js_1.myProfile); // on utilise le middleware isAuth pour protéger la route myProfile
router.post("/song/:id", middleware_js_1.isAuth, controller_js_1.addToPlaylist); // on utilise le middleware isAuth pour protéger la route addToPlaylist
exports.default = router; // on exporte le router pour l'utiliser dans le fichier index.ts et pour le tester, on peut également l'importer dans d'autres fichiers si nécessaire.
