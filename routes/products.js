import express from 'express';
import { addReview, deleteReview, getAllReview, getOneReview, getReviewStat, updateReview } from '../controllers/reviewController/reviewsController.js';
import { addProduct, deleteProduct, deleteProductPermanent, getAllProducts, getBrands, getOneProduct, updateProduct } from '../controllers/productControllers/productsController.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { validateProductRequest } from '../controllers/productControllers/validation/productValidation.js';
import { validateReviewRequest } from '../controllers/reviewController/validation/reviewsValidation.js';
import fileUploads from '../middlewares/multerMiddleware.js';
const router = express.Router();


//add product route
router.post('/add', jwtMiddleware, fileUploads.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 4 }
  ]), addProduct);
//get products route
router.get('/get', getAllProducts);

//get brands route
router.get('/get-brands', getBrands);

//get one product route
router.get('/get-one/:id', getOneProduct);

//update product route
router.put('/update/:id', jwtMiddleware, updateProduct);

//delete product route
router.delete('/delete/:id', deleteProduct);

//delete product permanently
router.delete('/delete-permanently/:id', deleteProductPermanent);


//add review route
router.post('/add-review', jwtMiddleware, validateReviewRequest, addReview);

//get review stat route (admin)
router.get('/get-review-stat', jwtMiddleware, getReviewStat);

//get review route
router.get('/get-review', getAllReview);

//get one review route
router.get('/get-one-review/:productId', jwtMiddleware, getOneReview);

//update review route
router.put('/update-review/:id', jwtMiddleware, updateReview);

//delete review route
router.delete('/delete-review/:id', jwtMiddleware, deleteReview);






export default router