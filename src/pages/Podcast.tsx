export default function Podcast() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12">Podcast</h1>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <p className="text-lg text-gray-700 mb-6">
              Escucha nuestros podcasts sobre descarbonización, sostenibilidad, tokenización de
              activos y mecanismos de inversión con enfoque de protección ambiental.
            </p>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-xl font-semibold mb-2">Episodio 1</h3>
                <p className="text-gray-600">Título del episodio...</p>
              </div>
              <div className="border-l-4 border-primary pl-4">
                <h3 className="text-xl font-semibold mb-2">Episodio 2</h3>
                <p className="text-gray-600">Título del episodio...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

