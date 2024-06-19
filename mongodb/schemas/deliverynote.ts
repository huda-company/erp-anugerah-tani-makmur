import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import Paymentpurchase from "./paymentpurchase";
import Purchase from "./purchase";
import { IDelivNoteDocument } from "^/@types/models/deliverynote";

type SchemaTypes = IDelivNoteDocument &
  mongoose.PaginateModel<IDelivNoteDocument>;

export const DelivNoteSchema = new Schema<IDelivNoteDocument>(
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

DelivNoteSchema.plugin(paginate);

const Deliverynote =
  (mongoose.models?.Deliverynote as SchemaTypes) ??
  mongoose.model<
    IDelivNoteDocument,
    mongoose.PaginateModel<IDelivNoteDocument>
  >("Deliverynote", DelivNoteSchema);

export default Deliverynote;
