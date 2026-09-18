/**
 * Definición Oficial de las 13 Diapositivas - Fórum UPB
 * Textos en Español y Portugués, destacados tipográficos, temas cromáticos (light/dark) y layouts editoriales.
 */

export const SLIDES_DATA = [
  {
    id: "relevo-generacional",
    theme: "light",
    layout: "layout-left",
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
    colors: ["#08a9dd", "#f43f5e", "#e96daa"]
  },
  {
    id: "auditorio-grados",
    theme: "light",
    layout: "layout-photo-center",
    copy: {
      es: {
        kicker: "Espacio de Encuentro",
        title: "¿Un gran auditorio solo para hacer grados?",
        subtitle: "",
      },
      pt: {
        kicker: "Espaço de Encontro",
        title: "Um grande auditório apenas para formaturas?",
        subtitle: "",
      },
    },
    state: "architecture",
    intensity: 0.34,
    colors: ["#f8f6f0", "#08a9dd", "#e96daa"]
  },
  {
    id: "universidad-mundo",
    theme: "light",
    layout: "layout-split-top",
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
      es: [{ text: "encontrarse con el mundo", tone: "cyan" }],
      pt: [{ text: "se encontrar com o mundo", tone: "cyan" }],
    },
    state: "opening",
    intensity: 0.56,
    colors: ["#08a9dd", "#f8f6f0", "#f43f5e"]
  },
  {
    id: "academia-industria-ciudad",
    theme: "light",
    layout: "layout-photo-right",
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
    highlights: {
      es: [{ text: "Academia + Industria + Ciudad", tone: "cyan" }],
      pt: [{ text: "Academia + Indústria + Cidade", tone: "cyan" }],
    },
    state: "triad",
    intensity: 0.64,
    colors: ["#08a9dd", "#f43f5e", "#e96daa"]
  },
  {
    id: "impacto",
    theme: "light",
    layout: "layout-left",
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
      es: [{ text: "El impacto sí.", tone: "coral" }],
      pt: [{ text: "O impacto, sim.", tone: "coral" }],
    },
    state: "impact",
    intensity: 0.7,
    colors: ["#f43f5e", "#e96daa", "#f8f6f0"]
  },
  {
    id: "comunidad",
    theme: "light",
    layout: "layout-photo-right",
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
    state: "community",
    intensity: 0.74,
    colors: ["#08a9dd", "#e96daa", "#f8f6f0"]
  },
  {
    id: "confianza",
    theme: "light",
    layout: "layout-left",
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
    colors: ["#08a9dd", "#e96daa", "#f43f5e"]
  },
  {
    id: "nuevas-rutas",
    theme: "light",
    layout: "layout-photo-right",
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
        { text: "nuevas rutas", tone: "coral" },
      ],
      pt: [
        { text: "experiência", tone: "cyan" },
        { text: "novas rotas", tone: "coral" },
      ],
    },
    state: "routes",
    intensity: 0.7,
    colors: ["#08a9dd", "#f43f5e", "#e96daa"]
  },
  {
    id: "vision-generaciones",
    theme: "light",
    layout: "layout-left",
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
    colors: ["#f8f6f0", "#08a9dd", "#f43f5e"]
  },
  {
    id: "trabajan-juntas",
    theme: "light",
    layout: "layout-left",
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
    state: "convergence",
    intensity: 0.84,
    colors: ["#08a9dd", "#f43f5e", "#e96daa"]
  },
  {
    id: "presente-joven",
    theme: "dark",
    layout: "layout-left",
    copy: {
      es: {
        kicker: "Presente",
        title: "Los jóvenes no son el futuro. Son el presente que muchas organizaciones aún no ven.",
        titleHtml: '<div class="hierarchy-title"><span class="hierarchy-subtle">Los jóvenes</span><span class="hierarchy-large">no son el futuro.</span><span class="hierarchy-huge">SON EL PRESENTE</span><span class="hierarchy-small">que muchas organizaciones aún no ven.</span></div>',
        subtitle: "",
      },
      pt: {
        kicker: "Presente",
        title: "Os jovens não são o futuro. São o presente que muitas organizações ainda não veem.",
        titleHtml: '<div class="hierarchy-title"><span class="hierarchy-subtle">Os jovens</span><span class="hierarchy-large">não são o futuro.</span><span class="hierarchy-huge">SÃO O PRESENTE</span><span class="hierarchy-small">que muitas organizações ainda não veem.</span></div>',
        subtitle: "",
      },
    },
    highlights: {
      es: [{ text: "Son el presente", tone: "magenta" }],
      pt: [{ text: "São o presente", tone: "magenta" }],
    },
    state: "present",
    intensity: 0.86,
    colors: ["#e96daa", "#08a9dd", "#f8f6f0"]
  },
  {
    id: "futuro-construido",
    theme: "light",
    layout: "layout-left",
    copy: {
      es: {
        kicker: "Construcción textil",
        title: "El futuro no se hereda. Se construye.",
        subtitle: "",
      },
      pt: {
        kicker: "Construção têxtil",
        title: "O futuro não se herda. Ele se constrói.",
        subtitle: "",
      },
    },
    highlights: {
      es: [
        { text: "futuro", tone: "cyan" },
        { text: "Se construye", tone: "coral" },
      ],
      pt: [
        { text: "futuro", tone: "cyan" },
        { text: "constrói", tone: "coral" },
      ],
    },
    state: "future",
    intensity: 0.96,
    colors: ["#f59e0b", "#08a9dd", "#e96daa"]
  },
  {
    id: "qr-cierre",
    theme: "dark",
    layout: "layout-left",
    copy: {
      es: {
        kicker: "Continuidad",
        title: "Relevo generacional: Construcción conjunta.",
        subtitle: "@centrodeeventosupb",
      },
      pt: {
        kicker: "Continuidade",
        title: "Revezamento geracional: Construção conjunta.",
        subtitle: "@centrodeeventosupb",
      },
    },
    highlights: {
      es: [{ text: "Construcción conjunta", tone: "cyan" }],
      pt: [{ text: "Construção conjunta", tone: "cyan" }],
    },
    state: "qr",
    intensity: 0.86,
    colors: ["#08a9dd", "#e96daa", "#f8f6f0"]
  }
];


