import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    brand: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, min: 0 },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, default: 0, min: 0 },
    countInStock: { type: Number, required: true, default: 0, min: 0 },
  },
  { timestamps: true },
);

const ProductModel = mongoose.model("Product", productSchema);

export default ProductModel;
