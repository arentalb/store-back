import ProductModel from "./productModel.js";

async function getAllProducts() {
  try {
    return await ProductModel.find()
      .populate("category")
      .sort({ createdAt: -1 });
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching all products");
  }
}

async function getProductById(id) {
  try {
    return await ProductModel.findById(id).populate("category");
  } catch (error) {
    console.log(error);
    throw new Error("Error finding product by id");
  }
}

async function getNewProducts() {
  try {
    return await ProductModel.find().sort({ createdAt: -1 }).limit(4);
  } catch (error) {
    console.log(error);
    throw new Error("Error finding new products");
  }
}

async function createProduct(product) {
  try {
    return await ProductModel.create({ ...product });
  } catch (error) {
    console.log(error);
    throw new Error("Error creating product");
  }
}

async function updateProduct(id, product) {
  try {
    const updatedProductData = {
      ...product,
      quantity: Number(product.quantity),
      price: Number(product.price),
      countInStock: Number(product.countInStock),
    };

    await ProductModel.updateOne({ _id: id }, updatedProductData);

    return await ProductModel.findOne({ _id: id });
  } catch (error) {
    console.error("Error updating product:", error);
    throw new Error("Error updating product");
  }
}

async function deleteProduct(id) {
  try {
    return await ProductModel.deleteOne({ _id: id }).select({});
  } catch (error) {
    console.log(error);
    throw new Error("Error deleting product");
  }
}

export default {
  createProduct,
  updateProduct,
  deleteProduct,
  getProductById,
  getAllProducts,
  getNewProducts,
};
