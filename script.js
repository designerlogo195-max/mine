/* ==========================================================================
   2026 LUXURY DARK THEME - VANILLA JS INTERACTIVE ENGINE
   Ghulam Ishaq Portfolio — 3D Tilt, Particle Canvas, Animations & Modal
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initCustomCursor();
  initScrollProgress();
  initHeaderScroll();
  initMobileMenu();
  initScrollReveal();
  init3DTiltEffects();
  initTypingEffect();
  initCounters();
  initProjectFilter();
  initLightbox();
  initBackToTop();
  initSecurity();
});

/* ==========================================================================
   1. PARTICLE CONSTELLATION CANVAS
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;
  
  const particles = [];
  const particleCount = Math.min(Math.floor(width / 18), 70);
  
  const mouse = {
    x: null,
    y: null,
    radius: 140
  };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? '#00ffc8' : '#8a2be2';
      this.alpha = Math.random() * 0.6 + 0.2;
    }

    update() {
      if (this.x < 0 || this.x > width) this.vx = -this.vx;
      if (this.y < 0 || this.y > height) this.vy = -this.vy;

      this.x += this.vx;
      this.y += this.vy;

      // Mouse interactive repulse
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          this.x -= (dx / distance) * force * 3;
          this.y -= (dy / distance) * force * 3;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.strokeStyle = '#00ffc8';
          ctx.globalAlpha = (1 - dist / 110) * 0.2;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   2. CUSTOM GLOWING CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.getElementById('cursor-dot');
  const outline = document.getElementById('cursor-outline');
  if (!dot || !outline) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let outlineX = mouseX;
  let outlineY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderCursor() {
    outlineX += (mouseX - outlineX) * 0.18;
    outlineY += (mouseY - outlineY) * 0.18;
    outline.style.left = `${outlineX}px`;
    outline.style.top = `${outlineY}px`;
    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Hover states
  const interactives = document.querySelectorAll('a, button, input, textarea, .service-box, .project-card, .skill-card, .testimonial-card');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

/* ==========================================================================
   3. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = (document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight;
    const scrollPercent = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = `${scrollPercent}%`;
  }, { passive: true });
}

/* ==========================================================================
   4. HEADER SCROLL EFFECT
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('header');
  if (!header) return;

  const navLinks = document.querySelectorAll('nav a');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   5. MOBILE HAMBURGER MENU
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-toggle');
  const nav = document.querySelector('nav');
  if (!menuBtn || !nav) return;

  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('open');
    nav.classList.toggle('open');
  });

  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('open');
      nav.classList.remove('open');
    });
  });
}

/* ==========================================================================
   6. SCROLL REVEAL (AOS STYLE) & SKILL BAR FILL
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Animate skill bar width if inside skill card
        const bar = entry.target.querySelector('.skill-bar-fill');
        if (bar) {
          bar.style.width = bar.getAttribute('data-percent') || '90%';
        }
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));
}

/* ==========================================================================
   7. 3D PERSPECTIVE MOUSE TILT EFFECT
   ========================================================================== */
function init3DTiltEffects() {
  if (window.innerWidth < 840) return; // Ignore on small screens

  const cards = document.querySelectorAll('.service-box, .project-card, .hero-photo-card, .skill-card, .testimonial-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -9; // Max tilt 9 deg
      const rotateY = ((x - centerX) / centerX) * 9;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
  });
}

/* ==========================================================================
   8. TYPING TEXT EFFECT
   ========================================================================== */
function initTypingEffect() {
  const typingElem = document.getElementById('typing-text');
  if (!typingElem) return;

  const words = [
    "Luxury Fashion & Boutique Logos",
    "3D Mockup & Minimalist Branding",
    "Custom Vector & Print Design",
    "AI Brand Artistry & Social Media Graphics",
    "Fiverr Verified Logo Designer"
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typingElem.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElem.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let typeSpeed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2200; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 400;
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   9. ANIMATED NUMBER COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('.counter-num');
  let started = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        counters.forEach(counter => {
          const target = +counter.getAttribute('data-target');
          const suffix = counter.getAttribute('data-suffix') || '';
          let count = 0;
          const speed = Math.ceil(target / 45);

          const updateCount = () => {
            count += speed;
            if (count < target) {
              counter.textContent = count + suffix;
              requestAnimationFrame(updateCount);
            } else {
              counter.textContent = target + suffix;
            }
          };
          updateCount();
        });
      }
    });
  }, { threshold: 0.5 });

  const metricsGrid = document.querySelector('.metrics-grid');
  if (metricsGrid) observer.observe(metricsGrid);
}

/* ==========================================================================
   10. PROJECTS GALLERY FILTERING
   ========================================================================== */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const categoryHeaders = document.querySelectorAll('.portfolio-category-header');
  const projectGrids = document.querySelectorAll('.projects-grid');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      // Manage Section Headers and Grids visibility
      categoryHeaders.forEach(header => {
        const headerCat = header.getAttribute('data-header-category');
        if (filterValue === 'all' || headerCat === filterValue) {
          header.style.display = 'block';
          setTimeout(() => header.style.opacity = '1', 50);
        } else {
          header.style.opacity = '0';
          setTimeout(() => header.style.display = 'none', 300);
        }
      });

      projectGrids.forEach(grid => {
        const gridCat = grid.getAttribute('data-grid-category');
        if (filterValue === 'all') {
          grid.style.display = 'grid';
        } else if (gridCat && gridCat === filterValue) {
          grid.style.display = 'grid';
        } else if (!gridCat && ['branding', 'print', 'ai', 'apparel'].includes(filterValue)) {
          grid.style.display = 'grid';
        } else {
          grid.style.display = 'none';
        }
      });

      // Filter individual cards
      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.8)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });
}

/* ==========================================================================
   11. LIGHTBOX IMAGE PREVIEW MODAL
   ========================================================================== */
function initLightbox() {
  const modal = document.getElementById('lightbox-modal');
  const modalImg = document.getElementById('lightbox-img');
  const modalCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  if (!modal || !modalImg || !closeBtn) return;

  const triggers = document.querySelectorAll('.service-zoom-btn, .project-card');

  triggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = trigger.closest('.service-box') || trigger;
      const img = card.querySelector('img');
      const title = card.querySelector('h3');

      if (img && modalImg) {
        modalImg.src = img.src;
        if (modalCaption && title) {
          modalCaption.textContent = title.textContent;
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   12. BACK TO TOP BUTTON & LOADER REMOVAL
   ========================================================================== */
function initBackToTop() {
  const topBtn = document.getElementById('back-to-top');
  const loader = document.getElementById('loader');

  // Fade out loader after 1.1s
  setTimeout(() => {
    if (loader) {
      loader.classList.add('loaded');
    }
    // Fire SweetAlert2 welcome popup exactly as in original code
    if (typeof Swal !== 'undefined') {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Welcome to my site!",
        showConfirmButton: false,
        timer: 1500
      });
    }
  }, 1100);

  if (!topBtn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      topBtn.classList.add('visible');
    } else {
      topBtn.classList.remove('visible');
    }
  });

  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   13. SECURITY PRESERVATION (ORIGINAL DEVTOOLS & RIGHT CLICK PROTECTION)
   ========================================================================== */
function initSecurity() {
  // Prevent context menu exactly as original
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
  });

  // Prevent devtools shortcuts exactly as original
  document.addEventListener('keydown', function(e) {
    if (e.keyCode === 123) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) { e.preventDefault(); return false; }
    if (e.ctrlKey && e.keyCode === 85) { e.preventDefault(); return false; }
  });
}
