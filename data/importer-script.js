import fs from "fs"
import mongoose from "mongoose"
import dotenv from "dotenv"
import Product from "../src/features/product/Product.js"
import {fileURLToPath} from "url";
import path from "path";


dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(process.env.DATABASE);
const DB = process.env.DATABASE.replace(
    "<password>",
    process.env.DATABASE_PASSWORD,
);
mongoose.connect(DB, {}).then(() => {
    console.log("connected");
});
const products = fs.readFileSync(`${__dirname}/product.json`, "utf-8");

const importData = async () => {
    try {
        await Product.create(JSON.parse(products));

        console.log("data imported!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

const deleteData = async () => {
    try {
        await Product.deleteMany();

        console.log("data deleted!");
    } catch (err) {
        console.log(err);
    }
    process.exit();
};
if (process.argv[2] === "--import") {
    importData().then();
} else if (process.argv[2] === "--delete") {
    deleteData().then();
}
