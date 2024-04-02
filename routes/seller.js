import express from 'express'
import { getSellerProductsGrid } from '../controllers/categoryController/categoryControllers.js'

const router=express.Router()

//product grid
router.get('/products-grid/:id',getSellerProductsGrid)

export default router;