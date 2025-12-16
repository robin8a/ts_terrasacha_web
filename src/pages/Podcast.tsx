interface Episodio {
  id: number;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: 'sostenibilidad' | 'tecnologia' | 'inversion' | 'descarbonizacion';
  featured?: boolean;
  imageUrl?: string;
}

const Podcast = () => {
  const episodios: Episodio[] = [
    {
      id: 1,
      title: 'Descarbonización y Sostenibilidad: El Futuro de los Llanos Orientales',
      description: 'Exploramos las estrategias de descarbonización y cómo la sostenibilidad puede transformar la región de los Llanos Orientales. Incluye entrevistas con expertos en protección ambiental.',
      duration: '45 min',
      date: '15 de Enero, 2024',
      category: 'descarbonizacion',
      featured: true,
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDX-5uGiLIXFUFE4px-EOcBZeAF_KxJxaCLGMxg5UDBDNUIPrR7lufG4YxCwL8oxxpQs9rm98Ph4oqdnPSPXkFsiKi7VXkwAc2IO32atHfj1uc2okPt4oC0fVykcZmQdBSUDDg-RvkTkHLgAHYUKyGGGgwpgogI74AopA3KhCqkhQ56UaAbxpngjN9kWx3Wg56W1eRTppICdJ7CNLNKjaHg4Mo_O7MkVI1KhxOhNGxmNxT-JLKaOXJ324P5N_t0WAmm0u8vEjSkDKk',
    },
    {
      id: 2,
      title: 'Tokenización de Activos Ambientales: Oportunidades y Desafíos',
      description: 'Análisis profundo sobre la tokenización de activos ambientales estratégicos y cómo este modelo innovador puede financiar proyectos de conservación.',
      duration: '38 min',
      date: '22 de Enero, 2024',
      category: 'inversion',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBR203dcsTU8Oh5dZ2zmpWLkloBN5oxGJQCXVMH53F-bKTT_a2IB3XFSYtV60KamjE4u5W_v5nnITToXdYfcrnA-GdHO0S46tF6R8mvSFyOeIuoQiQrzMG5LBS1jBfsF8vCZ1xjmo4QcOMtK2ZAlMIaSsSTCtcG04F0ZWD9G9396Q4qRKvKy5d-QcXUY_eoj_H_pssI2_zuX2fvTxFIgJ7FCLXtaJnRb-37VgdAK5NRR3gyxZI5eQXyRmEMijyX-4MnGe2OnqMipbM',
    },
    {
      id: 3,
      title: 'Biotecnología Aplicada a la Reforestación',
      description: 'Conoce cómo las tecnologías emergentes y la biotecnología están revolucionando los procesos de reforestación en los departamentos de Meta y Arauca.',
      duration: '42 min',
      date: '29 de Enero, 2024',
      category: 'tecnologia',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAGoyUKMtYMuVID0DF9QnsoQs6WSPZzfPOBdKxoncFWa5GKr-QhUFPuPDeALTd9NtMFXOiBjtg82duE022QLdabqu_NlwM_41by8GrFEjLsgtNuCd7MVpx6E0ilOVosBHVg9F_LtuP0AQFB0EVeUSBPUfGXT5LcyKM6RfmvAejG7-K7Mug1HHLPzSEqGth42e1nqvDnnQMGodTDjfcATp8xl7mS_KpDZCfXD7hNieIGrssbJV1shi_t7ZyD3dgkJeC5LiBhMeG8ICQ',
    },
    {
      id: 4,
      title: 'Mecanismos de Inversión Verde: Casos de Éxito',
      description: 'Revisión de casos exitosos de inversión con enfoque de protección ambiental y cómo replicarlos en la región de los Llanos Orientales.',
      duration: '35 min',
      date: '5 de Febrero, 2024',
      category: 'inversion',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCyfM2hltaoS5Pn6uIYSuFbsJf8AwiEOP1r7u_EHMFaSgNEGZu3IrcwPlhUCWAvGHhFSONbxxuyf9XdMz7uT0WYFut18sL9IvMvyRHo4ZDN3Bfx2p8j-6KDYVYXSN76qm1ZafLIndvK8eGo4bWM-emAEvaAJTJFzA-GEIMtrD_wpfgfBTmZDVHaRM2J5xG060DwgzRE9ShpeCyNyhpef6QrIzeHs-pONB_OsP99msxh_V3X-Mz6G5eVRcOZmlJeiCqj1FmNpQ6MC2Y',
    },
    {
      id: 5,
      title: 'Protección de Cuencas Hidrográficas: Estrategias Integrales',
      description: 'Estrategias integrales para la conservación y protección de cuencas de agua, garantizando la disponibilidad del recurso hídrico para futuras generaciones.',
      duration: '40 min',
      date: '12 de Febrero, 2024',
      category: 'sostenibilidad',
      imageUrl:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAGoyUKMtYMuVID0DF9QnsoQs6WSPZzfPOBdKxoncFWa5GKr-QhUFPuPDeALTd9NtMFXOiBjtg82duE022QLdabqu_NlwM_41by8GrFEjLsgtNuCd7MVpx6E0ilOVosBHVg9F_LtuP0AQFB0EVeUSBPUfGXT5LcyKM6RfmvAejG7-K7Mug1HHLPzSEqGth42e1nqvDnnQMGodTDjfcATp8xl7mS_KpDZCfXD7hNieIGrssbJV1shi_t7ZyD3dgkJeC5LiBhMeG8ICQ',
    },
    {
      id: 6,
      title: 'Comunidades Locales y Desarrollo Sostenible',
      description: 'El papel de las comunidades locales en el desarrollo sostenible y cómo los proyectos ambientales pueden beneficiar directamente a las poblaciones.',
      duration: '33 min',
      date: '19 de Febrero, 2024',
      category: 'sostenibilidad',
    },
  ];

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string; badge: string }> = {
      'descarbonizacion': {
        bg: 'bg-secondary-pradera/10',
        border: 'border-secondary-pradera',
        text: 'text-secondary-pradera',
        badge: 'bg-secondary-pradera',
      },
      'inversion': {
        bg: 'bg-primary/10',
        border: 'border-primary',
        text: 'text-primary',
        badge: 'bg-primary',
      },
      'tecnologia': {
        bg: 'bg-secondary-claro/10',
        border: 'border-secondary-claro',
        text: 'text-secondary-claro',
        badge: 'bg-secondary-claro',
      },
      'sostenibilidad': {
        bg: 'bg-secondary-[amarillo-tierra]/10',
        border: 'border-secondary-[amarillo-tierra]',
        text: 'text-secondary-[amarillo-tierra]',
        badge: 'bg-secondary-[amarillo-tierra]',
      },
    };
    return colorMap[category] || colorMap['sostenibilidad'];
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'descarbonizacion': 'Descarbonización',
      'inversion': 'Inversión',
      'tecnologia': 'Tecnología',
      'sostenibilidad': 'Sostenibilidad',
    };
    return labels[category] || category;
  };

  const featuredEpisode = episodios.find(ep => ep.featured) || episodios[0];
  const otherEpisodes = episodios.filter(ep => ep.id !== featuredEpisode.id);

  return (
    <main className="font-primary bg-gray-50 min-h-screen">
      <section className="container mx-auto px-4 md:px-8 py-10">
        {/* Título de página */}
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-10 sm:mb-12 text-secondary-[bosques-nublados]">
          PODCAST
        </h1>

        {/* Intro Section */}
        <section className="mb-10 sm:mb-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-3xl">
              <h2 className="text-sm sm:text-base font-bold uppercase tracking-wide mb-2 text-secondary-[bosques-nublados]">
                Sobre Nuestro Podcast
              </h2>
              <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">
                Escucha nuestros podcasts sobre descarbonización, sostenibilidad, tokenización de
                activos y mecanismos de inversión con enfoque de protección ambiental. Cada episodio explora
                temas relevantes para el desarrollo sostenible de los Llanos Orientales, con entrevistas a expertos
                y análisis de casos de éxito.
              </p>
            </div>
            {/* Mic Icon */}
            <div className="mt-2 md:mt-0 flex-shrink-0">
              <div className="h-16 w-16 sm:h-20 sm:w-20 text-primary bg-gray-100 rounded-full p-3 flex items-center justify-center">
                <svg
                  className="h-10 w-10"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Episode */}
        <section className="mb-12 sm:mb-14">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col lg:flex-row hover:shadow-md transition-shadow">
            {/* Imagen destacada */}
            {featuredEpisode.imageUrl && (
              <div className="relative h-64 lg:h-auto lg:w-3/5">
                <img
                  src={featuredEpisode.imageUrl}
                  alt={featuredEpisode.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 bg-secondary-[bosques-nublados] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                  Episodio Destacado
                </div>
              </div>
            )}

            {/* Contenido destacado */}
            <div className="p-6 sm:p-8 flex flex-col justify-center items-start lg:w-2/5">
              {featuredEpisode && (() => {
                const colors = getCategoryColor(featuredEpisode.category);
                return (
                  <>
                    <span
                      className={`${colors.badge} text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase`}
                    >
                      {getCategoryLabel(featuredEpisode.category)}
                    </span>
                    <span className="text-gray-500 text-xs sm:text-sm font-medium mb-2">
                      {featuredEpisode.date} • {featuredEpisode.duration}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-bold text-secondary-[bosques-nublados] mb-3 leading-tight">
                      {featuredEpisode.title}
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base">
                      {featuredEpisode.description}
                    </p>
                    <button className="bg-primary text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-md hover:bg-primary-dark transition-colors">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Reproducir episodio
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        </section>

        {/* All Episodes */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide mb-6 text-secondary-[bosques-nublados]">
            Todos los Episodios
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {otherEpisodes.map((episodio, index) => {
              const colors = getCategoryColor(episodio.category);
              return (
                <article
                  key={episodio.id}
                  className="bg-white rounded-lg border border-gray-100 shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
                >
                  {episodio.imageUrl && index < 4 && (
                    <div className="relative h-40 sm:h-48">
                      <img
                        src={episodio.imageUrl}
                        alt={episodio.title}
                        className="w-full h-full object-cover rounded-t-lg"
                        loading="lazy"
                      />
                      <div className={`${colors.badge} absolute top-3 left-3 text-[10px] font-bold px-2 py-1 rounded uppercase text-white`}>
                        {getCategoryLabel(episodio.category)}
                      </div>
                    </div>
                  )}
                  <div className="p-5 flex flex-col flex-1">
                    <span className="text-xs text-gray-500 mb-2">
                      {episodio.date} • {episodio.duration}
                    </span>
                    <h4 className="text-lg font-bold text-secondary-[bosques-nublados] mb-3 leading-snug line-clamp-2">
                      {episodio.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                      {episodio.description}
                    </p>
                    <div className="mt-auto pt-2">
                      <button className="bg-secondary-[bosques-nublados] rounded-full p-2 hover:bg-primary transition-colors shadow-md">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Podcast;

