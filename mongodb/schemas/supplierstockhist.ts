import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
import { ISupplierStockHistDocument } from "^/@types/models/supplierstockhist";
import Supplierstock from "./supplierstock";
import Purchase from "./purchase";

type SchemaTypes = ISupplierStockHistDocument &
  mongoose.PaginateModel<ISupplierStockHistDocument>;

export const SupplierStockHistSchema = new Schema<ISupplierStockHistDocument>(
  {
    suppStockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Supplierstock,
      require: true,
      autopopulate: true,
    },
    purchase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Purchase,
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

SupplierStockHistSchema.plugin(paginate);
SupplierStockHistSchema.plugin(autopopulate);

const Supplierstockhist =
  (mongoose.models?.Supplierstockhist as SchemaTypes) ??
  mongoose.model<
    ISupplierStockHistDocument,
    mongoose.PaginateModel<ISupplierStockHistDocument>
  >("Supplierstockhist", SupplierStockHistSchema);

export default Supplierstockhist;
