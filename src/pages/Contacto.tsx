export default function Contacto() {
  return (
    <main className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-12">Contacto</h1>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold mb-6">Información de Contacto</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">Email</h3>
                <a
                  href="mailto:hola@terrasacha.com"
                  className="text-primary hover:underline"
                >
                  hola@terrasacha.com
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Telegram</h3>
                <a
                  href="https://t.me/TerrasachaBot"
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline"
                >
                  Terrasacha en Telegram
                </a>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Redes Sociales</h3>
                <div className="flex gap-4">
                  <a
                    href="https://www.instagram.com/holaterrasacha"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://web.facebook.com/holaterrasacha"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://www.tiktok.com/@holaterrasacha"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    TikTok
                  </a>
                  <a
                    href="https://www.youtube.com/@TERRASACHA1"
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    YouTube
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

