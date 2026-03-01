import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAnalyticsEvent extends Document {
  type: "view" | "click";
  projectId?: mongoose.Types.ObjectId;
  page?: string;
  referrer?: string;
  userAgent?: string;
  createdAt: Date;
}

const AnalyticsEventSchema = new Schema<IAnalyticsEvent>(
  {
    type: { type: String, enum: ["view", "click"], required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", default: null },
    page: { type: String, default: "" },
    referrer: { type: String, default: "" },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true }
);

AnalyticsEventSchema.index({ type: 1 });
AnalyticsEventSchema.index({ createdAt: -1 });
AnalyticsEventSchema.index({ projectId: 1, type: 1 });

const AnalyticsEvent: Model<IAnalyticsEvent> =
  mongoose.models.AnalyticsEvent ||
  mongoose.model<IAnalyticsEvent>("AnalyticsEvent", AnalyticsEventSchema);

export default AnalyticsEvent;
