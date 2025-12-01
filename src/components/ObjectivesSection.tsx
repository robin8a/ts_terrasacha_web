export default function ObjectivesSection() {
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
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xl text-white mb-4">Conoce más acerca del proyecto</p>
          <h1 className="text-4xl md:text-5xl text-white mb-4">
            Nuestros <span className="text-primary">Objetivos</span>
          </h1>
          <p className="text-white/90 max-w-2xl mx-auto">
            Terrasacha tiene dos grandes objetivos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Objetivo N°1</h3>
            <p className="text-gray-700">
              Fortalecer los modelos de protección de los activos ambientales estratégicos y
              monetización de cultivos forestales comerciales para los departamentos del Meta y Arauca.
            </p>
          </div>
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8">
            <h3 className="text-2xl font-semibold mb-4">Objetivo N°2</h3>
            <p className="text-gray-700">
              Implementar un modelo de comercialización de los activos ambientales estratégicos
              para los departamentos del Meta y Arauca.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

