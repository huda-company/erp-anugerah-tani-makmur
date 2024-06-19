import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
import Branch from "./branch";
import { ICashflowDocument } from "^/@types/models/cashflow";

type SchemaTypes = ICashflowDocument &
  mongoose.PaginateModel<ICashflowDocument>;

export const CashflowSchema = new Schema<ICashflowDocument>(
  {
    branch: {
      type: String,
      ref: Branch,
      require: true,
      autopopulate: true,
    },
    balance: {
      type: Number,
      default: 0,
      require: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
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
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

CashflowSchema.plugin(paginate);
CashflowSchema.plugin(autopopulate);

const Cashflow =
  (mongoose.models?.Cashflow as SchemaTypes) ??
  mongoose.model<ICashflowDocument, mongoose.PaginateModel<ICashflowDocument>>(
    "Cashflow",
    CashflowSchema
  );

export default Cashflow;
