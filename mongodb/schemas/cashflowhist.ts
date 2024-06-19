import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
import Purchase from "./purchase";
import { ICashflowHistDocument } from "^/@types/models/cashflowhist";
import Cashflow from "./cashflow";

type SchemaTypes = ICashflowHistDocument &
  mongoose.PaginateModel<ICashflowHistDocument>;

export const CashflowHistSchema = new Schema<ICashflowHistDocument>(
  {
    cashflowId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Cashflow,
      require: true,
      autopopulate: true,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Purchase,
      autopopulate: true,
    },
    amount: {
      type: Number,
      default: 0,
      require: true,
    },
    type: {
      type: String,
      default: "",
      require: true,
    },
    ref: {
      type: String,
      default: "",
      require: true,
    },
    detail: {
      type: String,
      default: "",
      require: true,
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
    date: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

CashflowHistSchema.plugin(paginate);
CashflowHistSchema.plugin(autopopulate);

const Cashflowhist =
  (mongoose.models?.Cashflowhist as SchemaTypes) ??
  mongoose.model<
    ICashflowHistDocument,
    mongoose.PaginateModel<ICashflowHistDocument>
  >("Cashflowhist", CashflowHistSchema);

export default Cashflowhist;
