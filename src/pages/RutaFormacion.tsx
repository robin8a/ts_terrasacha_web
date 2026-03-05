import TrainingSection from '../components/TrainingSection';

const RutaFormacion = () => {
  return (
    <main className="font-primary bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <header className="mb-10 sm:mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-secondary-[bosques-nublados] mb-4 font-primary">
            Ruta de Formación
          </h1>
          <p className="text-gray-700 text-lg max-w-3xl">
            Información relacionada a los cursos de formación del proyecto Terrasacha, incluyendo los módulos,
            contenidos y experiencias de aprendizaje con las comunidades.
          </p>
        </header>

        {/* Bloque informativo con tres imágenes */}
        <section className="mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-secondary-[bosques-nublados] mb-6 font-primary">
            Componentes de la Ruta
          </h2>
          <p className="text-gray-700 mb-8 max-w-4xl">
            A continuación encontrarás una vista general de la ruta de formación. Las imágenes describen los principales
            momentos del proceso: sensibilización, formación técnica y apropiación comunitaria.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <article className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-52 sm:h-56 overflow-hidden">
                <img
                  src="/assets/images/ruta-formacion-1.jpg"
                  alt="Etapa de sensibilización y presentación del proyecto Terrasacha"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-secondary-[bosques-nublados] mb-2 font-primary">
                  Sensibilización y contexto
                </h3>
                <p className="text-sm text-gray-700 flex-grow">
                  Introducción al proyecto, contexto territorial y socialización de los objetivos con las comunidades
                  participantes.
                </p>
              </div>
            </article>

            <article className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-52 sm:h-56 overflow-hidden">
                <img
                  src="/assets/images/ruta-formacion-2.jpg"
                  alt="Sesión de formación técnica y prácticas sobre tecnologías y biotecnología"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-secondary-[bosques-nublados] mb-2 font-primary">
                  Formación técnica
                </h3>
                <p className="text-sm text-gray-700 flex-grow">
                  Desarrollo de contenidos sobre tecnologías emergentes, biotecnología y manejo de activos ambientales
                  estratégicos.
                </p>
              </div>
            </article>

            <article className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 flex flex-col">
              <div className="h-52 sm:h-56 overflow-hidden">
                <img
                  src="/assets/images/ruta-formacion-3.jpg"
                  alt="Trabajo comunitario y aplicación de los aprendizajes en territorio"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-secondary-[bosques-nublados] mb-2 font-primary">
                  Aplicación en territorio
                </h3>
                <p className="text-sm text-gray-700 flex-grow">
                  Acompañamiento a las comunidades en la implementación de lo aprendido y fortalecimiento de capacidades
                  locales.
                </p>
              </div>
            </article>
          </div>
        </section>
      </div>

      {/* Sección de inscripción y cursos (misma de la página de inicio) */}
      <TrainingSection />
    </main>
  );
};

export default RutaFormacion;

