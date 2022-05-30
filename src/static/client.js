window.addEventListener("load", onLoaded);

async function onLoaded() {
  const clientSession = await fetch('/client-session', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
  }).then(data => data.json())

  const { clientToken } = clientSession
  console.log(clientSession)
  // render order to customer
  display_order(clientSession)

  const universalCheckout = await Primer.showUniversalCheckout(clientToken, {
    // Specify the selector of the container element
    container: '#checkout-container',

    /**
     * When the checkout flow has been completed, you'll receive
     * the successful payment via `onCheckoutComplete`.
     * Implement this callback to redirect the user to an order confirmation page and fulfill the order.
     */
    onCheckoutComplete({ payment }) {
      console.log('Checkout Complete!', payment)
      document.getElementById("payment-status-box").innerHTML = `
      <div id="payment-status"><span>Your payment is successful! We are preparing your order for shipment. </span></div>
      `
    },

    /**
     * Learn more about the other options at:
     * https://primer.io/docs
     * https://www.npmjs.com/package/@primer-io/checkout-web
     */
  })
  // .then(() => {
  //   document.getElementById("primer-checkout-apm-button-container").innerHTML = "Payment"
  // })
}
