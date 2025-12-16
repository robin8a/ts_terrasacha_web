import { Link } from 'react-router-dom';

interface Noticia {
  id: number;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  category?: string;
}

const Noticias = () => {
  const noticias: Noticia[] = [
    {
      id: 1,
      title: 'Avances en Reforestación con Biotecnología en los Llanos Orientales',
      date: '15 de Enero, 2024',
      excerpt: 'El proyecto Terrasacha ha logrado importantes avances en la implementación de tecnologías emergentes para la reforestación de cuencas hidrográficas en los departamentos de Meta y Arauca.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDs-JzHyDr_4LCCIM-uLyVIaAB1bbN-cog4lv4pE9tY_CXBaX71SkFllPs939tI7J3t5G41qXUvmpP1iJC4AqDE_0lLHg_n2ikjabhJwj8u68_1UymdZIbJDH5qD8_lAF5dEu5Hbl6Ug0_Y1X_LnOb67OLcUtRCWSFB4aQ98pyPnmAluNc-xoCJNYoQOWtphwOPxmFAvzId_-5tYdO_tKxZUg2C2scrDQGqLFN1Q3Mx7a8MLydAmV1pTRGe_KoPn8S7s-0QizC5qb4',
      category: 'Tecnología',
    },
    {
      id: 2,
      title: 'Tokenización de Activos Ambientales: Nuevo Modelo de Comercialización',
      date: '10 de Enero, 2024',
      excerpt: 'Se implementa un modelo innovador de comercialización de activos ambientales estratégicos que permite la monetización de cultivos forestales comerciales.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDWV1cWu-nIVbeRcQOJTCcsc7WjuXllcFBWUKDcjB-a3hqKdUKApWBXhR-oL11uQR39sn9Kdojpc42p5pOL0WshxnPfEkGKFwok2JDsgd-LfMS7ksge2zTF-MA50eMNx_LLVyytdpR2Nw5c9AHXYoRlvm70zNc8OMU2MHboeAqoFilsFC1baEeBtqE2I6381jz3HK21BVDqBleM50bxdC9IlEp4xVZidpC9hgo8XGFuKD75iSjRSpSAcQ6XXLc_iUfPjwvbNRwQzoQ',
      category: 'Innovación',
    },
    {
      id: 3,
      title: 'Protección de Cuencas de Agua: Resultados del Primer Trimestre',
      date: '5 de Enero, 2024',
      excerpt: 'Los primeros resultados del proyecto muestran un impacto positivo en la protección de cuencas de agua y suelos mediante reforestación con tecnologías emergentes.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDR-i7Y-bN4gphd6XWMf4NU3S6EU6bRIMfu4Wr3vln9v6VWz1dooGVebGhE28fbpnQCCp2x4ZcbL07yRYCAtDfxIq-mAgdACkjbV7NwKt5JEdMBqnfcEoNUYJqkPG_7nR2lwL5Ge4TwELoQVaF45U4Zs0yXXAwKrOVZ_lfC7NuQR-btMu9YmfNT1DcWm8p4GC7sW2ZqS_V8evT8ckB46gixcSawhDCpnm5Vx799K_5_lhEr6GWb6RyNGmjBQMlQr2L40EisO-xpfkM',
      category: 'Sostenibilidad',
    },
    {
      id: 4,
      title: 'Alianza Estratégica: Universidad Cooperativa de Colombia y Sistema General de Regalías',
      date: '28 de Diciembre, 2023',
      excerpt: 'Se fortalece la alianza entre la Universidad Cooperativa de Colombia y el Sistema General de Regalías para continuar con el proyecto de protección ambiental.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUQeeHGKHSJdg0yBwel2k4G7yk4Jnd3rK0HDbUqQuqKNYUTuH9Kho9ulxvWitCVqWIxmbpazn_5LaMGuN3pilfAHVM8isEGtFvPd9CW6QvCxyY7mxTFJH6TYDlNkGNdTRy9Vy2C36LD5kU7uuvu7Arhj-EN91GjdmUvm2Cjk_g_A5UFQtuKSzf_CPl3OpHzXpGl9MBfnetfkTrIB-ogxmdxDdpHD5CWTeE0uPeA4AFXDX5D2sb7tfet62Y_gmLQV6euUBEK6mS2Qo',
      category: 'Alianzas',
    },
    {
      id: 5,
      title: 'Impacto en 400 Hectáreas de Plantaciones Forestales Comerciales',
      date: '20 de Diciembre, 2023',
      excerpt: 'El proyecto ha logrado impactar positivamente en 400 hectáreas de plantaciones forestales comerciales en la región de los Llanos Orientales.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBvoGkugf7XjCiZre_bCrBEW5xqKRHi87jRtyO9V9kD-zjxSyDEU-1n5WDOXrTJyXxfxpbF-QFd5GB7hLnuoprGwNJMKuzNtZo8yBPp9sR-562UxXtxgkbDiOww_b0z_g_WN0-J1XydyqmQh9IaYzJF_uhLGEf2CHMdBhTory27QiokQOo-Wdj3XJk_i119Gj5V8-cXgycX2CWp9Rf8LzYKD6YNV989RWfd7L8U1mD1Paz1J15ZhxI9lGIzIayKDxIfbM01G2DxEH4',
      category: 'Impacto',
    },
  ];

  const formatDate = (dateString: string) => {
    return dateString;
  };

  const getCategoryBadgeClasses = (category?: string) => {
    const map: Record<string, string> = {
      'Tecnología': 'bg-primary text-white',
      'Innovación': 'bg-secondary-pradera text-white',
      'Sostenibilidad': 'bg-secondary-claro text-white',
      'Alianzas': 'bg-secondary-[amarillo-tierra] text-white',
      'Impacto': 'bg-secondary-[bosques-nublados] text-white',
    };
    return map[category || ''] || 'bg-gray-700 text-white';
  };

  const featured = noticias[0];
  const sidebarItems = noticias.slice(1, 4);
  const remaining = noticias.slice(1); // Para \"Todas las noticias\" mostramos todas menos la destacada

  return (
    <main className="font-primary bg-gray-50 min-h-screen">
      <section className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        {/* Título de página */}
        <h1 className="text-4xl sm:text-5xl lg:text-5xl font-black text-gray-900 mb-10 sm:mb-12 tracking-tight">
          NOTICIAS
        </h1>

        {/* Sección superior: destacada + sidebar */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 lg:mb-16">
          {/* Noticia destacada */}
          {featured && (
            <article className="lg:col-span-8 bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col md:flex-row h-full">
              {/* Imagen */}
              {featured.image && (
                <div className="md:w-1/2 relative h-56 sm:h-64 md:h-auto">
                  <img
                    src={featured.image}
                    alt={featured.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
              )}

              {/* Contenido */}
              <div className="md:w-1/2 p-5 sm:p-6 md:p-8 flex flex-col justify-center">
                {featured.category && (
                  <div className="mb-3 sm:mb-4">
                    <span
                      className={`inline-block px-3 py-1 text-[10px] sm:text-xs font-bold tracking-wider uppercase rounded-full ${getCategoryBadgeClasses(
                        featured.category
                      )}`}
                    >
                      {featured.category}
                    </span>
                    <p className="mt-2 text-xs sm:text-sm text-gray-500 font-primary">
                      {formatDate(featured.date)}
                    </p>
                  </div>
                )}
                {!featured.category && (
                  <p className="text-xs sm:text-sm text-gray-500 mb-2 font-primary">
                    {formatDate(featured.date)}
                  </p>
                )}

                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-secondary-[bosques-nublados] mb-3 sm:mb-4 leading-tight">
                  {featured.title}
                </h2>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed font-primary">
                  {featured.excerpt}
                </p>
              </div>
            </article>
          )}

          {/* Sidebar Más Noticias */}
          <aside className="lg:col-span-4 bg-white rounded-xl sm:rounded-2xl shadow-sm p-5 sm:p-6 border border-gray-100 flex flex-col h-full">
            <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-5 sm:mb-6 uppercase tracking-wide">
              MÁS NOTICIAS
            </h3>
            <div className="space-y-5 sm:space-y-6 flex-grow">
              {sidebarItems.map((noticia) => (
                <div key={noticia.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    {noticia.category && (
                      <span
                        className={`px-3 py-1 text-[10px] sm:text-xs font-bold uppercase rounded-full ${getCategoryBadgeClasses(
                          noticia.category
                        )}`}
                      >
                        {noticia.category}
                      </span>
                    )}
                    <span className="text-[11px] sm:text-xs text-gray-500 font-primary">
                      {formatDate(noticia.date)}
                    </span>
                  </div>
                  <p className="text-sm sm:text-base font-bold text-secondary-[bosques-nublados] leading-snug">
                    {noticia.title}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        {/* Sección inferior: todas las noticias */}
        <section>
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-gray-900 mb-5 sm:mb-6 uppercase tracking-wide">
            TODAS LAS NOTICIAS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {remaining.map((noticia) => (
              <article
                key={noticia.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all"
              >
                {noticia.image && (
                  <div className="h-40 sm:h-44 md:h-48 relative">
                    <img
                      src={noticia.image}
                      alt={noticia.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    {noticia.category && (
                      <span
                        className={`absolute top-3 left-3 px-3 py-1 text-[10px] sm:text-xs font-bold uppercase rounded-full ${getCategoryBadgeClasses(
                          noticia.category
                        )}`}
                      >
                        {noticia.category}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <span className="text-[11px] sm:text-xs text-gray-500 mb-2 block font-primary">
                    {formatDate(noticia.date)}
                  </span>
                  <h4 className="text-base sm:text-lg font-bold text-secondary-[bosques-nublados] mb-2 leading-snug">
                    {noticia.title}
                  </h4>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-1 flex-grow font-primary">
                    {noticia.excerpt}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
};

export default Noticias;

