export type RutaNivelId = 'basico' | 'intermedio' | 'avanzado';

export interface RutaCourseMetric {
  label: string;
  value: string;
}

export interface RutaTemarioTopic {
  id: string;
  title: string;
}

export interface RutaTemarioModule {
  id: string;
  title: string;
  summary: string;
  topics: RutaTemarioTopic[];
}

export interface RutaCourse {
  id: string;
  slug: string;
  code: string;
  levelId: RutaNivelId;
  title: string;
  shortTitle: string;
  category: string;
  summary: string;
  description: string;
  audience: string;
  requirements: string[];
  outcomes: string[];
  metrics: RutaCourseMetric[];
  temario: RutaTemarioModule[];
}

export interface RutaLevel {
  id: RutaNivelId;
  title: string;
  subtitle: string;
  description: string;
  supportText: string;
  routeLabel: string;
  routeSupportingLabel: string;
  detailTitle: string;
  detailDuration: string;
  detailBenefit: string;
  detailReward?: string;
  icon: 'sprout' | 'tree' | 'drone';
  cardClassName: string;
  badgeClassName: string;
  pillClassName: string;
  courseButtonClassName: string;
  courseButtonActiveClassName: string;
}

export interface RutaValueHighlight {
  id: string;
  title: string;
  description: string;
  icon: 'spark' | 'briefcase' | 'certificate' | 'community';
}

export interface RutaEligibilityItem {
  id: string;
  title: string;
  description: string;
  icon: 'age' | 'location' | 'capacity';
  footerLabel?: string;
}

export interface RutaProcessLink {
  id: string;
  label: string;
  href: string;
}

export interface RutaProcessStep {
  id: string;
  title: string;
  description: string;
  secondaryDescription?: string;
  icon: 'social' | 'form' | 'review';
  actionLabel?: string;
  actionHref?: string;
  links?: RutaProcessLink[];
}

export interface RutaFormacionContent {
  title: string;
  eyebrow: string;
  heroHeadline: string;
  heroSubheadline: string;
  heroPrimaryCtaLabel: string;
  subtitle: string;
  introduction: string;
  valueSectionTitle: string;
  valueSectionBody: string;
  valueHighlights: RutaValueHighlight[];
  annexImage: string;
  annexPdf: string;
  registrationUrl: string;
  eligibility: RutaEligibilityItem[];
  processSteps: RutaProcessStep[];
  levels: RutaLevel[];
  courses: RutaCourse[];
  importantNotesAccordionTitle: string;
  importantNotes: string[];
}

