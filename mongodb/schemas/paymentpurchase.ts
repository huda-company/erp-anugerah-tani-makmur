import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IPaymentPurchaseDocument } from "^/@types/models/paymentpurchase";
import Purchase from "./purchase";
import Paymentmode from "./paymentmode";

type SchemaTypes = IPaymentPurchaseDocument &
  mongoose.PaginateModel<IPaymentPurchaseDocument>;

export const PaymentPurchaseSchema = new Schema<IPaymentPurchaseDocument>(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    number: {
      type: Number,
    },
    purchase: {
      type: mongoose.Schema.ObjectId,
      ref: Purchase,
      required: true,
      autopopulate: true,
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    paymentMode: {
      type: mongoose.Schema.ObjectId,
      ref: Paymentmode,
      autopopulate: true,
    },
    ref: {
      type: String,
    },
    description: {
      type: String,
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

PaymentPurchaseSchema.plugin(paginate);

const Paymentpurchase =
  (mongoose.models?.Paymentpurchase as SchemaTypes) ??
  mongoose.model<
    IPaymentPurchaseDocument,
    mongoose.PaginateModel<IPaymentPurchaseDocument>
  >("Paymentpurchase", PaymentPurchaseSchema);

export default Paymentpurchase;
