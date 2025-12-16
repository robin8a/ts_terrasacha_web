import { Link } from 'react-router-dom';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  image?: string;
  color: string;
}

const blogPosts: BlogPost[] = [
  { 
    id: 1, 
    title: 'Descarbonización y Sostenibilidad', 
    excerpt: 'Exploramos las estrategias para reducir emisiones de carbono y promover prácticas sostenibles en la región.',
    image: '/assets/images/ChatGPT Image 15 dic 2025, 09_00_33 p.m..png',
    color: 'secondary-pradera' 
  },
  { 
    id: 2, 
    title: 'Tokenización de Activos Ambientales', 
    excerpt: 'Conoce cómo la tecnología blockchain puede transformar la comercialización de activos ambientales.',
    image: '/assets/images/ChatGPT Image 15 dic 2025, 09_02_55 p.m..png',
    color: 'primary' 
  },
  { 
    id: 3, 
    title: 'Reforestación con Biotecnología', 
    excerpt: 'Tecnologías emergentes aplicadas a la reforestación para maximizar el impacto ambiental positivo.',
    image: '/assets/images/ChatGPT Image 15 dic 2025, 09_05_26 p.m..png',
    color: 'secondary-claro' 
  },
];

const BlogSection = () => {
  return (
    <section className="py-16 sm:py-20 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-secondary-[bosques-nublados] mb-12 sm:mb-16 uppercase tracking-wider text-center font-primary">
          BLOG RECIENTE
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow border border-gray-100 overflow-hidden flex flex-col"
            >
              {post.image && (
                <div className="h-48 overflow-hidden">
                  <img
                    alt={post.title}
                    className="w-full h-full object-cover"
                    src={post.image}
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="font-bold text-lg mb-3 text-gray-800 leading-tight font-primary">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 flex-grow font-primary">
                  {post.excerpt}
                </p>
                <Link
                  to="/noticias"
                  className="text-primary font-semibold text-sm hover:underline mt-auto font-primary"
                >
                  Leer más &gt;
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;

