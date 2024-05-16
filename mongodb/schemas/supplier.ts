import { ISupplierDocument } from "^/@types/models/supplier";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

type SchemaTypes = ISupplierDocument &
  mongoose.PaginateModel<ISupplierDocument>;

export const SupplierSchema = new Schema<ISupplierDocument>(
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
    supplierCode: {
      type: String,
      trim: true,
    },
    company: {
      type: String,
      trim: true,
      required: true,
    },
    managerName: {
      type: String,
      trim: true,
      // required: true,
    },
    managerSurname: {
      type: String,
      trim: true,
      // required: true,
    },
    bankAccount: {
      type: String,
      trim: true,
    },
    RC: {
      type: String,
      trim: true,
    },
    AI: {
      type: String,
      trim: true,
    },
    NIF: {
      type: String,
      trim: true,
    },
    NIS: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    tel: {
      type: String,
      trim: true,
      // required: true,
    },
    fax: {
      type: String,
      trim: true,
    },
    cell: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

SupplierSchema.plugin(paginate);

const Supplier =
  (mongoose.models?.Supplier as SchemaTypes) ??
  mongoose.model<ISupplierDocument, mongoose.PaginateModel<ISupplierDocument>>(
    "Supplier",
    SupplierSchema
  );

export default Supplier;
