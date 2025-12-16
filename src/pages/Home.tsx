import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import ObjectivesSection from '../components/ObjectivesSection';
import BlogSection from '../components/BlogSection';

const Home = () => {
  return (
    <main className="font-primary">
      <Hero />
      {/* About / Quiénes Somos Section */}
      <section className="py-16 sm:py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
              {/* Imagen */}
              <div className="w-full md:w-1/2">
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src="/assets/images/ChatGPT Image 15 dic 2025, 09_00_33 p.m..png"
                    alt="Proyecto Terrasacha"
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Texto */}
              <div className="w-full md:w-1/2">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-secondary-[bosques-nublados] mb-6 uppercase tracking-tight">
                  Quiénes <span className="text-primary">Somos</span>
                </h2>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 font-primary">
                  Terrasacha es el nombre genérico que se le ha dado al proyecto{' '}
                  <strong className="text-secondary-[bosques-nublados]">
                    Implementación de Acciones para la Protección de Cuencas de Agua y Suelos a partir de Reforestación con Tecnologías Emergentes y Biotecnología en la Región Llanos Orientales en los Departamentos de Meta y Arauca
                  </strong>, ejecutado por la Universidad Cooperativa de Colombia y financiado con fondos del Sistema General de Regalías.
                </p>
                <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-primary">
                  Nuestro proyecto busca fortalecer la protección ambiental mediante la implementación de tecnologías innovadoras y biotecnología aplicada, contribuyendo al desarrollo sostenible de la región.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <StatsSection />
      <ObjectivesSection />
      <BlogSection />
    </main>
  );
};

export default Home;

