// Loader
  window.addEventListener('load', () => { setTimeout(()=>document.getElementById('loader').classList.add('hide'), 500); });

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Sticky header shadow
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('shadow-2xl', window.scrollY > 40);
    document.getElementById('scroll-top').classList.toggle('hidden', window.scrollY < 500);
  });

  // Mobile menu
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  menuBtn.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.add('hidden')));

  // Theme toggle
  const themeBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  function setTheme(mode){
    root.classList.toggle('light', mode === 'light');
    themeBtn.textContent = mode === 'light' ? '☀️' : '🌙';
    localStorage.setItem('amg-theme', mode);
  }
  setTheme(localStorage.getItem('amg-theme') || 'dark');
  themeBtn.addEventListener('click', () => setTheme(root.classList.contains('light') ? 'dark' : 'light'));

  // Scroll reveal
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Counters
  const counters = document.querySelectorAll('.counter');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const el = entry.target; const target = +el.dataset.target; let cur = 0;
        const step = Math.max(1, Math.ceil(target / 60));
        const tick = () => { cur += step; if (cur >= target){ el.textContent = target + '+'; } else { el.textContent = cur; requestAnimationFrame(tick); } };
        tick(); counterIO.unobserve(el);
      }
    });
  }, { threshold: .5 });
  counters.forEach(c => counterIO.observe(c));

  // Scroll to top
  document.getElementById('scroll-top').addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

  // Gallery filter
  const filterBtns = document.querySelectorAll('.gallery-filter');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('gold-btn'); b.classList.add('outline-btn'); });
      btn.classList.remove('outline-btn'); btn.classList.add('gold-btn');
      const f = btn.dataset.filter;
      galleryItems.forEach(item => {
        item.style.display = (f === 'all' || item.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  // Testimonial slider
  const slides = document.querySelectorAll('.testi-slide');
  let testiIndex = 0;
  function showSlide(i){ slides.forEach((s, idx) => s.classList.toggle('hidden', idx !== i)); }
  document.getElementById('testi-next').addEventListener('click', () => { testiIndex = (testiIndex + 1) % slides.length; showSlide(testiIndex); });
  document.getElementById('testi-prev').addEventListener('click', () => { testiIndex = (testiIndex - 1 + slides.length) % slides.length; showSlide(testiIndex); });
  setInterval(() => { testiIndex = (testiIndex + 1) % slides.length; showSlide(testiIndex); }, 6000);

  // FAQ accordion
  document.querySelectorAll('.faq-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const panel = btn.nextElementSibling;
      const isOpen = panel.style.maxHeight;
      document.querySelectorAll('.faq-panel').forEach(p => p.style.maxHeight = null);
      if (!isOpen) panel.style.maxHeight = panel.scrollHeight + 'px';
    });
  });

  // BMI calculator
  document.getElementById('bmi-calc').addEventListener('click', () => {
    const h = parseFloat(document.getElementById('bmi-height').value) / 100;
    const w = parseFloat(document.getElementById('bmi-weight').value);
    if (!h || !w || h <= 0 || w <= 0) { document.getElementById('bmi-category').textContent = 'Enter valid values'; return; }
    const bmi = w / (h * h);
    let cat = 'Normal', pct = Math.min(bmi / 40, 1);
    if (bmi < 18.5) cat = 'Underweight';
    else if (bmi < 25) cat = 'Normal';
    else if (bmi < 30) cat = 'Overweight';
    else cat = 'Obese';
    document.getElementById('bmi-value').textContent = bmi.toFixed(1);
    document.getElementById('bmi-category').textContent = cat;
    const ring = document.getElementById('bmi-ring');
    const circumference = 326.7;
    ring.style.strokeDashoffset = circumference - (pct * circumference);
  });

  // API base — same origin by default; override by setting window.AMG_API_BASE before this script loads
  const API_BASE = window.AMG_API_BASE || '';

  // Newsletter -> POST /api/newsletter
  const newsletterForm = document.getElementById('newsletter-form');
  newsletterForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('input[type=email]').value;
    const msgEl = document.getElementById('newsletter-msg');
    const btn = newsletterForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Submitting...'; btn.disabled = true;
    try {
      const res = await fetch(`${API_BASE}/api/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      msgEl.textContent = res.ok ? 'Thanks for subscribing! 🎉' : (data.message || 'Something went wrong.');
      msgEl.classList.remove('hidden');
      if (res.ok) newsletterForm.reset();
    } catch (err) {
      msgEl.textContent = 'Could not reach server — please try again later.';
      msgEl.classList.remove('hidden');
    } finally {
      btn.textContent = originalText; btn.disabled = false;
    }
  });

  // Contact form -> POST /api/contact
  const contactForm = document.getElementById('contact-form');
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const inputs = contactForm.querySelectorAll('input, select, textarea');
    const payload = {
      name: inputs[0].value,
      phone: inputs[1].value,
      email: inputs[2].value,
      plan: inputs[3].value,
      message: inputs[4].value
    };
    const msgEl = document.getElementById('contact-msg');
    const btn = contactForm.querySelector('button');
    const originalText = btn.textContent;
    btn.textContent = 'Sending...'; btn.disabled = true;
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      msgEl.textContent = res.ok ? "Message sent! We'll contact you shortly. \u2705" : (data.message || 'Something went wrong.');
      msgEl.classList.remove('hidden');
      if (res.ok) contactForm.reset();
    } catch (err) {
      msgEl.textContent = 'Could not reach server — please try again later.';
      msgEl.classList.remove('hidden');
    } finally {
      btn.textContent = originalText; btn.disabled = false;
    }
  });
