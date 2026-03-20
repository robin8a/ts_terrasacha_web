import type { ReactNode } from 'react';

export type AdminTab = 'noticias' | 'comunicados' | 'agenda' | 'podcast' | 'investigacion';

type AdminDashboardProps = {
  activeTab: AdminTab;
  children: ReactNode;
};

const AdminDashboard = ({ activeTab, children }: AdminDashboardProps) => {
  const title = (() => {
    switch (activeTab) {
      case 'comunicados':
        return 'Administración de Comunicados';
      case 'agenda':
        return 'Administración de Agenda';
      case 'podcast':
        return 'Administración de Podcast';
      case 'investigacion':
        return 'Administración de Investigación';
      default:
        return null;
    }
  })();

  return (
    <section aria-label="Contenido de administración">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        {title ? <h1 className="mb-6 text-xl font-semibold text-gray-900">{title}</h1> : null}
        {children}
      </div>
    </section>
  );
};

export default AdminDashboard;

