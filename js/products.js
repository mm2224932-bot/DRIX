/* Product data and shared product utilities for DRIX */
const DRIX_PRODUCTS = [
  { id: 1, name: 'Oversized T-Shirt', category: 'Tops', price: 85, oldPrice: 120, image: 'images/product1.jpg', badge: 'New', color: 'Black', sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, description: 'Relaxed fit tee with soft, premium cotton and a modern oversized cut.', material: '100% Cotton', shipping: 'Free shipping over EGP 150.' },
  { id: 2, name: 'Premium Hoodie', category: 'Hoodies', price: 150, oldPrice: 220, image: 'images/product2.jpg', badge: 'Sale', color: 'Charcoal', sizes: ['S', 'M', 'L', 'XL'], rating: 4.9, description: 'Minimal hoodie with brushed interior and elevated streetwear finish.', material: 'Cotton blend', shipping: 'Express delivery available.' },
  { id: 3, name: 'Cargo Pants', category: 'Bottoms', price: 145, oldPrice: 190, image: 'images/product3.jpg', badge: 'Limited', color: 'Olive', sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, description: 'Tailored cargo pants with utility details and a premium drape.', material: 'Cotton twill', shipping: 'Ships in 1-2 business days.' },
  { id: 4, name: 'Sweatpants', category: 'Bottoms', price: 95, oldPrice: 130, image: 'images/product4.jpg', badge: 'New', color: 'Black', sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, description: 'Soft sweatpants with tapered leg and luxury comfort.', material: 'Cotton blend', shipping: 'Free returns within 30 days.' },
  { id: 5, name: 'Denim Jacket', category: 'Outerwear', price: 210, oldPrice: 260, image: 'images/product5.jpg', badge: 'Sale', color: 'Dark Blue', sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, description: 'Minimal denim jacket with tailored fit and premium detailing.', material: 'Denim cotton', shipping: 'International shipping available.' },
  { id: 6, name: 'Bomber Jacket', category: 'Outerwear', price: 240, oldPrice: 320, image: 'images/product6.jpg', badge: 'Exclusive', color: 'Black', sizes: ['S', 'M', 'L', 'XL'], rating: 4.9, description: 'Luxury bomber jacket finished with sleek hardware and soft lining.', material: 'Cotton blend', shipping: 'Priority delivery option available.' },
  { id: 7, name: 'Zip Hoodie', category: 'Hoodies', price: 155, oldPrice: 200, image: 'images/product1.jpg', badge: 'New', color: 'White', sizes: ['S', 'M', 'L', 'XL'], rating: 4.8, description: 'Refined zip hoodie with premium fleece and clean lines.', material: 'Cotton blend', shipping: 'Free shipping over EGP 150.' },
  { id: 8, name: 'Basic Tee', category: 'Tops', price: 55, oldPrice: 75, image: 'images/product2.jpg', badge: 'Essential', color: 'Black', sizes: ['S', 'M', 'L', 'XL'], rating: 4.5, description: 'Essential tee with smooth fabric and elevated minimal aesthetic.', material: 'Cotton', shipping: 'Fast shipping included.' },
  { id: 9, name: 'Oversized Shirt', category: 'Tops', price: 110, oldPrice: 145, image: 'images/product3.jpg', badge: 'New', color: 'White', sizes: ['S', 'M', 'L', 'XL'], rating: 4.7, description: 'Crisp oversized shirt crafted for a premium drape and tailored finish.', material: 'Cotton blend', shipping: 'Ships in 1-2 business days.' },
  { id: 10, name: 'Cap', category: 'Accessories', price: 45, oldPrice: 60, image: 'images/product4.jpg', badge: 'Essential', color: 'Black', sizes: ['One Size'], rating: 4.4, description: 'Minimal designer cap with subtle branding and premium build.', material: 'Cotton', shipping: 'Free returns within 30 days.' },
  { id: 11, name: 'Shorts', category: 'Bottoms', price: 90, oldPrice: 120, image: 'images/product5.jpg', badge: 'Sale', color: 'Khaki', sizes: ['S', 'M', 'L', 'XL'], rating: 4.6, description: 'Sleek shorts made with lightweight fabric and modern tailoring.', material: 'Cotton blend', shipping: 'Express delivery available.' },
  { id: 12, name: 'Sneakers', category: 'Footwear', price: 220, oldPrice: 280, image: 'images/product6.jpg', badge: 'Limited', color: 'White', sizes: ['39', '40', '41', '42', '43'], rating: 4.9, description: 'Statement sneakers with premium materials and sculpted shape.', material: 'Leather & rubber', shipping: 'Priority shipping available.' }
];

const getProductById = (id) => DRIX_PRODUCTS.find((product) => product.id === Number(id));

const getProductsByCategory = (category) => {
  if (!category || category === 'All') {
    return DRIX_PRODUCTS;
  }
  return DRIX_PRODUCTS.filter((product) => product.category === category);
};

const getFeaturedProducts = () => DRIX_PRODUCTS.slice(0, 3);

const defaultCart = [];
const defaultWishlist = [];

const getStoredCart = () => {
  try {
    return JSON.parse(localStorage.getItem('drixCart')) || defaultCart;
  } catch (error) {
    return defaultCart;
  }
};

const getStoredWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem('drixWishlist')) || defaultWishlist;
  } catch (error) {
    return defaultWishlist;
  }
};

const saveCart = (cart) => localStorage.setItem('drixCart', JSON.stringify(cart));
const saveWishlist = (wishlist) => localStorage.setItem('drixWishlist', JSON.stringify(wishlist));

const addToCart = (productId, quantity = 1, chosenSize = null, chosenColor = null) => {
  const cart = getStoredCart();
  const itemKey = `${productId}-${chosenSize || 'default'}-${chosenColor || 'default'}`;
  const existing = cart.find((item) => item.key === itemKey);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({ key: itemKey, id: productId, quantity, size: chosenSize, color: chosenColor });
  }

  saveCart(cart);
  return cart;
};

const removeFromCart = (itemKey) => {
  const cart = getStoredCart().filter((item) => item.key !== itemKey);
  saveCart(cart);
  return cart;
};

const updateCartItemQuantity = (itemKey, quantity) => {
  const cart = getStoredCart();
  const item = cart.find((entry) => entry.key === itemKey);
  if (item) {
    item.quantity = Math.max(1, quantity);
    saveCart(cart);
  }
  return cart;
};

const addToWishlist = (productId) => {
  const wishlist = getStoredWishlist();
  if (!wishlist.includes(productId)) {
    wishlist.push(productId);
    saveWishlist(wishlist);
  }
  return wishlist;
};

const removeFromWishlist = (productId) => {
  const wishlist = getStoredWishlist().filter((id) => id !== productId);
  saveWishlist(wishlist);
  return wishlist;
};

const isInWishlist = (productId) => getStoredWishlist().includes(productId);

const getCartDetails = () => {
  const cart = getStoredCart();
  return cart.map((item) => {
    const product = getProductById(item.id);
    return {
      ...item,
      product,
      subtotal: product ? product.price * item.quantity : 0
    };
  });
};

const getCartTotals = () => {
  const details = getCartDetails();
  const subtotal = details.reduce((sum, item) => sum + item.subtotal, 0);
  const shipping = subtotal ? 20 : 0;
  const discount = subtotal >= 200 ? 25 : 0;
  const total = subtotal + shipping - discount;
  return { subtotal, shipping, discount, total };
};

const formatCurrency = (value) => `EGP ${value.toFixed(2)}`;
