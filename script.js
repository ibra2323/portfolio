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
        body: JSON.stringify({
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        const contactMessage = document.getElementById('contact-message');
        if (data.success) {
            contactMessage.textContent = 'Message sent successfully!';
            contactMessage.style.color = 'green';
        } else {
            contactMessage.textContent = `Message sending failed: ${data.message}`;
            contactMessage.style.color = 'red';
        }
        // Clear the form
        document.getElementById('contact-form').reset();
    })
    .catch(error => {
        const contactMessage = document.getElementById('contact-message');
        contactMessage.textContent = `An error occurred: ${error.message}`;
        contactMessage.style.color = 'red';
    });
});
class Grad {
  constructor(x, y, z) {
    this.x = x; this.y = y; this.z = z;
  }
  dot2(x, y) { return this.x * x + this.y * y; }
}

class Noise {
  constructor(seed = 0) {
    this.grad3 = [
      new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
      new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
      new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
    ];
    this.p = [...Array(256).keys()].sort(() => Math.random() - 0.5);
    this.perm = [...this.p, ...this.p];
    this.gradP = this.perm.map(v => this.grad3[v % 12]);
  }
  fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  lerp(a, b, t) { return (1 - t) * a + t * b; }
  perlin2(x, y) {
    let X = Math.floor(x), Y = Math.floor(y);
    x -= X; y -= Y; X &= 255; Y &= 255;
    const n00 = this.gradP[X + this.perm[Y]].dot2(x, y);
    const n01 = this.gradP[X + this.perm[Y + 1]].dot2(x, y - 1);
    const n10 = this.gradP[X + 1 + this.perm[Y]].dot2(x - 1, y);
    const n11 = this.gradP[X + 1 + this.perm[Y + 1]].dot2(x - 1, y - 1);
    const u = this.fade(x);
    return this.lerp(
      this.lerp(n00, n10, u),
      this.lerp(n01, n11, u),
      this.fade(y)
    );
  }
}

function renderWaves() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const container = document.getElementById('waves');
  const width = container.offsetWidth;
  const height = 300;

  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);

  const noise = new Noise();

  let mouse = { x: width / 2, y: height / 2 };

  // Track the mouse position
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let x = 0; x < width; x += 10) {
      const yBase = 150 + noise.perlin2(x * 0.01, performance.now() * 0.001) * 50;
      const dist = Math.abs(x - mouse.x);
      const waveEffect = Math.max(50 - dist / 2, 0);

      const y = yBase - waveEffect;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  renderWaves();
});


