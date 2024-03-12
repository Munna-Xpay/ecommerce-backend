import express from 'express';
import { addSeller, deleteSeller, getAllSeller, getOneSeller, getSellersWithProducts, updateSeller } from '../controllers/sellerController/sellerController.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { validateSellerRequest } from '../controllers/sellerController/validation/sellerValidation.js';
import { addCategory, deleteCategory, getAllCategory, getCategoryByType, getPriceByCategory, getProductsByCategory, getProductsGrid, getSellerProductByCategory, updateCategory } from '../controllers/categoryController/categoryControllers.js';
import { validateCategoryRequest } from '../controllers/categoryController/validation/categoryValidation.js';
import { addCoupon, deleteCoupon, getAllCoupon, getAvaialableCoupons, updateCoupon } from '../controllers/couponsController/couponController.js';
import { validateCouponRequest } from '../controllers/couponsController/validation/couponsValidation.js';
import { getIncomeStatOfAParticularSeller, getOrdersAndIncomeOfThisYear, updateOrder } from '../controllers/ordersValidation/ordersController.js';

const router = express.Router();

//add seller route
router.post('/add-seller', jwtMiddleware, validateSellerRequest, addSeller);

//get seller route
router.get('/get-seller', getAllSeller);

//get one seller route
router.get('/get-one-seller/:id', jwtMiddleware, getOneSeller);

//update seller route
router.put('/update-seller/:id', jwtMiddleware, updateSeller);

//delete seller route
router.delete('/delete-seller/:id', jwtMiddleware, deleteSeller);

//get sellers with products route
router.get('/get-seller-with-product', getSellersWithProducts);



//add Category route
router.post('/add-category', jwtMiddleware, validateCategoryRequest, addCategory);

//get Category route
router.get('/get-category', getAllCategory);

//get Category by type route
router.get('/get-type-category/:type', getCategoryByType);

//update seller route
router.put('/update-category/:id', jwtMiddleware, updateCategory);

//delete Category route
router.delete('/delete-category/:id', jwtMiddleware, deleteCategory);



//add Coupon route
router.post('/add-coupon', jwtMiddleware, validateCouponRequest, addCoupon);

//get Coupon route
router.get('/get-coupon', jwtMiddleware, getAllCoupon);

//get Coupon by amount route
router.get('/get-available-coupon/:amount', jwtMiddleware, getAvaialableCoupons);

//update Coupon route
router.put('/update-coupon/:id', jwtMiddleware, updateCoupon);

//delete Coupon route
router.delete('/delete-coupon/:id', jwtMiddleware, deleteCoupon);



router.get('/get-orders-by-month', getOrdersAndIncomeOfThisYear)

//get income stat of a particular seller
router.get('/get-income-seller', getIncomeStatOfAParticularSeller)

router.put('/update-orders/:id', updateOrder)


//get price by category
router.get('/price-by-category', jwtMiddleware, getPriceByCategory)

//get products by category
router.get('/product-by-category', jwtMiddleware, getProductsByCategory)

router.get('/product-by-category',jwtMiddleware,getProductsByCategory)

//get seller product by category
router.get('/seller-category',jwtMiddleware,getSellerProductByCategory)

//products grid
router.get('/products-grid',jwtMiddleware,getProductsGrid)
export default router