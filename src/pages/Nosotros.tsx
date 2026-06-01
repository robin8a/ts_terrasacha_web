const involvedActorsRows = [
  { role: 'Proponente', body: 'Universidad Cooperativa de Colombia' },
  { role: 'Aliados', body: 'Corporación INNprende y Gobernación del Meta' },
  {
    role: 'Beneficiarios',
    body:
      'Departamento de Arauca (Arauca y Tame) y Departamento del Meta (Puerto López y Puerto Gaitán)',
  },
  { role: 'Recursos de financiación', body: 'Sistema General de Regalías' },
] as const;

const Nosotros = () => {
  const impactPillars = [
    {
      ods: 'ODS 9',
      title: 'Industria, Innovación e Infraestructura',
      whatWeDo:
        'Implementamos tecnología 4.0, semilleros inteligentes y reforestación con drones para optimizar la captura de carbono.',
      impact:
        'Modernizamos el campo con procesos automatizados que aumentan la eficiencia y reducen costos.',
      image: '/ods9.png',
    },
    {
      ods: 'ODS 13',
      title: 'Acción por el Clima',
      whatWeDo:
        'Mitigamos el cambio climático mediante la captura de gases de efecto invernadero y la descarbonización en Meta y Arauca.',
      impact:
        'Frenamos el deterioro ambiental y protegemos activos naturales estratégicos para el futuro.',
      image: '/ods13.jpg',
    },
    {
      ods: 'ODS 15',
      title: 'Vida de Ecosistemas Terrestres',
      whatWeDo:
        'Restauramos suelos y cuencas, frenando la expansión de la ganadería extensiva en zonas de especial interés ecológico.',
      impact:
        'Devolvemos la salud a los acuíferos de la cuenca del río Orinoco y protegemos la biodiversidad del suelo.',
      image: '/ods15.png',
    },
    {
      ods: 'ODS 17',
      title: 'Alianzas para lograr los Objetivos',
      whatWeDo:
        'Creamos una plataforma blockchain que permite comercializar activos ambientales de forma transparente y sin intermediarios.',
      impact:
        'Conectamos la inversión privada con la conservación, garantizando flujo de caja directo para quienes cuidan el bosque.',
      image: '/ods17.png',
    },
  ];

  const actorsCarouselLogos = [
    { src: '/Universidad%20cooperativa.jpeg', alt: 'Universidad Cooperativa de Colombia' },
    { src: '/imprende.jpeg', alt: 'Corporación INNprende' },
    { src: '/Meta.jpeg', alt: 'Gobernación del Meta' },
    { src: '/aracuca.png', alt: 'Gobernación de Arauca' },
    { src: '/sistema%20general%20de%20regalias.jpeg', alt: 'Sistema General de Regalías' },
    { src: '/tame.jpeg', alt: 'Municipio de Tame' },
    { src: '/lopez.jpeg', alt: 'Municipio de Puerto López' },
    { src: '/gaitan.jpeg', alt: 'Municipio de Puerto Gaitán' },
  ];
  const actorsCarouselTrack = [...actorsCarouselLogos, ...actorsCarouselLogos];

  return (
    <main className="font-primary">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/assets/videos/bg.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-white mb-4 tracking-slogan uppercase font-slogan drop-shadow-lg">
            NOSOTROS
          </h1>
          <p className="text-lg sm:text-xl text-white max-w-2xl mx-auto font-light font-primary">
            Ciencia y Naturaleza en perfecta armonía
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex flex-col md:flex-row items-center gap-12 sm:gap-16 md:gap-20 lg:gap-[80px]">
            {/* Image Column */}
            <div className="w-full md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBm2-oe0OG1mu56yvbKKsXDyUYtRLTwwWHZygpy-Pu1zDEAY721ZjuGVdjiLmol1q0btfnXn5f69Hk_sQp-tu4pnRMLesJqjSbORDo9l_mdrHcJabElEwJkNeHGCYm0Ic1ieN34MnTOpVw9Qq2A7qo8BMUsozaJhl4kmkkDj9AgRj9u9OvmLxQhhaAtNxrgVBuP3G9iR1QPIf90TT8604Pay4s_v8fzIhguDTTveKKPOjndeWNI7R92gHvp_97cRQkmowNF_H6eDdo" 
                  alt="Proyecto Terrasacha"
                  className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
            </div>
            {/* Text Column */}
            <div className="w-full md:w-[55%]">
              <h2 className="text-4xl sm:text-5xl md:text-[52px] font-bold text-secondary-[bosques-nublados] mb-6 sm:mb-7 font-primary leading-tight">
                Sobre Terrasacha
              </h2>
              <p className="text-gray-700 mb-6 sm:mb-7 leading-relaxed text-justify font-primary text-base sm:text-lg md:text-[20px]">
                Terrasacha es el nombre genérico que se le ha dado al proyecto{' '}
                <strong className="text-secondary-[bosques-nublados]">
                  Implementación de Acciones para la Protección de Cuencas de Agua y Suelos a partir de Reforestación con Tecnologías Emergentes y Biotecnología en la Región Llanos Orientales en los Departamentos de Meta y Arauca
                </strong>, ejecutado por la Universidad Cooperativa de Colombia y financiado con fondos del Sistema General de Regalías.
              </p>
              <p className="text-gray-700 leading-relaxed text-justify font-primary text-base sm:text-lg md:text-[20px]">
                Nuestro proyecto busca fortalecer los modelos de protección de los activos ambientales estratégicos y monetización de cultivos forestales comerciales para los departamentos del Meta y Arauca. A través de la implementación de tecnologías innovadoras y biotecnología aplicada, contribuimos al desarrollo sostenible de la región, protegiendo nuestros recursos naturales para las generaciones futuras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Pillars Section */}
      <section className="bg-gray-50 py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-[bosques-nublados] mb-8 sm:mb-12 font-primary">
            El Aporte de Terrasacha a los Objetivos de Desarrollo Sostenible
          </h2>
          <div className="overflow-x-auto max-w-6xl mx-auto rounded-2xl border border-gray-300 bg-white">
            <table className="w-full border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="w-[140px] p-4 border border-gray-300 text-center text-sm font-bold text-gray-800 font-primary">
                    ODS
                  </th>
                  <th className="p-4 border border-gray-300 text-center text-sm font-bold text-gray-800 font-primary">
                    Lo que hacemos en Terrasacha
                  </th>
                  <th className="p-4 border border-gray-300 text-center text-sm font-bold text-gray-800 font-primary">
                    Impacto Real en el Territorio
                  </th>
                </tr>
              </thead>
              <tbody>
                {impactPillars.map((pillar) => (
                  <tr key={pillar.ods} className="align-middle">
                    <td className="p-4 border border-gray-300 text-center">
                      <img
                        src={pillar.image}
                        alt={`Icono ${pillar.ods}`}
                        className="w-28 h-28 object-cover rounded-2xl border border-gray-200 mx-auto"
                        loading="lazy"
                      />
                    </td>
                    <td className="p-4 border border-gray-300 text-gray-700 font-primary leading-relaxed text-center align-middle">
                      {pillar.whatWeDo}
                    </td>
                    <td className="p-4 border border-gray-300 text-gray-700 font-primary leading-relaxed text-center align-middle">
                      {pillar.impact}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-12 sm:py-14 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-[bosques-nublados] mb-8 sm:mb-12 font-primary">
            Nuestra Misión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Card */}
            <div className="bg-secondary-claro/20 p-6 sm:p-8 shadow-inner border border-secondary-claro rounded-[20px]">
              <h3 className="font-bold text-secondary-[bosques-nublados] mb-4 text-xl sm:text-2xl md:text-[24px] font-primary">
                Protección Ambiental
              </h3>
              <p className="text-gray-700 leading-relaxed font-primary text-sm sm:text-base">
                Fortalecer los modelos de protección de activos ambientales estratégicos mediante tecnologías emergentes y biotecnología aplicada. Nuestro compromiso es implementar acciones concretas para la protección de cuencas de agua y suelos, garantizando la disponibilidad de recursos naturales para las generaciones futuras.
              </p>
            </div>
            {/* Right Card */}
            <div className="p-6 sm:p-8 shadow-inner border border-secondary-pradera/30 bg-secondary-pradera/10 rounded-[20px]">
              <h3 className="font-bold text-secondary-[bosques-nublados] mb-4 text-xl sm:text-2xl md:text-[24px] font-primary">
                Desarrollo Sostenible
              </h3>
              <p className="text-gray-700 leading-relaxed font-primary text-sm sm:text-base">
                Implementar modelos de comercialización de activos ambientales que promuevan el desarrollo sostenible de la región. A través de la monetización de cultivos forestales comerciales, buscamos crear un impacto positivo en los departamentos de Meta y Arauca, combinando sostenibilidad y rentabilidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Involved Actors Section */}
      <section className="bg-gradient-to-b from-white via-secondary-claro/10 to-[#f7f8f2] pb-12 sm:pb-14 md:pb-16 lg:pb-20">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-[46px] font-bold text-secondary-[bosques-nublados] font-primary uppercase tracking-wide">
              Actores Involucrados
            </h2>
          </div>

          <div className="max-w-4xl mx-auto overflow-hidden rounded-3xl border border-secondary-claro/50 bg-white/95 shadow-md shadow-secondary-[bosques-nublados]/5 backdrop-blur-sm">
            <div className="border-l-4 border-primary bg-gradient-to-br from-secondary-claro/25 via-white to-secondary-amarillo-tierra/10 px-5 py-5 sm:px-8 sm:py-7 md:px-10 md:py-9">
              <dl className="divide-y divide-secondary-claro/40 font-primary">
                {involvedActorsRows.map(({ role, body }) => (
                  <div
                    key={role}
                    className="grid gap-1.5 py-4 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,11.5rem)_1fr] sm:items-start sm:gap-8 sm:py-5"
                  >
                    <dt className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary sm:pt-1">
                      {role}
                    </dt>
                    <dd className="text-base leading-relaxed text-secondary-[bosques-nublados] sm:text-lg">
                      {body}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="relative left-1/2 right-1/2 -mx-[50vw] w-screen mt-8 sm:mt-10">
            <div className="overflow-hidden">
              <div className="actors-carousel-track flex items-center gap-4 sm:gap-5 w-max px-4 sm:px-6 md:px-8">
                {actorsCarouselTrack.map((logo, index) => (
                  <article
                    key={`${logo.alt}-${index}`}
                    className="shrink-0 w-[220px] h-[140px] sm:w-[250px] sm:h-[150px] rounded-2xl border border-secondary-claro/40 bg-white shadow-sm p-4 flex items-center justify-center"
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
        <style>
          {`
            .actors-carousel-track {
              animation: actors-carousel-scroll 28s linear infinite;
            }

            @keyframes actors-carousel-scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            @media (prefers-reduced-motion: reduce) {
              .actors-carousel-track {
                animation: none;
              }
            }
          `}
        </style>
      </section>

      {/* Partners Section */}
      {/*
      <section className="bg-gray-50 py-16 sm:py-20 md:py-24 lg:py-[100px]">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-[bosques-nublados] mb-8 sm:mb-12 font-primary">
            Nuestros Aliados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center border border-gray-200">
              <div className="w-16 h-16 mb-4 bg-secondary-pradera/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏛️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2 font-primary">
                Universidad Cooperativa de Colombia
              </h4>
              <p className="text-gray-600 mb-6 flex-grow text-sm font-primary">
                Ejecutor del proyecto
              </p>
              <a
                href="#"
                className="inline-block text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors bg-primary text-xs sm:text-sm"
              >
                Conocer Más
              </a>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center border border-gray-200">
              <div className="w-16 h-16 mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2 font-primary">
                Sistema General de Regalías
              </h4>
              <p className="text-gray-600 mb-6 flex-grow text-sm font-primary">
                Financiador principal
              </p>
              <a
                href="#"
                className="inline-block text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors bg-primary text-xs sm:text-sm"
              >
                Conocer Más
              </a>
            </div>
            <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center text-center border border-gray-200">
              <div className="w-16 h-16 mb-4 bg-secondary-claro/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">🗺️</span>
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2 font-primary">
                Departamentos Meta y Arauca
              </h4>
              <p className="text-gray-600 mb-6 flex-grow text-sm font-primary">
                Región de impacto
              </p>
              <a
                href="#"
                className="inline-block text-white px-6 py-2 rounded-full font-semibold hover:bg-primary-dark transition-colors bg-primary text-xs sm:text-sm"
              >
                Conocer Más
              </a>
            </div>
          </div>
        </div>
      </section>
      */}
    </main>
  );
};

export default Nosotros;

