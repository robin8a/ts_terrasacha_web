import ContactForm from '../components/ContactForm';

const Contacto = () => {
  return (
    <main className="font-primary bg-secondary-claro/5 min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-80 sm:h-96 md:h-[420px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBfQ0n8xHH295DYRfaoDi9YuisSdVJz3OcK25N9XZlrEenPdsNp0bIIJb5drdB4wY9oj_sZL5zqXh2K4gFNHokA8aGDetHJ5mH1srrUogHiqmgCgAehxuDehGRMlXYwM_AlTbD2oua9zgueMUIBLzHlWeNzbClnUrOZMJUMSxU3lS_I247_cIrZiHOT4dyyIj2z77l6nAbJNzpIwSYck1F7xZHwT5kYbqTXgpsWNmlUOLDOhtkC6l_LxGw4ZQHS-_Qcs1caMUU4fQ"
            alt="Bosque y naturaleza"
            className="absolute inset-0 w-full h-full object-cover opacity-80"
            loading="eager"
          />
          <div className="absolute inset-0 bg-black/55" />
        </div>
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-slogan text-white mb-3 sm:mb-4 drop-shadow-2xl tracking-slogan uppercase">
            CONTACTO
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-3xl mx-auto font-primary drop-shadow-lg px-2 tracking-wide">
            Estamos aquí para responder tus preguntas y escuchar tus ideas
          </p>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
};

export default Contacto;

