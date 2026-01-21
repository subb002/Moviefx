
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  return (
    <div 
      className="relative flex-none w-44 sm:w-56 md:w-64 lg:w-72 aspect-video overflow-visible z-10 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`absolute inset-0 z-20 transition-all duration-500 ease-out ${isHovered ? 'scale-110 shadow-2xl' : 'scale-100'}`}>
        <img 
          src={movie.thumbnail} 
          alt={movie.title}
          className="h-full w-full rounded-md object-cover brightness-90 transition-all"
        />
        
        {isHovered && (
          <div className="absolute inset-x-0 -bottom-24 bg-[#181818] p-4 rounded-b-md shadow-2xl animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => navigate(`/watch/${movie.id}`)}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
                >
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </button>
                <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-transparent text-white hover:border-white transition-colors">
                  <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
                </button>
              </div>
              <button className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 bg-transparent text-white hover:border-white">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
              </button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="text-green-500 font-bold text-xs">98% Match</span>
              <span className="border border-gray-500 px-1 text-[10px]">{movie.rating}</span>
              <span className="text-[10px] text-gray-400">{movie.duration}</span>
            </div>
            
            <div className="flex gap-2 text-[10px] font-bold">
               {movie.languages.slice(0, 2).map(l => (
                 <span key={l} className="bg-white/10 px-2 py-0.5 rounded uppercase">{l}</span>
               ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieCard;
