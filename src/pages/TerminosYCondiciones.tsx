import {
  CONTACT_EMAIL,
  SUPPORT_EMAIL,
  TERMS_PUBLICATION_DATE,
  UCC_HABEAS_DATA_EMAIL,
  UCC_HABEAS_DATA_FORM_URL,
  UCC_PRIVACY_POLICY_URL,
} from '../data/legalLinks';

type Definition = { term: string; description: string };

type Section =
  | { id: string; title: string; kind: 'paragraphs'; paragraphs: string[] }
  | { id: string; title: string; kind: 'definitions'; items: Definition[] }
  | {
      id: string;
      title: string;
      kind: 'mixed';
      blocks: Array<
        | { type: 'p'; text: string }
        | { type: 'ul'; items: string[] }
        | { type: 'link'; label: string; href: string }
      >;
    };

const DEFINITIONS: Definition[] = [
  {
    term: 'Administrador',
    description:
      'Persona encargada de configurar y gestionar la plataforma; puede definir categorías y parámetros, crear y asignar usuarios validadores a campañas, y crear usuarios administradores del Marketplace que supervisan transacciones y el listado de activos.',
  },
  {
    term: 'Analista',
    description:
      'Profesional que realiza análisis técnico de imágenes satelitales de los predios de los proyectos, genera gráficos e informes, y envía los resultados a los actores relevantes en la plataforma.',
  },
  {
    term: 'Billetera Digital (e-wallet)',
    description: 'Mecanismo (software) para realizar transacciones financieras de forma virtual.',
  },
  {
    term: 'Blockchain',
    description:
      'También llamada “cadena de bloques”: base de datos compartida o distribuida donde la información está almacenada en bloques ligados criptográficamente y validada de forma descentralizada mediante un protocolo común.',
  },
  {
    term: 'Cartera Central (Core Wallet)',
    description: 'Componente central responsable de la gestión de los tokens verdes dentro de la plataforma.',
  },
  {
    term: 'Colaborador Experto',
    description:
      'Tercero independiente que puede prestar servicios técnicos, jurídicos, financieros, comerciales, ambientales o de otra naturaleza a los usuarios del ecosistema. Salvo pacto expreso, no son empleados, representantes, mandatarios ni agentes de TerraSacha.',
  },
  {
    term: 'Conozca a su Cliente (KYC)',
    description:
      'Proceso utilizado por TerraSacha para verificar la identidad de los Usuarios, prevenir el lavado de dinero y otros delitos financieros, y garantizar el cumplimiento de requisitos regulatorios.',
  },
  {
    term: 'Conozca su negocio (KYB)',
    description:
      'Procedimiento similar al KYC aplicado a empresas: verifica identidad y antecedentes corporativos mediante información sobre propiedad, administración, actividades comerciales y perfil de riesgo.',
  },
  {
    term: 'Consultor o Validador',
    description:
      'Quien revisa y aprueba proyectos y campañas; configura el perfil de usuario, revisa elegibilidad de predios, asigna predios a campañas, valida prefactibilidad e ingresa información técnica y financiera requerida.',
  },
  {
    term: 'Contrato inteligente',
    description:
      'Contrato autoejecutable codificado como líneas de código, que se ejecuta automáticamente cuando se cumplen condiciones predeterminadas, permitiendo la ejecución de la operación tokenizada.',
  },
  {
    term: 'Crédito o bono de carbono',
    description: 'Unidad que representa una tonelada de CO₂ equivalente absorbida o evitada en la atmósfera.',
  },
  {
    term: 'Emisor',
    description:
      'Propietario, promotor, titular, desarrollador o responsable de un proyecto o activo ambiental que, previa validación y cumplimiento de requisitos, solicita o participa en la estructuración, publicación o emisión de una representación digital asociada.',
  },
  {
    term: 'Institución de registro de créditos de carbono',
    description: 'Responsable de revisar las solicitudes y aprobar aquellas que cumplan las condiciones establecidas.',
  },
  {
    term: 'Inversionistas',
    description:
      'Persona, empresa, fondo u organización que busca rentabilizar su dinero mediante la creación de riqueza con componente de impacto y protección del medio ambiente.',
  },
  {
    term: 'Legal o Jurídico',
    description:
      'Profesional del derecho que revisa, desde una perspectiva documental y jurídica, soportes de titularidad, tenencia, disponibilidad, autorizaciones, restricciones y demás documentos legales asociados al predio, proyecto o activo ambiental. Su revisión no sustituye conceptos legales especializados, certificaciones oficiales, estudios de títulos definitivos ni decisiones de autoridades competentes.',
  },
  {
    term: 'Marketplace',
    description:
      'Entorno digital de TerraSacha destinado a la visualización, publicación, consulta y eventual adquisición o transferencia controlada de representaciones digitales asociadas a proyectos o activos ambientales. El Marketplace no constituye bolsa de valores, sistema de negociación de valores, plataforma de financiación colaborativa, asesor financiero ni mecanismo de oferta pública.',
  },
  {
    term: 'Participante Autorizado',
    description:
      'Usuario que ha cumplido los procesos de registro, validación de identidad, KYC/KYB, aceptación de términos, revisión de cumplimiento y demás requisitos exigidos por TerraSacha para interactuar con determinadas funcionalidades.',
  },
  {
    term: 'Propietario',
    description:
      'Titular de los activos forestales que desea participar en el proceso. Su rol comienza con la creación de un usuario; debe aceptar las condiciones financieras del proyecto y asignar predios a campañas activas, asegurando el cumplimiento de requisitos de elegibilidad.',
  },
  {
    term: 'Proyecto',
    description:
      'Iniciativa ambiental, forestal, de conservación, restauración, reforestación, manejo sostenible, carbono en suelo u otra actividad elegible, registrada en la Plataforma. La existencia de un Proyecto no implica certificación automática de créditos de carbono, aprobación definitiva, garantía de resultados ni generación de beneficios económicos.',
  },
  {
    term: 'TerraSacha',
    description:
      'Plataforma tecnológica orientada a la estructuración, gestión, trazabilidad, validación preliminar, publicación y eventual tokenización de activos ambientales, proyectos forestales o representaciones digitales asociadas. TerraSacha actúa como proveedor tecnológico y no como certificador ambiental, asesor financiero, intermediario de valores, fiduciario, operador bursátil, garante de rentabilidad ni responsable de la certificación final de créditos de carbono, salvo disposición expresa en contrario.',
  },
  {
    term: 'Token',
    description:
      'Unidad de valor digital creada por el Contrato Inteligente que el o los Emisores emitirán a favor de su o sus Compradores de Token.',
  },
  {
    term: 'Tokenización',
    description:
      'Proceso que permite transformar un activo o dato en una unidad digital llamada token, que puede almacenarse, transferirse y gestionarse de forma segura y eficiente.',
  },
  {
    term: 'Usuario',
    description:
      'Toda persona natural o jurídica que acceda, se registre, consulte, cargue información, participe, adquiera, transfiera, redima o interactúe de cualquier forma con la Plataforma, el Marketplace o los servicios de TerraSacha.',
  },
];

