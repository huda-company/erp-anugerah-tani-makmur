import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
import Purchase from "./purchase";
import { IStockHistDocument } from "^/@types/models/stockhist";
import Stock from "./stock";
import Pickupdoc from "./pickupdoc";

type SchemaTypes = IStockHistDocument &
  mongoose.PaginateModel<IStockHistDocument>;

export const StockHistSchema = new Schema<IStockHistDocument>(
  {
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Stock,
      require: true,
      autopopulate: true,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Purchase,
      autopopulate: true,
    },
    pickupDoc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Pickupdoc,
      autopopulate: true,
    },
    number: {
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

StockHistSchema.plugin(paginate);
StockHistSchema.plugin(autopopulate);

const Stockhist =
  (mongoose.models?.Stockhist as SchemaTypes) ??
  mongoose.model<
    IStockHistDocument,
    mongoose.PaginateModel<IStockHistDocument>
  >("Stockhist", StockHistSchema);

export default Stockhist;
