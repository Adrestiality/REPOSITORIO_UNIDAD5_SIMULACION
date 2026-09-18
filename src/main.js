/**
 * Main Presentation Engine Controller - Fórum UPB
 * Única Presentación Web: Controla la navegación 3D Three.js,
 * la interfaz cinematográfica, atajos de teclado y selección de idioma.
 */
import { CONFIG } from './config.js';
import { ThreeStage } from './core/ThreeStage.js';
import { SlideManager } from './core/SlideManager.js';

// DOM Elements
const canvas = document.querySelector('#visual-canvas');
const stageShell = document.querySelector('#app');
const stage = document.querySelector('#stage');
const copyLayer = document.querySelector('#copy-layer');
const kickerEl = document.querySelector('#moment-kicker');
const titleEl = document.querySelector('#moment-title');
const subtitleEl = document.querySelector('#moment-subtitle');
const glowOrb = document.querySelector('#glow-orb');

// UI Controls
const numberEl = document.querySelector('#moment-number');
const totalEl = document.querySelector('#moment-total');
const progressBar = document.querySelector('#progress-bar');
const prevBtn = document.querySelector('#prev-button');
const nextBtn = document.querySelector('#next-button');
const fullscreenBtn = document.querySelector('#fullscreen-button');
const helpBtn = document.querySelector('#help-button');
const helpPanel = document.querySelector('#help-panel');
const helpCloseBtn = document.querySelector('#help-close-btn');
const resetBtn = document.querySelector('#reset-button');
const endBtn = document.querySelector('#end-button');
const brandTitleEl = document.querySelector('#brand-title');
const langButtons = [...document.querySelectorAll('[data-language]')];

// Inicializar ThreeStage y SlideManager
const threeStage = new ThreeStage(canvas);
const slideManager = new SlideManager(threeStage);

// Iniciar bucle de animación 3D
threeStage.start();

// Configurar branding inicial
if (brandTitleEl) brandTitleEl.textContent = CONFIG.brandLine;
if (totalEl) totalEl.textContent = String(slideManager.getTotalSlides()).padStart(2, '0');

/**
 * Resalta las palabras clave exactas en el texto del título
 */
function appendHighlightedText(parent, text, highlights = [], lang = 'es') {
  if (!highlights.length) {
    parent.append(document.createTextNode(text));
    return;
  }

  const normalizedText = text.toLocaleLowerCase(lang);
  const ordered = [...highlights].sort((a, b) => b.text.length - a.text.length);
  let cursor = 0;

  while (cursor < text.length) {
    let next = null;
    for (const highlight of ordered) {
      const index = normalizedText.indexOf(highlight.text.toLocaleLowerCase(lang), cursor);
      if (index === -1) continue;
      if (!next || index < next.index || (index === next.index && highlight.text.length > next.text.length)) {
        next = { ...highlight, index };
      }
    }

    if (!next) {
      parent.append(document.createTextNode(text.slice(cursor)));
      break;
    }

    if (next.index > cursor) {
      parent.append(document.createTextNode(text.slice(cursor, next.index)));
    }

    const span = document.createElement('span');
    span.className = `title-highlight title-highlight--${next.tone || 'cyan'}`;
    span.textContent = text.slice(next.index, next.index + next.text.length);
    parent.append(span);
    cursor = next.index + next.text.length;
  }
}

/**
 * Renderiza la interfaz de usuario para la diapositiva actual
 */
function renderSlideUi(index, lang, slide, animate = true) {
  if (!slide) return;

  const copy = slide.copy[lang] || slide.copy.es;
  const highlights = slide.highlights?.[lang] || slide.highlights?.es || [];
  const theme = slide.theme || 'light';
  const layout = slide.layout || 'layout-left';

  // Aplicar tema dinámico (Light / Dark)
  if (stageShell) {
    stageShell.classList.toggle('theme-light', theme === 'light');
    stageShell.classList.toggle('theme-dark', theme === 'dark');
  }
  if (stage) {
    stage.classList.toggle('theme-light', theme === 'light');
    stage.classList.toggle('theme-dark', theme === 'dark');
  }

  // Actualizar contador y barra de progreso
  const numStr = String(index + 1).padStart(2, '0');
  if (numberEl) numberEl.textContent = numStr;
  if (totalEl) totalEl.textContent = String(slideManager.getTotalSlides()).padStart(2, '0');

  if (progressBar) {
    const progress = ((index + 1) / slideManager.getTotalSlides()) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Actualizar hash de la URL limpiamente sin recargar
  window.history.replaceState(null, '', `#${index + 1}`);

  // Resplandor ambiental de color
  if (glowOrb && slide.colors && slide.colors[0]) {
    const opacityHex = theme === 'dark' ? '22' : '15';
    glowOrb.style.background = `radial-gradient(circle, ${slide.colors[0]}${opacityHex} 0%, ${slide.colors[1] || slide.colors[0]}08 50%, transparent 80%)`;
  }

  const updateTexts = () => {
    if (copyLayer) {
      copyLayer.className = `copy-layer ${layout}`;
    }

    if (kickerEl) {
      kickerEl.textContent = copy.kicker || CONFIG.brandLine;
    }

    if (titleEl) {
      if (copy.titleHtml) {
        titleEl.innerHTML = copy.titleHtml;
      } else {
        titleEl.replaceChildren();
        appendHighlightedText(titleEl, copy.title || '', highlights, lang);
      }
    }

    if (subtitleEl) {
      subtitleEl.textContent = copy.subtitle || '';
      subtitleEl.style.display = copy.subtitle ? 'block' : 'none';
    }
  };

  if (!animate || !copyLayer) {
    updateTexts();
    return;
  }

  copyLayer.classList.add('transitioning-out');
  setTimeout(() => {
    updateTexts();
    copyLayer.classList.remove('transitioning-out');
    copyLayer.classList.add('transitioning-in');
    void copyLayer.offsetWidth;
    copyLayer.classList.remove('transitioning-in');
  }, 140);
}

// Suscripción al SlideManager para actualizar UI al cambiar de slide o idioma
slideManager.subscribe((index, lang, slideData) => {
  renderSlideUi(index, lang, slideData, true);

  // Actualizar selector de idioma en la UI
  document.documentElement.lang = lang;
  langButtons.forEach((btn) => {
    const isActive = btn.dataset.language === lang;
    btn.classList.toggle('is-active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
});

// Eventos de botones de navegación
if (nextBtn) nextBtn.addEventListener('click', () => slideManager.next());
if (prevBtn) prevBtn.addEventListener('click', () => slideManager.prev());

// Selector de Idioma (ES / PT)
langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const lang = btn.dataset.language;
    slideManager.setLanguage(lang);
  });
});

