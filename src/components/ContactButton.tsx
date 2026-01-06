const ContactButton = () => {
  const handleContact = () => {
    window.location.href = 'mailto:terrasachasocial@gmail.com?subject=Contacto desde Terrasacha';
  };

  return (
    <button
      onClick={handleContact}
      className="fixed bottom-6 right-6 z-50 bg-primary text-white px-6 py-3 rounded-full shadow-lg hover:bg-primary-dark transition-all duration-300 font-primary font-semibold text-sm sm:text-base flex items-center gap-2 hover:scale-105"
      aria-label="Contáctanos"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
      Contáctanos
    </button>
  );
};

export default ContactButton;

