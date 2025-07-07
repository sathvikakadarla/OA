import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";
import foodModel from "../model/foodModel.js";
import Shop from "../model/shopModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../../uploads");

// ✅ Add food item (image is base64 string)
const addFood = async (req, res) => {
  const { name, description, price, category, shopId, image, quantity } = req.body;
  console.log("Received req.body:", req.body);

  const parsedQuantity = Number(quantity);

  if (!name || !description || !price || !category || !shopId || !image || !quantity) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  if (isNaN(price) || Number(price) <= 0) {
    return res.status(400).json({ success: false, message: "Invalid price" });
  }

  if (isNaN(quantity) || Number(quantity) <= 0) {
    return res.status(400).json({ success: false, message: "Invalid quantity" });
  }

  try {
    const food = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image,
      shopId,
      quantity: parsedQuantity,
    });

    await food.save();
    res.status(201).json({ success: true, message: "Food item added successfully!", food });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ List food items (filtered by query, category, or shop)
const listFood = async (req, res) => {
  const { query, shopId, category } = req.query;

  try {
    let filter = {};
    if (query) filter.name = { $regex: query, $options: "i" };
    if (shopId) filter.shopId = shopId;
    if (category) filter.category = category;

    const foods = await foodModel.find(filter).populate("shopId", "name");
    res.json({ success: true, foodItems: foods });
  } catch (error) {
    console.error("Error retrieving foods:", error);
    res.status(500).json({ success: false, message: "Error retrieving foods." });
  }
};

// ✅ Remove food item (delete from DB + image cleanup)
const removeFood = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food item not found." });
    }

    const imagePath = path.join(uploadDir, food.image);
    if (fs.existsSync(imagePath)) {
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Error deleting image:", err);
      });
    }

    await foodModel.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Food item removed successfully." });
  } catch (error) {
    console.error("Error deleting food:", error);
    res.status(500).json({ success: false, message: "Error deleting food." });
  }
};

// ✅ Get distinct categories from food items
const listCategories = async (req, res) => {
  try {
    const categories = await foodModel.distinct("category");
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Failed to fetch categories" });
  }
};

// ✅ Get shops offering food in a selected category
const getShopsByCategory = async (req, res) => {
  const { category } = req.query;

  try {
    const shopIds = await foodModel.find({ category }).distinct("shopId");
    const shops = await Shop.find({ _id: { $in: shopIds } });

    res.json({ success: true, shops });
  } catch (error) {
    console.error("Error fetching shops by category:", error);
    res.status(500).json({ success: false, message: "Failed to fetch shops" });
  }
};

export {
  addFood,
  listFood,
  removeFood,
  listCategories,
  getShopsByCategory
};
