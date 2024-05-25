document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetSection = document.querySelector(this.getAttribute('href'));
        window.scrollTo({
            top: targetSection.offsetTop - document.querySelector('header').offsetHeight,
            behavior: 'smooth'
        });
    });
});

window.addEventListener('DOMContentLoaded', () => {
    const greetingText = document.getElementById('greeting-text');
    const greetings = ["Hello", "Hola", "Bonjour", "Ciao", "Привет", "你好", "안녕하세요", "Olá"]; // List of greetings
    let index = 0;

    const interval = setInterval(cycleGreetings, 150); // Change greeting every 150ms

    function cycleGreetings() {
        greetingText.textContent = greetings[index];
        index = (index + 1) % greetings.length; // Loop through greetings
    }

    setTimeout(() => {
        clearInterval(interval); // Stop changing greetings
        fadeOutIntro(); // Start the upward swipe and fade-out effect
    }, 1200); // Display time before starting the transition
});

function fadeOutIntro() {
    const intro = document.getElementById('intro');
    intro.style.transition = 'transform 1s ease-in-out, opacity 1s ease-in-out';
    intro.style.transform = 'translateY(-100vh)'; // Move up out of view
    intro.style.opacity = 0;

    setTimeout(() => {
        intro.style.display = 'none';
    }, 1000); // Wait for the transition to complete before hiding the intro
}
// Handle contact form submission
document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    fetch('/api/send_email', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        const contactMessage = document.getElementById('contact-message');
        if (data.success) {
            contactMessage.textContent = 'Message sent successfully!';
            contactMessage.style.color = 'green';
        } else {
            contactMessage.textContent = 'Message sending failed.';
            contactMessage.style.color = 'red';
        }
        // Clear the form
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        const contactMessage = document.getElementById('contact-message');
        contactMessage.textContent = 'An error occurred. Please try again later.';
        contactMessage.style.color = 'red';
    });
});
