const Nosotros = () => {
  const coreValues = [
    { name: 'Innovación', description: 'Exploración y liderazgo hacia el futuro' },
    { name: 'Conciencia', description: 'Compromiso con la sostenibilidad ambiental' },
    { name: 'Transformación', description: 'Cambio positivo para las comunidades' },
    { name: 'Educación', description: 'Formación y conocimiento compartido' },
    { name: 'Responsabilidad', description: 'Sostenibilidad para futuras generaciones' },
    { name: 'Imaginación', description: 'Soluciones creativas e innovadoras' },
    { name: 'Cambio', description: 'Transformación hacia un futuro mejor' },
    { name: 'Inspiración', description: 'Motivación para la acción colectiva' },
    { name: 'Esperanza', description: 'Visión positiva del mañana' },
    { name: 'Colectividad', description: 'Trabajo conjunto por un objetivo común' },
  ];

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
            Innovación, conciencia, transformación y educación para un futuro sostenible.
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="bg-white py-16 sm:py-20 md:py-24 lg:py-[100px]">
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
            <div className="w-full md:w-1/2">
              <h2 className="text-3xl sm:text-4xl font-bold text-secondary-[bosques-nublados] mb-6 font-primary">
                Sobre Terrasacha
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed text-justify font-primary text-sm sm:text-base">
                Terrasacha es el nombre genérico que se le ha dado al proyecto{' '}
                <strong className="text-secondary-[bosques-nublados]">
                  Implementación de Acciones para la Protección de Cuencas de Agua y Suelos a partir de Reforestación con Tecnologías Emergentes y Biotecnología en la Región Llanos Orientales en los Departamentos de Meta y Arauca
                </strong>, ejecutado por la Universidad Cooperativa de Colombia y financiado con fondos del Sistema General de Regalías.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify font-primary text-sm sm:text-base">
                Nuestro proyecto busca fortalecer los modelos de protección de los activos ambientales estratégicos y monetización de cultivos forestales comerciales para los departamentos del Meta y Arauca. A través de la implementación de tecnologías innovadoras y biotecnología aplicada, contribuimos al desarrollo sostenible de la región, protegiendo nuestros recursos naturales para las generaciones futuras.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="bg-gray-50 py-16 sm:py-20 md:py-24 lg:py-[100px]">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-[bosques-nublados] mb-8 sm:mb-12 font-primary">
            Nuestros Valores
          </h2>
          {/* Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {coreValues.map((value, index) => {
              const colorIndex = index % 5;
              const borderColors = [
                'border-secondary-pradera',
                'border-primary',
                'border-secondary-claro',
                'border-secondary-[amarillo-tierra]',
                'border-secondary-[bosques-nublados]',
              ];
              const borderColor = borderColors[colorIndex] || 'border-secondary-pradera';
              
              // Iconos emoji para cada valor
              const icons = ['💡', '🌱', '🦋', '📚', '🛡️', '✨', '🔄', '🌟', '🌅', '🤝'];
              const icon = icons[index] || '💚';
              
              return (
                <div
                  key={value.name}
                  className={`bg-white p-6 rounded-lg shadow-md border-t-4 ${borderColor} hover:shadow-xl transition-shadow text-center`}
                  style={{ boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
                >
                  <div className="w-[60px] h-[60px] mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center text-3xl">
                    {icon}
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2 font-primary text-base sm:text-lg">
                    {value.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-primary leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="bg-white py-16 sm:py-20 md:py-24 lg:py-[100px]">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-[bosques-nublados] mb-8 sm:mb-12 font-primary">
            Nuestra Misión
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Card */}
            <div className="bg-secondary-claro/20 p-8 sm:p-10 shadow-inner border border-secondary-claro rounded-[20px]">
              <h3 className="font-bold text-secondary-[bosques-nublados] mb-4 text-xl sm:text-2xl md:text-[24px] font-primary">
                Protección Ambiental
              </h3>
              <p className="text-gray-700 leading-relaxed font-primary text-sm sm:text-base">
                Fortalecer los modelos de protección de activos ambientales estratégicos mediante tecnologías emergentes y biotecnología aplicada. Nuestro compromiso es implementar acciones concretas para la protección de cuencas de agua y suelos, garantizando la disponibilidad de recursos naturales para las generaciones futuras.
              </p>
            </div>
            {/* Right Card */}
            <div className="p-8 sm:p-10 shadow-inner border border-secondary-pradera/30 bg-secondary-pradera/10 rounded-[20px]">
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

      {/* Partners Section */}
      <section className="bg-gray-50 py-16 sm:py-20 md:py-24 lg:py-[100px]">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-secondary-[bosques-nublados] mb-8 sm:mb-12 font-primary">
            Nuestros Aliados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Partner 1 */}
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
            {/* Partner 2 */}
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
            {/* Partner 3 */}
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
    </main>
  );
};

export default Nosotros;

