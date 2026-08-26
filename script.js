// ==========================================================================
// FLORICULTURA ESTAÇÃO DAS FLORES — SCRIPT INTERATIVO (ESKINA FLORES STYLE)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. HERO SLIDER AUTOMÁTICO & CONTROLES ---
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

  // --- 2. ROLAGEM DOS CARROSSEIS COM SETAS ---
  window.scrollCarousel = function(catId, direction) {
    const track = document.getElementById(`track-${catId}`);
    if (track) {
      const scrollAmount = 260 * direction;
      track.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

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


  // --- 5. SLIDESHOW AUTOMÁTICO DA LOJA FÍSICA COM MINIATURAS SINCRONIZADAS ---
  const storeSlides = document.querySelectorAll('.store-slide');
  const storeThumbs = document.querySelectorAll('.store-thumb-btn');
  if (storeSlides.length > 0) {
    let currentStoreSlide = 0;
    let storeTimer = null;

    function goToStoreSlide(index) {
      storeSlides.forEach((s, i) => s.classList.toggle('active', i === index));
      storeThumbs.forEach((t, i) => t.classList.toggle('active', i === index));
      currentStoreSlide = index;
    }

    function nextStoreSlide() {
      let next = (currentStoreSlide + 1) % storeSlides.length;
      goToStoreSlide(next);
    }

    function startStoreAuto() {
      storeTimer = setInterval(nextStoreSlide, 3500);
    }

    function stopStoreAuto() {
      if (storeTimer) clearInterval(storeTimer);
    }

    storeThumbs.forEach(btn => {
      btn.addEventListener('click', () => {
        stopStoreAuto();
        const idx = parseInt(btn.getAttribute('data-index'));
        goToStoreSlide(idx);
        startStoreAuto();
      });
    });

    startStoreAuto();
  }


  // --- 6. CARROSSEL DE AVALIAÇÕES COM SETAS ---
  const revTrack = document.getElementById('reviewsTrack');
  const revPrev = document.getElementById('revPrev');
  const revNext = document.getElementById('revNext');

  if (revTrack && revPrev && revNext) {
    revNext.addEventListener('click', () => {
      revTrack.scrollBy({ left: 340, behavior: 'smooth' });
    });
    revPrev.addEventListener('click', () => {
      revTrack.scrollBy({ left: -340, behavior: 'smooth' });
    });
  }


  // --- 6. MONTE SEU PRESENTE PERSONALIZADO (INTERACTIVE BUILDER) ---
  let selectedOcasiao = 'Aniversário';
  let selectedEstilo = 'Buquê de Rosas Nobres';
  let selectedMimos = [];

  const summaryText = document.getElementById('summaryText');
  const sendBtn = document.getElementById('builderSendBtn');

  function updateBuilderWhatsApp() {
    let summaryParts = [selectedOcasiao, selectedEstilo];
    if (selectedMimos.length > 0) {
      summaryParts.push('+ ' + selectedMimos.join(', '));
    }
    
    if (summaryText) {
      summaryText.textContent = summaryParts.join(' • ');
    }

    let mimosText = selectedMimos.length > 0 ? selectedMimos.join(', ') : 'Nenhum adicional';

    let msg = `Olá! Gostaria de fazer um pedido personalizado na Estação das Flores:\n\n` +
              `🎂 Ocasião: ${selectedOcasiao}\n` +
              `🌸 Estilo Principal: ${selectedEstilo}\n` +
              `🎁 Acompanhamentos: ${mimosText}\n\n` +
              `Gostaria de ver as opções e valores para entrega!`;

    if (sendBtn) {
      sendBtn.href = `https://api.whatsapp.com/send/?phone=5531988600761&text=${encodeURIComponent(msg)}`;
    }
  }

  // Handle Step 1 (Ocasião)
  document.querySelectorAll('[data-group="ocasiao"] .builder-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-group="ocasiao"] .builder-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedOcasiao = btn.getAttribute('data-value');
      updateBuilderWhatsApp();
    });
  });

  // Handle Step 2 (Estilo)
  document.querySelectorAll('[data-group="estilo"] .builder-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('[data-group="estilo"] .builder-option-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedEstilo = btn.getAttribute('data-value');
      updateBuilderWhatsApp();
    });
  });

  // Handle Step 3 (Mimos Multi-selection)
  document.querySelectorAll('[data-group="mimos"] .builder-option-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const val = btn.getAttribute('data-value');
      if (btn.classList.contains('active')) {
        if (!selectedMimos.includes(val)) selectedMimos.push(val);
      } else {
        selectedMimos = selectedMimos.filter(m => m !== val);
      }
      updateBuilderWhatsApp();
    });
  });

  updateBuilderWhatsApp();

});