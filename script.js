document.addEventListener('DOMContentLoaded', () => {
    const options = {
        threshold: 0.12,
    };

    const observer = new IntersectionObserver((entries, observerRef) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-visible');
                observerRef.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });

    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim()) {
                alert(`Thank you for subscribing, ${emailInput.value.trim()}!`);
                newsletterForm.reset();
            }
        });
    }
});
