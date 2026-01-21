
import React, { useState, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORIES } from '../constants';
import { useApp } from '../App';
import { Movie } from '../types';

const AdminUpload: React.FC = () => {
  const navigate = useNavigate();
  const { addMovie } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0],
    description: '',
    languages: ['English'],
  });

  const availableLanguages = [
    'English', 'Telugu', 'Hindi', 'Spanish', 'French', 
    'Japanese', 'Korean', 'Tamil', 'Kannada', 'Malayalam', 'All Languages'
  ];

  const handleLangToggle = (lang: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(lang) 
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const captureThumbnail = (file: File) => {
    setIsExtracting(true);
    setGeneratedThumbnail('');
    
    const video = document.createElement('video');
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.playsInline = true;
    
    video.onloadeddata = () => {
      // Seek to a frame (1.5s) to avoid black screens
      video.currentTime = Math.min(1.5, video.duration / 2);
    };

    video.onseeked = () => {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setGeneratedThumbnail(dataUrl);
      }
      setIsExtracting(false);
      URL.revokeObjectURL(url);
    };
    
    video.onerror = () => {
      console.warn("Could not preview this format (.mkv/codec) directly in browser for thumbnail extraction.");
      setIsExtracting(false);
      // We do NOT set a random placeholder here anymore. 
      // Instead, we show a clean "No Preview" state in the UI.
      URL.revokeObjectURL(url);
    };
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      captureThumbnail(file);
    }
  };

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !selectedFile) {
      alert('Please enter a title and select a video file.');
      return;
    }

    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 10;
      if (progress >= 100) {
        setUploadProgress(100);
        clearInterval(interval);
        
        // In this demo, we use Blob URL. In production, this would be the server path.
        const newMovie: Movie = {
          id: Date.now().toString(),
          title: formData.title,
          category: formData.category,
          description: formData.description,
          // If no thumbnail extracted, we use a clean CSS-based placeholder logic in components or a generic icon
          thumbnail: generatedThumbnail || 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=800',
          videoUrl: URL.createObjectURL(selectedFile),
          duration: '2h 00m',
          rating: 7.0,
          releaseYear: new Date().getFullYear(),
          languages: formData.languages,
        };

        setTimeout(() => {
          addMovie(newMovie);
          alert(`Successfully uploaded ${selectedFile.name}.`);
          navigate('/admin');
        }, 500);
      } else {
        setUploadProgress(progress);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen pt-24 px-8 max-w-4xl mx-auto pb-20">
      <button 
        onClick={() => navigate('/admin')}
        className="text-gray-400 hover:text-white mb-6 flex items-center gap-2 group"
      >
        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Dashboard
      </button>

      <h1 className="text-4xl font-black mb-8 tracking-tighter">UPLOAD CONTENT</h1>

      <form onSubmit={handleUpload} className="space-y-8 bg-[#141414] p-8 rounded-2xl border border-white/5 shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Movie Title</label>
              <input 
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:ring-2 focus:ring-red-600 outline-none"
                placeholder="The Grand Heist"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full bg-[#181818] border border-white/10 rounded-lg p-4 focus:ring-2 focus:ring-red-600 outline-none appearance-none"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="p-4 bg-black rounded-lg border border-white/10">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Poster Preview</label>
              {isExtracting ? (
                <div className="w-full aspect-video bg-white/5 flex flex-col items-center justify-center gap-2 animate-pulse rounded">
                   <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                   <span className="text-[10px] text-gray-500 font-bold uppercase">Extracting Frame...</span>
                </div>
              ) : generatedThumbnail ? (
                <img src={generatedThumbnail} alt="Preview" className="w-full aspect-video object-cover rounded shadow-lg" />
              ) : (
                <div className="w-full aspect-video bg-white/5 flex items-center justify-center text-[10px] text-gray-500 font-bold uppercase rounded border border-white/5 border-dashed">
                  Poster will generate from video
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/10 rounded-lg p-4 focus:ring-2 focus:ring-red-600 outline-none h-44 resize-none"
                placeholder="Add a compelling synopsis..."
                required
              ></textarea>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Audio Languages</label>
              <div className="flex flex-wrap gap-2">
                {availableLanguages.map(lang => (
                  <button 
                    key={lang}
                    type="button"
                    onClick={() => handleLangToggle(lang)}
                    className={`px-3 py-1.5 rounded-full text-[10px] font-black tracking-widest transition-all ${formData.languages.includes(lang) ? 'bg-red-600 text-white border-red-600 shadow-lg shadow-red-600/20' : 'bg-white/5 text-gray-500 border-white/10 hover:border-white/20'} border uppercase`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-2 border-dashed border-white/10 rounded-2xl p-12 text-center hover:border-red-600/50 transition-all cursor-pointer group relative bg-black/40">
          <input 
            type="file" 
            id="file" 
            className="hidden" 
            accept=".mp4,.mkv,.avi" 
            onChange={handleFileChange}
            ref={fileInputRef}
          />
          <label htmlFor="file" className="cursor-pointer block">
            <div className="flex flex-col items-center">
              <svg className={`h-16 w-16 mb-4 transition-all ${selectedFile ? 'text-red-600 scale-110' : 'text-gray-600 group-hover:text-red-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="font-black text-xl mb-1 tracking-tight">
                {selectedFile ? selectedFile.name : 'Choose Video File'}
              </p>
              <p className="text-gray-500 text-sm font-medium">MP4, MKV, AVI (Up to 6GB)</p>
              {selectedFile?.name.endsWith('.mkv') && (
                <p className="mt-4 text-xs text-yellow-500/80 bg-yellow-500/5 px-4 py-2 rounded-full border border-yellow-500/20">
                  Note: .MKV playback depends on the browser codec.
                </p>
              )}
            </div>
          </label>
        </div>

        <button 
          disabled={isUploading}
          className="w-full py-5 bg-red-600 text-white font-black text-2xl rounded-xl hover:bg-red-700 transition-all shadow-2xl shadow-red-600/40 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
        >
          {isUploading ? (
            <div className="flex items-center justify-center gap-4">
               <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
               <span>PUBLISHING {Math.round(uploadProgress)}%</span>
            </div>
          ) : 'PUBLISH MOVIE'}
        </button>
      </form>
    </div>
  );
};

export default AdminUpload;
