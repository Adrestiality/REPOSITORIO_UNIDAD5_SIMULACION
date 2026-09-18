/**
 * Configuración Global - Fórum UPB
 * Metadatos de marca, activos y enlaces oficiales de la presentación.
 */

function getBaseUrl() {
  if (typeof window !== 'undefined' && window.location) {
    return `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
  }
  return 'http://localhost:5173';
}

export const CONFIG = {
  title: "Relevo generacional",
  brandLine: "Future Leaders Forum · Fórum UPB",
  defaultLanguage: "es",
  aspectRatio: 16 / 9,

  urls: {
    presentation: getBaseUrl(),
    instagram: "https://instagram.com/centrodeeventosupb"
  },

  qr: {
    memoryUrl: getBaseUrl(),
    socialUrl: "https://instagram.com/centrodeeventosupb",
    labels: {
      es: {
        memory: "Memorias · Presentación",
        social: "@centrodeeventosupb"
      },
      pt: {
        memory: "Memórias · Apresentação",
        social: "@centrodeeventosupb"
      }
    }
  },

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
