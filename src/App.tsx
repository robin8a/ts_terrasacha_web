import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Nosotros from './pages/Nosotros';
import Noticias from './pages/Noticias';
import Agenda from './pages/Agenda';
import Contacto from './pages/Contacto';
import AgendaSostenibilidad from './pages/AgendaSostenibilidad';
import Podcast from './pages/Podcast';

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
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

