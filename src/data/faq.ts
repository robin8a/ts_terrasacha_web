export type FaqAnswerPart =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'note'; text: string };

export type FaqItem = {
  id: string;
  question: string;
  answer: FaqAnswerPart[];
};

export type FaqCategoryId =
  | 'propietarios'
  | 'tradicion-y-libertad'
  | 'carbono'
  | 'inversionistas'
  | 'tecnologia'
  | 'transversales';

export type FaqCategory = {
  id: FaqCategoryId;
  label: string;
  shortLabel: string;
  description: string;
  items: FaqItem[];
};

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    id: 'propietarios',
    label: "Propietarios",
    shortLabel: "Propietarios",
    description: "Para dueños de tierra, comunidades y quienes quieren vincular un predio al proyecto.",
    items: [
      {
        id: 'prop-desarrollo',
        question: "¿Cómo se desarrolla un proyecto forestal?",
        answer: [
          { type: 'p', text: "El desarrollo de un proyecto forestal implica una planificación cuidadosa, la selección del tipo de proyecto según el objetivo principal y la aplicación de prácticas técnicas y legales que aseguren su sostenibilidad." },
          { type: 'h', text: "Etapas del desarrollo" },
          { type: 'ul', items: [
            "Diagnóstico y planificación: se identifica el área, el estado del bosque y los objetivos (captura de carbono, madera o productos no maderables).",
            "Selección de especies: según el objetivo, se eligen especies nativas o introducidas.",
            "Implementación: siembra, manejo y monitoreo, o manejo sostenible del bosque natural.",
            "Seguimiento y evaluación: se monitorean resultados ambientales, sociales y económicos.",
            "Certificación y comercialización: en proyectos de carbono se certifican los créditos para su venta.",
          ] },
          { type: 'h', text: "Tipos de proyectos forestales" },
          { type: 'ul', items: [
            "Captura de carbono con reforestación nativa: restauración con especies nativas; créditos de carbono y servicios ecosistémicos.",
            "Aprovechamiento forestal comercial con especies introducidas: plantaciones de rápido crecimiento (pino, eucalipto); madera, pulpa y créditos de carbono.",
            "Productos forestales no maderables: caucho, resinas, frutos, fibras, plantas medicinales; también pueden capturar carbono.",
          ] },
          { type: 'p', text: "Cualquier tipo de proyecto puede generar créditos de carbono si cumple estándares reconocidos (REDD+, AR, IFM). En Arauca y Meta hay especies avaladas como eucalipto, pino, caucho, guadua y melina. Para formalizar el proyecto debe registrarse ante el ICA, evidenciando origen de la semilla y densidad de siembra." },
        ],
      },
      {
        id: 'prop-requisitos',
        question: "¿Cuáles son los requisitos para implantar un proyecto forestal?",
        answer: [
          { type: 'p', text: "Implantar un proyecto forestal implica cumplir requisitos técnicos, legales, ambientales y administrativos que aseguran viabilidad, sostenibilidad y legalidad." },
          { type: 'h', text: "Legales y de tenencia" },
          { type: 'ul', items: [
            "Demostrar propiedad o tenencia legal (certificado de tradición y libertad, escritura, arrendamiento u otro documento válido).",
            "Cumplir la normativa ambiental nacional y regional.",
            "Obtener permisos y autorizaciones según el tipo de proyecto.",
          ] },
          { type: 'h', text: "Planificación técnica" },
          { type: 'ul', items: [
            "Plan de manejo forestal.",
            "Estudio del terreno (suelo, topografía, clima, agua).",
            "Inventario forestal de la vegetación existente.",
          ] },
          { type: 'h', text: "Ambientales" },
          { type: 'ul', items: [
            "Evaluación de impactos y medidas de mitigación.",
            "Planes de monitoreo y seguimiento.",
          ] },
          { type: 'h', text: "Capacidad técnica y financiera" },
          { type: 'ul', items: [
            "Asistencia técnica de profesionales calificados.",
            "Capacidad financiera para inversión, mantenimiento y ciclo productivo.",
          ] },
          { type: 'h', text: "Otros requisitos específicos" },
          { type: 'ul', items: [
            "Aptitud forestal del área (Catastro Multipropósito y CPRA / UPRA).",
            "Restricciones en áreas protegidas del Ministerio de Ambiente.",
            "Consulta previa cuando involucra comunidades indígenas, afrodescendientes o campesinas.",
            "Para el CIF: plan de manejo aprobado y registro de plantación ante el ICA. El CIF lleva tiempo sin fondos; no se recomienda generar expectativas fáciles de acceso.",
            "En proyectos de carbono: adicionalidad (área sin bosque en los últimos 10 años), demostrable con imágenes satelitales o inventarios.",
          ] },
        ],
      },
      {
        id: 'prop-sin-capital',
        question: "¿Un dueño de tierra puede desarrollar un proyecto forestal sin tener el capital requerido?",
        answer: [
          { type: 'p', text: "Sí. Existen alternativas de financiamiento y apoyo para facilitar proyectos forestales sin capital propio." },
          { type: 'h', text: "Fondos de inversión y alianzas" },
          { type: 'ul', items: [
            "Fondos especializados aportan capital, tecnología y experiencia a cambio de participación en beneficios futuros.",
            "Gestores o desarrolladores pueden asociarse con propietarios para estructurar y operar el proyecto.",
          ] },
          { type: 'h', text: "Modelos en comunidades" },
          { type: 'p', text: "En comunidades indígenas con grandes extensiones para conservación, un gestor puede aportar el capital y recibir participación en ingresos, respetando autonomía, consulta previa y acuerdos transparentes." },
          { type: 'h', text: "Tipos de propietarios habilitados" },
          { type: 'ul', items: [
            "Persona natural.",
            "Persona jurídica (empresa, asociación, ONG).",
            "Comunidad étnica o campesina (resguardos, consejos comunitarios).",
          ] },
          { type: 'p', text: "Todos pueden acceder a esquemas de financiamiento si acreditan tenencia legal y cumplen la normativa." },
        ],
      },
      {
        id: 'prop-retorno',
        question: "¿Cómo se le garantiza al dueño de tierra el retorno de su inversión?",
        answer: [
          { type: 'p', text: "El retorno no puede garantizarse de manera absoluta: depende del crecimiento del bosque, precios de mercado, riesgos naturales y marco legal. Sí existen mecanismos para minimizar riesgos." },
          { type: 'h', text: "Riesgos y mitigación" },
          { type: 'ul', items: [
            "Riesgo biológico y ambiental (incendios, plagas, clima): semillas certificadas, viveros, planes de prevención y material genético adecuado.",
            "Incendios: cámaras térmicas, sensores, monitoreo satelital y alertas tempranas.",
            "Catástrofes: seguros forestales, planes de contingencia y monitoreo climático.",
          ] },
          { type: 'h', text: "Herramientas de seguridad" },
          { type: 'ul', items: [
            "Contratos claros con derechos, obligaciones y reparto de beneficios.",
            "Seguimiento remoto y monitoreo continuo.",
            "Tokenización y contratos inteligentes para transparencia y distribución automática de beneficios.",
          ] },
          { type: 'note', text: "A diferencia de una inversión bancaria, no hay retornos fijos garantizados. La seguridad se basa en experiencia del gestor, tecnología, contratos claros y diversificación de ingresos (madera, carbono, servicios ambientales)." },
        ],
      },
      {
        id: 'prop-tiempo-retorno',
        question: "¿Después de implementado el proyecto, en cuánto tiempo se obtiene retorno de inversión?",
        answer: [
          { type: 'p', text: "Considerando escenarios sin Certificado de Incentivo Forestal (CIF):" },
          { type: 'h', text: "Créditos de carbono" },
          { type: 'ul', items: [
            "Certificación inicial a partir del año 5.",
            "Quinquenios de certificación y venta: años 5, 10, 15 y 20.",
          ] },
          { type: 'h', text: "Productos forestales" },
          { type: 'ul', items: [
            "Madera: desde el año 6 (cortes en 6, 12, 17 y cosecha final en el 20).",
            "Resina (pino) y látex (caucho): desde el año 7.",
          ] },
        ],
      },
      {
        id: 'prop-ganancia',
        question: "¿Cuál es el potencial de ganancia a corto, mediano y largo plazo?",
        answer: [
          { type: 'p', text: "Para un proyecto típico de 400 hectáreas en Colombia, el potencial varía según horizonte, escala, incentivos y gestión." },
          { type: 'h', text: "Corto plazo (1 a 5 años)" },
          { type: 'ul', items: [
            "Generalmente limitado: se cubre inversión inicial y establecimiento.",
            "Con CIF podrían adelantarse retornos.",
            "Con certificación, primeros ingresos por carbono desde el año 5.",
          ] },
          { type: 'h', text: "Mediano plazo (6 a 10 años)" },
          { type: 'ul', items: [
            "Inicio de rentabilidad con primer corte de madera (año 6) y productos no maderables (año 7).",
            "Segundo quinquenio de carbono en el año 10.",
            "TIR promedio estimada entre 20% y 27%.",
          ] },
          { type: 'h', text: "Largo plazo (11 a 20 años o más)" },
          { type: 'ul', items: [
            "Cortes sucesivos y productos no maderables consolidados.",
            "Carbono en años 15 y 20.",
            "Ejemplo ilustrativo: una inversión de 100 millones podría generar un VPN cercano a 2.000 millones a lo largo del ciclo.",
          ] },
        ],
      },
      {
        id: 'prop-oportunidades',
        question: "¿Cuáles son las oportunidades y retos al desarrollar un proyecto forestal en los municipios focalizados?",
        answer: [
          { type: 'h', text: "Retos" },
          { type: 'ul', items: [
            "Alta inversión inicial.",
            "Nutrición y manejo de suelos.",
            "Capacitación técnica.",
            "Complejidad normativa y de gestión.",
            "Riesgos ambientales y de mercado.",
          ] },
          { type: 'h', text: "Oportunidades" },
          { type: 'ul', items: [
            "Proyectos a gran escala sin deforestar, con aptitud forestal disponible.",
            "Digitalización y monitoreo en tiempo real.",
            "Tokenización y democratización de la inversión.",
            "Acceso a mercados verdes y servicios ambientales.",
            "Empleo y desarrollo empresarial en municipios rurales.",
          ] },
        ],
      },
      {
        id: 'prop-casos-exito',
        question: "¿Hay casos de éxito y cuáles han sido los beneficios para las comunidades?",
        answer: [
          { type: 'p', text: "En la Orinoquía existen ejemplos como el núcleo forestal La Primavera, Inverbosques, Pisano y Refocosta, con 20 a 25 años de trayectoria en producción maderera sostenible." },
          { type: 'h', text: "Beneficios destacados" },
          { type: 'ul', items: [
            "Empleo local estable y capacitación técnica.",
            "Corredores biológicos e incremento de fauna.",
            "Regulación hídrica y menor erosión.",
            "Valorización de predios rurales.",
            "Apoyo a emprendimientos e infraestructura local.",
            "Ingresos fiscales y fortalecimiento de la economía municipal.",
          ] },
        ],
      },
      {
        id: 'prop-ecosistema',
        question: "¿Al ser un proyecto de reforestación, cómo se afecta el ecosistema?",
        answer: [
          { type: 'p', text: "El efecto depende de las especies, el manejo y la integración con el paisaje. El uso de especies introducidas (eucalipto, pino, teca) está permitido si se cumplen determinantes ambientales y de ordenamiento." },
          { type: 'h', text: "Efectos positivos potenciales" },
          { type: 'ul', items: [
            "Menos presión sobre bosques nativos.",
            "Recuperación de suelos degradados.",
            "Captura eficiente de carbono.",
          ] },
          { type: 'h', text: "Riesgos a gestionar" },
          { type: 'ul', items: [
            "Competencia con flora nativa y cambios hídricos si no hay planeación.",
            "Pérdida de diversidad en monocultivos extensos.",
            "Riesgo de especies invasoras.",
          ] },
          { type: 'p', text: "Buenas prácticas: corredores biológicos, áreas de vegetación nativa, mezcla de especies y evaluación periódica de biodiversidad, suelo y agua." },
        ],
      },
      {
        id: 'prop-agro',
        question: "¿Se puede desarrollar el proyecto junto con actividades ganaderas y agrícolas?",
        answer: [
          { type: 'p', text: "Sí. Es posible integrar forestación con ganadería y agricultura mediante sistemas agroforestales y silvopastoriles." },
          { type: 'h', text: "Beneficios" },
          { type: 'ul', items: [
            "Diversificación de ingresos (madera, carne, leche, cultivos, carbono).",
            "Mayor biodiversidad, fertilidad del suelo y resiliencia.",
            "Regulación hídrica y prevención de erosión.",
          ] },
          { type: 'h', text: "Claves de éxito" },
          { type: 'ul', items: [
            "Planificación técnica y selección adecuada de especies.",
            "Zonificación productiva (plantación, corredores, potreros, cultivos).",
            "Buenas prácticas: rotación de potreros y manejo del bosque secundario.",
          ] },
        ],
      },
      {
        id: 'prop-registro',
        question: "¿Dónde y cómo se registran los posibles proyectos?",
        answer: [
          { type: 'p', text: "En la plataforma Terrasacha el proceso inicia con una campaña creada por un consultor: una convocatoria de predios con nombre, descripción, imagen y fechas. Se genera un enlace para que comunidades o propietarios participen." },
          { type: 'p', text: "Los predios no entran automáticamente: hay evaluación legal y técnica. Luego el consultor puede convertir la campaña en proyecto." },
          { type: 'h', text: "Tres pasos principales" },
          { type: 'ol', items: [
            "Creación de la campaña.",
            "Convocatoria de predios.",
            "Análisis y conversión en proyecto.",
          ] },
          { type: 'p', text: "También puede registrarse un predio sin convocatoria activa: la plataforma funciona como banco de datos. Cuando haya una convocatoria regional, el consultor consulta primero ese banco." },
        ],
      },
    ],
  },
  {
    id: 'tradicion-y-libertad',
    label: "Tradición y libertad",
    shortLabel: "Tradición y libertad",
    description: "Preguntas sobre el certificado de tradición y libertad y los datos del predio.",
    items: [
      {
        id: 'tyl-ctl',
        question: "¿Qué es el certificado de tradición y libertad?",
        answer: [
          { type: 'p', text: "Documento oficial emitido por la Superintendencia de Notariado y Registro en Colombia. Este certificado es fundamental para conocer la situación jurídica de un bien inmueble, ya que proporciona información detallada sobre la propiedad y su historial." },
        ],
      },
      {
        id: 'tyl-pin',
        question: "¿A qué corresponde el Pin del certificado?",
        answer: [
          { type: 'p', text: "Corresponde al código único que identifica el certificado específico." },
        ],
      },
      {
        id: 'tyl-matricula',
        question: "¿Qué significa el número Matrícula Inmobiliaria?",
        answer: [
          { type: 'p', text: "Es un número único que identifica la propiedad en el registro público. Funciona como la cédula de identidad del predio y es esencial para cualquier trámite legal relacionado con la propiedad." },
        ],
      },
      {
        id: 'tyl-fecha-exp',
        question: "¿A qué corresponde la fecha de expedición del certificado?",
        answer: [
          { type: 'p', text: "A la fecha en que se emitió el certificado." },
        ],
      },
      {
        id: 'tyl-estado-folio',
        question: "¿A qué corresponde el estado del folio?",
        answer: [
          { type: 'p', text: "Indica si el folio está activo, cancelado o en algún otro estado específico." },
        ],
      },
      {
        id: 'tyl-catastral',
        question: "¿Para qué se utiliza el código catastral?",
        answer: [
          { type: 'p', text: "Este código se utiliza para identificar la propiedad en el catastro, que es un registro público de la propiedad inmobiliaria. Ayuda a localizar y gestionar la información sobre la propiedad en los sistemas catastrales." },
        ],
      },
      {
        id: 'tyl-complementacion',
        question: "¿A qué se refieren los datos de complementación?",
        answer: [
          { type: 'p', text: "Se refiere a la información adicional que resume aspectos importantes de la propiedad." },
        ],
      },
      {
        id: 'tyl-direccion',
        question: "¿Cómo se define la dirección del predio?",
        answer: [
          { type: 'p', text: "La ubicación física del predio, incluyendo la calle, número y cualquier otra información relevante que permita identificar su ubicación exacta." },
        ],
      },
      {
        id: 'tyl-tipo-predio',
        question: "¿En qué consiste el tipo de predio?",
        answer: [
          { type: 'p', text: "Consiste este tipo de predio a la clasificación del predio según su ubicación y características, el cual puede ser: Urbano, suburbano, rústico, hipotecario, dominante o sirviente." },
        ],
      },
      {
        id: 'tyl-departamento',
        question: "¿A qué corresponde el Departamento?",
        answer: [
          { type: 'p', text: "Corresponde al departamento donde se encuentra la propiedad." },
        ],
      },
      {
        id: 'tyl-municipio',
        question: "¿A qué corresponde el Municipio?",
        answer: [
          { type: 'p', text: "Es el municipio específico donde está ubicada la propiedad." },
        ],
      },
      {
        id: 'tyl-tipo-inmueble',
        question: "¿Qué significa Tipo de Inmueble?",
        answer: [
          { type: 'p', text: "Es la clasificación del tipo de propiedad, las cuales se clasifican en: Casa, apartamento, lote, finca, entre otros." },
        ],
      },
      {
        id: 'tyl-area-terreno',
        question: "¿Qué significa Área del Terreno?",
        answer: [
          { type: 'p', text: "Corresponde al tamaño del terreno en metros cuadrados." },
        ],
      },
      {
        id: 'tyl-area-construida',
        question: "¿Qué significa Área Construida?",
        answer: [
          { type: 'p', text: "Corresponde al tamaño de la construcción en metros cuadrados." },
        ],
      },
      {
        id: 'tyl-modo-adquisicion',
        question: "¿A qué se refiere el modo de adquisición propietario actual?",
        answer: [
          { type: 'p', text: "Se refiere a la descripción de la forma en que el propietario actual adquirió la propiedad." },
        ],
      },
      {
        id: 'tyl-nombre',
        question: "¿A qué significa Nombre Completo o Razón Social?",
        answer: [
          { type: 'p', text: "Se refiere al nombre completo de la última persona que adquirió la propiedad, puede ser persona natural o persona jurídica." },
        ],
      },
      {
        id: 'tyl-tipo-documento',
        question: "¿Cómo se define el Tipo de Documento?",
        answer: [
          { type: 'p', text: "Se define el tipo de documento como la identificación de la última persona que adquirió la propiedad, los tipos pueden ser Cédula de ciudadanía (CC), cédula de extranjería (CE), Pasaporte (P), o Número de identificación tributaria (NIT) en caso de ser persona jurídica." },
        ],
      },
      {
        id: 'tyl-numero-documento',
        question: "¿A qué corresponde el Número de Documento?",
        answer: [
          { type: 'p', text: "El número del documento de identificación corresponde al de la última persona que adquirió el bien." },
        ],
      },
      {
        id: 'tyl-fecha-inscripcion',
        question: "¿A qué corresponde la Fecha de Inscripción?",
        answer: [
          { type: 'p', text: "Corresponde a la fecha en que la propiedad fue inscrita en el registro." },
        ],
      },
      {
        id: 'tyl-historia',
        question: "¿A qué hace referencia el resumen de historia de propiedad?",
        answer: [
          { type: 'p', text: "Hace referencia al resumen de los eventos significativos en la historia de la propiedad, incluyendo fechas y detalles de eventos." },
        ],
      },
      {
        id: 'tyl-tipo-gravamen',
        question: "¿Qué significa Tipo de Gravamen?",
        answer: [
          { type: 'p', text: "El Gravamen es una carga o derecho real que se impone sobre un bien inmueble, limitando el uso o la disposición de la propiedad por parte del propietario. Generalmente de naturaleza financiera, los gravámenes pueden afectar la capacidad de vender o hipotecar la propiedad. Los gravámenes pueden ser embargos, hipotecas, censos, servidumbres." },
        ],
      },
      {
        id: 'tyl-desc-gravamen',
        question: "¿A qué corresponde la Descripción del Gravamen?",
        answer: [
          { type: 'p', text: "Corresponde a la descripción detallada del gravamen, si está disponible." },
        ],
      },
      {
        id: 'tyl-fecha-reg-gravamen',
        question: "¿Qué significa Fecha de registro del gravamen?",
        answer: [
          { type: 'p', text: "Se refiere a la fecha en que se registró el gravamen." },
        ],
      },
      {
        id: 'tyl-fecha-canc-gravamen',
        question: "¿A qué corresponde la Fecha de cancelación del gravamen?",
        answer: [
          { type: 'p', text: "Corresponde a la fecha en que se canceló el gravamen, si aplica." },
        ],
      },
      {
        id: 'tyl-entidad-gravamen',
        question: "¿A qué corresponde la entidad o persona del gravamen?",
        answer: [
          { type: 'p', text: "Corresponde al nombre de la persona natural o jurídica que cuenta con el gravamen." },
        ],
      },
    ],
  },
  {
    id: 'carbono',
    label: "Créditos de carbono",
    shortLabel: "Carbono",
    description: "Actores, conceptos e inversión en proyectos de créditos de carbono.",
    items: [
      {
        id: 'carb-actores',
        question: "¿Quiénes son los actores necesarios para implementar un proyecto de créditos de carbono?",
        answer: [
          { type: 'p', text: "Los actores necesarios son: el dueño del área, el inversionista, la comunidad (ejecutora o conservadora) y el gestor (quien organiza y formula el proyecto). La comunidad también puede participar en el monitoreo. El gestor puede ser el dueño del terreno, el inversionista o un tercero." },
          { type: 'note', text: "Fuente de referencia: Informe del Mercado Voluntario de Carbono en Colombia (GF Integrity)." },
        ],
      },
      {
        id: 'carb-diferencia',
        question: "¿Cuál es la diferencia entre un bono, un crédito y un certificado de carbono?",
        answer: [
          { type: 'ul', items: [
            "Crédito de carbono (unidad): representa 1 tonelada de CO₂ equivalente reducida o capturada; se usa para compensar emisiones.",
            "Bono de carbono (instrumento financiero): derecho a emitir 1 tonelada de CO₂; se usa para financiamiento, inversión y compensación.",
            "Certificado de carbono: documento que acredita la reducción o captura de CO₂ tras verificación externa; da respaldo legal.",
          ] },
        ],
      },
      {
        id: 'carb-inversion',
        question: "¿Cuál es la inversión necesaria en dinero y hectáreas para un proyecto rentable?",
        answer: [
          { type: 'h', text: "Proyectos forestales comerciales" },
          { type: 'ul', items: [
            "Escala mínima recomendada: ~400 hectáreas.",
            "Inversión: entre 8 y 10 millones de pesos colombianos por hectárea.",
            "Justificación: punto de equilibrio para maquinaria e infraestructura.",
          ] },
          { type: 'h', text: "Proyectos forestales para carbono" },
          { type: 'ul', items: [
            "Escala mínima recomendada: ~1.000 hectáreas.",
            "Inversión por hectárea similar (8 a 10 millones).",
            "Justificación: volumen de créditos y costos de certificación, monitoreo y transacción.",
          ] },
        ],
      },
    ],
  },
  {
    id: 'inversionistas',
    label: "Inversionistas",
    shortLabel: "Inversionistas",
    description: "Retornos, riesgos, política pública y mercado para quienes invierten.",
    items: [
      {
        id: 'inv-sin-capital',
        question: "¿Un dueño de tierra puede desarrollar un proyecto forestal sin tener el capital en dinero requerido?",
        answer: [
          { type: 'p', text: "Sí. Puede asociarse con fondos de inversión o gestores que aporten capital, tecnología y experiencia a cambio de participación en beneficios. También aplican modelos comunitarios con gestores desarrolladores, siempre con tenencia legal acreditada y cumplimiento normativo." },
        ],
      },
      {
        id: 'inv-garantia',
        question: "¿Cómo se le garantiza al inversionista y al dueño de tierra el retorno de su inversión?",
        answer: [
          { type: 'p', text: "No hay garantía absoluta. Se mitigan riesgos con protocolos técnicos, monitoreo, seguros, contratos claros, seguimiento remoto y, cuando aplica, tokenización con contratos inteligentes." },
          { type: 'p', text: "La seguridad se apoya en la trayectoria del gestor, la tecnología, la transparencia contractual y la diversificación de ingresos (madera, carbono, servicios ambientales)." },
        ],
      },
      {
        id: 'inv-tiempo',
        question: "¿Después de implementado el proyecto, en cuánto tiempo se cuenta con el retorno de inversión y en cuánto tiempo se inicia la rentabilidad?",
        answer: [
          { type: 'ul', items: [
            "Carbono: certificación y venta desde el año 5, en ciclos de 5 años.",
            "Madera: desde el año 6 (cortes en 6, 12, 17 y 20).",
            "Resina y látex: desde el año 7.",
          ] },
        ],
      },
      {
        id: 'inv-ganancia',
        question: "¿Cuál es el potencial de ganancia a corto, mediano y largo plazo?",
        answer: [
          { type: 'p', text: "En un proyecto típico de 400 ha: corto plazo limitado (salvo incentivos); mediano plazo con madera, no maderables y carbono (TIR estimada 20–27%); largo plazo con cortes sucesivos y VPN acumulado significativo. Factores clave: diversificación, incentivos, gestión tecnológica y precios de mercado." },
        ],
      },
      {
        id: 'inv-politica',
        question: "¿Cómo la política pública puede afectar negativamente el desarrollo del negocio?",
        answer: [
          { type: 'ul', items: [
            "Restricciones a la deducción del impuesto al carbono reducen demanda y precio de créditos.",
            "Cambios en incentivos fiscales afectan rentabilidad.",
            "Inseguridad jurídica y burocracia desincentivan inversión.",
            "Acuerdos internacionales y decisiones geopolíticas generan volatilidad de mercado.",
          ] },
        ],
      },
      {
        id: 'inv-internacional',
        question: "¿Qué papel juega el contexto internacional en el desarrollo del proyecto sugerido por Terrasacha?",
        answer: [
          { type: 'p', text: "Es determinante para viabilidad, acceso a mercados y rentabilidad: Acuerdos de París/Kioto, financiamiento internacional (Banco Mundial, FAO, REDD+), mercados globales de créditos, y riesgos por cambios regulatorios internacionales. La presión climática global y la digitalización refuerzan oportunidades para proyectos como los de Terrasacha." },
        ],
      },
      {
        id: 'inv-clientes',
        question: "¿Quiénes son los clientes interesados en comprar créditos de carbono?",
        answer: [
          { type: 'ul', items: [
            "Empresas privadas multinacionales y nacionales (energía, transporte, manufactura, alimentos, etc.) y PYMEs.",
            "Gobiernos, sector público y empresas estatales (p. ej. Ecopetrol).",
            "Personas y consumidores individuales.",
            "Intermediarios, marketplaces y brokers (Moss, WayCarbon, ClimateTrade, SouthPole, entre otros).",
            "ONGs y universidades.",
          ] },
        ],
      },
      {
        id: 'inv-ahora',
        question: "¿Si en este momento aparece un dueño de tierra y un inversionista interesados, se pueden desarrollar a través de las tecnologías propuestas por el proyecto?",
        answer: [
          { type: 'p', text: "Sí, cuando se cumplan los mínimos en hectáreas necesarios para iniciar un proyecto." },
        ],
      },
    ],
  },
  {
    id: 'tecnologia',
    label: "Blockchain y tecnología",
    shortLabel: "Tecnología",
    description: "Plataforma, Oráculo, blockchain, tokenización y participación comunitaria.",
    items: [
      {
        id: 'tech-plataforma',
        question: "¿Qué actividades desarrolla el equipo de plataforma?",
        answer: [
          { type: 'p', text: "El equipo de plataforma desarrolla la solución tecnológica: frontend, blockchain, ciencia de datos e inteligencia artificial. Su rol es comprender el negocio, captar requerimientos y traducirlos en aplicaciones." },
          { type: 'p', text: "También gestiona la información de monitoreos, análisis, divulgación, ciclo de vida de proyectos, estrategia de comercialización y digitalización de activos. Todo ello se engloba bajo el término «Plataforma»." },
        ],
      },
      {
        id: 'tech-implementacion',
        question: "¿Cómo se implementa tecnológicamente el proyecto forestal propuesto por Terrasacha?",
        answer: [
          { type: 'p', text: "La plataforma gestiona el ciclo de vida de proyectos de activos forestales: convocatoria de predios, prefactibilidad, factibilidad, y análisis técnicos, financieros y legales." },
          { type: 'p', text: "Distingue predios (área con uno o varios propietarios) de proyectos (agrupación de predios). Los consultores impulsan fases, visitas de campo y estimaciones de carbono; el equipo legal valida elegibilidad documental antes de la evaluación técnico-financiera." },
        ],
      },
      {
        id: 'tech-oraculo',
        question: "¿Qué es el Oráculo y cómo funciona?",
        answer: [
          { type: 'p', text: "Oráculo analiza imágenes satelitales para comparar cobertura vegetal en el tiempo. Se consulta por identificador catastral, polígono o mapa; compara fechas (p. ej. 2016 vs 2021) con machine learning." },
          { type: 'p', text: "Se está integrando a la plataforma principal para cruzar análisis con proyectos, y ampliará el uso de datos de campo además del banco genérico de imágenes." },
        ],
      },
      {
        id: 'tech-blockchain',
        question: "¿Cómo utilizan la tecnología Blockchain en el proyecto?",
        answer: [
          { type: 'p', text: "Se aprovechan descentralización, inmutabilidad y transferencia de valor mediante tokenización y contratos inteligentes. Permite microeconomías entre participantes (envíos, rastreo, incentivos, compras, ventas y compensaciones) sin intermediario centralizado." },
          { type: 'p', text: "También digitaliza activos tangibles e intangibles (como créditos de carbono), facilitando nuevos mercados y trazabilidad de operaciones." },
        ],
      },
      {
        id: 'tech-tokens',
        question: "¿Cómo se maneja la tokenización dentro del proyecto?",
        answer: [
          { type: 'h', text: "Token gris" },
          { type: 'p', text: "Representa una promesa futura de crédito de carbono. Permite inversión temprana (como «obra gris») a precios preferenciales tras la prefactibilidad. Puede canjearse o monetizarse cuando el proyecto se certifique." },
          { type: 'h', text: "Token verde" },
          { type: 'p', text: "Se crea tras la certificación y se sincroniza con el certificado tradicional de créditos de carbono. Se distribuye a quienes tenían tokens grises y habilita comercialización, compensaciones y transferencias." },
        ],
      },
      {
        id: 'tech-avance',
        question: "¿En qué estado de avance se encuentra la tecnología que se está desarrollando?",
        answer: [
          { type: 'p', text: "El módulo de gestión de proyectos está listo para pruebas externas: campañas, convocatoria, prefactibilidad y estimación de toneladas de CO₂." },
          { type: 'p', text: "En desarrollo activo: creación y comercialización de tokens (redefinición de reglas por participación multi-usuario). Oráculo está funcional de forma independiente; falta completar su integración plena con proyectos de la plataforma." },
        ],
      },
      {
        id: 'tech-comunidad',
        question: "¿Qué desarrollos tecnológicos intervienen con la comunidad y cómo participa?",
        answer: [
          { type: 'p', text: "La comunidad puede recibir tokens (futuros créditos) por acciones en campo, no solo por aportar área. Tecnológicamente se contempla aporte de datos (drones, monitoreo local) incentivado con tokens." },
          { type: 'p', text: "Pendiente: gobernanza de esos tokens (custodia y reglas de distribución). Hoy no hay un rol «comunidad» independiente en la plataforma, pero un miembro puede interactuar como inversionista receptor de incentivos." },
        ],
      },
    ],
  },
  {
    id: 'transversales',
    label: "Transversales",
    shortLabel: "General",
    description: "Preguntas de interés para todos los públicos.",
    items: [
      {
        id: 'tx-pci',
        question: "¿Qué actividades realiza el equipo de PCI?",
        answer: [
          { type: 'p', text: "El equipo PCI va desde la verificación de elegibilidad de predios hasta la formulación de rentabilidad, análisis de carbono, cuantificación de productos y viabilidad técnica, además del modelo financiero." },
          { type: 'p', text: "Ese modelo contempla inversión inicial en el año 0, captura de carbono al año 5, venta de madera desde el año 6, y productos como resina y látex desde el año 7, con ciclos hasta la cosecha final en el año 20." },
        ],
      },
    ],
  },
];

export const FAQ_ALL_ITEMS = FAQ_CATEGORIES.flatMap((category) =>
  category.items.map((item) => ({ ...item, categoryId: category.id, categoryLabel: category.label })),
);
