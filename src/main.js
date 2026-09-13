/**
 * Main Presentation Engine Controller - Fórum UPB
 * Maneja modos (LIVE_HOST, LIVE_CLIENT, GENERIC_VIEWER),
 * sincronización en tiempo real, 3D WebGL ThreeStage y las 13 simulaciones modulares.
 */
import { CONFIG } from './config.js';
import { SLIDES } from './slides.js';
import { StateManager, APP_MODES } from './core/stateManager.js';
import { SyncBridge } from './core/syncBridge.js';
import { ThreeStage } from './core/threeStage.js';
import { SimulationManager } from './simulations/simulationRegistry.js';
import { renderQRCodeToElement } from './core/qrGenerator.js';

// DOM Elements
const bodyEl = document.body;
const canvas = document.querySelector('#visual-canvas');
const stage = document.querySelector('#stage');
const copyLayer = document.querySelector('#copy-layer');
const kickerEl = document.querySelector('#moment-kicker');
const titleEl = document.querySelector('#moment-title');
const subtitleEl = document.querySelector('#moment-subtitle');
const assetFrame = document.querySelector('#moment-asset');
const assetImage = document.querySelector('#moment-image');
const glowOrb = document.querySelector('#glow-orb');
const qrLayer = document.querySelector('#qr-layer');
const qrMemoryEl = document.querySelector('#qr-memory');
const qrSocialEl = document.querySelector('#qr-social');
const qrMemoryLink = document.querySelector('#qr-memory-link');
const qrSocialLink = document.querySelector('#qr-social-link');
const qrMemoryLabel = document.querySelector('#qr-memory-label');
const qrSocialLabel = document.querySelector('#qr-social-label');
const qrHostConnectEl = document.querySelector('#qr-host-connect');
const hostQrUrlText = document.querySelector('#host-qr-url-text');


// UI Elements
const numberEl = document.querySelector('#moment-number');
const totalEl = document.querySelector('#moment-total');
const clientMomentNumberEl = document.querySelector('#client-moment-number');
const clientStatusTextEl = document.querySelector('#client-status-text');
const clientStatusDotEl = document.querySelector('#client-status-dot');
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
const modeLabelEl = document.querySelector('#mode-label');
const clientsCountEl = document.querySelector('#clients-count');
const clientResetCamBtn = document.querySelector('#client-reset-cam-btn');
const langButtons = [...document.querySelectorAll('[data-language]')];

// Mode Selection Buttons
const btnModeHost = document.querySelector('#btn-mode-host');
const btnModeClient = document.querySelector('#btn-mode-client');
const btnModeGeneric = document.querySelector('#btn-mode-generic');

// --- DETECCIÓN DE MODO INICIAL ---
function detectInitialMode() {
  const params = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase();
  const modeParam = (params.get('mode') || '').toLowerCase();

  if (modeParam === 'host' || modeParam === 'live_host' || hash === '#host') {
    return APP_MODES.LIVE_HOST;
  }
  if (modeParam === 'client' || modeParam === 'live_client' || hash === '#client') {
    return APP_MODES.LIVE_CLIENT;
  }
  return APP_MODES.GENERIC_VIEWER;
}

const initialMode = detectInitialMode();
const stateManager = new StateManager(initialMode);
const syncBridge = new SyncBridge(stateManager);
const threeStage = new ThreeStage(canvas, { mode: initialMode });
const simulationManager = new SimulationManager(threeStage, stateManager);

threeStage.start();
syncBridge.init();

// Escuchar estado de conexión de red
syncBridge.onStatusChange((status) => {
  if (clientStatusTextEl && clientStatusDotEl) {
    if (status === 'connected') {
      clientStatusTextEl.textContent = 'LIVE · Sincronizado';
      clientStatusDotEl.style.backgroundColor = 'var(--accent-emerald)';
      clientStatusDotEl.style.boxShadow = '0 0 10px var(--accent-emerald)';
    } else if (status === 'reconnecting') {
      clientStatusTextEl.textContent = 'Reconectando con el Host...';
      clientStatusDotEl.style.backgroundColor = 'var(--accent-amber)';
      clientStatusDotEl.style.boxShadow = '0 0 10px var(--accent-amber)';
    }
  }
});

// Actualizar clases de modo en body y controles
function updateModeUi(mode) {
  bodyEl.classList.remove('mode-host', 'mode-client', 'mode-generic');
  if (mode === APP_MODES.LIVE_HOST) {
    bodyEl.classList.add('mode-host');
    if (modeLabelEl) modeLabelEl.textContent = 'LIVE_HOST';
  } else if (mode === APP_MODES.LIVE_CLIENT) {
    bodyEl.classList.add('mode-client');
    if (modeLabelEl) modeLabelEl.textContent = 'LIVE_CLIENT';
  } else {
    bodyEl.classList.add('mode-generic');
    if (modeLabelEl) modeLabelEl.textContent = 'GENERIC_VIEWER';
  }

  [btnModeHost, btnModeClient, btnModeGeneric].forEach((btn) => {
    if (btn) btn.classList.remove('is-active');
  });
  if (mode === APP_MODES.LIVE_HOST && btnModeHost) btnModeHost.classList.add('is-active');
  if (mode === APP_MODES.LIVE_CLIENT && btnModeClient) btnModeClient.classList.add('is-active');
  if (mode === APP_MODES.GENERIC_VIEWER && btnModeGeneric) btnModeGeneric.classList.add('is-active');

  threeStage.setMode(mode);
}

