require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line to include the 'cors' module
const app = express();

const secret_key = "sk_test_51O9nO6DzfAzbhczjJI27Vix4L5AFMBQDTEd7thTsS46FhRHpnY5IOjRxhu4pPkDEIcV1UAqWy7KrStPVewduqjZg00rICMT23A"
const url = "http://127.0.0.1:5500"
const stripe = require('stripe')(secret_key);

// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json());

// Enable preflight requests for the POST method
app.options('/create-checkout-session', cors());

// Handle the actual POST request
app.post('/create-checkout-session', async (req, res) => {
  // Allow requests only from specific origins
  res.header('Access-Control-Allow-Origin', "http://127.0.0.1:5500");
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Donation',
          },
          unit_amount: req.body.amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${url}/success`, // Replace with your actual success URL
      cancel_url: `${url}/error`,   // Replace with your actual error URL
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
