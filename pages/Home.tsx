
import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { CATEGORIES } from '../constants';
// Updated to use useApp instead of useMovies
import { useApp } from '../App';

const Home: React.FC = () => {
  const navigate = useNavigate();
  // Updated to use useApp instead of useMovies
  const { movies } = useApp();
  
  // Find featured movie, fallback to first available if none marked featured
  const featured = movies.find(m => m.isFeatured) || movies[0];

  if (!featured && movies.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">No content available. Please upload movies as admin.</p>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <div className="relative h-[85vh] w-full overflow-hidden">
        {featured && (
          <>
            <img 
              src={featured.thumbnail} 
              className="h-full w-full object-cover brightness-50"
              alt="Featured"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
            
            <div className="absolute bottom-1/4 left-4 max-w-2xl space-y-4 md:left-12 lg:left-16">
              <h1 className="text-4xl font-extrabold uppercase tracking-tighter md:text-6xl lg:text-8xl">
                {featured.title}
              </h1>
              <p className="text-sm font-medium text-gray-300 md:text-lg">
                {featured.description}
              </p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => navigate(`/watch/${featured.id}`)}
                  className="flex items-center gap-2 rounded-md bg-white px-6 py-2.5 text-lg font-bold text-black hover:bg-gray-200 transition-all active:scale-95"
                >
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  Play
                </button>
                <button className="flex items-center gap-2 rounded-md bg-gray-500/40 px-6 py-2.5 text-lg font-bold text-white backdrop-blur-md hover:bg-gray-500/60 transition-all active:scale-95">
                  <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
                  More Info
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Rows */}
      <div className="mt-[-150px] space-y-12 relative z-30 pl-4 md:pl-12">
        {CATEGORIES.map(category => {
          const categoryMovies = movies.filter(m => m.category === category || (category === 'Trending Now' && m.rating > 8));
          
          if (categoryMovies.length === 0 && category !== 'Trending Now') return null;

          return (
            <div key={category} className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-gray-200 hover:text-white cursor-pointer md:text-2xl transition-colors">
                {category}
              </h2>
              <div className="flex gap-4 overflow-x-auto pb-8 scrollbar-hide no-scrollbar scroll-smooth">
                {categoryMovies.map(movie => (
                  <MovieCard key={`${category}-${movie.id}`} movie={movie} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
