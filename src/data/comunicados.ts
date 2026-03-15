export interface Comunicado {
  id: number;
  number: number;
  eyebrow: string;
  title: string;
  excerpt: string;
  image: string;
  body: string[];
  highlights?: string[];
  contactEmail: string;
  contactWeb: string;
}

export const comunicados: Comunicado[] = [
  {
    id: 1,
    number: 1,
    eyebrow: 'CON EL RESPALDO DE MINCIENCIAS Y EL SISTEMA GENERAL DE REGALÍAS',
    title:
      'Nace en los Llanos un proyecto innovador para el ambiente y el desarrollo sostenible de Colombia',
    excerpt:
      'La Universidad Cooperativa de Colombia lidera Terrasacha en alianza con la Corporación Innprende y las gobernaciones del Meta y Arauca para fortalecer la protección de bosques y el desarrollo sostenible.',
    image: '/comunicaciones/Comunicado 1/foto versión 2 Agenda.jpg',
    body: [
      'La Universidad Cooperativa de Colombia (UCC) lidera esta iniciativa en alianza con la Corporación Innprende y las gobernaciones del Meta y Arauca.',
      '(UCC). La iniciativa, llamada Terrasacha, se implementa en los departamentos de Meta y Arauca, con el propósito de fortalecer los modelos de protección de bosques naturales y comerciales, para luego replicarlos en otras regiones del país.',
      'El ingeniero físico, Víctor Hugo Aristizábal, investigador principal del proyecto, explicó: “Desarrollaremos un modelo integral con el apoyo de tecnología emergentes tales como Inteligencia Artificial (IA), Internet de las Cosas (IoT), satélites, drones y blockchain para la conservación de activos ambientales estratégicos, como los bosques naturales, los bosques comerciales, los cuerpos de agua, humedales y la biodiversidad en general.”',
      'Adicionalmente, el investigador principal, Víctor Hugo Aristizábal, destacó: “Implementaremos un piloto para la comercialización de estos activos ambientales, los cuales - al capturar dióxido de carbono (CO2) de la atmósfera, uno de los gases causantes del cambio climático - tienen el potencial para que generemos bonos de carbono tokenizados ‘de gran calidad’ que podrían ser comercializados en los mercados internacionales.”',
      'Por su parte, el ingeniero industrial, Johnny Fernando López, director del proyecto, señaló que Terrasacha es un proyecto pionero, cuyo nombre evoca la unión entre la ciencia, la tecnología y la innovación con el espíritu ancestral de la Pachamama, reflejando así una conciencia profunda del entorno natural.',
      'El proyecto piloto, programado para concluir en octubre de 2026, busca identificar las condiciones técnicas óptimas para la gestión de los bosques naturales y comerciales. Con ello, se espera convertir la conservación y la reforestación en una oportunidad rentable, que atraiga inversión nacional e internacional para generar empleo y promover el crecimiento económico.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 2,
    number: 2,
    eyebrow: 'INNOVACIÓN SOSTENIBLE PARA EL MERCADO DE CARBONO',
    title: 'Colombia apuesta por innovar en comercialización de bonos de carbono',
    excerpt:
      'Terrasacha busca sentar las bases para la gestión, tokenización y comercialización de bonos de carbono, fortaleciendo el liderazgo de Colombia en mercados emergentes sostenibles.',
    image: '/comunicaciones/Comunicado 2/Foto 4.jpeg',
    highlights: [
      'Un sandbox permitirá explorar la tokenización de activos ambientales.',
      'El proyecto busca posicionar al país como líder regional en mercados emergentes.',
    ],
    body: [
      '(UCC). En los departamentos del Meta y Arauca, Colombia implementa un piloto que podría sentar las bases para la gestión de bonos de carbono, generados a partir de la conservación de bosques naturales y el establecimiento de bosques comerciales, mediante un entorno experimental orientado a su tokenización y eventual comercialización nacional e internacional.',
      'Se trata del proyecto piloto Terrasacha - liderado por Minciencias, el Sistema General de Regalías, la Universidad Cooperativa de Colombia (UCC), la Corporación Innprende, y los gobiernos regionales de estos dos departamentos -, el cual busca establecer un modelo de comercialización de activos ambientales.',
      'De acuerdo con el investigador principal de Terrasacha, el ingeniero físico de la UCC, Víctor Hugo Aristizábal: “El modelo de monetización en Terrasacha comienza desde el establecimiento de activos ambientales, como bosques comerciales y áreas de conservación. La posible presencia de inversionistas permitirá sentar las bases para el desarrollo de este tipo de proyectos y asegurar el capital necesario para el crecimiento a mediano y largo plazo.”',
      'Uno de los pilares del proyecto es el fortalecimiento de capacidades de las comunidades del Meta y Arauca mediante talleres especializados en tecnología, con capacitaciones específicas en el uso de drones, inteligencia artificial y tecnologías de compensación ambiental, lo que permite a los habitantes locales ser agentes activos en la protección de su entorno. Esta inclusión asegura que la comunidad aprenda sobre conservación, sobre el valor económico de su tierra en términos de sostenibilidad y sobre beneficios futuros.',
      'Frente al componente tecnológico del modelo de comercialización, el investigador Aristizábal explicó: “Queremos construir un entorno experimental o sandbox donde estos bonos de carbono puedan tokenizarse y gestionarse de manera controlada, con miras a una futura comercialización nacional e internacional. Aspiramos a que este piloto le permita a Colombia establecer una base sólida para potenciales regulaciones de este mercado emergente y, así, convertirse en un referente en la región”.',
      'Un sandbox es un entorno experimental seguro diseñado para probar tecnologías emergentes, modelos de negocio o productos en un contexto controlado, antes de su implementación a gran escala. Por otro lado, la tokenización es el proceso de transformar un activo físico o intangible, como una tonelada de carbono capturada por un bosque, en un token digital basado en tecnología blockchain.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 3,
    number: 3,
    eyebrow: 'EL PROYECTO SE ENCUENTRA EN LA FASE PILOTO',
    title: 'Meta y Arauca abren camino a un modelo sostenible de bonos de carbono',
    excerpt:
      'Terrasacha busca instalar conocimiento en Meta y Arauca para fortalecer la protección de activos ambientales y garantizar la sostenibilidad del proyecto a largo plazo.',
    image: '/comunicaciones/Comunicado 3/ChatGPT Image 28 oct 2025, 11_07_12 a.m..png',
    body: [
      'Uno de los objetivos de Terrasacha es instalar conocimiento en Meta y Arauca para garantizar la sostenibilidad del proyecto.',
      '(UCC). Terrasacha tiene como objetivo desarrollar modelos de protección para bosques naturales y otros activos ambientales, aprovechando la diversidad de la región para mitigar efectos del cambio climático y promover prácticas sostenibles en Meta y Arauca.',
      'Así lo sostiene el investigador principal del proyecto, Víctor Hugo Aristizábal: “Desarrollar modelos de protección de activos ambientales estratégicos para Meta y Arauca es nuestra meta principal. En este proyecto trabajaremos con bosques naturales y comerciales, cuerpos de agua, humedales y biodiversidad, para crear un entorno seguro donde evaluaremos y monitorearemos cada escenario posible desde el punto de vista técnico”.',
      'Para garantizar la sostenibilidad, Terrasacha despliega actividades de monitoreo ambiental y de transferencia de conocimientos a las comunidades locales que incluyen el manejo de drones y herramientas de inteligencia artificial para la medición y protección de estos activos ambientales.',
      '“Nuestro objetivo es instalar un conocimiento duradero en la región que les permita a las comunidades gestionar y conservar sus recursos naturales de manera autónoma”, añadió el investigador.',
      'A pesar de que Terrasacha se encuentra en una fase piloto, el proyecto ya anticipa la posibilidad de comercializar bonos de carbono más adelante en una nueva etapa. Para alcanzar este objetivo, se está desarrollando un entorno experimental, conocido como "sandbox", que permitirá simular diferentes escenarios y establecer bases regulatorias en colaboración con el Gobierno Nacional.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 4,
    number: 4,
    eyebrow: 'EL PROYECTO AVANZA CON LA CONSOLIDACIÓN DE ACTIVOS CLIMÁTICOS',
    title: 'Terrasacha establece las bases para un mercado de bonos de carbono',
    excerpt:
      'El proyecto avanza con un plan estratégico orientado a consolidar activos climáticos de calidad, atraer inversión y conectar créditos de carbono con mercados globales.',
    image: '/comunicaciones/Comunicado 4/Foto 1.jpeg',
    body: [
      'Incluye un plan estratégico que garantice calidad y confianza en el ámbito global.',
      '(UCC). Terrasacha contempla tres fases principales que tienen como objetivo el que Colombia incursione de forma contundente al mercado de bonos de carbono, atrayendo inversiones para la sostenibilidad de los proyectos de reforestación y conservación.',
      '“Lo primero es que el proyecto Terrasacha empieza a resolver el primer problema: tener activos climáticos de alta calidad”, asegura el director técnico del proyecto y experto en descarbonización, Jhonny Fernando López. En la consolidación de estos activos forestales (bosques) se emplean tecnologías emergentes.',
      'En la fase dos del proyecto, se propone atraer inversión a través de créditos de carbono tokenizados. Esto significa que el proyecto buscará generar fondos al ofrecer créditos de carbono en una forma digital y fraccionada, utilizando tecnología de tokenización.',
      'En la fase tres, se propone conectar los créditos de carbono generados con mercados internacionales de compensación de emisiones. Esta fase es crucial porque permite que los créditos de carbono sean reconocidos y comercializados a nivel global, lo que ampliará su alcance y efectividad en la lucha contra el cambio climático.',
      '“Terrasacha establece un plan estratégico para alcanzar sus objetivos y se enfoca en la primera etapa, al tiempo que proporciona las directrices necesarias para crear un mercado de carbono abierto que garantice calidad y confianza en el ámbito global”, concluyó López.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 5,
    number: 5,
    eyebrow: 'SE EMPLEAN METODOLOGÍAS DE VERIFICACIÓN AVANZADAS',
    title: 'Hacia un mercado de créditos de carbono verificados y de calidad',
    excerpt:
      'Terrasacha impulsa metodologías de verificación avanzadas para crear créditos de carbono de alta calidad y fortalecer la proyección internacional de Colombia en sostenibilidad.',
    image: '/comunicaciones/Comunicado 5/ChatGPT Image 9 mar 2026, 09_50_34 a.m..png',
    body: [
      'Terrasacha establece un precedente en la creación de bonos de alta calidad, reforzando la posición de Colombia en el ámbito de la sostenibilidad y la conservación ambiental.',
      '(UCC). En la búsqueda de una gestión ambiental sostenible y confiable, el proyecto Terrasacha, en los departamentos de Meta y Arauca, le apuesta a la generación de créditos de carbono verificados que cumplan con altos estándares de calidad.',
      '“Los créditos de carbono verificados indican que puedes demostrar de manera completa que has realizado una reducción o captura de carbono. Esto se logra a través de diferentes estándares, y es necesario que un tercero verifique la información para asegurar que cumples con dichos estándares”, explica Jhonny Fernando López, director técnico y experto en mercados de carbono de Terrasacha.',
      'Terrasacha está desarrollando metodologías de verificación avanzadas que incluyen el uso de drones y satélites para la medición y monitoreo de la captura de carbono. Estas innovaciones permiten reducir los tiempos y mejorar la precisión en la verificación de activos climáticos, facilitando que estos créditos puedan ser rápidamente aceptados y comercializados en mercados voluntarios globales.',
      '“Queremos estar a la altura de los mercados que están desarrollando este tipo de esquemas como son China y como es Europa […]. Queremos que Colombia sea un foco de investigación en ese ámbito”, manifiesta López.',
      'De esta forma, con el respaldo de sistemas de verificación sólidos, Terrasacha establece un precedente en la creación de bonos de carbono de alta calidad, reforzando la posición de Colombia en el ámbito de la sostenibilidad y la conservación ambiental.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 6,
    number: 6,
    eyebrow: 'ESTO MARCA UN ANTES Y UN DESPUÉS EN MATERIA DE REFORESTACIÓN',
    title:
      'Terrasacha conecta activos forestales con datos reales para transformar la gestión climática',
    excerpt:
      'El proyecto establece una plataforma de inversión basada en trazabilidad, tokenización y activos climáticos de calidad para atraer actores nacionales e internacionales.',
    image: '/comunicaciones/Comunicado 6/ChatGPT Image 9 mar 2026, 09_51_40 a.m..png',
    body: [
      'Este enfoque reduce los riesgos asociados a la inversión ambiental y abre las puertas a fondos de inversión, bancos y entidades financieras internacionales.',
      '(UCC). En un contexto donde el financiamiento ambiental es crucial, el proyecto Terrasacha, que se desarrolla en Meta y Arauca, establece una plataforma de inversión para actores nacionales e internacionales, interesados en la sostenibilidad.',
      'Con un enfoque en la tokenización y la digitalización de activos climáticos, el proyecto permite una trazabilidad sin precedentes en los créditos de carbono.',
      'Así lo explica Jhonny Fernando López, director técnico de Terrasacha: “En nuestra segunda fase tenemos nuestros proyectos climáticos […]. Ese ejercicio de conectar un activo financiero con información real del proyecto, en algo tangible, puede marcar un antes y un después de cómo se gestionan los activos forestales.”',
      'Esta iniciativa piloto combina activos de carbono de alta calidad con tecnologías avanzadas, como blockchain y tokenización, que permitirán a los eventuales inversionistas gestionar sus activos con precisión y seguridad.',
      'Este enfoque reduce los riesgos asociados a la inversión ambiental y abre las puertas a fondos de inversión, bancos y entidades financieras internacionales que buscan proyectos de alto impacto en descarbonización, como lo señala López:',
      '“El sueño de nosotros es poder entrar muy fuerte en la ejecución de lo que se denomina el artículo 6 del Acuerdo de París […]. Y gracias al mecanismo del artículo 6, vamos a poder tener precios o negociaciones mucho más grandes.”',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 7,
    number: 7,
    eyebrow: 'CON EL RESPALDO DE MINCIENCIAS Y EL SISTEMA GENERAL DE REGALÍAS',
    title: 'Sostenibilidad ambiental, un pilar fundamental en Terrasacha',
    excerpt:
      'La primera fase del proyecto se enfoca en validar la idoneidad de los terrenos y fortalecer el análisis ambiental con apoyo de drones e inteligencia artificial.',
    image: '/comunicaciones/Comunicado 7/ChatGPT Image 9 mar 2026, 10_00_00 a.m..png',
    body: [
      'La primera fase del proyecto está enfocada en la validación de criterios de idoneidad de los terrenos como la verificación de la titularidad de los predios.',
      '(UCC). “Este proyecto es un paso esencial en el camino hacia un modelo sostenible de gestión de nuestros recursos naturales. Al implementar un enfoque de análisis preciso y sustentable, buscamos crear una sinergia entre la conservación y el desarrollo económico regional”.',
      'Así lo aseguró el coordinador técnico y responsable del equipo de campo forestal de Terrasacha, Carlos Soto, al destacar que esta iniciativa piloto integra tecnología avanzada, desde el uso de drones hasta plataformas de Inteligencia Artificial (IA) para medir la biomasa y proyectar la acumulación de carbono con precisión en grandes áreas de terreno, optimizando tanto recursos físicos como tiempo.',
      '“Estas herramientas nos ayudan a obtener datos más precisos y en tiempo real, fundamentales para un análisis detallado de cómo varía la captura de carbono entre las diferentes áreas y especies, en función de factores como la biodiversidad y el tipo de suelo”, explicó Soto.',
      'De esta manera, el proyecto evalúa métricas de captura de carbono por hectárea, tanto en bosques naturales como comerciales, que servirán de referencia para proyecciones financieras y futuras iniciativas de comercialización.',
      'Según Soto, la primera fase del proyecto está enfocada en la validación de criterios de idoneidad de los terrenos como verificación de la titularidad de los predios, la evaluación de la densidad de la copa de los árboles y el análisis del tipo de vegetación y su capacidad de acumulación de carbono.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 8,
    number: 8,
    eyebrow: 'CUIDADO Y MANEJO DE LOS BOSQUES DE MANERA SOSTENIBLE',
    title: 'La gestión forestal de Terrasacha mitiga los efectos del cambio climático',
    excerpt:
      'Terrasacha promueve un modelo de gestión forestal sostenible y capacita a comunidades de Meta y Arauca en tecnologías 4.0 para el monitoreo y manejo ambiental.',
    image: '/comunicaciones/Comunicado 8/ChatGPT Image 9 mar 2026, 10_00_24 a.m..png',
    body: [
      'Adicionalmente se capacita a las comunidades de Meta y Arauca en tecnologías 4.0.',
      '(UCC). “Estamos comprometidos en sentar las bases de un modelo de gestión forestal que no solo ayude a mitigar el cambio climático, sino que, también, contribuya al desarrollo económico de la región de manera responsable”.',
      'La afirmación es del coordinador técnico del equipo de campo forestal de Terrasacha, Carlos Soto. Agrega que las prácticas forestales del proyecto cumplen con las normas de manejo forestal y adicionalidad en términos de captura de carbono.',
      '“Al asegurar el cumplimiento de la normatividad nacional y trabajar en zonas de alta aptitud forestal, garantizamos la viabilidad de estas prácticas en el largo plazo. Nuestra prioridad es conservar los ecosistemas mientras generamos un impacto positivo en las comunidades”, señaló Soto.',
      'Otro de los pilares es el de la capacitación de actores locales a través de talleres, capacitaciones y certificaciones en tecnologías 4.0, como el monitoreo forestal y el uso de drones.',
      'La meta es que, en una futura etapa de comercialización, estos actores estén preparados para asumir roles clave en el monitoreo y la gestión de las áreas forestales, logrando así la independencia y sostenibilidad del proyecto.',
      'Al final de esta etapa, el proyecto habrá establecido un modelo escalable que no solo ayude a combatir el cambio climático, sino que también ofrezca oportunidades de empleo y desarrollo económico para las comunidades de Arauca y Meta.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 11,
    number: 11,
    eyebrow: 'LOS BOSQUES NATURALES SON EL NÚCLEO DEL PROYECTO TERRASACHA',
    title: 'Meta y Arauca aspiran a liderar la generación de bonos de carbono',
    excerpt:
      'Los bosques de galería y otros ecosistemas de Meta y Arauca se proyectan como activos estratégicos para la conservación, la captura de carbono y el desarrollo sostenible.',
    image: '/comunicaciones/Comunicado 11/ChatGPT Image 9 mar 2026, 10_44_31 a.m..png',
    body: [
      'Los bosques de galería, ecosistemas forestales que se desarrollan a lo largo de los cursos de agua, son un gran activo ambiental de estas dos regiones.',
      '(UCC). La riqueza en biodiversidad y condiciones naturales de estas dos regiones de Colombia las convierten en áreas clave para la conservación y reforestación, al igual que para constituirse en la región líder del país en la generación de bonos de carbono.',
      'De acuerdo con el ingeniero forestal y especialista en cambio climático de Terrasacha, William Laguado: “Meta y Arauca cuentan con una alta capacidad para el desarrollo de esquemas sostenibles de producción y la generación de bonos de carbono. Los bosques de galería y ecosistemas tropicales en la región tienen una estructura ecológica ideal para capturar carbono y mitigar el impacto del cambio climático”.',
      'Según el especialista, estos ecosistemas se encuentran entre los más valiosos para combatir el cambio climático debido a su estructura densa que facilita la captura de carbono, lo que los convierte en un activo estratégico para Colombia y el mundo.',
      'Para Terrasacha, estos ecosistemas son el núcleo de su modelo piloto de bonos de carbono, gracias a su potencial para atraer inversionistas interesados en proyectos de impacto ambiental.',
      'Finalmente, Laguado manifestó que este enfoque de conservación representa una oportunidad única para el desarrollo sostenible en el país.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 12,
    number: 12,
    eyebrow: 'CON EL RESPALDO DE MINCIENCIAS Y EL SISTEMA GENERAL DE REGALÍAS',
    title: 'Acciones sostenibles en bosques naturales impulsan la captura de carbono',
    excerpt:
      'Terrasacha impulsa prácticas de conservación y monitoreo avanzado para maximizar la captura de carbono en bosques naturales sin comprometer su permanencia.',
    image: '/comunicaciones/Comunicado 12/ChatGPT Image 9 mar 2026, 10_49_09 a.m..png',
    body: [
      'El compromiso de Terrasacha es mantener en pie los bosques naturales.',
      '(UCC). Terrasacha busca maximizar la captura de carbono en los ecosistemas naturales, mediante prácticas de conservación que no comprometan la estructura de los bosques y que se centren en su sostenibilidad a largo plazo.',
      'Así lo explica el ingeniero forestal, William Laguado: “Implementar acciones sostenibles en los bosques naturales permite que estos ecosistemas continúen capturando y almacenando carbono de manera efectiva”.',
      'De acuerdo con Laguado, a diferencia de las plantaciones forestales, los bosques naturales presentan desafíos únicos para el monitoreo y la verificación de bonos de carbono, dado que estos ecosistemas son vastos y a menudo se encuentran en áreas remotas, lo que dificulta el acceso y el monitoreo regular.',
      'Para sobreponerse a esas circunstancias, Terrasacha utiliza tecnología avanzada, como drones y satélites para una mayor precisión en la medición y monitoreo de la captura de carbono en estas áreas.',
      '“El monitoreo de los bosques naturales implica retos específicos en comparación con las plantaciones, ya que necesitamos garantizar una medición precisa y continua de la captura de carbono”, subraya Laguado.',
      'Uno de los grandes compromisos de Terrasacha es mantener los bosques naturales en pie sin considerar la tala como una estrategia económica.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 13,
    number: 13,
    eyebrow: 'PROYECTO PILOTO DE REFORESTACIÓN Y CONSERVACIÓN',
    title: 'Monitoreo avanzado: clave para reducir costos',
    excerpt:
      'Terrasacha avanza en la identificación de costos estratégicos y destaca el monitoreo avanzado como un componente fundamental para optimizar recursos y fortalecer la transparencia.',
    image: '/comunicaciones/Comunicado 13/WhatsApp Image 2026-03-09 at 10.52.59 AM.jpeg',
    body: [
      'Se avanza en la identificación de los costos iniciales necesarios para un modelo de bonos de carbono.',
      '(UCC). En el marco del proyecto Terrasacha se avanza en la identificación de los principales costos asociados a la creación de un mercado de bonos de carbono en Colombia, estableciendo las bases para un modelo económico sostenible que proteja los recursos naturales y atraiga inversión a largo plazo.',
      'Sebastián Azcona, líder financiero y de tokenomics del proyecto, resalta que “el costo más interesante y que hay que analizar en detalle es el monitoreo, ya que representa uno de los componentes más relevantes del proyecto. Invertir en tecnología avanzada en esta área permite agilizar procesos y reducir costos de manera efectiva”.',
      'En este proyecto piloto se han identificado costos iniciales y operativos como estudios de prefactibilidad, formulación de metodologías de captura de carbono y tecnologías avanzadas, como monitoreo satelital y sistemas de Internet de las Cosas (IoT).',
      'De acuerdo con Azcona, estos componentes resultan fundamentales para garantizar el éxito de los proyectos de conservación y comercialización de bonos de carbono, en tanto ofrecen datos precisos y reducen los costos de operación en áreas remotas.',
      'La estructura de costos incluye también estudios detallados que evalúan la viabilidad de cada proyecto, el desarrollo de estándares de captura de carbono y la implementación de algoritmos de monitoreo a través de drones y satélites.',
      '“Terrasacha se enfoca en la implementación de tecnologías innovadoras para minimizar los costos de monitoreo y fortalecer la transparencia en cada etapa del proyecto”, acotó Azcona.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 14,
    number: 14,
    eyebrow: 'ALTERNATIVA DE INVERSIÓN AL AGRO Y LA FINCA RAÍZ',
    title: 'Reforestar: una opción rentable para diversificar inversiones',
    excerpt:
      'Terrasacha proyecta la reforestación como una alternativa sostenible y competitiva para diversificar inversiones con impacto ambiental directo.',
    image: '/comunicaciones/Comunicado 14/WhatsApp Image 2026-03-09 at 10.58.01 AM.jpeg',
    body: [
      'Invertir en esta clase de proyectos podría generar retornos hasta del 20 %.',
      '(UCC). En el contexto de la transición hacia una economía sostenible, el proyecto Terrasacha evalúa las proyecciones de rentabilidad y las estrategias de monetización de los bonos de carbono, los cuales se emitirían en una eventual segunda etapa.',
      'Este proyecto, respaldado por Minciencias y el Sistema General de Regalías, busca configurar un modelo de negocio confiable y seguro, que ofrezca retornos atractivos para los posibles inversionistas y que contribuya a la conservación ambiental en Colombia.',
      'De acuerdo con Sebastián Azcona, experto en tokenomics del proyecto, “estamos buscando ser competitivos con sectores similares, como el agro y la finca raíz. En los mejores escenarios proyectamos retornos de inversión anuales por encima del 20 por ciento, lo que hace que este tipo de proyectos sea una alternativa sólida para diversificar carteras”.',
      'Azcona agrega que, con el modelo piloto de inversión, Terrasacha aspira a ser una alternativa viable para quienes buscan proyectos sostenibles con un impacto ambiental directo. El proyecto se desarrolla en una plataforma que utiliza una estructura de tokenización, la cual divide los bonos de carbono en pequeñas unidades.',
      'Esta metodología permitirá que cada token represente una tonelada de carbono capturado, lo que democratizará el acceso a los bonos de carbono, tanto de grandes inversionistas como de personas con capital limitado.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 15,
    number: 15,
    eyebrow: 'DESTACAN SU UBICACIÓN GEOGRÁFICA',
    title: 'Terrenos de Meta y Arauca, aptos para bosques comerciales',
    excerpt:
      'Terrasacha impulsa bosques comerciales como sumideros de carbono y alternativa económica, apoyado en las condiciones geográficas y climáticas favorables de Meta y Arauca.',
    image: '/comunicaciones/Comunicado 15/ChatGPT Image 9 mar 2026, 10_56_38 a.m..png',
    body: [
      'Terrasacha impulsa el establecimiento de bosques comerciales para que se conviertan en sumideros de carbono y alternativa económica.',
      '(UCC). Este proyecto piloto busca incorporar en la región el conocimiento sobre los estándares que se deben observar al establecer bosques comerciales con el objetivo de generar bonos de carbono, que sean reconocidos por el mercado internacional.',
      'El establecimiento de las plantaciones comerciales exige la selección de determinadas especies de árboles, que son más eficientes para la captura de dióxido de carbono, lo que permite la generación de créditos de carbono de alta calidad, clave para su futura comercialización en mercados internacionales.',
      'José Ricardo Rivera, experto en bonos de carbono del proyecto Terrasacha, explica: “Los árboles funcionan como filtros naturales del dióxido de carbono, un gas de efecto invernadero. Este proceso nos permite convertir los bosques comerciales en sumideros de carbono y generar derechos sobre estas emisiones en forma de créditos de carbono.”',
      'Estos derechos son verificados y validados bajo estándares internacionales que certifican la captura de carbono y su impacto positivo.',
      'Por otra parte, las condiciones geográficas y climáticas de Arauca y Meta son favorables para plantaciones comerciales con especies como caucho, pino y eucalipto, principalmente.',
      '"La elección de estas especies no solo garantiza la captura de carbono, sino que también facilita el desarrollo económico y social al proveer de madera legal al mercado nacional e internacional, lo cual disminuye la presión sobre los bosques naturales", señaló Rivera.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 16,
    number: 16,
    eyebrow: 'INNOVACION Y SOSTENIBILIDAD',
    title: 'Meta y Arauca a la vanguardia en la captura de carbono en bosques comerciales',
    excerpt:
      'Terrasacha busca consolidar el potencial de la Orinoquia para la captura de carbono y la producción de madera mediante bosques comerciales sostenibles.',
    image: '/comunicaciones/Comunicado 16/ChatGPT Image 9 mar 2026, 11_00_51 a.m..png',
    body: [
      'Terrasacha busca consolidar el potencial de la Orinoquia para la generación de bonos de carbono y producción de madera.',
      '(UCC). "Los suelos de la región y su exposición solar, gracias a la ubicación en la línea ecuatorial, convierten a Meta y Arauca en un escenario ideal para la reforestación comercial”.',
      'La aseveración es de José Ricardo Rivera, experto en bonos de carbono de bosques comerciales de Terrasacha. Agrega que hay especies forestales estratégicas para la captura de dióxido de carbono como el eucalipto y el pino, adaptadas a las condiciones climáticas y edáficas de los Llanos Orientales.',
      '“Este proyecto quiere aprovechar alrededor de 4 millones de hectáreas para implementar plantaciones sostenibles, recuperando suelos erosionados y generando conectividad ecológica. Así, podemos ofrecer un suministro constante de madera legal al mercado y generar oportunidades de paz y desarrollo para la comunidad", expresa Rivera.',
      'En este modelo, las prácticas de manejo forestal juegan un papel crucial para maximizar la captura de carbono. Rivera explica que el ciclo de poda y la alta densidad de plantación permiten optimizar la madera producida para mercados internacionales.',
      '"La implementación de bosques comerciales en Meta y Arauca no solo captura carbono, sino que también contribuye al desarrollo sostenible de la región. Al manejar una alta densidad de plantación y un riguroso proceso de poda, logramos maximizar el crecimiento de cada árbol, alcanzando producciones de hasta 400 metros cúbicos de madera por hectárea”, puntualiza el especialista.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 17,
    number: 17,
    eyebrow: 'EMPODERAMIENTO Y SOSTENIBILIDAD',
    title: 'Terrasacha impulsa la apropiación de recursos naturales por parte de las comunidades',
    excerpt:
      'El proyecto fortalece la apropiación comunitaria de los recursos ambientales y sienta las bases para beneficios sostenibles a nivel económico y ecológico.',
    image: '/comunicaciones/Comunicado 17/WhatsApp Image 2026-03-09 at 11.04.10 AM.jpeg',
    body: [
      'El proyecto sienta las bases para generar beneficios ambientales y económicos sostenibles.',
      '(UCC). Uno de los grandes objetivos del proyecto es involucrar a las comunidades, gremios y autoridades en Arauca y Meta en un modelo pionero de sostenibilidad a través de la generación de bonos de carbono.',
      'Helena Pinto, experta en relaciones comunitarias del proyecto, destaca: “Nuestro enfoque se centra en acercar el proyecto a las comunidades, gremios y autoridades locales, para que se comprenda el alcance y el impacto de las acciones que Terrasacha está desarrollando en estos territorios. Queremos que las comunidades se apropien de los recursos ambientales, conozcan su valor y se beneficien de forma directa.”',
      'Terrasacha viene capacitando a las comunidades para que se conviertan en gestoras de los activos ambientales en sus territorios.',
      'Estas capacitaciones contemplan la creación de laboratorios piloto en los que se entrena a miembros de la comunidad en el uso de tecnologías como drones, lo cual es esencial para una eventual segunda etapa del proyecto en el que se desarrolle la comercialización de bonos de carbono.',
      '“Este proyecto pretende generar un modelo económico en el que las comunidades conserven sus recursos naturales y puedan obtener ingresos sostenibles a lo largo del tiempo, mejorando su calidad de vida”, expresa Pinto.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
  {
    id: 18,
    number: 18,
    eyebrow: 'ESTRATEGIAS COMUNITARIAS Y METAS SOSTENIBLES',
    title: 'Capacitación de las comunidades, clave para la sostenibilidad de los ecosistemas',
    excerpt:
      'Terrasacha fortalece capacidades comunitarias y prepara a la gente para participar activamente en futuras etapas de comercialización de bonos de carbono.',
    image: '/comunicaciones/Comunicado 18/ChatGPT Image 9 mar 2026, 11_10_28 a.m..png',
    body: [
      'El proyecto fortalece las capacidades de la gente, preparándola para una futura comercialización de bonos de carbono.',
      '(UCC). Esta iniciativa establece las bases para el desarrollo sostenible de las comunidades a través de un enfoque centrado en la capacitación y el trabajo comunitario.',
      'Aunque esta fase piloto no contempla la comercialización de bonos de carbono, el proyecto ha implementado objetivos y estrategias clave que están preparando a las comunidades para una futura etapa comercial.',
      'Viviana Usgame Peña, líder del equipo comunitario de Terrasacha, asegura: “En esta fase inicial, nuestras metas e hitos están enfocados en el desarrollo de habilidades y conocimientos que les permitan a las comunidades participar activamente en la protección y gestión de sus recursos naturales. Queremos que estén preparadas para beneficiarse de los modelos de comercialización en una fase futura.”',
      'Las metas de este proyecto incluyen el fortalecimiento de capacidades en el uso de tecnologías avanzadas para la protección y monitoreo de los ecosistemas estratégicos, la construcción de conocimiento sobre modelos de comercialización de bonos de carbono y el empoderamiento de las comunidades para gestionar estos activos en el futuro.',
      'Viviana Usgame Peña agrega que, “cada hito alcanzado en esta fase piloto es un paso hacia la creación de un modelo de comercialización de bonos de carbono inclusivo.”',
      'Terrasacha desarrolla talleres de sensibilización y socialización, donde las comunidades aprenden sobre el valor de los activos ambientales y su potencial en la economía de bonos de carbono.',
      'Estas actividades se complementan con talleres de diagnóstico en los que se simulan escenarios de gestión y conservación. Adicionalmente, se capacita en el uso de tecnologías avanzadas como drones, sensores de monitoreo y herramientas de Machine Learning.',
      'Estas capacitaciones en tecnologías 4.0 son una parte integral del proyecto, ya que no solo permiten que las comunidades adquieran nuevas habilidades, sino que también aseguran la sostenibilidad del modelo a largo plazo.',
    ],
    contactEmail: 'comunicaciones@terrasacha.com',
    contactWeb: 'www.terrasacha.com',
  },
];

export const getComunicadoById = (id: number) =>
  comunicados.find((comunicado) => comunicado.id === id);
