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
  constructor() {
    this.grad3 = [
      [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
      [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
      [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
    ];
    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = Math.floor(Math.random() * 256);
    }
    this.perm = [];
    for(let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  }

  dot(g, x, y) {
    return g[0]*x + g[1]*y;
  }

  mix(a, b, t) {
    return (1.0 - t) * a + t * b;
  }

  fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  perlin(x, y) {
    let X = Math.floor(x) & 255;
    let Y = Math.floor(y) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);

    let u = this.fade(x);
    let v = this.fade(y);

    let n00 = this.dot(this.grad3[this.perm[X+this.perm[Y]] % 12], x, y);
    let n01 = this.dot(this.grad3[this.perm[X+this.perm[Y+1]] % 12], x, y-1);
    let n10 = this.dot(this.grad3[this.perm[X+1+this.perm[Y]] % 12], x-1, y);
    let n11 = this.dot(this.grad3[this.perm[X+1+this.perm[Y+1]] % 12], x-1, y-1);

    let nx0 = this.mix(n00, n10, u);
    let nx1 = this.mix(n01, n11, u);

    return this.mix(nx0, nx1, v);
  }
}

function renderWaves() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const noise = new Noise();
  const container = document.getElementById('waves');
  const width = container.offsetWidth;
  const height = container.offsetHeight;

  canvas.width = width;
  canvas.height = height;
  container.appendChild(canvas);

  let mouseX = width / 2;
  let mouseY = height / 2;

  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  function draw() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    const time = Date.now() * 0.001;
    for (let x = 0; x < width; x++) {
      const y = height / 2 + noise.perlin(x * 0.01 + mouseX * 0.005, time) * 50;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#9a79cf'; // Tokyo Night purple
    ctx.stroke();
    requestAnimationFrame(draw);
  }

  draw();
}

document.addEventListener('DOMContentLoaded', () => {
  renderWaves();
});



