/**
 * Definición Oficial de las 13 Diapositivas (Fórum UPB)
 * Textos exactos en Español y Portugués, destacados de color y metadatos visuales.
 */

export const SLIDES = [
  {
    id: "relevo-generacional",
    copy: {
      es: {
        kicker: "Future Leaders Forum · Fórum UPB",
        title: "RELEVO GENERACIONAL: LA VENTAJA QUE NADIE ESTÁ APROVECHANDO",
        subtitle: "@centrodeeventosupb",
      },
      pt: {
        kicker: "Future Leaders Forum · Fórum UPB",
        title: "RELEVO GERACIONAL: A VANTAGEM QUE NINGUÉM ESTÁ APROVEITANDO",
        subtitle: "@centrodeeventosupb",
      },
    },
    highlights: {
      es: [{ text: "RELEVO GENERACIONAL", tone: "cyan" }],
      pt: [{ text: "RELEVO GERACIONAL", tone: "cyan" }],
    },
    state: "latent",
    intensity: 0.46,
    colors: ["#08a9dd", "#f7353f", "#e96daa"]
  },
  {
    id: "auditorio-grados",
    copy: {
      es: {
        kicker: "Espacio",
        title: "¿Un gran auditorio solo para hacer grados?",
        subtitle: "",
      },
      pt: {
        kicker: "Espaço",
        title: "Um grande auditório apenas para formaturas?",
        subtitle: "",
      },
    },
    asset: {
      type: "image",
      src: "./assets/slide02_grados.jpg",
      alt: "Ceremonia de grados en el auditorio Fórum UPB",
      placement: "background",
    },
    state: "architecture",
    intensity: 0.34,
    colors: ["#f7f7f4", "#08a9dd", "#e96daa"]
  },
  {
    id: "universidad-mundo",
    copy: {
      es: {
        kicker: "Encuentro",
        title: "Los eventos no llegaron a la Universidad. La Universidad decidió encontrarse con el mundo.",
        subtitle: "",
      },
      pt: {
        kicker: "Encontro",
        title: "Os eventos não chegaram à Universidade. A Universidade decidiu se encontrar com o mundo.",
        subtitle: "",
      },
    },
    highlights: {
      es: [{ text: "La Universidad decidió encontrarse con el mundo.", tone: "cyan" }],
      pt: [{ text: "A Universidade decidiu se encontrar com o mundo.", tone: "cyan" }],
    },
    asset: {
      type: "image",
      src: "./assets/slide03_campus_forum.jpg",
      alt: "Campus UPB y acceso exterior de Fórum Centro de Eventos",
      placement: "background",
    },
    state: "opening",
    intensity: 0.56,
    colors: ["#08a9dd", "#f7f7f4", "#f7353f"]
  },
  {
    id: "academia-industria-ciudad",
    copy: {
      es: {
        kicker: "Tres fuerzas",
        title: "Academia + Industria + Ciudad",
        subtitle: "",
      },
      pt: {
        kicker: "Três forças",
        title: "Academia + Indústria + Cidade",
        subtitle: "",
      },
    },
    asset: {
      type: "image",
      src: "./assets/slide04_academia_industria.jpg",
      alt: "Cumbre de líderes: Academia, Industria y Ciudad en Fórum UPB",
      placement: "background",
    },
    state: "triad",
    intensity: 0.64,
    colors: ["#08a9dd", "#f7353f", "#e96daa"]
  },
  {
    id: "impacto",
    copy: {
      es: {
        kicker: "Impacto",
        title: "Los eventos nunca fueron el objetivo. El impacto sí.",
        subtitle: "",
      },
      pt: {
        kicker: "Impacto",
        title: "Os eventos nunca foram o objetivo. O impacto, sim.",
        subtitle: "",
      },
    },
    highlights: {
      es: [{ text: "El impacto sí.", tone: "red" }],
      pt: [{ text: "O impacto, sim.", tone: "red" }],
    },
    state: "impact",
    intensity: 0.7,
    colors: ["#f7353f", "#e96daa", "#f7f7f4"]
  },
  {
    id: "comunidad",
    copy: {
      es: {
        kicker: "Comunidad",
        title: "Un evento trae personas. Una comunidad trae transformación.",
        subtitle: "",
      },
      pt: {
        kicker: "Comunidade",
        title: "Um evento traz pessoas. Uma comunidade traz transformação.",
        subtitle: "",
      },
    },
    highlights: {
      es: [
        { text: "comunidad", tone: "cyan" },
        { text: "transformación", tone: "magenta" },
      ],
      pt: [
        { text: "comunidade", tone: "cyan" },
        { text: "transformação", tone: "magenta" },
      ],
    },
    asset: {
      type: "image",
      src: "./assets/slide06_comunidad_prensa.jpg",
      alt: "Lanzamiento y encuentro de comunidad en Fórum UPB",
      placement: "background",
    },
    state: "community",
    intensity: 0.74,
    colors: ["#08a9dd", "#e96daa", "#f7f7f4"]
  },
  {
    id: "confianza",
    copy: {
      es: {
        kicker: "Confianza",
        title: "El talento crece a la velocidad de la confianza.",
        subtitle: "",
      },
      pt: {
        kicker: "Confiança",
        title: "O talento cresce na velocidade da confiança.",
        subtitle: "",
      },
    },
    highlights: {
      es: [{ text: "confianza", tone: "magenta" }],
      pt: [{ text: "confiança", tone: "magenta" }],
    },
    state: "trust",
    intensity: 0.8,
    colors: ["#08a9dd", "#e96daa", "#f7353f"]
  },
  {
    id: "nuevas-rutas",
    copy: {
      es: {
        kicker: "Rutas",
        title: "La experiencia construye el camino. Las nuevas generaciones descubren nuevas rutas.",
        subtitle: "",
      },
      pt: {
        kicker: "Rotas",
        title: "A experiência constrói o caminho. As novas gerações descobrem novas rotas.",
        subtitle: "",
      },
    },
    highlights: {
      es: [
        { text: "experiencia", tone: "cyan" },
        { text: "camino", tone: "magenta" },
        { text: "nuevas rutas", tone: "red" },
      ],
      pt: [
        { text: "experiência", tone: "cyan" },
        { text: "caminho", tone: "magenta" },
        { text: "novas rotas", tone: "red" },
      ],
    },
    asset: {
      type: "image",
      src: "./assets/slide08_espacio_rutas.jpg",
      alt: "Espacio del Fórum UPB preparado para mesas de trabajo y nuevas rutas",
      placement: "background",
    },
    state: "routes",
    intensity: 0.7,
    colors: ["#08a9dd", "#f7353f", "#e96daa"]
  },
  {
    id: "vision-generaciones",
    copy: {
      es: {
        kicker: "Relevo",
        title: "Una visión. Dos generaciones.",
        subtitle: "",
      },
      pt: {
        kicker: "Revezamento",
        title: "Uma visão. Duas gerações.",
        subtitle: "",
      },
    },
    highlights: {
      es: [{ text: "Dos generaciones", tone: "cyan" }],
      pt: [{ text: "Duas gerações", tone: "cyan" }],
    },
    state: "duality",
    intensity: 0.78,
    colors: ["#f7f7f4", "#08a9dd", "#f7353f"]
  },
  {
    id: "trabajan-juntas",
    copy: {
      es: {
        kicker: "Composición",
        title: "El crecimiento no ocurre cuando una generación reemplaza a otra. Ocurre cuando trabajan juntas.",
        subtitle: "",
      },
      pt: {
        kicker: "Composição",
        title: "O crescimento não acontece cuando uma geração substitui a outra. Acontece quando trabalham juntas.",
        subtitle: "",
      },
    },
    highlights: {
      es: [
        { text: "crecimiento", tone: "cyan" },
        { text: "trabajan juntas", tone: "magenta" },
      ],
      pt: [
        { text: "crescimento", tone: "cyan" },
        { text: "trabalham juntas", tone: "magenta" },
      ],
    },
    asset: {
      type: "image",
      src: "./assets/slide10_trabajo_intergeneracional.jpg",
      alt: "Mesa de trabajo colaborativo intergeneracional en Fórum UPB",
      placement: "background",
    },
    state: "convergence",
    intensity: 0.84,
    colors: ["#08a9dd", "#f7353f", "#e96daa"]
  },
  {
    id: "presente-joven",
    copy: {
      es: {
        kicker: "Presente",
        title: "Los jóvenes no son el futuro. Son el presente que muchas organizaciones aún no ven.",
        subtitle: "",
      },
      pt: {
        kicker: "Presente",
        title: "Os jovens não são o futuro. São o presente que muitas organizações ainda não veem.",
        subtitle: "",
      },
    },
    highlights: {
      es: [{ text: "presente", tone: "red" }],
      pt: [{ text: "presente", tone: "red" }],
    },
    state: "present",
    intensity: 0.86,
    colors: ["#f7353f", "#08a9dd", "#f7f7f4"]
  },
  {
    id: "futuro-construido",
    copy: {
      es: {
        kicker: "Futuro construido",
        title: "El futuro no se hereda. Se construye.",
        subtitle: "",
      },
      pt: {
        kicker: "Futuro construído",
        title: "O futuro não se herda. Ele se constrói.",
        subtitle: "",
      },
    },
    highlights: {
      es: [
        { text: "futuro", tone: "cyan" },
        { text: "Se construye", tone: "red" },
      ],
      pt: [
        { text: "futuro", tone: "cyan" },
        { text: "constrói", tone: "red" },
      ],
    },
    state: "future",
    intensity: 0.96,
    colors: ["#f7f7f4", "#08a9dd", "#f7353f"]
  },
  {
    id: "qr-cierre",
    copy: {
      es: {
        kicker: "Continuidad",
        title: "@centrodeeventosupb",
        subtitle: "",
      },
      pt: {
        kicker: "Continuidade",
        title: "@centrodeeventosupb",
        subtitle: "",
      },
    },
    state: "qr",
    intensity: 0.86,
    colors: ["#f7f7f4", "#08a9dd", "#f7353f"]
  },
];

