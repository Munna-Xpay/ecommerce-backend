import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: String,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
    },
    product_type: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    discounted_price: {
      type: Number,
      required: true,
    },
    original_price: {
      type: Number,
      required: true,
    },
    features: [
      {
        key: String,
        value: String,
      }
    ],
    thumbnail: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
      default: [],
    },
    category: {
      type: String,
      required: true,
    },
    manufacturer: {
      type: String,
      required: true,
    },
    warranty: {
      type: String,
      default: "",
    },
    ships_from: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    shipping: {
      type: String,
      default: "Free",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sellers",
      required: true,
    },
    tax: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isBanner: {
      type: Boolean,
      default: false,
    },
    isTodayOffer: {
      type: Boolean,
      default: false,
    },
    isFeaturedProduct: {
      type: Boolean,
      default: false,
    },
    isSpacialOffer: {
      type: Boolean,
      default: false,
    },
    isFeaturedBrand: {
      type: Boolean,
      default: false,
    },
    product_sold: {
      type: Number,
      default: 0,
    },
    brand_icon: {
      type: String,
      default: "",
    },
    review_star: {
      type: Number,
      default: 0,
    },
    sub_category: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const productModel = mongoose.model("products", productSchema);

export default productModel;
