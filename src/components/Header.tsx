import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import SocialLinks from './SocialLinks';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const isSubmenuActive = (paths: string[]) => paths.some(path => location.pathname === path);

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/nosotros', label: 'Nosotros' },
  ];

  const actualidadSubmenu = [
    { path: '/noticias', label: 'Noticias' },
    { path: '/comunicados', label: 'Comunicados' },
    { path: '/agenda', label: 'Agenda' },
    { path: '/investigacion', label: 'Investigación' },
  ];

  const plataformasSubmenu = [
    { href: 'https://internal-marketplace.terrasacha.com/', label: 'Marketplace', external: true },
    { href: 'https://oraculoterrasacha.vercel.app/', label: 'Oraculo', external: true },
    { href: 'https://internal-platform.terrasacha.com/', label: 'Plataforma', external: true },
    { href: '/app', label: 'App', external: false },
  ];

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

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
          <div className="bg-white border-t max-h-[calc(100vh-64px)] overflow-y-auto">
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
              
              {/* Actualidad Submenu */}
              <div>
                <button
                  onClick={() => toggleSubmenu('actualidad')}
                  className={`w-full text-left py-2 flex items-center justify-between ${
                    isSubmenuActive(actualidadSubmenu.map(item => item.path))
                      ? 'text-primary font-semibold'
                      : 'text-gray-700'
                  }`}
                >
                  Actualidad
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openSubmenu === 'actualidad' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSubmenu === 'actualidad' && (
                  <div className="pl-4 space-y-2 mt-2">
                    {actualidadSubmenu.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setOpenSubmenu(null);
                        }}
                        className={`block py-2 text-sm ${
                          isActive(item.path) ? 'text-primary font-semibold' : 'text-gray-600'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Plataformas Submenu */}
              <div>
                <button
                  onClick={() => toggleSubmenu('plataformas')}
                  className="w-full text-left py-2 flex items-center justify-between text-gray-700"
                >
                  Plataformas
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      openSubmenu === 'plataformas' ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openSubmenu === 'plataformas' && (
                  <div className="pl-4 space-y-2 mt-2">
                    {plataformasSubmenu.map((item, index) => (
                      item.external ? (
                        <a
                          key={index}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setOpenSubmenu(null);
                          }}
                          className="block py-2 text-sm text-gray-600"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={index}
                          to={item.href}
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setOpenSubmenu(null);
                          }}
                          className={`block py-2 text-sm ${
                            isActive(item.href) ? 'text-primary font-semibold' : 'text-gray-600'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                  </div>
                )}
              </div>

              {/* Metodología */}
              <Link
                to="/metodologia"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 ${
                  isActive('/metodologia') ? 'text-primary font-semibold' : 'text-gray-700'
                }`}
              >
                Metodología
              </Link>

              {/* Ruta de Formación */}
              <Link
                to="/ruta-de-formacion"
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 ${
                  isActive('/ruta-de-formacion') ? 'text-primary font-semibold' : 'text-gray-700'
                }`}
              >
                Ruta de Formación
              </Link>

              {/* Multimedia */}
              <div className="pt-4 border-t">
                <p className="text-sm font-semibold mb-2 text-gray-700">Multimedia</p>
                <Link
                  to="/agenda-de-sostenibilidad"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-600 text-sm"
                >
                  Agenda de Sostenibilidad
                </Link>
                <Link
                  to="/podcast"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-2 text-gray-600 text-sm"
                >
                  Podcast
                </Link>
              </div>

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
              
              {/* Actualidad Submenu */}
              <li className="relative group">
                <button
                  className={`${
                    isSubmenuActive(actualidadSubmenu.map(item => item.path))
                      ? 'text-primary font-semibold'
                      : 'text-gray-700 hover:text-primary'
                  } transition-colors flex items-center gap-1`}
                >
                  Actualidad
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {actualidadSubmenu.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`block px-4 py-2 ${
                          isActive(item.path)
                            ? 'text-primary font-semibold bg-primary/5'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </li>

              {/* Plataformas Submenu */}
              <li className="relative group">
                <button className="text-gray-700 hover:text-primary transition-colors flex items-center gap-1">
                  Plataformas
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-2">
                    {plataformasSubmenu.map((item, index) => (
                      item.external ? (
                        <a
                          key={index}
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link
                          key={index}
                          to={item.href}
                          className={`block px-4 py-2 ${
                            isActive(item.href)
                              ? 'text-primary font-semibold bg-primary/5'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {item.label}
                        </Link>
                      )
                    ))}
                  </div>
                </div>
              </li>

              {/* Metodología */}
              <li>
                <Link
                  to="/metodologia"
                  className={`${
                    isActive('/metodologia')
                      ? 'text-primary font-semibold'
                      : 'text-gray-700 hover:text-primary'
                  } transition-colors`}
                >
                  Metodología
                </Link>
              </li>

              {/* Ruta de Formación */}
              <li>
                <Link
                  to="/ruta-de-formacion"
                  className={`${
                    isActive('/ruta-de-formacion')
                      ? 'text-primary font-semibold'
                      : 'text-gray-700 hover:text-primary'
                  } transition-colors`}
                >
                  Ruta de Formación
                </Link>
              </li>

              {/* Multimedia */}
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

