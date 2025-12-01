export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-green-800 via-green-700 to-green-900">
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
        <div className="absolute inset-0 video-overlay" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-light text-white tracking-widest mb-8">
          PIONEROS DEL MAÑANA
        </h1>
      </div>
    </section>
  );
}

