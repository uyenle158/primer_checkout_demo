function display_order(clientSession) {
  const order = clientSession.order
  const lineItems = order.lineItems
  const total = (clientSession.amount / 100).toFixed(2)
  var item_str = ""
  lineItems.forEach(e => {
    const html = `
    <div class="item">
      <div class="img-col">
        <img src="/static/img/${e.itemId}.png" alt="" />
      </div>
      <div class="meta-col">
        <h3>${e.description}</h3>
        <p class="price">€${(e.amount / 100).toFixed(2)}</p>
        <p class="quanity">x ${e.quantity}</p>
      </div>
    </div>
    `
    item_str = item_str + html
  });
  document.getElementById("item-list").innerHTML = item_str
  document.getElementById("total-price").innerHTML = `<span>€</span> ${total}`
}





