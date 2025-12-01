export default function Noticias() {
  const noticias = [
    {
      id: 1,
      title: 'Noticia 1',
      date: '2024-01-15',
      excerpt: 'Descripción de la noticia...',
    },
    {
      id: 2,
      title: 'Noticia 2',
      date: '2024-01-10',
      excerpt: 'Descripción de la noticia...',
    },
    {
      id: 3,
      title: 'Noticia 3',
      date: '2024-01-05',
      excerpt: 'Descripción de la noticia...',
    },
  ];

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12">Noticias</h1>
        <div className="max-w-4xl mx-auto space-y-8">
          {noticias.map((noticia) => (
            <article
              key={noticia.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{noticia.title}</h2>
              <p className="text-gray-500 mb-4">{noticia.date}</p>
              <p className="text-gray-700">{noticia.excerpt}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}