updateModeUi(initialMode);

// Actualizar Branding
if (brandTitleEl) brandTitleEl.textContent = CONFIG.brandLine;
if (totalEl) totalEl.textContent = String(SLIDES.length).padStart(2, '0');

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
 * Renderiza el contenido de la diapositiva actual
 */
function renderSlide(index, animate = true) {
  if (index < 0 || index >= SLIDES.length) return;
  const slide = SLIDES[index];
  const lang = stateManager.getLanguage();
  const copy = slide.copy[lang] || slide.copy.es;
  const highlights = slide.highlights?.[lang] || slide.highlights?.es || [];

  // Actualizar contadores
  const numStr = String(index + 1).padStart(2, '0');
  if (numberEl) numberEl.textContent = numStr;
  if (clientMomentNumberEl) clientMomentNumberEl.textContent = numStr;
  if (totalEl) totalEl.textContent = String(SLIDES.length).padStart(2, '0');

  // Actualizar barra de progreso (Host y Generic)
  if (progressBar) {
    const progress = ((index + 1) / SLIDES.length) * 100;
    progressBar.style.width = `${progress}%`;
  }

  // Notificar al gestor de simulaciones 3D
  simulationManager.setSlide(index);

  // Orbe de resplandor ambiental
  if (glowOrb && slide.colors && slide.colors[0]) {
    glowOrb.style.background = `radial-gradient(circle, ${slide.colors[0]}22 0%, ${slide.colors[1] || slide.colors[0]}11 50%, transparent 80%)`;
  }

  // QR Layer para slide 13
  if (qrLayer) {
    const isQrSlide = slide.state === 'qr';
    qrLayer.classList.toggle('active', isQrSlide);
    if (isQrSlide) {
      if (qrMemoryEl) renderQRCodeToElement(qrMemoryEl, CONFIG.qr.memoryUrl, { size: 110 });
      if (qrSocialEl) renderQRCodeToElement(qrSocialEl, CONFIG.qr.socialUrl, { size: 110 });
      if (qrMemoryLink) qrMemoryLink.href = CONFIG.qr.memoryUrl;
      if (qrSocialLink) qrSocialLink.href = CONFIG.qr.socialUrl;
      if (qrMemoryLabel) qrMemoryLabel.textContent = CONFIG.qr.labels[lang]?.memory || "Memorias · Presentación";
      if (qrSocialLabel) qrSocialLabel.textContent = CONFIG.qr.labels[lang]?.social || "@centrodeeventosupb";
    }
  }

  const updateTexts = () => {
    if (kickerEl) {
      kickerEl.textContent = copy.kicker || CONFIG.brandLine;
    }

    if (titleEl) {
      titleEl.replaceChildren();
      appendHighlightedText(titleEl, copy.title || '', highlights, lang);
    }

    if (subtitleEl) {
      subtitleEl.textContent = copy.subtitle || '';
      subtitleEl.style.display = copy.subtitle ? 'block' : 'none';
    }

    if (assetFrame && assetImage) {
      if (slide.asset && slide.asset.src) {
        assetImage.src = slide.asset.src;
        assetImage.alt = slide.asset.alt || '';
        assetFrame.classList.add('active');
      } else {
        assetFrame.classList.remove('active');
      }
    }
  };

  if (!animate) {
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


/**
 * Navegación (Solo permitida para Host o Generic)
 */
function nextMoment() {
  if (stateManager.isClient()) return; // Clientes no navegan
  const current = stateManager.getCurrentSlide();
  if (current < SLIDES.length - 1) {
    stateManager.setSlide(current + 1);
  }
}

function prevMoment() {
  if (stateManager.isClient()) return; // Clientes no navegan
  const current = stateManager.getCurrentSlide();
  if (current > 0) {
    stateManager.setSlide(current - 1);
  }
}

// Suscripción al StateManager para cambios reactivos
stateManager.subscribe((state, prevState) => {
  if (state.currentSlide !== prevState.currentSlide || state.language !== prevState.language) {
    renderSlide(state.currentSlide, true);
  }

  if (state.language !== prevState.language) {
    document.documentElement.lang = state.language;
    langButtons.forEach((btn) => {
      const isActive = btn.dataset.language === state.language;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', String(isActive));
    });
  }

  if (state.connectedClientsCount !== prevState.connectedClientsCount) {
    if (clientsCountEl) {
      clientsCountEl.textContent = String(state.connectedClientsCount);
    }
  }

  if (state.mode !== prevState.mode) {
    updateModeUi(state.mode);
  }
});

// Eventos de botones (Solo activos en Host y Generic)
if (nextBtn) nextBtn.addEventListener('click', nextMoment);
if (prevBtn) prevBtn.addEventListener('click', prevMoment);

if (clientResetCamBtn) {
  clientResetCamBtn.addEventListener('click', () => {
    threeStage.resetCamera();
  });
}

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

// Modal de Ayuda & Configuración
let isHelpOpen = false;
function toggleHelp(show) {
  isHelpOpen = typeof show === 'boolean' ? show : !isHelpOpen;
  if (helpPanel) {
    helpPanel.classList.toggle('active', isHelpOpen);
    helpPanel.setAttribute('aria-hidden', String(!isHelpOpen));

    if (isHelpOpen) {
      if (qrHostConnectEl) {
        renderQRCodeToElement(qrHostConnectEl, CONFIG.qr.liveClientUrl, { size: 85 });
      }
      if (hostQrUrlText) {
        hostQrUrlText.textContent = CONFIG.qr.liveClientUrl;
      }
    }
  }
}


if (helpBtn) helpBtn.addEventListener('click', () => toggleHelp(true));
if (helpCloseBtn) helpCloseBtn.addEventListener('click', () => toggleHelp(false));
if (resetBtn) resetBtn.addEventListener('click', () => {
  if (stateManager.isClient()) return;
  toggleHelp(false);
  stateManager.setSlide(0);
});
if (endBtn) endBtn.addEventListener('click', () => {
  if (stateManager.isClient()) return;
  toggleHelp(false);
  stateManager.setSlide(SLIDES.length - 1);
});

if (helpPanel) {
  helpPanel.addEventListener('click', (e) => {
    if (e.target === helpPanel) toggleHelp(false);
  });
}

// Botones de Selector de Idioma (Solo expositor o modo genérico)
langButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (stateManager.isClient()) return;
    const lang = btn.dataset.language;
    stateManager.setLanguage(lang);
  });
});

