import express from 'express';
import { addProduct, deleteProduct, getAllProducts, getOneProduct, updateProduct } from '../controllers/productControllers/productsController.js';
import { addReview, deleteReview, getAllReview, getOneReview, updateReview } from '../controllers/reviewController/reviewsController.js';
const router = express.Router();


//add product route
router.post('/add', addProduct);

//get products route
router.get('/get', getAllProducts);

//get one product route
router.get('/get/one/:id', getOneProduct);

//update product route
router.put('/update/:id', updateProduct);

//delete product route
router.delete('/delete/:id', deleteProduct);



//add review route
router.post('/add/review', addReview);

//get review route
router.get('/get/review', getAllReview);

//get one review route
router.get('/get/one/review/:id', getOneReview);

//update review route
router.put('/update/review/:id', updateReview);

//delete review route
router.delete('/delete/review/:id', deleteReview);


export default router