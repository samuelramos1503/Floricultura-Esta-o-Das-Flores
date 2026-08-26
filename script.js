// ==========================================================================
// FLORICULTURA ESTAÇÃO DAS FLORES — SCRIPT INTERATIVO
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HERO SLIDER AUTOMÁTICO & TOUCH ---
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('sliderPrev');
  const nextBtn = document.getElementById('sliderNext');
  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    let next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(prev);
  }

  function startAutoplay() {
    slideInterval = setInterval(nextSlide, 5500);
  }

  function stopAutoplay() {
    if (slideInterval) clearInterval(slideInterval);
  }

  if (nextBtn && prevBtn) {
    nextBtn.addEventListener('click', () => {
      stopAutoplay();
      nextSlide();
      startAutoplay();
    });

    prevBtn.addEventListener('click', () => {
      stopAutoplay();
      prevSlide();
      startAutoplay();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      const idx = parseInt(dot.getAttribute('data-index'));
      showSlide(idx);
      startAutoplay();
    });
  });

  startAutoplay();

  // --- 2. FILTROS DO CATÁLOGO ---
  const filterTabs = document.querySelectorAll('.filter-tab');
  const prodCards = document.querySelectorAll('.prod-card');

  window.filterCatalog = function(cat) {
    filterTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-filter') === cat);
    });

    prodCards.forEach(card => {
      if (cat === 'all' || card.getAttribute('data-cat') === cat) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
  };

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.getAttribute('data-filter');
      window.filterCatalog(filter);
    });
  });

  // --- 3. MENU MOBILE HAMBURGUER ---
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isActive = nav.classList.toggle('active');
      burger.setAttribute('aria-expanded', isActive ? 'true' : 'false');
    });

    // Close on click link
    nav.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // --- 4. FAQ ACCORDION ---
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

});
