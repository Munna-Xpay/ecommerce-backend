import express from 'express'
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

export default router;