import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IPickupDocDocument, PickupDocType } from "^/@types/models/pickupdoc";
import Paymentpurchase from "./paymentpurchase";
import Purchase from "./purchase";

type SchemaTypes = IPickupDocDocument &
  mongoose.PaginateModel<IPickupDocDocument>;

export const PickupDocSchema = new Schema<IPickupDocDocument>(
  {
    removed: {
      type: String,
      default: "",
    },
    removedBy: {
      type: String,
      default: "",
    },
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: Object.values(PickupDocType),
      required: true,
    },
    paymentPurchase: {
      type: mongoose.Schema.ObjectId,
      ref: Paymentpurchase,
      required: true,
      autopopulate: true,
    },
    purchase: {
      type: mongoose.Schema.ObjectId,
      ref: Purchase,
      required: true,
      autopopulate: true,
    },
    note: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    vehicleType: {
      type: String,
      default: "",
    },
    flatNo: {
      type: String,
      default: "",
    },
    driverLicenseNo: {
      type: String,
      default: "",
    },
    driverName: {
      type: String,
      default: "",
    },
    doTotal: {
      type: Number,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
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

PickupDocSchema.plugin(paginate);

const Pickupdoc =
  (mongoose.models?.Pickupdoc as SchemaTypes) ??
  mongoose.model<
    IPickupDocDocument,
    mongoose.PaginateModel<IPickupDocDocument>
  >("Pickupdoc", PickupDocSchema);

export default Pickupdoc;
