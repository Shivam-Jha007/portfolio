// ===== STARFIELD BACKGROUND =====
const starCanvas = document.getElementById('starfield');

if (starCanvas) {
  const ctx = starCanvas.getContext('2d');
  const pointer = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    active: false,
  };

  let stars = [];
  let trailStars = [];
  let width = 0;
  let height = 0;
  let dpr = 1;

  function createStars() {
    const count = Math.max(90, Math.floor((width * height) / 12000));
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.35 + 0.2,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: Math.random() * 1.6 + 0.6,
      twinkleOffset: Math.random() * Math.PI * 2,
    }));
  }

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    starCanvas.width = Math.floor(width * dpr);
    starCanvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createStars();
  }

  function addTrailStar(x, y) {
    trailStars.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      r: Math.random() * 1.8 + 0.8,
      life: 1,
    });

    if (trailStars.length > 75) {
      trailStars.shift();
    }
  }

  function draw(timeMs) {
    const time = timeMs / 1000;
    ctx.clearRect(0, 0, width, height);

    // Static stars distributed across the whole page
    for (const star of stars) {
      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(time * star.twinkleSpeed + star.twinkleOffset));
      ctx.globalAlpha = star.alpha * twinkle;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Cursor-following stars
    for (let i = trailStars.length - 1; i >= 0; i -= 1) {
      const particle = trailStars[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life -= 0.02;

      if (particle.life <= 0) {
        trailStars.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = particle.life * 0.75;
      ctx.fillStyle = '#b8abff';
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      ctx.fill();
    }

    if (pointer.active) {
      ctx.globalAlpha = 0.18;
      const glow = ctx.createRadialGradient(pointer.x, pointer.y, 0, pointer.x, pointer.y, 55);
      glow.addColorStop(0, 'rgba(124, 106, 239, 0.35)');
      glow.addColorStop(1, 'rgba(124, 106, 239, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(pointer.x, pointer.y, 55, 0, Math.PI * 2);
      ctx.fill();
      addTrailStar(pointer.x, pointer.y);
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('mousemove', (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  }, { passive: true });

  window.addEventListener('touchmove', (event) => {
    if (event.touches.length > 0) {
      pointer.x = event.touches[0].clientX;
      pointer.y = event.touches[0].clientY;
      pointer.active = true;
    }
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    pointer.active = false;
  });

  window.addEventListener('touchend', () => {
    pointer.active = false;
  });

  window.addEventListener('resize', resizeCanvas);

  resizeCanvas();
  requestAnimationFrame(draw);
}

// ===== NAVBAR SCROLL =====
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}, { passive: true });

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < top + height);
    }
  });
}

window.addEventListener('scroll', highlightNav, { passive: true });

// ===== SCROLL REVEAL =====
const animatedElements = document.querySelectorAll('[data-animate]');

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

animatedElements.forEach(el => observer.observe(el));

// ===== PROJECT CARD 3D HOVER =====
const projectCards = document.querySelectorAll('.project-card');
const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (projectCards.length && canTilt) {
  projectCards.forEach((card) => {
    card.addEventListener('mousemove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateY = ((x - centerX) / centerX) * 7;
      const rotateX = -((y - centerY) / centerY) * 7;

      card.style.setProperty('--rx', `${rotateX.toFixed(2)}deg`);
      card.style.setProperty('--ry', `${rotateY.toFixed(2)}deg`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    });
  });
}

// ===== ABOUT COUNTERS =====
const counterElements = document.querySelectorAll('[data-counter]');

function animateCounter(el) {
  const start = Number(el.getAttribute('data-start'));
  const end = Number(el.getAttribute('data-end'));
  const duration = 1400;
  const startTime = performance.now();

  function update(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const current = Math.floor(start + (end - start) * progress);
    el.textContent = String(current);
    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

if (counterElements.length) {
  const aboutSection = document.getElementById('about');
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          counterElements.forEach(animateCounter);
          counterObserver.disconnect();
        }
      });
    },
    { threshold: 0.35 }
  );

  if (aboutSection) {
    counterObserver.observe(aboutSection);
  }
}

// ===== PROJECT SCREENSHOT LIGHTBOX (DOUBLE CLICK) =====
const galleryImages = document.querySelectorAll('.project-gallery img');

if (galleryImages.length) {
  const lightbox = document.createElement('div');
  lightbox.className = 'image-lightbox';
  lightbox.setAttribute('aria-hidden', 'true');

  const lightboxImage = document.createElement('img');
  lightboxImage.alt = 'Expanded project screenshot';
  lightbox.appendChild(lightboxImage);
  document.body.appendChild(lightbox);

  function openLightbox(src, altText) {
    lightboxImage.src = src;
    lightboxImage.alt = altText || 'Expanded project screenshot';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryImages.forEach((image) => {
    image.addEventListener('dblclick', () => {
      openLightbox(image.src, image.alt);
    });
  });

  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox.classList.contains('open')) {
      closeLightbox();
    }
  });
}

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const recipientEmail = 'just4work442@gmail.com';
  const name = (document.getElementById('name')?.value || '').trim();
  const email = (document.getElementById('email')?.value || '').trim();
  const message = (document.getElementById('message')?.value || '').trim();

  const subject = `Portfolio Contact from ${name || 'Visitor'}`;
  const body = [
    `Name: ${name || 'Not provided'}`,
    `Email: ${email || 'Not provided'}`,
    '',
    'Message:',
    message || 'No message provided.',
  ].join('\n');

  const gmailComposeUrl =
    'https://mail.google.com/mail/?view=cm&fs=1' +
    `&to=${encodeURIComponent(recipientEmail)}` +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  const fallbackMailto =
    `mailto:${recipientEmail}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  try {
    window.location.assign(gmailComposeUrl);
  } catch (error) {
    window.location.assign(fallbackMailto);
  }
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
