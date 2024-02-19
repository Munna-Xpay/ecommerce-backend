import express from 'express';
import { login, register, userProfileUpdate } from '../controllers/usersController/usersController.js';
import fileUploads from '../middlewares/multerMiddleware.js';
import { jwtMiddleware } from '../middlewares/jwtMiddleware.js';



const router = express.Router();



//register
router.post('/register',register)

//login
router.post('/login',login)

//updateUserPRofile
router.put('/update-profile/:_id',jwtMiddleware,fileUploads.single('profileImage'),userProfileUpdate)


export default router