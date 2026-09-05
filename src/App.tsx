import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import AdminErrorBoundary from './components/AdminErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Noticias from './pages/Noticias';
import NoticiaDetalle from './pages/NoticiaDetalle';
import Agenda from './pages/Agenda';
import Contacto from './pages/Contacto';
import AgendaSostenibilidad from './pages/AgendaSostenibilidad';
import Podcast from './pages/Podcast';
import PodcastDetail from './pages/PodcastDetail';
import Comunicados from './pages/Comunicados';
import ComunicadoDetalle from './pages/ComunicadoDetalle';
import Investigacion from './pages/Investigacion';
import ResearchDetail from './pages/ResearchDetail';
import Oraculo from './pages/Oraculo';
import AppPage from './pages/AppPage';
import Metodologia from './pages/Metodologia';
import RutaFormacion from './pages/RutaFormacion';
import CapsulasInformativas from './pages/CapsulasInformativas';
import CapsulaDetalle from './pages/CapsulaDetalle';
import VideoclipsEducativos from './pages/VideoclipsEducativos';
import VideoclipDetalle from './pages/VideoclipDetalle';
import TerminosYCondiciones from './pages/TerminosYCondiciones';
import PoliticaPrivacidad from './pages/PoliticaPrivacidad';
import PreguntasFrecuentes from './pages/PreguntasFrecuentes';
import Glosario from './pages/Glosario';

const AdminPage = lazy(() => import('./pages/AdminPage'));

const AppRoutes = () => {
  const location = useLocation();
  const firstPathSegment = location.pathname.split('/').filter(Boolean)[0]?.toLowerCase() ?? '';
  const isAdminRoute = firstPathSegment === 'admin';

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/noticias" element={<Noticias />} />
        <Route path="/noticias/:id" element={<NoticiaDetalle />} />
        <Route path="/agenda" element={<Agenda />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/preguntas-frecuentes" element={<PreguntasFrecuentes />} />
        <Route path="/glosario" element={<Glosario />} />
        <Route path="/agenda-de-sostenibilidad" element={<AgendaSostenibilidad />} />
        <Route path="/podcast" element={<Podcast />} />
        <Route path="/podcast/:slug" element={<PodcastDetail />} />
        <Route path="/comunicados" element={<Comunicados />} />
        <Route path="/comunicados/:id" element={<ComunicadoDetalle />} />
        <Route path="/capsulas-informativas" element={<CapsulasInformativas />} />
        <Route path="/capsulas-informativas/:id" element={<CapsulaDetalle />} />
        <Route path="/videoclips-educativos" element={<VideoclipsEducativos />} />
        <Route path="/videoclips-educativos/:slug" element={<VideoclipDetalle />} />
        <Route path="/investigacion" element={<Investigacion />} />
        <Route path="/investigacion/:slug" element={<ResearchDetail />} />
        <Route path="/oraculo" element={<Oraculo />} />
        <Route path="/app" element={<AppPage />} />
        <Route path="/metodologia" element={<Metodologia />} />
        <Route path="/ruta-de-formacion" element={<RutaFormacion />} />
        <Route path="/terminos-y-condiciones" element={<TerminosYCondiciones />} />
        <Route path="/politica-de-privacidad" element={<PoliticaPrivacidad />} />
        <Route
          path="/admin"
          element={
            <AdminErrorBoundary>
              <Suspense
                fallback={
                  <div className="flex min-h-[50vh] items-center justify-center text-gray-600">
                    Cargando...
                  </div>
                }
              >
                <AdminPage />
              </Suspense>
            </AdminErrorBoundary>
          }
        />
      </Routes>
      {!isAdminRoute && <Footer />}
      {/* {!isAdminRoute && <ContactButton />} */}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

