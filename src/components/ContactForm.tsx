import { type FormEvent, useCallback, useState } from 'react';
import { CONTACT_FORM_EMAIL } from '../lib/contactConfig';

type ContactFormFields = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const buildEmptyForm = (): ContactFormFields => ({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

const ContactForm = () => {
  const [form, setForm] = useState<ContactFormFields>(buildEmptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = useCallback((key: keyof ContactFormFields, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrorMessage(null);
  }, []);

  const handleSubmit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const name = form.name.trim();
    const email = form.email.trim();
    const subject = form.subject.trim();
    const message = form.message.trim();

    if (!name) {
      setErrorMessage('Escribe tu nombre.');
      return;
    }

    if (!email || !isValidEmail(email)) {
      setErrorMessage('Ingresa un correo electrónico válido.');
      return;
    }

    if (!message) {
      setErrorMessage('Cuéntanos tu inquietud o mensaje.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_FORM_EMAIL)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          subject: subject || 'Consulta desde el sitio web Terrasacha',
          message,
          _subject: subject
            ? `Terrasacha — ${subject}`
            : `Terrasacha — Consulta de ${name}`,
          _template: 'table',
        }),
      });

      if (!response.ok) {
        throw new Error('No se pudo enviar el mensaje.');
      }

      const payload = (await response.json()) as { success?: string | boolean };
      if (String(payload.success).toLowerCase() !== 'true') {
        throw new Error('Respuesta inesperada del servicio de correo.');
      }

      setIsSuccess(true);
      setForm(buildEmptyForm());
    } catch {
      const mailtoSubject = encodeURIComponent(subject || 'Consulta desde Terrasacha');
      const mailtoBody = encodeURIComponent(
        `Nombre: ${name}\nCorreo: ${email}\n\n${message}`,
      );
      window.location.href = `mailto:${CONTACT_FORM_EMAIL}?subject=${mailtoSubject}&body=${mailtoBody}`;
      setErrorMessage(
        'No pudimos enviar el formulario automáticamente. Se abrió tu cliente de correo para que completes el envío.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [form]);

  if (isSuccess) {
    return (
      <div className="rounded-xl border-2 border-primary bg-white p-6 sm:rounded-2xl sm:p-8 md:p-10 shadow-sm">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-bold uppercase tracking-wide text-secondary-[bosques-nublados] sm:text-xl">
            Mensaje enviado
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
            Gracias por escribirnos. Revisaremos tu inquietud y te responderemos al correo que indicaste.
          </p>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="mt-6 inline-flex items-center justify-center rounded-full border border-primary px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
          >
            Enviar otro mensaje
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-primary bg-secondary-claro/5 p-5 shadow-sm sm:rounded-2xl sm:p-6 md:p-8 lg:p-10">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-lg font-bold uppercase tracking-wide text-secondary-[bosques-nublados] sm:text-xl md:text-2xl">
          Escríbenos
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-gray-600 sm:text-sm md:text-base">
          Completa el formulario con tu inquietud. Te responderemos a la dirección de correo que indiques.
        </p>
      </div>

      <form onSubmit={(event) => void handleSubmit(event)} className="space-y-4 sm:space-y-5" noValidate>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
          <div>
            <label htmlFor="contactName" className="mb-1.5 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              id="contactName"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={(event) => handleChange('name', event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Tu nombre"
            />
          </div>

          <div>
            <label htmlFor="contactEmail" className="mb-1.5 block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              id="contactEmail"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => handleChange('email', event.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="tu@correo.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="contactSubject" className="mb-1.5 block text-sm font-medium text-gray-700">
            Asunto <span className="font-normal text-gray-500">(opcional)</span>
          </label>
          <input
            id="contactSubject"
            name="subject"
            type="text"
            value={form.subject}
            onChange={(event) => handleChange('subject', event.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Ej. Alianzas, investigación, prensa..."
          />
        </div>

        <div>
          <label htmlFor="contactMessage" className="mb-1.5 block text-sm font-medium text-gray-700">
            Tu inquietud
          </label>
          <textarea
            id="contactMessage"
            name="message"
            required
            rows={6}
            value={form.message}
            onChange={(event) => handleChange('message', event.target.value)}
            className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            placeholder="Escribe aquí tu mensaje o pregunta..."
          />
        </div>

        {errorMessage ? (
          <p className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
        >
          {isSubmitting ? (
            'Enviando...'
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Enviar mensaje
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