export const rutaFormacionContent: RutaFormacionContent = {
  title: 'Ruta de Formación',
  eyebrow: 'Formación continua Terrasacha',
  heroHeadline:
    '¡Conéctate para la transformación de tu futuro y el de tu región con el Proyecto Terrasacha!',
  heroSubheadline:
    '¿Eres residente de Meta o Arauca con deseos de innovar y liderar el desarrollo de tu territorio?',
  heroPrimaryCtaLabel: '¡Quiero Inscribirme ya!',
  subtitle: 'De los fundamentos al pilotaje experto, con una ruta progresiva enfocada en capacidades tecnológicas y aplicación territorial.',
  introduction:
    'La Ruta de Formación organiza el aprendizaje por niveles para que participantes de Meta y Arauca puedan recorrer contenidos base, profundizar en gestión y monitoreo, y acceder a una fase avanzada de pilotaje especializado.',
  valueSectionTitle: '¿Por qué hace parte de esta ruta?',
  valueSectionBody:
    'El Proyecto Terrasacha te invita a ser parte de un ciclo de formación único, diseñado para potenciar tus habilidades y abrirte las puertas a nuevas oportunidades en el sector agroforestal. Esta es tu oportunidad de adquirir conocimientos de vanguardia, obtener certificaciones de alto valor y, lo más importante, convertirte en un agente de cambio para tu comunidad.',
  valueHighlights: [
    {
      id: 'skills',
      title: 'Potencia tus habilidades',
      description:
        'Fortalece capacidades técnicas y tecnológicas con contenidos pensados para responder a retos reales del territorio.',
      icon: 'spark',
    },
    {
      id: 'opportunities',
      title: 'Abre nuevas oportunidades',
      description:
        'Conecta tu proceso formativo con proyección en el sector agroforestal y nuevas posibilidades de desarrollo.',
      icon: 'briefcase',
    },
    {
      id: 'certifications',
      title: 'Obtén certificaciones valiosas',
      description:
        'Avanza por una ruta progresiva que integra cursos y procesos con alto valor de reconocimiento.',
      icon: 'certificate',
    },
    {
      id: 'community',
      title: 'Conviértete en agente de cambio',
      description:
        'Lleva el aprendizaje a tu comunidad y participa en la transformación sostenible de tu región.',
      icon: 'community',
    },
  ],
  annexImage: '/Ruta de formacion/Captura de pantalla 2026-03-13 a la(s) 3.06.33 p.m..png',
  annexPdf: '/Ruta de formacion/Anexo 005-A-2.7.2-Definir contenidos de talleres resumen.docx.pdf',
  registrationUrl:
    'https://docs.google.com/forms/d/e/1FAIpQLSecFBs5h69bQGxmwEvLU57B7bjSN6qWrmtQ3xlQwiPe5Otnug/viewform?usp=header',
  eligibility: [
    {
      id: 'age',
      title: 'Edad',
      description: 'Mayores de 18 años.',
      icon: 'age',
      footerLabel: 'Cumple los requisitos.',
    },
    {
      id: 'location',
      title: 'Residencia',
      description:
        'Residentes de Tame y Arauca (en Arauca) y Puerto Gaitán y Puerto López (en Meta). Se valida con certificado de residencia emitido por autoridad local.',
      icon: 'location',
      footerLabel: 'Áreas específicas.',
    },
    {
      id: 'capacity',
      title: 'Cupos',
      description: '50 por municipio.',
      icon: 'capacity',
      footerLabel: 'No te quedes sin lugar.',
    },
  ],
  processSteps: [
    {
      id: 'follow',
      title: 'Paso 1: Síguenos',
      description: 'Seguir la página de Proyecto Terrasacha.',
      secondaryDescription: 'Toma una captura de pantalla que evidencie que ya sigues la cuenta.',
      icon: 'social',
      links: [
        {
          id: 'instagram',
          label: 'Instagram',
          href: 'https://www.instagram.com/holaterrasacha',
        },
        {
          id: 'facebook',
          label: 'Facebook',
          href: 'https://www.facebook.com/profile.php?id=61570120596311',
        },
      ],
    },
    {
      id: 'register',
      title: 'Paso 2: Regístrate',
      description:
        'Registrarse en el link de inscripción a la ruta de formación. Por favor diligenciar el formulario y subir los documentos solicitados.',
      icon: 'form',
      actionLabel: 'Ir al Formulario de Inscripción',
      actionHref:
        'https://docs.google.com/forms/d/e/1FAIpQLSecFBs5h69bQGxmwEvLU57B7bjSN6qWrmtQ3xlQwiPe5Otnug/viewform?usp=header',
    },
    {
      id: 'review',
      title: 'Paso 3: Revisión y Notificación',
      description:
        'La Universidad Cooperativa de Colombia verificará tu residencia. Los cupos se asignan por orden de inscripción y cumplimiento de requisitos.',
      secondaryDescription:
        'Si eres seleccionado, recibirás un correo oficial con el cronograma y detalles de inicio.',
      icon: 'review',
    },
  ],
  levels: [
    {
      id: 'basico',
      title: 'Nivel Básico',
      subtitle: 'Bases tecnológicas',
      description:
        'Consolida los fundamentos de análisis, automatización y tecnologías emergentes que sostienen la ruta.',
      supportText: 'Los cursos básicos otorgan 60 puntos y cuentan con 200 cupos por capacitación.',
      routeLabel: 'Tu punto de partida (60h)',
      routeSupportingLabel: 'Brote inicial hacia la innovación',
      detailTitle: 'Nivel Básico: Tu punto de partida hacia la innovación.',
      detailDuration: '60 horas de formación enriquecedora.',
      detailBenefit:
        'Obtén 60 puntos y una certificación por cada curso aprobado.',
      icon: 'sprout',
      cardClassName: 'border-[#6e6c35]/15 bg-gradient-to-br from-[#f8f3df] via-[#f4ecc8] to-[#e8d79a]',
      badgeClassName: 'border-[#6e6c35]/15 bg-[#6e6c35] text-[#f8f3df]',
      pillClassName: 'border-[#6e6c35]/10 bg-white/70 text-[#44482c]',
      courseButtonClassName:
        'border-[#6e6c35]/10 bg-white/80 text-[#44482c] hover:border-[#6e6c35]/30 hover:bg-white',
      courseButtonActiveClassName:
        'border-[#6e6c35] bg-[#6e6c35] text-[#f8f3df] shadow-lg shadow-[#6e6c35]/15',
    },
    {
      id: 'intermedio',
      title: 'Nivel Intermedio',
      subtitle: 'Gestión y monitoreo',
      description:
        'Profundiza en operación, gestión productiva, monitoreo y uso aplicado de drones en contextos agroforestales.',
      supportText:
        'El nivel intermedio reúne cuatro cursos técnicos que fortalecen gestión, monitoreo e intervención.',
      routeLabel: 'Especialización y profundización (120h)',
      routeSupportingLabel: 'Árbol joven de crecimiento técnico',
      detailTitle: 'Nivel Intermedio: Profundiza tus conocimientos y especialízate.',
      detailDuration: 'Entre 120 horas de formación especializada.',
      detailBenefit:
        'Suma 120 puntos a tu puntaje total y obtén la certificación por cada curso aprobado.',
      icon: 'tree',
      cardClassName: 'border-[#849b50]/20 bg-gradient-to-br from-[#eef3df] via-[#dfe8c0] to-[#b1c181]',
      badgeClassName: 'border-[#849b50]/20 bg-[#849b50] text-[#f8f3df]',
      pillClassName: 'border-[#44482c]/10 bg-white/70 text-[#44482c]',
      courseButtonClassName:
        'border-[#849b50]/15 bg-white/80 text-[#44482c] hover:border-[#849b50]/35 hover:bg-white',
      courseButtonActiveClassName:
        'border-[#849b50] bg-[#849b50] text-[#f8f3df] shadow-lg shadow-[#849b50]/15',
    },
    {
      id: 'avanzado',
      title: 'Nivel Avanzado',
      subtitle: 'Certificación de élite',
      description:
        'Concentra la fase de pilotaje experto para participantes que culminan el recorrido y buscan una formación especializada.',
      supportText: 'La fase avanzada culmina con una capacitación certificada en pilotaje de drones.',
      routeLabel: '¡Premio: Certificación Piloto de Drones!',
      routeSupportingLabel: 'Meta final de alto valor',
      detailTitle: 'Nivel Avanzado: ¡Conviértete en un piloto de drones certificado!',
      detailDuration: 'Capacitación y certificación para los primeros 180 participantes.',
      detailBenefit:
        'Esta es una oportunidad de oro para dominar una de las tecnologías más disruptivas y demandadas en la agricultura de precisión.',
      detailReward:
        'Para los primeros 180 participantes que alcancen un puntaje total de 160 puntos al finalizar los dos niveles anteriores. Ofrecemos la capacitación y certificación en pilotaje de drones.',
      icon: 'drone',
      cardClassName: 'border-[#44482c]/20 bg-gradient-to-br from-[#505538] via-[#44482c] to-[#2f331d]',
      badgeClassName: 'border-[#e8d79a]/10 bg-[#e8d79a] text-[#44482c]',
      pillClassName: 'border-white/10 bg-white/10 text-[#f8f3df]',
      courseButtonClassName:
        'border-white/10 bg-white/10 text-[#f8f3df] hover:border-[#e8d79a]/30 hover:bg-white/15',
      courseButtonActiveClassName:
        'border-[#e8d79a] bg-[#e8d79a] text-[#44482c] shadow-lg shadow-black/20',
    },
  ],
  courses: [
    {
      id: 'vision-artificial',
      slug: 'vision-artificial',
      code: 'C1',
      levelId: 'basico',
      title: 'Capacitación en Visión Artificial aplicada a cultivos forestales',
      shortTitle: 'Visión Artificial',
      category: 'Tecnología aplicada',
      summary:
        'Introduce herramientas de visión computacional para observación, captura y análisis de variables visuales en procesos agroforestales.',
      description:
        'Este curso presenta bases de visión artificial y su uso para interpretar imágenes, apoyar seguimiento técnico y fortalecer decisiones sobre territorio, cultivos y monitoreo visual.',
      audience: 'Personas interesadas en tecnologías emergentes aplicadas al entorno productivo y ambiental.',
      requirements: [
        'Interés en innovación y monitoreo visual.',
        'Disponibilidad para cursar 20 horas de formación.',
      ],
      outcomes: [
        'Comprender fundamentos de captura y lectura de imágenes.',
        'Reconocer aplicaciones de visión computacional en contextos territoriales.',
        'Interpretar salidas básicas para seguimiento de variables productivas.',
      ],
      metrics: [
        { label: 'Duración', value: '20 horas' },
        { label: 'Cupos', value: '200 personas' },
        { label: 'Puntos', value: '60' },
      ],
      temario: [
        {
          id: 'va-modulo-1',
          title: 'Fundamentos de visión artificial',
          summary: 'Conceptos de lectura de imágenes y reconocimiento de patrones.',
          topics: [
            { id: 'va-1', title: 'Imagen digital, pixeles y resolución.' },
            { id: 'va-2', title: 'Captura, calidad visual y variables de observación.' },
            { id: 'va-3', title: 'Reconocimiento básico de patrones y objetos.' },
          ],
        },
        {
          id: 'va-modulo-2',
          title: 'Aplicaciones en cultivos forestales',
          summary: 'Uso práctico de datos visuales en seguimiento y monitoreo.',
          topics: [
            { id: 'va-4', title: 'Lectura de cambios visibles en coberturas y cultivos.' },
            { id: 'va-5', title: 'Apoyo a procesos de monitoreo territorial.' },
            { id: 'va-6', title: 'Casos de uso para apoyo técnico y toma de decisiones.' },
          ],
        },
      ],
    },
    {
      id: 'machine-learning',
      slug: 'machine-learning',
      code: 'C2',
      levelId: 'basico',
      title: 'Capacitación en Machine Learning y algoritmos de inteligencia artificial',
      shortTitle: 'Machine Learning',
      category: 'Analítica e IA',
      summary:
        'Explica cómo se entrenan modelos básicos y cómo la inteligencia artificial apoya la comprensión de datos del territorio.',
      description:
        'Aborda conceptos introductorios de machine learning para entender clasificación, predicción y uso de modelos en contextos ambientales, productivos y de innovación aplicada.',
      audience: 'Participantes que buscan fortalecer habilidades de análisis de datos e inteligencia artificial.',
      requirements: [
        'Interés en análisis de datos y automatización.',
        'Disponibilidad para cursar 20 horas de formación.',
      ],
      outcomes: [
        'Comprender la lógica general de entrenamiento de modelos.',
        'Identificar escenarios de predicción y clasificación.',
        'Relacionar IA con retos de sostenibilidad y gestión territorial.',
      ],
      metrics: [
        { label: 'Duración', value: '20 horas' },
        { label: 'Cupos', value: '200 personas' },
        { label: 'Puntos', value: '60' },
      ],
      temario: [
        {
          id: 'ml-modulo-1',
          title: 'Bases de aprendizaje automático',
          summary: 'Panorama general de datos, variables y modelos.',
          topics: [
            { id: 'ml-1', title: '¿Qué es machine learning y cómo aprende un modelo?' },
            { id: 'ml-2', title: 'Tipos de datos, variables y conjuntos de entrenamiento.' },
            { id: 'ml-3', title: 'Modelos supervisados y no supervisados.' },
          ],
        },
        {
          id: 'ml-modulo-2',
          title: 'Aplicaciones en territorio',
          summary: 'Cómo llevar modelos a problemas reales del proyecto.',
          topics: [
            { id: 'ml-4', title: 'Predicción y clasificación en contextos ambientales.' },
            { id: 'ml-5', title: 'Lectura de resultados para apoyar decisiones.' },
            { id: 'ml-6', title: 'Buenas prácticas para uso responsable de IA.' },
          ],
        },
      ],
    },
    {
      id: 'tecnologias-emergentes',
      slug: 'tecnologias-emergentes',
      code: 'C3',
      levelId: 'basico',
      title: 'Capacitación a beneficiarios en el monitoreo de tecnologías emergentes aplicadas al sector',
      shortTitle: 'Tecnologías Emergentes',
      category: 'Innovación territorial',
      summary:
        'Presenta un panorama de herramientas tecnológicas útiles para innovación, monitoreo y transformación de procesos.',
      description:
        'Explora tecnologías emergentes con potencial de uso en proyectos sostenibles, formación técnica, monitoreo ambiental y apropiación territorial de la innovación.',
      audience: 'Comunidades y participantes que desean conocer el ecosistema tecnológico del proyecto.',
      requirements: [
        'Interés por innovación, sostenibilidad y transformación digital.',
        'Disponibilidad para cursar 20 horas de formación.',
      ],
      outcomes: [
        'Identificar tecnologías relevantes para contextos rurales y ambientales.',
        'Comprender oportunidades de uso en procesos formativos y productivos.',
        'Relacionar innovación tecnológica con desarrollo territorial.',
      ],
      metrics: [
        { label: 'Duración', value: '20 horas' },
        { label: 'Cupos', value: '200 personas' },
        { label: 'Puntos', value: '60' },
      ],
      temario: [
        {
          id: 'te-modulo-1',
          title: 'Panorama tecnológico',
          summary: 'Herramientas y tendencias clave para el proyecto.',
          topics: [
            { id: 'te-1', title: 'Tecnologías emergentes y transformación sectorial.' },
            { id: 'te-2', title: 'Casos de uso en sostenibilidad y monitoreo.' },
            { id: 'te-3', title: 'Apropiación social de la innovación.' },
          ],
        },
        {
          id: 'te-modulo-2',
          title: 'Aplicación práctica',
          summary: 'Conexión entre tecnología, territorio y comunidades.',
          topics: [
            { id: 'te-4', title: 'Integración con procesos de formación y gestión.' },
            { id: 'te-5', title: 'Retos de adopción en territorio.' },
            { id: 'te-6', title: 'Construcción de oportunidades desde el proyecto Terrasacha.' },
          ],
        },
      ],
    },
    {
      id: 'manejo-fitosanitario',
      slug: 'manejo-fitosanitario',
      code: 'C4',
      levelId: 'intermedio',
      title: 'Manejo fitosanitario en cultivos de plantaciones comerciales forestales',
      shortTitle: 'Manejo Fitosanitario',
      category: 'Gestión técnica',
      summary:
        'Profundiza en identificación de riesgos, manejo preventivo y lectura de variables fitosanitarias en plantaciones forestales.',
      description:
        'La capacitación fortalece competencias para reconocer afectaciones, aplicar criterios de manejo y relacionar información técnica con acciones de monitoreo en cultivos forestales.',
      audience: 'Participantes con interés en seguimiento técnico de plantaciones y manejo productivo.',
      requirements: [
        'Haber recorrido o comprender bases tecnológicas de la ruta.',
        'Disponibilidad para cursar 20 horas de formación.',
      ],
      outcomes: [
        'Reconocer factores asociados al estado fitosanitario de cultivos.',
        'Distinguir alertas, variables y prácticas preventivas.',
        'Relacionar monitoreo con decisiones de manejo productivo.',
      ],
      metrics: [
        { label: 'Duración', value: '20 horas' },
        { label: 'Cupos', value: '200 personas' },
        { label: 'Puntos', value: '120' },
      ],
      temario: [
        {
          id: 'mf-modulo-1',
          title: 'Fundamentos fitosanitarios',
          summary: 'Conceptos esenciales para lectura técnica del cultivo.',
          topics: [
            { id: 'mf-1', title: 'Estado fitosanitario y variables de observación.' },
            { id: 'mf-2', title: 'Factores de riesgo en plantaciones forestales.' },
            { id: 'mf-3', title: 'Prevención y control desde una mirada técnica.' },
          ],
        },
        {
          id: 'mf-modulo-2',
          title: 'Monitoreo y seguimiento',
          summary: 'Uso de información para evaluar y actuar.',
          topics: [
            { id: 'mf-4', title: 'Registro de hallazgos y criterios de seguimiento.' },
            { id: 'mf-5', title: 'Priorización de alertas y acciones.' },
            { id: 'mf-6', title: 'Relación entre monitoreo y productividad forestal.' },
          ],
        },
      ],
    },
    {
      id: 'monitoreo-drones',
      slug: 'monitoreo-drones',
      code: 'C5',
      levelId: 'intermedio',
      title: 'Monitoreo de cultivos con drones y sensores térmicos para monitoreo de incendios',
      shortTitle: 'Monitoreo con Drones',
      category: 'Operación y monitoreo',
      summary:
        'Muestra cómo el uso de drones ayuda a observar coberturas, recopilar información y fortalecer procesos de monitoreo técnico.',
      description:
        'El curso aborda principios de monitoreo aéreo con drones, planificación de recorridos y lectura de resultados para seguimiento de cultivos y variables territoriales.',
      audience: 'Participantes interesados en monitoreo técnico con apoyo de herramientas aéreas.',
      requirements: [
        'Interés por observación aérea y análisis territorial.',
        'Disponibilidad para cursar 25 horas de formación.',
      ],
      outcomes: [
        'Comprender la lógica general del monitoreo con drones.',
        'Identificar variables observables en recorridos aéreos.',
        'Relacionar la captura de información con seguimiento y gestión.',
      ],
      metrics: [
        { label: 'Duración', value: '25 horas' },
        { label: 'Cupos', value: '100 personas' },
        { label: 'Puntos', value: '120' },
      ],
      temario: [
        {
          id: 'md-modulo-1',
          title: 'Fundamentos de monitoreo aéreo',
          summary: 'Bases de planeación y observación con drones.',
          topics: [
            { id: 'md-1', title: 'Tipos de información que puede capturarse en vuelo.' },
            { id: 'md-2', title: 'Planeación básica de recorridos y zonas de interés.' },
            { id: 'md-3', title: 'Buenas prácticas de registro y seguridad operacional.' },
          ],
        },
        {
          id: 'md-modulo-2',
          title: 'Lectura de resultados',
          summary: 'Interpretación de hallazgos para apoyo técnico.',
          topics: [
            { id: 'md-4', title: 'Coberturas, variaciones y seguimiento visual del cultivo.' },
            { id: 'md-5', title: 'Uso de reportes para monitoreo y toma de decisiones.' },
            { id: 'md-6', title: 'Articulación con procesos de innovación del proyecto.' },
          ],
        },
      ],
    },
    {
      id: 'intervencion-drones',
      slug: 'intervencion-drones',
      code: 'C6',
      levelId: 'intermedio',
      title: 'Intervención de cultivos con drones para fumigación y monitoreo',
      shortTitle: 'Intervención con Drones',
      category: 'Aplicación operativa',
      summary:
        'Presenta la lógica de intervención apoyada en drones para acciones técnicas de monitoreo y operación aplicada.',
      description:
        'La capacitación articula operación planificada, seguridad, variables de intervención y uso responsable de drones en escenarios productivos que requieren seguimiento y acciones técnicas.',
      audience: 'Participantes con interés en aplicaciones operativas de drones en cultivos.',
      requirements: [
        'Interés por operación técnica y seguridad en procesos con drones.',
        'Disponibilidad para cursar 25 horas de formación.',
      ],
      outcomes: [
        'Distinguir tipos de intervención apoyada en drones.',
        'Comprender criterios de seguridad y planificación.',
        'Relacionar operación con monitoreo y eficiencia técnica.',
      ],
      metrics: [
        { label: 'Duración', value: '25 horas' },
        { label: 'Cupos', value: '100 personas' },
        { label: 'Puntos', value: '120' },
      ],
      temario: [
        {
          id: 'id-modulo-1',
          title: 'Planeación de intervención',
          summary: 'Preparación y criterios operativos antes de ejecutar.',
          topics: [
            { id: 'id-1', title: 'Escenarios de intervención y objetivos técnicos.' },
            { id: 'id-2', title: 'Seguridad, condiciones del entorno y preparación.' },
            { id: 'id-3', title: 'Definición de rutas y variables operativas.' },
          ],
        },
        {
          id: 'id-modulo-2',
          title: 'Ejecución y seguimiento',
          summary: 'Registro de resultados y control de la operación.',
          topics: [
            { id: 'id-4', title: 'Buenas prácticas durante la intervención.' },
            { id: 'id-5', title: 'Seguimiento posterior y lectura de resultados.' },
            { id: 'id-6', title: 'Uso responsable y trazabilidad de la operación.' },
          ],
        },
      ],
    },
    {
      id: 'gestores-agroforestales',
      slug: 'gestores-agroforestales',
      code: 'C7',
      levelId: 'intermedio',
      title: 'Formación de gestores agroforestales en innovación y productividad',
      shortTitle: 'Gestores Agroforestales',
      category: 'Gestión e innovación',
      summary:
        'Fortalece capacidades para acompañar procesos de innovación, articulación comunitaria y productividad en contextos agroforestales.',
      description:
        'La formación promueve competencias de gestión, liderazgo y comprensión técnica del territorio para conectar innovación, productividad y apropiación comunitaria.',
      audience: 'Personas interesadas en liderazgo, gestión territorial e innovación agroforestal.',
      requirements: [
        'Interés en acompañamiento comunitario y gestión productiva.',
        'Disponibilidad para cursar 50 horas de formación.',
      ],
      outcomes: [
        'Comprender el rol del gestor agroforestal en la ruta.',
        'Fortalecer habilidades de articulación entre actores y territorio.',
        'Impulsar enfoques de innovación y productividad sostenible.',
      ],
      metrics: [
        { label: 'Duración', value: '50 horas' },
        { label: 'Cupos', value: '200 personas' },
        { label: 'Puntos', value: '120' },
      ],
      temario: [
        {
          id: 'ga-modulo-1',
          title: 'Rol del gestor agroforestal',
          summary: 'Liderazgo, articulación y lectura del territorio.',
          topics: [
            { id: 'ga-1', title: 'Funciones del gestor en procesos de innovación.' },
            { id: 'ga-2', title: 'Relación entre comunidad, productividad y sostenibilidad.' },
            { id: 'ga-3', title: 'Herramientas para acompañamiento territorial.' },
          ],
        },
        {
          id: 'ga-modulo-2',
          title: 'Innovación y productividad',
          summary: 'Capacidades para impulsar procesos sostenibles.',
          topics: [
            { id: 'ga-4', title: 'Enfoques de productividad con sentido territorial.' },
            { id: 'ga-5', title: 'Innovación aplicada a contextos agroforestales.' },
            { id: 'ga-6', title: 'Gestión de oportunidades y fortalecimiento local.' },
          ],
        },
      ],
    },
    {
      id: 'pilotaje-drones-experto',
      slug: 'pilotaje-drones-experto',
      code: 'C8',
      levelId: 'avanzado',
      title: 'Capacitación y certificación en pilotaje de drones',
      shortTitle: 'Pilotaje de Drones Experto',
      category: 'Certificación especializada',
      summary:
        'Etapa avanzada enfocada en pilotaje experto, criterios operativos y consolidación de habilidades para uso especializado de drones.',
      description:
        'La fase avanzada reúne a participantes que buscan consolidar su formación en pilotaje, profundizar en criterios de operación y avanzar hacia una capacitación certificada.',
      audience: 'Participantes interesados en especializarse en pilotaje de drones dentro de la ruta.',
      requirements: [
        'Interés en profundizar en operación y pilotaje especializado.',
        'Disponibilidad para participar en proceso de capacitación certificada.',
      ],
      outcomes: [
        'Consolidar capacidades de pilotaje en un nivel avanzado.',
        'Comprender criterios técnicos y operativos de una formación especializada.',
        'Avanzar hacia una certificación de élite dentro de la ruta.',
      ],
      metrics: [
        { label: 'Modalidad', value: 'Capacitación certificada' },
        { label: 'Cupos', value: '180 personas' },
        { label: 'Puntos', value: '160' },
      ],
      temario: [
        {
          id: 'pd-modulo-1',
          title: 'Pilotaje avanzado',
          summary: 'Fortalecimiento de criterios técnicos y control operativo.',
          topics: [
            { id: 'pd-1', title: 'Principios de operación en escenarios avanzados.' },
            { id: 'pd-2', title: 'Toma de decisiones y control en vuelo.' },
            { id: 'pd-3', title: 'Seguridad operacional y buenas prácticas especializadas.' },
          ],
        },
        {
          id: 'pd-modulo-2',
          title: 'Ruta hacia la certificación',
          summary: 'Consolidación de habilidades y enfoque de élite.',
          topics: [
            { id: 'pd-4', title: 'Criterios de desempeño y preparación técnica.' },
            { id: 'pd-5', title: 'Lectura integral del entorno y del equipo.' },
            { id: 'pd-6', title: 'Proyección del perfil especializado dentro del proyecto.' },
          ],
        },
      ],
    },
  ],
  importantNotesAccordionTitle: '⚠️ Ver Notas Importantes y SARLAFT',
  importantNotes: [
    'La Universidad se reserva el derecho de asignación previa verificación en listas restrictivas (SARLAFT).',
    'Nota 1: La inscripción no garantiza el cupo.',
    'Nota 2 (Regla de Asistencia): En caso de no asistir a tres (3) clases consecutivas sin justificación válida, el cupo será automáticamente liberado.',
  ],
};

export const getRutaLevelById = (levelId: RutaNivelId) =>
  rutaFormacionContent.levels.find((level) => level.id === levelId);

export const getRutaCourseById = (courseId: string) =>
  rutaFormacionContent.courses.find((course) => course.id === courseId);
