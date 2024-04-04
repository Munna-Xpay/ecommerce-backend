import express from 'express'
import { getPriceByCategorySeller, getSellerProductByCategory, getSellerProductsByCategory, getSellerProductsByFilter, getSellerProductsGrid, sellerProductCategory } from '../controllers/categoryController/categoryControllers.js'
import { addProduct, deleteProduct, sellerProductImageUpdate, sellerUpdateProduct } from '../controllers/productControllers/productsController.js'
import fileUploads from '../middlewares/multerMiddleware.js';
import { getOneSeller, sellerLogin } from '../controllers/sellerController/sellerController.js'
import { validateSellerLoginRequest } from '../controllers/sellerController/validation/sellerValidation.js'
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js'


const router = express.Router()

//seller login
router.post('/seller-login',validateSellerLoginRequest, sellerLogin)

//get one seller route
router.get('/get-one-seller/:id', jwtMiddleware, getOneSeller);

//product grid
router.get('/products-grid',jwtMiddleware, getSellerProductsGrid)

//product edit
router.put('/product-update/:id',jwtMiddleware,sellerUpdateProduct)

//update product images
router.put('/product-image-update/:id',jwtMiddleware, fileUploads.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 4 }
  ]), sellerProductImageUpdate)

//product management
router.get('/products-management',jwtMiddleware, getSellerProductsByFilter)

//product price by category
 router.get('/price-by-category-seller', jwtMiddleware, getPriceByCategorySeller)

 //products by category
router.get('/product-by-category', jwtMiddleware, getSellerProductsByCategory)

//get seller product by category
router.get('/seller-category', jwtMiddleware, sellerProductCategory)


export default router;