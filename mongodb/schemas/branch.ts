import { IBranchDocument } from "^/@types/models/branch";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

type SchemaTypes = IBranchDocument & mongoose.PaginateModel<IBranchDocument>;

export const BranchSchema = new Schema<IBranchDocument>(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

BranchSchema.plugin(paginate);

const Branch =
  (mongoose.models?.Branch as SchemaTypes) ??
  mongoose.model<IBranchDocument, mongoose.PaginateModel<IBranchDocument>>(
    "Branch",
    BranchSchema
  );

export default Branch;
