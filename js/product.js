/* Product page rendering and actions */
const productId = new URLSearchParams(window.location.search).get('id') || '1';
const product = getProductById(productId);

const productMainImage = document.getElementById('product-main-image');
const thumbnailsContainer = document.getElementById('product-thumbnails');
const productName = document.getElementById('product-name');
const productPrice = document.getElementById('product-price');
const productOldPrice = document.getElementById('product-old-price');
const productDescription = document.getElementById('product-description');
const productMaterial = document.getElementById('product-material');
const productShipping = document.getElementById('product-shipping');
const colorSelect = document.getElementById('product-color');
const sizeSelect = document.getElementById('product-size');
const quantityDisplay = document.getElementById('product-quantity');
const stockLabel = document.getElementById('product-stock');
const addToCartButton = document.getElementById('add-to-cart');
const buyNowButton = document.getElementById('buy-now');
const wishlistButton = document.getElementById('add-to-wishlist');
const shareButton = document.getElementById('share-product');
const relatedProductsContainer = document.getElementById('related-products');

let quantity = 1;

const renderProduct = () => {
  if (!product) {
    return;
  }

  productMainImage.src = product.image;
  productMainImage.alt = product.name;
  productMainImage.dataset.productId = product.id;
  productName.textContent = product.name;
  productPrice.textContent = `EGP ${product.price.toFixed(2)}`;
  productOldPrice.textContent = `EGP ${product.oldPrice.toFixed(2)}`;
  productDescription.textContent = product.description;
  productMaterial.textContent = product.material;
  productShipping.textContent = product.shipping;
  stockLabel.textContent = 'In stock';

  colorSelect.innerHTML = `<option value="${product.color}">${product.color}</option>`;
  sizeSelect.innerHTML = product.sizes.map((size) => `<option value="${size}">${size}</option>`).join('');

  const galleryImages = [product.image, 'images/product4.jpg', 'images/product5.jpg', 'images/product6.jpg'];
  thumbnailsContainer.innerHTML = galleryImages
    .map((src) => `<img src="${src}" alt="${product.name} view" class="product-thumb">`)
    .join('');

  relatedProductsContainer.innerHTML = DRIX_PRODUCTS.filter((item) => item.id !== product.id)
    .slice(0, 3)
    .map((item) => `
      <article class="card">
        <img src="${item.image}" alt="${item.name}">
        <div class="card-body">
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <a href="product.html?id=${item.id}" class="text-link">View product</a>
        </div>
      </article>
    `)
    .join('');
};

const bindProductEvents = () => {
  thumbnailsContainer?.addEventListener('click', (event) => {
    const target = event.target.closest('.product-thumb');
    if (target) {
      productMainImage.src = target.src;
    }
  });

  document.getElementById('quantity-increase')?.addEventListener('click', () => {
    quantity += 1;
    quantityDisplay.textContent = quantity;
  });

  document.getElementById('quantity-decrease')?.addEventListener('click', () => {
    quantity = Math.max(1, quantity - 1);
    quantityDisplay.textContent = quantity;
  });

  addToCartButton?.addEventListener('click', () => {
    addToCart(product.id, quantity, sizeSelect.value, colorSelect.value);
    alert('Product added to cart.');
  });

  buyNowButton?.addEventListener('click', () => {
    addToCart(product.id, quantity, sizeSelect.value, colorSelect.value);
    window.location.href = 'checkout.html';
  });

  wishlistButton?.addEventListener('click', () => {
    addToWishlist(product.id);
    alert('Added to wishlist.');
  });

  shareButton?.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Product link copied to clipboard.');
    });
  });
};

if (productMainImage) {
  document.addEventListener('DOMContentLoaded', () => {
    renderProduct();
    bindProductEvents();
    if (typeof applySiteImageOverrides === 'function') {
      applySiteImageOverrides();
    }
  });
}
