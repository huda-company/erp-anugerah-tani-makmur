import { IPurchaseDocument } from "^/@types/models/purchase";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import Supplier from "./supplier";
import autopopulate from "mongoose-autopopulate";
import Item from "./item";

type SchemaTypes = IPurchaseDocument &
  mongoose.PaginateModel<IPurchaseDocument>;

export const PurchaseSchema = new Schema<IPurchaseDocument>(
  {
    poNo: {
      type: String,
      required: true,
    },
    billingCode: {
      type: String,
      default: "",
    },
    soNumber: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      default: "unpaid",
    },
    paymentPurchase: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "PaymentPurchase",
      },
    ],
    number: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    recurring: {
      type: String,
      default: "0",
    },
    date: {
      type: Date,
      required: true,
      default: Date.now(),
    },
    expDate: {
      type: Date,
      required: true,
    },
    ppnIncluded: {
      type: Boolean,
      default: false,
    },
    supplier: {
      type: String,
      ref: Supplier,
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
    purchPaymentMethod: {
      type: String,
      default: "cash",
    },
    subTotal: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    taxRate: {
      type: Number,
      default: 0,
    },
    taxTotal: {
      type: Number,
      default: 0,
    },
    credit: {
      type: Number,
      default: 0,
    },
    grandTotal: {
      type: Number,
      default: 0,
    },
    note: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      default: "draft",
    },
    pdfPath: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
    },
    removed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

// Define a virtual field to populate the supplier based on the supplier code
PurchaseSchema.virtual("supplierInfo", {
  ref: Supplier, // Reference the supplier model
  localField: "supplier", // Field in the ParkingField model
  foreignField: "id", // Field in the supplier model
  justOne: true, // We expect only one matching supplier
});

PurchaseSchema.plugin(paginate);
PurchaseSchema.plugin(autopopulate);

const Purchase =
  (mongoose.models?.Purchase as SchemaTypes) ??
  mongoose.model<IPurchaseDocument, mongoose.PaginateModel<IPurchaseDocument>>(
    "Purchase",
    PurchaseSchema
  );

export default Purchase;
