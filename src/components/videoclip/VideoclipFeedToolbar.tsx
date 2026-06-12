export type VideoclipFeedFilter = 'all' | 'highlighted' | string;

type VideoclipFeedToolbarProps = {
  searchTerm: string;
  activeFilter: VideoclipFeedFilter;
  categoryOptions: string[];
  onSearchChange: (value: string) => void;
  onFilterChange: (filter: VideoclipFeedFilter) => void;
};

const VideoclipFeedToolbar = ({
  searchTerm,
  activeFilter,
  categoryOptions,
  onSearchChange,
  onFilterChange,
}: VideoclipFeedToolbarProps) => {
  const isCategoryActive = (category: string) => activeFilter === category;

  return (
    <div className="flex flex-col gap-4">
      <div className="relative">
        <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.34-4.34" />
            <circle cx="11" cy="11" r="8" strokeWidth={2} />
          </svg>
        </div>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Buscar videoclips educativos..."
          className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm text-secondary-[bosques-nublados] shadow-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
          aria-label="Buscar videoclips educativos"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filtrar videoclips">
        <button
          type="button"
          onClick={() => onFilterChange('all')}
          aria-pressed={activeFilter === 'all'}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === 'all'
              ? 'bg-secondary-[bosques-nublados] text-secondary-[amarillo-tierra]'
              : 'border border-gray-200 bg-white text-gray-500 hover:border-primary/30'
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => onFilterChange('highlighted')}
          aria-pressed={activeFilter === 'highlighted'}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeFilter === 'highlighted'
              ? 'bg-secondary-[bosques-nublados] text-secondary-[amarillo-tierra]'
              : 'border border-gray-200 bg-white text-gray-500 hover:border-primary/30'
          }`}
        >
          Destacados
        </button>
        {categoryOptions.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onFilterChange(category)}
            aria-pressed={isCategoryActive(category)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              isCategoryActive(category)
                ? 'bg-secondary-[bosques-nublados] text-secondary-[amarillo-tierra]'
                : 'border border-gray-200 bg-white text-gray-500 hover:border-primary/30'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoclipFeedToolbar;
