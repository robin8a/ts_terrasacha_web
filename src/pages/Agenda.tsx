interface Evento {
  id: number;
  title: string;
  date: string;
  time?: string;
  location: string;
  description: string;
  type?: 'workshop' | 'conference' | 'field' | 'meeting';
  image?: string;
}

const Agenda = () => {
  const eventos: Evento[] = [
    {
      id: 1,
      title: 'Taller de Reforestación con Biotecnología',
      date: '15 de Febrero, 2024',
      time: '9:00 AM - 5:00 PM',
      location: 'Puerto López, Meta',
      description: 'Taller práctico sobre la implementación de tecnologías emergentes en reforestación. Incluye demostración de técnicas de biotecnología aplicada y visita a plantaciones forestales comerciales.',
      type: 'workshop',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBl3OoPDGU3r7Ccf1MClOOw5-Q0B37o05cLb7E_RXGVj-1t8xtVIRLV5bP7v3R_TxwgwshMsPzybhjKiRQT40NWR11nfoWNyosbNJ1WsuV7IF2h7NkbrbLcIvUMnlgQ4Ez764l0TOHrfZoT9Cq_5F3n6DZurfzlJ15Dg_ViYLMHzg4EMqU7YGGwkn5g91Eh8BniAaFwVIKKLVRjqvp-64mAcp1ZPN1LCMEkPDQqg69F-NdBsWoI-sOi7u-9QQMCGm3xx79dEPrybeg',
    },
    {
      id: 2,
      title: 'Conferencia: Tokenización de Activos Ambientales',
      date: '20 de Marzo, 2024',
      time: '2:00 PM - 6:00 PM',
      location: 'Arauca, Arauca',
      description: 'Conferencia sobre modelos innovadores de comercialización de activos ambientales estratégicos. Presentación de casos de éxito y oportunidades de inversión verde.',
      type: 'conference',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBk2q7GjZACYyhhEZkS54h3PPrfjk0k0oTwF6OR8Vinl43DvQfM2CnHmMurydKTLfEiGNibqM0WE5AYnmfN06LmeG25x1xW3qHgQ7EstZYMU41GicIS9PQlofshVnfhTYPOy6qKeEsS0CtmlPEgKtRwcvKUTUfTFOEmM8_PciJTYtXWdCe6akgueZy6hE16nKJr5l1u7ekrhQYFRRvKrN99hKF2Rv6HuRDKMHQ8-on7ZdRqRvuD8zVfUHtxoUfYQcQh8yaaRfOCO9M',
    },
    {
      id: 3,
      title: 'Visita de Campo: Protección de Cuencas Hidrográficas',
      date: '5 de Abril, 2024',
      time: '8:00 AM - 4:00 PM',
      location: 'Puerto Gaitán, Meta',
      description: 'Visita guiada a las zonas de protección de cuencas de agua implementadas por el proyecto. Observación de resultados y técnicas aplicadas en campo.',
      type: 'field',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBq6aILqNU8AMkBEZVtAqt4g90L5myb71xIewfdFFwTYTmFfN72dr2sabgMooJ2E4iS_NAK3gjXIZrILVa673HWOrVtw7mB--orhYFNqXL8ReuxEz4m1gGH5i4328IPKyD-tInD128DtL2NN1XToO89tV0Q5_gp6Iyic9a_p-cLc5ymRUAXAekNDp3loHsX7jMIGDaDpGNsvJtgtrewFD44VndoaVjTy8EarZnNwTSuikpByD99tVJcJ8vlwbvQbaK5v3NjM3ApcyM',
    },
    {
      id: 4,
      title: 'Reunión de Aliados Estratégicos',
      date: '12 de Mayo, 2024',
      time: '10:00 AM - 2:00 PM',
      location: 'Villavicencio, Meta',
      description: 'Reunión con representantes de la Universidad Cooperativa de Colombia, Sistema General de Regalías y autoridades locales para revisar avances del proyecto.',
      type: 'meeting',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA746AcNkQvtwBycTDbq9iKsva21ZBaPeJGMDKHfio8ak7tcx2P7hQFqR7XTEr8A_JpDSSguwYU74XQg9kwOC_pHT25ySsIR5pcQqwStq8laBc8aHapVAWkuKMhy5_SpDQm9dlno3D_39eYVd0vxjivY5LZnb7ClFoaRjDiDaNYgctHipYqeOMbcixWHtaX07_AJscJUleFsWtY6ykmcn1JKlWyYIjeh6ifQyuZoGwlIOJfoaaTWyXMp-DVLyT7qLuNI8iOaGLuJG0',
    },
    {
      id: 5,
      title: 'Seminario: Mecanismos de Inversión Verde',
      date: '25 de Junio, 2024',
      time: '9:00 AM - 1:00 PM',
      location: 'Tame, Arauca',
      description: 'Seminario sobre oportunidades de inversión con enfoque en protección ambiental. Presentación de modelos de monetización de cultivos forestales comerciales.',
      type: 'conference',
    },
  ];

  const getEventTypeColor = (type?: string) => {
    const colorMap: Record<string, string> = {
      'workshop': 'bg-secondary-pradera/20 text-secondary-pradera border-secondary-pradera',
      'conference': 'bg-primary/20 text-primary border-primary',
      'field': 'bg-secondary-claro/20 text-secondary-claro border-secondary-claro',
      'meeting': 'bg-secondary-[amarillo-tierra]/20 text-secondary-[amarillo-tierra] border-secondary-[amarillo-tierra]',
    };
    return colorMap[type || ''] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getEventTypeLabel = (type?: string) => {
    const labelMap: Record<string, string> = {
      'workshop': 'Taller',
      'conference': 'Conferencia',
      'field': 'Visita de Campo',
      'meeting': 'Reunión',
    };
    return labelMap[type || ''] || 'Evento';
  };

  const formatDate = (dateString: string) => {
    return dateString;
  };

  return (
    <main className="font-primary bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full flex items-center justify-center overflow-hidden h-[320px] sm:h-[360px] md:h-[400px] bg-secondary-[bosques-nublados]">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBfQ0n8xHH295DYRfaoDi9YuisSdVJz3OcK25N9XZlrEenPdsNp0bIIJb5drdB4wY9oj_sZL5zqXh2K4gFNHokA8aGDetHJ5mH1srrUogHiqmgCgAehxuDehGRMlXYwM_AlTbD2oua9zgueMUIBLzHlWeNzbClnUrOZMJUMSxU3lS_I247_cIrZiHOT4dyyIj2z77l6nAbJNzpIwSYck1F7xZHwT5kYbqTXgpsWNmlUOLDOhtkC6l_LxGw4ZQHS-_Qcs1caMUU4fQ"
            alt="Bosque y naturaleza"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        {/* Overlay Text */}
        <div className="relative z-10 text-center px-4">
          <h1 className="font-slogan uppercase mb-3 sm:mb-4 text-white drop-shadow-2xl text-4xl sm:text-5xl md:text-6xl lg:text-[5rem] tracking-[0.08em]">
            AGENDA
          </h1>
          <p className="text-sm sm:text-base md:text-lg font-light text-white max-w-2xl mx-auto drop-shadow-lg">
            Eventos de innovación, conciencia, transformación y educación del proyecto Terrasacha.
          </p>
        </div>
      </section>

      {/* Filtros (solo visuales) */}
      <section className="bg-white border-b border-gray-200 py-4 shadow-sm">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            {/* Tipo de evento */}
            <div className="relative w-full md:w-auto">
              <select
                className="w-full md:w-48 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 font-primary"
                aria-label="Filtrar por tipo de evento"
              >
                <option>Filtrar por tipo</option>
                <option>Educación</option>
                <option>Innovación</option>
                <option>Campo</option>
                <option>Reuniones</option>
              </select>
            </div>
            {/* Fecha */}
            <div className="relative w-full md:w-auto">
              <select
                className="w-full md:w-48 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 font-primary"
                aria-label="Filtrar por fecha"
              >
                <option>Fecha</option>
                <option>Esta semana</option>
                <option>Este mes</option>
              </select>
            </div>
            {/* Ubicación */}
            <div className="relative w-full md:w-auto">
              <select
                className="w-full md:w-48 border border-gray-300 rounded-md py-2 pl-3 pr-8 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-gray-50 font-primary"
                aria-label="Filtrar por ubicación"
              >
                <option>Ubicación</option>
                <option>Meta</option>
                <option>Arauca</option>
                <option>Virtual</option>
              </select>
            </div>
            {/* Búsqueda */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Buscar evento..."
                className="w-full border border-gray-300 rounded-md py-2 px-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary bg-white font-primary"
                aria-label="Buscar evento por nombre o descripción"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8 sm:mb-10 md:mb-12">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-secondary-[bosques-nublados] font-primary">
                Lista de Eventos
              </h2>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg font-primary">
                Eventos de innovación, conciencia, transformación y educación del proyecto Terrasacha.
              </p>
            </div>

            {/* Events Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {eventos.map((evento, index) => {
                const isEven = index % 2 === 0;
                return (
                  <article
                    key={evento.id}
                    className={`flex flex-col sm:flex-row bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border-[3px] ${
                      isEven ? 'border-secondary-pradera' : 'border-primary'
                    }`}
                  >
                    {evento.image && (
                      <div className="sm:w-2/5 h-48 sm:h-auto relative">
                        <img
                          src={evento.image}
                          alt={evento.title}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <div className="sm:w-3/5 p-4 sm:p-5 md:p-6 flex flex-col justify-between">
                      <div>
                        {evento.type && (
                          <span
                            className={`inline-block mb-3 px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wide border ${getEventTypeColor(
                              evento.type
                            )}`}
                          >
                            {getEventTypeLabel(evento.type)}
                          </span>
                        )}
                        <div className="text-xs sm:text-sm text-gray-600 space-y-1 mb-2 font-primary">
                          <p>
                            <span className="inline-flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              <span>
                                {formatDate(evento.date)}
                                {evento.time ? `, ${evento.time}` : ''}
                              </span>
                            </span>
                          </p>
                          <p>
                            <span className="inline-flex items-center gap-2">
                              <svg
                                className="w-4 h-4 text-primary"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              <span>{evento.location}</span>
                            </span>
                          </p>
                        </div>
                        <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-secondary-[bosques-nublados] leading-tight mb-2">
                          {evento.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-600 line-clamp-3 font-primary">
                          {evento.description}
                        </p>
                      </div>
                      <div className="mt-4">
                        <button className="bg-primary hover:bg-primary-dark text-white font-semibold py-2 px-5 rounded-md text-xs sm:text-sm transition-colors">
                          Ver Detalles
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Paginación (solo visual) */}
            <div className="mt-10 sm:mt-12 flex justify-center">
              <nav aria-label="Paginación de eventos" className="inline-flex rounded-md shadow-sm space-x-2">
                <button
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md"
                  aria-label="Primera página"
                >
                  ««
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md"
                  aria-label="Página anterior"
                >
                  «
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-4 py-2 border border-primary bg-primary text-xs sm:text-sm font-medium text-white rounded-md"
                  aria-current="page"
                >
                  1
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md"
                  aria-label="Página siguiente"
                >
                  »
                </button>
                <button
                  type="button"
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50 rounded-md"
                  aria-label="Última página"
                >
                  »»
                </button>
              </nav>
            </div>

            {/* Call to Action */}
            <div className="mt-10 sm:mt-12 md:mt-16 lg:mt-20 bg-gradient-to-br from-secondary-claro/20 to-secondary-pradera/20 rounded-lg sm:rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 lg:p-10 text-center border-l-4 border-primary">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 sm:mb-3 md:mb-4 text-secondary-[bosques-nublados] font-primary">
                ¿Quieres participar en nuestros eventos?
              </h3>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg mb-4 sm:mb-5 md:mb-6 font-primary max-w-2xl mx-auto leading-relaxed">
                Mantente informado sobre nuestros próximos eventos y actividades. Contáctanos para más información.
              </p>
              <a
                href="/contacto"
                className="inline-block bg-primary text-white px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-full font-semibold hover:bg-primary-dark transition-colors text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg"
              >
                Contáctanos
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Agenda;