// Pantalla Completa
async function toggleFullscreen() {
  const iconEnter = document.querySelector('.icon-fullscreen-enter');
  const iconExit = document.querySelector('.icon-fullscreen-exit');

  if (!document.fullscreenElement) {
    await document.documentElement.requestFullscreen().catch(() => {});
    if (iconEnter && iconExit) {
      iconEnter.classList.add('hidden');
      iconExit.classList.remove('hidden');
    }
  } else {
    await document.exitFullscreen().catch(() => {});
    if (iconEnter && iconExit) {
      iconEnter.classList.remove('hidden');
      iconExit.classList.add('hidden');
    }
  }
}

if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullscreen);

// Modal de Ayuda & Atajos
let isHelpOpen = false;
function toggleHelp(show) {
  isHelpOpen = typeof show === 'boolean' ? show : !isHelpOpen;
  if (helpPanel) {
    helpPanel.classList.toggle('active', isHelpOpen);
    helpPanel.setAttribute('aria-hidden', String(!isHelpOpen));
  }
}

if (helpBtn) helpBtn.addEventListener('click', () => toggleHelp(true));
if (helpCloseBtn) helpCloseBtn.addEventListener('click', () => toggleHelp(false));
if (resetBtn) resetBtn.addEventListener('click', () => {
  toggleHelp(false);
  slideManager.first();
});
if (endBtn) endBtn.addEventListener('click', () => {
  toggleHelp(false);
  slideManager.last();
});

if (helpPanel) {
  helpPanel.addEventListener('click', (e) => {
    if (e.target === helpPanel) toggleHelp(false);
  });
}

// Clic en la pantalla para avanzar diapositiva
stage.addEventListener('click', (e) => {
  if (
    e.target.closest('.operator-ui') ||
    e.target.closest('.help-panel') ||
    e.target.closest('button') ||
    e.target.closest('a')
  ) {
    return;
  }
  slideManager.next();
});

// Controles de Teclado
window.addEventListener('keydown', (e) => {
  if (isHelpOpen) {
    if (e.key === 'Escape' || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      toggleHelp(false);
    }
    return;
  }

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'PageDown':
      e.preventDefault();
      slideManager.next();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'Backspace':
    case 'PageUp':
      e.preventDefault();
      slideManager.prev();
      break;
    case 'f':
    case 'F':
      e.preventDefault();
      toggleFullscreen();
      break;
    case 'h':
    case 'H':
    case '?':
      e.preventDefault();
      toggleHelp(true);
      break;
    case 'r':
    case 'R':
      e.preventDefault();
      slideManager.first();
      break;
    case 'Home':
      e.preventDefault();
      slideManager.first();
      break;
    case 'End':
      e.preventDefault();
      slideManager.last();
      break;
    default:
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10) - 1;
        if (num < slideManager.getTotalSlides()) {
          slideManager.goTo(num);
        }
      }
      break;
  }
});

// Soporte Touch Swipe en dispositivos táctiles
let touchStartX = 0;
stage.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

stage.addEventListener('touchend', (e) => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 42) {
    if (delta < 0) slideManager.next();
    else slideManager.prev();
  }
}, { passive: true });

// Inicialización de la presentación al cargar
function init() {
  const hash = window.location.hash.replace('#', '');
  const initialIndex = parseInt(hash, 10) - 1;
  const targetIndex = !isNaN(initialIndex) && initialIndex >= 0 && initialIndex < slideManager.getTotalSlides()
    ? initialIndex
    : 0;

  slideManager.goTo(targetIndex);
  renderSlideUi(targetIndex, slideManager.getLanguage(), slideManager.getCurrentSlideData(), false);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
