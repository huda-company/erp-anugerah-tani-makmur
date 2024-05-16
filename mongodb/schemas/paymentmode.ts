import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import { IPaymentModeDocument } from "^/@types/models/paymentmode";

type SchemaTypes = IPaymentModeDocument &
  mongoose.PaginateModel<IPaymentModeDocument>;

export const PaymentModeSchema = new Schema<IPaymentModeDocument>(
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
    isDefault: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    ref: {
      type: String,
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

PaymentModeSchema.plugin(paginate);

const Paymentmode =
  (mongoose.models?.Paymentmode as SchemaTypes) ??
  mongoose.model<
    IPaymentModeDocument,
    mongoose.PaginateModel<IPaymentModeDocument>
  >("Paymentmode", PaymentModeSchema);

export default Paymentmode;
