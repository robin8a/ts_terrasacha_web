export default function Agenda() {
  const eventos = [
    {
      id: 1,
      title: 'Evento 1',
      date: '2024-02-15',
      location: 'Meta, Colombia',
      description: 'Descripción del evento...',
    },
    {
      id: 2,
      title: 'Evento 2',
      date: '2024-03-20',
      location: 'Arauca, Colombia',
      description: 'Descripción del evento...',
    },
  ];

  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12">Agenda</h1>
        <div className="max-w-4xl mx-auto space-y-8">
          {eventos.map((evento) => (
            <div
              key={evento.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{evento.title}</h2>
              <p className="text-gray-500 mb-2">
                <span className="font-semibold">Fecha:</span> {evento.date}
              </p>
              <p className="text-gray-500 mb-4">
                <span className="font-semibold">Ubicación:</span> {evento.location}
              </p>
              <p className="text-gray-700">{evento.description}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

