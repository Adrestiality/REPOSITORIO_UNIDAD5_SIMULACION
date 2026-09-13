/**
 * Configuración Global - Fórum UPB
 * Centraliza la arquitectura de enlaces, generación de QR, marca y catálogo de activos.
 */

// Función auxiliar para determinar la URL base dinámica del entorno
function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'http://localhost:5173';
}

export const CONFIG = {
  title: "Relevo generacional",
  brandLine: "Future Leaders Forum · Fórum UPB",
  defaultLanguage: "es",
  aspectRatio: 16 / 9,

  // --- ARQUITECTURA DE ENLACES ---
  urls: {
    // 1. Enlace para el Expositor
    liveHost: `${getBaseUrl()}/?mode=host`,
    // 2. Enlace para Celulares Participantes (QR Participación)
    liveClient: `${getBaseUrl()}/?mode=client`,
    // 3. Enlace para Visualización Genérica / Memorias (QR Cierre)
    genericViewer: `${getBaseUrl()}/?mode=generic`,
    // 4. Enlace Institucional de Instagram
    instagram: "https://instagram.com/centrodeeventosupb"
  },

  // --- CONFIGURACIÓN DE CÓDIGOS QR ---
  qr: {
    // QR de Conexión en Vivo para asistentes (Slides iniciales / Modal Host)
    liveClientUrl: `${getBaseUrl()}/?mode=client`,
    // QR de Memorias / Presentación Genérica (Slide 13)
    memoryUrl: `${getBaseUrl()}/?mode=generic`,
    // QR de Redes Sociales (Slide 13)
    socialUrl: "https://instagram.com/centrodeeventosupb",

    labels: {
      es: {
        memory: "Memorias · Presentación",
        social: "@centrodeeventosupb",
        liveConnect: "Escanear para interactuar con tu celular"
      },
      pt: {
        memory: "Memórias · Apresentação",
        social: "@centrodeeventosupb",
        liveConnect: "Escanear para interagir com seu celular"
      }
    }
  },

  // --- CATÁLOGO DE IMÁGENES Y LOGOS ---
  assets: {
    logos: {
      forumCentroEventos: "./assets/logo_forum_centro_eventos.svg",
      upb90Anos: "./assets/logo_upb_90_anos.svg"
    },
    slides: {
      slide02: "./assets/slide02_grados.jpg",
      slide03: "./assets/slide03_campus_forum.jpg",
      slide04: "./assets/slide04_academia_industria.jpg",
      slide06: "./assets/slide06_comunidad_prensa.jpg",
      slide08: "./assets/slide08_espacio_rutas.jpg",
      slide10: "./assets/slide10_trabajo_intergeneracional.jpg"
    }
  }
};

