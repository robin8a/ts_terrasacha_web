import SocialLinks from './SocialLinks';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <SocialLinks className="text-white" />
            <h3 className="text-lg font-semibold">hola@terrasacha.com</h3>
            <a
              href="https://t.me/TerrasachaBot"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-white hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 7.936-1.268 7.936s-.169.338-.507.338c-.338 0-.507-.338-.507-.338l-2.366-2.366-1.268-1.268-1.268-1.268s-.169-.169 0-.338c.169-.169.338 0 .338 0l1.268 1.268 2.366 2.366s.169.169.338 0c.169-.169.338-.338.338-.338l.896-6.728.896-6.728s.169-.338.338-.338c.169 0 .338.169.338.338z" />
              </svg>
              Terrasacha en Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

