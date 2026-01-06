import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ContactButton from './components/ContactButton';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Noticias from './pages/Noticias';
import Agenda from './pages/Agenda';
import Contacto from './pages/Contacto';
import AgendaSostenibilidad from './pages/AgendaSostenibilidad';
import Podcast from './pages/Podcast';
import Comunicados from './pages/Comunicados';
import Investigacion from './pages/Investigacion';
import Oraculo from './pages/Oraculo';
import AppPage from './pages/AppPage';
import Metodologia from './pages/Metodologia';
import RutaFormacion from './pages/RutaFormacion';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/noticias" element={<Noticias />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/agenda-de-sostenibilidad" element={<AgendaSostenibilidad />} />
          <Route path="/podcast" element={<Podcast />} />
          <Route path="/comunicados" element={<Comunicados />} />
          <Route path="/investigacion" element={<Investigacion />} />
          <Route path="/oraculo" element={<Oraculo />} />
          <Route path="/app" element={<AppPage />} />
          <Route path="/metodologia" element={<Metodologia />} />
          <Route path="/ruta-de-formacion" element={<RutaFormacion />} />
        </Routes>
        <Footer />
        <ContactButton />
      </div>
    </Router>
  );
}

export default App;

