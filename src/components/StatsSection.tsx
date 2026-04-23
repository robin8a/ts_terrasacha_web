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
    <div
      ref={ref}
      className="group text-center rounded-2xl border border-white/70 bg-white/95 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <h1 className="text-5xl md:text-6xl font-light mb-3 text-secondary-[bosques-nublados]">
        {count}
      </h1>
      <h3 className="text-xl font-semibold mb-2 text-secondary-[bosques-nublados]">{label}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
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
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-secondary-[bosques-nublados]/85 via-secondary-pradera/60 to-secondary-[bosques-nublados]/90"></div>
      <div className="pointer-events-none absolute -top-24 -left-24 z-0 h-72 w-72 rounded-full bg-secondary-[amarillo-tierra]/20 blur-3xl"></div>
      <div className="pointer-events-none absolute top-1/3 -right-20 z-0 h-80 w-80 rounded-full bg-secondary-pradera/25 blur-3xl"></div>
      <div className="pointer-events-none absolute -bottom-28 left-1/3 z-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h1 className="text-4xl md:text-5xl font-primary font-bold text-secondary-[bosques-nublados]">
            Vamos a <span className="text-secondary-[bosques-nublados]">impactar</span>
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 font-primary">
            Resultados esperados en territorio para Meta y Arauca.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 rounded-3xl p-6 sm:p-8 bg-white/10 backdrop-blur-md border border-white/20 shadow-2xl">
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

