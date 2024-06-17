import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import autopopulate from "mongoose-autopopulate";
import { ISupplierStockDocument } from "^/@types/models/supplierstock";
import Item from "./item";
import Supplier from "./supplier";

type SchemaTypes = ISupplierStockDocument &
  mongoose.PaginateModel<ISupplierStockDocument>;

export const SupplierStockSchema = new Schema<ISupplierStockDocument>(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: Item,
      require: true,
      autopopulate: true,
    },
    supplier: {
      type: String,
      ref: Supplier,
      require: true,
      autopopulate: true,
    },
    stock: {
      type: Number,
      default: 0,
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
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

SupplierStockSchema.plugin(paginate);
SupplierStockSchema.plugin(autopopulate);

const Supplierstock =
  (mongoose.models?.Supplierstock as SchemaTypes) ??
  mongoose.model<
    ISupplierStockDocument,
    mongoose.PaginateModel<ISupplierStockDocument>
  >("Supplierstock", SupplierStockSchema);

export default Supplierstock;
