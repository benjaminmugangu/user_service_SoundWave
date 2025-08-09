"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addToPlaylist = exports.myProfile = exports.loginUser = exports.registerUser = void 0;
const model_js_1 = require("./model.js"); // on importe le modèle User pour interagir avec la base de données MongoDB.
const TryCatch_js_1 = __importDefault(require("./TryCatch.js")); // on importe la fonction TryCatch pour gérer les erreurs de manière centralisée dans les fonctions du controller.
const bcrypt_1 = __importDefault(require("bcrypt")); // on importe bcrypt pour hasher les mots de passe des utilisateurs lors de l'inscription et de la connexion.
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // on importe jsonwebtoken pour générer des tokens JWT lors de l'inscription et de la connexion des utilisateurs.
exports.registerUser = (0, TryCatch_js_1.default)(async (req, res) => {
    const { name, email, password } = req.body; // on récupère les données de l'utilisateur depuis le corps de la requête.
    let user = await model_js_1.User.findOne({ email }); // on vérifie si un utilisateur avec le même email existe déjà dans la base de données.
    if (user) {
        res.status(400).json({
            message: "User Already exists",
        });
        return;
    }
    const hashPassword = await bcrypt_1.default.hash(password, 10); // on hashe le mot de passe de l'utilisateur avec bcrypt pour le stocker de manière sécurisée dans la base de données, 10 est le nombre de tours de hachage.
    user = await model_js_1.User.create({
        name,
        email,
        password: hashPassword,
    });
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SEC, {
        expiresIn: "7d",
    });
    res.status(201).json({
        message: "User Registered",
        user,
        token,
    });
});
exports.loginUser = (0, TryCatch_js_1.default)(async (req, res) => {
    const { email, password } = req.body; // on récupère les données de l'utilisateur depuis le corps de la requête.
    const user = await model_js_1.User.findOne({ email }); // on cherche l'utilisateur dans la base de données par son email.
    if (!user) {
        res.status(404).json({
            message: "User not exists",
        });
        return;
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password); // on compare le mot de passe fourni avec le mot de passe hashé dans la base de données.
    if (!isMatch) {
        res.status(400).json({
            message: "Invalid Password",
        });
        return;
    }
    const token = jsonwebtoken_1.default.sign({ _id: user._id }, process.env.JWT_SEC, {
        expiresIn: "7d",
    });
    res.status(200).json({
        message: "Logged IN",
        user,
        token,
    });
});
exports.myProfile = (0, TryCatch_js_1.default)(async (req, res) => {
    const user = req.user;
    res.json(user);
});
exports.addToPlaylist = (0, TryCatch_js_1.default)(// on crée une fonction addToPlaylist pour ajouter ou supprimer une chanson de la playlist de l'utilisateur.
async (req, res) => {
    const userId = req.user?._id; // on récupère l'ID de l'utilisateur authentifié depuis la requête.
    const user = await model_js_1.User.findById(userId); // on cherche l'utilisateur dans la base de données par son ID.
    if (!user) { // si l'utilisateur n'existe pas, on envoie une réponse avec un statut 404 (Not Found) et un message d'erreur.
        res.status(404).json({
            message: "NO user with this id",
        });
        return;
    }
    if (user?.playlist.includes(req.params.id)) { // ca c'est une condition ternaire, si l'ID de la chanson est déjà dans la playlist de l'utilisateur, on la supprime de la playlist.
        const index = user.playlist.indexOf(req.params.id); // on récupère l'index de l'ID de la chanson dans la playlist de l'utilisateur.
        user.playlist.splice(index, 1); // on supprime l'ID de la chanson de la playlist de l'utilisateur.
        await user.save(); // on sauvegarde les modifications de l'utilisateur dans la base de données.
        res.json({
            message: " Removed from playlist",
        });
        return;
    }
    user.playlist.push(req.params.id); // si l'ID de la chanson n'est pas dans la playlist de l'utilisateur, on l'ajoute à la playlist.
    await user.save(); // on sauvegarde les modifications de l'utilisateur dans la base de données.
    res.json({
        message: "Added to PlayList",
    });
});
