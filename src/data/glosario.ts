export type GlossaryTerm = {
  id: string;
  term: string;
  definition: string;
};

const slugify = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const rawTerms: Array<{ term: string; definition: string }> = [
  {
    term: 'Activos forestales',
    definition:
      'Los bosques naturales, plantaciones forestales y las tierras cuya capacidad de uso mayor sea de producción y protección forestal y los demás componentes silvestres de la flora terrestre y acuática emergente.',
  },
  {
    term: 'Ada',
    definition:
      'Es el token nativo de la blockchain de Cardano que permite realizar transacciones y transferir valor a través de esta cadena.',
  },
  {
    term: 'Bitcoin',
    definition:
      'Es el token nativo de la blockchain de Bitcoin; igualmente permite realizar transacciones y transferir valor a través de esta cadena.',
  },
  {
    term: 'Billetera digital (e-wallet)',
    definition:
      'Gestiona los fondos y activos digitales representados en la blockchain. Es la interfaz básica para interactuar con la cadena de bloques permitiendo realizar transacciones de tipo envío y recepción de fondos.',
  },
  {
    term: 'Blockchain',
    definition:
      'O «cadena de bloques», es una base de datos compartida o distribuida donde la información registrada está almacenada en bloques, ligados entre sí criptográficamente, y validada de una forma descentralizada a través de un protocolo común.',
  },
  {
    term: 'Cambio climático',
    definition:
      'Se le llama a la variación global del clima de la Tierra. Debido principalmente a la quema de combustibles fósiles, como el carbón, el petróleo y el gas, lo que produce gases que atrapan el calor.',
  },
  {
    term: 'Cardano',
    definition:
      'Es una cadena de bloques de código abierto, así como una plataforma para ejecutar contratos inteligentes y emitir su propia moneda digital.',
  },
  {
    term: 'CO₂',
    definition:
      'El dióxido de carbono es el principal gas de efecto invernadero que se emite a raíz de las actividades del ser humano.',
  },
  {
    term: 'Contrato inteligente',
    definition:
      'Es un programa informático almacenado en la cadena de bloques que nos permite convertir algunas características de un contrato tradicional en un paralelo digital.',
  },
  {
    term: 'Criptomonedas',
    definition:
      'Son activos digitales descentralizados, ya que no están controladas ni respaldadas por ningún banco central, y sus intercambios no requieren de intermediarios.',
  },
  {
    term: 'Crédito o bono de carbono',
    definition:
      'Es una unidad que representa una tonelada de CO₂ equivalente absorbida o evitada en la atmósfera.',
  },
  {
    term: 'Dasometría',
    definition:
      'Es la parte de la dasonomía (ciencia de los bosques) que se ocupa de la aplicación de métodos estadísticos para la búsqueda de soluciones a problemas asociados con la existencia, crecimiento y el manejo de bosques.',
  },
  {
    term: 'Energías renovables',
    definition:
      'Son aquellas fuentes energéticas basadas en la utilización del sol, el viento, el agua o la biomasa vegetal o animal —entre otras—. Se caracterizan por no utilizar combustibles fósiles —como sucede con las energías convencionales—, sino recursos capaces de renovarse ilimitadamente.',
  },
  {
    term: 'Fiat',
    definition:
      'Monedas emitidas por bancos centrales correspondientes a algún país (euro, el dólar o el peso colombiano).',
  },
  {
    term: 'Gases de efecto invernadero (GEI)',
    definition:
      'Son aquellos gases que se acumulan en la atmósfera terrestre y que son capaces de absorber la radiación infrarroja del Sol, aumentando y reteniendo el calor en la atmósfera.',
  },
  {
    term: 'Inversionista',
    definition:
      'Una persona, empresa, fondo u organización que quiere rentabilizar su dinero a través de la creación de riqueza con un componente de impacto y protección del medio ambiente.',
  },
  {
    term: 'KYC (Conoce tu cliente)',
    definition:
      'Es la práctica que realizan las compañías para verificar la identidad de sus clientes cumpliendo con las exigencias legales y las normativas y regulaciones vigentes, tales como AML, LGPD y eIDAS.',
  },
  {
    term: 'Marketplace',
    definition:
      'Es un espacio comercial virtual que sirve como intermediario entre los compradores y vendedores.',
  },
  {
    term: 'Mercados de carbono',
    definition:
      'Son espacios donde las empresas y las personas pueden comprar o vender certificados que representan emisiones o reducciones de gases de efecto invernadero (GEI).',
  },
  {
    term: 'Mercado P2P',
    definition: 'Es el proceso de compra y venta de activos digitales directamente entre usuarios.',
  },
  {
    term: 'Mercado regulado',
    definition:
      'Es aquel mercado en el cual el Estado interviene de manera directa tomando decisiones que regularmente toman las personas y las empresas, como el precio de algunos productos o el valor del trabajo, qué se debe producir y cómo se debe desarrollar el comercio.',
  },
  {
    term: 'Mercado voluntario',
    definition:
      'Son proyectos o iniciativas gubernamentales o no gubernamentales que buscan llevar a la práctica acciones piloto para reducir las emisiones de deforestación y degradación en áreas determinadas, así como la conservación de stocks de carbono, el manejo forestal sostenible y el aumento de las reservas de carbono.',
  },
  {
    term: 'Metano',
    definition:
      'El metano es un gas natural, incoloro e inodoro que se produce debido a la descomposición o la digestión de materia orgánica, como las plantas. Su fórmula química es CH₄ (un átomo de carbono y cuatro átomos de hidrógeno).',
  },
  {
    term: 'Moneda digital',
    definition:
      'Dinero virtual, lo cual significa que no existe físicamente, y todas las compras o transacciones que se realicen con ella deberán ser vía electrónica.',
  },
  {
    term: 'NFT',
    definition: 'Es un activo que tiene la capacidad de ser único e irrepetible, conocido como no fungible.',
  },
  {
    term: 'Propietario',
    definition:
      'Dueño de un predio interesado en transformar un predio en un activo ambiental monetizable.',
  },
  {
    term: 'Protocolo de Kioto',
    definition:
      'Fue creado para reducir las emisiones de gases de efecto invernadero (GEI) que causan el calentamiento global.',
  },
  {
    term: 'Stakeholders',
    definition:
      'Son aquellos individuos o grupos que tienen interés e impacto en una organización, proyecto y en los resultados de sus acciones, como lo son los empleados, los accionistas, los clientes, los proveedores, los gobiernos y las comunidades.',
  },
  {
    term: 'REDD+',
    definition:
      'Hace referencia a la reducción de emisiones de gases de efecto invernadero debidas a la deforestación y degradación de los bosques, la conservación y aumento de las reservas de carbono y el manejo forestal sostenible.',
  },
  {
    term: 'Token',
    definition:
      'Es un sello de autenticidad que está contenido en un código adherido a un archivo digital mediante una tecnología llamada blockchain.',
  },
  {
    term: 'Token de propiedad',
    definition:
      'Es un tipo de activo digital que representa una participación en la propiedad de un activo real o intangible. En el contexto de un proyecto forestal, este token podría ser utilizado para representar una participación en la propiedad de una parcela de terreno forestal o en el proyecto forestal en su totalidad.',
  },
  {
    term: 'Token de valor',
    definition:
      'También conocido como «token de inversión» o «token de capital», en el ámbito de la tecnología blockchain se llama token de valor a un token criptográfico vinculado a una oferta de valores.',
  },
  {
    term: 'Token de utilidad',
    definition:
      'Es un tipo de activo digital que otorga a su poseedor el derecho a acceder a un producto o servicio dentro de un ecosistema específico. En un proyecto forestal, este token puede proporcionar acceso a ciertos beneficios o servicios asociados con el proyecto.',
  },
  {
    term: 'Tokenización',
    definition:
      'Proceso que permite transformar cualquier tipo de activo o dato en una unidad digital llamada token, que puede ser almacenada, transferida y gestionada de forma segura y eficiente.',
  },
  {
    term: 'Tokenomics',
    definition:
      'Se refiere a la ciencia que busca determinar el valor de un criptoactivo. Estudia con detalle el valor de la oferta del activo, su tasa de inflación, su distribución y su utilidad para determinar su éxito y predecir su valor.',
  },
  {
    term: 'Transición energética',
    definition:
      'Es un proceso de cambio de una forma de producción de energía a otra, e incluye fuentes de energía renovables y no renovables.',
  },
  {
    term: 'VCU o UVC (Voluntary Carbon Units)',
    definition:
      'Unidades Verificadas de Carbono, que es el nombre dado a los créditos generados y aprobados en el mercado voluntario.',
  },
];

export const GLOSSARY_TERMS: GlossaryTerm[] = rawTerms
  .map(({ term, definition }) => ({
    id: slugify(term),
    term,
    definition,
  }))
  .sort((a, b) => a.term.localeCompare(b.term, 'es', { sensitivity: 'base' }));

export const getGlossaryLetter = (term: string) => {
  const normalized = term
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .charAt(0)
    .toUpperCase();

  return /[A-Z]/.test(normalized) ? normalized : '#';
};
