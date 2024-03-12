import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getBrands, getOneProduct, updateProduct } from '../controllers/productControllers/productsController.js';
import { addReview, deleteReview, getAllReview, getOneReview, updateReview } from '../controllers/reviewController/reviewsController.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { validateProductRequest } from '../controllers/productControllers/validation/productValidation.js';
import { validateReviewRequest } from '../controllers/reviewController/validation/reviewsValidation.js';
import fileUploads from '../middlewares/multerMiddleware.js';
const router = express.Router();


//add product route
router.post('/add', addProduct);

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



//add review route
router.post('/add-review', jwtMiddleware, validateReviewRequest, addReview);

//get review route
router.get('/get-review', getAllReview);

//get one review route
router.get('/get-one-review/:productId', jwtMiddleware, getOneReview);

//update review route
router.put('/update-review/:id', jwtMiddleware, updateReview);

//delete review route
router.delete('/delete-review/:id', jwtMiddleware, deleteReview);






export default router