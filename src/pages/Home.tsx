import { Link } from 'react-router-dom';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import ObjectivesSection from '../components/ObjectivesSection';
import BlogSection from '../components/BlogSection';

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
                  {/* Overlay sutil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-[bosques-nublados]/10 to-transparent z-10"></div>
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

      {/* Cursos de Formación Section */}
      <section className="relative py-16 sm:py-20 md:py-24 overflow-hidden bg-gradient-to-b from-white to-secondary-claro/10">
        {/* Fondo decorativo simple */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary-pradera/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-10 sm:mb-12 animate-fade-in-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold border border-primary/20 mb-6 group hover:bg-primary/15 hover:scale-105 transition-all duration-300">
                <svg className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="uppercase tracking-wide font-primary">Formación Continua</span>
              </div>

              {/* Título */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 uppercase tracking-tight font-primary">
                <span className="text-secondary-[bosques-nublados]">Aprende</span>{' '}
                <span className="text-primary">con Nosotros</span>
              </h2>

              {/* Subtítulo */}
              <p className="text-gray-700 text-lg sm:text-xl font-light max-w-2xl mx-auto leading-relaxed font-primary">
                Cursos <span className="font-semibold text-primary">gratuitos</span> para el desarrollo sostenible
              </p>
            </div>

            {/* Card principal */}
            <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10 mb-6 border border-gray-100 group hover:shadow-2xl transition-all duration-500 animate-fade-in-up delay-200">
              <div className="text-center">
                {/* Badge de estado */}
                <div className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-2.5 rounded-full font-bold text-sm sm:text-base uppercase tracking-wide shadow-lg mb-6 inline-flex group hover:scale-105 transition-transform duration-300">
                  <div className="w-2 h-2 bg-secondary-claro rounded-full animate-pulse"></div>
                  <span>INSCRIPCIONES ABIERTAS</span>
                </div>

                {/* Botón principal */}
                <div className="mb-4">
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSecFBs5h69bQGxmwEvLU57B7bjSN6qWrmtQ3xlQwiPe5Otnug/viewform?usp=header"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block group"
                  >
                    <button className="relative w-full sm:w-auto bg-gradient-to-r from-primary via-secondary-pradera to-primary text-white px-10 py-5 sm:px-12 sm:py-6 rounded-xl font-bold text-lg sm:text-xl hover:shadow-2xl transition-all duration-500 uppercase tracking-wide font-primary overflow-hidden group transform hover:scale-105">
                      {/* Efecto de brillo animado */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                      
                      {/* Contenido */}
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <svg className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span>INSCRIPCIONES ABIERTAS</span>
                        <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    </button>
                  </a>
                </div>

                {/* Texto descriptivo */}
                <p className="text-gray-700 text-base font-semibold font-primary">
                  Cursos de Formación Gratuitos
                </p>
              </div>
            </div>

            {/* Botón secundario */}
            <div className="text-center animate-fade-in-up delay-400">
              <Link to="/ruta-de-formacion" className="inline-block group">
                <div className="bg-white px-6 py-4 sm:px-8 sm:py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-100 hover:border-secondary-pradera/50 group transform hover:scale-105">
                  <span className="flex items-center justify-center gap-3 text-gray-700 hover:text-primary font-semibold text-base sm:text-lg font-primary transition-colors">
                    <svg className="w-5 h-5 text-secondary-pradera group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>Conoce más sobre los cursos en nuestra "Ruta de Formación"</span>
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
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

