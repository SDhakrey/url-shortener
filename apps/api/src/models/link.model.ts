import { model, Schema } from "mongoose";
import type { InferSchemaType } from "mongoose";

const linkSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
      maxlength: 24,
    },
    destination: {
      type: String,
      required: true,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  },
);

export type Link = InferSchemaType<typeof linkSchema>;

export const LinkModel = model("Link", linkSchema);

