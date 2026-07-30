import { useEffect } from 'react';

type ToolCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  accent: 'tierra' | 'pradera';
  icon: 'docs' | 'drone';
};

const TOOLS: ToolCard[] = [
  {
    id: 'legaldocs',
    title: 'Legal Docs',
    description: 'Gestión y consulta de documentos legales del ecosistema TerraSacha.',
    href: 'https://main.d3m4qbfpv9wbbj.amplifyapp.com/admin',
    accent: 'tierra',
    icon: 'docs',
  },
  {
    id: 'datadronemanager',
    title: 'Data Drone Manager',
    description: 'Herramienta para gestión y análisis de datos e imágenes con dron.',
    href: 'https://master.d2yaf6u7gkp21.amplifyapp.com/login/',
    accent: 'pradera',
    icon: 'drone',
  },
];

type HerramientasModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const DocsIcon = () => (
  <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const DroneIcon = () => (
  <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.6}
      d="M4.5 8.5l3-3h2l1.5 1.5H13L14.5 5.5h2l3 3M7.5 5.5V4m9 1.5V4M12 11v2m-4 5h8m-8 0a2 2 0 01-2-2v-2.5a2 2 0 012-2h8a2 2 0 012 2V16a2 2 0 01-2 2m-8 0v2m8-2v2"
    />
    <circle cx="12" cy="15" r="1.25" strokeWidth={1.6} />
  </svg>
);

const HerramientasModal = ({ isOpen, onClose }: HerramientasModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOpenTool = (href: string) => {
    window.open(href, '_blank', 'noopener,noreferrer');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="herramientas-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-[#44482c]/55 backdrop-blur-[2px]"
        aria-label="Cerrar modal de herramientas"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-[#44482c]/10 bg-gradient-to-b from-[#f7f4ea] via-white to-[#b1c181]/20 shadow-2xl">
        <div className="relative border-b border-[#44482c]/10 bg-[#e8d79a] px-6 py-6 sm:px-8">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_55%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]/70">
                Ecosistema TerraSacha
              </p>
              <h2
                id="herramientas-modal-title"
                className="mt-2 font-slogan text-2xl uppercase tracking-slogan text-[#44482c] sm:text-3xl"
              >
                Herramientas
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-[#44482c]/80">
                Accede a las aplicaciones internas para documentos legales y gestión de datos con dron.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70 text-[#44482c] transition-colors hover:bg-white"
              aria-label="Cerrar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2 sm:gap-5 sm:p-8">
          {TOOLS.map((tool) => {
            const isTierra = tool.accent === 'tierra';
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => handleOpenTool(tool.href)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleOpenTool(tool.href);
                  }
                }}
                tabIndex={0}
                aria-label={`Abrir ${tool.title}`}
                className="group flex min-h-[220px] flex-col items-start rounded-2xl border border-[#44482c]/10 bg-white p-6 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <span
                  className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${
                    isTierra
                      ? 'bg-[#e8d79a]/70 text-[#44482c]'
                      : 'bg-[#849b50]/20 text-primary'
                  } transition-transform duration-200 group-hover:scale-105`}
                >
                  {tool.icon === 'docs' ? <DocsIcon /> : <DroneIcon />}
                </span>

                <h3 className="mt-5 text-xl font-bold text-[#44482c]">{tool.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#44482c]/75">{tool.description}</p>

                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  Abrir herramienta
                  <svg
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HerramientasModal;
