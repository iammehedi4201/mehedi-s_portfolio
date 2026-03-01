import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProject extends Document {
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  category: string;
  liveUrl: string;
  githubUrl: string;
  order: number;
  status: "published" | "draft";
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    techStack: { type: [String], default: [] },
    category: { type: String, required: true },
    liveUrl: { type: String, default: "" },
    githubUrl: { type: String, default: "" },
    order: { type: Number, default: 0 },
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Index for filtering published projects
ProjectSchema.index({ status: 1, deletedAt: 1 });
ProjectSchema.index({ category: 1 });

const Project: Model<IProject> =
  mongoose.models.Project || mongoose.model<IProject>("Project", ProjectSchema);

export default Project;
