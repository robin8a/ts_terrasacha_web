# TerraSacha Web

A responsive React web application cloning the TerraSacha website, built with Vite, TypeScript, Tailwind CSS, and React Router.

## Features

- Responsive design (mobile and desktop)
- Multi-page navigation with React Router
- Video background hero section
- Statistics counter animations
- Blog carousel/slider
- Social media integration
- Spanish language content

## Tech Stack

- React 19.2.0
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Project Structure

```
ts_terrasacha_web/
├── public/
│   └── assets/
│       ├── images/
│       ├── videos/
│       └── icons/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── StatsSection.tsx
│   │   ├── ObjectivesSection.tsx
│   │   ├── BlogSection.tsx
│   │   └── SocialLinks.tsx
│   ├── pages/
│   │   ├── Home.tsx
│   │   ├── Nosotros.tsx
│   │   ├── Noticias.tsx
│   │   ├── Agenda.tsx
│   │   ├── Contacto.tsx
│   │   ├── AgendaSostenibilidad.tsx
│   │   └── Podcast.tsx
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
```

## Pages

- **Home** (`/`) - Main landing page with hero, about, stats, objectives, and blog sections
- **Nosotros** (`/nosotros`) - About page
- **Noticias** (`/noticias`) - News listing page
- **Agenda** (`/agenda`) - Events calendar page
- **Contacto** (`/contacto`) - Contact information page
- **Agenda de Sostenibilidad** (`/agenda-de-sostenibilidad`) - Sustainability agenda
- **Podcast** (`/podcast`) - Podcast page

## License

Private project

