/* Checkout page JavaScript */
const checkoutForm = document.getElementById('checkout-form');

const validateCheckoutForm = (form) => {
  const requiredFields = ['full-name', 'email', 'phone', 'country', 'city', 'address', 'zip'];
  return requiredFields.every((name) => {
    const field = form.querySelector(`[name="${name}"]`);
    return field && field.value.trim().length > 0;
  });
};

if (checkoutForm) {
  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (validateCheckoutForm(checkoutForm)) {
      alert('Order placed successfully. Thank you for shopping with DRIX.');
      checkoutForm.reset();
    } else {
      alert('Please complete all required fields before placing your order.');
    }
  });
}
