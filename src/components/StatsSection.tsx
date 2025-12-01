import { useEffect, useRef, useState } from 'react';

interface StatCardProps {
  number: number;
  label: string;
  description: string;
}

function StatCard({ number, label, description }: StatCardProps) {
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
    <div ref={ref} className="text-center">
      <h1 className="text-5xl md:text-6xl font-light text-primary mb-4">{count}</h1>
      <h3 className="text-xl font-semibold mb-2">{label}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-16">
          Vamos a <span className="text-primary">impactar</span>
        </h1>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 rounded-3xl p-8"
          style={{
            backgroundImage: 'url(/assets/images/bg-1.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <StatCard number={2} label="Departamentos" description="Meta y Arauca" />
          <StatCard number={4} label="Municipios" description="Tame, Arauca, Puerto López, Puerto Gaitán" />
          <StatCard number={400} label="Hectáreas" description="Plantaciones Forestales Comerciales" />
          <StatCard number={1630} label="Hectáreas" description="Bosques" />
        </div>
      </div>
    </section>
  );
}

