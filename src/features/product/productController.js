import expressAsyncHandler from "express-async-handler";
import {
  sendError,
  sendFailure,
  sendSuccess,
} from "../../utils/resposeSender.js";
import productService from "./productService.js";

const getAllProducts = expressAsyncHandler(async (req, res) => {
  try {
    const allProducts = await productService.getAllProducts();
    sendSuccess(res, allProducts, 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
});
const getProductById = expressAsyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    const allProducts = await productService.getProductById(productId);
    sendSuccess(res, allProducts, 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
});
const getNewProducts = expressAsyncHandler(async (req, res) => {
  try {
    const newProducts = await productService.getNewProducts();
    sendSuccess(res, newProducts, 201);
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

const createProduct = expressAsyncHandler(async (req, res) => {
  const { name, brand, quantity, category, description, price, countInStock } =
    req.body;

  const image = req.file ? req.file.filename : null;
  const product = req.body;
  switch (true) {
    case !name:
      return sendFailure(res, "Name is required ", 404);
    case !image:
      return sendFailure(res, "Image is required ", 404);
    case !brand:
      return sendFailure(res, "Brand is required ", 404);
    case !quantity:
      return sendFailure(res, "Quantity is required ", 404);
    case !category:
      return sendFailure(res, "Category is required ", 404);
    case !description:
      return sendFailure(res, "Description is required ", 404);
    case !price:
      return sendFailure(res, "Price is required ", 404);
    case !countInStock:
      return sendFailure(res, "CountInStock is required ", 404);
  }

  try {
    const createdProduct = await productService.createProduct({
      ...product,
      image: `/uploads/${req.file.filename}`,
    });
    sendSuccess(res, createdProduct, 201);
  } catch (error) {
    return sendError(res, error.message, 404);
  }
});
const updateProduct = expressAsyncHandler(async (req, res) => {
  const { name, brand, quantity, category, description, price, countInStock } =
    req.body;

  const image = req.file ? req.file.filename : null;

  switch (true) {
    case !name:
      return sendFailure(res, "Name is required ", 404);
    case !brand:
      return sendFailure(res, "Brand is required ", 404);
    case !quantity:
      return sendFailure(res, "Quantity is required ", 404);
    case !category:
      return sendFailure(res, "Category is required ", 404);
    case !description:
      return sendFailure(res, "Description is required ", 404);
    case !price:
      return sendFailure(res, "Price is required ", 404);
    case !countInStock:
      return sendFailure(res, "CountInStock is required ", 404);
  }

  let product = req.body;

  if (image) {
    product = { image: `/uploads/${req.file.filename}`, ...product };
  }
  try {
    const productId = req.params.id;

    const updatedProduct = await productService.updateProduct(
      productId,
      product,
    );
    sendSuccess(res, updatedProduct, 201);
  } catch (error) {
    return sendError(res, error.message, 404);
  }
});

const deleteProduct = expressAsyncHandler(async (req, res) => {
  try {
    const productId = req.params.id;
    console.log(productId);
    const foundedProduct = productService.getProductById(productId);
    if (!foundedProduct) {
      sendFailure(res, "Could not find product to be deleted", 403);
    } else {
      const deletedProduct = await productService.deleteProduct(productId);
      sendSuccess(res, "Product deleted", 201);
    }
  } catch (error) {
    sendError(res, error.message, 500);
  }
});

export default {
  getAllProducts,
  getProductById,
  getNewProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};

// const addProductReview = expressAsyncHandler(async (req, res) => {
//   try {
//     const productId = req.params.id;
//     const rating = req.body.rating;
//     const comment = req.body.comment;
//
//     if (!rating || !comment) {
//       sendFailure(res, "Please provide both comment and rating ");
//     }
//
//     const product = await productService.getProductById(productId);
//
//     if (product) {
//       const alreadyReviewed = product.reviews.find(
//         (r) => r.user.toString() === req.user._id.toString(),
//       );
//       if (alreadyReviewed) {
//         sendFailure(res, "You already reviewed this product ", 400);
//       }
//       const review = {
//         name: req.user.username,
//         rating: Number(rating),
//         comment,
//         user: req.user._id,
//       };
//       product.reviews.push(review);
//       product.numReviews = product.reviews.length;
//       product.rating =
//         product.reviews.reduce((acc, item) => {
//           return item.rating + acc;
//         }, 0) / product.reviews.length;
//
//       const savedReview = await product.save();
//       sendSuccess(res, savedReview, 201);
//     } else {
//       sendFailure(res, "This product dose not exists ", 400);
//     }
//   } catch (error) {
//     sendError(res, error.message, 500);
//   }
// });
