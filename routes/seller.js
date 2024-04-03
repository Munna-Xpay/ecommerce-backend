import express from 'express'
import { getSellerProductsByFilter, getSellerProductsGrid } from '../controllers/categoryController/categoryControllers.js'
import { deleteProduct, sellerProductImageUpdate, sellerUpdateProduct } from '../controllers/productControllers/productsController.js'
import fileUploads from '../middlewares/multerMiddleware.js';
import { getSellerProductsGrid } from '../controllers/categoryController/categoryControllers.js'
import { getOneSeller, sellerLogin } from '../controllers/sellerController/sellerController.js'
import { validateSellerLoginRequest } from '../controllers/sellerController/validation/sellerValidation.js'
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js'


const router = express.Router()

//seller login
router.post('/seller-login',validateSellerLoginRequest, sellerLogin)

//get one seller route
router.get('/get-one-seller/:id', jwtMiddleware, getOneSeller);

//product grid
router.get('/products-grid/:id', getSellerProductsGrid)

//product edit
router.put('/product-update/:id',sellerUpdateProduct)

//update product images
router.put('/product-image-update/:id', fileUploads.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 4 }
  ]), sellerProductImageUpdate)

  //product management
  router.get('/products-management/:id', getSellerProductsByFilter)
export default router;