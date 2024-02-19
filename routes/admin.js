import express from 'express';
import { addSeller, deleteSeller, getAllSeller, getOneSeller, updateSeller } from '../controllers/sellerController/sellerController.js';
const router = express.Router();

//add seller route
router.post('/add/seller', addSeller);

//get seller route

/*
do not use params like this 
router.get('/get/seller', getAllSeller);
avoid unwanted parameters

user like 
router.get('/get-seller', getAllSeller);
router.get('/get-seller/:id', getAllSeller);
router.put('/update-seller/:id', getAllSeller);
router.delete('/delete-seller/:id', getAllSeller);
*/
router.get('/get/seller', getAllSeller); 

//get one seller route
router.get('/get/one/seller/:id', getOneSeller);

//update seller route
router.put('/update/seller/:id', updateSeller);

//delete seller route
router.delete('/delete/seller/:id', deleteSeller);



export default router