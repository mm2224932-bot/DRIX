/* Wishlist page logic */
const wishlistContainer = document.getElementById('wishlist-items');

const renderWishlist = () => {
  const wishlistIds = getStoredWishlist();
  if (!wishlistContainer) return;

  if (wishlistIds.length === 0) {
    wishlistContainer.innerHTML = `<div class="empty-state"><p>Your wishlist is empty.</p><a href="shop.html" class="btn btn-primary">Browse products</a></div>`;
    return;
  }

  wishlistContainer.innerHTML = wishlistIds.map((productId) => {
    const product = getProductById(productId);
    if (!product) return '';
    const imageSrc = typeof getProductImageOverride === 'function' ? getProductImageOverride(product.id) : product.image;
    return `
      <div class="cart-item">
        <img src="${imageSrc}" alt="${product.name}">
        <div class="cart-item-details">
          <h3>${product.name}</h3>
          <div class="product-meta-row">
            <span>${product.color}</span>
            <span>${product.sizes[0]}</span>
          </div>
          <div class="quantity-row">
            <button class="btn btn-secondary" data-add-to-cart="${product.id}">Move To Cart</button>
          </div>
          <button class="remove-item" data-remove-wishlist="${product.id}">Remove</button>
        </div>
      </div>
    `;
  }).join('');
};

wishlistContainer?.addEventListener('click', (event) => {
  const moveButton = event.target.closest('[data-add-to-cart]');
  const removeButton = event.target.closest('[data-remove-wishlist]');

  if (moveButton) {
    addToCart(Number(moveButton.dataset.addToCart), 1);
    removeFromWishlist(Number(moveButton.dataset.addToCart));
    renderWishlist();
    return;
  }

  if (removeButton) {
    removeFromWishlist(Number(removeButton.dataset.removeWishlist));
    renderWishlist();
  }
});

if (document.body.contains(wishlistContainer)) {
  document.addEventListener('DOMContentLoaded', renderWishlist);
}
