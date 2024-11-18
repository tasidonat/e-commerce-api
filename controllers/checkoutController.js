const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/Product');

exports.checkout = async (req, res) => {
    const { items, email } = req.body;

    if(!items || !email) {
        return res.status(400).json({ message: 'Items and email is required' });
    }

    try {
        const lineItems = [];

        for(const item of items) {
            const product = await Product.findById(item.product);

            if(!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel`,
            customer_email: email,
        });

        return res.status(200).json({ url: session.url });
    } catch (error) {
        return res.status(500).json({ message: error });
    }
};