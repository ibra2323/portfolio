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
  const height = container.offsetHeight;

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

    const waveLines = 70; // Increased number of wave lines for smoother appearance
    const lineSpacing = 8; // Smaller spacing between lines

    for (let i = 0; i < waveLines; i++) {
      const yOffset = i * lineSpacing;

      ctx.beginPath();
      for (let x = 0; x < width; x += 3) { // Smaller step for smoother curves
        const baseY = height / 2 + yOffset - waveLines * lineSpacing / 2;
        const noiseValue = noise.perlin2(x * 0.005, i * 0.05 + performance.now() * 0.0005) * 30;
        const waveEffect = Math.max(100 - Math.abs(mouse.x - x) / 3, 0);
        const y = baseY + noiseValue - waveEffect;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }

      ctx.lineWidth = 1; // Thin line for smooth appearance
      ctx.strokeStyle = "rgba(93, 82, 250, 0.9)"; // Tokyo Night purple with slight transparency
      ctx.stroke();
    }

    requestAnimationFrame(draw);
  }

  draw();
}



document.addEventListener('DOMContentLoaded', () => {
  renderWaves();
});


