/* Contact page validation */
const contactForm = document.getElementById('contact-form');

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value.trim();
    const email = contactForm.querySelector('[name="email"]').value.trim();
    const message = contactForm.querySelector('[name="message"]').value.trim();

    if (name && email && message) {
      alert('Thank you for reaching out. We will respond soon.');
      contactForm.reset();
    } else {
      alert('Please complete all fields before sending your message.');
    }
  });
}
