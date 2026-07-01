/* Cart page behavior and rendering logic */
const cartItemsContainer = document.getElementById('cart-items');
const summarySubtotal = document.getElementById('summary-subtotal');
const summaryShipping = document.getElementById('summary-shipping');
const summaryDiscount = document.getElementById('summary-discount');
const summaryTotal = document.getElementById('summary-total');

const renderCart = () => {
  const cartDetails = getCartDetails();
  if (!cartItemsContainer) return;

  if (cartDetails.length === 0) {
    cartItemsContainer.innerHTML = `<div class="empty-state"><p>Your cart is currently empty.</p><a href="shop.html" class="btn btn-primary">Continue Shopping</a></div>`;
    summarySubtotal.textContent = 'EGP 0.00';
    summaryShipping.textContent = 'EGP 0.00';
    summaryDiscount.textContent = 'EGP 0.00';
    summaryTotal.textContent = 'EGP 0.00';
    return;
  }

  cartItemsContainer.innerHTML = cartDetails.map((item) => {
    const imageSrc = typeof getProductImageOverride === 'function' ? getProductImageOverride(item.product.id) : item.product.image;
    return `
    <div class="cart-item">
      <img src="${imageSrc}" alt="${item.product.name}">
      <div class="cart-item-details">
        <h3>${item.product.name}</h3>
        <div class="product-meta-row">
          <span>Color: ${item.color || item.product.color}</span>
          <span>Size: ${item.size || item.product.sizes[0]}</span>
        </div>
        <div class="quantity-row">
          <button data-change-qty="decrease" data-key="${item.key}">-</button>
          <span>${item.quantity}</span>
          <button data-change-qty="increase" data-key="${item.key}">+</button>
        </div>
        <div class="product-meta-row">
          <span>${formatCurrency(item.product.price)}</span>
          <button class="remove-item" data-remove="${item.key}">Remove</button>
        </div>
      </div>
    </div>
  `).join('');

  const totals = getCartTotals();
  summarySubtotal.textContent = formatCurrency(totals.subtotal);
  summaryShipping.textContent = formatCurrency(totals.shipping);
  summaryDiscount.textContent = formatCurrency(totals.discount);
  summaryTotal.textContent = formatCurrency(totals.total);
};

const bindCartEvents = () => {
  cartItemsContainer?.addEventListener('click', (event) => {
    const removeButton = event.target.closest('[data-remove]');
    const qtyButton = event.target.closest('[data-change-qty]');

    if (removeButton) {
      removeFromCart(removeButton.dataset.remove);
      renderCart();
      return;
    }

    if (qtyButton) {
      const action = qtyButton.dataset.changeQty;
      const key = qtyButton.dataset.key;
      const cart = getStoredCart();
      const item = cart.find((entry) => entry.key === key);
      if (!item) return;
      const newQuantity = action === 'increase' ? item.quantity + 1 : item.quantity - 1;
      if (newQuantity <= 0) {
        removeFromCart(key);
      } else {
        updateCartItemQuantity(key, newQuantity);
      }
      renderCart();
    }
  });
};

if (document.body.classList.contains('cart-page') || document.getElementById('cart-items')) {
  document.addEventListener('DOMContentLoaded', () => {
    renderCart();
    bindCartEvents();
  });
}
