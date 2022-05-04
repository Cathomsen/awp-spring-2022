import { mongoose } from "mongoose";

const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      minLength: [3, "That's too short"],
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // TODO: add a `userId` property of type Schema.Types.ObjectId with a `ref` to the User model:
    // https://mongoosejs.com/docs/populate.html
  },
  { timestamps: true }
);

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
      required: [true, "Gotta have a username"],
      minLength: [3, "That's too short"],
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const models = [
  {
    name: "Book",
    schema: bookSchema,
    collection: "books",
  },
  {
    name: "User",
    schema: userSchema,
    collection: "users",
  },
];
