const ObjectivesSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/assets/videos/bg1-1.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-[bosques-nublados]/80 via-primary/70 to-secondary-pradera/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xl text-white mb-4 font-primary font-medium">Conoce más acerca del proyecto</p>
          <h1 className="text-4xl md:text-5xl text-white mb-4 font-primary font-bold">
            Nuestros <span className="text-secondary-[amarillo-tierra]">Objetivos</span>
          </h1>
          <p className="text-white/95 max-w-2xl mx-auto font-primary text-lg">
            Terrasacha tiene dos grandes objetivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-all border-l-4 border-secondary-pradera">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-secondary-pradera/30 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-secondary-pradera">1</span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-[bosques-nublados] font-primary">Objetivo N°1</h3>
            </div>
            <p className="text-gray-800 leading-relaxed font-primary text-base">
              Fortalecer los modelos de protección de los activos ambientales estratégicos y
              monetización de cultivos forestales comerciales para los departamentos del Meta y Arauca.
            </p>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-2xl hover:shadow-2xl transition-all border-l-4 border-secondary-claro">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-full bg-secondary-claro/30 flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-secondary-claro">2</span>
              </div>
              <h3 className="text-2xl font-bold text-secondary-[bosques-nublados] font-primary">Objetivo N°2</h3>
            </div>
            <p className="text-gray-800 leading-relaxed font-primary text-base">
              Implementar un modelo de comercialización de los activos ambientales estratégicos
              para los departamentos del Meta y Arauca.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ObjectivesSection;

