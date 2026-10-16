import Product from "../models/Product.js";

// @desc    Fetch all products with filtering, search, sorting & pagination
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const query = {};

    // Search keyword in title, description, or brand
    if (req.query.search && req.query.search.trim() !== "") {
      const searchRegex = new RegExp(req.query.search.trim(), "i");
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
      ];
    }

    // Category filter
    if (req.query.category && req.query.category !== "All" && req.query.category !== "") {
      query.category = { $regex: new RegExp(`^${req.query.category.trim()}$`, "i") };
    }

    // Featured filter
    if (req.query.featured === "true") {
      query.featured = true;
    }

    // Price range filtering
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice && !isNaN(req.query.minPrice)) {
        query.price.$gte = Number(req.query.minPrice);
      }
      if (req.query.maxPrice && !isNaN(req.query.maxPrice)) {
        query.price.$lte = Number(req.query.maxPrice);
      }
    }

    // In stock filter
    if (req.query.inStock === "true") {
      query.stock = { $gt: 0 };
    }

    // Sorting options
    let sort = { createdAt: -1 }; // default newest
    if (req.query.sort) {
      switch (req.query.sort) {
        case "price-low":
          sort = { price: 1 };
          break;
        case "price-high":
          sort = { price: -1 };
          break;
        case "top-rated":
          sort = { rating: -1 };
          break;
        case "oldest":
          sort = { createdAt: 1 };
          break;
        case "name-az":
          sort = { title: 1 };
          break;
        case "name-za":
          sort = { title: -1 };
          break;
        case "newest":
        default:
          sort = { createdAt: -1 };
          break;
      }
    }

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Also get distinct categories for filters
    const categories = await Product.distinct("category");

    res.json({
      success: true,
      count: products.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      categories,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch distinct product categories
// @route   GET /api/products/categories
// @access  Public
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");
    res.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res, next) => {
  try {
    const {
      title,
      description,
      price,
      category,
      brand,
      image,
      images,
      stock,
      featured,
    } = req.body;

    if (!title || !description || price === undefined || !category || !image) {
      return res.status(400).json({
        success: false,
        message: "Please provide title, description, price, category, and image",
      });
    }

    if (Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });
    }

    const product = await Product.create({
      title,
      description,
      price: Number(price),
      category,
      brand: brand || "",
      image,
      images: Array.isArray(images) && images.length > 0 ? images : [image],
      stock: stock !== undefined ? Number(stock) : 0,
      featured: Boolean(featured),
      rating: 5,
      numReviews: 0,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const {
      title,
      description,
      price,
      category,
      brand,
      image,
      images,
      stock,
      featured,
    } = req.body;

    if (price !== undefined && Number(price) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Price must be greater than 0",
      });
    }

    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        success: false,
        message: "Stock cannot be negative",
      });
    }

    product.title = title !== undefined ? title : product.title;
    product.description = description !== undefined ? description : product.description;
    product.price = price !== undefined ? Number(price) : product.price;
    product.category = category !== undefined ? category : product.category;
    product.brand = brand !== undefined ? brand : product.brand;
    product.image = image !== undefined ? image : product.image;
    if (images !== undefined) {
      product.images = Array.isArray(images) ? images : [images];
    }
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.featured = featured !== undefined ? Boolean(featured) : product.featured;

    const updatedProduct = await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Product deleted successfully",
      data: { id: req.params.id },
    });
  } catch (error) {
    next(error);
  }
};

