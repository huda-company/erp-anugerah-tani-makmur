import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import Paymentmode from "./paymentmode";
import Item from "./item";
import { IPaymentDelivnoteDocument } from "^/@types/models/paymentdelivnote";
import autopopulate from "mongoose-autopopulate";
import Deliverynote from "./deliverynote";
import Pickupdoc from "./pickupdoc";

type SchemaTypes = IPaymentDelivnoteDocument &
  mongoose.PaginateModel<IPaymentDelivnoteDocument>;

export const PaymentDelivnoteSchema = new Schema<IPaymentDelivnoteDocument>(
  {
    removed: {
      type: String,
      default: "",
    },
    removedBy: {
      type: String,
      default: "",
    },
    delivnote: {
      type: mongoose.Schema.ObjectId,
      ref: Deliverynote,
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
        pickupdoc: {
          type: Schema.Types.ObjectId,
          ref: Pickupdoc,
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
        discount: {
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
    status: {
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

PaymentDelivnoteSchema.plugin(paginate);
PaymentDelivnoteSchema.plugin(autopopulate);

const Paymentdeliverynote =
  (mongoose.models?.Paymentdeliverynote as SchemaTypes) ??
  mongoose.model<
    IPaymentDelivnoteDocument,
    mongoose.PaginateModel<IPaymentDelivnoteDocument>
  >("Paymentdeliverynote", PaymentDelivnoteSchema);

export default Paymentdeliverynote;
