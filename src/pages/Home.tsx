import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import ObjectivesSection from '../components/ObjectivesSection';
import BlogSection from '../components/BlogSection';

export default function Home() {
  return (
    <main>
      <Hero />
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl mb-8">
            Quiénes <span className="text-primary">Somos</span>
          </h1>
          <p className="text-gray-700 max-w-3xl mx-auto text-lg">
            Terrasacha es el nombre genérico que se le ha dado al proyecto "IMPLEMENTACIÓN DE
            ACCIONES PARA LA PROTECCIÓN DE CUENCAS DE AGUA Y SUELOS A PARTIR DE REFORESTACIÓN CON
            TECNOLOGÍAS EMERGENTES Y BIOTECNOLOGÍA EN LA REGIÓN LLANOS ORIENTALES EN LOS
            DEPARTAMENTOS DE META ARAUCA", ejecutado por la Universidad Cooperativa de Colombia y
            financiado con fondos del Sistema General de Regalías.
          </p>
        </div>
      </section>
      <StatsSection />
      <ObjectivesSection />
      <BlogSection />
    </main>
  );
}

