import express from 'express';
import { login, register, userProfileUpdate } from '../controllers/usersController/usersController.js';
import fileUploads from '../middlewares/multerMiddleware.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { addToCart, cartProducts, decrementCartQty, deleteCartProduct, incrementCartQty } from '../controllers/cartControllers/cartController.js';



const router = express.Router();



//register
router.post('/register',register)

//login
router.post('/login',login)

//updateUserPRofile
router.put('/update-profile/:_id',fileUploads.single('profileImage'),userProfileUpdate)

//addtocart
router.post('/add-to-cart',jwtMiddleware,addToCart)

//get cart products
router.get('/cart-products',jwtMiddleware,cartProducts)

//cart qty increment
router.get('/cart-increment/:_id',jwtMiddleware,incrementCartQty)

//cart qty decrement
router.get('/cart-decrement/:_id',jwtMiddleware,decrementCartQty)

//delete cart product
router.delete('/delete-cart-product/_id',jwtMiddleware,deleteCartProduct)

export default router