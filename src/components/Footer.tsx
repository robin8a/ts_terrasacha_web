import { Link } from 'react-router-dom';
import SocialLinks from './SocialLinks';

const Footer = () => {
  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/noticias', label: 'Noticias' },
    { path: '/comunicados', label: 'Comunicados' },
    { path: '/capsulas-informativas', label: 'Cápsula Informativa' },
    { path: '/videoclips-educativos', label: 'Videoclips Educativo' },
    { path: '/agenda', label: 'Agenda' },
    { path: '/preguntas-frecuentes', label: 'Preguntas frecuentes' },
    { path: '/glosario', label: 'Glosario' },
    { path: '/contacto', label: 'Contacto' },
  ];

  const multimediaLinks = [
    { path: '/agenda-de-sostenibilidad', label: 'Agenda de Sostenibilidad' },
    { path: '/podcast', label: 'Podcast' },
  ];

  return (
    <footer className="bg-[#e8d79a] text-[#44482c] font-primary">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8 sm:py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10 xl:gap-x-14">
          {/* Brand Column */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1 lg:max-w-[17rem]">
            <div className="mb-2">
              <img
                src="/assets/icons/logo.svg"
                alt="Terrasacha"
                className="h-9 w-auto"
              />
            </div>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-[#44482c]/80">
              Innovación, Conciencia, Transformación, Educación, Responsabilidad
            </p>
          </div>

          {/* Navigation Column */}
          <div className="min-w-0">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#44482c]">
              Navegación
            </h3>
            <ul className="space-y-1.5">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#44482c]/80 hover:text-[#44482c] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#44482c] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Multimedia Column */}
          <div className="min-w-0">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#44482c]">
              Multimedia
            </h3>
            <ul className="space-y-1.5">
              {multimediaLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-[#44482c]/80 hover:text-[#44482c] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#44482c] opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1">
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-[#44482c]">
              Conectate
            </h3>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  <svg className="h-4 w-4 text-[#44482c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="mb-0.5 text-xs font-medium uppercase text-[#44482c]/70">Email</p>
                  <a
                    href="mailto:hola@terrasacha.com"
                    className="break-all text-sm text-[#44482c] transition-colors hover:text-[#44482c]/80"
                  >
                    hola@terrasacha.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">
                  <svg className="h-4 w-4 text-[#44482c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <p className="mb-0.5 text-xs font-medium uppercase text-[#44482c]/70">Website</p>
                  <a
                    href="https://terrasacha.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#44482c] transition-colors hover:text-[#44482c]/80"
                  >
                    terrasacha.com
                  </a>
                </div>
              </li>
            </ul>
            <div className="mt-3 border-t border-[#44482c]/15 pt-3">
              <p className="mb-2 text-xs font-medium uppercase text-[#44482c]/70">Redes sociales</p>
              <SocialLinks className="text-[#44482c]" iconSize="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#44482c]/20 bg-[#44482c]/10">
        <div className="container mx-auto px-4 py-4 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 md:flex-row">
            <p className="text-[#44482c]/70 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Terrasacha. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <Link
                to="/politica-de-privacidad"
                className="text-[#44482c]/70 hover:text-[#44482c] transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                to="/terminos-y-condiciones"
                className="text-[#44482c]/70 hover:text-[#44482c] transition-colors"
              >
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
