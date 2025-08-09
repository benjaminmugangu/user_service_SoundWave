import express from "express";
import { //on importe les fonctions du controller
  addToPlaylist, 
  loginUser, 
  myProfile, 
  registerUser, 
} from "./controller.js";
import { isAuth } from "./middleware.js"; 

const router = express.Router();

router.post("/user/register", registerUser);
router.post("/user/login", loginUser); 
router.get("/user/me", isAuth, myProfile); // on utilise le middleware isAuth pour protéger la route myProfile
router.post("/song/:id", isAuth, addToPlaylist); // on utilise le middleware isAuth pour protéger la route addToPlaylist

export default router; // on exporte le router pour l'utiliser dans le fichier index.ts et pour le tester, on peut également l'importer dans d'autres fichiers si nécessaire.