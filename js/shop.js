/* Shop page product filter and pagination logic */
const productGrid = document.getElementById('product-grid');
const productCount = document.getElementById('product-count');
const previousPageButtons = document.querySelectorAll('#previous-page, #previous-page-mobile');
const nextPageButtons = document.querySelectorAll('#next-page, #next-page-mobile');

let currentPage = 1;
const productsPerPage = 6;
let filteredProducts = DRIX_PRODUCTS;

const getFilters = () => ({
  search: document.getElementById('search-input')?.value.trim().toLowerCase() || '',
  category: document.getElementById('category-filter')?.value || 'All',
  price: document.getElementById('price-filter')?.value || 'all',
  size: document.getElementById('size-filter')?.value || 'All',
  color: document.getElementById('color-filter')?.value || 'All',
  sort: document.getElementById('sort-filter')?.value || 'default'
});

const applyFilters = () => {
  const { search, category, price, size, color, sort } = getFilters();
  filteredProducts = DRIX_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search) || product.category.toLowerCase().includes(search);
    const matchesCategory = category === 'All' || product.category === category;
    const matchesColor = color === 'All' || product.color === color;
    const matchesSize = size === 'All' || product.sizes.includes(size);
    const matchesPrice = price === 'all' || (price === '0-80' && product.price <= 80) || (price === '80-150' && product.price > 80 && product.price <= 150) || (price === '150-250' && product.price > 150);
    return matchesSearch && matchesCategory && matchesColor && matchesSize && matchesPrice;
  });

  if (sort === 'price-low') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    filteredProducts.sort((a, b) => b.rating - a.rating);
  }

  currentPage = 1;
  renderProducts();
};

const renderProducts = () => {
  const start = (currentPage - 1) * productsPerPage;
  const pageProducts = filteredProducts.slice(start, start + productsPerPage);
  productGrid.innerHTML = pageProducts.map((product) => `
    <article class="shop-card">
      <img data-product-id="${product.id}" src="${product.image}" alt="${product.name}">
      <div class="product-card-body">
        <div class="product-meta">
          <div>
            <h3>${product.name}</h3>
            <p class="price">EGP ${product.price.toFixed(0)}</p>
          </div>
          <span class="badge">${product.badge}</span>
        </div>
        <p>${product.description}</p>
        <div class="product-actions">
          <a href="product.html?id=${product.id}" class="text-link">Quick View</a>
          <button class="btn btn-secondary" data-add-to-cart="${product.id}">Add To Cart</button>
        </div>
      </div>
    </article>
  `).join('');

  productCount.textContent = `${filteredProducts.length} products found`;

  if (typeof applySiteImageOverrides === 'function') {
    applySiteImageOverrides();
  }
};

const goToPage = (direction) => {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  if (direction === 'next' && currentPage < totalPages) {
    currentPage += 1;
  } else if (direction === 'prev' && currentPage > 1) {
    currentPage -= 1;
  }
  renderProducts();
};

const bindShopEvents = () => {
  ['search-input', 'category-filter', 'price-filter', 'size-filter', 'color-filter', 'sort-filter'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', applyFilters);
      el.addEventListener('input', applyFilters);
    }
  });

  previousPageButtons.forEach((button) => {
    button?.addEventListener('click', () => goToPage('prev'));
  });

  nextPageButtons.forEach((button) => {
    button?.addEventListener('click', () => goToPage('next'));
  });

  productGrid.addEventListener('click', (event) => {
    if (event.target.matches('[data-add-to-cart]')) {
      const productId = Number(event.target.dataset.addToCart);
      addToCart(productId, 1);
      alert('Added to cart');
    }
  });
};

const initShopPage = () => {
  applyFilters();
  bindShopEvents();
};

if (document.body.contains(productGrid)) {
  initShopPage();
}
