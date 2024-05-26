import mongoose, { Schema } from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";
import { IPaymentPurchaseDocument } from "^/@types/models/paymentpurchase";
import Purchase from "./purchase";
import Paymentmode from "./paymentmode";
import Item from "./item";

type SchemaTypes = IPaymentPurchaseDocument &
  mongoose.AggregatePaginateModel<IPaymentPurchaseDocument>;

export const PaymentPurchaseSchema = new Schema<IPaymentPurchaseDocument>(
  {
    removed: {
      type: String,
      default: "",
    },
    removedBy: {
      type: String,
      default: "",
    },
    purchase: {
      type: mongoose.Schema.ObjectId,
      ref: Purchase,
      required: true,
      autopopulate: true,
    },
    items: [
      {
        item: {
          type: Schema.Types.ObjectId,
          ref: Item,
          required: true,
          autopopulate: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        unit: {
          type: String,
          required: true,
          default: "kg",
        },
        price: {
          type: Number,
          required: true,
        },
        total: {
          type: Number,
          required: true,
        },
      },
    ],
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

// PaymentPurchaseSchema.plugin(paginate);
PaymentPurchaseSchema.plugin(aggregatePaginate);

const Paymentpurchase =
  (mongoose.models?.Paymentpurchase as SchemaTypes) ??
  mongoose.model<
    IPaymentPurchaseDocument,
    mongoose.AggregatePaginateModel<IPaymentPurchaseDocument>
  >("Paymentpurchase", PaymentPurchaseSchema);

export default Paymentpurchase;
