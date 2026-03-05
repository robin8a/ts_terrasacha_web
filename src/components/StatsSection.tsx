import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  number: number;
  label: string;
  description: string;
}

const StatCard = ({ number, label, description }: StatCardProps) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let start = 0;
          const duration = 2000;
          const increment = number / (duration / 16);

          const timer = setInterval(() => {
            start += increment;
            if (start >= number) {
              setCount(number);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [number, hasAnimated]);

  return (
    <div ref={ref} className="text-center bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
      <h1 className="text-5xl md:text-6xl font-light mb-4 text-secondary-[bosques-nublados]">
        {count}
      </h1>
      <h3 className="text-xl font-semibold mb-2 text-secondary-[bosques-nublados]">{label}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
};

const StatsSection = () => {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Fondo verde con textura ligera */}
      <div
        className="absolute inset-0 z-0 bg-secondary-[bosques-nublados]"
        style={{
          backgroundImage: "url('/assets/images/bg-1.svg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-secondary-[bosques-nublados]/90 via-secondary-pradera/70 to-secondary-[bosques-nublados]/95"></div>

      <div className="relative z-10 container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-16 font-primary text-white">
          Vamos a <span className="text-secondary-[amarillo-tierra]">impactar</span>
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 rounded-3xl p-8 bg-white/5 backdrop-blur-sm border border-white/10 shadow-2xl">
          <StatCard number={2} label="Departamentos" description="Meta y Arauca" />
          <StatCard number={4} label="Municipios" description="Tame, Arauca, Puerto López, Puerto Gaitán" />
          <StatCard number={400} label="Hectáreas" description="Plantaciones Forestales Comerciales" />
          <StatCard number={1630} label="Hectáreas" description="Bosques" />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;

