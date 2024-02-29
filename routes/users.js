import express from 'express';
import { getAllUsers, getUserById, login, register, removeUser, userProfileUpdate } from '../controllers/usersController/usersController.js';
import fileUploads from '../middlewares/multerMiddleware.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { addToCart, cartProducts, decrementCartQty, deleteCartProduct, incrementCartQty } from '../controllers/cartControllers/cartController.js';
import { addToWishlist, deleteWishlistProduct, getWishlistProducts} from '../controllers/wishlistController/wishlistController.js';
import { validateCartRequest } from '../controllers/cartControllers/validation/cartValidation.js';
import { validateWishlistRequest } from '../controllers/wishlistController/validation/wishlistValidation.js';
import { allOrders, orderDetails, userOrder } from '../controllers/ordersValidation/ordersController.js';
import { validateOrderRequest } from '../controllers/ordersValidation/validation/ordersValidation.js';
import { validateUserLoginRequest } from '../controllers/usersController/validation/userLoginValidation.js';
import {validateUserRegisterRequest} from '../controllers/usersController/validation/usersValidation.js'
import { validateUserProfileUpdateRequest } from '../controllers/usersController/validation/userProfileUpdateValidation.js';

const router = express.Router();


//register
router.post('/register',validateUserRegisterRequest,register)

//login
router.post('/login',validateUserLoginRequest,login)

//updateUserPRofile
router.put('/update-profile/:_id',jwtMiddleware,userProfileUpdate)


//all users
router.get('/all-users',getAllUsers)

//get user by id
router.get('/user/:_id',getUserById)

//delete user
router.delete('/delete-user/:_id',removeUser)



//addtocart
router.post('/add-to-cart',jwtMiddleware,validateCartRequest,addToCart)

//get cart products
router.get('/cart-products',jwtMiddleware,cartProducts)

//cart qty increment
router.put('/cart-increment/:_id',jwtMiddleware,incrementCartQty)

//cart qty decrement
router.put('/cart-decrement/:_id',jwtMiddleware,decrementCartQty)

//delete cart product
router.delete('/delete-cart-product/:_id',jwtMiddleware,deleteCartProduct)




//add to wishlist
router.post('/add-to-wishlist',jwtMiddleware,validateWishlistRequest,addToWishlist)

//get wishlist products
router.get('/wishlist-products',jwtMiddleware,getWishlistProducts)

//delete wishlist product
router.delete('/delete-wishlist-product/:_id',jwtMiddleware,deleteWishlistProduct)




//order details
router.post('/add-order-details',jwtMiddleware,validateOrderRequest,orderDetails)

//user orders
router.get('/user-orders',jwtMiddleware,userOrder)


//all orders
router.get('all-orders',jwtMiddleware,allOrders)

export default router