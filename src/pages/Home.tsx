import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import ObjectivesSection from '../components/ObjectivesSection';
import BlogSection from '../components/BlogSection';
import TrainingSection from '../components/TrainingSection';

const Home = () => {
  return (
    <main className="font-primary">
      <Hero />
      
      {/* About / Quiénes Somos Section */}
      <section className="relative py-16 sm:py-24 md:py-32 bg-gradient-to-b from-white to-secondary-claro/10 overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-pradera/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-10 lg:gap-16">
              {/* Imagen con efecto mejorado */}
              <div className="w-full md:w-1/2 group">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 group-hover:scale-[1.02]">
                  <img
                    src="/assets/images/ChatGPT Image 19 nov 2025, 10_33_20 a.m..png"
                    alt="Proyecto Terrasacha"
                    className="w-full h-auto object-cover transform transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Borde decorativo */}
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-3xl pointer-events-none"></div>
                </div>
              </div>

              {/* Texto mejorado */}
              <div className="w-full md:w-1/2">
                {/* Badge */}
                <div className="mb-4">
                  <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20">
                    Sobre el Proyecto
                  </span>
                </div>
                
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 uppercase tracking-tight">
                  <span className="text-secondary-[bosques-nublados]">Quiénes</span>{' '}
                  <span className="text-primary">Somos</span>
                </h2>
                
                <div className="space-y-4 sm:space-y-6">
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-primary">
                    Terrasacha es el nombre genérico que se le ha dado al proyecto{' '}
                    <strong className="text-secondary-[bosques-nublados]">
                      Implementación de Acciones para la Protección de Cuencas de Agua y Suelos a partir de Reforestación con Tecnologías Emergentes y Biotecnología en la Región Llanos Orientales en los Departamentos de Meta y Arauca
                    </strong>, ejecutado por la Universidad Cooperativa de Colombia y financiado con fondos del Sistema General de Regalías.
                  </p>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-primary">
                    Nuestro proyecto busca fortalecer la protección ambiental mediante la implementación de tecnologías innovadoras y biotecnología aplicada, contribuyendo al desarrollo sostenible de la región.
                  </p>
                </div>

                {/* Elementos visuales decorativos */}
                <div className="flex items-center gap-4 mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-secondary-pradera">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">Proyecto Certificado</span>
                  </div>
                  <div className="flex items-center gap-2 text-primary">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold">Sostenibilidad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrainingSection />
      <StatsSection />
      <ObjectivesSection />
      <BlogSection />
    </main>
  );
};

export default Home;

