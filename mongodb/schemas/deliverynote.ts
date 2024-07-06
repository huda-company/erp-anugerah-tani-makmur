import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import Paymentpurchase from "./paymentpurchase";
import Purchase from "./purchase";
import { CostTypes, IDelivNoteDocument } from "^/@types/models/deliverynote";
import Branch from "./branch";
import Item from "./item";
import Pickupdoc from "./pickupdoc";
import autopopulate from "mongoose-autopopulate";

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
      autopopulate: true,
    },
    purchase: {
      type: mongoose.Schema.ObjectId,
      ref: Purchase,
      autopopulate: true,
    },
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: Branch,
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
        note: {
          type: String,
          default: "",
        },
      },
    ],
    costItems: [
      {
        type: {
          type: String,
          enum: Object.values(CostTypes),
        },
        amount: {
          type: Number,
        },
      },
    ],
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
    sellingTotal: {
      type: Number,
      default: 0,
    },
    purchaseTotal: {
      type: Number,
      default: 0,
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
DelivNoteSchema.plugin(autopopulate);

const Deliverynote =
  (mongoose.models?.Deliverynote as SchemaTypes) ??
  mongoose.model<
    IDelivNoteDocument,
    mongoose.PaginateModel<IDelivNoteDocument>
  >("Deliverynote", DelivNoteSchema);

export default Deliverynote;
