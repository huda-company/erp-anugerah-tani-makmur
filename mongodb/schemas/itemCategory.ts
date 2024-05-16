import { IItemCategoryDocument } from "^/@types/models/itemcategory";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

type SchemaTypes = IItemCategoryDocument &
  mongoose.PaginateModel<IItemCategoryDocument>;

export const ItemCategorySchema = new Schema<IItemCategoryDocument>(
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
    name: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

ItemCategorySchema.plugin(paginate);

const ItemCategory =
  (mongoose.models?.Itemcategory as SchemaTypes) ??
  mongoose.model<
    IItemCategoryDocument,
    mongoose.PaginateModel<IItemCategoryDocument>
  >("Itemcategory", ItemCategorySchema);

export default ItemCategory;
