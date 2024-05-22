import CartModel from "./cartModel.js";
import ProductModel from "../product/productModel.js";

const getCart = async (userId) => {
  return await CartModel.findOne({ userId });
};

const addToCart = async (userId, productId, quantity) => {
  let cart = await CartModel.findOne({ userId });
  //check if there is already created cart for that user
  const product = await ProductModel.findById(productId);
  //check if there is any product with that id
  if (!product) {
    throw new Error("Product not found");
  }

  //if we have the cart
  if (cart) {
    //we search for that product in the array of items which holds cartItem in cartSchema
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    //if we have the product in that cart
    //we increase teh quentity
    if (itemIndex > -1) {
      let item = cart.items[itemIndex];
      item.quantity += quantity;
      cart.items[itemIndex] = item;
    } else {
      //if we dont have the item in the items array in cartSchema
      //we push a new item to that array
      cart.items.push({
        productId,
        name: product.name,
        price: product.price,
        quantity,
        image: product.image,
      });
    }
    //if we dont have the cart
  } else {
    cart = new CartModel({
      userId,
      items: [
        {
          productId,
          name: product.name,
          price: product.price,
          quantity,
          image: product.image,
        },
      ],
    });
  }

  await cart.save();
  return cart;
};

const updateCartItem = async (userId, productId, quantity) => {
  const cart = await CartModel.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId,
  );
  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  if (quantity <= 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  await cart.save();
  return cart;
};

const removeCartItem = async (userId, productId) => {
  const cart = await CartModel.findOne({ userId });

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId,
  );

  await cart.save();
  return cart;
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
