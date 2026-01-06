const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 lg:pt-24">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-secondary-[bosques-nublados] via-primary to-secondary-pradera">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          onError={(e) => {
            // Hide video if it fails to load
            (e.target as HTMLVideoElement).style.display = 'none';
          }}
        >
          <source src="/assets/videos/bg.mp4" type="video/mp4" />
        </video>
        {/* Overlay más fuerte para separar header del contenido */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-primary/70 to-black/50" />
        <div className="absolute inset-0 video-overlay" />
      </div>

      {/* Content con mejor separación del header */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-primary text-white mb-8 drop-shadow-2xl font-bold uppercase">
          PIONEROS DEL MAÑANA
        </h1>
        <p className="text-lg md:text-xl text-white/95 max-w-2xl mx-auto font-primary drop-shadow-lg">
          Innovación, Conciencia, Transformación, Educación, Responsabilidad
        </p>
      </div>
    </section>
  );
};

export default Hero;

