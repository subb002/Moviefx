
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Updated to use useApp instead of useMovies
import { useApp } from '../App';

const Watch: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Updated to use useApp instead of useMovies
  const { movies } = useApp();
  const movie = movies.find(m => m.id === id);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const [selectedLanguage, setSelectedLanguage] = useState(movie?.languages[0] || 'English');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (!movie) return;
    
    const savedTime = localStorage.getItem(`playback_${id}`);
    if (savedTime && videoRef.current) {
      videoRef.current.currentTime = parseFloat(savedTime);
    }

    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        localStorage.setItem(`playback_${id}`, videoRef.current.currentTime.toString());
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [id, movie]);

  if (!movie) return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Movie not found</h1>
      <button onClick={() => navigate('/')} className="px-4 py-2 bg-red-600 rounded">Go Home</button>
    </div>
  );

  const handleDownload = () => {
    setIsDownloading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        setDownloadProgress(100);
        clearInterval(interval);
        setTimeout(() => setIsDownloading(false), 2000);
      } else {
        setDownloadProgress(progress);
      }
    }, 500);
  };

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative group">
      <button 
        onClick={() => navigate(-1)}
        className="absolute left-8 top-8 z-50 rounded-full bg-black/50 p-3 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
      </button>

      <video 
        ref={videoRef}
        src={movie.videoUrl} 
        className="h-full w-full object-contain"
        controls
        autoPlay
      />

      <div className="absolute bottom-20 right-8 flex flex-col items-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex flex-col gap-2 rounded-lg bg-black/60 p-4 backdrop-blur-md">
           <h4 className="text-xs font-bold text-gray-400 uppercase">Audio Track</h4>
           <div className="flex gap-2">
              {movie.languages.map(lang => (
                <button 
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${selectedLanguage === lang ? 'bg-red-600 text-white' : 'bg-white/10 hover:bg-white/20'}`}
                >
                  {lang}
                </button>
              ))}
           </div>
        </div>

        <button 
          onClick={handleDownload}
          disabled={isDownloading}
          className="flex items-center gap-2 rounded-md bg-white/10 px-4 py-2 text-sm font-bold backdrop-blur-md hover:bg-white/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {isDownloading ? (
            <>
               <div className="w-24 h-2 bg-gray-600 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500" style={{ width: `${downloadProgress}%` }} />
               </div>
               <span>{Math.round(downloadProgress)}%</span>
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Internal Download
            </>
          )}
        </button>
      </div>

      <div className="absolute top-8 right-12 text-right opacity-0 group-hover:opacity-100 transition-opacity">
        <h2 className="text-2xl font-black">{movie.title}</h2>
        <p className="text-sm text-gray-400">Streaming in 4K • {selectedLanguage}</p>
      </div>
    </div>
  );
};

export default Watch;
