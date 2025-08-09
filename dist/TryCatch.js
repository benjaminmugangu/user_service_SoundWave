"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TryCatch = (handler) => {
    // Cette fonction retourne un middleware qui gère les erreurs de manière centralisée.
    return async (req, res, next) => {
        try {
            await handler(req, res, next); // on appelle le handler passé en paramètre avec les paramètres req, res et next.
        }
        catch (error) { // on attrape les erreurs qui peuvent survenir lors de l'exécution du handler.
            res.status(500).json({
                message: error.message,
            });
        }
    };
};
exports.default = TryCatch;
