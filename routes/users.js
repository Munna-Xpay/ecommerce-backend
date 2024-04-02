import express from 'express';
import { getAllUsers, getAllUsersWithStat, getConversionRate, getUserById, login, register, removeUser, updateProfilePicture, userProfileUpdate } from '../controllers/usersController/usersController.js';
import fileUploads from '../middlewares/multerMiddleware.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';
import { addToCart, cartProducts, changeCartQuantity, decrementCartQty, deleteCartProduct, incrementCartQty } from '../controllers/cartControllers/cartController.js';
import { addToWishlist, deleteWishlistProduct, getWishlistProducts } from '../controllers/wishlistController/wishlistController.js';
import { validateCartRequest } from '../controllers/cartControllers/validation/cartValidation.js';
import { validateWishlistRequest } from '../controllers/wishlistController/validation/wishlistValidation.js';
import { allOrders, cancelOrder, deleteOrder, getOrderByCategory, getOrderByCategoryBySeller, orderDetails, updateOrder, userOrder } from '../controllers/ordersValidation/ordersController.js';
import { validateOrderRequest } from '../controllers/ordersValidation/validation/ordersValidation.js';
import { validateUserLoginRequest } from '../controllers/usersController/validation/userLoginValidation.js';
import { validateUserRegisterRequest } from '../controllers/usersController/validation/usersValidation.js'
import { validateUserProfileUpdateRequest } from '../controllers/usersController/validation/userProfileUpdateValidation.js';

const router = express.Router();


//register
router.post('/register', validateUserRegisterRequest, register)

//login
router.post('/login', validateUserLoginRequest, login)

//updateUserPRofile
router.put('/update-profile/:_id', jwtMiddleware, userProfileUpdate)

//updateUserProfilePicture
router.put('/update-profile-picture/:id', jwtMiddleware, fileUploads.single('profileImage'), updateProfilePicture)


//all users with stat
router.get('/all-users-with-stat', jwtMiddleware, getAllUsersWithStat)

//all users route
router.get('/all-users', jwtMiddleware, getAllUsers)

//get conversionrate of users
router.get('/users-conversion-rate', jwtMiddleware, getConversionRate)

//get user by id
router.get('/user/:_id', getUserById)

//delete user
router.delete('/delete-user/:_id', removeUser)



//addtocart
router.post('/add-to-cart', jwtMiddleware, validateCartRequest, addToCart)

//get cart products
router.get('/cart-products', jwtMiddleware, cartProducts)

//cart qty increment
router.put('/cart-increment/:_id', jwtMiddleware, incrementCartQty)

//cart qty decrement
router.put('/cart-decrement/:_id', jwtMiddleware, decrementCartQty)

//update cart quantity
router.put('/change-cart-quantity/:id', jwtMiddleware, changeCartQuantity)

//delete cart product
router.delete('/delete-cart-product/:_id', jwtMiddleware, deleteCartProduct)




//add to wishlist
router.post('/add-to-wishlist', jwtMiddleware, validateWishlistRequest, addToWishlist)

//get wishlist products
router.get('/wishlist-products', jwtMiddleware, getWishlistProducts)

//delete wishlist product
router.delete('/delete-wishlist-product/:_id', jwtMiddleware, deleteWishlistProduct)




//order details
router.post('/add-order-details', jwtMiddleware, validateOrderRequest, orderDetails)

//user orders
router.get('/user-orders', jwtMiddleware, userOrder)


//all orders
router.get('/all-orders', jwtMiddleware, allOrders)

//delete orders
router.delete('/delete-orders/:id', jwtMiddleware, deleteOrder)

//Cancel order
router.put('/cancel-order/:id', jwtMiddleware, cancelOrder)

//update order
router.put('/update-order/:id', jwtMiddleware, updateOrder)

//order by category
router.get('/get-orders', jwtMiddleware, getOrderByCategory)

//order by category by seller
router.get('/get-orders-by-seller/:id', jwtMiddleware, getOrderByCategoryBySeller)


export default router