// backend/controllers/stripeController.js
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCheckoutSession = async (req, res) => {
  const { eventName, amount } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{
        price_data: {
          currency: "usd",
          product_data: {
            name: eventName
          },
          unit_amount: amount * 100 // Stripe uses cents
        },
        quantity: 1
      }],
      mode: "payment",
      success_url: "http://localhost:3000/payment-success",
      cancel_url: "http://localhost:3000/payment-cancelled"
    });

    res.status(200).json({ id: session.id, url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
