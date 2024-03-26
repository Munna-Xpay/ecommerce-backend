import express from 'express';
import { addSeller, deleteSeller, getAllSeller, getIncomeStatOfAParticularSeller, getOneSeller, getSellerReviewStat, updatePassword, updateSeller, updateSellerCompanyIcon } from '../controllers/sellerController/sellerController.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { validateSellerRequest } from '../controllers/sellerController/validation/sellerValidation.js';
import { addCategory, deleteCategory, getAllCategory, getCategoryByType, getPriceByCategory, getProductsByCategory, getProductsByFilter, getProductsGrid, getSellerProductByCategory, updateCategory } from '../controllers/categoryController/categoryControllers.js';
import { validateCategoryRequest } from '../controllers/categoryController/validation/categoryValidation.js';
import { addCoupon, deleteCoupon, getAllCoupon, getAvaialableCoupons, updateCoupon } from '../controllers/couponsController/couponController.js';
import { validateCouponRequest } from '../controllers/couponsController/validation/couponsValidation.js';
import { getOrdersAndIncomeOfThisYear, getPeriodSalesRevenue, getSalesActivity, updateOrder } from '../controllers/ordersValidation/ordersController.js';
import fileUploads from '../middlewares/multerMiddleware.js';
import { addNotification, getAllNotification, updateNotification } from '../controllers/notificationController/notificationController.js';
import { validateNotificationRequest } from '../controllers/notificationController/validation/notificationValidation.js';

const router = express.Router();

//add seller route
router.post('/add-seller', jwtMiddleware, fileUploads.single("company_icon"), validateSellerRequest, addSeller);

//get seller route
router.get('/get-seller', getAllSeller);

//get seller review stat route
router.get('/get-seller-review-stat', jwtMiddleware, getSellerReviewStat);

//get one seller route
router.get('/get-one-seller/:id', jwtMiddleware, getOneSeller);

//update seller route
router.put('/update-seller/:id', jwtMiddleware, updateSeller);

//update seller company icon route
router.put('/update-seller-company-icon/:id', jwtMiddleware, fileUploads.single("company_icon"), updateSellerCompanyIcon);

//delete seller route
router.delete('/delete-seller/:id', jwtMiddleware, deleteSeller);

//edit seller password route
router.put('/update-password-seller/:id', updatePassword);



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


//get order stat by month
router.get('/get-orders-by-month', jwtMiddleware, getOrdersAndIncomeOfThisYear)

//get income stat of a particular seller
router.get('/get-income-seller', jwtMiddleware, getIncomeStatOfAParticularSeller)

router.put('/update-orders/:id', updateOrder)


//get price by category
router.get('/price-by-category', jwtMiddleware, getPriceByCategory)

//get products by category
router.get('/product-by-category', jwtMiddleware, getProductsByCategory)

//get seller product by category
router.get('/seller-category', jwtMiddleware, getSellerProductByCategory)

//products grid
router.get('/products-grid', jwtMiddleware, getProductsGrid)

//get sales activity route
router.get('/get-sales-activity', jwtMiddleware, getSalesActivity)

//get sales activity route
router.get('/get-period-sales-revenue', jwtMiddleware, getPeriodSalesRevenue)

//products management
router.get('/products-management', jwtMiddleware, getProductsByFilter)


//add notification route
router.post('/add-notification', jwtMiddleware, validateNotificationRequest, addNotification);

//get notification route
router.get('/get-notification', jwtMiddleware, getAllNotification);

//update notification route
router.put('/update-notification/:id', jwtMiddleware, updateNotification);

export default router