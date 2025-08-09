import { NextFunction, Request, RequestHandler, Response } from "express"; // on importe les types nécessaires pour la fonction TryCatch, ils sont utilisés pour typer les paramètres de la fonction.

const TryCatch = (handler: RequestHandler): RequestHandler => { // on crée une fonction TryCatch qui prend en paramètre un handler de type RequestHandler, qui est une fonction qui prend en paramètre req, res et next.
  // Cette fonction retourne un middleware qui gère les erreurs de manière centralisée.
  return async (req: Request, res: Response, next: NextFunction) => {// on retourne une fonction asynchrone qui prend en paramètre req, res et next, // req est de type Request, res est de type Response et next est de type NextFunction. nextfunction est une fonction qui permet de passer au middleware suivant.
    try {
      await handler(req, res, next); 
    } catch (error: any) { 
      res.status(500).json({ 
        message: error.message,
      });
    }
  };
};

export default TryCatch; 