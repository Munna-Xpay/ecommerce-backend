import Product from "../../models/productsModel.js";

//add product
export const addProduct = async (req, res) => {
  //console.log(req.body);
  // console.log(req.files);
  const thumbnail = req.files.thumbnail[0].filename;
  const images = req.files.images.map((i) => i.filename);
  try {
    const newProduct = new Product({ ...req.body, thumbnail, images });
    await newProduct.save();
    const products = await Product.aggregate([
      {
        $match: {
          category: { $in: ["Electronics", "Fashion", "Groceries"] },
        },
      },
    ]);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all products or by query
export const getAllProducts = async (req, res) => {
  // console.log(req.query)
  const query = {
    isActive: true,
  };
  if (req.query.category) {
    query.category = req.query.category;
  }
  if (req.query.brand) {
    query.manufacturer = req.query.brand;
  }
  if (req.query.min && req.query.max) {
    query.discounted_price = { $gte: req.query.min, $lte: req.query.max };
  }
  if (req.query.shipping) {
    query.shipping = req.query.shipping;
  }
  if (req.query.inStock) {
    query.inStock = req.query.inStock == "true" ? true : false;
  }
  if (req.query.review) {
    query.review_star = { $gte: req.query.review };
  }
  // console.log(query)
  try {
    if (req.query.sort == "oldest") {
      const products = await Product.find(query).populate("seller");
      res.status(200).json(products);
    } else if (req.query.sort == "popular") {
      const products = await Product.find(query)
        .populate("seller")
        .sort({ review_star: -1 });
      res.status(200).json(products);
    } else {
      const products = await Product.find(query)
        .populate("seller")
        .sort({ createdAt: -1 });
      res.status(200).json(products);
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

//get one product
export const getOneProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true,
    }).populate("seller");
    product && res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

//update product
export const updateProduct = async (req, res) => {
  //to split colors and save it as an array
  if (req.body.colors && typeof req.body.colors === "string") {
    req.body.colors = req.body.colors.split(",").map((color) => color.trim());
  }
  //to split colors and save it as an array
  if (req.body.memory && typeof req.body.memory === "string") {
    req.body.memory = req.body.memory.split(",").map((item) => item.trim());
  }
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    const products = await Product.aggregate([
      {
        $match: {
          category: { $in: ["Electronics", "Fashion", "Groceries"] },
        },
      }
    ]);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

//product image update
export const productImageUpdate = async (req, res) => {
  try {
    console.log(req.files);
    console.log(req.body);
    const thumbnail = req.files.thumbnail ? req.files.thumbnail[0].filename : req.body.thumbnail;
    // Get image filenames
    let images = req.body.images || [];

    // If images is not an array, convert it to an array
    if (!Array.isArray(images)) {
      images = [images];
    }
    // If req.files.images exists, push new image filenames to the array
    if (req.files.images) {
      req.files.images.map((file) => {
        images.push(file.filename);
      });
    }


    const product = await Product.findByIdAndUpdate(req.params.id, { thumbnail: thumbnail, images: images }, { new: true });


    const products = await Product.aggregate([
      {
        $match: {
          category: { $in: ["Electronics", "Fashion", "Groceries"] },
        },
      }
    ]);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};




//delete product
export const deleteProduct = async (req, res) => {
  try {
    const disableProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: { isActive: false } },
      { new: true }
    );
    res.status(200).json({ message: "product deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all brands from all document

export const getBrands = async (req, res) => {
  try {
    const allBrands = await Product.aggregate([
      {
        $group: {
          _id: "$manufacturer",
        },
      },
    ]);
    res.status(200).json(allBrands);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all categories from all document

export const getCategories = async (req, res) => {
  try {
    const allCategories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
        },
      },
    ]);
    res.status(200).json(allCategories);
  } catch (err) {
    res.status(500).json(err);
  }
};

//delete product permanently
export const deleteProductPermanent = async (req, res) => {
  try {
    const disableProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "product deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};