// Botones de Selector de Modo
if (btnModeHost) {
  btnModeHost.addEventListener('click', () => {
    stateManager.setMode(APP_MODES.LIVE_HOST);
    syncBridge.init();
    toggleHelp(false);
  });
}
if (btnModeClient) {
  btnModeClient.addEventListener('click', () => {
    stateManager.setMode(APP_MODES.LIVE_CLIENT);
    syncBridge.init();
    toggleHelp(false);
  });
}
if (btnModeGeneric) {
  btnModeGeneric.addEventListener('click', () => {
    stateManager.setMode(APP_MODES.GENERIC_VIEWER);
    toggleHelp(false);
  });
}

// Clic en la pantalla para avanzar (solo en Host / Generic)
stage.addEventListener('click', (e) => {
  if (stateManager.isClient()) return;
  if (
    e.target.closest('.operator-ui') ||
    e.target.closest('.help-panel') ||
    e.target.closest('button') ||
    e.target.closest('a')
  ) {
    return;
  }
  nextMoment();
});

// Controles de Teclado (Bloqueados para el cliente móvil)
window.addEventListener('keydown', (e) => {
  if (isHelpOpen) {
    if (e.key === 'Escape' || e.key === 'h' || e.key === 'H') {
      e.preventDefault();
      toggleHelp(false);
    }
    return;
  }

  // En modo cliente los atajos de teclado NO navegan
  if (stateManager.isClient()) return;

  switch (e.key) {
    case 'ArrowRight':
    case 'ArrowDown':
    case ' ':
    case 'PageDown':
      e.preventDefault();
      nextMoment();
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
    case 'Backspace':
    case 'PageUp':
      e.preventDefault();
      prevMoment();
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
      stateManager.setSlide(0);
      break;
    case 'Home':
      e.preventDefault();
      stateManager.setSlide(0);
      break;
    case 'End':
      e.preventDefault();
      stateManager.setSlide(SLIDES.length - 1);
      break;
    default:
      if (e.key >= '1' && e.key <= '9') {
        const num = parseInt(e.key, 10) - 1;
        if (num < SLIDES.length) {
          stateManager.setSlide(num);
        }
      }
      break;
  }
});

// Soporte Touch Swipe para Host & Generic
let touchStartX = 0;
stage.addEventListener('touchstart', (e) => {
  if (stateManager.isClient()) return; // En cliente los toques son para la cámara 3D
  touchStartX = e.changedTouches[0].clientX;
}, { passive: true });

stage.addEventListener('touchend', (e) => {
  if (stateManager.isClient()) return;
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (Math.abs(delta) > 42) {
    if (delta < 0) nextMoment();
    else prevMoment();
  }
}, { passive: true });

// Inicialización
function init() {
  const hash = window.location.hash.replace('#', '');
  const initialIndex = parseInt(hash, 10) - 1;
  const targetIndex = !isNaN(initialIndex) && initialIndex >= 0 && initialIndex < SLIDES.length ? initialIndex : 0;

  // En modo cliente, el slide inicial lo determina el Host a través del SyncBridge
  if (!stateManager.isClient()) {
    stateManager.setSlide(targetIndex);
    renderSlide(targetIndex, false);
  } else {
    renderSlide(0, false);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
