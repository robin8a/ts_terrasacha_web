import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AdminDashboard, { type AdminTab } from '../../pages/AdminDashboard';
import type { AdminUser } from '../../pages/AdminPage';
import AdminNewsManager from './AdminNewsManager';
import AdminAnnouncementsManager from './AdminAnnouncementsManager';
import AdminPodcastManager from './AdminPodcastManager';
import AdminResearchManager from './AdminResearchManager';

type AdminShellLayoutProps = {
  user: AdminUser;
  onSignOut: () => void | Promise<void>;
};

type TabConfig = {
  key: AdminTab;
  label: string;
  upcomingText: string;
  isComingSoon?: boolean;
};

const getUserEmail = (user: AdminUser): string => user.attributes?.email ?? user.username;

const getInitials = (value: string): string => {
  const candidate = value.trim();
  if (!candidate) return 'A';
  const tokens = candidate.includes('@') ? candidate.split('@')[0] : candidate;
  const parts = tokens
    .split(/[._\-\s]+/g)
    .map((t) => t.trim())
    .filter(Boolean);
  const initials = parts.slice(0, 2).map((t) => t[0]?.toUpperCase()).filter(Boolean).join('');
  return initials || candidate.slice(0, 1).toUpperCase();
};

const tabs: TabConfig[] = [
  { key: 'noticias', label: 'Noticias', upcomingText: 'Gestión de noticias.' },
  { key: 'comunicados', label: 'Comunicados', upcomingText: 'Gestión de comunicados.' },
  { key: 'agenda', label: 'Agenda', upcomingText: 'Agenda disponible próximamente.', isComingSoon: true },
  { key: 'podcast', label: 'Podcast', upcomingText: 'Gestión de podcast.' },
  { key: 'investigacion', label: 'Investigación', upcomingText: 'Gestión de investigación.' },
];

const AdminComingSoon = ({ text }: { text: string }): ReactNode => (
  <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
    <div className="flex items-start gap-3">
      <div className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span aria-hidden="true" className="text-lg">
          ?
        </span>
      </div>
      <div>
        <h2 className="text-lg font-bold text-gray-900">Próximamente</h2>
        <p className="mt-1 text-sm text-gray-600">{text}</p>
        <p className="mt-3 text-xs text-gray-500">
          Puedes seguir gestionando las noticias en este mismo panel.
        </p>
      </div>
    </div>
  </div>
);

const AdminShellLayout = ({ user, onSignOut }: AdminShellLayoutProps) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('noticias');

  const drawerId = 'admin-navigation-drawer';
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  const userEmail = useMemo(() => getUserEmail(user), [user]);
  const avatarInitials = useMemo(() => getInitials(userEmail), [userEmail]);

  const handleToggleMenu = useCallback(() => setIsMenuOpen((v) => !v), []);
  const handleCloseMenu = useCallback(() => setIsMenuOpen(false), []);

  const handleSelectTab = useCallback(
    (tab: AdminTab) => {
      setActiveTab(tab);
      setIsMenuOpen(false);
    },
    [],
  );

  const handleSignOut = useCallback(async () => {
    handleCloseMenu();
    await onSignOut();
  }, [handleCloseMenu, onSignOut]);

  useEffect(() => {
    if (!isMenuOpen) return;
    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isMenuOpen]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-secondary-claro/20 via-gray-50 to-gray-50">
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-secondary-claro/40 shadow-sm">
        <div className="mx-auto flex max-w-[92rem] items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Abrir menú de administración"
              aria-controls={drawerId}
              aria-expanded={isMenuOpen}
              onClick={handleToggleMenu}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div>
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-secondary-bosquesNublados">Panel de administración</h1>
              <p className="hidden sm:block text-xs text-gray-500">Gestión de contenido Terrasacha</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => void handleSignOut()}
              className="hidden sm:inline-flex rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            >
              Cerrar sesión
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-gray-500">Sesión</p>
              <p className="text-sm text-gray-900 truncate max-w-[240px]">{userEmail}</p>
            </div>
            <div
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary-pradera text-white ring-2 ring-white/60"
              aria-label={`Avatar de ${userEmail}`}
              title={userEmail}
              role="img"
            >
              <span className="text-sm font-bold">{avatarInitials}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-8">
        <div className="mx-auto w-full max-w-[92rem]">
          {activeTab === 'noticias' ? (
            <AdminDashboard activeTab={activeTab}>
              <AdminNewsManager />
            </AdminDashboard>
          ) : activeTab === 'comunicados' ? (
            <AdminDashboard activeTab={activeTab}>
              <AdminAnnouncementsManager />
            </AdminDashboard>
          ) : activeTab === 'investigacion' ? (
            <AdminDashboard activeTab={activeTab}>
              <AdminResearchManager />
            </AdminDashboard>
          ) : activeTab === 'podcast' ? (
            <AdminDashboard activeTab={activeTab}>
              <AdminPodcastManager />
            </AdminDashboard>
          ) : (
            <AdminDashboard activeTab={activeTab}>
              <AdminComingSoon text={tabs.find((t) => t.key === activeTab)?.upcomingText ?? 'Contenido próximamente.'} />
            </AdminDashboard>
          )}
        </div>
      </main>

      {isMenuOpen && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
            onClick={handleCloseMenu}
          />

          <aside
            id={drawerId}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de administración"
            className="relative h-full w-full max-w-[320px] bg-gradient-to-b from-white to-secondary-claro/10 shadow-xl"
          >
            <div className="flex items-start justify-between gap-3 border-b border-gray-100 p-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">Admin</p>
                <p className="mt-1 text-sm font-medium text-gray-900 truncate">{userEmail}</p>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={handleCloseMenu}
                aria-label="Cerrar menú"
                className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
              >
                <span aria-hidden="true" className="text-xl leading-none">
                  ×
                </span>
              </button>
            </div>

            <nav className="flex h-full flex-col gap-2 p-4" aria-label="Secciones de administración">
              <div className="space-y-1">
                {tabs.map((tab) => {
                  const isActive = tab.key === activeTab;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      onClick={() => handleSelectTab(tab.key)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                      } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60`}
                    >
                      <span>{tab.label}</span>
                      {tab.isComingSoon && (
                        <span className="text-[10px] uppercase tracking-wide text-primary/70">Próximamente</span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => void handleSignOut()}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                >
                  Cerrar sesión
                </button>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
};

export default AdminShellLayout;

