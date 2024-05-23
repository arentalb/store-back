import mongoose from "mongoose";
import CategoryModel from "./src/features/category/categoryModel.js";
import ProductModel from "./src/features/product/productModel.js";

const categories = [
  { name: "fruits and vegetables" },
  { name: "dairy and eggs" },
  { name: "bakery" },
  { name: "meat and seafood" },
];

const products = [
  {
    name: "Bananas",
    image: "https://example.com/image1.jpg",
    brand: "Farm Fresh",
    quantity: 100,
    category: "fruits and vegetables",
    description:
      "Fresh organic bananas sourced from the best farms. Perfect for a healthy snack or adding to your breakfast cereal.",
    price: 1500,
    countInStock: 100,
  },
  {
    name: "Apples",
    image: "https://example.com/image11.jpg",
    brand: "Farm Fresh",
    quantity: 120,
    category: "fruits and vegetables",
    description:
      "Crisp and juicy apples, perfect for snacking or baking. Packed with essential vitamins and minerals.",
    price: 2000, // IQD per kg
    countInStock: 120,
  },
  {
    name: "Grapes",
    image: "https://example.com/image21.jpg",
    brand: "Vineyard Select",
    quantity: 140,
    category: "fruits and vegetables",
    description:
      "Sweet and juicy grapes, perfect for snacking or adding to salads. Packed with antioxidants and nutrients.",
    price: 2500,
    countInStock: 140,
  },
  {
    name: "Carrots",
    image: "https://example.com/image31.jpg",
    brand: "Farm Fresh",
    quantity: 150,
    category: "fruits and vegetables",
    description:
      "Fresh and crunchy carrots, perfect for snacking or cooking. Rich in beta-carotene and vitamins.",
    price: 1500,
    countInStock: 150,
  },
  {
    name: "Milk",
    image: "https://example.com/image2.jpg",
    brand: "Dairy Pure",
    quantity: 200,
    category: "dairy and eggs",
    description:
      "Whole milk, 1 gallon, rich in calcium and vitamin D. Ideal for drinking, cooking, and baking.",
    price: 4000,
    countInStock: 200,
  },
  {
    name: "Greek Yogurt",
    image: "https://example.com/image12.jpg",
    brand: "Dairy Delight",
    quantity: 90,
    category: "dairy and eggs",
    description:
      "Creamy Greek yogurt, rich in protein and probiotics. Ideal for a healthy breakfast or snack.",
    price: 3500,
    countInStock: 90,
  },
  {
    name: "Cheddar Cheese",
    image: "https://example.com/image22.jpg",
    brand: "Dairyland",
    quantity: 100,
    category: "dairy and eggs",
    description:
      "Rich and creamy cheddar cheese, perfect for sandwiches, cooking, and snacking. A favorite for cheese lovers.",
    price: 5000,
    countInStock: 100,
  },
  {
    name: "Butter",
    image: "https://example.com/image32.jpg",
    brand: "Dairy Delight",
    quantity: 100,
    category: "dairy and eggs",
    description:
      "Creamy and rich butter, perfect for baking, cooking, or spreading. Made from high-quality cream.",
    price: 6000,
    countInStock: 100,
  },
  {
    name: "Whole Wheat Bread",
    image: "https://example.com/image3.jpg",
    brand: "Healthy Bakery",
    quantity: 150,
    category: "bakery",
    description:
      "Freshly baked whole wheat bread, made with 100% whole grains. Great for sandwiches and toasts.",
    price: 2500,
    countInStock: 150,
  },
  {
    name: "Multigrain Bread",
    image: "https://example.com/image13.jpg",
    brand: "Healthy Bakery",
    quantity: 130,
    category: "bakery",
    description:
      "Freshly baked multigrain bread, made with a blend of whole grains. Perfect for a nutritious start to your day.",
    price: 3000,
    countInStock: 130,
  },
  {
    name: "Croissants",
    image: "https://example.com/image23.jpg",
    brand: "French Bakery",
    quantity: 120,
    category: "bakery",
    description:
      "Freshly baked croissants, buttery and flaky. Perfect for breakfast or as a snack with coffee.",
    price: 3500,
    countInStock: 120,
  },
  {
    name: "Muffins",
    image: "https://example.com/image33.jpg",
    brand: "Baked Goodies",
    quantity: 110,
    category: "bakery",
    description:
      "Delicious muffins, available in various flavors. Perfect for breakfast or a sweet snack.",
    price: 4000,
    countInStock: 110,
  },
  {
    name: "Chicken Breast",
    image: "https://example.com/image4.jpg",
    brand: "Poultry Farm",
    quantity: 50,
    category: "meat and seafood",
    description:
      "Fresh, boneless, skinless chicken breasts. High in protein and perfect for grilling, baking, or frying.",
    price: 10000,
    countInStock: 50,
  },
  {
    name: "Salmon Fillet",
    image: "https://example.com/image14.jpg",
    brand: "Sea Harvest",
    quantity: 60,
    category: "meat and seafood",
    description:
      "Fresh salmon fillet, rich in omega-3 fatty acids. Great for grilling, baking, or pan-searing.",
    price: 15000,
    countInStock: 60,
  },
  {
    name: "Beef Steak",
    image: "https://example.com/image24.jpg",
    brand: "Butcher's Choice",
    quantity: 70,
    category: "meat and seafood",
    description:
      "Juicy beef steak, perfect for grilling or pan-frying. A high-quality cut for a delicious meal.",
    price: 18000,
    countInStock: 70,
  },
  {
    name: "Ground Beef",
    image: "https://example.com/image34.jpg",
    brand: "Butcher's Choice",
    quantity: 80,
    category: "meat and seafood",
    description:
      "High-quality ground beef, perfect for burgers, meatballs, and more. Lean and flavorful.",
    price: 12000,
    countInStock: 80,
  },
];

async function insertData() {
  try {
    // Connect to MongoDB
    await mongoose.connect("mongodb://localhost:27017/practice");

    // Insert categories
    const insertedCategories = await CategoryModel.insertMany(categories);
    console.log("Categories inserted successfully");

    // Map category names to their ObjectIds
    const editedData = insertedCategories.map((cat) => {
      return { name: cat.name, id: cat._id.toString() };
    });
    console.table(editedData);

    // Assign correct category ObjectId to products
    products.forEach((product) => {
      const category = editedData.find(
        (data) => data.name === product.category,
      );
      product.category = category ? category.id : "uncategorized";
    });
    console.log(products);

    // Insert products
    await ProductModel.insertMany(products);
    console.log("Products inserted successfully");

    // Close the connection
    await mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting data:", error);
    // Close the connection in case of an error
    await mongoose.connection.close();
  }
}

insertData();
