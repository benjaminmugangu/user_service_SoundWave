import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRoutes from "./route.js";
import cors from "cors";

dotenv.config();

const connectDb = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "spotify",
    });

    console.log("Mongo Db Connected");
  } catch (error) {
    console.log(error);
  }
};

const app = express();// ici on crée une instance d'express

app.use(cors()); // ici on utilise le middleware cors pour permettre les requêtes cross-origin, ca permet de faire des requêtes depuis le frontend

app.use(express.json()); // ici on utilise le middleware express.json() pour parser les requêtes JSON

app.use("/api/v1", userRoutes);// ici on utilise les routes définies dans le fichier route.js, toutes les routes commenceront par /api/v1

app.get("/", (req, res) => { // ici on définit une route GET pour la racine de l'application
  res.send("Server is working");// ici on envoie une réponse au client
});

const port = process.env.PORT || 5000; // ici on définit le port sur lequel le serveur va écouter, si le port n'est pas défini dans les variables d'environnement, on utilise le port 5000

app.listen(5000, () => {
  console.log(`Server is running on port ${port}`);
  connectDb(); // ici on appelle la fonction connectDb pour se connecter à la base de données MongoDB
});