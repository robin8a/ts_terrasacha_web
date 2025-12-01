import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import SocialLinks from './SocialLinks';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
    { path: '/noticias', label: 'Noticias' },
    { path: '/agenda', label: 'Agenda' },
    { path: '/contacto', label: 'Contacto' },
  ];

  return (
    <>
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <nav className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/assets/icons/logo.svg"
              alt="TerraSacha"
              className="h-10 w-auto"
            />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-700"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="bg-white border-t">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-2 ${
                    isActive(link.path) ? 'text-primary font-semibold' : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2">Multimedia</p>
                <Link
                  to="/agenda-de-sostenibilidad"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700"
                >
                  Agenda de Sostenibilidad
                </Link>
                <Link
                  to="/podcast"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-700"
                >
                  Podcast
                </Link>
              </div>
              <a
                href="https://marketplace.suan.global/"
                target="_blank"
                rel="noreferrer"
                className="block"
              >
                <button className="w-full bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors">
                  Proyectos
                </button>
              </a>
              <div className="pt-4 border-t">
                <SocialLinks />
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
        <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <img
              src="/assets/icons/logo.svg"
              alt="TerraSacha"
              className="h-14 w-auto"
            />
          </Link>

          <div className="flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`${
                      isActive(link.path)
                        ? 'text-primary font-semibold'
                        : 'text-gray-700 hover:text-primary'
                    } transition-colors`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li className="relative group">
                <button className="text-gray-700 hover:text-primary transition-colors flex items-center gap-1">
                  Multimedia
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    <Link
                      to="/agenda-de-sostenibilidad"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Agenda de Sostenibilidad
                    </Link>
                    <Link
                      to="/podcast"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      Podcast
                    </Link>
                  </div>
                </div>
              </li>
              <li>
                <a
                  href="https://marketplace.suan.global/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-colors text-sm">
                    Proyectos
                  </button>
                </a>
              </li>
            </ul>
            <SocialLinks />
          </div>
        </nav>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-16 lg:h-20" />
    </>
  );
}

