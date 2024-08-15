import mongoose, { Schema, Document } from "mongoose";

export interface Cart extends Document {
  asin: string;
  product_title: string;
  product_price: number;
  product_photo: string;
  quantity: number;
  email: string;
}

const CartSchema: Schema<Cart> = new mongoose.Schema(
  {
    asin: { type: String, required: true, unique: true },
    product_title: { type: String, required: true },
    product_price: { type: Number, required: true },
    product_photo: { type: String, required: true },
    quantity: { type: Number, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

const CartModel =
  (mongoose.models.Cart as mongoose.Model<Cart>) ||
  mongoose.model<Cart>("Cart", CartSchema);

export default CartModel;
