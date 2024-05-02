import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import paginate from "mongoose-paginate-v2";

import { Gender, IUserDocument } from "^/@types/models/user";

type SchemaTypes = IUserDocument & mongoose.PaginateModel<IUserDocument>;

export const UserSchema = new Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    plainPassword: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    birthDate: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: Object.values(Gender),
      required: true,
    },
    phoneVerifAt: {
      type: Date,
    },
    emailVerifCode: {
      type: String,
    },
    emailVerifAt: {
      type: Date,
    },
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
  },
  {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true, getters: true },
  }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(
      this.password,
      Number(process.env.NEXT_SALT_ROUND)
    ); // 10 is the number of salt rounds
    this.password = hashedPassword;
  }
  next();
});

UserSchema.plugin(paginate);

const User =
  (mongoose.models?.User as SchemaTypes) ??
  mongoose.model<IUserDocument, mongoose.PaginateModel<IUserDocument>>(
    "User",
    UserSchema
  );

export default User;
