import express from 'express';
import { addSeller, deleteSeller, getAllSeller, getOneSeller, updateSeller } from '../controllers/sellerController/sellerController.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { validateSellerRequest } from '../controllers/sellerController/validation/sellerValidation.js';
import { addCategory, deleteCategory, getAllCategory, getCategoryByType, updateCategory } from '../controllers/categoryController/categoryControllers.js';
import { validateCategoryRequest } from '../controllers/categoryController/validation/categoryValidation.js';
import { addCoupon, deleteCoupon, getAllCoupon, getAvaialableCoupons, updateCoupon } from '../controllers/couponsController/couponController.js';
import { validateCouponRequest } from '../controllers/couponsController/validation/couponsValidation.js';
const router = express.Router();

//add seller route
router.post('/add-seller', jwtMiddleware, validateSellerRequest, addSeller);

//get seller route
router.get('/get-seller', jwtMiddleware, getAllSeller);

//get one seller route
router.get('/get-one-seller/:id', jwtMiddleware, getOneSeller);

//update seller route
router.put('/update-seller/:id', jwtMiddleware, updateSeller);

//delete seller route
router.delete('/delete-seller/:id', jwtMiddleware, deleteSeller);



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


export default router