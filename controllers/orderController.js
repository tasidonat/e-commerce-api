const Order = require('../models/Order');
const Product = require('../models/Product');

// Create order
exports.createOrder = async (req, res) => {
    const { name, email, items, amount, address } = req.body;

    if (!name || !email || !items || !amount || !address) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        for (const item of items) {
            const product = await Product.findOne(item.product);

            if(!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
        }

        const newOrder = new Order({
            name,
            email,
            items,
            amount,
            address,
            status: 'pending'
        });

        await newOrder.save();

        return res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error });
    }
};

// Get all orders
exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('items.product');

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Get order
exports.getOrder = async (req, res) => {
    const orderId = req.params.id;

    try {
        const order = await Order.findById(orderId).populate('item.product');

        if(!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
    const { status } = req.body;
    const orderId = req.params.id;

    if(!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    try {
        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });

        if(!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};

// Get user orders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ email: req.body.email }).populate('items.product');

        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}