const SECTIONS: Section[] = [
  {
    id: 'resumen',
    title: 'Resumen',
    kind: 'mixed',
    blocks: [
      {
        type: 'p',
        text: 'El presente resumen tiene finalidad meramente informativa y no sustituye el contenido completo de estos Términos y Condiciones. En caso de contradicción entre el resumen y el texto completo, prevalecerá el texto completo de los Términos y Condiciones.',
      },
      {
        type: 'p',
        text: 'TerraSacha se reserva el derecho de aceptar o rechazar la activación de un perfil en el Marketplace. También se reserva el derecho de desactivar o suspender un perfil creado en cualquier momento si viola estos Términos y Condiciones (“T&C”).',
      },
      {
        type: 'p',
        text: 'Al registrarse en el Marketplace, usted deberá proporcionar información precisa, completa y actualizada, y no crear una cuenta con fines fraudulentos o engañosos. Usted es responsable de mantener la confidencialidad y seguridad de su contraseña y de cualquier actividad realizada en su cuenta.',
      },
      {
        type: 'p',
        text: 'Los Administradores deberán atender, tramitar y gestionar las solicitudes presentadas por los Propietarios, Participantes Autorizados y demás usuarios de la Plataforma, de conformidad con estos Términos y Condiciones, las políticas internas de TerraSacha, los procedimientos técnicos aplicables y la normativa vigente. La atención de una solicitud no implica su aprobación automática, ni limita la facultad de TerraSacha de rechazar, suspender o solicitar información adicional cuando existan razones técnicas, jurídicas, operativas, de cumplimiento o de seguridad que así lo justifiquen.',
      },
      {
        type: 'p',
        text: 'Respetamos tu privacidad. Puedes consultar nuestra Política de Privacidad o el documento institucional de la Universidad Cooperativa de Colombia:',
      },
      { type: 'link', label: 'Acuerdo Superior Universitario 171 de 2014 (PDF)', href: UCC_PRIVACY_POLICY_URL },
    ],
  },
  {
    id: 'definiciones',
    title: 'Definiciones',
    kind: 'definitions',
    items: DEFINITIONS,
  },
  {
    id: 'quienes-somos',
    title: '¿Quiénes somos?',
    kind: 'paragraphs',
    paragraphs: [
      'Somos un proyecto concebido en la Universidad Cooperativa de Colombia (UCC), en colaboración estratégica con la Corporación Innprende. Nuestra financiación se nutre principalmente de los recursos del Sistema General de Regalías (SGR), asignados específicamente a los departamentos de Meta y Arauca mediante una rigurosa convocatoria del Ministerio de Ciencia, Tecnología e Innovación.',
      'TerraSacha es una plataforma tecnológica concebida para apoyar la estructuración, gestión, trazabilidad, validación preliminar y eventual tokenización de proyectos ambientales y activos forestales, mediante herramientas digitales, modelos técnicos y financieros, medición de capacidad de captura o retención de carbono, trazabilidad documental, contratos inteligentes y funcionalidades de marketplace controlado.',
      'TerraSacha surge en el marco de un proyecto de investigación, desarrollo e innovación. Su propósito es contribuir al desarrollo de modelos técnicos y financieros para la medición de la capacidad de captura de carbono en ecosistemas priorizados, así como al uso de tecnologías emergentes aplicadas a la protección de cuencas, suelos y activos forestales.',
      'TerraSacha no actúa como certificador ambiental, autoridad pública, entidad financiera, intermediario de valores, fiduciario, asegurador ni garante de rentabilidad o certificación. La certificación de créditos de carbono, cuando aplique, dependerá de los estándares, metodologías, registros, validadores, verificadores o autoridades competentes.',
    ],
  },
  {
    id: 'proposito',
    title: 'Propósito',
    kind: 'paragraphs',
    paragraphs: [
      'Los presentes Términos y Condiciones regulan el acceso, registro, navegación, uso e interacción de los Usuarios con la Plataforma, el Marketplace y demás funcionalidades de TerraSacha. Asimismo, establecen las reglas generales aplicables a la carga de información, validación de proyectos, participación de usuarios, uso de contratos inteligentes, gestión de representaciones digitales, tratamiento de datos, limitaciones de responsabilidad, propiedad intelectual, cumplimiento y demás aspectos relacionados con el ecosistema TerraSacha.',
    ],
  },
  {
    id: 'aceptacion',
    title: 'Aceptación de los Términos',
    kind: 'paragraphs',
    paragraphs: [
      'Al acceder o utilizar la plataforma TerraSacha y su mercado, usted acepta estar sujeto a estos términos y condiciones, así como a cualquier política adicional que pueda ser publicada en la plataforma.',
      'Usted declara y garantiza que tiene la capacidad legal para aceptar estos términos y que es mayor de edad en su jurisdicción.',
      'Nos reservamos el derecho de modificar estos términos en cualquier momento. Le notificaremos de cualquier cambio significativo y se le pedirá que acepte los nuevos términos antes de continuar utilizando la plataforma.',
    ],
  },
  {
    id: 'aceptacion-electronica',
    title: 'Aceptación electrónica y validez jurídica',
    kind: 'paragraphs',
    paragraphs: [
      'El Usuario reconoce y acepta que la aceptación electrónica de los presentes Términos y Condiciones, de políticas, autorizaciones, contratos, avisos, formularios, consentimientos o cualquier documento relacionado con la Plataforma TerraSacha podrá realizarse mediante mecanismos digitales tales como clic de aceptación, casillas de verificación (checkbox), firma electrónica, autenticación en plataforma, aceptación mediante mensaje de datos, uso continuado de la Plataforma o cualquier otro mecanismo tecnológico que permita evidenciar la manifestación de voluntad del Usuario.',
      'Dicha aceptación electrónica tendrá plena validez jurídica, fuerza vinculante y efectos probatorios conforme a la legislación colombiana aplicable, incluyendo las normas sobre comercio electrónico, mensajes de datos y firma electrónica. El Usuario reconoce que los registros electrónicos, logs, trazabilidad digital, evidencias de autenticación y demás mecanismos tecnológicos implementados por TerraSacha podrán utilizarse como prueba de aceptación, consentimiento, autenticación y realización de operaciones dentro de la Plataforma.',
    ],
  },
  {
    id: 'registro-mercado',
    title: 'Procedimiento de registro en el mercado',
    kind: 'paragraphs',
    paragraphs: [
      'Tendrás la posibilidad de crear un perfil en el Marketplace.',
      'TerraSacha podrá suspender, restringir, desactivar o eliminar una cuenta cuando identifique incumplimiento de estos Términos, uso indebido de la Plataforma, información falsa, riesgos de fraude, suplantación, incumplimiento de procesos de validación, alertas de seguridad, riesgos legales, regulatorios, reputacionales o de cumplimiento.',
      'Cuando la situación lo permita, TerraSacha notificará al Usuario la medida adoptada y las razones generales que la motivan, a través del correo electrónico registrado o mediante aviso en la Plataforma. El Usuario podrá presentar aclaraciones, soportes o solicitud de revisión dentro de los cinco (5) días hábiles siguientes a la notificación.',
      'TerraSacha podrá adoptar medidas inmediatas sin notificación previa cuando exista riesgo de fraude, afectación de seguridad, uso no autorizado, incumplimiento legal, riesgo para otros usuarios, afectación de la integridad del ecosistema o requerimiento de autoridad competente.',
    ],
  },
  {
    id: 'procedimiento',
    title: 'Procedimiento',
    kind: 'mixed',
    blocks: [
      {
        type: 'p',
        text: 'Para ser aceptado, deberá primero completar los procedimientos KYC necesarios y firmar los Acuerdos y términos correspondientes con TerraSacha.',
      },
      {
        type: 'p',
        text: 'Al recibir acceso al panel de control, usted será responsable de cargar toda la información relevante, incluida la información necesaria y requerida. Deberá proporcionar información veraz y mantener la transparencia en todo momento, siguiendo consistentemente el principio de buena fe.',
      },
      {
        type: 'p',
        text: `Sin perjuicio de lo anterior, TerraSacha ha incorporado ciertas pautas orientativas sobre la información que se presentará. Si no está seguro de la información requerida, deberá consultar con un asesor profesional. Puede contactar a soporte en ${SUPPORT_EMAIL}.`,
      },
      {
        type: 'p',
        text: 'Usted comprende y reconoce que en ningún caso TerraSacha, como Proveedor de Tecnología, será responsable ante usted, su(s) Comprador(es) o cualquier tercero por daños directos, indirectos, incidentales, especiales, consecuentes o punitivos, o cualquier pérdida de ganancias, ingresos, datos, uso, fondo de comercio u otras pérdidas intangibles, que surjan de o en conexión con la información cargada por usted solo o con la valoración de un Colaborador, así como por las pautas proporcionadas por TerraSacha, que son solo para fines informativos.',
      },
      {
        type: 'p',
        text: 'Además, usted reconoce y acepta que es el único responsable de su relación entre las partes. TerraSacha, como Proveedor de Tecnología, no asume ninguna responsabilidad por las obligaciones o interacciones realizadas entre usted y los demás intervinientes en el proceso.',
      },
      {
        type: 'p',
        text: 'Para acceder a determinadas funcionalidades, el Usuario deberá completar los procedimientos de conocimiento del cliente, conocimiento del negocio, validación documental, aceptación de términos, firma electrónica o aceptación digital de documentos, y demás verificaciones exigidas por TerraSacha. La aprobación del registro no es automática y podrá ser rechazada, suspendida o condicionada cuando la información sea incompleta, inconsistente, falsa, no verificable o genere alertas de cumplimiento, seguridad, riesgo jurídico, reputacional o regulatorio.',
      },
    ],
  },
  {
    id: 'expertos',
    title: 'Plataforma de expertos y exención de responsabilidad',
    kind: 'mixed',
    blocks: [
      {
        type: 'p',
        text: 'Dentro del ecosistema de TerraSacha existen Colaboradores Expertos que prestan servicios relacionados con la tokenización (legal, de marketing, financiero, etc.) para ayudar al o a los Emisores a llevar a cabo cada uno de los procesos.',
      },
      { type: 'p', text: 'Usted reconoce y acepta que:' },
      {
        type: 'ul',
        items: [
          'El contacto y la interacción con los colaboradores expertos se realiza bajo su propio riesgo.',
          'TerraSacha no respalda ni garantiza la experiencia, el asesoramiento ni los servicios que brindan.',
          'Cualquier confianza depositada en los servicios del o de los Colaboradores Expertos queda a su propia discreción y responsabilidad.',
          'Exime a TerraSacha de cualquier responsabilidad, obligación, reclamo o daño que surja de o esté relacionado con su compromiso con el o los Colaboradores Expertos, incluyendo insatisfacción con sus servicios, errores o inexactitudes en sus consejos, o cualquier resultado financiero o legal resultante de sus servicios.',
        ],
      },
    ],
  },
  {
    id: 'enlaces-externos',
    title: 'Enlaces externos y servicios de terceros',
    kind: 'paragraphs',
    paragraphs: [
      'La Plataforma TerraSacha podrá contener enlaces, integraciones, referencias o accesos a sitios web, aplicaciones, plataformas, billeteras digitales, servicios cloud, redes blockchain, registros, proveedores tecnológicos, herramientas de analítica, marketplaces externos o servicios operados por terceros. Dichos enlaces o integraciones se proporcionan únicamente con fines informativos, operativos o de interoperabilidad tecnológica y no implican aprobación, respaldo, asociación, garantía ni control por parte de TerraSacha.',
      'El Usuario reconoce y acepta que el acceso y uso de plataformas, aplicaciones o servicios de terceros se realiza bajo su propia responsabilidad y estará sujeto a los términos, condiciones y políticas de privacidad definidos por dichos terceros. En consecuencia, TerraSacha no será responsable por pérdidas, daños, fallas, indisponibilidad, errores, vulneraciones de seguridad, pérdida de información, afectaciones económicas o cualquier consecuencia derivada del uso, interacción o dependencia de servicios externos o de terceros.',
    ],
  },
  {
    id: 'compromisos',
    title: 'Reconocimientos y compromisos',
    kind: 'mixed',
    blocks: [
      { type: 'p', text: 'Al utilizar el sitio web, usted acepta que:' },
      {
        type: 'ul',
        items: [
          'Es el único responsable de proporcionar información precisa y relevante que permita comprender plenamente las posibles ventajas y desventajas de su proyecto, actuando siempre de buena fe.',
          'En todo momento deberá cumplir con las normas, leyes y reglas aplicables.',
          'Debe proporcionar información precisa, actualizada y real al realizar un KYC y/o KYB.',
          'Es completamente responsable de cualquier fraude, tergiversación u otros problemas relacionados.',
          'No reproducirá, modificará, preparará trabajos derivados, distribuirá, licenciará ni explotará de ninguna manera el Sitio web, los Contratos inteligentes, su panel de control, página de destino, etc., cuando no esté expresamente permitido por TerraSacha.',
          'No descompilará ni aplicará ingeniería inversa al sitio web, los contratos inteligentes, la tienda de venta de tokens, el panel de control, etc.',
          'Es responsable de mantener la confidencialidad de su cuenta y de notificar inmediatamente cualquier uso no autorizado.',
          'Se compromete a utilizar la plataforma de manera ética, legal y respetuosa.',
        ],
      },
      { type: 'p', text: 'Queda prohibido:' },
      {
        type: 'ul',
        items: [
          'Publicar contenido falso, engañoso o difamatorio.',
          'Participar en actividades fraudulentas o ilegales.',
          'Infringir los derechos de propiedad intelectual de terceros.',
        ],
      },
      {
        type: 'p',
        text: 'Todas las transacciones deben realizarse de buena fe y cumplir con las leyes aplicables en Colombia.',
      },
    ],
  },
  {
    id: 'tokenizacion',
    title: 'Tokenización de activos forestales y representaciones digitales ambientales',
    kind: 'paragraphs',
    paragraphs: [
      'La tokenización que se realice a través del ecosistema TerraSacha podrá consistir en la creación de representaciones digitales asociadas a proyectos ambientales, activos forestales, estimaciones de captura o retención de carbono, créditos de carbono certificados o expectativas condicionadas de certificación, según la naturaleza y estado de cada proyecto.',
      'Salvo que un documento contractual específico establezca expresamente lo contrario, los tokens, certificados digitales o representaciones digitales emitidas dentro del ecosistema TerraSacha no otorgan por sí mismos derecho de propiedad sobre predios, activos forestales, árboles, suelos, créditos de carbono inexistentes, participación societaria, título valor, derecho real, derecho de uso del predio, ni promesa de rentabilidad.',
      'Cuando la representación digital esté asociada a un proyecto en etapa temprana, su naturaleza será contingente y estará sujeta al desarrollo, monitoreo, validación, verificación, certificación, disponibilidad de créditos, reglas de redención, términos contractuales y riesgos ambientales, técnicos, jurídicos y de mercado.',
      'Cuando la representación digital esté asociada a un crédito de carbono certificado, su existencia, transferencia, redención, quema o retiro estará sujeta al registro base, al identificador único del crédito, a las reglas de bloqueo, a los contratos inteligentes aplicables, a las condiciones del estándar correspondiente y a los documentos contractuales suscritos por las partes.',
      'TerraSacha no garantiza la generación de créditos de carbono, la certificación futura de proyectos, la valorización de tokens, la existencia de liquidez, la obtención de beneficios económicos, ni la posibilidad de redención cuando no se cumplan las condiciones técnicas, ambientales, contractuales o regulatorias correspondientes.',
    ],
  },
  {
    id: 'proteccion-datos',
    title: 'Protección de datos y privacidad',
    kind: 'mixed',
    blocks: [
      {
        type: 'p',
        text: 'TerraSacha, en cumplimiento de lo señalado en la Ley 1581 de 2012 y el decreto reglamentario 1377 de 2013, se adhiere al Acuerdo Superior Universitario 171 del 20 de marzo de 2014, mediante el cual se establecen las Políticas de tratamiento y protección de datos personales en la Institución. De esta manera se garantiza que los datos personales recolectados tengan un tratamiento confiable y sean custodiados en el sistema de información de manera segura. La información registrada en las bases de datos solo será utilizada para fines institucionales.',
      },
      { type: 'link', label: 'Consultar Acuerdo 171 de 2014 (PDF)', href: UCC_PRIVACY_POLICY_URL },
      {
        type: 'p',
        text: `Usted puede hacer reclamaciones con relación al tratamiento de sus datos diligenciando el formulario de la UCC y enviándolo a ${UCC_HABEAS_DATA_EMAIL}.`,
      },
      { type: 'link', label: 'Formulario de tratamiento de datos personales UCC', href: UCC_HABEAS_DATA_FORM_URL },
      {
        type: 'p',
        text: 'También puede revisar un resumen en nuestra página de Política de Privacidad.',
      },
    ],
  },
  {
    id: 'limitacion-responsabilidad',
    title: 'Exclusión de garantías y limitación de responsabilidad',
    kind: 'paragraphs',
    paragraphs: [
      'En la máxima medida permitida por la ley aplicable, TerraSacha no será responsable por daños indirectos, incidentales, especiales, consecuenciales, pérdida de oportunidad, pérdida de ganancias, pérdida de datos, interrupciones del servicio, fallas de terceros, fallas de conectividad, ataques informáticos, errores de usuario, pérdida de claves privadas, uso de billeteras de terceros o indisponibilidad de redes blockchain, salvo cuando dichos daños sean atribuibles a dolo, culpa grave o incumplimiento legal no susceptible de limitación.',
    ],
  },
  {
    id: 'propiedad-intelectual',
    title: 'Derechos de propiedad intelectual y marcas',
    kind: 'paragraphs',
    paragraphs: [
      'Los derechos de propiedad intelectual e industrial se refieren a todos y cada uno de los derechos que puedan proporcionarse a las marcas, invenciones, modelos útiles, diseños, software, know-how, técnicas, procesos, programas informáticos (incluidos los códigos fuente), registrados o no, incluidas las solicitudes de registro, los derechos sobre la documentación técnica, las metodologías, el modelo de negocio, la página web, el o los Contratos inteligentes, la plataforma y sus características, los secretos comerciales e industriales, el know-how, los derechos de autor y otros objetos de propiedad intelectual (en adelante, “Derechos de Propiedad Intelectual”).',
      'Los Derechos de Propiedad Intelectual permanecerán en todo momento en propiedad de TerraSacha. El uso de la plataforma, la landing page y cualesquiera otras funcionalidades no implica la adquisición de algún Derecho de Propiedad Intelectual.',
      'TerraSacha es una marca particular de un proyecto concebido en la Universidad Cooperativa de Colombia (UCC), en colaboración estratégica con la Corporación Innprende. Queda expresamente prohibida cualquier utilización de dicha marca o dominio por terceros, así como copiar, transmitir, modificar o suprimir la información, contenido o advertencias de la Página Web y/o la Aplicación.',
      'En caso de ser aplicable, el Emisor acepta que TerraSacha pueda utilizar la imagen corporativa (logotipo) del Emisor en soportes promocionales (página web y/o blog, redes sociales, catálogos y/o folletos corporativos, entre otros), y TerraSacha se compromete a tratarlos respetando, en todo momento, el derecho al honor y la imagen de marca del Emisor.',
    ],
  },
  {
    id: 'cumplimiento',
    title: 'Cumplimiento',
    kind: 'paragraphs',
    paragraphs: [
      'Al utilizar la plataforma, usted se compromete a cumplir todas las leyes aplicables, incluidas, entre otras, las leyes y normativas anticorrupción y las leyes aplicables en materia de soborno, extorsión, comisiones ilegales y corrupción privada.',
    ],
  },
  {
    id: 'fuerza-mayor',
    title: 'Fuerza mayor',
    kind: 'paragraphs',
    paragraphs: [
      'TerraSacha no será responsable por el incumplimiento, suspensión, interrupción o retraso total o parcial de sus servicios cuando ello se derive de eventos de fuerza mayor, caso fortuito o circunstancias fuera de su control razonable, incluyendo fallas generalizadas de internet, interrupciones eléctricas, ataques informáticos, decisiones gubernamentales, desastres naturales, pandemias, conflictos, fallas de terceros proveedores, indisponibilidad de redes blockchain o eventos técnicos no imputables a TerraSacha.',
      'Mientras subsista el evento, las obligaciones afectadas quedarán suspendidas en la medida correspondiente. Si el evento se prolonga por más de treinta (30) días calendario y afecta sustancialmente la prestación del servicio, TerraSacha podrá suspender, modificar o terminar total o parcialmente el acceso al servicio afectado, previa comunicación al Usuario cuando ello sea razonablemente posible.',
    ],
  },
  {
    id: 'sin-asesoramiento',
    title: 'Sin asesoramiento profesional',
    kind: 'paragraphs',
    paragraphs: [
      'La información disponible en TerraSacha tiene finalidad general, tecnológica, operativa e informativa. No constituye asesoría legal, financiera, tributaria, contable, ambiental, técnica, de inversión ni recomendación personalizada. El Usuario deberá consultar asesores independientes antes de tomar decisiones relacionadas con adquisición, transferencia, redención, estructuración de proyectos, tokenización, certificación, compensación ambiental o cualquier otra decisión con efectos jurídicos, económicos o técnicos.',
    ],
  },
  {
    id: 'atencion-cliente',
    title: 'Atención al cliente',
    kind: 'mixed',
    blocks: [
      {
        type: 'p',
        text: `Para dudas, consultas o comentarios relacionados con los Términos y Condiciones o con el acceso, uso, características o procedimientos de la Página Web, Plataforma, Panel de control u otros componentes del servicio, contacte a: ${SUPPORT_EMAIL}.`,
      },
      {
        type: 'p',
        text: `Para información sobre productos y servicios, consultas generales o sugerencias de mejora: ${CONTACT_EMAIL}.`,
      },
      {
        type: 'p',
        text: 'Nuestro equipo de soporte responderá a todas las consultas en un plazo razonable. La respuesta puede variar dependiendo del volumen de solicitudes recibidas.',
      },
      {
        type: 'p',
        text: 'Al ponerse en contacto con nosotros, por favor no incluya información confidencial o personal sensible. Nos comprometemos a proteger su privacidad y a manejar su información de acuerdo con nuestra Política de Privacidad.',
      },
      { type: 'link', label: 'Política de tratamiento de datos UCC (PDF)', href: UCC_PRIVACY_POLICY_URL },
    ],
  },
  {
    id: 'legislacion',
    title: 'Legislación aplicable y jurisdicción',
    kind: 'paragraphs',
    paragraphs: [
      'Estos Términos y Condiciones se regirán e interpretarán de conformidad con las leyes de la República de Colombia, sin perjuicio de las normas imperativas que resulten aplicables en materia de protección al consumidor, protección de datos personales, comercio electrónico, activos digitales, mercado de valores, prevención de lavado de activos o cualquier otra regulación especial aplicable.',
      'Las controversias que surjan con ocasión del acceso, uso, interpretación, ejecución o terminación de estos Términos serán sometidas a la jurisdicción de los jueces competentes de la República de Colombia, salvo que las partes acuerden válidamente un mecanismo alternativo de solución de controversias.',
    ],
  },
  {
    id: 'modificaciones',
    title: 'Modificaciones a los Términos y Condiciones',
    kind: 'paragraphs',
    paragraphs: [
      'TerraSacha podrá modificar estos Términos y Condiciones en cualquier momento. Cuando las modificaciones sean sustanciales o afecten de manera relevante el uso de la Plataforma, TerraSacha informará a los Usuarios mediante la Plataforma, correo electrónico registrado u otro medio razonable.',
      'Salvo que la modificación sea necesaria por razones legales, regulatorias, técnicas, de seguridad o de cumplimiento inmediato, se otorgará al Usuario un plazo de cinco (5) días hábiles para revisar los cambios. Si el Usuario continúa utilizando la Plataforma después de dicho plazo, se entenderá que acepta los Términos modificados. Si no está de acuerdo, deberá abstenerse de utilizar la Plataforma y podrá solicitar el cierre de su cuenta, sin perjuicio de las obligaciones pendientes.',
    ],
  },
];

const handleScrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const TerminosYCondiciones = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f4ea] via-white to-secondary-claro/10 font-primary text-[#44482c]">
      <section className="relative overflow-hidden border-b border-[#44482c]/10 bg-[#e8d79a]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_55%)]" />
        <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]/70">Documento legal</p>
          <h1 className="mt-3 font-slogan text-3xl uppercase tracking-slogan text-[#44482c] sm:text-4xl md:text-5xl">
            Términos y Condiciones
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#44482c]/85 sm:text-lg">
            Usuarios de la Plataforma TerraSacha
          </p>
          <p className="mt-4 text-sm text-[#44482c]/70">
            Fecha de publicación: {TERMS_PUBLICATION_DATE}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <nav
          aria-label="Índice de términos y condiciones"
          className="mb-10 rounded-2xl border border-[#44482c]/10 bg-white/80 p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-sm font-bold uppercase tracking-wide text-[#44482c]">Contenido</h2>
          <ol className="mt-4 columns-1 gap-x-8 space-y-1.5 text-sm sm:columns-2">
            {SECTIONS.map((section, index) => (
              <li key={section.id} className="break-inside-avoid">
                <button
                  type="button"
                  onClick={() => handleScrollToSection(section.id)}
                  className="text-left text-[#44482c]/80 transition-colors hover:text-[#44482c] hover:underline"
                  aria-label={`Ir a la sección ${section.title}`}
                >
                  <span className="mr-1.5 text-[#44482c]/45">{index + 1}.</span>
                  {section.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-10">
          {SECTIONS.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-28 border-b border-[#44482c]/10 pb-10 last:border-b-0 last:pb-0"
            >
              <h2 className="text-xl font-bold text-[#44482c] sm:text-2xl">{section.title}</h2>

              {section.kind === 'paragraphs' && (
                <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-[#44482c]/90 sm:text-base">
                  {section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={`${section.id}-p-${paragraphIndex}`}>{paragraph}</p>
                  ))}
                </div>
              )}

              {section.kind === 'definitions' && (
                <dl className="mt-5 space-y-4">
                  {section.items.map((item) => (
                    <div key={item.term} className="rounded-xl bg-white/70 px-4 py-3 ring-1 ring-[#44482c]/8">
                      <dt className="font-semibold text-[#44482c]">{item.term}</dt>
                      <dd className="mt-1 text-sm leading-relaxed text-[#44482c]/85 sm:text-[0.95rem]">
                        {item.description}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}

              {section.kind === 'mixed' && (
                <div className="mt-4 space-y-4 text-[0.95rem] leading-relaxed text-[#44482c]/90 sm:text-base">
                  {section.blocks.map((block, blockIndex) => {
                    if (block.type === 'p') {
                      return <p key={`p-${blockIndex}`}>{block.text}</p>;
                    }
                    if (block.type === 'ul') {
                      return (
                        <ul key={`ul-${blockIndex}`} className="list-disc space-y-2 pl-5">
                          {block.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    return (
                      <p key={`link-${blockIndex}`}>
                        <a
                          href={block.href}
                          target="_blank"
                          rel="noreferrer"
                          className="font-medium text-primary underline-offset-2 hover:underline"
                        >
                          {block.label}
                        </a>
                      </p>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>

      </div>
    </main>
  );
};

export default TerminosYCondiciones;
