const AppPage = () => {
  return (
    <main className="font-primary min-h-screen bg-gradient-to-b from-white via-secondary-claro/10 to-white py-16 sm:py-20 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <section className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-secondary-claro/40 bg-white shadow-2xl">
          <div className="pointer-events-none absolute -top-24 -left-20 h-60 w-60 rounded-full bg-secondary-pradera/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-60 w-60 rounded-full bg-secondary-[amarillo-tierra]/25 blur-3xl" />

          <div className="relative z-10 grid grid-cols-1 gap-10 p-8 sm:p-10 md:grid-cols-[1.1fr,0.9fr] md:p-12">
            <div className="flex flex-col justify-center">
              <span className="inline-flex w-fit items-center rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Lanzamiento Próximamente
              </span>

              <h1 className="mt-5 text-4xl sm:text-5xl md:text-6xl font-bold leading-tight text-secondary-[bosques-nublados]">
                App Terrasacha
              </h1>

              <p className="mt-4 max-w-xl text-sm sm:text-base md:text-lg leading-relaxed text-gray-700">
                Muy pronto estará disponible nuestra aplicación para fortalecer la formación, el seguimiento de actividades y el impacto ambiental en territorio.
              </p>

              <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-secondary-pradera/30 bg-secondary-pradera/10 px-4 py-3 text-secondary-[bosques-nublados]">
                  Formación y recursos digitales
                </div>
                <div className="rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-secondary-[bosques-nublados]">
                  Novedades y agenda del proyecto
                </div>
                <div className="rounded-xl border border-secondary-claro/40 bg-secondary-claro/20 px-4 py-3 text-secondary-[bosques-nublados]">
                  Acompañamiento a comunidades
                </div>
                <div className="rounded-xl border border-secondary-[amarillo-tierra]/40 bg-secondary-[amarillo-tierra]/25 px-4 py-3 text-secondary-[bosques-nublados]">
                  Innovación para la sostenibilidad
                </div>
              </div>

            </div>

            <div className="flex items-center justify-center">
              <div className="w-full max-w-sm rounded-[2rem] border-4 border-secondary-[bosques-nublados]/15 bg-gradient-to-b from-secondary-[bosques-nublados] to-primary p-6 shadow-2xl">
                <div className="mb-5 h-3 w-24 rounded-full bg-white/25" />
                <div className="rounded-2xl bg-white/95 p-5">
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-primary">
                    Estado del producto
                  </p>
                  <p className="mt-2 text-2xl font-bold text-secondary-[bosques-nublados]">
                    En construcción
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    Estamos afinando los últimos detalles para publicar la app con una experiencia sólida, simple y útil para toda la comunidad Terrasacha.
                  </p>

                  <div className="mt-5">
                    <div className="mb-2 flex items-center justify-between text-xs font-semibold text-secondary-[bosques-nublados]">
                      <span>Progreso de lanzamiento</span>
                      <span>Pronto</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200">
                      <div className="h-2 w-4/5 rounded-full bg-secondary-pradera" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default AppPage;

