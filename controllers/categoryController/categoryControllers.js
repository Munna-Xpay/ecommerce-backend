import Category from "../../models/categoryModel.js";
import Product from "../../models/productsModel.js";
import Seller from "../../models/sellerModel.js";

//add Category
export const addCategory = async (req, res) => {
  try {
    const newCategory = new Category(req.body);
    await newCategory.save();
    res.status(200).json(newCategory);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get all Category or by query
export const getAllCategory = async (req, res) => {
  try {
    const category = await Category.find();
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get Category by type
export const getCategoryByType = async (req, res) => {
  try {
    const category = await Category.find({ type: req.params.type });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
};

//update Category
export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
};

//delete Category
export const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json(err);
  }
};

//products total price by category
export const getPriceByCategory = async (req, res) => {
  try {
    const categoryData = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          total_price: { $sum: { $multiply: ["$product_sold", "$discounted_price"] } },
        },
      },
    ]);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
};

//products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          category: { $in: ["Electronics", "Fashion", "Groceries"] },isActive:true
        },
      },
    ]);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

//get seller product total price by category
export const getSellerProductByCategory = async (req, res) => {
  try {
    const sellerProducts = await Product.aggregate([
      {
        $lookup: {
          from: "sellers",
          localField: "seller",
          foreignField: "_id",
          as: "sellerDetails",
        },
      },
      {
        $unwind: { path: "$sellerDetails", preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: {
            sellerId: "$seller",
            category: "$category",
          },
          seller: { $first: "$sellerDetails" },
          totalAmount: { $sum: "$discounted_price" },
        },
      },
      {
        $project: {
          _id: 0,
          sellerLogo: "$seller",
          category: "$_id.category",
          totalPrice: "$totalAmount",
        },
      },
      {
        $limit: 3,
      },
    ]);
    res.status(200).json(sellerProducts);
  } catch (err) {
    res.status(500).json(err);
  }
};

//product fetch by filter

export const getProductsGrid = async (req, res) => {
  let { categoryFilter, sort_option } = req.query;

  //default electronics
  let category = categoryFilter || "Electronics";

  try {
    //default best selling
    let sortValue = { total_sold: -1 };
    switch (sort_option) {
      case "Best_selling":
        sortValue.total_sold = -1;
        break;
      case "Availability":
        sortValue.inStock = -1;
        break;
      case "low_to_high":
        sortValue.discounted_price = 1;
        break;
      case "high_to_low":
        sortValue.discounted_price = -1;
        break;
      default:
        break;
    }
    // Execute the aggregation pipeline
    const products = await Product.aggregate([
      {
        $match: { category: category, isActive: true },
      },
      {
        $sort: sortValue,
      },
    ]);
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};


//product management table data
export const getProductsByFilter = async (req, res) => {
  let {categoryFilter, stockFilter, productTypeFilter, additionalOption, searchData,} = req.query;
 
  try {
    let pipeline = [];
//filter check
    let Filters = {};
    if (categoryFilter) {
      Filters.category = categoryFilter;
    }
    if (stockFilter) {
      Filters.stock = stockFilter;
    }
    if (productTypeFilter) {
      Filters.product_type = productTypeFilter;
    }
//sort check
      let sortValue = {};
      switch (additionalOption) {
        case "last_modified":
          sortValue.updatedAt = -1;
          break;
        case "date_added":
          sortValue.createdAt = -1;
          break;
        case "rating_low_to_high":
          sortValue.review_star = 1;
          break;
        case "rating_high_to_low":
          sortValue.review_star = -1;
          break;
        default:
          break;
      }
      if (Object.keys(Filters).length > 0) {
        pipeline.push({ $match: Filters });
      }
      //search
      if (searchData) {
        pipeline.push({ $match: { title: { $regex: new RegExp(searchData, 'i') } } });
    }
        if (Object.keys(sortValue).length > 0) {
            pipeline.push({ $sort: sortValue });
        }
        if (pipeline.length === 0) {
            pipeline.push({ $match: {} });
          }
        const allProducts = await Product.aggregate(pipeline);
        res.status(200).json(allProducts);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};
