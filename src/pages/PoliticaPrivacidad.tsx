import { Link } from 'react-router-dom';
import {
  TERMS_PUBLICATION_DATE,
  UCC_HABEAS_DATA_EMAIL,
  UCC_HABEAS_DATA_FORM_URL,
  UCC_PRIVACY_POLICY_URL,
} from '../data/legalLinks';

const PoliticaPrivacidad = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f7f4ea] via-white to-secondary-claro/10 font-primary text-[#44482c]">
      <section className="relative overflow-hidden border-b border-[#44482c]/10 bg-[#e8d79a]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.45),transparent_55%)]" />
        <div className="relative mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#44482c]/70">Documento legal</p>
          <h1 className="mt-3 font-slogan text-3xl uppercase tracking-slogan text-[#44482c] sm:text-4xl md:text-5xl">
            Política de Privacidad
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#44482c]/85 sm:text-lg">
            Tratamiento y protección de datos personales en TerraSacha
          </p>
          <p className="mt-4 text-sm text-[#44482c]/70">
            Actualizado: {TERMS_PUBLICATION_DATE}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <article className="space-y-6 text-[0.95rem] leading-relaxed text-[#44482c]/90 sm:text-base">
          <p>
            TerraSacha, en cumplimiento de la Ley 1581 de 2012 y el Decreto reglamentario 1377 de 2013,
            se adhiere al Acuerdo Superior Universitario 171 del 20 de marzo de 2014 de la Universidad
            Cooperativa de Colombia (UCC), mediante el cual se establecen las políticas de tratamiento y
            protección de datos personales en la Institución.
          </p>
          <p>
            Con ello se garantiza que los datos personales recolectados tengan un tratamiento confiable y
            sean custodiados en el sistema de información de manera segura. La información registrada en
            las bases de datos solo será utilizada para fines institucionales.
          </p>

          <div className="rounded-2xl border border-[#44482c]/10 bg-white/80 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#44482c]">Documento oficial</h2>
            <p className="mt-2 text-sm text-[#44482c]/80">
              Consulta el texto completo del Acuerdo Superior Universitario 171 de 2014:
            </p>
            <a
              href={UCC_PRIVACY_POLICY_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex font-medium text-primary underline-offset-2 hover:underline"
            >
              Abrir Acuerdo 171 de 2014 (PDF)
            </a>
          </div>

          <div className="rounded-2xl border border-[#44482c]/10 bg-white/80 p-5 shadow-sm">
            <h2 className="text-lg font-bold text-[#44482c]">Reclamaciones (Habeas Data)</h2>
            <p className="mt-2 text-sm text-[#44482c]/80">
              Puedes presentar reclamaciones relacionadas con el tratamiento de tus datos diligenciando el
              formulario de la UCC y enviándolo a{' '}
              <a
                href={`mailto:${UCC_HABEAS_DATA_EMAIL}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {UCC_HABEAS_DATA_EMAIL}
              </a>
              .
            </p>
            <a
              href={UCC_HABEAS_DATA_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex font-medium text-primary underline-offset-2 hover:underline"
            >
              Ir al formulario de tratamiento de datos personales UCC
            </a>
          </div>

          <p>
            Para más detalle sobre el uso de la Plataforma y el Marketplace, consulta también los{' '}
            <Link
              to="/terminos-y-condiciones"
              className="font-semibold text-[#44482c] underline-offset-2 hover:underline"
            >
              Términos y Condiciones
            </Link>
            .
          </p>
        </article>
      </div>
    </main>
  );
};

export default PoliticaPrivacidad;
