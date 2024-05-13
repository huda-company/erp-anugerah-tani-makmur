import { IUnitDocument } from "^/@types/models/unit";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

type SchemaTypes = IUnitDocument & mongoose.PaginateModel<IUnitDocument>;

export const UnitSchema = new Schema<IUnitDocument>(
  {
    removed: {
      type: String,
      default: "",
    },
    removedBy: {
      type: String,
      default: "",
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

UnitSchema.plugin(paginate);

const Unit =
  (mongoose.models?.Unit as SchemaTypes) ??
  mongoose.model<IUnitDocument, mongoose.PaginateModel<IUnitDocument>>(
    "Unit",
    UnitSchema
  );

export default Unit;
