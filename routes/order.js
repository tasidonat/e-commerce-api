const express = require('express');
const { authenticate, adminOnly } = require('../middleware/auth');
const { getOrders, getOrder, createOrder, updateOrderStatus, getMyOrders } = require('../controllers/orderController');

const router = express.Router();

// Get all orders
router.get('/', authenticate, adminOnly, getOrders);

// Get order
router.get('/:id', authenticate, adminOnly, getOrder);

// Create new order
router.post('/', createOrder);

// Update order status
router.patch('/:id', authenticate, adminOnly, updateOrderStatus);

// Get user orders
router.get('/my-orders', authenticate, getMyOrders);

module.exports = router;