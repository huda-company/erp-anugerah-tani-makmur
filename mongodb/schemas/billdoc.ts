import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import Purchase from "./purchase";
import { IBillDocDocument } from "^/@types/models/billdoc";

type SchemaTypes = IBillDocDocument & mongoose.PaginateModel<IBillDocDocument>;

export const BillDocSchema = new Schema<IBillDocDocument>(
  {
    purchase: {
      type: String,
      ref: Purchase,
      required: true,
      autopopulate: true,
    },
    fileName: {
      type: String,
    },
    title: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

BillDocSchema.plugin(paginate);

const Billdoc =
  (mongoose.models?.Billdoc as SchemaTypes) ??
  mongoose.model<IBillDocDocument, mongoose.PaginateModel<IBillDocDocument>>(
    "Billdoc",
    BillDocSchema
  );

export default Billdoc;
