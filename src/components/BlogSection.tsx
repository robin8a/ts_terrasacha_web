import { useState } from 'react';
import { Link } from 'react-router-dom';

const blogPosts = [
  { id: 1, title: '08', gradient: 'from-green-400 to-green-600' },
  { id: 2, title: '07', gradient: 'from-blue-400 to-blue-600' },
  { id: 3, title: '06', gradient: 'from-purple-400 to-purple-600' },
  { id: 4, title: '05', gradient: 'from-yellow-400 to-yellow-600' },
  { id: 5, title: '04', gradient: 'from-red-400 to-red-600' },
];

export default function BlogSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % blogPosts.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + blogPosts.length) % blogPosts.length);
  };

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl md:text-5xl text-center mb-4">Blog</h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
          Encuentra en nuestros contenidos información sobre descarbonización, sostenibilidad,
          tokenización de activos y mecanismos de inversión con enfoque de protección ambiental.
        </p>

        {/* Blog Carousel */}
        <div className="relative max-w-5xl mx-auto">
          <div className="overflow-hidden rounded-lg">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {blogPosts.map((post) => (
                <div key={post.id} className="min-w-full">
                  <div className={`relative h-96 bg-gradient-to-br ${post.gradient} rounded-lg overflow-hidden`}>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-3xl font-bold text-white">{post.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-colors"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {blogPosts.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
          <Link
            to="/agenda-de-sostenibilidad"
            className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-green-400 to-green-600" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">Agenda de Sostenibilidad</h3>
            </div>
          </Link>
          <Link
            to="/podcast"
            className="block bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="h-48 bg-gradient-to-br from-blue-400 to-blue-600" />
            <div className="p-6">
              <h3 className="text-xl font-semibold">Podcast</h3>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

