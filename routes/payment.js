import express from "express";
import Stripe from "stripe";
import Booking from "../models/Booking.js";
import authenticateUser from "../middleware/authMiddleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/create-checkout-session", authenticateUser, async (req, res) => {
    try {
        const { amount, bookingId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [{
                price_data: {
                    currency: "usd",
                    product_data: { name: "Vehicle Rental" },
                    unit_amount: amount * 100,
                },
                quantity: 1,
            }],
            mode: "payment",
            success_url: `${process.env.CLIENT}/payment-success?bookingId=${bookingId}`,
            cancel_url: `${process.env.CLIENT}/payment-cancel`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Payment initiation failed" });
    }
});



router.post("/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    try {
        const event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const bookingId = session.metadata.bookingId;

            // Update the booking status to "Confirmed"
            await Booking.findByIdAndUpdate(bookingId, { status: "Confirmed" });
        }

        res.status(200).send("Webhook received successfully");
    } catch (error) {
        console.error("Webhook Error:", error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

export default router;
