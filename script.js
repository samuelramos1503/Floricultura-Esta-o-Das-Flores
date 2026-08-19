/**
 * Floricultura Estação das Flores — Ipatinga MG (Bairro Canaã)
 * Lógica de Navegação Mobile, Animações ao Rolar (Scroll Reveal),
 * Montador de Presentes com WhatsApp & Status de Loja ao Vivo
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL REVEAL ANIMATIONS (Efeito de surgimento ao rolar)
  initScrollReveal();

  // 2. MENU MOBILE TOGGLE
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen);
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. MONTADOR INTERATIVO DE PRESENTES
  setupOptionCards('step-ocasiao');
  setupOptionCards('step-flores');

  // Seleção múltipla para Acompanhamentos
  document.querySelectorAll('#step-adicionais .option-card').forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('selected');
    });
  });

  // 4. INTEGRAÇÃO DOS DESTAQUES DO INSTAGRAM COM O MONTADOR
  document.querySelectorAll('.highlight-item[data-select-style]').forEach(item => {
    item.addEventListener('click', () => {
      const targetStyle = item.getAttribute('data-select-style');
      selectOptionByValue('step-flores', targetStyle);
    });
  });

  document.querySelectorAll('.highlight-item[data-select-occasion]').forEach(item => {
    item.addEventListener('click', () => {
      const targetOccasion = item.getAttribute('data-select-occasion');
      selectOptionByValue('step-ocasiao', targetOccasion);
    });
  });

  // 5. ENVIO DO FORMULÁRIO DO MONTADOR PARA O WHATSAPP
  const giftBuilderForm = document.getElementById('giftBuilderForm');
  if (giftBuilderForm) {
    giftBuilderForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const ocasiaoCard = document.querySelector('#step-ocasiao .option-card.selected');
      const floresCard = document.querySelector('#step-flores .option-card.selected');
      const adicionaisCards = document.querySelectorAll('#step-adicionais .option-card.selected');
      
      const nome = document.getElementById('builder-nome')?.value.trim() || '';
      const observacao = document.getElementById('builder-obs')?.value.trim() || '';
      const entrega = document.getElementById('builder-entrega')?.value || 'Entrega Agendada no Vale do Aço';

      const ocasiao = ocasiaoCard ? ocasiaoCard.getAttribute('data-value') : 'Presente Especial';
      const flores = floresCard ? floresCard.getAttribute('data-value') : 'Buquê Nobre Estação';
      
      const adicionais = Array.from(adicionaisCards).map(c => c.getAttribute('data-value'));

      const phone = '5531988600761'; // WhatsApp Oficial Estação das Flores (31) 98860-0761

      let msg = `*NOVO PEDIDO PERSONALIZADO — ESTAÇÃO DAS FLORES* 🌷\n\n`;
      if (nome) msg += `*Cliente:* ${nome}\n`;
      msg += `*Ocasião:* ${ocasiao}\n`;
      msg += `*Estilo / Arranjo:* ${flores}\n`;
      if (adicionais.length > 0) {
        msg += `*Acompanhamentos:* ${adicionais.join(', ')}\n`;
      }
      msg += `*Modalidade:* ${entrega}\n`;
      if (observacao) msg += `*Mensagem do Cartão / Obs:* ${observacao}\n`;
      msg += `\nOlá! Montei esse presente no site da Estação das Flores e gostaria de verificar a disponibilidade e agendamento!`;

      const whatsappUrl = `https://api.whatsapp.com/send/?phone=${phone}&text=${encodeURIComponent(msg)}&type=phone_number&app_absent=0`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // 6. STATUS DA LOJA EM TEMPO REAL
  updateLiveStatus();
});

/**
 * Configura seleção única em grupos de cards
 */
function setupOptionCards(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const cards = container.querySelectorAll('.option-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      cards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
    });
  });
}

/**
 * Seleciona card por valor a partir do clique dos destaques
 */
function selectOptionByValue(containerId, value) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const targetCard = container.querySelector(`.option-card[data-value="${value}"]`);
  if (targetCard) {
    const cards = container.querySelectorAll('.option-card');
    cards.forEach(c => c.classList.remove('selected'));
    targetCard.classList.add('selected');
  }
}

/**
 * Animação suave ao rolar a página utilizando IntersectionObserver
 */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  if (!('IntersectionObserver' in window)) {
    // Fallback para navegadores legados
    revealElements.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/**
 * Atualiza status aberto/fechado com base no horário oficial
 */
function updateLiveStatus() {
  const statusIndicator = document.getElementById('statusIndicator');
  const statusTitle = document.getElementById('statusTitle');

  if (!statusIndicator || !statusTitle) return;

  const now = new Date();
  const day = now.getDay(); // 0 = Dom, 1 = Seg ... 6 = Sáb
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const time = hours * 60 + minutes;

  // Horários oficiais Estação das Flores:
  // Seg-Sex: 08:00 - 18:00 | Sáb: 08:00 - 12:00 | Dom: Fechada
  let isOpen = false;

  if (day >= 1 && day <= 5) {
    if (time >= 8 * 60 && time < 18 * 60) isOpen = true;
  } else if (day === 6) {
    if (time >= 8 * 60 && time < 12 * 60) isOpen = true;
  }

  // Destaca a linha do dia da semana atual na tabela de horários
  document.querySelectorAll('.schedule-row').forEach(row => {
    const rowDay = parseInt(row.getAttribute('data-day'), 10);
    if (rowDay === day) {
      row.classList.add('today');
      const dayNameEl = row.querySelector('.day-name');
      if (dayNameEl && !dayNameEl.innerHTML.includes('(Hoje)')) {
        dayNameEl.innerHTML += ' <span style="font-size: 0.72rem; color: var(--color-accent); text-transform: uppercase;">(Hoje)</span>';
      }
    } else {
      row.classList.remove('today');
    }
  });

  if (isOpen) {
    statusIndicator.style.backgroundColor = '#10b981';
    statusIndicator.style.boxShadow = '0 0 0 0 rgba(16, 185, 129, 0.7)';
    statusTitle.textContent = 'Loja Aberta Agora no Bairro Canaã • Atendimento no WhatsApp';
    statusTitle.style.color = '#10b981';
  } else {
    statusIndicator.style.backgroundColor = '#ef4444';
    statusIndicator.style.boxShadow = 'none';
    statusTitle.textContent = 'Loja Fechada no Momento • Faça seu pedido antecipado pelo WhatsApp';
    statusTitle.style.color = '#fca5a5';
  }
}

