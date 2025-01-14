const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/test");

// Define a Product schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  inStock: { type: Boolean, required: true },
});

// Create a Product model
const Product = mongoose.model("Product", productSchema);

// Routes

// 1. Fetch all products
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// 2. Create a new product
app.post("/products", async (req, res) => {
  await Product.create(req.body);
  res.status(201).json(product);
});

// 3. Update a product by ID
app.put("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 4. Delete a product by ID
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(deletedProduct);
  } catch (error) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
