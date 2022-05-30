// This example is built using express
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

///////////////////////////////////////////
// ⚙️ Setup Server
///////////////////////////////////////////

const app = express();

const staticDir = path.join(__dirname, 'static');
const checkoutPage = path.join(__dirname, 'static', 'checkout.html');

app.use(bodyParser.json());
app.use('/static', express.static(staticDir));

app.get('/', (req, res) => {
  return res.sendFile(checkoutPage);
});

///////////////////////////////////////////
// ✨ All the magic is here 
//    Create a client session 
///////////////////////////////////////////

const PRIMER_API_URLS = {
  SANDBOX: 'https://api.sandbox.primer.io',
  PRODUCTION: 'https://api.primer.io',
}

const API_KEY = process.env.API_KEY;
const PRIMER_API_URL = PRIMER_API_URLS[process.env.PRIMER_API_ENVIRONMENT];


app.post('/client-session', async (req, res) => {
  const url = `${PRIMER_API_URL}/client-session`;

  const response_primer = await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Version': '2021-10-19',
      'X-Api-Key': API_KEY,
    },
    body: JSON.stringify({
      // Create an orderId for this client session
      // Make sure to keep track of it: you will later receive updates through Webhooks.
      orderId: 'order-' + Math.random(),

      // 3-character Currency Code used for all the amount of this session
      currencyCode: 'EUR',

      order: {
        // Line items for this session
        // If your checkout does not have line items:
        //  > Pass a single line item with the total amount!
        lineItems: [
          {
            itemId: 'shirt-1',
            description: 'Louis Vuiton Premium Shirt',
            amount: 250000, // Amount should be in minor units!
            quantity: 2,
          },
          {
            itemId: 'belt-1',
            description: 'Louis Vuiton Cow Skin Belt',
            amount: 80000, // Amount should be in minor units!
            quantity: 1,
          },
        ],
      },
      // Check all the other options at https://apiref.primer.io/v2/reference/create_client_side_token_client_session_post
    }),
  }).then(data => data.json());

  return res.send(response_primer);
});

app.post('/webhooks/payment-status', async (req, res) => {
	const { eventType, payment } = req.body
	const { id, orderId, status } = payment
 
	if (status === 'AUTHORIZED' || status === 'SETTLED') {
		// Fullfil the order for the Payment / Client Session labelled with `orderId`
        console.log(`Payment successful for order: ${orderId}, proceed with preparing package delivery`)
	}
    else {
        console.log(`Payment for order ${orderId} unsuccessful`)
    }
})

///////////////////////////////////////////
// 🏃‍♂️ Run Server
///////////////////////////////////////////

const PORT = process.env.PORT || 8880;
console.log(`Checkout server listening on port ${PORT}.\nYou can now view the Checkout in a web browser at http://localhost:${PORT}`);
app.listen(PORT);
