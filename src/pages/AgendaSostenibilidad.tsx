const AgendaSostenibilidad = () => {
  const iniciativas = [
    {
      id: 1,
      title: 'Protección de Cuencas Hidrográficas',
      description: 'Implementación de estrategias integrales para la conservación y protección de las cuencas de agua en los Llanos Orientales, garantizando la disponibilidad del recurso hídrico para las generaciones futuras.',
      icon: '💧',
      color: 'secondary-pradera',
    },
    {
      id: 2,
      title: 'Reforestación con Biotecnología',
      description: 'Aplicación de tecnologías emergentes y biotecnología en procesos de reforestación para maximizar el impacto ambiental positivo y la recuperación de ecosistemas degradados.',
      icon: '🌳',
      color: 'primary',
    },
    {
      id: 3,
      title: 'Monetización de Activos Ambientales',
      description: 'Desarrollo de modelos innovadores de comercialización de activos ambientales estratégicos que permitan la sostenibilidad financiera de los proyectos de conservación.',
      icon: '💰',
      color: 'secondary-claro',
    },
    {
      id: 4,
      title: 'Cultivos Forestales Comerciales',
      description: 'Fortalecimiento de modelos de protección y monetización de cultivos forestales comerciales para los departamentos de Meta y Arauca, combinando sostenibilidad y rentabilidad.',
      icon: '🌲',
      color: 'secondary-[amarillo-tierra]',
    },
    {
      id: 5,
      title: 'Tecnologías Emergentes',
      description: 'Integración de tecnologías de vanguardia en procesos de monitoreo, gestión y protección ambiental para optimizar resultados y eficiencia operativa.',
      icon: '🔬',
      color: 'secondary-[bosques-nublados]',
    },
    {
      id: 6,
      title: 'Educación y Capacitación',
      description: 'Programas de formación y sensibilización dirigidos a comunidades locales sobre prácticas sostenibles, conservación ambiental y gestión responsable de recursos naturales.',
      icon: '📚',
      color: 'secondary-pradera',
    },
  ];

  const objetivos = [
    {
      title: 'Conservación',
      description: 'Proteger y conservar los ecosistemas estratégicos de la región de los Llanos Orientales.',
    },
    {
      title: 'Innovación',
      description: 'Aplicar tecnologías emergentes y biotecnología para maximizar el impacto positivo.',
    },
    {
      title: 'Sostenibilidad',
      description: 'Desarrollar modelos económicos sostenibles que beneficien a las comunidades locales.',
    },
    {
      title: 'Impacto',
      description: 'Generar resultados medibles y tangibles en protección ambiental y desarrollo regional.',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      'secondary-pradera': {
        bg: 'bg-secondary-pradera/10',
        border: 'border-secondary-pradera',
        text: 'text-secondary-pradera',
      },
      'primary': {
        bg: 'bg-primary/10',
        border: 'border-primary',
        text: 'text-primary',
      },
      'secondary-claro': {
        bg: 'bg-secondary-claro/10',
        border: 'border-secondary-claro',
        text: 'text-secondary-claro',
      },
      'secondary-[amarillo-tierra]': {
        bg: 'bg-secondary-[amarillo-tierra]/10',
        border: 'border-secondary-[amarillo-tierra]',
        text: 'text-secondary-[amarillo-tierra]',
      },
      'secondary-[bosques-nublados]': {
        bg: 'bg-secondary-[bosques-nublados]/10',
        border: 'border-secondary-[bosques-nublados]',
        text: 'text-secondary-[bosques-nublados]',
      },
    };
    return colorMap[color] || colorMap['primary'];
  };

  return (
    <main className="font-primary bg-gray-50">
      {/* Hero Section */}
      <section className="py-10 sm:py-12 md:py-16 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-secondary-[bosques-nublados] uppercase tracking-wide mb-4">
            Agenda de Sostenibilidad
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto">
            Innovación, Conciencia, Transformación, Educación, Responsabilidad
          </p>
        </div>
      </section>

      {/* Commitment Section */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <div className="bg-secondary-claro/20 rounded-xl p-6 sm:p-8 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 font-primary">
                <span className="text-secondary-[bosques-nublados]">Nuestro</span>{' '}
                <span className="text-primary">Compromiso</span>
              </h2>
              <p className="text-gray-700 leading-relaxed font-primary text-sm sm:text-base">
                La Agenda de Sostenibilidad de Terrasacha incluye iniciativas y proyectos enfocados
                en la protección ambiental, reforestación y desarrollo sostenible en la región de los
                Llanos Orientales. Nuestro compromiso es implementar acciones concretas para la protección de cuencas de
                agua y suelos, utilizando tecnologías emergentes y biotecnología para maximizar el
                impacto positivo en el medio ambiente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Initiatives Section */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-primary">
              <span className="text-secondary-[bosques-nublados]">Nuestras</span>{' '}
              <span className="text-secondary-pradera">Iniciativas</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {iniciativas.map((iniciativa) => {
                const colors = getColorClasses(iniciativa.color);
                return (
                  <article
                    key={iniciativa.id}
                    className={`bg-white rounded-lg p-6 border-t-5 ${colors.border} hover:shadow-lg transition-shadow flex flex-col shadow`}
                    style={{ borderTopWidth: '5px' }}
                  >
                    <div className="mb-4">
                      <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center text-2xl sm:text-3xl`}>
                        {iniciativa.icon}
                      </div>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 font-primary">
                      {iniciativa.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-primary flex-1">
                      {iniciativa.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 font-primary">
              <span className="text-primary">Objetivos</span>{' '}
              <span className="text-secondary-pradera">de Sostenibilidad</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {objetivos.map((objetivo, index) => {
                const colorIndex = index % 4;
                const colorClasses = [
                  { text: 'text-secondary-pradera' },
                  { text: 'text-primary' },
                  { text: 'text-secondary-claro' },
                  { text: 'text-secondary-pradera' },
                ];
                const colors = colorClasses[colorIndex];
                
                return (
                  <div
                    key={objetivo.title}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className={`text-[4rem] sm:text-[5rem] font-black ${colors.text} mb-4 leading-none`}>
                      {index + 1}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 font-primary">
                      {objetivo.title}
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-primary">
                      {objetivo.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-8 sm:py-10 md:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-primary">
              <span className="text-secondary-[bosques-nublados]">Impacto</span>{' '}
              <span className="text-secondary-claro">Esperado</span>
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-secondary-pradera text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <span className="text-gray-700 font-medium font-primary">
                  Protección de <strong className="text-secondary-[bosques-nublados]">400 hectáreas</strong> de plantaciones forestales comerciales
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-secondary-pradera text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <span className="text-gray-700 font-medium font-primary">
                  Conservación de <strong className="text-secondary-[bosques-nublados]">1,630 hectáreas</strong> de bosques naturales
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-secondary-pradera text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <span className="text-gray-700 font-medium font-primary">
                  Impacto positivo en <strong className="text-secondary-[bosques-nublados]">4 municipios</strong> de los departamentos de Meta y Arauca
                </span>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-6 h-6 rounded-full bg-secondary-pradera text-white flex items-center justify-center font-bold text-sm">
                    ✓
                  </div>
                </div>
                <span className="text-gray-700 font-medium font-primary">
                  Desarrollo de modelos sostenibles de <strong className="text-secondary-[bosques-nublados]">comercialización de activos ambientales</strong>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-10 sm:py-12 md:py-16 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-3 font-primary">
              <span className="text-primary">Llamado a la</span>{' '}
              <span className="text-secondary-pradera">Acción</span>
            </h2>
            <p className="text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto font-primary text-sm sm:text-base">
              Sé parte del cambio. Colabora y transforma el futuro con Terrasacha.
            </p>
            <a
              href="/contacto"
              className="inline-block bg-primary text-white font-semibold py-3 px-6 sm:px-8 rounded-full shadow-lg hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-bold text-sm sm:text-base"
            >
              Únete a Nuestros Esfuerzos
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AgendaSostenibilidad;

