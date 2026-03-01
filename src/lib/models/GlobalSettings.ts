import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGlobalSettings extends Document {
  cvUrl: string; // The primary/selected CV URL
  activeCategory: string; // The ID of the currently active category (e.g. "frontend")
  cvLinks: {
    frontend: string;
    backend: string;
    fullstack: string;
    mernstack: string;
    react: string;
  };
  updatedAt: Date;
}

const GlobalSettingsSchema = new Schema<IGlobalSettings>(
  {
    cvUrl: { type: String, default: "" },
    activeCategory: { type: String, default: "" },
    cvLinks: {
      frontend: { type: String, default: "" },
      backend: { type: String, default: "" },
      fullstack: { type: String, default: "" },
      mernstack: { type: String, default: "" },
      react: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const GlobalSettings: Model<IGlobalSettings> =
  mongoose.models.GlobalSettings || mongoose.model<IGlobalSettings>("GlobalSettings", GlobalSettingsSchema);

export default GlobalSettings;
