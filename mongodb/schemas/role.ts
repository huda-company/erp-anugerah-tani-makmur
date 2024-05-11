import { IRoleDocument } from "^/@types/models/role";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

type SchemaTypes = IRoleDocument & mongoose.PaginateModel<IRoleDocument>;

export const RoleSchema = new Schema<IRoleDocument>(
  {
    removed: {
      type: Boolean,
      default: false,
    },
    codeName: {
      type: String,
      trim: true,
      require: true,
    },
    displayName: {
      type: String,
      trim: true,
      require: true,
    },
    created: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

RoleSchema.plugin(paginate);

const Role =
  (mongoose.models?.Role as SchemaTypes) ??
  mongoose.model<IRoleDocument, mongoose.PaginateModel<IRoleDocument>>(
    "Role",
    RoleSchema
  );

export default Role;
