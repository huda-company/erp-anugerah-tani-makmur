import { IItemDocument } from "^/@types/models/item";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";
import ItemCategory from "./itemCategory";

type SchemaTypes = IItemDocument & mongoose.PaginateModel<IItemDocument>;

export const ItemSchema = new Schema<IItemDocument>(
  {
    itemCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: ItemCategory,
      require: true,
      autopopulate: true,
    },
    removed: {
      type: Boolean,
      default: false,
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    name: {
      type: String,
      trim: true,
      require: true,
    },
    brand: {
      type: String,
      trim: true,
      require: true,
    },
    packaging: {
      type: String,
      trim: true,
      require: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      trim: true,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

ItemSchema.plugin(paginate);

const Item =
  (mongoose.models?.Item as SchemaTypes) ??
  mongoose.model<IItemDocument, mongoose.PaginateModel<IItemDocument>>(
    "Item",
    ItemSchema
  );

export default Item;
