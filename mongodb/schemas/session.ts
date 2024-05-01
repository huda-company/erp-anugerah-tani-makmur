import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { ISessionDocument } from "^/@types/models/session";

type SchemaTypes = ISessionDocument & mongoose.PaginateModel<ISessionDocument>;

export const SessionSchema = new Schema<ISessionDocument>(
  {
    userId: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    macAddr: {
      type: String,
      required: false,
    },
    ipAddr: {
      type: String,
      required: false,
    },
    iat: {
      type: Number,
      required: true,
    },
    exp: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

SessionSchema.plugin(paginate);

const Session =
  (mongoose.models?.Session as SchemaTypes) ??
  mongoose.model<ISessionDocument, mongoose.PaginateModel<ISessionDocument>>(
    "Session",
    SessionSchema
  );

export default Session;
