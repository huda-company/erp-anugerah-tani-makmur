import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
import Item from "./item";
import { IStockDocument } from "^/@types/models/stock";
import Branch from "./branch";

type SchemaTypes = IStockDocument & mongoose.PaginateModel<IStockDocument>;

export const StockSchema = new Schema<IStockDocument>(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Item,
      require: true,
      autopopulate: true,
    },
    branch: {
      type: String,
      ref: Branch,
      require: true,
      autopopulate: true,
    },
    stock: {
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

StockSchema.plugin(paginate);
StockSchema.plugin(autopopulate);

const Stock =
  (mongoose.models?.Stock as SchemaTypes) ??
  mongoose.model<IStockDocument, mongoose.PaginateModel<IStockDocument>>(
    "Stock",
    StockSchema
  );

export default Stock;
