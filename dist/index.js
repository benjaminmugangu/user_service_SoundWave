"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const route_js_1 = __importDefault(require("./route.js"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const connectDb = async () => {
    try {
        mongoose_1.default.connect(process.env.MONGO_URI, {
            dbName: "Spotify",
        });
        console.log("Mongo Db Connected");
    }
    catch (error) {
        console.log(error);
    }
};
const app = (0, express_1.default)(); // ici on crée une instance d'express
app.use((0, cors_1.default)()); // ici on utilise le middleware cors pour permettre les requêtes cross-origin, ca permet de faire des requêtes depuis le frontend
app.use(express_1.default.json()); // ici on utilise le middleware express.json() pour parser les requêtes JSON
app.use("/api/v1", route_js_1.default); // ici on utilise les routes définies dans le fichier route.js, toutes les routes commenceront par /api/v1
app.get("/", (req, res) => {
    res.send("Server is working"); // ici on envoie une réponse au client
});
const port = process.env.PORT || 5000; // ici on définit le port sur lequel le serveur va écouter, si le port n'est pas défini dans les variables d'environnement, on utilise le port 5000
app.listen(5000, () => {
    console.log(`Server is running on port ${port}`);
    connectDb(); // ici on appelle la fonction connectDb pour se connecter à la base de données MongoDB
});
