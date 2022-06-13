const express = require('express')
const router = express.Router()

// import middleware
const { uploadFile } = require('../middlewares/uploadFile')
const { auth } = require('../middlewares/auth')

// import controller
const { register, login, checkAuth } = require('../controllers/auth')
const { addProduct, getProducts, getProductDetail, updateProduct, deleteProduct, getProductName } = require('../controllers/product')
const { addCategory, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/category')
const { addTransaction, getTransactions, notification, deleteTransaction } = require('../controllers/transaction')
const { getUsers } = require('../controllers/user')
const { getProfile, updateProfile } = require('../controllers/profile')

// router authentication
router.post('/register', register)
router.post('/login', login)
router.get('/check-auth', auth, checkAuth)

// router products
router.post('/product', auth, uploadFile('image'), addProduct)
router.get('/products', getProducts)
router.get('/product/:id', getProductDetail)
router.patch('/product/:id', auth, uploadFile('image'), updateProduct)
router.delete('/product/:id', auth, deleteProduct)
router.get('/productname/:title', getProductName)

// router category
router.post('/category', auth, addCategory)
router.get('/categories', getCategories)
router.get('/category/:id', getCategory)
router.patch('/category/:id', auth, updateCategory)
router.delete('/category/:id', auth, deleteCategory)

// router transaction
router.post('/transaction', auth, addTransaction)
router.get('/transactions', auth, getTransactions)
router.delete('/transaction/:id', deleteTransaction)

// notification for midtrans
router.post("/notification", notification);

// router profile
router.post('/profile')
router.get('/profile/:id', getProfile)
router.patch('/profile/:id', auth, uploadFile('image'), updateProfile)

// router user
router.get('/users', getUsers)
module.exports = router