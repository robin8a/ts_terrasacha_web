import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';

const Footer = () => {
  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/noticias', label: 'Noticias' },
    { path: '/agenda', label: 'Agenda' },
    { path: '/contacto', label: 'Contacto' },
  ];

  const multimediaLinks = [
    { path: '/agenda-de-sostenibilidad', label: 'Agenda de Sostenibilidad' },
    { path: '/podcast', label: 'Podcast' },
  ];

  return (
    <footer className="bg-white text-gray-800 font-primary border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-12 sm:py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/assets/icons/logo.svg"
                alt="Terrasacha"
                className="h-10 w-auto"
              />
              <span className="text-xl font-bold text-secondary-[bosques-nublados]">Terrasacha</span>
            </div>
            <p className="text-secondary-[bosques-nublados] text-lg sm:text-xl font-slogan tracking-slogan mb-4 uppercase">
              PIONEROS DEL MAÑANA
            </p>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              Innovación, conciencia, transformación y educación para un futuro sostenible.
            </p>
            <div className="flex items-center gap-3">
              <SocialLinks className="text-gray-700" iconSize="w-5 h-5" />
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="text-base font-bold mb-4 text-secondary-[bosques-nublados] uppercase tracking-wide">
              Navegación
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Multimedia Column */}
          <div>
            <h3 className="text-base font-bold mb-4 text-secondary-[bosques-nublados] uppercase tracking-wide">
              Multimedia
            </h3>
            <ul className="space-y-3 mb-6">
              {multimediaLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-600 hover:text-primary transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <a
              href="https://marketplace.terrasacha.com/"
              target="_blank"
              rel="noreferrer"
              className="inline-block"
            >
              <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors text-sm">
                Proyectos
              </button>
            </a>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="text-base font-bold mb-4 text-secondary-[bosques-nublados] uppercase tracking-wide">
              Contacto
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-secondary-[bosques-nublados]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Email</p>
                  <a
                    href="mailto:hola@terrasacha.com"
                    className="text-secondary-[bosques-nublados] hover:text-primary transition-colors text-sm"
                  >
                    hola@terrasacha.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-secondary-[bosques-nublados]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Telegram</p>
                  <a
                    href="https://t.me/TerrasachaBot"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-[bosques-nublados] hover:text-primary transition-colors text-sm"
                  >
                    @TerrasachaBot
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-secondary-[bosques-nublados]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">Website</p>
                  <a
                    href="https://terrasacha.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-secondary-[bosques-nublados] hover:text-primary transition-colors text-sm"
                  >
                    terrasacha.com
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Terrasacha. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Política de Privacidad
              </a>
              <a
                href="#"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
