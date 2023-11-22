require('dotenv').config();
const express = require('express');
const cors = require('cors'); // Add this line to include the 'cors' module
const app = express();

const secret_key = process.env.SECRET_KEY
const url = process.env.ENV === "development" ? process.env.DEV_URL : process.env.PROD_URL;
const stripe = require('stripe')(secret_key);


// Enable CORS for all routes
app.use(cors());

// Parse JSON requests
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hey this is my API running 🥳')
})
// Enable preflight requests for the POST method
app.options('/create-checkout-session', cors());

// Handle the actual POST request
app.post('/create-checkout-session', async (req, res) => {
  // Allow requests only from specific origins
  res.header('Access-Control-Allow-Origin',"*");
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
      success_url: `${url}/public/success.html`, // Replace with your actual success URL
      cancel_url: `${url}/public/error.html`,   // Replace with your actual error URL
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
