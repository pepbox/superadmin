import { IAdmin } from "../types/admin";
import { Schema, model } from "mongoose";

const adminSchema: Schema<IAdmin> = new Schema<IAdmin>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Admin = model<IAdmin>("Admin", adminSchema);
