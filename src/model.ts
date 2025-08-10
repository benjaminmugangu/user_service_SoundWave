import mongoose, { Document, Schema } from "mongoose"; // on importe mongoose, Document et Schema depuis mongoose. Document est une interface qui représente un document MongoDB et Schema est une classe qui permet de définir la structure d'un document MongoDB.
// on utilise mongoose pour interagir avec la base de données MongoDB, Document est utilisé pour typer les documents et Schema est utilisé pour définir la structure des documents dans la base de données.     

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: string;
  playlist: string[];
}

const schema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin", // Temporairement changé pour les tests
    },

    playlist: [
      {
        type: String,
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", schema);