import { AuthenticatedRequest } from "./middleware.js"; // on importe AuthenticatedRequest pour typer la requête dans les fonctions du controller.
import { Request, Response } from "express"; // on importe Request et Response pour typer les paramètres des fonctions du controller.
import { IUser } from "./model.js"; // on importe l'interface IUser pour typer les utilisateurs dans les fonctions du controller.
import { User } from "./model.js"; // on importe le modèle User pour interagir avec la base de données MongoDB.
import { isValidObjectId } from "mongoose"; // on importe isValidObjectId pour vérifier si un ID est valide avant de l'utiliser dans les requêtes à la base de données.
import TryCatch from "./TryCatch.js"; // on importe la fonction TryCatch pour gérer les erreurs de manière centralisée dans les fonctions du controller.
import dotenv from "dotenv"; // on importe dotenv pour charger les variables d'environnement depuis le fichier .env.
import bcrypt from "bcrypt"; // on importe bcrypt pour hasher les mots de passe des utilisateurs lors de l'inscription et de la connexion.
import jwt from "jsonwebtoken"; // on importe jsonwebtoken pour générer des tokens JWT lors de l'inscription et de la connexion des utilisateurs.

export const registerUser = TryCatch(async (req, res) => { // on crée une fonction registerUser pour gérer l'inscription des utilisateurs.
  const { name, email, password } = req.body; // on récupère les données de l'utilisateur depuis le corps de la requête.
  let user = await User.findOne({ email }); // on vérifie si un utilisateur avec le même email existe déjà dans la base de données.

  if (user) {
    res.status(400).json({ // si l'utilisateur existe déjà, on envoie une réponse avec un statut 400 (Bad Request) et un message d'erreur.
      message: "User Already exists",
    });

    return;
  }

  const hashPassword = await bcrypt.hash(password, 10); // on hashe le mot de passe de l'utilisateur avec bcrypt pour le stocker de manière sécurisée dans la base de données, 10 est le nombre de tours de hachage.

  user = await User.create({ // on crée un nouvel utilisateur avec les données fournies dans la requête.
    name,
    email,
    password: hashPassword,
  });
  console.log("JWT_SEC:", process.env.JWT_SEC); 
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, { // on génère un token JWT pour l'utilisateur nouvellement créé, le token contient l'ID de l'utilisateur et est signé avec une clé secrète stockée dans les variables d'environnement.
    expiresIn: "7d",
  });

  res.status(201).json({ 
    message: "User Registered",
    user,
    token,
  });
});

export const loginUser = TryCatch(async (req, res) => {     
  const { email, password } = req.body; // on récupère les données de l'utilisateur depuis le corps de la requête.

  const user = await User.findOne({ email }); // on cherche l'utilisateur dans la base de données par son email.

  if (!user) {
    res.status(404).json({
      message: "User not exists",
    });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password); // on compare le mot de passe fourni avec le mot de passe hashé dans la base de données.

  if (!isMatch) {  
    res.status(400).json({
      message: "Invalid Password",
    });
    return;
  }

  const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC as string, {
    expiresIn: "7d",
  });

  res.status(200).json({
    message: "Logged IN",
    user,
    token,
  });
});

export const myProfile = TryCatch(async (req: AuthenticatedRequest, res) => {
  const user = req.user;

  res.json(user);
});

export const addToPlaylist = TryCatch( // on crée une fonction addToPlaylist pour ajouter ou supprimer une chanson de la playlist de l'utilisateur.
  async (req: AuthenticatedRequest, res) => { // on utilise AuthenticatedRequest pour typer la requête et s'assurer que l'utilisateur est authentifié.
    const userId = req.user?._id; // on récupère l'ID de l'utilisateur authentifié depuis la requête.

    const user = await User.findById(userId); // on cherche l'utilisateur dans la base de données par son ID.

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

      res.json({ // on envoie une réponse JSON avec un message indiquant que la chanson a été supprimée de la playlist.
        message: " Removed from playlist",
      });
      return;
    }

    user.playlist.push(req.params.id); // si l'ID de la chanson n'est pas dans la playlist de l'utilisateur, on l'ajoute à la playlist.

    await user.save(); // on sauvegarde les modifications de l'utilisateur dans la base de données.

    res.json({
      message: "Added to PlayList",
    });
  }
);