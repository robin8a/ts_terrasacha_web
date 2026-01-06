import SocialLinks from '../components/SocialLinks';

const Contacto = () => {
  return (
    <main className="font-primary bg-secondary-claro/5 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-80 sm:h-96 md:h-[420px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBfQ0n8xHH295DYRfaoDi9YuisSdVJz3OcK25N9XZlrEenPdsNp0bIIJb5drdB4wY9oj_sZL5zqXh2K4gFNHokA8aGDetHJ5mH1srrUogHiqmgCgAehxuDehGRMlXYwM_AlTbD2oua9zgueMUIBLzHlWeNzbClnUrOZMJUMSxU3lS_I247_cIrZiHOT4dyyIj2z77l6nAbJNzpIwSYck1F7xZHwT5kYbqTXgpsWNmlUOLDOhtkC6l_LxGw4ZQHS-_Qcs1caMUU4fQ"
            alt="Bosque y naturaleza"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-slogan text-white mb-3 sm:mb-4 drop-shadow-2xl tracking-slogan uppercase">
            CONTACTO
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-3xl mx-auto font-primary drop-shadow-lg px-2 tracking-wide">
            Estamos aquí para responder tus preguntas y escuchar tus ideas
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 md:gap-8 lg:gap-12">
              {/* Contact Cards */}
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                {/* Email Card */}
                <div className="bg-secondary-claro/5 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-primary p-4 sm:p-5 md:p-6 lg:p-8 flex items-center">
                  <div className="flex-shrink-0 mr-4 sm:mr-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2 text-secondary-[bosques-nublados] font-primary uppercase">
                        Email
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-700 mb-1">Para consultas generales:</p>
                      <a
                        href="mailto:hola@terrasacha.com"
                        className="text-primary hover:text-primary-dark transition-colors text-xs sm:text-sm md:text-base lg:text-lg font-primary break-all inline-block"
                      >
                        hola@terrasacha.com
                      </a>
                    </div>
                  </div>
                </div>

                {/* Telegram Card */}
                <div className="bg-secondary-claro/5 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-secondary-pradera p-4 sm:p-5 md:p-6 lg:p-8 flex items-center">
                  <div className="flex-shrink-0 mr-4 sm:mr-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2 text-secondary-[bosques-nublados] font-primary uppercase">
                        Telegram
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-700 mb-1">Únete a nuestra comunidad:</p>
                      <a
                        href="https://t.me/TerrasachaBot"
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary-pradera hover:text-secondary-pradera/80 transition-colors text-xs sm:text-sm md:text-base lg:text-lg font-primary inline-flex items-center gap-1.5 sm:gap-2 flex-wrap"
                      >
                        <span className="break-words">Terrasacha en Telegram</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Website Card */}
                <div className="bg-secondary-claro/5 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all border-2 border-secondary-claro p-4 sm:p-5 md:p-6 lg:p-8 flex items-center">
                  <div className="flex-shrink-0 mr-4 sm:mr-5">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-18 md:h-18 rounded-full bg-primary flex items-center justify-center">
                      <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1.5 sm:mb-2 text-secondary-[bosques-nublados] font-primary uppercase">
                        Sitio Web
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-700 mb-1">Visita nuestro portal principal:</p>
                      <a
                        href="https://terrasacha.com"
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary-claro hover:text-secondary-claro/80 transition-colors text-xs sm:text-sm md:text-base lg:text-lg font-primary inline-flex items-center gap-1.5 sm:gap-2 break-all"
                      >
                        <span>https://terrasacha.com</span>
                        <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Section */}
              <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-8 border-y-4 border-secondary-[amarillo-tierra] shadow-sm">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-6 text-secondary-[bosques-nublados] font-primary uppercase tracking-wide text-center md:text-left">
                  Conecta en Redes Sociales
                </h3>
                <p className="text-gray-600 text-xs sm:text-sm md:text-base mb-4 sm:mb-6 md:mb-8 font-primary leading-relaxed">
                  Mantente al día con nuestras últimas noticias, eventos y actualizaciones del proyecto Terrasacha.
                </p>
                <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
                  <SocialLinks className="justify-center md:justify-start" iconSize="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
                </div>
                <div className="space-y-2.5 sm:space-y-3 md:space-y-4">
                  <a
                    href="https://www.instagram.com/holaterrasacha"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-primary transition-colors group p-2 rounded-lg hover:bg-white/50"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.55,1H6.46C3.45,1,1,3.44,1,6.44v7.12c0,3,2.45,5.44,5.46,5.44h7.08c3.02,0,5.46-2.44,5.46-5.44V6.44 C19.01,3.44,16.56,1,13.55,1z M17.5,14c0,1.93-1.57,3.5-3.5,3.5H6c-1.93,0-3.5-1.57-3.5-3.5V6c0-1.93,1.57-3.5,3.5-3.5h8 c1.93,0,3.5,1.57,3.5,3.5V14z" />
                      <circle cx="14.87" cy="5.26" r="1.09" />
                      <path d="M10.03,5.45c-2.55,0-4.63,2.06-4.63,4.6c0,2.55,2.07,4.61,4.63,4.61c2.56,0,4.63-2.061,4.63-4.61 C14.65,7.51,12.58,5.45,10.03,5.45L10.03,5.45L10.03,5.45z M10.08,13c-1.66,0-3-1.34-3-2.99c0-1.65,1.34-2.99,3-2.99s3,1.34,3,2.99 C13.08,11.66,11.74,13,10.08,13L10.08,13L10.08,13z" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base font-primary group-hover:underline break-words">@holaterrasacha</span>
                  </a>
                  <a
                    href="https://www.facebook.com/profile.php?id=61570120596311"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-primary transition-colors group p-2 rounded-lg hover:bg-white/50"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11,10h2.6l0.4-3H11V5.3c0-0.9,0.2-1.5,1.5-1.5H14V1.1c-0.3,0-1-0.1-2.1-0.1C9.6,1,8,2.4,8,5v2H5.5v3H8v8h3V10z" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base font-primary group-hover:underline">Facebook</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/105832862/admin/page-posts/published/"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-primary transition-colors group p-2 rounded-lg hover:bg-white/50"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base font-primary group-hover:underline">LinkedIn</span>
                  </a>
                  <a
                    href="https://www.tiktok.com/@holaterrasacha"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-primary transition-colors group p-2 rounded-lg hover:bg-white/50"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.24,6V8.82a6.79,6.79,0,0,1-4-1.28v5.81A5.26,5.26,0,1,1,8,8.1a4.36,4.36,0,0,1,.72.05v2.9A2.57,2.57,0,0,0,7.64,11a2.4,2.4,0,1,0,2.77,2.38V2h2.86a4,4,0,0,0,1.84,3.38A4,4,0,0,0,17.24,6Z" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base font-primary group-hover:underline break-words">@holaterrasacha</span>
                  </a>
                  <a
                    href="https://www.youtube.com/@TERRASACHA1"
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 sm:gap-3 text-gray-700 hover:text-primary transition-colors group p-2 rounded-lg hover:bg-white/50"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15,4.1c1,0.1,2.3,0,3,0.8c0.8,0.8,0.9,2.1,0.9,3.1C19,9.2,19,10.9,19,12c-0.1,1.1,0,2.4-0.5,3.4c-0.5,1.1-1.4,1.5-2.5,1.6 c-1.2,0.1-8.6,0.1-11,0c-1.1-0.1-2.4-0.1-3.2-1c-0.7-0.8-0.7-2-0.8-3C1,11.8,1,10.1,1,8.9c0-1.1,0-2.4,0.5-3.4C2,4.5,3,4.3,4.1,4.2 C5.3,4.1,12.6,4,15,4.1z M8,7.5v6l5.5-3L8,7.5z" />
                    </svg>
                    <span className="text-xs sm:text-sm md:text-base font-primary group-hover:underline break-words">YouTube - TERRASACHA</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Additional Info Section */}
            <div className="mt-10 sm:mt-12 md:mt-14 lg:mt-16 bg-gradient-to-r from-primary to-secondary-[amarillo-tierra] rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-10 text-center shadow-lg">
              <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4 md:mb-5 text-white font-primary uppercase tracking-wide">
                Transforma tu mundo con Terrasacha
              </h3>
              <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mb-4 sm:mb-6 font-primary max-w-2xl mx-auto leading-relaxed px-2">
                Estamos aquí para ayudarte. Contáctanos a través de cualquiera de nuestros canales y te responderemos lo antes posible.
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2.5 sm:gap-3 md:gap-4">
                <a
                  href="mailto:hola@terrasacha.com"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold hover:bg-secondary-claro/20 transition-colors text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>Enviar Email</span>
                </a>
                <a
                  href="https://t.me/TerrasachaBot"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-secondary-pradera text-white px-4 sm:px-5 md:px-6 lg:px-8 py-2 sm:py-2.5 md:py-3 rounded-full font-semibold hover:bg-secondary-pradera/90 transition-colors text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg"
                >
                  <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                  <span>Abrir Telegram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contacto;

