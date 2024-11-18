const express = require('express');
const multer = require('multer');
const { getProducts, getProduct, createProduct, deleteProduct, updateProduct, addReview } = require('../controllers/productController');
const { authenticate, adminOnly } = require('../middleware/auth');

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, 0);

        cb(null, `public/images/${year}/${month}`);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({ storage });

// Get all products
router.get('/', getProducts);

// Get one product
router.get('/:id', getProduct);

// Create product
router.post(
    '/',
    authenticate,
    adminOnly,
    upload.fields([
        { name: 'featuredImage', maxCount: 1 },
        { name: 'galleryImages', maxCount: 5 },
    ]),
    createProduct
);

// Update product
router.patch(
    '/id',
    authenticate,
    adminOnly,
    upload.single('featuredImage'),
    updateProduct
);

// Delete product
router.delete('/:id', authenticate, adminOnly, deleteProduct);

// Add review
router.post('/reviews', authenticate, addReview);

module.exports = router;